# Research qmd and Markdown-backed Quest Memory

Date: 2026-05-23
Status: ticket handoff
Related: Fini GitHub issue to be created; separate Memory UI ticket in `2026-05-23-memory-graph-page-ticket.md`

## Context

The user asked for a research and implementation ticket around storing or projecting quests as `.md` files, bundling or using `qmd` for quest/history search, comparing alternatives such as SQLite FTS5 and vector search, and weighing at least 10 tradeoffs before choosing a direction.

Clarification: the user meant `qmd`, not QMS. Ignore QMS.

The user also clarified that `Focus` must remain named `Focus`. Any earlier idea to rename top-level navigation to `Quests` is rejected. If `Quests` appears at all, it can only be secondary explanatory copy, not the primary tab label.

Current evidence reviewed:

- `README.md` says Fini is local-first, quest-based, and uses SQLite via Diesel.
- `src/App.vue` currently shows top-level nav labels `Focus`, `History`, and `Settings`.
- `src/App.md` documents the current tabs as `Focus`, `History`, and `Settings`.
- `src/router/index.ts` exposes `/main`, `/quests`, `/history`, `/settings`, and settings device subroutes.
- `src-tauri/src/schema.rs` shows quests, quest_series, focus_history, sync_outbox, tombstones, reminders, and related tables in SQLite.
- `../fini-wiki/_hot.md` says Diesel is load-bearing for migrations, id semantics, defaults, referential behavior, and API contracts.
- `../fini-wiki/AGENTS.md` says the wiki uses Markdown files and typed edges, and warns against introducing a separate graph database for the wiki itself in the current iteration.

## Ticket Draft

# Research `qmd` and Markdown-backed Quest Memory storage/search

Labels: `feature`, `type:spike`, `priority:low`

## Problem / Goal

Fini currently stores operational quest data in SQLite via Diesel. Completed and abandoned quests live in History, but Fini does not yet have a durable local-first memory/search layer for rediscovering past work.

Research whether quests or quest history should be stored, mirrored, or exported as Markdown files, and whether `qmd` should be bundled with Fini to support local search across quests and quest history. Compare this with simpler and/or more robust alternatives such as SQLite FTS5, a generated Markdown projection, and optional future vector search.

The result should be a decision-ready architecture recommendation, not an immediate rewrite of quest persistence.

## Scope

- Research `qmd` as a bundled or embedded local Markdown search tool.
- Evaluate `.md` files as canonical quest storage versus generated projection/export.
- Evaluate keeping SQLite/Diesel as canonical storage and adding Markdown memory projection.
- Evaluate SQLite FTS5 as a simpler local search path.
- Evaluate vector/semantic indexing as an optional future enhancement.
- Define how quest metadata would map to Markdown frontmatter.
- Define how quest relationships could map to wikilinks or typed edges.
- Cover active quests, completed/abandoned history, quest series, spaces, reminders, SpaceSync, backup/import/export, CLI, and MCP implications.
- Produce at least 10 tradeoff dimensions before recommending a direction.
- Produce implementation slices for the chosen direction.

## Out Of Scope

- Implementing the Memory graph UI; that is a separate ticket.
- Renaming `Focus` to `Quests`; `Focus` remains the primary top-level tab label.
- Immediate migration away from SQLite/Diesel.
- Cloud sync or hosted search.
- Direct user editing of Markdown quest files unless explicitly chosen by the research outcome.
- AI summarization or embeddings as a required v1 feature.
- Replacing `fini-wiki`; this work concerns user quest memory, not project documentation.

## Research Questions

- Is `qmd` the right embedded/bundled search primitive for local Markdown quest memory?
- Should Markdown files be canonical storage, or should they be a generated/exported projection from SQLite?
- Can SQLite FTS5 satisfy most search needs with less architectural risk?
- Should semantic/vector search be added now, deferred, or treated as an optional index-only enhancement?
- How should quest metadata map to Markdown frontmatter?
- How should quest relationships become wikilinks or typed graph edges?
- Should searchable memory include only completed/abandoned quests, or also active quest context?
- How does this interact with SpaceSync and backup/import/export?
- How does this interact with CLI and MCP?
- What is the minimum useful memory/search foundation that ships value without destabilizing persistence?

## Required Tradeoff Matrix

Evaluate at least these dimensions:

- Source of truth: SQLite vs Markdown vs hybrid.
- Data integrity: constraints, migrations, referential integrity, tombstones.
- Sync compatibility: SpaceSync payloads, conflict resolution, offline edits.
- Search quality: exact, fuzzy, full-text, tags, frontmatter, semantic search.
- User inspectability: whether users can safely open or edit files.
- Backup/export simplicity: zip portability, Obsidian compatibility, restore semantics.
- Performance: startup cost, incremental indexing, mobile constraints.
- Bundling complexity: binary size, licenses, native binaries, Android/Linux/Windows/macOS support.
- Privacy/security: local-only indexing, sensitive memory content, future encryption.
- Graph readiness: meaningful edges from metadata versus decorative graph noise.
- Implementation risk: migrations, Rust/Tauri integration, testing cost.
- AI readiness: future summarization, retrieval-augmented context, embeddings.
- Developer experience: CLI/MCP access, debuggability, fixture creation.
- User behavior: avoiding reintroduction of overwhelming todo-list guilt.
- Interop: Obsidian-style Markdown, wikilinks, frontmatter, typed edges.

## Candidate Directions

### Option A: SQLite canonical, Markdown memory projection

Keep Diesel/SQLite as source of truth. Generate `.md` files for completed/abandoned quest memories and index/search those files.

Likely default recommendation unless research disproves it.

### Option B: Markdown canonical, SQLite index/cache

Store quests as `.md` files and derive SQLite rows/indexes from files.

This maximizes file-native ownership but has high migration and sync risk.

### Option C: SQLite canonical with SQLite FTS5 first

Use SQLite FTS5/search tables for quest/history search and defer Markdown files.

This minimizes architectural risk but does not satisfy the file-native `.md` goal.

### Option D: Hybrid Memory documents

Keep quests in SQLite, but create separate durable Memory documents as Markdown when quests resolve. Memories can summarize, link, tag, and graph quest outcomes.

This separates operational quests from reflective memory.

## Recommended Research Hypothesis

Start by trying to validate Option D/A hybrid:

- SQLite remains canonical for operational quests.
- Completed/abandoned quests can produce Markdown-backed memory documents.
- Memory documents are indexed for search, possibly by `qmd` if it is portable and worth bundling.
- Direct file edits are read-only or explicitly reconciled in v1.
- Vector search is deferred unless exact/FTS/file search fails user needs.
- Graph edges start from explicit metadata: space, quest series, dates, tags, wikilinks, parent/related quest ids.

## Acceptance Criteria

- `qmd`, SQLite FTS5, Markdown files, and vector index options are compared.
- At least 10 tradeoff dimensions are evaluated.
- A single recommended architecture is chosen with rationale.
- The recommendation explicitly covers source of truth, indexing, sync, backup, Android/mobile, CLI/MCP, privacy, and graph readiness.
- The recommendation explicitly says whether `Focus` navigation remains unchanged. Expected answer: yes, `Focus` remains `Focus`.
- Follow-up implementation slices are defined.
- Risks and deferred work are listed.

## Verification

- Produce a decision document or wiki raw capture with the tradeoff matrix and recommendation.
- Link follow-up implementation issue(s), including the separate Memory graph UI ticket.

## Open Questions

- Should Memory documents be created automatically on quest completion/abandonment, or only after an explicit user action?
- Should generated Markdown be editable by users in v1, or treated as read-only projection/export?
- Should memory/search data sync between paired devices in v1, or remain local until storage semantics are proven?

## Decisions

- `qmd` is the intended search/tool research target. QMS is not in scope.
- `Focus` stays `Focus`; do not rename the primary top-level tab to `Quests`.
- Memory graph UI is split into a separate ticket.

## Evidence

- Repo and wiki files listed in the Context section were inspected before drafting.

## Open Questions

- GitHub issue URL will be added by reporting after issue creation; this raw source is intentionally not edited after creation.
