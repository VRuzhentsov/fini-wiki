---
title: Sync Devices Design (Archived Snapshot)
type: source
created: 2026-04-12
updated: 2026-04-12
sources: [2026-03-23-sync-devices-design]
tags: [fini, sync, archived, superseded, device-connection, space-sync, focus]
---

# Sync Devices Design (Archived Snapshot)

Short archival note preserving the pre-split sync design. Its value is mainly historical: it records that the earlier `device_sync` framing was replaced by a stronger architecture with separate `DeviceConnection`, `SpaceSync`, and `FocusHistory` specs [[sources/2026-03-29-device-synchronizations-design]].

## Key claims

- The 2026-03-23 baseline is explicitly superseded.
- The old `device_sync` idea was split into `DeviceConnection` and `SpaceSync`.
- Product terminology moved from `Main` to `Focus`.
- Mapping semantics and durable replay behavior are now defined elsewhere.

## Open questions

- none

## Related pages

- [[device-sync-architecture]]
- [[DeviceConnection]]
- [[SpaceSync]]
- [[FocusHistory]]
