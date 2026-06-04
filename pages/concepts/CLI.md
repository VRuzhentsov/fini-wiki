---
title: CLI
type: concept
created: 2026-04-26
updated: 2026-06-03
sources: [2026-05-27-fini-exposed-mcp-cleanup-ticket, 2026-05-28-cli-pairing-follow-up, 2026-05-28-feature-plane-devtools-boundary, 2026-05-28-mcp-surface-decision, 2026-05-28-runner-owned-e2e-implementation-result, 2026-05-29-pr-41-feature-plane-mcp-release-handoff, 2026-06-03-pr-36-focus-enter-count-product-and-design-result]
tags: [fini, cli, automation, binary-plane]
claim_status: locked
evidence: source-backed
---

# CLI

## Purpose

Define the Fini CLI as the primary synchronous interface for automation and skill-driven actions. Product/exposed MCP is abandoned; devtools runtime-control access is a separate testing/control plane [[sources/2026-05-28-mcp-surface-decision]] [[sources/2026-05-29-pr-41-feature-plane-mcp-release-handoff]].

## Scope

- CLI command contract and output policy.
- Full operation coverage across quest, space, reminder, focus, device, and sync domains.
- Skill preflight requirements for binary accessibility.

## Non-goals

- Reintroducing product/exposed MCP as a supported automation contract.
- Replacing GUI behavior outside explicit CLI entry contracts.

## Entry Contracts

`fini` is globally accessible on Linux through PATH and supports these top-level invocations:

| Invocation | Behavior |
|---|---|
| `fini` | Return current Focus quest (human output by default in terminal) |
| `fini --help` | Show full command list and usage |
| `fini mcp` | Historical/removed exposed MCP surface; do not rely on this as a product automation path |

Desktop launchers and bundled app entrypoints open GUI mode through the separate `fini-app` binary. `fini app` is not a supported compatibility alias [[sources/2026-05-28-runner-owned-e2e-implementation-result]].

## Binary Plane Contract

- `fini` is the CLI-only binary and is built with the `cli-plane` Cargo feature [[sources/2026-05-28-runner-owned-e2e-implementation-result]].
- `fini-app` is the GUI binary and desktop builds enable `ui-plane` [[sources/2026-05-28-runner-owned-e2e-implementation-result]] [[sources/2026-05-29-pr-41-feature-plane-mcp-release-handoff]].
- Mobile builds enable only `ui-plane`; CLI modules and dependencies are excluded from mobile bundles.
- Docker/runtime builds enable only `cli-plane` and expose `fini` by default.

## Feature-plane boundary

- CLI and UI are first-class surfaces over shared DB/domain/service core [[sources/2026-05-28-feature-plane-devtools-boundary]].
- Shared core includes DB, quests, reminders, backup, spaces, sync/device state, and other product operations where command groups exist [[sources/2026-05-28-feature-plane-devtools-boundary]].
- `ui-plane` owns runtime adapters such as Tauri commands, Tauri managed state, OS notification delivery, native theme behavior, windows/plugins, and Playwright/dev-only automation hooks [[sources/2026-05-28-feature-plane-devtools-boundary]].
- `devtools` is not a product plane; it is production app behavior plus development/test affordances [[sources/2026-05-28-feature-plane-devtools-boundary]].

## Global Binary Accessibility (Linux)

- `command -v fini` must resolve to an executable binary.
- `fini --help` must execute successfully.
- Packaging/installation must keep `fini` available across new shell sessions.

## Output and Exit Code Policy

- Default output is human-readable.
- `--json` is supported for machine consumers on all commands.
- Errors print concise human text to stderr and structured payload with `--json`.
- Exit codes are stable:
  - `0` success
  - `2` invalid args/usage
  - `3` not found
  - `4` invalid state transition
  - `5` runtime/system failure

## Command Surface (Full Parity Target)

### Focus

- `fini` (alias of `fini focus get`)
- `fini focus get [--json]`
- `fini focus set --quest-id <id> [--trigger <manual|reminder>] [--json]`

### Quest

- `fini quest list [--status <active|completed|abandoned>] [--space-id <id>] [--json]`
- `fini quest get --id <id> [--json]`
- `fini quest create ... [--json]`
- `fini quest update --id <id> ... [--json]`
- `fini quest complete --id <id> [--json]`
- `fini quest abandon --id <id> [--json]`
- `fini quest delete --id <id> [--json]`
- `fini quest history [--json]`

### Space

- `fini space list [--json]`
- `fini space create --name <name> [--json]`
- `fini space update --id <id> [--name <name>] [--order <n>] [--json]`
- `fini space delete --id <id> [--json]`

### Reminder

- `fini reminder list --quest-id <id> [--json]`
- `fini reminder create --quest-id <id> --type <relative|absolute> ... [--json]`
- `fini reminder delete --id <id> [--json]`

### Device Connection

- `fini device identity [--json]`
- `fini device add-mode enter|leave [--json]`
- `fini device discovery [--json]`
- `fini device presence [--json]`
- `fini device pair send --request-id <id> --to-device-id <id> --to-addr <ip> [--json]`
- `fini device pair incoming|outgoing-updates|outgoing-completions [--json]`
- `fini device pair accept --request-id <id> [--json]`
- `fini device pair complete --request-id <id> [--json]`
- `fini device pair acknowledge --request-id <id> [--json]`
- `fini device paired list|save|unpair ... [--json]`
- `fini device updates consume-space-mapping [--json]`
- `fini device debug status [--json]`

Live device pairing from CLI is a follow-up, not fully locked implementation: the desired command set should cover discovery, sending requests, incoming requests, accept, complete, acknowledge, status, and debug output while preserving [[DeviceConnection]] and [[SpaceSync]] semantics [[sources/2026-05-28-cli-pairing-follow-up]].

### Space Sync

- `fini sync mappings list --peer-device-id <id> [--json]`
- `fini sync mappings update --peer-device-id <id> --mapped-space-id <id>... [--json]`
- `fini sync mappings apply-remote --peer-device-id <id> --mapped-space-id <id>... [--json]`
- `fini sync mappings resolve-custom --peer-device-id <id> --space-id <id> --mode <create_new|use_existing> [--existing-local-space-id <id>] [--json]`
- `fini sync tick [--peer-device-id <id>] [--json]`
- `fini sync status [--peer-device-id <id>] [--json]`

## Historical MCP-to-CLI Parity Matrix

> [!warning] Superseded by [[sources/2026-05-28-mcp-surface-decision]] (2026-05-28)
> Product/exposed MCP is abandoned. This matrix is historical context for older parity planning, not current implementation guidance.

| Current MCP Tool | Target CLI |
|---|---|
| `list_quests` | `fini quest list` |
| `get_quest` | `fini quest get --id` |
| `get_active_focus` | `fini` / `fini focus get` |
| `create_quest` | `fini quest create` |
| `update_quest` | `fini quest update --id` |
| `complete_quest` | `fini quest complete --id` |
| `abandon_quest` | `fini quest abandon --id` |
| `delete_quest` | `fini quest delete --id` |
| `list_history` | `fini quest history` |
| `list_spaces` | `fini space list` |
| `create_space` | `fini space create --name` |
| `update_space` | `fini space update --id` |
| `delete_space` | `fini space delete --id` |
| `list_reminders` | `fini reminder list --quest-id` |
| `create_reminder` | `fini reminder create --quest-id` |
| `delete_reminder` | `fini reminder delete --id` |

## Shared action/core service

Define a single shared service/module as the execution core for all interfaces.

- CLI calls shared domain/core service methods directly where available [[sources/2026-05-29-pr-41-feature-plane-mcp-release-handoff]].
- GUI/Tauri commands call the same action service methods.
- Business rules and persistence logic are implemented once in that shared module.
- Interface adapters only handle argument parsing, transport, and output formatting.
- No interface-specific divergence in mutation or validation logic.

## Focus entry count

CLI Focus commands participate in the same `focus_enter_count` semantics as app UI and reminder handling [[sources/2026-06-03-pr-36-focus-enter-count-product-and-design-result]].

## Skill Integration Contract

Any skill that controls Fini must pass this preflight before performing actions:

1. `command -v fini`
2. `fini --help`

If either check fails, stop immediately, report failure, and provide concrete PATH/install remediation.

## Acceptance Criteria

- `fini` is globally executable on Linux.
- `fini --help` lists command groups and examples.
- `fini` returns current Focus quest.
- Desktop launchers invoke `fini-app`; `fini app` is absent.
- CLI command surface covers product automation directly; product MCP parity is historical.
- Skill preflight is documented and enforced before any action.
