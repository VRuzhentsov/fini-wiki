---
title: MCP TypeScript SDK (`v1.x`) GitHub README
type: source
created: 2026-04-12
updated: 2026-04-12
sources: [2026-04-12-modelcontextprotocol-typescript-sdk-v1x]
tags: [mcp, typescript, sdk, github, protocols]
---

# MCP TypeScript SDK (`v1.x`) GitHub README

GitHub README and package metadata for `modelcontextprotocol/typescript-sdk`, specifically the `v1.x` branch because `hypothesi/mcp-server-tauri` depends on the older `@modelcontextprotocol/sdk` package rather than the split v2 package line on `main` [[sources/2026-04-12-modelcontextprotocol-typescript-sdk-v1x]].

**Repository:** https://github.com/modelcontextprotocol/typescript-sdk

**Relevant branch for this dependency:** `v1.x`

## Key claims

- The SDK implements the full Model Context Protocol in TypeScript.
- It supports building both MCP servers and MCP clients.
- It supports standard transports including `stdio` and Streamable HTTP.
- It has a required peer dependency on `zod` for schema validation.
- Its examples and docs cover tools, resources, prompts, sampling, elicitation, tasks, logging, and client/server usage.

## Why it matters for `mcp-server-tauri`

- `mcp-server-tauri` is an MCP server, so this SDK is the protocol foundation for its assistant-facing tool surface.
- The repo's schema-heavy tool definitions align directly with the SDK's `zod`-based validation model.

## Open questions

- When `mcp-server-tauri` upgrades off `@modelcontextprotocol/sdk`, does it move to the newer split server/client v2 package line or stay on the older surface longer?

## Related pages

- [[mcp-typescript-sdk]]
- [[mcp-server-tauri]]
