---
title: 2026-05-16 History Grouping Corrective Revision Results
type: source
created: 2026-05-16
updated: 2026-05-16
sources: [2026-05-16-history-grouping-corrective-revision-results]
tags: [fini, history, quest-occurrence, implementation, correction]
claim_status: provisional
evidence: source-backed
---

# 2026-05-16 History Grouping Corrective Revision Results

The corrective issue #20 revision realigned the implementation with user-locked semantics: History reuses `QuestList.vue` with `groupChildrenById`, removes `HistoryGroupRow`, removes count badges, adds `Mixed N / M`, deletes entire series behind confirmation, and keeps child rows restore-only. Build, utility tests, and Rust service tests passed; E2E remained deferred [[sources/2026-05-16-history-grouping-corrective-revision-results]].

## Key claims

- `QuestList.vue` gained `groupChildrenById?: Record<string, Quest[]>` plus group-aware helpers, chevron affordance, mixed status badge, group children rendering, and group context-menu branching [[sources/2026-05-16-history-grouping-corrective-revision-results]].
- `HistoryView.vue` now renders one `<QuestList :quests="grouped.rows" :group-children-by-id="grouped.groupChildrenById" />` call [[sources/2026-05-16-history-grouping-corrective-revision-results]].
- `historyGrouping.ts` moved to `src/utils/`, returns `{ rows, groupChildrenById }`, and uses O(n) Set-based dedupe [[sources/2026-05-16-history-grouping-corrective-revision-results]].
- `deleteQuestSeries` now passes `{ series_id: seriesId }`, matching Tauri snake_case conventions [[sources/2026-05-16-history-grouping-corrective-revision-results]].
- Backend extracted `delete_quest_series_in_db` for tests, treats reminder cancellation as best-effort before the DB transaction, and uses the repo's `&mut *conn` `MutexGuard` deref pattern [[sources/2026-05-16-history-grouping-corrective-revision-results]].
- Verification passed `npm run build`, Jest `src/spec/utils/historyGrouping.spec.ts` (4 tests), and `cargo test services::quest` (20 tests) [[sources/2026-05-16-history-grouping-corrective-revision-results]].

## Open questions

- `make e2e-ci` was not run, so the rewritten E2E spec still needs execution [[sources/2026-05-16-history-grouping-corrective-revision-results]].
- Mixed-status wording shipped as `Mixed N / M`, but may change if awkward in production [[sources/2026-05-16-history-grouping-corrective-revision-results]].
- Long-series pagination or virtual scrolling remains deferred [[sources/2026-05-16-history-grouping-corrective-revision-results]].

## Related pages

- [[history-grouping]]
- [[QuestOccurrence]]
- [[QuestSeries]]

updates:: [[pages/sources/2026-05-15-history-grouping-discussion]]
supersedes:: [[pages/sources/2026-05-14-history-grouping-implementation-results]]
