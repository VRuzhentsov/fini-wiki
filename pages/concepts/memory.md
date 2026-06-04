---
title: Memory
type: concept
created: 2026-06-03
updated: 2026-06-03
sources: [2026-05-23-memory-graph-page-ticket, 2026-05-23-memory-qmd-feature-flag-addendum]
tags: [fini, memory, graph, history, settings]
claim_status: locked
evidence: source-backed
---

# Memory

Memory is the planned reflective product surface for rediscovering completed and abandoned quest history through search, graph relationships, and detail browsing. It is separate from History, which remains the operational recovery surface for restore, move, and delete actions [[sources/2026-05-23-memory-graph-page-ticket]].

## Product contract

- Add a top-level `Memory` tab/page with nav order `Focus`, `History`, `Memory`, `Settings` [[sources/2026-05-23-memory-graph-page-ticket]].
- Keep [[focus]] named `Focus`; `Quests` is not a replacement top-level nav label [[sources/2026-05-23-memory-graph-page-ticket]].
- Default graph nodes come from resolved quests, with edges from meaningful metadata such as Space, quest series, date buckets, tags/frontmatter, explicit related links, or confirmed wikilinks [[sources/2026-05-23-memory-graph-page-ticket]] [[sources/2026-05-23-memory-qmd-feature-flag-addendum]].
- Memory must stay useful when graph data is sparse by providing search/list/detail fallback and an empty state [[sources/2026-05-23-memory-graph-page-ticket]].
- The graph should prioritize meaningful relationships over decorative visual noise [[sources/2026-05-23-memory-graph-page-ticket]].

## Optional feature behavior

- Memory must be disableable from Settings like a feature flag [[sources/2026-05-23-memory-qmd-feature-flag-addendum]].
- Disabling Memory hides the Memory tab and stops background indexing, embedding, and graph-building work [[sources/2026-05-23-memory-qmd-feature-flag-addendum]].
- Disabling Memory does not delete completed quest History or generated Memory data unless the user explicitly chooses a separate destructive delete/reset action [[sources/2026-05-23-memory-qmd-feature-flag-addendum]].
- Re-enabling Memory should show the tab again and resume indexing from current quest/history state [[sources/2026-05-23-memory-qmd-feature-flag-addendum]].

## Storage and search dependency

Memory UI can be implemented before long-term storage/search decisions by deriving initial graph data from existing SQLite quest data [[sources/2026-05-23-memory-graph-page-ticket]]. Long-term search and indexing decisions live in [[quest-memory-search]].

depends_on:: [[pages/concepts/quest-memory-search]]
uses:: [[pages/concepts/settings-ui]]
