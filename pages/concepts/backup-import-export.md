---
title: Backup Import Export
type: concept
created: 2026-05-21
updated: 2026-06-03
sources: [2026-05-19-issue-28-backup-import-export, 2026-05-20-issue-28-backup-design-implementation, 2026-06-03-pr-36-focus-enter-count-product-and-design-result]
tags: [fini, backup, import, export, settings, cli]
claim_status: locked
evidence: source-backed
---

# Backup Import Export

Portable backup import/export for Fini quests and spaces, scoped by GitHub issue `VRuzhentsov/fini#28` [[sources/2026-05-19-issue-28-backup-import-export]].

uses:: [[pages/concepts/settings-ui]]
uses:: [[pages/concepts/CLI]]
derived_from:: [[pages/sources/2026-05-19-issue-28-backup-import-export]]
updates:: [[pages/sources/2026-05-20-issue-28-backup-design-implementation]]

## Format

Backup v1 is a strict `.zip` containing exactly `manifest.json` and `fini-backup.sqlite`; import accepts only that v1 zip shape [[sources/2026-05-19-issue-28-backup-import-export]].

> [!warning] Updated by [[sources/2026-06-03-pr-36-focus-enter-count-product-and-design-result]] (2026-06-03)
> PR #36 bumped the backup version explicitly for `focus_enter_count`, rather than silently accepting older backups whose quest schema cannot represent the new field.

- `manifest.json` records format, version, app version, exported timestamp, exported domains, space IDs/names, and counts [[sources/2026-05-19-issue-28-backup-import-export]].
- No archive-level encryption or password protection is included in v1 [[sources/2026-05-19-issue-28-backup-import-export]].
- Import rejects non-v1 or malformed files [[sources/2026-05-19-issue-28-backup-import-export]].

## Data scope

Backup is intentionally portable domain data, not a clone of the full runtime database [[sources/2026-05-19-issue-28-backup-import-export]].

Included:

- Selected spaces [[sources/2026-05-19-issue-28-backup-import-export]].
- Quests in selected spaces, across active, completed, and abandoned statuses [[sources/2026-05-19-issue-28-backup-import-export]].
- `quest_series` rows whose `space_id` is selected [[sources/2026-05-19-issue-28-backup-import-export]].

Excluded:

- Settings [[sources/2026-05-19-issue-28-backup-import-export]].
- Device identity, paired devices, and sync state [[sources/2026-05-19-issue-28-backup-import-export]].
- Reminders, notification state, and focus history [[sources/2026-05-19-issue-28-backup-import-export]].

## Settings UI flow

Settings owns the user-facing backup section, with two visible actions: `Export backup` and `Import backup` [[sources/2026-05-19-issue-28-backup-import-export]].

- Export uses a native save/create-document flow on desktop and Android [[sources/2026-05-19-issue-28-backup-import-export]].
- Import uses a native open-document flow restricted to `.zip` [[sources/2026-05-19-issue-28-backup-import-export]].
- The refined frontend triggers import by opening the native file picker directly from the Settings row; `useBackupImport` then orchestrates mapping, conflicts, apply, and toast feedback [[sources/2026-05-20-issue-28-backup-design-implementation]].
- Export success can expose an `Open location` toast action through `revealItemInDir(path)` [[sources/2026-05-20-issue-28-backup-design-implementation]].

## Export selection

Settings export uses a space checklist dialog [[sources/2026-05-19-issue-28-backup-import-export]].

- Checklist starts with no spaces selected [[sources/2026-05-19-issue-28-backup-import-export]].
- Export is disabled until at least one space is selected [[sources/2026-05-19-issue-28-backup-import-export]].
- The refined `ExportSpacesDialog` adds Select-all/Clear-all, per-space swatches, quest counts, plaintext-data warning, and filename hint [[sources/2026-05-20-issue-28-backup-design-implementation]].

## Import mapping

Settings import order is validate zip, map spaces, resolve item conflicts, then apply in one transaction [[sources/2026-05-19-issue-28-backup-import-export]].

- Built-in spaces are hidden during import mapping and automatically use matching built-in IDs [[sources/2026-05-19-issue-28-backup-import-export]].
- Incoming custom space IDs that already exist locally reuse that same ID without a mapping dialog [[sources/2026-05-19-issue-28-backup-import-export]].
- Missing custom space IDs show one device-sync-style mapping dialog per incoming space [[sources/2026-05-19-issue-28-backup-import-export]].
- Users choose `Create new` or select an existing local space; `Create new` uses the backup space ID [[sources/2026-05-19-issue-28-backup-import-export]].
- `MapToExistingDialog` is now shared between backup import and device-sync incoming-space resolution [[sources/2026-05-20-issue-28-backup-design-implementation]].

## Conflict resolution

Backup is the first consumer of a generic `MergeConflictDialog` [[sources/2026-05-19-issue-28-backup-import-export]].

- Conflicts are shown as Local vs Backup [[sources/2026-05-19-issue-28-backup-import-export]].
- Column actions include `Copy`, `Show`, and final `Use local` / `Use backup`; there is no separate `Skip` action [[sources/2026-05-19-issue-28-backup-import-export]].
- Every conflict must be resolved before apply [[sources/2026-05-19-issue-28-backup-import-export]].
- The refined dialog is mobile-first, stacks Local/Backup vertically on small screens, and shows columns side-by-side from the `sm:` breakpoint [[sources/2026-05-20-issue-28-backup-design-implementation]].
- Current meta-grid is derived from `local`/`backup` JSON fields; revisit if backend later returns structured conflict data [[sources/2026-05-20-issue-28-backup-design-implementation]].

## CLI contract

- CLI export requires explicit `--space-id` values or explicit `--all-spaces` [[sources/2026-05-19-issue-28-backup-import-export]].
- CLI import does no space mapping; it imports as-is by IDs [[sources/2026-05-19-issue-28-backup-import-export]].
- CLI import fails on conflicts by default [[sources/2026-05-19-issue-28-backup-import-export]].
- CLI import `--force` resolves conflicts by using backup versions [[sources/2026-05-19-issue-28-backup-import-export]].

## Implementation status

As of the 2026-05-20 capture, backend/CLI/first-pass frontend were implemented by a prior agent, the refined frontend design was applied, and verification passed `npm run build`, 43 frontend unit tests, and 71 Rust tests [[sources/2026-05-20-issue-28-backup-design-implementation]].

> [!question]
> UI smoke via `make dev`, native picker dialogs, toast `Open location`, device-sync `MapToExistingDialog`, and Android document picker behavior were not yet user-validated [[sources/2026-05-20-issue-28-backup-design-implementation]].

## Deferred

- Archive encryption/password support [[sources/2026-05-19-issue-28-backup-import-export]].
- Automatic or scheduled backups [[sources/2026-05-19-issue-28-backup-import-export]].
- Backup history UI [[sources/2026-05-19-issue-28-backup-import-export]].
- Cloud backup [[sources/2026-05-19-issue-28-backup-import-export]].
