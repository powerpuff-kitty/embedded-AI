# v0.2 validation and first measured runs

The [integration run 37299920740](https://github.com/powerpuff-kitty/embedded-AI/actions/runs/37299920740) completed real acquisition, inference and browser tests on 2026-10-05. Artifact `11341681090` contains the original result JSON, acquisition receipts, resolved Python inventory, static preview and browser screenshots.

## Checks completed

- 95 catalogue manifests and their generated README/JSON consistency.
- 27 JavaScript regression tests and 15 priority documentation-review contracts.
- 8 Python tests, including an isolated DLinear run, chronological split checks and failure/timeout handling.
- SHA-256-verified downloads and actual ONNX inference for Silero VAD, YOLOX-tiny and RTMPose-S.
- Three benchmark adapters with initialization, raw latencies, process high-water RSS, source and artifact hashes.
- Chromium interactions: catalogue load, domain filtering, comparison, unknown-hardware separation, synthetic skeleton playback and mobile viewport.
- npm audit reported zero vulnerabilities for the locked JavaScript dependency tree. This does not audit Python packages or model assets.

## Measured workload observations

Host: GitHub Actions Linux x86_64, AMD EPYC 7763, 2 exposed logical CPUs, Python 3.11.16. OPENBLAS_NUM_THREADS and OMP_NUM_THREADS were both 1. Each adapter ran in its own fresh process, with 3 warmups and 15 timed calls after first inference.

| Adapter | Workload | p50 per call | Process peak RSS |
|---|---|---:|---:|
| [DLinear](../benchmarks/results/ci-2026-10-05/dlinear.json) | One synthetic 96-to-24 window; NumPy implementation; excludes training | 0.106670 ms | 35.598336 MB |
| [Silero VAD](../benchmarks/results/ci-2026-10-05/silero-vad.json) | 512 new 16 kHz silence samples plus 64 samples of context | 0.159178 ms | 73.465856 MB |
| [RTMPose-S through rtmlib](../benchmarks/results/ci-2026-10-05/rtmpose.json) | Pose-only black crop, 256x192; excludes person detector and video decoder | 25.516536 ms | 137.986048 MB |

These are actual observations on that host, not minimum RAM specifications or guarantees of real-time throughput. RSS includes the interpreter, imports and runtime. Synthetic silence, numerical windows and black crops test execution, not real-world model accuracy. Do not relabel the RTMPose-S run as RTMPose-t. No Mac, ESP32 or RV1106 measurement or camera/display/encoder coexistence claim follows from these results.

The full video recipe also executed YOLOX-tiny plus RTMPose-S on five synthetic-video frames. The separate synthetic skeleton replay fixture is explicitly not neural-model output. Real human/speech quality evaluation and sustained device acceptance tests remain separate work.

## Artifact integrity

`recipes/artifacts.json` pins the downloaded archive/file hashes from explicit upstream acquisition. The extracted model hashes observed were:

- Silero ONNX: `1a153a22f4509e292a94e67d6f9b85e8deb25b4988682b7e174c65279d8788e3` (2,327,524 bytes).
- YOLOX-tiny ONNX: `ceb11c07298f95c50d7c5abeb906d03340c85f23aa79e3e66966e7fb6c307250` (20,283,006 bytes).
- RTMPose-S ONNX: `9aeb635b83f86aea45cf45d85798f7eba1a162de8e0d721c44e54fe5eebaf47d` (21,890,172 bytes).

Hashes detect drift from the reviewed download; they are not independent publisher signatures. No model weights are committed or included in the static site. Broader catalogue `measured_peak_ram` fields remain null because they do not have a hardware/workload scope. Observations are deliberately kept in separate benchmark records and displayed by the explorer.
