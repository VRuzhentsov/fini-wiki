# Reusable Synced Devices E2E Precondition

Date: 2026-04-26

## Decision

Fini multi-device E2E tests need a reusable precondition that brings two or more app actors into a paired, online, sync-ready state before business-logic assertions begin.

Use shared Playwright helpers under:

```text
specs/e2e/actors/helpers/
```

The primary API should be:

```ts
await ensureSyncedActors([actorA, actorB]);
await ensureSyncedActors(Object.values(actors));
```

After this helper returns, future tests can assume the actor topology is ready for multi-device behavior checks.

## Problem

The current two-app E2E pairing flow is embedded directly in the Settings discovery test. That proves the flow works, but it is not reusable.

Future tests will need to start from this state:

```text
actor-a online
actor-b online
actors paired
actors visible to each other
sync sessions can be established
business action can be performed on one actor
replicated effect can be asserted on another actor
```

Copying the full Settings/Add Device pairing flow into every test would make future tests brittle, verbose, and hard to maintain.

## Desired Precondition

The reusable helper should guarantee:

- every actor app is loaded and controllable through the Tauri Playwright bridge
- every actor has a stable local identity
- device ids are unique
- each actor is paired with each other actor
- each actor sees the others as present or paired
- pair state is visible in Settings where appropriate
- sync readiness has been driven enough for future business tests to proceed

The helper should support `2+` actors, not only `actor-a` and `actor-b`.

## Helper Location

Use:

```text
specs/e2e/actors/helpers/dom.ts
specs/e2e/actors/helpers/device-sync.ts
```

`dom.ts` contains generic Tauri/DOM polling helpers.

`device-sync.ts` contains Fini-specific actor identity, pairing, presence, and sync-readiness helpers.

## Helper API

Suggested public API:

```ts
interface SyncedActor {
  actor: E2EActor;
  identity: DeviceIdentity;
}

interface EnsureSyncedActorsOptions {
  pairViaUi?: boolean;
  timeoutMs?: number;
  syncTicks?: number;
}

async function ensureSyncedActors(
  actors: E2EActor[],
  options?: EnsureSyncedActorsOptions,
): Promise<SyncedActor[]>;
```

Default behavior:

```ts
await ensureSyncedActors([actorA, actorB]);
```

Equivalent to:

```ts
await ensureSyncedActors([actorA, actorB], {
  pairViaUi: true,
  timeoutMs: 60_000,
  syncTicks: 3,
});
```

## Internal Flow

The helper should use a hybrid strategy:

- Use real UI for pairing so the discovery and pairing experience remains tested.
- Use backend commands for repeated readiness checks so future tests are fast and less brittle.

Internal sequence:

1. `waitForActorsReady(actors)`
   - wait for `nav.nav`
   - call `device_connection_get_identity`
   - verify every actor has a non-empty identity
   - verify device ids are unique

2. `pairActorsViaUi(actorA, actorB)`
   - navigate both actors to Settings
   - open Add Device on both actors
   - wait for the target actor to appear in nearby devices
   - send pair request from actor A
   - accept incoming request on actor B
   - read the generated passcode from actor A
   - enter passcode on actor B
   - wait until both actors return to Settings and show paired names

3. `ensurePairMatrix(actors)`
   - for `N` actors, ensure each pair is paired
   - initially, pair missing pairs by walking combinations
   - for two actors, this is one pair

4. `waitForPairedDevices(actors)`
   - call `device_connection_get_paired_devices`
   - assert every actor has every other actor as a paired device

5. `waitForPresence(actors)`
   - call `device_connection_presence_snapshot`
   - assert every actor sees every other actor online when discovery allows it

6. `driveSyncReadiness(actors)`
   - call sync tick commands if available
   - otherwise poll paired/presence state and let the background runtime settle

7. Return `SyncedActor[]`
   - include actor handles and identity metadata so business tests can address actors by device id and hostname

## Two Plus Actor Support

The helper should pair missing actor combinations:

```text
actor-a <-> actor-b
actor-a <-> actor-c
actor-b <-> actor-c
```

This keeps the precondition useful for future fan-out and conflict-resolution tests.

If full mesh becomes too slow later, the helper can grow an option for topology:

```ts
topology: "mesh" | "hub-and-spoke"
```

The initial default should be mesh because it is the least surprising for tests.

## Example Future Test Usage

Two actors:

```ts
import { test, expect } from '../fixtures.js';
import { ensureSyncedActors } from '../helpers/device-sync.js';

test('quest created on actor A appears on actor B', async ({ actorA, actorB }) => {
  await ensureSyncedActors([actorA, actorB]);

  // business logic starts here
});
```

All configured actors:

```ts
test('quest sync reaches all online actors', async ({ actors }) => {
  const syncedActors = await ensureSyncedActors(Object.values(actors));

  // business logic starts here
});
```

## Existing Test Refactor

The current Settings pairing E2E should become a consumer of the helper:

```ts
test('two app instances pair through Settings and show each other device names', async ({ actorA, actorB }) => {
  await ensureSyncedActors([actorA, actorB], { pairViaUi: true });
});
```

The detailed pairing flow should live in `helpers/device-sync.ts`.

## Acceptance Criteria

- Existing local headed test still passes with `npm run test:e2e`.
- Existing containerized full suite still passes with `npm run test:e2e:ci`.
- Future tests can call `ensureSyncedActors([actorA, actorB])` without copying pairing UI steps.
- Helper supports `2+` actors.
- Helper failure messages identify which actor or pair failed.
- The helper returns identities for all synced actors.

## Risks

- UI pairing can be slower than direct database seeding, but it preserves product coverage.
- Full mesh pairing may be expensive for many actors; add topology options later if needed.
- Presence discovery can be affected by network behavior; helper should focus on paired/sync readiness and make presence failures actionable.
- Test isolation remains important: each test should call the helper in its own fresh actor environment rather than relying on test order.

## Follow-Up

Later improvements can add:

- direct pre-seeded paired-device setup for tests that do not need to revalidate UI pairing
- named topologies such as hub-and-spoke
- richer sync readiness checks based on actual WebSocket session state
- helper-level cleanup for unpairing or resetting paired-device state
