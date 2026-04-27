---
title: Two-Plus-Actor E2E Architecture
date: 2026-04-26
status: proposed
project: fini
---

# Two-Plus-Actor E2E Architecture

## Context

Fini already has a working single-app E2E lane:

- Playwright is the current E2E runner.
- Tauri UI E2E uses `tauri-plugin-playwright` under the `e2e-testing` feature.
- Desktop E2E can run headless or visibly on the developer's machine.
- The app already supports isolated app data via `FINI_APP_DATA_DIR`.

That existing lane is enough for one actor, but it is not enough for `Device A`, `Device B`, and later `Device C+` acting as separate real app instances.

The real requirement is not "more scenarios" first. The real requirement is infrastructure:

1. run multiple real Fini app instances at once,
2. isolate their state and identity,
3. orchestrate them from one Playwright test run,
4. preserve a spec-first workflow where Markdown remains the source of truth.

## Problem Statement

The current single-app E2E setup does not scale directly to multiple actors.

Known constraints in the live repo:

- the current UI fixture assumes one app instance,
- one app instance currently owns one app data directory,
- discovery and sync networking are fixed to one UDP port and one websocket port,
- the current containerized E2E path is monolithic rather than actor-oriented.

That means a true multi-actor architecture must isolate each app instance at the process/container level and must separate the runner from the controlled actors.

## Decision

Adopt this target architecture:

**Playwright runner + two-plus actor containers**

Where:

- the Playwright runner is the orchestration brain,
- each actor container runs one real Fini app instance,
- each actor is treated as a distinct device,
- the system must scale from 2 actors to 3+ without redesign.

This architecture is intentionally Playwright-first, not CLI-first.

The CLI/runtime path remains valuable, but as a secondary or later lane, not the primary architecture for multi-actor app E2E.

## Rejected Alternatives

### 1. Single host, multiple local app processes as the main architecture

This is useful for local experimentation, but it is a weak primary architecture because:

- fixed networking ports cause collisions in the same namespace,
- local process orchestration becomes brittle,
- it does not naturally model "separate devices" as cleanly as containers do.

It remains useful as a possible fast local debug mode later.

### 2. Make the published runtime image also be the E2E actor image

Rejected because it mixes trust boundaries.

Problems:

- production runtime would carry test-only control surface,
- release/runtime semantics would be mixed with E2E semantics,
- GUI/headless test dependencies would leak into the production image,
- security/provenance story becomes worse.

### 3. CLI-first two-actor lane as the primary design

Rejected as the first architecture because the current need is orchestration of real app actors, not only backend contract flows.

CLI/runtime reuse is still attractive for later regression lanes, but not as the core architecture for multi-actor UI/system E2E.

## Core Principles

### 1. Playwright is the orchestrator

Playwright remains the main test runner and coordination layer.

It is responsible for:

- actor startup coordination,
- actor session management,
- cross-actor timing and assertions,
- collecting evidence from multiple actors in one test.

### 2. Actors are real app instances

Each actor container runs the actual Fini app with the E2E control bridge enabled.

Each actor must have isolated:

- app process,
- app data directory,
- SQLite database,
- device identity,
- display/headless session,
- Playwright bridge endpoint.

### 3. Markdown remains the source of truth

The test system keeps a three-layer model:

1. Markdown specs are read-only source of truth.
2. Executable tests are allowed to evolve, but only within Markdown-defined intent and limits.
3. Product code changes under TDD to satisfy the failing executable test.

This architecture does not replace that model. It enables it for multi-actor tests.

### 4. Design for two-plus actors, not only exactly two

The initial milestone is `Device A` plus `Device B`, but the architecture must generalize cleanly to `Device C+`.

That means:

- actor naming is index-based rather than hard-coded to only A/B,
- orchestration contracts should support arrays or maps of actors,
- test infra should not assume only one source and one sink forever.

## Docker Architecture

Use one multistage Dockerfile.

Target shape:

```text
node-deps
playwright-browsers

rust-builder-base
app-build-release
app-build-e2e

runtime-base
runtime
e2e-actor

e2e-runner
test
```

## Stage Responsibilities

### `runtime-base`

Purpose: shared runtime foundation for both production runtime and actor runtime.

Contains:

- base OS image,
- shared runtime libraries for the desktop app,
- shared filesystem conventions,
- shared environment defaults like `XDG_DATA_HOME=/data`,
- no binary,
- no entrypoint,
- no test-only tooling.

This stage exists to maximize reuse without mixing production and E2E responsibilities.

### `runtime`

Purpose: production/published CLI-first runtime.

Contains:

- everything from `runtime-base`,
- release `fini` binary,
- production entrypoint.

Must remain:

- clean,
- small relative to actor/debug images,
- free from Playwright test hooks.

### `e2e-actor`

Purpose: one controlled actor container running one real Fini app instance.

Contains:

- everything from `runtime-base`,
- E2E-enabled `fini` binary built with `--features e2e-testing`,
- headless desktop dependencies needed for actor startup,
- actor startup script or command.

The actor image is not the published runtime image. It is a test-controlled runtime sibling.

### `e2e-runner`

Purpose: Playwright orchestration container.

Contains:

- Node dependencies,
- Playwright,
- test code,
- fixtures,
- orchestration helpers,
- spec references,
- no need to directly host the app process.

It connects outward to the actor containers.

### `test`

Purpose: convenience target that runs the selected E2E suite.

This may remain a compatibility alias or wrapper target while the new architecture is rolled out.

## Why `runtime-base` Instead Of `e2e-actor FROM runtime`

Both are possible, but `runtime-base` is cleaner.

Reasons:

- `runtime` should be free to make production-specific choices.
- `e2e-actor` should be free to make test-specific choices.
- neither should inherit the other's entrypoint assumptions.
- the binary copy step stays explicit: release binary for `runtime`, E2E binary for `e2e-actor`.

`runtime-base` preserves reuse while keeping the trust boundary clear:

```text
runtime-base
  -> runtime
  -> e2e-actor
```

## Networking Model

The current live app uses fixed discovery and sync ports.

That is a problem for many local-process topologies, but it is acceptable in the recommended architecture because each actor runs in its own container/network namespace.

This is a major reason the actor-container architecture is attractive.

It allows the project to:

- preserve the current production-like network assumptions initially,
- avoid introducing too much test-only port configurability up front,
- still add dynamic port configuration later if needed for local-process debug lanes.

## Playwright Control Model

The current single-app fixture model should evolve into an actor model.

Conceptually:

```ts
test('multi-actor smoke', async ({ actorA, actorB }) => {
  const a = await actorA.invoke('device_connection_get_identity')
  const b = await actorB.invoke('device_connection_get_identity')
  expect(a.device_id).not.toBe(b.device_id)
})
```

Preferred abstraction:

- one actor object per controlled app instance,
- each actor exposes page actions and backend invocation helpers,
- actor collections should scale naturally to `actorC`, `actorD`, and indexed groups.

## Expected Infra Milestones

### Milestone 1: containerized actor control

Prove that one Playwright run can control at least two isolated Fini app instances.

Required proof:

- runner connects to actor A,
- runner connects to actor B,
- both actors are alive at the same time,
- both actors expose distinct device identities,
- both actors can be interacted with independently.

This milestone is intentionally scenario-free. It proves infrastructure only.

### Milestone 2: first spec-bound two-actor smoke

After infrastructure is proven, bind the first executable two-actor test to a Markdown spec.

### Milestone 3: real pairing/sync suite expansion

Only after the infra layer is trustworthy should the system grow into actual product flows:

- pairing,
- mapping,
- replication,
- replay/reconnect,
- unpair,
- eventually three-plus actor topologies.

## Implementation Plan

1. Introduce `runtime-base` into the multistage Dockerfile.
2. Refactor `runtime` to extend `runtime-base` and remain production-clean.
3. Create `e2e-actor` as a sibling final target extending `runtime-base`.
4. Create `e2e-runner` with Playwright and multi-actor fixtures.
5. Define an orchestration path for 2+ actor containers plus runner.
6. Add the first infra smoke test that proves independent actor identity/control.
7. Only then add feature scenarios derived from Markdown source-of-truth docs.

## Open Questions

These questions remain implementation-level rather than architecture-level:

- whether actor control should use Unix sockets, TCP, or both for the Playwright bridge,
- how actor startup readiness should be detected,
- whether to add a fast same-host local debug lane in addition to the container lane,
- how to structure runner commands and make targets for `2+` actors cleanly.

None of these questions block the architectural decision.

## Bottom Line

The selected architecture is:

**Playwright runner + two-plus actor containers**

backed by:

- one multistage Dockerfile,
- a shared `runtime-base`,
- a clean split between `runtime` and `e2e-actor`,
- Markdown-as-truth,
- and a phased rollout that proves multi-actor infrastructure before product scenarios.
