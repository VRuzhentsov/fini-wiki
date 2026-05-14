# Context Menu Component — Design Handoff (polish pass)

Date: 2026-05-12
Status: design brief — paste into claude.ai/design so the design agent can restyle the
context-menu surface in the Fini design bundle (`project/preview/context-menu.html`). No code
changes until the design lands.

Relationship: continuation of `[[2026-05-05-context-menu-responsive-side-sheet-grilling]]`
and `[[2026-05-10-context-menu-redesign-implementation-results]]` (`VRuzhentsov/fini#21`).
#21 fixed *placement* (nearest-side side-sheet, bounded width, submenu fallback). This pass
is about how the menu *feels* — visual depth, per-row affordances, motion — without adding
any new menu commands and without touching the data model.

## Summary

Restyle the single generic context-menu component so it reads as polished, not cheap:
a richer row primitive (optional leading icon, trailing secondary text / badge / spinner /
checkmark / chevron, a hover-tinted `danger` variant), submenus turned into inline accordion
pickers (no flyout), the current three render modes unified into one width-adaptive surface
with a scrim and a draggable bottom-sheet form, and a proper motion spec (open/close,
accordion, hover) that respects `prefers-reduced-motion`. No new menu commands; no model
changes. Implementation is gated on this design landing in the bundle first.

## What the component is

Fini has ONE generic context-menu component. Every trigger opens the same component; only the
item list differs, and the item list is decided by business logic, not by the component.

Triggers in the app today:
- right-click on a context-menu-capable item (a quest row; an expanded quest editor card),
- a 3-dot "actions" button (quest editor toolbar; Settings → Spaces row; Focus active-quest panel),
- press-and-hold on the active quest card in Focus view.

So the design must describe one component with: a header-less list of rows, optional submenu
rows, and a surface that adapts to where it's opened and how wide the app window is. The
quest menu and the space menu below are just *examples* of item lists rendered by it.

## What feels cheap today (the things to fix)

- Rows are plain text — no leading icon, no trailing value/badge/state.
- Destructive rows are just red text, always — no hover treatment, no weight.
- No open/close motion — the surface pops in via `v-if`.
- Submenus are a separate flyout panel on wide windows and a full-width back-nav overlay on
  narrow ones, with hover-delay timing quirks — two different mental models.
- The mobile bottom-sheet has a decorative grip pill but no drag-to-dismiss; entrance is flat.
- Spacing/separators are functional, not considered.

## What we want

### 1. One row primitive, every part optional

Design a single menu-row that composes from these slots/states (any subset can be present):

- **leading icon** (Heroicon, ~18px, stroke ~1.7 to match the quest-editor toolbar icons)
- **title** (sentence case; ellipsizes if long)
- **trailing secondary text** — dimmed; e.g. the current value of a picker row, or a hint
- **trailing badge / count pill** — small, outlined, for counts
- **trailing inline spinner** — when the row's action is async; the row stays in place and the
  spinner replaces nothing structural, just appears at the trailing edge
- **trailing checkmark** — for radio-style rows (the currently selected option)
- **trailing chevron** — for rows that expand a submenu (see §2)
- **`danger` variant** — destructive intent. Not always-red text. A subtle destructive *tint
  on hover/active* (and maybe a slightly stronger label color), so a calm menu doesn't shout.
- **disabled state** — dimmed, no hover, not interactive
- **separators** — consistent vertical rhythm between groups

States to spec for the row: default, hover, pressed/active, focus-visible (keyboard),
disabled, selected, loading. Hover should match the app's existing row feel — rounded
background, ~115ms ease transition.

### 2. Submenus become an inline accordion picker (replace the flyout)

A submenu row (e.g. "Move to space") is a normal row with the current value as secondary text
and a chevron. Clicking it expands a nested list **in place** (slide-down), the chevron
rotates, the children render as indented radio rows with a checkmark on the current one;
picking one collapses the accordion and applies. Same behaviour at every window width — no
side-by-side flyout, no separate overlay screen. Decide: does the parent row stay highlighted
while expanded? how deep is the child indent? does only one accordion open at a time?

### 3. One adaptive surface

Collapse today's three render modes (wide side-sheet / mobile bottom-sheet / narrow overlay)
into a single surface that adapts by app-window width:
- placement rules from #21 are preserved — opens on the app side nearest the trigger; width
  `min(50% app-window width, 240px)`; never renders outside the app viewport; bottom-anchored
  above the composer when the trigger is low,
- on narrow widths it takes a bottom-sheet form (full app width, rounded top, **real
  drag-handle**, swipe-down-to-dismiss),
- a **scrim** sits behind the surface (subtle dim; slightly stronger in the bottom-sheet form).

### 4. Motion

- Surface open: scrim fades in + surface slides/scales in from the anchored edge; close: reverse.
- Accordion expand/collapse: height slide + chevron rotate.
- Row hover: ~115ms ease background.
- Bottom-sheet: spring-ish entrance; drag follows the finger; release past a threshold dismisses.
- Honor `prefers-reduced-motion`: no transforms, instant show/hide, no spring.

### 5. Tokens & theming

- DaisyUI 5 + Tailwind 4 tokens only; no parallel token system. If a needed token has no app
  equivalent, flag it rather than inventing one.
- Light **and** dark must both be specified; no light/dark branching in markup — tokens carry it.
- Icons: Heroicons (outline, matching the app's existing icon weight).

## Worked examples — item lists to render in the design

Quest context menu, active quest:
`Complete` · `Set Focus` · `Move to space ▸` (accordion: one row per other space, current
space gets the checkmark) · — · `Abandon` · — · `Delete` (danger)

Quest context menu, completed/abandoned quest:
`Make active` · `Move to space ▸` · — · `Delete` (danger)

Settings → Spaces, built-in space (Personal / Family / Work):
`Edit`

Settings → Spaces, custom space:
`Edit` · — · `Delete` (danger)

(Note: `Abandon` is intentionally NOT red — only `Delete` is `danger`. This was corrected once
already; keep it.)

## Out of scope (do not add)

- No new menu commands (no "Edit", "Duplicate", "Pin", quick-date, "Copy", etc. in this pass).
- No domain-model changes.
- The broader product backlog (labels, sub-tasks, sections, new views, NLP quick-add,
  drag-reorder, deadline field, attachments, change history, custom-recurrence editor,
  multi-reminders, search, keyboard shortcuts, export, project color/icon/archive) is noted
  elsewhere and is not part of this design.

## Evidence / starting points

- Bundle prototype to restyle: `project/preview/context-menu.html` (the surface from #21).
- App component being designed for: `src/components/ContextMenu.vue` (3 render modes today),
  state in `src/composables/useContextMenu.ts`, item builders in
  `src/composables/buildQuestMenu.ts` and `src/views/SettingsView.vue`.
- #21 placement decisions are locked in `[[2026-05-05-context-menu-responsive-side-sheet-grilling]]`
  (nearest-side, width `min(50% app width, 240px)`, no-overflow, submenu fallback) — preserve them.
- #21 implementation notes (current shape, what shipped) in `[[2026-05-10-context-menu-redesign-implementation-results]]`.

## Open questions for the designer

- Which Heroicon for each row: `Complete`, `Set Focus`, `Move to space`, `Make active`,
  `Abandon`, `Delete`, `Edit`?
- Accordion: parent-row highlight while open? child indent depth? single-open vs. multi-open?
- Bottom-sheet: max height, and behaviour when the item list is long (scroll inside the sheet?).
- `danger` hover tint: which token (error / error-content) and what opacity? Does the label
  also recolor, or only the background?
- Pressed/active row feedback: subtle scale, background shift, or nothing?
- Drag-to-dismiss threshold and rubber-banding feel for the bottom-sheet.
