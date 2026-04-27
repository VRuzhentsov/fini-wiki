---
title: 2026-04-26 Headed Local E2E Main Use Case
type: source
created: 2026-04-27
updated: 2026-04-27
sources: [2026-04-26-headed-local-e2e-main-use-case]
tags: [fini, e2e, playwright, tauri, local-dev, headed]
---

# 2026-04-26 Headed Local E2E Main Use Case

Locks the split between local headed E2E and CI/headless E2E. The local developer command is `npm run test:e2e`, which should launch two visible Fini desktop app windows on the real display. The CI command is `npm run test:e2e:ci`, which remains containerized/headless with actor containers and Xvfb.

## Key claims

- `npm run test:e2e` is the local, headed multi-app E2E command [[sources/2026-04-26-headed-local-e2e-main-use-case]].
- `npm run test:e2e:ci` is the CI/headless command and should keep using containerized actors plus Xvfb [[sources/2026-04-26-headed-local-e2e-main-use-case]].
- The main local proof is two visible Fini app windows running simultaneously, isolated by actor-specific app data and stable hostnames `actor-a` / `actor-b` [[sources/2026-04-26-headed-local-e2e-main-use-case]].
- The headed scenario exercises real Settings/Add Device pairing and verifies each app shows the other device name [[sources/2026-04-26-headed-local-e2e-main-use-case]].
- `FINI_E2E_KEEP=1` should preserve windows/processes for debugging [[sources/2026-04-26-headed-local-e2e-main-use-case]].
- Settings/Add Device needs stable test selectors only where the headed pairing test interacts [[sources/2026-04-26-headed-local-e2e-main-use-case]].

## Open questions

- None stated directly in the source.

## Related pages

- [[e2e-testing]]
- [[DeviceConnection]]
- [[pages/sources/2026-04-26-two-plus-actor-e2e-architecture]]
