---
title: 2026-05-04 Occurrence Completion Sync E2E Ticket
type: source
created: 2026-05-04
updated: 2026-05-04
sources: [2026-05-04-occurrence-completion-sync-e2e-ticket]
tags: [fini, e2e, quest-occurrence, sync, testing, ticket]
---

# 2026-05-04 Occurrence Completion Sync E2E Ticket

Issue `VRuzhentsov/fini#19` tracks a narrow paired-device E2E test: complete an occurrence on device A and verify that the same occurrence identity becomes completed on device B after sync [[sources/2026-05-04-occurrence-completion-sync-e2e-ticket]].

## Key claims

- Use a GitHub issue, not Jira, and keep ticket context only in `../fini-wiki/raw/` [[sources/2026-05-04-occurrence-completion-sync-e2e-ticket]].
- The planned test should start with two paired devices or equivalent paired test clients [[sources/2026-05-04-occurrence-completion-sync-e2e-ticket]].
- The test must create or load a shared occurrence visible on both devices, complete it on device A, and verify the same occurrence identity is completed on device B after sync [[sources/2026-05-04-occurrence-completion-sync-e2e-ticket]].
- Reliability requirement: the test should work in CI and account for expected sync propagation timing [[sources/2026-05-04-occurrence-completion-sync-e2e-ticket]].
- Issue created: `https://github.com/VRuzhentsov/fini/issues/19` [[sources/2026-05-04-occurrence-completion-sync-e2e-ticket]].

## Open questions

- Whether the current E2E harness already supports two paired devices cleanly, or needs a minimal extension [[sources/2026-05-04-occurrence-completion-sync-e2e-ticket]].

## Related pages

- [[QuestOccurrence]]
- [[e2e-testing]]
- [[SpaceSync]]
