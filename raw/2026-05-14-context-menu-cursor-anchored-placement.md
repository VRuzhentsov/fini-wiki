# Context Menu — Cursor-Anchored Placement

Date: 2026-05-14
Status: implementation result
Related: #21 (responsive side-sheet), PR #23 (polish pass),
  `raw/2026-05-14-context-menu-polish-pass-implementation.md`,
  `src/components/ContextMenu.vue`, `src/spec/components/ContextMenu.spec.ts`

## Context

User reported that every context menu open snapped the menu to a viewport corner
rather than appearing near the cursor or trigger element. The corner-snap came from
`classifyZone()` in `ContextMenu.vue`, which divided the body into four quadrants
and pinned the menu to the nearest body edge regardless of cursor position. This
behaviour was part of #21's "trigger zone, not coordinates" design decision.

User decision: override the #21 rule. Once the menu became a compact floating surface
with icons and accordion (PR #23 polish pass), corner-snapping felt disconnected from
the trigger. Cursor-anchored placement is the correct UX.

## Summary

Replaced the zone-classification placement system with cursor-anchored placement in
`ContextMenu.vue`. The menu now opens at the trigger point and only shifts when it
would overflow the body bounds or composer inset. Mobile bottom-sheet (≤ 640px) is
unchanged.

All existing unit tests kept passing. Four new placement-specific unit tests were
added (15/15 total). `npm run build` is clean.

## Decisions

1. **Cursor-anchored, not zone-based.** Explicitly overrides #21's locked "trigger
   zone, not coordinates" rule. Rationale: a compact floating menu with icons and
   accordion needs to feel anchored to its trigger, not a distant corner.

2. **Pointer trigger (right-click).** Top-left of menu at `(trigger.x, trigger.y)`.
   Overflow handling: shift left if right edge would exceed `bodyRight - 8`; shift up
   if bottom would exceed `height - bottomInset`. No flip — covering the cursor is fine.

3. **Element trigger (kebab click).** Menu drops below the rect. Horizontal alignment
   auto-picked by free space: left-align if `bodyRight - rect.right >= menuWidth`,
   else right-align (menu right edge at `rect.right`). Clamped to body bounds.
   Vertical: flip above (using CSS `bottom` property) when no room below AND ≥ 80px
   above the rect; otherwise pin to `bodyTop + 8` and let `maxHeight` + scroll handle.

4. **Two-frame height measurement.** `menuMeasuredHeight` ref is reset to 0 on open,
   then populated after `nextTick` via `menuEl.getBoundingClientRect().height`.
   First-frame uses `items.length * ROW_H_EST (32)` as an estimate. Acceptable because
   the 160ms open animation conceals any single-frame adjustment.

5. **`transform-origin` made dynamic.** CSS `transform-origin: top right` (hardcoded)
   replaced with `transform-origin: var(--cm-origin, top left)`. The `--cm-origin`
   CSS variable is set on the element via `mainStyle` based on the chosen anchor corner.

6. **Mobile bottom-sheet unchanged.** Full-width sheet anchored to viewport bottom;
   cursor position irrelevant.

## Plan

All changes landed in the same branch (`issue-21-context-menu-side-sheet`, PR #23).

1. `src/components/ContextMenu.vue` — removed `Zone` interface, `classifyZone()`,
   `zone` computed; added `ROW_H_EST = 32`, `menuMeasuredHeight` ref; replaced
   `mainStyle` computed with cursor-anchored logic; updated CSS `transform-origin` to
   use `var(--cm-origin)`.
2. `src/components/ContextMenu.md` — updated Responsive placement section.
3. `src/spec/components/ContextMenu.spec.ts` — added 4 placement tests (suite
   "cursor-anchored placement (wide)").

## Evidence

- `npm run build` — 0 type errors, Vite success.
- `npm run test:unit -- --testPathPattern=ContextMenu` — 15/15 passing:
  - 7 accordion (wide) tests
  - 4 mobile sheet tests
  - 4 new placement tests:
    - pointer trigger at center → `style.left = "400px"`, `style.top = "300px"`
    - pointer trigger near right edge → shifts left, right edge ≤ bodyR
    - element trigger left side → left-aligns at `rect.left`
    - element trigger right side → right-aligns with `rect.right`
- `make e2e-headed` not yet run (requires running Tauri app); live visual verification pending.

## Open Questions

- Live visual verification (`make e2e-headed`): right-click in 4 corners + center,
  click kebab on quest card, resize to <640px.
- PR #23 not yet pushed or reviewed.
