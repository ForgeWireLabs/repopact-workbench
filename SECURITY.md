# Workbench Security Policy

RepoPact Workbench is a Tauri desktop/mobile application that uses a Rust
backend, React/TypeScript interface, and an exact pinned revision of RepoPact
Core. Workbench owns presentation, local repository sessions, filesystem
observation, and platform integration. Core owns governance semantics,
validation, graph and analysis results, and typed repository mutations. Read
the [Core security policy](https://github.com/ForgeWireLabs/repopact-core/blob/main/SECURITY.md)
for Core's package and semantic-engine scope; it does not replace this policy.

## Reporting a vulnerability

Report suspected vulnerabilities privately through GitHub's **Report a
vulnerability** feature for this repository when it is available. If private
reporting is unavailable, contact the maintainers through the ForgeWire Labs
organization profile. Do not post secrets, credentials, private repository
data, or uncoordinated exploit details in a public issue. This project does not
promise a response or remediation time.

Include the affected Workbench revision and platform, relevant input and
workflow, expected security property, and reproducible impact where safe.
Ordinary feature requests and reproducible non-sensitive bugs can be reported
through [GitHub Issues](https://github.com/ForgeWireLabs/repopact-workbench/issues).

## Security-sensitive surfaces

- **Local repositories:** opening a repository does not make its records
  trustworthy. Core validation describes conformance to implemented rules; it
  is not repository authentication or a guarantee that its contents are safe.
- **Mutation review:** Workbench asks Core to construct typed plans, shows
  diagnostics, requires explicit review and apply, and revalidates afterward.
  Plans are session-bound; stale plans are rejected. These controls are not a
  general operating-system sandbox or a guarantee against every host-level
  threat.
- **GitHub access:** network access is optional. Workbench does not need GitHub
  for local repository use. User authorization tokens belong in the platform
  credential store, not repository files, frontend persistence, evidence, or
  logs. The packaged GitHub client ID, app slug, and value GitHub calls a client
  secret are application metadata in a distributed client, not user secrets or
  proof of a genuine binary. Never treat that value as confidential authority.
- **Snapshot import:** GitHub imports are immutable commit snapshots without a
  `.git` directory or remote write-back. Downloads are bounded and pass through
  the existing archive validation and staged publication pipeline; this does
  not remove the need to review imported source before running it.
- **Platform credentials:** the current code selects native credential
  backends. The recorded Windows runtime proof and Android credential-backend
  proof have different scope; GitHub authorization commands are not currently
  wired into the Android app. Linux/macOS runtime behavior must not be inferred
  from the abstraction or a build.

The latest recorded GitHub App registration state in canonical WI067 evidence
is dated **2026-09-16** and says that no production app had been registered at
that checkpoint. This repository snapshot contains no newer registration
evidence. Treat GitHub authorization availability as unconfirmed until an
operator records an updated status; do not infer registration from the source
code or from a build-time configuration path.

## Platform and release limits

Workbench is a source-build preview and its app version is independent from
Core's. The current platform evidence is linked from the
[README](README.md#platform-availability-and-evidence): Windows x64 desktop
checks and Android API 35 x86_64 scenarios have recorded results; Linux WSL2
headless checks do not establish Linux graphical runtime support. macOS and iOS
are untested. No published installer availability or support commitment should
be inferred from source code or a local build.
