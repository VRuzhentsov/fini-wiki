# Android Notification Debug Build

Date: 2026-05-04

## Context

Need the Android debug build to create real native reminder notifications that appear in the Android OS notification bar. The requested UX constraint is to ask for Android notification permission only when the user first enables or creates a reminder, not on app launch.

## Summary

The existing Android reminder pipeline is mostly in place: the app initializes `tauri-plugin-notification`, creates an Android notification channel, and schedules reminder notifications through the plugin. The main gap is Android 13+ notification permission handling. The generated Android app targets SDK 36, but the manifest does not declare `POST_NOTIFICATIONS`, `MainActivity.kt` does not request it, and the frontend has no bridge for checking or requesting it before reminder creation.

## Decisions

- Keep the existing reminder notification scheduling path based on `tauri-plugin-notification`.
- Keep the existing Android notification channel setup unchanged unless verification reveals a separate Android-specific bug.
- Add Android notification permission support for Android 13+.
- Request `POST_NOTIFICATIONS` only when the user first enables or creates a reminder that needs OS notification delivery.
- If permission is denied, do not silently claim reminder notifications are active; surface clear UI feedback.

## Plan

1. Add `android.permission.POST_NOTIFICATIONS` to `src-tauri/gen/android/app/src/main/AndroidManifest.xml`.
2. Add Android runtime request support for `POST_NOTIFICATIONS` in `src-tauri/gen/android/app/src/main/java/com/fini/app/MainActivity.kt`, guarded to Android 13+.
3. Expose a small app-triggered bridge so the Vue app can check and request notification permission from the reminder flow instead of at launch.
4. Call that bridge from the reminder create/enable path in the frontend before scheduling or persisting reminder-notification state that depends on OS delivery.
5. If the user denies permission, show a clear message that Android OS notifications require notification permission.
6. Verify with `make android-debug-deploy`, then create a near-future reminder on device and confirm the notification appears in the system notification shade while the app is backgrounded.

## Evidence

- `src-tauri/src/lib.rs:93-95` initializes `tauri-plugin-notification`.
- `src-tauri/src/lib.rs:124` calls `setup_notification_channel(&app_handle)` during app setup.
- `src-tauri/src/services/notification.rs:96-110` creates Android notification channel `fini.reminders`.
- `src-tauri/src/services/notification.rs:126-176` schedules mobile reminder notifications through `tauri-plugin-notification` using `.schedule(...).show()`.
- `src-tauri/src/services/notification.rs:258-287` shows immediate notifications through the same plugin on non-Linux targets.
- `src-tauri/src/services/reminder.rs:81-123` and `src-tauri/src/services/reminder.rs:160-196` wire reminder creation/upsert to notification scheduling.
- `src-tauri/gen/android/app/build.gradle.kts:20-29` sets `compileSdk = 36`, `minSdk = 24`, and `targetSdk = 36`.
- `src-tauri/gen/android/app/src/main/AndroidManifest.xml:3-7` contains `INTERNET`, `RECORD_AUDIO`, and `SCHEDULE_EXACT_ALARM`, but not `POST_NOTIFICATIONS`.
- `src-tauri/gen/android/app/src/main/java/com/fini/app/MainActivity.kt:14-16` requests only `RECORD_AUDIO` permission.
- Search across `src/` found no frontend notification-permission request path.
- Existing device build/deploy path is `make android-debug-deploy` per `Makefile:684-689`.

## Open Questions

- None.
