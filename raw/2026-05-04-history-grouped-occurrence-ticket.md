# History Grouped Occurrence Ticket

Date: 2026-05-04

## Context

User requested a ticket for repeated quest occurrences to stop appearing as several separate lines and asked for the clarified request to be captured in `fini-wiki/raw/`.

Follow-up clarification locked the scope to the History page only. Existing main quest list grouping is already working correctly and must remain unchanged.

## Summary

History currently shows completed and abandoned occurrences from the same repeating quest as separate rows. The desired behavior is to group same-series occurrences into a single History row.

This is a UX consistency fix for History only, not a request to introduce new grouping behavior in the main quest list.

## Decisions

- Treat this as a bug / UX consistency ticket.
- Scope the request only to the History page.
- Keep the current main quest list grouping exactly as it is.
- Use Fini terminology: repeating quest occurrences are occurrence-level quest records, but the grouped presentation should change only in History.

## Plan

- Create a GitHub issue in `VRuzhentsov/fini` describing History-only grouping.
- Reference existing active-list grouping as evidence that the main list is already behaving correctly.
- Reference current History behavior as the surface that needs to change.
- Leave implementation for a follow-up code change after ticket creation.

## Evidence

- Wiki concept: `QuestOccurrence` says occurrences are concrete dated instances, but in UI they are represented as normal actionable quest records.
- Wiki concept: `Quest` says repeating flows are occurrence-level quest records.
- Repo evidence: `src-tauri/src/services/quest.rs` already collapses active same-series occurrences for list loading.
- Repo evidence: `src/views/HistoryView.vue` currently filters completed/abandoned quests directly and renders them as-is.
- Repo evidence: `src/views/HistoryView.md` explicitly states that repeating quests in History are occurrence-level and each occurrence appears as its own entry.
- Created issue: `https://github.com/VRuzhentsov/fini/issues/20`

## Open Questions

- For a grouped History row, should restore/delete act on the latest occurrence in the group, or should the row first expand so the user can choose a specific occurrence?
- If History groups same-series occurrences, what summary metadata should be shown on the grouped row so users can still understand completion/abandonment state at a glance?
