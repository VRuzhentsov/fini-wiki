# Runner-Owned E2E Implementation Result

Date: 2026-05-28
Status: implementation result
Related: GitHub issue `VRuzhentsov/fini#6`, `raw/2026-05-27-runner-owned-multi-actor-e2e-plan.md`, `../fini/specs/e2e/actors/fixtures.ts`, `../fini/Dockerfile`, `../fini/Makefile`, `../fini/src-tauri/Cargo.toml`

## Context

Issue `#6` tracks the E2E testing setup baseline. The previous E2E architecture depended on prestarted actor containers and had drifted from the binary-plane contract: `fini` should be CLI-only and `fini-app` should be the desktop GUI binary.

The implementation follows the 2026-05-27 runner-owned plan: the Playwright runner now owns multi-actor process lifecycle and starts isolated real `fini-app` processes itself.

## Summary

The Fini repo now has a cleaner split between CLI, GUI, production runtime, and test-only E2E control surfaces.

`fini` is built as a CLI-only binary using `cli-plane`; `fini-app` is built as the desktop GUI binary using `ui-plane`. E2E-only Playwright permissions are isolated in a separate capability file so production capabilities do not include `playwright:default`.

Multi-actor E2E no longer requires separate actor containers. The Playwright actor fixture spawns and owns multiple real GUI app processes, with per-actor app data directories, socket paths, hostnames, discovery ports, sync WebSocket ports, logs, and cleanup.

## Decisions

- Keep `fini` CLI-only and `fini-app` GUI-only.
- Keep production `src-tauri/capabilities/default.json` free of `playwright:default`.
- Add `src-tauri/e2e-capabilities/default.json` for test-only Playwright control.
- Keep Makefile E2E phase names for CI/debug compatibility while moving actor lifecycle into the runner.
- Keep the old `e2e-actor` Docker target as a compatibility alias of the runner image.
- Use `make pre-release-check` as the single traceable local release-quality gate.

## Changed Files

- `src-tauri/Cargo.toml`: explicit bins with `autobins = false`, `default-run = "fini-app"`, `fini` at `src/bin/fini.rs`, and `fini-app` at `src/main.rs`.
- `src-tauri/src/main.rs`: GUI entrypoint that calls `fini_lib::run()`.
- `src-tauri/src/bin/fini.rs`: CLI entrypoint that exits with `fini_lib::run_cli()`.
- `src-tauri/src/bin/fini-app.rs`: deleted stale GUI wrapper.
- `src-tauri/e2e-capabilities/default.json`: new E2E-only capability including `playwright:default`.
- `src-tauri/capabilities/default.json`: remains production-safe without Playwright permission.
- `specs/e2e/actors/fixtures.ts`: now owns actor spawn, socket wait, plugin connection, logs, teardown, artifact preservation on failure, and `actorA`/`actorB` compatibility.
- `specs/e2e/actors/start-actor.sh`: deleted because external actor-container startup is superseded.
- `specs/e2e/ui/fixtures.ts`: uses npm-owned Tauri commands and bounded Linux timeout around prebuilt GUI binaries.
- `Dockerfile`: builds GUI E2E binary through Tauri with E2E capabilities, builds CLI separately, moves runner startup to script, adds basic npm/apt cache mounts, and keeps `e2e-actor` as compatibility alias.
- `scripts/e2e-runner.sh`: starts Xvfb and runs `npm run test:e2e:ci` inside the runner image.
- `Makefile`: adds container-engine auto-detection, runner-owned E2E phases, `pre-release-check`, runtime smoke integration, and removes the old `FINI_RELEASE_LOCAL_CI_PASSED` release bypass.
- `README.md`, `src-tauri/README.md`, `specs/cli/README.md`: document the split-binary contract.
- `.agents/skills/fini-release/SKILL.md`, `.agents/skills/fini-test/SKILL.md`: update agent workflow guidance for the new E2E/release contract.

## Evidence

- `make pre-release-check` passed locally.
- Log path: `/var/tmp/fini-pre-release/pre-release-check-20260528T013945Z.log`.
- Containerized full E2E passed: `29 passed (1.4m)`.
- `npm run test:unit` passed: `48 passed`.
- `cargo test --manifest-path src-tauri/Cargo.toml` passed: `64 passed`.
- CLI E2E project passed: `8 passed`.
- `git diff --check` passed.
- `make -qp >/dev/null` passed.

## Open Questions

- The durable wiki concept pages still contain older actor-container wording and should be ingested/updated in a separate wiki maintenance pass if the user wants wiki pages refreshed beyond this raw capture.
- CI will provide final GitHub-hosted confirmation after the PR is opened.
