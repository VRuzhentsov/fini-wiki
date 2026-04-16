---
title: Tauri Mobile Support
type: concept
created: 2026-04-12
updated: 2026-04-12
sources: [2024-10-14-tauri-2-released]
tags: [tauri, mobile, ios, android, cross-platform]
---

# Tauri Mobile Support

Native iOS and Android support is the headline feature of [[tauri]]
2.0. Before 2.0, Tauri was desktop-only (macOS, Linux, Windows); the
2.0 release extends the same "web frontend + native backend" model
to mobile.

## What "native" means here

Per [[sources/2024-10-14-tauri-2-released]], 2.0 introduces a new
**mobile plugin system** that exposes application logic to the Tauri
frontend. Concretely, this means:

- The frontend is still a WebView-rendered web app (the OS WebView
  on each platform — WKWebView on iOS, Android WebView on Android).
- Native backends can be written in **Swift** (iOS) or **Kotlin**
  (Android) in addition to Rust, and exposed to the frontend through
  the [[tauri-plugin-system]]'s annotation-based mechanism.
- Existing Rust logic from a desktop Tauri app is reusable on mobile
  without a rewrite — the source frames "seamlessly reuse existing
  logic code" as a key advantage.

## Developer experience

- **HMR on mobile.** Hot module replacement (see [[tauri-hmr]]) was
  extended to cover physical mobile devices and emulators, so changes
  can be previewed without a full rebuild cycle.
- **Scaffolding.** The `create-tauri-app` tool (see
  [[create-tauri-app]]) handles initial project setup, including mobile
  targets.

## Significance

Mobile support reframes Tauri from "lightweight Electron alternative"
into "one framework from desktop to mobile". In the broader
cross-platform landscape this puts it in more direct competition with
Flutter, React Native, and .NET MAUI — though the WebView-based
rendering model is a distinctly different trade-off from those.

## Open questions

> [!question] Which shipping iOS/Android apps actually use Tauri 2.0
> mobile in production? The announcement asserts readiness but doesn't
> cite case studies.

> [!question] How does the WebView-based mobile rendering compare in
> practice to React Native's native components or Flutter's Skia
> rendering — particularly on low-end Android?

> [!question] What's the App Store / Play Store review experience
> like for Tauri mobile apps? Any known issues with the WebView+Rust
> binary combination?

## Related

- [[tauri]]
- [[tauri-plugin-system]] — mechanism for exposing native mobile code.
- [[tauri-hmr]] — mobile HMR specifics.
- [[create-tauri-app]] — scaffolder that bootstraps mobile targets.
- [[webview-desktop-apps]] — the underlying rendering pattern.
