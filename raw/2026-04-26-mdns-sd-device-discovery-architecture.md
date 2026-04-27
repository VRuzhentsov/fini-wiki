# mDNS-SD Device Discovery Architecture

Date: 2026-04-26

## Decision

Fini will replace custom UDP discovery with DNS-SD over mDNS using the Rust `mdns-sd` crate for the desktop implementation.

The durable architecture is:

```text
mDNS/DNS-SD
  find nearby Fini services

WebSocket pairing
  establish user-approved trust

WebSocket sync
  exchange replicated data between trusted devices

SQLite
  remember trusted devices and mapped sync state
```

mDNS is discovery only. It tells Fini that a device claims to be reachable at a host and port. It does not establish trust, authenticate the peer, or carry sync data.

## Current Problem

Fini currently uses custom UDP multicast/broadcast discovery and custom UDP pairing messages alongside a WebSocket sync server.

Current shape:

```text
custom UDP discovery: 45454
custom UDP pair request/accept/complete: 45454
WebSocket sync: 45455
```

This worked for a single app instance per host, but it breaks down for local two-app E2E and any future multi-instance environment because fixed unicast ports collide.

Temporary port sharding fixed the immediate testability issue:

```text
FINI_DISCOVERY_PORT
FINI_DISCOVERY_PEER_PORTS
FINI_SPACE_SYNC_WS_PORT
```

That should not become the product architecture. The product needs a discovery protocol that can advertise the actual endpoint selected by each running instance.

## Architecture Principle

Discovery should discover endpoints. It should not be the endpoint.

DNS-SD provides the right split:

```text
DNS-SD service browse
  finds service instances

DNS-SD service resolve
  returns host, port, addresses, and TXT metadata

Fini WebSocket
  handles pairing, authentication, and sync
```

The result is simpler than routing Fini-specific control messages over UDP. Every peer-specific action connects to the resolved WebSocket endpoint.

## Chosen Crate: mdns-sd

Use `mdns-sd` as the first implementation provider for desktop platforms.

Reasons:

- Pure Rust implementation, reducing packaging dependency on Avahi or Bonjour daemons.
- Supports service registration and browsing.
- Exposes resolved service events that map cleanly into Fini peer registry updates.
- Supports TXT properties.
- Supports dynamic address/interface handling through crate-provided mechanisms.
- Keeps Linux, Windows, and macOS packaging simpler than native daemon wrappers for the first implementation.

Rejected first-pass options:

- `zeroconf`: credible native-wrapper fallback, but adds Bonjour/Avahi packaging and runtime dependencies.
- `libmdns`: not a complete fit for Fini because the browser/resolver side is not the obvious primary path.
- Platform-native providers first: useful later for Android and possibly fallback desktop paths, but too much surface area for the initial desktop migration.

## Service Type

Use:

```text
_fini-sync._tcp.local.
```

Rationale:

- DNS-SD compliant service type.
- TCP because the contact endpoint is Fini's WebSocket server.
- `fini-sync` stays within the DNS-SD service-name length guidance.
- The service name describes the available capability without implying trust.

## TXT Schema

TXT records must stay small, versioned, and untrusted.

Version 1:

```text
txtvers=1
devid=<device_id>
name=<display_name>
add=0|1
proto=1
```

Fields:

- `txtvers`: TXT schema version.
- `devid`: stable Fini device identity.
- `name`: user-visible display name.
- `add`: whether this device is currently accepting Add Device pairing requests.
- `proto`: Fini WebSocket protocol version.

Do not put replicated state, large capability payloads, or trust assertions into TXT records.

## Runtime Architecture

Startup flow:

```text
Fini app starts
  |
  | load or create local device identity
  | bind WebSocket server to actual available port
  | publish DNS-SD service with that port
  | browse DNS-SD services
  v

mDNS/DNS-SD
  service: _fini-sync._tcp.local.
  SRV: host.local.:<ws_port>
  TXT:
    txtvers=1
    devid=<device_id>
    name=<display_name>
    add=0|1
    proto=1

  |
  v

Peer registry
  device_id -> ResolvedPeer

  |
  +-- Add Device UI filters add=1 peers
  +-- Pairing opens WebSocket to resolved endpoint
  +-- Sync opens WebSocket to resolved endpoint
```

Resolved peers are keyed by `device_id`, not by mDNS instance name or display name. Duplicate display names are normal.

## Discovery Provider Abstraction

Keep `mdns-sd` types behind a Fini-owned abstraction.

Suggested internal types:

```rust
struct LocalFiniService {
    device_id: String,
    display_name: String,
    ws_port: u16,
    add_mode: bool,
    protocol_version: u16,
}

struct ResolvedPeer {
    device_id: String,
    instance_name: String,
    display_name: String,
    host: String,
    addresses: Vec<IpAddr>,
    port: u16,
    add_mode: bool,
    protocol_version: u16,
    last_seen_at: DateTime<Utc>,
}

enum DiscoveryEvent {
    PeerResolved(ResolvedPeer),
    PeerRemoved { device_id: String },
    Error(String),
}

trait DiscoveryProvider {
    fn publish(&self, service: LocalFiniService) -> Result<(), String>;
    fn update_add_mode(&self, enabled: bool) -> Result<(), String>;
    fn browse(&self) -> Receiver<DiscoveryEvent>;
    fn shutdown(&self) -> Result<(), String>;
}
```

Provider implementations:

```text
MdnsSdDiscoveryProvider
  real desktop provider backed by mdns-sd

FakeDiscoveryProvider
  deterministic tests and CI scenarios that should not depend on LAN multicast

AndroidNsdDiscoveryProvider
  future mobile provider backed by Android NsdManager if needed
```

## Add Device Flow

Current flow:

```text
enter add mode -> emit custom UDP add beacons
```

Future flow:

```text
enter add mode -> update advertised TXT add=1
leave add mode -> update advertised TXT add=0
```

The Add Device screen reads the peer registry and shows peers where:

```text
peer.add_mode == true
peer.device_id != local_device_id
peer.protocol_version is supported
```

If no devices are found, the UI should eventually explain that both devices must be nearby, on the same network, and on a network that allows local discovery.

## Pairing Over WebSocket

Pairing should move off UDP and onto the resolved WebSocket endpoint.

Current flow:

```text
pair_request UDP
pair_accept UDP
pair_complete UDP
```

Future flow:

```text
A sees B with add=1
A opens WebSocket to B resolved DNS-SD endpoint
A sends PairRequest
B shows incoming request
B user accepts and generates code
B sends PairAccept(code)
A displays code
B user enters or confirms code
B sends PairComplete
A and B persist paired device rows
```

Suggested WebSocket messages:

```rust
WsMessage::PairRequest {
    request_id,
    from_device_id,
    from_hostname,
    created_at,
    expires_at,
}

WsMessage::PairAccept {
    request_id,
    code,
    from_device_id,
    accepted_at,
}

WsMessage::PairComplete {
    request_id,
    from_device_id,
    from_hostname,
    paired_at,
}

WsMessage::PairReject {
    request_id,
    reason,
}
```

This unifies peer-specific communication around one resolved endpoint and removes ambiguous UDP routing.

## Sync Over WebSocket

Keep the existing WebSocket sync data-plane, but change the source of endpoint truth.

Current source:

```text
custom discovery peer -> addr + ws_port
```

Future source:

```text
DNS-SD resolved peer -> addresses + port + TXT device_id
```

The existing deterministic sync dialer rule can remain if still useful:

```text
lower device_id dials higher device_id
```

The sync layer must continue to require a paired/trusted device record before accepting replicated data.

## Port Strategy

After mDNS pairing and sync endpoint resolution work, remove temporary custom discovery port sharding.

Remove:

```text
FINI_DISCOVERY_PEER_PORTS
custom discovery_port in pair payloads
custom UDP pair routing
```

Keep or add:

```text
FINI_SPACE_SYNC_WS_PORT
FINI_MDNS_DISABLED=1
FINI_MDNS_SERVICE_NAME=<optional test/debug override>
```

For local headed E2E, each actor may still use a deterministic WebSocket port. DNS-SD advertises the actual port, so no manual peer-port list is needed.

## Security Model

mDNS is not trust.

Security rules:

- Treat all TXT records as untrusted LAN claims.
- Do not sync with a peer merely because it advertises `_fini-sync._tcp.local.`.
- Continue passcode pairing for first trust establishment.
- Continue checking paired device records before sync.
- Long term, pairing should create a shared secret or keypair and WebSocket auth should prove possession of that secret.

Mental model:

```text
mDNS tells us where a device claims to be.
Pairing decides whether the user trusts it.
Sync auth proves the device is trusted.
```

## Android Strategy

Do not assume the desktop `mdns-sd` provider is enough for Android.

Android has native NSD through `NsdManager`. Android may also require Wi-Fi multicast handling and permissions depending on implementation path and OS behavior.

Strategy:

1. Build the desktop provider behind `DiscoveryProvider` first.
2. Validate `mdns-sd` on Tauri Android with a focused spike.
3. If unreliable, implement `AndroidNsdDiscoveryProvider` through a Tauri plugin or native command bridge around `NsdManager`.
4. Keep app-level discovery, pairing, and sync logic unchanged across providers.

Android acceptance target:

- Android publishes `_fini-sync._tcp.local.`.
- Android browses desktop Fini services.
- Android can pair with desktop on the same Wi-Fi.
- Required permissions and multicast caveats are documented.

## Migration Plan

1. Add `DiscoveryProvider` abstraction and fake provider.
2. Add `MdnsSdDiscoveryProvider` using `mdns-sd`.
3. Publish `_fini-sync._tcp.local.` with V1 TXT metadata.
4. Browse and resolve peers into `ResolvedPeer`.
5. Make Add Device consume mDNS peers where `add=1`.
6. Move pairing messages from UDP to WebSocket.
7. Keep WebSocket sync but source endpoints from DNS-SD.
8. Remove UDP pairing and custom add beacons.
9. Remove `FINI_DISCOVERY_PEER_PORTS`.
10. Add Android NSD spike after desktop path is verified.

Implementation should be incremental. Each phase should preserve or improve the visible two-app headed E2E proof.

## Test Plan

Unit tests:

- TXT encode/decode.
- TXT missing keys.
- Unsupported `txtvers`.
- Unsupported `proto`.
- Ignore self device ID.
- Resolve multiple addresses.
- Remove peer event.
- Add-mode filtering.
- Pair request state transitions.
- Pair accept wrong code.
- Pair request expiry.

Integration tests:

- Fake provider emits two peers.
- Add Device store/UI sees only `add=1` peers.
- WebSocket pairing request/accept/complete persists both paired devices.
- Sync dialer uses resolved mDNS port.

E2E tests:

```text
npm run test:e2e
  local headed two-app proof
  visible windows
  mDNS discovery
  Settings pairing
  both apps show each other device names

npm run test:e2e:ci
  containerized/headless full suite
  may use fake provider or controlled provider where LAN multicast is unreliable
```

Manual QA:

- Two apps on one machine.
- Two laptops on same Wi-Fi.
- Desktop plus Android later.
- Firewall enabled.
- VPN enabled.
- Guest Wi-Fi where multicast may be blocked.
- Sleep/wake.
- IP address change.
- App restart after pairing.

## Acceptance Checks

- `npm run test:e2e` opens two visible local Fini windows.
- The two windows discover each other through mDNS.
- Settings/Add Device pairing succeeds.
- Each app shows the other device name.
- `npm run test:e2e:ci` passes in headless/containerized mode.
- Tests no longer rely on custom UDP peer-port lists.
- mDNS TXT records remain small and versioned.
- Sync only trusts paired devices, not arbitrary mDNS advertisements.

## Risk Register

| Risk | Impact | Mitigation |
| --- | --- | --- |
| mDNS blocked by guest or corporate Wi-Fi | Nearby devices may not appear | Clear no-devices guidance and future fallback/manual path |
| Windows firewall blocks listener | Discovery may work but pairing/sync connection fails | Runtime diagnostics and install guidance |
| Android `mdns-sd` unreliable | Mobile discovery blocked | Keep provider abstraction and use native `NsdManager` if needed |
| TXT spoofing | Malicious LAN device can impersonate metadata | Treat TXT as untrusted and require pairing/auth |
| Stale TXT add-mode | Add Device UI may show unavailable peer | Provider update checks, expiry, and retry |
| Duplicate display names | Ambiguous UI rows | Key by `device_id`; show enough identity detail when needed |

## Open Questions

- Should Fini keep a short-lived compatibility mode for current custom UDP discovery, or migrate directly once mDNS desktop E2E passes?
- What exact WebSocket auth secret should pairing establish after the passcode flow?
- Should CI actor tests use real mDNS inside the container network, a fake provider, or both?
- What user-facing fallback should appear when local network discovery is blocked?
