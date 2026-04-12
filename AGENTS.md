# Wiki Schema

This file defines how to operate the LLM Wiki rooted at `~/projects/wiki/`.
When working inside this directory, treat these rules as authoritative; they
extend (and override on conflict) the global `~/.config/opencode/AGENTS.md`.

## Purpose

Maintain a persistent, compounding second brain. Raw sources are immutable;
wiki pages are LLM-written syntheses that get richer with every ingest.

## Obsidian integration

This wiki lives outside the main Obsidian vault (`~/Documents/`). To use
Obsidian features (graph view, backlinks, Dataview, Web Clipper), open
`~/projects/wiki/` as an additional vault via File → Open another vault.
Wikilinks (`[[page-name]]`) and the `.obsidian/` config created on first
open are compatible with git and may be committed.

## Layout

```
~/projects/wiki/
├── AGENTS.md          # this schema (you are here)
├── index.md           # content catalog (update on every ingest)
├── log.md             # chronological activity log (append-only)
├── raw/               # immutable source documents
│   └── assets/        # images downloaded via Obsidian
└── pages/             # LLM-owned wiki pages
    ├── entities/      # people, orgs, products, places
    ├── concepts/      # ideas, theories, patterns, methods
    └── sources/       # per-source summary pages (one per raw doc)
```

Create additional subdirectories under `pages/` only when a category has
≥3 pages and does not fit cleanly into existing buckets.

## Layers

- **Raw** (`raw/`): read-only source of truth. Never modify.
- **Wiki** (`pages/`, `index.md`, `log.md`): LLM-owned. Create, update,
  refactor freely, but preserve cross-reference integrity.
- **Schema** (this file): co-evolve with the user; update when workflows
  change.

## Page conventions

- Filename: `kebab-case.md`.
- Every page starts with YAML frontmatter:

  ```yaml
  ---
  title: Page Title
  type: entity | concept | source | comparison | analysis | overview
  created: YYYY-MM-DD
  updated: YYYY-MM-DD
  sources: [source-slug-1, source-slug-2]   # raw docs this page draws on
  tags: [tag1, tag2]
  ---
  ```

- Use Obsidian wikilinks `[[page-name]]` for cross-references, not markdown
  links, so the graph view and backlinks work.
- Cite raw sources inline as `[[sources/source-slug]]` at the point of claim.
- When a newer source contradicts a prior claim, keep both: mark the old
  claim with `> [!warning] Superseded by [[sources/new-source]] (YYYY-MM-DD)`
  and state the updated view below.

## Operations

### Ingest

User drops a file into `raw/` (or provides a URL/clipping) and asks to ingest.

1. Read the source in full. For articles with images, read text first, then
   view referenced images as needed.
2. Discuss 3–5 key takeaways with the user before writing. Let the user
   steer emphasis.
3. Create `pages/sources/<slug>.md` with: frontmatter, one-paragraph
   summary, bulleted key claims, open questions, links to related pages.
4. Touch related `entities/` and `concepts/` pages: create missing ones,
   update existing ones with new claims/contradictions. Prefer updating
   10–15 pages in one pass over a single monolithic page.
5. Update `index.md` (add new pages, refresh summaries for changed pages).
6. Append an entry to `log.md`.
7. Report back: list of pages created/updated, flagged contradictions,
   suggested follow-up questions.

### Query

User asks a question against the wiki.

1. Read `index.md` first to locate relevant pages.
2. Drill into those pages; follow wikilinks as needed.
3. Answer with citations to `[[sources/...]]` and `[[pages/...]]`.
4. If the answer is substantive (comparison, analysis, new connection),
   offer to file it back into the wiki as a new page under the appropriate
   category and log it. Do not file automatically; ask first.
5. If the wiki lacks evidence, say so explicitly rather than speculating.

### Lint

On request, health-check the wiki.

- Contradictions between pages (flag with source dates).
- Stale claims superseded by newer sources.
- Orphan pages (no inbound wikilinks).
- Concepts mentioned ≥3 times without a dedicated page.
- Missing cross-references (A cites B but B has no backlink context).
- Data gaps that warrant a web search or new source.

Produce a prioritized report; apply fixes only after user confirms scope.

## index.md format

Content-oriented catalog. Grouped by category. Each entry: one line.

```markdown
## Entities
- [[pages/entities/some-person]] — one-line hook (N sources)

## Concepts
- [[pages/concepts/some-idea]] — one-line hook (N sources)

## Sources
- [[pages/sources/2026-04-10-article-slug]] — one-line hook
```

Keep each line under ~150 chars. Update on every ingest.

## log.md format

Append-only. Each entry starts with a parseable header:

```markdown
## [YYYY-MM-DD] <op> | <short title>

- Pages touched: [[...]], [[...]]
- Notes: one or two lines

```

Ops: `ingest`, `query`, `lint`, `refactor`, `schema`.

Parseable with: `grep "^## \[" log.md | tail -10`.

## Guardrails

- Never modify files under `raw/`.
- Never delete a wiki page without user confirmation; prefer superseding.
- Preserve wikilink integrity: on rename, update all inbound links in the
  same pass.
- When uncertain about a claim, mark it with `> [!question]` rather than
  asserting.
- Obey the global `~/.config/opencode/AGENTS.md` for plans, questions,
  evidence, and shell-command rules.

## Evolution

This schema is a living document. When a workflow repeatedly breaks or a
new convention emerges, update this file and log the change as
`## [YYYY-MM-DD] schema | <what changed>` in `log.md`.
