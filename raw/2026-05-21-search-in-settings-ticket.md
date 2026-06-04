# Search In Settings Ticket

Date: 2026-05-21
Status: ticket handoff
Related: `src/views/SettingsView.md`, `src/views/SettingsView.vue`, `src/components/SettingsView/SettingsListItem.md`, `src/components/SettingsView/SettingsListGroup.md`, `../fini-wiki/pages/concepts/settings-ui.md`

## Context

The user requested a new ticket titled "Search in Settings" and asked to use `grill-with-docs` plus ticket creation. Repo and wiki context show that Settings is the configuration surface for Spaces, Devices, Theme, Backup, About, and documented Voice Model controls. `src/views/SettingsView.md` already says Settings search is planned later and should index the Spaces section.

Settings UI must preserve the locked row contract from `SettingsListGroup` and `SettingsListItem`: grouped rows, one-column or `start`/`end` row content, fixed leading/trailing chrome, DaisyUI/Tailwind token-first styling, and no light/dark/system branching in templates.

## Summary

Create a feature ticket for a first version of Settings search on the `/settings` overview. The user selected the recommended scope: search visible Settings overview content only, and filter sections/rows in place while typing. Device detail and add-device routes stay out of scope.

## Decisions

- First version searches Settings overview only.
- Search filters sections/rows in place rather than showing a separate jump list or highlight-only result.
- Create both a GitHub issue and this wiki raw handoff.
- Use existing GitHub labels only; `enhancement` is available and appropriate.

## Ticket Draft

# Search in Settings

## Context

Settings is the configuration surface for Spaces, Devices, Theme, Backup, About, and documented Voice Model controls. `src/views/SettingsView.md` already notes that Settings search is planned and should index the Spaces section.

Settings UI must preserve the existing row contract from `SettingsListGroup` and `SettingsListItem`: grouped rows, one-column or start/end row content, fixed leading/trailing chrome, DaisyUI/Tailwind token-first styling, and no light/dark/system branching in templates.

## User Story

As a Fini user, I want to search the Settings overview so that I can quickly find settings rows without scanning every section manually.

## Scope

- Add a search input to `/settings`.
- Search visible Settings overview content only.
- Include current overview sections and rows:
- Spaces
- Devices
- Theme
- Backup
- About
- Voice Model if it is present in the implemented Settings UI
- Filter sections/rows in place while typing.
- Show a clear empty state when no settings match.
- Preserve existing Settings row primitives and token-first styling.

## Out Of Scope

- Searching `/settings/add-device`.
- Searching `/settings/device/:id` detail pages.
- Global app search.
- Backend search/indexing.
- Searching hidden UUIDs or storage identities.
- Redesigning Settings layout beyond the search affordance.

## Behavior Rules

- Search is client-side and scoped to the Settings overview route.
- Matching should be case-insensitive.
- Matching should cover visible labels and useful descriptive copy, not hidden IDs.
- Empty query restores the full Settings overview.
- Filtering should not break existing row interactions such as edit, delete, add device, backup import/export, or theme controls.

## Acceptance Criteria

- Given the user is on `/settings`, when they type a query matching a section or row label, only matching Settings content remains visible.
- Given the query is empty, all Settings overview sections and rows are visible.
- Given the query has no matches, a no-results state is shown.
- Spaces are included in the searchable Settings content.
- Device display names and Online/Offline labels can match, but device UUIDs are not surfaced or searched as visible Settings text.
- Existing Settings interactions still work after filtering.
- Styling uses existing DaisyUI/Tailwind tokens and Settings row primitives.

## Implementation Notes

- Likely primary file: `src/views/SettingsView.vue`.
- Companion doc to update: `src/views/SettingsView.md`.
- Preserve `SettingsListGroup` and `SettingsListItem` usage.
- Consider deriving searchable row metadata in `SettingsView.vue` rather than introducing a broad abstraction.
- Avoid backend changes unless implementation evidence shows a current Settings item cannot be represented client-side.

## Verification

- Add or update frontend unit coverage for Settings search if a Settings view test exists or is introduced.
- Run `npm run test:unit` for unit coverage.
- Run `npm run build` or the narrowest available frontend type/build check to catch Vue/TS issues.
- Manual check on `/settings`: empty query, matching Spaces, matching Devices, matching Backup, no-results state, and restored full list after clearing search.

## Evidence

- `src/views/SettingsView.md`: Settings route and section documentation; line 25 says Settings search is planned and should index Spaces.
- `src/views/SettingsView.vue`: current overview sections and interactions.
- `src/components/SettingsView/SettingsListItem.md`: row layout/interaction rules.
- `src/components/SettingsView/SettingsListGroup.md`: grouped row visual contract.
- `../fini-wiki/pages/concepts/settings-ui.md`: Settings UI row primitive, interaction, styling, and UUID visibility rules.

## Open Questions

- None blocking. First version is scoped to the Settings overview and filters sections/rows in place.

## Evidence

- Wiki hot cache confirms Settings rows use `SettingsListGroup` and `SettingsListItem`, row content stays one-column or start/end two-column, fixed chrome stays outside content columns, and styling remains DaisyUI/Tailwind token-first.
- `src/views/SettingsView.md` documents Spaces, Devices, Backup, About, Voice Model, and future Theme context for Settings.
- User selected "Settings overview only" and "Filter sections in place" during grilling.

## Open Questions

- None blocking for ticket creation.
