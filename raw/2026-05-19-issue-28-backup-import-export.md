# Issue 28 Backup Import/Export Plan

Date: 2026-05-19
Status: raw capture | ticket handoff
Related: GitHub issue #28, `https://github.com/VRuzhentsov/fini/issues/28`

## Context

The user asked to enrich and implement GitHub issue 28. The issue originally contained only:

- Title: `Backup`
- Body: `Full import/export`

This planning pass clarified the product and engineering contract before implementation. Implementation was intentionally deferred; the docs step updated GitHub issue 28 and saved this raw wiki capture.

## Summary

Issue 28 is now scoped as portable backup import/export for Fini quests and spaces. The backup format is a strict `.zip` containing exactly `manifest.json` and `fini-backup.sqlite`. Import accepts only that format. The feature spans Settings UI, Android and desktop document picker flows, CLI commands, selected-space export, import space mapping, and a generic conflict-resolution dialog.

The backup is not an exact clone of every local runtime table. It includes selected spaces, quests in those spaces, and selected-space quest series. It excludes settings, device identity, paired devices, sync state, reminders, notification state, and focus history.

## Decisions

- Backup file extension and container: `.zip`.
- Zip contents: exactly `manifest.json` and `fini-backup.sqlite`.
- Import accepts only this v1 zip format.
- No archive-level encryption or password protection in v1.
- Manifest records format, version, app version, exported timestamp, exported domains, space IDs/names, and counts.
- Settings UI owns the user-facing backup section.
- Settings has two visible actions: `Export backup` and `Import backup`.
- Desktop and Android both use native document picker/save/open flows.
- Android v1 uses document picker/create-document style flows.
- CLI is in v1 scope.
- CLI export requires explicit `--space-id` values or explicit `--all-spaces`.
- CLI import does no space mapping; it imports as-is by IDs.
- CLI import fails on conflicts by default.
- CLI import `--force` overrides conflicts by using backup versions.
- Settings export shows a space checklist dialog.
- Export checklist starts with no spaces checked.
- Export is disabled until at least one space is selected.
- Export includes all quest statuses in selected spaces: active, completed, and abandoned.
- Export includes `quest_series` whose `space_id` is selected.
- Settings import order: validate zip, map spaces, resolve item conflicts, apply import.
- Built-in spaces are hidden during import mapping and automatically use matching built-in IDs.
- If an incoming custom space ID already exists locally, no mapping dialog is shown; import uses that same ID.
- If an incoming custom space ID does not exist locally, show one device-sync-style mapping dialog for that space.
- For unmapped custom spaces, the user chooses `Create new` or selects an existing local space to map.
- `Create new` uses the backup space ID.
- Selecting an existing local space assigns imported quests and quest series from that backup space to the selected local space ID.
- Generic `MergeConflictDialog` is included in issue 28 and backup is its first consumer.
- Conflict dialog is a two-column wizard: `Local` and `Backup`.
- Conflict dialog column actions: `Copy`, `Show`, and lowest action button `Use local` or `Use backup`.
- `Skip` is not a separate action; `Use local` covers that behavior.
- Conflict dialog counter appears in the top-right corner and uses short format such as `3/10`.
- Every conflict must choose `Use local` or `Use backup` before apply.
- User-facing terminology should use `relations` for normal data relationships, not links/dependencies/refs.

## Plan

1. Add `specs/backup/README.md` with the backup format, export/import behavior, UI contract, CLI contract, conflict behavior, and validation rules.
2. Add backend backup service for zip/SQLite export, validation, preflight, and import.
3. Add Tauri commands for Settings UI.
4. Add CLI backup commands.
5. Add generic `MergeConflictDialog`.
6. Add export space checklist dialog.
7. Reuse or adapt the existing device-sync-style one-space mapping dialog for backup import.
8. Add Settings Backup section.
9. Add tests across backend, frontend, and CLI e2e surfaces.

## Acceptance Criteria Captured In Issue

- Settings has a Backup section with `Export backup` and `Import backup`.
- Settings export uses a native save/create-document flow.
- Settings import uses a native open-document flow restricted to `.zip`.
- Android Settings import/export uses document picker/create-document style flows.
- Export checklist starts with no spaces selected.
- Export button is disabled until at least one space is selected.
- Export writes a `.zip` containing exactly `manifest.json` and `fini-backup.sqlite`.
- Export includes only selected spaces, their quests, and selected-space quest series.
- Import rejects any file that is not the v1 backup zip format.
- Import maps custom incoming spaces one at a time using the device-sync-style mapping pattern.
- Built-in spaces are auto-mapped and hidden from mapping.
- Existing local custom space IDs are reused without mapping.
- Missing custom space IDs require create-new or map-to-existing choice.
- Quest and quest-series conflicts use the generic `MergeConflictDialog`.
- Conflict dialog uses two columns: Local and Backup.
- Conflict dialog uses `Use local` / `Use backup` as the lowest column buttons.
- Conflict dialog includes `Copy` and `Show` actions per column.
- Conflict dialog shows the short top-right counter, for example `3/10`.
- CLI export requires `--space-id` or `--all-spaces`.
- CLI import fails on conflicts by default.
- CLI import `--force` uses backup versions for conflicts.
- Import applies changes in one transaction.
- After Settings import succeeds, app state refreshes and user stays on Settings.

## Evidence

- GitHub issue 28 was fetched with `gh issue view 28 --json number,title,state,body,labels,assignees,comments,url`; original title/body were `Backup` and `Full import/export`.
- Fini is local-first/no-cloud per `README.md` lines 45-46.
- Current SQLite app DB path is `fini.db` under app data per `src-tauri/src/services/db.rs` lines 26-33 and 78-82.
- Current schema tables were inspected in `src-tauri/src/schema.rs` lines 1-178.
- Existing Settings UI uses `SettingsListGroup` and `SettingsListItem` in `src/views/SettingsView.vue` and `src/views/SettingsView.md`.
- Existing device-sync custom-space mapping pattern lives in `src/components/DeviceView/IncomingSpaceResolutionDialog.vue`.
- CLI command structure lives in `src-tauri/src/services/cli.rs`.
- Issue 28 was updated with `gh issue edit 28 --title "Backup: portable zip import/export for quests and spaces" --body-file "/var/tmp/fini-issue-28-backup-body.md"`.

## Open Questions

No product decisions were left open in this planning pass. Implementation may still surface technical API choices, especially which Tauri/document-picker capabilities or plugins are required for Android and desktop file selection.

## Deferred Work

- Actual implementation.
- Full wiki ingestion into `pages/**`, `_hot.md`, `_index.md`, or `log.md`.
- Archive encryption/password support.
- Automatic or scheduled backups.
- Backup history UI.
- Cloud backup.
