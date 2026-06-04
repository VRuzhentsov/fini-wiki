---
title: MCP Contract
type: concept
created: 2026-04-12
updated: 2026-06-03
sources: [2026-03-22-mcp-id-migration-notes, 2026-03-22-mcp-contract-baseline, 2026-03-22-e2e-testing-prd, 2026-04-12-fini-current-data-layer, 2026-05-28-mcp-surface-decision, 2026-05-29-pr-41-feature-plane-mcp-release-handoff]
tags: [fini, mcp, contract, json, ids, diesel]
claim_status: superseded
evidence: source-backed
---

# MCP Contract

Fini's MCP surface evolves along two early steps: first the id migration from integers to stable strings, then the structured JSON baseline for quests and spaces [[sources/2026-03-22-mcp-id-migration-notes]] [[sources/2026-03-22-mcp-contract-baseline]].

> [!warning] Superseded by [[sources/2026-05-28-mcp-surface-decision]] (2026-05-28)
> Fini's product/exposed MCP surface is abandoned. The supported user-facing automation surface is now [[CLI]]. Devtools MCP/dev-build control remains separate and is not a product automation API [[sources/2026-05-28-mcp-surface-decision]] [[sources/2026-05-29-pr-41-feature-plane-mcp-release-handoff]].

> [!warning] Superseded by [[sources/2026-03-29-device-synchronizations-design]] (2026-03-29)
> The baseline still uses `get_active_quest` and `Main` terminology. Newer docs expect `Focus` naming and `get_active_focus` instead [[sources/2026-03-22-e2e-testing-prd]].

## Stable contract direction

- Clients consume `structured_content` JSON, not formatted prose [[sources/2026-03-22-mcp-contract-baseline]].
- All public ids should be treated as opaque strings [[sources/2026-03-22-mcp-id-migration-notes]].
- Quest outputs include occurrence-derived fields for MVP repeating behavior [[sources/2026-03-22-mcp-contract-baseline]].
- `space_id` is non-null and defaults to `1` (`Personal`) when omitted on quest creation [[sources/2026-03-22-mcp-id-migration-notes]].
- In the current codebase, these id/default semantics are inherited from the Diesel-backed Rust model layer rather than defined independently in MCP glue code [[sources/2026-04-12-fini-current-data-layer]].

## Testing implications

- Older MCP contract drift concerns are historical and superseded for product automation [[sources/2026-05-28-mcp-surface-decision]].
- Future reviews should not require a product MCP stdio E2E lane unless a new decision reintroduces exposed MCP [[sources/2026-05-28-mcp-surface-decision]].

## Current reading guidance

Use this page for historical contract shape only. Use [[CLI]] for current automation and [[e2e-testing]] for current validation strategy.
