# CLI Pairing Follow-Up Ticket

Date: 2026-05-28
Status: ticket handoff
Related: PR #41, issue #6, `src-tauri/src/services/cli.rs`, `src-tauri/src/services/device_connection/`, `src-tauri/src/services/space_sync/`

## Context

During PR #41 correction, CLI support for persisted paired-device CRUD and SpaceSync mapping/status commands was kept in scope because those are storage-backed core operations. Live device pairing over discovery/WebSocket was identified as separate follow-up work and should not be solved by the current feature-plane correction.

## Summary

Create a dedicated follow-up ticket for user-facing CLI live pairing support. The ticket should cover how `fini device` commands initiate, accept, complete, and inspect pairing without depending on the GUI, while preserving the current DeviceConnection and SpaceSync semantics.

## Proposed Ticket

Title: Support live device pairing from the Fini CLI

Labels: `feature`, `sync`, `cli`

## Problem / Goal

The CLI currently exposes core data and sync-management operations, but live pairing is still primarily a GUI/runtime workflow. Users and automation should eventually be able to pair devices from the CLI in a documented, testable way.

## Scope

- Define the CLI UX for live pairing commands, including discovery, send request, incoming requests, accept, complete, acknowledge, and status/debug output.
- Preserve the distinction between persisted paired-device CRUD and live pairing runtime state.
- Reuse existing DeviceConnection runtime and SpaceSync semantics instead of inventing a separate pairing transport.
- Add verification that proves two CLI/app runtimes can pair and then exchange SpaceSync state.

## Out Of Scope

- PR #41 feature-plane boundary correction.
- Replacing the existing GUI pairing flow.
- Changing SpaceSync consent semantics or mapped-space behavior.
- Broad feature-plane gating refactors around DeviceConnection internals.

## Acceptance Criteria

- A documented CLI command set supports live pairing without requiring manual GUI actions.
- CLI pairing can create a persisted paired-device relationship on both sides.
- After CLI pairing, SpaceSync mapping commands can operate against the paired peer.
- Failure states are observable from CLI output: no peers, expired request, wrong request/code, peer unavailable.
- Existing GUI pairing and actor E2E coverage remain green.

## Implementation Notes

- Likely areas: `src-tauri/src/services/cli.rs`, `src-tauri/src/services/device_connection/`, `src-tauri/src/services/space_sync/`, and `specs/e2e/feature-plane-cli.spec.ts` or a new multi-runtime CLI E2E.
- Prefer thin CLI adapters over existing DeviceConnection runtime functions.
- Do not add feature-plane gating as a workaround for warnings; structure the code so each build surface uses the code it owns.

## Verification

- CLI build with `cargo build --manifest-path src-tauri/Cargo.toml --bin fini --features cli-plane,devtools --message-format short`.
- UI build with `cargo build --manifest-path src-tauri/Cargo.toml --bin fini-app --features ui-plane,devtools --message-format short`.
- Targeted CLI/multi-runtime E2E proving pair then sync.
- Full pre-release gate before landing the implementation PR.

## Open Questions

- Should the CLI pairing UX be fully non-interactive flags-first, interactive prompt-based, or both?
- Should the pairing code be displayed and entered by humans, or can local automation use request IDs only in trusted test/dev modes?
