---
title: 2026-05-04 Android Notification Debug Build
type: source
created: 2026-05-04
updated: 2026-05-04
sources: [2026-05-04-android-notification-debug-build]
tags: [fini, android, notifications, reminder, debug-build]
---

# 2026-05-04 Android Notification Debug Build

Fini's Android reminder pipeline is mostly wired already through `tauri-plugin-notification`, the Android notification channel, and reminder scheduling. The current gap is Android 13+ `POST_NOTIFICATIONS` permission: the manifest, `MainActivity.kt`, and frontend reminder flow lack the just-in-time permission path needed for real native reminder delivery in a debug build [[sources/2026-05-04-android-notification-debug-build]].

## Key claims

- Keep the existing Android reminder scheduling path based on `tauri-plugin-notification` [[sources/2026-05-04-android-notification-debug-build]].
- Add Android 13+ notification permission support with `android.permission.POST_NOTIFICATIONS` [[sources/2026-05-04-android-notification-debug-build]].
- Request notification permission only when the user first enables or creates a reminder that needs OS delivery, not on app launch [[sources/2026-05-04-android-notification-debug-build]].
- If permission is denied, the app should not silently claim reminder notifications are active; it should surface clear UI feedback [[sources/2026-05-04-android-notification-debug-build]].
- Current evidence: plugin/channel/scheduling code exists, Android target SDK is 36, but the generated Android manifest lacks `POST_NOTIFICATIONS`, `MainActivity.kt` requests only `RECORD_AUDIO`, and there is no frontend notification-permission request path yet [[sources/2026-05-04-android-notification-debug-build]].
- Verification path is `make android-debug-deploy`, then create a near-future reminder and confirm the notification appears in Android's notification shade while the app is backgrounded [[sources/2026-05-04-android-notification-debug-build]].

## Open questions

- None stated directly in the source.

## Related pages

- [[os-notification]]
- [[Reminder]]
