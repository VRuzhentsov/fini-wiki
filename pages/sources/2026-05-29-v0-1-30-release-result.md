---
title: 2026-05-29 v0.1.30 Release Result
type: source
created: 2026-06-03
updated: 2026-06-03
sources: [2026-05-29-v0-1-30-release-result]
tags: [fini, release, v0-1-30, github-actions]
claim_status: locked
evidence: source-backed
---

# 2026-05-29 v0.1.30 Release Result

This source records successful release `v0.1.30`, created from latest `origin/main` after PR #41 merged and published by the tag-driven GitHub Actions release workflow [[sources/2026-05-29-v0-1-30-release-result]].

## Key claims

- Version `0.1.30` was selected as the next patch after `0.1.29` / `v0.1.29` [[sources/2026-05-29-v0-1-30-release-result]].
- Release entrypoint was `make release VERSION=0.1.30` with no manual bypass of pre-release checks, metadata commit, signed tag creation, or tag push [[sources/2026-05-29-v0-1-30-release-result]].
- Local `main` matched `origin/main` at `ec8336a02e2ca94d19f4088213f8c7a7027f102b` before release [[sources/2026-05-29-v0-1-30-release-result]].
- Local pre-release gate passed, including E2E `32 passed (1.4m)` [[sources/2026-05-29-v0-1-30-release-result]].
- GitHub release workflow completed successfully and published stable release `v0.1.30` [[sources/2026-05-29-v0-1-30-release-result]].

## Open questions

- GitHub Actions emitted Node.js 20 deprecation annotations that should be tracked if not already covered by workflow maintenance [[sources/2026-05-29-v0-1-30-release-result]].

## Related pages

- [[release-gitops]]
- [[github-actions-pipelines]]

updates:: [[pages/concepts/release-gitops]]
updates:: [[pages/concepts/github-actions-pipelines]]
