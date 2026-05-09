---
title: 2026-05-04 Complete Button Single Click
type: source
created: 2026-05-04
updated: 2026-05-04
sources: [2026-05-04-complete-button-single-click]
tags: [fini, focus, ui, actions]
---

# 2026-05-04 Complete Button Single Click

The active Focus quest's Complete button should complete immediately on click. Hold-to-confirm is no longer part of the Complete path; the change is scoped to Complete and keeps the existing `completeQuest()` write path intact [[sources/2026-05-04-complete-button-single-click]].

## Key claims

- The Complete button in `src/components/FocusView/ActiveQuestPanel.vue` should change from hold behavior to single-click behavior [[sources/2026-05-04-complete-button-single-click]].
- Abandon and More actions remain out of scope unless separately requested [[sources/2026-05-04-complete-button-single-click]].
- The existing `completeQuest()` write path through `store.updateQuest` stays intact [[sources/2026-05-04-complete-button-single-click]].
- Existing companion docs already describe Complete as one-click behavior, so the implementation should realign the component with that documented contract [[sources/2026-05-04-complete-button-single-click]].

## Open questions

- None stated directly in the source.

## Related pages

- [[focus-view-daisyui-redesign]]
- [[settings-ui]]
