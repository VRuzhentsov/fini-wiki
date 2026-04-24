---
date: 2026-04-24
type: grilling
topic: Bridge design — quest.due/due_time ⇄ Reminder notification entity
status: locked
supersedes: parts of [[sources/2026-04-21-notifications-grilling]] and [[sources/2026-03-21-mvp-baseline]]
---

# Reminder / quest.due bridge — grilling outcome

## Context

User flagged that `quest.due` + `quest.due_time` (the date picker driven by the bell icon in the quest row) feel like the same concept as the separate `Reminder` entity used for OS notifications — but they are wired to nothing. Setting a due time via the UI does NOT schedule any notification. The `reminders` table is only written via backend/MCP/test scripts and has no frontend surface.

Before this grilling: `quest.due` drove overdue display; `Reminder` rows drove notification scheduling. They were disconnected.

Goal of the grilling: lock the bridge model so that setting a due date/time naturally produces a notification, with no confusing duplicate surfaces.

5 brainstormed options (A auto-Reminder / B relative-offset / C drop-Reminder-for-singles / D independent-picker / E semantic-rename). Recommended: B. Locked: A + simplifications.

---

## Locked decisions

### 1. due_time always triggers a notification
**No opt-out toggle.** If a quest has `due` + `due_time`, a notification will fire. If the user doesn't want a notification, they don't set a due date/time.

**Why:** matches user's mental model ("they are the same"). Zero new UI controls. Simpler to explain, simpler to implement.

### 2. Notification fires exactly at due_time
**No "15 min before" or other offsets for MVP.** Deferred — can be added later if demand appears.

**Why:** fewer moving parts in v1. `kind = 'relative'` and `mm_offset` become unused in the auto-flow (the column can stay for future manual reminders but nothing reads it).

### 3. Date-only quests notify at 09:00 local on the due date
Quests with `due` set but `due_time` null → notification fires at **09:00 local time** on the due date.

**Why:** user wants EVERY quest with a date to notify. Not notifying on date-only feels incomplete. 09:00 is a reasonable universal default for "start of productive day."

### 4. 09:00 default is fixed (not configurable)
No per-user setting in Settings for now. Hardcoded 09:00.

**Why:** avoid adding a Settings surface for an edge case. Can make it configurable later if asked.

### 5. Retroactive reconciliation on app launch
On launch, the reconciler scans all active quests with a `due` date. For any such quest with no matching Reminder row, it auto-creates the Reminder and schedules the OS notification.

**Why:** existing quests should get notifications without user re-saving every one. Covers data imports, migration from old app state, multi-device bootstrap.

### 6. Bridge logic lives in the backend (`update_quest`)
`update_quest` in Rust automatically manages the Reminder row:
- `due` or `due_time` set/changed → upsert the Reminder
- `due` cleared → delete the Reminder
- `status` → `completed` / `abandoned` → delete the Reminder
- `status` → `active` (restore) → upsert the Reminder (if due date present)

Frontend calls `update_quest` only. No reminder plumbing in the Vue store.

**Why:** single source of truth. Works from MCP and CLI invocations too (not just the UI path). Removes the risk of forgetting the bridge at any caller site.

### 7. Past-due reminders always fire immediately (30-min grace rule dropped)
**Unified rule.** Whether discovered by save (user sets a past date) or by reconciler (app was closed during fire time), any past-due reminder fires now.

**Supersedes:** decision 5 from [[sources/2026-04-21-notifications-grilling]] ("30-min grace window, older misses silent").

**Why:** the grace window caused confusion; "silent missed marker" added UI complexity that hasn't been built. Always firing is simpler and unambiguous. If the reminder is stale, the user can dismiss it in one tap.

### 8. Reminder row is deleted on quest completion/abandon/delete
Not kept as inactive data. Delete the row; cancel the OS schedule.

**Why:** the Reminder row is a derivation of quest state. When the quest leaves `active`, the derivation is invalid, so the row goes. Restore (`active` again) → reconciler or `update_quest` re-creates the row.

### 9. Repeating quests / series use the same bridge — no separate `series_reminder_templates`
When `generate_next_occurrence` creates a new occurrence with a due date, the bridge logic (running from `update_quest` or directly from the occurrence insert path) creates the Reminder row. No template concept needed.

**Supersedes:** decision 14 from [[sources/2026-04-21-notifications-grilling]] ("reminder template lives on the series"). The `series_reminder_templates` table planned for migration 13 becomes unused and should be dropped or left empty.

**Why:** each occurrence already has its due date set by the series schedule. The bridge derives the reminder from the due date. No redundant "template" concept.

### 10. Wall-clock semantics — time is stored as local; UTC is re-computed
"Apr 30, 10:00" means **10:00 local wall-clock on Apr 30**. Backend computes UTC fresh at each schedule/fire decision, using the current timezone.

**Implications:**
- DST transitions do not shift notifications (10:00 AM stays 10:00 AM).
- Travel across timezones: notification fires at 10:00 local in the new timezone, not at the original absolute UTC instant.
- The stored `due_at_utc` on the Reminder becomes a cached derivation, not the source of truth. The source of truth is always `quest.due + quest.due_time` (and the "09:00 default" for date-only).

**Why:** users think in wall-clock terms. "Take pill at 09:00" should always fire at 09:00 local, not drift by an hour after DST.

### 11. Reminder rows no longer replicate via SpaceSync
Reminder rows are **local-only**. SpaceSync replicates the quest (with `due` / `due_time`); each receiving device's ingress bridge creates its own local Reminder row.

**Supersedes:** current replication in `src-tauri/src/services/space_sync/commands.rs:573-596` which includes `reminder` in the entity replication set.

**Why:**
- Quest + due fields are the source of truth under the bridge.
- Under wall-clock semantics, the stored `due_at_utc` on a Reminder is device-local (depends on that device's timezone). Replicating it would leak one device's timezone onto another.
- Removes conflict surface: no risk of Reminder row drifting from its quest's due fields across devices.

### 12. No new UI indicator — existing due-date pill is the signal
The colored due-date pill on the quest row (e.g., "Apr 30, 10:00") already conveys "this quest has a schedule." No separate bell icon, chime chip, or badge.

**Why:** pill + visible due date = user understands a notification will fire at that time. Adding a second indicator is noise.

---

## Implementation scope (from these locks)

### Backend — `src-tauri/src/services/quest.rs`
`update_quest`:
- After persisting quest fields, if `due` is set on the resulting quest AND `status == 'active'` → upsert `reminders` row for this quest.
- If `due` is cleared, OR `status` transitions away from `active` → delete `reminders` row for this quest.
- "Upsert" = find single Reminder for this `quest_id`; UPDATE if present else INSERT.

`generate_next_occurrence`:
- After inserting the new occurrence quest row, apply the same upsert (since the new occurrence has a `due` date).

### Backend — `src-tauri/src/services/reconciler.rs`
- **Keep**: scan `reminders` for past-due; fire immediately + insert `focus_history` (no grace check anymore).
- **Add**: scan active quests with `due` set + no matching `reminders` row → create the row (retroactive bridge).
- **Drop**: `GRACE_MINUTES`, `within_grace` branching. Always fire.

### Backend — `src-tauri/src/services/notification.rs`
- `schedule_reminder`: compute fire time from `quest.due + quest.due_time` (or `due + "09:00"`) converted to UTC using current local timezone. Do not read `reminder.due_at_utc` directly — always recompute.
- `show_now`: unchanged (already platform-dispatched; Linux uses `notify-send`).
- In-process timer continues to use `quest.due + quest.due_time` as the source (recompute at schedule time).

### Backend — `src-tauri/src/services/reminder.rs`
- `create_reminder` / `update_reminder` / `delete_reminder` become internal (still Tauri-invoke-able for now, but no frontend caller). Not removed yet — MCP tests use them.

### Backend — `src-tauri/src/services/space_sync/commands.rs`
- Remove `reminder` from the entity replication set (`commands.rs:573-596`).
- Peer-side Reminder creation happens implicitly: when the quest arrives and `update_quest`-equivalent ingress runs on the peer, the bridge creates the local Reminder.
- Quest completion still replicates → peer's bridge deletes its Reminder → local notification cancelled.

### Frontend — `src/stores/quest.ts`
- `updateQuest` with `due` / `due_time` change → no extra plumbing. Backend handles the Reminder.
- Drop the `cancel_quest_notifications` invoke on completion — `update_quest` handles it.

### Frontend — `src/stores/reminder.ts`
- Keep for now (harmless, used by MCP / test code).
- No UI consumer needed.

### Frontend — `src/components/QuestsView/ReminderMenu.vue`
- **No change.** The component already sets `due` + `due_time` via `save` emit → `updateQuest` → backend bridges to Reminder.

### Schema
- **Drop** `series_reminder_templates` (migration 13 had this; either drop it via new migration or remove from the unreleased migration 13 before it ships).
- **Drop** `reminders.scheduled_notification_id` is still useful for Android AlarmManager handle; keep.
- **Keep** `reminders` table shape. `kind` / `mm_offset` unused in auto-flow but harmless; leave for future flexibility.

---

## Edge cases & how they resolve

| Case | Behavior |
|---|---|
| User sets due date in the past | Fires immediately (decision 7). |
| User clears `due_time` but keeps `due` | Notification moves to 09:00 local on that date. |
| User clears `due` entirely | Reminder deleted, notification canceled. |
| User completes quest before notification fires | Reminder deleted, notification canceled. |
| User restores a completed quest | Reminder re-created by `update_quest` transition; if original due date is still in the past, fires immediately. |
| User travels PST → JST | Fires at 10:00 JST (wall-clock preservation). |
| DST falls back | 10:00 AM fires at 10:00 AM regardless of the DST shift. |
| Device A in PST, device B in JST, same quest | Both fire at their own local 10:00; quest completion replicates and cancels the other side if later. |
| App was closed when fire time passed | Reconciler fires it on next launch. Always, no grace. |
| User creates quest with `due` but no `due_time` | Fires at 09:00 local on due date. |
| Quest repeats (series) generates new occurrence | `generate_next_occurrence` sets due date; bridge creates Reminder like any other quest. |
| Quest replicated from peer via SpaceSync | Peer-side `update_quest` / upsert equivalent triggers the bridge; Reminder created locally. |

---

## Questions asked (Q&A log)

**Q1:** When a user sets a due time, should a notification always fire, or should there be an opt-out?
**A:** Always notify. No opt-out.

**Q2:** Should "notify X min before" be supported for MVP?
**A:** No — at due time only.

**Q3:** Date-only quests — do they notify?
**A:** Yes, at 09:00 local.

**Q4:** Is the 09:00 default configurable?
**A:** No — hardcoded.

**Q5:** Do existing quests with due dates get notifications retroactively?
**A:** Yes — reconciler creates missing Reminder rows on launch.

**Q6:** Where does the bridge logic live — backend or frontend?
**A:** Backend (`update_quest`).

**Q7:** What happens on past-due save (user sets a date already in the past)?
**A:** Fire immediately.

**Q8:** Unify past-due save with reconciler's 30-min grace rule?
**A:** Unify — always fire past-due. Drop the 30-min grace.

**Q9:** What happens to the Reminder row when quest is completed/abandoned/deleted?
**A:** Delete the row + cancel notification.

**Q10:** Do repeating quests use the same bridge or separate series templates?
**A:** Same bridge. No series_reminder_templates.

**Q11:** DST / travel — wall-clock or frozen UTC?
**A:** Wall-clock. Always 10:00 local, re-computed per-device.

**Q12:** SpaceSync — should Reminder rows replicate or be local-only?
**A:** Local-only. Quest replicates; each device derives its own Reminder.

**Q13:** UI indicator — existing pill or new bell icon?
**A:** Existing pill is enough.

---

## Follow-up: supersedence notes for wiki

- `[[Reminder]]` needs rewriting: drop "multiple reminders per quest," drop `relative` / `mm_offset` / presets as active design (keep as deferred), drop "missed marker" UI, drop `series_reminder_templates`.
- `[[os-notification]]` needs updating: drop 30-min grace rule.
- `[[FocusHistory]]`: still fine — reconciler still inserts focus_history rows at reminder fire time; only the OS-notification side of the rule changes.
- `[[sources/2026-04-21-notifications-grilling]]`: mark decisions 5 and 14 as superseded by this file.

## Open / deferred

- "Notify X minutes before" (offset) — deferred; can add relative Reminders later without breaking the current schema.
- Per-user default time (09:00 override) — deferred; not requested by any user yet.
- Multi-reminder per quest — deferred; schema still allows it but the bridge only manages one row per quest.
- Android permission UX / JIT prompt — unchanged (handled elsewhere).
- Snooze semantics — unchanged (per [[sources/2026-04-21-notifications-grilling]] decision 9).
