---
title: Tauri Plugin System
type: concept
created: 2026-04-12
updated: 2026-04-12
sources: [2024-10-14-tauri-2-released]
tags: [tauri, plugins, architecture, extensibility, rust, swift, kotlin]
---

# Tauri Plugin System

Extensibility layer for [[tauri]] apps. Plugins package reusable
backend logic (primarily [[rust]], with Swift and Kotlin available
for mobile), expose commands to the frontend via [[tauri-ipc]], and
ship their own permission manifests for the
[[tauri-permission-system]].

Plugins are the unit of horizontal extension in Tauri: anything you'd
want to share across apps — a database wrapper, a notification
bridge, a filesystem abstraction, a mobile camera API — belongs in a
plugin rather than in an app's core code.

## 2.0 restructure

Per [[sources/2024-10-14-tauri-2-released]], Tauri 2.0 completely
restructured the plugin system with two notable effects.

### 1. Core features moved to official plugins

Capabilities that were previously baked into the framework core are
now distributed as **official plugins**. The stated motivation is
that this lowers the bar for community contribution and lets
features ship independently of the core release cycle.

Practical consequences:

- Apps pay only for what they import — core is slimmer, binaries
  are smaller (which amplifies Tauri's lightweight-via-Rust story).
- Features can iterate on their own cadence rather than being gated
  by core version bumps.
- Migration from 1.x likely requires explicitly importing the
  plugins for APIs that used to be "just there" — see
  [[tauri-1-to-2-migration]].

### 2. Native mobile code exposure

Plugin authors can write (or reuse) **Swift** code for iOS or
**Kotlin** code for Android and expose it to the frontend through
annotations. This is the mechanism that makes [[tauri-mobile-support]]
meaningful in practice: without it, mobile Tauri apps would be stuck
with whatever the Rust core chose to expose, and a lot of platform
APIs (camera, biometrics, push notifications, etc.) are most
naturally accessed from the native mobile language.

The annotation-based approach means plugin authors can declare
exposed methods at the source level rather than maintaining a
separate binding layer — lowering the cost of wrapping a new
platform API.

## The mobile plugin system

The source specifically calls out "a brand new mobile plugin system
to expose application logic to the Tauri frontend". Two inferences
worth flagging:

- Mobile plugins appear to be a specialization of the general plugin
  system, not a separate mechanism — same annotations, just
  available on iOS/Android targets.
- "Reuse existing logic code" implies a Rust plugin can be compiled
  for mobile targets as well, with Swift/Kotlin layers added only
  where platform-specific APIs are required.

> [!question] Is there a single plugin API that spans desktop and
> mobile, or are mobile plugins a separate crate family? The article
> is ambiguous.

## Why it matters

Moving features out of core achieves several things at once:

- **Smaller default footprint** — amplifies the Rust-driven
  lightweight story (see [[rust]]).
- **Faster feature delivery** — plugins ship on their own cadence.
- **Clearer security story** — when a feature is a plugin with its
  own permission manifest, it's easier to reason about what access
  it actually needs. Fits the [[capability-based-security]] framing
  of the new [[tauri-permission-system]].
- **Mobile parity** — native Swift/Kotlin exposure is what makes
  iOS/Android targets viable, not just theoretical.

## Open questions

> [!question] What's the official plugin catalog look like — how
> many plugins, how well maintained, what coverage?

> [!question] How does plugin versioning interact with core
> versioning? If plugins ship independently, how are breaking
> changes across the plugin↔core boundary managed?

> [!question] Can the same plugin source serve desktop Rust,
> mobile Rust, *and* the native Swift/Kotlin layer, or does mobile
> require a separate plugin crate?

## Related

- [[tauri]]
- [[rust]] — default plugin language, and the reason plugins can be
  performant.
- [[tauri-permission-system]] — plugins ship their own permission
  definitions.
- [[tauri-ipc]] — plugins expose their commands through the shared
  IPC surface.
- [[tauri-mobile-support]] — made practical by the mobile plugin
  system.
