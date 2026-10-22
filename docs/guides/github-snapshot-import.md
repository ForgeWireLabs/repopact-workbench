# GitHub repository snapshot import (WI067)

This guide describes the provider and snapshot-import implementation recorded
in WI067. Its checkpoint evidence is historical and does not mean every
integration gate is currently open: the latest tracked status says a production
GitHub App was not registered at the **2026-09-16** checkpoint, and no newer
registration evidence is present in this source snapshot. The live registration
state has not been independently checked here. See Core [Decision 0061](https://github.com/ForgeWireLabs/repopact-core/blob/main/decisions/0061-remote-repository-providers-materialize-immutable-snapshots-through-native-owned-authorization-and-the-existing-workspace-pipeline.md)
for the architecture this behavior implements, and
[GitHub App setup](github-app-setup.md) for the registration contract.

## What this is

RepoPact can materialize a GitHub repository at an exact commit as an
ordinary local, app-private workspace -- the same kind of workspace a
local folder pick or a mobile SAF/archive import produces. This is a
**snapshot**, not a clone:

- there is no `.git` directory;
- there is no live relationship to GitHub after import;
- local edits never write back to GitHub, automatically or otherwise;
- the workspace works fully offline once imported.

Real Git synchronization (`clone`/`fetch`/`pull`/`push` against a real
`.git` working tree) is a separate, later work item (WI068) and shares no
acquisition code with this feature.

## How it works

1. The user selects a branch, tag, or commit.
2. RepoPact resolves that selection to an exact, immutable 40-character
   commit SHA -- server-side, natively, never trusting a value the
   frontend already displayed. Annotated tags are peeled to their
   underlying commit via GitHub's Git Data API, with a bounded depth
   against a malformed or cyclic tag chain.
3. RepoPact downloads GitHub's zipball archive for that exact commit,
   streamed to app-private staging with a bounded byte count enforced
   while streaming (never buffered fully in memory, never trusting a
   declared `Content-Length` alone).
4. The archive is extracted through RepoPact's existing, unmodified,
   security-hardened archive importer (the same one used for local ZIP
   imports and Android SAF archive imports) -- zip-slip/`..`-traversal
   rejection, symlink-escape protection, entry-count/expanded-byte/depth
   bounds, and duplicate/case-conflict handling all apply identically.
   GitHub's synthetic `owner-repo-shortsha/` wrapper directory is
   promoted away as a purely filesystem-level step, after extraction has
   already validated every path.
5. The result publishes as an ordinary workspace through the same
   staging-then-publish transaction every other acquisition path uses. A
   failed or cancelled import leaves no ready workspace, no completed
   registry entry, no orphaned staging tree, and no partial downloaded
   archive.
6. Workspace provenance records the provider, repository identity,
   selected ref, resolved commit SHA, acquisition timestamp, and snapshot
   semantics -- never a credential, never a temporary signed URL, never an
   `Authorization` header value.

## Network and resource bounds

- Snapshot downloads are capped at 300 MiB compressed, enforced while
  streaming.
- REST API responses are capped at 8 MiB.
- Connect timeout: 10 seconds. Download timeout: 10 minutes (a
  repository archive is much larger and slower than an API call).
- Redirects are followed manually, up to 5 hops. An `Authorization`
  header is only ever forwarded to `api.github.com` or
  `codeload.github.com`; a redirect to any other host, or a redirect that
  would downgrade an https request to http, drops the header or fails
  outright.

## Cancellation

Import can be cancelled from the UI at any point before publication;
cancellation is native (a shared cancellation token checked between
bounded units of work), never a matter of the frontend simply abandoning
the request. Cancellation leaves no ready workspace and no partial
downloaded file.

## Error behavior

Failures are typed, not raw GitHub prose: expired/invalid credentials,
forbidden/not-found repositories, rate limiting (including GitHub's
secondary rate limit, detected via a `Retry-After` response), 5xx server
errors, network/TLS failures, redirect problems, and malformed or
truncated responses are all represented as a small set of stable error
codes the frontend can branch on. A hostile or oversized error response
body is bounded and redacted before it ever reaches an error message,
evidence, or a log.

## Credential storage

Access and refresh tokens are stored only through the real OS-protected
credential facility for the running platform:

- **Windows**: Windows Credential Manager, via the `keyring` crate. Runtime
  round-trip and cross-process persistence tests were recorded for the
  2026-09-16 checkpoint. This is credential-backend evidence, not a general
  Workbench support declaration.
- **macOS/iOS, Linux**: the same `CredentialStore` abstraction targets
  Keychain and Secret Service/libsecret respectively via the same
  `keyring` crate, but runtime behavior on these platforms was not exercised
  in the recorded checkpoint. See the [current platform matrix](../../README.md#platform-availability-and-evidence).
- **Android**: a dedicated `repopact-mobile-credential` crate implements
  the same `CredentialStore` trait against a real Android Keystore-backed
  encryption key. Android Keystore owns the cryptographic key material,
  not the token itself: a non-exportable AES-256-GCM key is generated
  inside `AndroidKeyStore` under the dedicated alias
  `com.forgewirelabs.repopact.remote-provider.v1`, and it encrypts a
  versioned envelope (version, IV, ciphertext+authentication tag) that is
  the only thing written to this app's private (non-world-readable)
  SharedPreferences storage -- never the token in plaintext, never
  SharedPreferences plaintext, never SQLite plaintext, never a broad
  storage permission, never SAF. A missing or invalidated key, a corrupt
  or wrong-version envelope, and an authenticated-encryption tag failure
  all fail as a distinct typed error rather than returning plaintext,
  crashing, or silently minting a fresh key that pretends old ciphertext
  is still valid -- in every case the user must reconnect. This has been
  proven with real device evidence (put/get/overwrite/delete, distinct
  access/refresh and per-connection keys, persistence across a real
  process kill and restart, at-rest plaintext absence, zero logcat
  leakage, and every failure mode above) rather than unit tests alone.
  The tested emulator's Keystore implementation is software-backed
  (`insideSecureHardware=false`); no hardware/StrongBox backing is
  claimed. This is evidence for the credential backend only. The current
  `src-tauri/src/lib.rs` registers GitHub provider commands only for
  non-Android targets; Android repository import/export through the system
  document picker is separate.

## Operator gate: GitHub App registration

The canonical Core WI067 record and its latest linked checkpoint evidence say
that no production GitHub App had been registered as of **2026-09-16**. This
source snapshot contains no newer registration evidence; current live
registration status has not been independently checked. Private/organization
browsing and authenticated end-to-end flows therefore remain unconfirmed here.
An operator-owned record must update the status before these flows are
presented as available. See Core [Decision 0062](https://github.com/ForgeWireLabs/repopact-core/blob/main/decisions/0062-browser-redirect-pkce-authorization-replaces-device-flow.md)
for the browser-redirect-with-PKCE design and [WI067](https://github.com/ForgeWireLabs/repopact-core/blob/main/work/active/067-github-repository-provider-secure-user-authorization-and-remote-repository-import/README.md)
for the authoritative work record.

When an official build is configured, its build pipeline supplies the GitHub
client ID, public client secret, and app slug as compile-time application
metadata. End users do not enter these values. Public-repository ref resolution
and archive download were proven without authentication against
`octocat/Hello-World` in historical checkpoint evidence; this does not prove
that an official production build is currently configured.

## What is still pending

- Live authorized browsing of private repositories and organization
  installations (GH-005) -- pending in the latest recorded WI067 status; see
  the registration caveat above.
- Full desktop *and* Android end-to-end authenticated runtime proof
  (GH-012) -- pending in the latest recorded WI067 status. The checked-in
  `src-tauri/src/lib.rs` currently registers GitHub provider commands only
  for non-Android targets. Android credential storage and Android repository
  import/export do not by themselves establish the GitHub connection flow.
- iOS has not been evaluated at all for this feature.

## Provider extension

The architecture is provider-neutral in executable structure, not naming
only. A future non-GitHub provider (GitLab, Forgejo, a generic Git host)
implements the same seam:

```text
resolve ref -> immutable revision
describe snapshot -> provider-neutral descriptor
open snapshot -> bounded byte stream to app-private staging
                    -> the existing secure archive importer
                    -> ordinary workspace publication
```

and requires no change to `DesktopService`, `RepositorySession`,
`RepositoryTopology`'s core repository model, the mutation pipeline, or
governance/ROG authority. `repopact-remote-provider`'s `FakeProvider` is a
non-GitHub implementation of this exact seam, and its own test suite
proves a fake provider's snapshot flows through the real, unmodified
workspace-publication pipeline with zero GitHub-specific branching
anywhere on the path.
