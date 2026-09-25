# RepoPact Workbench

This is the standalone Tauri 2 desktop/mobile repository extracted from
integrated RepoPact source `8f1ce8deb139287655afcc8479dc69dd621d8720` at
Workbench extraction commit `5678bdb1d04f8582fcf5ddc5b3fc8cb884199342`.
It preserves the existing React frontend, desktop API, filesystem watchers,
Android acquisition/SAF/credential integrations, and optional remote providers.

The Core dependencies use one immutable full Git revision from
`ForgeWireLabs/repopact-core`; the repository URL and exact revision are
recorded in `Cargo.toml`, `Cargo.lock`, and the publication provenance file.
No Core source is copied into this repository.

The React/Tauri application version remains the source version `0.1.0`; it is
independent from Core's stable `repopact` 3.1.3/PyPI release. Workbench does not
require Python or pip at runtime. GitHub integration is optional and credentials
remain native-platform-managed.

The source-to-public-tree path/hash map and the exact Core revision are recorded
in [`evidence/WI074-PUBLICATION-PROVENANCE.json`](evidence/WI074-PUBLICATION-PROVENANCE.json).
Original extraction records remain in the RepoPact governance ledger; local
machine paths and the prior monorepo history are not copied into this repository.

This report establishes only the platforms actually built and tested on this
machine. A Windows build does not prove Android, Linux, macOS, or iOS support.
