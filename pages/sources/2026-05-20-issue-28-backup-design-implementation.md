---
title: 2026-05-20 Issue 28 Backup Design Implementation
type: source
created: 2026-05-21
updated: 2026-05-21
sources: [2026-05-20-issue-28-backup-design-implementation]
tags: [fini, backup, settings, design, implementation, frontend]
claim_status: provisional
evidence: source-backed
---

# 2026-05-20 Issue 28 Backup Design Implementation

The backup UI design pass refined and implemented frontend components for issue #28 after a prior agent had implemented backend, CLI, and first-pass Vue frontend. Backend was intentionally untouched; the refined frontend work was not yet committed to the main `fini` repo at capture time [[sources/2026-05-20-issue-28-backup-design-implementation]].

## Key claims

- Component naming now follows the design system: `BackupExportDialog` became `ExportSpacesDialog`, `BackupImportDialog` became `ImportSpaceMappingDialog`, and `MergeConflictDialog` kept its name [[sources/2026-05-20-issue-28-backup-design-implementation]].
- Import now opens the native file picker directly from the Settings row, then `useBackupImport` orchestrates mapping dialogs, conflict dialog, apply, and toast [[sources/2026-05-20-issue-28-backup-design-implementation]].
- `MapToExistingDialog` is shared between backup import and device-sync incoming-space resolution, with context-aware copy for `backup-space` vs `peer-space` [[sources/2026-05-20-issue-28-backup-design-implementation]].
- `useToast` now supports an optional action; export success uses `Open location` through `revealItemInDir(path)` [[sources/2026-05-20-issue-28-backup-design-implementation]].
- `MergeConflictDialog` is mobile-first, stacking Local/Backup columns on small screens and showing them side-by-side from `sm:` upward [[sources/2026-05-20-issue-28-backup-design-implementation]].
- `ExportSpacesDialog` adds Select-all/Clear-all, per-space swatches, quest counts, plaintext-data warning, and filename hint [[sources/2026-05-20-issue-28-backup-design-implementation]].
- Settings Backup rows are full-row clickable `SettingsListItem` buttons with lead icon, title, description, and chevron trailing [[sources/2026-05-20-issue-28-backup-design-implementation]].
- Verification passed `npm run build`, `npm run test:unit` with 43 passing tests, and `cargo test` with 71 passing tests [[sources/2026-05-20-issue-28-backup-design-implementation]].

## Open questions

- UI smoke via `make dev` was not yet run by the user [[sources/2026-05-20-issue-28-backup-design-implementation]].
- Android document picker flow remained untested [[sources/2026-05-20-issue-28-backup-design-implementation]].
- `MergeConflictDialog` meta-grid uses generic JSON key iteration and may need revisiting if backend returns structured conflict data later [[sources/2026-05-20-issue-28-backup-design-implementation]].

## Related pages

- [[backup-import-export]]
- [[settings-ui]]

updates:: [[pages/sources/2026-05-19-issue-28-backup-import-export]]
