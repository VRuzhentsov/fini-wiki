---
title: 2026-05-22 Focus Entry Count Priority Signal
type: source
created: 2026-06-03
updated: 2026-06-03
sources: [2026-05-22-focus-entry-count-priority-signal]
tags: [fini, focus, quest, design, ticket]
claim_status: superseded
evidence: source-backed
---

# 2026-05-22 Focus Entry Count Priority Signal

This source records the ticket/design brief for tracking how many discrete times a quest becomes current [[focus]]. It frames the count as an ADHD-friendly attention signal, not a guilt or analytics mechanism [[sources/2026-05-22-focus-entry-count-priority-signal]].

> [!warning] Superseded by [[sources/2026-06-03-pr-36-focus-enter-count-product-and-design-result]] (2026-06-03)
> The ticket direction was implemented as `focus_enter_count` on quests, with repeat-Focus UI shown only when the count is greater than one.

## Key claims

- Count discrete Focus transitions, not reads, renders, polling, or repeated `get_active_focus` calls [[sources/2026-05-22-focus-entry-count-priority-signal]].
- Count all ways a quest can become Focus: manual Set Focus, restore, reminder due preemption, and fallback selection [[sources/2026-05-22-focus-entry-count-priority-signal]].
- Keep the signal informational in v1; do not mutate `quest.priority` or change Focus resolution order [[sources/2026-05-22-focus-entry-count-priority-signal]].
- Active Focus UI should surface the signal warmly with copy like `Focus 4 times`, `Keeps returning`, or `High attention`, avoiding shame language [[sources/2026-05-22-focus-entry-count-priority-signal]].
- Because reminder-driven Focus can be virtual, implementation must not rely only on persisted `focus_history` rows [[sources/2026-05-22-focus-entry-count-priority-signal]].

## Open questions

- Historical questions about visibility at count `1`, sync semantics, and backfill are partly resolved by the later PR #36 implementation result [[sources/2026-06-03-pr-36-focus-enter-count-product-and-design-result]].

## Related pages

- [[focus]]
- [[Quest]]
- [[FocusHistory]]

updates:: [[pages/concepts/focus]]
