---
title: Focus
type: concept
created: 2026-04-12
updated: 2026-06-03
sources: [2026-03-21-mvp-baseline, 2026-03-29-device-synchronizations-design, 2026-04-21-notifications-grilling, 2026-05-04-computed-focus-reminder-preemption, 2026-05-22-focus-entry-count-priority-signal, 2026-06-03-pr-36-focus-enter-count-product-and-design-result]
tags: [quest, focus, resolver]
claim_status: locked
evidence: source-backed
---

# Focus

Currently selected quest for user action. Computed by pure getter over quest state and [[FocusHistory]] events; no separate mutable state.

> Alias: earlier docs and code may use `Main`. Treat as identical. Rename is a hard cut-over with no runtime aliases.

## Resolution inputs

- Active quests (`status = active`)
- [[FocusHistory]] event log (ordered newest-first)
- Current time (for overdue / reminder validity checks)

## Resolver rules

1. Build valid timestamp candidates from persisted [[FocusHistory]] events and active reminder due timestamps.
2. The newest valid timestamp wins → that quest is Focus.
3. If no valid candidate remains, apply fallback order.

Persisted events from `manual`, `reminder`, and `restore` triggers remain timestamp-ordered. Newer reminder semantics add virtual reminder-due timestamps as the same priority class for active quests [[sources/2026-05-04-computed-focus-reminder-preemption]].

> [!warning] Superseded by [[sources/2026-05-04-computed-focus-reminder-preemption]] (2026-05-04)
> The older reconciler-only framing implied open-app reminder preemption required a persisted `trigger = reminder` `focus_history` row. Newer Focus semantics treat due reminder timestamps as virtual focus events, so a quest can become Focus at its due boundary even while the app is already open.

## Fallback order

Applied when no FocusHistory event resolves to an active quest:

1. Overdue quests first (`due_at_utc` passed)
2. Lower `order_rank` first
3. Higher `priority` first
4. Oldest `created_at` first

## Reminder preemption

- Active quest reminder due timestamps are virtual focus events that compete directly with persisted Focus timestamps [[sources/2026-05-04-computed-focus-reminder-preemption]].
- A future reminder must not preempt current Focus before its due time [[sources/2026-05-04-computed-focus-reminder-preemption]].
- Once the reminder is due, the due quest should become Focus even if the app is already open and no new `focus_history` row has been written yet [[sources/2026-05-04-computed-focus-reminder-preemption]].
- If reminder target is already `completed` or `abandoned` at fire time, it is not a valid active candidate [[sources/2026-05-04-computed-focus-reminder-preemption]].
- Persisted `trigger = reminder` rows still matter for historical/reconciled cases, but they are no longer required for open-app reminder preemption [[sources/2026-05-04-computed-focus-reminder-preemption]].
- Focus does **not** depend on [[os-notification]]. OS notifications depend on Focus + [[Reminder]], not the reverse [[sources/2026-04-21-notifications-grilling]].

## Manual override

- Manual Set Focus appends a [[FocusHistory]] event with `trigger = manual`.
- Durable across restart (FocusHistory is persisted).
- Dominates fallback-order computation until the target becomes inactive.

## Restore

- Restoring a quest from history appends a [[FocusHistory]] event with `trigger = restore`.
- Restored quest becomes Focus immediately (latest event wins).

## Focus entry count

Fini now records a `focus_enter_count` on each quest as a persisted attention-history signal [[sources/2026-06-03-pr-36-focus-enter-count-product-and-design-result]].

- The count increases when a quest enters Focus, including app UI, reminder handling, and CLI-driven Focus commands [[sources/2026-06-03-pr-36-focus-enter-count-product-and-design-result]].
- The signal describes repeated attention to the quest; it is not a new analytics event stream or prioritization engine [[sources/2026-06-03-pr-36-focus-enter-count-product-and-design-result]].
- The active quest panel surfaces repeat-Focus state only when `focus_enter_count > 1`, keeping first-time Focus visually quiet [[sources/2026-06-03-pr-36-focus-enter-count-product-and-design-result]].
- The count is preserved in ordinary quest sync payloads, but count-only cross-device convergence is deliberately deferred [[sources/2026-06-03-pr-36-focus-enter-count-product-and-design-result]].

> [!warning] Superseded by [[sources/2026-06-03-pr-36-focus-enter-count-product-and-design-result]] (2026-06-03)
> The earlier focus-entry-count ticket proposed possible event/aggregate implementation shapes because virtual reminder Focus is not always backed by `focus_history`. The shipped PR stores `focus_enter_count` directly on the quest [[sources/2026-05-22-focus-entry-count-priority-signal]].

## Replication

Focus is owner-scoped metadata. Full replication rules live in [[FocusHistory]] and [[SpaceSync]]; summary:

- Replicate focus events only between peers that map `Personal` (`space_id = "1"`).
- Replicate only events whose target quest's `space_id` is currently mapped for the pair.

## Automation surface

- Product/exposed MCP is abandoned; CLI is the supported automation surface [[sources/2026-05-28-mcp-surface-decision]] [[sources/2026-05-29-pr-41-feature-plane-mcp-release-handoff]].
- Legacy MCP naming such as `get_active_quest` remains historical only.
