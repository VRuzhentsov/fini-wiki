# GitHub Issue 22: Release Prep Skill

Date: 2026-05-12

## Context

The user asked to create a ticket for continuing the Fini release-prep skill work later, with validation included as part of ticket implementation. This raw wiki note is the local durable copy.

## Summary

GitHub issue created: `VRuzhentsov/fini#22` — Release prep skill: Play Market screenshots.

## Decisions

- The skill description should not say "unvalidated".
- The ticket should state the workflow is currently unvalidated.
- The first implementation step is complete: the repo-local skill and automation harness exist.
- End-to-end testing is deferred until later.

## Evidence

- GitHub issue: https://github.com/VRuzhentsov/fini/issues/22
- Issue title: `Release prep skill: Play Market screenshots`
- Current harness files:
  - `.agents/skills/fini-release-prep/SKILL.md`
  - `.agents/skills/fini-dev/SKILL.md`
  - `Makefile`
  - `xtask/src/main.rs`
  - `docs/play-store/screenshots/manifest.json`

## Open Questions

- None for the current ticket handoff.
