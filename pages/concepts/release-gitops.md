---
title: Release GitOps
type: concept
created: 2026-04-12
updated: 2026-04-12
sources: [2026-03-23-release-gitops-setup, 2026-04-12-fini-current-github-actions]
tags: [fini, release, gitops, github-actions, signing]
---

# Release GitOps

Fini's release flow is designed as a guarded GitOps pipeline rather than an ad hoc packaging step. The repo defines a manual prep workflow and a tag-triggered release workflow, both backed by the same quality gates and signing expectations [[sources/2026-03-23-release-gitops-setup]] [[sources/2026-04-12-fini-current-github-actions]].

The current workflows confirm that the release plan has been implemented as a concrete GitHub Actions graph with reusable security scanning, preflight signing checks, Linux/Windows/Android fan-out, Docker publishing, and gated final publication [[sources/2026-04-12-fini-current-github-actions]].

## Release shape

- `release-dry-run.yml` validates signing readiness, runs tests and builds, and can optionally run a fuller matrix [[sources/2026-03-23-release-gitops-setup]] [[sources/2026-04-12-fini-current-github-actions]].
- `release-tag.yml` runs on signed annotated `v*` tags that must point to current `origin/main` HEAD [[sources/2026-03-23-release-gitops-setup]] [[sources/2026-04-12-fini-current-github-actions]].
- The current implementation fans out to Linux, Windows, Android, and Docker jobs before publication, with Linux producing `.deb`, `.rpm`, and `.AppImage`, Windows producing NSIS `setup.exe`, and Android producing signed APK and AAB artifacts [[sources/2026-04-12-fini-current-github-actions]].
- Stable releases require protected-environment approval; RC releases publish as prereleases [[sources/2026-03-23-release-gitops-setup]] [[sources/2026-04-12-fini-current-github-actions]].

## Security and supply-chain posture

- Artifact signatures use keyless cosign through GitHub OIDC [[sources/2026-03-23-release-gitops-setup]] [[sources/2026-04-12-fini-current-github-actions]].
- Docker images publish to `ghcr.io/<owner>/fini:<tag>` and include signing plus provenance attestation in the current workflow implementation [[sources/2026-03-23-release-gitops-setup]] [[sources/2026-04-12-fini-current-github-actions]].
- Bad releases are deprecated and fixed forward rather than retagged [[sources/2026-03-23-release-gitops-setup]].

## Current workflow graph

For the concrete job topology, see [[github-actions-pipelines]].
