# embedded-AI

A machine-readable catalogue of AI/ML models for local and resource-constrained computing, plus clearly labelled companion tools for perception, control, business analysis, mapping and simulation.

## Goals
- Catalogue specialist models across domains, including compact classical ML.
- Keep hardware/runtime compatibility and evidence first-class.
- Separate pretrained weights, models requiring training, and companion tools.
- Never invent missing RAM, latency, power, license or compatibility data.
- Generate the complete human-facing catalogue and JSON exports from YAML.

## Domains
Audio · Video · Vision · Language · Geospatial · Time series · Engineering/CAD · Robotics · Control · Science · Sensors · Mapping · Simulation · Finance · Administration · Business · IT infrastructure · Energy

## Structure
```text
catalog/       # learned models, architectures and model collections
pipelines/     # complete applications and training/integration toolkits
primitives/    # non-AI algorithms, optimization and simulation tools
hardware/      # device profiles
runtimes/      # runtime profiles
schema/        # manifest and supplemental metadata schemas
scripts/       # validation, search and generation
benchmarks/    # reproduced device evidence when available
generated/     # summary, full metadata and coverage JSON exports
```

See [CONTRIBUTING.md](CONTRIBUTING.md), the [vision/video/3D guide](docs/VISION-VIDEO-3D.md), and the [finance/administration/business guide](docs/BUSINESS-AI.md). Copy `catalog/_template.yaml` for a model; consult the new records for complete usage and evaluation metadata.

## Use the catalogue
```sh
npm install
npm run search -- --domain finance --usage pretrained
npm run search -- --query anomaly --json
npm run index
npm run check
```

Edit YAML, not generated tables. `npm run index` regenerates the README and JSON files; `npm run check` validates sources, runs regression tests and detects stale generated files. Main-branch CI also commits regenerated outputs after validation; pull-request checks remain read-only.

Compatibility levels are `unsupported`, `theoretical`, `reported`, `reproduced` and `unknown`. Only evidence-backed device tests qualify as reproduced. Small parameters, local availability and “edge” marketing do not establish MCU or RV1106 compatibility.

The project is a curated, growing catalogue, not an exhaustive list of every model. Unknown fields remain visible. It includes desktop reference models and non-neural companions when useful for composing an embedded intelligence system.

<!-- CATALOG:START -->

Run `npm run index` to regenerate the complete catalogue from all YAML records.

<!-- CATALOG:END -->
