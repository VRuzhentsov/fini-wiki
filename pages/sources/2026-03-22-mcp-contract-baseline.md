---
title: MCP Contract Baseline Notes (Issue #3)
type: source
created: 2026-04-12
updated: 2026-04-12
sources: [2026-03-22-mcp-contract-baseline]
tags: [fini, mcp, contract, json, quests, spaces]
---

# MCP Contract Baseline Notes (Issue #3)

This note locks the first structured MCP contract for quests and spaces. Its main contribution is the move to machine-readable JSON in `structured_content`, plus occurrence-derived quest fields for MVP repeating semantics. The document is still foundational, but its `Main` naming is already marked as outdated and later docs point toward `Focus` and `get_active_focus` instead [[sources/2026-03-22-e2e-testing-prd]].

## Key claims

- MCP tools return structured JSON instead of human-formatted text.
- `QuestRecord` includes `series_id`, `occurrence_id`, and `period_key` derived from `repeat_rule`.
- `SpaceRecord` uses string ids, matching the product's built-in-space model.
- `get_active_quest` mirrors the app's event-driven Main resolver.
- Clients are expected to treat ids as opaque strings and consume `structured_content` directly.

## Open questions

- When the `get_active_focus` rename lands, which additional tool names or schemas change with it?

## Related pages

- [[mcp-contract]]
- [[focus]]
- [[Quest]]
- [[Space]]
