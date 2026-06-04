# Fini Exposed MCP Cleanup Ticket Handoff

Date: 2026-05-27
Status: ticket handoff
Related: https://github.com/VRuzhentsov/fini/issues/40

## Context

The user wants Fini to stop exposing MCP as a supported interface. They clarified that there are two different MCP meanings:

1. Fini's custom exposed MCP surface.
2. Tauri MCP/runtime-control tooling used to connect to or inspect the runtime artifact.

Only the first one is in scope. The Tauri/runtime-control tooling must stay untouched.

## Summary

The GitHub issue captures a cleanup task: remove Fini's exposed MCP from public code paths and active docs, while preserving CLI as the supported automation surface. The intent is to stop confusing AI agents that keep looking for MCP entrypoints.

## Decisions

- Remove or retire Fini's exposed MCP surface.
- Keep Tauri MCP/runtime-control tooling intact.
- Preserve the internal shared backend action logic if it still helps the CLI.
- Treat MCP references in active docs as either historical or superseded unless they refer to Tauri runtime-control tooling.

## Plan

- Implement the cleanup in the repo after the issue is picked up.
- Update active docs and wiki context so CLI is the only supported automation surface.
- Keep the runtime-control/E2E tooling path separate from Fini's exposed MCP.

## Evidence

- Repo inspection showed `src-tauri/src/services/cli.rs` still exposes `fini mcp`.
- `src-tauri/Cargo.toml` still includes `rmcp` and `tauri-plugin-mcp-bridge` in `cli-plane`.
- `specs/cli/README.md` still says `cli-plane` owns MCP stdio server mode.
- Wiki context still contained active MCP guidance in `pages/concepts/CLI.md`, `pages/concepts/mcp-contract.md`, and `_hot.md`.
- User clarified the scope: only Fini's exposed MCP should be removed; Tauri MCP/runtime-control should not be touched.

## Open Questions

- Should the internal shared service module be renamed to remove MCP wording, or is a narrower surface cleanup enough?
- Which remaining MCP references, if any, should stay in the repo as historical documentation versus being removed entirely?
