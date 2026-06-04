---
title: 2026-05-17 OS Notifications Linux Debug and Fixes
type: source
created: 2026-05-21
updated: 2026-05-21
sources: [2026-05-17-os-notifications-linux-debug-and-fixes]
tags: [fini, notifications, linux, kde, reminders, cli]
claim_status: locked
evidence: source-backed
---

# 2026-05-17 OS Notifications Linux Debug and Fixes

The Linux notification debug session found and fixed three blockers in the real reconciler-to-notify path on KDE Plasma 6: `fire_immediate` wrongly skipped absolute reminders without `quest.due`, KDE required a registered desktop entry hint plus installed `Fini.desktop`, and `auto_icon()` conflicted with explicit icon selection [[sources/2026-05-17-os-notifications-linux-debug-and-fixes]].

## Key claims

- `fire_immediate` must not guard on `quest.due`; the reconciler already filters by `due_at_utc <= now` before firing [[sources/2026-05-17-os-notifications-linux-debug-and-fixes]].
- Linux KDE Plasma 6 requires `notify_rust::Hint::DesktopEntry("Fini")` plus an installed `Fini.desktop` file for visible popups from dev builds [[sources/2026-05-17-os-notifications-linux-debug-and-fixes]].
- `auto_icon()` was removed from `show_linux` because it conflicted with explicit `.icon("fini")` and was unnecessary [[sources/2026-05-17-os-notifications-linux-debug-and-fixes]].
- Release bundles install `Fini.desktop`; the manual copy to `~/.local/share/applications/` is a dev-machine requirement for `make dev` style workflows [[sources/2026-05-17-os-notifications-linux-debug-and-fixes]].
- CLI-created reminders do not fire from the CLI process itself because in-process timers die when the CLI exits; the dev test path is create data via `fini` CLI, then restart the app so launch reconciliation fires past-due reminders [[sources/2026-05-17-os-notifications-linux-debug-and-fixes]].
- Dev data population and feature exercise should go through the `fini` CLI, not MCP/webview tooling [[sources/2026-05-17-os-notifications-linux-debug-and-fixes]].

## Open questions

- Full round-trip action-button testing was not completed in this session [[sources/2026-05-17-os-notifications-linux-debug-and-fixes]].
- Linux closed-app delivery remains deferred; the current in-process `notify-rust` path dies with the app [[sources/2026-05-17-os-notifications-linux-debug-and-fixes]].

## Related pages

- [[os-notification]]
- [[Reminder]]

updates:: [[pages/concepts/os-notification]]
updates:: [[pages/concepts/Reminder]]
