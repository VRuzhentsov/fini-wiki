---
title: 2026-04-26 mDNS-SD Device Discovery Architecture
type: source
created: 2026-04-27
updated: 2026-04-27
sources: [2026-04-26-mdns-sd-device-discovery-architecture]
tags: [fini, discovery, mdns, dns-sd, websocket, pairing, sync]
---

# 2026-04-26 mDNS-SD Device Discovery Architecture

Architecture decision replacing custom UDP discovery and UDP pairing messages with DNS-SD over mDNS for endpoint discovery, plus WebSocket for pairing and sync. The chosen first desktop provider is the Rust `mdns-sd` crate behind a Fini-owned `DiscoveryProvider` abstraction.

## Key claims

- Fini should replace custom UDP discovery with DNS-SD over mDNS using `mdns-sd` for the first desktop implementation [[sources/2026-04-26-mdns-sd-device-discovery-architecture]].
- mDNS is discovery only: it finds nearby Fini service endpoints but does not establish trust, authenticate peers, or carry sync data [[sources/2026-04-26-mdns-sd-device-discovery-architecture]].
- The durable stack is mDNS/DNS-SD discovery, WebSocket pairing, WebSocket sync, and SQLite persisted trust/mapping state [[sources/2026-04-26-mdns-sd-device-discovery-architecture]].
- Service type is `_fini-sync._tcp.local.` with small V1 TXT fields: `txtvers`, `devid`, `name`, `add`, and `proto` [[sources/2026-04-26-mdns-sd-device-discovery-architecture]].
- Resolved peers are keyed by stable `device_id`, not mDNS instance name or display name [[sources/2026-04-26-mdns-sd-device-discovery-architecture]].
- Pairing moves from custom UDP messages to WebSocket messages sent to the resolved DNS-SD endpoint [[sources/2026-04-26-mdns-sd-device-discovery-architecture]].
- The sync layer keeps WebSocket sync and paired/trusted-device checks, but the endpoint source becomes DNS-SD resolution rather than custom discovery payloads [[sources/2026-04-26-mdns-sd-device-discovery-architecture]].
- Android may need a native `NsdManager` provider; the desktop `mdns-sd` implementation should stay behind a provider abstraction [[sources/2026-04-26-mdns-sd-device-discovery-architecture]].

## Open questions

- Whether to keep a short-lived compatibility mode for current custom UDP discovery [[sources/2026-04-26-mdns-sd-device-discovery-architecture]].
- What exact WebSocket auth secret pairing should establish after passcode flow [[sources/2026-04-26-mdns-sd-device-discovery-architecture]].
- Whether CI actor tests should use real mDNS, a fake provider, or both [[sources/2026-04-26-mdns-sd-device-discovery-architecture]].
- What user-facing fallback appears when local network discovery is blocked [[sources/2026-04-26-mdns-sd-device-discovery-architecture]].

## Related pages

- [[DeviceConnection]]
- [[Network]]
- [[SpaceSync]]
- [[e2e-testing]]
