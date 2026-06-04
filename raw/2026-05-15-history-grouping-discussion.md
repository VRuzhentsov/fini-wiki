# History Grouping — Review, User Decisions, and Corrective Plan

Date: 2026-05-15
Status: design brief / ticket handoff
Related: https://github.com/VRuzhentsov/fini/issues/20, branch `issue-20-history-grouping`, prior raw `[[2026-05-14-history-grouping-implementation-results]]`

## Context

After the initial implementation landed (see `2026-05-14-history-grouping-implementation-results`), a code review against the plan and user feedback session locked several UX and architecture decisions that differ from the first implementation. This document captures those decisions for future ingestion and serves as the authoritative brief for the corrective implementation pass.

Related concepts: [[QuestOccurrence]], [[QuestSeries]], [[2026-05-04-history-grouped-occurrence-ticket]].

## Summary

The first implementation introduced a dedicated `HistoryGroupRow.vue` component and shipped a count badge (`Nx`) on the group header. After review, the user:

- Rejected the count badge entirely.
- Required mixed-status indication on the header.
- Required unified rendering: History must use the same `QuestList.vue` component as the active list; no dedicated HistoryGroupRow component.
- Locked delete-series semantics: wipes past **and future** occurrences (all quests with that `series_id`, active or resolved) plus the `quest_series` row, always behind a confirm dialog.
- Locked no per-occurrence delete inside a group — children restore-only.
- Approved keeping the side-fix changes (Makefile, `device_connection/runtime.rs`, `space_sync/ws_client.rs`, `space_sync/commands.rs` peer-id refactor, `fini-dev/SKILL.md` Code Reuse section) on the same branch without change.

## Decisions

### No count badge

User explicitly does not want a count badge on the group header. The existing E2E assertion `not.toContain('2x')` that Codex wrote is correct and must stay. The collapsed group row should read identically to a standalone history row (status pill · timestamp · title · space badge), distinguished only by the mixed-status pill and the expand chevron.

### Mixed-status pill

When children include both `completed` and `abandoned` occurrences, the header status pill changes from the uniform `Completed`/`Abandoned` pill to a `Mixed Nc / Na` pill. Single-status groups keep the existing pill style and color. QuestList.vue computes the mixed indicator from the `groupChildrenById` map.

### Unified component: QuestList.vue

History must render via the same `QuestList.vue` component used by the active list. The architectural difference is:
- Active list: each row is a standalone active quest (or the representative of a collapsed active series — already handled by the backend's `collapse_active_series_occurrences`).
- History list: resolved (completed/abandoned) rows, some of which are "group representatives" carrying `groupChildrenById[id]`.

`QuestList.vue` gains an optional `groupChildrenById?: Record<string, Quest[]>` prop. When a row's id exists in that map, it renders as a group representative: same header layout, but the expand affordance becomes a chevron (not the full QuestEditor), and the expanded body is a nested compact list of children.

`HistoryGroupRow.vue` and `HistoryGroupRow.md` are deleted.

`historyGrouping.ts` moves from `src/views/` to `src/utils/`, and its API changes from returning `HistoryItem[]` to returning `{ rows: Quest[]; groupChildrenById: Record<string, Quest[]> }`.

### Expand affordance

Row body click (or a `ChevronDownIcon` at the row end) toggles expand/collapse for group rows. The existing check glyph keeps its "restore" meaning — for a group representative, it restores the latest (first sorted) child, exactly as the standalone row's check restores that single quest. Semantics are identical in both cases: "click check → make active."

### Delete series semantics

`delete_quest_series` already deletes all quests with that `series_id` including active ones. The confirm copy must reflect this: `"Delete entire series \"<title>\"? This removes every past and future occurrence and cannot be undone."` No occurrence count in the message (user decided against it). The frontend passes `series_id` in snake_case to `invoke()` to match repo convention.

### Per-occurrence delete: none

Inside an expanded group, child rows have only a restore check glyph. No context menu, no delete option. To delete a single occurrence a user would first restore it (making it active), then delete it from the active list via the normal flow.

### Test coverage additions

1. Rust unit tests for `delete_quest_series`:
   - Asserts all child quests + series row are gone.
   - Asserts N+1 sync events in outbox (N quest delete + 1 quest_series delete).
2. Updated `historyGrouping.spec.ts`:
   - Adapted to new `{ rows, groupChildrenById }` return shape.
   - Mixed-status grouping case.
   - Single-resolved-occurrence passes through un-grouped.
3. E2E additions:
   - Mixed-status header assertion.
   - Delete-series covers both cancel (series stays) and confirm (all past+future gone).

## Model contrast: per-occurrence vs. advance-the-due

A key architectural consideration that informed the approach:

Fini uses **per-occurrence persistence**: each completed or abandoned occurrence is a separate quest row with its own `series_id` + `period_key`. This enables deterministic cross-device sync (same period occurrence can't be created twice), focus history, and completion attribution.

An alternative model (seen in some task apps) is **single-row advance-the-due**: one quest row per repeating task; on completion, the due date rolls forward and the task stays "active." Completion events are logged in a per-item audit log, not as separate rows. This model avoids the History noise problem entirely because no separate occurrence rows exist.

Fini's per-occurrence model is the right choice given sync requirements. The History grouping fix is therefore necessary as a presentation layer adaptation, not a sign of model debt. If a future migration to single-row recurring ever happens, the History grouping code becomes dead weight — but that's a separate architectural discussion.

## Long-series considerations

Deferred mitigations (in priority order; only the first is shipped):
1. `v-if="expanded"` on children — lazy unmount, sufficient for hundreds of rows.
2. Pager footer ("Show N more") for groups exceeding a threshold (~100). Not yet implemented.
3. "Open occurrences" dialog alternative for very large groups. Deferred until usage shows pain.

## Open Questions

- Mixed-status label wording: `Mixed 2 / 1` vs `2 completed · 1 abandoned`. Choose on first manual review.
- When a richer in-app confirm modal exists for delete, migrate `delete_quest_series` confirm away from native `confirm()`.
- Whether the pager threshold needs to be user-facing config or hard-coded; lean hard-coded.
