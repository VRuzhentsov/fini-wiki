---
title: Device Synchronizations Design (Issue #4)
type: source
created: 2026-04-12
updated: 2026-04-12
sources: [2026-03-29-device-synchronizations-design]
tags: [fini, sync, device-connection, space-sync, focus-history, architecture]
---

# Device Synchronizations Design (Issue #4)

Implementation-ready lock for Fini's current multi-device direction. It turns the earlier single `device_sync` idea into a two-plane architecture: `device_connection` handles discovery and pairing, while `space_sync` handles mapped-space replication over websocket. It also hard-locks the `Main` to `Focus` rename and moves focus metadata into `focus_history` instead of quest rows.

## Key claims

- `device_connection` and `space_sync` are separate public surfaces with no backward aliases.
- UDP is reserved for control-plane work; websocket is reserved for sync data-plane work.
- Sync requires durable outbox, ACK replay, event ids, correlation ids, conflict resolution, relay fan-out, and 30-day tombstones.
- Mapping is pair-level, symmetric, keyed by `space_id`, and bootstraps immediately when enabled.
- Focus is owner-scoped metadata stored in `focus_history` and syncs only within the filtered Personal-mapping cluster.

## Open questions

- none

## Related pages

- [[device-sync-architecture]]
- [[DeviceConnection]]
- [[SpaceSync]]
- [[FocusHistory]]
- [[focus]]
