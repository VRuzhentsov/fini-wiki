---
title: Tauri 1.x to 2.0 Migration
type: concept
created: 2026-04-12
updated: 2026-04-12
sources: [2024-10-14-tauri-2-released]
tags: [tauri, migration, tooling]
---

# Tauri 1.x to 2.0 Migration

Path for upgrading an existing [[tauri]] 1.x application to 2.0.
Per [[sources/2024-10-14-tauri-2-released]], Tauri ships an official
migration guide and a CLI command that automates most of the work.

## Automated migration

```sh
npm install @tauri-apps/cli@next
npm run tauri migrate
```

The `tauri migrate` command is described as automating "most of the
migration process" — the article stops short of enumerating what
remains manual, so expect some hand-editing is still required.

The migration guide lives at `https://v2.tauri.app/migration/`.

## What's actually breaking between 1.x and 2.0

The article doesn't enumerate breaking changes, but the 2.0 feature
set implies several migration surfaces:

- **Permissions.** The 1.x allowlist is replaced by the
  [[tauri-permission-system]]. Apps will need to translate their
  allowlist settings into permission/scope/ability manifests.
- **Plugins.** The [[tauri-plugin-system]] was restructured and
  several core APIs moved out to official plugins — consumers likely
  need to explicitly import those plugins now.
- **IPC.** The [[tauri-ipc]] layer was rewritten, so any code that
  interacts with the lower-level IPC primitives may need updating.
  Higher-level command/event APIs are more likely to be preserved.
- **Mobile targets.** Adding mobile isn't a migration per se but is
  the opt-in upside that motivates the upgrade for some teams.

> [!question] What are the actual hand-edit steps after
> `tauri migrate` runs? The article doesn't list them; the real
> migration guide at `v2.tauri.app/migration/` should be captured as
> a follow-up source.

> [!question] Are there 1.x APIs that have no 2.0 equivalent and
> would force an architectural change?

## Related

- [[tauri]]
- [[tauri-permission-system]]
- [[tauri-plugin-system]]
- [[tauri-ipc]]
- [[create-tauri-app]] — the greenfield counterpart to migration.
