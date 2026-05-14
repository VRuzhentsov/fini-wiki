# Major Release Prep Screenshot Skill

Date: 2026-05-12

## Context

User wanted a repo-local skill for major release prep, starting with all practical Android Play Store screenshot variants and other marketplace assets later.

## Summary

The first release-prep workflow is scoped to a Google Play screenshot package for Fini. It uses the normal Fini app/runtime scaled to mobile/tablet proportions, curated demo data, core product-flow screens, stable captions, and canonical storage under `docs/play-store/screenshots/`.

## Decisions

- Primary output is a screenshot package, not a full one-click release pipeline.
- Screenshot source should be the regular Fini app runtime scaled to mobile-like viewports, not a mandatory Android emulator/device path.
- First market matrix is Play Store core.
- Mandatory screen set is the core product flow.
- Artwork should be store-ready with captions/frames when composition tooling exists, not raw screenshots only.
- Captions/value props should come from a stable skill template.
- First variant scope includes light and dark themes, English captions.
- Output should overwrite/update the canonical docs folder, not create timestamped review sets by default.
- Skill should be repo-local at `.agents/skills/fini-release-prep/`.
- The workflow should also expose a human-facing Makefile command.
- Screenshot/demo state must use curated demo data, not current local private data.

## Plan

- Add `.agents/skills/fini-release-prep/SKILL.md` with triggers, canonical paths, screenshot matrix, workflow, and reporting rules.
- Route major-release screenshot prep from `.agents/skills/fini-dev/SKILL.md` to `fini-release-prep`.
- Add `make play-store-screenshots` as the human entrypoint.
- Back the Make target with `cargo xtask play-store-screenshots`.
- Validate existing canonical PNG dimensions and write `docs/play-store/screenshots/manifest.json`.

## Evidence

- Existing canonical assets found under `docs/play-store/screenshots/phone/`, `tablet-7/`, and `tablet-10/`.
- Existing listing copy found at `docs/play-store/listing.md`.
- Current screenshot dimensions verified:
  - phone: `780x1387`
  - tablet-7: `1200x1920`
  - tablet-10: `1600x2560`
- Verification commands run:
  - `cargo check --manifest-path xtask/Cargo.toml`
  - `make play-store-screenshots`
- `make play-store-screenshots` validated 9 Play Store screenshots and wrote `docs/play-store/screenshots/manifest.json`.

## Open Questions

- Future work: implement full runtime capture/composition automation for fresh light/dark store-ready artwork, rather than only validating current canonical PNGs.
- Future work: add alternate Android markets beyond Google Play after Play Store core is stable.
