---
title: 2026-05-27 Fini Exposed MCP Cleanup Ticket
type: source
created: 2026-06-03
updated: 2026-06-03
sources: [2026-05-27-fini-exposed-mcp-cleanup-ticket]
tags: [fini, mcp, cli, cleanup, ticket]
claim_status: superseded
evidence: source-backed
---

# 2026-05-27 Fini Exposed MCP Cleanup Ticket

This source captures the cleanup ticket for removing Fini's exposed/product MCP surface while preserving Tauri/runtime-control tooling. It is followed by the explicit MCP surface decision and PR #41 result [[sources/2026-05-27-fini-exposed-mcp-cleanup-ticket]].

> [!warning] Superseded by [[sources/2026-05-29-pr-41-feature-plane-mcp-release-handoff]] (2026-05-29)
> PR #41 removed the abandoned product MCP surface and made CLI the supported automation path.

## Key claims

- Only Fini's custom exposed MCP surface is in scope for removal; Tauri MCP/runtime-control tooling must stay untouched [[sources/2026-05-27-fini-exposed-mcp-cleanup-ticket]].
- Active docs should point agents toward CLI as the supported automation surface [[sources/2026-05-27-fini-exposed-mcp-cleanup-ticket]].
- Internal shared backend action logic may remain if it helps CLI, but MCP public code paths and active docs should be retired [[sources/2026-05-27-fini-exposed-mcp-cleanup-ticket]].

## Open questions

- Historical cleanup questions are resolved in the PR #41 result for product MCP removal [[sources/2026-05-29-pr-41-feature-plane-mcp-release-handoff]].

## Related pages

- [[CLI]]
- [[mcp-contract]]

updates:: [[pages/concepts/CLI]]
supersedes:: [[pages/concepts/mcp-contract]]
