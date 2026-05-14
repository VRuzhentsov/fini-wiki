---
title: Context Menu
type: concept
created: 2026-05-05
updated: 2026-05-05
updated: 2026-05-13
sources: [2026-05-05-context-menu-responsive-side-sheet-grilling, 2026-05-10-context-menu-redesign-implementation-results, 2026-05-12-context-menu-component-design-handoff]
tags: [fini, ui, interaction, context-menu, responsive, design]
claim_status: provisional
evidence: source-backed
---

# Context Menu

Fini's context menu should behave as a responsive side-sheet-like action surface rather than a raw cursor popup. The goal is to preserve one mobile-first interaction model across phone-width windows, quarter-screen desktop layouts, and wider app windows [[sources/2026-05-05-context-menu-responsive-side-sheet-grilling]].

The #21 placement redesign was implemented locally but not pushed or user-validated; #21 remains open until runtime validation [[sources/2026-05-10-context-menu-redesign-implementation-results]]. A newer design handoff keeps the placement direction but asks for visual polish: richer rows, inline accordion submenus, scrim, drag bottom sheet, and reduced-motion-aware animation [[sources/2026-05-12-context-menu-component-design-handoff]].

## Placement

- Menu placement should be computed from app viewport dimensions, trigger point, and chosen side, not rendered directly at raw `event.clientX/Y` [[sources/2026-05-05-context-menu-responsive-side-sheet-grilling]].
- The menu should open on the nearest app side to the trigger [[sources/2026-05-05-context-menu-responsive-side-sheet-grilling]].
- Trigger point is hybrid: right-click uses cursor coordinates, while three-dot/action buttons use the trigger element center [[sources/2026-05-05-context-menu-responsive-side-sheet-grilling]].

## Size

- Main menu width should be `min(50% app window width, 240px)` [[sources/2026-05-05-context-menu-responsive-side-sheet-grilling]].
- Width should be bounded by app-window space, not browser `vw`, because Fini may already be running in a narrow app window [[sources/2026-05-05-context-menu-responsive-side-sheet-grilling]].

## Submenus

- Submenus should use the second half of the app window when the main menu is on the left or right side [[sources/2026-05-05-context-menu-responsive-side-sheet-grilling]].
- Submenus must never exceed the available second-half area or render outside the app viewport [[sources/2026-05-05-context-menu-responsive-side-sheet-grilling]].
- If the window is too narrow for both surfaces side-by-side at usable widths, the submenu should overlay or replace the main menu and provide back navigation [[sources/2026-05-05-context-menu-responsive-side-sheet-grilling]].

> [!warning] Superseded by [[sources/2026-05-12-context-menu-component-design-handoff]] (2026-05-12)
> The side-by-side/fallback submenu model was implemented in #21, but the next design pass asks to replace flyouts and overlay screens with one inline accordion picker model across widths.

## Polish direction

- Rows should become a composable primitive with optional leading icon, title, secondary text, badge/count, spinner, checkmark, chevron, danger tint, disabled state, separators, focus-visible, selected, loading, hover, and pressed states [[sources/2026-05-12-context-menu-component-design-handoff]].
- Submenus should become inline accordion pickers with indented radio rows and current-selection checkmarks [[sources/2026-05-12-context-menu-component-design-handoff]].
- The surface should preserve #21 nearest-side placement rules but add scrim, bottom-sheet drag-to-dismiss, and reduced-motion fallbacks [[sources/2026-05-12-context-menu-component-design-handoff]].
- Tokens stay DaisyUI 5 + Tailwind 4; light/dark differences belong in tokens rather than markup branches [[sources/2026-05-12-context-menu-component-design-handoff]].

## Implementation state

- Local commit `b8530fd feat: redesign context menu with side-sheet placement` implemented #21 but was not pushed [[sources/2026-05-10-context-menu-redesign-implementation-results]].
- Quest list and Focus active-quest menus now share `buildQuestMenu`, making quest action ordering and danger styling consistent [[sources/2026-05-10-context-menu-redesign-implementation-results]].
- `ActionsBtn` is the reusable 28px three-dot primitive for QuestEditor toolbar and Settings Spaces rows [[sources/2026-05-10-context-menu-redesign-implementation-results]].
- Outside-close now covers pointer/touch/contextmenu/wheel plus scroll and Escape, but `wheel` may need UX validation [[sources/2026-05-10-context-menu-redesign-implementation-results]].

## Consumers

- Current shared consumers include quest list rows and the active quest panel actions button through the shared context-menu composable [[sources/2026-05-05-context-menu-responsive-side-sheet-grilling]].
- Current shared consumers include quest list rows, Focus active quest panel, QuestEditor toolbar, and Settings Spaces rows [[sources/2026-05-10-context-menu-redesign-implementation-results]].

## Open questions

> [!question]
> The newer polish brief leaves icon choices, accordion highlight/indent/open behavior, bottom-sheet max height, danger hover token, pressed feedback, and drag-dismiss threshold open for design resolution [[sources/2026-05-12-context-menu-component-design-handoff]].

> [!question]
> The local #21 implementation still needs user runtime validation before the issue closes or the local commit is pushed [[sources/2026-05-10-context-menu-redesign-implementation-results]].

updates:: [[pages/sources/2026-05-05-context-menu-responsive-side-sheet-grilling]]
updates:: [[pages/sources/2026-05-10-context-menu-redesign-implementation-results]]
