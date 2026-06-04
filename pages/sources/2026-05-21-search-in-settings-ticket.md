---
title: 2026-05-21 Search In Settings Ticket
type: source
created: 2026-05-21
updated: 2026-05-21
sources: [2026-05-21-search-in-settings-ticket]
tags: [fini, settings, search, ticket]
claim_status: locked
evidence: source-backed
---

# 2026-05-21 Search In Settings Ticket

This source records the ticket handoff for first-version Settings search. Scope is intentionally narrow: add client-side search to the `/settings` overview, search visible Settings overview content only, and filter sections/rows in place while typing [[sources/2026-05-21-search-in-settings-ticket]].

## Key claims

- First version searches the Settings overview route only [[sources/2026-05-21-search-in-settings-ticket]].
- Search filters sections/rows in place instead of using a separate jump list or highlight-only results [[sources/2026-05-21-search-in-settings-ticket]].
- Search covers visible labels and useful descriptive copy, not hidden IDs [[sources/2026-05-21-search-in-settings-ticket]].
- Matching is case-insensitive and empty query restores the full Settings overview [[sources/2026-05-21-search-in-settings-ticket]].
- Included overview content: Spaces, Devices, Theme, Backup, About, and Voice Model if present [[sources/2026-05-21-search-in-settings-ticket]].
- Device display names and Online/Offline labels may match; device UUIDs must not be surfaced or searched as visible Settings text [[sources/2026-05-21-search-in-settings-ticket]].
- Out of scope: `/settings/add-device`, `/settings/device/:id`, global app search, backend search/indexing, and Settings layout redesign [[sources/2026-05-21-search-in-settings-ticket]].
- Implementation should preserve `SettingsListGroup`, `SettingsListItem`, DaisyUI/Tailwind token-first styling, and no light/dark/system branching in Vue templates [[sources/2026-05-21-search-in-settings-ticket]].

## Open questions

- None blocking for the ticket; the selected scope is overview-only, filter-in-place search [[sources/2026-05-21-search-in-settings-ticket]].

## Related pages

- [[settings-ui]]

updates:: [[pages/concepts/settings-ui]]
