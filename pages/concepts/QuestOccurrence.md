---
title: QuestOccurrence
type: concept
created: 2026-04-12
updated: 2026-05-04
sources: [2026-04-21-notifications-grilling, 2026-04-24-reminder-due-bridge-grilling, 2026-05-04-history-grouped-occurrence-ticket, 2026-05-04-occurrence-completion-sync-e2e-ticket]
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

## History presentation

- Current History behavior still renders completed and abandoned same-series occurrences as separate rows [[sources/2026-05-04-history-grouped-occurrence-ticket]].
- Issue `VRuzhentsov/fini#20` tracks a History-only grouping fix so same-series occurrences can appear as a single History row [[sources/2026-05-04-history-grouped-occurrence-ticket]].
- This scope does not change the main active quest list grouping, which is already treated as correct [[sources/2026-05-04-history-grouped-occurrence-ticket]].

## E2E follow-up

- Issue `VRuzhentsov/fini#19` tracks a paired-device E2E test that completes an occurrence on device A and verifies the same occurrence identity becomes completed on device B after sync [[sources/2026-05-04-occurrence-completion-sync-e2e-ticket]].
- The assertion must check the same occurrence identity, not merely that some occurrence becomes completed on the peer [[sources/2026-05-04-occurrence-completion-sync-e2e-ticket]].

## Reminder materialization

Concrete [[Reminder]] rows for occurrences now come from the standard quest due-date bridge, not from a separate series template [[sources/2026-04-24-reminder-due-bridge-grilling]].

- When `generate_next_occurrence` (`src-tauri/src/services/quest.rs:146-222`) creates this occurrence with a due date, the backend applies the same upsert logic used for any other quest.
- [[os-notification]] scheduling still happens locally per device.
- The occurrence's reminder row is local-only on each device; peers derive their own reminder rows from replicated quest fields.

> [!warning] Supersedes series-template reminder materialization
> The older series-template direction from [[sources/2026-04-21-notifications-grilling]] is retired by [[sources/2026-04-24-reminder-due-bridge-grilling]].
