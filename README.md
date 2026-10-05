# embedded-AI

A machine-readable catalogue of AI/ML models for local and resource-constrained computing, plus clearly labelled companion tools for vision, mapping and simulation.

## Goals
- Catalogue small specialist models across domains.
- Keep hardware/runtime compatibility first-class.
- Separate reported claims from reproduced benchmarks.
- Never invent missing RAM, latency, power, license or compatibility data.
- Generate searchable indexes/site/API from YAML manifests.

## Domains
Audio · Video · Vision · Language · Geospatial · Time series · Engineering/CAD · Robotics · Control · Science · Sensors · Mapping · Simulation

## Compatibility
`unsupported` · `theoretical` · `reported` · `reproduced` · `unknown`

## Structure
```
catalog/       # learned models and model collections
pipelines/     # complete applications and integration toolkits
primitives/    # non-AI algorithms and simulation tools
hardware/      # device profiles
runtimes/      # runtime profiles
schema/        # manifest schema
scripts/       # validation/index generation
benchmarks/    # reproducible results (next milestone)
generated/     # generated catalogue indexes
```

Copy `catalog/_template.yaml` to add a model. See [CONTRIBUTING.md](CONTRIBUTING.md) and the [vision, video and 3D guide](docs/VISION-VIDEO-3D.md).

After editing YAML, run `npm run index` and commit the README and JSON outputs. Run `npm run check` for schema validation, tests and generated-file consistency.

The catalogue deliberately includes TinyML, small specialized models, classical ML and hybrid DSP+ML when they provide useful embedded intelligence.


<!-- CATALOG:START -->

## Full catalogue

**63 entries**, including models, collections, pipelines, toolkits and non-AI primitives. Generated from YAML in `catalog/`, `pipelines/` and `primitives/`.

Names link to manifests; upstream links point to the original projects. **—** means unknown or not applicable, never zero. Model file sizes use decimal MB/kB and are not RAM requirements. Sizes are checkpoint-dependent; read each manifest for scope.

**C / W** = code license / weights license. Unknown weights terms are never replaced by the code license. Target classes are upstream/proposed targets, not reproduced compatibility. Status is kept per hardware target; no global supported/unsupported badge is inferred.

Companion tools are included for composition, not labelled as tiny neural networks. Live/causal versus windowed/offline processing and camera/coordinate requirements are recorded in the new vision manifests. See [vision and 3D guide](docs/VISION-VIDEO-3D.md).

[audio](#catalogue-audio) · [control](#catalogue-control) · [engineering](#catalogue-engineering) · [geospatial](#catalogue-geospatial) · [language](#catalogue-language) · [mapping](#catalogue-mapping) · [reasoning](#catalogue-reasoning) · [robotics](#catalogue-robotics) · [science](#catalogue-science) · [sensors](#catalogue-sensors) · [simulation](#catalogue-simulation) · [time-series](#catalogue-time-series) · [video](#catalogue-video) · [vision](#catalogue-vision)

<a id="catalogue-audio"></a>

### Audio

| Entry / source | Kind | Task | Params | Model file | Runtime / format | Target class | License C / W | Compatibility |
|---|---|---|---:|---:|---|---|---|---|
| [DS-CNN KWS 24k](catalog/audio/keyword-spotting/ds-cnn-24k.yaml) · [upstream](<https://github.com/prarabdhmisra/edge-tinyml>) | model | keyword-spotting | 24K | 45 kB | — | edge | unknown / unknown | unknown |
| [MatchboxNet](catalog/audio/keyword-spotting/matchboxnet.yaml) · [upstream](<https://github.com/NVIDIA/NeMo>) | model | keyword-spotting | — | — | — | edge | unknown / unknown | unknown |
| [YAMNet](catalog/audio/classification/yamnet.yaml) · [upstream](<https://github.com/tensorflow/models/tree/master/research/audioset/yamnet>) | model | sound-classification | 3.7M | — | — | edge | Apache-2.0 / unknown | unknown |
| [Whistle](catalog/audio/speech-to-text/whistle.yaml) · [upstream](<https://huggingface.co/Cactus-Compute/whistle>) | model | speech-to-text | — | 16.9 MB | — | edge | unknown / Apache-2.0 | unknown |
| [Silero VAD](catalog/audio/vad/silero-vad.yaml) · [upstream](<https://github.com/snakers4/silero-vad>) | model | voice-activity-detection | — | 2 MB | — | edge | MIT / unknown | unknown |
| [microWakeWord](catalog/audio/wake-word/microwakeword.yaml) · [upstream](<https://github.com/OHF-Voice/micro-wake-word>) | model | wake-word-detection | — | — | — | edge | Apache-2.0 / unknown | unknown |

<a id="catalogue-control"></a>

### Control

| Entry / source | Kind | Task | Params | Model file | Runtime / format | Target class | License C / W | Compatibility |
|---|---|---|---:|---:|---|---|---|---|
| [MH-FLOCKE](catalog/control/biomimetic/mhflocke.yaml) · [upstream](<https://github.com/MarcHesse/mhflocke>) | model | adaptive-locomotion | — | — | — | edge, robot | unknown / unknown | unknown |
| [EMG Winter Soldier Arm](catalog/control/human-interface/emg-winter-soldier-arm.yaml) · [upstream](<https://github.com/SuryaUT/EMG-Winter-Soldier-Arm>) | model | emg-to-servo-control | — | — | — | edge, robot | unknown / unknown | unknown |
| [Quadruped CPG Controller](catalog/control/biomimetic/quadruped-cpg.yaml) · [upstream](<https://github.com/Tatonta/Quadruped-Robot>) | model | gait-generation | — | — | — | edge, robot | unknown / unknown | unknown |
| [MicroDuck locomotion policies](catalog/control/locomotion/microduck.yaml) · [upstream](<https://github.com/jackyrx/NX_microduck>) | model | locomotion | — | — | — | edge, robot | unknown / unknown | unknown |
| [ArduPilot Neural Mixer](catalog/control/motor/ardupilot-neural-mixer.yaml) · [upstream](<https://github.com/virtualrobotix/Ardupilot-Neural-Mixer>) | model | motor-servo-control | — | — | — | edge, robot | unknown / unknown | unknown |
| [OpenDoge locomotion policy](catalog/control/locomotion/opendoge.yaml) · [upstream](<https://github.com/OpenDogeRobotics/OpenDoge_origin>) | model | quadruped-locomotion | — | — | — | edge, robot | unknown / unknown | unknown |

<a id="catalogue-engineering"></a>

### Engineering

| Entry / source | Kind | Task | Params | Model file | Runtime / format | Target class | License C / W | Compatibility |
|---|---|---|---:|---:|---|---|---|---|
| [Taiga-S1](catalog/engineering/cad/taiga-s1.yaml) · [upstream](<https://github.com/shhivv/taiga-s1>) | model | cad-action-selection | 1.2M | — | — | edge | MIT / unknown | unknown |

<a id="catalogue-geospatial"></a>

### Geospatial

| Entry / source | Kind | Task | Params | Model file | Runtime / format | Target class | License C / W | Compatibility |
|---|---|---|---:|---:|---|---|---|---|
| [OlmoEarth v1 Nano](catalog/geospatial/earth-observation/olmoearth-nano.yaml) · [upstream](<https://huggingface.co/allenai/OlmoEarth-v1-Nano>) | model | earth-observation-embedding | 1.4M | — | — | edge | Apache-2.0 / Apache-2.0 | unknown |
| [OlmoEarth v1 Tiny](catalog/geospatial/earth-observation/olmoearth-tiny.yaml) · [upstream](<https://huggingface.co/allenai/OlmoEarth-v1-Tiny>) | model | earth-observation-embedding | 6.2M | — | — | edge | Apache-2.0 / Apache-2.0 | unknown |

<a id="catalogue-language"></a>

### Language

| Entry / source | Kind | Task | Params | Model file | Runtime / format | Target class | License C / W | Compatibility |
|---|---|---|---:|---:|---|---|---|---|
| [all-MiniLM-L6-v2](catalog/language/embeddings/all-minilm-l6-v2.yaml) · [upstream](<https://huggingface.co/sentence-transformers/all-MiniLM-L6-v2>) | model | embeddings, semantic-search | 22.7M | — | — | edge | Apache-2.0 / Apache-2.0 | unknown |
| [fastText lid.176](catalog/language/classification/fasttext-lid176.yaml) · [upstream](<https://fasttext.cc/docs/en/language-identification.html>) | model | language-identification | — | 917 kB | — | edge | unknown / unknown | unknown |
| [Needle 3](catalog/language/tool-calling/needle3.yaml) · [upstream](<https://huggingface.co/Cactus-Compute/needle3>) | model | tool-calling, structured-extraction, embeddings | — | — | — | edge | unknown / unknown | unknown |

<a id="catalogue-mapping"></a>

### Mapping

| Entry / source | Kind | Task | Params | Model file | Runtime / format | Target class | License C / W | Compatibility |
|---|---|---|---:|---:|---|---|---|---|
| [Brush](pipelines/reconstruction/brush.yaml) · [upstream](<https://github.com/ArthurBrussee/brush>) | pipeline | gaussian-splat-reconstruction, novel-view-rendering | — | — | rust, burn, webgpu | desktop, browser | Apache-2.0 / not-applicable | luckfox-rv1106: unknown |
| [RTAB-Map](pipelines/mapping/rtabmap.yaml) · [upstream](<https://github.com/introlab/rtabmap>) | pipeline | slam, scene-mapping | — | — | native-cpp | desktop | unknown / not-applicable | luckfox-rv1106: unknown |
| [COLMAP](pipelines/reconstruction/colmap.yaml) · [upstream](<https://github.com/colmap/colmap>) | pipeline | structure-from-motion, multi-view-stereo | — | — | native-cpp | desktop | BSD-3-Clause / not-applicable | luckfox-rv1106: unknown |
| [ORB-SLAM3](pipelines/mapping/orb-slam3.yaml) · [upstream](<https://github.com/UZ-SLAMLab/ORB_SLAM3>) | pipeline | visual-slam, camera-localization | — | — | native-cpp | desktop | GPL-3.0 / not-applicable | luckfox-rv1106: unknown |

<a id="catalogue-reasoning"></a>

### Reasoning

| Entry / source | Kind | Task | Params | Model file | Runtime / format | Target class | License C / W | Compatibility |
|---|---|---|---:|---:|---|---|---|---|
| [Tiny Recursive Model](catalog/reasoning/trm.yaml) · [upstream](<https://github.com/SamsungSAILMontreal/TinyRecursiveModels>) | model | structured-reasoning | 7M | — | — | edge | unknown / unknown | unknown |

<a id="catalogue-robotics"></a>

### Robotics

| Entry / source | Kind | Task | Params | Model file | Runtime / format | Target class | License C / W | Compatibility |
|---|---|---|---:|---:|---|---|---|---|
| [EdgeVLA-Tiny](catalog/robotics/vla/edgevla-tiny.yaml) · [upstream](<https://huggingface.co/enfuse/edgevla-tiny-fmb>) | model | vision-language-action | 164M | — | — | edge | unknown / unknown | unknown |

<a id="catalogue-science"></a>

### Science

| Entry / source | Kind | Task | Params | Model file | Runtime / format | Target class | License C / W | Compatibility |
|---|---|---|---:|---:|---|---|---|---|
| [MatterSim Small](catalog/science/materials/mattersim-small.yaml) · [upstream](<https://github.com/microsoft/mattersim>) | model | atomistic-potential | 1M | — | — | edge | MIT / unknown | unknown |

<a id="catalogue-sensors"></a>

### Sensors

| Entry / source | Kind | Task | Params | Model file | Runtime / format | Target class | License C / W | Compatibility |
|---|---|---|---:|---:|---|---|---|---|
| [TensorFlow Lite Micro Magic Wand](catalog/sensors/gesture/tf-micro-magic-wand.yaml) · [upstream](<https://github.com/tensorflow/tflite-micro>) | model | imu-gesture-recognition | — | — | — | edge | unknown / unknown | unknown |
| [TI TinyML Model Zoo](catalog/sensors/model-zoo/ti-tinyml-modelzoo.yaml) · [upstream](<https://github.com/TexasInstruments/tinyml-modelzoo>) | collection | time-series-classification, forecasting, anomaly-detection, audio-classification, image-classification, radar-classification | — | — | — | edge | unknown / unknown | unknown |
| [Pulse / NanoEdge vibration anomaly detector](catalog/sensors/anomaly/pulse-nanoedge.yaml) · [upstream](<https://github.com/Ayushkothari96/pulse>) | model | vibration-anomaly-detection | — | — | — | edge | unknown / unknown | unknown |

<a id="catalogue-simulation"></a>

### Simulation

| Entry / source | Kind | Task | Params | Model file | Runtime / format | Target class | License C / W | Compatibility |
|---|---|---|---:|---:|---|---|---|---|
| [MuJoCo](primitives/simulation/mujoco.yaml) · [upstream](<https://github.com/google-deepmind/mujoco>) | primitive | articulated-physics-simulation | — | — | native-c-cpp, python | desktop | Apache-2.0 / not-applicable | luckfox-rv1106: unknown |

<a id="catalogue-time-series"></a>

### Time series

| Entry / source | Kind | Task | Params | Model file | Runtime / format | Target class | License C / W | Compatibility |
|---|---|---|---:|---:|---|---|---|---|
| [Chronos-Bolt Tiny](catalog/time-series/forecasting/chronos-bolt-tiny.yaml) · [upstream](<https://huggingface.co/amazon/chronos-bolt-tiny>) | model | forecasting | 9M | — | — | edge | Apache-2.0 / Apache-2.0 | unknown |
| [TinyTimeMixer](catalog/time-series/forecasting/tiny-time-mixer.yaml) · [upstream](<https://huggingface.co/ibm-granite/granite-timeseries-ttm-r2>) | model | forecasting | — | — | — | edge | Apache-2.0 / Apache-2.0 | unknown |

<a id="catalogue-video"></a>

### Video

| Entry / source | Kind | Task | Params | Model file | Runtime / format | Target class | License C / W | Compatibility |
|---|---|---|---:|---:|---|---|---|---|
| [Robust Video Matting (MobileNetV3)](catalog/video/matting/robust-video-matting.yaml) · [upstream](<https://github.com/PeterL1n/RobustVideoMatting>) | model | human-video-matting | — | — | pytorch, onnxruntime, tensorflowjs, coreml, onnx | desktop, browser, mobile | GPL-3.0 / unknown | luckfox-rv1106: unknown |
| [TransNet V2](catalog/video/shot-detection/transnet-v2.yaml) · [upstream](<https://github.com/soCzech/TransNetV2>) | model | shot-boundary-detection | — | — | tensorflow, pytorch | desktop | unknown / unknown | luckfox-rv1106: unknown |
| [ST-GCN++ (PYSKL)](catalog/video/action-recognition/st-gcnpp.yaml) · [upstream](<https://github.com/kennymckormick/pyskl>) | model | skeleton-action-recognition | — | — | pytorch | desktop | unknown / unknown | luckfox-rv1106: unknown |
| [MoViNet-A0 Streaming](catalog/video/action-recognition/movinet-a0-stream.yaml) · [upstream](<https://github.com/tensorflow/models/tree/master/official/projects/movinet>) | model | video-action-recognition | — | 13 MB | tensorflow, tflite | mobile, desktop | Apache-2.0 / unknown | luckfox-rv1106: unknown |
| [TSM + MobileNetV2 (online)](catalog/video/action-recognition/tsm-mobilenetv2.yaml) · [upstream](<https://github.com/mit-han-lab/temporal-shift-module>) | model | video-action-recognition, gesture-recognition | — | — | pytorch | edge, desktop | MIT / unknown | luckfox-rv1106: unknown |
| [FastDVDnet](catalog/video/denoising/fastdvdnet.yaml) · [upstream](<https://github.com/m-tassano/fastdvdnet>) | model | video-denoising | — | — | pytorch | desktop | MIT / unknown | luckfox-rv1106: unknown |

<a id="catalogue-vision"></a>

### Vision

| Entry / source | Kind | Task | Params | Model file | Runtime / format | Target class | License C / W | Compatibility |
|---|---|---|---:|---:|---|---|---|---|
| [VideoPose3D](catalog/vision/pose/videopose3d.yaml) · [upstream](<https://github.com/facebookresearch/VideoPose3D>) | model | 2d-to-3d-pose-lifting | — | — | pytorch | desktop | CC-BY-NC / CC-BY-NC | luckfox-rv1106: unknown |
| [MediaPipe Pose Landmarker Lite](catalog/vision/pose/mediapipe-pose-lite.yaml) · [upstream](<https://github.com/google-ai-edge/mediapipe>) | model | body-pose-estimation | — | — | mediapipe, tflite, mediapipe-task | mobile, browser, desktop | Apache-2.0 / unknown | luckfox-rv1106: unknown |
| [RTMPose-t](catalog/vision/pose/rtmpose-t.yaml) · [upstream](<https://github.com/open-mmlab/mmpose>) | model | body-pose-estimation | 3.34M | — | pytorch, onnxruntime, onnx | edge, desktop | Apache-2.0 / unknown | luckfox-rv1106: unknown |
| [BlazeFace](catalog/vision/face/blazeface.yaml) · [upstream](<https://github.com/google-ai-edge/mediapipe>) | model | face-detection | — | — | — | edge | unknown / unknown | unknown |
| [MobileNetV3 Small](catalog/vision/classification/mobilenetv3-small.yaml) · [upstream](<https://github.com/tensorflow/models>) | model | image-classification, feature-extraction | — | — | — | edge | unknown / unknown | unknown |
| [MobileSAM](catalog/vision/segmentation/mobilesam.yaml) · [upstream](<https://github.com/ChaoningZhang/MobileSAM>) | model | image-segmentation | 9.66M | — | — | edge | unknown / unknown | unknown |
| [RFDN](catalog/vision/super-resolution/rfdn.yaml) · [upstream](<https://github.com/njulj/RFDN>) | model | image-super-resolution | — | — | pytorch | desktop | MIT / unknown | luckfox-rv1106: unknown |
| [MobileCLIP2-S0](catalog/vision/embeddings/mobileclip2-s0.yaml) · [upstream](<https://github.com/apple-aiml-research/ml-mobileclip>) | model | image-text-similarity, zero-shot-image-classification | 74.8M | — | pytorch, openclip | mobile, desktop | MIT / Apple-ML-Research-Model-TOU | luckfox-rv1106: unknown |
| [SuperPoint](catalog/vision/features/superpoint.yaml) · [upstream](<https://github.com/magicleap/SuperPointPretrainedNetwork>) | model | keypoint-detection, descriptor-extraction | 1.3M | — | — | edge | unknown / unknown | unknown |
| [Zero-DCE++](catalog/vision/enhancement/zero-dce-plus-plus.yaml) · [upstream](<https://github.com/Li-Chongyi/Zero-DCE_extension>) | model | low-light-enhancement | 10K | — | pytorch | desktop | CC-BY-NC-4.0 / unknown | luckfox-rv1106: unknown |
| [FreeMoCap](pipelines/motion-capture/freemocap.yaml) · [upstream](<https://github.com/freemocap/freemocap>) | pipeline | markerless-motion-capture | — | — | python | desktop | AGPL-3.0 / unknown | luckfox-rv1106: unknown |
| [Depth Anything V2 Small](catalog/vision/depth/depth-anything-v2-small.yaml) · [upstream](<https://github.com/DepthAnything/Depth-Anything-V2>) | model | monocular-depth-estimation | 24.8M | — | pytorch | desktop | Apache-2.0 / Apache-2.0 | luckfox-rv1106: unknown |
| [FastDepth](catalog/vision/depth/fastdepth.yaml) · [upstream](<https://github.com/dwofk/fast-depth>) | model | monocular-depth-estimation | — | — | — | edge | unknown / unknown | unknown |
| [Lite-Mono](catalog/vision/depth/lite-mono.yaml) · [upstream](<https://github.com/noahzn/Lite-Mono>) | model | monocular-depth-estimation | — | — | pytorch | desktop | MIT / unknown | luckfox-rv1106: unknown |
| [ZipDepth](catalog/vision/depth/zipdepth.yaml) · [upstream](<https://github.com/fabiotosi92/ZipDepth>) | model | monocular-depth-estimation | 6.1M | — | pytorch, onnxruntime, onnx | mobile, edge, desktop | MIT / unknown | luckfox-rv1106: unknown |
| [EasyMocap](pipelines/motion-capture/easymocap.yaml) · [upstream](<https://github.com/zju3dv/EasyMocap>) | toolkit | motion-capture, multi-view-pose-fitting | — | — | pytorch, opencv | desktop | unknown / unknown | luckfox-rv1106: unknown |
| [ByteTrack](catalog/vision/tracking/bytetrack.yaml) · [upstream](<https://github.com/ifzhang/ByteTrack>) | pipeline | multi-object-tracking | — | — | — | edge | unknown / unknown | unknown |
| [Lightweight 3D Human Pose Demo](pipelines/pose/lightweight-3d-pose.yaml) · [upstream](<https://github.com/Daniil-Osokin/lightweight-human-pose-estimation-3d-demo.pytorch>) | pipeline | multi-person-3d-pose | — | — | pytorch, openvino | desktop | Apache-2.0 / unknown | luckfox-rv1106: unknown |
| [Depth Anything 3 Small](catalog/vision/depth/depth-anything-3-small.yaml) · [upstream](<https://github.com/ByteDance-Seed/Depth-Anything-3>) | model | multi-view-depth-estimation, camera-pose-estimation | 80M | — | pytorch | desktop | Apache-2.0 / Apache-2.0 | luckfox-rv1106: unknown |
| [EfficientDet-Lite0](catalog/vision/detection/efficientdet-lite0.yaml) · [upstream](<https://www.tensorflow.org/lite/examples/object_detection/overview>) | model | object-detection | — | — | — | edge | unknown / unknown | unknown |
| [NanoDet-Plus](catalog/vision/detection/nanodet-plus.yaml) · [upstream](<https://github.com/RangiLyu/nanodet>) | model | object-detection | 1.17M | — | — | edge | unknown / unknown | unknown |
| [PP-OCRv6 Tiny](catalog/vision/ocr/pp-ocrv6-tiny.yaml) · [upstream](<https://github.com/PaddlePaddle/PaddleOCR>) | model | ocr | 1.5M | — | — | edge | Apache-2.0 / unknown | unknown |
| [MoveNet Lightning](catalog/vision/pose/movenet-lightning.yaml) · [upstream](<https://www.tensorflow.org/hub/tutorials/movenet>) | model | pose-estimation | — | 2.9 MB | — | edge | Apache-2.0 / unknown | unknown |
| [rtmlib](pipelines/pose/rtmlib.yaml) · [upstream](<https://github.com/Tau-J/rtmlib>) | toolkit | pose-inference, pose-tracking | — | — | onnxruntime, opencv, openvino, tensorrt | desktop | Apache-2.0 / unknown | luckfox-rv1106: unknown |
| [PIDNet-S](catalog/vision/segmentation/pidnet-s.yaml) · [upstream](<https://github.com/XuJiacong/PIDNet>) | model | semantic-segmentation | — | — | pytorch | desktop | MIT / unknown | luckfox-rv1106: unknown |
| [LightStereo (OpenStereo)](catalog/vision/depth/lightstereo.yaml) · [upstream](<https://github.com/XiandaGuo/OpenStereo>) | model | stereo-depth-estimation | — | — | pytorch | desktop | academic-noncommercial-only / unknown | luckfox-rv1106: unknown |

<!-- CATALOG:END -->
