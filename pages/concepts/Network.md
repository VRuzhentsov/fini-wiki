---
title: Network & Local Sync
type: concept
created: 2026-04-12
updated: 2026-04-27
sources: [2026-03-21-mvp-baseline, 2026-03-29-device-synchronizations-design, 2026-04-26-mdns-sd-device-discovery-architecture]
tags: [fini, network, sync, websocket, mdns, dns-sd]
---

# Network & Local Sync

Fini is local-first and accountless. LAN sync is introduced in **MVP.1** [[sources/2026-03-21-mvp-baseline]].

## Authority split

The current authority split reflects the newer two-plane sync architecture [[sources/2026-03-29-device-synchronizations-design]].

- [[DeviceConnection]] owns discovery/presence/pairing control-plane behavior.
- [[SpaceSync]] owns mapping and data replication behavior.
- `spec/Network.md` owns transport-level contracts shared by both.

## Goals

These goals come from the original MVP.1 local-first direction and remain consistent in the later sync lock [[sources/2026-03-21-mvp-baseline]] [[sources/2026-03-29-device-synchronizations-design]].

- Zero-cloud architecture (no central account service)
- Explicit pairing before data sharing
- Per-space synchronization selection
- Automatic convergence after offline reconnect

## Entry points

The same local dataset is shared regardless of whether Fini is entered through GUI, MCP, or headless runtime [[sources/2026-03-21-mvp-baseline]].

- GUI app
- MCP server
- Headless runtime

All entry points operate on the same local dataset.

## Transport split

The newer network direction separates discovery from trusted communication [[sources/2026-04-26-mdns-sd-device-discovery-architecture]].

- Discovery: DNS-SD over mDNS, browsing `_fini-sync._tcp.local.`.
- Pairing: WebSocket messages to the resolved endpoint.
- Sync data-plane: WebSocket sessions after paired/trusted-device checks.
- Persistence: SQLite stores trusted devices and mapped sync state.

> [!warning] Supersedes custom UDP discovery/pairing
> [[sources/2026-03-29-device-synchronizations-design]] used custom UDP discovery and pairing messages. [[sources/2026-04-26-mdns-sd-device-discovery-architecture]] replaces that with mDNS/DNS-SD discovery plus WebSocket pairing/sync.

## Discovery semantics

mDNS is discovery only [[sources/2026-04-26-mdns-sd-device-discovery-architecture]].

- mDNS tells Fini where a device claims to be reachable.
- TXT records are small, versioned, and untrusted.
- Discovery does not authenticate the peer and does not authorize sync.
- Pairing remains the trust-establishment step.
- Sync auth must continue checking paired-device records before accepting replicated data.

## Pairing baseline

Pairing remains explicit, restart-stable, and passcode-protected [[sources/2026-03-21-mvp-baseline]] [[sources/2026-03-29-device-synchronizations-design]].

- Pairing requires a 6-digit passcode.
- Pairing survives restarts until unpair.
- Presence heartbeat interval: 60s.
- `last_seen_at` is derived from latest heartbeat/discovery receipt.

## Session model

One canonical websocket session per pair is the current lock [[sources/2026-03-29-device-synchronizations-design]].

- One canonical websocket session per paired device pair.
- Deterministic initiator rule selects the dialer (lower `device_id` dials).
- Websocket session requires pair-auth handshake before data exchange.

## Replication model

Replay and convergence depend on a durable outbox and ACK-based catch-up [[sources/2026-03-29-device-synchronizations-design]].

- Push-on-change + reconnect catch-up.
- Durable local outbox and ACK replay.
- Queue survives restart/crash.
- Event dedupe by `event_id`.
- Fan-out relay between connected peers is allowed.

## Conflict and convergence policy

Conflict resolution is ordered and deterministic, with eventual convergence as the required outcome [[sources/2026-03-21-mvp-baseline]] [[sources/2026-03-29-device-synchronizations-design]].

Required outcome: automatic eventual convergence.

Conflict order:

1. newer `updated_at` wins
2. tie-break: lexicographically lower `origin_device_id` wins
3. final tie-break: lexicographically lower `event_id` wins

## Delete semantics

Deletes use tombstones so offline peers cannot resurrect removed records later [[sources/2026-03-29-device-synchronizations-design]].

- Deletes are replicated as tombstones.
- No resurrection after reconnect.
- Tombstones are retained for 30 days, then cleaned up.

## Space identity policy

Space identity is string-based and shared across peers by `space_id`, not names [[sources/2026-03-21-mvp-baseline]] [[sources/2026-03-22-mcp-id-migration-notes]] [[sources/2026-03-29-device-synchronizations-design]].

- Space identity is id-based, not name-based.
- Built-ins use reserved ids: `"1"`, `"2"`, `"3"`.
- Custom spaces use UUID ids.
- Missing mapped spaces are auto-created on peers with the same `space_id`.

## Shared repeating behavior

Repeating-quest sync relies on deterministic occurrence identity and shared completion semantics [[sources/2026-03-21-mvp-baseline]].

- Repeating quests use series + occurrences.
- Deterministic occurrence identity: `series_id + period_key`.
- `period_key` uses UTC period boundaries.
- Completion of shared occurrence cancels pending reminders for that occurrence on all mapped peers.

## Focus synchronization

Focus is owner-scoped, filtered by mapping, and no longer stored directly in shared quest rows [[sources/2026-03-29-device-synchronizations-design]].

- Product term is `Focus`.
- Focus events are owner-scoped in [[FocusHistory]], not in shared quest rows.
- Focus history sync is allowed only for owner-cluster peers (implicit via mapped `Personal` space `"1"`).
- Focus events replicate only when target quest belongs to a mapped space.

## Security

The current phase requires pairing and pair-auth, while encryption remains follow-up work [[sources/2026-03-21-mvp-baseline]] [[sources/2026-03-29-device-synchronizations-design]].

- LAN sharing is off by default.
- Pairing passcode is mandatory.
- Pair-auth is mandatory for websocket sync sessions.
- Data-plane transport encryption is deferred to follow-up phase.
- At-rest encryption is post-MVP work.
- mDNS advertisements are never trust assertions; malicious or spoofed TXT records must not grant sync access [[sources/2026-04-26-mdns-sd-device-discovery-architecture]].
