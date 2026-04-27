---
title: 2026-04-21 Notifications Grilling
type: source
created: 2026-04-21
updated: 2026-04-21
sources: [2026-04-21-notifications-grilling]
tags: [fini, reminders, notifications, focus, focus-history, grilling, os-scheduler]
---

# 2026-04-21 Notifications Grilling

Grilling session locking expected OS notification behavior for Fini reminders across Android / Linux / Windows / macOS. Output feeds a new ticket: *Reminder delivery: OS notifications on Android / Linux / Windows / macOS*.

## Summary

The grilling locks a full lifecycle for [[Reminder]] delivery: OS-level per-platform schedulers, foreground suppression with in-app toast, 30-minute grace for late fires, reboot survival, just-in-time permission UX, per-device snooze semantics, peer notification cancellation via [[SpaceSync]], [[FocusHistory]] reconciliation with backdated `created_at`, and series-materialized reminder templates. It separates the OS notification (surface) from the Reminder (entity), and flags `focus_history.device_id` as unnecessary.

## Key claims

- Scheduling uses per-platform OS schedulers (Android AlarmManager/WorkManager, systemd-user timer or equivalent on Linux, native Win/macOS). In-process timers are rejected because they cannot satisfy the "works when app is closed" lock in [[Reminder]].
- All four platforms land in a single ticket, not phased.
- Foreground behavior when app is visible: [[focus|Focus]] switch + subtle in-app toast, **OS notification suppressed**. OS notification only fires when app is backgrounded, minimized, or closed.
- Reboot survival: re-arm on app launch + Android `RECEIVE_BOOT_COMPLETED` broadcast receiver. Linux/Win/macOS persistence depends on the OS scheduler's own durability; re-arm on launch is the safety net.
- Missed-fire grace window: 30 minutes. Older misses are skipped for OS notification and surfaced as a "missed reminders" UI marker. Grace applies to **OS notification** only; [[FocusHistory]] reconciliation is independent and has no grace window.
- Permission UX: just-in-time on first reminder save (rationale UI + system prompt), Settings toggle as fallback. Matches the pattern planned for issue #10 (mic permission).
- Tap opens to Focus view. Action buttons: **Complete / Snooze 30m / Snooze 1d** (overrides prior [[Reminder]] presets of 10m/30m/1h). macOS may truncate the third button.
- Multi-device: Completion on A replicates via [[SpaceSync]]; B cancels its pending/visible OS notification when quest state arrives. **Snooze is per-device** — A's snooze does not touch B.
- **Snooze is notification-level, not reminder-level**: OS reschedules a re-notification, no new reminder row, no `focus_history` event at snooze time, no cross-device replication. Reminder is an entity belonging to a quest; the notification is an OS surface; snooze moves the surface, not the entity.
- [[FocusHistory]] INSERT timing: all writes happen inside the main Tauri process on engagement (launch/tap). On every app launch, reconciler scans reminders with past fire times lacking a matching `focus_history` row and INSERTs one with `created_at` **backdated to the original fire time** (not launch time). This preserves the newest-valid-wins resolver ordering across missed events. **No background DB writes.**
- [[focus|Focus]] does not depend on OS notifications. OS notifications depend on Focus + Reminder, not the reverse.
- Notification content: Title = `Fini`; Body = `<quest title> · <space name>`. Example: `Fini` / `Take pills · Personal`.
- Sound: default OS tone, on by default. **No custom sounds** — no bundled audio assets. User mutes via per-platform OS settings. Android channel `fini.reminders` at `IMPORTANCE_DEFAULT`. Vibration TBD.
- Cancellation: cancel OS schedule + visible notification when quest status → `completed`/`abandoned`, quest deleted, or reminder row deleted. Time edits reschedule in place. Incoming sync state changes also cancel peer notification.
- Repeating quests: reminder template lives on the **series**; materialized into concrete `reminders` rows when `generate_next_occurrence` creates an occurrence (see `src-tauri/src/services/quest.rs:146-222`). OS alarms scheduled at generation time. Schema impact: `reminder_templates` JSON column on `quest_series` **or** a new `series_reminder_templates` table — deferred to impl. Single-occurrence quests keep per-quest semantics.
- Schema cleanup (orthogonal): `device_id` column on `focus_history` is unnecessary and should be dropped. Each device computes its own Focus independently; column adds no value. Filed as a separate narrow issue.

## Open questions / TBD (from source)

- Linux delivery mechanism: `tauri-plugin-notification` (weak for closed-app), systemd-user timers (heavier plumbing, survives close), or long-running user daemon.
- Vibration defaults (sound already locked).
- Notification grouping: one per reminder vs grouped by quest/space.
- Past-time reminder creation: fire immediately, refuse, or treat as missed under the 30-min grace rule.

## Related pages

- [[Reminder]] — entity; snooze semantics and presets updated by this grilling.
- [[os-notification]] — the OS-surface concept created from this grilling.
- [[focus]] — foreground path and resolver interaction.
- [[FocusHistory]] — reconciliation model and `device_id` deprecation.
- [[SpaceSync]] — peer cancellation on quest state change; reminder record replication.
- [[QuestSeries]] — reminder template location.
- [[QuestOccurrence]] — materialized reminder rows at generation.
- [[DeviceConnection]] — pairing + presence (referenced, not in scope).

## Superseded by newer source

> [!warning] Partly superseded by [[sources/2026-04-24-reminder-due-bridge-grilling]] (2026-04-24)
> The newer bridge doc retires two decisions here: the 30-minute missed-fire grace window and the series-level reminder template direction. Keep this page for the broader OS-notification framing, snooze semantics, and reconciler ownership model.
