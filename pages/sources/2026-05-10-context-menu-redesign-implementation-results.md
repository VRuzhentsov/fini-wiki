---
title: 2026-05-10 Context Menu Redesign Implementation Results
type: source
created: 2026-05-13
updated: 2026-05-13
sources: [2026-05-10-context-menu-redesign-implementation-results]
tags: [fini, context-menu, ui, implementation, skills]
claim_status: historical
evidence: source-backed
---

# 2026-05-10 Context Menu Redesign Implementation Results

The #21 context-menu placement redesign was implemented locally in Fini but intentionally left unpushed and unclosed until user runtime validation. The implementation unified quest and Settings action menus around shared `ContextMenu`, `useContextMenu`, `buildQuestMenu`, and `ActionsBtn` primitives, preserving mobile-first side-sheet placement while expanding outside-dismiss behavior and repo-local skill layout [[sources/2026-05-10-context-menu-redesign-implementation-results]].

## Key claims

- Commit `b8530fd feat: redesign context menu with side-sheet placement` implemented the redesign on `main`, touching 26 files with +639/-178 lines, but was not pushed and #21 remained open for user validation [[sources/2026-05-10-context-menu-redesign-implementation-results]].
- Context menu triggers became a discriminated union: pointer coordinates for right-click and element rects for action buttons, so consumers do not branch on trigger type [[sources/2026-05-10-context-menu-redesign-implementation-results]].
- Placement uses app-window side zones, body midpoint, composer/safe-area bottom inset, and constants such as `MAIN_MAX_W=240`, `MAIN_MIN_W=160`, `SUB_MIN_W=180`, and `NARROW_BREAKPOINT=640` [[sources/2026-05-10-context-menu-redesign-implementation-results]].
- Quest list and Focus active-quest menus now share `buildQuestMenu`, keeping item ordering and danger styling consistent across surfaces [[sources/2026-05-10-context-menu-redesign-implementation-results]].
- `ActionsBtn` became the reusable 28px three-dot primitive for the QuestEditor toolbar and Settings Spaces rows [[sources/2026-05-10-context-menu-redesign-implementation-results]].
- Outside-close expanded beyond click to `pointerdown`, `touchstart`, `contextmenu`, `wheel`, scroll, and Escape, improving touch and right-click dismissal coverage [[sources/2026-05-10-context-menu-redesign-implementation-results]].
- Project skills were reorganized so most skills live under `.agents/skills/<name>/SKILL.md`, with `.claude/skills/` containing symlinks [[sources/2026-05-10-context-menu-redesign-implementation-results]].

## Open questions

- User runtime validation remains required before closing #21 or pushing commit `b8530fd` [[sources/2026-05-10-context-menu-redesign-implementation-results]].
- The `wheel` outside-close behavior may be too aggressive and should be validated on trackpads [[sources/2026-05-10-context-menu-redesign-implementation-results]].
- The `SUB_MIN_W` collision rule may be cramped at tight desktop widths [[sources/2026-05-10-context-menu-redesign-implementation-results]].
- A pre-existing `DeviceView.spec.ts` failure was verified unrelated to this work and remains out of scope [[sources/2026-05-10-context-menu-redesign-implementation-results]].

## Related pages

- [[context-menu]]

updates:: [[pages/sources/2026-05-05-context-menu-responsive-side-sheet-grilling]]
