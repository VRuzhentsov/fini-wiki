# Memory Graph Page Ticket

Date: 2026-05-23
Status: ticket handoff
Related: Fini GitHub issue to be created; research ticket in `2026-05-23-qmd-markdown-quest-memory-research-ticket.md`

## Context

The user asked to split the Obsidian-like graph page into its own separate ticket. This ticket is only for the product/UI Memory surface. Storage/search decisions around Markdown, `qmd`, SQLite FTS5, and vector search belong to the separate research ticket.

Important user clarification: `Focus` must remain named `Focus`. Do not rename the primary top-level tab to `Quests`. If useful, `Quests` can appear only as secondary explanatory copy inside the Focus page, not as a top-level nav replacement.

Current evidence reviewed:

- `src/App.vue` currently shows top-level nav labels `Focus`, `History`, and `Settings`.
- `src/App.md` documents current tabs as `Focus`, `History`, and `Settings`.
- `src/router/index.ts` already has a legacy `/quests` route, but it is not a top-level nav tab.
- `src/views/HistoryView.md` says History is a read-only list of completed and abandoned quests with restore/move/delete actions.
- `src-tauri/src/schema.rs` exposes enough existing quest metadata to derive a first graph from resolved quests, spaces, and quest series.

## Ticket Draft

# Add Memory page with Obsidian-like graph for quest memories

Labels: `feature`, `design`

## Problem / Goal

Fini History is operational: users can restore, move, or delete completed/abandoned quests. It is not a reflective memory surface.

Add a separate `Memory` tab/page where users can rediscover completed work through an Obsidian-like graph interface, without turning Fini back into an overwhelming todo list.

## User Story

As a Fini user, I want a Memory page that visually connects completed quests, spaces, series, dates, and related work so that I can rediscover what I have done and see patterns across my history.

## Scope

- Add a new top-level `Memory` tab/page.
- Target top-level nav order becomes `Focus`, `History`, `Memory`, `Settings`.
- Keep `Focus` as the primary tab label.
- Use `Quests` only as secondary explanatory copy if needed, such as inside the Focus page, never as the primary top-level nav label.
- Define and implement an initial graph visualization for quest memories.
- Show memory nodes derived from completed/abandoned quests.
- Show edges from available metadata, such as same Space, same quest series, shared date bucket, or explicit related quest links if available.
- Include a non-graph fallback list/search panel if graph data is sparse.
- Include an empty state for users with no completed/abandoned quests.
- Keep History as the operational recovery page.

## Out Of Scope

- Deciding whether Markdown files are canonical storage.
- Implementing `qmd`, vector search, SQLite FTS5, or final search architecture.
- Direct editing of Markdown memory files.
- AI summarization of quest memories.
- Sync/storage migrations except minimal read API needed for graph data.
- Replacing History.
- Renaming `Focus` to `Quests`.

## Behavior Rules

- `History` remains for resolved quest operations: restore, move, delete.
- `Memory` is for reflective browsing: search, inspect, graph, relationships.
- `Focus` remains the top-level label for the current focus/active quest experience.
- Graph must not show active quests by default unless explicitly designed later.
- Graph must work with existing SQLite-backed quest data for v1.
- The page must remain useful when graph edges are weak by showing a list/detail fallback.
- The graph should prioritize meaningful relationships over decorative visual noise.

## Initial UI Requirements

- Route: `/memory`.
- Tab label: `Memory`.
- Page layout:
  - Header with title and short explanation.
  - Search/filter controls.
  - Graph canvas or graph panel.
  - Selected memory detail panel.
  - Empty state.
- Filters:
  - Space.
  - Status: completed/abandoned.
  - Date range or recency.
  - Series/group when available.
- Node detail should show:
  - quest title,
  - status,
  - space,
  - completed/abandoned timestamp,
  - description if present,
  - related nodes.

## Design Notes

Future agents must load `fini-design` before implementation because this adds a new major Fini surface and changes top-level navigation.

The visual design should feel like Fini, not a literal Obsidian clone. Use Obsidian only as the interaction metaphor: memory nodes, relationships, backlinks/edges, and spatial exploration.

## Implementation Notes

Likely files:

- `src/App.vue`
- `src/App.md`
- `src/router/index.ts`
- `src/views/MemoryView.vue`
- `src/views/MemoryView.md`
- `src/stores/quest.ts` or a new memory store
- Backend read command only if current quest API is insufficient

Use the smallest v1 data shape possible. Prefer deriving graph data client-side from existing resolved quests unless performance or data shape requires a backend command.

## Acceptance Criteria

- Top-level nav includes `Focus`, `History`, `Memory`, `Settings` in that order.
- `Focus` remains named `Focus`; any `Quests` wording is secondary only.
- `/memory` renders as a separate page.
- Memory page displays completed/abandoned quest-derived nodes.
- Selecting a node shows memory details.
- Graph edges use at least one meaningful relationship from existing data, such as shared space or series.
- Empty state appears when there are no resolved quests.
- History behavior remains unchanged.
- Companion specs are added/updated for new or changed views.
- UI follows existing Fini visual patterns and is routed through `fini-design`.

## Verification

- Frontend build/type check passes.
- Unit/component coverage for Memory empty state and populated state.
- Manual app check:
  - nav order is correct,
  - Memory tab opens,
  - completed quest appears as a graph node,
  - selected node details render,
  - History still works,
  - Focus tab is still named `Focus`.
- If graph rendering uses a new dependency, verify bundle/build impact and Android compatibility.

## Dependencies

- Can be implemented before the Markdown/`qmd` research ticket by using existing SQLite quest data.
- Should be revisited after the storage/search research ticket chooses the long-term Memory data model.

## Open Questions

- Should Memory v1 show abandoned quests alongside completed quests, or default to completed-only with abandoned as a filter?
- What graph library, if any, fits Fini's desktop/mobile/Tauri constraints without bloating the app?

## Decisions

- Memory graph UI is separate from the storage/search research ticket.
- Top-level navigation should become `Focus`, `History`, `Memory`, `Settings`.
- `Focus` remains `Focus`.

## Evidence

- Repo files listed in the Context section were inspected before drafting.

## Open Questions

- GitHub issue URL will be added by reporting after issue creation; this raw source is intentionally not edited after creation.
