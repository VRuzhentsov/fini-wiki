# Hot Cache

Updated: 2026-05-03

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
- Current E2E scenario docs assume a two-device paired system, MCP-first interaction, state-first evidence, and mandatory cleanup that proves baseline restoration.
- Local E2E command split: `npm run test:e2e` is headed/local and should open two visible desktop windows; `npm run test:e2e:ci` remains containerized/headless under Xvfb.
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

## Active Wiki Threads

- [[diesel-orm]] — architecture role of Diesel in Fini's current backend.
- [[Quest]] — string ids, default `space_id`, and Diesel-backed persistence semantics.
- [[Space]] — built-in string space ids and delete-to-Personal reassignment.
- [[mcp-contract]] — public contract depends on the same string-id storage model.
- [[Reminder]] — backend-managed bridge from quest due fields to local OS notifications.
- [[e2e-testing]] — staged testing strategy plus new two-plus-actor container architecture.
- [[CLI]] — desired primary synchronous automation surface with MCP parity and shared action-service contract.
- [[DeviceConnection]] — now includes mDNS/DNS-SD discovery and WebSocket pairing direction.
- [[github-actions-pipelines]] — includes split E2E CI phase guidance plus backend compile/test cache split.
- [[settings-ui]] — locked Settings row primitive/layout rules and token-first styling constraints.

## Current Design Thread

- [[pages/sources/2026-04-25-claude-design-spicy-sunrise-chat]] — active source for the spicy sunrise UI refresh. Key locked intent: shared `QuestEditor` across active-card and list-item expansion, `Reminder` opens from Date, top-nav selected-space chip shows chevron and clear button together, active quest actions use 25% Abandon / 75% Complete hold-to-act split, and light/dark theme support is mandatory.
