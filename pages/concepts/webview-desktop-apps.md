---
title: WebView-based Desktop Apps
type: concept
created: 2026-04-12
updated: 2026-04-12
sources: [2024-10-14-tauri-2-released]
tags: [desktop, webview, architecture, cross-platform]
---

# WebView-based Desktop Apps

Architectural pattern where a desktop (or mobile) application renders
its UI inside a WebView using standard web technologies
(HTML/CSS/JavaScript) and communicates with a native backend process
for OS-level work. The frontend is "just a web app"; the native side
handles filesystem, networking, windowing, and platform APIs.

## Two dominant variants

- **Bundled engine** — ship a full browser engine with the app.
  [[electron]] is the archetype: every app carries its own Chromium
  + Node.js. Consistent rendering across platforms at the cost of
  binary size and memory footprint.
- **Platform WebView** — reuse the OS-provided WebView (WKWebView on
  macOS/iOS, WebView2 on Windows, WebKitGTK on Linux, Android
  WebView). [[tauri]] is the prominent example. Much smaller binaries
  and lower memory use, at the cost of rendering differences between
  platforms and dependence on OS update cadence.

## Trade-offs

| Axis | Bundled engine | Platform WebView |
|---|---|---|
| Binary size | Large (~100MB+) | Small (often <10MB) |
| Rendering consistency | High | Platform-dependent |
| Memory footprint | High | Lower |
| Update control | Ship engine updates with app | Tied to OS |
| Native API access | Via Node.js + addons | Via host language (Rust/Swift/Kotlin in Tauri) |

> [!question] This table is derived from the general framing in
> [[sources/2024-10-14-tauri-2-released]] and common knowledge — it
> needs a concrete benchmark source before any of the numbers should
> be trusted as authoritative.

## Related

- [[tauri]] — platform-WebView approach, Rust backend.
- [[electron]] — bundled-engine approach, Node.js backend.
- [[tauri-ipc]] — how the frontend and backend communicate in Tauri's
  take on this pattern.
