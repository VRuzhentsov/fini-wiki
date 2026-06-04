---
title: 2026-05-28 Feature Plane Devtools Boundary
type: source
created: 2026-06-03
updated: 2026-06-03
sources: [2026-05-28-feature-plane-devtools-boundary]
tags: [fini, cli, ui, devtools, architecture]
claim_status: locked
evidence: source-backed
---

# 2026-05-28 Feature Plane Devtools Boundary

This source records the corrected feature-plane boundary: CLI and UI are first-class surfaces over shared DB/domain/service core, while `devtools` is a narrow testing/control affordance layer [[sources/2026-05-28-feature-plane-devtools-boundary]].

## Key claims

- Shared DB, quest, reminder, backup, space, sync, and device state code should be available to both CLI and UI where command groups exist [[sources/2026-05-28-feature-plane-devtools-boundary]].
- `ui-plane` is for UI/runtime adapters such as Tauri commands, managed state, OS notification delivery, native theme, windows/plugins, and Playwright/dev-only automation hooks [[sources/2026-05-28-feature-plane-devtools-boundary]].
- `devtools` is production app behavior plus development/test affordances; product behavior must not depend on `devtools` [[sources/2026-05-28-feature-plane-devtools-boundary]].
- Reminder state is core product state, while notification delivery is UI-plane runtime behavior [[sources/2026-05-28-feature-plane-devtools-boundary]].
- `DbState` should be renamed `AppDbConnection` because it is the Tauri-managed wrapper, not the DB layer itself [[sources/2026-05-28-feature-plane-devtools-boundary]].

## Open questions

- None for the correction scope; future diagnostics beyond Playwright/test hooks may be decided separately [[sources/2026-05-28-feature-plane-devtools-boundary]].

## Related pages

- [[CLI]]
- [[e2e-testing]]
- [[Reminder]]

updates:: [[pages/concepts/CLI]]
updates:: [[pages/concepts/e2e-testing]]
