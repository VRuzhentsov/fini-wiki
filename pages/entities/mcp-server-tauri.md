---
title: MCP Server Tauri
type: entity
created: 2026-04-12
updated: 2026-04-12
sources: [2026-04-12-mcp-server-tauri-github]
tags: [tauri, mcp, automation, plugin, ai-tooling]
---

# MCP Server Tauri

`MCP Server Tauri` is a developer toolchain for Tauri v2 applications that pairs a Node/TypeScript MCP server with a Rust `MCP Bridge` plugin inside the target Tauri app [[sources/2026-04-12-mcp-server-tauri-github]].

The repo's pitch is not generic browser automation. It is **Tauri-native AI automation**: an assistant can inspect screenshots, DOM structure, logs, windows, IPC calls, backend state, and mobile simulator/device availability from a running Tauri app, then act on that app through Tauri-specific tools [[sources/2026-04-12-mcp-server-tauri-github]].

## Architecture

- AI assistant talks to the MCP server over stdio [[sources/2026-04-12-mcp-server-tauri-github]].
- MCP server runs in Node.js and exposes the user-facing tool surface [[sources/2026-04-12-mcp-server-tauri-github]].
- The target Tauri app hosts a Rust `MCP Bridge Plugin` that exposes webview, IPC, and backend hooks over websocket [[sources/2026-04-12-mcp-server-tauri-github]].
- The README's example session uses port `9223` for the automation websocket path [[sources/2026-04-12-mcp-server-tauri-github]].

## Tool categories

The README groups the capabilities into a few clear buckets [[sources/2026-04-12-mcp-server-tauri-github]]:

- Setup and configuration
- UI automation for the webview
- IPC and backend inspection
- Log collection
- Window management
- Mobile device/simulator listing

The published tool list is broad enough to support both debugging and end-to-end interaction flows, especially when the assistant needs Tauri-specific state rather than just DOM access.

## Setup model

The expected adoption path is two-step [[sources/2026-04-12-mcp-server-tauri-github]]:

1. Install the MCP server into an AI client such as Claude Code, Cursor, Windsurf, VS Code, Cline, Zed, Goose, Warp, or Codex.
2. Add the bridge plugin to a Tauri app, ideally through an assistant-guided setup flow rather than manual edits.

This is an interesting product choice: the README treats the assistant not just as a consumer of the tools but as the primary installer and operator of the bridge.

## Repo shape

The monorepo includes [[sources/2026-04-12-mcp-server-tauri-github]]:

- `packages/mcp-server/` — MCP server implementation
- `packages/tauri-plugin-mcp-bridge/` — Tauri bridge plugin
- `packages/test-app/` — test Tauri application
- `docs/` — documentation site
- `specs/` — architecture/release specs

## Why it matters

For this wiki, the project is a concrete example of the Tauri ecosystem moving beyond app frameworks into **AI-native developer tooling**. It builds directly on concepts already central to Tauri such as [[tauri-ipc]], plugin extensibility, and cross-platform webview control, but applies them to developer automation instead of end-user product features [[sources/2026-04-12-mcp-server-tauri-github]].

## Open questions

> [!question] How much of the tool surface depends on the custom bridge plugin versus stable upstream Tauri APIs?

> [!question] What are the main limitations relative to browser-first automation stacks like Playwright when debugging hybrid Tauri apps?
