---
title: Space Sync Foo Create via Dialog
type: e2e
area: space-sync
author: user
---

# Space Sync Foo Create via Dialog

## Goal

Validate that a custom space created on one device (`Foo`) is offered to the paired device through the incoming space resolution dialog, and the paired device can create it locally via `Create`.

> [!warning] Updated by [[sources/2026-05-04-space-sync-consent-and-lifecycle]] (2026-05-04)
> This scenario should be interpreted as a one-space receiver-side request for `Foo`, not a batch mapping snapshot approval. Only Device B should see the incoming request, and already-active spaces must not prompt again on startup, reconnect, or sync tick.

## Preconditions

- Device A and Device B are already paired.
- Both devices are online and Fini is running.
- Neither device currently has a custom space named `Foo`.
- Device B is the receiving device for the one-space `Foo` sync request.

## Test Steps

1. On Device A, open `Settings -> Spaces`.
2. Create a new custom space named `Foo`.
3. On Device A, open `Settings -> Device/:id` for Device B.
4. In `Mapped spaces`, select only `Foo` and tap `Save mappings`.
5. On Device B, wait for the global incoming space sync request for `Foo`.
6. Confirm the one-space request.
7. On Device B, reload mappings/status.
8. On Device B, open `Settings -> Spaces` and confirm `Foo` exists.
9. On Device A, reload `Settings -> Spaces` and confirm `Foo` still exists.
10. Trigger sync tick/reconnect and confirm no duplicate incoming request appears for `Foo` once active.

## Assertions

- Device B shows incoming custom-space resolution UI for `Foo`.
- Choosing `Create` results in a local space on Device B with name `Foo`.
- `Foo` becomes available in mapped spaces for the device pair.
- Device A does not show the incoming request it initiated.
- Already-active `Foo` does not prompt again on sync tick/reconnect.
- `Foo` remains present after reload/reopen on both devices.
- No existing space is removed as a side effect of this flow.

## Failure Signals

- No incoming dialog appears on Device B.
- `Foo` mapping is applied but `Foo` is absent in Device B spaces list.
- `Foo` appears briefly and disappears after refresh.
- Selecting `Create` unexpectedly merges into or deletes another local space.

## Evidence Artifacts

- Device A DOM evidence: `Foo` creation and `Save mappings` enabled/success state.
- Device B DOM evidence: incoming `Foo` dialog, `Create` confirmation, spaces list containing `Foo`.
- Post-reload DOM evidence from both devices showing `Foo` remains present.
- Structured command outputs/logs around mapping update, incoming update consumption, and resolution command.
- Screenshot evidence only as rare fallback when DOM data is unavailable for a required assertion.

## Cleanup

1. Remove `Foo` from mapped spaces on both devices.
2. Delete test-created `Foo` spaces from both devices.
3. Reload spaces and device detail on both sides to verify baseline restoration.
4. Record cleanup evidence; if cleanup fails, mark the test as failed.
