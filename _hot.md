# Hot Cache

Updated: 2026-06-03

## Current Fini Architecture

- Fini desktop/mobile app uses Vue 3 in `src/` and a Rust + Tauri backend in `src-tauri/`.
- The Rust backend uses Diesel as the ORM over SQLite; this is visible in `src-tauri/Cargo.toml`, `src-tauri/src/schema.rs`, and the service-layer command handlers.
- Diesel is load-bearing for migrations, id semantics, defaults, and referential behavior: quest ids are UUID-like text, space ids are string ids, and quests default to Personal space `"1"`.
- Tauri commands and the MCP layer expose Diesel-backed Rust model shapes directly enough that storage decisions affect API contracts.
- Reminder scheduling source of truth is now `quest.due` + `quest.due_time`, not the `reminders` row. Backend `update_quest` derives one local-only reminder row per due-dated active quest; date-only quests default to `09:00` local.
- Past-due reminder handling is unified: save-path and launch reconciliation both fire immediately. The old 30-minute grace rule is superseded.
- Reminder rows no longer replicate via `SpaceSync`; quests replicate, and each device derives its own local reminder from quest due fields.
- Repeating quests use the same reminder bridge as single quests. The earlier `series_reminder_templates` direction is superseded.
- Multi-device E2E direction is now `Playwright runner + two-plus actor containers`, with a shared `runtime-base` feeding separate production `runtime` and test-only `e2e-actor` targets.
- Current E2E scenario docs assume a two-device paired system, state-first evidence, and mandatory cleanup that proves baseline restoration; product MCP-first interaction guidance is superseded by the CLI/devtools split.
- Local E2E command split: `npm run test:e2e` is headed/local and should open two visible desktop windows; `npm run test:e2e:ci` remains containerized/headless under Xvfb.
- Multi-device E2E is runner-owned: the Playwright runner/fixture spawns isolated real `fini-app` actor processes with per-actor app data, sockets, hostnames, ports, logs, and cleanup. Older prestarted actor-container topology is superseded.
- Multi-device E2E tests should share `ensureSyncedActors(...)` as the reusable precondition for paired, online, sync-ready `2+` actors.
- Discovery architecture is now mDNS/DNS-SD (`_fini-sync._tcp.local.`) for endpoint discovery plus WebSocket for pairing/sync. mDNS TXT is untrusted metadata, not auth.
- E2E CI should expose named Makefile-backed phases rather than one opaque `make pr-gate-e2e` GitHub Actions step.
- PR CI is now a single `.github/workflows/ci.yml` workflow with required checks: `Snyk Vulnerability Scan`, `FE Unit Tests`, `BE Compile`, `BE Unit Tests`, `E2E Tests`.
- Backend CI is split into Dockerfile-backed compile and unit-test gates so GHCR cache images can reuse compiled Rust test artifacts.
- Settings device detail mapped-space rows now show `last synced:` as locale date+time instead of time-only; this is UI-only and does not change `space_sync` semantics.
- Settings rows now use `SettingsListGroup` and `SettingsListItem`; row content is one-column or start/end two-column, with fixed leading/trailing chrome outside the content columns.
- Settings styling stays DaisyUI/Tailwind token-first. Vue templates should not branch on light/dark/system for styling; global `data-theme` and tokens own theme differences.
- Device display names are labels, not identity. UUIDs remain hidden route/storage identity; duplicate display names are allowed.
- Local device identity now lives in SQLite `settings` rows `device.id` and `device.name`; deprecated `device_identity.json` is migration input only and should be deleted after settings identity is valid.
- Paired-device `display_name` is captured at pairing time and does not auto-update from later discovery names.
- Device pairing consent is separate from SpaceSync consent. Incoming device connection requests are inline list items, not global modals.
- SpaceSync consent is one receiver-side global modal for one not-yet-active space at a time. Batch mapping snapshot approval is not desired behavior.
- Startup, reconnect, session bootstrap, and sync tick must not replay active mappings into approval modals; already-synced spaces must not prompt again.
- Quest create/update/delete traffic for active mapped spaces syncs silently in the background after approval.
- Removing a mapped space sends `space_sync_end`, records `end_of_sync_at`, and stops future sync. Re-enable clears `end_of_sync_at`, resets bootstrap state, and merges quest changes made while sync was off.
- Local headed E2E caught and fixed Add Device multi-window automation by direct routing to `#/settings/add-device`; final `make e2e-headed` passed 7 actor tests.
- Current History page still shows same-series resolved occurrences as separate rows; ticket `#20` scopes grouping changes to History only and keeps active-list grouping unchanged.
- E2E follow-up ticket `#19` should assert that completing an occurrence on one paired device completes the same occurrence identity on the other.
- Android reminder delivery now has manifest/runtime/frontend notification permission support wired; Linux KDE delivery needs `DesktopEntry("Fini")` plus an installed `Fini.desktop` for dev popups, and Linux sound uses direct `paplay` fallback because KDE ignores DBus sound hints.
- Focus now treats active reminder due timestamps as virtual focus events. Once due, a reminder quest can become Focus even while the app is already open; this no longer depends on a reconciler-written `focus_history` row.
- Quests now persist `focus_enter_count` as a lightweight attention-history signal. Repeat-Focus UI appears only when `focus_enter_count > 1`; app UI, reminders, and CLI Focus commands participate in the same semantics. Count-only cross-device convergence is deferred.
- Active Focus `Complete` is now intended to be single-click, not hold-to-complete.
- Context menus should behave as responsive side-sheet surfaces with app-window-based sizing and second-half/overlay submenu placement, not raw cursor popups.
- Context menu #21 placement implementation exists locally but was not pushed or user-validated; the next design pass supersedes flyout/overlay submenus with inline accordion pickers, richer row states, scrim, drag bottom sheet, and reduced-motion-aware motion.
- Context menu wide placement now supersedes #21 zone/corner placement: compact polished menus anchor to cursor or trigger element and shift only to avoid body/composer overflow; mobile bottom sheet is unchanged.
- Release-prep skill work now centers on Play Store screenshot package validation under `docs/play-store/screenshots/`; `make play-store-screenshots` validated 9 existing canonical screenshots and wrote a manifest, but fresh runtime capture/composition remains future work.
- History grouping issue #20 current shape: History reuses `QuestList.vue` with `groupChildrenById`, no `HistoryGroupRow`, no count badge, Mixed `N / M` status for mixed completed/abandoned groups, restore-latest, and delete-series removes past+future occurrences plus `quest_series`. Corrective build/unit/Rust tests passed; E2E is deferred.
- Bluetooth transport is issue #25: independent network/Bluetooth providers, OS Bluetooth pairing is only a precondition, Fini pair-auth remains trust, network is preferred, Bluetooth is explicit per pair and fallback only, first scope Android + Linux.
- Backup import/export is issue #28: v1 `.zip` contains exactly `manifest.json` + `fini-backup.sqlite`, includes selected spaces/quests/quest_series, excludes settings/devices/sync/reminders/focus history, and spans Settings UI plus CLI.
- Backup import mapping reuses the device-sync-style one-space mapping pattern; `MapToExistingDialog` is shared between backup import and incoming SpaceSync resolution.
- Settings search ticket is overview-only: client-side case-insensitive filtering of visible `/settings` sections/rows in place; add-device/device-detail routes, hidden IDs, global search, and backend indexing are out of scope.
- Repo/wiki doc split is locked: enforceable implementation contracts belong in `../fini/specs` or repo companion docs; rationale/history/synthesis belongs in `fini-wiki`.
- Binary plane split is current architecture: `fini` is CLI-only (`cli-plane`), `fini-app` is the desktop GUI (`ui-plane`), mobile builds use `ui-plane` only, and Docker/runtime exposes CLI-only by default. `fini app` is removed.
- Product/exposed MCP is abandoned; `fini` CLI is the supported user-facing automation surface. Devtools MCP/dev-build control remains separate development/testing control, not product API.
- Memory is a planned optional top-level surface after History: nav order `Focus`, `History`, `Memory`, `Settings`. Settings must be able to disable Memory, hiding the tab and stopping indexing/embedding without deleting History or generated Memory data.
- Quest Memory research should evaluate `qmd` (`https://github.com/tobi/qmd`) as a primary candidate for large Markdown-backed Memory search/embeddings, while SQLite/Diesel remains the likely canonical operational quest store unless research proves otherwise.
- Release `v0.1.30` shipped successfully after PR #41 from latest `origin/main`; release workflow passed and published stable artifacts. GitHub Actions Node.js 20 deprecation annotations remain a workflow-maintenance follow-up.

## Active Wiki Threads

- Wiki v2 iteration is conservative-plus-tooling: evidence labels instead of numeric confidence, typed markdown edges instead of graph DB, human-gated crystallization, and dependency-free read-only helper commands.
- [[diesel-orm]] — architecture role of Diesel in Fini's current backend.
- [[Quest]] — string ids, default `space_id`, and Diesel-backed persistence semantics.
- [[Space]] — built-in string space ids and delete-to-Personal reassignment.
- [[mcp-contract]] — public contract depends on the same string-id storage model.
- [[Reminder]] — backend-managed bridge from quest due fields to local OS notifications.
- [[QuestOccurrence]] — deterministic occurrence identity plus current History-only grouping ticket and paired-device sync E2E follow-up.
- [[history-grouping]] — current History-only grouped occurrence presentation contract and corrective implementation status.
- [[backup-import-export]] — issue #28 portable zip backup format, Settings/CLI import/export flow, mapping, and merge conflict contract.
- [[repo-wiki-doc-policy]] — boundary between main-repo specs and wiki rationale/history docs.
- [[focus]] — newer `Computed Due Wins` reminder-preemption semantics for open-app due boundaries.
- [[e2e-testing]] — staged testing strategy plus new two-plus-actor container architecture.
- [[CLI]] — desired primary synchronous automation surface with MCP parity and shared action-service contract.
- [[DeviceConnection]] — includes mDNS/DNS-SD discovery, WebSocket pairing, inline pairing consent, and planned Bluetooth fallback transport.
- [[SpaceSync]] — one-space receiver-side consent lifecycle with `end_of_sync_at` end/re-enable semantics; transport changes must not create new consent prompts.
- [[github-actions-pipelines]] — includes split E2E CI phase guidance plus backend compile/test cache split.
- [[settings-ui]] — locked Settings row primitive/layout rules and token-first styling constraints.
- [[memory]] — planned optional reflective graph/search surface for resolved quest history.
- [[quest-memory-search]] — qmd/Markdown/SQLite FTS research thread for large local quest memory search.
- [[context-menu]] — responsive side-sheet placement rules for context menus and submenus.
- [[release-prep-screenshots]] — repo-local Play Store screenshot prep skill, canonical asset matrix, validation status, and #22 follow-up.
- [[os-notification]] — Android permission path is wired; Linux KDE popups/sound need desktop-entry and direct `paplay` handling; Linux closed-app delivery remains deferred.

## Current Design Thread

- [[pages/sources/2026-04-25-claude-design-spicy-sunrise-chat]] — active source for the spicy sunrise UI refresh. Key locked intent: shared `QuestEditor` across active-card and list-item expansion, `Reminder` opens from Date, top-nav selected-space chip shows chevron and clear button together, and light/dark theme support is mandatory. Newer raw docs supersede hold-to-complete and older popup-style context-menu assumptions.
