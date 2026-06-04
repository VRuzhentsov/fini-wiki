# Bluetooth Transport Ticket Grilling

Date: 2026-05-16
Status: ticket handoff
Related: ../fini/specs/device-connect/README.md, ../fini/specs/space-sync/README.md, ../fini-wiki/pages/concepts/DeviceConnection.md, ../fini-wiki/pages/concepts/SpaceSync.md

## Context

The user wanted to create a ticket for Bluetooth support in Fini so sync is not limited to local network transport. The user explicitly requested grilling before finalizing the ticket because the high-level idea had ambiguity around local network, Bluetooth, OS pairing, Fini app pairing, and whether nearby unpaired devices should be supported.

Current Fini architecture separates `DeviceConnection` from `SpaceSync`: `DeviceConnection` owns discovery, app-level pairing, paired-device persistence, presence, and endpoint metadata; `SpaceSync` owns per-space mapping, consent, bootstrap, replay, and replication. Current transport evidence says mDNS/DNS-SD discovers local network endpoints and WebSocket carries pairing/sync. Bluetooth is planned as an additional transport, not a replacement for the trust model.

## Summary

The grilled direction is to support two independent transports: network transport and Bluetooth transport. Bluetooth should be usable for Fini app pairing and SpaceSync only when the devices are already OS Bluetooth-paired. OS Bluetooth pairing is a transport precondition, not Fini trust.

Bluetooth transport is enabled explicitly per Fini-paired device relationship. When both network and Bluetooth are available, network remains preferred and Bluetooth is fallback. Bluetooth should carry the same authenticated Fini pairing/control and SpaceSync protocol semantics as the existing network path, rather than only recovering LAN endpoint details.

## Decisions

- The two independent types are `network transport` and `Bluetooth transport`.
- Bluetooth can carry initial Fini app pairing only if the devices are already paired at the OS Bluetooth layer.
- OS Bluetooth pairing alone never grants Fini trust and never authorizes data sync.
- Bluetooth transport is enabled explicitly per Fini-paired device relationship.
- Network transport is preferred when both network and Bluetooth are available.
- Bluetooth is fallback when network transport is unavailable or fails.
- Bluetooth carries the same authenticated sync protocol semantics as the current network transport.
- SpaceSync consent remains peer-and-space scoped, not transport-scoped.
- The device detail UI should show independent Network and Bluetooth transport status rows.
- First implementation scope is Android + Linux.
- Bluetooth sessions require existing Fini pair-auth.
- Additional app-level transport encryption is deferred to a security follow-up.
- The requested ticket shape is one implementation ticket, not parent plus child issues.
- Done requires full Bluetooth E2E, not only manual proof or mocked tests.

## Plan

Create one implementation ticket: "Add Bluetooth Transport For DeviceConnection And SpaceSync".

Ticket scope:

- Add Bluetooth as an independent transport provider beside the current network provider.
- Preserve Fini app pairing and SpaceSync consent as the authorization boundaries.
- Require OS Bluetooth pairing before Bluetooth can be used for Fini app pairing or sync.
- Support Android + Linux first.
- Add explicit per-pair Bluetooth enablement and minimal persisted Bluetooth metadata.
- Show separate Network and Bluetooth status in the paired-device detail surface.
- Route pairing/control/sync messages over a transport abstraction so Bluetooth can carry the same protocol semantics as network.
- Keep network first and Bluetooth fallback.
- Require full Android + Linux Bluetooth E2E proof.

Explicitly deferred:

- macOS/Windows Bluetooth support.
- Bluetooth use without OS-level pairing.
- Treating OS Bluetooth pairing as Fini trust.
- Per-transport SpaceSync consent.
- Global automatic Bluetooth enablement.
- Extra app-level transport encryption beyond existing pair-auth.

## Evidence

- `../fini-wiki/pages/concepts/DeviceConnection.md` says current `DeviceConnection` owns LAN discovery, presence, and pairing; mDNS/DNS-SD discovers endpoints; pairing messages use resolved WebSocket endpoints; mDNS metadata is untrusted; pair-auth gates sync.
- `../fini-wiki/pages/concepts/SpaceSync.md` says `SpaceSync` handles per-space replication over authenticated sessions, consent is peer-and-space scoped, and WebSocket is the current sync transport.
- `../fini/specs/device-connect/README.md` says device discovery metadata is untrusted and only used to find candidates/endpoints; pairing completion persists both peers as paired devices.
- `../fini/specs/space-sync/README.md` says sync transport uses authenticated sessions, not discovery metadata; approved mapped-space quest events sync silently in the background.
- User decisions in grilling locked Bluetooth as an independent transport, OS Bluetooth pairing as precondition, explicit per-pair enablement, network-first priority, same sync protocol over Bluetooth, no new SpaceSync consent, two transport status rows, Android + Linux first, pair-auth-only security, one ticket shape, and full Bluetooth E2E required.

## Ticket Draft

# Add Bluetooth Transport For DeviceConnection And SpaceSync

## Context

Fini currently treats `DeviceConnection` as the discovery/pairing/control plane and `SpaceSync` as the per-space replication layer. Current transport is network-first: mDNS/DNS-SD discovers `_fini-sync._tcp.local.` endpoints and WebSocket carries app pairing plus sync traffic.

Bluetooth support should add an independent transport path without changing Fini trust semantics.

## Problem / Goal

Fini can sync only when local network discovery/connectivity works. Add Bluetooth as a second transport so Android + Linux devices that are already OS Bluetooth-paired can Fini-pair and sync even when LAN discovery/connectivity is unavailable.

## User Story

As a Fini user with an Android and Linux device, I want to explicitly enable Bluetooth transport for a paired device so that my approved Spaces continue syncing when local network transport is unavailable.

## Scope

- Add Bluetooth as an independent transport alongside network transport.
- Target Android + Linux first.
- Require OS Bluetooth pairing before Bluetooth can be used for Fini app pairing or sync.
- Preserve Fini app pairing as mandatory trust boundary.
- Preserve SpaceSync consent as peer-and-space scoped, not transport-scoped.
- Allow Bluetooth to carry the same authenticated Fini pairing/control and SpaceSync protocol semantics as network transport.
- Prefer network transport when both network and Bluetooth are available.
- Fall back to Bluetooth when network transport is unavailable or fails.
- Add explicit per-paired-device Bluetooth enablement.
- Exchange/store minimum Bluetooth metadata only after explicit user action.
- Show independent Network and Bluetooth transport status rows in paired device detail.
- Require existing Fini pair-auth for every Bluetooth session.
- Add full Bluetooth E2E coverage.

## Out Of Scope

- macOS and Windows Bluetooth support.
- Treating OS Bluetooth pairing as Fini trust.
- New SpaceSync consent per transport.
- Global Bluetooth enablement for all peers.
- Automatic Bluetooth metadata exchange.
- Extra app-level transport encryption beyond existing Fini pair-auth.

## Behavior Rules

- OS Bluetooth pairing is a transport precondition only.
- Fini app pairing is still required before any sync data moves.
- SpaceSync approval remains required per Space for the Fini-paired peer.
- Network and Bluetooth transports are independent providers.
- Transport selection order: network first, Bluetooth fallback.
- Bluetooth discovery/connection metadata is untrusted until Fini pair-auth succeeds.
- If Bluetooth is not explicitly enabled for a Fini pair, it must not be used for that pair.
- If both transports are connected, sync should use network unless network fails.
- If network recovers after Bluetooth fallback, implementation should define and test deterministic session handoff or continue current session until reconnect.

## Acceptance Criteria

- Android + Linux devices already paired at OS Bluetooth level can use Bluetooth to complete Fini app pairing when LAN is unavailable.
- Already Fini-paired Android + Linux devices can explicitly enable Bluetooth transport for that pair.
- Enabling Bluetooth stores only the minimum metadata needed for future Bluetooth reconnect.
- Device detail shows separate Network and Bluetooth transport status rows.
- SpaceSync events for approved Spaces can replicate over Bluetooth when network is unavailable.
- SpaceSync consent prompts do not reappear merely because transport changes from network to Bluetooth.
- Fini pair-auth is required before any Bluetooth-carried pairing/control/sync message is accepted.
- Network transport remains preferred when available.
- Bluetooth fallback works after network failure without duplicating or losing sync events.
- Disabling/unpairing a device prevents future Bluetooth sync for that Fini pair.

## Implementation Notes

- Introduce a transport-provider boundary under `DeviceConnection`.
- Network provider remains mDNS/DNS-SD + WebSocket.
- Bluetooth provider handles Android + Linux discovery/connection details.
- Existing SpaceSync protocol should sit above transport selection instead of being WebSocket-specific.
- Paired-device storage likely needs per-transport metadata and enablement state.
- UI changes likely touch `src/views/DeviceView.vue` and companion docs.
- Specs likely need updates in `specs/device-connect/README.md` and `specs/space-sync/README.md`.

## Verification

- Full Bluetooth E2E required.
- E2E topology: one Android device/emulator + one Linux desktop where OS Bluetooth pairing exists.
- E2E must prove Fini app pairing over Bluetooth with LAN unavailable.
- E2E must prove approved SpaceSync replication over Bluetooth with LAN unavailable.
- E2E must prove network-first priority when both transports are available.
- E2E must prove Bluetooth fallback after network transport fails.
- Automated lower-level tests should cover transport selection, pair-auth gating, metadata persistence, and SpaceSync behavior over a mocked Bluetooth provider.

## Open Questions

- How exactly should session handoff behave when network recovers after Bluetooth fallback?
- Which Bluetooth stack/API should Linux use?
- Which Android Bluetooth permission flow is required for target Android versions?
- Can CI support real Bluetooth E2E, or does this require a device-lab/manual-gated E2E target?

## Open Questions

- Does the implementation ticket belong in GitHub Issues, Jira, or local markdown first?
- Should the open session-handoff behavior be resolved before implementation starts, or can it be made an explicit design step inside the implementation ticket?
- Full Bluetooth E2E may require physical device orchestration or a dedicated device lab. The execution environment for this E2E is not yet evidenced.
