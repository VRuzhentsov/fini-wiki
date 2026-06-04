---
title: 2026-05-28 CLI Pairing Follow Up
type: source
created: 2026-06-03
updated: 2026-06-03
sources: [2026-05-28-cli-pairing-follow-up]
tags: [fini, cli, device-connection, pairing, sync]
claim_status: locked
evidence: source-backed
---

# 2026-05-28 CLI Pairing Follow Up

This source defines a follow-up ticket for user-facing CLI live pairing. It separates live discovery/WebSocket pairing from PR #41's persisted paired-device CRUD and SpaceSync mapping/status cleanup [[sources/2026-05-28-cli-pairing-follow-up]].

## Key claims

- CLI should eventually support discovery, send request, incoming requests, accept, complete, acknowledge, and pairing status/debug output [[sources/2026-05-28-cli-pairing-follow-up]].
- Persisted paired-device CRUD and live pairing runtime state remain distinct [[sources/2026-05-28-cli-pairing-follow-up]].
- CLI pairing should reuse existing [[DeviceConnection]] runtime and [[SpaceSync]] semantics rather than introducing a separate transport [[sources/2026-05-28-cli-pairing-follow-up]].
- Verification should prove two CLI/app runtimes can pair and then exchange SpaceSync state [[sources/2026-05-28-cli-pairing-follow-up]].

## Open questions

- Whether CLI pairing UX should be flags-first, interactive prompt-based, or both [[sources/2026-05-28-cli-pairing-follow-up]].
- Whether humans enter passcodes or local automation can use request IDs in trusted test/dev modes [[sources/2026-05-28-cli-pairing-follow-up]].

## Related pages

- [[CLI]]
- [[DeviceConnection]]
- [[SpaceSync]]

updates:: [[pages/concepts/CLI]]
depends_on:: [[pages/concepts/DeviceConnection]]
