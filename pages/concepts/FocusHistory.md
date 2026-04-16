---
title: FocusHistory
type: concept
created: 2026-04-12
updated: 2026-04-12
sources: [2026-03-29-device-synchronizations-design, 2026-03-21-mvp-baseline]
tags: [fini, focus, history, sync]
---

# FocusHistory

Owner-scoped focus timeline used to compute current Focus quest [[sources/2026-03-29-device-synchronizations-design]].

## Purpose

This model supersedes the earlier quest-row fields used for Main/Focus metadata [[sources/2026-03-21-mvp-baseline]] [[sources/2026-03-29-device-synchronizations-design]].

- Replaces quest-row focus fields (`set_main_at`, `reminder_triggered_at`).
- Keeps focus metadata separate from shared quest content.
- Supports synchronization rules that differ from quest data replication.

## Fields

The field set reflects the post-rename focus model rather than the older Main terminology [[sources/2026-03-29-device-synchronizations-design]].

| Field | Type | Description |
|---|---|---|
| `id` | uuid string | Focus event id |
| `device_id` | uuid string | Origin device that wrote the focus event |
| `quest_id` | uuid string | Target quest id |
| `space_id` | string | Target quest space id (denormalized for filtering) |
| `trigger` | enum | `manual`, `reminder`, `restore`, `system` |
| `created_at` | datetime | Event timestamp (UTC) |

## Semantics

Focus resolution walks these events against current quest state instead of mutating a single stored active quest pointer [[sources/2026-03-21-mvp-baseline]] [[sources/2026-03-29-device-synchronizations-design]].

- Focus is computed from focus-history events + current quest states.
- Latest valid focus event wins.
- If latest target is no longer active, resolver falls back to next valid event.
- If no valid focus event exists, fallback order from [[Quest]] applies.

## Replication

Replication is filtered by mapped spaces and by the implicit Personal-space owner cluster [[sources/2026-03-29-device-synchronizations-design]].

- Focus history is owner-scoped.
- Replicate only when owner-cluster rule matches:
  - owner-cluster is implicit through `Personal` mapping (`space_id = "1"`).
- Replicate only entries whose `space_id` is currently mapped for the pair.

## Restore behavior

Restore is one more focus event type, not a special-case resolver path [[sources/2026-03-29-device-synchronizations-design]].

- Restoring a quest from history appends a new `FocusHistory` event with trigger `restore`.
