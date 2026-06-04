# MCP Surface Decision

Date: 2026-05-28
Status: raw capture
Related: PR #41, issue #6, CLI feature-plane work, `src-tauri/src/services/mcp.rs`, `src-tauri/devtools-capabilities/default.json`

## Context

There are two different MCP meanings in current Fini discussions, and mixing them caused review confusion.

## Decision

Fini is dropping the user-facing/exposed MCP surface that was originally planned as a product automation contract.

The supported automation surface is the `fini` CLI. Future implementation and documentation should prefer CLI commands over exposed MCP tools for user-facing automation, scripting, and agent access.

The devtools MCP-style access used to connect to a dev build is a separate thing. It belongs to the development/testing control plane enabled by the `devtools` feature and devtools capabilities. It is not the product automation API and should not be used as evidence that Fini still intends to expose MCP as a user-facing contract.

## Terminology

- Exposed/product MCP: abandoned. This was the originally planned external MCP contract. It should be removed or treated as deprecated dead scope.
- Devtools MCP/dev-build control: retained for development and E2E automation. This is part of `devtools`, not a product feature plane.
- CLI: retained and preferred. This is the supported synchronous automation surface.

## Implications

- Issue #6 and older E2E PRD references to MCP stdio contract tests are historical/superseded by the CLI direction.
- Future reviews should not require a product MCP stdio E2E lane unless a new decision reintroduces exposed MCP.
- If code still exposes `fini mcp` or product MCP tooling, follow-up work should remove it rather than expand it.
- Documentation should clearly separate devtools control affordances from product/user automation surfaces.

## Evidence

- User clarified on 2026-05-28 that the first MCP type, originally intended for exposure, is abandoned in favor of CLI.
- User clarified that the second MCP type is dev-build/devtools access and remains conceptually separate.
- Current repo has CLI feature-plane work and devtools capability files, which should be interpreted through this distinction.

## Open Questions

- Which PR should delete the abandoned exposed MCP code path, if any still remains?
- Should the old issue #6 acceptance criteria be explicitly superseded/closed with a note pointing to this decision?
