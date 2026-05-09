---
title: FocusHistory
type: concept
created: 2026-04-12
updated: 2026-05-05
sources: [2026-03-29-device-synchronizations-design, 2026-03-21-mvp-baseline, 2026-04-21-notifications-grilling, 2026-04-24-reminder-due-bridge-grilling, 2026-05-04-computed-focus-reminder-preemption]
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
| `device_id` | uuid string | **Deprecated** — see note below [[sources/2026-04-21-notifications-grilling]] |
| `quest_id` | uuid string | Target quest id |
| `space_id` | string | Target quest space id (denormalized for filtering) |
| `trigger` | enum | `manual`, `reminder`, `restore`, `system` |
| `created_at` | datetime | Event timestamp (UTC). For `trigger = reminder` rows written by the reconciler, this is backdated to the original reminder fire time [[sources/2026-04-21-notifications-grilling]] |

> [!warning] `device_id` flagged for removal
> The `device_id` column is unnecessary and should be dropped. Each device computes its own Focus independently; the column adds no value and confuses the ownership model. Filed as a separate narrow issue, orthogonal to notifications work [[sources/2026-04-21-notifications-grilling]].

## Semantics

Focus resolution walks these events against current quest state instead of mutating a single stored active quest pointer [[sources/2026-03-21-mvp-baseline]] [[sources/2026-03-29-device-synchronizations-design]].

- Focus is computed from focus-history events + current quest states.
- Open-app reminder preemption no longer depends exclusively on a persisted reminder event; newer Focus semantics allow active reminder due timestamps to compete as virtual focus events [[sources/2026-05-04-computed-focus-reminder-preemption]].
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

## Reconciliation (reminder-triggered rows)

Rows with `trigger = reminder` are written by a main-process reconciler on app engagement, not from any OS-notification callback [[sources/2026-04-21-notifications-grilling]].

- **All `focus_history` INSERTs happen in the main Tauri process.** No background DB writes.
- On every app launch (or engagement), reconciler scans reminders whose fire time has passed and have no matching `focus_history` row, and INSERTs:

  ```sql
  INSERT INTO focus_history (id, quest_id, space_id, trigger, created_at)
  VALUES (<uuid>, <quest_id>, <space_id>, 'reminder', <reminder_fire_time>);
  ```

- `created_at` is the reminder's **original fire time**, not app-launch time. This preserves the newest-valid-wins resolver ordering across missed events.
- Independent of OS-notification delivery state; after [[sources/2026-04-24-reminder-due-bridge-grilling]], both notification delivery and reconciliation treat past-due reminders as immediate rather than grace-bounded.
- [[focus|Focus]] does not depend on OS notifications; a reminder can exist with a future fire time and no `focus_history` row.
- Newer Focus semantics go further: once that reminder becomes due, it may become Focus through computed due-time comparison even before a reconciler-created `focus_history` row exists [[sources/2026-05-04-computed-focus-reminder-preemption]].

Walkthrough:

- 09:00 — user creates reminder for 10:00.
- 10:00 — OS fires notification. No `focus_history` row yet.
- 11:00 — user opens app for the first time. Reconciler runs; INSERTs `focus_history(quest_id=X, trigger='reminder', created_at='10:00')`. Resolver now returns X.
