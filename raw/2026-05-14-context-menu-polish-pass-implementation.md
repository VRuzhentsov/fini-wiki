# Context Menu Polish Pass — Implementation Results

Date: 2026-05-14
Status: implementation result
Related: #21 (responsive side-sheet), PR #23, design bundle `gWebr_6472m5gbxvX8ryow`,
  `../fini-design/project/uploads/2026-05-12-context-menu-component-design-handoff.md`,
  `raw/2026-05-12-context-menu-component-design-handoff.md`,
  `raw/2026-05-10-context-menu-redesign-implementation-results.md`

## Context

#21 locked placement rules for the context menu (nearest-side side-sheet, `min(50% aw, 240px)` width, expand-then-scroll, bottom inset, submenu fallback). PR #23 followed with the narrow-overlay submenu pinned above the composer. This pass builds on both to add visual polish: a full row primitive with icon/trailing slots, submenus replaced by an in-place accordion, a bottom-sheet with real drag-to-dismiss, open/close motion, and a `danger` variant that is quiet at rest.

Design source: bundle URL `https://api.anthropic.com/v1/design/h/gWebr_6472m5gbxvX8ryow` (chats 3+4 added the polish pass brief and iterations). Bundle synced to `fini-design` repo (commit `89fe3e4`).

## Summary

Rewrote `ContextMenu.vue` to implement the design-bundle polish pass in one coherent PR (#23). Placement logic from #21 is preserved unchanged. The narrow-overlay back-nav submenu (shipped in the earlier PR #23 commit `be37bb7`) was superseded and removed; accordion is the single submenu model at every window width.

Key changes:
- `MenuItem` interface extended with `icon`, `value`, `badge`, `selected`, `loading`, `danger`, `spaceColor`.
- `buildQuestMenu.ts` wires Heroicons and row metadata (danger on Delete only; value + selected children on Move to space; current space included with checkmark).
- `SettingsView.vue` adds icons + danger on space menus.
- `ContextMenu.vue` fully rewritten: accordion replaces flyout + overlay; side-sheet and mobile sheet share one row primitive; mobile sheet has a drag handle with full velocity-tracked drag-to-dismiss; 160ms surface open + 260ms spring sheet entrance; `prefers-reduced-motion` strips all animation.
- Unit spec (`ContextMenu.spec.ts`) rewritten for accordion behavior (11 tests, all passing).
- `context-menu-narrow-overlay.spec.ts` and `context-menu-submenu-hover.spec.ts` deleted; replaced by `context-menu-accordion.spec.ts`.

## Decisions

- **Accordion at all widths.** No flyout, no separate overlay screen. One mental model — parent row with chevron rotates and children expand in place; single-open.
- **Narrow overlay deleted.** The bottom-pinned overlay submenu (PR #23 commit `be37bb7`) is superseded in the same PR.
- **Current space included in Move to space picker.** Design shows a radio-style picker; current space gets `selected: true` + checkmark + space color dot. Selecting the current space is a no-op (no updateQuest call).
- **danger on Delete only.** Abandon stays a plain row. This was previously corrected in the design handoff and maintained here.
- **Drag-to-dismiss: full spec.** Spring entrance 260ms `cubic-bezier(.34,1.4,.64,1)`, 1:1 drag track, ≤30px rubber-band upward, dismiss at 120px OR velocity > 0.6 px/ms (last 2 pointermove samples).
- **No parallel token system.** CSS variables stay off existing app tokens (`--color-base-*`, `--fg-*`, `--color-error`, `--color-border-soft`).

## Plan

All landed in PR #23 (`issue-21-context-menu-side-sheet` branch):

1. `fini-design` bundle synced and committed (commit `89fe3e4`).
2. `src/composables/useContextMenu.ts` — MenuItem extended.
3. `src/composables/buildQuestMenu.ts` — icons + danger + accordion child data.
4. `src/views/SettingsView.vue` — icons + danger.
5. `src/components/ContextMenu.vue` — full rewrite (accordion, row primitive, drag handle, motion).
6. `src/components/ContextMenu.md` — updated docs.
7. `src/spec/components/ContextMenu.spec.ts` — rewritten for accordion (11 tests).
8. `specs/e2e/ui/tests/context-menu-accordion.spec.ts` — new e2e tests.
9. `specs/e2e/ui/tests/context-menu-narrow-overlay.spec.ts` — deleted.
10. `specs/e2e/ui/tests/context-menu-submenu-hover.spec.ts` — deleted.

## Evidence

- `npm run build` — clean (0 type errors, vite success).
- `npm run test:unit -- --testPathPattern=ContextMenu` — 11/11 passing.
- Full unit suite: 18/19 passing; the 1 failing test (`DeviceView.spec.ts`) is pre-existing and unrelated.
- Design bundle diffs: `chat3.md` (polish-pass brief + iteration transcript), `chat4.md` (dark-mode scrollbar fix), `project/preview/context-menu.html` (full restyle), `project/uploads/2026-05-12-context-menu-component-design-handoff.md` (design brief).

## Open Questions

- e2e visual: `make e2e-headed` not yet run (requires running Tauri app); accordion and drag handle need live verification.
- Dark mode danger hover wash: visually verified by reading CSS; no dark-mode screenshot in evidence chain.
- `prefers-reduced-motion`: confirmed by `@media` rule in CSS; no runtime smoke test.
- PR #23 not yet pushed or reviewed.
