---
title: 2026-05-28 Runner Owned E2E Implementation Result
type: source
created: 2026-06-03
updated: 2026-06-03
sources: [2026-05-28-runner-owned-e2e-implementation-result]
tags: [fini, e2e, playwright, actors, ci, implementation]
claim_status: locked
evidence: source-backed
---

# 2026-05-28 Runner Owned E2E Implementation Result

This source records implementation of the runner-owned multi-actor E2E model. Playwright actor fixtures now spawn and own multiple real GUI `fini-app` processes, replacing prestarted actor containers as the active path [[sources/2026-05-28-runner-owned-e2e-implementation-result]].

## Key claims

- `fini` is CLI-only with `cli-plane`; `fini-app` is the desktop GUI binary with `ui-plane` [[sources/2026-05-28-runner-owned-e2e-implementation-result]].
- Production capabilities remain free of `playwright:default`; E2E uses a separate `src-tauri/e2e-capabilities/default.json` [[sources/2026-05-28-runner-owned-e2e-implementation-result]].
- Multi-actor E2E no longer requires separate actor containers; fixtures spawn actors with per-actor app data, sockets, hostnames, ports, logs, and cleanup [[sources/2026-05-28-runner-owned-e2e-implementation-result]].
- `make pre-release-check` is the single traceable local release-quality gate [[sources/2026-05-28-runner-owned-e2e-implementation-result]].
- Local evidence: `make pre-release-check` passed, containerized E2E passed `29 passed`, frontend unit tests passed `48 passed`, Rust tests passed `64 passed`, CLI E2E passed `8 passed`, and `git diff --check` passed [[sources/2026-05-28-runner-owned-e2e-implementation-result]].

## Open questions

- CI-hosted confirmation was deferred to PR checks in the source [[sources/2026-05-28-runner-owned-e2e-implementation-result]].

## Related pages

- [[e2e-testing]]
- [[CLI]]
- [[github-actions-pipelines]]

updates:: [[pages/concepts/e2e-testing]]
updates:: [[pages/concepts/github-actions-pipelines]]
supersedes:: [[pages/sources/2026-05-27-runner-owned-multi-actor-e2e-plan]]
