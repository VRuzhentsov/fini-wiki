---
title: GitHub Actions Pipelines
type: concept
created: 2026-04-12
updated: 2026-04-27
sources: [2026-04-12-fini-current-github-actions, 2026-03-23-release-gitops-setup, 2026-04-27-split-e2e-ci-workflow-steps, 2026-04-27-ci-quality-gates-cache-split]
tags: [fini, github-actions, ci, release, pipeline, e2e]
---

# GitHub Actions Pipelines

Fini's current GitHub Actions setup is compact but strongly release-oriented. The implemented graph has three workflows: a reusable security check, a manual release-prep pipeline, and a tag-driven release pipeline [[sources/2026-04-12-fini-current-github-actions]].

> [!warning] Updated PR workflow shape
> Newer CI work adds a single PR-facing `.github/workflows/ci.yml` workflow and changes `security.yml` to `workflow_call` only for reuse by release workflows [[sources/2026-04-27-ci-quality-gates-cache-split]].

## Current topology

1. `security.yml`
2. `release-dry-run.yml`
3. `release-tag.yml`

The first workflow is reusable infrastructure. The latter two are the main orchestration layers.

## Reusable security gate

- `security.yml` runs Snyk after `npm ci` on pushes to `main/master/dev/prod`, on pull requests, and by `workflow_call` [[sources/2026-04-12-fini-current-github-actions]].
- Both release pipelines call it as their first shared gate [[sources/2026-04-12-fini-current-github-actions]].

After the CI quality-gate split, `security.yml` should be `workflow_call` only so Snyk remains reusable by release workflows without creating a second PR-facing workflow [[sources/2026-04-27-ci-quality-gates-cache-split]].

## PR quality gates

The current PR-facing workflow is `.github/workflows/ci.yml` [[sources/2026-04-27-ci-quality-gates-cache-split]]. Required `main` branch checks are:

- `Snyk Vulnerability Scan`
- `FE Unit Tests`
- `BE Compile`
- `BE Unit Tests`
- `E2E Tests`

GitHub Actions should remain thin: workflow jobs call Makefile targets, while Dockerfile stages define the test/runtime environment [[sources/2026-04-27-ci-quality-gates-cache-split]].

## Backend compile/test cache split

Backend validation is intentionally split for cache reuse [[sources/2026-04-27-ci-quality-gates-cache-split]].

- `BE Compile` builds Rust test binaries with `cargo test --no-run` in Dockerfile stage `be-test-compile`.
- `BE Unit Tests` builds from `be-test-compile` and runs `cargo test` in `be-unit-test`.
- `pr-gate-be-cache-key` is computed from backend-relevant inputs such as `Dockerfile`, `src-tauri/Cargo.*`, Rust sources, migrations, capabilities, icons, and `tauri.conf.json`.
- GHCR-backed cache images use backend input keys for cross-workflow reuse.
- Release dry-run/tag quality gates call `make pr-gate-be-compile` and `make pr-gate-be-unit` instead of native Rust setup/cache in the backend quality-gate path.

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

## E2E CI debuggability

The E2E job should avoid hiding the entire multi-actor flow behind one opaque GitHub Actions step [[sources/2026-04-27-split-e2e-ci-workflow-steps]].

- Keep aggregate `make pr-gate-e2e` for local reproduction and quick full runs.
- Back the aggregate with smaller Makefile targets for build actor, build runner, network, start actors, wait actors, run, logs, and cleanup.
- Split `.github/workflows/ci.yml` E2E job into named steps: Build E2E actor image, Build E2E runner image, Create E2E network, Start E2E actors, Wait for E2E actors, Run Playwright E2E suite, Print actor logs on failure, Cleanup E2E containers.
- Keep orchestration in Makefile targets rather than duplicating long shell logic in YAML.
- Use `CONTAINER=docker` in GitHub Actions and `CONTAINER ?= podman` locally.

This is a CI observability improvement. The current aggregate E2E flow was already green on PR #18, so the source frames this as debuggability rather than topology change [[sources/2026-04-27-split-e2e-ci-workflow-steps]].

Open follow-ups: whether release dry-run/tag workflows should also move from Dockerfile `test` stage to split Makefile targets, and whether Playwright traces/test results should be uploaded as artifacts on E2E failure [[sources/2026-04-27-split-e2e-ci-workflow-steps]].

Additional backend-cache follow-ups: whether `BE Compile` and `BE Unit Tests` should share one GHCR cache image long-term, and whether release artifact jobs should adopt the same Dockerfile/Makefile cache strategy or keep platform-native setup for bundle production [[sources/2026-04-27-ci-quality-gates-cache-split]].

## Relationship to older release docs

The earlier release setup note already described most of this direction, but the current workflows provide the actual implementation details and exact job graph, especially around platform-specific outputs and the final publish convergence [[sources/2026-03-23-release-gitops-setup]] [[sources/2026-04-12-fini-current-github-actions]].
