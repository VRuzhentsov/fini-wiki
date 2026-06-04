---
title: 2026-06-03 PR 36 Focus Enter Count Product And Design Result
type: source
created: 2026-06-03
updated: 2026-06-03
sources: [2026-06-03-pr-36-focus-enter-count-product-and-design-result]
tags: [fini, focus, quest, implementation, pr-36]
claim_status: locked
evidence: source-backed
---

# 2026-06-03 PR 36 Focus Enter Count Product And Design Result

This source records merged PR #36, which implemented Focus entry counting as `focus_enter_count` on each quest. The feature is a small persisted attention-history signal, not analytics infrastructure [[sources/2026-06-03-pr-36-focus-enter-count-product-and-design-result]].

## Key claims

- Quests now carry `focus_enter_count`, which increases when the user enters Focus for a quest [[sources/2026-06-03-pr-36-focus-enter-count-product-and-design-result]].
- Reminder handling and CLI-driven Focus commands participate in the same Focus-entry semantics as app UI [[sources/2026-06-03-pr-36-focus-enter-count-product-and-design-result]].
- The active quest panel surfaces the repeat-Focus badge only after the quest has been entered more than once [[sources/2026-06-03-pr-36-focus-enter-count-product-and-design-result]].
- Store the count on the quest because it describes quest attention history, not a separate analytics event stream [[sources/2026-06-03-pr-36-focus-enter-count-product-and-design-result]].
- Preserve the count in normal quest sync payloads, but defer count-only cross-device convergence semantics [[sources/2026-06-03-pr-36-focus-enter-count-product-and-design-result]].
- Backup handling was made explicit by bumping backup version rather than silently accepting older backups whose schema cannot represent the field [[sources/2026-06-03-pr-36-focus-enter-count-product-and-design-result]].

## Open questions

- Whether `focus_enter_count` should become a cross-device convergent metric [[sources/2026-06-03-pr-36-focus-enter-count-product-and-design-result]].
- Whether repeated Focus should affect prioritization/suggestions or remain only a visible cue [[sources/2026-06-03-pr-36-focus-enter-count-product-and-design-result]].
- Whether future backup import should migrate older formats or continue explicit version rejection [[sources/2026-06-03-pr-36-focus-enter-count-product-and-design-result]].

## Related pages

- [[focus]]
- [[Quest]]
- [[CLI]]
- [[backup-import-export]]

updates:: [[pages/concepts/focus]]
updates:: [[pages/concepts/Quest]]
updates:: [[pages/concepts/CLI]]
supersedes:: [[pages/sources/2026-05-22-focus-entry-count-priority-signal]]
