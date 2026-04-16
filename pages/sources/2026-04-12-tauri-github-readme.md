---
title: Tauri GitHub README
type: source
created: 2026-04-12
updated: 2026-04-12
sources: [2026-04-12-tauri-github-readme]
tags: [tauri, rust, github, framework, webview]
---

# Tauri GitHub README

GitHub README snapshot for the core `tauri-apps/tauri` repository. Compared with the earlier Medium source already in the wiki, this source is less promotional and more architectural: it states Tauri's cross-platform scope, Rust-backed backend model, system-webview rendering stack, and the surrounding libraries (`tao` and `wry`) used to provide windows and webviews [[sources/2026-04-12-tauri-github-readme]].

**Repository:** https://github.com/tauri-apps/tauri

**Homepage:** https://tauri.app

**Default branch observed:** `dev`

## Key claims

- Tauri is a framework for building small, fast desktop and mobile applications with a web frontend and a Rust backend.
- It uses `tao` for window handling across supported platforms.
- It uses `wry` as the unified system-webview layer, mapping to WKWebView, WebView2, WebKitGTK, and Android WebView.
- It includes features like bundling, self-updater support, notifications, system tray support, and CI integrations.
- It supports Windows, macOS, Linux, iOS, and Android, with platform-specific version constraints.

## Why it matters for `mcp-server-tauri`

- The `tauri-plugin-mcp-bridge` crate is a Tauri plugin, so Tauri is the Rust host runtime that exposes the plugin lifecycle, app/window access, and webview integration points.
- The repo's automation story only makes sense because Tauri apps expose both a Rust backend and a webview frontend in one host framework.

## Open questions

- Which Tauri APIs does `mcp-server-tauri` rely on most directly: plugin hooks, window/webview handles, IPC/event APIs, or all of the above?

## Related pages

- [[tauri]]
- [[mcp-server-tauri]]
- [[tauri-ipc]]
