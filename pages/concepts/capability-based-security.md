---
title: Capability-Based Security
type: concept
created: 2026-04-12
updated: 2026-04-12
sources: [2024-10-14-tauri-2-released]
tags: [security, access-control, permissions, capabilities]
---

# Capability-Based Security

Access-control model where the right to perform an action is carried
as an unforgeable token (a "capability") held by the subject, rather
than being checked against a central access list keyed by identity.
Classic examples: file descriptors in Unix, object references in
object-capability languages (E, Pony), some browser APIs.

The key properties:

- **Least privilege by default.** A subject only gets the specific
  capabilities it needs, not a broad identity-based grant.
- **Composability.** Capabilities can be attenuated (scoped down) and
  delegated without involving a central authority.
- **No ambient authority.** Just being "a user" or "an app" grants
  nothing — you need the explicit capability.

## Relationship to Tauri's permission system

> [!question] This framing is inferred, not stated in the source.
> The article doesn't use the phrase "capability-based security" — it
> just describes [[tauri-permission-system]]'s mechanics. The mapping
> here is an interpretation; confirm against the official Tauri 2.0
> docs before trusting it.

The [[tauri-permission-system]]'s three primitives map loosely onto
capability-system ideas:

- **Permissions** — sets of allowed commands, analogous to capability
  bundles.
- **Scopes** — attenuators that narrow a permission's reach (e.g. "may
  read files, but only under `$HOME`").
- **Abilities** — unclear from the article; the term suggests a
  grouping or composition mechanism, but the source doesn't define
  it. Needs a follow-up source.

Contrast with the 1.x allowlist, which was closer to a classical
identity-based ACL: "this app is allowed to use the fs API" with no
further attenuation.

## Why the distinction matters

Capability-style models tend to be more robust against **confused
deputy** attacks — where a privileged component is tricked into
using its authority on behalf of a less privileged caller — because
the authority to act must be explicitly passed along, not implicitly
held. For a sandboxed UI framework like Tauri, this is the right
direction: the frontend should only do what it's been explicitly
granted, and a plugin shouldn't pick up the core's ambient access.

## Open questions

> [!question] Does Tauri's permission model actually prevent confused
> deputy scenarios, or is it structurally ACL-flavored with more
> granularity? This matters for the security claim and needs a read
> of the official docs plus ideally the audit report.

> [!question] How are permissions propagated across WebViews and
> plugins at runtime — are they resolved once at load, or checked per
> call?

## Related

- [[tauri-permission-system]] — concrete instance in Tauri 2.0.
- [[tauri]] — the framework adopting the model.
