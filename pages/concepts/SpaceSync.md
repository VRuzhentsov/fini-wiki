---
title: SpaceSync
type: concept
created: 2026-04-12
updated: 2026-05-02
sources: [2026-03-29-device-synchronizations-design, 2026-03-21-mvp-baseline, 2026-04-21-notifications-grilling, 2026-04-24-reminder-due-bridge-grilling, 2026-04-26-mdns-sd-device-discovery-architecture, 2026-05-02-device-settings-last-synced-date-time]
tags: [fini, sync, replication, spaces, websocket]
---

# SpaceSync

Per-space data synchronization between paired devices [[sources/2026-03-29-device-synchronizations-design]].

## Scope

The current replicated domain is the mapped-space subset of the broader MVP.1 sync goal [[sources/2026-03-21-mvp-baseline]] [[sources/2026-03-29-device-synchronizations-design]].

- Replicates selected spaces between paired devices.
- Includes domain data for mapped spaces:
  - spaces metadata
  - quests
  - quest series and occurrences
  - focus history (owner-scoped, filtered by mapped spaces)

## Service boundary

This page documents the post-split architecture, not the earlier `device_sync` model [[sources/2026-03-29-device-synchronizations-design]].

- `device_connection` handles discovery/presence/pairing.
- `space_sync` handles mapping + replication only.

`space_sync` does not replace or redesign UDP pairing/discovery logic.

## Mapping model

Mapping is symmetric, pair-level, and keyed by `space_id` rather than names [[sources/2026-03-29-device-synchronizations-design]].

- Mapping is pair-level and symmetric.
- A mapping update on one peer is replicated and becomes effective on both peers.
- Mapping unit is `space_id` (id-based, never name-based).

## Bootstrap behavior

Enabling mapping is not future-only; it immediately syncs existing records too [[sources/2026-03-29-device-synchronizations-design]].

- When a mapping is enabled for a space, run immediate bootstrap sync.
- Bootstrap includes existing records for that space, not future-only changes.
- If mapped space does not exist on peer, auto-create it with the same `space_id`.

## Mapped-space status visibility

The settings device-detail UI surfaces sync recency per mapped space without changing replication semantics [[sources/2026-05-02-device-settings-last-synced-date-time]].

- Mapped-space rows show a spinner while sync is pending.
- Once no sync is pending and a last-synced timestamp exists, rows show `last synced:` with locale date+time.
- This label is presentation-only; `space_sync` storage and event flow remain unchanged.

## Runtime lifecycle

The design keeps sync process-bound in this phase and relies on durable replay after reconnect [[sources/2026-03-29-device-synchronizations-design]].

- Sync runs while app process is alive.
- If app is closed, no background daemon/service is required in this phase.
- Reconnect performs catch-up from durable queue.

## Transport and session model

WebSocket remains the sync transport and uses one canonical session per pair, but the endpoint source moves from custom discovery beacons to DNS-SD resolution [[sources/2026-03-29-device-synchronizations-design]] [[sources/2026-04-26-mdns-sd-device-discovery-architecture]].

- Data-plane uses websocket.
- Peer endpoint comes from the resolved `_fini-sync._tcp.local.` service for the paired device.
- Exactly one canonical websocket session per pair:
  - deterministic dialer rule picks a single initiator (lower `device_id` dials)
- Session requires pair-auth handshake before event exchange.

> [!warning] Supersedes beacon-sourced endpoint
> The earlier fixed websocket port advertised by custom `device_connection` beacons is replaced by DNS-SD service resolution. Sync still only trusts paired-device records; mDNS itself is not authorization.

## Replication model

The lock here is durable outbox plus ACK replay with a generic event envelope [[sources/2026-03-29-device-synchronizations-design]].

- Durable outbox + ACK replay.
- Every local mutation becomes a sync event.
- Event envelope is generic across entities.

Minimum event envelope fields:

- `event_id` (UUID)
- `correlation_id` (UUID)
- `origin_device_id`
- `entity_type`
- `entity_id`
- `space_id`
- `op_type` (`upsert`/`delete`)
- `payload` (nullable for tombstone deletes)
- `updated_at` (UTC)
- `created_at` (UTC)

## Quest synchronization between spaces

Quest moves between spaces are first-class sync transitions, not a UI-only concern [[sources/2026-03-29-device-synchronizations-design]].

### Event scope

- Quest sync scope is always the quest `space_id` at mutation time.
- A peer receives a quest event only when that event `space_id` is currently mapped for the pair.

### Cross-space moves

- Moving a quest between spaces is a first-class sync transition and must converge on both peers.
- Expected behavior by move type:
  - mapped -> mapped: quest stays as one logical record (`id` unchanged) and updates `space_id` on peer.
  - mapped -> unmapped: peer removes quest copy from mapped dataset (no stale copy remains visible).
  - unmapped -> mapped: peer receives quest and shows it in the newly mapped space.

### Mapping toggles

- Enabling mapping for a space runs bootstrap and includes existing quests from that space.
- Disabling mapping for a space stops future replication for that space.
- Disabling mapping does not require immediate destructive cleanup of already-synced historical rows in this phase.

### Quest lifecycle operations

- Create, update, complete/abandon/restore, and delete must replicate for mapped spaces.
- Deletes replicate via tombstones and must not resurrect after reconnect.

## Convergence and conflict policy

The conflict order is explicitly defined and should be treated as current policy [[sources/2026-03-29-device-synchronizations-design]].

- Required outcome: automatic eventual convergence after reconnect.
- Conflict policy:
  1. newer `updated_at` wins
  2. if equal, lexicographically lower `origin_device_id` wins
  3. if still equal, lexicographically lower `event_id` wins
- Event dedupe key is `event_id`.

## Fan-out topology

Relay is intentionally enabled across the pair graph, with `event_id` preserved for dedupe [[sources/2026-03-29-device-synchronizations-design]].

- Relay/fan-out is enabled.
- If A is paired with B and C for mapped space X, events from B can be relayed by A to C.
- Relay must preserve `event_id` for loop prevention/dedupe.

## Delete semantics

Deletes use tombstones with 30-day retention to prevent resurrection on reconnect [[sources/2026-03-29-device-synchronizations-design]].

- Deletes replicate via tombstones.
- No resurrection after reconnect.
- Tombstone retention: 30 days, then cleanup/compaction.

## Reminder semantics

Reminder rows are local-only derivations under the due-date bridge; the replicated source of truth is the quest's `due` / `due_time` state [[sources/2026-04-24-reminder-due-bridge-grilling]].

- Quest rows with `due` / `due_time` replicate for mapped spaces.
- Each mapped device derives its own local [[Reminder]] row from the incoming quest state and schedules its own local [[os-notification]].
- **Peer cancellation**: when a quest's status arrives over sync as `completed` / `abandoned` (or the quest is deleted), the receiving peer deletes its local derived reminder and cancels its own pending or visible OS notification [[sources/2026-04-21-notifications-grilling]] [[sources/2026-04-24-reminder-due-bridge-grilling]].
- **Snooze does not replicate**: snooze is notification-level and per-device; it does not emit a sync event and does not touch peers [[sources/2026-04-21-notifications-grilling]]. See [[os-notification#Snooze semantics]].

> [!warning] Supersedes reminder-row replication
> The older direction in [[sources/2026-04-21-notifications-grilling]] said reminder records replicate. [[sources/2026-04-24-reminder-due-bridge-grilling]] retires that: reminder rows are local-only because wall-clock scheduling is device-local and the quest row already carries the authoritative due fields.

## Focus semantics

Focus replication is filtered and owner-scoped rather than bundled into shared quest-row state [[sources/2026-03-29-device-synchronizations-design]].

- Product term is `Focus` (replaces `Main`).
- Focus state is owner-scoped and stored in [[FocusHistory]], not in shared quest rows.
- Focus can target quests from any space.
- Focus history replication filters:
  - replicate only events whose target quest belongs to a mapped space
  - owner-cluster is implicit: peers that map `Personal` (`space_id = "1"`) share focus history

## Security policy (sync layer)

Websocket sync requires pair-auth; encryption is explicitly deferred to later work [[sources/2026-03-29-device-synchronizations-design]].

- Pair-auth is mandatory for websocket sync session.
- Data-plane transport encryption is deferred to follow-up phase.

## MCP scope for this phase

This phase renames existing surfaces where needed, but does not add new sync MCP operations [[sources/2026-03-29-device-synchronizations-design]].

- No new `space_sync` MCP operations in this phase.
- Naming surfaces follow hard cut-over conventions.
