---
title: 2026-04-26 Two Plus Actor E2E Architecture
type: source
created: 2026-04-26
updated: 2026-04-26
sources: [2026-04-26-two-plus-actor-e2e-architecture]
tags: [fini, testing, e2e, playwright, docker, multi-device, sync]
---

# 2026-04-26 Two Plus Actor E2E Architecture

Architecture note locking the next E2E direction for multi-device Fini testing. The core decision is to move from a single-app lane to a `Playwright runner + two-plus actor containers` model that treats each actor as a separate real app instance and proves infrastructure before scenario coverage.

## Key claims

- The current single-app E2E lane is not enough for real `Device A` / `Device B` / `Device C+` testing because state, identity, ports, and orchestration are still single-instance oriented [[sources/2026-04-26-two-plus-actor-e2e-architecture]].
- The selected architecture is `Playwright runner + two-plus actor containers`, with one orchestration container and one real app container per actor [[sources/2026-04-26-two-plus-actor-e2e-architecture]].
- The architecture is intentionally Playwright-first, not CLI-first; real app actors are the primary target for multi-actor E2E [[sources/2026-04-26-two-plus-actor-e2e-architecture]].
- A shared `runtime-base` Docker stage should feed both clean production `runtime` and test-only `e2e-actor` targets, preserving the trust boundary between shipped runtime and test control surface [[sources/2026-04-26-two-plus-actor-e2e-architecture]].
- Container network namespaces let the project keep current fixed discovery and websocket ports initially while still running multiple actors at once [[sources/2026-04-26-two-plus-actor-e2e-architecture]].
- Infra milestones should prove two isolated live actors first, then bind the first spec-backed smoke test, then expand into pairing/sync flows [[sources/2026-04-26-two-plus-actor-e2e-architecture]].
- Markdown remains the source of truth: specs stay authoritative, executable tests evolve within spec intent, and product code changes under TDD to satisfy failing tests [[sources/2026-04-26-two-plus-actor-e2e-architecture]].

## Open questions

- Actor control transport: Unix sockets, TCP, or both [[sources/2026-04-26-two-plus-actor-e2e-architecture]].
- Actor startup readiness detection [[sources/2026-04-26-two-plus-actor-e2e-architecture]].
- Whether to keep a same-host local debug lane alongside the container lane [[sources/2026-04-26-two-plus-actor-e2e-architecture]].
- Runner command / make-target ergonomics for `2+` actors [[sources/2026-04-26-two-plus-actor-e2e-architecture]].

## Related pages

- [[e2e-testing]]
- [[DeviceConnection]]
- [[SpaceSync]]
- [[Network]]
- [[pages/sources/2026-03-22-e2e-testing-prd]]
- [[pages/sources/2026-03-29-device-synchronizations-design]]
