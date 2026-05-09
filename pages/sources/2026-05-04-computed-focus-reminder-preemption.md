---
title: 2026-05-04 Computed Focus Reminder Preemption
type: source
created: 2026-05-04
updated: 2026-05-04
sources: [2026-05-04-computed-focus-reminder-preemption]
tags: [fini, focus, reminder, resolver, preemption]
---

# 2026-05-04 Computed Focus Reminder Preemption

Focus should treat reminder due timestamps as virtual focus events. Under the locked `Computed Due Wins` rule, the current Focus resolver should compare active reminder due timestamps directly against persisted `FocusHistory` timestamps and choose the newest valid timestamp, even while the app is already open [[sources/2026-05-04-computed-focus-reminder-preemption]].

## Key claims

- Active quest reminder due timestamps are virtual focus events [[sources/2026-05-04-computed-focus-reminder-preemption]].
- Reminder due timestamps share the same priority class as manual Focus timestamps [[sources/2026-05-04-computed-focus-reminder-preemption]].
- A future reminder must not preempt current Focus before its due time, but once due it should become Focus even if the app was already open [[sources/2026-05-04-computed-focus-reminder-preemption]].
- Open-app reminder preemption should not require a persisted `trigger = reminder` `focus_history` row [[sources/2026-05-04-computed-focus-reminder-preemption]].
- Existing `focus_history` remains relevant for manual, restore, and historical reminder rows, but reminder preemption can be derived directly from quest due fields [[sources/2026-05-04-computed-focus-reminder-preemption]].

## Open questions

- Exact E2E home remains open: extend `specs/e2e/ui/tests/reminder-flow.spec.ts` or add a dedicated Focus/reminder spec [[sources/2026-05-04-computed-focus-reminder-preemption]].
- Frontend refresh should stay minimal; a timer keyed to the next due reminder boundary is a likely direction, but implementation should confirm existing lifecycle patterns first [[sources/2026-05-04-computed-focus-reminder-preemption]].

## Related pages

- [[focus]]
- [[Reminder]]
- [[FocusHistory]]
