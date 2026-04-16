---
title: Space
type: concept
created: 2026-04-12
updated: 2026-04-12
sources: [2026-03-21-mvp-baseline, 2026-03-29-device-synchronizations-design, 2026-03-22-mcp-id-migration-notes, 2026-04-12-fini-current-data-layer]
tags: [fini, spaces, sync, ids, diesel]
---

# Space

Named context that quests belong to. Spaces are shareable units for LAN sync selection [[sources/2026-03-21-mvp-baseline]] [[sources/2026-03-29-device-synchronizations-design]]. In the current backend, their identity and delete semantics are enforced through the Diesel + SQLite layer [[sources/2026-04-12-fini-current-data-layer]].

## Fields

Space identity is string-based across both product and MCP layers [[sources/2026-03-21-mvp-baseline]] [[sources/2026-03-22-mcp-id-migration-notes]].

| Field | Type | Description |
|---|---|---|
| `id` | string | Reserved built-in id (`"1"`, `"2"`, `"3"`) or UUID for custom spaces |
| `name` | string | Display name (renamable, including built-ins) |
| `item_order` | integer | Sort position |
| `created_at` | datetime | |

## Built-in spaces

Built-in spaces use reserved ids rather than generated UUIDs [[sources/2026-03-21-mvp-baseline]] [[sources/2026-03-22-mcp-id-migration-notes]].

| Id | Default name | Deletable | Renamable |
|---|---|---|---|
| `"1"` | Personal | No | Yes |
| `"2"` | Family | No | Yes |
| `"3"` | Work | No | Yes |

## Rules

These rules combine original product decisions with the later sync mapping model [[sources/2026-03-21-mvp-baseline]] [[sources/2026-03-29-device-synchronizations-design]].

The implemented backend ties these rules to the storage layer: Diesel schema/migrations and tests verify the string-id model and delete-to-Personal reassignment behavior [[sources/2026-04-12-fini-current-data-layer]].

| Rule | Detail |
|---|---|
| Default assignment | New quests default to space `"1"` unless user picks another space |
| Unassigned quests | Not allowed; quest `space_id` is never null |
| Deleted custom space | Quests in deleted custom space are reassigned to built-in Personal (`space_id = "1"`) |
| Built-in rename sync | Built-in space renames replicate across paired devices |
| Mapping contract | Sync mapping is pair-level and symmetric (both peers share one mapping state) |
| Missing mapped space | Peer auto-creates mapped space with same `space_id` |
| Focus owner-cluster | Mapping `Personal` (`"1"`) between peers enables owner-scoped [[FocusHistory]] replication |
