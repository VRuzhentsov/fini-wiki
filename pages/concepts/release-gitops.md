---
title: Release GitOps
type: concept
created: 2026-04-12
updated: 2026-06-03
sources: [2026-03-23-release-gitops-setup, 2026-04-12-fini-current-github-actions, 2026-05-12-major-release-prep-screenshot-skill, 2026-05-29-pr-41-feature-plane-mcp-release-handoff, 2026-05-29-v0-1-30-release-result]
tags: [fini, release, gitops, github-actions, signing, play-store]
claim_status: locked
evidence: source-backed
---

# Release GitOps

Fini's release flow is designed as a guarded GitOps pipeline rather than an ad hoc packaging step. The repo defines a manual prep workflow and a tag-triggered release workflow, both backed by the same quality gates and signing expectations [[sources/2026-03-23-release-gitops-setup]] [[sources/2026-04-12-fini-current-github-actions]].

The current workflows confirm that the release plan has been implemented as a concrete GitHub Actions graph with reusable security scanning, preflight signing checks, Linux/Windows/Android fan-out, Docker publishing, and gated final publication [[sources/2026-04-12-fini-current-github-actions]].

Marketplace screenshot prep is now tracked separately from the release pipeline. The Play Store screenshot skill validates canonical marketplace assets under `docs/play-store/screenshots/`, while GitOps release workflows remain responsible for package build/sign/publish [[sources/2026-05-12-major-release-prep-screenshot-skill]]. See [[release-prep-screenshots]].

## Release shape

- `release-dry-run.yml` validates signing readiness, runs tests and builds, and can optionally run a fuller matrix [[sources/2026-03-23-release-gitops-setup]] [[sources/2026-04-12-fini-current-github-actions]].
- `release-tag.yml` runs on signed annotated `v*` tags that must point to current `origin/main` HEAD [[sources/2026-03-23-release-gitops-setup]] [[sources/2026-04-12-fini-current-github-actions]].
- The current implementation fans out to Linux, Windows, Android, and Docker jobs before publication, with Linux producing `.deb`, `.rpm`, and `.AppImage`, Windows producing NSIS `setup.exe`, and Android producing signed APK and AAB artifacts [[sources/2026-04-12-fini-current-github-actions]].
- Stable releases require protected-environment approval; RC releases publish as prereleases [[sources/2026-03-23-release-gitops-setup]] [[sources/2026-04-12-fini-current-github-actions]].
- Release operations should start from a clean local `main` fast-forwarded to latest `origin/main`; the release tag should point at the exact release metadata commit on `main` [[sources/2026-05-29-pr-41-feature-plane-mcp-release-handoff]].
- Use `make release VERSION=x.y.z`; do not manually bypass its pre-release gate, metadata commit, signed annotated tag, or push sequencing [[sources/2026-05-29-pr-41-feature-plane-mcp-release-handoff]].

## v0.1.30

Release `v0.1.30` was created from latest `origin/main` after PR #41 merged and published successfully as a stable GitHub release [[sources/2026-05-29-v0-1-30-release-result]].

- Version chosen: `0.1.30`, next patch after `0.1.29` / `v0.1.29` [[sources/2026-05-29-v0-1-30-release-result]].
- Entry command: `make release VERSION=0.1.30` [[sources/2026-05-29-v0-1-30-release-result]].
- Local pre-release gate passed, including E2E `32 passed (1.4m)` [[sources/2026-05-29-v0-1-30-release-result]].
- Signed tag verification succeeded and the remote tag peels to release commit `4044b723bcddbd82e927bf60e70bd399a0eed0c0` [[sources/2026-05-29-v0-1-30-release-result]].
- Release workflow completed successfully and published stable release `v0.1.30` [[sources/2026-05-29-v0-1-30-release-result]].

## Security and supply-chain posture

- Artifact signatures use keyless cosign through GitHub OIDC [[sources/2026-03-23-release-gitops-setup]] [[sources/2026-04-12-fini-current-github-actions]].
- Docker images publish to `ghcr.io/<owner>/fini:<tag>` and include signing plus provenance attestation in the current workflow implementation [[sources/2026-03-23-release-gitops-setup]] [[sources/2026-04-12-fini-current-github-actions]].
- Bad releases are deprecated and fixed forward rather than retagged [[sources/2026-03-23-release-gitops-setup]].

## Current workflow graph

For the concrete job topology, see [[github-actions-pipelines]].
