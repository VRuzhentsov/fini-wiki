# PR 41 Feature Plane MCP Release Handoff

Date: 2026-05-29
Status: implementation result
Related: Fini PR #41, branch `fix/6-runner-owned-e2e`, commit `cd5b3f4`, prior pushed commit `7314707`

## Context

The user merged PR #41 after local and GitHub verification. This capture preserves what shipped and the release constraint for the next operational release.

## Summary

PR #41 finalized the runner-owned E2E and feature-plane cleanup. The final correction removed the abandoned product MCP surface, kept devtools as a separate development/testing control plane, and made the CLI call repository/core services directly instead of routing through the removed MCP server wrapper.

The user explicitly requested the follow-up release be made only from the latest state of the `main` branch using the `fini-release` skill workflow.

## Decisions

- Product/exposed MCP is abandoned; CLI is the supported automation surface.
- Devtools MCP/dev-build control is distinct from product MCP and remains a development/testing concern only.
- Desktop app builds should enable `ui-plane`; CLI builds should enable `cli-plane`; local dev app enables `ui-plane,devtools`.
- Docker E2E remains headless CI; Docker must not set `FINI_E2E_HEADFUL=1`.
- Release must be started from a clean local `main` that is fast-forwarded to the latest `origin/main`, and the release tag must point at the exact release metadata commit on `main`.

## Plan

- Switch to `main` only after the local worktree is clean.
- Fetch and fast-forward from `origin/main`.
- Verify local `HEAD` matches `origin/main` before release metadata changes.
- Use `make release VERSION=x.y.z`; do not manually bypass its pre-release gate, version metadata commit, signed annotated tag, or push sequencing.
- After tag push, verify tag signature, remote tag presence, and release workflow start.

## Evidence

- PR #41 final correction commit: `cd5b3f4 fix(tauri): remove abandoned MCP surface`.
- Final local pre-release gate before pushing PR correction: `make pre-release-check` passed; log path reported by the command: `/var/tmp/fini-pre-release/pre-release-check-20260529T031813Z.log`.
- Local pre-release gate included containerized E2E: `32 passed (1.8m)`.
- GitHub PR checks after push all passed: Android Emulator E2E, BE Compile, BE Unit Tests, E2E Tests, FE Unit Tests, Snyk Vulnerability Scan, and external `security/snyk`.
- Final worktree after PR push was clean.
- User then stated the PR was merged and requested this wiki capture plus a release from the latest `main` state.

## Open Questions

- None for the release flow; the release version should be determined from the current repository version/tag sequence unless the user supplies a specific version.
