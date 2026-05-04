# Settings List And Device Identity Grilling

Date: 2026-05-03

## Context

The Settings UI was being refactored around a new Settings list row rule. During grilling, the scope expanded from row layout into device identity semantics because visible rows were mixing user-facing names with UUID/hash identity.

## Summary

Settings rows should use one-column or start/end two-column layout, with fixed chrome allowed outside the content columns. Device display names are labels, not identity. UUIDs remain storage and route identity, but normal Settings rows should not combine names and hashes. Local device identity should move from deprecated `device_identity.json` into scalar rows in the existing SQLite `settings` table.

## Decisions

- Use `SettingsListGroup` as the grouped row parent.
- Use `SettingsListItem` as the row primitive.
- Row content is exactly one-column or two-column via `start` and `end` slots.
- Leading and trailing accessories are fixed chrome outside the content column rule.
- The `end` column aligns right and is capped at 50%; it is not a fixed 50/50 split.
- Two-column rows stay horizontal on narrow screens.
- Navigation rows can be whole-row links; rows containing nested controls remain passive containers.
- Theme row displays `Theme / System`; only the end-side plain value and chevron opens the menu.
- Theme styling should use the global `data-theme` mechanism plus DaisyUI/Tailwind tokens. Vue templates should not branch on light/dark/system for styling.
- DaisyUI/Tailwind utility tokens such as `bg-base-100`, `bg-base-200`, and `text-error` are acceptable and should remain the primary styling mechanism.
- Semantic/custom CSS should be minimal and secondary, used only when a component-level primitive needs it.
- Device rows hide hashes and show display name plus `Online` or `Offline`.
- All normal Settings rows hide UUID/hash values.
- UUID remains the primary key and route/storage identity.
- Duplicate device display names are allowed.
- Local device name follows the current env-derived OS name.
- Saved paired-device `display_name` remains the pairing-time label and does not auto-update from later discovery name changes.
- Local identity is stored as scalar settings rows: `device.id` and `device.name`.
- No combined JSON/blob identity value is stored in settings.
- Existing settings identity wins over deprecated `device_identity.json`.
- If settings lacks `device.id`, import only the JSON `device_id`, use current env name for `device.name`, then delete the JSON file.
- If settings already has `device.id`, delete stale `device_identity.json` without importing it.

## Plan

Implementation is split into two phases:

1. Device identity storage and naming:
   - Make settings helpers reusable inside backend services.
   - Load or create identity from SQLite settings.
   - Migrate legacy JSON UUID when needed.
   - Refresh local device name from `HOSTNAME` or `COMPUTERNAME` with fallback.
   - Delete deprecated JSON after settings identity is valid.
   - Add targeted backend tests for create, migrate, and settings-wins behavior.

2. Settings UI row primitives:
   - Add `SettingsListGroup` and `SettingsListItem`.
   - Refactor `/settings`, `/settings/add-device`, and `/settings/device/:id` settings-style rows.
   - Remove visible short UUID/hash display from Settings rows.
   - Keep utility-token styling; avoid template-level theme comparisons.
   - Update companion docs and device-connect spec.

## Evidence

- Existing `src/main.ts` already centralizes runtime theme through `data-theme`, browser/native theme sync, and backend theme hint commands.
- Existing `src/style.css` already owns CSS variables and dark/light token values.
- Existing `src-tauri/src/services/device_connection/runtime.rs` stored local identity in `device_identity.json`.
- Existing `src-tauri/migrations/00000000000014_settings/up.sql` provides a scalar `settings(key, value)` table.
- Existing `src-tauri/src/schema.rs` has `paired_devices(peer_device_id)` as primary key.
- Existing `src-tauri/src/services/device_connection/runtime.rs` advertises mDNS TXT `name` and stable `devid`; wiki context says TXT metadata is untrusted and peers are keyed by stable `device_id`.
- Verification during implementation: `cargo test services::device_connection::runtime::tests::load_or_create_identity --lib` passed.
- Verification during implementation: `npm run build` passed.
- Verification during implementation: grep found no Vue template `themeMode ===`, `theme ===`, `dark ?`, or `light ?` comparisons.
- Verification during implementation: grep found no `shortDeviceId` or `shortUuid` usage under `src/views/*.vue`.

## Open Questions

- A future wiki-repo ingestion skill should synthesize this raw source into `pages/**`, `_hot.md`, `_index.md`, and `log.md` when desired.
- Native-friendly device name lookup beyond `HOSTNAME` and `COMPUTERNAME` remains deferred.
- Editable paired-device display names remain deferred.
