# Hot Cache

Updated: 2026-04-12

## Current Fini Architecture

- Fini desktop/mobile app uses Vue 3 in `src/` and a Rust + Tauri backend in `src-tauri/`.
- The Rust backend uses Diesel as the ORM over SQLite; this is visible in `src-tauri/Cargo.toml`, `src-tauri/src/schema.rs`, and the service-layer command handlers.
- Diesel is load-bearing for migrations, id semantics, defaults, and referential behavior: quest ids are UUID-like text, space ids are string ids, and quests default to Personal space `"1"`.
- Tauri commands and the MCP layer expose Diesel-backed Rust model shapes directly enough that storage decisions affect API contracts.

## Active Wiki Threads

- [[diesel-orm]] — architecture role of Diesel in Fini's current backend.
- [[Quest]] — string ids, default `space_id`, and Diesel-backed persistence semantics.
- [[Space]] — built-in string space ids and delete-to-Personal reassignment.
- [[mcp-contract]] — public contract depends on the same string-id storage model.
