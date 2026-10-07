# Getting hardware evidence

Compatibility in this catalogue is only `reproduced` when a **measured record exists for the exact target** (`benchmarks/results/`). Everything else is `reported` (an upstream claim with a URL) or `unknown`. This guide is about producing genuine `reproduced` evidence.

## 1. Choose targets

Ranked by how much they unblock the catalogue:

| Priority | Target | Why | Rough cost |
|---|---|---|---|
| 1 | Luckfox Pico (RV1106) | the catalogue's canonical edge target | ~$15 |
| 2 | ESP32-S3 (with PSRAM) | TinyML / MCU class | ~$10 |
| 3 | Raspberry Pi 4/5 | general edge / arm64 | ~$45 |
| 4 | Google Coral Edge TPU | int8 TFLite NPU path | ~$25 |
| 5 | Hailo-8 (M.2) | high-throughput NPU | ~$70+ |
| 6 | NVIDIA Jetson Orin Nano | GPU edge | ~$250 |
| 7 | SynSense Speck / BrainChip Akida | neuromorphic class | quote |

Baselines without buying hardware: **GitHub-hosted arm64 runners** (`ubuntu-24.04-arm`) give real arm64 observations (not the target boards), and **mobile device farms** cover phone targets. Neither substitutes for the target device.

## 2. Measure

The repository already has process-isolated adapters. On the device:

```sh
python3 -m venv .venv && . .venv/bin/activate
python -m pip install -r recipes/requirements.txt
python -m recipes.download silero --accept-upstream-terms
python -m bench.runner silero-vad --config config.json --output runs/silero.json
```

- `bench.runner` records OS, CPU, packages, artifact hashes, warmups, raw latency samples, p50/p95/p99 and process high-water RSS.
- `bench.coexist` measures several trusted applications running at once (capture + encode + display + one detector) — the realistic board scenario.
- For MCUs, run **MLPerf Tiny** (KWS, visual wake words, CIFAR-10, anomaly) and record latency/energy under its rules.

## 3. Record it

1. Put the runner output under `benchmarks/results/<environment>/<name>.json` (schema: `schema/benchmark.schema.json`).
2. In the entry YAML, add:

   ```yaml
   compatibility:
     - target: <exact-hardware-id>
       status: reproduced
       benchmark: benchmarks/results/<environment>/<name>.json
       notes: 'Exact scope; what is and is not covered.'
   ```

3. Run `npm run check`. The validator requires the benchmark file to exist and the entry id to match.

Rules: never relabel a Linux host as Apple Silicon or RV1106; never infer RAM or power; keep synthetic fixtures labelled; a recorded result below budget is not a guarantee for other resolutions, batches or versions.

## 4. If you cannot measure

- Add `reported` with the **upstream/vendor URL** that documents the target (the catalogue requires evidence for `reported`).
- Leave it `unknown` otherwise. Unknown is a valid, honest state.

## 5. Crowdsourcing

Open a **Benchmark submission** issue (`.github/ISSUE_TEMPLATE/benchmark.yml`) with the runner JSON. Maintainer review turns it into a `benchmarks/results/` record and a `compatibility: reproduced` entry. Bulk data can also come from vendor model zoos once converted into this schema.
