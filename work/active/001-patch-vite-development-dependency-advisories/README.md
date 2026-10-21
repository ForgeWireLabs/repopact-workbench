# Patch vulnerable Workbench Vite development dependencies

*Preflight:* This work item was recorded before dependency changes. The original
npm lockfile resolved Vite 8.2.2 and source-map-js 1.2.1. GitHub's reviewed
advisories identify a source-map denial-of-service issue and three
launch-editor issues inherited through Vite; the latter include a high-severity
Windows path-check bypass with command-injection impact when an attacker can
control the editor-file argument. All affected packages are in the development
dependency tree. The application runtime package set was not affected according
to the production-only npm audit.

*Result:* The scoped update pins Vite 8.2.4 and resolves source-map-js 1.2.2
through both PostCSS and css-tree. Full and production-only audits report zero
vulnerabilities. Validation commands and outcomes are recorded in
`evidence/WBSEC-001-security-dependency-update-2026-10-21.json`.

Acceptance criteria and evidence links live in `work-item.json`. This scope is
limited to the development toolchain; it does not change Workbench behavior,
the Core revision pin, or runtime dependencies.