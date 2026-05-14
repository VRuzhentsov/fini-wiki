---
title: Release Prep Screenshots
type: concept
created: 2026-05-13
updated: 2026-05-13
sources: [2026-05-12-major-release-prep-screenshot-skill, 2026-05-12-github-issue-22-release-prep-skill]
tags: [fini, release-prep, play-store, screenshots, skills]
claim_status: locked
evidence: source-backed
---

# Release Prep Screenshots

Fini's first release-prep skill is scoped to Play Store screenshot package validation and later screenshot generation, not the whole release pipeline. It creates a human/agent entrypoint for marketplace assets while the GitOps release flow remains separate [[sources/2026-05-12-major-release-prep-screenshot-skill]] [[sources/2026-05-12-github-issue-22-release-prep-skill]].

## Current scope

- The first output is the canonical Google Play screenshot package under `docs/play-store/screenshots/` [[sources/2026-05-12-major-release-prep-screenshot-skill]].
- The workflow validates current canonical assets and writes `docs/play-store/screenshots/manifest.json`; it does not yet generate fresh runtime captures/compositions [[sources/2026-05-12-major-release-prep-screenshot-skill]].
- The screenshot source direction is the normal Fini app runtime scaled to mobile/tablet proportions, not a mandatory Android emulator/device path [[sources/2026-05-12-major-release-prep-screenshot-skill]].
- Screenshot/demo state must use curated demo data, never local private data [[sources/2026-05-12-major-release-prep-screenshot-skill]].

## Skill and command surface

- The repo-local skill is `.agents/skills/fini-release-prep/` and `fini-dev` should route major release screenshot prep to it [[sources/2026-05-12-major-release-prep-screenshot-skill]].
- Human entrypoint: `make play-store-screenshots` [[sources/2026-05-12-major-release-prep-screenshot-skill]].
- Automation entrypoint: `cargo xtask play-store-screenshots` [[sources/2026-05-12-major-release-prep-screenshot-skill]].
- Issue `VRuzhentsov/fini#22` tracks later validation and continuation as `Release prep skill: Play Market screenshots` [[sources/2026-05-12-github-issue-22-release-prep-skill]].

## Current asset matrix

- Phone screenshots: `780x1387` [[sources/2026-05-12-major-release-prep-screenshot-skill]].
- 7-inch tablet screenshots: `1200x1920` [[sources/2026-05-12-major-release-prep-screenshot-skill]].
- 10-inch tablet screenshots: `1600x2560` [[sources/2026-05-12-major-release-prep-screenshot-skill]].
- `make play-store-screenshots` validated 9 Play Store screenshots and wrote the manifest [[sources/2026-05-12-major-release-prep-screenshot-skill]].

## Follow-ups

- Implement full runtime capture and composition automation for fresh light/dark store-ready artwork [[sources/2026-05-12-major-release-prep-screenshot-skill]].
- Add alternate Android marketplaces after Play Store core is stable [[sources/2026-05-12-major-release-prep-screenshot-skill]].
- Validate the workflow end-to-end as part of issue #22 rather than claiming it is fully proven now [[sources/2026-05-12-github-issue-22-release-prep-skill]].

depends_on:: [[pages/concepts/release-gitops]]
updates:: [[pages/sources/2026-05-12-major-release-prep-screenshot-skill]]
