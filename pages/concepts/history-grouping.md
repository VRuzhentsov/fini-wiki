---
title: History Grouping
type: concept
created: 2026-05-16
updated: 2026-05-16
sources: [2026-05-04-history-grouped-occurrence-ticket, 2026-05-14-history-grouping-implementation-results, 2026-05-15-history-grouping-discussion, 2026-05-16-history-grouping-corrective-revision-results]
tags: [fini, history, quest-occurrence, quest-series, ux]
claim_status: provisional
evidence: source-backed
---

# History Grouping

History grouping is Fini's presentation-layer fix for repeated quest occurrences that would otherwise appear as separate completed/abandoned rows in History. The data model still persists each occurrence as its own [[QuestOccurrence]] for deterministic sync; only History groups resolved same-series rows for readability [[sources/2026-05-04-history-grouped-occurrence-ticket]] [[sources/2026-05-15-history-grouping-discussion]].

## Current direction

- Scope is History only; active-list series collapse remains unchanged [[sources/2026-05-04-history-grouped-occurrence-ticket]] [[sources/2026-05-15-history-grouping-discussion]].
- History reuses `QuestList.vue` via `groupChildrenById`, rather than using a dedicated `HistoryGroupRow` component [[sources/2026-05-15-history-grouping-discussion]] [[sources/2026-05-16-history-grouping-corrective-revision-results]].
- `historyGrouping.ts` lives under `src/utils/` and returns `{ rows, groupChildrenById }` [[sources/2026-05-15-history-grouping-discussion]] [[sources/2026-05-16-history-grouping-corrective-revision-results]].
- A grouped header should not show an occurrence count badge; it should look like a normal History row except for group affordances and mixed-status handling [[sources/2026-05-15-history-grouping-discussion]] [[sources/2026-05-16-history-grouping-corrective-revision-results]].
- Mixed completed/abandoned groups show `Mixed N / M`; uniform groups keep normal Completed or Abandoned styling [[sources/2026-05-15-history-grouping-discussion]] [[sources/2026-05-16-history-grouping-corrective-revision-results]].

## Actions

- Group restore restores the latest resolved child only, sorted newest-first [[sources/2026-05-15-history-grouping-discussion]] [[sources/2026-05-16-history-grouping-corrective-revision-results]].
- Delete series is confirmed and removes every past and future occurrence plus the `quest_series` row [[sources/2026-05-15-history-grouping-discussion]] [[sources/2026-05-16-history-grouping-corrective-revision-results]].
- Expanded child rows are restore-only; there is no per-child delete or child context menu [[sources/2026-05-15-history-grouping-discussion]] [[sources/2026-05-16-history-grouping-corrective-revision-results]].
- Child rows lazy-render with `v-if` and unmount on collapse [[sources/2026-05-16-history-grouping-corrective-revision-results]].

## Superseded implementation

> [!warning] Superseded by [[sources/2026-05-15-history-grouping-discussion]] (2026-05-15) and [[sources/2026-05-16-history-grouping-corrective-revision-results]] (2026-05-16)
> The first implementation's dedicated `HistoryGroupRow.vue` and count badge are no longer current. Keep the source for chronology, but use the corrective revision as current implementation guidance.

## Evidence status

- Corrective revision verification passed `npm run build`, `src/spec/utils/historyGrouping.spec.ts`, and `cargo test services::quest` [[sources/2026-05-16-history-grouping-corrective-revision-results]].
- `make e2e-ci` was not run after the corrective revision; the rewritten E2E spec still needs execution [[sources/2026-05-16-history-grouping-corrective-revision-results]].

## Open questions

> [!question]
> The shipped mixed label is `Mixed N / M`; first production/manual review may choose clearer wording such as `N completed · M abandoned` [[sources/2026-05-16-history-grouping-corrective-revision-results]].

> [!question]
> Long-series pagination or virtual scrolling remains deferred until real usage shows pain [[sources/2026-05-16-history-grouping-corrective-revision-results]].

updates:: [[pages/sources/2026-05-04-history-grouped-occurrence-ticket]]
supersedes:: [[pages/sources/2026-05-14-history-grouping-implementation-results]]
updates:: [[pages/sources/2026-05-16-history-grouping-corrective-revision-results]]
