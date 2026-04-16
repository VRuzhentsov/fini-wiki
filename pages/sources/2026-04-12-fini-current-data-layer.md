---
title: Fini Current Data Layer
type: source
created: 2026-04-12
updated: 2026-04-12
sources: [2026-04-12-fini-current-data-layer]
tags: [fini, diesel, orm, sqlite, rust, tauri]
---

# Fini Current Data Layer

Direct inspection of the current Fini app repo's Rust backend files: `../fini/src-tauri/Cargo.toml`, `../fini/src-tauri/src/schema.rs`, `../fini/src-tauri/src/models/quest.rs`, `../fini/src-tauri/src/services/quest.rs`, `../fini/src-tauri/src/services/space.rs`, and `../fini/src-tauri/src/services/db.rs` [[sources/2026-04-12-fini-current-data-layer]].

This source captures the implemented storage stack as it exists now. The important architectural point is not just that Fini uses SQLite, but that Diesel is the Rust-side ORM/query layer that carries schema shape, model types, migrations, defaults, and a meaningful amount of business behavior.

## Key claims

- The Rust backend depends on `diesel`, `diesel_migrations`, and bundled SQLite support in `src-tauri/Cargo.toml`, which makes Diesel the active ORM/migration stack rather than an incidental helper crate [[sources/2026-04-12-fini-current-data-layer]].
- The generated Diesel schema defines `spaces.id`, `quests.id`, and `quests.space_id` as `Text`, matching the repo's string-id model [[sources/2026-04-12-fini-current-data-layer]].
- `CreateQuestInput` defaults `space_id` to `"1"` in the Rust model layer, so the Diesel-facing insert contract already encodes the Personal-space default [[sources/2026-04-12-fini-current-data-layer]].
- Quest and space Tauri commands operate directly on Diesel insert/update/delete flows, so persistence behavior is implemented in the command/service layer rather than hidden behind a separate repository abstraction [[sources/2026-04-12-fini-current-data-layer]].
- The migration/test layer verifies that legacy integer ids migrate to text ids, that `quest.space_id` stays non-null, and that deleting a custom space reassigns member quests to Personal (`"1"`) [[sources/2026-04-12-fini-current-data-layer]].

## Why this matters

- Diesel is load-bearing for current Fini architecture: schema evolution, id migration, and referential invariants all live in the same Rust/SQLite stack.
- Higher layers such as Tauri commands and the MCP surface inherit their id and record shapes from this Diesel-backed model layer.

## Open questions

- Should the wiki also capture why Diesel was chosen over alternatives such as `sqlx` or SeaORM, or is the current evidence only strong enough to document what is implemented now?
- How much of the backend's domain logic should continue to live adjacent to Diesel operations versus being split into thinner persistence and policy layers later?

## Related pages

- [[diesel-orm]]
- [[Quest]]
- [[Space]]
- [[mcp-contract]]
