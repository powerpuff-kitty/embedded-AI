# Creating a small AI model

Small specialist models are often practical to build because the problem can be tightly bounded. The hard part is usually **data and evaluation**, not writing the neural network.

## Workflow
1. Define one narrow input → output contract.
2. Establish a non-ML baseline.
3. Collect/label representative data.
4. Split train/validation/test by real-world scenario, not merely random samples.
5. Start with the smallest credible model.
6. Train on desktop hardware.
7. Quantize/prune/distill only when needed.
8. Export to the target runtime (TFLite, ONNX, RKNN, Core ML, etc.).
9. Benchmark on the actual device.
10. Test failures, out-of-distribution inputs and safety boundaries.

## Good first projects
- IMU gesture classifier
- vibration anomaly detector
- wake-word/keyword classifier
- tiny image classifier
- simple sensor forecasting
- learned high-level servo target policy in simulation

## Difficulty heuristic
**Easy:** classification with clean labelled data and a few classes.
**Moderate:** detection, time-series forecasting, anomaly detection, wake words.
**Hard:** speech recognition, robust tracking, locomotion, manipulation, general control.
**Very hard:** general-purpose multimodal/language models.

## Embedded constraints are part of the model specification
Before training, define target RAM/flash, latency, power, sensor rate, model format/runtime, accelerator, and required accuracy. A model that is accurate on a workstation but cannot meet the device budget is not a successful embedded model.

## Safety
For physical actuation, prefer bounded model outputs plus deterministic validation/control. Use hard limits, watchdogs and safe states outside the learned policy.
