---
title: Context Menu
type: concept
created: 2026-05-05
updated: 2026-05-16
sources: [2026-05-05-context-menu-responsive-side-sheet-grilling, 2026-05-10-context-menu-redesign-implementation-results, 2026-05-12-context-menu-component-design-handoff, 2026-05-14-context-menu-polish-pass-implementation, 2026-05-14-context-menu-cursor-anchored-placement]
tags: [fini, ui, interaction, context-menu, responsive, design]
claim_status: provisional
evidence: source-backed
---

# Context Menu

Fini's context menu should behave as a responsive side-sheet-like action surface rather than a raw cursor popup. The goal is to preserve one mobile-first interaction model across phone-width windows, quarter-screen desktop layouts, and wider app windows [[sources/2026-05-05-context-menu-responsive-side-sheet-grilling]].

The #21 placement redesign was implemented locally but not pushed or user-validated; #21 remains open until runtime validation [[sources/2026-05-10-context-menu-redesign-implementation-results]]. A newer design handoff led to PR #23's polish implementation: richer rows, inline accordion submenus, scrim, drag bottom sheet, and reduced-motion-aware animation [[sources/2026-05-12-context-menu-component-design-handoff]] [[sources/2026-05-14-context-menu-polish-pass-implementation]]. After that polish made the menu a compact floating surface, the user explicitly superseded #21's zone-based/corner-snapping placement with cursor-anchored wide placement [[sources/2026-05-14-context-menu-cursor-anchored-placement]].

## Placement

- Menu placement should be computed from app viewport dimensions, trigger point, and chosen side, not rendered directly at raw `event.clientX/Y` [[sources/2026-05-05-context-menu-responsive-side-sheet-grilling]].
- The menu should open on the nearest app side to the trigger [[sources/2026-05-05-context-menu-responsive-side-sheet-grilling]].
- Trigger point is hybrid: right-click uses cursor coordinates, while three-dot/action buttons use the trigger element center [[sources/2026-05-05-context-menu-responsive-side-sheet-grilling]].

> [!warning] Superseded by [[sources/2026-05-14-context-menu-cursor-anchored-placement]] (2026-05-14)
> Wide context menus should now anchor near the cursor or trigger element and shift only to avoid body/composer overflow. The mobile bottom sheet remains unchanged.

- Pointer triggers now place the menu at `(trigger.x, trigger.y)` and shift left/up only when necessary to stay inside body and bottom-inset bounds [[sources/2026-05-14-context-menu-cursor-anchored-placement]].
- Element triggers drop below the trigger rect, left-aligning or right-aligning based on available space and flipping above only when needed and enough room exists [[sources/2026-05-14-context-menu-cursor-anchored-placement]].
- Height measurement uses a first-frame row-count estimate and a post-`nextTick` measured height to avoid visible jump during the 160ms open animation [[sources/2026-05-14-context-menu-cursor-anchored-placement]].

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

> [!warning] Updated by [[sources/2026-05-14-context-menu-cursor-anchored-placement]] (2026-05-14)
> The polish implementation initially preserved #21 placement, but later user feedback changed wide placement to cursor/trigger anchoring.

## Implementation state

- Local commit `b8530fd feat: redesign context menu with side-sheet placement` implemented #21 but was not pushed [[sources/2026-05-10-context-menu-redesign-implementation-results]].
- Quest list and Focus active-quest menus now share `buildQuestMenu`, making quest action ordering and danger styling consistent [[sources/2026-05-10-context-menu-redesign-implementation-results]].
- `ActionsBtn` is the reusable 28px three-dot primitive for QuestEditor toolbar and Settings Spaces rows [[sources/2026-05-10-context-menu-redesign-implementation-results]].
- Outside-close now covers pointer/touch/contextmenu/wheel plus scroll and Escape, but `wheel` may need UX validation [[sources/2026-05-10-context-menu-redesign-implementation-results]].
- PR #23 extended `MenuItem` metadata, wired Heroicons and selected child rows, rewrote `ContextMenu.vue` around one row primitive and accordion submenus, added mobile drag-to-dismiss, and replaced older flyout/overlay tests with accordion tests [[sources/2026-05-14-context-menu-polish-pass-implementation]].
- Later PR #23 work removed `classifyZone()` and replaced quadrant/corner placement with cursor-anchored wide placement; focused ContextMenu tests passed 15/15 and `npm run build` passed [[sources/2026-05-14-context-menu-cursor-anchored-placement]].

## Consumers

- Current shared consumers include quest list rows and the active quest panel actions button through the shared context-menu composable [[sources/2026-05-05-context-menu-responsive-side-sheet-grilling]].
- Current shared consumers include quest list rows, Focus active quest panel, QuestEditor toolbar, and Settings Spaces rows [[sources/2026-05-10-context-menu-redesign-implementation-results]].

## Open questions

> [!question]
> Live visual verification via `make e2e-headed` remains pending for accordion, drag handle, cursor placement, kebab placement, and <640px behavior [[sources/2026-05-14-context-menu-polish-pass-implementation]] [[sources/2026-05-14-context-menu-cursor-anchored-placement]].

> [!question]
> PR #23 was not yet pushed or reviewed in the latest context-menu sources [[sources/2026-05-14-context-menu-polish-pass-implementation]] [[sources/2026-05-14-context-menu-cursor-anchored-placement]].

updates:: [[pages/sources/2026-05-05-context-menu-responsive-side-sheet-grilling]]
updates:: [[pages/sources/2026-05-10-context-menu-redesign-implementation-results]]
updates:: [[pages/sources/2026-05-14-context-menu-polish-pass-implementation]]
supersedes:: [[pages/sources/2026-05-05-context-menu-responsive-side-sheet-grilling]]
