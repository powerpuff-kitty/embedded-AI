# Changelog

## Procedural browser lab — 2026-10-07

- Add four optional pinned, bounded worker-based fixtures with exports, repeatability checks and build/source receipts.
- Add 14 sourced procedural components; distinguish browser libraries, geometry foundations and noncommercial/Unity references.
- Add separate browser observation schema, validation, responsive smoke tests and CI artifacts. No universal compatibility or incremental RAM claims.
- Keep hybrid recipes design-only and npm publishing unchanged.

## Unreleased — procedural catalogue

Added 24 researched upstream generators, annotated 5 existing simulations, and added 3 design-only hybrid recipes. Shared method/view/category facets now work across the explorer, CLI, package and MCP. Added strict procedural metadata, recipe reference validation, generated procedural tables, source/unknown distinctions and regression tests. Existing component IDs and paths are retained; no upstream runtime benchmark or npm publication is implied.

All notable changes to this project are documented here. The format follows
[Keep a Changelog](https://keepachangelog.com/en/1.1.0/), and this project
adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added
- `generated/coverage.json` now includes an `evidence` block: source counts by
  type, official-link-only vs multi-source, measured RAM, reproduced/reported
  compatibility and evaluation/limitation coverage.
- README "At a glance" carries a generated Evidence row so the evidence gap is
  visible rather than implied.
- `npm run test:coverage` (Node's built-in V8 coverage) with a line/function/
  branch gate, enforced on pull requests; CLI tests for `validate`, `audit`,
  `audit --strict` and `search`.
- `mcp/` — an MCP server (`embedded-ai-catalog-mcp`) exposing `need`, `search`,
  `get_entry`, `list_domains` and `catalogue_stats` tools, plus
  `embedded-ai://catalog` and `embedded-ai://coverage` resources. Includes an
  end-to-end handshake test and its own CI workflow.
- `docs/PUBLISHING.md` runbook for the two npm packages.

### Changed
- Dependabot ignores `numpy >= 2.5` for the recipes requirements: those releases
  require Python >= 3.12, while the recipes CI pins Python 3.11.

### Fixed
- `embedded-ai-catalog-mcp` 0.2.1: declare `embedded-ai-catalog` as a regular
  dependency (not an optional peer) so the server resolves the catalogue on
  install, and mark `mcp/server.mjs` executable so npm keeps the `bin` entry
  (0.2.0 published without a working command).

### Security
- Pin every GitHub Action to a full commit SHA (with a version comment);
  Dependabot's `github-actions` updater keeps the pins current.

## [0.2.0] - 2026-10-07

### Added
- Dual licensing: code under MIT, catalogue data under CC BY 4.0.
- Publishable `embedded-ai-catalog` package exposing `entries`, `coverage`,
  `get`, `domains`, `search`, `need`, `shortlist`, `upstreamOf` and `version`,
  with JSON at `catalog.json`, `catalog.full.json` and `coverage.json` subpaths.
- Community files: `SECURITY.md`, `CODE_OF_CONDUCT.md`, `CITATION.cff`, PR and
  issue templates, and Dependabot configuration.
- Schema validation tests covering unknown top-level and nested keys.

### Changed
- Moved the full generated catalogue out of `README.md` into `docs/CATALOGUE.md`;
  the README now carries a generated summary.
- Hardened `schema/model.schema.json`: `additionalProperties: false` at the top
  level and for `model`, `license`, `deployment`, `io`, `compatibility`,
  `evidence` and `requirements.ram_mb`; added the fields already in use
  (`tags`, `usage`, `data`, `evaluation`, `limitations`, `requirements`,
  `review`, `notes`, `catalogue_batch`, and primitive-template fields).
- `At a glance` and `Domains` counts are now generated from source so they
  cannot drift; `npm run index -- --check` fails on mismatch.

### Fixed
- Duplicate-id checking and cross-reference resolution no longer skip an entry
  whose schema validation fails, avoiding misleading "unknown related id"
  errors.

## [0.1.0] - 2026-10-04

### Added
- Initial machine-readable catalogue: models, collections, pipelines, toolkits
  and non-AI primitives, with an offline explorer and need matcher, JSON
  exports and validation/link CLI tooling.
