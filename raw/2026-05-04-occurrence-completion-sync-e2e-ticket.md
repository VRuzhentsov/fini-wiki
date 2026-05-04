# Occurrence Completion Sync E2E Ticket

Date: 2026-05-04

## Context

Created a GitHub issue to track an end-to-end test that verifies occurrence completion syncs across paired devices. The user explicitly asked to save this only in the Fini wiki raw folder and not in `~/Documents`.

## Summary

GitHub issue `VRuzhentsov/fini#19` tracks adding an E2E test that completes an occurrence on one device and verifies that the same occurrence is completed on the other paired device.

## Decisions

- Use a GitHub issue, not Jira.
- Save ticket context only to `../fini-wiki/raw/`.
- Do not create any local ticket note under `~/Documents`.

## Plan

- Implement an E2E test that starts with two paired devices or equivalent test clients.
- Load or create a shared occurrence visible on both devices.
- Complete the occurrence on device A.
- Assert that the same occurrence identity becomes completed on device B after sync.
- Keep the test narrow and add only the minimum harness support needed if the current E2E setup cannot model two paired devices.

## Evidence

- Created issue URL: `https://github.com/VRuzhentsov/fini/issues/19`
- Issue title: `Add E2E test for occurrence completion sync across paired devices`
- Issue type: `Task`
- Priority: `Medium`
- Accepted scope:
  - Start with two paired devices signed into the same account.
  - Create or load a quest/reminder occurrence visible on both devices.
  - Complete the occurrence on device A.
  - Verify the same occurrence is marked completed on device B after sync.
- Accepted criteria:
  - The test uses two paired devices or two test clients representing paired devices.
  - Completing an occurrence on device A causes the corresponding occurrence on device B to transition to completed without manual data repair.
  - The assertion checks the same occurrence identity, not just that any occurrence becomes completed.
  - The test is reliable in CI and accounts for expected sync propagation timing.
  - The test fails if device B continues to show the occurrence as incomplete.

## Open Questions

- Whether the current E2E harness already supports two paired devices cleanly, or needs a minimal extension.
