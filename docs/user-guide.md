# Use RepoPact Workbench

*Task guide.*

Workbench is useful when you want a visual way to understand RepoPact records
and review supported record changes. Use [RepoPact Core](https://github.com/ForgeWireLabs/repopact-core)
for the headless CLI lifecycle or when you need to initialize/adopt a
repository. Workbench does not replace Git or claim to confine the application
to one repository.

## Open a repository

On desktop, start Workbench and choose a local repository directory. On Android,
use the system document picker to import a repository directory or supported
archive into app-private storage. An imported Android workspace is a managed
copy; edits there do not silently update the source location.

If the selected folder is not a RepoPact repository, Workbench reports Core's
validation diagnostics. Use Core's [adoption tutorial](https://github.com/ForgeWireLabs/repopact-core/blob/main/docs/adopt-repopact.md)
to add RepoPact to an existing repository, then reopen or refresh it in
Workbench.

## Read the dashboard and records

The dashboard summarizes repository health, work items, evidence, decisions,
and relationships. Open **Validation** to read diagnostics by severity and
follow each diagnostic's source path or record. Open **Work**, **Decisions**,
and **Evidence** to inspect the records themselves. **Graph** and **Analysis**
show relationships and derived summaries; the repository files remain the
durable authority.

Workbench refreshes its repository snapshot when it observes external changes
and provides a manual **Refresh** action. If the view appears behind the files,
refresh and check Validation again before acting.

## Review a supported work-item change

The current controls cover three work-item operations:

- **Create:** enter a title, owner scope, initial lifecycle status, and at
  least one acceptance criterion. Confirm that the work is being recorded
  before implementation before requesting a plan.
- **Edit:** change the work-item title. Other fields are not editable through
  this form.
- **Transition:** request a lifecycle-status change. Core checks the lifecycle
  and repository constraints before a plan can be applied.

Acceptance-criterion and evidence edits, decisions, policies, and arbitrary
file changes are not exposed as Workbench mutation controls. Use Core's
documented workflow for operations Workbench does not provide.

1. Open the relevant work item and inspect its owner scope, criteria, evidence,
   and related records.
2. Choose a supported operation to request a plan from Core.
3. Read the proposed changes, applicability, diagnostics, and changed paths.
   A plan with blocking diagnostics cannot be applied.
4. Apply only when the preview matches your intent, or discard the plan.
5. Read the result and post-apply validation. Core reports a failure and rolls
   back a failed mutation; the repository records remain the source to inspect.

Plans are opaque and session-bound. If a plan is stale, Workbench applies
nothing; refresh the repository and prepare a new plan. Workbench exposes a
bounded set of Core operations rather than arbitrary file editing or a general
shell.

## Work offline or use GitHub

Local repository browsing, validation, graph exploration, and supported record
changes do not require a GitHub account. GitHub is an optional network
integration. When configured, it imports a repository at an exact commit as a
snapshot; it does not clone a `.git` repository or provide fetch, pull, push,
or remote write-back. Once imported, the snapshot can be opened and used
offline. See [GitHub snapshot import](guides/github-snapshot-import.md) for
resource bounds and status limitations.

## Android import and export

Android uses the system document picker. Import copies a supported directory or
archive into Workbench-managed app-private storage. Export is an explicit user
action through the document picker; the app does not silently write back to the
source provider. Platform acceptance covers Android API 35 x86_64 scenarios;
other devices and permission paths are not implied by that result. See the
[platform evidence](../evidence/WI074-RPS-011-native-platform-acceptance-2026-09-28.json).

Workbench evidence shows an imported Android repository can be reopened after
an app restart. That is persistence evidence for the tested flow, not an
automatic backup or synchronization service. Keep independent backups of
important repositories using your normal version-control and storage process.

## What Workbench does not provide

- It does not replace Git or synchronize commits with a remote repository.
- It does not accept every possible work-item, decision, or policy mutation;
  the available operations are the typed operations Core exposes through this
  application.
- It is not an issue tracker, hosted CI service, arbitrary command runner, or
  operating-system sandbox.
- The current source-build preview has no published installer in its GitHub
  Releases. Platform support claims are limited to the exact evidence linked
  from the [README](../README.md#platform-availability-and-evidence).

For errors, see [Troubleshooting](troubleshooting.md). For development, see
[Contributing](../CONTRIBUTING.md).
