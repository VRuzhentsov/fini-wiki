---
title: Quest Memory Search
type: concept
created: 2026-06-03
updated: 2026-06-03
sources: [2026-05-23-qmd-markdown-quest-memory-research-ticket, 2026-05-23-memory-qmd-feature-flag-addendum]
tags: [fini, memory, qmd, markdown, sqlite, search]
claim_status: provisional
evidence: source-backed
---

# Quest Memory Search

Quest Memory Search is the research thread for whether Fini should project or store resolved quest memories as Markdown and whether `qmd` should power local search, related-memory suggestions, and graph-scale filtering. It concerns user quest memory, not `fini-wiki` project documentation [[sources/2026-05-23-qmd-markdown-quest-memory-research-ticket]].

## Current research hypothesis

- Keep SQLite/Diesel canonical for operational quests unless research proves a stronger alternative [[sources/2026-05-23-qmd-markdown-quest-memory-research-ticket]].
- Generate Markdown-backed Memory documents or projections for completed/abandoned quest memories [[sources/2026-05-23-qmd-markdown-quest-memory-research-ticket]].
- Evaluate `qmd` as a primary quest-memory indexing/search candidate, not a side option, because Memory may grow to hundreds or thousands of nodes [[sources/2026-05-23-memory-qmd-feature-flag-addendum]].
- Prefer explicit metadata for factual graph edges; use vector/semantic similarity for suggested/similar relationships that are visually labeled as such [[sources/2026-05-23-memory-qmd-feature-flag-addendum]].
- Treat SQLite FTS5 as a simpler local-search alternative and vector search as optional/deferred unless proven necessary [[sources/2026-05-23-qmd-markdown-quest-memory-research-ticket]].

## Required tradeoff surface

The research must compare source of truth, data integrity, sync, search quality, inspectability, backup/export, performance, bundling complexity, privacy, graph readiness, implementation risk, AI readiness, developer experience, user behavior, and Obsidian-style interop [[sources/2026-05-23-qmd-markdown-quest-memory-research-ticket]].

## qmd evaluation points

- Can Fini create a dedicated `qmd` collection for generated quest memories and use per-app index paths [[sources/2026-05-23-memory-qmd-feature-flag-addendum]]?
- Can `qmd` run reliably inside or alongside Tauri desktop and Android, and what are model download/runtime costs [[sources/2026-05-23-memory-qmd-feature-flag-addendum]]?
- Can indexing/embedding stay fully dormant when [[memory]] is disabled, with model downloads deferred until explicitly enabled [[sources/2026-05-23-memory-qmd-feature-flag-addendum]]?

> [!question]
> The architecture recommendation is not locked yet; the source requires a decision-ready research outcome before implementation slices are chosen [[sources/2026-05-23-qmd-markdown-quest-memory-research-ticket]].

depends_on:: [[pages/concepts/diesel-orm]]
updates:: [[pages/concepts/memory]]
