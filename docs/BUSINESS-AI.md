# Finance, administration, infrastructure and business AI

This expansion adds **32 records** and completes the set discussed on 2026-10-05. The repository contains **95 entries after this batch**, not 95 interchangeable pretrained neural networks. See the [machine-readable batch checklist](batches/business-2026-10-05.json) and [live coverage report](../generated/coverage.json). The catalogue remains open-ended; unknown older metadata is not automatically filled with assumptions.

## Complete addition list

| Area | Added entries |
|---|---|
| Finance and markets | [Kronos-mini](../catalog/finance/forecasting/kronos-mini.yaml), [Kronos-small](../catalog/finance/forecasting/kronos-small.yaml), [FinBERT](../catalog/finance/sentiment/finbert-prosus.yaml), [hmmlearn](../pipelines/finance/hmmlearn.yaml), [Qlib](../pipelines/finance/qlib.yaml) |
| Administration and documents | [SetFit](../pipelines/administrative/setfit.yaml), [fastText classifiers](../pipelines/administrative/fasttext-classifier.yaml), [spaCy small English pipeline](../catalog/administrative/extraction/spacy-en-core-web-sm.yaml), [GLiNER2.5 Small](../catalog/administrative/extraction/gliner25-small.yaml), [LEGAL-BERT-Small](../catalog/administrative/legal/legal-bert-small.yaml), [Docling](../pipelines/administrative/docling.yaml), [Presidio](../pipelines/administrative/presidio.yaml) |
| IT infrastructure and monitoring | [KitNET](../catalog/infrastructure/anomaly/kitnet.yaml), [Kitsune](../pipelines/infrastructure/kitsune.yaml), [River HalfSpaceTrees](../catalog/infrastructure/anomaly/river-half-space-trees.yaml), [Drain3](../pipelines/infrastructure/drain3.yaml), [Loglizer](../pipelines/infrastructure/loglizer.yaml), [Merlion](../pipelines/infrastructure/merlion.yaml), [PyRCA](../pipelines/infrastructure/pyrca.yaml) |
| Energy and physical infrastructure | [CityLearn](../pipelines/energy/citylearn.yaml), [Grid2Op](../pipelines/energy/grid2op.yaml) |
| Corporate operations, customers and inventory | [LightGBM](../pipelines/business/tabular/lightgbm.yaml), [XGBoost](../pipelines/business/tabular/xgboost.yaml), [CatBoost](../pipelines/business/tabular/catboost.yaml), [LightFM](../pipelines/business/recommendation/lightfm.yaml), [Vowpal Wabbit](../pipelines/business/decision/vowpal-wabbit.yaml), [Splink](../pipelines/business/records/splink.yaml), [OR-Tools](../primitives/optimization/or-tools.yaml), [TabPFN](../catalog/business/tabular/tabpfn.yaml) |
| Shared numerical forecasting | [DLinear](../catalog/time-series/forecasting/dlinear.yaml), [NeuralForecast](../pipelines/time-series/neuralforecast.yaml), [StatsForecast](../pipelines/time-series/statsforecast.yaml) |

Existing MiniLM embeddings, fastText language identification, TinyTimeMixer and Chronos-Bolt Tiny are reused through related-entry links instead of duplicated under every possible application domain.

## What is ready to use?

`kind` and `usage.mode` describe different dimensions. A toolkit can train a model; an available pretrained model can still require adaptation or labelled context. The README displays both.

| Use mode | Meaning |
|---|---|
| `pretrained` | Published model weights exist. Supply appropriate input/context and evaluate the actual downstream task. This does not certify embedded compatibility. |
| `requires-training` | Fit a model, estimator or policy on representative data. No universal company-specific classifier is implied. |
| `companion` | Supporting parser, simulator, research system or optimizer. Components may themselves use learned models. |
| `unknown` | Not reviewed for this metadata dimension; do not infer readiness from a name. |

Every new record specifies data inputs/outputs, language scope, training/adaptation requirements, an update strategy, task-specific evaluation and limitations. The supplemental [schema](../schema/business-metadata.schema.json) validates these fields. The batch tests check all 32 requested IDs and their presence in this guide.

## Size and deployment boundaries

Read each record's `model.measurement_scope`. Kronos counts cover the predictor and exclude its required learned tokenizer. GLiNER2.5 Small's approximately 296 MB describes publisher FP32 model storage, not peak RAM. It uses the boundary-compatible `AutoExtractor` loader rather than the legacy span loader. DLinear's 4,656-parameter example is a calculation for a chosen 96-to-24 single-series architecture, not a published measured artifact. No board compatibility has been reproduced for this batch.

LightGBM, XGBoost, CatBoost and LightFM have no single library-wide model size. Their trained artifacts depend on trees, vocabulary/feature processing or embedding-table cardinality. TabPFN is included as a desktop reference family: labelled context and checkpoint version change its memory cost. Docling, Qlib, CityLearn and OR-Tools are not tiny neural networks simply because they appear in this catalogue.

Code, weights, datasets and dependency licenses remain separate. Consult each linked upstream source before product integration. LEGAL-BERT-Small carries CC-BY-SA-4.0 model terms; TabPFN weights have version-dependent restrictions. Unknown model terms are not replaced with permissive code licenses. The original fastText repository is archived and hmmlearn reports limited maintenance.

## Proposed application recipes, not implemented production systems

### Markets and financial research

Historical point-in-time data -> forecasts/sentiment/regime features -> independently specified strategy -> chronological backtest -> execution-cost and risk review. Kronos output is not a trading order. Evaluate walk-forward baselines, data leakage, transaction costs, slippage, drawdowns and the number of experiments tried. Live trading, portfolio permissions and risk limits are outside this catalogue.

### Invoices, contracts and administration

Read native document text or OCR -> document classification -> schema-driven extraction -> match supplier/records -> validate arithmetic, identifiers and dates -> proposed entry for human approval. Keep original pages and extracted spans. Models must not invent missing amounts, authorize payment or replace qualified legal/accounting review. An English checkpoint does not establish French or Spanish capability.

### IT operations

Authorized logs/telemetry -> parsing and feature extraction -> anomaly scores -> ranked incident hypotheses -> reviewed remediation. Score calibration, normal-data warmup, drift and false alerts are part of the evaluation. A high anomaly score is not proof of an attack; root-cause ranking is not proof of causation. Secret masking and access control remain ordinary application responsibilities.

### Inventory and corporate operations

Demand forecast -> current inventory and supplier lead times -> budget/capacity-constrained planning -> proposed purchase order -> approval. Business-specific churn, late-payment or stockout models require the company's own governed training data; the catalogue contains candidate tools, not those trained business outcomes. Avoid sensitive/proxy features and test error costs before consequential use.

### Building and grid policies

Use CityLearn or Grid2Op to evaluate a policy against explicit scenarios and constraints. A resulting policy is a separate model artifact. Simulation performance does not certify real equipment safety; retain hard limits, watchdogs, fallback control and expert review outside the learned policy.

## Search and exports

```sh
npm install
npm run search -- --domain finance --usage pretrained
npm run search -- --domain administrative
npm run search -- --query anomaly --json
npm run search -- --kind primitive --task constraint-optimization
npm run index
npm run check
```

The summary export preserves stable IDs and manifest paths, with an added `usage_mode`. `generated/catalog.full.json` includes complete metadata, evidence and limitations. `generated/coverage.json` counts domains, kinds, use modes and unknowns without manufacturing measurements.

On `main`, CI validates the sources and runs tests before regenerating and committing only the README and three generated JSON exports. Pull-request validation is read-only and checks that generated files are current. The workflow never force-pushes over concurrent edits. Dependency audit remediation remains tracked separately in issue #15; catalogue checks are not a security audit or an inference benchmark.
