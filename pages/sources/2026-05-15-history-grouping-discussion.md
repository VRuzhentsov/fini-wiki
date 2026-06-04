---
title: 2026-05-15 History Grouping Discussion
type: source
created: 2026-05-16
updated: 2026-05-16
sources: [2026-05-15-history-grouping-discussion]
tags: [fini, history, quest-occurrence, ux, design-brief]
claim_status: locked
evidence: source-backed
---

# 2026-05-15 History Grouping Discussion

After review of the first History grouping implementation, the user locked corrective UX and architecture decisions: no count badge, mixed-status indication, reuse `QuestList.vue`, no dedicated `HistoryGroupRow`, delete-series removes past and future occurrences plus the series row behind confirmation, and expanded children are restore-only [[sources/2026-05-15-history-grouping-discussion]].

## Key claims

- The existing `not.toContain('2x')` E2E assertion was correct because the group header must not show an occurrence count badge [[sources/2026-05-15-history-grouping-discussion]].
- Mixed completed/abandoned children require a header status pill such as `Mixed Nc / Na`; uniform groups keep normal Completed/Abandoned styling [[sources/2026-05-15-history-grouping-discussion]].
- History must render through the same `QuestList.vue` component as the active list via `groupChildrenById`, not a separate History row component [[sources/2026-05-15-history-grouping-discussion]].
- `historyGrouping.ts` should move to `src/utils/` and return `{ rows, groupChildrenById }` [[sources/2026-05-15-history-grouping-discussion]].
- Delete-series confirm copy must state that it removes every past and future occurrence and cannot be undone; no occurrence count in the message [[sources/2026-05-15-history-grouping-discussion]].
- Fini's per-occurrence persistence model remains right for deterministic sync; History grouping is a presentation-layer adaptation, not evidence of model debt [[sources/2026-05-15-history-grouping-discussion]].

## Open questions

- Mixed-status label wording remained open between `Mixed 2 / 1` and `2 completed · 1 abandoned` [[sources/2026-05-15-history-grouping-discussion]].
- Future rich confirmation modal and possible hard-coded pager threshold remained deferred [[sources/2026-05-15-history-grouping-discussion]].

## Related pages

- [[history-grouping]]
- [[QuestOccurrence]]
- [[QuestSeries]]

supersedes:: [[pages/sources/2026-05-14-history-grouping-implementation-results]]
