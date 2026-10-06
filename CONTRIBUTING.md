# Contributing
Use primary sources where possible. Unknown values stay unknown; do not infer RAM from weight size.

## Entry rules
1. Copy `catalog/_template.yaml` (or a neighbouring entry).
2. Use a stable lowercase kebab-case ID and precise kebab-case task names; the filename must match the ID (`<id>.yaml`).
3. Add a factual description of at least ~20 characters; keep model names, task identifiers and prose in their source language.
4. Separate code and weights licenses; leave a field `unknown` rather than inferring it.
5. Record compatibility as unsupported/theoretical/reported/reproduced/unknown; use `reported` only with an upstream evidence URL.
6. Only use `reproduced` when benchmark evidence exists in this repository.
7. Set `reviewed` only when the sources were actually reviewed; otherwise leave it out.
8. Run `npm run check`, `npm run audit -- --strict` and `npm run links`.

## Tooling
- `npm run validate` — schema + rule validation of all entries.
- `npm run check` — validate, tests and generated-output freshness.
- `npm run test` — unit tests (catalogue, business metadata, need matcher, i18n, explorer).
- `npm run search -- --domain finance --usage pretrained` — metadata search.
- `npm run need -- "detect people offline with a tiny model"` — offline need matcher (same engine as the site).
- `npm run audit` — catalogue hygiene (id/filename, naming, descriptions, duplicates, coverage).
- `npm run links` — HTTP-check every upstream and evidence URL.
- `npm run index` — regenerate README tables and JSON exports from YAML.
- `npm run site:build` / `npm run site:serve` — build and serve the static explorer.

## Benchmark records
Include exact hardware, runtime, model format and precision, input shape, warmup/sample count, peak RSS if measurable, latency distribution, throughput, power measurement method, software versions and date.
