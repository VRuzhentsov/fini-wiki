---
title: E2E Testing Stack PRD (Low Priority)
type: source
created: 2026-04-12
updated: 2026-04-12
sources: [2026-03-22-e2e-testing-prd]
tags: [fini, testing, e2e, playwright, tauri-driver, mcp]
---

# E2E Testing Stack PRD (Low Priority)

Draft testing strategy for Fini after the backend and MCP foundation stabilized. The proposal is intentionally staged: build deterministic MCP contract coverage first, add a small browser smoke lane second, then use `tauri-driver` for a narrow native runtime backstop. It also captures the naming transition from `Main` to `Focus` as an expected follow-up rather than a settled current-state contract.

## Key claims

- The selected strategy is a hybrid stack: Playwright plus a dedicated MCP stdio harness first, then a small native desktop lane through `tauri-driver`.
- MCP contract drift is treated as the highest-risk regression class.
- Fast CI should require Rust checks plus the MCP e2e lane; broader UI and desktop lanes can start optional or nightly.
- Required e2e lanes should not rely on retries to pass.
- The work is explicitly low priority and parallel to core feature delivery.

## Open questions

- none

## Related pages

- [[e2e-testing]]
- [[mcp-contract]]
- [[focus]]
