---
title: 2026-05-05 Context Menu Responsive Side Sheet Grilling
type: source
created: 2026-05-05
updated: 2026-05-05
sources: [2026-05-05-context-menu-responsive-side-sheet-grilling]
tags: [fini, context-menu, ui, responsive, interaction]
---

# 2026-05-05 Context Menu Responsive Side Sheet Grilling

Fini's context menu should stop acting like a cursor-only floating popup and instead behave as a responsive side-sheet-like action surface. Placement and sizing should be based on the app window and trigger location so menus and submenus remain usable in narrow windows and quarter-screen layouts [[sources/2026-05-05-context-menu-responsive-side-sheet-grilling]].

## Key claims

- Context menu behavior should be a responsive side sheet, not just a clamped cursor popup [[sources/2026-05-05-context-menu-responsive-side-sheet-grilling]].
- Fini remains mobile-first; the redesign should not create a separate desktop mental model [[sources/2026-05-05-context-menu-responsive-side-sheet-grilling]].
- Main menu max width should be `min(50% app window width, 240px)` [[sources/2026-05-05-context-menu-responsive-side-sheet-grilling]].
- The menu should open on the nearest app side to the trigger [[sources/2026-05-05-context-menu-responsive-side-sheet-grilling]].
- Trigger point is hybrid: right-click uses cursor coordinates, while action buttons use the trigger element center [[sources/2026-05-05-context-menu-responsive-side-sheet-grilling]].
- Submenus should use the second half of the app window when possible and must never render outside the app viewport [[sources/2026-05-05-context-menu-responsive-side-sheet-grilling]].
- If the window is too narrow for main menu plus submenu side-by-side, the submenu should overlay or replace the main menu with back navigation [[sources/2026-05-05-context-menu-responsive-side-sheet-grilling]].

## Open questions

- Exact visual treatment of overlay/back submenu state is still open beyond requiring a clear back/parent affordance [[sources/2026-05-05-context-menu-responsive-side-sheet-grilling]].
- Exact automated test level remains open: component tests may be enough, but implementation should decide whether browser QA is also needed [[sources/2026-05-05-context-menu-responsive-side-sheet-grilling]].

## Related pages

- [[context-menu]]
- [[focus-view-daisyui-redesign]]
