---
title: Tauri
type: entity
created: 2026-04-12
updated: 2026-04-12
sources: [2024-10-14-tauri-2-released, 2026-04-12-tauri-github-readme]
tags: [framework, rust, cross-platform, desktop, mobile, webview]
---

# Tauri

Tauri is a cross-platform application framework for building
lightweight binaries with a web-technology frontend running in the OS
WebView and a backend written primarily in [[rust]] (with Swift and
Kotlin available for native mobile code). It targets macOS, Linux,
Windows, iOS, and Android [[sources/2024-10-14-tauri-2-released]] [[sources/2026-04-12-tauri-github-readme]].

Developers don't need to know Rust/Swift/Kotlin to ship a Tauri app —
the framework exposes rich JavaScript APIs to the frontend — but
having those backends available is what distinguishes it from
pure-webview wrappers.

**The Rust core is the point.** Tauri's entire value proposition —
small binaries, low memory use, fast startup, efficient IPC — is
downstream of the language choice. Rust compiles to native code with
no GC and no bundled runtime, which is why a Tauri app can be
single-digit megabytes where an [[electron]] app ships tens to
hundreds of megabytes of Chromium + Node.js. It's also why the
rewritten [[tauri-ipc]] layer can move raw byte buffers between the
core and the WebView without the serialization tax a GC'd backend
would incur. Any time this wiki references Tauri being "lightweight"
or "fast", the causal chain runs back to [[rust]]. See
[[webview-desktop-apps]] for the broader pattern and its trade-offs.

## When Tauri is the right fit

The [[sources/2024-10-14-tauri-2-released]] article enumerates the
audience Tauri explicitly targets:

- Teams who want **one UI codebase across all platforms** (Windows,
  macOS, Linux, Android, iOS).
- Teams chasing **maximum platform reach**.
- **Frontend web developers** who want to ship native apps without
  learning a native toolchain deeply.
- **Rust developers** who want to write visually polished, fully-Rust
  applications.
- Existing **web teams** expanding into native with low upfront
  investment.
- Existing **Rust teams** wanting end-to-end Rust codebases.

The unifying thread: Tauri tries to minimize the "new skill required"
tax for teams that already have either a web stack or a Rust stack
in place.

## Architecture at a glance

The upstream Tauri README adds some concrete implementation detail to the higher-level 2.0 release framing already in this wiki [[sources/2026-04-12-tauri-github-readme]].

- **Frontend** — any web stack (HTML/JS/CSS, React, Svelte, Vue,
  Solid, etc.) rendered in the platform WebView (WKWebView on
  macOS/iOS, WebView2 on Windows, WebKitGTK on Linux, Android
  WebView on Android).
- **Core** — a Rust process hosting the app, managing windows, and
  exposing commands to the frontend via [[tauri-ipc]].
- **Plugins** — extend core with official or user-written modules;
  since 2.0, plugins can expose Swift/Kotlin code through annotations
  for native iOS/Android integration. See [[tauri-plugin-system]].
- **Security** — access to OS resources is gated by the
  [[tauri-permission-system]] (2.0+), which replaces the 1.x
  allowlist with a permission/scope/ability model that resembles
  [[capability-based-security]].
- **Distribution** — 2.0 bundles first-class guidance for five
  distribution channels; see [[tauri-distribution]].

The GitHub README also names two important lower-level libraries that make the framework work:

- `tao` for cross-platform window handling [[sources/2026-04-12-tauri-github-readme]].
- `wry` for the unified system-webview abstraction over WKWebView, WebView2, WebKitGTK, and Android WebView [[sources/2026-04-12-tauri-github-readme]].

## Release history

- **1.0** — June 2022. Desktop only (macOS, Linux, Windows). First
  stable release; reshaped the lightweight cross-platform desktop
  niche.
- **2.0 alpha** — late 2022. First public cut of the 2.0 architecture,
  primarily to validate the mobile interaction model.
- **2.0 beta** — February 2024. Audited by an external security firm
  (scope of the audit not specified in the source).
- **2.0 RC** — August 2024. Focus on fixing major bugs and gathering
  real-world feedback.
- **2.0 stable** — October 2024. Headline features: native
  [[tauri-mobile-support]], rewritten [[tauri-ipc]], restructured
  [[tauri-plugin-system]], new [[tauri-permission-system]],
  [[tauri-hmr]] on mobile, [[create-tauri-app]] scaffolder,
  [[tauri-1-to-2-migration]] CLI, [[tauri-distribution]] guidance.

## 2.0 headline features

Grouped for quick scan, each with a dedicated concept page:

| Feature | Page | What changed |
|---|---|---|
| Native mobile | [[tauri-mobile-support]] | iOS + Android with shared Rust code |
| IPC rewrite | [[tauri-ipc]] | Raw payloads/requests for efficient large-data transfer |
| Plugin system | [[tauri-plugin-system]] | Core features moved out, Swift/Kotlin via annotations |
| Permissions | [[tauri-permission-system]] | Allowlist replaced with permission/scope/ability |
| HMR on mobile | [[tauri-hmr]] | Hot reload extended to devices and emulators |
| Scaffolder | [[create-tauri-app]] | One-command project bootstrap |
| Migration | [[tauri-1-to-2-migration]] | `tauri migrate` automates most upgrade work |
| Distribution | [[tauri-distribution]] | First-class guidance for 5 distribution channels |

## Community signals (as of 2024-10)

Per [[sources/2024-10-14-tauri-2-released]]:

- ~4,878 pull requests on GitHub
- ~3,570 closed issues
- ~1,000 discussions
- ~17,700 Discord members

Treat these as marketing figures from the announcement, not
independently verified. [[awesome-tauri]] is the officially-maintained
curated list of projects built with it. See
[[tauri-core-contributors]] for the people named as driving the
project.

## Open questions

> [!question] How does Tauri's runtime footprint actually compare to
> [[electron]] in head-to-head benchmarks? The 2.0 announcement
> asserts the advantage but doesn't quantify it.

> [!question] Which shipped mobile apps use Tauri 2.0, and how mature
> is the iOS/Android story outside the announcement?

> [!question] What was the scope of the February 2024 external
> security audit, and is the report public?

> [!question] Current release beyond 2.0 — has Tauri cut a 2.x point
> release or started on 3.0 since October 2024? Needs a fresher
> source.
