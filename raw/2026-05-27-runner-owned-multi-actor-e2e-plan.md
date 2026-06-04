# Runner-Owned Multi-Actor E2E Plan

Date: 2026-05-27
Status: raw capture
Related: `../fini/specs/e2e/actors/fixtures.ts`, `../fini/specs/e2e/actors/tests/*`, `../fini/Dockerfile`, `../fini/Makefile`, `../fini/src-tauri/Cargo.toml`, `../fini/README.md`, `pages/concepts/e2e-testing.md`, `pages/concepts/github-actions-pipelines.md`

## Context

The current repo and wiki describe multi-device E2E as Playwright plus actor containers, but that model has become ambiguous against the binary split and the observed CI failure.

The user clarified the intended contract:

- `fini` is CLI-only.
- `fini-app` is the GUI binary.
- Multi-actor E2E should not prestart actor containers.
- The Playwright runner should own actor lifecycle and start multiple real `fini-app` processes itself.

This note captures the agreed direction before implementation.

## Summary

The previous actor-container topology is superseded for the active E2E path.
The new shape is one E2E runner container that starts `actor-a`, `actor-b`, and later `actor-c+` as separate GUI app processes, each with isolated app data, socket, hostname, and ports.

The runner connects to each actor through the Tauri Playwright plugin socket and keeps the existing `actorA` / `actorB` fixture shape so current tests can keep their API while the lifecycle moves inward.

This is simpler than prestarted containers because the orchestration authority and the test authority are the same process tree: Playwright starts, waits for, talks to, and cleans up the app actors.

## Decisions

- Use one runner container for CI E2E.
- Spawn multiple real `fini-app` processes from the Playwright actor fixture.
- Keep `fini` as the CLI binary and `fini-app` as the GUI binary.
- Keep actor isolation via process, data dir, socket, hostname, and ports.
- Keep the `actors` Playwright project and fixture API stable where possible.
- Treat the old actor-container architecture as superseded documentation.

## Plan

1. Update the E2E actor fixture to own process lifecycle.
2. Build the E2E runner image with the GUI binary and test dependencies.
3. Make the Tauri build explicitly produce the GUI binary for E2E.
4. Preserve current Playwright test entrypoints and actor fixture names.
5. Update repo docs and skills so the new contract is explicit.
6. Verify binary selection and actor startup before full E2E reruns.
7. Re-run the release preflight only after the actor model is stable.

## Evidence

- Repo inspection shows the current actor fixture waits for sockets and then connects with `PluginClient`, but startup is still external to Playwright.
- `specs/e2e/actors/start-actor.sh` currently execs `/usr/local/bin/fini-app` inside actor containers.
- `podman run --rm --entrypoint /usr/local/bin/fini-app fini-e2e-actor-ci --help` printed `Fini CLI` during investigation, proving the wrong binary landed at the GUI path.
- `src-tauri/Cargo.toml` now has explicit `fini` and `fini-app` bins, so build selection must be explicit in the E2E path.
- Wiki sources currently still describe the older actor-container architecture and must be updated after implementation.

## Open Questions

- Whether the runner should use one shared Xvfb display for all actors in CI.
- Whether `pr-gate-e2e-*` Make targets should remain compatibility wrappers or be simplified more aggressively.
- Whether the current `e2e-actor` Docker target should be retained temporarily or removed once the runner-owned path is green.
