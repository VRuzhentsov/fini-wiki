---
title: Tauri IPC
type: concept
created: 2026-04-12
updated: 2026-04-12
sources: [2024-10-14-tauri-2-released]
tags: [tauri, ipc, architecture, rust, performance]
---

# Tauri IPC

Inter-process communication between [[tauri]]'s [[rust]] core and
the WebView-hosted frontend. This is the main data path in every
Tauri app: commands invoked from JS land in Rust handlers, and
events fan out from Rust back to the frontend.

Because the backend is Rust, the IPC layer is one of the places
where Tauri's language choice pays off most directly. Rust's
zero-cost abstractions, lack of a GC, and fine-grained control over
memory mean the core can move bytes across the IPC boundary without
the serialization tax and heap pressure that a GC'd runtime would
incur. This is the performance story — large binary transfers,
frequent small events, and realtime data pipelines all benefit from
having a native-speed backend rather than a JS or JVM one.

## 2.0 rewrite

Per [[sources/2024-10-14-tauri-2-released]], Tauri 2.0 completely
rewrote the internal IPC layer to improve data transmission
efficiency. Two mechanisms are highlighted:

- **Raw payloads** — support large data transmission, improving
  front-end ↔ back-end throughput for non-trivial buffers. This is
  where Rust's ability to hand off raw byte buffers without copying
  or re-serializing shines.
- **Raw requests** — simplify the internal message-passing mechanism
  and speed up processing.

The source gives a Rust-side illustration of emitting a raw payload:

```rust
tauri::async_runtime::spawn(async {
  let payload = vec![1, 2, 3, 4, 5];
  tauri::api::ipc::Broadcast::emit('event_name', payload).await.unwrap();
});
```

> [!warning] The snippet uses single-quoted string literals, which
> isn't valid Rust — likely a transcription error in the Medium
> post rather than the real API. Check the official 2.0 docs before
> relying on this.

## Why it matters

Before 2.0, passing large binary data across the IPC boundary was a
known pain point: the frontend had to serialize to JSON or base64,
which is slow and memory-hungry on both sides. The raw path lets
Rust send bytes across without that tax, which matters for:

- **Media** — images, audio frames, video buffers.
- **File-like data** — reading/writing large files, archive
  manipulation.
- **Realtime pipelines** — anything pushing events at high frequency
  (sensors, streams, game state).

This is exactly the class of workload that justifies a Rust core in
the first place: you get C-level throughput on the backend and only
pay WebView rendering cost on the frontend.

## Architectural shape

At a high level (inferred from the article + general framework
knowledge — flag for verification):

- Frontend calls a JavaScript helper (`invoke`-style) that posts a
  message to the core.
- Rust core dispatches to a registered command handler.
- Handler runs at native speed, returns a result (or streams events
  back via the event system).
- The [[tauri-permission-system]] gates which commands a given
  frontend is allowed to invoke.

> [!question] How does the 2.0 IPC layer actually move bytes at the
> transport level — shared memory, native postMessage, a custom
> protocol? The article doesn't specify.

## Related

- [[tauri]]
- [[rust]] — why the performance story is possible at all.
- [[tauri-plugin-system]] — plugins expose commands through the
  same IPC surface.
- [[tauri-permission-system]] — permissions gate which IPC commands
  a frontend can invoke.
