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
catalog/       # learned models, architectures and collections
pipelines/     # applications and training/integration toolkits
primitives/    # non-AI optimization and simulation
hardware/      # device profiles
runtimes/      # runtime profiles
schema/        # catalogue and benchmark schemas
scripts/       # validation, search, generation and site build
site/          # static explorer and local skeleton viewer
recipes/       # local forecast, VAD and pose examples
bench/         # process-isolated measurement adapters
benchmarks/    # actual environment-specific observations
generated/     # summary, full metadata and coverage JSON
```

See [Contributing](CONTRIBUTING.md), [vision/video/3D](docs/VISION-VIDEO-3D.md) and [finance/administration/business](docs/BUSINESS-AI.md).

## Use the catalogue
```sh
npm ci --ignore-scripts
npm run search -- --domain finance --usage pretrained
npm run search -- --query anomaly --json
npm run index
npm run check
```

Edit YAML, not generated tables. Main-branch CI regenerates and commits only catalogue outputs; pull-request checks remain read-only.

Compatibility levels are `unsupported`, `theoretical`, `reported`, `reproduced` and `unknown`. Only actual device evidence qualifies as reproduced. Small model parameters and edge marketing do not establish MCU or RV1106 compatibility.

## Runnable Catalogue v0.2

Read the [v0.2 guide](docs/RUNNABLE-V02.md), [runnable recipes](recipes/README.md), [benchmark methodology](benchmarks/README.md) and [dependency review](docs/SECURITY-REVIEW-V02.md).

```sh
npm run reviews:check
npm run site:build
npm run site:serve
```

The static explorer supports search, filters, source details and comparison. The local skeleton viewer reads JSONL without uploading files. Downloads/inference are explicit. A Linux measurement is never labelled Mac/RV1106 evidence. The site is built locally, not automatically published.

This is a growing curated catalogue, not an exhaustive list or a guarantee that all entries fit small devices. Unknown fields remain visible.

<!-- CATALOG:START -->
<!-- CATALOG:END -->
