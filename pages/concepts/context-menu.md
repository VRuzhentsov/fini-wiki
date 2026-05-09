---
title: Context Menu
type: concept
created: 2026-05-05
updated: 2026-05-05
sources: [2026-05-05-context-menu-responsive-side-sheet-grilling]
tags: [fini, ui, interaction, context-menu, responsive]
---

# Context Menu

Fini's context menu should behave as a responsive side-sheet-like action surface rather than a raw cursor popup. The goal is to preserve one mobile-first interaction model across phone-width windows, quarter-screen desktop layouts, and wider app windows [[sources/2026-05-05-context-menu-responsive-side-sheet-grilling]].

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

## Consumers

- Current shared consumers include quest list rows and the active quest panel actions button through the shared context-menu composable [[sources/2026-05-05-context-menu-responsive-side-sheet-grilling]].
