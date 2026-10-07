# embedded-AI

> An embeddable AI catalogue — models, toolkits and non-AI primitives for local and resource-constrained computing.

[![Live explorer](https://img.shields.io/badge/live_explorer-open-2ea44f?logo=githubpages&logoColor=white)](https://powerpuff-kitty.github.io/embedded-AI/)
[![pages](https://img.shields.io/github/actions/workflow/status/powerpuff-kitty/embedded-AI/pages.yml?label=pages)](https://github.com/powerpuff-kitty/embedded-AI/actions/workflows/pages.yml)
[![catalog](https://img.shields.io/github/actions/workflow/status/powerpuff-kitty/embedded-AI/catalog.yml?label=validate)](https://github.com/powerpuff-kitty/embedded-AI/actions/workflows/catalog.yml)
[![recipes](https://img.shields.io/github/actions/workflow/status/powerpuff-kitty/embedded-AI/recipes.yml?label=recipes)](https://github.com/powerpuff-kitty/embedded-AI/actions/workflows/recipes.yml)
[![entries](https://img.shields.io/badge/dynamic/json?color=blue&label=entries&query=%24.total&url=https%3A%2F%2Fraw.githubusercontent.com%2Fpowerpuff-kitty%2Fembedded-AI%2Fmain%2Fgenerated%2Fcoverage.json)](generated/coverage.json)
[![code license: MIT](https://img.shields.io/badge/code_license-MIT-blue.svg)](LICENSE)
[![data license: CC BY 4.0](https://img.shields.io/badge/data_license-CC_BY_4.0-lightgrey.svg)](LICENSE-DATA)

**Explore it live** — <a href="https://powerpuff-kitty.github.io/embedded-AI/" target="_blank" rel="noopener">powerpuff-kitty.github.io/embedded-AI</a> · no install, no account, no tracking.

---

## What is this?

**embedded-AI is a machine-readable catalogue of embeddable AI** — models, toolkits and non-AI primitives for local and resource-constrained computing, from microcontrollers and phones to single-board computers and servers.

Each entry is a small YAML file. The tables below, the JSON exports, the search and need-matching CLIs, and the web explorer are all generated from those files. Fields that are not known are left unknown rather than guessed.

## How it is organised

- **Kinds:** `model`, `collection`, `pipeline`, `toolkit` and `primitive` are labelled separately.
- **Use:** `pretrained`, `requires-training` and `companion` are recorded per entry.
- **Domains:** 51 areas, from vision and audio to genomics, gaming and space.
- **One source, many faces:** the same YAML drives the README table, the JSON exports and the explorer.

## Quick start

**Use the live explorer** — nothing to install:
<a href="https://powerpuff-kitty.github.io/embedded-AI/" target="_blank" rel="noopener">https://powerpuff-kitty.github.io/embedded-AI/</a>

**Or work locally:**

```sh
npm ci --ignore-scripts
npm run search -- --domain finance --usage pretrained      # metadata search
npm run need -- "detect people offline with a tiny model"  # plain-language matcher
npm run links                                              # audit upstream links
npm run audit                                              # catalogue hygiene
npm run check                                              # validate + tests + freshness
```

Edit YAML, not generated tables. On `main`, CI regenerates and commits only catalogue outputs; pull-request checks stay read-only.

**As a package** (Node ≥18, zero dependencies) — the catalogue and the same need matcher, importable:

```js
import { need, search, get, domains, entries, coverage, shortlist } from "embedded-ai-catalog";

const { results, intent } = need("offline wake word on a microcontroller", { limit: 5 });
results[0].entry.name;   // "MLPerf Tiny"
results[0].reasons;      // ["task: wake", "task: keyword", ...]

search("", { domain: "vision", usage: "pretrained" }).length;  // metadata search
get("docling").links.repository;                               // lookup by id
```

The generated JSON also ships directly: `embedded-ai-catalog/catalog.json`, `embedded-ai-catalog/catalog.full.json`, `embedded-ai-catalog/coverage.json`.

## At a glance

<!-- AT-A-GLANCE:START -->
| | |
|---|---|
| **539 entries** | models, collections, pipelines, toolkits and primitives |
| **54 domains** | vision, audio, language, robotics, gaming, genomics and more |
| **5 kinds** | model · collection · pipeline · toolkit · primitive |
| **Evidence** | 539 sourced · 3 reproduced · 0 measured RAM · 157 unknown weights |
<!-- AT-A-GLANCE:END -->

## Domains

<!-- DOMAINS:START -->
54 domains: Audio · Video · Vision · Language · Geospatial · Weather · Climate · Time series · Engineering/CAD · Robotics · Control · Science · Genomics · Drug discovery · Sensors · Mapping · Simulation · Gaming · Music · Healthcare · Agriculture · Automotive · Manufacturing · Finance · Fraud detection · Recommendation · Administration · Business · IT infrastructure · Energy · Security · Runtime · Telecom · Networking · Benchmark · Artificial life · Neuromorphic · Event vision · Education · Trust & safety · Federated learning · Quantum · Marine · Accessibility · Environment · Fashion · Space · Hydrology · Forestry · Sports · Graph · Retrieval · Agents · Reasoning.
<!-- DOMAINS:END -->

## Documentation

- [Need matcher guide](docs/NEED-MATCHER.md) — how plain-language search ranks components
- [Vision, video & 3D](docs/VISION-VIDEO-3D.md) — per-task guides
- [Finance, administration & business](docs/BUSINESS-AI.md) — per-task guides
- [Runnable Catalogue v0.2](docs/RUNNABLE-V02.md) — explorer, recipes and benchmarks
- [Design system](docs/DESIGN.md) — tokens and components
- [Taxonomy](docs/TAXONOMY.md) — how components are classified
- [Building small models](docs/BUILDING-SMALL-MODELS.md) — a practical workflow
- [Full catalogue](docs/CATALOGUE.md) — generated tables for all entries
- [Dependency & security review](docs/SECURITY-REVIEW-V02.md)
- [Contributing](CONTRIBUTING.md) — entry rules and tooling
- [Changelog](CHANGELOG.md) · [Security policy](SECURITY.md) · [Code of conduct](CODE_OF_CONDUCT.md)

## Project layout

```text
catalog/       # learned models, architectures and collections
pipelines/     # applications and training/integration toolkits
primitives/    # non-AI optimization and simulation
hardware/      # device profiles (MCU, SBC, NPU, neuromorphic)
runtimes/      # runtime profiles
schema/        # catalogue and benchmark schemas
scripts/       # validation, search, need matcher, audits, generation, site build
site/          # static explorer and local skeleton viewer
recipes/       # local forecast, VAD and pose examples
bench/         # process-isolated measurement adapters
benchmarks/    # actual environment-specific observations
generated/     # summary, full metadata and coverage JSON
```

## Contributing

Use primary sources and leave unknowns unknown. See [CONTRIBUTING.md](CONTRIBUTING.md); run `npm run check`, `npm run audit -- --strict` and `npm run links` before opening a pull request.

## License

- **Code** — schemas, scripts, site, workflows and tests are under the [MIT License](LICENSE).
- **Catalogue data** — the YAML manifests, generated JSON exports and derived tables are under [CC BY 4.0](LICENSE-DATA); reuse freely with attribution.
- **Upstream projects** — models, toolkits and primitives referenced or described by entries remain under their own licenses; the code/weights terms recorded per entry are upstream facts, not a grant from this repository.

---

## Catalogue

<!-- CATALOGUE:START -->
**539 entries** across 54 domains — models, collections, pipelines, toolkits and non-AI primitives. Browse the full generated catalogue in [docs/CATALOGUE.md](docs/CATALOGUE.md); machine-readable exports are in [`generated/`](generated/).
<!-- CATALOGUE:END -->
