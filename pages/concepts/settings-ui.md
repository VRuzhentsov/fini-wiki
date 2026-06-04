---
title: Settings UI
type: concept
created: 2026-05-03
updated: 2026-06-03
sources: [2026-05-03-settings-list-device-identity-grilling, 2026-05-19-issue-28-backup-import-export, 2026-05-20-issue-28-backup-design-implementation, 2026-05-21-search-in-settings-ticket, 2026-05-23-memory-qmd-feature-flag-addendum]
tags: [fini, settings, ui, daisyui, tailwind, device-connection, backup, search, memory]
---

# Settings UI

Fini's Settings UI now has a list-row contract that keeps row layout predictable while preserving DaisyUI/Tailwind as the styling source of truth [[sources/2026-05-03-settings-list-device-identity-grilling]].

## Row primitives

- Settings sections use `SettingsListGroup` as the grouped row parent [[sources/2026-05-03-settings-list-device-identity-grilling]].
- Individual settings rows use `SettingsListItem` as the primitive [[sources/2026-05-03-settings-list-device-identity-grilling]].
- Row content is either one-column or two-column via `start` and `end` slots [[sources/2026-05-03-settings-list-device-identity-grilling]].
- Leading and trailing accessories are fixed chrome outside the content columns, not extra content columns [[sources/2026-05-03-settings-list-device-identity-grilling]].
- The `end` column aligns right and is capped at 50%; settings rows are not a fixed 50/50 split [[sources/2026-05-03-settings-list-device-identity-grilling]].
- Two-column rows stay horizontal on narrow screens [[sources/2026-05-03-settings-list-device-identity-grilling]].

## Interaction rules

- Navigation rows can be whole-row links [[sources/2026-05-03-settings-list-device-identity-grilling]].
- Rows containing nested controls remain passive containers rather than nested interactive links [[sources/2026-05-03-settings-list-device-identity-grilling]].
- The theme row displays `Theme / System`; only the end-side plain value and chevron opens the menu [[sources/2026-05-03-settings-list-device-identity-grilling]].

## Styling rules

- DaisyUI/Tailwind utility tokens such as `bg-base-100`, `bg-base-200`, and `text-error` remain the primary styling mechanism [[sources/2026-05-03-settings-list-device-identity-grilling]].
- Theme styling should flow through the app's global `data-theme` mechanism and CSS/token layers [[sources/2026-05-03-settings-list-device-identity-grilling]].
- Vue templates should not branch on light/dark/system for styling [[sources/2026-05-03-settings-list-device-identity-grilling]].
- Semantic/custom CSS should stay minimal and secondary, only where a component-level primitive needs it [[sources/2026-05-03-settings-list-device-identity-grilling]].

## Device rows

- Device rows show display name plus `Online` or `Offline` [[sources/2026-05-03-settings-list-device-identity-grilling]].
- Normal Settings rows hide UUID/hash values because [[DeviceConnection]] treats UUIDs as route/storage identity, not visible label text [[sources/2026-05-03-settings-list-device-identity-grilling]].

## Backup section

Settings owns the user-facing [[backup-import-export]] surface [[sources/2026-05-19-issue-28-backup-import-export]].

- The Backup section has two visible actions: `Export backup` and `Import backup` [[sources/2026-05-19-issue-28-backup-import-export]].
- Backup rows are full-row clickable `SettingsListItem` buttons with leading icon, title, description, and trailing chevron [[sources/2026-05-20-issue-28-backup-design-implementation]].
- Export uses `ExportSpacesDialog`; import uses native file picker first and then `ImportSpaceMappingDialog`/`MergeConflictDialog` orchestration through `useBackupImport` [[sources/2026-05-20-issue-28-backup-design-implementation]].
- `MapToExistingDialog` is shared between backup import and `IncomingSpaceResolutionDialog` device-sync mapping [[sources/2026-05-20-issue-28-backup-design-implementation]].

## Settings search ticket

The first Settings search ticket is scoped to the `/settings` overview only [[sources/2026-05-21-search-in-settings-ticket]].

- Search filters sections/rows in place while typing [[sources/2026-05-21-search-in-settings-ticket]].
- Matching is client-side, case-insensitive, and covers visible labels plus useful descriptive copy [[sources/2026-05-21-search-in-settings-ticket]].
- Empty query restores the full Settings overview; no matches shows a clear empty state [[sources/2026-05-21-search-in-settings-ticket]].
- Spaces, Devices, Theme, Backup, About, and Voice Model if present are in scope [[sources/2026-05-21-search-in-settings-ticket]].
- Device display names and Online/Offline labels can match, but hidden UUIDs/storage identities are not searched or surfaced [[sources/2026-05-21-search-in-settings-ticket]].
- `/settings/add-device`, `/settings/device/:id`, global app search, backend search, and layout redesign are out of scope [[sources/2026-05-21-search-in-settings-ticket]].

## Memory feature toggle

Settings must expose [[memory]] enable/disable control when the Memory feature ships [[sources/2026-05-23-memory-qmd-feature-flag-addendum]].

- Disabling Memory hides the Memory tab and stops Memory indexing/background updates [[sources/2026-05-23-memory-qmd-feature-flag-addendum]].
- Disabling Memory does not delete completed quest History or generated Memory data unless a separate destructive reset/delete action is chosen [[sources/2026-05-23-memory-qmd-feature-flag-addendum]].
- Settings copy should explain that disabling Memory stops graph/search features without deleting completed quest history [[sources/2026-05-23-memory-qmd-feature-flag-addendum]].

## Implementation companion docs

These repo docs are companion references for code-level implementation context, not raw source citations:

- `../fini/src/views/SettingsView.md`
- `../fini/src/views/DeviceView.md`
- `../fini/src/components/SettingsView/SettingsListItem.md`
- `../fini/src/components/SettingsView/SettingsListGroup.md`
- `../fini/src/components/SettingsView/AboutCard.md`
- `../fini/specs/backup/README.md`
