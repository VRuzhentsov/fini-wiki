---
title: Reminder
type: concept
created: 2026-04-12
updated: 2026-05-21
sources: [2026-03-21-mvp-baseline, 2026-03-29-device-synchronizations-design, 2026-04-21-notifications-grilling, 2026-04-24-reminder-due-bridge-grilling, 2026-05-04-android-notification-debug-build, 2026-05-04-computed-focus-reminder-preemption, 2026-05-17-os-notifications-linux-debug-and-fixes, 2026-05-17-os-notifications-linux-sound-and-action-verification]
tags: [fini, reminders, notifications, focus, linux]
---

# Reminder

Scheduled notification derived from a [[Quest]]'s `due` + `due_time` fields. Each quest with a due date has at most one Reminder row; the row is managed automatically by the backend and has no dedicated UI surface [[sources/2026-04-24-reminder-due-bridge-grilling]].

> **Entity vs surface:** `Reminder` is the row owned by a quest; the OS notification is the platform surface that delivers it. See [[os-notification]] for surface-level behavior (scheduling, cancellation, permissions) [[sources/2026-04-21-notifications-grilling]].

## Source of truth

The authoritative data lives on the quest row, not the Reminder row [[sources/2026-04-24-reminder-due-bridge-grilling]]:

- Fire time = `quest.due + quest.due_time`, in local wall-clock (see [[#Wall-clock semantics]]).
- If `quest.due_time` is null, fire time = `quest.due + 09:00 local`.
- If `quest.due` is null, no Reminder exists.
- The Reminder row is a derivation; `due_at_utc` stored on it is a cache, not authoritative.

## Bridge rules (backend, in `update_quest`)

Every transition of the quest propagates to the Reminder row [[sources/2026-04-24-reminder-due-bridge-grilling]]:

| Quest change | Reminder effect |
|---|---|
| `due` set / changed | Upsert Reminder row; (re)schedule notification. |
| `due_time` set / changed | Upsert Reminder row; (re)schedule notification. |
| `due` cleared | Delete Reminder row; cancel notification. |
| `status` → `completed` / `abandoned` | Delete Reminder row; cancel notification. |
| `status` → `active` (restore) | Upsert Reminder if `due` is set. |
| Quest deleted | Reminder row cascades (or explicit delete); cancel notification. |

Reconciliation on app launch (`services/reconciler.rs`) fills gaps — any active quest with a `due` and no Reminder row gets the row created and the notification scheduled [[sources/2026-04-24-reminder-due-bridge-grilling]].

## Fields

| Field | Type | Description |
|---|---|---|
| `id` | uuid string | Reminder identifier |
| `quest_id` | uuid string | Parent quest/occurrence (unique — at most one row per quest under the bridge) |
| `kind` | text | Currently always `'absolute'` in the auto-flow. `'relative'` reserved for future offset support. |
| `mm_offset` | integer \| null | Unused by the current bridge; reserved for future "notify X min before" support. |
| `due_at_utc` | datetime \| null | Cached derived UTC. Backend must recompute from quest fields at schedule / fire time — not trusted as source of truth (see [[#Wall-clock semantics]]). |
| `scheduled_notification_id` | text \| null | OS-scheduler handle (Android AlarmManager, etc.) |
| `created_at` | datetime | |

## Wall-clock semantics

Fire time is **always local wall-clock** [[sources/2026-04-24-reminder-due-bridge-grilling]]:

- "Apr 30, 10:00" fires at 10:00 local time on the device where the quest is viewed.
- DST transitions do NOT shift the notification. 10:00 AM stays 10:00 AM.
- Cross-timezone travel: notification fires at 10:00 local in the new timezone, not at the original absolute UTC instant.
- Each device recomputes UTC from `quest.due + quest.due_time` using its own current timezone. Two devices in different zones fire the same quest's reminder at different absolute instants — each at its own local wall-clock time.

## Delivery

Each device is responsible for local OS notification scheduling and delivery [[sources/2026-03-29-device-synchronizations-design]] [[sources/2026-04-21-notifications-grilling]]:

- Uses OS-level notifications on Android/Linux/Windows/macOS.
- Scheduling lives at the OS layer (per-platform) where possible; desktop falls back to in-process timers + launch-time reconciliation.
- Reboot survival: re-arm on app launch + Android `RECEIVE_BOOT_COMPLETED` receiver; other platforms lean on OS scheduler durability.
- See [[os-notification]] for surface-level scheduling, content, and interaction rules.

### Foreground behavior
When the app is visible, the OS notification is **suppressed**; [[focus|Focus]] switch + in-app toast signal the user instead [[sources/2026-04-21-notifications-grilling]].

### Past-due behavior
**Always fires immediately** [[sources/2026-04-24-reminder-due-bridge-grilling]]:

- Save with a past `due` → fires now.
- Reconciler finds a past fire time on launch → fires now.
- No grace window, no "silent missed marker."

> [!warning] Supersedes 30-min grace rule
> The 30-min grace window and silent-missed marker from [[sources/2026-04-21-notifications-grilling]] decision 5 are **retired**. All past-due firings are immediate.

## Trigger effects

Reminder due timestamps can temporarily preempt Focus, but suppressed reminders do not create invalid focus candidates [[sources/2026-03-21-mvp-baseline]] [[sources/2026-05-04-computed-focus-reminder-preemption]]:

- If the target quest is `completed` or `abandoned`, the bridge has already deleted the Reminder row — no trigger.
- If active, a reminder due timestamp can preempt current Focus once the due time arrives [[sources/2026-05-04-computed-focus-reminder-preemption]].
- Reminder preemption is temporary; Focus returns to previous valid target after the reminder's quest resolves.
- Persisted reminder-triggered focus rows in [[FocusHistory]] still exist for reconciled/historical cases.
- The reconciler INSERT is performed by the main Tauri process on engagement (launch or tap), with `created_at` backdated to the original fire time [[sources/2026-04-21-notifications-grilling]].
- [[focus|Focus]] does **not** depend on OS notifications — a reminder can exist with a future fire time and no `focus_history` row [[sources/2026-04-21-notifications-grilling]].
- Newer Focus semantics add that once the due boundary passes, the due quest can become Focus via computed due-time comparison even before any reconciler-created `focus_history` row exists [[sources/2026-05-04-computed-focus-reminder-preemption]].

## Snooze

Snooze was originally designed as **notification-level**, not reminder-level [[sources/2026-04-21-notifications-grilling]], but the Linux implementation verification shows the current code creates a new reminder row for Snooze 30m while retaining the original [[sources/2026-05-17-os-notifications-linux-sound-and-action-verification]].

- Action-button presets on the notification: **Snooze 30m**, **Snooze 1d** (plus **Complete**).
- Current verified Linux behavior: Snooze 30m creates a new reminder row with `due_at_utc = now + 30m` and keeps the original reminder row [[sources/2026-05-17-os-notifications-linux-sound-and-action-verification]].
- Re-arming the snoozed reminder on next launch was not explicitly re-tested in the verification session [[sources/2026-05-17-os-notifications-linux-sound-and-action-verification]].
- **No [[FocusHistory]] event** at snooze time remains the older design intent; no newer source contradicted it.
- **No cross-device replication** — snooze is per-device.
- Snooze does not alter `quest.due`, `quest.due_time`, or the series cadence.

> [!warning] Superseded by implementation verification [[sources/2026-05-17-os-notifications-linux-sound-and-action-verification]] (2026-05-17)
> The previous wiki claim said Snooze creates no new reminder row. Current Linux evidence says Snooze 30m creates a new reminder row and retains the original.

## Permissions

Permission is requested **just-in-time on first reminder save** (rationale UI + system prompt), with a Settings toggle as fallback [[sources/2026-04-21-notifications-grilling]]. If denied, the quest can still have a due date, but the notification will not deliver — a subtle UI warning is shown [[sources/2026-03-21-mvp-baseline]].

Current Android implementation note: the reminder scheduling path is largely present already, but Android 13+ debug builds still need `POST_NOTIFICATIONS` declared/requested plus a frontend reminder-flow permission bridge before the app can reliably claim native OS notification delivery [[sources/2026-05-04-android-notification-debug-build]].

## Multi-device behavior

Reminder rows are **local-only** — they do not replicate via [[SpaceSync]] [[sources/2026-04-24-reminder-due-bridge-grilling]]. The quest (with `due` + `due_time`) replicates; each device derives its own Reminder from the incoming quest fields:

- Device A sets `due` / `due_time` → **quest** replicates via [[SpaceSync]] → device B's ingress runs the bridge locally and creates its own Reminder row.
- Completion on device A → quest status change replicates → device B's bridge deletes its local Reminder row and cancels the OS notification.
- Snooze does not replicate; each device retains its own notification surface independently.
- Under wall-clock semantics, each device fires the reminder at its own local wall-clock time (different absolute instants for devices in different zones).

> [!warning] Supersedes Reminder replication
> `src-tauri/src/services/space_sync/commands.rs` previously included `reminder` in the replicated entity set. That is **removed** under the bridge model — replicating the Reminder row would leak the origin device's timezone (via the cached `due_at_utc`) and duplicate a source of truth that already lives on the quest.

## Repeating quests

Repeating-quest reminders use the **same bridge** as single quests — no separate series template mechanism [[sources/2026-04-24-reminder-due-bridge-grilling]]:

- `generate_next_occurrence` (`src-tauri/src/services/quest.rs:146-222`) creates the occurrence quest row with its `due` set by the series schedule.
- The bridge (inside `update_quest` or directly inside `generate_next_occurrence`) upserts the Reminder row for the new occurrence.
- OS alarm scheduled at insert time.

> [!warning] Supersedes series reminder templates
> The `series_reminder_templates` table proposed in [[sources/2026-04-21-notifications-grilling]] decision 14 is **retired**. Occurrences derive their Reminder from their own `due` field via the standard bridge.

## Deferred / open

- **Notify X min before** (offset). Schema still has `kind` + `mm_offset` reserved, but unused by the bridge. Future work can reintroduce without schema change.
- **Per-user default time** (09:00 override). Currently hardcoded 09:00 for date-only quests.
- **Multiple reminders per quest.** Schema allows it, but the bridge manages exactly one row per quest. Future work can allow multiple via a dedicated UI.
