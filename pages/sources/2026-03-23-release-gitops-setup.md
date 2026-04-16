---
title: GitOps Release Flow Setup
type: source
created: 2026-04-12
updated: 2026-04-12
sources: [2026-03-23-release-gitops-setup]
tags: [fini, release, gitops, github-actions, signing, docker, android]
---

# GitOps Release Flow Setup

Release operations spec for this repository. It defines a two-step GitHub Actions release flow: a manual prep check and a tag-driven release workflow that enforces signed, annotated tags on `main`, re-runs full quality gates, updates version files, and publishes both platform artifacts and GHCR images. The document is operational and opinionated rather than exploratory.

## Key claims

- `release-dry-run.yml` is the manual prep gate; `release-tag.yml` is the real release path on `v*` tags.
- Releases require signed annotated tags, tag-actor permission checks, and tags that point at current `origin/main` HEAD.
- Stable releases use a protected `release` environment; RC tags publish as prereleases.
- Artifact signing uses keyless cosign through GitHub OIDC rather than stored cosign private keys.
- Rollback policy is fix-forward only: do not rewrite or retag old versions.

## Open questions

- none

## Related pages

- [[release-gitops]]
