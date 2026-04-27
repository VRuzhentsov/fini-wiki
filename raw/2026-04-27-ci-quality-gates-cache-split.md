# CI Quality Gates Cache Split

Date: 2026-04-27

## Context

The Fini CI configuration was updated to make PR and release quality gates clearer, more Dockerfile-centered, and more cache-friendly across similar source bases.

The user wanted GitHub PR gates before merging to `main`, then refined the design to avoid complex GitHub Actions logic and keep test/runtime setup inside Dockerfile stages plus Makefile targets.

## Summary

CI now has one PR-facing workflow, `CI`, with required checks for security, frontend unit tests, backend compile, backend unit tests, and E2E tests. Backend compile and backend test execution are split so compiled test artifacts can be reused through Docker/GHCR image caching.

## Decisions

- Use a single PR-facing workflow: `.github/workflows/ci.yml`.
- Keep `.github/workflows/security.yml` as `workflow_call` only so release workflows can still reuse the Snyk scan without creating a second PR workflow.
- Keep GitHub Actions thin: workflows call Makefile targets and avoid embedding container orchestration or Rust setup logic where Dockerfile/Makefile can own it.
- Use Dockerfile stages as the test environment boundary.
- Split backend validation into:
  - `BE Compile`: compile Rust test binaries with `cargo test --no-run` inside Docker.
  - `BE Unit Tests`: run Rust unit tests inside Docker, based on the compile stage.
- Use GHCR-backed image tags keyed from relevant backend inputs for cross-workflow reuse.
- Require the following `main` branch protection checks:
  - `Snyk Vulnerability Scan`
  - `FE Unit Tests`
  - `BE Compile`
  - `BE Unit Tests`
  - `E2E Tests`

## Implementation

- `Dockerfile`
  - Added `be-test-compile` stage:
    - `cargo test --manifest-path src-tauri/Cargo.toml --no-run`
  - Changed `be-unit-test` to build from `be-test-compile` and then run:
    - `cargo test --manifest-path src-tauri/Cargo.toml`
  - Existing FE and E2E Dockerfile stages remain the execution boundary for their tests.

- `Makefile`
  - Added backend cache variables:
    - `FINI_BE_COMPILE_IMAGE`
    - `FINI_BE_UNIT_IMAGE`
    - `FINI_BE_CACHE_IMAGE_PREFIX`
    - `FINI_BE_CACHE_PUSH`
  - Added `pr-gate-be-cache-key`, computed from backend-relevant inputs including `Dockerfile`, `src-tauri/Cargo.toml`, `src-tauri/Cargo.lock`, `src-tauri/src`, migrations, patches, capabilities, icons, and `tauri.conf.json`.
  - Added `pr-gate-be-compile`, which pulls/pushes a `*-be-compile-cache:<cache-key>` image when `FINI_BE_CACHE_IMAGE_PREFIX` is configured.
  - Updated `pr-gate-be-unit` to call `pr-gate-be-compile`, then build `be-unit-test` with `--cache-from` the compile image.

- `.github/workflows/ci.yml`
  - Added separate `BE Compile` job.
  - Kept separate `BE Unit Tests` job.
  - Both jobs resolve `FINI_BE_CACHE_IMAGE_PREFIX=ghcr.io/${owner}/fini` and set `FINI_BE_CACHE_PUSH` based on whether the run is allowed to push package cache images.
  - Required check labels were normalized to title case:
    - `FE Unit Tests`
    - `BE Compile`
    - `BE Unit Tests`
    - `E2E Tests`

- `.github/workflows/release-dry-run.yml`
- `.github/workflows/release-tag.yml`
  - In `Quality Gates`, replaced native backend `cargo test` and `cargo check` steps with:
    - `make pr-gate-be-compile`
    - `make pr-gate-be-unit`
  - Removed native Rust setup/cache and Linux system dependency setup from the Quality Gates backend path where Dockerfile stages now own that environment.

## Evidence

- Relevant commits:
  - `53a1791 feat: add PR gate checks`
  - `0609604 ci: consolidate PR checks`
  - `be0de7c ci: rename required check labels`
  - `32a09d9 ci: split e2e workflow steps`
  - `7911041 ci: cache e2e workflow images`
  - `f822a15 ci: split backend compile and test gates`

- Verification commands run during implementation:
  - `make pr-gate-be-cache-key`
  - `CONTAINER=docker make -n pr-gate-be-compile pr-gate-be-unit pr-gate-e2e-build-actor`
  - `git diff --check`
  - `gh api repos/VRuzhentsov/fini/branches/main/protection --jq '.required_status_checks.contexts'`

- Branch protection was updated via GitHub API and confirmed to require:
  - `Snyk Vulnerability Scan`
  - `FE Unit Tests`
  - `BE Compile`
  - `BE Unit Tests`
  - `E2E Tests`

## Open Questions

- Whether `BE Unit Tests` and `BE Compile` should share the exact same GHCR cache image in the long term, or whether separate compile/test cache artifacts are worth introducing after observing CI timings.
- Whether release artifact jobs should eventually use the same Dockerfile/Makefile cache strategy as Quality Gates, or keep native platform-specific Rust/Node setup because they produce platform bundles.
