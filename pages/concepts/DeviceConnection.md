---
title: DeviceConnection
type: concept
created: 2026-04-12
updated: 2026-04-12
sources: [2026-03-29-device-synchronizations-design]
tags: [fini, sync, pairing, discovery, device-connection]
---

# DeviceConnection

LAN discovery, presence, and pairing control-plane behavior for Fini [[sources/2026-03-29-device-synchronizations-design]].

## Authority split

Current service boundaries are locked by [[sources/2026-03-29-device-synchronizations-design]].

- `spec/DeviceConnection.md` owns discovery/presence/pairing UX + control-plane behavior.
- `spec/SpaceSync.md` owns space mapping + data replication behavior.
- `spec/Network.md` owns transport-level contracts shared by both services.

## Settings information architecture

The route and settings layout here summarize the same current split [[sources/2026-03-29-device-synchronizations-design]].

Routes:

- `/settings`
- `/settings/add-device`
- `/settings/device/:id`

`/settings` section order:

1. Spaces
2. Devices
3. Voice Model

Devices section behavior:

- Show paired devices only.
- Device row opens `/settings/device/:id`.
- `Add device` row is always last and opens `/settings/add-device`.

## Device identity and local record

These fields describe the minimum pairing and presence identity required by the current design [[sources/2026-03-29-device-synchronizations-design]].

Minimum identity fields:

- `device_id` (UUID, immutable)
- `hostname`

Minimum paired-device record fields:

- `peer_device_id`
- `display_name`
- `paired_at`
- `last_seen_at`
- `pair_state`

Display identity:

- Primary label: `display_name`
- Disambiguation: short UUID suffix

## Presence model

Presence remains part of the control-plane and not the replication data-plane [[sources/2026-03-29-device-synchronizations-design]].

- While app process is alive, every device emits heartbeat on LAN.
- Normal heartbeat interval: 60s.
- Offline threshold: 2 missed heartbeats (120s).
- `last_seen_at` is derived from latest heartbeat/discovery packet.

## Add-device mode

Add-device mode is the only state where new pairing requests are accepted [[sources/2026-03-29-device-synchronizations-design]].

Add-device mode is active only in `/settings/add-device`.

- Pairing requests are processed only when both peers are in add-device mode.
- Discovery cadence in add-device mode: every 5s.
- Candidate list rules:
  - newest seen first
  - dedupe by `device_id`
  - hide already paired devices
- Leaving add-device view cancels pending requests immediately.

## Pairing flow

Pairing is explicit and survives restart until unpair [[sources/2026-03-29-device-synchronizations-design]].

- Pairing passcode is mandatory (6 digits).
- Sender role:
  - first click timestamp wins
  - tie-breaker: lower `device_id`
- Receiver sees incoming request sheet.
- Sender sees code only after receiver accepts.
- Wrong code policy: 3 attempts then 60s cooldown.
- Pending request timeout: 60s.
- Pairing survives restart until unpair.

## Transport scope

The transport split is a core lock: UDP for control-plane only, websocket for sync data-plane only [[sources/2026-03-29-device-synchronizations-design]].

- UDP is used for connection control-plane only (discovery/presence/pairing).
- Discovery beacon advertises fixed `space_sync` websocket port for data-plane.
- UDP payload changes do not carry replicated quest/space/reminder/focus domain data.

## Security policy (connection layer)

Connection-layer security stops at pair-auth in this phase; transport encryption is still deferred [[sources/2026-03-29-device-synchronizations-design]].

- Pairing passcode is required.
- Successful pairing produces pair-auth material used by `space_sync` websocket handshake.
- Transport encryption for data-plane is deferred to follow-up phase.

## Public command naming

The command rename is a hard cut-over with no aliases [[sources/2026-03-29-device-synchronizations-design]].

- Hard cut-over to `device_connection_*` command naming.
- No backward command aliases.
