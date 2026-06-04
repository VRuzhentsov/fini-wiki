---
title: 2026-04-27 Repo/Wiki Documentation Split
type: source
created: 2026-05-21
updated: 2026-05-21
sources: [2026-04-27-repo-wiki-doc-split]
tags: [fini, docs, specs, wiki, policy]
claim_status: locked
evidence: source-backed
---

# 2026-04-27 Repo/Wiki Documentation Split

The repo/wiki documentation split locks a simple boundary: implementation-enforceable feature contracts live in `../fini/specs` or companion repo docs, while historical rationale, architecture evolution, roadmap, and cross-feature synthesis live in this wiki [[sources/2026-04-27-repo-wiki-doc-split]].

## Key claims

- If code can be wrong against a document, the document belongs in `../fini/specs` or another repo-local implementation companion file [[sources/2026-04-27-repo-wiki-doc-split]].
- If a document explains why the current implementation exists, how it evolved, or what may happen later, it belongs in `fini-wiki` [[sources/2026-04-27-repo-wiki-doc-split]].
- Repo specs should define current behavior, invariants, testable acceptance criteria, and ownership boundaries between UI, stores, and backend services [[sources/2026-04-27-repo-wiki-doc-split]].
- When both forms are useful, keep the enforceable contract in `../fini/specs` and link to wiki pages for rationale/history [[sources/2026-04-27-repo-wiki-doc-split]].
- Existing feature specs at the time included `specs/device-connect/README.md`, `specs/space-sync/README.md`, and `specs/space/README.md` [[sources/2026-04-27-repo-wiki-doc-split]].

## Open questions

- Whether more cross-cutting frontend companion docs should migrate into feature specs over time [[sources/2026-04-27-repo-wiki-doc-split]].
- Whether older scattered domain docs should migrate into `specs/<feature>/README.md` [[sources/2026-04-27-repo-wiki-doc-split]].
- Whether backend companion Markdown docs under `src-tauri/` should be added where useful [[sources/2026-04-27-repo-wiki-doc-split]].

## Related pages

- [[repo-wiki-doc-policy]]

derived_from:: [[pages/sources/2026-04-27-repo-wiki-doc-split]]
