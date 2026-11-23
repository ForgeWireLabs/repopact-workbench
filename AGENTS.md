# RepoPact Workbench Agent Contract

## Authority boundary

RepoPact Core at revision `1c1f32ae619e8135227acfa87393696ff608951c` is the
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

<!-- BEGIN SHARED AGENT SELF-AUDIT v1 -->
## Mandatory pre-completion adversarial self-audit

Before claiming completion or requesting review, inspect the full task-scoped change against an explicit review base: committed branch diff, staged and unstaged changes, and relevant untracked files. Record base/HEAD and preserve unrelated user changes. A bare `git diff` is not the whole candidate.

Look for concrete correctness and edge-case defects, concurrency/races, fail-closed behavior, API/schema compatibility, security and authority boundaries, durability, resource leaks/cleanup, missing positive and negative tests, and unnecessary complexity or out-of-scope edits. Tie each finding to a location and credible failure scenario; do not invent stylistic defects or churn working code.

Repair confirmed defects only within authorized scope, rerun affected checks, and reinspect remediation. Use at most two repair/re-review cycles by default; if blocked, report `INCOMPLETE` or `FAIL` instead of looping or weakening tests/invariants. Escalate changes requiring new authority.

Pre-existing failures are not waived by showing they also occur on the baseline. Separate cause attribution from resolution: repair the confirmed root cause when authorized, or create/link an owned, actionable remediation work item with reproduction, evidence, and a validation gate. Preserve failures and keep project-level health accurately red or incomplete until resolved. Never use permanent skips, false evidence, or weakened assertions to manufacture green results.

Handoff must state `Self-Audit: PASS|INCOMPLETE|FAIL`, reviewed revision and scope, concrete findings/fixes (or no confirmed findings), actual checks/results, unrun checks, and residual risks. PASS means review completed with no known in-scope blockers, not proof of defect freedom. Self-review is neither independent approval nor authorization to merge, deploy, release, publish, or perform destructive operations.
<!-- END SHARED AGENT SELF-AUDIT v1 -->
