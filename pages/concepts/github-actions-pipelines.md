---
title: GitHub Actions Pipelines
type: concept
created: 2026-04-12
updated: 2026-04-12
sources: [2026-04-12-fini-current-github-actions, 2026-03-23-release-gitops-setup]
tags: [fini, github-actions, ci, release, pipeline]
---

# GitHub Actions Pipelines

Fini's current GitHub Actions setup is compact but strongly release-oriented. The implemented graph has three workflows: a reusable security check, a manual release-prep pipeline, and a tag-driven release pipeline [[sources/2026-04-12-fini-current-github-actions]].

## Current topology

1. `security.yml`
2. `release-dry-run.yml`
3. `release-tag.yml`

The first workflow is reusable infrastructure. The latter two are the main orchestration layers.

## Reusable security gate

- `security.yml` runs Snyk after `npm ci` on pushes to `main/master/dev/prod`, on pull requests, and by `workflow_call` [[sources/2026-04-12-fini-current-github-actions]].
- Both release pipelines call it as their first shared gate [[sources/2026-04-12-fini-current-github-actions]].

## Manual prep pipeline

- `release-dry-run.yml` is the rehearsal path [[sources/2026-04-12-fini-current-github-actions]].
- It runs signing-readiness checks, validates keyless cosign, executes backend tests/checks plus frontend build, and optionally expands into a full artifact matrix with Linux, Windows, Android, and Docker cache jobs [[sources/2026-04-12-fini-current-github-actions]].
- Platform outputs are explicit rather than generic: Linux expects `.deb`, `.rpm`, and `.AppImage`; Windows expects NSIS `setup.exe`; Android emits signed APK and AAB artifacts [[sources/2026-04-12-fini-current-github-actions]].
- Its purpose is validation, not publishing [[sources/2026-04-12-fini-current-github-actions]].

## Release pipeline

- `release-tag.yml` is the publish path for `v*` tags [[sources/2026-04-12-fini-current-github-actions]].
- It first validates tag shape, actor permissions, `origin/main` alignment, and signed annotated tag status [[sources/2026-04-12-fini-current-github-actions]].
- It then runs quality gates, fans out to Linux, Windows, Android, and Docker publish jobs, and converges into either `publish-stable` or `publish-prerelease` [[sources/2026-04-12-fini-current-github-actions]].

## Practical graph shape

- Validation phase: security + tag/signing checks.
- Build phase: quality gates, then Linux/Windows/Android/Docker jobs in parallel.
- Publish phase: stable or prerelease publication after all build jobs succeed.

This means the pipeline is intentionally convergent: release publication is blocked on the full artifact set rather than allowing partial success [[sources/2026-04-12-fini-current-github-actions]].

## Relationship to older release docs

The earlier release setup note already described most of this direction, but the current workflows provide the actual implementation details and exact job graph, especially around platform-specific outputs and the final publish convergence [[sources/2026-03-23-release-gitops-setup]] [[sources/2026-04-12-fini-current-github-actions]].
