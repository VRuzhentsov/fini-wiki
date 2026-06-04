---
title: 2026-05-14 Context Menu Cursor Anchored Placement
type: source
created: 2026-05-16
updated: 2026-05-16
sources: [2026-05-14-context-menu-cursor-anchored-placement]
tags: [fini, context-menu, placement, ui, implementation]
claim_status: locked
evidence: source-backed
---

# 2026-05-14 Context Menu Cursor Anchored Placement

User feedback explicitly reversed the #21 zone-based context-menu placement rule after the menu became a compact polished floating surface. Wide placement now anchors to the cursor or trigger element and shifts only to avoid body/composer overflow; the mobile bottom sheet remains unchanged [[sources/2026-05-14-context-menu-cursor-anchored-placement]].

## Key claims

- `classifyZone()` caused menus to snap to viewport corners because it pinned the menu to a body edge based on quadrant [[sources/2026-05-14-context-menu-cursor-anchored-placement]].
- User decision: override #21's trigger-zone rule because compact icon/accordion menus should feel attached to the trigger [[sources/2026-05-14-context-menu-cursor-anchored-placement]].
- Pointer triggers place the menu top-left at `(trigger.x, trigger.y)`, shifting left/up only to avoid overflow and bottom inset [[sources/2026-05-14-context-menu-cursor-anchored-placement]].
- Element triggers drop below the trigger rect, left-aligning or right-aligning based on available space, flipping above only when needed and enough room exists [[sources/2026-05-14-context-menu-cursor-anchored-placement]].
- Height measurement uses a two-frame approach: reset measured height to 0, estimate first frame by row count, then populate from `getBoundingClientRect().height` after `nextTick` [[sources/2026-05-14-context-menu-cursor-anchored-placement]].
- Verification: `npm run build` passed; focused ContextMenu tests passed 15/15 including four new wide placement tests [[sources/2026-05-14-context-menu-cursor-anchored-placement]].

## Open questions

- Live visual verification via `make e2e-headed` remained pending, including right-click corners/center, kebab trigger, and <640px resize checks [[sources/2026-05-14-context-menu-cursor-anchored-placement]].
- PR #23 was not yet pushed or reviewed [[sources/2026-05-14-context-menu-cursor-anchored-placement]].

## Related pages

- [[context-menu]]

supersedes:: [[pages/sources/2026-05-05-context-menu-responsive-side-sheet-grilling]]
updates:: [[pages/sources/2026-05-14-context-menu-polish-pass-implementation]]
