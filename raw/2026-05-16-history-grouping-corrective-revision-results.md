# History Grouping — Corrective Revision Implementation Results

Date: 2026-05-16
Status: implementation result
Related: issue #20, [[2026-05-15-history-grouping-discussion]], [[2026-05-14-history-grouping-implementation-results]]

## Context

An initial implementation of issue #20 (History series grouping) was produced by OpenAI Codex on branch `issue-20-history-grouping`. A scrupulous review surfaced multiple defects and deviations from user intent. This document records the corrective revision — written from scratch on branch `issue-21-context-menu-side-sheet` (a carry-over branch; no dedicated branch was created for this pass).

The corrective revision goal was to bring the implementation into alignment with user-locked semantics from [[2026-05-15-history-grouping-discussion]] and the corrective plan.

## Decisions

All locked from previous discussion session. Re-confirmed by implementation:

- **No count badge** — the grouped header shows only the status pill (Completed / Abandoned / Mixed N / M), no occurrence count.
- **No dedicated HistoryGroupRow component** — History reuses `QuestList.vue` via an optional `groupChildrenById` prop; the same component adapts its row markup by status.
- **Mixed-status pill** — `Mixed N / M` label with a neutral `.quest-status-badge.mixed` style when children carry both completed and abandoned statuses.
- **Group restore** = restore the latest resolved child only (`children[0]`, newest-first sorted).
- **Delete series** = `window.confirm(...)` → `deleteQuestSeries(series_id)` → deletes all past and future occurrences and the `quest_series` row. Always confirmed. No per-child delete.
- **Chevron affordance** — `ChevronRightIcon` (rotates 90° when expanded) on group rows only; non-group rows retain click-to-expand-editor behavior.
- **Children lazy-render** via `v-if="expanded"` — fully unmounts on collapse, no need to preserve child state.
- **Tauri arg naming** — `{ series_id: seriesId }` (snake_case), not `{ seriesId }`. Consistent with all other Tauri commands in the file.
- **Reminder cancellation is best-effort** — OS notification cancel is non-transactional; runs before the DB transaction. Failure is logged, not surfaced to user.
- **`delete_quest_series_in_db`** — inner pure DB function extracted so tests can run without a Tauri `AppHandle`.
- **`MutexGuard` deref pattern** — `&mut *conn` everywhere in Tauri commands (not `&mut conn`). This is the repo's existing pattern; the initial Codex implementation missed it.

## Files Changed

### Frontend

- **`src/components/QuestsView/QuestList.vue`** — Major extension. New prop `groupChildrenById?: Record<string, Quest[]>`. New helpers: `getGroupChildren`, `rowStatusClass`, `rowStatusLabel`, `onCheckClick`, `deleteSeriesConfirm`. Context menu branches on group vs normal. Template: collapsed row conditionally shows chevron + mixed pill; expanded state branches between children list (`v-if`) and QuestEditor (`v-else-if`). New CSS: `.quest-status-badge.mixed`, `.group-children`, `.group-child-row`, `.quest-group-chevron`, `.is-expanded-group`.
- **`src/components/QuestsView/QuestList.md`** — Added `groupChildrenById` prop docs and full group row / group context menu section.
- **`src/views/HistoryView.vue`** — Simplified to single `<QuestList :quests="grouped.rows" :group-children-by-id="grouped.groupChildrenById" />` call.
- **`src/views/HistoryView.md`** — Rewrote. Removed HistoryGroupRow references. Documents chevron affordance, v-if lazy-render, Mixed badge, delete-past-and-future semantics.
- **`src/utils/historyGrouping.ts`** — Moved from `src/views/`. New return type `{ rows: Quest[], groupChildrenById: Record<string, Quest[]> }`. O(n) Set-based dedupe (was O(n²) `.some()`). `historyQuestTime` export for shared sort key.
- **`src/utils/historyGrouping.md`** — Moved from `src/views/`. Updated with new return type docs.
- **`src/spec/utils/historyGrouping.spec.ts`** — Moved from `src/spec/views/`. Updated to new API. Added two new test cases: single resolved occurrence passes through without grouping; mixed-status series groups correctly.
- **`src/stores/quest.ts`** — Fixed `deleteQuestSeries` Tauri arg: `{ series_id: seriesId }` (was `{ seriesId }`).

### Deleted

- `src/components/HistoryView/HistoryGroupRow.vue` — removed; History uses QuestList directly.
- `src/components/HistoryView/HistoryGroupRow.md` — removed.

### Backend (Rust)

- **`src-tauri/src/services/quest.rs`** — Extracted `delete_quest_series_in_db(conn: &mut SqliteConnection, device_id, series_id)`. New Tauri command `delete_quest_series` with best-effort reminder cancellation before DB transaction. Fixed `&mut *conn` deref pattern throughout (Codex used `&mut conn` which fails with `MutexGuard`). Added inline comment on reminder non-transactionality.
- Added 2 new Rust unit tests: `delete_quest_series_removes_all_children_and_series_row`, `delete_quest_series_emits_sync_events_for_each_quest_and_series`.

### E2E

- **`specs/e2e/ui/tests/history-series-grouping.spec.ts`** — Rewrote. Replaced old testids (`history-group-row`, `history-group-header`, `history-group-children`) with new ones (`quest-row-group-header`, `quest-row-group-expander`, `quest-row-group-children`). Added cancel-path coverage (confirm spy, asserts row survives). Added `History header shows Mixed status when children disagree` test.

## Verification

All checks passed on 2026-05-16:

- `npm run build` (vue-tsc + vite): ✓ 450 modules, no type errors
- Jest `src/spec/utils/historyGrouping.spec.ts`: ✓ 4 tests pass
- `cargo test services::quest` from `src-tauri/`: ✓ 20 tests pass (including 2 new delete-series tests)
- E2E (`make e2e-ci`): not run in this session; deferred to manual or CI pass.

## Open Questions

- E2E suite not verified locally — `make e2e-ci` was not run. The rewritten spec uses new testids that match the QuestList template; should pass, but e2e has not been executed to confirm.
- Mixed-status label wording shipped as `Mixed N / M` (e.g. `Mixed 2 / 1`). If this reads awkwardly in production, alternative was `N completed · M abandoned`.
- Long-series pagination (> ~20 children) was explicitly deferred. No pagination or virtual scroll in the children list.
