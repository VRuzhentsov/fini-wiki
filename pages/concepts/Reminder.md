---
title: Reminder
type: concept
created: 2026-04-12
updated: 2026-04-12
sources: [2026-03-21-mvp-baseline, 2026-03-29-device-synchronizations-design]
tags: [fini, reminders, notifications, focus]
---

# Reminder

Scheduled notification linked to a [[Quest]] / [[QuestOccurrence]]. Multiple reminders can exist per quest [[sources/2026-03-21-mvp-baseline]].

## Fields

Reminder metadata is part of the persisted domain and also part of the replicated mapped-space dataset in the current sync design [[sources/2026-03-21-mvp-baseline]] [[sources/2026-03-29-device-synchronizations-design]].

| Field | Type | Description |
|---|---|---|
| `id` | uuid string | Reminder identifier |
| `quest_id` | uuid string | Parent quest/occurrence |
| `type` | enum | `relative` or `absolute` |
| `mm_offset` | integer \| null | Minutes before `due_at_utc` for `relative` reminders |
| `due_at_utc` | datetime \| null | Exact trigger time for `absolute` reminders |
| `created_at` | datetime | |

## Types

Relative reminders are keyed from quest deadlines; absolute reminders fire at the stored UTC time [[sources/2026-03-21-mvp-baseline]].

| Value | Behavior |
|---|---|
| `relative` | Triggers `mm_offset` minutes before quest `due_at_utc` |
| `absolute` | Triggers exactly at reminder `due_at_utc` |

## Common relative presets

Snooze and relative reminder UX rely on a small preset set in the MVP baseline [[sources/2026-03-21-mvp-baseline]].

| Label | mm_offset |
|---|---|
| 5 minutes before | 5 |
| 30 minutes before | 30 |
| 1 hour before | 60 |
| 1 day before | 1440 |

## Delivery

Each device is responsible for local OS notification scheduling and delivery [[sources/2026-03-29-device-synchronizations-design]].

- Uses OS-level notifications on Android/Linux/Windows/macOS
- Works with foreground, background, minimized, or closed app

## Trigger effects

Reminder firing can temporarily preempt Focus, but suppressed reminders do not create invalid focus events [[sources/2026-03-21-mvp-baseline]].

- If the target quest is already `completed` or `abandoned`, trigger is suppressed.
- If the target quest is active, reminder trigger can preempt current Focus.
- Reminder preemption is temporary; Focus returns to previous valid target after reminder quest resolves.
- Reminder-triggered focus writes a `trigger = reminder` event to [[FocusHistory]].

## Snooze

Snooze creates a one-off reminder and does not alter repeat cadence [[sources/2026-03-21-mvp-baseline]].

- Snooze options: 10m, 30m, 1h
- Snooze creates a one-off `absolute` reminder for the current occurrence
- Snooze does not alter repeat cadence or series schedule

## Permissions

If notification permission is denied, reminder metadata remains editable and a subtle visible warning is shown in UI [[sources/2026-03-21-mvp-baseline]].
