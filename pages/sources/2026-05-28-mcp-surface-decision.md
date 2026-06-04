---
title: 2026-05-28 MCP Surface Decision
type: source
created: 2026-06-03
updated: 2026-06-03
sources: [2026-05-28-mcp-surface-decision]
tags: [fini, mcp, cli, devtools, decision]
claim_status: locked
evidence: source-backed
---

# 2026-05-28 MCP Surface Decision

This source locks the distinction between abandoned exposed/product MCP and retained devtools MCP/dev-build control. User-facing automation should use the [[CLI]] [[sources/2026-05-28-mcp-surface-decision]].

## Key claims

- Fini is dropping the user-facing/exposed MCP surface originally planned as a product automation contract [[sources/2026-05-28-mcp-surface-decision]].
- The supported automation surface is the `fini` CLI [[sources/2026-05-28-mcp-surface-decision]].
- Devtools MCP/dev-build control remains a separate development/testing control plane enabled by `devtools` and devtools capabilities [[sources/2026-05-28-mcp-surface-decision]].
- Older issue #6 and E2E PRD references to product MCP stdio contract tests are historical/superseded unless a new decision reintroduces exposed MCP [[sources/2026-05-28-mcp-surface-decision]].

## Open questions

- Which PR should delete remaining abandoned exposed MCP code paths was answered by PR #41 [[sources/2026-05-29-pr-41-feature-plane-mcp-release-handoff]].

## Related pages

- [[CLI]]
- [[mcp-contract]]
- [[e2e-testing]]

updates:: [[pages/concepts/CLI]]
supersedes:: [[pages/concepts/mcp-contract]]
