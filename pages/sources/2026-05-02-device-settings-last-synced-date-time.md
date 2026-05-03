---
title: 2026-05-02 Device Settings Last Synced Date And Time
type: source
created: 2026-05-02
updated: 2026-05-02
sources: [2026-05-02-device-settings-last-synced-date-time]
tags: [fini, settings, device-connection, space-sync, ui]
---

# 2026-05-02 Device Settings Last Synced Date And Time

Implementation note for the Settings device detail view: mapped-space `last synced:` rows now display locale date and time, not time only. This is a presentation change for sync recency visibility and does not change space mapping, sync persistence, or replication semantics [[sources/2026-05-02-device-settings-last-synced-date-time]].

## Key claims

- `Settings -> Device/:id` mapped-space rows should show `last synced:` with both date and time once the space is mapped and no sync is pending [[sources/2026-05-02-device-settings-last-synced-date-time]].
- The formatter is `Date.toLocaleString()`, matching nearby `paired at` and `last seen` device-detail labels [[sources/2026-05-02-device-settings-last-synced-date-time]].
- The change is UI-only; it does not alter last-synced storage, `space_sync` event flow, mapping rules, or device pairing behavior [[sources/2026-05-02-device-settings-last-synced-date-time]].
- Verification was the targeted frontend unit test `npm run test:unit -- --runTestsByPath src/spec/views/DeviceView.spec.ts`, which passed before commit `f2e98ab` [[sources/2026-05-02-device-settings-last-synced-date-time]].

## Open questions

- None stated directly in the source.

## Related pages

- [[DeviceConnection]]
- [[SpaceSync]]
