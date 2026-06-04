---
title: 2026-05-23 Qmd Markdown Quest Memory Research Ticket
type: source
created: 2026-06-03
updated: 2026-06-03
sources: [2026-05-23-qmd-markdown-quest-memory-research-ticket]
tags: [fini, memory, qmd, markdown, research, sqlite]
claim_status: locked
evidence: source-backed
---

# 2026-05-23 Qmd Markdown Quest Memory Research Ticket

This source defines a research ticket for Markdown-backed quest memory and local search. It explicitly separates storage/search research from the [[memory]] graph page implementation [[sources/2026-05-23-qmd-markdown-quest-memory-research-ticket]].

## Key claims

- Research `qmd` as the intended local Markdown search/tool target; ignore QMS [[sources/2026-05-23-qmd-markdown-quest-memory-research-ticket]].
- Do not rename top-level `Focus` to `Quests`; `Focus` remains the primary tab label [[sources/2026-05-23-qmd-markdown-quest-memory-research-ticket]].
- Compare SQLite canonical storage, Markdown canonical storage, SQLite FTS5, generated Markdown projection, hybrid Memory documents, and optional vector search [[sources/2026-05-23-qmd-markdown-quest-memory-research-ticket]].
- Likely research hypothesis: keep SQLite/Diesel canonical for operational quests and create Markdown-backed Memory documents or projections for completed/abandoned quest memories [[sources/2026-05-23-qmd-markdown-quest-memory-research-ticket]].
- The recommendation must cover source of truth, indexing, sync, backup, Android/mobile, CLI, privacy, graph readiness, and at least 10 tradeoff dimensions [[sources/2026-05-23-qmd-markdown-quest-memory-research-ticket]].

## Open questions

- Whether Memory documents are automatic on quest resolution or explicit user action [[sources/2026-05-23-qmd-markdown-quest-memory-research-ticket]].
- Whether generated Markdown is user-editable in v1 or read-only projection/export [[sources/2026-05-23-qmd-markdown-quest-memory-research-ticket]].
- Whether memory/search data syncs between paired devices in v1 [[sources/2026-05-23-qmd-markdown-quest-memory-research-ticket]].

## Related pages

- [[quest-memory-search]]
- [[memory]]
- [[diesel-orm]]

updates:: [[pages/concepts/quest-memory-search]]
depends_on:: [[pages/concepts/diesel-orm]]
