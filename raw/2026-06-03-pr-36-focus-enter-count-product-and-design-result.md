# PR 36 Focus Enter Count Product And Design Result

Date: 2026-06-03
Status: implementation result
Related: GitHub PR #36, issue #31, Focus, quests, attention signals

## Context

PR #36 added a Focus usage signal to Fini: how often a quest becomes the active Focus target. The product intent was not to build analytics infrastructure, but to give Fini a small durable signal that distinguishes first-time attention from repeated returns to the same quest.

The PR was merged to `main` after CI passed and review threads were resolved.

## Summary

Fini now records a `focus_enter_count` on each quest. The count increases when the user enters Focus for a quest, including Focus transitions created by reminder handling and CLI-driven Focus commands.

The user-visible behavior is intentionally subtle: the active quest panel only surfaces the repeat-Focus badge after the quest has been entered more than once. This keeps first-time Focus clean while allowing repeated attention to become visible as a signal.

## Product / Business Logic Outcomes

- Quests now carry an attention-history signal: `focus_enter_count`.
- First-time Focus entry is recorded but not emphasized in the UI.
- Repeat Focus entries become visible to the user as a lightweight cue that they have returned to the same quest.
- Reminder-driven Focus transitions count the same as manual Focus transitions, so notification/reconciler flows do not become second-class product paths.
- CLI Focus commands participate in the same product semantics as the app UI, keeping automation and power-user workflows consistent with normal app behavior.
- The feature strengthens Fini's long-term ability to reason about attention, prioritization, and repeated context switching without introducing a full analytics system.

## System Design Decisions

- Store the count on the quest itself, because the signal describes the quest's attention history rather than a separate analytics event stream.
- Keep the field name `focus_enter_count` as the canonical domain term.
- Treat the count as a small persisted domain field, not as a new sync protocol or independent telemetry pipeline.
- Preserve the count in normal quest sync payloads so synced quest rows do not drop the field during ordinary upserts.
- Defer immediate count-only cross-device sync. The design intentionally avoids introducing monotonic merge semantics, ordering guarantees, tombstone handling, or special conflict-resolution rules for this PR.
- Keep the UI behavior conservative: show repeat-Focus state only when `focus_enter_count > 1`.
- Keep backup format handling explicit by bumping the backup version, rather than silently accepting old backups whose schema cannot represent the new quest field.

## Deliberately Not Done

- No analytics dashboard.
- No new global activity/event stream for Focus entries.
- No special count-only SpaceSync operation.
- No attempt to make focus-enter counts immediately converge across devices independent of normal quest sync.
- No large redesign of Focus prioritization, quest ranking, or reminder behavior.

## Evidence

- PR #36 merged to `main` after final verification.
- Final PR checks before merge were green, including frontend tests, backend tests, backend compile, E2E tests, Android Emulator E2E, and Snyk.
- Final PR status before merge was clean and mergeable.
- Review threads were resolved before merge.

## Open Questions

- Should `focus_enter_count` remain a lightweight local/product signal, or should future versions make it a cross-device convergent metric?
- Should repeated Focus become an input to prioritization or suggestions, or remain only a visible cue for now?
- Should future backup import support migrate older backup formats into the newer quest schema, or is explicit version rejection acceptable at this stage?
