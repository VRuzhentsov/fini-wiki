---
title: 2026-05-27 Runner Owned Multi Actor E2E Plan
type: source
created: 2026-06-03
updated: 2026-06-03
sources: [2026-05-27-runner-owned-multi-actor-e2e-plan]
tags: [fini, e2e, playwright, actors, docker]
claim_status: superseded
evidence: source-backed
---

# 2026-05-27 Runner Owned Multi Actor E2E Plan

This source captures the plan that superseded prestarted actor containers: Playwright should own actor lifecycle and start multiple real `fini-app` processes itself [[sources/2026-05-27-runner-owned-multi-actor-e2e-plan]].

> [!warning] Superseded by [[sources/2026-05-28-runner-owned-e2e-implementation-result]] (2026-05-28)
> The runner-owned actor model was implemented and verified with `make pre-release-check`.

## Key claims

- `fini` is CLI-only and `fini-app` is the GUI binary [[sources/2026-05-27-runner-owned-multi-actor-e2e-plan]].
- Multi-actor E2E should not prestart actor containers; the Playwright runner should spawn isolated real `fini-app` processes [[sources/2026-05-27-runner-owned-multi-actor-e2e-plan]].
- Actor isolation still needs separate app data, socket, hostname, and ports [[sources/2026-05-27-runner-owned-multi-actor-e2e-plan]].
- Existing `actorA` / `actorB` fixture API should remain stable where possible while lifecycle moves inward [[sources/2026-05-27-runner-owned-multi-actor-e2e-plan]].

## Open questions

- Historical implementation questions are answered by the implementation result source [[sources/2026-05-28-runner-owned-e2e-implementation-result]].

## Related pages

- [[e2e-testing]]
- [[CLI]]

updates:: [[pages/concepts/e2e-testing]]
