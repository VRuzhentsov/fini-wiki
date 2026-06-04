# Focus Entry Count Priority Signal

Date: 2026-05-22
Status: raw capture | ticket handoff | design brief
Related: `../fini/src/views/FocusView.md`, `../fini/src/components/FocusView/ActiveQuestPanel.vue`, `../fini/src/components/QuestsView/QuestList.vue`, `../fini/src-tauri/src/services/quest.rs`, `../fini/specs/e2e/focus-reminder-preemption.md`, `../fini-design/project/README.md`

## Context

The user wants Fini to track how often a Quest enters the current Focus state and show that count in the UI as a signal that this Quest keeps returning and deserves attention.

Original user intent, translated into Fini terms: every time a Quest becomes current Focus, Fini should maintain a count for that Quest and show in the UI that this is now a higher-attention/high-priority Quest because it has repeatedly come back instead of being completed.

The user explicitly asked to document this as:

- a raw document in `fini-wiki`
- a GitHub ticket
- a handoff prompt for another agent doing design

## Summary

Add a per-Quest Focus entry count: the number of discrete times a Quest becomes current Focus. The count should be displayed as a warm attention signal in the active Focus UI, not as a guilt mechanism.

This should be modeled as a Focus-transition metric, not as a direct replacement for `quest.priority`. In v1 it should not change Focus resolution order automatically. It should provide visibility: "this Quest keeps returning to Focus".

The design language must follow Fini's ADHD-friendly tone. Fini should not shame the user for deferring work. The UI should communicate quiet importance and accumulated attention, using copy such as `Focus 4 times`, `Keeps returning`, or `High attention`, not copy such as `you failed`, `ignored`, or `you keep postponing`.

## Decisions

- Track discrete Focus entries per Quest.
- Do not increment the count on every `get_active_focus` read, frontend render, refresh, or polling cycle.
- Include every source by which a Quest can become Focus: manual Set Focus, restore, reminder due preemption, and fallback selection.
- Keep the count informational in v1; do not automatically change `quest.priority` or Focus resolution order.
- Surface the signal first on the active Focus card.
- Consider a compact secondary treatment in active backlog rows only if it stays quiet and does not clutter the list.
- Use warm, non-scolding UI copy consistent with Fini's design principles.

## Product Requirements

### Goal

Help the user notice Quests that repeatedly return to Focus without creating guilt or obligation pile-up.

### User Story

As a Fini user, I want to see when a Quest has repeatedly become my Focus so that I can recognize it as a high-attention Quest and decide to complete, abandon, or consciously move on.

### Behavior Rules

- A Focus entry is counted when a Quest becomes current Focus after not being current Focus immediately before.
- Repeated reads of the same current Focus do not increment the count.
- A Quest that leaves Focus and later becomes Focus again increments again.
- Manual Set Focus increments when it causes the Quest to become current Focus.
- Restore increments when the restored Quest becomes current Focus.
- Reminder due preemption increments when the reminder Quest becomes Focus at its due boundary.
- Fallback selection increments when a fallback Quest becomes Focus after no active focus candidate remains.
- Completing or abandoning a Quest does not erase its historical count.
- The count should stay local-first and sync consistently with the relevant Quest/Focus semantics if this data becomes part of sync scope.

### UI Requirements

- Active Focus card shows the count once it is meaningful.
- The first Focus entry may be hidden or shown as a very quiet `Focus 1 time`; design agent should decide.
- Higher counts should visually read as increased attention, not warning or failure.
- Avoid red/error styling unless product explicitly decides a threshold is critical.
- Avoid guilt copy.
- Support light and dark themes.
- Work on both desktop and mobile.

## Implementation Notes

Current evidence suggests Focus is a computed getter, not a mutable singleton:

- `../fini/src/views/FocusView.md` says Focus is computed from persisted quest data/events.
- `../fini/src-tauri/src/services/quest.rs` resolves Focus from active quests, persisted `focus_history`, virtual reminder due timestamps, then fallback ordering.
- `../fini/specs/e2e/focus-reminder-preemption.md` explicitly says reminder-driven Focus can be virtual and does not require a persisted `trigger = reminder` `focus_history` row.

Because `get_active_focus` is a read path and may be called repeatedly, the implementation must avoid naive "increment on read" behavior. A future implementer should introduce either:

- a transition observer that compares previous resolved Focus id to current resolved Focus id and records a Focus entry only on change, or
- a persisted event/aggregate model that all Focus-changing write paths and virtual reminder transitions update exactly once.

The correct implementation shape needs engineering review because virtual reminder Focus is not always backed by a `focus_history` row.

Likely touched areas:

- Rust schema/migration for the count or event table.
- Rust Focus resolver/command layer in `src-tauri/src/services/quest.rs`.
- Rust model/schema exports in `src-tauri/src/models/` and `src-tauri/src/schema.rs`.
- Frontend `Quest` type and store in `src/stores/quest.ts`.
- Active Focus UI in `src/components/FocusView/ActiveQuestPanel.vue`.
- Optional backlog UI in `src/components/QuestsView/QuestList.vue` or shared `QuestEditor.vue` metadata.
- Specs/docs around Focus semantics.

## GitHub Issue Draft

Title: Track Focus entry count and show repeat-focus priority signal

Labels: `feature`, `design`

```markdown
## Context

Fini shows one current Focus quest at a time. Some Quests repeatedly become Focus without being completed. We want to count those Focus entries and surface a warm priority/attention signal in the UI.

Current Focus is computed from active quests, FocusHistory events, virtual reminder due timestamps, and fallback ordering. Reminder-driven Focus can be virtual, so this cannot be implemented by simply counting persisted `focus_history` rows.

## Problem / Goal

Track how many discrete times each Quest enters current Focus and show that count as an attention signal.

The signal should help the user notice "this Quest keeps returning" without shaming them or creating guilt accumulation.

## User Story

As a Fini user, I want to see when a Quest has repeatedly become my Focus so that I can recognize it as a high-attention Quest and decide to complete, abandon, or consciously move on.

## Scope

- Persist a per-Quest Focus entry count or equivalent event log.
- Count discrete Focus transitions, not every read/render.
- Count manual Set Focus, restore, reminder due preemption, and fallback selection.
- Expose the count to the frontend.
- Show the signal on the active Focus card.
- Consider a compact version in active backlog rows if it stays quiet.
- Update companion docs/specs for Focus semantics.

## Out Of Scope

- Do not change Focus resolution order in v1.
- Do not automatically mutate `quest.priority` from this count.
- Do not add cloud analytics or telemetry.
- Do not use guilt/scolding copy.

## Behavior Rules

- A Quest entering Focus increments its count exactly once per discrete transition.
- Calling `get_active_focus`, refreshing the frontend, or polling does not inflate the count.
- If Quest A is Focus, repeated reads of Quest A do not increment.
- If Focus moves from Quest A to Quest B, Quest B increments once.
- If Quest A later becomes Focus again, Quest A increments again.
- Reminder-driven virtual Focus entries are counted when they actually become current Focus.
- Completing or abandoning a Quest does not erase its historical count.

## Visual Requirements

- Active Focus card shows the count once it is meaningful.
- Copy should be warm and non-scolding.
- Preferred copy directions: `Focus 4 times`, `Keeps returning`, `High attention`.
- Avoid copy directions: `You failed`, `Ignored`, `You keep postponing`, `Overdue again`.
- Support light and dark themes.
- Preserve Fini's flat DaisyUI/Tailwind visual language.

## Implementation Notes

- Current Focus resolver lives around `src-tauri/src/services/quest.rs`.
- Frontend Quest store currently calls `get_active_focus` in `src/stores/quest.ts`.
- Primary UI surface is `src/components/FocusView/ActiveQuestPanel.vue`.
- Secondary candidate surface is `src/components/QuestsView/QuestList.vue`.
- `specs/e2e/focus-reminder-preemption.md` is relevant because reminder preemption can be virtual and not backed by a persisted reminder `focus_history` row.

## Acceptance Criteria

- A quest entering Focus increments its Focus entry count exactly once per discrete transition.
- Refreshing or polling current Focus does not inflate the count.
- Manual Set Focus transition is counted.
- Restore-to-Focus transition is counted.
- Reminder-driven virtual Focus transition is counted.
- Fallback-selected Focus transition is counted.
- Active Focus card displays the count or derived attention signal.
- UI copy follows Fini tone: warm, direct, non-scolding.
- Companion docs/specs describe the new count semantics.

## Verification

- Backend unit tests cover transition counting and duplicate-read non-increment.
- Backend or integration test covers reminder-driven virtual Focus counting.
- Frontend/unit or manual QA proves the signal appears on the active Focus card.
- Run the narrowest relevant checks for touched frontend/backend areas.

## Open Questions

- Should count `1` be visible, or should the UI start surfacing the signal at count `2`?
- Should the count be synced between paired devices, and if so under the same owner-scoped FocusHistory rules?
- Should old existing `focus_history` rows backfill initial counts during migration, or should counts start from the feature release?
```

## Design Handoff Prompt

```markdown
You are designing a Fini UI update.

Goal: add a visual treatment for a Quest's Focus entry count: the number of times this Quest has become current Focus.

Read first:
- ../fini-design/README.md
- all files under ../fini-design/chats/
- ../fini-design/project/README.md
- ../fini-design/project/preview/quest-card.html
- ../fini-design/project/preview/quest-list-item.html
- ../fini-design/project/colors_and_type.css

Repo/product context:
- Focus is the currently active Quest.
- Fini is for ADHD brains and must not shame the user.
- The signal means "this Quest keeps returning to Focus and deserves attention," not "you failed."

Design surfaces:
- Primary: active Focus card.
- Secondary: active backlog Quest row, if it can stay quiet and compact.

Copy direction:
- Prefer: `Focus 4 times`, `Keeps returning`, `High attention`.
- Avoid: `You keep postponing`, `Failed`, `Ignored`, `Overdue again`.

Visual constraints:
- Preserve Fini's flat DaisyUI/Tailwind visual language.
- Use existing tokens and Heroicons only.
- No emoji.
- No new gradients, textures, or decorative illustrations.
- Keep motion minimal.
- Support light and dark themes.
- Mobile and desktop must both work.

Deliverable:
Produce a design spec for how the count appears at count 1, 2-3, 4+, and 8+ if thresholds are useful. Include active card and backlog row variants, exact copy, spacing, icon choice, and reduced/no-motion behavior.
```

## Evidence

- `../fini-wiki/_hot.md` records current Focus semantics: Focus treats active reminder due timestamps as virtual focus events, and Active Focus Complete is single-click.
- `../fini-wiki/pages/concepts/focus.md` says Focus is a computed getter over active quests, FocusHistory, and current time.
- `../fini/src/views/FocusView.md` says manual Focus and restore append FocusHistory events, active reminder due timestamps are virtual Focus events, and fallback is overdue > order rank > priority > oldest created.
- `../fini/src-tauri/src/services/quest.rs` shows `resolve_active_quest_at` reads persisted `focus_history`, then compares virtual reminder due timestamps, then falls back.
- `../fini/specs/e2e/focus-reminder-preemption.md` says the E2E does not require a persisted `trigger = reminder` FocusHistory row.
- `../fini-design/project/README.md` says Fini is ADHD-friendly, one Quest at a time, zero guilt accumulation, and warm/permission-giving in tone.

## Open Questions

- Should count `1` be visible, or should the UI start surfacing at count `2`?
- Should counts be synced between paired devices under owner-scoped FocusHistory/Personal-space sync semantics?
- Should migration backfill counts from existing `focus_history`, or should counts start from zero after the feature ships?
- Should a future iteration use the count to affect Focus fallback order, or should it remain purely informational forever?
