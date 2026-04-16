---
title: Fini MVP Baseline (Locked 2026-03-21)
type: source
created: 2026-04-12
updated: 2026-04-12
sources: [2026-03-21-mvp-baseline]
tags: [fini, mvp, focus, quests, reminders, sync, mcp]
---

# Fini MVP Baseline (Locked 2026-03-21)

The first strong product baseline for Fini. It locks MVP versus MVP.1 scope, the original `Main` terminology, quest/reminder semantics, and the rule that MCP is MVP-critical. It is still useful as the product foundation, but parts of it are explicitly superseded by later naming and sync-architecture docs, especially the move from `Main` to `Focus` and the split from one sync concept into `device_connection` plus `space_sync` [[sources/2026-03-29-device-synchronizations-design]].

## Key claims

- MVP targets Linux, Windows, and Android with functional parity.
- MVP includes core quest lifecycle, reminder metadata plus OS delivery, repeating quests, Main resolution rules, and MCP support.
- MVP.1 adds LAN discovery, pairing, selected-space sync, offline queue replay, and encrypted transport.
- Main is derived from persisted data and events rather than a separate mutable state machine.
- Built-in spaces use reserved string ids: `1` Personal, `2` Family, `3` Work.
- The baseline expects real migrations for major schema changes and allows breaking MCP changes during MVP if migration notes ship with them.

## Open questions

- none

## Related pages

- [[mvp-baseline]]
- [[focus]]
- [[Quest]]
- [[Space]]
- [[Reminder]]
