# Publishing the packages

Two npm packages are published from this repository:

| Package | Directory | What it is |
|---|---|---|
| `embedded-ai-catalog` | `/` | The catalogue data + need matcher API (`lib/index.mjs`). |
| `embedded-ai-catalog-mcp` | `/mcp` | An MCP server exposing the catalogue to Claude, Cursor, etc. |

Publish **`embedded-ai-catalog` first**: the MCP package declares it as an
optional peer dependency, so installing the MCP server picks up the catalogue
once it exists on the registry.

## Preflight

1. `npm run check` passes (validate + tests + generated outputs current).
2. `npm run test:coverage` passes and `cd mcp && npm test` passes.
3. `CHANGELOG.md` has an entry for the version.
4. `version` is identical in `package.json`, `mcp/package.json` and the new
   `CHANGELOG.md` heading.
5. You are authenticated: `npm whoami`.

## 1. Catalogue package

```sh
npm publish            # runs prepublishOnly -> npm run check, then uploads
```

Verify:

```sh
npm view embedded-ai-catalog version
node -e "import('embedded-ai-catalog').then(m => console.log(m.version, m.entries.length))"
```

## 2. MCP package

```sh
cd mcp
npm publish
```

Verify the server starts and lists tools:

```sh
npx -y embedded-ai-catalog-mcp   # should wait on stdin; Ctrl-C to exit
```

## GitHub release

```sh
git tag -a vX.Y.Z -m "vX.Y.Z"
git push origin main --follow-tags
gh release create vX.Y.Z --title vX.Y.Z --notes "See CHANGELOG.md"
```

## If something is wrong

- Unpublish within 72 hours: `npm unpublish embedded-ai-catalog@X.Y.Z`. Prefer
  publishing a fixed patch over unpublishing.
- The catalogue data is versioned with the code, so a bad data release is fixed
  by a new patch version.

## Versioning policy

The public API of `embedded-ai-catalog` is the set documented in `lib/index.mjs`:
`entries`, `coverage`, `get`, `domains`, `search`, `need`, `shortlist`,
`upstreamOf`, `version` and the `catalog.json` / `catalog.full.json` /
`coverage.json` subpaths.

- **Patch** — data corrections, new entries, ranking tweaks.
- **Minor** — new exports, new fields, new MCP tools.
- **Major** — removing/renaming an export or entry field, or changing the
  `need` result shape.

Note that `need` **rankings are part of the contract**: synonym or weight
changes that meaningfully reorder results should be a minor bump and called out
in the changelog.
