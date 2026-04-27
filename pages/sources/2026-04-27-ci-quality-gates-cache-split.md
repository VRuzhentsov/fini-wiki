---
title: 2026-04-27 CI Quality Gates Cache Split
type: source
created: 2026-04-27
updated: 2026-04-27
sources: [2026-04-27-ci-quality-gates-cache-split]
tags: [fini, ci, github-actions, docker, ghcr, quality-gates]
---

# 2026-04-27 CI Quality Gates Cache Split

Decision note for making Fini's PR and release quality gates clearer, more Dockerfile-centered, and more cache-friendly. The main change is a single PR-facing `CI` workflow with required checks, plus a split between backend compile and backend unit-test execution so Docker/GHCR cache images can be reused.

## Key claims

- Use one PR-facing workflow: `.github/workflows/ci.yml` [[sources/2026-04-27-ci-quality-gates-cache-split]].
- Keep `.github/workflows/security.yml` as `workflow_call` only so release workflows can reuse Snyk without creating a second PR workflow [[sources/2026-04-27-ci-quality-gates-cache-split]].
- Keep GitHub Actions thin: workflows call Makefile targets and let Dockerfile/Makefile own test/runtime setup [[sources/2026-04-27-ci-quality-gates-cache-split]].
- Backend validation is split into `BE Compile` (`cargo test --no-run`) and `BE Unit Tests` (actual `cargo test`) inside Dockerfile stages [[sources/2026-04-27-ci-quality-gates-cache-split]].
- GHCR-backed image tags are keyed from backend-relevant inputs so compiled test artifacts can be reused across similar source bases [[sources/2026-04-27-ci-quality-gates-cache-split]].
- Required `main` branch protection checks are `Snyk Vulnerability Scan`, `FE Unit Tests`, `BE Compile`, `BE Unit Tests`, and `E2E Tests` [[sources/2026-04-27-ci-quality-gates-cache-split]].
- Release dry-run/tag quality gates now call `make pr-gate-be-compile` and `make pr-gate-be-unit`, removing native Rust setup/cache from the backend quality-gate path [[sources/2026-04-27-ci-quality-gates-cache-split]].

## Evidence

- Implementation commits named by the source: `53a1791`, `0609604`, `be0de7c`, `32a09d9`, `7911041`, `f822a15` [[sources/2026-04-27-ci-quality-gates-cache-split]].
- Verification commands included `make pr-gate-be-cache-key`, dry-run Make targets, `git diff --check`, and GitHub branch-protection API inspection [[sources/2026-04-27-ci-quality-gates-cache-split]].
- Branch protection was confirmed to require the five expected check names [[sources/2026-04-27-ci-quality-gates-cache-split]].

## Open questions

- Whether `BE Unit Tests` and `BE Compile` should share the exact same GHCR cache image long-term [[sources/2026-04-27-ci-quality-gates-cache-split]].
- Whether release artifact jobs should use the same Dockerfile/Makefile cache strategy as Quality Gates, or keep native platform-specific setup because they produce platform bundles [[sources/2026-04-27-ci-quality-gates-cache-split]].

## Related pages

- [[github-actions-pipelines]]
- [[e2e-testing]]
- [[pages/tooling/github-actions]]
