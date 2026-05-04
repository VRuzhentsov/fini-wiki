# Space Sync Consent and Lifecycle

Date: 2026-05-04

## Context

The current Fini app shows an `Incoming space sync request` modal on both paired devices after reconnect/startup. The modal can ask to approve multiple spaces at once, including already-known mapped spaces and custom spaces. This behavior is wrong for the intended product model.

This source captures the corrected business logic for DeviceConnection and SpaceSync so it can be ingested into the Fini wiki later.

## Summary

Pairing and space synchronization are separate consent moments.

Pairing is a device connection request. It should be an inline row in the device list or add-device flow, not a global modal.

Space sync consent is per space. Device A may ask Device B to sync one not-yet-synced space. Only Device B should see the incoming space sync request. Once the space is approved and mapped, quest create/update/delete traffic for that mapped space syncs silently in the background without more modals.

Stopping sync is also explicit lifecycle behavior. When a mapped space is removed, Fini should send an end-of-sync event, write `end_of_sync_at` on both devices, and stop future sync for that space.

If the space is later re-enabled, Fini should bootstrap/merge all quest changes that happened while sync was off.

## Decisions

- Device pairing consent is distinct from space sync consent.
- Incoming device connection requests should be inline list items, not global modal dialogs.
- `Incoming space sync request` is only for one not-yet-synced space at a time.
- The space sync request appears only on the receiving device.
- Already-synced spaces must not trigger a new approval modal on app startup, reconnect, session bootstrap, or normal sync tick.
- Batch snapshot approval for multiple spaces is not the desired product behavior.
- After a space is mapped, quest create/update/delete events sync in the background without user prompts.
- Quest UUID primary keys exist to make cross-device merge and full quest-history convergence easier.
- Removing a mapped space sends an end-of-sync event, records `end_of_sync_at` on both devices, and stops sync after the event is recorded.
- Re-enabling a previously ended space clears `end_of_sync_at`, triggers bootstrap, and merges all quest changes made while sync was off.
- Mapping lifecycle does not require full historical periods unless a future audit/history UI needs it. Current lifecycle state can live on the mapping row.

## Plan

1. Update SpaceSync specs to describe one-space request/accept/end lifecycle.
2. Add mapping lifecycle state, including `end_of_sync_at`.
3. Replace full mapping snapshot consent with explicit per-space sync requests.
4. Keep startup/session reconciliation from opening consent modals.
5. Update frontend state to store pending single-space requests, not batch mapping snapshots.
6. Update the modal copy to name the specific incoming space.
7. Update E2E tests to cover receiver-only prompts, no prompt for already-synced reconnect, silent quest sync after approval, end-of-sync state, and re-enable bootstrap/merge.

## Evidence

- Current global modal is mounted in `src/App.vue` as `IncomingSpaceResolutionDialog`.
- Current frontend batches pending requests in `src/stores/device.ts` through `pendingSpaceSyncRequestsByPeer`.
- Current modal copy in `src/components/DeviceView/IncomingSpaceResolutionDialog.vue` says a peer wants to sync N spaces.
- Current Rust mapping update path sends full snapshots from `space_sync_tick_impl` and `space_sync_update_mappings_impl` in `src-tauri/src/services/space_sync/commands.rs`.
- Current `pair_space_mappings` schema has `peer_device_id`, `space_id`, `enabled_at`, and `last_synced_at`, but no `end_of_sync_at`.
- Current E2E helper `specs/e2e/actors/helpers/personal-sync.ts` waits for a batch approval dialog and clicks approve.

## Open Questions

- Whether future UI should expose ended mapping rows or only active mappings plus a last-ended timestamp.
- Whether future audit requirements need a separate mapping lifecycle history table.
