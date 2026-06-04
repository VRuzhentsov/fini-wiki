---
title: 2026-05-23 Memory Qmd Feature Flag Addendum
type: source
created: 2026-06-03
updated: 2026-06-03
sources: [2026-05-23-memory-qmd-feature-flag-addendum]
tags: [fini, memory, qmd, settings, feature-flag]
claim_status: locked
evidence: source-backed
---

# 2026-05-23 Memory Qmd Feature Flag Addendum

This addendum clarifies that Memory should be optional and that `qmd` should be evaluated as a primary candidate for large quest-memory search and embedding, not as a minor side option [[sources/2026-05-23-memory-qmd-feature-flag-addendum]].

## Key claims

- `qmd` means `https://github.com/tobi/qmd` [[sources/2026-05-23-memory-qmd-feature-flag-addendum]].
- Memory graphs should be expected to grow to hundreds or thousands of resolved quest memories, so indexing/rendering choices need graph-scale evaluation [[sources/2026-05-23-memory-qmd-feature-flag-addendum]].
- Evaluate `qmd` for Markdown collections, SQLite/FTS5, `sqlite-vec`, local GGUF embeddings, hybrid search, reranking, JSON/CLI output, SDK/library usage, and MCP integration [[sources/2026-05-23-memory-qmd-feature-flag-addendum]].
- Explicit metadata remains the preferred primary source for factual graph edges; vector similarity should be visually labeled as suggested/similar, not treated as the same edge type [[sources/2026-05-23-memory-qmd-feature-flag-addendum]].
- Settings must be able to disable Memory; disabling hides the tab and stops indexing/embedding but does not delete History or generated Memory data unless the user chooses a separate destructive action [[sources/2026-05-23-memory-qmd-feature-flag-addendum]].

## Open questions

- Whether Memory should ship enabled by default or as opt-in experimental [[sources/2026-05-23-memory-qmd-feature-flag-addendum]].
- Whether semantic embedding/model download needs a separate opt-in from the Memory page itself [[sources/2026-05-23-memory-qmd-feature-flag-addendum]].

## Related pages

- [[memory]]
- [[quest-memory-search]]
- [[settings-ui]]

updates:: [[pages/concepts/memory]]
updates:: [[pages/concepts/quest-memory-search]]
