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
- [[pages/concepts/focus]] — computed Focus includes virtual reminder-due timestamps plus shipped `focus_enter_count` attention signal (6 sources)
- [[pages/concepts/context-menu]] — polished accordion/drag menu with newer cursor-anchored wide placement replacing zone placement (5 sources)
- [[pages/concepts/DeviceConnection]] — pairing/discovery control plane plus planned Bluetooth fallback transport for issue #25 (10 sources)
- [[pages/concepts/SpaceSync]] — one-space consent lifecycle; sync protocol should stay transport-agnostic for Bluetooth fallback (9 sources)
- [[pages/concepts/FocusHistory]] — owner-scoped event log; reminder-triggered rows are backdated by the main-process reconciler (4 sources)
- [[pages/concepts/mcp-contract]] — historical product MCP contract; superseded by CLI as supported automation surface (6 sources)
- [[pages/concepts/release-gitops]] — signed-tag GitHub Actions release pipeline with keyless cosign and GHCR publishing (2 sources)
- [[pages/concepts/github-actions-pipelines]] — PR/release pipelines plus runner-owned E2E and v0.1.30 release result (6 sources)
- [[pages/concepts/e2e-testing]] — runner-owned multi-actor E2E plus SpaceSync/occurrence/Bluetooth proof requirements (14 sources)
- [[pages/concepts/os-notification]] — platform reminder surface; Linux KDE popup, action, and sound behavior now verified (5 sources)
- [[pages/concepts/Reminder]] — derived local reminder row; Linux Snooze implementation now creates a new reminder row (8 sources)
- [[pages/concepts/Quest]] — core actionable record; now includes `focus_enter_count` attention-history signal (5 sources)
- [[pages/concepts/QuestSeries]] — repeating template record; active-list grouping stays unchanged while History-only grouping is ticketed (3 sources)
- [[pages/concepts/QuestOccurrence]] — generated actionable occurrence; History grouping now uses QuestList group rows with mixed status (6 sources)
- [[pages/concepts/CLI]] — supported user-facing automation surface after product MCP removal; CLI-only `fini` binary (7 sources)
- [[pages/concepts/settings-ui]] — Settings rows plus backup/search overview contracts, shared mapping dialog, and Memory toggle (5 sources)
- [[pages/concepts/release-prep-screenshots]] — Play Store screenshot package validation skill, canonical asset matrix, and #22 follow-up (2 sources)
- [[pages/concepts/history-grouping]] — History-only grouping contract for resolved same-series occurrences, including corrective implementation status (4 sources)
- [[pages/concepts/backup-import-export]] — portable zip backup format; PR #36 bumps version for `focus_enter_count` (3 sources)
- [[pages/concepts/repo-wiki-doc-policy]] — boundary: implementation contracts in `../fini/specs`, rationale/history in `fini-wiki` (1 source)
- [[pages/concepts/memory]] — optional reflective Memory page/tab for graph/search over resolved quest history (2 sources)
- [[pages/concepts/quest-memory-search]] — qmd/Markdown/SQLite FTS research thread for local quest memory search (2 sources)

## E2E Specs
- [[pages/e2e/README]] — QA execution policy: two-device topology, MCP-first interaction, state-first evidence, mandatory cleanup
- [[pages/e2e/device-connection/pairing-happy-path]] — passcode pairing flow with device discovery, success visibility, and unpair cleanup
- [[pages/e2e/space-sync/foo-create-via-dialog]] — one-space receiver-side request for remote custom space `Foo`
- [[pages/e2e/space-sync/foo-bar-cross-map-via-dialog]] — historical batch/cross-map dialog intent; superseded by sequential one-space requests
- [[pages/e2e/space-sync/quest-sync-between-spaces]] — quest sync across mapping end/re-enable lifecycle with UUID merge
- [[pages/e2e/cli/README]] — CLI-first E2E contract, preflight, evidence, and cleanup expectations
- [[pages/e2e/interface/README]] — CLI/MCP parity expectations for one shared action service
- [[pages/e2e/skill/README]] — natural-language action translation contract with deterministic side effects

## Tooling
- [[pages/tooling/github-actions]] — PR required checks plus release workflow reference, tag policy, secrets, and procedure (2 sources)
- `tools/wiki-check`, `tools/wiki-search`, `tools/wiki-edges` — dependency-free JS read-only wiki inspection helpers
- `.agents/skills/wiki-maintainer/SKILL.md` — repo-local skill entrypoint for wiki query, ingest, lint, crystallize, search, and edge traversal

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
- [[pages/sources/2026-04-21-notifications-grilling]] — grilling locks OS notifications across Android/Linux/Windows/macOS; snooze is notification-level; focus_history reconciliation with backdated created_at
- [[pages/sources/2026-04-24-reminder-due-bridge-grilling]] — locks quest due/date bridge to local reminders; supersedes grace window and series-template reminder design
- [[pages/sources/2026-04-25-claude-design-spicy-sunrise-chat]] — Claude Design transcript for the spicy sunrise Fini UI/design-system handoff
- [[pages/sources/2026-04-26-two-plus-actor-e2e-architecture]] — locks Playwright runner plus two-plus actor container architecture for multi-device E2E
- [[pages/sources/2026-04-26-headed-local-e2e-main-use-case]] — locks `npm run test:e2e` as headed local two-window proof and `test:e2e:ci` as headless/containerized
- [[pages/sources/2026-04-26-mdns-sd-device-discovery-architecture]] — replaces custom UDP discovery/pairing with mDNS/DNS-SD discovery and WebSocket pairing/sync
- [[pages/sources/2026-04-26-reusable-synced-devices-e2e-precondition]] — defines `ensureSyncedActors(...)` as reusable precondition for paired, sync-ready 2+ actors
- [[pages/sources/2026-04-27-split-e2e-ci-workflow-steps]] — splits opaque E2E CI into named Makefile-backed phases for debuggability
- [[pages/sources/2026-04-27-ci-quality-gates-cache-split]] — locks PR CI checks and splits backend compile/test gates for Docker/GHCR cache reuse
- [[pages/sources/2026-04-27-repo-wiki-doc-split]] — locks the boundary between main-repo specs and wiki rationale/history docs
- [[pages/sources/2026-05-02-device-settings-last-synced-date-time]] — Settings device detail now shows mapped-space last synced as locale date+time
- [[pages/sources/2026-05-03-settings-list-device-identity-grilling]] — locks Settings row primitives and separates device labels from UUID identity
- [[pages/sources/2026-05-04-space-sync-consent-and-lifecycle]] — locks one-space receiver-side SpaceSync consent and end/re-enable lifecycle semantics
- [[pages/sources/2026-05-04-space-sync-implementation-and-e2e-results]] — records implementation details and `make e2e-headed` passing 7 actor tests
- [[pages/sources/2026-05-04-history-grouped-occurrence-ticket]] — tracks History-only grouping of same-series resolved occurrences via GitHub issue `#20`
- [[pages/sources/2026-05-04-occurrence-completion-sync-e2e-ticket]] — tracks same-occurrence completion sync E2E via GitHub issue `#19`
- [[pages/sources/2026-05-04-android-notification-debug-build]] — captures current Android reminder pipeline and missing Android 13+ permission bridge
- [[pages/sources/2026-05-04-computed-focus-reminder-preemption]] — locks `Computed Due Wins` for open-app reminder-driven Focus preemption
- [[pages/sources/2026-05-04-complete-button-single-click]] — drops hold-to-complete in the active Focus panel
- [[pages/sources/2026-05-05-context-menu-responsive-side-sheet-grilling]] — redesigns context menus as responsive side-sheet surfaces
- [[pages/sources/2026-05-10-context-menu-redesign-implementation-results]] — records local #21 implementation, validation gate, shared menu primitives, and skill-layout changes
- [[pages/sources/2026-05-12-context-menu-component-design-handoff]] — design brief for context-menu polish: rich rows, inline accordions, scrim, drag sheet, and motion
- [[pages/sources/2026-05-12-github-issue-22-release-prep-skill]] — creates issue #22 for validating and continuing Play Market screenshot prep skill work
- [[pages/sources/2026-05-12-major-release-prep-screenshot-skill]] — scopes repo-local Play Store screenshot package workflow and validates 9 canonical screenshots
- [[pages/sources/2026-05-14-context-menu-polish-pass-implementation]] — implements PR #23 context-menu row polish, accordion submenus, drag sheet, and motion
- [[pages/sources/2026-05-14-context-menu-cursor-anchored-placement]] — supersedes zone/corner placement with cursor/trigger anchoring for wide context menus
- [[pages/sources/2026-05-14-history-grouping-implementation-results]] — records first issue #20 History grouping implementation, later superseded by corrective review
- [[pages/sources/2026-05-15-history-grouping-discussion]] — locks corrective History grouping decisions: QuestList reuse, no count badge, mixed pill, delete-series semantics
- [[pages/sources/2026-05-16-history-grouping-corrective-revision-results]] — records corrective History grouping implementation and remaining E2E gap
- [[pages/sources/2026-05-16-bluetooth-transport-ticket-grilling]] — locks Bluetooth as explicit Android+Linux fallback transport without changing Fini trust semantics
- [[pages/sources/2026-05-16-bluetooth-transport-github-issue]] — records GitHub issue #25 tracker handoff for Bluetooth transport
- [[pages/sources/2026-05-17-os-notifications-linux-debug-and-fixes]] — records Linux KDE popup fixes: desktop-entry hint, dev desktop file, and fire_immediate guard removal
- [[pages/sources/2026-05-17-os-notifications-linux-sound-and-action-verification]] — verifies Linux Complete/Snooze actions and direct paplay sound workaround
- [[pages/sources/2026-05-19-issue-28-backup-import-export]] — locks issue #28 portable backup format, Settings/CLI flow, mapping, and conflict contract
- [[pages/sources/2026-05-20-issue-28-backup-design-implementation]] — records refined backup frontend implementation, tests, and remaining visual/device validation
- [[pages/sources/2026-05-21-search-in-settings-ticket]] — scopes first Settings search to client-side in-place filtering of visible overview rows
- [[pages/sources/2026-05-22-focus-entry-count-priority-signal]] — ticket/design brief for discrete Focus-entry count as warm attention signal
- [[pages/sources/2026-05-23-memory-graph-page-ticket]] — splits Memory graph UI into separate optional reflective product surface
- [[pages/sources/2026-05-23-qmd-markdown-quest-memory-research-ticket]] — researches qmd, Markdown projections, SQLite FTS, and vector search for quest memory
- [[pages/sources/2026-05-23-memory-qmd-feature-flag-addendum]] — makes qmd primary research candidate and Memory disableable from Settings
- [[pages/sources/2026-05-27-fini-exposed-mcp-cleanup-ticket]] — cleanup ticket for removing exposed product MCP while preserving devtools/runtime control
- [[pages/sources/2026-05-27-runner-owned-multi-actor-e2e-plan]] — plan superseding prestarted actor containers with runner-owned `fini-app` actors
- [[pages/sources/2026-05-28-cli-pairing-follow-up]] — follow-up ticket for live device pairing from CLI
- [[pages/sources/2026-05-28-feature-plane-devtools-boundary]] — locks shared core vs UI-plane adapters vs devtools test-control boundary
- [[pages/sources/2026-05-28-mcp-surface-decision]] — abandons product MCP, keeps devtools control separate, and makes CLI supported automation
- [[pages/sources/2026-05-28-runner-owned-e2e-implementation-result]] — records runner-owned E2E implementation and local pre-release evidence
- [[pages/sources/2026-05-29-pr-41-feature-plane-mcp-release-handoff]] — PR #41 merge handoff for feature-plane, MCP removal, and release constraint
- [[pages/sources/2026-05-29-v0-1-30-release-result]] — records successful v0.1.30 release from latest main
- [[pages/sources/2026-06-03-pr-36-focus-enter-count-product-and-design-result]] — records shipped `focus_enter_count` behavior from PR #36

## Comparisons & Analyses
- [[pages/concepts/device-sync-architecture]] — supersession chain from MVP.1 sync intent to archived `device_sync` to current split architecture (3 sources)
- [[pages/concepts/focus-view-daisyui-redesign]] — approved `Focus` redesign plus live Figma execution state for the phone-only dark cockpit pass (3 sources)
