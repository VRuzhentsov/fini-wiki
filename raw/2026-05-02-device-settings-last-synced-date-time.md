# Device Settings Last Synced Date And Time

Date: 2026-05-02

## Context

The Settings device detail view previously showed mapped-space `last synced` labels as time-only. The user asked to make the Settings string show the date as well as the time.

## Summary

`Settings -> Device/:id` mapped-space rows now render `last synced:` using locale date+time instead of locale time-only. The change is display-only and does not alter sync state, mapping semantics, persistence, or replication behavior.

## Decisions

- Use locale date+time via `Date.toLocaleString()` for the mapped-space `last synced` label.
- Match nearby device-detail formatting already used for `paired at` and `last seen`.
- Keep the change scoped to the settings/device detail display path.

## Evidence

- App code: `src/views/DeviceView.vue` changed `lastSyncedLabelBySpace` from `new Date(syncedAt).toLocaleTimeString()` to `new Date(syncedAt).toLocaleString()`.
- View companion spec: `src/views/DeviceView.md` now lists "Show last synced date and time for mapped spaces."
- Unit test: `src/spec/views/DeviceView.spec.ts` now checks mapped rows show last synced date and time.
- Verification command: `npm run test:unit -- --runTestsByPath src/spec/views/DeviceView.spec.ts`.
- Verification result: PASS, 1 test suite passed, 2 tests passed.
- Shipped commit: `f2e98ab fix: include date in last synced label`.

## Open Questions

- None for the shipped behavior.
