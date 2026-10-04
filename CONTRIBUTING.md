# Contributing
Use primary sources where possible. Unknown values stay unknown; do not infer RAM from weight size.

## Entry rules
1. Copy `catalog/_template.yaml`.
2. Use a stable lowercase ID and precise task names.
3. Separate code and weights licenses.
4. Record compatibility as unsupported/theoretical/reported/reproduced/unknown.
5. Only use `reproduced` when benchmark evidence exists in this repository.
6. Run `npm run validate`.

## Benchmark records
Include exact hardware, runtime, model format and precision, input shape, warmup/sample count, peak RSS if measurable, latency distribution, throughput, power measurement method, software versions and date.
