---
title: 2026-05-23 Memory Graph Page Ticket
type: source
created: 2026-06-03
updated: 2026-06-03
sources: [2026-05-23-memory-graph-page-ticket]
tags: [fini, memory, graph, design, ticket]
claim_status: locked
evidence: source-backed
---

# 2026-05-23 Memory Graph Page Ticket

This source splits the product/UI [[memory]] surface into a separate ticket from Markdown/`qmd` storage research. Memory is a new top-level reflective page for completed/abandoned quest memories, while History remains the operational recovery page [[sources/2026-05-23-memory-graph-page-ticket]].

## Key claims

- Add a new top-level `Memory` tab/page with nav order `Focus`, `History`, `Memory`, `Settings` [[sources/2026-05-23-memory-graph-page-ticket]].
- Keep `Focus` named `Focus`; `Quests` may appear only as secondary explanatory copy, not as a top-level replacement [[sources/2026-05-23-memory-graph-page-ticket]].
- Memory v1 should derive graph nodes from completed/abandoned quests and relationships such as Space, quest series, date buckets, or explicit related links if available [[sources/2026-05-23-memory-graph-page-ticket]].
- History remains for restore, move, and delete operations; Memory is for reflective browsing, search, inspection, graph, and relationships [[sources/2026-05-23-memory-graph-page-ticket]].
- The graph must stay useful when edges are weak by providing a list/search/detail fallback and empty state [[sources/2026-05-23-memory-graph-page-ticket]].

## Open questions

- Whether Memory v1 defaults abandoned quests visible or completed-only with abandoned as a filter [[sources/2026-05-23-memory-graph-page-ticket]].
- Which graph library, if any, best fits desktop/mobile/Tauri constraints [[sources/2026-05-23-memory-graph-page-ticket]].

## Related pages

- [[memory]]
- [[quest-memory-search]]
- [[focus]]

updates:: [[pages/concepts/memory]]
depends_on:: [[pages/concepts/quest-memory-search]]
