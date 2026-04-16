---
title: MCP TypeScript SDK
type: entity
created: 2026-04-12
updated: 2026-04-12
sources: [2026-04-12-modelcontextprotocol-typescript-sdk-v1x]
tags: [mcp, typescript, sdk, protocols]
---

# MCP TypeScript SDK

The `MCP TypeScript SDK` is the official TypeScript implementation of the Model Context Protocol for building MCP servers and clients [[sources/2026-04-12-modelcontextprotocol-typescript-sdk-v1x]].

For this wiki, the important detail is version alignment: `mcp-server-tauri` currently depends on the older `@modelcontextprotocol/sdk` package line, so the `v1.x` branch is the relevant upstream reference rather than the repo's `main` branch, which is already documenting the in-development v2 split-package shape [[sources/2026-04-12-modelcontextprotocol-typescript-sdk-v1x]].

## Core role

- Defines the MCP server/client abstraction used by TypeScript implementations [[sources/2026-04-12-modelcontextprotocol-typescript-sdk-v1x]].
- Supports transports like `stdio` and Streamable HTTP [[sources/2026-04-12-modelcontextprotocol-typescript-sdk-v1x]].
- Uses `zod` as a required validation dependency in the relevant v1 package line [[sources/2026-04-12-modelcontextprotocol-typescript-sdk-v1x]].

## Why it matters here

`mcp-server-tauri` is not just inspired by MCP; it is implemented on top of this SDK. That makes the SDK one of the most foundational external dependencies in the repo's Node side, alongside transport and schema libraries [[sources/2026-04-12-modelcontextprotocol-typescript-sdk-v1x]].
