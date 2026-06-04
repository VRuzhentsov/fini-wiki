---
title: 2026-05-19 Issue 28 Backup Import Export
type: source
created: 2026-05-21
updated: 2026-05-21
sources: [2026-05-19-issue-28-backup-import-export]
tags: [fini, backup, import, export, settings, cli]
claim_status: locked
evidence: source-backed
---

# 2026-05-19 Issue 28 Backup Import Export

Issue `VRuzhentsov/fini#28` was enriched from a two-word backup request into a full portable backup import/export contract for quests and spaces. The locked v1 format is a strict `.zip` containing exactly `manifest.json` and `fini-backup.sqlite`; import accepts only that format [[sources/2026-05-19-issue-28-backup-import-export]].

## Key claims

- Backup v1 includes selected spaces, quests in those spaces, and `quest_series` whose `space_id` is selected [[sources/2026-05-19-issue-28-backup-import-export]].
- Backup v1 excludes settings, device identity, paired devices, sync state, reminders, notification state, and focus history [[sources/2026-05-19-issue-28-backup-import-export]].
- No archive-level encryption or password protection is included in v1 [[sources/2026-05-19-issue-28-backup-import-export]].
- Settings UI owns a Backup section with `Export backup` and `Import backup` actions [[sources/2026-05-19-issue-28-backup-import-export]].
- Desktop and Android both use native document picker/save/open flows [[sources/2026-05-19-issue-28-backup-import-export]].
- Settings export shows a space checklist dialog that starts with no spaces checked and disables export until at least one space is selected [[sources/2026-05-19-issue-28-backup-import-export]].
- Settings import order is validate zip, map spaces, resolve item conflicts, then apply import [[sources/2026-05-19-issue-28-backup-import-export]].
- Built-in spaces are hidden during import mapping and automatically use matching built-in IDs [[sources/2026-05-19-issue-28-backup-import-export]].
- Missing custom spaces use one device-sync-style mapping dialog per incoming space: create new with the backup ID or map to an existing local space [[sources/2026-05-19-issue-28-backup-import-export]].
- Quest and quest-series conflicts use a generic `MergeConflictDialog`; each conflict must choose `Use local` or `Use backup` before apply [[sources/2026-05-19-issue-28-backup-import-export]].
- CLI export requires explicit `--space-id` values or `--all-spaces`; CLI import fails on conflicts by default and `--force` uses backup versions [[sources/2026-05-19-issue-28-backup-import-export]].

## Open questions

- Product decisions were locked, but technical implementation could still surface native document-picker/plugin choices [[sources/2026-05-19-issue-28-backup-import-export]].

## Related pages

- [[backup-import-export]]
- [[settings-ui]]
- [[CLI]]

updates:: [[pages/concepts/settings-ui]]
