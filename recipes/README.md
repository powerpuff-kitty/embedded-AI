# Runnable recipes

Reference implementations for local experimentation, not production camera, medical or trading systems. Python 3.11 is the CI reference; the process-RSS runner supports Linux/macOS. Direct versions are pinned in `requirements.txt`, with the resolved package inventory saved for each CI run. The npm catalogue has a separate complete lockfile.

## Setup

```sh
python3 -m venv .venv
source .venv/bin/activate
python -m pip install -r recipes/requirements.txt
python -m recipes.samples --output-dir runs/sample --video
```

The original seed-42 workload, silence WAV and animated skeleton fixtures are generated locally under CC0-1.0. Silence tests inference plumbing, not speech accuracy. Drawn stickmen do not establish human-pose accuracy. The browser fixture is explicitly marked **not model output**.

## Numerical history to forecast

```sh
python -m recipes.forecast --input runs/sample/workload.csv --output-dir runs/forecast
python -m bench.runner dlinear --config runs/forecast/benchmark-config.json --output runs/dlinear.json
```

Input CSV requires ordered, equally spaced `timestamp,value` observations. Train/validation/test target intervals are chronological and disjoint; scaling uses training values only. The 96-to-24 architecture has two biased linear projections following a 25-step moving average. Its 4,656 parameters are an architectural calculation, not serialized size or RAM.

The independent NumPy implementation uses ridge least squares instead of upstream DLinear's gradient optimizer. It reports held-out MAE/RMSE, last-value error and 24-step seasonal-naive error. It saves plain-array NPZ with pickle disabled. Overlapping windows inside each split are correlated. No trading/generalization claim is made.

## Audio to speech intervals

Review [artifact sources and terms](artifacts.json), then acquire explicitly:

```sh
python -m recipes.download silero --accept-upstream-terms
python -m recipes.vad --input runs/sample/silence.wav --model .models/silero.onnx --output runs/vad.json
```

Use your own uncompressed mono 16 kHz signed-16-bit WAV for meaningful speech evaluation. The independent ONNX adapter carries recurrent state plus 64 context samples between 512-sample chunks. Simple threshold/minimum-duration segmentation is not Silero's full upstream timestamp algorithm. Results contain input/model hashes, probabilities and intervals. This does not transcribe speech.

## Video to stickman timeline

```sh
python -m recipes.download detector --accept-upstream-terms
python -m recipes.download pose --accept-upstream-terms
python -m recipes.pose --input runs/sample/stickman.avi --detector .models/detector.onnx --pose .models/pose.onnx --output runs/pose.jsonl
```

The pipeline uses **YOLOX-tiny plus RTMPose-S**, not RTMPose-t. The rtmlib catalogue entry describes it. Inference does not implicitly download models. Review both checkpoint terms separately from the toolkit's code licence.

JSONL stores COCO-17 joints, confidence, null missing joints, frame dimensions, timestamps and track IDs. Gated one-to-one centre association and histogram-based cut detection are baselines; IDs can switch at crossings/occlusion and are not identities. Timestamps use constant FPS; resample variable-frame-rate video before using this recipe. This is 2D image-relative replay, not world reconstruction or physics.

Run `npm run site:build && npm run site:serve`, choose Skeleton replay and select `runs/pose.jsonl`. The browser reads the local file without uploading it. The animated synthetic fixture demonstrates replay even when no human is detected in the synthetic video.

## Acquisition and integrity

Only the three listed artifacts on allowlisted HTTPS hosts are accepted. Redirects and compressed/inflated size limits are checked. Archive paths are not extracted and downloaded code is not executed. `.models/` is gitignored. Receipts distinguish archive/download SHA-256 from extracted ONNX SHA-256. Null expected hashes indicate first acquisition, not authenticated publisher provenance; pinned hashes reject later drift. Weights are not bundled in this repository or static site.

## Smoke tests and measurements

After explicitly acquiring all three artifacts:

```sh
python scripts/smoke-recipes.py
python -m unittest discover -s tests_python -v
```

Actual neural inference uses synthetic fixtures. The RTMPose-S microbenchmark times pose-only, excluding YOLOX/video decoding; the video CLI has separate per-frame processing timing. Results never silently become MCU, Mac or RV1106 compatibility evidence.
