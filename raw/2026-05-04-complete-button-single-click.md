# Complete Button Single Click

Date: 2026-05-04

## Context

The user asked to drop the hold feature on the Complete button so completing the active Focus quest is a normal single click.

## Summary

The active quest Complete button should complete immediately on click. The hold-to-confirm affordance should remain out of the Complete path.

## Decisions

- Change the Complete button in `src/components/FocusView/ActiveQuestPanel.vue` from pointer hold behavior to single-click behavior.
- Keep the Abandon and More actions scoped out of this change unless separately requested.
- Preserve the existing `completeQuest()` write path, which updates the quest status to `"completed"` through `store.updateQuest`.

## Plan

1. Update the Complete button markup to use `@click="completeQuest"`.
2. Remove the Complete button's hold-specific aria label and pointer handlers.
3. Simplify hold helper logic if it only remains needed for Abandon.
4. Verify with the narrowest useful frontend check.

## Evidence

- Current hold behavior is implemented in `src/components/FocusView/ActiveQuestPanel.vue` through `startHold(action, event)` and `endHold(event)`.
- The Complete button currently calls `startHold('complete', $event)` on pointer down and only completes after the hold timer.
- `src/components/FocusView/ActiveQuestPanel.md` already says Complete sets `status = "completed"` and that actions call `updateQuest` directly with one-click behavior.

## Open Questions

None.
