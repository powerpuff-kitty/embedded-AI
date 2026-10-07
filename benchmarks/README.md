# Benchmark evidence

> How measurements are taken, what RSS really means, and why a number is never a guarantee.

`python -m bench.runner ADAPTER --config local.json --output runs/result.json` starts one isolated child process. Adapters: `dlinear`, `silero-vad`, `rtmpose` (RTMPose-S through rtmlib). Config specifies a local `model` path; acquisition is explicit and separate.

Records include OS, CPU, architecture, Python/packages, source/artifact hashes, initialization/first-call time, warmups, raw latency samples and p50/p95/p99. Process lifetime high-water RSS is separate from sampled process-tree RSS. RSS includes Python, imports, input buffers and the model. It is not NPU/GPU memory. Sampling can miss peaks; summing process RSS can double-count shared pages. Power and accelerator memory remain null without instruments.

The timer measures the adapter's whole synchronous call. Input shape/provenance and excluded stages are recorded. No asynchronous GPU-timing claim is made. Silence and black-image fixtures are smoke tests, not accuracy tests. Forecast evaluation is separate and uses a synthetic chronological split plus naive baselines.

`results/` holds reviewed observations. Do not edit measured numbers by hand or relabel Linux CI as Apple Silicon or RV1106. The explorer requires schema-valid records and exact-environment matches for memory filtering. A recorded result below budget is not a guaranteed upper bound for other resolutions, batch sizes, versions or concurrent workloads.

## Real-device coexistence

```sh
python -m bench.coexist --config my-workload.json --output runs/coexistence.json
```

Replace these placeholders with your actual trusted applications:

```json
{"duration_seconds":60,"processes":[{"id":"camera","argv":["./seen-camera","--encode"]},{"id":"api","argv":["./seen-api"]},{"id":"inference","argv":["./seen-detector","--model","person.rknn"]}]}
```

The monitor runs argv arrays without a shell, samples process trees and stops its process groups on completion/failure. It is not a camera driver. Compare capture/encoding baseline, API, display, one detector and intermittent second-task workloads separately. Application queue/frame counters, thermals and measured power must come from the application or instruments. Coexistence observations are not individual-model records and are excluded from the single-model memory filter.
