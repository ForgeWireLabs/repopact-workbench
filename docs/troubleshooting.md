# Troubleshoot Workbench

*How-to guide.*

Start with **Validation** when Workbench opens a repository but shows errors or
warnings. Diagnostics come from the pinned RepoPact Core revision; follow the
reported record path and correct the authoritative repository files, then
refresh or reopen the repository.

## Repository is rejected or marked invalid

- Confirm that the selected directory is the repository root containing
  `governance/`, `work/`, and the other RepoPact records, rather than a parent
  folder or a nested project directory.
- Read the diagnostic code, message, and path in **Validation**.
- Check the referenced JSON against the repository's schema and the applicable
  Core [specification](https://github.com/ForgeWireLabs/repopact-core/blob/main/SPEC.md).
- Fix the source record, refresh, and verify that Core reports the expected
  result. A dashboard or graph view cannot override a validation error.

## A mutation plan is blocked or stale

Read all plan diagnostics and resolve blocking issues in the source records.
Workbench does not apply a plan with blocking diagnostics. If the repository
changed after the plan was prepared, discard it, refresh, and request a new
plan. A stale plan is rejected before mutation; do not retry the old plan.

If apply reports failure, inspect the diagnostics and revalidate. Core's typed
mutation result reports rollback on a failed apply; preserve the resulting
repository state and evidence when reporting a reproducible defect.

## The dashboard does not match files on disk

Use **Refresh** to request a new repository snapshot. Workbench also observes
external file changes, but a transient UI state may be behind a just-completed
operation. Reopen the repository if refreshing does not reconcile the display.
Confirm the files and Core validation before making another change.

## GitHub is unavailable

- Local opening and operation should still work without GitHub or network
  access.
- A development build may report that GitHub integration is not configured.
  The latest tracked Core WI067 status says no production GitHub App had been
  registered as of 2026-09-16; there is no newer registration evidence in this
  source snapshot. Do not paste tokens or application values into an issue.
- Authentication expiry, missing repository permission, rate limits, TLS or
  network errors are surfaced as typed provider errors. Check the account and
  repository access in GitHub and retry after correcting the underlying issue.
- Imported repositories are commit snapshots. If you need current remote
  content, acquire a new snapshot; pull/fetch/push synchronization is not
  implemented here.

## Android import or export fails

Use the system document picker and select a supported repository directory or
archive. Some document providers restrict selecting a storage root; choose an
allowed subdirectory or archive instead. Export is explicit and can fail when
the selected provider refuses the write. The app should report the operation
failure; retry with a writable destination and confirm the exported files
before deleting any source copy.

The recorded Android acceptance includes recovery from a rejected Download
root selection, but it does not establish every permission-denial or
revocation scenario. Report the device/API level, provider, exact operation,
and redacted diagnostic when reporting a defect.

## Development build fails

- Run `npm ci` from the repository root to install the lockfile's frontend
  dependencies.
- Confirm Node/npm and Rust/Cargo are available, then consult the official
  [Tauri prerequisites](https://v2.tauri.app/start/prerequisites/) for system
  libraries or SDK setup on your platform.
- Use `npm run typecheck`, `npm test -- --run`, `npm run build`,
  `npm run types:check`, and `cargo test --workspace --all-targets --locked`
  to isolate the failing layer.
- Android builds additionally require the SDK/NDK, JDK, and target toolchains.
  Windows desktop is the main native runtime evidence; Linux GUI, macOS, and
  iOS are not currently established by the recorded platform matrix.

For a source-backed product defect, include the Workbench revision, platform,
commands, sanitized diagnostics, and whether Core's own CLI gives the same
result. Never attach repository secrets or unredacted credentials.
