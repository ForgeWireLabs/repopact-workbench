# RepoPact Workbench Agent Contract

## Authority boundary

RepoPact Core at revision `6aff2c376efb5ddf236bd11cd1d700f873ec6a4f` is the
only authority for governance schemas, interpretation, validation, graph,
analysis, mutation, and headless engine semantics. Workbench owns its UI,
application orchestration, session state, filesystem observation, and native
desktop/mobile integration. Never implement a competing validator or silently
reinterpret Core records.

## Preservation and security

- Keep Core dependencies on one exact immutable Git revision; do not copy Core
  source or use floating refs.
- GitHub connectivity stays optional; local/offline repository use remains
  supported.
- Keep secrets and credential material in native credential stores; never put
  them in frontend code, logs, fixtures, or build artifacts.
- Do not overstate `pre-action` as `sandbox/process-enforced` or infer platform
  support from a different target.
- Preserve the source provenance manifest and historical evidence.
- Hosted workflows remain disabled; no publishing or remote mutation is part
  of local S3 validation.

## Ownership and validation

Owners and Workbench-only invariants are recorded under `governance/`. This
repository records only Workbench-owned work; the approved WI074 cross-project
item remains canonical in the separate RepoPact authorization checkout. Update
the local derived dashboard only through its declared generator. Record exact
commands, revisions, results, platform, and limitations in `evidence/`.

Run the local Cargo tests, npm typecheck/tests/build, type-generation check,
and Tauri native build before claiming Windows S3 acceptance. Attempt Android
only with the configured SDK plus a usable device/emulator. Do not claim
untested Linux, macOS, Android, or iOS behavior.
