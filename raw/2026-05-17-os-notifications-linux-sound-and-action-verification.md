# OS Notifications — Linux Sound Fix and Action Button Verification

Date: 2026-05-17
Status: implementation result
Related: raw/2026-05-17-os-notifications-linux-debug-and-fixes.md, src-tauri/src/services/notification.rs

## Context

Continuation of the Linux OS notification testing session. The previous doc covered KDE Plasma 6 popup registration (desktop-entry hint + .desktop file) and the fire_immediate guard bug. This session continued with:
1. Verifying the Complete action button marks the quest as completed end-to-end.
2. Diagnosing the absence of notification sound.
3. Fixing sound by playing a system sound file directly via paplay.

## Summary

The Complete action button was confirmed working: clicking Complete on the "Call dentist" notification set `quests.status = 'completed'` and `completed_at` in the database. The Snooze action was also confirmed to create a new reminder row with the correct `due_at_utc`.

Sound was not playing despite `Hint::Urgency(notify_rust::Urgency::Critical)` being set. KDE Plasma 6's plasmashell notification daemon ignores the `sound-name` and urgency DBus hints for third-party apps not registered through knotify. The fix was to play the sound directly from the `show_linux` thread via `paplay`, bypassing the notification daemon. The user selected `button-pressed.oga` from the KDE ocean sound theme.

All temporary debug `eprintln!` statements were removed from `notification.rs` before committing.

## Decisions

1. **Complete action confirmed working end-to-end.** Clicking Complete on the OS notification sets `quests.status = 'completed'` and `completed_at`. No code change needed.

2. **Snooze action confirmed working.** Clicking Snooze 30m creates a new reminder row with `due_at_utc = now + 30m` and removes the in-process timer for the original reminder. The original reminder row is retained.

3. **Sound via paplay, not DBus hint.** `Hint::SoundName` and `Hint::Urgency::Critical` are both ignored by KDE Plasma 6's notification daemon for third-party DBus notifications. Fix: call `std::process::Command::new("paplay").arg(path).spawn()` inside the `show_linux` thread, fire-and-forget, before `notif.show()`.

4. **Sound file: `button-pressed.oga` from ocean theme.** User selected this from the full list of ocean theme sounds. Fallback path is `/usr/share/sounds/freedesktop/stereo/message-new-instant.oga` for systems without the ocean theme.

5. **`SoundName` hint removed.** It was added during debugging but confirmed ineffective; removed to keep the hint list clean.

6. **Debug `eprintln!`s removed.** Lines removed from `notification.rs`:
   - `[notification] fire_immediate: quest=... reminder=...` in `fire_immediate`
   - `[notification] show_linux thread running` at thread start
   - `[notification] calling notif.show()` before show
   - `[notification] show succeeded, waiting for action` after Ok

## Evidence

### Complete action round-trip

Test quest: "Call dentist" (`c5444927-fd98-4168-87d9-87d7eabac88e`), Test Space.

Before click:
```
status = active | completed_at = NULL
```

After clicking Complete on the OS notification:
```sql
SELECT status, completed_at FROM quests WHERE id='c5444927-fd98-4168-87d9-87d7eabac88e';
-- completed | 2026-05-17T06:32:38Z
```

### Snooze action round-trip

Clicking Snooze 30m created reminder `0fc01474-7e5a-44c4-990f-2b8e6d23a87a` with `due_at_utc = 2026-05-17T10:05:00Z` (~30 min from action time). Original reminder `58dd9386` was retained.

### Sound fix — final code in show_linux

```rust
// KDE Plasma 6 ignores the sound-name DBus hint for third-party apps,
// so play the system notification sound directly via paplay.
for path in &[
    "/usr/share/sounds/ocean/stereo/button-pressed.oga",
    "/usr/share/sounds/freedesktop/stereo/message-new-instant.oga",
] {
    if std::path::Path::new(path).exists() {
        let _ = std::process::Command::new("paplay").arg(path).spawn();
        break;
    }
}
```

### Why SoundName hint doesn't work on KDE Plasma 6

KDE's plasmashell notification daemon implements the freedesktop DBus notification spec but routes sound for third-party apps through knotify, which requires per-app configuration in System Settings → Notifications. Apps not registered via knotify (like notify-rust DBus calls) receive no sound regardless of the `sound-name` hint or urgency level.

### Listing and auditioning all ocean theme sounds

```bash
for f in /usr/share/sounds/ocean/stereo/*.oga; do echo "▶ $(basename $f)"; paplay "$f"; sleep 0.5; done
```

User chose `button-pressed.oga` after listening to all 44 available sounds.

## Open Questions

- **Cross-platform sound**: The `paplay` path is Linux-only (inside `#[cfg(target_os = "linux")]` via `show_linux`). macOS/Windows use the plugin path (`show_plugin`) which relies on the OS notification system for sound — not verified in this session.
- **Systems without paplay**: If `paplay` is not installed (e.g. non-PipeWire/PulseAudio Linux), the spawn silently fails and no sound plays. No fallback is currently implemented.
- **Ocean theme availability**: The ocean theme is KDE's default. The `freedesktop` fallback covers non-KDE systems. No other distributions were tested.
- **Action button round-trip on Snooze**: Snooze creates the new reminder row correctly. The in-process timer re-arm for the snoozed reminder (via `rearm_snoozed_reminders` on next launch) was not explicitly re-tested in this session.
