# Contributing to RepoPact Workbench

Workbench is a Tauri application with a Rust workspace and a React/TypeScript
frontend. It presents repository state and coordinates supported operations;
[RepoPact Core](https://github.com/ForgeWireLabs/repopact-core) owns record
schemas, semantic interpretation, validation, graph and analysis semantics,
and typed mutation operations. Read the [Workbench agent contract](AGENTS.md)
and [documentation index](docs/README.md) before making a change.

## Choose the right scope

Workbench owns its interface, application orchestration, repository sessions,
filesystem observation, and native desktop/mobile integration. Keep changes in
the matching owner scope in `governance/owners.json`. Record Workbench-owned
work in `work/` before implementation, with observable acceptance criteria and
evidence requirements. Cross-project Core/Workbench extraction work remains
tracked by canonical WI074 in Core; do not create a second WI074 record here.

Do not implement a second validator or reinterpret Core records in the UI. The
eight direct Core Rust dependencies share the immutable revision recorded in
the workspace `Cargo.toml` and `Cargo.lock`. Review and justify a Core pin
change explicitly; do not use a floating Git reference or copy Core source into
this repository.

## Set up a development checkout

For Windows desktop development, install Node.js with npm, a Rust stable MSVC
toolchain, the Microsoft C++ Build Tools, and Microsoft Edge WebView2. Use the
official [Tauri v2 prerequisites](https://v2.tauri.app/start/prerequisites/)
for the current platform-specific system requirements. Android development
also needs the Android SDK/NDK, JDK, and Rust Android targets described by
Tauri. Workbench's proven platform coverage is listed in the [README](README.md);
requirements or a successful build alone do not establish runtime support.

From the repository root:

```powershell
npm ci
npm run tauri -- dev
```

The app uses the pinned Core Rust crates directly and does not need Python or
`pip` at runtime.

## Run the local checks

Before opening a pull request, run the relevant checks. The full recorded
Workbench baseline includes:

```powershell
cargo test --workspace --all-targets --locked
npm run typecheck
npm test -- --run
npm run build
npm run types:check
```

For a Windows desktop acceptance claim, also build the native application:

```powershell
cargo build --locked --package repopact-desktop
```

Run Android build/runtime checks only when an SDK and a suitable emulator or
device are available. Report each command's actual result and platform in an
evidence record. Do not convert WSL2 headless results into Linux GUI evidence,
or Windows results into macOS/iOS evidence.

If Rust command types change, run `npm run types:generate`, review the diff in
`src/generated/types.ts`, then run `npm run types:check`. Generated types are a
projection of the native command API, not an independent source of truth.

## Prepare a pull request

- Keep the change focused on one Workbench-owned scope.
- Explain the user-visible problem and the supported behavior it changes.
- Link its Work Item and evidence; for UI changes, include a genuine screenshot
  only when it clarifies the workflow, with fixture provenance and sensitive
  values removed.
- Include platform, command, result, and limitation details for validation.
- Keep credentials, access tokens, private repository data, and operator
  approval material out of commits, screenshots, tests, and logs.
- Keep hosted workflows and publication disabled unless the repository's
  explicit governance authorizes a separate change.

Use Core's [contribution guide](https://github.com/ForgeWireLabs/repopact-core/blob/main/CONTRIBUTING.md)
for changes to Core itself. For Workbench security reports, follow
[SECURITY.md](SECURITY.md).
