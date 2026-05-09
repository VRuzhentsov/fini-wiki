# Context Menu Responsive Side Sheet Grilling

Date: 2026-05-05

## Context

The current Fini context menu can render outside the visible app area, especially for submenus. The requested redesign keeps Fini's mobile-first interaction model while making context menus robust in narrow app windows and quarter-screen desktop layouts.

## Summary

The context menu should stop behaving as a cursor-only floating popup. It should become a responsive side-sheet-like action surface whose side is chosen from the trigger location, whose width is bounded by app-window space, and whose submenus use a second-half layout when possible.

## Decisions

- The context menu should behave as a responsive side sheet, not just a clamped cursor popup.
- Fini remains mobile-first; the redesign should not introduce a separate desktop mental model.
- Main context menu max width should be `min(50% app window width, 240px)`.
- The `240px` cap comes from `1920 / 8`; `vw` is not the right basis because the app window itself may already be quarter-screen width.
- The menu should open on the nearest app side to the trigger.
- Trigger point should be hybrid: right-click uses the cursor coordinate, while three-dot/actions buttons use the trigger element center.
- Submenus should open in the second half of the app window when the main menu is opened on the left or right side.
- Submenus must never be bigger than the available second-half area and must not render outside the app viewport.
- If the app window is too narrow for main menu plus submenu to fit side-by-side at usable widths, the submenu should overlay or replace the main menu and provide back navigation.

## Plan

- Update the context menu state/API so callers can distinguish pointer-based right-click triggers from element-based action-button triggers, or pass enough trigger metadata to compute the correct anchor.
- Compute placement from app viewport dimensions, trigger point, and side choice instead of directly rendering at raw `event.clientX/Y`.
- Apply menu width as `min(50% app window width, 240px)`.
- Replace the current always-right submenu flyout with second-half submenu placement.
- Add the overlay/back fallback for narrow windows where two surfaces do not fit.
- Verify both current consumers: quest list rows and the active quest panel actions button.

## Evidence

- `src/composables/useContextMenu.ts:25-31` currently stores only raw `event.clientX/Y`, making the menu cursor-position driven.
- `src/components/ContextMenu.vue:59-64` currently renders the menu with fixed `top` and `left` styles from state.
- `src/components/ContextMenu.vue:96-100` currently sizes the menu with `width: min(18rem, calc(100vw - 1.5rem))`, which does not express the required `min(50% app window width, 240px)` behavior.
- `src/components/ContextMenu.vue:134-140` currently positions submenus at `left: calc(100% + 0.375rem)`, which can push them outside the app viewport.
- `src/components/ContextMenu.vue:150-186` has a breakpoint-based mobile bottom-sheet fallback, but it does not address quarter-screen desktop app windows or nearest-side side-sheet placement.
- `src/components/FocusView/ActiveQuestPanel.vue:21-41` and `src/components/QuestsView/QuestList.vue:31-58` both open context menus through the shared `useContextMenu()` composable.

## Open Questions

- Exact visual treatment of the overlay/back submenu state is not locked beyond requiring a clear back/parent affordance.
- Exact automated test level is not locked; the implementation ticket should decide whether component tests are enough or whether browser QA is also needed.
