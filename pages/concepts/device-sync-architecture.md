---
title: Device Sync Architecture
type: analysis
created: 2026-04-12
updated: 2026-04-12
sources: [2026-03-23-sync-devices-design, 2026-03-29-device-synchronizations-design, 2026-03-21-mvp-baseline]
tags: [fini, sync, architecture, superseded, device-connection, space-sync]
---

# Device Sync Architecture

The sync docs show a clear supersession chain. The MVP baseline establishes that pairing and selected-space sync belong to MVP.1 [[sources/2026-03-21-mvp-baseline]]. The 2026-03-23 snapshot preserves the older single `device_sync` framing [[sources/2026-03-23-sync-devices-design]]. The 2026-03-29 lock replaces that with a two-plane design: `device_connection` for discovery and pairing, `space_sync` for replication, plus `focus_history` for owner-scoped focus metadata [[sources/2026-03-29-device-synchronizations-design]].

## What changed

- `device_sync` naming was removed with no aliases [[sources/2026-03-29-device-synchronizations-design]].
- Product terminology changed from `Main` to `Focus` [[sources/2026-03-29-device-synchronizations-design]].
- Focus metadata moved out of quest rows into [[FocusHistory]] [[sources/2026-03-29-device-synchronizations-design]].
- Transport responsibilities became strict: UDP for control-plane, websocket for sync data-plane [[sources/2026-03-29-device-synchronizations-design]].

## Current stable model

- [[DeviceConnection]] owns discovery, presence, and pairing.
- [[SpaceSync]] owns mapped-space replication, replay, conflict handling, fan-out, and tombstones.
- [[focus]] and [[FocusHistory]] explain the current focus model layered on top of sync.

## Reading guidance

Treat the 2026-03-23 source as history. Treat the 2026-03-29 source as the latest lock unless a newer source supersedes it.
