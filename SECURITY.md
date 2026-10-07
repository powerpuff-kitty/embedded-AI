# Security policy

## Supported versions

| Version | Supported |
|---------|-----------|
| 0.2.x   | Yes       |
| < 0.2   | No        |

## Reporting a vulnerability

Please **do not** open a public issue for security problems. Report privately via GitHub's
[private vulnerability reporting](https://github.com/powerpuff-kitty/embedded-AI/security/advisories/new).

Include the affected file or workflow, a description, and a minimal reproduction if possible.
You can expect an acknowledgement within 72 hours and a resolution or mitigation plan within
14 days. Credit will be given in the release notes unless you ask to remain anonymous.

## Scope

This repository is a static catalogue plus build tooling. It explicitly makes **no network
requests at runtime** and never executes upstream code or downloads models.

In scope:

- The generated explorer (`site/`, `dist/`) — its strict Content-Security-Policy, URL
  sanitisation and the offline need matcher.
- Build/validation scripts (`scripts/`), the published package (`lib/`), the MCP
  server (`mcp/`) and CI workflows.
- The schemas in `schema/`.

Out of scope:

- Third-party models, toolkits or datasets described by catalogue entries — report those to
  their upstream maintainers. Entries only record upstream facts; they are not endorsed
  or redistributed here.
- Reports that require modifying the catalogue data or executing a malicious entry.

## Design guarantees

- The explorer sets `default-src 'self'` and makes no external requests; it reads only
  generated `data/catalog.json`.
- Upstream and evidence links are validated (`http`/`https`, no credentials) before rendering.
- CI installs with `npm ci --ignore-scripts`, uses least-privilege tokens and checks out with
  `persist-credentials: false`.
- All GitHub Actions are pinned to full commit SHAs, with Dependabot keeping them current.
- No secrets are stored in the repository.
