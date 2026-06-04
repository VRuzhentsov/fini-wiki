# Feature Plane And Devtools Boundary

Date: 2026-05-28
Status: raw capture
Related: PR #41, issue #6, branch `fix/6-runner-owned-e2e`, prior raw docs `2026-05-27-runner-owned-multi-actor-e2e-plan.md`, `2026-05-28-runner-owned-e2e-implementation-result.md`

## Context

During the PR #41 stabilization work, a warning-clean feature-plane split incorrectly gated several DB/domain services behind `ui-plane`. The user corrected this direction: warnings should not be silenced by hiding shared product code from the CLI. The fix should wire shared domain code into the right surfaces instead.

## Summary

Fini should treat CLI and UI as first-class surfaces over a shared DB/domain/service core. The CLI must keep DB support and should expose product state changes for quests, reminders, backup, spaces, device pairing, and sync where command groups exist. UI-specific code should be limited to runtime adapters such as Tauri commands, Tauri managed state, OS notification delivery, native theme application, windows/plugins, and Playwright/dev-only automation hooks.

`devtools` is not a separate product plane. It means a dev build is the production app plus extra development/test affordances. Product behavior must not depend on `devtools`; test/control hooks such as Playwright socket permissions and notification test observers stay `devtools`-only.

## Decisions

- Shared core is the default: DB, quests, reminders, backup, spaces, sync/device state should be available to both CLI and UI.
- `ui-plane` is for UI/runtime adapters, not for hiding domain services.
- `devtools` means production app plus development/test affordances.
- Playwright socket/capabilities and test observer/dispatch helpers remain `devtools`-only.
- Reminder is core product state. Notification delivery is UI-plane runtime behavior.
- `DbState` is a misleading name for the Tauri-managed connection wrapper. Rename it to `AppDbConnection`.
- `AppDbConnection` remains UI/Tauri-specific; actual DB path/open/migration helpers and service functions remain shared.
- Device/sync CLI command groups should be wired to shared core instead of returning `not implemented`.
- Settings should split persistent settings core from UI-only native theme application/watch behavior.
- Correct the already-pushed branch with a new forward commit instead of rewriting PR history.
- Add targeted CLI coverage for newly wired or corrected shared operations after implementation builds cleanly.

## Plan

1. Revert the wrong boundary, not the whole PR: keep notification delivery UI-gated, but remove incorrect `ui-plane` gating from shared DB/domain/service code.
2. Split adapters from core: shared functions take `&mut SqliteConnection`, plain inputs, paths, and IDs; UI wrappers call them through `AppDbConnection`; CLI handlers call them through `open_db_at_path` or existing CLI runtime context.
3. Rename `DbState` to `AppDbConnection` to clarify that it is the desktop/Tauri managed DB connection wrapper, not the DB layer itself.
4. Wire missing CLI usage: preserve backup shared core, ensure reminder CLI uses reminder core without notification delivery, and connect device/sync CLI commands to shared core.
5. Keep `devtools` narrow: Playwright plugin/capabilities, test notification observers, and runner hooks only.
6. Add targeted CLI E2E coverage for newly wired CLI paths.
7. Verify with warning-clean CLI/UI builds, targeted CLI E2E, and full `make pre-release-check` before push.

## Evidence

- Current CLI already defines backup, reminder, device, and sync command groups in `src-tauri/src/services/cli.rs`.
- Backup already has shared core functions such as `export_backup` and CLI usage via `handle_backup`; Tauri wrappers are adapter functions.
- `src-tauri/src/services/db.rs` currently contains shared DB helpers (`db_default_path`, `open_db_at_path`) and a Tauri-managed wrapper currently named `DbState`.
- `src-tauri/src/services/reminder.rs` already shows the desired split pattern in part: DB-only helpers (`upsert_reminder_db`, `delete_reminder_db`) and UI notification-delivery helpers that need `AppHandle`.
- Prior verification before this correction passed `make pre-release-check` with E2E `29 passed (1.4m)`, but the architecture needs correction because the feature-plane boundaries were wrong.

## Open Questions

None for the correction scope. Future work may decide which diagnostics beyond Playwright/test hooks should ship in production, but the current default is devtools-only for automation/control hooks.
