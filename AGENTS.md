# Wiki Schema

This file defines how to operate the LLM Wiki rooted at `~/projects/fini-wiki/`.
This wiki is the second brain for the **Fini** project.
When working inside this directory, treat these rules as authoritative; they
extend (and override on conflict) the global `~/.config/opencode/AGENTS.md`.

## Purpose

Maintain a persistent, compounding second brain. Raw sources are immutable;
wiki pages are LLM-written syntheses that get richer with every ingest.

## Obsidian integration

This wiki lives outside the main Obsidian vault (`~/Documents/`). To use
Obsidian features (graph view, backlinks, Dataview, Web Clipper), open
`~/projects/fini-wiki/` as an additional vault via File → Open another vault.
Wikilinks (`[[page-name]]`) and the `.obsidian/` config created on first
open are compatible with git and may be committed.

## Layout

```
~/projects/fini-wiki/
├── AGENTS.md          # this schema (you are here)
├── _hot.md            # active context cache for agent-first lookup
├── _index.md          # content catalog and navigation index
├── log.md             # chronological activity log (append-only)
├── tools/             # dependency-free read-only wiki inspection helpers
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
- **Wiki** (`pages/`, `_hot.md`, `_index.md`, `log.md`): LLM-owned. Create, update,
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

## Claim lifecycle

Prefer verifiable evidence labels over numeric confidence scores. Do not add
floating-point confidence values; they imply precision the wiki cannot prove.

Use these labels in frontmatter or the nearest section when a page contains
durable claims:

```yaml
claim_status: locked | provisional | superseded | contradicted | historical
evidence: source-backed | repo-inspected | user-locked | inferred
```

- `locked`: current operating truth backed by source citations, direct repo
  inspection, or explicit user lock-in.
- `provisional`: plausible but not yet fully evidenced; must include a nearby
  `> [!question]` or open question.
- `superseded`: historically useful but replaced by a newer source or decision.
- `contradicted`: active conflict exists and the wiki should preserve both sides.
- `historical`: retained for chronology, not current implementation guidance.

Every durable claim should expose its evidence chain: cited source page, source
date, current/old status, and any superseding or contradicting source.

## Typed edges

Ordinary wikilinks remain the default. Add typed markdown edges only when the
relationship improves traversal, linting, or future query work. Keep them in the
page body so Obsidian remains the primary interface.

Use one edge per line:

```markdown
uses:: [[pages/concepts/SpaceSync]]
depends_on:: [[pages/concepts/DeviceConnection]]
supersedes:: [[pages/sources/2026-03-23-sync-devices-design]]
contradicts:: [[pages/sources/example-source]]
derived_from:: [[pages/sources/source-slug]]
```

Allowed edge names for now: `uses`, `depends_on`, `supersedes`, `contradicts`,
`derived_from`, `updates`, `blocks`, `validates`.

Do not create a separate graph database in this iteration. The markdown files
remain the source of truth; helper tools may read typed edges but must not own
them.

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
5. Update `_index.md` (add new pages, refresh summaries for changed pages).
6. Update `_hot.md` when the ingest changes active context, current architecture
   facts, product semantics, or other high-signal facts agents should see first.
7. Append an entry to `log.md`.
8. Report back: list of pages created/updated, flagged contradictions,
   suggested follow-up questions.

### Query

User asks a question against the wiki.

1. Read `_hot.md` first for active context and current high-signal facts.
2. Read `_index.md` second to locate relevant pages.
3. Drill into those pages; follow wikilinks as needed.
4. Use targeted search in `pages/**/*.md` if the right page is not obvious from
   `_hot.md` or `_index.md`.
5. Answer with citations to `[[sources/...]]` and `[[pages/...]]`.
6. If the answer is substantive (comparison, analysis, new connection),
   offer to file it back into the wiki as a new page under the appropriate
   category and log it. Do not file automatically; ask first.
7. If the wiki lacks evidence, say so explicitly rather than speculating.

### Crystallize

User explicitly asks to file a completed conversation, investigation, design
thread, or analysis back into the wiki.

1. Identify the durable outputs: decisions, corrected assumptions, reusable
   facts, open questions, and follow-up source needs.
2. Decide the storage shape:
   - `pages/sources/<slug>.md` for transcript-like material or raw handoff notes.
   - `pages/concepts/<slug>.md` for durable domain knowledge.
   - `pages/concepts/<slug>.md` with `type: analysis` for synthesized arguments,
     comparisons, or decision records.
3. Ask the user before writing if the scope is ambiguous or if private material
   may be included.
4. Write only the distilled knowledge, not the full chat log, unless the user
   provides the chat as a raw source.
5. Update related concept/entity pages, `_index.md`, `_hot.md` if high-signal,
   and `log.md`.
6. Include sections for `What became durable`, `What changed`, and `Open
   questions` when useful.

### Lint

On request, health-check the wiki.

- Contradictions between pages (flag with source dates).
- Stale claims superseded by newer sources.
- Orphan pages (no inbound wikilinks).
- Concepts mentioned ≥3 times without a dedicated page.
- Missing cross-references (A cites B but B has no backlink context).
- Data gaps that warrant a web search or new source.
- Missing or malformed frontmatter on wiki pages.
- Broken wikilinks or typed-edge targets.
- Claims marked current while their supporting text says superseded.
- Durable claims that lack nearby source citations.
- Stale `_hot.md` facts that should move into durable pages or be refreshed.

Produce a prioritized report; apply fixes only after user confirms scope.

### Read-only tooling

Dependency-free JavaScript helper commands may inspect the wiki, but they must
not modify files. They supplement `_index.md`; they do not replace the
human-readable catalog.

- `tools/wiki-check`: reports frontmatter issues, broken wikilinks, broken typed
  edge targets, missing typed-edge targets, and stale `_hot.md` dates.
- `tools/wiki-search <query>`: searches `_hot.md`, `_index.md`, `AGENTS.md`, and
  `.agents/skills/**/SKILL.md` and `pages/**/*.md` with local keyword scoring.
- `tools/wiki-edges <page-or-slug>`: prints typed edges on a page and inbound
  typed edges from other pages.

Tool output is evidence for a lint report, not permission to auto-fix.

### Repo-local skill

Agents that support `.agents` skills should use
`.agents/skills/wiki-maintainer/SKILL.md` as the workflow entrypoint for this
wiki. The skill is intentionally thin: it points back to this schema and the
read-only JS helper tools rather than duplicating the full operating rules.

## _hot.md format

`_hot.md` is the first-read cache for active context. Keep it short enough that
agents can read it at the start of any wiki-related task.

Use it for:

- Current architecture facts
- Active product or business threads
- Current terminology and domain semantics
- Recently changed truths that agents are likely to get wrong
- High-signal warnings or decision context

Move stable navigation links into `_index.md`; move durable knowledge into
`pages/**`.

## _index.md format

Content-oriented catalog. Grouped by category. Each entry: one line.

```markdown
## Entities
- [[pages/entities/some-person]] — one-line hook (N sources)

## Concepts
- [[pages/concepts/some-idea]] — one-line hook (N sources)

## Sources
- [[pages/sources/2026-04-10-article-slug]] — one-line hook
```

Keep each line under ~150 chars. Update `_index.md` on every ingest.

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
