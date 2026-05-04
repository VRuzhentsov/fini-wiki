---
title: 2026-05-04 History Grouped Occurrence Ticket
type: source
created: 2026-05-04
updated: 2026-05-04
sources: [2026-05-04-history-grouped-occurrence-ticket]
tags: [fini, history, quest-occurrence, ux, ticket]
---

# 2026-05-04 History Grouped Occurrence Ticket

History currently renders completed and abandoned occurrences from the same repeating quest as separate rows. Issue `VRuzhentsov/fini#20` locks this as a History-only UX consistency bug: group same-series occurrences into one History row, while leaving the current main quest list grouping behavior unchanged [[sources/2026-05-04-history-grouped-occurrence-ticket]].

## Key claims

- Treat this as a bug / UX consistency ticket, not a new main-list grouping request [[sources/2026-05-04-history-grouped-occurrence-ticket]].
- Scope is History only; the current main quest list grouping should remain exactly as it is [[sources/2026-05-04-history-grouped-occurrence-ticket]].
- Repeating quest occurrences remain occurrence-level quest records, but the grouped presentation should change only in History [[sources/2026-05-04-history-grouped-occurrence-ticket]].
- Repo evidence says `src-tauri/src/services/quest.rs` already collapses active same-series occurrences for list loading, while `src/views/HistoryView.vue` and `src/views/HistoryView.md` still render resolved occurrences separately [[sources/2026-05-04-history-grouped-occurrence-ticket]].
- Issue created: `https://github.com/VRuzhentsov/fini/issues/20` [[sources/2026-05-04-history-grouped-occurrence-ticket]].

## Open questions

- Should restore/delete on a grouped History row target the latest occurrence, or should the row expand first so the user can pick a specific occurrence? [[sources/2026-05-04-history-grouped-occurrence-ticket]]
- What summary metadata should a grouped History row show so completion/abandonment state stays understandable at a glance? [[sources/2026-05-04-history-grouped-occurrence-ticket]]

## Related pages

- [[QuestOccurrence]]
- [[QuestSeries]]
