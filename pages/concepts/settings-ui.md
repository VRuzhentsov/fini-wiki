---
title: Settings UI
type: concept
created: 2026-05-03
updated: 2026-05-03
sources: [2026-05-03-settings-list-device-identity-grilling]
tags: [fini, settings, ui, daisyui, tailwind, device-connection]
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

## Implementation companion docs

These repo docs are companion references for code-level implementation context, not raw source citations:

- `../fini/src/views/SettingsView.md`
- `../fini/src/views/DeviceView.md`
- `../fini/src/components/SettingsView/SettingsListItem.md`
- `../fini/src/components/SettingsView/SettingsListGroup.md`
- `../fini/src/components/SettingsView/AboutCard.md`
