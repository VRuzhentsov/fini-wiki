---
title: 2026-05-29 PR 41 Feature Plane MCP Release Handoff
type: source
created: 2026-06-03
updated: 2026-06-03
sources: [2026-05-29-pr-41-feature-plane-mcp-release-handoff]
tags: [fini, pr-41, cli, mcp, release, e2e]
claim_status: locked
evidence: source-backed
---

# 2026-05-29 PR 41 Feature Plane MCP Release Handoff

This source records PR #41 after merge. It finalized runner-owned E2E, corrected feature-plane boundaries, removed the abandoned product MCP surface, and set the next release constraint [[sources/2026-05-29-pr-41-feature-plane-mcp-release-handoff]].

## Key claims

- Product/exposed MCP is abandoned; CLI is the supported automation surface [[sources/2026-05-29-pr-41-feature-plane-mcp-release-handoff]].
- Devtools MCP/dev-build control remains distinct from product MCP and is development/testing only [[sources/2026-05-29-pr-41-feature-plane-mcp-release-handoff]].
- Desktop app builds should enable `ui-plane`; CLI builds should enable `cli-plane`; local dev app enables `ui-plane,devtools` [[sources/2026-05-29-pr-41-feature-plane-mcp-release-handoff]].
- Docker E2E remains headless CI and must not set `FINI_E2E_HEADFUL=1` [[sources/2026-05-29-pr-41-feature-plane-mcp-release-handoff]].
- Final evidence included local `make pre-release-check` passing with containerized E2E `32 passed`, and all GitHub PR checks passing before merge [[sources/2026-05-29-pr-41-feature-plane-mcp-release-handoff]].

## Open questions

- None for the release flow; version selection was to come from the current repository version/tag sequence unless user supplied one [[sources/2026-05-29-pr-41-feature-plane-mcp-release-handoff]].

## Related pages

- [[CLI]]
- [[mcp-contract]]
- [[e2e-testing]]
- [[release-gitops]]

updates:: [[pages/concepts/CLI]]
updates:: [[pages/concepts/e2e-testing]]
updates:: [[pages/concepts/release-gitops]]
