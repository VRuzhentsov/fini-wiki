---
title: 2026-05-16 Bluetooth Transport Ticket Grilling
type: source
created: 2026-05-21
updated: 2026-05-21
sources: [2026-05-16-bluetooth-transport-ticket-grilling]
tags: [fini, bluetooth, device-connection, space-sync, transport, e2e]
claim_status: locked
evidence: source-backed
---

# 2026-05-16 Bluetooth Transport Ticket Grilling

The Bluetooth transport grilling locks Bluetooth as an independent transport provider for [[DeviceConnection]] and [[SpaceSync]], not a replacement for Fini's trust model. OS Bluetooth pairing is only a transport precondition; Fini app pairing and pair-auth remain required before any pairing/control/sync data is accepted [[sources/2026-05-16-bluetooth-transport-ticket-grilling]].

## Key claims

- Fini should support two independent transports: network transport and Bluetooth transport [[sources/2026-05-16-bluetooth-transport-ticket-grilling]].
- Bluetooth can carry initial Fini app pairing only when devices are already paired at the OS Bluetooth layer [[sources/2026-05-16-bluetooth-transport-ticket-grilling]].
- OS Bluetooth pairing alone never grants Fini trust and never authorizes sync [[sources/2026-05-16-bluetooth-transport-ticket-grilling]].
- Bluetooth is enabled explicitly per Fini-paired device relationship; global automatic Bluetooth enablement is out of scope [[sources/2026-05-16-bluetooth-transport-ticket-grilling]].
- Network remains preferred when both transports are available; Bluetooth is fallback when network transport is unavailable or fails [[sources/2026-05-16-bluetooth-transport-ticket-grilling]].
- Bluetooth carries the same authenticated Fini pairing/control and SpaceSync protocol semantics as network transport [[sources/2026-05-16-bluetooth-transport-ticket-grilling]].
- SpaceSync consent remains peer-and-space scoped, not transport-scoped [[sources/2026-05-16-bluetooth-transport-ticket-grilling]].
- Device detail should show independent Network and Bluetooth transport status rows [[sources/2026-05-16-bluetooth-transport-ticket-grilling]].
- First implementation scope is Android + Linux; macOS/Windows Bluetooth support is deferred [[sources/2026-05-16-bluetooth-transport-ticket-grilling]].
- Done requires full Bluetooth E2E, not only manual proof or mocked tests [[sources/2026-05-16-bluetooth-transport-ticket-grilling]].

## Open questions

- How session handoff should behave when network recovers after Bluetooth fallback [[sources/2026-05-16-bluetooth-transport-ticket-grilling]].
- Which Linux Bluetooth stack/API should be used [[sources/2026-05-16-bluetooth-transport-ticket-grilling]].
- Which Android Bluetooth permission flow is required for target Android versions [[sources/2026-05-16-bluetooth-transport-ticket-grilling]].
- Whether CI can support real Bluetooth E2E or needs a device-lab/manual-gated target [[sources/2026-05-16-bluetooth-transport-ticket-grilling]].

## Related pages

- [[DeviceConnection]]
- [[SpaceSync]]
- [[e2e-testing]]

updates:: [[pages/concepts/DeviceConnection]]
updates:: [[pages/concepts/SpaceSync]]
