---
title: Reminder
type: concept
created: 2026-04-12
updated: 2026-04-21
sources: [2026-03-21-mvp-baseline, 2026-03-29-device-synchronizations-design, 2026-04-21-notifications-grilling]
tags: [fini, reminders, notifications, focus]
---

# Reminder

Scheduled notification linked to a [[Quest]] / [[QuestOccurrence]]. Multiple reminders can exist per quest [[sources/2026-03-21-mvp-baseline]].

> Entity vs surface: **Reminder is the entity** (row owned by a quest); the OS notification is the platform surface that delivers it. See [[os-notification]] for surface-level behavior (scheduling, snooze, cancellation) [[sources/2026-04-21-notifications-grilling]].

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

Presets for creating relative reminders on a quest [[sources/2026-03-21-mvp-baseline]].

| Label | mm_offset |
|---|---|
| 5 minutes before | 5 |
| 30 minutes before | 30 |
| 1 hour before | 60 |
| 1 day before | 1440 |

## Delivery

Each device is responsible for local OS notification scheduling and delivery [[sources/2026-03-29-device-synchronizations-design]] [[sources/2026-04-21-notifications-grilling]].

- Uses OS-level notifications on Android/Linux/Windows/macOS.
- Scheduling lives at the OS layer (per-platform) — in-process timers are rejected because they cannot deliver while the app is closed [[sources/2026-04-21-notifications-grilling]].
- **Foreground**: when the app is visible, OS notification is **suppressed**; [[focus|Focus]] switch + in-app toast signal the user instead [[sources/2026-04-21-notifications-grilling]].
- **Background / minimized / closed**: OS notification fires.
- Reboot survival: re-arm on app launch + Android `RECEIVE_BOOT_COMPLETED` receiver; other platforms lean on OS scheduler durability [[sources/2026-04-21-notifications-grilling]].
- Missed-fire grace: if fire time passed within 30 minutes, fire late; older misses are skipped and surfaced as a UI "missed reminders" marker. Grace applies to OS notification only; [[FocusHistory]] reconciliation has no grace window [[sources/2026-04-21-notifications-grilling]].
- See [[os-notification]] for full surface-level scheduling, content, sound, interaction, and cancellation rules.

## Trigger effects

Reminder firing can temporarily preempt Focus, but suppressed reminders do not create invalid focus events [[sources/2026-03-21-mvp-baseline]].

- If the target quest is already `completed` or `abandoned`, trigger is suppressed.
- If the target quest is active, reminder trigger can preempt current Focus.
- Reminder preemption is temporary; Focus returns to previous valid target after reminder quest resolves.
- Reminder-triggered focus writes a `trigger = reminder` event to [[FocusHistory]].
- The INSERT is performed by the main Tauri process on engagement (launch or tap), not from any background OS-scheduler context, with `created_at` backdated to the original fire time [[sources/2026-04-21-notifications-grilling]]. See [[FocusHistory]] for the reconciliation model.
- [[focus|Focus]] does **not** depend on OS notifications — a reminder can exist with a future fire time and no `focus_history` row [[sources/2026-04-21-notifications-grilling]].

## Snooze

> [!warning] Superseded by [[sources/2026-04-21-notifications-grilling]] (2026-04-21)
> Previously: snooze options 10m/30m/1h; snooze created a one-off `absolute` reminder for the current occurrence [[sources/2026-03-21-mvp-baseline]]. Updated view below.

Snooze is **notification-level**, not reminder-level. Moves the OS surface without creating new entity rows [[sources/2026-04-21-notifications-grilling]].

- Action-button presets on the notification: **Snooze 30m**, **Snooze 1d** (plus **Complete**).
- OS reschedules a re-notification for the same reminder row.
- **No new reminder row.**
- **No [[FocusHistory]] event** at snooze time — a focus event is only written if the user engages after the eventual re-fire.
- **No cross-device replication** — snooze is per-device.
- Snooze does not alter repeat cadence or series schedule.

Framing: "Reminder (date/time) is an entity that belongs to a quest. The notification is an OS-level surface. Snooze moves the surface, not the entity." [[sources/2026-04-21-notifications-grilling]]

## Permissions

If notification permission is denied, reminder metadata remains editable and a subtle visible warning is shown in UI [[sources/2026-03-21-mvp-baseline]].

Permission is requested **just-in-time on first reminder save** (rationale UI + system prompt), with a Settings toggle as a fallback entry point. Matches the pattern planned for mic permission (issue #10) [[sources/2026-04-21-notifications-grilling]].

## Multi-device behavior

Completion replicates and cancels peer notifications via [[SpaceSync]]; snooze is per-device only [[sources/2026-04-21-notifications-grilling]].

- Completion on device A → replicates via [[SpaceSync]] → device B cancels its pending/visible OS notification when the quest state arrives.
- Snooze does not replicate; each device retains its own notification surface independently.

## Repeating quests

Repeating-quest reminders live on the series and materialize per occurrence [[sources/2026-04-21-notifications-grilling]].

- Reminder template is stored on the [[QuestSeries]] (not repeated on each occurrence).
- `generate_next_occurrence` (`src-tauri/src/services/quest.rs:146-222`) creates the occurrence quest row AND inserts concrete `reminders` rows derived from the series template, resolving `mm_offset` against the occurrence's `due_at_utc`.
- OS alarms are scheduled at the same time the occurrence is generated.
- Schema impact: either a `reminder_templates` JSON column on `quest_series` or a new `series_reminder_templates` table — deferred to impl.
- Single-occurrence (non-series) quests keep per-quest reminder semantics unchanged.
