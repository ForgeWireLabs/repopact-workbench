# RepoPact Workbench

**A desktop interface for exploring and maintaining RepoPact governance in your repository.**

RepoPact Workbench brings project work, decisions, validation, and repository maps into a single native application. It is designed for people who want to inspect and manage RepoPact records without working only from the command line or editing JSON by hand.

Workbench is an early, source-build preview. **Prebuilt installers are not currently published.** Its application version is independent of the [RepoPact Core](https://github.com/ForgeWireLabs/repopact-core) CLI and package version.

## What you can do

- Open a local repository and inspect its governance state.
- Browse work items and decisions, and create or edit supported records.
- Validate the repository and explore graph-backed views.
- Review proposed changes before applying them, then validate the result.
- Use the mobile repository import and export flow on Android.

Core owns RepoPact's schemas and governance interpretation. Workbench supplies the interface and application features around that shared Core, so both the CLI and app use the same governance rules.

## Run from source

You will need Node.js with npm, Rust with Cargo, and the [Tauri 2 prerequisites](https://v2.tauri.app/start/prerequisites/) for your platform. The application does not require Python or pip at runtime.

```bash
git clone https://github.com/ForgeWireLabs/repopact-workbench.git
cd repopact-workbench
npm ci
npm run tauri -- dev
```

To build a native application bundle for your current desktop platform:

```bash
npm run tauri -- build
```

For Android development or a local APK build, install the Android SDK/NDK, JDK, and Rust Android targets in addition to the Tauri prerequisites, then run:

```bash
npx tauri android dev
npx tauri android build
```

Build evidence currently covers Windows desktop and Android x86_64 emulator use. Linux desktop runtime, macOS, and iOS have not been established. Building on a platform does not by itself establish supported runtime behavior there.

## Releases and support

There are no published Workbench installers yet. Check [GitHub Releases](https://github.com/ForgeWireLabs/repopact-workbench/releases) for future downloads and release notes. Until then, use the source-build instructions above.

GitHub connectivity is optional; local repository use does not require a GitHub account. Remote GitHub features require network access and their own configuration. Credentials are managed through the platform's native credential facilities.

To learn about RepoPact Core and the command-line workflow, see the [Core repository](https://github.com/ForgeWireLabs/repopact-core) and its [adoption guide](https://github.com/ForgeWireLabs/repopact-core/blob/main/docs/adopt-repopact.md). For contribution guidance or a problem report, use [GitHub Issues](https://github.com/ForgeWireLabs/repopact-workbench/issues).

## License

RepoPact Workbench is licensed under Apache-2.0. See [LICENSE](LICENSE).
