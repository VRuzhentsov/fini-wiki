---
title: MVP Baseline
type: overview
created: 2026-04-12
updated: 2026-04-12
sources: [2026-03-21-mvp-baseline]
tags: [fini, mvp, scope, baseline]
---

# MVP Baseline

The 2026-03-21 baseline is the clearest single-source summary of what Fini originally considered MVP, what was deferred to MVP.1, and which product rules were already considered locked [[sources/2026-03-21-mvp-baseline]].

> [!warning] Superseded by [[sources/2026-03-29-device-synchronizations-design]] (2026-03-29)
> The baseline still uses `Main` naming and an older sync framing. Read it as product foundation, not as the latest terminology or sync architecture.

## Locked product scope

- MVP platforms: Linux, Windows, Android [[sources/2026-03-21-mvp-baseline]].
- MVP navigation: `Main`, `History`, `Settings` [[sources/2026-03-21-mvp-baseline]].
- MVP includes quests, reminders, repeating occurrences, Main resolution, and MCP [[sources/2026-03-21-mvp-baseline]].
- MVP.1 adds discovery, pairing, selected-space sync, replay, and encrypted transport [[sources/2026-03-21-mvp-baseline]].

## Durable product assumptions

- Quest ids are UUIDs; space ids are stable strings with reserved built-ins [[sources/2026-03-21-mvp-baseline]].
- Main/Focus is derived from persisted state and events, not stored as a separate mutable singleton [[sources/2026-03-21-mvp-baseline]].
- Repeating behavior uses `series + occurrences` and deterministic occurrence ids [[sources/2026-03-21-mvp-baseline]].
- MCP is treated as MVP-critical, not optional tooling [[sources/2026-03-21-mvp-baseline]].

## Current reading guidance

Use this page to answer "what was the original product lock?" Use [[device-sync-architecture]], [[focus]], and [[mcp-contract]] for newer terminology and contract evolution.
