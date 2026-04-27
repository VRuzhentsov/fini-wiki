---
title: 2026-04-26 Reusable Synced Devices E2E Precondition
type: source
created: 2026-04-27
updated: 2026-04-27
sources: [2026-04-26-reusable-synced-devices-e2e-precondition]
tags: [fini, e2e, playwright, multi-device, sync, test-helpers]
---

# 2026-04-26 Reusable Synced Devices E2E Precondition

Decision note for extracting the current two-app pairing flow into reusable Playwright helpers. Future multi-device tests should call `ensureSyncedActors(...)` to start from paired, online, sync-ready actors before business assertions begin.

## Key claims

- Multi-device E2E needs a reusable precondition that brings two or more app actors into paired, online, sync-ready state [[sources/2026-04-26-reusable-synced-devices-e2e-precondition]].
- Shared helpers live under `specs/e2e/actors/helpers/`, especially `dom.ts` and `device-sync.ts` [[sources/2026-04-26-reusable-synced-devices-e2e-precondition]].
- Main API is `ensureSyncedActors([actorA, actorB])` or `ensureSyncedActors(Object.values(actors))` [[sources/2026-04-26-reusable-synced-devices-e2e-precondition]].
- The helper should guarantee actor readiness, stable unique identities, pair matrix, visible paired state, presence where possible, and enough sync readiness for business tests [[sources/2026-04-26-reusable-synced-devices-e2e-precondition]].
- Internal strategy is hybrid: real UI for pairing coverage, backend commands for repeated readiness checks [[sources/2026-04-26-reusable-synced-devices-e2e-precondition]].
- Initial topology default is full mesh for `2+` actors; hub-and-spoke can be added later if mesh becomes too slow [[sources/2026-04-26-reusable-synced-devices-e2e-precondition]].

## Open questions

- Whether to add direct pre-seeded paired-device setup for tests that do not need to revalidate UI pairing [[sources/2026-04-26-reusable-synced-devices-e2e-precondition]].
- Whether to add named topologies such as hub-and-spoke [[sources/2026-04-26-reusable-synced-devices-e2e-precondition]].
- How rich sync readiness checks should become once actual WebSocket session state is available [[sources/2026-04-26-reusable-synced-devices-e2e-precondition]].
- Whether helper-level cleanup should unpair or reset paired-device state [[sources/2026-04-26-reusable-synced-devices-e2e-precondition]].

## Related pages

- [[e2e-testing]]
- [[DeviceConnection]]
- [[SpaceSync]]
- [[pages/e2e/device-connection/pairing-happy-path]]
