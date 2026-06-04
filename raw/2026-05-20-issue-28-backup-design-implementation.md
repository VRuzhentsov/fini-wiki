# Issue 28 Backup — Design Finalization & Frontend Implementation

Date: 2026-05-20
Status: implementation result
Related: https://github.com/VRuzhentsov/fini/issues/28 · branch `issue-28-backup-import-export` · prior raw: `2026-05-19-issue-28-backup-import-export.md` · design bundle: `https://api.anthropic.com/v1/design/h/NUhudJy9_HfivwLV9rP2ng` (synced to `~/projects/fini-design/`, commit `39f8db7`)

## Context

Backend, CLI, and a first-pass Vue frontend for Issue 28 (portable backup import/export) were implemented by a prior codex agent (verified: 71 Rust tests, 30 FE tests, build passing). That work was committed to the design bundle (`fini-design`) but NOT yet committed to fini.

This session: synced a new design bundle from claude.ai/design containing chat5 (backup UI refinements), applied the refined design to all frontend components, resolved two scope decisions with the user, and wrote new specs. Backend untouched.

## Decisions

**Component names follow the design system.** Old names (BackupExportDialog, BackupImportDialog) replaced with design-system names (ExportSpacesDialog, ImportSpaceMappingDialog). MergeConflictDialog kept (matches design).

**Import flow restructured.** The old BackupImportDialog (a modal with a "Choose file" button and contents preview) was removed. Import now triggers the native open picker directly from the Settings row, then drives ImportSpaceMappingDialog(s) and MergeConflictDialog directly. Orchestration lifted into `useBackupImport` composable.

**MapToExistingDialog is shared.** The user confirmed scope: MapToExistingDialog replaces the select-dropdown in IncomingSpaceResolutionDialog (device-sync) in addition to the backup import flow. Props: `context: { kind: "backup-space" | "peer-space", name }` phrases the copy correctly for each consumer.

**Toast "Open location" action implemented.** `useToast` extended with optional `action?: { label, onClick }`. ToastStack renders a trailing action button. Export success passes `revealItemInDir(path)` via `@tauri-apps/plugin-opener` (already in `opener:default` capability — includes `allow-reveal-item-in-dir`).

**MergeConflictDialog is mobile-first.** Stacks Local/Backup vertically on small screens; side-by-side at `sm:` breakpoint. Kind-pill (Quest / Quest series), selected-pill (Keeping local / Using backup), meta-grid with diff highlight derived from `local`/`backup` JSON, auto-advance to next unresolved after pick (220ms), `‹ n of N ›` wizard pager, "N remaining" hint, Apply button shows count when all resolved.

**ExportSpacesDialog additions.** Select-all/Clear-all toggle, per-space swatch (CSS var from SPACE_COLOR_CLASS), quest count per space from questStore, plaintext-data warning block, filename hint in footer.

**ImportSpaceMappingDialog.** Choice cards for Create and Map to existing with descriptions. Footer: Cancel (ghost) | Map to existing (default) | Create (primary). Counter badge when total > 1. "Map to existing" opens MapToExistingDialog as nested overlay.

**Settings BackupSection.** Full-row clickable SettingsListItem (button prop) with lead icon (download/upload SVG), title + description text, chevron trailing. Matches design sli pattern. Help text added above the group.

## Plan / What Was Implemented

### New files (fini repo, not committed)
- `src/components/MapToExistingDialog.vue` — reusable space picker; radio rows, swatch, shortUuid, context-aware header copy
- `src/components/SettingsView/ExportSpacesDialog.vue` — redesigned export dialog
- `src/components/SettingsView/ImportSpaceMappingDialog.vue` — new space mapping dialog
- `src/composables/useBackupImport.ts` — import orchestration: open picker → preflight loop → mapping dialogs → conflict dialog → apply → toast

### Modified (fini repo, not committed)
- `src/components/SettingsView/MergeConflictDialog.vue` — major redesign in-place
- `src/composables/useToast.ts` — ToastAction support
- `src/components/ToastStack.vue` — trailing action button rendering
- `src/views/SettingsView.vue` — backup section redesign; import/export wired to new components
- `src/components/DeviceView/IncomingSpaceResolutionDialog.vue` — select dropdown replaced with MapToExistingDialog; added `showMapPicker` ref, `createAndConfirm()`, `mapToExistingAndConfirm(spaceId)` helpers; removed `onSelectExistingSpace`

### Deleted
- `src/components/SettingsView/BackupExportDialog.vue`
- `src/components/SettingsView/BackupImportDialog.vue`

### Tests (fini repo, not committed)
- `src/spec/components/ExportSpacesDialog.spec.ts` (renamed from BackupExportDialog.spec.ts; updated mocks + added select-all test)
- `src/spec/components/MergeConflictDialog.spec.ts` (updated: `›` nav button, Apply text, kind-pill test)
- `src/spec/components/ImportSpaceMappingDialog.spec.ts` (new: 3-button footer, choice cards, counter, Create emits resolve)
- `src/spec/components/MapToExistingDialog.spec.ts` (new: radio rows, Map disabled until selection, peer-space copy, empty state)

### Design bundle (fini-design repo, committed as `39f8db7`)
- Synced from `https://api.anthropic.com/v1/design/h/NUhudJy9_HfivwLV9rP2ng`
- Adds: `chats/chat5.md`, `project/backup/` (App.jsx, BackupDialogs.jsx, MergeConflictDialog.jsx, styles.css, Backup.html), `project/preview/toast.html`

## Evidence

```
npm run build (vue-tsc --noEmit && vite build): ✓ built in 1.48s, 463 modules
npm run test:unit: 43 passed, 0 failed (8 suites)
cargo test (src-tauri/): 71 passed, 0 failed
```

Token mapping applied: design `b-btn primary` → `btn-primary`, `b-btn ghost` → `btn-ghost`, `b-btn xs ghost` → `btn btn-ghost btn-xs`, swatch = `background-color: var(--space-color-*)` or `oklch(var(--bc) / 0.35)` fallback, kind-pill = `badge badge-sm badge-primary|badge-secondary`.

## Open Questions

- UI smoke (`make dev`) not yet run by user — native picker dialogs, toast "Open location", and device-sync MapToExistingDialog need visual verification before committing.
- Android document picker flow untested (no device validation run this session).
- MergeConflictDialog meta-grid is derived by iterating `local`/`backup` JSON keys (first 6 non-id fields). Diff highlight keys on mismatched values. If backend returns structured conflict data in future, revisit.
- Commit excludes: `.agents/skills/fini-dev/SKILL.md` and `src-tauri/src/services/notification.rs` (unrelated concurrent changes per handoff).
