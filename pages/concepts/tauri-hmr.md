---
title: Tauri Hot Module Replacement
type: concept
created: 2026-04-12
updated: 2026-04-12
sources: [2024-10-14-tauri-2-released]
tags: [tauri, hmr, developer-experience, mobile]
---

# Tauri Hot Module Replacement

Hot Module Replacement (HMR) lets developers preview frontend changes
in a running [[tauri]] app without restarting the process or
rebuilding the Rust core. The frontend WebView hot-reloads the
modified modules while the backend keeps running.

## 2.0 change

Per [[sources/2024-10-14-tauri-2-released]], Tauri 2.0 extended HMR
support to **mobile devices and emulators** — previously HMR was a
desktop-only workflow. The practical outcome is that the mobile
development loop no longer requires a full rebuild and redeploy for
every frontend change, closing one of the biggest DX gaps between
Tauri and hot-reload-native mobile frameworks.

## Why it matters

The mobile dev loop is where slow rebuilds hurt most: deploying to a
physical device or booting an emulator is already expensive, so
requiring a full rebuild per edit compounds the pain. HMR on mobile
brings the iteration speed closer to what web developers expect and
to what React Native / Flutter offer.

## Open questions

> [!question] Does mobile HMR work over USB debugging, Wi-Fi, or both?

> [!question] Does HMR extend to Rust backend changes on mobile, or
> only to the frontend bundle? (Almost certainly frontend-only, but
> the article doesn't spell it out.)

## Related

- [[tauri]]
- [[tauri-mobile-support]]
- [[create-tauri-app]] — dev server wiring comes from the scaffolder.
