---
title: Diesel ORM
type: concept
created: 2026-04-12
updated: 2026-04-12
sources: [2026-04-12-fini-current-data-layer]
tags: [fini, diesel, orm, sqlite, backend, rust]
---

# Diesel ORM

Diesel is the current ORM and migration backbone of Fini's Rust backend. In this project it is not just a query builder: it defines schema shape, model typing, migration execution, insert/update/delete flows, and several storage-level invariants that other layers depend on [[sources/2026-04-12-fini-current-data-layer]].

## Architectural role in Fini

- Diesel sits between the Tauri command layer and SQLite persistence [[sources/2026-04-12-fini-current-data-layer]].
- The generated schema in `src-tauri/src/schema.rs` is the canonical typed view of persisted tables used by Rust services [[sources/2026-04-12-fini-current-data-layer]].
- Rust model structs such as `Quest` and `CreateQuestInput` are Diesel query/insert types, so storage representation and backend API shape stay tightly coupled [[sources/2026-04-12-fini-current-data-layer]].

## What Diesel is load-bearing for

- **Identity model.** Quest ids and space ids are text-based in the Diesel schema, matching Fini's string-id migration path [[sources/2026-04-12-fini-current-data-layer]].
- **Defaults and invariants.** New quests default to Personal space `"1"`, and `quest.space_id` is treated as non-null at the schema/model level [[sources/2026-04-12-fini-current-data-layer]].
- **Migration execution.** `diesel_migrations` runs the app's embedded migration set on open, which means id transitions and schema repairs are part of startup behavior [[sources/2026-04-12-fini-current-data-layer]].
- **Referential behavior.** Space deletion and migration tests rely on database-level rules verified through Diesel-backed tests, not only frontend assumptions [[sources/2026-04-12-fini-current-data-layer]].

## Why it matters upstream

Because the Tauri command layer operates directly on Diesel-backed models and queries, Diesel's choices leak upward in a good way: the MCP/API surface inherits stable string ids, quest/space field names, and storage defaults from one canonical backend model [[sources/2026-04-12-fini-current-data-layer]].

For Fini, this means Diesel is part of the product architecture, not an implementation detail to ignore. Any redesign of ids, sync payloads, or MCP records should treat the Diesel schema and migration layer as one of the primary constraints [[sources/2026-04-12-fini-current-data-layer]].

## Related pages

- [[Quest]]
- [[Space]]
- [[mcp-contract]]
