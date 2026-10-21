# RepoPact Workbench

**A native interface for inspecting and working with RepoPact-governed repositories.**

RepoPact records the project state that should survive a coding session: work, decisions, constraints, validation, and evidence. Workbench brings those records into an application for people who want to explore a repository and review governed changes without making the command line or hand-editing JSON their only interface.

Workbench is a separate product from [RepoPact Core](https://github.com/ForgeWireLabs/repopact-core). Core remains the authority for governance schemas, interpretation, validation, graph analysis, and typed repository changes. Workbench presents that shared Core through a Tauri desktop and mobile application.

## Explore a governed change

Open a repository to inspect its validation state, work items, decisions, evidence, and repository relationships. When creating or editing a supported work item, Workbench asks Core to prepare a typed plan. Review the proposed change and diagnostics before choosing whether to apply it; successful application is followed by Core validation.

![RepoPact Workbench showing a Rust-owned proposed mutation plan marked ready for review with no blocking diagnostics.](docs/assets/readme/plan-review-android-api35.png)

*Real Workbench capture from an Android API 35 x86_64 emulator run. The displayed plan is a disposable validation scenario; its session token is excluded from this curated image. This is product evidence, not an installer or release announcement.*

Workbench includes:

- A dashboard for repository validation and navigation to work, evidence, decisions, and graph views.
- Searchable work lifecycle and decision views, with source-backed record details.
- Validation results and graph relationships to help inspect the repository.
- Guided creation and supported typed edits or lifecycle transitions for work items.
- A reviewable preview and diagnostics before an approved plan is applied.
- Android repository import into app-private storage and export through the system document picker.

Workbench screens are read models of a Core snapshot. They help people inspect the repository; the repository records remain authoritative.

## Build and run from source

Workbench is a source-build preview. **Prebuilt installers are not currently published.**

Prerequisites are Node.js with npm, Rust with Cargo, and the [Tauri 2 platform prerequisites](https://v2.tauri.app/start/prerequisites/) for your development target. Python and pip are not required to run the application.

```bash
git clone https://github.com/ForgeWireLabs/repopact-workbench.git
cd repopact-workbench
npm ci
npm run tauri -- dev
```

Build a native desktop bundle for the current platform:

```bash
npm run tauri -- build
```

For Android development, also install the Android SDK/NDK, JDK, and Rust Android targets required by Tauri:

```bash
npm run tauri -- android dev
npm run tauri -- android build
```

The Workbench version is maintained separately from Core’s CLI/package version. The Rust dependencies in this repository are pinned together to one immutable Core revision; updates to that pin are reviewed as compatibility changes.

## Platform evidence

Current recorded evidence covers Windows x64 desktop builds and regression checks, and Android API 35 x86_64 emulator build and runtime scenarios. Android testing exercised repository import, navigation, validation, graph queries, a disposable plan preview/apply, post-apply validation, and restart/resume. It does not establish support for every Android device or operating-system permission path.

Linux WSL2 build and test evidence is available, but graphical Workbench runtime on Linux and bare-metal Linux host behavior have not been demonstrated. macOS and iOS are untested. Follow the repository’s native platform evidence for the exact target and coverage; one platform’s result does not establish another’s.

These are source and validation records, not a promise of released binaries. Check [GitHub Releases](https://github.com/ForgeWireLabs/repopact-workbench/releases) for future distribution announcements.

## Product boundaries

Core and Workbench deliberately have different responsibilities:

| RepoPact Core | RepoPact Workbench |
| --- | --- |
| Schemas and governance interpretation | User interface and application orchestration |
| Canonical validation and diagnostics | Repository selection and session state |
| Graph and analysis semantics | Filesystem observation and presentation |
| Typed mutation planning and post-validation | Native desktop and mobile integration |
| CLI and headless use | Human review of supported operations |

The Workbench uses Rust-owned repository sessions and typed operations. The frontend does not expose a general-purpose shell command for changing repository state. Proposed edits are represented as Core plans with an explicit review step; stale sessions and plans are rejected by the native/Core boundary.

Local repository use does not require a GitHub account. GitHub integration is optional and requires network access when used. Credential material belongs in platform-native credential storage, not frontend code or application logs. Hosted workflows and remote publication are not part of ordinary local Workbench use.

## Development and support

This repository includes the Tauri application, Rust workspace, frontend, generated API types, tests, and platform evidence. Useful local checks include:

```bash
cargo test --workspace --all-targets --locked
npm run typecheck
npm test -- --run
npm run build
npm run types:check
```

See the [Core repository](https://github.com/ForgeWireLabs/repopact-core) for the command-line package, adoption tutorial, and RepoPact governance model. Use [GitHub Issues](https://github.com/ForgeWireLabs/repopact-workbench/issues) for bug reports and project discussion. For build prerequisites specific to your host, follow the official [Tauri 2 documentation](https://v2.tauri.app/start/prerequisites/).

## License

RepoPact Workbench is licensed under [Apache-2.0](LICENSE).
