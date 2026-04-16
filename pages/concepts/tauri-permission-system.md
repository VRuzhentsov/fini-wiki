---
title: Tauri Permission System
type: concept
created: 2026-04-12
updated: 2026-04-12
sources: [2024-10-14-tauri-2-released]
tags: [tauri, security, permissions, access-control]
---

# Tauri Permission System

Access-control model introduced in [[tauri]] 2.0 to replace the 1.x
allowlist. Instead of a single global whitelist of enabled APIs, 2.0
uses three composable primitives — **permissions**, **scopes**, and
**abilities** — to express which commands a frontend (or a given
WebView) is allowed to invoke and with what arguments.

Per [[sources/2024-10-14-tauri-2-released]], the system applies to
Tauri's core APIs *and* to third-party plugin APIs — plugin authors
can ship their own permission definitions rather than baking access
into the framework core.

## Example shape

From the article (TOML):

```toml
[[permission]]
identifier = 'my-identifier'
description = 'This describes the impact and more.'
commands.allow = [
    'read_file'
]

[[scope.allow]]
my-scope = '$HOME/*'

[[scope.deny]]
my-scope = '$HOME/secret'
```

A permission bundles a set of allowed commands; scopes further narrow
which arguments those commands will accept (here, limiting file reads
to `$HOME` while denying `$HOME/secret`).

## Why it matters

The 1.x allowlist was a coarse on/off switch per API, which made
least-privilege hard: once you enabled "fs" you got a lot. The new
model lets you express "this window may read files, but only under
`$HOME`, and never `$HOME/secret`" — closer to a capability model.

> [!question] How are "abilities" defined in contrast to permissions
> and scopes? The article mentions the term but doesn't define it —
> needs a follow-up source.

## Related

- [[tauri]]
- [[tauri-plugin-system]] — plugins ship their own permission manifests.
- [[tauri-ipc]] — permissions gate IPC command invocations.
