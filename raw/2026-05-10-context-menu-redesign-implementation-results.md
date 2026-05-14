# Context Menu Redesign — Implementation Results

Date: 2026-05-10

## Context

Continuation of the context-menu work scoped in `[[2026-05-05-context-menu-responsive-side-sheet-grilling]]` (the planning / grilling session for `VRuzhentsov/fini#21` "Redesign context menu responsive side-sheet placement").

This session implemented the responsive side-sheet placement, unified the menu shape across surfaces, extracted a reusable 3-dot button primitive, broadened outside-close to touch/pointer events, and restructured the local skills layout so the design+dev skills are auto-triggered on Claude Design URLs and "implement [surface]" prompts.

Implementation was kicked off from `/var/home/will/projects/fini` against design bundle hash `n6fJsgsBTtjJtlrmrnR5yg` (local copy at `/var/home/will/projects/fini-design/project/preview/context-menu.html`; the live `https://api.anthropic.com/v1/design/h/...` URL 404'd because session-gated).

## Summary

Single feature commit on `main`: `b8530fd feat: redesign context menu with side-sheet placement` (26 files, +639 / −178). NOT pushed. NOT validated by user runtime yet — issue #21 deliberately left open per user gate "I need to validate".

Surfaces touched:
- Quest list (right-click + 3-dot in row).
- Focus view (`ActiveQuestPanel` 3-dot).
- Quest editor toolbar (`more` button now uses `ActionsBtn`).
- Settings → Spaces (per-space "Actions" — was DaisyUI `dropdown`, now uses shared `ContextMenu` opened from `ActionsBtn`).

## Decisions

### Trigger model
`useContextMenu`'s trigger is a discriminated union:
```ts
type ContextMenuTrigger =
  | { kind: "pointer"; x: number; y: number }
  | { kind: "element"; rect: DOMRectLike };
```
`open(event, items)` derives the kind automatically — `event.type === "contextmenu"` → pointer; otherwise the trigger derives from `event.currentTarget.getBoundingClientRect()`. **Why this shape:** consumers don't have to thread an "is this a button-click or a right-click?" branch — the menu component always knows whether to anchor on a point or a rect.

### Placement
Side-sheet zones, not pointer-anchored. `classifyZone` returns `{ side: 'left' | 'right', vertical: 'top' | 'bottom' }` based on trigger center vs body midpoint. Body rect is `<main>` (Tauri viewport). `bottomInset = composerHeight + safeAreaInsetBottom + 8`. Constants: `MAIN_MAX_W=240, MAIN_MIN_W=160, SUB_MIN_W=180, EDGE_PAD=8, NARROW_BREAKPOINT=640`.

Submenus spill side-by-side flush in the opposite half when there's room; otherwise the menu transitions to a full-width overlay with a back chevron labelled "Quest actions". Mobile bottom-sheet branch (`isNarrow && !overlayActive`) is preserved with the existing grip ::before.

### Submenu interaction
**Hover-open + click-commit** when wide (selected by user from a 3-option grilling). On narrow, parent click pushes an overlay. Hover only sets `hoveredParent` — clicking a parent toggles `openedParent` so it sticks.

### Menu shape (unified for quests)
Extracted `src/composables/buildQuestMenu.ts` so QuestList and ActiveQuestPanel produce IDENTICAL items. Active-quest order: `Complete / Set Focus / Move to space [submenu of other spaces] / — / Abandon / — / Delete`. Inactive (completed/abandoned): `Make active / Move to space / — / Delete`.

### Visual
- Only `Delete` styled as `.danger` (red). `Abandon` is default fg — corrected after first review where user objected to red Abandon.
- Separators: between Abandon and Delete; before Delete in both branches.
- All surfaces share the same `ContextMenu`: rounded-xl, soft border, shadow-lg, sentence-case items.

### `ActionsBtn` primitive (`src/components/ActionsBtn.vue`)
Reusable 3-dot button. `defineOptions({ inheritAttrs: false })` + `v-bind="$attrs"` on the `<button>` — every parent attribute / listener (`@click`, `aria-label`, `title`, `disabled`, `data-*`) lands on the button. Vue still auto-merges `class` and `style` so consumers can extend.

Visual variant chosen: match the existing `.quest-editor-icon` toolbar look (28×28, transparent, `var(--color-base-200)` hover, 18px stroke-1.7 inner svg). Picked over the DaisyUI `btn btn-sm btn-ghost btn-circle` (~32px) variant because the user wanted toolbar-symmetric look in QuestEditor and accepted the SettingsView shrink.

Used in: `SettingsView.vue` (Spaces row), `QuestEditor.vue` (toolbar `more`).

### Settings → Spaces
- Replaced DaisyUI `dropdown dropdown-end` block with `<ActionsBtn @click="openSpaceMenu(...)">`.
- Built-in spaces (ids `1` / `2` / `3` — Personal / Family / Work) show only `Edit`.
- Custom spaces show `Edit / — / Delete` (Delete red).
- `BUILTIN_SPACE_IDS` and `isBuiltinSpace(id)` exported from `src/stores/space.ts`, alongside `Space` interface and `SPACE_COLOR_CLASS`. Moved out of the view per user feedback "should be hardcoded inside of the ts Space model".

### Outside-close
Broadened from a single `click` listener to: `pointerdown`, `touchstart` (passive), `contextmenu`, `wheel` (passive). All capture-phase. Existing `scroll` (once, capture) and Escape `keydown` retained. **Why:** mobile/touch sessions and right-click-elsewhere weren't dismissing the menu reliably with click-only.

### Skills layout
- `skills/` keeps only `fini/`.
- All other project skills moved to `.agents/skills/<name>/SKILL.md`: `android-testing, fini-cli, fini-design, fini-dev, fini-scripting, fini-versioning, fini-wiki`.
- `.claude/skills/` is now a real directory of per-skill symlinks: `fini → ../../skills/fini`; the rest → `../../.agents/skills/<name>`.
- Tracked in git as renames + symlink mode 120000 entries.

### `fini-design` skill auto-trigger
Description rewritten as a multi-line YAML literal block listing five explicit triggers: Claude Design URL pattern, fetch/sync/refresh phrasing, "implement / build / translate" of named Fini surfaces, "design audit", and GH issue with bundle citation. Goal: skill auto-loads next time without the user having to nudge.

## Plan

Validation gate (user-driven, NOT done in this session):
1. Quest list + Focus view: snap zones, submenu spillover, narrow overlay back-chevron, mobile bottom sheet, hover-open + click-commit interaction.
2. Settings → Spaces: 28px 3-dot opens shared menu; built-in shows only `Edit`; custom shows `Edit / — / Delete` (red).
3. QuestEditor toolbar: `more` matches PaperClip / Tag / Flag siblings byte-for-byte.
4. Outside-close on Android: tap outside dismisses (`pointerdown` / `touchstart` path).
5. Right-click outside an open menu closes it (`contextmenu` listener).
6. Wheel/trackpad outside dismisses (this is new; if annoying, drop the `wheel` listener).
7. Tab + Enter / Space activates `ActionsBtn`; aria-label per row reads correctly to screen readers.

After validation:
- Comment + close `VRuzhentsov/fini#21`.
- Push commit `b8530fd` to `origin/main`.

Out of scope, deferred:
- Adding user-global symlinks at `~/.claude/skills/fini-*` so project skills auto-discover from any cwd. User declined this session ("Just load ~/.agents/skills for now, I want to use single fini-wiki skill for a once").

## Evidence

### Commit
- `b8530fd feat: redesign context menu with side-sheet placement` on `main`, branch `up to date with origin/main` (not yet pushed).
- `git diff --stat`: 26 files, +639 / −178. Includes 7 SKILL.md renames `skills/* → .agents/skills/*`, 8 new symlinks under `.claude/skills/`, 2 new source files (`ActionsBtn.vue`, `buildQuestMenu.ts`), 7 modified Vue/TS files.

### Files
- `src/components/ContextMenu.vue` — full rewrite.
- `src/composables/useContextMenu.ts` — trigger discriminated union, `open(event, items)`, `openFromRect(rect, items)`.
- `src/composables/buildQuestMenu.ts` — new, used by `src/components/QuestsView/QuestList.vue` and `src/components/FocusView/ActiveQuestPanel.vue`.
- `src/components/ActionsBtn.vue` — new.
- `src/components/QuestEditor.vue` — toolbar `more` uses `ActionsBtn`; `EllipsisVerticalIcon` import dropped.
- `src/views/SettingsView.vue` — DaisyUI `dropdown` → `ActionsBtn` opening shared `ContextMenu`. `EllipsisVerticalIcon` import removed.
- `src/stores/space.ts` — `BUILTIN_SPACE_IDS` const + `isBuiltinSpace(id)` helper.

### Verification done in-session
- `npx vue-tsc --noEmit` → exit 0 after every batch of edits (final pass clean).
- `npm run test:unit` → 7 passed, 1 failed. Failing test: `src/spec/views/DeviceView.spec.ts → "hides IDs for embedded spaces and keeps IDs for custom spaces"`. Verified pre-existing on baseline (same failure on `git stash` of session changes; unrelated to this work).
- Manual UI runtime validation: NOT done in this session — user explicitly gated GH-issue close on their own validation pass.

### Mid-session incident — git stash data loss
While checking baseline test status, ran `git stash` AFTER moving skill directories at the FS level. The `mv` operations were not tracked changes; the stash captured only the deletions of broad symlinks and the SKILL.md "deletions" relative to HEAD. `git stash pop` then restored the symlinks (which replaced the new real `.agents/skills/` directory), and the moved skill content was lost. Recovered via `git checkout HEAD -- skills/` to restore the original SKILL.md content from git, then re-applied the description edit and re-ran the move script. Lesson: do not stash across FS-level directory restructures — finish the structural change and commit/checkpoint before any stash.

### Design bundle source
Local copy: `/var/home/will/projects/fini-design/project/preview/context-menu.html`. Bundle hash matched the `.design-bundle-url` already in the fini-design repo, so no fetch needed.

## Open Questions

- **#21 close criteria.** What does the user want to see in the validation pass before we close the issue? Specific repro recipes (mobile, narrow desktop, wide desktop) or just a "looks right" sign-off?
- **`wheel` outside-close.** New behavior — closes the menu on any scroll-wheel gesture outside it. Confirm whether this is desired UX or should be dropped (ContextMenu.vue, watch handler). Trackpad two-finger scroll counts as `wheel` and may feel aggressive.
- **`SUB_MIN_W` collision rule.** Submenu spills into the opposite half but doesn't currently inset further if the body width is between `mainWidth + SUB_MIN_W + 24` and the actual cap. Tight desktop widths might produce a cramped sub. Leave as-is unless reported.
- **`fini-design` skill auto-trigger fidelity.** The rewritten description has not been re-tested in a fresh session — unknown whether Claude Code now matches the trigger conditions reliably from `cwd != fini project`. Validate next time.
- **Skills global discovery.** User declined adding `~/.claude/skills/fini-*` symlinks this session. If they later want global auto-load, the proposed shape is `~/.claude/skills/fini-<name> → ~/projects/fini/.agents/skills/<name>` (or two-hop via `~/.agents/skills/` to match the existing convention).
- **Focus / QuestList parity.** `buildQuestMenu` produces identical items, but the call sites still differ in how they bind dependencies (`store.updateQuest` vs prop-driven). Worth a follow-up audit if menu items ever drift.
- **DeviceView test failure.** Pre-existing, unrelated to this change. Tracking it elsewhere (not in scope of this raw doc).
