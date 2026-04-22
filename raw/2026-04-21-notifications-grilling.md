---
title: Notifications Grilling (2026-04-21)
type: raw
created: 2026-04-21
tags: [fini, reminders, notifications, focus, focus-history, grilling]
---

# Notifications Grilling — 2026-04-21

Grilling session to lock expected OS notification behavior for Fini reminders across Android / Linux / Windows / macOS. Output feeds the new GH ticket `Reminder delivery: OS notifications on Android / Linux / Windows / macOS`.

## Context going in

- Wiki [[Reminder]] locks: OS notifications on Android/Linux/Windows/macOS across fg/bg/minimized/closed.
- Wiki [[SpaceSync]] locks: each mapped device schedules + fires its own local OS notification.
- Reminder preemption writes a `trigger=reminder` event to [[FocusHistory]] per wiki [[focus]].
- Android 13+ requires runtime `POST_NOTIFICATIONS` permission.
- No `tauri-plugin-notification` installed; no `POST_NOTIFICATIONS` in manifest; no scheduler in code.
- Issue #10 tracks mic permission deferral — unrelated.

## Q&A

### Q1 — Scheduling model
**Chosen:** OS-level scheduler per platform.

In-process timers rejected because they cannot satisfy the "works when app is closed" wiki lock. Hybrid (in-proc + OS fallback) rejected as premature optimization. Implementation cost: per-platform integration (Android AlarmManager/WorkManager, Linux systemd-user timer or equivalent, Win/macOS native).

### Q2 — Platform scope
**Chosen:** all four platforms (Android + Linux + Windows + macOS) in one ticket.

User explicitly opted for single-pass over phased Android+Linux first. Increases ticket scope but matches the wiki lock directly.

### Q3 — Foreground behavior
**Chosen:** when app is visible, Focus switch + subtle in-app toast; **suppress OS notification**.

OS notification only fires when app is backgrounded, minimized, or closed. Rationale: avoid double-signal when the user is already looking at the app — the Focus preempt already surfaces the reminder visually.

### Q4 — Reboot survival
**Chosen:** re-arm on app launch + Android `RECEIVE_BOOT_COMPLETED` broadcast receiver.

BroadcastReceiver re-arms AlarmManager/WorkManager after reboot without requiring the user to open the app. Linux/Win/macOS persistence depends on the OS scheduler's own durability; re-arm on launch is the safety net.

### Q5 — Missed reminders (OS notification catch-up)
**Chosen:** 30-minute grace window.

If fire time passed within the last 30 minutes (device off, app killed, etc.), fire the OS notification late. If older than 30 minutes, skip the notification silently and surface in UI as a "missed reminders" marker.

Important: this is **OS-notification** behavior only. `focus_history` reconciliation (see Q9) is independent and has no grace window.

### Q6 — Permission UX
**Chosen:** just-in-time on first reminder save.

User creates their first reminder → on save, rationale UI + system permission prompt. Settings toggle available as fallback. Matches the pattern planned for issue #10 (mic permission on first listen). Avoids upfront friction for users who never use reminders.

### Q7 — Interaction (tap + action buttons)
**Chosen:** tap opens to Focus view. Action buttons: **Complete / Snooze 30m / Snooze 1d**.

User overrode default snooze presets (was recommending 10m based on wiki). Three buttons is within Android/Linux/Windows practical limits; macOS may truncate the third.

### Q8 — Multi-device behavior
**Chosen:**
- Completion on device A replicates via SpaceSync; device B cancels its pending/visible OS notification when the quest state arrives.
- Snooze is **per-device**. When A taps Snooze, only A's notification reschedules. B's notification stays as-is until B acts or the quest state changes.

User framing: "Snooze is notification-level, not reminder-level." See Q10.

### Q9 — FocusHistory INSERT timing
**Chosen:** inside the main app process, on launch / engagement, with backdated `created_at`.

Mechanics: on every app launch, reconcile. For each reminder whose fire time is in the past and has no matching `focus_history` row, `INSERT` one:
```sql
INSERT INTO focus_history (id, quest_id, space_id, trigger, created_at)
VALUES (<uuid>, <quest_id>, <space_id>, 'reminder', <reminder_fire_time>);
```
`created_at` is the reminder's original fire time, **not** the app-launch time. This way the Focus resolver (walks newest-valid-wins) picks the correct Focus given the historical event order.

**No background DB writes.** All `focus_history` inserts happen from the main Tauri process on engagement.

User's walkthrough example:
- 09:00 — user creates reminder for 10:00.
- 10:00 — OS fires notification. No `focus_history` row yet.
- 11:00 — user opens app for the first time. Reconciler runs; INSERTs `focus_history(quest_id=X, trigger='reminder', created_at='10:00')`. Focus resolver now returns X.

### Q10 — Snooze semantics (clarification from Q8)
**Locked:** snooze is notification-level, not reminder-level.

When user taps "Snooze 30m" on the notification:
- OS reschedules a re-notification for the same reminder in 30 min.
- **No new reminder row.**
- **No focus_history event** (focus_history is only written when the reminder fire time has passed and the user has engaged — which for a snoozed notification happens on the eventual re-fire, not at snooze time).
- Does **not** replicate to other devices.

User framing: "Reminder (date/time) is an entity that belongs to a quest. The notification is an OS-level surface. Snooze moves the surface, not the entity."

### Q11 — Focus vs OS notification dependency direction
**Clarification locked:** Focus does **not** depend on OS notifications. OS notifications depend on Focus + Reminder, not the other way.

A reminder can exist with a future fire time and have no `focus_history` row. When its fire time arrives, the OS notification fires (independent of focus_history). Only when the user engages (launch or tap) does the reconciler write a `focus_history` row — and that row's `created_at` is stamped to the original fire time.

### Q12 — Notification content + sound
**Chosen:** Title = `Fini`, Body = `<quest title> · <space name>`.

User chose app-brand title over quest-title-as-title. Body carries quest + space info. Example: title `Fini`, body `Take pills · Personal`.

**Sound:** default OS notification sound is **on by default**. **No custom sounds** — uses each platform's system default notification tone; Fini does not bundle or ship any audio assets. User can mute via OS notification settings per platform (Android notification channel controls, macOS notification center, Linux desktop environment settings, Windows Focus Assist).

Channel default: single Android channel `fini.reminders` at `IMPORTANCE_DEFAULT` with default sound enabled. Vibration TBD during impl.

### Q13 — Cancellation lifecycle
**Chosen:** cancel OS schedule + tray notification when:
- Quest status → `completed` / `abandoned`
- Quest deleted
- Reminder row deleted

Reminder time edits **reschedule in place** (cancel old schedule, schedule new). Quest edits that don't affect reminder time do not cancel.

Applies to SpaceSync-driven state changes as well: incoming sync event marking the quest completed on peer B cancels B's pending notification.

### Q14 — Repeating quests / series / occurrences
**Chosen:** reminder template lives on the **series**; materialized into concrete `reminders` rows when each occurrence is generated.

Mechanics:
- User sets reminder template on the series once (e.g. "15 min before due").
- `generate_next_occurrence` (see `src-tauri/src/services/quest.rs:146-222`) creates the occurrence Quest row AND inserts concrete `reminders` rows derived from the series template, resolving `mm_offset` against the occurrence's due time.
- OS alarms are scheduled at the same time the occurrence is generated.

Schema impact: requires a small addition — either a `reminder_templates` JSON column on `quest_series`, or a new `series_reminder_templates` table. Choice deferred to impl.

Single-occurrence (non-series) quests keep the current per-quest reminder semantics unchanged.

### Q15 — Schema cleanup (orthogonal)
**Noted:** `device_id` column on `focus_history` is unnecessary and should be dropped.

User framing: "Each device computes its own Focus independently. One device might have Personal+Work spaces mapped, another Personal+Family — they compute Focus independently." The `device_id` column adds no value and confuses the ownership model.

This is not part of the notifications ticket. Filed as a separate narrow issue.

## Unresolved (noted as TBD in ticket, not blocking grilling close)

- **Linux delivery mechanism:** `tauri-plugin-notification` (official, abstracts platforms but scheduling is typically in-process; weak for closed-app on Linux) vs systemd-user timers (survives close, heavier plumbing) vs long-running user daemon. Hardest platform because there's no AlarmManager equivalent.
- **Vibration defaults** (sound already locked: default OS sound, on by default).
- **Notification grouping** — one per reminder vs grouped by quest/space.
- **Past-time reminder creation** — if user creates a reminder with a fire time already in the past, fire immediately? Refuse? Treat as missed (Q5)?

## References

- [[Reminder]] — concept page, locks multi-platform scope.
- [[focus]] — Focus resolver spec.
- [[FocusHistory]] — event-log table structure and replication filters.
- [[SpaceSync]] — per-device local notification rule; quest/reminder replication envelope.
- [[DeviceConnection]] — pairing + presence (not directly in scope).
- Issue #10 — Android mic permission pattern; reuse the JIT permission UX approach.
