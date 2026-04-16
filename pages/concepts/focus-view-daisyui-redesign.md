---
title: Focus View DaisyUI Redesign
type: analysis
created: 2026-04-12
updated: 2026-04-12
sources: [2026-03-21-mvp-baseline, 2026-03-28-quest-space-assignment, 2026-03-29-device-synchronizations-design]
tags: [fini, focus, ui, ux, daisyui, frontend]
---

# Focus View DaisyUI Redesign

This design locks the first UI refresh target to the `Focus` view and keeps scope inside the existing Vue 3 + Tailwind + DaisyUI frontend. The product constraint is that Fini is a focus-first quest app, not a general dashboard: one quest should dominate the screen, backlog remains visible but secondary, and quick capture stays immediately available [[sources/2026-03-21-mvp-baseline]] [[focus]].

The current frontend already uses DaisyUI and already treats `Focus` as the main route, so the redesign should mostly change hierarchy, spacing, and component composition rather than add new behavior or a new design system. The selected space remains part of the working context because filtering and default space assignment are already part of the intended UI model [[sources/2026-03-28-quest-space-assignment]].

## Product constraints

- `Focus` is the hard-cut replacement for `Main`; user-facing language should reinforce `Focus` rather than introduce mixed terminology [[sources/2026-03-29-device-synchronizations-design]] [[focus]].
- Focus is derived from active quests plus focus-history events, so the UI should present the current focus as a resolved result rather than an editable mode toggle [[sources/2026-03-21-mvp-baseline]] [[focus]].
- The app targets Linux, Windows, and Android, so the layout must collapse cleanly to mobile without depending on hover-only affordances [[sources/2026-03-21-mvp-baseline]].
- Space filtering is part of the intended working model, so the active space should stay legible in the shell rather than feel detached from the screen [[sources/2026-03-28-quest-space-assignment]].

## Recommended direction: Focus cockpit

Recommended approach: a focused command surface with one dominant hero card for the active focus quest, a compact quick-capture card near the top, and a quieter backlog section below.

Why this direction:

- It fits Fini's product model better than a symmetric dashboard because the app should communicate that one quest matters most right now [[focus]].
- It keeps the quick-capture workflow visible without letting creation UI overpower the currently active quest.
- It works with existing frontend structure in `src/views/FocusView.vue` and its child components instead of requiring route or store changes.

Rejected alternatives:

- List-first productivity layout: simpler to build, but weakens the single-focus model by visually flattening focus and backlog.
- Equal-weight dashboard cards: visually rich, but too generic for a product whose core idea is derived focus rather than many parallel widgets.

## Layout

### Desktop

- Top band with the active space context already visible in the app shell.
- Primary row uses a 2-column composition:
  - Left: large active focus card.
  - Right: compact quick-capture card.
- Secondary row below spans full width for backlog.

### Mobile

- Single column stack.
- Active focus card first.
- Quick capture card second.
- Backlog card third.
- Maintain generous vertical spacing and keep primary actions thumb-reachable.

## Component plan

### Active focus card

Use a large DaisyUI `card` with stronger elevation and internal spacing than the current layout.

Contents:

- Eyebrow label: `Current Focus`
- Quest title as the dominant text element
- Metadata row using `badge` components for priority, due state, and space
- Optional support text for notes or timing if already available from existing data
- Primary actions as full-width or high-visibility `btn` controls:
  - `Complete`
  - `Abandon`

Behavior notes:

- If no active focus quest exists, keep the same card footprint but swap in an empty-state message and an affordance pointing toward quick capture.
- The card should visually answer one question immediately: "What should I do now?"

### Quick capture card

Use a compact DaisyUI `card` that feels utility-oriented rather than dominant.

Contents:

- Short title: `Quick Capture`
- Input/form fields from the existing `NewQuestForm`
- Submit action as a prominent `btn btn-primary`
- Keep space defaulting behavior tied to the existing selected space model rather than duplicating a separate picker here [[sources/2026-03-28-quest-space-assignment]].

Behavior notes:

- Preserve always-visible capture.
- Avoid turning this into a large composition form; speed matters more than options.

### Backlog card

Wrap the existing active backlog list in a DaisyUI `card` with lower visual emphasis than the focus card.

Contents:

- Section title: `Active Backlog`
- Lightweight summary line such as count or current filter context
- Quest rows with clearer spacing and row grouping

Behavior notes:

- `Set Focus` should become the clearest secondary action on each row.
- Overdue items can use subtle `badge-error` or text color emphasis without making the whole list loud.
- Backlog should read as "available next" rather than competing with the focus card.

## DaisyUI kit usage

Prefer the existing DaisyUI kit before custom CSS:

- `card` for all major surfaces
- `btn` for quest actions and capture submit
- `badge` for priority, due state, and space context
- `alert` for error states
- `skeleton` for loading states if loading treatment is added
- `divider` to separate card regions when needed
- `textarea` / `input` for quick capture fields

Use custom CSS only for:

- app-specific spacing polish
- preserving built-in space colors
- any small layout adjustments DaisyUI utilities do not cover cleanly

## Visual language

- Tone: calm, intentional, slightly tactile
- Weighting: one dominant surface, two subordinate surfaces
- Contrast: stronger than the current plain stacked layout, but not high-saturation or gamified
- Shape: rounded corners consistent with DaisyUI defaults
- Color: rely on theme neutrals plus existing space accent colors; avoid inventing a second palette

The result should feel like a focused workbench rather than a metrics dashboard.

## State treatment

### Empty state

- Replace the current plain "No active quest" text with an empty focus card.
- Keep quick capture visible below or beside it so the screen still feels actionable.

### Error state

- Present store errors using a DaisyUI `alert alert-error` instead of loose inline text.

### Loading state

- If fetch timing is visually noticeable, add `skeleton` placeholders for the focus card and backlog rows.
- If loading remains effectively instant, do not add extra complexity.

## Implementation boundaries

Stay inside the current frontend contracts:

- No route changes.
- No store contract changes.
- No focus-resolution logic changes.
- No new global theme system in this pass.

The work should be limited to presentation and composition in:

- `src/views/FocusView.vue`
- `src/components/FocusView/ActiveQuestPanel.vue`
- `src/components/FocusView/NewQuestForm.vue`
- `src/components/QuestsView/QuestList.vue` only where needed to support the Focus backlog presentation

## Verification checklist

- `Focus` screen clearly communicates one dominant active quest.
- Quick capture remains visible without scrolling on common desktop sizes.
- Mobile layout stacks in the intended order: focus, capture, backlog.
- Space context remains visible and understandable.
- Existing actions still work with no behavioral regression.

## Figma execution state

The design direction above was implemented in the app for the first DaisyUI pass, then carried forward into a Figma-only phone pivot for tighter visual iteration. Current locked execution scope:

- Phone-only `Focus` cockpit in dark mode
- Tablet remains optional
- Figma file: `jWFFhdqxnchYFgEmoJVLP9` (`Fini - Focus Cockpit`)
- Current MCP talk-to-figma channel: `hey1t6k3`
- Previous channel `mict8xwb` should be treated as stale context

### Current build status

- Earlier desktop layout was built, then deleted after the phone-only pivot.
- Phone wrapper is in place with an `8:2` outer frame and `8:4` status bar.
- The active focus card is complete at `8:10` with eyebrow, title, description, wrapping badges, divider, primary completion CTA, snooze/pause row, and ghost abandon action.
- The quick capture card shell exists at `8:34` but its internal fields and actions were not yet built.
- The backlog card has not started.
- Screenshot validation has not yet been done.

### Current tooling note

- Official Figma MCP starter quota was exhausted during setup, so the active working path moved to `cursor-talk-to-figma-mcp` via a Bun websocket bridge as the free alternative.
- Dark-mode palette values were defined in the session summary and should be reused rather than re-picked mid-pass.

### Remaining execution order

1. Complete the contents of the Quick Capture card.
2. Build the Backlog card in the same phone-dark visual language.
3. Capture and validate a screenshot of the assembled phone flow.

## Expanded Figma scope

After the phone-only `Focus` cockpit pass was validated, scope expanded from a single-screen redesign to a full-app phone storyboard in the same dark `cockpit` visual system. The working rule is now: redesign every current page present in the app, including legacy-but-still-existing routes, instead of stopping at `Focus`.

### Locked direction

- Visual system: `Dark cockpit system`
- Form factor: phone-first
- Coverage target: all current app pages and shell-adjacent surfaces
- Legacy routes `Quests` and `Spaces` are included and should be treated as polished secondary screens rather than placeholders

### Current Figma coverage

- `Focus` phone screen: complete and screenshot-validated
- `History`: phone frame created and converted from the shared shell; section structure and initial rows in progress
- `Settings`: phone frame created with spaces, devices, and voice-model sections; refinement in progress
- `Add Device`: phone frame created with discovery and passcode sections; refinement in progress
- `Device`: phone frame created with identity, mapped-spaces, and danger sections; refinement in progress
- `Quests`: phone frame created with filter and list sections; refinement in progress
- `Spaces`: phone frame created with list and add-space sections; refinement in progress

### Frame maintenance note

- New section frames should always be named explicitly as they are created.
- The current TalkToFigma MCP flow does not expose an in-place rename operation for already-cloned outer phone frames, so visible screen headers and newly created section names are the source of truth during this pass.

### Component catalog rule

- The top `Components` row should be organized into explicit columns by component family rather than one mixed board.
- Every component variant example should be shown as a real instance in Figma, not only as a loose frame.
- Each component column may begin with the real master component, followed by the instance examples for that component.
- When a component exposes multiple independent properties, the visible catalog should include the full combination matrix for those properties whenever the total remains tractable.
- Instance labels in the visible catalog should use human-readable titles rather than raw property syntax.
- Naming pattern:
  - single state: `Overdue`, `Today`, `Future`
  - combined state: `Today | Repeat`, `Future | Repeat`, `Today | Time`, `Today | Time | Repeat`
- `Reminder` is the current reference case:
  - base state property: `overdue | today | future`
  - secondary property: `repeat = false | true`
  - tertiary property: `time = absent | present`
  - required visible matrix: `3 x 2 x 2 = 12` real instance examples
- The component master may live outside the visible catalog area if needed; the visible catalog should prioritize the instance matrix rather than repeating the untouched master component.

## Open question

> [!question]
> If the first implementation pass goes well, should the same DaisyUI visual language extend next to the app shell/navigation or stay isolated to `Focus` until after user testing?
