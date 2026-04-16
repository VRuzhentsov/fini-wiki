# Wiki Index

Content catalog. See `AGENTS.md` for conventions. Updated on every ingest.

## Overview
- [[pages/concepts/mvp-baseline]] — locked 2026-03-21 product scope for MVP and MVP.1; foundational but partly superseded (1 source)

## Entities
- [[pages/entities/mcp-typescript-sdk]] — official TypeScript MCP implementation; relevant here via the older `@modelcontextprotocol/sdk` v1 package line (1 source)
- [[pages/entities/mcp-server-tauri]] — MCP server plus Rust bridge plugin for Tauri-native AI automation and debugging (1 source)
- [[pages/entities/tauri]] — Rust-backed cross-platform app framework using the OS WebView; 2.0 adds native mobile (1 source)
- [[pages/entities/rust]] — systems language; the reason Tauri can be lightweight and fast (1 source)
- [[pages/entities/electron]] — Chromium+Node.js desktop framework; stub, referenced as Tauri's comparison target (1 source)
- [[pages/entities/awesome-tauri]] — officially-maintained curated list of Tauri projects and plugins (1 source)
- [[pages/entities/tauri-core-contributors]] — people credited as driving Tauri 1.0 → 2.0 per the release announcement (1 source)

## Concepts
- [[pages/concepts/diesel-orm]] — Diesel is the load-bearing ORM/migration layer for Fini's Rust + SQLite backend (1 source)
- [[pages/concepts/tauri-ipc]] — Rust↔WebView command/event bus; rewritten in 2.0 with raw payloads/requests (1 source)
- [[pages/concepts/tauri-permission-system]] — permissions/scopes/abilities model replacing 1.x allowlist (1 source)
- [[pages/concepts/tauri-plugin-system]] — restructured in 2.0; core features moved to official plugins, Swift/Kotlin exposed via annotations (1 source)
- [[pages/concepts/tauri-mobile-support]] — native iOS/Android as the 2.0 headline feature (1 source)
- [[pages/concepts/tauri-hmr]] — hot module replacement; 2.0 extends coverage to mobile devices and emulators (1 source)
- [[pages/concepts/create-tauri-app]] — official scaffolder for bootstrapping new Tauri 2.0 projects (1 source)
- [[pages/concepts/tauri-1-to-2-migration]] — upgrade path from Tauri 1.x to 2.0; `tauri migrate` CLI (1 source)
- [[pages/concepts/tauri-distribution]] — official guidance for five distribution channels in 2.0 (1 source)
- [[pages/concepts/capability-based-security]] — general pattern that Tauri's permission model resembles (1 source, inferred)
- [[pages/concepts/webview-desktop-apps]] — bundled-engine vs platform-WebView trade-offs in desktop web apps (1 source)
- [[pages/concepts/focus]] — current replacement for `Main`; computed from quest state plus focus-history events (2 sources)
- [[pages/concepts/DeviceConnection]] — pairing, discovery, and presence control-plane for multi-device Fini (2 sources)
- [[pages/concepts/SpaceSync]] — mapped-space replication data-plane with replay, tombstones, and fan-out (2 sources)
- [[pages/concepts/FocusHistory]] — owner-scoped event log that stores Focus metadata outside quest rows (1 source)
- [[pages/concepts/mcp-contract]] — MCP evolution from string-id migration to structured JSON outputs (3 sources)
- [[pages/concepts/release-gitops]] — signed-tag GitHub Actions release pipeline with keyless cosign and GHCR publishing (2 sources)
- [[pages/concepts/github-actions-pipelines]] — current workflow graph with reusable security scan and Linux/Windows/Android release fan-out (2 sources)
- [[pages/concepts/e2e-testing]] — staged test strategy with MCP contract lane first, browser smoke second, native smoke third (1 source)

## Sources
- [[pages/sources/2026-04-12-fini-current-data-layer]] — direct inspection of current Rust backend storage stack: Diesel, schema, models, services, and migration tests
- [[pages/sources/2026-04-12-fini-current-github-actions]] — direct inspection of current `../fini/.github/workflows/` rules, platform jobs, and publish stages
- [[pages/sources/2026-04-12-tauri-github-readme]] — GitHub README snapshot for Tauri itself, with concrete notes on `tao`, `wry`, platforms, and host architecture
- [[pages/sources/2026-04-12-modelcontextprotocol-typescript-sdk-v1x]] — GitHub README snapshot for the v1 MCP TypeScript SDK package line used by `mcp-server-tauri`
- [[pages/sources/2026-04-12-mcp-server-tauri-github]] — GitHub repo + README snapshot for a Tauri v2 MCP server and bridge plugin focused on AI automation
- [[pages/sources/2024-10-14-tauri-2-released]] — Medium promo piece on Tauri 2.0 stable: mobile support, new IPC/permissions/plugins, distribution, migration
- [[pages/sources/2026-03-21-mvp-baseline]] — locked product baseline for MVP and MVP.1, before Focus rename and sync split
- [[pages/sources/2026-03-22-mcp-id-migration-notes]] — MCP breaking-change note: integer ids migrate to stable string ids
- [[pages/sources/2026-03-22-mcp-contract-baseline]] — first structured JSON MCP contract for quests and spaces
- [[pages/sources/2026-03-22-e2e-testing-prd]] — low-priority PRD for a hybrid Playwright plus tauri-driver e2e stack
- [[pages/sources/2026-03-23-release-gitops-setup]] — GitHub Actions release flow with signed tags, OIDC cosign, and GHCR artifacts
- [[pages/sources/2026-03-23-sync-devices-design]] — archived snapshot noting that `device_sync` was superseded by newer sync docs
- [[pages/sources/2026-03-28-quest-space-assignment]] — draft UI proposal for exposing quest space assignment and filtering
- [[pages/sources/2026-03-29-device-synchronizations-design]] — implementation-ready lock for `device_connection`, `space_sync`, and `Focus`

## Comparisons & Analyses
- [[pages/concepts/device-sync-architecture]] — supersession chain from MVP.1 sync intent to archived `device_sync` to current split architecture (3 sources)
- [[pages/concepts/focus-view-daisyui-redesign]] — approved `Focus` redesign plus live Figma execution state for the phone-only dark cockpit pass (3 sources)
