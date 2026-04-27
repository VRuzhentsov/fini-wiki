# Headed Local E2E Main Use Case

Date: 2026-04-26

## Decision

`npm run test:e2e` is the local, headed E2E command. It should launch visible Fini desktop app windows on the developer's real display so the developer can watch automation exercise the app.

`npm run test:e2e:ci` is the CI/headless E2E command. It should keep using the containerized Podman runner and actor containers with Xvfb so CI remains reproducible and does not require a desktop display.

## Main Use Case

The primary multi-app E2E scenario is two visible Fini desktop app instances running at the same time.

The local headed suite should:

1. Launch two Fini app windows simultaneously.
2. Isolate app data per actor so the test never touches the user's normal data.
3. Assign stable visible device hostnames: `actor-a` and `actor-b`.
4. Open Settings in both app windows.
5. Pair the two devices through the real Add Device flow.
6. Return both windows to Settings.
7. Assert app A shows app B's device name.
8. Assert app B shows app A's device name.

This scenario is the main proof that the multi-app desktop E2E suite is valuable: it validates that two real app instances can coexist, discover/pair with each other, and reflect device state in the UI.

## Command Semantics

Local headed command:

```sh
npm run test:e2e
```

Expected behavior:

- Runs on the host desktop display.
- Shows two visible app windows.
- Drives both windows through Tauri Playwright sockets.
- Focuses on the multi-app actor suite.
- Supports `FINI_E2E_KEEP=1` to leave windows/processes available for debugging.

CI/headless command:

```sh
npm run test:e2e:ci
```

Expected behavior:

- Runs in Podman containers.
- Uses Xvfb, not the host desktop display.
- Runs the full E2E suite headlessly.
- Reuses cache-keyed E2E images unless sources change or `FINI_E2E_REBUILD=1` is set.

## Architecture Notes

The local headed path should launch two host-local `fini app` processes with distinct environment:

- `HOSTNAME=actor-a` / `HOSTNAME=actor-b`
- isolated `FINI_APP_DATA_DIR` directories under `/var/tmp`
- per-actor `TAURI_PLAYWRIGHT_SOCKET` paths under the run directory

The CI/headless path should keep using the existing container architecture:

- `e2e-actor` containers run app instances under Xvfb.
- `e2e-runner` runs Playwright against actor sockets.
- Docker image rebuilds are prevented by a source cache-key label unless inputs change.

## Backend Requirement

Two host-local app instances must be able to bind the discovery UDP port simultaneously. The discovery worker therefore needs reusable UDP socket binding for the shared multicast/broadcast discovery port.

## Testability Requirement

Settings and Add Device UI need stable test selectors only where the headed multi-app test interacts:

- Settings devices section
- Add Device link
- Nearby device rows and Pair buttons
- Incoming request rows and Accept buttons
- Pair code display/input/submit controls
- Paired device names in Settings

Selectors are testability hooks, not product behavior changes.
