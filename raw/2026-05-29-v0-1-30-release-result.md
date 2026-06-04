# v0.1.30 Release Result

Date: 2026-05-29
Status: implementation result
Related: Fini release `v0.1.30`, release commit `4044b723bcddbd82e927bf60e70bd399a0eed0c0`, source commit before release metadata `ec8336a02e2ca94d19f4088213f8c7a7027f102b`

## Context

After PR #41 was merged, the user requested a release from the latest state of the `main` branch and specifically required the release to follow the `fini-release` skill rule: release only from latest `origin/main`.

## Summary

Release `v0.1.30` was created from local `main` after fast-forwarding to match `origin/main` at `ec8336a02e2ca94d19f4088213f8c7a7027f102b`. The release command updated version metadata, committed `chore: release v0.1.30`, pushed `main`, created a signed annotated tag, pushed the tag, and triggered the release-tag workflow.

The GitHub release workflow completed successfully and published the stable release.

## Decisions

- Version chosen: `0.1.30`, the next patch after existing metadata/tag `0.1.29` / `v0.1.29`.
- Release entrypoint used: `make release VERSION=0.1.30`.
- No manual bypass was used for pre-release checks, version metadata commit, signed tag creation, or tag push.

## Plan

- No further release action is required for `v0.1.30`.
- Follow-up: the release workflow emitted Node.js 20 deprecation annotations for several GitHub Actions; update workflow actions/runtime before GitHub forces Node.js 24 if this becomes blocking.

## Evidence

- Local `main` matched `origin/main` before release: both resolved to `ec8336a02e2ca94d19f4088213f8c7a7027f102b`.
- Existing version before release: `0.1.29`; existing latest tag before release: `v0.1.29`.
- `v0.1.30` was absent locally and remotely before release.
- Local release command: `make release VERSION=0.1.30`.
- Local pre-release log: `/var/tmp/fini-pre-release/pre-release-check-20260529T153204Z.log`.
- Local pre-release gate passed, including E2E result: `32 passed (1.4m)`.
- Release metadata commit: `4044b72 chore: release v0.1.30`.
- Signed tag verification succeeded: `git tag -v v0.1.30` reported a good signature and the tag points to `4044b723bcddbd82e927bf60e70bd399a0eed0c0`.
- Remote tag evidence: `refs/tags/v0.1.30` exists and peels to `4044b723bcddbd82e927bf60e70bd399a0eed0c0`.
- GitHub Actions release run: `https://github.com/VRuzhentsov/fini/actions/runs/26647258683`, status `completed`, conclusion `success`.
- GitHub release: `https://github.com/VRuzhentsov/fini/releases/tag/v0.1.30`, stable, not draft, not prerelease, published at `2026-05-29T16:26:23Z`.
- Release workflow jobs succeeded: Validate Release Tag, Snyk scan, Signing Readiness, Quality Gates, Linux x64/arm64 artifacts, Windows x64/arm64 artifacts, Android artifact, Docker image publish/sign/attest, Play Internal upload, and Publish Stable Release.

## Open Questions

- The Node.js 20 GitHub Actions deprecation warnings should be tracked if not already covered by workflow maintenance work.
