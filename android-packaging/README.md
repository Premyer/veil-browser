# Veil Web Android packaging

Separate Capacitor 8 wrapper of the current client-only workspace; the production TanStack Start application and Android GitHub repositories are not changed. The copied workspace is rendered with React in the standalone package, not by replacing the project's router. No preview URL or published site is required. Stable local origin: https://localhost. App ID app.veil.webworkspace, min Android 7 (API 24); keep Android System WebView current. Google Fonts and remote websites require internet. This is not GeckoView or full Firefox.

## Rebuild (Linux / Android SDK)

1. Install Java 21, Android command-line tools, platform 36 and build-tools 36.0.0; accept Android SDK licenses. Install Gradle 8.14.3 and Bun.
2. From project root: `python3 android-packaging/prepare.py`.
3. In `/tmp/veil-web-android`: `bun install --frozen-lockfile`, `bun node_modules/vite/bin/vite.js build`, `bun node_modules/@capacitor/cli/bin/capacitor add android`.
4. From project root: `python3 android-packaging/harden.py /tmp/veil-web-android`.
5. Set ANDROID_HOME to your SDK; in the packaging directory run `gradle -p android assembleDebug --no-daemon`.
6. APK: `android/app/build/outputs/apk/debug/app-debug.apk`; verify with `apksigner verify --verbose`.

Native exports use cache files plus the Android share sheet; explicitly save to Files or share. Imports use Android's document picker. Cache copies of exports may remain until Android clears the app cache. Private tabs are omitted by the shared model; this is not cookie-isolating incognito. Cloud backup and device-transfer rules exclude workspace storage. Exported files and files shared to another service are outside that protection.

## Verified test package

2026-10-26: Gradle BUILD SUCCESSFUL (154 tasks), APK v2 signature verified, ZIP integrity verified, six model tests passed. Packaged client checked at 420×786 in Chromium: opens, theme persists, private tabs excluded from saved data, no horizontal overflow or runtime errors. Android installation, native export/import and external opening have not been exercised on a device/emulator. Debug-signed, not Play Store release-signed. Preserve a release signing identity for future updates; generated debug keys may differ on another machine.
