# Computed Focus Reminder Preemption

Date: 2026-05-04

## Context

The Android notification setup appears to be working, but testing exposed an inconsistency in Focus behavior. The desired user flow is:

1. Open Fini.
2. Keep an existing current Focus quest.
3. Create a new active quest with a future reminder due in about one minute.
4. Immediately after creating the quest, current Focus must not change.
5. Once the reminder time arrives, the new quest should become Focus because computed Focus logic recognizes that its reminder time has come.

This was discussed after reading the wiki and source. The existing wiki mostly describes reminder preemption through persisted `focus_history` rows written by launch/engagement reconciliation, but this session chose a stronger computed Focus rule.

## Summary

Reminder due timestamps should be treated as virtual Focus events. For active quests, `quest.due + quest.due_time` competes directly with persisted Focus event timestamps such as manual Set Focus. The current Focus resolver should choose the youngest valid timestamp, regardless of whether it came from a manual `focus_history.created_at` row or from a due reminder timestamp.

## Decisions

- Lock implementation semantic: **Computed Due Wins**.
- Active quest reminder due timestamps are virtual focus events.
- Reminder due timestamps have the same priority class as manual Focus timestamps.
- The winner is the newest valid timestamp among active quest candidates.
- A future reminder must not preempt current Focus before its due time.
- Once the reminder is due, the due quest should become Focus even if the app was already open.
- The computed resolver should not require a persisted `trigger = reminder` `focus_history` row for this specific open-app behavior.
- Existing `focus_history` remains relevant for manual, restore, and historical reminder rows, but reminder preemption can be derived directly from quest due fields.

## Plan

1. Add a new e2e/spec doc, likely `specs/e2e/focus-reminder-preemption.md`, describing the scenario and evidence chain.
2. Cross-reference the behavior from `src/views/FocusView.md` or another companion Focus doc.
3. Update `src-tauri/src/services/quest.rs` so `resolve_active_quest` considers active due reminder timestamps alongside `focus_history.created_at`.
4. Add or update backend resolver tests to prove:
   - manual Focus wins before a future reminder is due
   - due reminder wins after its due timestamp
   - newest timestamp wins when both manual and reminder candidates are valid
5. Add UI/e2e coverage that opens the app, creates a near-future reminder quest, asserts Focus unchanged immediately, waits past due time, then asserts the reminder quest becomes Focus.
6. Add the smallest frontend refresh mechanism needed while Focus is open so the UI re-reads computed Focus when the next reminder due boundary passes.
7. Verify with narrow Rust resolver tests and the relevant Playwright/e2e target before wider `make e2e-headed` coverage.

## Evidence

- Wiki hot cache, `../fini-wiki/_hot.md`, says reminder scheduling source of truth is now `quest.due` + `quest.due_time`, and Android reminder delivery is mostly wired.
- Wiki `pages/concepts/focus.md` currently says Focus walks `FocusHistory` newest to oldest and treats manual/reminder/restore trigger ordering as timestamp-only.
- Wiki `pages/concepts/FocusHistory.md` currently says reminder rows are written by a main-process reconciler on app engagement and backdated to original fire time.
- Wiki `pages/concepts/Reminder.md` currently says a reminder can exist with a future fire time and no `focus_history` row, and reminder firing can preempt Focus.
- Source `src-tauri/src/services/quest.rs:297` currently resolves Focus by walking `focus_history.created_at DESC`, then using fallback ordering. It does not directly compare active quest due timestamps with manual Focus history.
- Source `src-tauri/src/services/reconciler.rs:11` runs on app launch and handles past-due reminders by inserting `focus_history` if not already recorded. This does not cover a reminder becoming due while the app is already open unless another engagement/reconciliation happens.
- Source `src-tauri/src/services/notification.rs:126` schedules mobile OS notifications or desktop in-process timers. The scheduling path records notification events in e2e mode but does not directly write FocusHistory or refresh active Focus.
- Source `src/stores/quest.ts:59` fetches active Focus through `get_active_focus`, but the store only refreshes during quest fetches/manual operations; it does not currently appear to refresh at reminder due boundaries.
- Existing e2e `specs/e2e/ui/tests/reminder-flow.spec.ts` proves creating a quest and setting due time schedules the reminder path, but it does not assert computed Focus preemption after the due time arrives.

## Open Questions

- Exact e2e home for the test remains to be decided during implementation: extend `specs/e2e/ui/tests/reminder-flow.spec.ts` or add a dedicated Focus/reminder spec.
- The frontend refresh mechanism should be kept minimal; likely a timer keyed to the next due reminder boundary, but implementation should confirm existing lifecycle patterns first.
- Wiki synthesized pages should be updated later during ingestion to supersede the older reconciler-only framing.

## Deferred Work

- No wiki ingestion was performed in this capture.
- No source files were changed in this capture.
- No tests were run in this capture.
