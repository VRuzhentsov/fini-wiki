---
title: OS Notification
type: concept
created: 2026-04-21
updated: 2026-05-21
sources: [2026-04-21-notifications-grilling, 2026-04-24-reminder-due-bridge-grilling, 2026-05-04-android-notification-debug-build, 2026-05-17-os-notifications-linux-debug-and-fixes, 2026-05-17-os-notifications-linux-sound-and-action-verification]
tags: [fini, notifications, os, scheduling, android, linux, windows, macos, kde]
---

# OS Notification

Platform-level surface that delivers a [[Reminder]] to the user when the app is not in the foreground. Distinct from the [[Reminder]] entity: the reminder belongs to a [[Quest]]; the notification is an OS-owned display/scheduling artifact [[sources/2026-04-21-notifications-grilling]].

> Core framing: "Reminder is an entity that belongs to a quest. The notification is an OS-level surface. Snooze moves the surface, not the entity." [[sources/2026-04-21-notifications-grilling]]

## Scheduling model

Per-platform OS schedulers own fire timing so reminders deliver when the app is closed [[sources/2026-04-21-notifications-grilling]].

- Android: `AlarmManager` via `tauri-plugin-notification`; re-armed after reboot via `RECEIVE_BOOT_COMPLETED`.
- Linux: `notify-rust` in a `spawn_blocking` task (in-process). Action buttons via `wait_for_action`. Closed-app delivery via systemd-user timer is deferred as a follow-up.
- Windows / macOS: `tauri-plugin-notification` desktop path.
- In-process timers are the current Linux mechanism; Android uses the OS-level AlarmManager for true closed-app delivery.

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

## Implementation status (as of 2026-05-21)

- **Android**: `POST_NOTIFICATIONS` and `RECEIVE_BOOT_COMPLETED` declared in manifest. Monochrome status-bar icon (`ic_stat_fini.xml`) and launcher large icon set. Action type (`reminder`) registered on startup. JIT permission bridge wired into reminder store `createReminder` / `updateReminder`.
- **Linux**: `notify-rust` replaces the deprecated `notify-send` shell-out. KDE Plasma 6 needs `Hint::DesktopEntry("Fini")` and an installed `Fini.desktop` for visible popups in dev builds. Action buttons (Complete / Snooze 30m / Snooze 1d) fire via `wait_for_action`; Complete and Snooze 30m were verified end to end. Closed-app delivery remains deferred (systemd-user timer follow-up) [[sources/2026-05-17-os-notifications-linux-debug-and-fixes]] [[sources/2026-05-17-os-notifications-linux-sound-and-action-verification]].
- **Windows / macOS**: plugin path (`tauri-plugin-notification`) dispatches `notification_action` / `notification_tap` commands via the `useNotificationActions` frontend composable.
- **System-resume reconciliation**: Linux logind `PrepareForSleep` listener in `resume_watcher.rs` re-runs the reconciler on wake; macOS/Windows resume bridges are deferred.

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

### `notification_snoozes` table

Snooze state is persisted locally in the `notification_snoozes` SQLite table. This is a transient OS-scheduling artifact — it is not a reminder entity and is not replicated via [[SpaceSync]].

| Column | Type | Notes |
|---|---|---|
| `reminder_id` | TEXT PK | References the snoozed [[Reminder]] row |
| `fire_at_utc` | TEXT | ISO-8601 UTC re-fire time |
| `created_at` | TEXT | When the snooze was set |

On app launch the reconciler sweeps this table: rows whose `fire_at_utc ≤ now` are fired immediately and deleted; future rows re-arm the in-process timer (desktop) or trust AlarmManager (Android). Rows are deleted on `cancel_reminder`, quest completion/abandonment, and quest deletion.

> [!warning] Superseded by implementation verification [[sources/2026-05-17-os-notifications-linux-sound-and-action-verification]] (2026-05-17)
> The older design said Snooze created no new Reminder row. Linux verification showed clicking Snooze 30m created a new reminder row with the new `due_at_utc` while retaining the original reminder row. Treat the implementation result as current behavior until a later design explicitly changes it.

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

Platform default was the original design [[sources/2026-04-21-notifications-grilling]], but Linux KDE Plasma 6 needed a direct sound workaround after DBus hints were ignored [[sources/2026-05-17-os-notifications-linux-sound-and-action-verification]].

- Android/macOS/Windows still rely on the OS/plugin notification sound path; cross-platform sound was not verified in the Linux session [[sources/2026-05-17-os-notifications-linux-sound-and-action-verification]].
- Linux plays a system sound directly with `paplay` from the `show_linux` thread before `notif.show()` [[sources/2026-05-17-os-notifications-linux-sound-and-action-verification]].
- Linux sound path order: `/usr/share/sounds/ocean/stereo/button-pressed.oga`, then `/usr/share/sounds/freedesktop/stereo/message-new-instant.oga` [[sources/2026-05-17-os-notifications-linux-sound-and-action-verification]].
- If `paplay` is unavailable, the spawn silently fails and no Linux fallback is implemented [[sources/2026-05-17-os-notifications-linux-sound-and-action-verification]].
- User mutes via per-platform OS settings (Android notification channels, macOS notification center, Linux DE settings, Windows Focus Assist).
- Android channel: `fini.reminders` at `IMPORTANCE_DEFAULT`.
- Vibration: TBD.

## Linux KDE dev setup

KDE Plasma 6 accepts DBus notifications without showing popups unless the app is registered as a desktop entry [[sources/2026-05-17-os-notifications-linux-debug-and-fixes]].

- Linux notifications set `notify_rust::Hint::DesktopEntry("Fini")` [[sources/2026-05-17-os-notifications-linux-debug-and-fixes]].
- Release bundles install `Fini.desktop`; dev machines running via `make dev` may need a one-time manual copy to `~/.local/share/applications/` [[sources/2026-05-17-os-notifications-linux-debug-and-fixes]].
- `auto_icon()` was removed from `show_linux` because it conflicted with explicit `.icon("fini")` [[sources/2026-05-17-os-notifications-linux-debug-and-fixes]].
- `fire_immediate` must not guard on `quest.due`; absolute-time reminders may be valid without that quest field, and the reconciler already filters due records before firing [[sources/2026-05-17-os-notifications-linux-debug-and-fixes]].

## Relationship to FocusHistory

The notification does not write [[FocusHistory]] directly [[sources/2026-04-21-notifications-grilling]].

- OS notification firing is **independent** of `focus_history`.
- `focus_history` rows for past fires are written by the main-process reconciler on next engagement, with `created_at` backdated to the original fire time. See [[FocusHistory]].
- Walkthrough:
  - 09:00 — user creates reminder for 10:00.
  - 10:00 — OS fires notification; no `focus_history` row yet.
  - 11:00 — user opens app; reconciler INSERTs `focus_history(quest_id=X, trigger='reminder', created_at='10:00')`; resolver now returns X.

## Open questions

Remaining TBDs after the 2026-05-16 implementation pass.

- **Linux closed-app delivery**: systemd-user timer approach deferred; current in-process `notify-rust` path dies with the app.
- **macOS / Windows resume bridges**: `NSWorkspaceDidWakeNotification` and `WM_POWERBROADCAST` listeners for wake-triggered reconciliation not yet wired.
- **Vibration defaults**: TBD per-platform.
- **Notification grouping**: one per reminder vs grouped by quest/space — TBD.
