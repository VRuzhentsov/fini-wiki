---
title: QuestSeries
type: concept
created: 2026-04-12
updated: 2026-04-21
sources: [2026-04-21-notifications-grilling]
tags: [fini, quests, series, repeat, reminders]
---

# QuestSeries

Template record for repeating quests. A series defines cadence and generation rules; actionable work happens in [[QuestOccurrence]] / [[Quest]].

## Fields

| Field | Type | Description |
|---|---|---|
| `id` | uuid string | Stable series identifier |
| `space_id` | string | Parent [[Space]] id (`"1"`, `"2"`, `"3"`, or UUID); never null |
| `title` | string | Default title for generated occurrences |
| `description` | string \| null | Default description |
| `repeat_rule` | RepeatRule | Recurrence definition; see [[RepeatRule]] |
| `priority` | enum | Default priority for generated occurrences |
| `energy` | enum | Default energy for generated occurrences |
| `active` | boolean | Whether series continues generating occurrences |
| `created_at` | datetime | |
| `updated_at` | datetime | |

## Behavior

- Completing an occurrence should keep series active and prepare the next nearest open occurrence.
- Only the closest not-yet-resolved occurrence is surfaced in active quest lists by default.
- Historical occurrences remain visible in [[HistoryView]] and history endpoints.

## Reminder templates

Reminder configuration for repeating quests lives on the series, not on each occurrence [[sources/2026-04-21-notifications-grilling]].

- Users set a reminder template on the series once (e.g. "15 min before due").
- `generate_next_occurrence` (`src-tauri/src/services/quest.rs:146-222`) materializes concrete [[Reminder]] rows per occurrence, resolving `mm_offset` against the occurrence's `due_at_utc`. [[os-notification]] alarms are scheduled at the same time.
- Schema impact: either a `reminder_templates` JSON column on `quest_series` **or** a new `series_reminder_templates` table. Choice deferred to impl.
- Single-occurrence (non-series) quests keep per-quest reminder semantics unchanged.
