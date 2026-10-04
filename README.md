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


<!-- CATALOG:START -->

## 📚 Full Catalogue

**30 entries.** This section is generated from `catalog/**/*.yaml`. Unknown values are deliberately shown as **—**, rather than estimated.

**Status:** `reproduced` = benchmarked by this project · `reported` = upstream/community evidence · `theoretical` = plausible but unverified · `unknown` = not established.

### Audio

| Model | Task | Params | Size | Target | License | Status |
|---|---|---:|---:|---|---|---|
| [Whistle](https://huggingface.co/Cactus-Compute/whistle) | speech-to-text | — | 16.9 MB | edge | Apache-2.0 | unknown |
| [Silero VAD](https://github.com/snakers4/silero-vad) | voice-activity-detection | — | 2 MB | edge | MIT* | unknown |
| [microWakeWord](https://github.com/OHF-Voice/micro-wake-word) | wake-word-detection | — | — | edge | Apache-2.0* | unknown |
| [YAMNet](https://github.com/tensorflow/models/tree/master/research/audioset/yamnet) | sound-classification | 3.7M | — | edge | Apache-2.0* | unknown |
| [DS-CNN KWS 24k](https://github.com/prarabdhmisra/edge-tinyml) | keyword-spotting | 24K | 45 KB | edge | unknown | unknown |
| [MatchboxNet](https://github.com/NVIDIA/NeMo) | keyword-spotting | — | — | edge | unknown | unknown |

### Vision

| Model | Task | Params | Size | Target | License | Status |
|---|---|---:|---:|---|---|---|
| [NanoDet-Plus](https://github.com/RangiLyu/nanodet) | object-detection | 1.2M | — | edge | unknown | unknown |
| [EfficientDet-Lite0](https://www.tensorflow.org/lite/examples/object_detection/overview) | object-detection | — | — | edge | unknown | unknown |
| [MobileSAM](https://github.com/ChaoningZhang/MobileSAM) | image-segmentation | 9.7M | — | edge | unknown | unknown |
| [MoveNet Lightning](https://www.tensorflow.org/hub/tutorials/movenet) | pose-estimation | — | 2.9 MB | edge | Apache-2.0* | unknown |
| [PP-OCRv6 Tiny](https://github.com/PaddlePaddle/PaddleOCR) | OCR | 1.5M | — | edge | Apache-2.0* | unknown |
| [SuperPoint](https://github.com/magicleap/SuperPointPretrainedNetwork) | keypoints / descriptors | 1.3M | — | edge | unknown | unknown |
| [FastDepth](https://github.com/dwofk/fast-depth) | monocular depth | — | — | edge | unknown | unknown |
| [MobileNetV3 Small](https://github.com/tensorflow/models) | image classification | — | — | edge | unknown | unknown |
| [ByteTrack](https://github.com/ifzhang/ByteTrack) | multi-object tracking | — | — | edge | unknown | unknown |
| [BlazeFace](https://github.com/google-ai-edge/mediapipe) | face detection | — | — | edge | unknown | unknown |

### Language

| Model | Task | Params | Size | Target | License | Status |
|---|---|---:|---:|---|---|---|
| [Needle 3](https://huggingface.co/Cactus-Compute/needle3) | tool calling / extraction / embeddings | — | — | edge | unknown | unknown |
| [all-MiniLM-L6-v2](https://huggingface.co/sentence-transformers/all-MiniLM-L6-v2) | embeddings / semantic search | 22.7M | — | edge | Apache-2.0 | unknown |
| [fastText lid.176](https://fasttext.cc/docs/en/language-identification.html) | language identification | — | 917 KB | edge | unknown | unknown |

### Geospatial

| Model | Task | Params | Size | Target | License | Status |
|---|---|---:|---:|---|---|---|
| [OlmoEarth v1 Nano](https://huggingface.co/allenai/OlmoEarth-v1-Nano) | Earth-observation embeddings | 1.4M | — | edge | Apache-2.0 | unknown |
| [OlmoEarth v1 Tiny](https://huggingface.co/allenai/OlmoEarth-v1-Tiny) | Earth-observation embeddings | 6.2M | — | edge | Apache-2.0 | unknown |

### Time series

| Model | Task | Params | Size | Target | License | Status |
|---|---|---:|---:|---|---|---|
| [TinyTimeMixer](https://huggingface.co/ibm-granite/granite-timeseries-ttm-r2) | forecasting | — | — | edge | Apache-2.0 | unknown |
| [Chronos-Bolt Tiny](https://huggingface.co/amazon/chronos-bolt-tiny) | forecasting | 9M | — | edge | Apache-2.0 | unknown |

### Engineering

| Model | Task | Params | Size | Target | License | Status |
|---|---|---:|---:|---|---|---|
| [Taiga-S1](https://github.com/shhivv/taiga-s1) | CAD action selection | 1.2M | — | edge | MIT* | unknown |

### Robotics

| Model | Task | Params | Size | Target | License | Status |
|---|---|---:|---:|---|---|---|
| [EdgeVLA-Tiny](https://huggingface.co/enfuse/edgevla-tiny-fmb) | vision-language-action | 164M | — | edge | unknown | unknown |

### Science

| Model | Task | Params | Size | Target | License | Status |
|---|---|---:|---:|---|---|---|
| [MatterSim Small](https://github.com/microsoft/mattersim) | atomistic potential | 1M | — | edge | unknown | unknown |

### Reasoning

| Model | Task | Params | Size | Target | License | Status |
|---|---|---:|---:|---|---|---|
| [Tiny Recursive Model](https://github.com/SamsungSAILMontreal/TinyRecursiveModels) | structured reasoning | 7M | — | edge | unknown | unknown |

### Sensors

| Model | Task | Params | Size | Target | License | Status |
|---|---|---:|---:|---|---|---|
| [Pulse / NanoEdge](https://github.com/Ayushkothari96/pulse) | vibration anomaly detection | — | — | edge | unknown | unknown |
| [TI TinyML Model Zoo](https://github.com/TexasInstruments/tinyml-modelzoo) | sensor / radar / forecasting collection | — | — | edge | unknown | unknown |
| [TFLite Micro Magic Wand](https://github.com/tensorflow/tflite-micro) | IMU gesture recognition | — | — | edge | unknown | unknown |

\* Code license shown where the manifest does not yet establish a separate weights license.

<!-- CATALOG:END -->
