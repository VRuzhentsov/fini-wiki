# Split E2E CI Workflow Steps

Date: 2026-04-27

## Context

The GitHub Actions `E2E Tests` job currently exposes the full multi-actor E2E flow as one step:

```yaml
- name: Run E2E tests
  run: CONTAINER=docker make pr-gate-e2e
```

That makes the CI output too opaque. If the job fails, the UI does not immediately show whether the failure happened while building images, creating the Docker network, starting actors, waiting for actor sockets, running Playwright, printing logs, or cleaning up.

## Summary

Keep the one-command `make pr-gate-e2e` target for local convenience, but split GitHub Actions into named E2E phases backed by smaller Makefile targets.

This gives future failures a clear step name in GitHub Actions while keeping orchestration logic in one reusable place.

## Decisions

- Split the CI `E2E Tests` job into smaller named steps.
- Put the actual orchestration in Makefile targets, not long duplicated YAML shell blocks.
- Keep the aggregate `make pr-gate-e2e` target for local reproduction and quick full runs.
- Keep using `CONTAINER=docker` in GitHub Actions and `CONTAINER ?= podman` locally.
- Use stable CI resource names for the split flow, because GitHub runs one E2E job per workflow run.

## Plan

Add Makefile targets:

```text
pr-gate-e2e-build-actor
pr-gate-e2e-build-runner
pr-gate-e2e-network
pr-gate-e2e-start-actors
pr-gate-e2e-wait-actors
pr-gate-e2e-run
pr-gate-e2e-logs
pr-gate-e2e-cleanup
```

Update `pr-gate-e2e` to call those targets in order and run cleanup through a shell trap.

Update `.github/workflows/ci.yml` so the `E2E Tests` job has explicit steps:

```text
Build E2E actor image
Build E2E runner image
Create E2E network
Start E2E actors
Wait for E2E actors
Run Playwright E2E suite
Print actor logs on failure
Cleanup E2E containers
```

## Evidence

The current `E2E Tests` job is green, so the aggregate flow works. This change is about debuggability, not changing the test topology.

Current passing checks on PR #18:

- `Snyk Vulnerability Scan`
- `FE Unit Tests`
- `BE Unit Tests`
- `E2E Tests`

## Open Questions

- Whether release dry-run/tag workflows should also migrate away from the Dockerfile `test` stage to the split Makefile targets later.
- Whether future CI should upload Playwright traces/test-results as artifacts on E2E failure.
