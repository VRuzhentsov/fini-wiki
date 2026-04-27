---
title: 2026-04-27 Split E2E CI Workflow Steps
type: source
created: 2026-04-27
updated: 2026-04-27
sources: [2026-04-27-split-e2e-ci-workflow-steps]
tags: [fini, github-actions, ci, e2e, makefile, playwright]
---

# 2026-04-27 Split E2E CI Workflow Steps

Decision note for making GitHub Actions E2E failures easier to diagnose. The aggregate `make pr-gate-e2e` target remains for local convenience, but CI should expose named phases backed by smaller Makefile targets.

## Key claims

- Current CI exposes the whole multi-actor E2E flow as one opaque step: `CONTAINER=docker make pr-gate-e2e` [[sources/2026-04-27-split-e2e-ci-workflow-steps]].
- Keep `make pr-gate-e2e` for local reproduction, but split GitHub Actions into named phases [[sources/2026-04-27-split-e2e-ci-workflow-steps]].
- Put orchestration in Makefile targets, not duplicated long YAML shell blocks [[sources/2026-04-27-split-e2e-ci-workflow-steps]].
- Use `CONTAINER=docker` in GitHub Actions and `CONTAINER ?= podman` locally [[sources/2026-04-27-split-e2e-ci-workflow-steps]].
- CI steps should expose build actor, build runner, create network, start actors, wait actors, run Playwright, print logs, and cleanup [[sources/2026-04-27-split-e2e-ci-workflow-steps]].
- The current PR #18 checks are green, so this is a debuggability change rather than a topology change [[sources/2026-04-27-split-e2e-ci-workflow-steps]].

## Open questions

- Whether release dry-run/tag workflows should later migrate away from the Dockerfile `test` stage to split Makefile targets [[sources/2026-04-27-split-e2e-ci-workflow-steps]].
- Whether future CI should upload Playwright traces or test results as artifacts on E2E failure [[sources/2026-04-27-split-e2e-ci-workflow-steps]].

## Related pages

- [[e2e-testing]]
- [[github-actions-pipelines]]
- [[pages/tooling/github-actions]]
