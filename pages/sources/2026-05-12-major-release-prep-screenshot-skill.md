---
title: 2026-05-12 Major Release Prep Screenshot Skill
type: source
created: 2026-05-13
updated: 2026-05-13
sources: [2026-05-12-major-release-prep-screenshot-skill]
tags: [fini, release-prep, screenshots, play-store, skill]
claim_status: locked
evidence: source-backed
---

# 2026-05-12 Major Release Prep Screenshot Skill

The first major-release prep workflow is scoped to validating and maintaining a Google Play screenshot package for Fini. It is intentionally a screenshot/package workflow, not a complete one-click release pipeline, and currently validates canonical assets rather than generating fresh runtime captures [[sources/2026-05-12-major-release-prep-screenshot-skill]].

## Key claims

- Primary output is a Google Play screenshot package stored canonically under `docs/play-store/screenshots/` [[sources/2026-05-12-major-release-prep-screenshot-skill]].
- Screenshot source should be the regular Fini app runtime scaled to mobile/tablet proportions, not a mandatory Android emulator/device flow [[sources/2026-05-12-major-release-prep-screenshot-skill]].
- First scope is Play Store core with core product-flow screens, light and dark themes, and English captions [[sources/2026-05-12-major-release-prep-screenshot-skill]].
- Demo state must use curated demo data rather than private local user data [[sources/2026-05-12-major-release-prep-screenshot-skill]].
- The skill should live at `.agents/skills/fini-release-prep/`, route from `fini-dev`, expose `make play-store-screenshots`, and back it with `cargo xtask play-store-screenshots` [[sources/2026-05-12-major-release-prep-screenshot-skill]].
- Existing canonical PNG dimensions were verified as phone `780x1387`, tablet-7 `1200x1920`, and tablet-10 `1600x2560` [[sources/2026-05-12-major-release-prep-screenshot-skill]].
- `cargo check --manifest-path xtask/Cargo.toml` and `make play-store-screenshots` ran successfully; the Make target validated 9 screenshots and wrote `docs/play-store/screenshots/manifest.json` [[sources/2026-05-12-major-release-prep-screenshot-skill]].

## Open questions

- Future work should implement full runtime capture/composition automation for fresh light/dark store-ready artwork [[sources/2026-05-12-major-release-prep-screenshot-skill]].
- Future work should add alternate Android markets after Play Store core is stable [[sources/2026-05-12-major-release-prep-screenshot-skill]].

## Related pages

- [[release-prep-screenshots]]

updates:: [[pages/sources/2026-05-12-github-issue-22-release-prep-skill]]
