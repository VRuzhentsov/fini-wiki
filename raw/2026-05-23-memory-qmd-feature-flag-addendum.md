# Memory qmd Graph-Scale And Feature Flag Addendum

Date: 2026-05-23
Status: ticket handoff addendum
Related: GitHub issues #32 and #33; raw ticket drafts `2026-05-23-qmd-markdown-quest-memory-research-ticket.md` and `2026-05-23-memory-graph-page-ticket.md`

## Context

After creating the initial quest-memory research ticket and the separate Memory graph page ticket, the user clarified two additional requirements:

- Fini should expect Memory graphs to become large, so the research ticket should treat `qmd` embedding primarily for quests, not as a minor side option.
- The Memory feature must be disableable from Settings, like a feature flag.

The user also provided the intended `qmd` project URL: `https://github.com/tobi/qmd`.

## Summary

Memory should be designed as an optional feature with a Settings toggle. Disabling Memory should hide the Memory tab and stop background Memory indexing/embedding work, but should not delete completed quest History or already generated Memory data unless the user explicitly chooses a separate destructive delete/reset action.

The research ticket should bias toward evaluating `qmd` as the primary quest-memory indexing and embedding candidate, because Memory may grow to hundreds or thousands of resolved quest memories. `qmd` should be evaluated for search, semantic related-memory suggestions, clustering candidates, graph filtering, and optional suggested edges. It should not replace SQLite/Diesel as canonical operational quest storage unless the research proves that tradeoff is worth it.

## Decisions

- `qmd` means `https://github.com/tobi/qmd`.
- Memory graph scale should be assumed large enough to require serious indexing/rendering choices.
- `qmd` embedding/search is a primary research path for quest memories.
- Explicit metadata remains the preferred primary source for factual graph edges.
- Vector/semantic similarity should be presented as suggested/similar relationships, not as the same edge type as explicit links.
- Memory must be disableable from Settings.
- Disabling Memory pauses/hides the feature; deletion of indexes/files should be a separate explicit action.

## Addendum For Issue #32

Add these requirements to the `qmd` / Markdown-backed quest-memory research ticket:

```markdown
## Primary Graph-Scale Hypothesis

Assume Memory can eventually become a large graph: hundreds to thousands of resolved quest memories, plus Space, series, tag, date, and related-memory nodes.

Because of that expected scale, research `qmd` embedding/search primarily for quest memory retrieval and graph usability.

`qmd` means `https://github.com/tobi/qmd` and should be evaluated as a candidate Memory indexing layer because it already supports Markdown collections, SQLite-backed document indexing, FTS5/BM25 keyword search, `sqlite-vec` vector search, local GGUF embeddings, hybrid query flow, reranking, JSON/CLI output, SDK/library usage, and MCP integration.

Recommended research bias: evaluate `qmd` as the primary candidate for quest-memory search and embedding, while keeping SQLite/Diesel as canonical quest storage and using explicit metadata as the primary graph edge source.

## qmd Evaluation Requirements

Research must answer:

- Can Fini create a dedicated `qmd` collection for quest memories?
- Can `qmd` index only Fini-owned generated `.md` files?
- Can `qmd` be embedded as a library instead of shelling out to a CLI?
- Can `qmd` run reliably inside or alongside a Tauri desktop app?
- Can `qmd` run on Android, or does mobile require a fallback?
- What is the model download/runtime cost of default GGUF embedding/reranking models?
- Can Fini use only `qmd search`/FTS first and defer `qmd embed` until the user enables Memory or semantic search?
- Can `qmd vsearch` or `qmd query` produce useful related-memory suggestions?
- Can `qmd` explain why two memories are related well enough for UI trust?
- How does `qmd` storage in `~/.cache/qmd/index.sqlite` interact with Fini backup/export, privacy, and local-first data ownership?
- Does `qmd` support per-app index paths suitable for Fini instead of a global shared cache?
- What is the safest update lifecycle when quests are completed, abandoned, edited, deleted, or synced?

## Graph Rendering Assumption

Choose the graph renderer with large graphs in mind.

Evaluate:

- Sigma.js + Graphology for large graph rendering and WebGL performance.
- Cytoscape.js for richer graph interactions and built-in analysis.
- Whether v1 can avoid a graph dependency by rendering a simple filtered neighborhood first.

Graph data should still come from explicit relationships first: Space, quest series, tags/frontmatter, wikilinks, date buckets, and manually confirmed related links.

`qmd` embeddings should primarily power semantic search, related-memory suggestions, clustering candidates, graph filtering, and optional suggested edges.

Semantic/vector similarity must not be shown as the same edge type as explicit metadata. Suggested edges should be visually labeled as suggested/similar.

## Feature Flag Research Requirement

Research must account for Memory being optional and disableable.

Evaluate:

- Can `qmd` indexing/embedding be fully dormant when Memory is disabled?
- Can generated Memory Markdown files exist without being indexed?
- Can Fini avoid model downloads until Memory and semantic search are explicitly enabled?
- Can `qmd` index state be paused/resumed safely?
- What data remains after disabling Memory?
- Should Settings offer “Disable Memory” separately from “Delete Memory index/data”?
```

## Addendum For Issue #33

Add these requirements to the separate Memory graph page ticket:

```markdown
## Feature Flag / Settings Requirement

Memory must be disableable from Settings, like a feature flag.

Requirements:

- Add a Settings control for enabling/disabling the Memory feature.
- When Memory is disabled:
  - Hide the `Memory` top-level tab.
  - Disable Memory indexing/background updates.
  - Do not run `qmd embed`, vector indexing, or graph-building jobs.
  - Existing generated memory data remains on disk/database unless the user explicitly deletes it.
  - Direct `/memory` navigation redirects to Settings or shows a disabled-state page.
- When Memory is re-enabled:
  - Show the `Memory` tab again.
  - Resume indexing from current quest/history state.
  - Do not require data loss or full reset unless indexes are corrupt.
- Settings copy should explain that disabling Memory stops graph/search features but does not delete completed quest history.

Acceptance criteria:

- Settings has a Memory feature toggle.
- Toggling off hides the Memory tab.
- Toggling off prevents Memory background indexing and embedding.
- Toggling on restores the tab and allows Memory indexing again.
- History and Focus continue working normally with Memory disabled.
- Disabling Memory does not delete completed quest History.
```

## Evidence

- User clarified `qmd` as `https://github.com/tobi/qmd`.
- Web research of `tobi/qmd` showed it combines Markdown collections, SQLite/FTS5, `sqlite-vec`, local GGUF embeddings, hybrid search, reranking, JSON/CLI output, SDK usage, and MCP integration.
- User explicitly requested Settings-level disablement like feature flags.

## Open Questions

- Should Memory be enabled by default once shipped, or introduced as an opt-in experimental feature?
- Should semantic embedding/model download require a separate opt-in toggle from the Memory page itself?
