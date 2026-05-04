---
title: 2026-05-03 Settings List Device Identity Grilling
type: source
created: 2026-05-03
updated: 2026-05-03
sources: [2026-05-03-settings-list-device-identity-grilling]
tags: [fini, settings, device-connection, device-identity, ui, daisyui]
---

# 2026-05-03 Settings List Device Identity Grilling

Settings rows now have a locked primitive/layout contract, and device identity semantics are tightened so user-facing names remain labels while UUIDs remain hidden storage/route identity. The grilling also moves local device identity from deprecated `device_identity.json` into scalar SQLite `settings` rows (`device.id`, `device.name`) and treats the JSON file as migration input only [[sources/2026-05-03-settings-list-device-identity-grilling]].

## Key claims

- Settings-style rows should use `SettingsListGroup` as the grouped parent and `SettingsListItem` as the row primitive [[sources/2026-05-03-settings-list-device-identity-grilling]].
- Row content is either one-column or `start`/`end` two-column; leading/trailing accessories are fixed chrome outside those content columns [[sources/2026-05-03-settings-list-device-identity-grilling]].
- The end column aligns right and is capped at 50%; it is not a fixed 50/50 split, and two-column rows stay horizontal on narrow screens [[sources/2026-05-03-settings-list-device-identity-grilling]].
- DaisyUI/Tailwind tokens remain the primary styling mechanism. Vue templates should not branch on light/dark/system for styling; theme-specific behavior belongs in global `data-theme` and token layers [[sources/2026-05-03-settings-list-device-identity-grilling]].
- Device display names are labels, not identity. Normal Settings rows hide UUID/hash values, while UUIDs remain route/storage identity [[sources/2026-05-03-settings-list-device-identity-grilling]].
- Local identity is stored as scalar settings rows `device.id` and `device.name`; no combined JSON/blob identity value is stored in settings [[sources/2026-05-03-settings-list-device-identity-grilling]].
- Deprecated `device_identity.json` is migration input only: import legacy `device_id` when settings lacks `device.id`, prefer the current environment-derived name for `device.name`, then delete the JSON file after settings identity is valid [[sources/2026-05-03-settings-list-device-identity-grilling]].
- Existing settings identity wins over stale `device_identity.json`; when `device.id` already exists, delete the JSON file without importing it [[sources/2026-05-03-settings-list-device-identity-grilling]].
- Paired-device `display_name` is captured at pairing time and does not auto-update from later discovery names; duplicate display names are allowed [[sources/2026-05-03-settings-list-device-identity-grilling]].

## Implementation companion docs

These repo docs are companion references for code-level implementation context, not raw source citations:

- `../fini/specs/device-connect/README.md`
- `../fini/src/views/SettingsView.md`
- `../fini/src/views/DeviceView.md`
- `../fini/src/components/SettingsView/SettingsListItem.md`
- `../fini/src/components/SettingsView/SettingsListGroup.md`
- `../fini/src/components/SettingsView/AboutCard.md`

## Open questions

- Native-friendly device name lookup beyond `HOSTNAME` and `COMPUTERNAME` remains deferred [[sources/2026-05-03-settings-list-device-identity-grilling]].
- Editable paired-device display names remain deferred [[sources/2026-05-03-settings-list-device-identity-grilling]].

## Related pages

- [[DeviceConnection]]
- [[settings-ui]]
