# Changelog

All notable changes to this project are documented here. The format follows
[Keep a Changelog](https://keepachangelog.com/en/1.1.0/), and this project
adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

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
