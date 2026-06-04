---
name: wiki-maintainer
description: Use this skill whenever working in this repo's LLM wiki: querying, ingesting, linting, crystallizing conversations, checking wiki health, searching pages, or inspecting typed edges. This skill routes agents through AGENTS.md and the repo-local JS tools instead of guessing wiki structure.
---

# Wiki Maintainer

This skill is the entrypoint for operating the `fini-wiki` markdown knowledge base. Treat `AGENTS.md` as the authoritative schema; this skill only explains the fast path and when to use the helper tools.

## Standard Context Path

For any substantive wiki task:

1. Read `_hot.md` first for current high-signal context.
2. Read `_index.md` second for catalog navigation.
3. Use `tools/wiki-search <query>` if the relevant page is not obvious.
4. Read targeted `pages/**/*.md` files and follow wikilinks as needed.
5. Use `tools/wiki-edges <page-or-slug>` when typed relationships matter.
6. Cite concrete wiki pages and source pages in the response.

## Read-Only Helper Tools

Use these repo-local commands from the wiki root:

```sh
tools/wiki-check
tools/wiki-search <query>
tools/wiki-edges <page-or-slug>
```

- `tools/wiki-check` reports frontmatter issues, broken wikilinks, broken typed edges, orphan-like pages, and stale `_hot.md` dates.
- `tools/wiki-search <query>` searches `_hot.md`, `_index.md`, `AGENTS.md`, `.agents/skills/**/SKILL.md`, and `pages/**/*.md` with local keyword scoring.
- `tools/wiki-edges <page-or-slug>` prints outbound and inbound typed edges for graph-style traversal.

Tool output is evidence for investigation and lint reports. It is not permission to auto-fix files.

## Workflows

### Query

Answer from `_hot.md`, `_index.md`, targeted pages, and source citations. If the wiki lacks evidence, say so explicitly. If the answer creates durable synthesis, offer to crystallize it; do not file it automatically.

### Ingest

Follow the `AGENTS.md` ingest operation. Raw files are immutable. Discuss 3-5 takeaways with the user before writing wiki pages unless the user has already supplied the takeaways and asked to execute.

After writing the ingest, validate and preserve the work when the user asks to persist it:

1. Run `tools/wiki-check` and report whether any findings are new or pre-existing baseline issues.
2. Inspect `git status --short`, `git diff --stat`, and recent `git log --oneline -10` before committing.
3. Stage only the intended ingest files: `_hot.md`, `_index.md`, `log.md`, generated/updated `pages/**`, corresponding new `raw/**` source files, and deliberate skill/schema updates.
4. Leave unrelated local files unstaged, especially `.obsidian/workspace.json`, scratch notes, local config such as `opencode.json`, and any user changes outside the ingest scope.
5. Re-check staged content with `git status --short` and `git diff --staged --stat` before committing.
6. Commit with a concise `docs:` message that describes the ingest.
7. Push the current branch to its upstream when the user explicitly asks to push, then report the commit hash and push result.

### Lint

Run `tools/wiki-check` first. Summarize findings by priority and cite the exact reported file paths. Apply fixes only after the user confirms the lint-fix scope.

### Crystallize

Use this only when the user explicitly asks to file a completed conversation, investigation, design thread, or analysis. Distill durable outputs, update related pages, refresh `_index.md`/`_hot.md` only if needed, and append `log.md`.

### Typed Edges

Typed edges are markdown lines such as:

```md
uses:: [[pages/concepts/SpaceSync]]
depends_on:: [[pages/concepts/DeviceConnection]]
supersedes:: [[pages/sources/source-slug]]
```

Add them only when they improve traversal, linting, or future query work. Ordinary wikilinks remain the default.

## Guardrails

- Preserve `raw/` as read-only source of truth.
- Keep markdown files as the source of truth; do not introduce a graph database or vector store.
- Prefer evidence labels over numeric confidence scores.
- Preserve superseded and contradicted claims with citations instead of deleting history.
- Keep helper tools read-only; do not add auto-fix behavior to the skill.
