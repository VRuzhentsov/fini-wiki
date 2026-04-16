---
title: MCP Server Tauri GitHub Repository
type: source
created: 2026-04-12
updated: 2026-04-12
sources: [2026-04-12-mcp-server-tauri-github]
tags: [tauri, mcp, automation, github, plugin, tooling]
---

# MCP Server Tauri GitHub Repository

GitHub repository and README snapshot for `hypothesi/mcp-server-tauri`, a Tauri v2 automation toolchain built around an MCP server plus a Tauri bridge plugin. The repo pitches itself as a way to give AI assistants direct visibility into a running Tauri app through screenshots, DOM state, logs, IPC inspection, and webview interaction tools, without relying on external browser-driver stacks [[sources/2026-04-12-mcp-server-tauri-github]].

**Repository:** https://github.com/hypothesi/mcp-server-tauri

**Homepage/docs:** https://hypothesi.github.io/mcp-server-tauri/

**Owner:** hypothesi

**Primary language:** TypeScript

**License:** MIT

**Observed repo signals on 2026-04-12:**

- 164 stars
- 24 forks
- public repository
- default branch: `main`
- topics: `automation`, `cli`, `gemini-cli-extension`, `mcp`, `tauri`, `tauri-v2`

## Key claims

- The project combines an MCP server with a Rust-based Tauri bridge plugin for Tauri v2 development.
- The main value proposition is Tauri-specific automation and debugging context for AI assistants: screenshots, DOM state, logs, IPC calls, backend state, and direct UI interaction.
- Setup is optimized for assistant-led workflows: install the MCP server into a supported client, then let the assistant inspect and configure the Tauri bridge plugin.
- The tool surface spans setup/configuration, UI automation, IPC monitoring, log reading, window management, and mobile device listing.
- The monorepo includes a TypeScript MCP server package, a Rust plugin package, a test app, docs, and architecture specs.

## Open questions

- How stable is the tool surface across releases, especially for assistant-facing slash commands and setup workflows?
- How mature is the plugin on real production Tauri apps versus the included test app and docs examples?

## Related pages

- [[mcp-server-tauri]]
- [[tauri]]
- [[tauri-ipc]]
