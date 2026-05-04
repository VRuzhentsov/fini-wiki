---
title: QuestSeries
type: concept
created: 2026-04-12
updated: 2026-05-04
sources: [2026-04-21-notifications-grilling, 2026-04-24-reminder-due-bridge-grilling, 2026-05-04-history-grouped-occurrence-ticket]
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
- Active-list grouping should remain unchanged; issue `VRuzhentsov/fini#20` scopes same-series grouping work to History only [[sources/2026-05-04-history-grouped-occurrence-ticket]].

## Reminder behavior

Repeating quests now use the same due-date bridge as single quests rather than a separate series-template system [[sources/2026-04-24-reminder-due-bridge-grilling]].

- When `generate_next_occurrence` creates a new occurrence with a due date, the backend applies the normal quest reminder bridge to that occurrence.
- No `series_reminder_templates` concept is needed in the current design.
- Single-occurrence and repeating quests therefore share one reminder model: quest due fields are the source of truth; [[Reminder]] rows are derived.

> [!warning] Supersedes series reminder templates
> [[sources/2026-04-21-notifications-grilling]] proposed series-level reminder templates. [[sources/2026-04-24-reminder-due-bridge-grilling]] retires that direction.
