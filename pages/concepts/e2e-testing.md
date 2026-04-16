---
title: E2E Testing
type: concept
created: 2026-04-12
updated: 2026-04-12
sources: [2026-03-22-e2e-testing-prd]
tags: [fini, testing, e2e, playwright, tauri-driver, mcp]
---

# E2E Testing

The current testing proposal is intentionally staged and pragmatic: validate the MCP contract first, add minimal browser smoke flows second, and keep native desktop checks narrow and late [[sources/2026-03-22-e2e-testing-prd]].

## Selected approach

- Use Playwright Test as the main runner and orchestration layer [[sources/2026-03-22-e2e-testing-prd]].
- Spawn `fini mcp` over stdio for contract e2e tests and assert structured JSON responses [[sources/2026-03-22-e2e-testing-prd]].
- Add small browser smoke coverage for create quest, set Main/Focus, complete quest, and history visibility [[sources/2026-03-22-e2e-testing-prd]].
- Add `tauri-driver` only as a narrow native-runtime backstop [[sources/2026-03-22-e2e-testing-prd]].

## Prioritization

- MCP e2e is the first required lane because contract drift can silently break clients [[sources/2026-03-22-e2e-testing-prd]].
- UI and native desktop lanes are useful, but the PRD keeps them intentionally small and lower priority [[sources/2026-03-22-e2e-testing-prd]].
- Agentic exploratory testing is explicitly advisory until proven stable [[sources/2026-03-22-e2e-testing-prd]].
