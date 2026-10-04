# embedded-AI

A machine-readable catalogue of AI/ML models suitable for embedded, edge, offline and resource-constrained computing.

## Goals
- Catalogue small specialist models across domains.
- Keep hardware/runtime compatibility first-class.
- Separate reported claims from reproduced benchmarks.
- Never invent missing RAM, latency, power, license or compatibility data.
- Generate searchable indexes/site/API from YAML manifests.

## Domains
Audio · Vision · Language · Geospatial · Time series · Engineering/CAD · Robotics · Science · Sensors · Security

## Compatibility
`unsupported` · `theoretical` · `reported` · `reproduced` · `unknown`

## Structure
```
catalog/       # one YAML manifest per model
hardware/      # device profiles
runtimes/      # runtime profiles
schema/        # manifest schema
scripts/       # validation/index generation
benchmarks/    # reproducible results (next milestone)
generated/     # generated catalogue indexes
```

Copy `catalog/_template.yaml` to add a model. See `CONTRIBUTING.md`.

The catalogue deliberately includes TinyML, small specialized models, classical ML and hybrid DSP+ML when they provide useful embedded intelligence.
