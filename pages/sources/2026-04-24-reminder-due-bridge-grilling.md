---
title: 2026-04-24 Reminder Due Bridge Grilling
type: source
created: 2026-04-26
updated: 2026-04-26
sources: [2026-04-24-reminder-due-bridge-grilling]
tags: [fini, reminders, notifications, due-date, bridge, grilling]
---

# 2026-04-24 Reminder Due Bridge Grilling

Locked grilling outcome for the bridge between `quest.due` / `quest.due_time` and the `Reminder` entity. It closes the prior gap where quest due dates affected overdue UI but did not schedule notifications, and it simplifies the model so the backend derives reminder rows automatically from quest state.

## Key claims

- `quest.due` + `quest.due_time` are the source of truth; `Reminder` is a derived backend-managed row [[sources/2026-04-24-reminder-due-bridge-grilling]].
- Any quest with a due date should notify: exact `due_time` when present, otherwise `09:00` local on the due date [[sources/2026-04-24-reminder-due-bridge-grilling]].
- Bridge logic lives in Rust `update_quest`, not the Vue store: due edits upsert reminders, clearing due deletes them, and restore-to-active re-creates them [[sources/2026-04-24-reminder-due-bridge-grilling]].
- Past-due reminders always fire immediately; the prior 30-minute grace rule is superseded [[sources/2026-04-24-reminder-due-bridge-grilling]].
- Reminder rows are local-only and should no longer replicate via [[SpaceSync]]; each device derives its own reminder from replicated quest fields [[sources/2026-04-24-reminder-due-bridge-grilling]].
- Repeating quests use the same bridge; the earlier `series_reminder_templates` direction is superseded [[sources/2026-04-24-reminder-due-bridge-grilling]].
- Wall-clock semantics win over frozen UTC: "10:00" means 10:00 local on each device, with UTC recomputed from current timezone as needed [[sources/2026-04-24-reminder-due-bridge-grilling]].

## Open questions

- "Notify X minutes before" remains deferred; schema fields can support it later [[sources/2026-04-24-reminder-due-bridge-grilling]].
- Per-user override for the default `09:00` date-only fire time remains deferred [[sources/2026-04-24-reminder-due-bridge-grilling]].
- Multi-reminder-per-quest remains deferred even though schema shape could allow it [[sources/2026-04-24-reminder-due-bridge-grilling]].

## Related pages

- [[Reminder]]
- [[os-notification]]
- [[Quest]]
- [[QuestSeries]]
- [[QuestOccurrence]]
- [[SpaceSync]]
- [[FocusHistory]]
- [[pages/sources/2026-04-21-notifications-grilling]]
