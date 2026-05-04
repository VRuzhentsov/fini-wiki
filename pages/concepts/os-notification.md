---
title: OS Notification
type: concept
created: 2026-04-21
updated: 2026-05-04
sources: [2026-04-21-notifications-grilling, 2026-04-24-reminder-due-bridge-grilling, 2026-05-04-android-notification-debug-build]
tags: [fini, notifications, os, scheduling, android, linux, windows, macos]
---

# OS Notification

Platform-level surface that delivers a [[Reminder]] to the user when the app is not in the foreground. Distinct from the [[Reminder]] entity: the reminder belongs to a [[Quest]]; the notification is an OS-owned display/scheduling artifact [[sources/2026-04-21-notifications-grilling]].

> Core framing: "Reminder is an entity that belongs to a quest. The notification is an OS-level surface. Snooze moves the surface, not the entity." [[sources/2026-04-21-notifications-grilling]]

## Scheduling model

Per-platform OS schedulers own fire timing so reminders deliver when the app is closed [[sources/2026-04-21-notifications-grilling]].

- Android: `AlarmManager` / `WorkManager`.
- Linux: TBD (candidates: `tauri-plugin-notification`, systemd-user timer, long-running user daemon).
- Windows / macOS: native platform schedulers.
- In-process timers are rejected — cannot satisfy the closed-app delivery lock in [[Reminder]].

## Foreground suppression

When the app is visible, the OS notification is not shown; the in-app path handles signaling [[sources/2026-04-21-notifications-grilling]].

- App visible → [[focus|Focus]] switch + subtle in-app toast.
- OS notification fires only when the app is backgrounded, minimized, or closed.
- Rationale: avoid double-signal when the Focus preempt already surfaces the reminder visually.

## Reboot survival

Delivery survives reboots through a combination of OS-scheduler durability and app-side re-arming [[sources/2026-04-21-notifications-grilling]].

- Android: `RECEIVE_BOOT_COMPLETED` broadcast receiver re-arms AlarmManager/WorkManager without requiring the user to open the app.
- Linux / Windows / macOS: persistence depends on the OS scheduler's own durability.
- Re-arm on app launch is the cross-platform safety net.

## Past-due behavior

If a fire time has already passed, the notification fires immediately [[sources/2026-04-24-reminder-due-bridge-grilling]].

- Save a quest with a past due time: fire now.
- App launch reconciliation finds a missed fire: fire now.
- No grace window, no silent miss state, no separate missed-marker UI.

> [!warning] Supersedes 30-minute grace rule
> The older 30-minute OS-notification grace window from [[sources/2026-04-21-notifications-grilling]] is retired by [[sources/2026-04-24-reminder-due-bridge-grilling]].

## Permission UX

Notification permission is requested just-in-time rather than on first launch [[sources/2026-04-21-notifications-grilling]].

- On first reminder save: rationale UI + system permission prompt (Android 13+ `POST_NOTIFICATIONS`, per-platform equivalents).
- Settings toggle remains as a fallback entry point.
- Matches the planned pattern for mic permission (issue #10).
- If denied, reminder metadata remains editable with a subtle visible warning (inherited from [[Reminder]]).

## Android implementation status

- Current Android scheduling/channel plumbing is mostly already present through `tauri-plugin-notification`, `setup_notification_channel(...)`, and the reminder scheduling path [[sources/2026-05-04-android-notification-debug-build]].
- The main current gap is Android 13+ `POST_NOTIFICATIONS` permission support: the generated Android manifest does not declare it, `MainActivity.kt` only requests `RECORD_AUDIO`, and the frontend reminder flow has no permission bridge yet [[sources/2026-05-04-android-notification-debug-build]].
- The required UX remains just-in-time permission from reminder create/enable flows, not app-launch permission prompting [[sources/2026-05-04-android-notification-debug-build]].

## Interaction

Tap and action-button semantics route through the app [[sources/2026-04-21-notifications-grilling]].

- Tap → opens app to [[focus|Focus]] view.
- Action buttons: **Complete** / **Snooze 30m** / **Snooze 1d**.
- macOS may truncate the third action button (platform limit).

## Snooze semantics

Snooze is a notification-level operation, not a reminder-level one [[sources/2026-04-21-notifications-grilling]].

- OS reschedules a re-notification for the same [[Reminder]] after the snooze interval.
- **No new reminder row.**
- **No [[FocusHistory]] event** at snooze time — a focus event is only written if the user engages after the eventual re-fire.
- **No cross-device replication.** Snooze is per-device.

## Multi-device cancellation

Peer cancellation follows [[SpaceSync]] quest-state updates, but reminder rows themselves are local-only [[sources/2026-04-21-notifications-grilling]] [[sources/2026-04-24-reminder-due-bridge-grilling]].

- Completion on device A → quest-state replicates via [[SpaceSync]] → device B cancels its pending/visible OS notification.
- Applies to completed / abandoned / deleted quest states, and to local reminder-row deletes derived from those quest changes.
- Snooze does not replicate; peers retain their own notification until their own state or action changes.

## Cancellation lifecycle

OS-scheduled fires and visible notifications are cancelled on state transitions [[sources/2026-04-21-notifications-grilling]].

- Quest status → `completed` / `abandoned` → cancel.
- Quest deleted → cancel.
- Reminder row deleted → cancel.
- Reminder time edits → reschedule in place (cancel old + schedule new).
- Quest edits that do not affect reminder time do not cancel.
- Incoming [[SpaceSync]] state changes cancel peer notifications.

## Wall-clock semantics

Fire time follows quest-local wall-clock semantics rather than a frozen UTC instant [[sources/2026-04-24-reminder-due-bridge-grilling]].

- `Apr 30, 10:00` means 10:00 local on the current device.
- Date-only quests fire at `09:00` local by default.
- DST and timezone changes preserve local wall-clock meaning; UTC is recomputed from the quest fields when scheduling.

## Content

Notification copy is app-branded, with quest and space in the body [[sources/2026-04-21-notifications-grilling]].

- Title: `Fini`.
- Body: `<quest title> · <space name>` — e.g. `Take pills · Personal`.

## Sound

Platform default; no custom audio shipped [[sources/2026-04-21-notifications-grilling]].

- Default OS notification tone, **on by default**.
- No bundled or custom sounds.
- User mutes via per-platform OS settings (Android notification channels, macOS notification center, Linux DE settings, Windows Focus Assist).
- Android channel: `fini.reminders` at `IMPORTANCE_DEFAULT`.
- Vibration: TBD.

## Relationship to FocusHistory

The notification does not write [[FocusHistory]] directly [[sources/2026-04-21-notifications-grilling]].

- OS notification firing is **independent** of `focus_history`.
- `focus_history` rows for past fires are written by the main-process reconciler on next engagement, with `created_at` backdated to the original fire time. See [[FocusHistory]].
- Walkthrough:
  - 09:00 — user creates reminder for 10:00.
  - 10:00 — OS fires notification; no `focus_history` row yet.
  - 11:00 — user opens app; reconciler INSERTs `focus_history(quest_id=X, trigger='reminder', created_at='10:00')`; resolver now returns X.

## Open questions

Remaining TBDs after the bridge update [[sources/2026-04-21-notifications-grilling]] [[sources/2026-04-24-reminder-due-bridge-grilling]].

- Linux delivery mechanism choice.
- Vibration defaults.
- Notification grouping: one per reminder vs grouped by quest/space.
