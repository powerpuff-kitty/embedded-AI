# Runnable Catalogue v0.2

This milestone turns the existing 95-entry catalogue into a local explorer and reproducible execution workflow. It does not certify unsupported boards or inflate the model count.

## Implemented capabilities

- Static search/filtering, source details and comparison of up to four components, plus a deterministic offline need matcher that ranks entries from a plain-language description and shows why each entry matched (see [the need matcher guide](NEED-MATCHER.md)). Exact-environment RAM observations are separated from untested candidates.
- Localised interface and controlled vocabulary — UI chrome, domains, kinds and usage modes — in 12 major languages (English, Spanish, French, German, Portuguese, Italian, Russian, Simplified Chinese, Japanese, Korean, Arabic with RTL, Hindi) through a dependency-free i18n layer. Model names, task identifiers and source-reviewed prose stay in English; icons are inlined Font Awesome-free SVG paths, so there is no CDN or font download.
- Search/answer-engine metadata generated at build time: canonical URLs, Open Graph/Twitter tags, JSON-LD (`WebSite` + `Dataset`), `robots.txt`, `sitemap.xml`, and `llms.txt` / `llms-full.txt` for LLM ingestion. All content is public catalogue metadata; the CSP is unchanged.
- Local COCO-17 skeleton JSONL replay with play/pause, scrubbing, missing joints and synthetic-input disclosure.
- Isolated benchmark adapters for NumPy DLinear, Silero ONNX and RTMPose-S through rtmlib. Records include raw latency samples, artifact/source hashes and the actual execution environment.
- Three runnable recipes with generated sample inputs, explicit acquisition and baseline evaluation. VAD/pose synthetic fixtures test plumbing, not accuracy.
- A generic process coexistence monitor for actual board applications; no camera driver, fake frame counters or invented power values.
- Fifteen priority documentation reviews. See `reviews/priority-v02.json`; review of sources is not execution of model weights.
- Removal of the unnecessary fast-glob dependency chain, pinned npm dependency tree and CI validation/audit/build tests.

## Run the explorer

```sh
npm ci --ignore-scripts
npm run check
npm run reviews:check
npm run site:build
npm run site:serve
```

Open the local HTTP server on port 4173. `dist/` is the static deployment directory. On `main` it is published read-only to GitHub Pages by `.github/workflows/pages.yml`; enable **Settings → Pages → Source: GitHub Actions** once in the repository. Follow [the recipes](../recipes/README.md) for inference and [the benchmark guide](../benchmarks/README.md) for measurements.

## Evidence boundaries

Any committed benchmark must name its actual execution environment and artifact. Model file size is never substituted for process RAM. A source-reviewed model is not automatically compatible with an NPU. CI smoke success is not task accuracy, Mac performance or RV1106 camera/display/encoder coexistence.

Some reviewed artifacts still have null hashes until acquisition. Three selected recipe artifacts are acquired explicitly, with receipts recording archive and ONNX hashes separately. No weights are bundled in the catalogue or site.

## Remaining device acceptance tests

On the actual SEEN-0 board: measure capture plus encoding; add API; add display; add one supported RKNN detector. Collect dropped frames, queue age, thermal state and sustained memory. Evaluate representative human videos and speech recordings. These tests require the corresponding devices and datasets; they are not implied by the tooling milestone.
