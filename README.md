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
catalog/       # learned models, architectures and model collections
pipelines/     # complete applications and training/integration toolkits
primitives/    # non-AI algorithms, optimization and simulation tools
hardware/      # device profiles
runtimes/      # runtime profiles
schema/        # manifest and supplemental metadata schemas
scripts/       # validation, search and generation
benchmarks/    # reproduced device evidence when available
generated/     # summary, full metadata and coverage JSON exports
```

See [CONTRIBUTING.md](CONTRIBUTING.md), the [vision/video/3D guide](docs/VISION-VIDEO-3D.md), and the [finance/administration/business guide](docs/BUSINESS-AI.md). Copy `catalog/_template.yaml` for a model; consult the new records for complete usage and evaluation metadata.

## Use the catalogue
```sh
npm install
npm run search -- --domain finance --usage pretrained
npm run search -- --query anomaly --json
npm run index
npm run check
```

Edit YAML, not generated tables. `npm run index` regenerates the README and JSON files; `npm run check` validates sources, runs regression tests and detects stale generated files. Main-branch CI also commits regenerated outputs after validation; pull-request checks remain read-only.

Compatibility levels are `unsupported`, `theoretical`, `reported`, `reproduced` and `unknown`. Only evidence-backed device tests qualify as reproduced. Small parameters, local availability and “edge” marketing do not establish MCU or RV1106 compatibility.

The project is a curated, growing catalogue, not an exhaustive list of every model. Unknown fields remain visible. It includes desktop reference models and non-neural companions when useful for composing an embedded intelligence system.

<!-- CATALOG:START -->

## Full catalogue

**95 entries**, including models, collections, pipelines, toolkits and non-AI primitives. Generated from YAML in `catalog/`, `pipelines/` and `primitives/`.

Names link to manifests; upstream links point to original projects. **—** means unknown or not applicable, never zero. Parameter counts and model files are not RAM budgets. Read measurement scope and runtime notes.

**Use:** `pretrained` = published weights, still requiring task data/evaluation; `requires-training` = fit or adapt on your data; `companion` = supporting pipeline/tool; `unknown` = not reviewed. Kind and use are independent: a training toolkit is not a pretrained business model.

**C / W** = code license / weights license. Unknown weights terms are never replaced by code terms. Target classes are upstream/proposed targets, not reproduced compatibility. Status remains per hardware target.

This is a curated, expandable catalogue, not an exhaustive list of every AI or a guarantee that all entries fit embedded boards. Companion tools and desktop references are labelled separately.

Guides: [vision, video and 3D](docs/VISION-VIDEO-3D.md) · [finance, administration and business](docs/BUSINESS-AI.md). Exports: [summary](generated/catalog.json) · [full metadata](generated/catalog.full.json) · [coverage and unknowns](generated/coverage.json).

[administrative](#catalogue-administrative) · [audio](#catalogue-audio) · [business](#catalogue-business) · [control](#catalogue-control) · [energy](#catalogue-energy) · [engineering](#catalogue-engineering) · [finance](#catalogue-finance) · [geospatial](#catalogue-geospatial) · [infrastructure](#catalogue-infrastructure) · [language](#catalogue-language) · [mapping](#catalogue-mapping) · [reasoning](#catalogue-reasoning) · [robotics](#catalogue-robotics) · [science](#catalogue-science) · [sensors](#catalogue-sensors) · [simulation](#catalogue-simulation) · [time-series](#catalogue-time-series) · [video](#catalogue-video) · [vision](#catalogue-vision)

<a id="catalogue-administrative"></a>

### Administrative

| Entry / source | Kind / use | Task | Params | Model file | Runtime / format | Target class | License C / W | Compatibility |
|---|---|---|---:|---:|---|---|---|---|
| [Docling](pipelines/administrative/docling.yaml) · [upstream](<https://github.com/docling-project/docling>) | pipeline / companion | document-parsing, layout-analysis, table-extraction, ocr | — | — | python | desktop, server | MIT / configuration-dependent | unknown |
| [SetFit](pipelines/administrative/setfit.yaml) · [upstream](<https://github.com/huggingface/setfit>) | toolkit / requires-training | few-shot-text-classification, document-routing | — | — | python, sentence-transformers | desktop, server | Apache-2.0 / configuration-dependent | unknown |
| [LEGAL-BERT-Small](catalog/administrative/legal/legal-bert-small.yaml) · [upstream](<https://huggingface.co/nlpaueb/legal-bert-small-uncased>) | model / pretrained | legal-text-representation, masked-language-modelling | — | — | transformers, pytorch | desktop, server | unknown / CC-BY-SA-4.0 | unknown |
| [spaCy en_core_web_sm](catalog/administrative/extraction/spacy-en-core-web-sm.yaml) · [upstream](<https://huggingface.co/spacy/en_core_web_sm>) | model / pretrained | named-entity-recognition, linguistic-analysis | — | — | spacy, spacy-pipeline | desktop, server | MIT / MIT | unknown |
| [GLiNER2.5 Small v1](catalog/administrative/extraction/gliner25-small.yaml) · [upstream](<https://huggingface.co/fastino/gliner2.5-small-v1>) | model / pretrained | schema-driven-extraction, text-classification, relation-extraction | 74M | 296 MB | gliner2, pytorch, safetensors | desktop, server | Apache-2.0 / Apache-2.0 | unknown |
| [Presidio](pipelines/administrative/presidio.yaml) · [upstream](<https://github.com/data-privacy-stack/presidio>) | pipeline / companion | sensitive-data-detection, redaction, de-identification | — | — | python | desktop, server | MIT / configuration-dependent | unknown |
| [fastText supervised classifiers](pipelines/administrative/fasttext-classifier.yaml) · [upstream](<https://github.com/facebookresearch/fastText>) | toolkit / requires-training | text-classification, document-routing | — | — | fasttext-cpp, python, fasttext-bin, fasttext-ftz | desktop, server | MIT / not-provided | unknown |

<a id="catalogue-audio"></a>

### Audio

| Entry / source | Kind / use | Task | Params | Model file | Runtime / format | Target class | License C / W | Compatibility |
|---|---|---|---:|---:|---|---|---|---|
| [DS-CNN KWS 24k](catalog/audio/keyword-spotting/ds-cnn-24k.yaml) · [upstream](<https://github.com/prarabdhmisra/edge-tinyml>) | model / unknown | keyword-spotting | 24K | 45 kB | — | edge | unknown / unknown | unknown |
| [MatchboxNet](catalog/audio/keyword-spotting/matchboxnet.yaml) · [upstream](<https://github.com/NVIDIA/NeMo>) | model / unknown | keyword-spotting | — | — | — | edge | unknown / unknown | unknown |
| [YAMNet](catalog/audio/classification/yamnet.yaml) · [upstream](<https://github.com/tensorflow/models/tree/master/research/audioset/yamnet>) | model / unknown | sound-classification | 3.7M | — | — | edge | Apache-2.0 / unknown | unknown |
| [Whistle](catalog/audio/speech-to-text/whistle.yaml) · [upstream](<https://huggingface.co/Cactus-Compute/whistle>) | model / unknown | speech-to-text | — | 16.9 MB | — | edge | unknown / Apache-2.0 | unknown |
| [Silero VAD](catalog/audio/vad/silero-vad.yaml) · [upstream](<https://github.com/snakers4/silero-vad>) | model / unknown | voice-activity-detection | — | 2 MB | — | edge | MIT / unknown | unknown |
| [microWakeWord](catalog/audio/wake-word/microwakeword.yaml) · [upstream](<https://github.com/OHF-Voice/micro-wake-word>) | model / unknown | wake-word-detection | — | — | — | edge | Apache-2.0 / unknown | unknown |

<a id="catalogue-business"></a>

### Business

| Entry / source | Kind / use | Task | Params | Model file | Runtime / format | Target class | License C / W | Compatibility |
|---|---|---|---:|---:|---|---|---|---|
| [OR-Tools](primitives/optimization/or-tools.yaml) · [upstream](<https://github.com/google/or-tools>) | primitive / companion | constraint-optimization, scheduling, routing, assignment | — | — | or-tools-native, python | desktop, server | Apache-2.0 / not-applicable | unknown |
| [Vowpal Wabbit](pipelines/business/decision/vowpal-wabbit.yaml) · [upstream](<https://github.com/VowpalWabbit/vowpal_wabbit>) | toolkit / requires-training | online-learning, contextual-bandits, action-ranking | — | — | vowpal-wabbit-native, python | desktop, server | BSD-3-Clause / not-provided | unknown |
| [Splink](pipelines/business/records/splink.yaml) · [upstream](<https://github.com/moj-analytical-services/splink>) | toolkit / requires-training | probabilistic-record-linkage, deduplication | — | — | python, sql-backend | desktop, server | MIT / not-provided | unknown |
| [LightFM](pipelines/business/recommendation/lightfm.yaml) · [upstream](<https://github.com/lyst/lightfm>) | toolkit / requires-training | recommendation, personalised-ranking | — | — | python, lightfm | desktop, server | Apache-2.0 / not-provided | unknown |
| [CatBoost](pipelines/business/tabular/catboost.yaml) · [upstream](<https://github.com/catboost/catboost>) | toolkit / requires-training | tabular-classification, tabular-regression, ranking | — | — | catboost-native, python | desktop, server | Apache-2.0 / not-provided | unknown |
| [LightGBM](pipelines/business/tabular/lightgbm.yaml) · [upstream](<https://github.com/lightgbm-org/LightGBM>) | toolkit / requires-training | tabular-classification, tabular-regression, ranking | — | — | lightgbm-native, python | desktop, server | MIT / not-provided | unknown |
| [TabPFN model family](catalog/business/tabular/tabpfn.yaml) · [upstream](<https://github.com/PriorLabs/TabPFN>) | collection / pretrained | tabular-classification, tabular-regression | — | — | pytorch, tabpfn | desktop, server | Apache-2.0 / version-dependent-restricted | unknown |
| [XGBoost](pipelines/business/tabular/xgboost.yaml) · [upstream](<https://github.com/dmlc/xgboost>) | toolkit / requires-training | tabular-classification, tabular-regression, ranking | — | — | xgboost-native, python | desktop, server | Apache-2.0 / not-provided | unknown |

<a id="catalogue-control"></a>

### Control

| Entry / source | Kind / use | Task | Params | Model file | Runtime / format | Target class | License C / W | Compatibility |
|---|---|---|---:|---:|---|---|---|---|
| [MH-FLOCKE](catalog/control/biomimetic/mhflocke.yaml) · [upstream](<https://github.com/MarcHesse/mhflocke>) | model / unknown | adaptive-locomotion | — | — | — | edge, robot | unknown / unknown | unknown |
| [EMG Winter Soldier Arm](catalog/control/human-interface/emg-winter-soldier-arm.yaml) · [upstream](<https://github.com/SuryaUT/EMG-Winter-Soldier-Arm>) | model / unknown | emg-to-servo-control | — | — | — | edge, robot | unknown / unknown | unknown |
| [Quadruped CPG Controller](catalog/control/biomimetic/quadruped-cpg.yaml) · [upstream](<https://github.com/Tatonta/Quadruped-Robot>) | model / unknown | gait-generation | — | — | — | edge, robot | unknown / unknown | unknown |
| [MicroDuck locomotion policies](catalog/control/locomotion/microduck.yaml) · [upstream](<https://github.com/jackyrx/NX_microduck>) | model / unknown | locomotion | — | — | — | edge, robot | unknown / unknown | unknown |
| [ArduPilot Neural Mixer](catalog/control/motor/ardupilot-neural-mixer.yaml) · [upstream](<https://github.com/virtualrobotix/Ardupilot-Neural-Mixer>) | model / unknown | motor-servo-control | — | — | — | edge, robot | unknown / unknown | unknown |
| [OpenDoge locomotion policy](catalog/control/locomotion/opendoge.yaml) · [upstream](<https://github.com/OpenDogeRobotics/OpenDoge_origin>) | model / unknown | quadruped-locomotion | — | — | — | edge, robot | unknown / unknown | unknown |

<a id="catalogue-energy"></a>

### Energy

| Entry / source | Kind / use | Task | Params | Model file | Runtime / format | Target class | License C / W | Compatibility |
|---|---|---|---:|---:|---|---|---|---|
| [CityLearn](pipelines/energy/citylearn.yaml) · [upstream](<https://github.com/citylearn-project/CityLearn>) | toolkit / companion | building-energy-simulation, demand-response-policy-training | — | — | python, gymnasium | desktop, server | MIT / not-applicable | unknown |
| [Grid2Op](pipelines/energy/grid2op.yaml) · [upstream](<https://github.com/Grid2op/grid2op>) | toolkit / companion | power-system-simulation, sequential-decision-evaluation | — | — | python | desktop, server | MPL-2.0 / not-applicable | unknown |

<a id="catalogue-engineering"></a>

### Engineering

| Entry / source | Kind / use | Task | Params | Model file | Runtime / format | Target class | License C / W | Compatibility |
|---|---|---|---:|---:|---|---|---|---|
| [Taiga-S1](catalog/engineering/cad/taiga-s1.yaml) · [upstream](<https://github.com/shhivv/taiga-s1>) | model / unknown | cad-action-selection | 1.2M | — | — | edge | MIT / unknown | unknown |

<a id="catalogue-finance"></a>

### Finance

| Entry / source | Kind / use | Task | Params | Model file | Runtime / format | Target class | License C / W | Compatibility |
|---|---|---|---:|---:|---|---|---|---|
| [FinBERT (ProsusAI)](catalog/finance/sentiment/finbert.yaml) · [upstream](<https://huggingface.co/ProsusAI/finbert>) | model / pretrained | financial-sentiment-classification | — | — | pytorch, transformers | desktop, server | Apache-2.0 / unknown | unknown |
| [Kronos-mini](catalog/finance/forecasting/kronos-mini.yaml) · [upstream](<https://huggingface.co/NeoQuasar/Kronos-mini>) | model / pretrained | financial-time-series-forecasting | 4.1M | — | pytorch, safetensors | desktop, server | MIT / MIT | unknown |
| [Kronos-small](catalog/finance/forecasting/kronos-small.yaml) · [upstream](<https://huggingface.co/NeoQuasar/Kronos-small>) | model / pretrained | financial-time-series-forecasting | 24.7M | — | pytorch, safetensors | desktop, server | MIT / MIT | unknown |
| [hmmlearn](pipelines/finance/hmmlearn.yaml) · [upstream](<https://github.com/hmmlearn/hmmlearn>) | toolkit / requires-training | hidden-state-estimation, sequence-modelling | — | — | python, numpy | desktop, server | BSD-3-Clause / not-provided | unknown |
| [Qlib](pipelines/finance/qlib.yaml) · [upstream](<https://github.com/microsoft/qlib>) | toolkit / companion | quantitative-research, model-evaluation, backtesting | — | — | python | desktop, server | MIT / configuration-dependent | unknown |

<a id="catalogue-geospatial"></a>

### Geospatial

| Entry / source | Kind / use | Task | Params | Model file | Runtime / format | Target class | License C / W | Compatibility |
|---|---|---|---:|---:|---|---|---|---|
| [OlmoEarth v1 Nano](catalog/geospatial/earth-observation/olmoearth-nano.yaml) · [upstream](<https://huggingface.co/allenai/OlmoEarth-v1-Nano>) | model / unknown | earth-observation-embedding | 1.4M | — | — | edge | Apache-2.0 / Apache-2.0 | unknown |
| [OlmoEarth v1 Tiny](catalog/geospatial/earth-observation/olmoearth-tiny.yaml) · [upstream](<https://huggingface.co/allenai/OlmoEarth-v1-Tiny>) | model / unknown | earth-observation-embedding | 6.2M | — | — | edge | Apache-2.0 / Apache-2.0 | unknown |

<a id="catalogue-infrastructure"></a>

### Infrastructure

| Entry / source | Kind / use | Task | Params | Model file | Runtime / format | Target class | License C / W | Compatibility |
|---|---|---|---:|---:|---|---|---|---|
| [Merlion](pipelines/infrastructure/merlion.yaml) · [upstream](<https://github.com/salesforce/Merlion>) | toolkit / requires-training | forecasting, anomaly-detection, change-point-detection | — | — | python | desktop, server | BSD-3-Clause / configuration-dependent | unknown |
| [Loglizer](pipelines/infrastructure/loglizer.yaml) · [upstream](<https://github.com/logpai/loglizer>) | toolkit / requires-training | log-anomaly-detection | — | — | python | desktop, server | MIT / configuration-dependent | unknown |
| [Drain3](pipelines/infrastructure/drain3.yaml) · [upstream](<https://github.com/logpai/Drain3>) | toolkit / companion | log-template-mining, log-structuring | — | — | python | desktop, server | MIT / not-applicable | unknown |
| [Kitsune network anomaly pipeline](pipelines/infrastructure/kitsune.yaml) · [upstream](<https://github.com/ymirsky/Kitsune-py>) | pipeline / companion | network-feature-extraction, network-anomaly-detection | — | — | python, numpy, tshark-or-scapy | desktop, server | MIT / not-provided | unknown |
| [PyRCA](pipelines/infrastructure/pyrca.yaml) · [upstream](<https://github.com/salesforce/PyRCA>) | toolkit / requires-training | root-cause-ranking, metric-graph-analysis | — | — | python | desktop, server | BSD-3-Clause / configuration-dependent | unknown |
| [KitNET](catalog/infrastructure/anomaly/kitnet.yaml) · [upstream](<https://github.com/ymirsky/KitNET-py>) | model / requires-training | streaming-anomaly-detection | — | — | python, numpy | desktop, edge | MIT / not-provided | unknown |
| [River HalfSpaceTrees](catalog/infrastructure/anomaly/river-half-space-trees.yaml) · [upstream](<https://github.com/online-ml/river>) | model / requires-training | streaming-anomaly-detection | — | — | python, river | desktop, edge | BSD-3-Clause / not-provided | unknown |

<a id="catalogue-language"></a>

### Language

| Entry / source | Kind / use | Task | Params | Model file | Runtime / format | Target class | License C / W | Compatibility |
|---|---|---|---:|---:|---|---|---|---|
| [all-MiniLM-L6-v2](catalog/language/embeddings/all-minilm-l6-v2.yaml) · [upstream](<https://huggingface.co/sentence-transformers/all-MiniLM-L6-v2>) | model / unknown | embeddings, semantic-search | 22.7M | — | — | edge | Apache-2.0 / Apache-2.0 | unknown |
| [fastText lid.176](catalog/language/classification/fasttext-lid176.yaml) · [upstream](<https://fasttext.cc/docs/en/language-identification.html>) | model / unknown | language-identification | — | 917 kB | — | edge | unknown / unknown | unknown |
| [Needle 3](catalog/language/tool-calling/needle3.yaml) · [upstream](<https://huggingface.co/Cactus-Compute/needle3>) | model / unknown | tool-calling, structured-extraction, embeddings | — | — | — | edge | unknown / unknown | unknown |

<a id="catalogue-mapping"></a>

### Mapping

| Entry / source | Kind / use | Task | Params | Model file | Runtime / format | Target class | License C / W | Compatibility |
|---|---|---|---:|---:|---|---|---|---|
| [Brush](pipelines/reconstruction/brush.yaml) · [upstream](<https://github.com/ArthurBrussee/brush>) | pipeline / unknown | gaussian-splat-reconstruction, novel-view-rendering | — | — | rust, burn, webgpu | desktop, browser | Apache-2.0 / not-applicable | luckfox-rv1106: unknown |
| [RTAB-Map](pipelines/mapping/rtabmap.yaml) · [upstream](<https://github.com/introlab/rtabmap>) | pipeline / unknown | slam, scene-mapping | — | — | native-cpp | desktop | unknown / not-applicable | luckfox-rv1106: unknown |
| [COLMAP](pipelines/reconstruction/colmap.yaml) · [upstream](<https://github.com/colmap/colmap>) | pipeline / unknown | structure-from-motion, multi-view-stereo | — | — | native-cpp | desktop | BSD-3-Clause / not-applicable | luckfox-rv1106: unknown |
| [ORB-SLAM3](pipelines/mapping/orb-slam3.yaml) · [upstream](<https://github.com/UZ-SLAMLab/ORB_SLAM3>) | pipeline / unknown | visual-slam, camera-localization | — | — | native-cpp | desktop | GPL-3.0 / not-applicable | luckfox-rv1106: unknown |

<a id="catalogue-reasoning"></a>

### Reasoning

| Entry / source | Kind / use | Task | Params | Model file | Runtime / format | Target class | License C / W | Compatibility |
|---|---|---|---:|---:|---|---|---|---|
| [Tiny Recursive Model](catalog/reasoning/trm.yaml) · [upstream](<https://github.com/SamsungSAILMontreal/TinyRecursiveModels>) | model / unknown | structured-reasoning | 7M | — | — | edge | unknown / unknown | unknown |

<a id="catalogue-robotics"></a>

### Robotics

| Entry / source | Kind / use | Task | Params | Model file | Runtime / format | Target class | License C / W | Compatibility |
|---|---|---|---:|---:|---|---|---|---|
| [EdgeVLA-Tiny](catalog/robotics/vla/edgevla-tiny.yaml) · [upstream](<https://huggingface.co/enfuse/edgevla-tiny-fmb>) | model / unknown | vision-language-action | 164M | — | — | edge | unknown / unknown | unknown |

<a id="catalogue-science"></a>

### Science

| Entry / source | Kind / use | Task | Params | Model file | Runtime / format | Target class | License C / W | Compatibility |
|---|---|---|---:|---:|---|---|---|---|
| [MatterSim Small](catalog/science/materials/mattersim-small.yaml) · [upstream](<https://github.com/microsoft/mattersim>) | model / unknown | atomistic-potential | 1M | — | — | edge | MIT / unknown | unknown |

<a id="catalogue-sensors"></a>

### Sensors

| Entry / source | Kind / use | Task | Params | Model file | Runtime / format | Target class | License C / W | Compatibility |
|---|---|---|---:|---:|---|---|---|---|
| [TensorFlow Lite Micro Magic Wand](catalog/sensors/gesture/tf-micro-magic-wand.yaml) · [upstream](<https://github.com/tensorflow/tflite-micro>) | model / unknown | imu-gesture-recognition | — | — | — | edge | unknown / unknown | unknown |
| [TI TinyML Model Zoo](catalog/sensors/model-zoo/ti-tinyml-modelzoo.yaml) · [upstream](<https://github.com/TexasInstruments/tinyml-modelzoo>) | collection / unknown | time-series-classification, forecasting, anomaly-detection, audio-classification, image-classification, radar-classification | — | — | — | edge | unknown / unknown | unknown |
| [Pulse / NanoEdge vibration anomaly detector](catalog/sensors/anomaly/pulse-nanoedge.yaml) · [upstream](<https://github.com/Ayushkothari96/pulse>) | model / unknown | vibration-anomaly-detection | — | — | — | edge | unknown / unknown | unknown |

<a id="catalogue-simulation"></a>

### Simulation

| Entry / source | Kind / use | Task | Params | Model file | Runtime / format | Target class | License C / W | Compatibility |
|---|---|---|---:|---:|---|---|---|---|
| [MuJoCo](primitives/simulation/mujoco.yaml) · [upstream](<https://github.com/google-deepmind/mujoco>) | primitive / unknown | articulated-physics-simulation | — | — | native-c-cpp, python | desktop | Apache-2.0 / not-applicable | luckfox-rv1106: unknown |

<a id="catalogue-time-series"></a>

### Time series

| Entry / source | Kind / use | Task | Params | Model file | Runtime / format | Target class | License C / W | Compatibility |
|---|---|---|---:|---:|---|---|---|---|
| [Chronos-Bolt Tiny](catalog/time-series/forecasting/chronos-bolt-tiny.yaml) · [upstream](<https://huggingface.co/amazon/chronos-bolt-tiny>) | model / unknown | forecasting | 9M | — | — | edge | Apache-2.0 / Apache-2.0 | unknown |
| [DLinear](catalog/time-series/forecasting/dlinear.yaml) · [upstream](<https://github.com/cure-lab/LTSF-Linear>) | model / requires-training | forecasting | — | — | pytorch | desktop, edge | Apache-2.0 / not-provided | unknown |
| [TinyTimeMixer](catalog/time-series/forecasting/tiny-time-mixer.yaml) · [upstream](<https://huggingface.co/ibm-granite/granite-timeseries-ttm-r2>) | model / unknown | forecasting | — | — | — | edge | Apache-2.0 / Apache-2.0 | unknown |
| [NeuralForecast](pipelines/time-series/neuralforecast.yaml) · [upstream](<https://github.com/Nixtla/neuralforecast>) | toolkit / requires-training | neural-forecasting, forecast-model-evaluation | — | — | python, pytorch | desktop, server | Apache-2.0 / configuration-dependent | unknown |
| [StatsForecast](pipelines/time-series/statsforecast.yaml) · [upstream](<https://github.com/Nixtla/statsforecast>) | toolkit / requires-training | statistical-forecasting, baseline-evaluation | — | — | python | desktop, server | Apache-2.0 / not-provided | unknown |

<a id="catalogue-video"></a>

### Video

| Entry / source | Kind / use | Task | Params | Model file | Runtime / format | Target class | License C / W | Compatibility |
|---|---|---|---:|---:|---|---|---|---|
| [Robust Video Matting (MobileNetV3)](catalog/video/matting/robust-video-matting.yaml) · [upstream](<https://github.com/PeterL1n/RobustVideoMatting>) | model / unknown | human-video-matting | — | — | pytorch, onnxruntime, tensorflowjs, coreml, onnx | desktop, browser, mobile | GPL-3.0 / unknown | luckfox-rv1106: unknown |
| [TransNet V2](catalog/video/shot-detection/transnet-v2.yaml) · [upstream](<https://github.com/soCzech/TransNetV2>) | model / unknown | shot-boundary-detection | — | — | tensorflow, pytorch | desktop | unknown / unknown | luckfox-rv1106: unknown |
| [ST-GCN++ (PYSKL)](catalog/video/action-recognition/st-gcnpp.yaml) · [upstream](<https://github.com/kennymckormick/pyskl>) | model / unknown | skeleton-action-recognition | — | — | pytorch | desktop | unknown / unknown | luckfox-rv1106: unknown |
| [MoViNet-A0 Streaming](catalog/video/action-recognition/movinet-a0-stream.yaml) · [upstream](<https://github.com/tensorflow/models/tree/master/official/projects/movinet>) | model / unknown | video-action-recognition | — | 13 MB | tensorflow, tflite | mobile, desktop | Apache-2.0 / unknown | luckfox-rv1106: unknown |
| [TSM + MobileNetV2 (online)](catalog/video/action-recognition/tsm-mobilenetv2.yaml) · [upstream](<https://github.com/mit-han-lab/temporal-shift-module>) | model / unknown | video-action-recognition, gesture-recognition | — | — | pytorch | edge, desktop | MIT / unknown | luckfox-rv1106: unknown |
| [FastDVDnet](catalog/video/denoising/fastdvdnet.yaml) · [upstream](<https://github.com/m-tassano/fastdvdnet>) | model / unknown | video-denoising | — | — | pytorch | desktop | MIT / unknown | luckfox-rv1106: unknown |

<a id="catalogue-vision"></a>

### Vision

| Entry / source | Kind / use | Task | Params | Model file | Runtime / format | Target class | License C / W | Compatibility |
|---|---|---|---:|---:|---|---|---|---|
| [VideoPose3D](catalog/vision/pose/videopose3d.yaml) · [upstream](<https://github.com/facebookresearch/VideoPose3D>) | model / unknown | 2d-to-3d-pose-lifting | — | — | pytorch | desktop | CC-BY-NC / CC-BY-NC | luckfox-rv1106: unknown |
| [MediaPipe Pose Landmarker Lite](catalog/vision/pose/mediapipe-pose-lite.yaml) · [upstream](<https://github.com/google-ai-edge/mediapipe>) | model / unknown | body-pose-estimation | — | — | mediapipe, tflite, mediapipe-task | mobile, browser, desktop | Apache-2.0 / unknown | luckfox-rv1106: unknown |
| [RTMPose-t](catalog/vision/pose/rtmpose-t.yaml) · [upstream](<https://github.com/open-mmlab/mmpose>) | model / unknown | body-pose-estimation | 3.34M | — | pytorch, onnxruntime, onnx | edge, desktop | Apache-2.0 / unknown | luckfox-rv1106: unknown |
| [BlazeFace](catalog/vision/face/blazeface.yaml) · [upstream](<https://github.com/google-ai-edge/mediapipe>) | model / unknown | face-detection | — | — | — | edge | unknown / unknown | unknown |
| [MobileNetV3 Small](catalog/vision/classification/mobilenetv3-small.yaml) · [upstream](<https://github.com/tensorflow/models>) | model / unknown | image-classification, feature-extraction | — | — | — | edge | unknown / unknown | unknown |
| [MobileSAM](catalog/vision/segmentation/mobilesam.yaml) · [upstream](<https://github.com/ChaoningZhang/MobileSAM>) | model / unknown | image-segmentation | 9.66M | — | — | edge | unknown / unknown | unknown |
| [RFDN](catalog/vision/super-resolution/rfdn.yaml) · [upstream](<https://github.com/njulj/RFDN>) | model / unknown | image-super-resolution | — | — | pytorch | desktop | MIT / unknown | luckfox-rv1106: unknown |
| [MobileCLIP2-S0](catalog/vision/embeddings/mobileclip2-s0.yaml) · [upstream](<https://github.com/apple-aiml-research/ml-mobileclip>) | model / unknown | image-text-similarity, zero-shot-image-classification | 74.8M | — | pytorch, openclip | mobile, desktop | MIT / Apple-ML-Research-Model-TOU | luckfox-rv1106: unknown |
| [SuperPoint](catalog/vision/features/superpoint.yaml) · [upstream](<https://github.com/magicleap/SuperPointPretrainedNetwork>) | model / unknown | keypoint-detection, descriptor-extraction | 1.3M | — | — | edge | unknown / unknown | unknown |
| [Zero-DCE++](catalog/vision/enhancement/zero-dce-plus-plus.yaml) · [upstream](<https://github.com/Li-Chongyi/Zero-DCE_extension>) | model / unknown | low-light-enhancement | 10K | — | pytorch | desktop | CC-BY-NC-4.0 / unknown | luckfox-rv1106: unknown |
| [FreeMoCap](pipelines/motion-capture/freemocap.yaml) · [upstream](<https://github.com/freemocap/freemocap>) | pipeline / unknown | markerless-motion-capture | — | — | python | desktop | AGPL-3.0 / unknown | luckfox-rv1106: unknown |
| [Depth Anything V2 Small](catalog/vision/depth/depth-anything-v2-small.yaml) · [upstream](<https://github.com/DepthAnything/Depth-Anything-V2>) | model / unknown | monocular-depth-estimation | 24.8M | — | pytorch | desktop | Apache-2.0 / Apache-2.0 | luckfox-rv1106: unknown |
| [FastDepth](catalog/vision/depth/fastdepth.yaml) · [upstream](<https://github.com/dwofk/fast-depth>) | model / unknown | monocular-depth-estimation | — | — | — | edge | unknown / unknown | unknown |
| [Lite-Mono](catalog/vision/depth/lite-mono.yaml) · [upstream](<https://github.com/noahzn/Lite-Mono>) | model / unknown | monocular-depth-estimation | — | — | pytorch | desktop | MIT / unknown | luckfox-rv1106: unknown |
| [ZipDepth](catalog/vision/depth/zipdepth.yaml) · [upstream](<https://github.com/fabiotosi92/ZipDepth>) | model / unknown | monocular-depth-estimation | 6.1M | — | pytorch, onnxruntime, onnx | mobile, edge, desktop | MIT / unknown | luckfox-rv1106: unknown |
| [EasyMocap](pipelines/motion-capture/easymocap.yaml) · [upstream](<https://github.com/zju3dv/EasyMocap>) | toolkit / unknown | motion-capture, multi-view-pose-fitting | — | — | pytorch, opencv | desktop | unknown / unknown | luckfox-rv1106: unknown |
| [ByteTrack](catalog/vision/tracking/bytetrack.yaml) · [upstream](<https://github.com/ifzhang/ByteTrack>) | pipeline / unknown | multi-object-tracking | — | — | — | edge | unknown / unknown | unknown |
| [Lightweight 3D Human Pose Demo](pipelines/pose/lightweight-3d-pose.yaml) · [upstream](<https://github.com/Daniil-Osokin/lightweight-human-pose-estimation-3d-demo.pytorch>) | pipeline / unknown | multi-person-3d-pose | — | — | pytorch, openvino | desktop | Apache-2.0 / unknown | luckfox-rv1106: unknown |
| [Depth Anything 3 Small](catalog/vision/depth/depth-anything-3-small.yaml) · [upstream](<https://github.com/ByteDance-Seed/Depth-Anything-3>) | model / unknown | multi-view-depth-estimation, camera-pose-estimation | 80M | — | pytorch | desktop | Apache-2.0 / Apache-2.0 | luckfox-rv1106: unknown |
| [EfficientDet-Lite0](catalog/vision/detection/efficientdet-lite0.yaml) · [upstream](<https://www.tensorflow.org/lite/examples/object_detection/overview>) | model / unknown | object-detection | — | — | — | edge | unknown / unknown | unknown |
| [NanoDet-Plus](catalog/vision/detection/nanodet-plus.yaml) · [upstream](<https://github.com/RangiLyu/nanodet>) | model / unknown | object-detection | 1.17M | — | — | edge | unknown / unknown | unknown |
| [PP-OCRv6 Tiny](catalog/vision/ocr/pp-ocrv6-tiny.yaml) · [upstream](<https://github.com/PaddlePaddle/PaddleOCR>) | model / unknown | ocr | 1.5M | — | — | edge | Apache-2.0 / unknown | unknown |
| [MoveNet Lightning](catalog/vision/pose/movenet-lightning.yaml) · [upstream](<https://www.tensorflow.org/hub/tutorials/movenet>) | model / unknown | pose-estimation | — | 2.9 MB | — | edge | Apache-2.0 / unknown | unknown |
| [rtmlib](pipelines/pose/rtmlib.yaml) · [upstream](<https://github.com/Tau-J/rtmlib>) | toolkit / unknown | pose-inference, pose-tracking | — | — | onnxruntime, opencv, openvino, tensorrt | desktop | Apache-2.0 / unknown | luckfox-rv1106: unknown |
| [PIDNet-S](catalog/vision/segmentation/pidnet-s.yaml) · [upstream](<https://github.com/XuJiacong/PIDNet>) | model / unknown | semantic-segmentation | — | — | pytorch | desktop | MIT / unknown | luckfox-rv1106: unknown |
| [LightStereo (OpenStereo)](catalog/vision/depth/lightstereo.yaml) · [upstream](<https://github.com/XiandaGuo/OpenStereo>) | model / unknown | stereo-depth-estimation | — | — | pytorch | desktop | academic-noncommercial-only / unknown | luckfox-rv1106: unknown |

<!-- CATALOG:END -->
