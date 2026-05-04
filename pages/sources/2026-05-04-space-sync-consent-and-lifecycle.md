---
title: 2026-05-04 Space Sync Consent and Lifecycle
type: source
created: 2026-05-04
updated: 2026-05-04
sources: [2026-05-04-space-sync-consent-and-lifecycle]
tags: [fini, space-sync, device-connection, consent, lifecycle, e2e]
---

# 2026-05-04 Space Sync Consent and Lifecycle

SpaceSync consent is now a one-space receiver-side lifecycle, separate from device pairing consent. Pairing requests belong inline in device/add-device lists, while an `Incoming space sync request` remains a global modal only for one not-yet-active space shown only to the receiving device [[sources/2026-05-04-space-sync-consent-and-lifecycle]].

## Key claims

- Device pairing consent is distinct from space sync consent [[sources/2026-05-04-space-sync-consent-and-lifecycle]].
- Incoming device connection requests should be inline list items, not global modal dialogs [[sources/2026-05-04-space-sync-consent-and-lifecycle]].
- `Incoming space sync request` is only for one not-yet-synced space at a time and appears only on the receiving device [[sources/2026-05-04-space-sync-consent-and-lifecycle]].
- Startup, reconnect, session bootstrap, and normal sync tick must not trigger new approval modals for already-synced spaces [[sources/2026-05-04-space-sync-consent-and-lifecycle]].
- Batch snapshot approval for multiple spaces is not desired product behavior [[sources/2026-05-04-space-sync-consent-and-lifecycle]].
- After a space is mapped, quest create/update/delete events for that active mapped space sync silently in the background [[sources/2026-05-04-space-sync-consent-and-lifecycle]].
- Removing a mapped space sends an end-of-sync event, records `end_of_sync_at` on both devices, and stops future sync after the event is recorded [[sources/2026-05-04-space-sync-consent-and-lifecycle]].
- Re-enabling a previously ended space clears `end_of_sync_at`, triggers bootstrap, and merges all quest changes made while sync was off [[sources/2026-05-04-space-sync-consent-and-lifecycle]].
- Quest UUID primary keys exist to make cross-device merge and full quest-history convergence easier [[sources/2026-05-04-space-sync-consent-and-lifecycle]].

## Open questions

- Whether future UI should expose ended mapping rows or only active mappings plus a last-ended timestamp [[sources/2026-05-04-space-sync-consent-and-lifecycle]].
- Whether future audit requirements need a separate mapping lifecycle history table [[sources/2026-05-04-space-sync-consent-and-lifecycle]].

## Related pages

- [[SpaceSync]]
- [[DeviceConnection]]
- [[e2e-testing]]
