# Wiki Log

Append-only chronological record. Parseable: `grep "^## \[" log.md | tail -10`.

## [2026-04-12] schema | Initial wiki bootstrap

- Pages touched: `AGENTS.md`, `_index.md`, `log.md`
- Notes: Created wiki structure at `~/projects/wiki/` per LLM Wiki pattern. Dirs: `raw/`, `raw/assets/`, `pages/{entities,concepts,sources}/`. Schema defines ingest/query/lint operations, page conventions, frontmatter, and guardrails.

## [2026-04-12] ingest | Tauri 2.0 released (Sevenall Bin, Medium, 2024-10-14)

- Pages touched: [[pages/sources/2024-10-14-tauri-2-released]], [[pages/entities/tauri]], [[pages/entities/electron]], [[pages/concepts/tauri-ipc]], [[pages/concepts/tauri-permission-system]], [[pages/concepts/tauri-plugin-system]], [[pages/concepts/webview-desktop-apps]], `_index.md`
- Notes: Balanced overview emphasis. First real ingest — all 7 pages created fresh. Source is marketing-flavored; flagged absence of Electron benchmarks and the likely-broken Rust snippet in the IPC section as open questions. Electron page is a stub pending a dedicated source.

## [2026-04-12] ingest | Tauri 2.0 deep pass (thoroughness + Rust-performance emphasis)

- Pages touched: [[pages/entities/rust]] (new), [[pages/entities/awesome-tauri]] (new), [[pages/entities/tauri-core-contributors]] (new), [[pages/concepts/tauri-mobile-support]] (new), [[pages/concepts/create-tauri-app]] (new), [[pages/concepts/tauri-hmr]] (new), [[pages/concepts/tauri-1-to-2-migration]] (new), [[pages/concepts/tauri-distribution]] (new), [[pages/concepts/capability-based-security]] (new), [[pages/entities/tauri]] (expanded with when-to-use, community, contributors, 2.0 feature grid, Rust-performance framing), [[pages/sources/2024-10-14-tauri-2-released]] (expanded to a full claim inventory), [[pages/entities/electron]] (Rust-vs-Node backend contrast), [[pages/concepts/tauri-ipc]] (Rust zero-cost-abstraction framing), [[pages/concepts/tauri-plugin-system]] (mobile plugin details, Rust as default), `_index.md`
- Notes: User flagged this as a major interest area and asked for extreme thoroughness with Rust positioned as the crucial performance enabler. 9 new pages, 5 expansions, all grounded in the single source with inferred/general-knowledge content explicitly flagged. Recurring open questions captured: Electron benchmarks, abilities definition, audit report, mobile case studies, current release status beyond 2.0.

## [2026-04-12] ingest | Fini planning docs baseline pass

- Pages touched: [[pages/sources/2026-03-21-mvp-baseline]], [[pages/sources/2026-03-22-mcp-id-migration-notes]], [[pages/sources/2026-03-22-mcp-contract-baseline]], [[pages/sources/2026-03-22-e2e-testing-prd]], [[pages/sources/2026-03-23-release-gitops-setup]], [[pages/sources/2026-03-23-sync-devices-design]], [[pages/sources/2026-03-28-quest-space-assignment]], [[pages/sources/2026-03-29-device-synchronizations-design]], [[pages/concepts/mvp-baseline]], [[pages/concepts/mcp-contract]], [[pages/concepts/release-gitops]], [[pages/concepts/e2e-testing]], [[pages/concepts/device-sync-architecture]], `_index.md`
- Notes: Ingested the eight previously-missing raw planning docs with emphasis on supersession timelines. Flagged the Main -> Focus rename, the replacement of `device_sync` by `device_connection` plus `space_sync`, and the MCP contract's active-quest naming drift. Quest-space assignment and e2e stack remain draft proposals rather than locked implementation state.

## [2026-04-12] refactor | Normalize older Fini concept pages to wiki schema

- Pages touched: [[pages/concepts/DeviceConnection]], [[pages/concepts/SpaceSync]], [[pages/concepts/FocusHistory]], [[pages/concepts/Quest]], [[pages/concepts/Space]], [[pages/concepts/Reminder]], [[pages/concepts/Network]], `log.md`
- Notes: Added YAML frontmatter and inline source citations to older concept pages that predated the current wiki conventions. Kept page scope intact while aligning them with source-based claims and newer supersession context.

## [2026-04-12] ingest | MCP Server Tauri repo basics

- Pages touched: [[pages/sources/2026-04-12-mcp-server-tauri-github]], [[pages/entities/mcp-server-tauri]], `_index.md`
- Notes: Ingested the GitHub repo + README for `hypothesi/mcp-server-tauri` with emphasis on Tauri-native AI automation. Captured the server-plus-bridge architecture, tool categories, setup model, and monorepo layout; left broader ecosystem comparisons as open questions.

## [2026-04-12] ingest | MCP dependency pass: MCP TypeScript SDK

- Pages touched: [[pages/sources/2026-04-12-modelcontextprotocol-typescript-sdk-v1x]], [[pages/entities/mcp-typescript-sdk]], `_index.md`
- Notes: Documented the official TypeScript MCP SDK as the first core dependency in `mcp-server-tauri`. Used the upstream `v1.x` README rather than `main` because the repo depends on `@modelcontextprotocol/sdk`, while `main` already reflects the in-development v2 split-package direction.

## [2026-04-12] ingest | MCP dependency pass: Tauri framework

- Pages touched: [[pages/sources/2026-04-12-tauri-github-readme]], [[pages/entities/tauri]], `_index.md`
- Notes: Added the upstream Tauri README as a source so the framework page is grounded in Tauri's own architecture docs as well as the earlier 2.0 announcement. Captured the `tao` + `wry` stack because that context matters for understanding how the MCP bridge reaches windows and webviews.

## [2026-04-12] ingest | Current GitHub Actions rules and pipelines

- Pages touched: [[pages/sources/2026-04-12-fini-current-github-actions]], [[pages/concepts/github-actions-pipelines]], [[pages/concepts/release-gitops]], `_index.md`
- Notes: Inspected the live workflow files in `../fini/.github/workflows/` and documented the actual pipeline graph. Emphasis was on topology: reusable Snyk security gate, manual release-prep flow, tag-driven release flow, Linux/Windows/Android platform fan-out, Docker publish, and gated stable/prerelease convergence.

## [2026-04-12] ingest | Fini current data layer (Diesel ORM)

- Pages touched: [[pages/sources/2026-04-12-fini-current-data-layer]], [[pages/concepts/diesel-orm]], [[pages/concepts/Quest]], [[pages/concepts/Space]], [[pages/concepts/mcp-contract]], `_index.md`, `_hot.md`
- Notes: Added a direct repo-inspection source for Fini's current Rust storage stack and documented Diesel as the active ORM/migration layer. Emphasis was architectural: Diesel currently carries schema shape, string-id semantics, defaults, and migration-backed invariants that propagate into Tauri commands and the MCP contract.

## [2026-04-12] query | Focus view DaisyUI redesign

- Pages touched: [[pages/concepts/focus-view-daisyui-redesign]], `_index.md`, `log.md`
- Notes: Wrote an implementation-target design for the first UI refresh pass. Locked scope to the `Focus` view, anchored the visual hierarchy to the derived-focus product model, and constrained implementation to DaisyUI-based presentation changes in the existing frontend components.

## [2026-04-12] refactor | Focus Figma phone pivot status

- Pages touched: [[pages/concepts/focus-view-daisyui-redesign]], `_index.md`, `log.md`
- Notes: Added the live Figma execution checkpoint after the desktop concept was discarded. Captured the phone-only dark-mode scope, the new MCP channel `hey1t6k3`, the completed active-focus card, the unfinished quick-capture and backlog cards, and the switch to the Bun websocket `cursor-talk-to-figma-mcp` path after official starter quota limits.

## [2026-04-12] refactor | Full-app Figma storyboard scope

- Pages touched: [[pages/concepts/focus-view-daisyui-redesign]], `log.md`
- Notes: Expanded the design pass from the single `Focus` cockpit to every current app page. Locked the visual direction to a phone-first dark `cockpit` system, explicitly included legacy `Quests` and `Spaces`, and recorded that the current MCP toolset names new section frames cleanly but does not support renaming already-cloned outer phone frames.

## [2026-04-21] ingest | Notifications grilling locks OS surface across 4 platforms

- Pages touched: [[pages/sources/2026-04-21-notifications-grilling]] (new), [[pages/concepts/os-notification]] (new), [[pages/concepts/Reminder]], [[pages/concepts/FocusHistory]], [[pages/concepts/focus]], [[pages/concepts/SpaceSync]], [[pages/concepts/QuestSeries]], [[pages/concepts/QuestOccurrence]], `_index.md`
- Notes: Locked OS notification behavior across Android/Linux/Windows/macOS in a single ticket. Key supersessions: snooze is notification-level (no new reminder row, no focus_history event, no replication) — overrides Reminder's prior 10m/30m/1h presets and one-off-absolute semantics. Introduced the entity-vs-surface split via new `os-notification` page. Locked FocusHistory reconciliation model: main-process-only writes, backdated `created_at`, no background DB. Flagged `focus_history.device_id` for removal (separate ticket). Open TBDs: Linux delivery mechanism, vibration defaults, notification grouping, past-time reminder creation.

## [2026-04-24] schema | Rename index to underscored control file

- Pages touched: `AGENTS.md`, `_index.md`, `_hot.md`, `.gitignore`, `log.md`
- Notes: Renamed the wiki catalog from `index.md` to `_index.md`, allowed `_hot.md` and `_index.md` through the ignore rules, and updated the schema so agents read `_hot.md` first, `_index.md` second, then targeted `pages/**` files.

## [2026-04-25] ingest | Claude Design spicy sunrise transcript

- Pages touched: [[pages/sources/2026-04-25-claude-design-spicy-sunrise-chat]], `_index.md`, `_hot.md`, `log.md`
- Notes: Preserved the Claude Design handoff transcript as a raw wiki source and captured locked implementation intent for the Vue UI refresh.

## [2026-04-26] ingest | Reminder bridge and two-plus-actor E2E architecture

- Pages touched: [[pages/sources/2026-04-24-reminder-due-bridge-grilling]], [[pages/sources/2026-04-26-two-plus-actor-e2e-architecture]], [[pages/concepts/os-notification]], [[pages/concepts/SpaceSync]], [[pages/concepts/Quest]], [[pages/concepts/QuestSeries]], [[pages/concepts/QuestOccurrence]], [[pages/concepts/FocusHistory]], [[pages/concepts/e2e-testing]], [[pages/sources/2026-04-21-notifications-grilling]], `_index.md`, `_hot.md`, `log.md`
- Notes: Ingested the locked due-date-to-reminder bridge and the new multi-actor E2E architecture. Resolved stale wiki claims by marking the 30-minute reminder grace window and series-level reminder templates as superseded; captured the new local-only reminder derivation model and the Playwright runner plus actor-container testing direction.

## [2026-04-26] refactor | Fold E2E spec docs into testing concept and index

- Pages touched: [[pages/concepts/e2e-testing]], `_index.md`, `_hot.md`, `log.md`
- Notes: Synthesized the existing `pages/e2e/**` scenario docs into the main testing concept. Captured the active QA execution policy: two-device topology, MCP-first interaction, state-first evidence, and mandatory cleanup with baseline restoration.

## [2026-04-26] lint | Catalog gaps and reminder supersession check

- Pages touched: `_index.md`, `_hot.md`, `log.md`
- Notes: Verified the reminder bridge supersession chain and reran orphan detection with path-aware wikilinks. Straightforward catalog fixes: added index entries for `[[pages/concepts/CLI]]` and `[[pages/tooling/github-actions]]`; broader lint findings left for follow-up review.

## [2026-04-27] ingest | Headed local E2E main use case

- Pages touched: [[pages/sources/2026-04-26-headed-local-e2e-main-use-case]], [[pages/concepts/e2e-testing]], [[pages/concepts/DeviceConnection]], `_index.md`, `_hot.md`, `log.md`
- Notes: Ingested the command split: `npm run test:e2e` is the visible local two-window proof, while `npm run test:e2e:ci` remains containerized/headless under Xvfb. Captured actor isolation, stable hostnames, Playwright sockets, and Settings/Add Device selector needs.

## [2026-04-27] ingest | mDNS-SD device discovery architecture

- Pages touched: [[pages/sources/2026-04-26-mdns-sd-device-discovery-architecture]], [[pages/concepts/DeviceConnection]], [[pages/concepts/Network]], [[pages/concepts/SpaceSync]], `_index.md`, `_hot.md`, `log.md`
- Notes: Ingested the discovery migration from custom UDP to DNS-SD over mDNS using `mdns-sd` behind a provider abstraction. Key lock: mDNS is endpoint discovery only; pairing and sync move to WebSocket and still require trusted paired-device state.

## [2026-04-27] ingest | Reusable synced actors E2E precondition

- Pages touched: [[pages/sources/2026-04-26-reusable-synced-devices-e2e-precondition]], [[pages/concepts/e2e-testing]], [[pages/concepts/DeviceConnection]], `_index.md`, `_hot.md`, `log.md`
- Notes: Ingested `ensureSyncedActors(...)` as the reusable Playwright precondition for paired, online, sync-ready 2+ actor tests. Captured hybrid UI-pairing plus backend-readiness strategy and full-mesh initial topology.

## [2026-04-27] ingest | Split E2E CI workflow steps

- Pages touched: [[pages/sources/2026-04-27-split-e2e-ci-workflow-steps]], [[pages/concepts/e2e-testing]], [[pages/concepts/github-actions-pipelines]], `_index.md`, `_hot.md`, `log.md`
- Notes: Ingested the CI debuggability plan: keep aggregate `make pr-gate-e2e`, but expose Makefile-backed GitHub Actions phases for image build, network, actor startup, readiness, Playwright run, logs, and cleanup.

## [2026-04-27] ingest | CI quality gates cache split

- Pages touched: [[pages/sources/2026-04-27-ci-quality-gates-cache-split]], [[pages/concepts/github-actions-pipelines]], [[pages/concepts/e2e-testing]], [[pages/tooling/github-actions]], `_index.md`, `_hot.md`, `log.md`
- Notes: Ingested the PR CI quality-gate update. Captured the single PR-facing `CI` workflow, required branch-protection checks, workflow_call-only Snyk reuse, and Dockerfile/Makefile-backed backend compile/test split with GHCR cache images.

## [2026-05-02] ingest | Device settings last synced date and time

- Pages touched: [[pages/sources/2026-05-02-device-settings-last-synced-date-time]], [[pages/concepts/DeviceConnection]], [[pages/concepts/SpaceSync]], `_index.md`, `_hot.md`, `log.md`
- Notes: Ingested shipped UI-only Settings change from commit `f2e98ab`: mapped-space `last synced:` labels now use locale date+time instead of time-only, with targeted `DeviceView` unit coverage.

## [2026-05-03] ingest | Settings list and device identity grilling

- Pages touched: [[pages/sources/2026-05-03-settings-list-device-identity-grilling]], [[pages/concepts/DeviceConnection]], [[pages/concepts/settings-ui]], `_index.md`, `_hot.md`, `log.md`
- Notes: Ingested Settings row primitive/layout rules and device identity semantics. Captured token-first styling, hidden UUID/hash display in Settings rows, SQLite `settings` local identity, deprecated `device_identity.json` migration/deletion behavior, and pairing-time paired-device labels.

## [2026-05-04] ingest | SpaceSync consent lifecycle and E2E results

- Pages touched: [[pages/sources/2026-05-04-space-sync-consent-and-lifecycle]], [[pages/sources/2026-05-04-space-sync-implementation-and-e2e-results]], [[pages/concepts/SpaceSync]], [[pages/concepts/DeviceConnection]], [[pages/concepts/e2e-testing]], [[pages/e2e/space-sync/foo-create-via-dialog]], [[pages/e2e/space-sync/foo-bar-cross-map-via-dialog]], [[pages/e2e/space-sync/quest-sync-between-spaces]], `_index.md`, `_hot.md`, `log.md`
- Notes: Ingested one-space receiver-side SpaceSync consent, separated device pairing consent from space consent, marked batch mapping snapshot approval as superseded, captured `end_of_sync_at` end/re-enable behavior, and recorded final `make e2e-headed` passing 7 actor tests.

## [2026-05-04] ingest | History occurrence ticket, occurrence sync E2E ticket, and Android notification debug build

- Pages touched: [[pages/sources/2026-05-04-history-grouped-occurrence-ticket]], [[pages/sources/2026-05-04-occurrence-completion-sync-e2e-ticket]], [[pages/sources/2026-05-04-android-notification-debug-build]], [[pages/concepts/QuestOccurrence]], [[pages/concepts/QuestSeries]], [[pages/concepts/e2e-testing]], [[pages/concepts/os-notification]], [[pages/concepts/Reminder]], `_index.md`, `_hot.md`, `log.md`
- Notes: Ingested three new 2026-05-04 raw docs. Captured History-only same-series occurrence grouping scope (issue `#20`), paired-device same-occurrence completion sync E2E follow-up (issue `#19`), and the current Android reminder pipeline gap around just-in-time `POST_NOTIFICATIONS` support in debug builds.

## [2026-05-05] ingest | Focus due-preemption, single-click complete, and responsive context menu

- Pages touched: [[pages/sources/2026-05-04-computed-focus-reminder-preemption]], [[pages/sources/2026-05-04-complete-button-single-click]], [[pages/sources/2026-05-05-context-menu-responsive-side-sheet-grilling]], [[pages/concepts/focus]], [[pages/concepts/FocusHistory]], [[pages/concepts/Reminder]], [[pages/concepts/focus-view-daisyui-redesign]], [[pages/concepts/context-menu]], `_index.md`, `_hot.md`, `log.md`
- Notes: Ingested three newest raw docs. Captured `Computed Due Wins` for open-app reminder-driven Focus preemption, corrected hot-cache/design language to reflect single-click Complete, and documented responsive side-sheet context-menu placement rules for narrow and quarter-screen windows.
