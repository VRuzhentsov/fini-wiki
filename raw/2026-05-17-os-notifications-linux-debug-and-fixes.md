# OS Notifications — Linux Debug Session and Fixes

Date: 2026-05-17
Status: implementation result
Related: pages/concepts/os-notification.md, src-tauri/src/services/notification.rs, src-tauri/src/services/reconciler.rs

## Context

Manual testing session for Linux OS reminder notifications after the core implementation was complete. The goal was to fire a real notification (with Complete / Snooze 30m / Snooze 1d action buttons) on the dev machine (KDE Plasma 6 on Wayland) and confirm the full path from reconciler → `fire_immediate` → `show_linux` → notify-rust worked end to end.

## Summary

Three bugs were found and fixed. The root blocker was KDE Plasma 6's requirement for a registered `.desktop` file and `desktop-entry` hint before showing notification popups. All fixes are landed in `notification.rs` and `reconciler.rs`.

A parallel outcome: the dev workflow for populating test data was clarified — CLI is the correct path, not MCP/webview tools — and `fini-dev` SKILL.md was updated to enforce this.

## Decisions

1. **`fire_immediate` must not guard on `quest.due`**. The old guard `if quest.due.is_none() { return; }` silently skipped notifications for absolute-time reminders created directly with a `due_at_utc` without a `due` field on the quest. Removed unconditionally; the reconciler already filters by `due_at_utc <= now` before calling `fire_immediate`.

2. **`Hint::DesktopEntry("Fini")` is required on Linux for KDE Plasma 6**. Without it, KDE routes notifications from unrecognised processes to the notification center without any popup. This affects `notify-rust` calls from the app and `notify-send` from the terminal equally. The hint tells Plasma to look up `Fini.desktop` and show a proper popup.

3. **`auto_icon()` removed from `show_linux`**. It conflicted with the explicit `.icon("fini")` call and was unnecessary.

4. **`Fini.desktop` must be installed to `~/.local/share/applications/` on dev machines**. KDE Plasma 6 requires the `.desktop` file to exist to recognise the app. In `make dev` (no install step), this must be done manually once per machine. The file is copied from the release bundle path `src-tauri/target/release/bundle/appimage/Fini.AppDir/Fini.desktop`.

5. **CLI-created reminders do not fire in a running app**. The CLI runs as a separate process; in-process tokio timers die when the CLI exits. The correct dev test flow is:
   - Create quest + past-due reminder via CLI (`fini quest create --due ... --due-time ...` + `fini reminder create --type absolute --due-at-utc <past>`)
   - Restart the app (`make dev`)
   - The reconciler fires past-due reminders immediately during `setup()`, before the window is visible, so the OS notification appears during app startup

6. **No MCP tooling for dev data population**. MCP/webview tools are not available in this repo's workflow. All app interaction for dev/testing goes through the `fini` CLI. `fini-dev` SKILL.md updated with a new "Dev Data Population And Feature Exercise" section and routing table row.

## Evidence

### Bugs traced and fixed

**Bug 1 — `fire_immediate` silently exits for absolute reminders**

```rust
// Before (notification.rs):
pub fn fire_immediate(...) {
    if quest.due.is_none() {
        return;  // absolute reminders with no quest.due field skipped here
    }
    ...
}

// After:
pub fn fire_immediate(...) {
    let body = format!("{} · {}", quest.title, space.name);
    show_now(app, &reminder.id, &quest.id, &body);
}
```

Discovered by: reconciler showed `already_recorded=true` on second run (focus_history was written by the first run), meaning `fire_immediate` WAS called but notification was silently dropped. The first run's test quest had no `quest.due` field.

**Bug 2 — KDE Plasma 6 ignores notifications without `desktop-entry` hint**

Confirmed by:
- `notify-send "test" "hello"` from user terminal: not visible
- `gdbus call ... Notify "Fini" ... [] {} 5000`: not visible (ID returned, accepted by daemon)
- `GetServerInformation` returned `('Plasma', 'KDE', '6.6.4', '1.2')` — daemon running
- `GetAll` returned `Inhibited: false` — Do Not Disturb off
- No `Fini.desktop` in `/usr/share/applications/` or `~/.local/share/applications/`
- After installing `Fini.desktop` + adding `desktop-entry` hint: popup appeared

Fix applied:
```rust
notif
    .summary("Fini")
    .body(&body_owned)
    .icon("fini")
    .hint(notify_rust::Hint::DesktopEntry("Fini".to_string()))
    .action(ACTION_COMPLETE, "Complete")
    .action(ACTION_SNOOZE_30M, "Snooze 30m")
    .action(ACTION_SNOOZE_1D, "Snooze 1d");
// removed: .auto_icon()
```

Manual setup required once per dev machine:
```bash
cp src-tauri/target/release/bundle/appimage/Fini.AppDir/Fini.desktop ~/.local/share/applications/
update-desktop-database ~/.local/share/applications/
```

**Bug 3 — `focus_history_exists` caused double-skip on repeated app restarts**

After the first run fixed bug 1 and called `fire_immediate`, the reconciler wrote a `focus_history` row. On the second restart the reconciler found `already_recorded=true` and skipped, so repeated restarts couldn't re-test. Pattern for re-testing:
```bash
sqlite3 ~/.local/share/fini/fini.db \
  "DELETE FROM focus_history WHERE quest_id = '<id>';"
```

### Debug tooling added and removed

Temporary `eprintln!` added to `reconciler.rs` and `notification.rs` to trace the path; all removed after root cause confirmed.

### `show_linux` thread isolation confirmed working

The `std::thread::spawn` + local `tokio::runtime::Builder::new_current_thread()` approach (introduced to fix a prior panic: "no reactor running" when called from non-async context) is working correctly. Thread starts, runtime builds, `notif.show()` returns `Ok`, `wait_for_action` blocks waiting for user interaction.

### Dev test CLI sequence used

```bash
# Create past-due quest + reminder
PAST_DATE=$(date -u -d '-5 minutes' '+%Y-%m-%d')
PAST_TIME=$(date -u -d '-5 minutes' '+%H:%M')
PAST_UTC=$(date -u -d '-5 minutes' '+%Y-%m-%dT%H:%M:%SZ')

QUEST_ID=$(fini quest create \
  --title "Take pills" \
  --space-id "37f697c2-8350-4825-a887-d309576443f2" \
  --due "$PAST_DATE" \
  --due-time "$PAST_TIME" \
  --json | python3 -c "import sys,json; print(json.load(sys.stdin)['id'])")

fini reminder create \
  --quest-id "$QUEST_ID" \
  --type absolute \
  --due-at-utc "$PAST_UTC" \
  --json

# Restart app — notification fires during reconciler in setup()
make dev
```

### fini-dev SKILL.md changes

Added to routing table:
```
| Populate data, seed state, or exercise a feature against the running/installed app for dev or testing | fini-cli |
```

Added new section "Dev Data Population And Feature Exercise":
- CLI is the only supported automation surface against the app
- No MCP/webview tooling for data population
- Use UI for visual confirmation of results only

Added to Verification Defaults:
- "Manual feature verification or scenario setup: drive state via fini-cli; reserve the UI for visual confirmation of the result."

## Open Questions

- **`Fini.desktop` not installed on Android or Windows/macOS**: the `DesktopEntry` hint is Linux-only (`#[cfg(target_os = "linux")]`); already scoped correctly. No action needed on other platforms.
- **Release builds**: the RPM/DEB/AppImage bundles install `Fini.desktop` as part of packaging. This issue is dev-machine-only.
- **Action button handling on KDE**: confirmed the notification appears with action buttons. Full round-trip test (click Complete → quest completes, Snooze → re-schedules) not yet done in this session.
- **Linux closed-app delivery** remains deferred (systemd-user timer approach); current in-process notify-rust path dies with the app.
