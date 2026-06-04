---
title: Repo/Wiki Documentation Policy
type: concept
created: 2026-05-21
updated: 2026-05-21
sources: [2026-04-27-repo-wiki-doc-split]
tags: [fini, docs, specs, wiki, policy]
claim_status: locked
evidence: source-backed
---

# Repo/Wiki Documentation Policy

Fini documentation is split by enforceability: code-facing contracts live in the main `../fini` repo, while historical rationale and cross-feature synthesis live in `fini-wiki` [[sources/2026-04-27-repo-wiki-doc-split]].

derived_from:: [[pages/sources/2026-04-27-repo-wiki-doc-split]]

## Boundary rule

- If code can be wrong against a document, it belongs in `../fini/specs` or another repo-local companion doc [[sources/2026-04-27-repo-wiki-doc-split]].
- If the document explains why the implementation exists, how it evolved, or what may happen later, it belongs in this wiki [[sources/2026-04-27-repo-wiki-doc-split]].
- If both are useful, keep the enforceable contract in `../fini/specs` and link to the wiki for rationale/history [[sources/2026-04-27-repo-wiki-doc-split]].

## Main repo docs

Repo docs should evolve in the same review as code when they define implementation behavior [[sources/2026-04-27-repo-wiki-doc-split]].

They include:

- `specs/<feature>/README.md` feature specs [[sources/2026-04-27-repo-wiki-doc-split]].
- Companion docs next to implementation files such as `src/**/*.md` [[sources/2026-04-27-repo-wiki-doc-split]].
- Backend/service companion docs when needed [[sources/2026-04-27-repo-wiki-doc-split]].
- Repo workflow instructions in `AGENTS.md` [[sources/2026-04-27-repo-wiki-doc-split]].

Repo docs define current feature behavior, invariants, testable acceptance criteria, and ownership boundaries between UI, stores, and backend services [[sources/2026-04-27-repo-wiki-doc-split]].

## Wiki docs

Wiki docs preserve broader, historical, strategic, or synthesized context across implementation phases [[sources/2026-04-27-repo-wiki-doc-split]].

They include:

- Product rationale and historical intent [[sources/2026-04-27-repo-wiki-doc-split]].
- Architecture evolution and superseded approaches [[sources/2026-04-27-repo-wiki-doc-split]].
- Roadmap and planning captures [[sources/2026-04-27-repo-wiki-doc-split]].
- Cross-feature analysis [[sources/2026-04-27-repo-wiki-doc-split]].

## Open questions

- Whether more cross-cutting frontend companion docs should move into feature specs over time [[sources/2026-04-27-repo-wiki-doc-split]].
- Whether older scattered domain docs should migrate into `specs/<feature>/README.md` [[sources/2026-04-27-repo-wiki-doc-split]].
- Whether backend companion Markdown docs under `src-tauri/` should be added where useful [[sources/2026-04-27-repo-wiki-doc-split]].
