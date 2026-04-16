---
title: create-tauri-app
type: concept
created: 2026-04-12
updated: 2026-04-12
sources: [2024-10-14-tauri-2-released]
tags: [tauri, tooling, scaffolding, onboarding]
---

# create-tauri-app

Official scaffolding tool for bootstrapping a new [[tauri]] 2.0
application. Introduced as part of the 2.0 push to improve onboarding,
per [[sources/2024-10-14-tauri-2-released]].

## Invocation

The source lists the available entry points:

```sh
sh <(curl https://create.tauri.app/sh)
npm create tauri-app@latest
yarn create tauri-app
pnpm create tauri-app
bun create tauri-app
cargo install create-tauri-app --locked
cargo create-tauri-app
```

Each covers a different install path: a shell installer, the four
major JavaScript package managers (npm, yarn, pnpm, bun), and a Cargo
route for developers who want to stay in the Rust ecosystem.

## Purpose

The stated goal is "quickly build a Tauri application from scratch and
save time" — i.e. replacing the manual boilerplate of wiring up a
frontend toolchain, a Rust crate, and Tauri config files. In the 2.0
context this is especially useful because it handles mobile target
setup alongside desktop, which would otherwise be a multi-step dance.

## Open questions

> [!question] Which frontend stacks does the scaffolder support out of
> the box (React, Svelte, Vue, Solid, vanilla, etc.), and does it
> offer a picker? The article doesn't say.

> [!question] Does the generated project include opinionated defaults
> for the new [[tauri-permission-system]] (e.g. a baseline permission
> manifest), or is that left as an exercise?

## Related

- [[tauri]]
- [[tauri-mobile-support]] — scaffolder bootstraps mobile targets.
- [[tauri-1-to-2-migration]] — the other end of the onboarding story
  for existing 1.x apps.
