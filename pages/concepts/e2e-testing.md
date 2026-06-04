---
title: E2E Testing
type: concept
created: 2026-04-12
updated: 2026-06-03
sources: [2026-03-22-e2e-testing-prd, 2026-04-26-two-plus-actor-e2e-architecture, 2026-04-26-headed-local-e2e-main-use-case, 2026-04-26-reusable-synced-devices-e2e-precondition, 2026-04-27-split-e2e-ci-workflow-steps, 2026-04-27-ci-quality-gates-cache-split, 2026-05-04-space-sync-consent-and-lifecycle, 2026-05-04-space-sync-implementation-and-e2e-results, 2026-05-04-occurrence-completion-sync-e2e-ticket, 2026-05-16-bluetooth-transport-ticket-grilling, 2026-05-27-runner-owned-multi-actor-e2e-plan, 2026-05-28-runner-owned-e2e-implementation-result, 2026-05-28-mcp-surface-decision, 2026-05-29-pr-41-feature-plane-mcp-release-handoff]
tags: [fini, testing, e2e, playwright, tauri-driver, mcp, docker, multi-device, ci, space-sync, bluetooth]
claim_status: locked
evidence: source-backed
---

# E2E Testing

The current testing direction is Playwright-runner-owned for multi-actor app E2E, with CLI as the supported product automation surface. Older product MCP-first E2E guidance is historical because exposed/product MCP is abandoned [[sources/2026-05-28-mcp-surface-decision]] [[sources/2026-05-28-runner-owned-e2e-implementation-result]].

## Selected approach

- Use Playwright Test as the main runner and orchestration layer [[sources/2026-03-22-e2e-testing-prd]] [[sources/2026-05-28-runner-owned-e2e-implementation-result]].
- Product MCP stdio contract tests are no longer a required lane unless a future decision reintroduces exposed MCP [[sources/2026-05-28-mcp-surface-decision]].
- Add small browser smoke coverage for create quest, set Main/Focus, complete quest, and history visibility [[sources/2026-03-22-e2e-testing-prd]].
- Add `tauri-driver` only as a narrow native-runtime backstop [[sources/2026-03-22-e2e-testing-prd]].

## Runner-owned two-plus-actor architecture

The current multi-device direction keeps Playwright as the orchestrator and makes the runner own actor process lifecycle [[sources/2026-05-27-runner-owned-multi-actor-e2e-plan]] [[sources/2026-05-28-runner-owned-e2e-implementation-result]].

- Target architecture: one Playwright runner starts multiple real `fini-app` GUI processes.
- Each actor uses isolated process, app data, socket, hostname, ports, logs, and cleanup [[sources/2026-05-28-runner-owned-e2e-implementation-result]].
- The Playwright actor fixture owns startup, waits for sockets, connects through the Tauri Playwright plugin, preserves artifacts on failure, and keeps `actorA`/`actorB` compatibility [[sources/2026-05-28-runner-owned-e2e-implementation-result]].
- The architecture must scale cleanly from 2 actors to `3+`, so fixture and orchestration contracts should avoid hard-coding only `A/B` forever.

> [!warning] Superseded by [[sources/2026-05-28-runner-owned-e2e-implementation-result]] (2026-05-28)
> Earlier pages described `Playwright runner + two-plus actor containers` with prestarted actor containers. The active path is runner-owned actor processes; the old `e2e-actor` Docker target is only a compatibility alias [[sources/2026-05-28-runner-owned-e2e-implementation-result]].

## Local vs CI commands

The current command split is explicit [[sources/2026-04-26-headed-local-e2e-main-use-case]]:

- `npm run test:e2e` is the local headed command. It should launch two visible Fini desktop windows on the developer's real display.
- `npm run test:e2e:ci` is the CI/headless command. The runner image starts Xvfb and the Playwright fixture starts actor processes [[sources/2026-05-28-runner-owned-e2e-implementation-result]].
- Local actors use isolated `FINI_APP_DATA_DIR` directories under `/var/tmp`, stable hostnames `actor-a` / `actor-b`, and per-actor `TAURI_PLAYWRIGHT_SOCKET` paths.
- `FINI_E2E_KEEP=1` should leave local windows/processes available for debugging.
- The main local proof is Settings/Add Device pairing between the two visible app instances, followed by each app showing the other's device name.
- Headed actor automation should route each actor directly to `#/settings/add-device` when driving Add Device across multiple Tauri windows; this fixed a multi-window automation stall caught by local E2E [[sources/2026-05-04-space-sync-implementation-and-e2e-results]].
- Final verification for the one-space sync lifecycle: `make e2e-headed` passed 7 actor tests [[sources/2026-05-04-space-sync-implementation-and-e2e-results]].

## Default test topology

The current scenario specs assume a real paired-system view rather than one isolated client [[pages/e2e/README]].

- Default topology is two devices: Device A as action source, Device B as receiving peer.
- For sync scenarios, verification should happen on both devices after reload/reopen, not only immediately after the originating action.
- The pair should be treated as the system under test.

## Execution and evidence policy

The current E2E guide still emphasizes state-first evidence, but product MCP-first wording is superseded by the CLI/devtools split [[sources/2026-05-28-mcp-surface-decision]].

- Prefer supported CLI/product surfaces for user-facing automation and devtools control only for test/runtime inspection where appropriate [[sources/2026-05-28-mcp-surface-decision]].
- Run required pre-checks before each scenario: `driver_session status` and `ipc_get_backend_state`.
- For each assertion, capture an evidence chain: write action -> persisted state -> read verification.
- DOM snapshots and structured state outputs are primary evidence; screenshots are fallback-only.
- Every scenario must include mandatory cleanup and prove baseline restoration.

## Reusable synced-actor precondition

Multi-device business tests should not copy the full Settings pairing flow into every scenario. They should call a shared helper that prepares the actor topology [[sources/2026-04-26-reusable-synced-devices-e2e-precondition]].

- Helper location: `specs/e2e/actors/helpers/`.
- Main API: `ensureSyncedActors([actorA, actorB])` or `ensureSyncedActors(Object.values(actors))`.
- The helper guarantees actors are loaded, controllable, uniquely identified, paired, visible as paired/present where possible, and sync-ready enough for business assertions.
- Internal strategy is hybrid: real UI for pairing coverage, backend commands for repeated readiness checks.
- Initial `2+` actor topology default is full mesh; hub-and-spoke can be added later if mesh becomes too slow.

## Container model

The multi-actor note locks a cleaner Docker split for E2E infrastructure [[sources/2026-04-26-two-plus-actor-e2e-architecture]].

- `runtime-base`: shared runtime foundation for both production and E2E targets.
- `runtime`: production runtime target, kept free of Playwright test hooks.
- `e2e-actor`: test-only runtime sibling with `--features e2e-testing` and actor startup dependencies.
- `e2e-runner`: Playwright orchestration container with fixtures and tests.

This keeps the production runtime and E2E control surface as siblings rather than making one inherit the other.

> [!warning] Superseded by [[sources/2026-05-28-runner-owned-e2e-implementation-result]] (2026-05-28)
> The production/test capability split remains important, but actor lifecycle moved from prestarted actor containers into the Playwright runner fixture.

## CI workflow phases

The aggregate local Make target should remain, but GitHub Actions should expose named phases for debuggability [[sources/2026-04-27-split-e2e-ci-workflow-steps]].

- Keep `make pr-gate-e2e` as the full local/reproduction entry point.
- Back it with smaller Makefile targets: build actor, build runner, create network, start actors, wait actors, run Playwright, print logs, cleanup.
- In GitHub Actions, keep using `CONTAINER=docker`; locally, `CONTAINER ?= podman` remains the default.
- This is a failure-debuggability improvement, not a change to the actor topology.

E2E is one of the required PR checks under the single PR-facing `CI` workflow: `E2E Tests` must pass before merge to `main` [[sources/2026-04-27-ci-quality-gates-cache-split]].

## Prioritization

- Product MCP E2E is no longer the first required lane; that older requirement is superseded by the CLI automation direction [[sources/2026-05-28-mcp-surface-decision]].
- UI and native desktop lanes are useful, but the PRD keeps them intentionally small and lower priority [[sources/2026-03-22-e2e-testing-prd]].
- Agentic exploratory testing is explicitly advisory until proven stable [[sources/2026-03-22-e2e-testing-prd]].

## Milestones

The newer architecture adds an infrastructure-first rollout for multi-device testing [[sources/2026-04-26-two-plus-actor-e2e-architecture]].

1. Prove containerized control of at least two isolated live actors.
2. Bind the first executable two-actor smoke to a Markdown spec.
3. Expand into real pairing, mapping, replication, reconnect, and unpair flows.

## Current spec inventory

The wiki already contains concrete E2E scenario specs that should feed the runner-based architecture:

- [[pages/e2e/device-connection/pairing-happy-path]] — two-device pairing, passcode entry, presence, and add-mode cleanup.
- [[pages/e2e/space-sync/foo-create-via-dialog]] — incoming custom-space resolution via `Create`.
- [[pages/e2e/space-sync/foo-bar-cross-map-via-dialog]] — historical batch/cross-map dialog intent; superseded by one-space receiver-side requests.
- [[pages/e2e/space-sync/quest-sync-between-spaces]] — quest movement plus end/re-enable bootstrap/merge across mapped lifecycle state.

Current SpaceSync E2E coverage should prove receiver-only one-space prompts, no prompt for already-active mappings on sync tick/reconnect, silent quest sync after approval, `end_of_sync_at` on removal, and re-enable bootstrap/merge [[sources/2026-05-04-space-sync-consent-and-lifecycle]] [[sources/2026-05-04-space-sync-implementation-and-e2e-results]].

Issue `VRuzhentsov/fini#19` adds another narrow follow-up lane: explicit occurrence-completion sync across paired devices, with the assertion tied to the same occurrence identity rather than any generic completed occurrence [[sources/2026-05-04-occurrence-completion-sync-e2e-ticket]].
- Issue `VRuzhentsov/fini#25` requires full Bluetooth E2E for Android + Linux, not only manual proof or mocked tests [[sources/2026-05-16-bluetooth-transport-ticket-grilling]] [[sources/2026-05-16-bluetooth-transport-github-issue]].
- [[pages/e2e/cli/README]] — CLI-first E2E expectations, structured output, and exit-code policy.
- [[pages/e2e/interface/README]] — CLI/MCP parity through one shared action service.
- [[pages/e2e/skill/README]] — natural-language action translation with deterministic outcomes.

These specs are still draft-level test intent, but they now provide the first concrete scenario backlog for the two-plus-actor infrastructure.

## Constraints and rationale

- Current discovery and sync ports are fixed, so same-host multi-process is a weaker primary architecture than per-actor containers with separate network namespaces [[sources/2026-04-26-two-plus-actor-e2e-architecture]].
- The multi-actor direction is intentionally Playwright-first, not CLI-first, because the goal is orchestrating real app actors rather than only backend contract flows [[sources/2026-04-26-two-plus-actor-e2e-architecture]].
- Markdown remains the source of truth for intent; executable tests evolve within those spec bounds [[sources/2026-04-26-two-plus-actor-e2e-architecture]].

## Bluetooth E2E lane

Bluetooth transport testing is outside the current container-only happy path because it depends on Android + Linux devices that are already paired at the OS Bluetooth layer [[sources/2026-05-16-bluetooth-transport-ticket-grilling]].

- E2E must prove Fini app pairing over Bluetooth with LAN unavailable [[sources/2026-05-16-bluetooth-transport-ticket-grilling]].
- E2E must prove approved SpaceSync replication over Bluetooth with LAN unavailable [[sources/2026-05-16-bluetooth-transport-ticket-grilling]].
- E2E must prove network-first priority when both transports are available [[sources/2026-05-16-bluetooth-transport-ticket-grilling]].
- E2E must prove Bluetooth fallback after network transport fails [[sources/2026-05-16-bluetooth-transport-ticket-grilling]].

> [!question]
> The Bluetooth execution environment is not yet evidenced: CI may not support real Bluetooth, so the eventual implementation may require a device-lab or manual-gated E2E target [[sources/2026-05-16-bluetooth-transport-ticket-grilling]].
