---
title: Focus
type: concept
created: 2026-04-12
updated: 2026-04-12
sources: [2026-03-21-mvp-baseline, 2026-03-29-device-synchronizations-design]
tags: [quest, focus, resolver]
---

# Focus

Currently selected quest for user action. Computed by pure getter over quest state and [[FocusHistory]] events; no separate mutable state.

> Alias: earlier docs and code may use `Main`. Treat as identical. Rename is a hard cut-over with no runtime aliases.

## Resolution inputs

- Active quests (`status = active`)
- [[FocusHistory]] event log (ordered newest-first)
- Current time (for overdue / reminder validity checks)

## Resolver rules

1. Walk [[FocusHistory]] newest → oldest.
2. First event whose target quest is still `active` wins → that quest is Focus.
3. If the walk exhausts without a valid target, apply fallback order.

LIFO preemption is a property of the walk, not a separate stack. Events from `manual`, `reminder`, and `restore` triggers are uniform; ordering is timestamp-only.

## Fallback order

Applied when no FocusHistory event resolves to an active quest:

1. Overdue quests first (`due_at_utc` passed)
2. Lower `order_rank` first
3. Higher `priority` first
4. Oldest `created_at` first

## Reminder preemption

- Reminder fire → append [[FocusHistory]] event with `trigger = reminder`.
- If reminder target is already `completed` or `abandoned` at fire time, reminder is suppressed and no event is written.
- Completing the reminder-target quest does not mutate the event; resolver simply skips it on next walk because the target is no longer `active`.

## Manual override

- Manual Set Focus appends a [[FocusHistory]] event with `trigger = manual`.
- Durable across restart (FocusHistory is persisted).
- Dominates fallback-order computation until the target becomes inactive.

## Restore

- Restoring a quest from history appends a [[FocusHistory]] event with `trigger = restore`.
- Restored quest becomes Focus immediately (latest event wins).

## Replication

Focus is owner-scoped metadata. Full replication rules live in [[FocusHistory]] and [[space-sync]]; summary:

- Replicate focus events only between peers that map `Personal` (`space_id = "1"`).
- Replicate only events whose target quest's `space_id` is currently mapped for the pair.

## MCP surface

- `get_active_focus` → QuestRecord or null (see [[mcp-contract]]).
- Legacy name `get_active_quest` is hard-retired.
