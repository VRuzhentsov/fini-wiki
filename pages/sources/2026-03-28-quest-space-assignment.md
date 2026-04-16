---
title: Quest-Space Assignment
type: source
created: 2026-04-12
updated: 2026-04-12
sources: [2026-03-28-quest-space-assignment]
tags: [fini, quests, spaces, ui, filtering, draft]
---

# Quest-Space Assignment

Draft UI proposal for exposing existing backend `space_id` support in the frontend. The design introduces a top-level space picker that doubles as both quest-list filter and default space for new quests, plus a context-menu action for moving quests between spaces. This is a feature proposal, not a locked product baseline.

## Key claims

- `SpacePicker` would live in the menu bar and persist selection in localStorage.
- The selected space would act as both the active filter and the default `space_id` for new quests.
- Quest rows would gain a `Move to space` submenu that calls `updateQuest(id, { space_id })`.
- Filtering would apply to both the backlog view and the current Main/Focus view.
- No backend changes are required because `create_quest` and `update_quest` already accept `space_id`.

## Open questions

- How should this proposal interact with the newer `Focus` terminology in user-facing labels and view names?

## Related pages

- [[Space]]
- [[Quest]]
- [[mvp-baseline]]
