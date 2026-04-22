---
title: QuestOccurrence
type: concept
created: 2026-04-12
updated: 2026-04-21
sources: [2026-04-21-notifications-grilling]
tags: [fini, quests, occurrence, repeat, reminders]
---

# QuestOccurrence

Concrete dated instance produced from a [[QuestSeries]]. In UI and MCP, this is represented as a normal actionable quest record ([[Quest]]).

## Fields

| Field | Type | Description |
|---|---|---|
| `id` | string | Deterministic occurrence id derived from `series_id + period_key` |
| `series_id` | uuid string | Parent [[QuestSeries]] |
| `period_key` | string | Deterministic period key (UTC boundary based) |
| `due_at_utc` | datetime \| null | Canonical deadline for this occurrence |
| `status` | enum | `active`, `completed`, `abandoned` |
| `completed_at` | datetime \| null | Completion timestamp |
| `completed_by` | string \| null | Actor label (hostname) in shared spaces |
| `created_at` | datetime | |
| `updated_at` | datetime | |

## Rules

- Deterministic occurrence `id` prevents duplicates when offline devices generate the same period occurrence.
- In shared spaces, one completion resolves the occurrence for all paired devices.
- Completion/abandonment suppresses pending reminders for that occurrence.

## Reminder materialization

Concrete [[Reminder]] rows are created from the series template at occurrence generation time [[sources/2026-04-21-notifications-grilling]].

- When `generate_next_occurrence` (`src-tauri/src/services/quest.rs:146-222`) creates this occurrence, it also inserts concrete `reminders` rows derived from the [[QuestSeries]] reminder template, resolving `mm_offset` against this occurrence's `due_at_utc`.
- [[os-notification]] OS alarms are scheduled at the same time.
- Materialized rows replicate via [[SpaceSync]] like any other reminder.
