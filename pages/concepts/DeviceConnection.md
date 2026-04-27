---
title: DeviceConnection
type: concept
created: 2026-04-12
updated: 2026-04-27
sources: [2026-03-29-device-synchronizations-design, 2026-04-26-mdns-sd-device-discovery-architecture, 2026-04-26-headed-local-e2e-main-use-case, 2026-04-26-reusable-synced-devices-e2e-precondition]
tags: [fini, sync, pairing, discovery, device-connection, mdns, dns-sd]
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

> [!warning] Discovery transport superseded
> The older custom UDP discovery/pairing transport from [[sources/2026-03-29-device-synchronizations-design]] is superseded by the mDNS/DNS-SD architecture in [[sources/2026-04-26-mdns-sd-device-discovery-architecture]]. Keep the identity, add-mode, pairing UX, and trust model; change how peers are discovered and contacted.

## mDNS/DNS-SD discovery

Device discovery should use DNS-SD over mDNS for endpoint discovery, not custom UDP beacons [[sources/2026-04-26-mdns-sd-device-discovery-architecture]].

- Service type: `_fini-sync._tcp.local.`.
- First desktop provider: Rust `mdns-sd` crate behind a Fini-owned `DiscoveryProvider` abstraction.
- TXT V1 fields: `txtvers`, `devid`, `name`, `add`, `proto`.
- TXT records are untrusted LAN claims; they do not establish identity trust.
- Resolved peers are keyed by stable `device_id`, not display name or mDNS instance name.
- Add Device filters peers where `add=1`, `device_id != local_device_id`, and `proto` is supported.

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

Under the mDNS architecture, peer-specific pairing messages move from UDP to the resolved WebSocket endpoint [[sources/2026-04-26-mdns-sd-device-discovery-architecture]]. The passcode trust ceremony stays: mDNS says where a peer claims to be, pairing decides whether the user trusts it, and WebSocket auth later proves trusted-device possession.

## E2E pairing precondition

The reusable multi-actor E2E helper should use real UI pairing for coverage, then backend commands for readiness checks [[sources/2026-04-26-reusable-synced-devices-e2e-precondition]].

- `ensureSyncedActors([actorA, actorB])` prepares actors for business tests.
- It verifies stable local identities and unique device ids.
- It ensures each actor is paired with each other actor.
- For `2+` actors, the initial default topology is full mesh.
- The local headed proof launches visible `actor-a` / `actor-b` windows and exercises the real Settings/Add Device flow [[sources/2026-04-26-headed-local-e2e-main-use-case]].

## Transport scope

The newer transport split is mDNS/DNS-SD for discovery and WebSocket for peer-specific pairing plus sync [[sources/2026-04-26-mdns-sd-device-discovery-architecture]].

- mDNS/DNS-SD browse/resolve finds `_fini-sync._tcp.local.` endpoints.
- Pairing messages use the resolved WebSocket endpoint.
- Sync continues over WebSocket and still requires paired/trusted device records.
- Temporary port sharding (`FINI_DISCOVERY_PEER_PORTS`) should go away after mDNS endpoint resolution works.

## Security policy (connection layer)

Connection-layer security stops at pair-auth in this phase; transport encryption is still deferred [[sources/2026-03-29-device-synchronizations-design]].

- Pairing passcode is required.
- Successful pairing produces pair-auth material used by `space_sync` websocket handshake.
- Transport encryption for data-plane is deferred to follow-up phase.

## Public command naming

The command rename is a hard cut-over with no aliases [[sources/2026-03-29-device-synchronizations-design]].

- Hard cut-over to `device_connection_*` command naming.
- No backward command aliases.
