---
title: Fini Current GitHub Actions Workflows
type: source
created: 2026-04-12
updated: 2026-04-12
sources: [2026-04-12-fini-current-github-actions]
tags: [fini, github-actions, ci, release, security, docker]
---

# Fini Current GitHub Actions Workflows

Direct inspection of the current workflow files in the sibling Fini app repo at `../fini/.github/workflows/`: `security.yml`, `release-dry-run.yml`, and `release-tag.yml` [[sources/2026-04-12-fini-current-github-actions]].

This source captures the implemented Actions graph as it exists now. The workflow set is small, but it is strongly release-oriented: one reusable security workflow, one manual release rehearsal path, and one tag-triggered publish path.

## Workflow inventory

- `security.yml` — reusable Snyk-based security check.
- `release-dry-run.yml` — manual release-prep workflow with optional full build matrix.
- `release-tag.yml` — tag-triggered release workflow for `v*` tags.

## Key claims

- Both release workflows depend on the reusable `security.yml` workflow before quality gates run.
- `security.yml` currently contains a single `snyk` job that runs on pushes to `main`, `master`, `dev`, and `prod`, on pull requests, and through `workflow_call` [[sources/2026-04-12-fini-current-github-actions]].
- `release-dry-run.yml` validates signing readiness, checks keyless cosign, runs backend tests/checks plus frontend build, and can fan out into Linux, Windows, Android, and Docker-cache jobs without publishing [[sources/2026-04-12-fini-current-github-actions]].
- `release-tag.yml` enforces tag format, tagger permission, `origin/main` alignment, and signed annotated tag verification before any release build happens [[sources/2026-04-12-fini-current-github-actions]].
- The release workflow rewrites project versions from the tag inside CI before building Linux, Windows, Android, and Docker release outputs [[sources/2026-04-12-fini-current-github-actions]].

## Platform pipeline details

### Linux

- Builds run for both `x64` and `arm64` targets [[sources/2026-04-12-fini-current-github-actions]].
- The workflow expects all three Linux bundle types: `.deb`, `.rpm`, and `.AppImage` [[sources/2026-04-12-fini-current-github-actions]].
- Prep artifacts are named with `fini-prep-<sha>-linux-<arch>.*`; release artifacts use `fini-<tag>-linux-<arch>.*` [[sources/2026-04-12-fini-current-github-actions]].

### Windows

- Builds run for both `x64` and `arm64` using NSIS bundles [[sources/2026-04-12-fini-current-github-actions]].
- The workflow expects `*-setup.exe` output and renames it into the release artifact naming scheme [[sources/2026-04-12-fini-current-github-actions]].

### Android

- Android builds are currently optimized to a single `aarch64` target rather than a broader mobile matrix [[sources/2026-04-12-fini-current-github-actions]].
- The pipeline builds both APK and AAB, then signs them explicitly with the configured keystore using `apksigner` and `jarsigner` [[sources/2026-04-12-fini-current-github-actions]].

## Publish topology

- `release-dry-run.yml` stops at uploaded prep artifacts and Docker cache build [[sources/2026-04-12-fini-current-github-actions]].
- `release-tag.yml` fans out into Linux, Windows, Android, and Docker publish jobs, then converges into either `publish-stable` or `publish-prerelease` [[sources/2026-04-12-fini-current-github-actions]].
- Stable releases require the protected `release` environment; prereleases are published for `-rc.N` tags without that environment gate [[sources/2026-04-12-fini-current-github-actions]].

## Supply-chain details observed

- Blob signing and image signing use cosign with GitHub OIDC [[sources/2026-04-12-fini-current-github-actions]].
- Docker images publish to GHCR and receive provenance attestation [[sources/2026-04-12-fini-current-github-actions]].
- GitHub release assets are merged, attested, then individually blob-signed before release publication [[sources/2026-04-12-fini-current-github-actions]].

## Open questions

- There is no separate always-on build/test workflow visible in `.github/workflows`; is that intentionally deferred in favor of release-centric checks?
- `security.yml` is currently Snyk-only. Is broader CI meant to stay inside release workflows for now?

## Related pages

- [[github-actions-pipelines]]
- [[release-gitops]]
