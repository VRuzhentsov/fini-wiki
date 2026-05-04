# Space Sync Implementation and E2E Results

Date: 2026-05-04

## Context

After locking the intended SpaceSync consent and lifecycle behavior in `raw/2026-05-04-space-sync-consent-and-lifecycle.md`, the implementation was updated in the Fini repo and validated with the full local headed E2E suite.

This raw source captures what changed, what failed during verification, what was fixed, and the evidence from the final successful run.

## Summary

Fini now treats incoming space sync as a one-space receiver-side approval flow instead of a batch mapping snapshot prompt. Startup/session sync ticks no longer replay full mapping snapshots that open consent modals. Mapping removal is now an end-of-sync lifecycle event that records `end_of_sync_at`; re-enable clears that value and forces bootstrap/merge again.

The local headed E2E suite initially exposed that only one app window was being reliably driven through the Add Device UI. The E2E helper was changed to route each actor directly to `#/settings/add-device`, which fixed the multi-window automation issue. Subsequent failures found stale frontend mapping state after end-of-sync; the device store now consults backend-active mappings before suppressing an incoming space request.

Final result: `make e2e-headed` passed all 7 actor tests.

## Decisions

- Incoming space sync requests remain global modals, but only for one not-yet-active space at a time.
- `space_sync_tick` must not send mapping snapshots for active mappings just because a websocket session appears.
- `space_sync_update_mappings` is the user-initiated lifecycle boundary:
  - newly added spaces send one-space requests to the peer;
  - removed spaces send `space_sync_end` and mark `end_of_sync_at`;
  - re-enabled spaces clear `end_of_sync_at` and reset `last_synced_at` to force bootstrap.
- Frontend prompt suppression must be based on backend-active mappings when frontend state may be stale.
- Full local headed E2E should be used for this workflow, not just CI/container listing or unit tests.

## Implementation Notes

- Added migration `src-tauri/migrations/00000000000015_pair_mapping_end_of_sync/`.
- Added `end_of_sync_at` to `pair_space_mappings` in `src-tauri/src/schema.rs` and `src-tauri/src/models/pair_space_mapping.rs`.
- Updated `src-tauri/src/services/space_sync/commands.rs` to:
  - filter active mappings by `end_of_sync_at IS NULL`;
  - mark removals ended instead of deleting mapping rows;
  - re-enable ended mappings by clearing `end_of_sync_at` and `last_synced_at`;
  - stop replaying full mapping snapshots during `space_sync_tick`;
  - process incoming end-of-sync events before normal sync tick work;
  - expose `end_of_sync_at_by_space` in sync status.
- Added `WsMessage::SpaceSyncEnd` in `src-tauri/src/services/space_sync/types.rs` and inbound handling in `ws_session.rs`.
- Updated `src-tauri/src/services/device_connection/mod.rs` and `types.rs` to queue incoming end-of-sync updates.
- Updated `src/stores/device.ts` to:
  - keep pending requests keyed by peer+space;
  - approve one pending space request at a time;
  - ignore already-active mappings;
  - refresh backend-active mappings before suppressing a request that frontend memory thinks is already active.
- Updated `src/components/DeviceView/IncomingSpaceResolutionDialog.vue` to show a one-space request and include `data-space-id`.
- Updated `specs/space-sync/README.md` to document one-space lifecycle requests, background quest sync, `end_of_sync_at`, and re-enable bootstrap/merge.
- Updated E2E helpers and tests:
  - `specs/e2e/actors/helpers/device-sync.ts` routes directly to Add Device to drive both headed app windows reliably;
  - `specs/e2e/actors/helpers/personal-sync.ts` adds `expectNoIncomingSpaceSyncDialog`;
  - `specs/e2e/actors/tests/personal-space-sync.spec.ts` covers no duplicate prompt and end/re-enable behavior;
  - `specs/e2e/actors/tests/zz-personal-space-live-quest-sync.spec.ts` asserts normal quest sync does not show a modal.

## Verification Evidence

Commands run and outcomes:

- `npm run build` passed.
- `npm run test:unit -- --runTestsByPath src/spec/stores/device.store.spec.ts` passed, 6 tests.
- `cargo test space_sync --manifest-path src-tauri/Cargo.toml -- --test-threads=1` passed, 21 targeted Rust tests.
- `make e2e-headed` passed all 7 local headed actor tests.

Successful headed E2E run:

```text
FINI_E2E_RUN_DIR=/var/tmp/fini-e2e-headed/20260504-005542-444416
Running 7 tests using 1 worker
7 passed (19.2s)
```

The passing actor tests were:

- `multi-actor-smoke.spec.ts` — runner controls two isolated actors with distinct identities.
- `personal-space-sync.spec.ts` — device can request Personal space sync and peer confirms it.
- `personal-space-sync.spec.ts` — already mapped Personal space does not prompt again on sync tick.
- `personal-space-sync.spec.ts` — ending and re-enabling Personal sync records end then bootstraps again.
- `settings-device-discovery.spec.ts` — two app instances pair through Settings and show each other device names.
- `zz-personal-space-live-quest-sync.spec.ts` — live Personal quest sync updates Focus on the peer without confirmation.
- `zz-personal-space-live-quest-sync.spec.ts` — second live Personal quest from peer appears in Focus backlog list.

## Debugging Notes

First `make e2e-headed` failed before space-sync logic because navigation to Add Device stalled. The visible symptom was that only one device appeared to use automation reliably. The failure occurred at `specs/e2e/actors/helpers/device-sync.ts` waiting for `[data-testid="nearby-devices"]` after clicking through Settings.

The fix was to drive actor windows by route assignment to `#/settings/add-device`, rather than relying on sequential click navigation across multiple Tauri windows.

The next E2E run exposed stale frontend mapping state after `end_of_sync_at`: the backend had ended Personal sync, but `mappedSpaceIdsByPeer` still included Personal, so the store suppressed the re-enable request. The fix was to refresh backend-active mappings before treating an incoming request as already mapped.

## Open Questions

- Future UI may need to expose ended mapping rows or ended timestamps more explicitly. Current work only returns `end_of_sync_at_by_space` in sync status and uses it for tests/lifecycle behavior.
- Future ingestion should reconcile this source with `pages/concepts/SpaceSync.md`, `pages/concepts/DeviceConnection.md`, and the E2E wiki pages for space-sync dialogs.
