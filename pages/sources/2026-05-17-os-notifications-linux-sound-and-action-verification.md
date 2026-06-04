---
title: 2026-05-17 OS Notifications Linux Sound and Action Verification
type: source
created: 2026-05-21
updated: 2026-05-21
sources: [2026-05-17-os-notifications-linux-sound-and-action-verification]
tags: [fini, notifications, linux, kde, sound, reminders]
claim_status: locked
evidence: source-backed
---

# 2026-05-17 OS Notifications Linux Sound and Action Verification

The follow-up Linux notification session verified Complete and Snooze actions end to end, then fixed missing sound by playing a system sound directly with `paplay` because KDE Plasma 6 ignored `sound-name` and urgency DBus hints for third-party notification calls [[sources/2026-05-17-os-notifications-linux-sound-and-action-verification]].

## Key claims

- Clicking Complete on a Linux OS notification set the quest `status` to `completed` and populated `completed_at` in SQLite [[sources/2026-05-17-os-notifications-linux-sound-and-action-verification]].
- Clicking Snooze 30m created a new reminder row with `due_at_utc = now + 30m`; the original reminder row was retained [[sources/2026-05-17-os-notifications-linux-sound-and-action-verification]].
- KDE Plasma 6 ignores `Hint::SoundName` and `Hint::Urgency::Critical` for third-party DBus notifications unless app-specific KNotify configuration exists [[sources/2026-05-17-os-notifications-linux-sound-and-action-verification]].
- Linux sound now uses fire-and-forget `paplay` from the `show_linux` thread, before `notif.show()` [[sources/2026-05-17-os-notifications-linux-sound-and-action-verification]].
- The selected sound is `/usr/share/sounds/ocean/stereo/button-pressed.oga`, with `/usr/share/sounds/freedesktop/stereo/message-new-instant.oga` as fallback [[sources/2026-05-17-os-notifications-linux-sound-and-action-verification]].
- Temporary debug `eprintln!` statements were removed from `notification.rs` before commit [[sources/2026-05-17-os-notifications-linux-sound-and-action-verification]].

## Open questions

- macOS/Windows notification sound behavior was not verified in this session [[sources/2026-05-17-os-notifications-linux-sound-and-action-verification]].
- Systems without `paplay` silently get no direct Linux sound fallback [[sources/2026-05-17-os-notifications-linux-sound-and-action-verification]].
- Re-arming snoozed reminders on next launch was not explicitly re-tested [[sources/2026-05-17-os-notifications-linux-sound-and-action-verification]].

## Related pages

- [[os-notification]]
- [[Reminder]]

updates:: [[pages/sources/2026-05-17-os-notifications-linux-debug-and-fixes]]
updates:: [[pages/concepts/os-notification]]
