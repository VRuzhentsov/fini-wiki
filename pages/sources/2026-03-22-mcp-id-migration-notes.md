---
title: MCP ID Migration Notes (Issue #1)
type: source
created: 2026-04-12
updated: 2026-04-12
sources: [2026-03-22-mcp-id-migration-notes]
tags: [fini, mcp, ids, migration, spaces, quests]
---

# MCP ID Migration Notes (Issue #1)

This note explains the breaking identifier migration behind the MCP baseline: quest ids move from integers to UUID strings, and space ids become stable strings so they can survive cross-device replication. It is less about end-user behavior than about client compatibility and migration discipline [[sources/2026-03-22-mcp-contract-baseline]].

## Key claims

- Quest `id` changes from `i64` to UUID string.
- Space `id` changes from integer to string, with reserved built-ins `1`, `2`, and `3`.
- `space_id` becomes non-null and defaults to `1` when omitted on quest creation.
- MCP clients must stop numeric casts and treat ids as opaque strings.
- Existing databases migrate forward automatically.

## Open questions

- none

## Related pages

- [[mcp-contract]]
- [[Space]]
- [[Quest]]
