---
title: GitHub Actions
type: reference
created: 2026-04-12
updated: 2026-04-27
sources: [2026-03-23-release-gitops-setup, 2026-04-27-ci-quality-gates-cache-split]
tags: [tooling, ci, release, github-actions]
---

# GitHub Actions

Release automation for Fini. Two workflows, GitOps-driven by tag push.

## Workflows

- `.github/workflows/ci.yml` — single PR-facing workflow for required quality gates.
- `.github/workflows/security.yml` — `workflow_call` Snyk scan reused by release workflows.
- `.github/workflows/release-dry-run.yml` — manual dispatch; signing-readiness + quality gates + optional full matrix.
- `.github/workflows/release-tag.yml` — on tag push (`v*`); full gates + platform builds + atomic publish.

## Required PR checks

`main` branch protection currently requires [[sources/2026-04-27-ci-quality-gates-cache-split]]:

- `Snyk Vulnerability Scan`
- `FE Unit Tests`
- `BE Compile`
- `BE Unit Tests`
- `E2E Tests`

Backend compile and unit-test gates run through Dockerfile stages and Makefile targets so GHCR-backed cache images can reuse compiled test artifacts across similar source bases [[sources/2026-04-27-ci-quality-gates-cache-split]].

Tag is the source of truth for release version. Tag workflow propagates the version into `package.json`, `package-lock.json`, `src-tauri/Cargo.toml`, `src-tauri/Cargo.lock`, `src-tauri/tauri.conf.json`. Do not pre-bump version files for normal releases.

## Tag policy

- Format: `vMAJOR.MINOR.PATCH` or `vMAJOR.MINOR.PATCH-rc.N`.
- Must be signed + annotated with the configured GPG release key.
- Must point to current `origin/main` HEAD.
- Actor must have maintain/admin permissions.
- Pushes to `main` do not trigger release workflows.

## Required secrets

- `RELEASE_TAG_GPG_PUBLIC_KEY`
- `ANDROID_KEYSTORE_BASE64`
- `ANDROID_KEYSTORE_PASSWORD`
- `ANDROID_KEY_ALIAS`
- `ANDROID_KEY_PASSWORD`

No cosign private key stored. Signing is keyless via GitHub OIDC; see [[cosign]].

## Protected environment

- GitHub Environment `release` with required reviewers.
- Stable tags gate on environment approval.
- RC tags publish as prerelease without approval gate.
- `main` branch is protected.
- Tag creation is restricted to maintainers.

## Efficiency levers

- Android build matrix is restricted to `aarch64` in both dry-run and release. Extra ABIs add build time without covering production devices.
- Docker cache build runs on every dry-run dispatch; the subsequent tag run reuses the cache to shorten cold builds.
- Fast required CI lane runs `cargo test` / `cargo check` / `npm run test:e2e:mcp`. Keep it under a few minutes; slower lanes go to nightly. See [[playwright]].
- Platform publish is atomic — all targets must succeed. Always run `Release Prep Check` with `full_matrix=true` within 24h of tagging so surprises fail fast.
- Reuse dry-run commit for tag (same SHA); avoid re-running builds that already passed.

## Release procedure

1. Merge release commit to `main`.
2. Manual dispatch `Release Prep Check` with `full_matrix=true` on that commit; confirm pass within 24h.
3. Create signed annotated tag:

   ```bash
   git tag -s vX.Y.Z -m "vX.Y.Z"
   git push origin vX.Y.Z
   ```

   RC variant: `vX.Y.Z-rc.N`.

4. Approve `release` environment when prompted (stable only).
5. Verify published assets: Linux bundle, Windows bundle, signed Android APK + AAB, SBOM, cosign signatures + certificates, SHA256 checksums.
6. Verify container transport: `ghcr.io/<owner>/fini:<tag>`, `latest` tag for stable, image digest signature + attestation.

## Rollback

- Never rewrite or retag existing versions.
- Mark bad release deprecated.
- Fix-forward via next patch tag (`vX.Y.Z+1`).
