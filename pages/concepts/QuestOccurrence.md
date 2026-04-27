---
title: QuestOccurrence
type: concept
created: 2026-04-12
updated: 2026-04-26
sources: [2026-04-21-notifications-grilling, 2026-04-24-reminder-due-bridge-grilling]
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

Concrete [[Reminder]] rows for occurrences now come from the standard quest due-date bridge, not from a separate series template [[sources/2026-04-24-reminder-due-bridge-grilling]].

- When `generate_next_occurrence` (`src-tauri/src/services/quest.rs:146-222`) creates this occurrence with a due date, the backend applies the same upsert logic used for any other quest.
- [[os-notification]] scheduling still happens locally per device.
- The occurrence's reminder row is local-only on each device; peers derive their own reminder rows from replicated quest fields.

> [!warning] Supersedes series-template reminder materialization
> The older series-template direction from [[sources/2026-04-21-notifications-grilling]] is retired by [[sources/2026-04-24-reminder-due-bridge-grilling]].
