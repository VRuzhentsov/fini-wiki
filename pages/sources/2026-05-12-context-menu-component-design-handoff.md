---
title: 2026-05-12 Context Menu Component Design Handoff
type: source
created: 2026-05-13
updated: 2026-05-13
sources: [2026-05-12-context-menu-component-design-handoff]
tags: [fini, context-menu, design, ui, motion]
claim_status: provisional
evidence: source-backed
---

# 2026-05-12 Context Menu Component Design Handoff

This design handoff supersedes the purely placement-focused context-menu pass with a visual-polish brief: the component should feel richer through a more expressive row primitive, inline accordion submenus, a single adaptive surface, scrim, drag bottom-sheet behavior, and motion that respects reduced-motion preferences. The source is a design brief, not an implementation record [[sources/2026-05-12-context-menu-component-design-handoff]].

## Key claims

- Fini has one generic context-menu component; item lists differ by business logic, not component specialization [[sources/2026-05-12-context-menu-component-design-handoff]].
- The current component feels cheap because rows are plain text, destructive rows are always red, the surface pops in without motion, submenu behavior differs by width, and the mobile grip is decorative [[sources/2026-05-12-context-menu-component-design-handoff]].
- The target row primitive supports optional leading icons, title, secondary text, badges/count pills, loading spinner, checkmark, chevron, danger tint, disabled state, separators, focus-visible, selected, and pressed states [[sources/2026-05-12-context-menu-component-design-handoff]].
- Submenus should become inline accordion pickers with indented radio rows and checkmarks, replacing wide flyouts and narrow overlay screens [[sources/2026-05-12-context-menu-component-design-handoff]].
- The adaptive surface preserves #21 placement rules while adding a scrim and real draggable bottom-sheet behavior on narrow widths [[sources/2026-05-12-context-menu-component-design-handoff]].
- Motion should include scrim fade, anchored slide/scale, accordion height slide, chevron rotation, row hover transitions, bottom-sheet drag/spring behavior, and reduced-motion fallbacks [[sources/2026-05-12-context-menu-component-design-handoff]].
- Tokens stay DaisyUI 5 + Tailwind 4 only; light/dark differences should live in tokens, not template branches [[sources/2026-05-12-context-menu-component-design-handoff]].

## Open questions

- Icon choices for each row remain open [[sources/2026-05-12-context-menu-component-design-handoff]].
- Accordion parent highlight, child indent depth, and single-open versus multi-open behavior remain open [[sources/2026-05-12-context-menu-component-design-handoff]].
- Bottom-sheet max height, long-list scrolling, danger hover token/opacity, pressed feedback, and drag threshold remain open [[sources/2026-05-12-context-menu-component-design-handoff]].

## Related pages

- [[context-menu]]

updates:: [[pages/sources/2026-05-10-context-menu-redesign-implementation-results]]
