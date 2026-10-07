# embedded-AI

> An embeddable AI catalogue — models, toolkits and non-AI primitives for local and resource-constrained computing.

[![Live explorer](https://img.shields.io/badge/live_explorer-open-2ea44f?logo=githubpages&logoColor=white)](https://powerpuff-kitty.github.io/embedded-AI/)
[![pages](https://img.shields.io/github/actions/workflow/status/powerpuff-kitty/embedded-AI/pages.yml?label=pages)](https://github.com/powerpuff-kitty/embedded-AI/actions/workflows/pages.yml)
[![catalog](https://img.shields.io/github/actions/workflow/status/powerpuff-kitty/embedded-AI/catalog.yml?label=validate)](https://github.com/powerpuff-kitty/embedded-AI/actions/workflows/catalog.yml)
[![recipes](https://img.shields.io/github/actions/workflow/status/powerpuff-kitty/embedded-AI/recipes.yml?label=recipes)](https://github.com/powerpuff-kitty/embedded-AI/actions/workflows/recipes.yml)
[![entries](https://img.shields.io/badge/dynamic/json?color=blue&label=entries&query=%24.total&url=https%3A%2F%2Fraw.githubusercontent.com%2Fpowerpuff-kitty%2Fembedded-AI%2Fmain%2Fgenerated%2Fcoverage.json)](generated/coverage.json)

**Explore it live** — <a href="https://powerpuff-kitty.github.io/embedded-AI/" target="_blank" rel="noopener">powerpuff-kitty.github.io/embedded-AI</a> · no install, no account, no tracking.

---

## What is this?

**embedded-AI is a machine-readable catalogue of embeddable AI** — models, toolkits and non-AI primitives for local and resource-constrained computing, from microcontrollers and phones to single-board computers and servers.

Each entry is a small YAML file. The tables below, the JSON exports, the search and need-matching CLIs, and the web explorer are all generated from those files. Fields that are not known are left unknown rather than guessed.

## How it is organised

- **Kinds:** `model`, `collection`, `pipeline`, `toolkit` and `primitive` are labelled separately.
- **Use:** `pretrained`, `requires-training` and `companion` are recorded per entry.
- **Domains:** 51 areas, from vision and audio to genomics, gaming and space.
- **One source, many faces:** the same YAML drives the README table, the JSON exports and the explorer.

## Quick start

**Use the live explorer** — nothing to install:
<a href="https://powerpuff-kitty.github.io/embedded-AI/" target="_blank" rel="noopener">https://powerpuff-kitty.github.io/embedded-AI/</a>

**Or work locally:**

```sh
npm ci --ignore-scripts
npm run search -- --domain finance --usage pretrained      # metadata search
npm run need -- "detect people offline with a tiny model"  # plain-language matcher
npm run links                                              # audit upstream links
npm run audit                                              # catalogue hygiene
npm run check                                              # validate + tests + freshness
```

Edit YAML, not generated tables. On `main`, CI regenerates and commits only catalogue outputs; pull-request checks stay read-only.

## At a glance

| | |
|---|---|
| **539 entries** | models, collections, pipelines, toolkits and primitives |
| **54 domains** | vision, audio, language, robotics, gaming, genomics and more |
| **5 kinds** | model · collection · pipeline · toolkit · primitive |

## Domains

51 domains: Audio · Video · Vision · Language · Geospatial · Weather · Climate · Time series · Engineering/CAD · Robotics · Control · Science · Genomics · Drug discovery · Sensors · Mapping · Simulation · Gaming · Music · Healthcare · Agriculture · Automotive · Manufacturing · Finance · Fraud detection · Recommendation · Administration · Business · IT infrastructure · Energy · Security · Runtime · Telecom · Networking · Benchmark · Artificial life · Neuromorphic · Event vision · Education · Trust &amp; safety · Federated learning · Quantum · Marine · Accessibility · Environment · Fashion · Space · Hydrology · Forestry · Sports · Graph · Retrieval · Agents.

## Documentation

- [Need matcher guide](docs/NEED-MATCHER.md) — how plain-language search ranks components
- [Vision, video & 3D](docs/VISION-VIDEO-3D.md) — per-task guides
- [Finance, administration & business](docs/BUSINESS-AI.md) — per-task guides
- [Runnable Catalogue v0.2](docs/RUNNABLE-V02.md) — explorer, recipes and benchmarks
- [Design system](docs/DESIGN.md) — tokens and components
- [Taxonomy](docs/TAXONOMY.md) — how components are classified
- [Building small models](docs/BUILDING-SMALL-MODELS.md) — a practical workflow
- [Dependency & security review](docs/SECURITY-REVIEW-V02.md)
- [Contributing](CONTRIBUTING.md) — entry rules and tooling

## Project layout

```text
catalog/       # learned models, architectures and collections
pipelines/     # applications and training/integration toolkits
primitives/    # non-AI optimization and simulation
hardware/      # device profiles (MCU, SBC, NPU, neuromorphic)
runtimes/      # runtime profiles
schema/        # catalogue and benchmark schemas
scripts/       # validation, search, need matcher, audits, generation, site build
site/          # static explorer and local skeleton viewer
recipes/       # local forecast, VAD and pose examples
bench/         # process-isolated measurement adapters
benchmarks/    # actual environment-specific observations
generated/     # summary, full metadata and coverage JSON
```

## Contributing

Use primary sources and leave unknowns unknown. See [CONTRIBUTING.md](CONTRIBUTING.md); run `npm run check`, `npm run audit -- --strict` and `npm run links` before opening a pull request.

---

<!-- CATALOG:START -->

## Full catalogue

**539 entries**, including models, collections, pipelines, toolkits and non-AI primitives. Generated from YAML in `catalog/`, `pipelines/` and `primitives/`.

Names link to manifests; upstream links point to original projects. **—** means unknown or not applicable, never zero. Parameter counts and model files are not RAM budgets. Read measurement scope and runtime notes.

**Use:** `pretrained` = published weights, still requiring task data/evaluation; `requires-training` = fit or adapt on your data; `companion` = supporting pipeline/tool; `unknown` = not reviewed. Kind and use are independent: a training toolkit is not a pretrained business model.

**C / W** = code license / weights license. Unknown weights terms are never replaced by code terms. Target classes are upstream/proposed targets, not reproduced compatibility. Status remains per hardware target.

This is a curated, expandable catalogue, not an exhaustive list of every AI or a guarantee that all entries fit embedded boards. Companion tools and desktop references are labelled separately.

Guides: [vision, video and 3D](docs/VISION-VIDEO-3D.md) · [finance, administration and business](docs/BUSINESS-AI.md). Exports: [summary](generated/catalog.json) · [full metadata](generated/catalog.full.json) · [coverage and unknowns](generated/coverage.json).

[accessibility](#catalogue-accessibility) · [administrative](#catalogue-administrative) · [agents](#catalogue-agents) · [agriculture](#catalogue-agriculture) · [artificial-life](#catalogue-artificial-life) · [audio](#catalogue-audio) · [automotive](#catalogue-automotive) · [benchmark](#catalogue-benchmark) · [business](#catalogue-business) · [climate](#catalogue-climate) · [control](#catalogue-control) · [drug-discovery](#catalogue-drug-discovery) · [education](#catalogue-education) · [energy](#catalogue-energy) · [engineering](#catalogue-engineering) · [environment](#catalogue-environment) · [event-vision](#catalogue-event-vision) · [fashion](#catalogue-fashion) · [federated-learning](#catalogue-federated-learning) · [finance](#catalogue-finance) · [forestry](#catalogue-forestry) · [fraud-detection](#catalogue-fraud-detection) · [gaming](#catalogue-gaming) · [genomics](#catalogue-genomics) · [geospatial](#catalogue-geospatial) · [graph](#catalogue-graph) · [healthcare](#catalogue-healthcare) · [hydrology](#catalogue-hydrology) · [infrastructure](#catalogue-infrastructure) · [language](#catalogue-language) · [manufacturing](#catalogue-manufacturing) · [mapping](#catalogue-mapping) · [marine](#catalogue-marine) · [music](#catalogue-music) · [networking](#catalogue-networking) · [neuromorphic](#catalogue-neuromorphic) · [quantum](#catalogue-quantum) · [reasoning](#catalogue-reasoning) · [recommendation](#catalogue-recommendation) · [retrieval](#catalogue-retrieval) · [robotics](#catalogue-robotics) · [runtime](#catalogue-runtime) · [science](#catalogue-science) · [security](#catalogue-security) · [sensors](#catalogue-sensors) · [simulation](#catalogue-simulation) · [space](#catalogue-space) · [sports](#catalogue-sports) · [telecom](#catalogue-telecom) · [time-series](#catalogue-time-series) · [trust-and-safety](#catalogue-trust-and-safety) · [video](#catalogue-video) · [vision](#catalogue-vision) · [weather](#catalogue-weather)

<a id="catalogue-accessibility"></a>

### Accessibility

| Entry / source | Kind / use | Task | Params | Model file | Runtime / format | Target class | License C / W | Compatibility |
|---|---|---|---:|---:|---|---|---|---|
| [Sign-Language Gesture Recognition (CNN+RNN)](pipelines/accessibility/sign-language-gesture-recognition.yaml) · [upstream](<https://github.com/hthuwal/sign-language-gesture-recognition>) | pipeline / requires-training | sign-language-recognition, gesture-recognition | — | — | pytorch, tensorflow | desktop, edge | MIT / not-provided | unknown |
| [WLASL](catalog/accessibility/wlasl.yaml) · [upstream](<https://github.com/dxli94/WLASL>) | collection / requires-training | sign-language-recognition, video-classification | — | — | pytorch, pytorch-checkpoint | desktop, server | unknown / unknown | unknown |

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

<a id="catalogue-agents"></a>

### Agents

| Entry / source | Kind / use | Task | Params | Model file | Runtime / format | Target class | License C / W | Compatibility |
|---|---|---|---:|---:|---|---|---|---|
| [smolagents](pipelines/agents/smolagents.yaml) · [upstream](<https://github.com/huggingface/smolagents>) | toolkit / companion | agent-orchestration, tool-use, code-agents | — | — | python, transformers, llama-cpp | desktop, server, edge | Apache-2.0 / not-provided | unknown |
| [Functionary](pipelines/agents/functionary.yaml) · [upstream](<https://huggingface.co/meetkai/functionary-small-v3.1>) | collection / pretrained | tool-calling, function-calling, structured-output | — | — | transformers, llama-cpp, vllm, safetensors, gguf | desktop, server, edge | MIT / unknown | unknown |
| [Gorilla](pipelines/agents/gorilla.yaml) · [upstream](<https://huggingface.co/gorilla-llm/gorilla-7b-hf-v1>) | collection / pretrained | tool-calling, api-calling, retrieval-augmented | — | — | transformers, llama-cpp, vllm, safetensors, gguf | desktop, server | Apache-2.0 / unknown | unknown |
| [Hermes Function Calling](pipelines/agents/hermes-function-calling.yaml) · [upstream](<https://huggingface.co/NousResearch/Hermes-2-Pro-Llama-3-8B>) | collection / pretrained | tool-calling, function-calling, structured-output | — | — | transformers, llama-cpp, vllm, safetensors, gguf | desktop, server, edge | MIT / unknown | unknown |
| [xLAM](pipelines/agents/xlam.yaml) · [upstream](<https://huggingface.co/Salesforce/xLAM-1b-fc-r>) | collection / pretrained | tool-calling, function-calling | — | — | transformers, llama-cpp, vllm, safetensors, gguf | mobile, edge, desktop, server | unknown / unknown | unknown |

<a id="catalogue-agriculture"></a>

### Agriculture

| Entry / source | Kind / use | Task | Params | Model file | Runtime / format | Target class | License C / W | Compatibility |
|---|---|---|---:|---:|---|---|---|---|
| [AgML](pipelines/agriculture/agml.yaml) · [upstream](<https://github.com/Project-AgML/AgML>) | toolkit / requires-training | agricultural-dataset-management, crop-classification, plant-disease-detection, crop-segmentation | — | — | python, pytorch, tensorflow | desktop, server | Apache-2.0 / not-applicable | unknown |

<a id="catalogue-artificial-life"></a>

### Artificial life

| Entry / source | Kind / use | Task | Params | Model file | Runtime / format | Target class | License C / W | Compatibility |
|---|---|---|---:|---:|---|---|---|---|
| [3D Artefacts NCA](pipelines/artificial-life/nca-3d-artefacts.yaml) · [upstream](<https://github.com/real-itu/3d-artefacts-nca>) | pipeline / requires-training | 3d-artefact-generation, morphogenesis, self-organising-pattern-generation | — | — | pytorch | desktop | MIT / not-provided | unknown |
| [3D Growing NCA (Aadityaza)](pipelines/artificial-life/3d-growing-nca.yaml) · [upstream](<https://github.com/Aadityaza/3d-Growing-neural-cellular-automata>) | pipeline / requires-training | 3d-artefact-generation, morphogenesis | — | — | pytorch | desktop | MIT / not-provided | unknown |
| [3D Neural Cellular Automata (Monash)](pipelines/artificial-life/3d-nca-monash.yaml) · [upstream](<https://github.com/MonashDeepNeuron/3D-Neural-Cellular-Automata>) | pipeline / requires-training | 3d-artefact-generation, morphogenesis, self-organising-pattern-generation | — | — | pytorch | desktop | MIT / not-provided | unknown |
| [ASAL (Automating the Search for Artificial Life)](pipelines/artificial-life/asal.yaml) · [upstream](<https://github.com/SakanaAI/asal>) | pipeline / companion | artificial-life-search, evolutionary-search, foundation-model-guided-search | — | — | pytorch | desktop, server | Apache-2.0 / not-provided | unknown |
| [ASAL (PyTorch reimplementation)](pipelines/artificial-life/asal-pytorch.yaml) · [upstream](<https://github.com/fredericowieser/ASAL-PyTorch>) | pipeline / companion | artificial-life-search, evolutionary-search | — | — | pytorch | desktop | unknown / not-provided | unknown |
| [Convoca](pipelines/artificial-life/convoca.yaml) · [upstream](<https://github.com/williamgilpin/convoca>) | toolkit / requires-training | cellular-automata-prediction, neural-cellular-automata-analysis | — | — | pytorch | desktop | unknown / not-provided | unknown |
| [CAPOW (Continuous Cellular Automata)](primitives/artificial-life/capow.yaml) · [upstream](<https://github.com/rudyrucker/capow>) | primitive / companion | continuous-cellular-automata, artificial-life-simulation | — | — | native-cpp | desktop | GPL-3.0 / not-applicable | unknown |
| [FlowLenia](primitives/artificial-life/flow-lenia.yaml) · [upstream](<https://github.com/erwanplantec/FlowLenia>) | primitive / companion | continuous-cellular-automata, artificial-life-simulation, evolutionary-search | — | — | python | desktop | unknown / not-applicable | unknown |
| [Lenia](primitives/artificial-life/lenia.yaml) · [upstream](<https://github.com/Chakazul/Lenia>) | primitive / companion | continuous-cellular-automata, artificial-life-simulation | — | — | python, javascript | desktop, browser | MIT / not-applicable | unknown |
| [Lenia Tutorial](catalog/artificial-life/lenia-tutorial.yaml) · [upstream](<https://github.com/lenia-org/Lenia-Tutorial>) | collection / companion | continuous-cellular-automata, artificial-life-simulation | — | — | jupyter, python | desktop, browser | MIT / not-applicable | unknown |
| [Real-time Flow-Lenia](primitives/artificial-life/realtime-flowlenia.yaml) · [upstream](<https://github.com/ochyai/realtime-flowlenia>) | primitive / companion | continuous-cellular-automata, artificial-life-simulation | — | — | pytorch | desktop | MIT / not-applicable | unknown |
| [lenia_ca (Rust)](primitives/artificial-life/lenia-ca.yaml) · [upstream](<https://github.com/BirdbrainEngineer/lenia_ca>) | primitive / companion | continuous-cellular-automata, artificial-life-simulation | — | — | rust, wasm | browser, desktop, edge | MIT / not-applicable | unknown |
| [Adaptive Particle Lenia](primitives/artificial-life/adaptive-particle-lenia.yaml) · [upstream](<https://github.com/KazuyaHoribe/AdaptiveParticleLenia>) | primitive / companion | particle-simulation, artificial-life-simulation, evolutionary-search | — | — | python | desktop | unknown / not-applicable | unknown |
| [Particle Lenia](primitives/artificial-life/particle-lenia.yaml) · [upstream](<https://github.com/silvernio/particle-lenia>) | primitive / companion | particle-simulation, artificial-life-simulation | — | — | typescript, webgpu | browser | unknown / not-applicable | unknown |
| [Reaction-Diffusion Playground](primitives/artificial-life/reaction-diffusion-playground.yaml) · [upstream](<https://github.com/jasonwebb/reaction-diffusion-playground>) | primitive / companion | reaction-diffusion-simulation, pattern-formation | — | — | javascript, webgl | browser | CC-BY-NC-SA-4.0 / not-applicable | unknown |
| [Growing NCA (PyTorch, PWhiddy)](pipelines/artificial-life/growing-nca-pytorch.yaml) · [upstream](<https://github.com/PWhiddy/Growing-Neural-Cellular-Automata-Pytorch>) | pipeline / requires-training | self-organising-pattern-generation, texture-synthesis, morphogenesis | — | — | pytorch | desktop, browser | Apache-2.0 / not-provided | unknown |
| [Growing NCA Reproduction (PyTorch)](pipelines/artificial-life/growing-nca-repro.yaml) · [upstream](<https://github.com/chenmingxiang110/Growing-Neural-Cellular-Automata>) | pipeline / requires-training | self-organising-pattern-generation, morphogenesis | — | — | pytorch | desktop | MIT / not-provided | unknown |
| [Growing Neural Cellular Automata](catalog/artificial-life/growing-nca.yaml) · [upstream](<https://github.com/google-research/self-organising-systems>) | collection / requires-training | self-organising-pattern-generation, texture-synthesis, morphogenesis | — | — | jax | desktop | Apache-2.0 / not-provided | unknown |
| [Self-Organising Textures](catalog/artificial-life/selforg-textures.yaml) · [upstream](<https://github.com/distillpub/post--selforg-textures>) | collection / requires-training | texture-synthesis, self-organising-pattern-generation | — | — | jax | desktop, browser | CC-BY-4.0 / not-provided | unknown |

<a id="catalogue-audio"></a>

### Audio

| Entry / source | Kind / use | Task | Params | Model file | Runtime / format | Target class | License C / W | Compatibility |
|---|---|---|---:|---:|---|---|---|---|
| [AST (Audio Spectrogram Transformer)](catalog/audio/classification/ast.yaml) · [upstream](<https://github.com/YuanGongND/ast>) | collection / pretrained | audio-classification | — | — | pytorch, pytorch-checkpoint | desktop, server | BSD-3-Clause / unknown | unknown |
| [PANNs](catalog/audio/classification/panns.yaml) · [upstream](<https://github.com/qiuqiangkong/audioset_tagging_cnn>) | collection / pretrained | audio-tagging, sound-event-classification | — | — | pytorch, pytorch-checkpoint | desktop, server, edge | MIT / unknown | unknown |
| [CLAP (Contrastive Language-Audio Pretraining)](catalog/audio/classification/clap.yaml) · [upstream](<https://github.com/LAION-AI/CLAP>) | collection / pretrained | audio-text-similarity, zero-shot-audio-classification | — | — | pytorch, pytorch-checkpoint | desktop, server | CC0-1.0 / unknown | unknown |
| [MegaDetector-Acoustic](catalog/audio/classification/megadetector-acoustic.yaml) · [upstream](<https://github.com/microsoft/MegaDetector-Acoustic>) | collection / pretrained | bioacoustic-classification, species-identification | — | — | pytorch, pytorch-checkpoint | edge, desktop, server | MIT / unknown | unknown |
| [Arm ML Examples](catalog/audio/keyword-spotting/arm-ml-examples.yaml) · [upstream](<https://github.com/ARM-software/ML-examples>) | collection / companion | keyword-spotting, mcu-inference, model-optimization | — | — | tensorflow, tflite-micro, cmsis-nn, ethos-u, tflite | edge | Apache-2.0 / not-provided | cortex-m: reported |
| [DS-CNN KWS 24k](catalog/audio/keyword-spotting/ds-cnn-kws-24k.yaml) · [upstream](<https://github.com/prarabdhmisra/edge-tinyml>) | model / unknown | keyword-spotting | 24K | 45 kB | — | edge | MIT / unknown | unknown |
| [ML-KWS-for-MCU](catalog/audio/keyword-spotting/ml-kws-for-mcu.yaml) · [upstream](<https://github.com/ARM-software/ML-KWS-for-MCU>) | collection / requires-training | keyword-spotting, mcu-inference | — | — | tensorflow, tflite, cmsis-nn | edge | Apache-2.0 / not-provided | unknown |
| [MatchboxNet](catalog/audio/keyword-spotting/matchboxnet.yaml) · [upstream](<https://github.com/NVIDIA/NeMo>) | model / unknown | keyword-spotting | — | — | pytorch | edge | Apache-2.0 / unknown | unknown |
| [RNNoise](pipelines/audio/rnnoise.yaml) · [upstream](<https://github.com/xiph/rnnoise>) | pipeline / pretrained | noise-suppression, speech-enhancement | — | — | native-c, c-source | edge, mobile, desktop | BSD-3-Clause / BSD-3-Clause | unknown |
| [YAMNet](catalog/audio/classification/yamnet.yaml) · [upstream](<https://storage.googleapis.com/audioset/yamnet.h5>) | model / pretrained | sound-classification | 3.7M | — | tensorflow, tf-keras, hdf5 | edge | Apache-2.0 / unknown | unknown |
| [pyannote-audio](pipelines/audio/pyannote-audio.yaml) · [upstream](<https://github.com/pyannote/pyannote-audio>) | toolkit / pretrained | speaker-diarization, speaker-verification, voice-activity-detection | — | — | pytorch, pytorch-checkpoint, onnx | desktop, server | MIT / unknown | unknown |
| [WeSpeaker](pipelines/audio/wespeaker.yaml) · [upstream](<https://github.com/wenet-e2e/wespeaker>) | toolkit / pretrained | speaker-verification, speaker-recognition, speaker-embedding | — | — | pytorch, onnxruntime, pytorch-checkpoint, onnx | desktop, server, edge | Apache-2.0 / unknown | unknown |
| [DTLN](catalog/audio/enhancement/dtln.yaml) · [upstream](<https://huggingface.co/breizhn/DTLN>) | collection / pretrained | speech-enhancement, noise-suppression, real-time-audio | — | — | tensorflow, onnxruntime, tflite, onnx, savedmodel | embedded, mobile, edge, desktop | MIT / unknown | unknown |
| [DeepFilterNet](pipelines/audio/deepfilternet.yaml) · [upstream](<https://github.com/Rikorose/DeepFilterNet>) | pipeline / pretrained | speech-enhancement, noise-suppression | — | — | pytorch, onnxruntime, onnx | edge, mobile, desktop | Apache-2.0 / Apache-2.0 | unknown |
| [Resemble Enhance](pipelines/audio/resemble-enhance.yaml) · [upstream](<https://huggingface.co/ResembleAI/resemble-enhance>) | collection / pretrained | speech-enhancement, speech-restoration | — | — | pytorch, onnxruntime, pytorch-checkpoint | desktop, server | MIT / unknown | unknown |
| [Distil-Whisper](catalog/audio/speech-to-text/distil-whisper.yaml) · [upstream](<https://huggingface.co/distil-whisper/distil-large-v3>) | collection / pretrained | speech-recognition, speech-to-text | — | — | transformers, ctranslate2, onnxruntime, safetensors | desktop, edge, server | MIT / MIT | unknown |
| [ESPnet](pipelines/audio/espnet.yaml) · [upstream](<https://github.com/espnet/espnet>) | toolkit / requires-training | speech-recognition, text-to-speech, speech-translation, speech-enhancement | — | — | pytorch, pytorch-checkpoint, onnx | desktop, server | Apache-2.0 / not-provided | unknown |
| [FunASR](pipelines/audio/funasr.yaml) · [upstream](<https://github.com/modelscope/FunASR>) | toolkit / pretrained | speech-recognition, voice-activity-detection, punctuation-restoration, speaker-diarization | — | — | pytorch, onnxruntime, onnx, pytorch-checkpoint | desktop, server, edge | MIT / not-provided | unknown |
| [NVIDIA NeMo](pipelines/audio/nvidia-nemo.yaml) · [upstream](<https://github.com/NVIDIA/NeMo>) | toolkit / requires-training | speech-recognition, text-to-speech, speech-enhancement, speaker-diarization | — | — | pytorch, pytorch-checkpoint, onnx | desktop, server, edge | Apache-2.0 / not-provided | unknown |
| [SpeechBrain](pipelines/audio/speechbrain.yaml) · [upstream](<https://github.com/speechbrain/speechbrain>) | toolkit / requires-training | speech-recognition, speaker-recognition, speech-enhancement, text-to-speech | — | — | pytorch, onnxruntime, pytorch-checkpoint, onnx | desktop, server, edge | Apache-2.0 / not-provided | unknown |
| [wav2vec 2.0](catalog/audio/speech/wav2vec2.yaml) · [upstream](<https://github.com/facebookresearch/fairseq>) | collection / pretrained | speech-recognition, speech-representations | — | — | pytorch, transformers, onnxruntime, pytorch-checkpoint, safetensors, onnx | desktop, server, edge | MIT / unknown | unknown |
| [VoiceFixer](pipelines/audio/voicefixer.yaml) · [upstream](<https://github.com/haoheliu/voicefixer>) | collection / pretrained | speech-restoration, speech-enhancement | — | — | pytorch, onnxruntime, pytorch-checkpoint | desktop, server, edge | MIT / unknown | unknown |
| [Asteroid](pipelines/audio/asteroid.yaml) · [upstream](<https://github.com/asteroid-team/asteroid>) | toolkit / companion | speech-separation, speech-enhancement | — | — | pytorch, onnxruntime, pytorch-checkpoint, onnx | desktop, server | MIT / not-provided | unknown |
| [Moonshine](catalog/audio/speech-to-text/moonshine.yaml) · [upstream](<https://github.com/moonshine-ai/moonshine>) | collection / pretrained | speech-to-text | — | — | moonshine-native, onnxruntime | edge, mobile, desktop, browser | MIT / MIT | unknown |
| [Vosk](pipelines/audio/vosk-api.yaml) · [upstream](<https://github.com/alphacep/vosk-api>) | toolkit / pretrained | speech-to-text | — | — | vosk-native, kaldi | mobile, edge, desktop, server | Apache-2.0 / Apache-2.0 | unknown |
| [WeNet](pipelines/audio/wenet.yaml) · [upstream](<https://github.com/wenet-e2e/wenet>) | toolkit / requires-training | speech-to-text, streaming-asr | — | — | pytorch, onnxruntime, onnx, pytorch-checkpoint | mobile, desktop, server | Apache-2.0 / not-provided | unknown |
| [Whisper](catalog/audio/speech-to-text/openai-whisper.yaml) · [upstream](<https://huggingface.co/openai/whisper-large-v3>) | collection / pretrained | speech-to-text, speech-translation | — | — | pytorch, whisper-cpp, onnxruntime, pytorch-checkpoint | desktop, server, edge | MIT / MIT | unknown |
| [Whistle](catalog/audio/speech-to-text/cactus-whistle.yaml) · [upstream](<https://huggingface.co/Cactus-Compute/whistle>) | model / unknown | speech-to-text | — | 16.9 MB | — | edge | unknown / Apache-2.0 | unknown |
| [faster-whisper](pipelines/audio/faster-whisper.yaml) · [upstream](<https://github.com/SYSTRAN/faster-whisper>) | toolkit / companion | speech-to-text, voice-activity-detection | — | — | ctranslate2, onnxruntime, pytorch-checkpoint | desktop, server, edge | MIT / MIT | unknown |
| [sherpa-onnx](pipelines/audio/sherpa-onnx.yaml) · [upstream](<https://github.com/k2-fsa/sherpa-onnx>) | toolkit / companion | speech-to-text, text-to-speech, keyword-spotting, speaker-diarization | — | — | sherpa-onnx-native, onnxruntime, onnx | mobile, edge, desktop, browser | Apache-2.0 / not-provided | unknown |
| [whisper.cpp](pipelines/audio/whisper-cpp.yaml) · [upstream](<https://github.com/ggml-org/whisper.cpp>) | toolkit / companion | speech-to-text, voice-activity-detection | — | — | ggml, whisper-cpp-native | mobile, edge, desktop, browser | MIT / MIT | raspberry-pi: reported |
| [Seamless Communication](catalog/audio/speech/seamless-communication.yaml) · [upstream](<https://github.com/facebookresearch/seamless_communication>) | collection / pretrained | speech-translation, speech-to-speech-translation, speech-to-text | — | — | pytorch, fairseq2, pytorch-checkpoint | server, desktop | CC-BY-NC-4.0 / unknown | unknown |
| [Bark](catalog/audio/text-to-speech/bark.yaml) · [upstream](<https://github.com/suno-ai/bark>) | collection / pretrained | text-to-speech, audio-generation | — | — | pytorch, pytorch-checkpoint | desktop, server | MIT / unknown | unknown |
| [CosyVoice](catalog/audio/text-to-speech/cosyvoice.yaml) · [upstream](<https://github.com/QwenAudio/CosyVoice>) | collection / pretrained | text-to-speech, voice-cloning, speech-synthesis | — | — | pytorch, pytorch-checkpoint | desktop, server | Apache-2.0 / unknown | unknown |
| [Kokoro-82M](catalog/audio/text-to-speech/kokoro-82m.yaml) · [upstream](<https://huggingface.co/hexgrad/Kokoro-82M>) | model / pretrained | text-to-speech | 82M | — | pytorch, onnxruntime | desktop, server, edge | Apache-2.0 / Apache-2.0 | unknown |
| [Piper](pipelines/audio/piper.yaml) · [upstream](<https://github.com/OHF-Voice/piper1-gpl>) | toolkit / companion | text-to-speech | — | — | piper-native, onnxruntime, python, onnx | edge, desktop, server | GPL-3.0 / unknown | unknown |
| [VITS](catalog/audio/text-to-speech/vits.yaml) · [upstream](<https://github.com/jaywalnut310/vits>) | collection / requires-training | text-to-speech, speech-synthesis | — | — | pytorch, onnxruntime, pytorch-checkpoint, onnx | desktop, server, edge | MIT / unknown | unknown |
| [HiFi-GAN](catalog/audio/text-to-speech/hifi-gan.yaml) · [upstream](<https://github.com/jik876/hifi-gan>) | collection / pretrained | vocoder, speech-synthesis, audio-generation | — | — | pytorch, onnxruntime, pytorch-checkpoint, onnx | embedded, mobile, edge, desktop, server | MIT / unknown | unknown |
| [Silero VAD](catalog/audio/vad/silero-vad.yaml) · [upstream](<https://github.com/snakers4/silero-vad/blob/1e261b036686cd0017d500ee96acd1c4ba572a9d/src/silero_vad/data/silero_vad.onnx>) | model / pretrained | voice-activity-detection | — | 2 MB | onnxruntime, pytorch, onnx, jit | edge | MIT / MIT | local-process-darwin-arm64-ddf7ff5ebd: reproduced |
| [RVC (Retrieval-based Voice Conversion)](pipelines/audio/rvc.yaml) · [upstream](<https://github.com/RVC-Project/Retrieval-based-Voice-Conversion-WebUI>) | pipeline / requires-training | voice-conversion, speech-synthesis | — | — | pytorch, pytorch-checkpoint | desktop, server | MIT / unknown | unknown |
| [ESP-SR](pipelines/audio/esp-sr.yaml) · [upstream](<https://github.com/espressif/esp-sr>) | toolkit / pretrained | wake-word-detection, speech-recognition, voice-activity-detection | — | — | esp-sr-native | edge | Apache-2.0 / unknown | esp32: reported |
| [microWakeWord](catalog/audio/wake-word/microwakeword.yaml) · [upstream](<https://github.com/OHF-Voice/micro-wake-word>) | model / unknown | wake-word-detection | — | — | tflite-micro, tflite | edge | Apache-2.0 / unknown | esp32: reported |
| [openWakeWord](catalog/audio/wake-word/openwakeword.yaml) · [upstream](<https://github.com/dscripka/openWakeWord>) | collection / pretrained | wake-word-detection | — | — | onnxruntime, tflite, onnx | edge, desktop, server | Apache-2.0 / Apache-2.0 | unknown |

<a id="catalogue-automotive"></a>

### Automotive

| Entry / source | Kind / use | Task | Params | Model file | Runtime / format | Target class | License C / W | Compatibility |
|---|---|---|---:|---:|---|---|---|---|
| [openpilot](pipelines/automotive/openpilot.yaml) · [upstream](<https://github.com/commaai/openpilot>) | pipeline / companion | driver-assistance, lane-keeping, adaptive-cruise-control, driver-monitoring | — | — | python, onnxruntime, onnx | edge | MIT / not-applicable | unknown |
| [DonkeyCar](pipelines/automotive/donkeycar.yaml) · [upstream](<https://github.com/autorope/donkeycar>) | pipeline / requires-training | self-driving-rc-car, imitation-learning, autonomous-driving | — | — | tensorflow, python | edge, desktop | MIT / not-applicable | unknown |

<a id="catalogue-benchmark"></a>

### Benchmark

| Entry / source | Kind / use | Task | Params | Model file | Runtime / format | Target class | License C / W | Compatibility |
|---|---|---|---:|---:|---|---|---|---|
| [MLPerf Tiny](pipelines/benchmark/mlperf-tiny.yaml) · [upstream](<https://github.com/mlcommons/tiny>) | collection / companion | tinyml-benchmarking, model-evaluation, keyword-spotting, visual-wake-words | — | — | tflite-micro, native-c, tflite | edge | Apache-2.0 / not-provided | unknown |

<a id="catalogue-business"></a>

### Business

| Entry / source | Kind / use | Task | Params | Model file | Runtime / format | Target class | License C / W | Compatibility |
|---|---|---|---:|---:|---|---|---|---|
| [AutoGluon](pipelines/business/tabular/autogluon.yaml) · [upstream](<https://github.com/autogluon/autogluon>) | toolkit / requires-training | automl, tabular-classification, tabular-regression, time-series-forecasting | — | — | python, pytorch, pytorch-checkpoint, onnx | desktop, server | Apache-2.0 / not-provided | unknown |
| [LightAutoML](pipelines/business/lightautoml.yaml) · [upstream](<https://github.com/sb-ai-lab/LightAutoML>) | toolkit / requires-training | automl, tabular-classification, tabular-regression | — | — | python, scikit-learn, pickle | desktop, server, edge | Apache-2.0 / not-provided | unknown |
| [PyCaret](pipelines/business/pycaret.yaml) · [upstream](<https://github.com/pycaret/pycaret>) | toolkit / requires-training | automl, tabular-classification, tabular-regression | — | — | scikit-learn, python, pickle | desktop, server, edge | FSL-1.1-MIT / not-provided | unknown |
| [OR-Tools](primitives/optimization/or-tools.yaml) · [upstream](<https://github.com/google/or-tools>) | primitive / companion | constraint-optimization, scheduling, routing, assignment | — | — | or-tools-native, python | desktop, server | Apache-2.0 / not-applicable | unknown |
| [CVXPY](pipelines/business/cvxpy.yaml) · [upstream](<https://github.com/cvxpy/cvxpy>) | toolkit / companion | convex-optimization, constrained-optimisation, scheduling | — | — | python, native-cpp, numpy-model | embedded, mobile, edge, desktop, server | Apache-2.0 / not-provided | unknown |
| [cvxpylayers](pipelines/business/cvxpylayers.yaml) · [upstream](<https://github.com/cvxpy/cvxpylayers>) | toolkit / companion | differentiable-optimisation, constrained-optimisation | — | — | pytorch, jax, numpy-model | desktop, server | Apache-2.0 / not-provided | unknown |
| [Vowpal Wabbit](pipelines/business/decision/vowpal-wabbit.yaml) · [upstream](<https://github.com/VowpalWabbit/vowpal_wabbit>) | toolkit / requires-training | online-learning, contextual-bandits, action-ranking | — | — | vowpal-wabbit-native, python | desktop, server | BSD-3-Clause / not-provided | unknown |
| [Splink](pipelines/business/records/splink.yaml) · [upstream](<https://github.com/moj-analytical-services/splink>) | toolkit / requires-training | probabilistic-record-linkage, deduplication | — | — | python, sql-backend | desktop, server | MIT / not-provided | unknown |
| [LightFM](pipelines/business/recommendation/lightfm.yaml) · [upstream](<https://github.com/lyst/lightfm>) | toolkit / requires-training | recommendation, personalised-ranking | — | — | python, lightfm | desktop, server | Apache-2.0 / not-provided | unknown |
| [CatBoost](pipelines/business/tabular/catboost.yaml) · [upstream](<https://github.com/catboost/catboost>) | toolkit / requires-training | tabular-classification, tabular-regression, ranking | — | — | catboost-native, python | desktop, server | Apache-2.0 / not-provided | unknown |
| [LightGBM](pipelines/business/tabular/lightgbm.yaml) · [upstream](<https://github.com/lightgbm-org/LightGBM>) | toolkit / requires-training | tabular-classification, tabular-regression, ranking | — | — | lightgbm-native, python | desktop, server | MIT / not-provided | unknown |
| [TabNet](pipelines/business/tabular/tabnet.yaml) · [upstream](<https://github.com/dreamquark-ai/tabnet>) | toolkit / requires-training | tabular-classification, tabular-regression | — | — | pytorch, pytorch-checkpoint | desktop, server, edge | MIT / not-provided | unknown |
| [TabPFN model family](catalog/business/tabular/tabpfn.yaml) · [upstream](<https://github.com/PriorLabs/TabPFN>) | collection / pretrained | tabular-classification, tabular-regression | — | — | pytorch, tabpfn | desktop, server | Apache-2.0 / version-dependent-restricted | unknown |
| [TensorFlow Decision Forests](pipelines/business/tabular/tensorflow-decision-forests.yaml) · [upstream](<https://github.com/tensorflow/decision-forests>) | toolkit / requires-training | tabular-classification, tabular-regression, ranking | — | — | tensorflow, tflite, savedmodel | embedded, edge, desktop, server | Apache-2.0 / not-provided | unknown |
| [XGBoost](pipelines/business/tabular/xgboost.yaml) · [upstream](<https://github.com/dmlc/xgboost>) | toolkit / requires-training | tabular-classification, tabular-regression, ranking | — | — | xgboost-native, python | desktop, server | Apache-2.0 / not-provided | unknown |
| [skrub](pipelines/business/tabular/skrub.yaml) · [upstream](<https://github.com/skrub-data/skrub>) | toolkit / requires-training | tabular-preprocessing, feature-engineering | — | — | scikit-learn, python, pickle | desktop, server | BSD-3-Clause / not-provided | unknown |

<a id="catalogue-climate"></a>

### Climate

| Entry / source | Kind / use | Task | Params | Model file | Runtime / format | Target class | License C / W | Compatibility |
|---|---|---|---:|---:|---|---|---|---|
| [ClimateLearn](pipelines/climate/climate-learn.yaml) · [upstream](<https://github.com/aditya-grover/climate-learn>) | toolkit / requires-training | climate-forecasting, downscaling, climate-model-evaluation | — | — | pytorch | server, desktop | MIT / not-provided | unknown |

<a id="catalogue-control"></a>

### Control

| Entry / source | Kind / use | Task | Params | Model file | Runtime / format | Target class | License C / W | Compatibility |
|---|---|---|---:|---:|---|---|---|---|
| [MH-FLOCKE](catalog/control/biomimetic/mhflocke.yaml) · [upstream](<https://github.com/MarcHesse/mhflocke>) | model / unknown | adaptive-locomotion | — | — | — | edge, robot | Apache-2.0 / unknown | unknown |
| [EMG Winter Soldier Arm](catalog/control/human-interface/emg-winter-soldier-arm.yaml) · [upstream](<https://github.com/SuryaUT/EMG-Winter-Soldier-Arm>) | model / unknown | emg-to-servo-control | — | — | — | edge, robot | MIT / unknown | unknown |
| [Quadruped CPG Controller](catalog/control/biomimetic/quadruped-cpg.yaml) · [upstream](<https://github.com/Tatonta/Quadruped-Robot>) | model / unknown | gait-generation | — | — | — | edge, robot | unknown / unknown | unknown |
| [MicroDuck locomotion policies](catalog/control/locomotion/microduck-locomotion.yaml) · [upstream](<https://github.com/jackyrx/NX_microduck>) | model / unknown | locomotion | — | — | — | edge, robot | Apache-2.0 / unknown | unknown |
| [TinyMPC](primitives/control/tinympc.yaml) · [upstream](<https://github.com/TinyMPC/tinympc>) | primitive / companion | model-predictive-control, embedded-optimization | — | — | native-cpp, python, c-source | edge, robot | MIT / not-applicable | unknown |
| [acados](primitives/control/acados.yaml) · [upstream](<https://github.com/acados/acados>) | primitive / companion | model-predictive-control, nonlinear-optimization | — | — | native-c, python, c-source | desktop, edge, robot | BSD-2-Clause / not-applicable | unknown |
| [ArduPilot Neural Mixer](catalog/control/motor/ardupilot-neural-mixer.yaml) · [upstream](<https://github.com/virtualrobotix/Ardupilot-Neural-Mixer>) | model / unknown | motor-servo-control | — | — | — | edge, robot | unknown / unknown | unknown |
| [CasADi](primitives/control/casadi.yaml) · [upstream](<https://github.com/casadi/casadi>) | primitive / companion | nonlinear-optimization, model-predictive-control, automatic-differentiation | — | — | python, native-cpp, c-source | desktop, server, edge | LGPL-3.0 / not-applicable | unknown |
| [OSQP](primitives/control/osqp.yaml) · [upstream](<https://github.com/osqp/osqp>) | primitive / companion | quadratic-programming, convex-optimization | — | — | native-c, c-source | desktop, server, edge | Apache-2.0 / not-applicable | unknown |
| [OpenDoge locomotion policy](catalog/control/locomotion/opendoge-locomotion.yaml) · [upstream](<https://github.com/OpenDogeRobotics/OpenDoge_origin>) | model / unknown | quadruped-locomotion | — | — | — | edge, robot | unknown / unknown | unknown |

<a id="catalogue-drug-discovery"></a>

### Drug discovery

| Entry / source | Kind / use | Task | Params | Model file | Runtime / format | Target class | License C / W | Compatibility |
|---|---|---|---:|---:|---|---|---|---|
| [DLEPS](pipelines/drug-discovery/dleps.yaml) · [upstream](<https://github.com/kekegg/DLEPS>) | pipeline / requires-training | drug-efficacy-prediction, drug-discovery | — | — | pytorch, pytorch-checkpoint | desktop, server | unknown / unknown | unknown |
| [MegaMolBART](catalog/drug-discovery/megamolbart.yaml) · [upstream](<https://github.com/NVIDIA/MegaMolBART>) | collection / pretrained | molecule-generation, molecular-representation, drug-discovery | — | — | pytorch, pytorch-checkpoint | server, desktop | unknown / unknown | unknown |

<a id="catalogue-education"></a>

### Education

| Entry / source | Kind / use | Task | Params | Model file | Runtime / format | Target class | License C / W | Compatibility |
|---|---|---|---:|---:|---|---|---|---|
| [pyKT](pipelines/education/pykt.yaml) · [upstream](<https://github.com/pykt-team/pykt-toolkit>) | toolkit / requires-training | knowledge-tracing, student-modelling | — | — | pytorch | server, desktop | MIT / not-provided | unknown |

<a id="catalogue-energy"></a>

### Energy

| Entry / source | Kind / use | Task | Params | Model file | Runtime / format | Target class | License C / W | Compatibility |
|---|---|---|---:|---:|---|---|---|---|
| [CityLearn](pipelines/energy/citylearn.yaml) · [upstream](<https://github.com/citylearn-project/CityLearn>) | toolkit / companion | building-energy-simulation, demand-response-policy-training | — | — | python, gymnasium | desktop, server | MIT / not-applicable | unknown |
| [pandapower](primitives/energy/pandapower.yaml) · [upstream](<https://github.com/e2nIEE/pandapower>) | primitive / companion | power-flow, power-system-analysis | — | — | python, numpy | desktop, server | BSD-3-Clause / not-applicable | unknown |
| [Grid2Op](pipelines/energy/grid2op.yaml) · [upstream](<https://github.com/Grid2op/grid2op>) | toolkit / companion | power-system-simulation, sequential-decision-evaluation | — | — | python | desktop, server | MPL-2.0 / not-applicable | unknown |

<a id="catalogue-engineering"></a>

### Engineering

| Entry / source | Kind / use | Task | Params | Model file | Runtime / format | Target class | License C / W | Compatibility |
|---|---|---|---:|---:|---|---|---|---|
| [Taiga-S1](catalog/engineering/cad/taiga-s1.yaml) · [upstream](<https://github.com/shhivv/taiga-s1>) | model / unknown | cad-action-selection | 1.2M | — | — | edge | MIT / unknown | unknown |
| [DeepCAD](catalog/engineering/cad/deepcad.yaml) · [upstream](<https://github.com/ChrisWu1997/DeepCAD>) | collection / pretrained | cad-generation, cad-autoencoding, parametric-shape-modelling | — | — | pytorch, pytorch-checkpoint | desktop, server | MIT / unknown | unknown |

<a id="catalogue-environment"></a>

### Environment

| Entry / source | Kind / use | Task | Params | Model file | Runtime / format | Target class | License C / W | Compatibility |
|---|---|---|---:|---:|---|---|---|---|
| [Pyro Vision](pipelines/environment/pyro-vision.yaml) · [upstream](<https://github.com/pyronear/pyro-vision>) | toolkit / pretrained | wildfire-detection, smoke-detection | — | — | pytorch, onnxruntime, onnx, pytorch-checkpoint | edge, desktop | Apache-2.0 / unknown | unknown |
| [Wildfire Detection (CV)](pipelines/environment/wildfire-detection.yaml) · [upstream](<https://github.com/AlimTleuliyev/wildfire-detection>) | pipeline / requires-training | wildfire-detection, smoke-detection | — | — | pytorch, pytorch-checkpoint | desktop, edge | MIT / unknown | unknown |

<a id="catalogue-event-vision"></a>

### Event vision

| Entry / source | Kind / use | Task | Params | Model file | Runtime / format | Target class | License C / W | Compatibility |
|---|---|---|---:|---:|---|---|---|---|
| [RVT (Recurrent Vision Transformer)](catalog/event-vision/rvt.yaml) · [upstream](<https://github.com/uzh-rpg/RVT>) | collection / pretrained | event-based-object-detection, low-latency-perception | — | — | pytorch, pytorch-checkpoint | desktop, edge | MIT / unknown | unknown |
| [OpenEB (Prophesee Metavision)](pipelines/event-vision/openeb.yaml) · [upstream](<https://github.com/prophesee-ai/openeb>) | toolkit / companion | event-camera-processing, event-based-vision | — | — | native-cpp, python | desktop, edge | unknown / not-applicable | unknown |
| [Tonic](pipelines/event-vision/tonic.yaml) · [upstream](<https://github.com/neuromorphs/tonic>) | toolkit / companion | event-datasets, event-transforms, event-based-vision | — | — | python | desktop | GPL-3.0 / not-applicable | unknown |
| [E2VID (event-to-video)](pipelines/event-vision/rpg-e2vid.yaml) · [upstream](<https://github.com/uzh-rpg/rpg_e2vid>) | pipeline / pretrained | event-to-video, image-reconstruction, low-latency-perception | — | — | pytorch, pytorch-checkpoint | desktop, edge | GPL-3.0 / unknown | unknown |

<a id="catalogue-fashion"></a>

### Fashion

| Entry / source | Kind / use | Task | Params | Model file | Runtime / format | Target class | License C / W | Compatibility |
|---|---|---|---:|---:|---|---|---|---|
| [MMFashion](pipelines/fashion/mmfashion.yaml) · [upstream](<https://github.com/open-mmlab/mmfashion>) | toolkit / pretrained | fashion-attribute-prediction, fashion-retrieval, fashion-landmark-detection | — | — | pytorch, pytorch-checkpoint, onnx | server, desktop, edge | Apache-2.0 / not-provided | unknown |
| [IDM-VTON](catalog/fashion/idm-vton.yaml) · [upstream](<https://github.com/yisol/IDM-VTON>) | collection / pretrained | virtual-try-on, image-generation | — | — | pytorch, pytorch-checkpoint, safetensors | server, desktop | CC-BY-NC-SA-4.0 / unknown | unknown |
| [OOTDiffusion](catalog/fashion/ootdiffusion.yaml) · [upstream](<https://github.com/levihsu/OOTDiffusion>) | collection / pretrained | virtual-try-on, image-generation | — | — | pytorch, pytorch-checkpoint, safetensors | server, desktop | CC-BY-NC-SA-4.0 / unknown | unknown |

<a id="catalogue-federated-learning"></a>

### Federated learning

| Entry / source | Kind / use | Task | Params | Model file | Runtime / format | Target class | License C / W | Compatibility |
|---|---|---|---:|---:|---|---|---|---|
| [FATE](pipelines/federated-learning/fate.yaml) · [upstream](<https://github.com/FederatedAI/FATE>) | toolkit / companion | federated-learning, privacy-preserving-training, secure-multi-party-computation | — | — | python | server | Apache-2.0 / not-provided | unknown |
| [FedML](pipelines/federated-learning/fedml.yaml) · [upstream](<https://github.com/FedML-AI/FedML>) | toolkit / companion | federated-learning, distributed-training, privacy-preserving-training | — | — | pytorch | server, desktop, edge, mobile | Apache-2.0 / not-provided | unknown |
| [Flower](pipelines/federated-learning/flower.yaml) · [upstream](<https://github.com/flwrlabs/flower>) | toolkit / companion | federated-learning, privacy-preserving-training | — | — | python | server, desktop, edge, mobile | Apache-2.0 / not-provided | unknown |
| [NVIDIA FLARE](pipelines/federated-learning/nvflare.yaml) · [upstream](<https://github.com/NVIDIA/NVFlare>) | toolkit / requires-training | federated-learning, privacy-preserving-ml, distributed-training | — | — | pytorch, tensorflow, pytorch-checkpoint, savedmodel | server, edge, desktop | Apache-2.0 / not-provided | unknown |
| [OpenFL](pipelines/federated-learning/openfl.yaml) · [upstream](<https://github.com/securefederatedai/openfederatedlearning>) | toolkit / companion | federated-learning, privacy-preserving-training | — | — | python, pytorch, tensorflow | server, desktop | Apache-2.0 / not-provided | unknown |
| [TensorFlow Federated](pipelines/federated-learning/tensorflow-federated.yaml) · [upstream](<https://github.com/google-parfait/tensorflow-federated>) | toolkit / requires-training | federated-learning, distributed-training | — | — | tensorflow, savedmodel | server, desktop, mobile | Apache-2.0 / not-provided | unknown |
| [PySyft](pipelines/federated-learning/pysyft.yaml) · [upstream](<https://github.com/OpenMined/PySyft>) | toolkit / companion | privacy-preserving-computation, secure-multi-party-computation, federated-learning | — | — | python, pytorch | server, desktop | Apache-2.0 / not-provided | unknown |

<a id="catalogue-finance"></a>

### Finance

| Entry / source | Kind / use | Task | Params | Model file | Runtime / format | Target class | License C / W | Compatibility |
|---|---|---|---:|---:|---|---|---|---|
| [FinBERT (ProsusAI)](catalog/finance/sentiment/finbert-prosus.yaml) · [upstream](<https://huggingface.co/ProsusAI/finbert>) | model / pretrained | financial-sentiment-classification | — | — | transformers, pytorch, pytorch-checkpoint | desktop, server | Apache-2.0 / unknown | unknown |
| [Kronos-mini](catalog/finance/forecasting/kronos-mini.yaml) · [upstream](<https://huggingface.co/NeoQuasar/Kronos-mini>) | model / pretrained | financial-time-series-forecasting | 4.1M | — | pytorch, safetensors | desktop, server | MIT / MIT | unknown |
| [Kronos-small](catalog/finance/forecasting/kronos-small.yaml) · [upstream](<https://huggingface.co/NeoQuasar/Kronos-small>) | model / pretrained | financial-time-series-forecasting | 24.7M | — | pytorch, safetensors | desktop, server | MIT / MIT | unknown |
| [hmmlearn](pipelines/finance/hmmlearn.yaml) · [upstream](<https://github.com/hmmlearn/hmmlearn>) | toolkit / requires-training | hidden-state-estimation, sequence-modelling | — | — | python, numpy | desktop, server | BSD-3-Clause / not-provided | unknown |
| [Qlib](pipelines/finance/qlib.yaml) · [upstream](<https://github.com/microsoft/qlib>) | toolkit / companion | quantitative-research, model-evaluation, backtesting | — | — | python | desktop, server | MIT / configuration-dependent | unknown |
| [FinRL](pipelines/finance/finrl.yaml) · [upstream](<https://github.com/AI4Finance-Foundation/FinRL>) | toolkit / requires-training | reinforcement-learning, portfolio-allocation, trading | — | — | python, pytorch, pytorch-checkpoint | desktop, server | MIT / not-provided | unknown |

<a id="catalogue-forestry"></a>

### Forestry

| Entry / source | Kind / use | Task | Params | Model file | Runtime / format | Target class | License C / W | Compatibility |
|---|---|---|---:|---:|---|---|---|---|
| [FSDL Deforestation Detection](pipelines/forestry/fsdl-deforestation.yaml) · [upstream](<https://github.com/karthikraja95/fsdl_deforestation_detection>) | pipeline / requires-training | deforestation-detection, satellite-image-segmentation | — | — | pytorch, pytorch-checkpoint | desktop, server | MIT / not-provided | unknown |
| [Illegal Logging Detection with Drones](pipelines/forestry/illegal-logging-drones.yaml) · [upstream](<https://github.com/Beckybams/Illegal-Logging-Detection-with-Drones>) | pipeline / requires-training | deforestation-detection, aerial-image-classification | — | — | python | edge, desktop | unknown / not-provided | unknown |

<a id="catalogue-fraud-detection"></a>

### Fraud detection

| Entry / source | Kind / use | Task | Params | Model file | Runtime / format | Target class | License C / W | Compatibility |
|---|---|---|---:|---:|---|---|---|---|
| [Fraud Detection Handbook](pipelines/fraud-detection/fraud-detection-handbook.yaml) · [upstream](<https://github.com/Fraud-Detection-Handbook/fraud-detection-handbook>) | pipeline / requires-training | credit-card-fraud-detection, anomaly-detection | — | — | python, scikit-learn | server, desktop | GPL-3.0 / not-provided | unknown |
| [FraudShield](pipelines/fraud-detection/fraudshield.yaml) · [upstream](<https://github.com/shxu7788/FraudShield>) | pipeline / requires-training | credit-card-fraud-detection, anomaly-detection | — | — | python, scikit-learn | server, desktop | Apache-2.0 / not-provided | unknown |

<a id="catalogue-gaming"></a>

### Gaming

| Entry / source | Kind / use | Task | Params | Model file | Runtime / format | Target class | License C / W | Compatibility |
|---|---|---|---:|---:|---|---|---|---|
| [Leela Chess Zero](pipelines/gaming/lc0.yaml) · [upstream](<https://github.com/LeelaChessZero/lc0>) | pipeline / pretrained | chess-engine, monte-carlo-tree-search | — | — | onnxruntime, native-cpp, onnx | desktop, server | GPL-3.0 / unknown | unknown |
| [Maia-3](catalog/gaming/maia3.yaml) · [upstream](<https://huggingface.co/collections/UofTCSSLab/maia3>) | model / pretrained | chess-move-prediction, human-like-policy-modelling | — | — | pytorch, pytorch-checkpoint | desktop, server | AGPL-3.0 / unknown | unknown |
| [mctx](primitives/gaming/mctx.yaml) · [upstream](<https://github.com/google-deepmind/mctx>) | primitive / companion | monte-carlo-tree-search, planning, game-search | — | — | jax | desktop, server | Apache-2.0 / not-applicable | unknown |
| [PettingZoo](primitives/gaming/pettingzoo.yaml) · [upstream](<https://github.com/Farama-Foundation/PettingZoo>) | primitive / companion | multi-agent-environments, reinforcement-learning, environment-api | — | — | python | desktop, server, edge | MIT / not-applicable | unknown |
| [Melting Pot](pipelines/gaming/meltingpot.yaml) · [upstream](<https://github.com/google-deepmind/meltingpot>) | pipeline / companion | multi-agent-reinforcement-learning, social-simulation | — | — | python | desktop, server | Apache-2.0 / not-applicable | unknown |
| [CleanRL](pipelines/gaming/cleanrl.yaml) · [upstream](<https://github.com/vwxyzjn/cleanrl>) | toolkit / requires-training | reinforcement-learning, policy-training | — | — | pytorch, onnx | desktop, server | MIT / not-provided | unknown |
| [Dopamine](pipelines/gaming/dopamine.yaml) · [upstream](<https://github.com/google/dopamine>) | toolkit / requires-training | reinforcement-learning, atari-agents, policy-training | — | — | jax, tensorflow | desktop, server | Apache-2.0 / not-provided | unknown |
| [Godot RL Agents](pipelines/gaming/godot-rl-agents.yaml) · [upstream](<https://github.com/edbeeching/godot_rl_agents>) | toolkit / requires-training | reinforcement-learning, game-agent-training, npc-behaviour | — | — | pytorch, onnxruntime, onnx | desktop | MIT / not-provided | unknown |
| [Gymnasium](primitives/gaming/gymnasium.yaml) · [upstream](<https://github.com/Farama-Foundation/Gymnasium>) | primitive / companion | reinforcement-learning, environment-api, simulation-interface | — | — | python | desktop, server, edge | MIT / not-applicable | unknown |
| [PufferLib](pipelines/gaming/pufferlib.yaml) · [upstream](<https://github.com/PufferAI/PufferLib>) | toolkit / requires-training | reinforcement-learning, environment-vectorization, policy-training | — | — | pytorch | desktop, server | MIT / not-provided | unknown |
| [Sample Factory](pipelines/gaming/sample-factory.yaml) · [upstream](<https://github.com/alex-petrenko/sample-factory>) | toolkit / requires-training | reinforcement-learning, high-throughput-policy-training | — | — | pytorch, onnx | desktop, server | MIT / not-provided | unknown |
| [Stable-Baselines3](pipelines/gaming/stable-baselines3.yaml) · [upstream](<https://github.com/DLR-RM/stable-baselines3>) | toolkit / requires-training | reinforcement-learning, policy-training, game-agent-training | — | — | pytorch, onnxruntime, onnx | desktop, server | MIT / not-provided | unknown |
| [Unity ML-Agents](pipelines/gaming/ml-agents.yaml) · [upstream](<https://github.com/Unity-Technologies/ml-agents>) | toolkit / requires-training | reinforcement-learning, imitation-learning, game-agent-training | — | — | pytorch, onnxruntime, onnx | desktop, mobile | Apache-2.0 / not-provided | unknown |
| [Stable Retro](pipelines/gaming/stable-retro.yaml) · [upstream](<https://github.com/Farama-Foundation/stable-retro>) | toolkit / companion | retro-game-reinforcement-learning, environment-emulation | — | — | python | desktop | MIT / not-applicable | unknown |

<a id="catalogue-genomics"></a>

### Genomics

| Entry / source | Kind / use | Task | Params | Model file | Runtime / format | Target class | License C / W | Compatibility |
|---|---|---|---:|---:|---|---|---|---|
| [DeepVariant](pipelines/genomics/deepvariant.yaml) · [upstream](<https://github.com/google/deepvariant>) | pipeline / pretrained | genetic-variant-calling, genome-sequencing-analysis | — | — | tensorflow | server, desktop | BSD-3-Clause / unknown | unknown |
| [Nucleotide Transformer](catalog/genomics/nucleotide-transformer.yaml) · [upstream](<https://github.com/instadeepai/nucleotide-transformer>) | collection / pretrained | genomic-language-modelling, dna-embeddings, regulatory-element-prediction | — | — | pytorch, transformers, pytorch-checkpoint, safetensors | server, desktop | CC-BY-NC-SA-4.0 / unknown | unknown |
| [AlphaGenome](catalog/genomics/alphagenome.yaml) · [upstream](<https://github.com/google-deepmind/alphagenome>) | collection / pretrained | regulatory-genomics, variant-effect-prediction, gene-expression-prediction | — | — | jax | server | Apache-2.0 / unknown | unknown |
| [scGPT](catalog/genomics/scgpt.yaml) · [upstream](<https://github.com/bowang-lab/scGPT>) | collection / pretrained | single-cell-embeddings, cell-type-annotation, gene-expression-integration | — | — | pytorch, pytorch-checkpoint | desktop, server | MIT / unknown | unknown |

<a id="catalogue-geospatial"></a>

### Geospatial

| Entry / source | Kind / use | Task | Params | Model file | Runtime / format | Target class | License C / W | Compatibility |
|---|---|---|---:|---:|---|---|---|---|
| [MegaDetector-Overhead](catalog/geospatial/earth-observation/megadetector-overhead.yaml) · [upstream](<https://github.com/microsoft/MegaDetector-Overhead>) | collection / pretrained | aerial-wildlife-detection, overhead-detection | — | — | pytorch, pytorch-checkpoint | desktop, server, edge | MIT / unknown | unknown |
| [Clay](catalog/geospatial/earth-observation/clay.yaml) · [upstream](<https://github.com/Clay-foundation/model>) | collection / pretrained | earth-observation-embedding, geospatial-feature-extraction | — | — | pytorch, pytorch-checkpoint | desktop, server | Apache-2.0 / Apache-2.0 | unknown |
| [OlmoEarth v1 Nano](catalog/geospatial/earth-observation/olmoearth-v1-nano.yaml) · [upstream](<https://huggingface.co/allenai/OlmoEarth-v1-Nano>) | model / unknown | earth-observation-embedding | 1.4M | — | pytorch | edge | Apache-2.0 / Apache-2.0 | unknown |
| [OlmoEarth v1 Tiny](catalog/geospatial/earth-observation/olmoearth-v1-tiny.yaml) · [upstream](<https://huggingface.co/allenai/OlmoEarth-v1-Tiny>) | model / unknown | earth-observation-embedding | 6.2M | — | pytorch | edge | Apache-2.0 / Apache-2.0 | unknown |
| [Prithvi-EO-2.0](catalog/geospatial/earth-observation/prithvi-eo-2.yaml) · [upstream](<https://huggingface.co/ibm-nasa-geospatial/Prithvi-EO-2.0-300M>) | collection / pretrained | earth-observation-embedding, flood-mapping, crop-classification, burn-scar-segmentation | — | — | pytorch, terratorch, pytorch-checkpoint | desktop, server | Apache-2.0 / Apache-2.0 | unknown |
| [TerraTorch](pipelines/geospatial/terratorch.yaml) · [upstream](<https://github.com/IBM/terratorch>) | toolkit / requires-training | earth-observation-fine-tuning, earth-observation-segmentation, earth-observation-classification | — | — | pytorch, lightning, pytorch-checkpoint, onnx | desktop, server | Apache-2.0 / not-provided | unknown |
| [eo-learn](pipelines/geospatial/eo-learn.yaml) · [upstream](<https://github.com/sentinel-hub/eo-learn>) | toolkit / companion | earth-observation-processing, geospatial-feature-extraction | — | — | python, numpy | desktop, server | MIT / not-applicable | unknown |
| [TorchGeo](pipelines/geospatial/torchgeo.yaml) · [upstream](<https://github.com/microsoft/torchgeo>) | toolkit / companion | geospatial-dataset-management, earth-observation-segmentation, earth-observation-classification | — | — | pytorch, pytorch-checkpoint, onnx | desktop, server | MIT / not-provided | unknown |
| [Raster Vision](pipelines/geospatial/raster-vision.yaml) · [upstream](<https://github.com/azavea/raster-vision>) | toolkit / requires-training | geospatial-object-detection, geospatial-semantic-segmentation, geospatial-classification | — | — | pytorch, pytorch-checkpoint, onnx | desktop, server, edge | Apache-2.0 / not-provided | unknown |
| [segment-geospatial](pipelines/geospatial/segment-geospatial.yaml) · [upstream](<https://github.com/opengeos/segment-geospatial>) | toolkit / pretrained | geospatial-segmentation, interactive-segmentation | — | — | pytorch, onnxruntime, pytorch-checkpoint | desktop, server | MIT / not-provided | unknown |

<a id="catalogue-graph"></a>

### Graph

| Entry / source | Kind / use | Task | Params | Model file | Runtime / format | Target class | License C / W | Compatibility |
|---|---|---|---:|---:|---|---|---|---|
| [Deep Graph Library (DGL)](pipelines/graph/dgl.yaml) · [upstream](<https://github.com/dmlc/dgl>) | toolkit / requires-training | graph-neural-networks, node-classification, link-prediction | — | — | pytorch, mxnet, pytorch-checkpoint | desktop, server | Apache-2.0 / not-provided | unknown |
| [PyTorch Geometric](pipelines/graph/pytorch-geometric.yaml) · [upstream](<https://github.com/pyg-team/pytorch_geometric>) | toolkit / requires-training | graph-neural-networks, node-classification, link-prediction | — | — | pytorch, pytorch-checkpoint | desktop, server | MIT / not-provided | unknown |

<a id="catalogue-healthcare"></a>

### Healthcare

| Entry / source | Kind / use | Task | Params | Model file | Runtime / format | Target class | License C / W | Compatibility |
|---|---|---|---:|---:|---|---|---|---|
| [BrainFlow](pipelines/healthcare/brainflow.yaml) · [upstream](<https://github.com/brainflow-dev/brainflow>) | toolkit / companion | biosignal-acquisition, signal-processing, bci | — | — | native-cpp, python | mobile, edge, desktop | MIT / not-applicable | unknown |
| [TorchXRayVision](catalog/healthcare/imaging/torchxrayvision.yaml) · [upstream](<https://github.com/mlmed/torchxrayvision>) | collection / pretrained | chest-xray-classification, medical-image-representation | — | — | pytorch, pytorch-checkpoint | server, desktop | Apache-2.0 / unknown | unknown |
| [MNE-Python](pipelines/healthcare/mne-python.yaml) · [upstream](<https://github.com/mne-tools/mne-python>) | toolkit / companion | eeg-analysis, meg-analysis, neurophysiology-processing | — | — | python, numpy | desktop, server | BSD-3-Clause / not-applicable | unknown |
| [MONAI](pipelines/healthcare/monai.yaml) · [upstream](<https://github.com/Project-MONAI/MONAI>) | toolkit / requires-training | medical-image-segmentation, medical-image-classification, medical-image-registration | — | — | pytorch, onnxruntime, pytorch-checkpoint, onnx | server, desktop, edge | Apache-2.0 / not-provided | unknown |
| [nnU-Net](pipelines/healthcare/nnunet.yaml) · [upstream](<https://github.com/MIC-DKFZ/nnUNet>) | toolkit / requires-training | medical-image-segmentation | — | — | pytorch, pytorch-checkpoint, onnx | server, desktop | Apache-2.0 / not-provided | unknown |
| [NeuroKit2](pipelines/healthcare/neurokit2.yaml) · [upstream](<https://github.com/neuropsychology/NeuroKit>) | toolkit / companion | physiological-signal-processing, ecg-analysis, eda-analysis, signal-quality-assessment | — | — | python, numpy | desktop, server, edge | MIT / not-applicable | unknown |

<a id="catalogue-hydrology"></a>

### Hydrology

| Entry / source | Kind / use | Task | Params | Model file | Runtime / format | Target class | License C / W | Compatibility |
|---|---|---|---:|---:|---|---|---|---|
| [HydroDHM](catalog/hydrology/hydrodhm.yaml) · [upstream](<https://github.com/OuyangWenyu/HydroDHM>) | model / requires-training | streamflow-prediction, rainfall-runoff-modelling | — | — | pytorch | desktop, server | MIT / not-provided | unknown |
| [Streamflow Predictions](pipelines/hydrology/streamflow-predictions.yaml) · [upstream](<https://github.com/willstauffer/streamflow_predictions>) | pipeline / requires-training | streamflow-prediction, time-series-forecasting | — | — | python, scikit-learn | desktop | unknown / not-provided | unknown |

<a id="catalogue-infrastructure"></a>

### Infrastructure

| Entry / source | Kind / use | Task | Params | Model file | Runtime / format | Target class | License C / W | Compatibility |
|---|---|---|---:|---:|---|---|---|---|
| [PyOD](pipelines/infrastructure/pyod.yaml) · [upstream](<https://github.com/yzhao062/pyod>) | toolkit / requires-training | anomaly-detection, outlier-detection | — | — | python, scikit-learn, pytorch | desktop, server, edge | BSD-2-Clause / not-provided | unknown |
| [Merlion](pipelines/infrastructure/merlion.yaml) · [upstream](<https://github.com/salesforce/Merlion>) | toolkit / requires-training | forecasting, anomaly-detection, change-point-detection | — | — | python | desktop, server | BSD-3-Clause / configuration-dependent | unknown |
| [Loglizer](pipelines/infrastructure/loglizer.yaml) · [upstream](<https://github.com/logpai/loglizer>) | toolkit / requires-training | log-anomaly-detection | — | — | python | desktop, server | MIT / configuration-dependent | unknown |
| [Drain3](pipelines/infrastructure/drain3.yaml) · [upstream](<https://github.com/logpai/Drain3>) | toolkit / companion | log-template-mining, log-structuring | — | — | python | desktop, server | MIT / not-applicable | unknown |
| [Kitsune network anomaly pipeline](pipelines/infrastructure/kitsune.yaml) · [upstream](<https://github.com/ymirsky/Kitsune-py>) | pipeline / companion | network-feature-extraction, network-anomaly-detection | — | — | python, numpy, tshark-or-scapy | desktop, server | MIT / not-provided | unknown |
| [River](pipelines/infrastructure/river.yaml) · [upstream](<https://github.com/online-ml/river>) | toolkit / requires-training | online-learning, anomaly-detection, drift-detection | — | — | python, pickle | embedded, edge, desktop, server | BSD-3-Clause / not-provided | unknown |
| [PyRCA](pipelines/infrastructure/pyrca.yaml) · [upstream](<https://github.com/salesforce/PyRCA>) | toolkit / requires-training | root-cause-ranking, metric-graph-analysis | — | — | python | desktop, server | BSD-3-Clause / configuration-dependent | unknown |
| [KitNET](catalog/infrastructure/anomaly/kitnet.yaml) · [upstream](<https://github.com/ymirsky/KitNET-py>) | model / requires-training | streaming-anomaly-detection | — | — | python, numpy | desktop, edge | MIT / not-provided | unknown |
| [River HalfSpaceTrees](catalog/infrastructure/anomaly/river-half-space-trees.yaml) · [upstream](<https://github.com/online-ml/river>) | model / requires-training | streaming-anomaly-detection | — | — | python, river | desktop, edge | BSD-3-Clause / not-provided | unknown |

<a id="catalogue-language"></a>

### Language

| Entry / source | Kind / use | Task | Params | Model file | Runtime / format | Target class | License C / W | Compatibility |
|---|---|---|---:|---:|---|---|---|---|
| [FastEmbed](pipelines/language/fastembed.yaml) · [upstream](<https://github.com/qdrant/fastembed>) | toolkit / pretrained | embeddings, semantic-search | — | — | onnxruntime, onnx | desktop, server, edge | Apache-2.0 / not-provided | unknown |
| [FlagEmbedding (BGE)](pipelines/language/flagembedding.yaml) · [upstream](<https://huggingface.co/BAAI/bge-small-en-v1.5>) | toolkit / pretrained | embeddings, semantic-search, reranking, retrieval | — | — | pytorch, onnxruntime, safetensors, onnx | desktop, server, edge | MIT / MIT | unknown |
| [Sentence Transformers](pipelines/language/sentence-transformers.yaml) · [upstream](<https://github.com/UKPLab/sentence-transformers>) | toolkit / pretrained | embeddings, semantic-search, text-classification, sentence-similarity | — | — | pytorch, onnxruntime, transformers, safetensors, onnx, pytorch-checkpoint | mobile, edge, desktop, server | Apache-2.0 / not-provided | unknown |
| [all-MiniLM-L6-v2](catalog/language/embeddings/all-minilm-l6-v2.yaml) · [upstream](<https://huggingface.co/sentence-transformers/all-MiniLM-L6-v2>) | model / pretrained | embeddings, semantic-search | 22.7M | — | sentence-transformers, onnxruntime, safetensors, onnx | edge | Apache-2.0 / Apache-2.0 | unknown |
| [fastText lid.176](catalog/language/classification/fasttext-lid176.yaml) · [upstream](<https://dl.fbaipublicfiles.com/fasttext/supervised-models/lid.176.ftz>) | model / pretrained | language-identification | — | 917 kB | fasttext-cpp, python, fasttext-ftz | edge | MIT / CC-BY-SA-3.0 | unknown |
| [KenLM](pipelines/language/kenlm.yaml) · [upstream](<https://github.com/kpu/kenlm>) | primitive / requires-training | language-modelling, text-scoring | — | — | native-cpp, python, arpa, binary-lm | embedded, mobile, edge, desktop, server | LGPL-2.1 / not-provided | unknown |
| [NLLB](catalog/language/translation/nllb.yaml) · [upstream](<https://huggingface.co/facebook/nllb-200-distilled-600M>) | collection / pretrained | machine-translation, multilingual-translation | — | — | transformers, ctranslate2, onnxruntime, safetensors | desktop, server | MIT / CC-BY-NC-4.0 | unknown |
| [OPUS-MT / Marian](catalog/language/translation/opus-mt.yaml) · [upstream](<https://huggingface.co/Helsinki-NLP/opus-mt-en-de>) | collection / pretrained | machine-translation | — | — | marian, ctranslate2, transformers, safetensors | embedded, edge, desktop, server | MIT / unknown | unknown |
| [GPT4All](pipelines/language/gpt4all.yaml) · [upstream](<https://github.com/nomic-ai/gpt4all>) | toolkit / companion | on-device-llm, text-generation, local-chat | — | — | llama-cpp-native, gguf | desktop | MIT / not-provided | unknown |
| [BERT](catalog/language/encoder/bert.yaml) · [upstream](<https://huggingface.co/google-bert/bert-base-uncased>) | collection / pretrained | text-classification, named-entity-recognition, embeddings | — | — | transformers, onnxruntime, tflite, safetensors, onnx | embedded, mobile, edge, desktop, server | Apache-2.0 / Apache-2.0 | unknown |
| [DistilBERT](catalog/language/encoder/distilbert.yaml) · [upstream](<https://huggingface.co/distilbert/distilbert-base-uncased>) | collection / pretrained | text-classification, named-entity-recognition, embeddings | — | — | transformers, onnxruntime, tflite, safetensors, onnx | embedded, mobile, edge, desktop, server | Apache-2.0 / Apache-2.0 | unknown |
| [RoBERTa](catalog/language/encoder/roberta.yaml) · [upstream](<https://huggingface.co/FacebookAI/roberta-base>) | collection / pretrained | text-classification, named-entity-recognition, question-answering | — | — | transformers, onnxruntime, safetensors, onnx | edge, desktop, server | MIT / MIT | unknown |
| [XLM-RoBERTa](catalog/language/encoder/xlm-roberta.yaml) · [upstream](<https://huggingface.co/FacebookAI/xlm-roberta-base>) | collection / pretrained | text-classification, named-entity-recognition, cross-lingual-transfer | — | — | transformers, onnxruntime, safetensors, onnx | edge, desktop, server | MIT / MIT | unknown |
| [BGE-M3](catalog/language/embeddings/bge-m3.yaml) · [upstream](<https://huggingface.co/BAAI/bge-m3>) | collection / pretrained | text-embeddings, semantic-search, retrieval, reranking | — | — | transformers, onnxruntime, flagembedding, safetensors, onnx | desktop, server, edge | MIT / MIT | unknown |
| [E5](catalog/language/embeddings/e5.yaml) · [upstream](<https://huggingface.co/intfloat/e5-large-v2>) | collection / pretrained | text-embeddings, semantic-search, retrieval | — | — | transformers, onnxruntime, sentence-transformers, safetensors, onnx | desktop, edge, server | MIT / MIT | unknown |
| [EmbeddingGemma](catalog/language/embeddings/embeddinggemma.yaml) · [upstream](<https://huggingface.co/google/embeddinggemma-300m>) | collection / pretrained | text-embeddings, semantic-search, retrieval | — | — | transformers, onnxruntime, mediapipe, safetensors, onnx | mobile, edge, desktop | unknown / Gemma-Terms | unknown |
| [GTE](catalog/language/embeddings/gte.yaml) · [upstream](<https://huggingface.co/Alibaba-NLP/gte-multilingual-base>) | collection / pretrained | text-embeddings, semantic-search, retrieval | — | — | transformers, onnxruntime, sentence-transformers, safetensors, onnx | desktop, edge, mobile, server | Apache-2.0 / Apache-2.0 | unknown |
| [Jina Embeddings](catalog/language/embeddings/jina-embeddings.yaml) · [upstream](<https://huggingface.co/jinaai/jina-embeddings-v3>) | collection / pretrained | text-embeddings, semantic-search, retrieval | — | — | transformers, onnxruntime, sentence-transformers, safetensors, onnx | desktop, server, edge | unknown / CC-BY-NC-4.0 | unknown |
| [Nomic Embed](catalog/language/embeddings/nomic-embed.yaml) · [upstream](<https://huggingface.co/nomic-ai/nomic-embed-text-v1.5>) | collection / pretrained | text-embeddings, semantic-search, retrieval | — | — | transformers, onnxruntime, fastembed, safetensors, onnx, gguf | desktop, edge, server | Apache-2.0 / Apache-2.0 | unknown |
| [Snowflake Arctic Embed](catalog/language/embeddings/snowflake-arctic-embed.yaml) · [upstream](<https://huggingface.co/Snowflake/snowflake-arctic-embed-l-v2.0>) | collection / pretrained | text-embeddings, semantic-search, retrieval | — | — | transformers, onnxruntime, sentence-transformers, safetensors, onnx | desktop, server, edge | Apache-2.0 / Apache-2.0 | unknown |
| [BitNet (1.58-bit)](catalog/language/on-device/bitnet.yaml) · [upstream](<https://huggingface.co/microsoft/BitNet-b1.58-2B-4T>) | collection / pretrained | text-generation, on-device-llm, quantisation | — | — | bitnet.cpp, llama-cpp, gguf | embedded, mobile, edge, desktop, server | MIT / MIT | unknown |
| [GPT-2](catalog/language/on-device/gpt-2.yaml) · [upstream](<https://huggingface.co/openai-community/gpt2>) | collection / pretrained | text-generation | — | — | transformers, onnxruntime, llama-cpp, safetensors, onnx, gguf | embedded, edge, desktop | MIT / MIT | unknown |
| [Gemma](catalog/language/on-device/gemma.yaml) · [upstream](<https://huggingface.co/google/gemma-2-2b-it>) | collection / pretrained | text-generation, on-device-llm | — | — | transformers, llama-cpp, mediapipe, safetensors, gguf | mobile, edge, desktop | Apache-2.0 / Gemma-Terms | unknown |
| [IBM Granite](catalog/language/on-device/granite.yaml) · [upstream](<https://huggingface.co/ibm-granite/granite-3.0-2b-instruct>) | collection / pretrained | text-generation, on-device-llm | — | — | transformers, llama-cpp, vllm, safetensors, gguf | desktop, edge, server | Apache-2.0 / Apache-2.0 | unknown |
| [Llama 3.2](catalog/language/on-device/llama-3-2.yaml) · [upstream](<https://huggingface.co/meta-llama/Llama-3.2-1B-Instruct>) | collection / pretrained | text-generation, on-device-llm | — | — | transformers, llama-cpp, executorch, safetensors, gguf | mobile, edge, desktop, server | Llama-3.2-Community-License / Llama-3.2-Community-License | unknown |
| [Mamba](catalog/language/on-device/mamba.yaml) · [upstream](<https://huggingface.co/state-spaces/mamba-130m-hf>) | collection / pretrained | text-generation, sequence-modelling | — | — | pytorch, transformers, safetensors | embedded, edge, desktop, server | Apache-2.0 / Apache-2.0 | unknown |
| [MiniCPM](catalog/language/on-device/minicpm.yaml) · [upstream](<https://huggingface.co/openbmb/MiniCPM-1B-sft-bf16>) | collection / pretrained | text-generation, on-device-llm | — | — | transformers, llama-cpp, safetensors, gguf | mobile, edge, desktop | Apache-2.0 / Apache-2.0 | unknown |
| [Mistral (7B / Small)](catalog/language/on-device/mistral.yaml) · [upstream](<https://huggingface.co/mistralai/Mistral-7B-Instruct-v0.3>) | collection / pretrained | text-generation, on-device-llm | — | — | transformers, llama-cpp, vllm, safetensors, gguf | desktop, server, edge | Apache-2.0 / Apache-2.0 | unknown |
| [MobileLLM](catalog/language/on-device/mobilellm.yaml) · [upstream](<https://huggingface.co/facebook/MobileLLM-1B>) | collection / pretrained | text-generation, on-device-llm | — | — | transformers, executorch, llama-cpp, safetensors | mobile, edge, embedded | FAIR-Noncommercial-Research-License / FAIR-Noncommercial-Research-License | unknown |
| [OPT](catalog/language/on-device/opt.yaml) · [upstream](<https://huggingface.co/facebook/opt-350m>) | collection / pretrained | text-generation | — | — | transformers, llama-cpp, safetensors | embedded, edge, desktop, server | MIT / MIT | unknown |
| [OpenELM](catalog/language/on-device/openelm.yaml) · [upstream](<https://huggingface.co/apple/OpenELM-270M>) | collection / pretrained | text-generation, on-device-llm | — | — | transformers, mlx, llama-cpp, safetensors | mobile, edge, desktop | unknown / unknown | unknown |
| [Phi-2](catalog/language/on-device/phi-2.yaml) · [upstream](<https://huggingface.co/microsoft/phi-2>) | collection / pretrained | text-generation, on-device-llm, reasoning | — | — | transformers, llama-cpp, safetensors, gguf | desktop, edge, server | MIT / MIT | unknown |
| [Phi-3](catalog/language/on-device/phi-3.yaml) · [upstream](<https://huggingface.co/microsoft/Phi-3-mini-4k-instruct>) | collection / pretrained | text-generation, on-device-llm, reasoning | — | — | transformers, llama-cpp, onnxruntime, safetensors, gguf, onnx | mobile, edge, desktop, server | MIT / MIT | unknown |
| [Pythia](catalog/language/on-device/pythia.yaml) · [upstream](<https://huggingface.co/EleutherAI/pythia-160m>) | collection / pretrained | text-generation, research | — | — | transformers, llama-cpp, safetensors | embedded, edge, desktop, server | Apache-2.0 / Apache-2.0 | unknown |
| [Qwen3](catalog/language/on-device/qwen3.yaml) · [upstream](<https://huggingface.co/Qwen/Qwen3-0.6B>) | collection / pretrained | text-generation, on-device-llm, tool-calling | — | — | transformers, llama-cpp, mlx, vllm, safetensors, gguf | mobile, edge, desktop, server | unknown / Apache-2.0 | unknown |
| [RWKV](catalog/language/on-device/rwkv.yaml) · [upstream](<https://huggingface.co/BlinkDL/rwkv-7-world>) | collection / pretrained | text-generation, on-device-llm | — | — | rwkv.cpp, transformers, llama-cpp, safetensors, gguf | embedded, mobile, edge, desktop, server | Apache-2.0 / Apache-2.0 | unknown |
| [SmolLM](catalog/language/on-device/smollm.yaml) · [upstream](<https://huggingface.co/HuggingFaceTB/SmolLM2-135M>) | collection / pretrained | text-generation, on-device-llm | — | — | transformers, llama-cpp, executorch, safetensors, gguf | mobile, edge, desktop | Apache-2.0 / Apache-2.0 | unknown |
| [StableLM](catalog/language/on-device/stablelm.yaml) · [upstream](<https://huggingface.co/stabilityai/stablelm-2-1_6b>) | collection / pretrained | text-generation, on-device-llm | — | — | transformers, llama-cpp, safetensors, gguf | desktop, edge, server | Apache-2.0 / Stability-AI-Community-License | unknown |
| [TinyLlama](catalog/language/on-device/tinyllama.yaml) · [upstream](<https://huggingface.co/TinyLlama/TinyLlama-1.1B-Chat-v1.0>) | collection / pretrained | text-generation, on-device-llm | 1.1B | — | transformers, llama-cpp, safetensors, gguf | desktop, edge, server | Apache-2.0 / Apache-2.0 | unknown |
| [SentencePiece](pipelines/language/sentencepiece.yaml) · [upstream](<https://github.com/google/sentencepiece>) | primitive / companion | tokenisation, subword-segmentation | — | — | native-cpp, python, tensorflow, sentencepiece-model | embedded, mobile, edge, desktop, server | Apache-2.0 / not-provided | unknown |
| [spaCy](pipelines/language/spacy.yaml) · [upstream](<https://github.com/explosion/spaCy>) | toolkit / companion | tokenisation, named-entity-recognition, part-of-speech, dependency-parsing | — | — | python, onnxruntime, thinc, spacy-pipeline | desktop, server, edge | MIT / not-provided | unknown |
| [Needle 3](catalog/language/tool-calling/cactus-needle3.yaml) · [upstream](<https://huggingface.co/Cactus-Compute/needle3>) | model / unknown | tool-calling, structured-extraction, embeddings | — | — | — | edge | unknown / Apache-2.0 | unknown |

<a id="catalogue-manufacturing"></a>

### Manufacturing

| Entry / source | Kind / use | Task | Params | Model file | Runtime / format | Target class | License C / W | Compatibility |
|---|---|---|---:|---:|---|---|---|---|
| [GLASS](pipelines/manufacturing/glass.yaml) · [upstream](<https://github.com/cqylunlun/GLASS>) | pipeline / requires-training | industrial-anomaly-detection, defect-localization | — | — | pytorch, pytorch-checkpoint | desktop, server, edge | MIT / unknown | unknown |
| [Open-IAD](pipelines/manufacturing/open-iad.yaml) · [upstream](<https://github.com/M-3LAB/open-iad>) | toolkit / companion | industrial-anomaly-detection, benchmarking | — | — | pytorch | desktop, server, edge | unknown / not-provided | unknown |
| [Hot-Rolled Steel Surface Defect Detection](pipelines/manufacturing/steel-surface-defect.yaml) · [upstream](<https://github.com/aviralchharia/Surface-Defect-Detection-in-Hot-Rolled-Steel-Strips>) | pipeline / requires-training | surface-defect-detection, quality-inspection | — | — | pytorch, tensorflow, pytorch-checkpoint | desktop, edge | MIT / unknown | unknown |

<a id="catalogue-mapping"></a>

### Mapping

| Entry / source | Kind / use | Task | Params | Model file | Runtime / format | Target class | License C / W | Compatibility |
|---|---|---|---:|---:|---|---|---|---|
| [GTSAM](primitives/optimization/gtsam.yaml) · [upstream](<https://github.com/borglab/gtsam>) | primitive / companion | factor-graph-optimization, slam, sensor-fusion | — | — | native-cpp, python | desktop, server, edge, robot | BSD-3-Clause / not-applicable | unknown |
| [3D Gaussian Splatting](pipelines/mapping/gaussian-splatting.yaml) · [upstream](<https://github.com/graphdeco-inria/gaussian-splatting>) | pipeline / companion | gaussian-splat-reconstruction, novel-view-synthesis | — | — | pytorch, cuda, ply | desktop, server | Gaussian-Splatting-License / not-applicable | unknown |
| [Brush](pipelines/reconstruction/brush.yaml) · [upstream](<https://github.com/ArthurBrussee/brush>) | pipeline / unknown | gaussian-splat-reconstruction, novel-view-rendering | — | — | rust, burn, webgpu | desktop, browser | Apache-2.0 / not-applicable | luckfox-rv1106: unknown |
| [g2o](primitives/optimization/g2o.yaml) · [upstream](<https://github.com/RainerKuemmerle/g2o>) | primitive / companion | graph-optimization, slam | — | — | native-cpp | desktop, server, edge | unknown / not-applicable | unknown |
| [Nerfstudio](pipelines/mapping/nerfstudio.yaml) · [upstream](<https://github.com/nerfstudio-project/nerfstudio>) | pipeline / companion | neural-radiance-fields, novel-view-synthesis, 3d-reconstruction | — | — | pytorch, pytorch-checkpoint | desktop, server | Apache-2.0 / not-applicable | unknown |
| [Ceres Solver](primitives/optimization/ceres-solver.yaml) · [upstream](<https://github.com/ceres-solver/ceres-solver>) | primitive / companion | nonlinear-least-squares, bundle-adjustment, slam | — | — | native-cpp, c-source | desktop, server, edge | BSD-3-Clause / not-applicable | unknown |
| [RTAB-Map](pipelines/mapping/rtabmap.yaml) · [upstream](<https://github.com/introlab/rtabmap>) | pipeline / unknown | slam, scene-mapping | — | — | native-cpp | desktop | BSD-3-Clause / not-applicable | luckfox-rv1106: unknown |
| [COLMAP](pipelines/reconstruction/colmap.yaml) · [upstream](<https://github.com/colmap/colmap>) | pipeline / unknown | structure-from-motion, multi-view-stereo | — | — | native-cpp | desktop | BSD-3-Clause / not-applicable | luckfox-rv1106: unknown |
| [ORB-SLAM3](pipelines/mapping/orb-slam3.yaml) · [upstream](<https://github.com/UZ-SLAMLab/ORB_SLAM3>) | pipeline / unknown | visual-slam, camera-localization | — | — | native-cpp | desktop | GPL-3.0 / not-applicable | luckfox-rv1106: unknown |

<a id="catalogue-marine"></a>

### Marine

| Entry / source | Kind / use | Task | Params | Model file | Runtime / format | Target class | License C / W | Compatibility |
|---|---|---|---:|---:|---|---|---|---|
| [PAMGuard](pipelines/marine/pamguard.yaml) · [upstream](<https://github.com/PAMGuard/PAMGuard>) | pipeline / companion | passive-acoustic-monitoring, marine-mammal-detection, bioacoustics | — | — | java | desktop, edge | GPL-3.0 / unknown | unknown |

<a id="catalogue-music"></a>

### Music

| Entry / source | Kind / use | Task | Params | Model file | Runtime / format | Target class | License C / W | Compatibility |
|---|---|---|---:|---:|---|---|---|---|
| [Basic Pitch](pipelines/music/basic-pitch.yaml) · [upstream](<https://github.com/spotify/basic-pitch>) | toolkit / pretrained | automatic-music-transcription, pitch-estimation | — | — | tensorflow, coreml, tflite, onnxruntime, onnx | mobile, desktop, browser | Apache-2.0 / Apache-2.0 | unknown |
| [AudioCraft (MusicGen / AudioGen)](catalog/music/generation/audiocraft.yaml) · [upstream](<https://github.com/facebookresearch/audiocraft>) | collection / pretrained | music-generation, audio-generation, text-to-audio | — | — | pytorch, pytorch-checkpoint | server, desktop | MIT / unknown | unknown |
| [Demucs](catalog/music/source-separation/demucs.yaml) · [upstream](<https://github.com/facebookresearch/demucs>) | collection / pretrained | music-source-separation | — | — | pytorch, pytorch-checkpoint | desktop, server | MIT / unknown | unknown |
| [Spleeter](pipelines/music/spleeter.yaml) · [upstream](<https://github.com/deezer/spleeter>) | toolkit / pretrained | music-source-separation | — | — | tensorflow, python | desktop, server | MIT / MIT | unknown |
| [CREPE](catalog/music/analysis/crepe.yaml) · [upstream](<https://github.com/marl/crepe>) | collection / pretrained | pitch-estimation, music-analysis | — | — | tensorflow, onnxruntime, tflite, savedmodel, onnx | embedded, mobile, edge, desktop | MIT / unknown | unknown |

<a id="catalogue-networking"></a>

### Networking

| Entry / source | Kind / use | Task | Params | Model file | Runtime / format | Target class | License C / W | Compatibility |
|---|---|---|---:|---:|---|---|---|---|
| [nPrintML](pipelines/networking/nprintml.yaml) · [upstream](<https://github.com/nprint/nprintml>) | toolkit / requires-training | network-traffic-classification, packet-analysis, traffic-anomaly-detection | — | — | python | desktop, server | Apache-2.0 / not-provided | unknown |

<a id="catalogue-neuromorphic"></a>

### Neuromorphic

| Entry / source | Kind / use | Task | Params | Model file | Runtime / format | Target class | License C / W | Compatibility |
|---|---|---|---:|---:|---|---|---|---|
| [Lava](pipelines/neuromorphic/lava.yaml) · [upstream](<https://github.com/lava-nc/lava>) | toolkit / companion | neuromorphic-computing, spiking-neural-networks, event-based-processing | — | — | lava, python, lava-process | neuromorphic, edge, embedded | unknown / not-provided | intel-loihi: unknown |
| [Intel Lava](pipelines/neuromorphic/intel-lava.yaml) · [upstream](<https://github.com/lava-nc/lava>) | toolkit / companion | neuromorphic-inference, snn-deployment, on-chip-learning | — | — | python | desktop, edge | mixed BSD-3-Clause / LGPL-2.1-or-later / not-applicable | unknown |
| [Lava-DL](pipelines/neuromorphic/lava-dl.yaml) · [upstream](<https://github.com/lava-nc/lava-dl>) | toolkit / requires-training | neuromorphic-inference, snn-training, snn-deployment | — | — | pytorch | desktop, edge | BSD-3-Clause / not-provided | unknown |
| [NIR (Neuromorphic Intermediate Representation)](pipelines/neuromorphic/nir.yaml) · [upstream](<https://github.com/neuromorphs/NIR>) | toolkit / companion | neuromorphic-inference, model-exchange | — | — | python, nir | desktop, edge | BSD-3-Clause / not-applicable | unknown |
| [BindsNET](pipelines/neuromorphic/bindsnet.yaml) · [upstream](<https://github.com/BindsNET/bindsnet>) | toolkit / requires-training | spiking-neural-networks, snn-training, reinforcement-learning | — | — | pytorch | desktop, server | AGPL-3.0 / not-provided | unknown |
| [Brian2](pipelines/neuromorphic/brian2.yaml) · [upstream](<https://github.com/brian-team/brian2>) | toolkit / companion | spiking-neural-networks, computational-neuroscience, snn-simulation | — | — | python | desktop, server | CeCILL / not-provided | unknown |
| [Nengo](pipelines/neuromorphic/nengo.yaml) · [upstream](<https://github.com/nengo/nengo>) | toolkit / companion | spiking-neural-networks, brain-modelling, snn-simulation | — | — | python | desktop, server | GPL-2.0 / not-provided | unknown |
| [Norse](pipelines/neuromorphic/norse.yaml) · [upstream](<https://github.com/norse/norse>) | toolkit / requires-training | spiking-neural-networks, snn-training | — | — | pytorch | desktop, server | LGPL-3.0 / not-provided | unknown |
| [PyNN](pipelines/neuromorphic/pynn.yaml) · [upstream](<https://github.com/NeuralEnsemble/PyNN>) | toolkit / companion | spiking-neural-networks, snn-simulation, simulator-abstraction | — | — | python | desktop, server, edge | CeCILL / not-provided | unknown |
| [Rockpool](pipelines/neuromorphic/rockpool.yaml) · [upstream](<https://github.com/synsense/rockpool>) | toolkit / requires-training | spiking-neural-networks, snn-training, neuromorphic-deployment | — | — | pytorch, jax | desktop, server, edge | AGPL-3.0 / not-provided | unknown |
| [SpikingJelly](pipelines/neuromorphic/spikingjelly.yaml) · [upstream](<https://github.com/fangwei123456/spikingjelly>) | toolkit / requires-training | spiking-neural-networks, neuromorphic-inference, snn-training | — | — | pytorch | desktop, server, edge | Apache-2.0 / not-provided | unknown |
| [sinabs](pipelines/neuromorphic/sinabs.yaml) · [upstream](<https://github.com/synsense/sinabs>) | toolkit / requires-training | spiking-neural-networks, snn-training, neuromorphic-inference | — | — | pytorch | desktop, server, edge | Apache-2.0 / not-provided | unknown |
| [snnTorch](pipelines/neuromorphic/snntorch.yaml) · [upstream](<https://github.com/jeshraghian/snntorch>) | toolkit / requires-training | spiking-neural-networks, snn-training, on-device-learning | — | — | pytorch | desktop, server, edge | MIT / not-provided | unknown |

<a id="catalogue-quantum"></a>

### Quantum

| Entry / source | Kind / use | Task | Params | Model file | Runtime / format | Target class | License C / W | Compatibility |
|---|---|---|---:|---:|---|---|---|---|
| [PennyLane](pipelines/quantum/pennylane.yaml) · [upstream](<https://github.com/PennyLaneAI/pennylane>) | toolkit / companion | quantum-machine-learning, variational-quantum-circuits, quantum-differentiation | — | — | python | desktop, server | Apache-2.0 / not-provided | unknown |
| [Qiskit Machine Learning](pipelines/quantum/qiskit-machine-learning.yaml) · [upstream](<https://github.com/qiskit-community/qiskit-machine-learning>) | toolkit / companion | quantum-machine-learning, quantum-kernels, variational-algorithms | — | — | python | desktop, server | Apache-2.0 / not-provided | unknown |
| [TensorFlow Quantum](pipelines/quantum/tensorflow-quantum.yaml) · [upstream](<https://github.com/tensorflow/quantum>) | toolkit / companion | quantum-machine-learning, hybrid-quantum-classical-models | — | — | tensorflow | desktop, server | Apache-2.0 / not-provided | unknown |
| [TorchQuantum](pipelines/quantum/torchquantum.yaml) · [upstream](<https://github.com/mit-han-lab/torchquantum>) | toolkit / companion | quantum-machine-learning, quantum-circuit-simulation | — | — | pytorch | desktop, server | MIT / not-provided | unknown |

<a id="catalogue-reasoning"></a>

### Reasoning

| Entry / source | Kind / use | Task | Params | Model file | Runtime / format | Target class | License C / W | Compatibility |
|---|---|---|---:|---:|---|---|---|---|
| [Tiny Recursive Model](catalog/reasoning/tiny-recursive-model.yaml) · [upstream](<https://github.com/SamsungSAILMontreal/TinyRecursiveModels>) | model / unknown | structured-reasoning | 7M | — | pytorch | edge | MIT / unknown | unknown |

<a id="catalogue-recommendation"></a>

### Recommendation

| Entry / source | Kind / use | Task | Params | Model file | Runtime / format | Target class | License C / W | Compatibility |
|---|---|---|---:|---:|---|---|---|---|
| [DeepCTR](pipelines/recommendation/deepctr.yaml) · [upstream](<https://github.com/shenweichen/DeepCTR>) | toolkit / requires-training | click-through-rate-prediction, ranking | — | — | tensorflow | server | Apache-2.0 / not-provided | unknown |
| [implicit](pipelines/recommendation/implicit.yaml) · [upstream](<https://github.com/benfred/implicit>) | toolkit / requires-training | collaborative-filtering, recommendation | — | — | python, numpy | server, desktop | MIT / not-provided | unknown |
| [DLRM](pipelines/recommendation/dlrm.yaml) · [upstream](<https://github.com/facebookresearch/dlrm>) | toolkit / requires-training | recommendation, ctr-prediction, ranking | — | — | pytorch, caffe2, pytorch-checkpoint | server, desktop | MIT / not-provided | unknown |
| [EasyRec](pipelines/recommendation/easyrec.yaml) · [upstream](<https://github.com/alibaba/EasyRec>) | toolkit / requires-training | recommendation, ctr-prediction, ranking | — | — | tensorflow, savedmodel | server, desktop | Apache-2.0 / not-provided | unknown |
| [NVIDIA Merlin](pipelines/recommendation/merlin.yaml) · [upstream](<https://github.com/NVIDIA-Merlin/Merlin>) | toolkit / requires-training | recommendation, feature-engineering, ranking | — | — | pytorch, tensorflow, cuda, pytorch-checkpoint | server | Apache-2.0 / not-provided | unknown |
| [RecBole](pipelines/recommendation/recbole.yaml) · [upstream](<https://github.com/RUCAIBox/RecBole>) | toolkit / requires-training | recommendation, benchmarking | — | — | pytorch, pytorch-checkpoint | server, desktop | MIT / not-provided | unknown |
| [Surprise](pipelines/recommendation/surprise.yaml) · [upstream](<https://github.com/NicolasHug/Surprise>) | toolkit / requires-training | recommendation, collaborative-filtering, rating-prediction | — | — | python, numpy, pickle | desktop, edge, embedded, server | BSD-3-Clause / not-provided | unknown |
| [TensorFlow Recommenders](pipelines/recommendation/tensorflow-recommenders.yaml) · [upstream](<https://github.com/tensorflow/recommenders>) | toolkit / requires-training | recommendation, retrieval, ranking | — | — | tensorflow | server, desktop | Apache-2.0 / not-provided | unknown |
| [TorchRec](pipelines/recommendation/torchrec.yaml) · [upstream](<https://github.com/meta-pytorch/torchrec>) | toolkit / requires-training | recommendation, embedding-tables, distributed-training | — | — | pytorch, pytorch-checkpoint | server | BSD-3-Clause / not-provided | unknown |

<a id="catalogue-retrieval"></a>

### Retrieval

| Entry / source | Kind / use | Task | Params | Model file | Runtime / format | Target class | License C / W | Compatibility |
|---|---|---|---:|---:|---|---|---|---|
| [Annoy](pipelines/retrieval/annoy.yaml) · [upstream](<https://github.com/spotify/annoy>) | toolkit / companion | approximate-nearest-neighbor, vector-search | — | — | native-cpp, python, annoy-index | embedded, mobile, edge, desktop, server | Apache-2.0 / not-provided | unknown |
| [FAISS](pipelines/retrieval/faiss.yaml) · [upstream](<https://github.com/facebookresearch/faiss>) | toolkit / companion | approximate-nearest-neighbor, vector-search, clustering | — | — | native-cpp, python, cuda, faiss-index | embedded, mobile, edge, desktop, server | MIT / not-provided | unknown |
| [hnswlib](pipelines/retrieval/hnswlib.yaml) · [upstream](<https://github.com/nmslib/hnswlib>) | toolkit / companion | approximate-nearest-neighbor, vector-search | — | — | native-cpp, python, hnsw-index | embedded, mobile, edge, desktop, server | Apache-2.0 / not-provided | unknown |
| [Chroma](pipelines/retrieval/chroma.yaml) · [upstream](<https://github.com/chroma-core/chroma>) | toolkit / companion | vector-search, rag-store | — | — | python, javascript, sqlite-db, hnsw-index | desktop, server, edge | Apache-2.0 / not-provided | unknown |
| [LanceDB](pipelines/retrieval/lancedb.yaml) · [upstream](<https://github.com/lancedb/lancedb>) | toolkit / companion | vector-search, embedded-database | — | — | python, rust, javascript, lance | desktop, edge, server | Apache-2.0 / not-provided | unknown |
| [Qdrant](pipelines/retrieval/qdrant.yaml) · [upstream](<https://github.com/qdrant/qdrant>) | toolkit / companion | vector-search, rag-store | — | — | rust, python, qdrant-storage | desktop, server, edge | Apache-2.0 / not-provided | unknown |
| [USearch](pipelines/retrieval/usearch.yaml) · [upstream](<https://github.com/unum-cloud/usearch>) | toolkit / companion | vector-search, approximate-nearest-neighbor | — | — | native-cpp, python, rust, usearch-index | embedded, mobile, edge, desktop, server | Apache-2.0 / not-provided | unknown |
| [sqlite-vec](pipelines/retrieval/sqlite-vec.yaml) · [upstream](<https://github.com/asg017/sqlite-vec>) | toolkit / companion | vector-search, embedded-database | — | — | sqlite, sqlite-db | embedded, mobile, edge, desktop, server | Apache-2.0 / not-provided | unknown |

<a id="catalogue-robotics"></a>

### Robotics

| Entry / source | Kind / use | Task | Params | Model file | Runtime / format | Target class | License C / W | Compatibility |
|---|---|---|---:|---:|---|---|---|---|
| [MAVSDK](pipelines/robotics/mavsdk.yaml) · [upstream](<https://github.com/mavlink/MAVSDK>) | toolkit / companion | drone-control-sdk, autonomous-vehicle-interface | — | — | native-cpp, python | edge, desktop, robot | BSD-3-Clause / not-applicable | unknown |
| [PX4 Autopilot](pipelines/robotics/px4-autopilot.yaml) · [upstream](<https://github.com/PX4/PX4-Autopilot>) | pipeline / companion | flight-control, autonomous-vehicle-control, sensor-fusion | — | — | native-cpp, nuttx | edge, robot | BSD-3-Clause / not-applicable | unknown |
| [ACT (ALOHA)](catalog/robotics/vla/act.yaml) · [upstream](<https://github.com/tonyzhaozh/aloha>) | collection / requires-training | imitation-learning, robot-manipulation, action-chunking | — | — | pytorch, pytorch-checkpoint | edge, desktop | MIT / unknown | unknown |
| [robomimic](pipelines/robotics/robomimic.yaml) · [upstream](<https://github.com/ARISE-Initiative/robomimic>) | toolkit / requires-training | imitation-learning, robot-manipulation, offline-rl | — | — | pytorch, pytorch-checkpoint, onnx | desktop, server | MIT / not-provided | unknown |
| [Nav2](primitives/robotics/navigation2.yaml) · [upstream](<https://github.com/ros-navigation/navigation2>) | primitive / companion | path-planning, robot-navigation, obstacle-avoidance | — | — | ros2, native-cpp | edge, desktop, robot | Apache-2.0 / not-applicable | unknown |
| [SERL](pipelines/robotics/serl.yaml) · [upstream](<https://github.com/rail-berkeley/serl>) | toolkit / requires-training | reinforcement-learning, robot-manipulation, sample-efficient-rl | — | — | jax, pytorch, gym, jax-params, pytorch-checkpoint | server, desktop, edge | Apache-2.0 / not-provided | unknown |
| [LeRobot](pipelines/robotics/lerobot.yaml) · [upstream](<https://github.com/huggingface/lerobot>) | toolkit / requires-training | robot-learning, imitation-learning, robot-policy-training, teleoperation | — | — | pytorch, pytorch-checkpoint, onnx | desktop, edge, robot | Apache-2.0 / Apache-2.0 | unknown |
| [OpenPI](catalog/robotics/policies/openpi.yaml) · [upstream](<https://github.com/Physical-Intelligence/openpi>) | collection / pretrained | robot-policy, vision-language-action, robot-manipulation | — | — | jax, pytorch, safetensors | server, desktop | Apache-2.0 / unknown | unknown |
| [Octo](catalog/robotics/policies/octo.yaml) · [upstream](<https://huggingface.co/rail-berkeley/octo-small>) | collection / pretrained | robot-policy-learning, robot-manipulation | — | — | jax, pytorch, transformers, safetensors | desktop, server | MIT / MIT | unknown |
| [EdgeVLA-Tiny](catalog/robotics/vla/edgevla-tiny.yaml) · [upstream](<https://huggingface.co/enfuse/edgevla-tiny-fmb>) | model / unknown | vision-language-action | 164M | — | pytorch, transformers | edge | unknown / Apache-2.0 | unknown |
| [NVIDIA Isaac GR00T](catalog/robotics/vla/isaac-gr00t.yaml) · [upstream](<https://huggingface.co/nvidia/GR00T-N1.5-3B>) | collection / pretrained | vision-language-action, robot-manipulation, imitation-learning | — | — | pytorch, tensorrt, safetensors | edge, server | Apache-2.0 / unknown | unknown |
| [OpenVLA](catalog/robotics/vla/openvla.yaml) · [upstream](<https://huggingface.co/openvla/openvla-7b>) | collection / pretrained | vision-language-action, robot-manipulation | 7B | — | pytorch, transformers, safetensors | server, desktop | MIT / MIT | unknown |
| [RT-1](catalog/robotics/vla/rt-1.yaml) · [upstream](<https://github.com/google-research/robotics_transformer>) | collection / pretrained | vision-language-action, robot-manipulation, imitation-learning | — | — | tensorflow, jax, savedmodel | server, edge | Apache-2.0 / unknown | unknown |
| [Diffusion Policy](catalog/robotics/policies/diffusion-policy.yaml) · [upstream](<https://github.com/real-stanford/diffusion_policy>) | collection / requires-training | visuomotor-policy, imitation-learning, robot-manipulation | — | — | pytorch, pytorch-checkpoint | desktop, server | MIT / not-provided | unknown |

<a id="catalogue-runtime"></a>

### Runtime

| Entry / source | Kind / use | Task | Params | Model file | Runtime / format | Target class | License C / W | Compatibility |
|---|---|---|---:|---:|---|---|---|---|
| [MaixPy](pipelines/runtime/maixpy.yaml) · [upstream](<https://github.com/sipeed/MaixPy>) | toolkit / companion | edge-ai-deployment, embedded-vision | — | — | maixpy-native, nncase, kmodel | edge | MIT / not-applicable | k210: reported |
| [ggml](pipelines/runtime/ggml.yaml) · [upstream](<https://github.com/ggml-org/ggml>) | toolkit / companion | edge-inference, quantization, model-execution | — | — | ggml-native, gguf | edge, mobile, desktop, server | MIT / not-applicable | unknown |
| [tract](pipelines/runtime/tract.yaml) · [upstream](<https://github.com/sonos/tract>) | toolkit / companion | embedded-inference, onnx-inference, tensorflow-inference | — | — | tract-native, wasm, onnx, tensorflow | edge, mobile, desktop, browser | MIT OR Apache-2.0 / not-applicable | unknown |
| [Seeed SenseCraft Model Assistant](pipelines/runtime/sensecraft-model-assistant.yaml) · [upstream](<https://github.com/Seeed-Studio/ModelAssistant>) | toolkit / requires-training | embedded-model-training, model-deployment, edge-vision | — | — | python, onnxruntime, tflite, ncnn, onnx | edge, mobile, desktop | unknown / not-provided | unknown |
| [Vitis AI](pipelines/runtime/vitis-ai.yaml) · [upstream](<https://github.com/Xilinx/Vitis-AI>) | toolkit / companion | fpga-inference, dpu-deployment, model-compilation | — | — | vitis-ai-native, onnx, xmodel | edge, server | Apache-2.0 / not-applicable | unknown |
| [NVIDIA TensorRT](pipelines/runtime/tensorrt.yaml) · [upstream](<https://github.com/NVIDIA/TensorRT>) | toolkit / companion | gpu-inference, inference-optimisation | — | — | tensorrt, cuda, onnx, tensorrt-engine | edge, embedded, desktop, server | Apache-2.0 / not-provided | unknown |
| [stable-diffusion.cpp](pipelines/runtime/stable-diffusion-cpp.yaml) · [upstream](<https://github.com/leejet/stable-diffusion.cpp>) | toolkit / companion | image-generation, diffusion-inference | — | — | stable-diffusion.cpp, ggml, gguf, safetensors | desktop, edge, embedded | MIT / not-provided | unknown |
| [Transformers.js](pipelines/runtime/transformers-js.yaml) · [upstream](<https://github.com/huggingface/transformers.js>) | toolkit / companion | in-browser-inference, on-device-inference | — | — | onnxruntime, wasm, webgpu, onnx | browser, desktop | Apache-2.0 / not-applicable | unknown |
| [WebLLM](pipelines/runtime/web-llm.yaml) · [upstream](<https://github.com/mlc-ai/web-llm>) | toolkit / companion | in-browser-llm-inference, text-generation | — | — | webgpu, mlc-native, mlc | browser, desktop | Apache-2.0 / not-applicable | unknown |
| [ExLlamaV2](pipelines/runtime/exllamav2.yaml) · [upstream](<https://github.com/turboderp-org/exllamav2>) | toolkit / companion | llm-inference, quantisation | — | — | pytorch, cuda, exl2, gptq, safetensors | desktop, server | MIT / not-provided | unknown |
| [ONNX Runtime GenAI](pipelines/runtime/onnxruntime-genai.yaml) · [upstream](<https://github.com/microsoft/onnxruntime-genai>) | toolkit / companion | llm-inference, vlm-inference, on-device-inference | — | — | onnxruntime, onnx | mobile, embedded, edge, desktop, server | MIT / not-provided | unknown |
| [llama-cpp-python](pipelines/runtime/llama-cpp-python.yaml) · [upstream](<https://github.com/abetlen/llama-cpp-python>) | toolkit / companion | llm-inference, gguf-inference | — | — | llama.cpp, python, gguf | embedded, mobile, edge, desktop, server | MIT / not-provided | unknown |
| [LocalAI](pipelines/runtime/localai.yaml) · [upstream](<https://github.com/mudler/LocalAI>) | toolkit / companion | llm-serving, offline-serving, multimodal-serving | — | — | llama-cpp, transformers, diffusers, gguf, safetensors | desktop, server, edge | MIT / not-provided | unknown |
| [Text Generation Inference (TGI)](pipelines/runtime/text-generation-inference.yaml) · [upstream](<https://github.com/huggingface/text-generation-inference>) | toolkit / companion | llm-serving, model-serving | — | — | pytorch, cuda, rocm, safetensors, gptq | server, desktop | Apache-2.0 / not-provided | unknown |
| [vLLM](pipelines/runtime/vllm.yaml) · [upstream](<https://github.com/vllm-project/vllm>) | toolkit / companion | llm-serving, high-throughput-inference | — | — | pytorch, cuda, safetensors, gguf | server | Apache-2.0 / not-applicable | unknown |
| [Ollama](pipelines/runtime/ollama.yaml) · [upstream](<https://github.com/ollama/ollama>) | toolkit / companion | local-llm-serving, text-generation | — | — | llama-cpp-native, ggml, gguf | desktop, server | MIT / not-applicable | unknown |
| [micromlgen](pipelines/runtime/micromlgen.yaml) · [upstream](<https://github.com/eloquentarduino/micromlgen>) | toolkit / companion | mcu-deployment, model-conversion | — | — | python, native-cpp, c-source | embedded, edge | MIT / not-provided | unknown |
| [BitNetMCU](pipelines/runtime/bitnetmcu.yaml) · [upstream](<https://github.com/cpldcpu/BitNetMCU>) | toolkit / companion | mcu-inference, low-bit-quantization | — | — | native-c, c-source | edge | GPL-3.0 / not-applicable | unknown |
| [ESP-DL](pipelines/runtime/esp-dl.yaml) · [upstream](<https://github.com/espressif/esp-dl>) | toolkit / companion | mcu-inference, esp32-deployment | — | — | esp-dl-native, tflite, onnx, esp-dl | edge | Apache-2.0 / not-applicable | esp32: reported |
| [MCUNet / TinyEngine](pipelines/runtime/tinyengine.yaml) · [upstream](<https://github.com/mit-han-lab/tinyengine>) | toolkit / companion | mcu-inference, on-device-training, model-compilation | — | — | tinyengine-native, cmsis-nn, c-source | edge | MIT / not-applicable | unknown |
| [TensorFlow Lite for Microcontrollers](pipelines/runtime/tflite-micro.yaml) · [upstream](<https://github.com/tensorflow/tflite-micro>) | toolkit / companion | mcu-inference, tinyml-deployment | — | — | tflite-micro-native, cmsis-nn, tflite | edge | Apache-2.0 / not-applicable | cortex-m: reported |
| [Z-Ant](pipelines/runtime/zant.yaml) · [upstream](<https://github.com/ZantFoundation/Z-Ant>) | toolkit / companion | mcu-inference, model-optimization, embedded-deployment | — | — | zant-native, onnx | edge | Apache-2.0 / not-applicable | unknown |
| [deepC](pipelines/runtime/deepc.yaml) · [upstream](<https://github.com/ai-techsystems/deepC>) | toolkit / companion | mcu-inference, model-compilation, embedded-deployment | — | — | deepc-native, onnx | edge | Apache-2.0 / not-applicable | unknown |
| [emlearn](pipelines/runtime/emlearn.yaml) · [upstream](<https://github.com/emlearn/emlearn>) | toolkit / companion | mcu-inference, classical-ml-deployment | — | — | emlearn-c, python, c-source | edge | MIT / not-applicable | unknown |
| [CMSIS-NN](pipelines/runtime/cmsis-nn.yaml) · [upstream](<https://github.com/ARM-software/CMSIS-NN>) | toolkit / companion | mcu-kernels, mcu-inference | — | — | cmsis-nn, native-c, c-source | edge | Apache-2.0 / not-applicable | cortex-m: reported |
| [MNN](pipelines/runtime/mnn.yaml) · [upstream](<https://github.com/alibaba/MNN>) | toolkit / companion | mobile-inference, on-device-inference, model-conversion | — | — | mnn-native, opencl, vulkan, mnn, onnx | mobile, edge, desktop, server | Apache-2.0 / not-applicable | unknown |
| [Paddle Lite](pipelines/runtime/paddle-lite.yaml) · [upstream](<https://github.com/PaddlePaddle/Paddle-Lite>) | toolkit / companion | mobile-inference, on-device-inference, model-optimization | — | — | paddle-lite-native, paddle, onnx | mobile, edge, desktop | Apache-2.0 / not-applicable | unknown |
| [TNN](pipelines/runtime/tnn.yaml) · [upstream](<https://github.com/Tencent/TNN>) | toolkit / companion | mobile-inference, on-device-inference, model-conversion | — | — | tnn-native, opencl, metal, onnx, tnn | mobile, edge, desktop, server | BSD-3-Clause / not-applicable | unknown |
| [ncnn](pipelines/runtime/ncnn.yaml) · [upstream](<https://github.com/Tencent/ncnn>) | toolkit / companion | mobile-inference, on-device-inference | — | — | ncnn-native, vulkan, onnx | mobile, edge, desktop | BSD-3-Clause / not-applicable | unknown |
| [Apache TVM](pipelines/runtime/apache-tvm.yaml) · [upstream](<https://github.com/apache/tvm>) | toolkit / companion | model-compilation, on-device-inference, autotuning | — | — | tvm-native, relay, tvm-ffi | desktop, mobile, edge | Apache-2.0 / not-applicable | unknown |
| [ONNX](pipelines/runtime/onnx.yaml) · [upstream](<https://github.com/onnx/onnx>) | toolkit / companion | model-interchange, model-format | — | — | onnxruntime, openvino, ncnn, onnx | desktop, server, mobile, edge | Apache-2.0 / not-applicable | unknown |
| [Triton Inference Server](pipelines/runtime/triton-inference-server.yaml) · [upstream](<https://github.com/triton-inference-server/server>) | toolkit / companion | model-serving, multi-framework-serving | — | — | tensorrt, onnxruntime, pytorch, tensorflow, onnx, tensorrt-engine, savedmodel | server, edge | BSD-3-Clause / not-provided | unknown |
| [ONNX Model Zoo](catalog/runtime/model-zoo/onnx-model-zoo.yaml) · [upstream](<https://github.com/onnx/models>) | collection / pretrained | model-zoo, benchmarking, model-interchange | — | — | onnxruntime, onnx | desktop, server, mobile, edge | Apache-2.0 / unknown | unknown |
| [Cactus](pipelines/runtime/cactus.yaml) · [upstream](<https://github.com/cactus-compute/cactus>) | toolkit / companion | on-device-inference, model-quantization, mobile-deployment | — | — | cactus-native | mobile, edge, robot | custom-restricted / not-applicable | unknown |
| [ExecuTorch](pipelines/runtime/executorch.yaml) · [upstream](<https://github.com/pytorch/executorch>) | toolkit / companion | on-device-inference, mcu-deployment, model-export | — | — | executorch-native, pytorch, pte | mobile, edge, desktop, browser | BSD-3-Clause / not-applicable | unknown |
| [ONNX Runtime](pipelines/runtime/onnxruntime.yaml) · [upstream](<https://github.com/microsoft/onnxruntime>) | toolkit / companion | on-device-inference, cross-platform-execution | — | — | onnxruntime-native, onnx | desktop, server, mobile, edge, browser | MIT / not-applicable | unknown |
| [OnnxStream](pipelines/runtime/onnxstream.yaml) · [upstream](<https://github.com/vitoplantamura/OnnxStream>) | toolkit / companion | on-device-inference, onnx-execution | — | — | onnxstream-native, onnxruntime, onnx | edge, desktop, browser | MIT / not-applicable | unknown |
| [OpenVINO](pipelines/runtime/openvino.yaml) · [upstream](<https://github.com/openvinotoolkit/openvino>) | toolkit / companion | on-device-inference, model-optimization, model-compilation | — | — | openvino-native, onnxruntime, onnx, openvino-ir | desktop, server, edge | Apache-2.0 / not-applicable | unknown |
| [LiteRT-LM](pipelines/runtime/litert-lm.yaml) · [upstream](<https://github.com/google-ai-edge/LiteRT-LM>) | toolkit / companion | on-device-llm-inference, text-generation | — | — | litert-lm-native | mobile, edge, desktop | Apache-2.0 / not-applicable | unknown |
| [MLC LLM](pipelines/runtime/mlc-llm.yaml) · [upstream](<https://github.com/mlc-ai/mlc-llm>) | toolkit / companion | on-device-llm-inference, model-compilation, text-generation | — | — | mlc-native, tvm | mobile, edge, desktop, browser | Apache-2.0 / not-applicable | unknown |
| [llama.cpp](pipelines/runtime/llama-cpp.yaml) · [upstream](<https://github.com/ggml-org/llama.cpp>) | toolkit / companion | on-device-llm-inference, text-generation, quantization | — | — | llama-cpp-native, ggml, gguf | desktop, mobile, edge, browser | MIT / not-applicable | unknown |
| [llamafile](pipelines/runtime/llamafile.yaml) · [upstream](<https://github.com/Mozilla-Ocho/llamafile>) | toolkit / companion | on-device-llm-inference, single-file-deployment | — | — | llama-cpp-native, cosmopolitan, gguf | desktop, server | Apache-2.0 / not-applicable | unknown |
| [MLX](pipelines/runtime/mlx.yaml) · [upstream](<https://github.com/ml-explore/mlx>) | toolkit / companion | on-device-ml, array-computing, model-inference | — | — | mlx, python, safetensors | desktop, mobile, edge | MIT / not-provided | unknown |
| [AWQ](pipelines/runtime/awq.yaml) · [upstream](<https://github.com/mit-han-lab/llm-awq>) | toolkit / companion | quantisation, llm-compression | — | — | pytorch, cuda, awq, safetensors | desktop, server, edge | MIT / not-provided | unknown |
| [GPTQ](pipelines/runtime/gptq.yaml) · [upstream](<https://github.com/IST-DASLab/gptq>) | toolkit / companion | quantisation, llm-compression | — | — | pytorch, cuda, gptq, safetensors | desktop, server, edge | Apache-2.0 / not-provided | unknown |
| [Intel Neural Compressor](pipelines/runtime/neural-compressor.yaml) · [upstream](<https://github.com/intel/neural-compressor>) | toolkit / companion | quantisation, model-compression, pruning | — | — | pytorch, tensorflow, onnxruntime, openvino, onnx, pytorch-checkpoint | edge, desktop, server | Apache-2.0 / not-provided | unknown |
| [Burn](pipelines/runtime/burn.yaml) · [upstream](<https://github.com/tracel-ai/burn>) | toolkit / companion | rust-deep-learning, on-device-inference, model-training | — | — | burn-native, wasm, onnx, burn | desktop, server, edge, browser | Apache-2.0 / not-applicable | unknown |
| [Candle](pipelines/runtime/candle.yaml) · [upstream](<https://github.com/huggingface/candle>) | toolkit / companion | rust-inference, on-device-inference, model-serving | — | — | candle-native, wasm, safetensors, gguf | desktop, server, edge, browser | Apache-2.0 / not-applicable | unknown |
| [audio.cpp](pipelines/runtime/audio-cpp.yaml) · [upstream](<https://github.com/0xShug0/audio.cpp>) | toolkit / companion | speech-to-text, text-to-speech, voice-activity-detection, voice-conversion | — | — | ggml, audio-cpp-native, gguf | desktop, edge, mobile | Apache-2.0 / not-applicable | unknown |
| [Guidance](pipelines/runtime/guidance.yaml) · [upstream](<https://github.com/guidance-ai/guidance>) | toolkit / companion | structured-generation, constrained-decoding, prompting | — | — | transformers, llama-cpp, python | desktop, server, edge | MIT / not-provided | unknown |
| [LM Format Enforcer](pipelines/runtime/lm-format-enforcer.yaml) · [upstream](<https://github.com/noamgat/lm-format-enforcer>) | toolkit / companion | structured-generation, constrained-decoding | — | — | transformers, llama-cpp, vllm, python | desktop, server, edge | MIT / not-provided | unknown |
| [Outlines](pipelines/runtime/outlines.yaml) · [upstream](<https://github.com/dottxt-ai/outlines>) | toolkit / companion | structured-generation, constrained-decoding | — | — | transformers, llama-cpp, vllm, python | desktop, server, edge | Apache-2.0 / not-provided | unknown |
| [CTranslate2](pipelines/runtime/ctranslate2.yaml) · [upstream](<https://github.com/OpenNMT/CTranslate2>) | toolkit / companion | transformer-inference, model-quantization | — | — | ctranslate2-native, python, ctranslate2 | desktop, server, edge | MIT / not-applicable | unknown |
| [WasmEdge](pipelines/runtime/wasmedge.yaml) · [upstream](<https://github.com/WasmEdge/WasmEdge>) | toolkit / companion | wasm-inference, edge-runtime | — | — | wasm, wasi-nn | edge, mobile, embedded, server | Apache-2.0 / not-provided | unknown |

<a id="catalogue-science"></a>

### Science

| Entry / source | Kind / use | Task | Params | Model file | Runtime / format | Target class | License C / W | Compatibility |
|---|---|---|---:|---:|---|---|---|---|
| [MACE](catalog/science/materials/mace.yaml) · [upstream](<https://github.com/ACEsuit/mace>) | collection / requires-training | atomistic-potential, molecular-dynamics | — | — | pytorch, pytorch-checkpoint | desktop, server | MIT / not-provided | unknown |
| [MatterSim Small](catalog/science/materials/mattersim-small.yaml) · [upstream](<https://github.com/microsoft/mattersim>) | model / unknown | atomistic-potential | 1M | — | pytorch | edge | MIT / unknown | unknown |
| [scikit-learn](pipelines/science/scikit-learn.yaml) · [upstream](<https://github.com/scikit-learn/scikit-learn>) | toolkit / requires-training | classical-ml, regression, classification, clustering | — | — | python, onnxruntime, pickle, onnx | embedded, mobile, edge, desktop, server | BSD-3-Clause / not-provided | unknown |
| [Optuna](pipelines/science/optuna.yaml) · [upstream](<https://github.com/optuna/optuna>) | toolkit / companion | hyperparameter-optimisation, experiment-tracking | — | — | python, study-db | desktop, server, edge | MIT / not-provided | unknown |
| [TorchMD-NET](catalog/science/materials/torchmd-net.yaml) · [upstream](<https://github.com/torchmd/torchmd-net>) | collection / requires-training | machine-learned-potentials, molecular-dynamics, atomistic-simulation | — | — | pytorch, pytorch-checkpoint | desktop, server | MIT / not-provided | unknown |
| [OpenMM](pipelines/science/openmm.yaml) · [upstream](<https://github.com/openmm/openmm>) | toolkit / companion | molecular-dynamics, atomistic-simulation | — | — | native-cpp, python, cuda | desktop, server | MIT / not-applicable | unknown |
| [Chemprop](pipelines/science/chemprop.yaml) · [upstream](<https://github.com/chemprop/chemprop>) | toolkit / requires-training | molecular-property-prediction, molecular-representation | — | — | pytorch, python, pytorch-checkpoint | desktop, server | MIT / not-provided | unknown |
| [DeepChem](pipelines/science/deepchem.yaml) · [upstream](<https://github.com/deepchem/deepchem>) | toolkit / requires-training | molecular-property-prediction, drug-discovery, materials-informatics | — | — | pytorch, tensorflow, python, pytorch-checkpoint | desktop, server | MIT / not-provided | unknown |
| [ESM (Evolutionary Scale Modeling)](catalog/science/proteins/esm.yaml) · [upstream](<https://huggingface.co/facebook/esm2_t33_650M_UR50D>) | collection / pretrained | protein-language-modelling, protein-embedding, protein-structure-prediction | — | — | pytorch, transformers, pytorch-checkpoint | desktop, server | MIT / MIT | unknown |
| [AlphaFold](pipelines/science/alphafold.yaml) · [upstream](<https://github.com/google-deepmind/alphafold>) | toolkit / pretrained | protein-structure-prediction | — | — | jax | server | Apache-2.0 / unknown | unknown |
| [ColabFold](pipelines/science/colabfold.yaml) · [upstream](<https://github.com/sokrypton/ColabFold>) | toolkit / pretrained | protein-structure-prediction, protein-complex-prediction | — | — | jax, pytorch, pytorch-checkpoint | server, desktop | MIT / unknown | unknown |
| [OpenFold](pipelines/science/openfold.yaml) · [upstream](<https://github.com/aqlaboratory/openfold>) | toolkit / requires-training | protein-structure-prediction | — | — | pytorch, pytorch-checkpoint | server, desktop | Apache-2.0 / unknown | unknown |
| [statsmodels](pipelines/science/statsmodels.yaml) · [upstream](<https://github.com/statsmodels/statsmodels>) | toolkit / requires-training | statistical-modelling, time-series-analysis, regression | — | — | python, numpy, pickle | embedded, mobile, edge, desktop, server | BSD-3-Clause / not-provided | unknown |

<a id="catalogue-security"></a>

### Security

| Entry / source | Kind / use | Task | Params | Model file | Runtime / format | Target class | License C / W | Compatibility |
|---|---|---|---:|---:|---|---|---|---|
| [Adversarial Robustness Toolbox](pipelines/security/adversarial-robustness-toolbox.yaml) · [upstream](<https://github.com/Trusted-AI/adversarial-robustness-toolbox>) | toolkit / companion | adversarial-attack-testing, model-hardening, poisoning-detection | — | — | python, pytorch, tensorflow | desktop, server | MIT / not-applicable | unknown |
| [Foolbox](pipelines/security/foolbox.yaml) · [upstream](<https://github.com/bethgelab/foolbox>) | toolkit / companion | adversarial-attacks, robustness-evaluation | — | — | pytorch, tensorflow, jax | desktop, server | MIT / not-applicable | unknown |
| [SecML](pipelines/security/secml.yaml) · [upstream](<https://github.com/pralab/secml>) | toolkit / companion | adversarial-attacks, secure-ml-evaluation | — | — | python, pytorch | desktop, server | Apache-2.0 / not-applicable | unknown |
| [CleverHans](pipelines/security/cleverhans.yaml) · [upstream](<https://github.com/tensorflow/cleverhans>) | toolkit / companion | adversarial-examples, robustness-evaluation | — | — | python, tensorflow, pytorch | desktop, server | MIT / not-applicable | unknown |

<a id="catalogue-sensors"></a>

### Sensors

| Entry / source | Kind / use | Task | Params | Model file | Runtime / format | Target class | License C / W | Compatibility |
|---|---|---|---:|---:|---|---|---|---|
| [Bearing Fault Detection](pipelines/sensors/bearing-fault-detection.yaml) · [upstream](<https://github.com/malyvsen/bearing-fault-detection>) | pipeline / requires-training | bearing-fault-detection, predictive-maintenance, anomaly-detection | — | — | python | edge | MIT / unknown | unknown |
| [TensorFlow Lite Micro Magic Wand](catalog/sensors/gesture/tf-micro-magic-wand.yaml) · [upstream](<https://github.com/tensorflow/tflite-micro>) | model / unknown | imu-gesture-recognition | — | — | tflite-micro, tflite | edge | Apache-2.0 / unknown | unknown |
| [STM32 AI Model Zoo](catalog/sensors/model-zoo/stm32ai-modelzoo.yaml) · [upstream](<https://github.com/STMicroelectronics/stm32ai-modelzoo>) | collection / pretrained | keyword-spotting, image-classification, human-activity-recognition, anomaly-detection | — | — | tflite, onnx, stm32cube-ai | edge | unknown / unknown | unknown |
| [SPARROW](pipelines/sensors/sparrow.yaml) · [upstream](<https://github.com/microsoft/SPARROW>) | pipeline / companion | remote-wildlife-monitoring, edge-inference | — | — | python | edge | MIT / not-applicable | unknown |
| [SignalMint](pipelines/sensors/signalmint.yaml) · [upstream](<https://github.com/Charan-Hari/SignalMint>) | pipeline / requires-training | streaming-anomaly-detection, signal-compression | — | — | pytorch, native-c, c-source | edge | MIT / unknown | unknown |
| [TI TinyML Model Zoo](catalog/sensors/model-zoo/ti-tinyml-modelzoo.yaml) · [upstream](<https://github.com/TexasInstruments/tinyml-modelzoo>) | collection / unknown | time-series-classification, forecasting, anomaly-detection, audio-classification, image-classification, radar-classification | — | — | — | edge | unknown / unknown | unknown |
| [Pulse / NanoEdge vibration anomaly detector](catalog/sensors/anomaly/pulse-nanoedge.yaml) · [upstream](<https://github.com/Ayushkothari96/pulse>) | model / unknown | vibration-anomaly-detection | — | — | — | edge | MIT / unknown | unknown |

<a id="catalogue-simulation"></a>

### Simulation

| Entry / source | Kind / use | Task | Params | Model file | Runtime / format | Target class | License C / W | Compatibility |
|---|---|---|---:|---:|---|---|---|---|
| [MuJoCo](primitives/simulation/mujoco.yaml) · [upstream](<https://github.com/google-deepmind/mujoco>) | primitive / unknown | articulated-physics-simulation | — | — | native-c-cpp, python | desktop | Apache-2.0 / not-applicable | luckfox-rv1106: unknown |
| [CARLA](pipelines/simulation/carla.yaml) · [upstream](<https://github.com/carla-simulator/carla>) | pipeline / companion | autonomous-driving-simulation, reinforcement-learning, perception-testing | — | — | python, native-cpp | desktop, server | MIT / not-applicable | unknown |
| [gym-pybullet-drones](pipelines/simulation/gym-pybullet-drones.yaml) · [upstream](<https://github.com/utiasDSL/gym-pybullet-drones>) | pipeline / companion | drone-control, reinforcement-learning, simulation | — | — | python, pybullet | desktop, server | MIT / not-applicable | unknown |
| [AirSim](pipelines/simulation/airsim.yaml) · [upstream](<https://github.com/microsoft/AirSim>) | pipeline / companion | drone-simulation, autonomous-vehicle-simulation, reinforcement-learning | — | — | python, native-cpp | desktop | MIT / not-applicable | unknown |
| [Meta-World](pipelines/simulation/metaworld.yaml) · [upstream](<https://github.com/Farama-Foundation/Metaworld>) | pipeline / companion | meta-reinforcement-learning, robot-manipulation, benchmarking | — | — | python, mujoco | desktop, server | MIT / not-applicable | unknown |
| [Isaac Lab](pipelines/simulation/isaac-lab.yaml) · [upstream](<https://github.com/isaac-sim/IsaacLab>) | pipeline / companion | robot-learning, reinforcement-learning, simulation | — | — | pytorch, omni-isaac | desktop, server | BSD-3-Clause / not-applicable | unknown |
| [robosuite](pipelines/simulation/robosuite.yaml) · [upstream](<https://github.com/ARISE-Initiative/robosuite>) | pipeline / companion | robot-manipulation, simulation, reinforcement-learning | — | — | python, mujoco | desktop, server | MIT / not-applicable | unknown |
| [Genesis](pipelines/simulation/genesis.yaml) · [upstream](<https://github.com/Genesis-Embodied-AI/Genesis>) | pipeline / companion | robotics-simulation, physics-simulation, reinforcement-learning | — | — | python, native-cpp | desktop, server | Apache-2.0 / not-applicable | unknown |

<a id="catalogue-space"></a>

### Space

| Entry / source | Kind / use | Task | Params | Model file | Runtime / format | Target class | License C / W | Compatibility |
|---|---|---|---:|---:|---|---|---|---|
| [deepCR](catalog/space/deepcr.yaml) · [upstream](<https://github.com/profjsb/deepCR>) | collection / pretrained | cosmic-ray-removal, image-restoration | — | — | pytorch, pytorch-checkpoint | desktop, server | BSD-3-Clause / unknown | unknown |
| [ExoMiner](catalog/space/exominer.yaml) · [upstream](<https://github.com/nasa/ExoMiner>) | collection / pretrained | exoplanet-detection, time-series-classification | — | — | tensorflow, tensorflow-savedmodel | server, desktop | unknown / unknown | unknown |
| [astroNN](pipelines/space/astronn.yaml) · [upstream](<https://github.com/henrysky/astroNN>) | toolkit / requires-training | stellar-parameter-estimation, astronomical-classification, spectral-analysis | — | — | tensorflow | desktop, server | MIT / not-provided | unknown |

<a id="catalogue-sports"></a>

### Sports

| Entry / source | Kind / use | Task | Params | Model file | Runtime / format | Target class | License C / W | Compatibility |
|---|---|---|---:|---:|---|---|---|---|
| [Pose2Sim](pipelines/sports/pose2sim.yaml) · [upstream](<https://github.com/perfanalytics/pose2sim>) | toolkit / companion | markerless-motion-capture, sports-biomechanics, 3d-pose-estimation | — | — | python, onnxruntime | desktop | BSD-3-Clause / not-provided | unknown |
| [Basketball Analytics](pipelines/sports/basketball-analytics.yaml) · [upstream](<https://github.com/danchyy/Basketball_Analytics>) | toolkit / companion | sports-analytics, player-tracking, event-detection | — | — | python, opencv | desktop | unknown / not-provided | unknown |
| [Sport Analytics Tools](pipelines/sports/sport-analytics-tools.yaml) · [upstream](<https://github.com/shufinskiy/sport_analytics_tools>) | toolkit / companion | sports-analytics, data-processing | — | — | python | desktop, server | Apache-2.0 / not-applicable | unknown |

<a id="catalogue-telecom"></a>

### Telecom

| Entry / source | Kind / use | Task | Params | Model file | Runtime / format | Target class | License C / W | Compatibility |
|---|---|---|---:|---:|---|---|---|---|
| [TorchSig](pipelines/telecom/torchsig.yaml) · [upstream](<https://github.com/TorchDSP/torchsig>) | toolkit / requires-training | rf-signal-classification, signal-processing, modulation-recognition | — | — | pytorch, pytorch-checkpoint, onnx | desktop, server, edge | MIT / not-provided | unknown |
| [GNU Radio](pipelines/telecom/gnuradio.yaml) · [upstream](<https://github.com/gnuradio/gnuradio>) | toolkit / companion | sdr-signal-processing, rf-dsp | — | — | native-cpp, python | desktop, edge | GPL-3.0 / not-applicable | unknown |

<a id="catalogue-time-series"></a>

### Time series

| Entry / source | Kind / use | Task | Params | Model file | Runtime / format | Target class | License C / W | Compatibility |
|---|---|---|---:|---:|---|---|---|---|
| [CURIE](pipelines/time-series/curie.yaml) · [upstream](<https://github.com/TxusLopez/CURIE>) | toolkit / requires-training | concept-drift-detection, streaming-classification | — | — | python | desktop, server, edge | MIT / not-provided | unknown |
| [tsfresh](pipelines/time-series/tsfresh.yaml) · [upstream](<https://github.com/blue-yonder/tsfresh>) | toolkit / companion | feature-extraction, time-series-classification | — | — | python, scikit-learn | desktop, server, edge | MIT / not-provided | unknown |
| [Chronos-Bolt Tiny](catalog/time-series/forecasting/chronos-bolt-tiny.yaml) · [upstream](<https://huggingface.co/amazon/chronos-bolt-tiny>) | model / pretrained | forecasting | 9M | — | chronos-forecasting, pytorch, safetensors | edge | Apache-2.0 / Apache-2.0 | unknown |
| [DLinear](catalog/time-series/forecasting/dlinear.yaml) · [upstream](<https://github.com/cure-lab/LTSF-Linear>) | model / requires-training | forecasting | — | — | numpy, pytorch, npz | desktop, edge | Apache-2.0 / not-provided | local-process-darwin-arm64-ddf7ff5ebd: reproduced |
| [Darts](pipelines/time-series/darts.yaml) · [upstream](<https://github.com/unit8co/darts>) | toolkit / requires-training | forecasting, anomaly-detection, time-series-classification | — | — | pytorch, python, pytorch-checkpoint | desktop, server, edge | Apache-2.0 / not-provided | unknown |
| [Kats](pipelines/time-series/kats.yaml) · [upstream](<https://github.com/facebookresearch/Kats>) | toolkit / requires-training | forecasting, anomaly-detection, changepoint-detection, time-series-features | — | — | python, pickle | desktop, server | MIT / not-provided | unknown |
| [MOMENT](catalog/time-series/forecasting/moment.yaml) · [upstream](<https://github.com/moment-timeseries-foundation-model/moment>) | collection / pretrained | forecasting, classification, anomaly-detection, imputation | — | — | pytorch, transformers, pytorch-checkpoint | desktop, server, edge | MIT / MIT | unknown |
| [Moirai (uni2ts)](catalog/time-series/forecasting/moirai.yaml) · [upstream](<https://github.com/SalesforceAIResearch/uni2ts>) | collection / pretrained | forecasting | — | — | pytorch, pytorch-checkpoint | desktop, server | Apache-2.0 / unknown | unknown |
| [Orbit](pipelines/time-series/orbit.yaml) · [upstream](<https://github.com/uber/orbit>) | toolkit / requires-training | forecasting, changepoint-detection | — | — | python, stan, pytorch, pickle | desktop, server | Apache-2.0 / not-provided | unknown |
| [PatchTST](catalog/time-series/forecasting/patchtst.yaml) · [upstream](<https://github.com/yuqinie98/PatchTST>) | collection / requires-training | forecasting | — | — | pytorch, pytorch-checkpoint | desktop, server, edge | Apache-2.0 / unknown | unknown |
| [Prophet](pipelines/time-series/prophet.yaml) · [upstream](<https://github.com/facebook/prophet>) | toolkit / requires-training | forecasting | — | — | python, r, stan, pickle, json | desktop, server | MIT / not-provided | unknown |
| [TimesFM](catalog/time-series/forecasting/timesfm.yaml) · [upstream](<https://github.com/google-research/timesfm>) | collection / pretrained | forecasting | — | — | pytorch, jax, pytorch-checkpoint | desktop, server | Apache-2.0 / unknown | unknown |
| [TinyTimeMixer](catalog/time-series/forecasting/tiny-time-mixer.yaml) · [upstream](<https://huggingface.co/ibm-granite/granite-timeseries-ttm-r2>) | model / pretrained | forecasting | — | — | tsfm-public, pytorch, safetensors | edge | Apache-2.0 / Apache-2.0 | unknown |
| [NeuralForecast](pipelines/time-series/neuralforecast.yaml) · [upstream](<https://github.com/Nixtla/neuralforecast>) | toolkit / requires-training | neural-forecasting, forecast-model-evaluation | — | — | python, pytorch | desktop, server | Apache-2.0 / configuration-dependent | unknown |
| [GluonTS](pipelines/time-series/gluonts.yaml) · [upstream](<https://github.com/awslabs/gluonts>) | toolkit / requires-training | probabilistic-forecasting, time-series-model-evaluation | — | — | pytorch, mxnet | desktop, server | Apache-2.0 / not-provided | unknown |
| [Lag-Llama](catalog/time-series/forecasting/lag-llama.yaml) · [upstream](<https://github.com/time-series-foundation-models/lag-llama>) | collection / pretrained | probabilistic-forecasting | — | — | pytorch, pytorch-checkpoint | desktop, server | Apache-2.0 / unknown | unknown |
| [StatsForecast](pipelines/time-series/statsforecast.yaml) · [upstream](<https://github.com/Nixtla/statsforecast>) | toolkit / requires-training | statistical-forecasting, baseline-evaluation | — | — | python | desktop, server | Apache-2.0 / not-provided | unknown |
| [sktime](pipelines/time-series/sktime.yaml) · [upstream](<https://github.com/sktime/sktime>) | toolkit / requires-training | time-series-classification, forecasting, time-series-transformation | — | — | python, scikit-learn, numpy, pickle | desktop, server, edge | BSD-3-Clause / not-provided | unknown |
| [Chronos](catalog/time-series/forecasting/chronos.yaml) · [upstream](<https://huggingface.co/amazon/chronos-t5-small>) | collection / pretrained | time-series-forecasting, zero-shot-forecasting | — | — | pytorch, transformers, onnxruntime, safetensors, onnx | desktop, server, edge | Apache-2.0 / Apache-2.0 | unknown |
| [N-BEATS](catalog/time-series/forecasting/n-beats.yaml) · [upstream](<https://github.com/ServiceNow/N-BEATS>) | collection / requires-training | time-series-forecasting | — | — | pytorch, pytorch-checkpoint | embedded, edge, desktop, server | unknown / unknown | unknown |
| [PyTorch Forecasting](pipelines/time-series/pytorch-forecasting.yaml) · [upstream](<https://github.com/sktime/pytorch-forecasting>) | toolkit / requires-training | time-series-forecasting, probabilistic-forecasting | — | — | pytorch, lightning, pytorch-checkpoint | desktop, server | MIT / not-provided | unknown |

<a id="catalogue-trust-and-safety"></a>

### Trust and safety

| Entry / source | Kind / use | Task | Params | Model file | Runtime / format | Target class | License C / W | Compatibility |
|---|---|---|---:|---:|---|---|---|---|
| [Diffprivlib](pipelines/trust-and-safety/diffprivlib.yaml) · [upstream](<https://github.com/IBM/differential-privacy-library>) | toolkit / companion | differential-privacy, private-statistics | — | — | python, scikit-learn, pickle | embedded, edge, desktop, server | MIT / not-provided | unknown |
| [Opacus](pipelines/trust-and-safety/opacus.yaml) · [upstream](<https://github.com/meta-pytorch/opacus>) | toolkit / companion | differential-privacy, private-training | — | — | pytorch, pytorch-checkpoint | desktop, server | Apache-2.0 / not-provided | unknown |
| [TensorFlow Privacy](pipelines/trust-and-safety/tensorflow-privacy.yaml) · [upstream](<https://github.com/tensorflow/privacy>) | toolkit / companion | differential-privacy, private-training | — | — | tensorflow, savedmodel | desktop, server | Apache-2.0 / not-provided | unknown |
| [Concrete ML](pipelines/trust-and-safety/concrete-ml.yaml) · [upstream](<https://github.com/zama-ai/concrete-ml>) | toolkit / companion | homomorphic-encryption, private-inference | — | — | python, onnx | edge, desktop, server | unknown / not-provided | unknown |
| [TenSEAL](pipelines/trust-and-safety/tenseal.yaml) · [upstream](<https://github.com/OpenMined/TenSEAL>) | toolkit / companion | homomorphic-encryption, private-computation | — | — | python, native-cpp | desktop, server | Apache-2.0 / not-provided | unknown |
| [LIME](pipelines/trust-and-safety/lime.yaml) · [upstream](<https://github.com/marcotcr/lime>) | toolkit / companion | model-explainability, local-explanation | — | — | python, numpy-model | desktop, server | BSD-2-Clause / not-provided | unknown |
| [SHAP](pipelines/trust-and-safety/shap.yaml) · [upstream](<https://github.com/shap/shap>) | toolkit / companion | model-explainability, feature-attribution | — | — | python, numpy-model | desktop, server | MIT / not-provided | unknown |
| [Detoxify](catalog/trust-and-safety/detoxify.yaml) · [upstream](<https://github.com/unitaryai/detoxify>) | collection / pretrained | toxic-content-detection, content-moderation | — | — | pytorch, transformers, pytorch-checkpoint | server, desktop | Apache-2.0 / unknown | unknown |

<a id="catalogue-video"></a>

### Video

| Entry / source | Kind / use | Task | Params | Model file | Runtime / format | Target class | License C / W | Compatibility |
|---|---|---|---:|---:|---|---|---|---|
| [MMAction2](pipelines/video/mmaction2.yaml) · [upstream](<https://github.com/open-mmlab/mmaction2>) | toolkit / requires-training | action-recognition, temporal-action-localization, skeleton-action-recognition | — | — | pytorch, onnx, pytorch-checkpoint | desktop, server, edge | Apache-2.0 / not-provided | unknown |
| [Robust Video Matting (MobileNetV3)](catalog/video/matting/robust-video-matting-mobilenetv3.yaml) · [upstream](<https://github.com/PeterL1n/RobustVideoMatting>) | model / unknown | human-video-matting | — | — | pytorch, onnxruntime, tensorflowjs, coreml, onnx | desktop, browser, mobile | GPL-3.0 / unknown | luckfox-rv1106: unknown |
| [TransNet V2](catalog/video/shot-detection/transnet-v2.yaml) · [upstream](<https://github.com/soCzech/TransNetV2>) | model / unknown | shot-boundary-detection | — | — | tensorflow, pytorch | desktop | MIT / unknown | luckfox-rv1106: unknown |
| [ST-GCN++ (PYSKL)](catalog/video/action-recognition/st-gcnpp.yaml) · [upstream](<https://github.com/kennymckormick/pyskl>) | model / unknown | skeleton-action-recognition | — | — | pytorch | desktop | Apache-2.0 / unknown | luckfox-rv1106: unknown |
| [MoViNet-A0 Streaming](catalog/video/action-recognition/movinet-a0-stream.yaml) · [upstream](<https://storage.googleapis.com/tf_model_garden/vision/movinet/movinet_a0_stream.tflite>) | model / pretrained | video-action-recognition | — | 13 MB | tflite, tensorflow | mobile, desktop | Apache-2.0 / unknown | luckfox-rv1106: unknown |
| [TSM + MobileNetV2 (online)](catalog/video/action-recognition/tsm-mobilenetv2.yaml) · [upstream](<https://github.com/mit-han-lab/temporal-shift-module>) | model / unknown | video-action-recognition, gesture-recognition | — | — | pytorch | edge, desktop | MIT / unknown | luckfox-rv1106: unknown |
| [VideoMAE](catalog/video/action-recognition/videomae.yaml) · [upstream](<https://github.com/MCG-NJU/VideoMAE>) | collection / pretrained | video-classification, action-recognition, video-representations | — | — | pytorch, transformers, pytorch-checkpoint, safetensors | desktop, server | unknown / unknown | unknown |
| [FastDVDnet](catalog/video/denoising/fastdvdnet.yaml) · [upstream](<https://github.com/m-tassano/fastdvdnet>) | model / unknown | video-denoising | — | — | pytorch | desktop | MIT / unknown | luckfox-rv1106: unknown |
| [X-CLIP](catalog/video/action-recognition/x-clip.yaml) · [upstream](<https://github.com/microsoft/VideoX>) | collection / pretrained | video-text-retrieval, zero-shot-video-classification | — | — | pytorch, transformers, pytorch-checkpoint, safetensors | desktop, server | unknown / unknown | unknown |

<a id="catalogue-vision"></a>

### Vision

| Entry / source | Kind / use | Task | Params | Model file | Runtime / format | Target class | License C / W | Compatibility |
|---|---|---|---:|---:|---|---|---|---|
| [VideoPose3D](catalog/vision/pose/videopose3d.yaml) · [upstream](<https://github.com/facebookresearch/VideoPose3D>) | model / unknown | 2d-to-3d-pose-lifting | — | — | pytorch | desktop | CC-BY-NC / CC-BY-NC | luckfox-rv1106: unknown |
| [rembg](pipelines/vision/rembg.yaml) · [upstream](<https://github.com/danielgatis/rembg>) | toolkit / pretrained | background-removal, image-segmentation | — | — | onnxruntime, onnx | desktop, server, edge | MIT / unknown | unknown |
| [MMPose](pipelines/vision/mmpose.yaml) · [upstream](<https://github.com/open-mmlab/mmpose>) | toolkit / requires-training | body-pose-estimation, hand-pose-estimation, face-landmark | — | — | pytorch, onnxruntime, openvino, onnx, pytorch-checkpoint | desktop, server, edge | Apache-2.0 / not-provided | unknown |
| [MediaPipe Pose Landmarker Lite](catalog/vision/pose/mediapipe-pose-lite.yaml) · [upstream](<https://github.com/google-ai-edge/mediapipe>) | model / unknown | body-pose-estimation | — | — | mediapipe, tflite, mediapipe-task | mobile, browser, desktop | Apache-2.0 / unknown | luckfox-rv1106: unknown |
| [RTMPose-t](catalog/vision/pose/rtmpose-t.yaml) · [upstream](<https://github.com/open-mmlab/mmpose/tree/main/projects/rtmpose>) | model / pretrained | body-pose-estimation | 3.34M | — | mmpose, onnxruntime, pytorch-checkpoint, onnx | edge, desktop | Apache-2.0 / unknown | luckfox-rv1106: unknown |
| [Donut](catalog/vision/document/donut.yaml) · [upstream](<https://huggingface.co/naver-clova-ix/donut-base>) | collection / pretrained | document-understanding, ocr-free-parsing, information-extraction | — | — | transformers, onnxruntime, safetensors, onnx | desktop, server | MIT / MIT | unknown |
| [LayoutLMv3](catalog/vision/document/layoutlmv3.yaml) · [upstream](<https://huggingface.co/microsoft/layoutlmv3-base>) | collection / pretrained | document-understanding, form-parsing, information-extraction | — | — | transformers, onnxruntime, safetensors, onnx | desktop, server, edge | MIT / MIT | unknown |
| [Coral Edge TPU Examples](pipelines/vision/coral-edge-tpu.yaml) · [upstream](<https://github.com/google-coral/tflite>) | toolkit / companion | edge-tpu-inference, image-classification, object-detection | — | — | tflite, edgetpu | edge | Apache-2.0 / not-applicable | unknown |
| [DepthAI](pipelines/vision/depthai.yaml) · [upstream](<https://github.com/luxonis/depthai>) | pipeline / companion | edge-vision, depth-estimation, object-detection, spatial-inference | — | — | depthai-native, openvino, blob, onnx | edge, robot | MIT / not-applicable | luxonis-oak: reported |
| [BlazeFace](catalog/vision/face/blazeface.yaml) · [upstream](<https://github.com/google-ai-edge/mediapipe>) | model / unknown | face-detection | — | — | mediapipe, tflite | edge | Apache-2.0 / unknown | unknown |
| [ESP-WHO](pipelines/vision/esp-who.yaml) · [upstream](<https://github.com/espressif/esp-who>) | toolkit / pretrained | face-detection, face-recognition, esp32-vision | — | — | esp-dl, tflite | edge | Apache-2.0 / unknown | esp32: reported |
| [InsightFace](pipelines/vision/insightface.yaml) · [upstream](<https://github.com/deepinsight/insightface>) | toolkit / pretrained | face-detection, face-recognition, face-alignment | — | — | onnxruntime, pytorch, mxnet, onnx | mobile, edge, desktop, server | MIT / unknown | unknown |
| [DeepFace](pipelines/vision/deepface.yaml) · [upstream](<https://github.com/serengil/deepface>) | toolkit / pretrained | face-recognition, face-attribute-analysis, face-verification | — | — | tensorflow, onnxruntime, pytorch, onnx | desktop, server, edge | MIT / unknown | unknown |
| [face_recognition](pipelines/vision/face-recognition.yaml) · [upstream](<https://github.com/ageitgey/face_recognition>) | toolkit / pretrained | face-recognition, face-detection, face-encoding | — | — | python, dlib | desktop, server, edge | MIT / unknown | unknown |
| [CodeFormer](catalog/vision/enhancement/codeformer.yaml) · [upstream](<https://github.com/sczhou/CodeFormer>) | collection / pretrained | face-restoration, image-restoration | — | — | pytorch, pytorch-checkpoint | desktop, server | S-Lab-1.0 / unknown | unknown |
| [GFPGAN](catalog/vision/enhancement/gfpgan.yaml) · [upstream](<https://github.com/TencentARC/GFPGAN>) | collection / pretrained | face-restoration, image-restoration | — | — | pytorch, pytorch-checkpoint | desktop, server | Apache-2.0 / unknown | unknown |
| [BLIP-2 (LAVIS)](catalog/vision/vlm/blip2-lavis.yaml) · [upstream](<https://github.com/salesforce/LAVIS>) | collection / pretrained | image-captioning, visual-question-answering, image-text-retrieval | — | — | pytorch, pytorch-checkpoint | desktop, server | BSD-3-Clause / unknown | unknown |
| [Florence-2](catalog/vision/vlm/florence-2.yaml) · [upstream](<https://huggingface.co/microsoft/Florence-2-large>) | collection / pretrained | image-captioning, object-detection, ocr, grounding | — | — | transformers, onnxruntime, safetensors, onnx | desktop, edge, server | MIT / MIT | unknown |
| [SmolVLM](catalog/vision/vlm/smolvlm.yaml) · [upstream](<https://huggingface.co/HuggingFaceTB/SmolVLM-256M-Instruct>) | collection / pretrained | image-captioning, visual-question-answering, on-device-vlm | — | — | transformers, onnxruntime, mlx, safetensors, onnx | mobile, edge, desktop | Apache-2.0 / Apache-2.0 | unknown |
| [CVNets](catalog/vision/classification/apple-cvnets.yaml) · [upstream](<https://github.com/apple/ml-cvnets>) | collection / pretrained | image-classification, object-detection, semantic-segmentation | — | — | pytorch, coreml, onnxruntime, pytorch-checkpoint, onnx | mobile, edge, desktop, server | unknown / unknown | unknown |
| [FastViT](catalog/vision/classification/apple-fastvit.yaml) · [upstream](<https://github.com/apple/ml-fastvit>) | collection / pretrained | image-classification, feature-extraction | — | — | pytorch, coreml, pytorch-checkpoint | mobile, edge, desktop | unknown / unknown | unknown |
| [MMPreTrain](pipelines/vision/mmpretrain.yaml) · [upstream](<https://github.com/open-mmlab/mmpretrain>) | toolkit / requires-training | image-classification, feature-extraction, self-supervised-learning | — | — | pytorch, onnxruntime, onnx, pytorch-checkpoint | desktop, server, edge | Apache-2.0 / not-provided | unknown |
| [MobileNetV3 Small](catalog/vision/classification/mobilenetv3-small.yaml) · [upstream](<https://github.com/tensorflow/models>) | model / unknown | image-classification, feature-extraction | — | — | tensorflow | edge | Apache-2.0 / unknown | unknown |
| [MobileOne](catalog/vision/classification/mobileone.yaml) · [upstream](<https://github.com/apple/ml-mobileone>) | collection / pretrained | image-classification, feature-extraction | — | — | pytorch, coreml, onnxruntime, pytorch-checkpoint, onnx | mobile, edge, desktop | unknown / unknown | unknown |
| [TorchVision Models](catalog/vision/classification/torchvision-models.yaml) · [upstream](<https://github.com/pytorch/vision>) | collection / pretrained | image-classification, object-detection, semantic-segmentation, video-classification | — | — | pytorch, onnxruntime, pytorch-checkpoint, onnx | mobile, desktop, server | BSD-3-Clause / unknown | unknown |
| [Torchvision](pipelines/vision/torchvision.yaml) · [upstream](<https://github.com/pytorch/vision>) | toolkit / companion | image-classification, object-detection, segmentation, video | — | — | pytorch, onnxruntime, pytorch-checkpoint, onnx | desktop, server, edge | BSD-3-Clause / not-provided | unknown |
| [timm (PyTorch Image Models)](catalog/vision/classification/timm.yaml) · [upstream](<https://github.com/huggingface/pytorch-image-models>) | collection / pretrained | image-classification, feature-extraction | — | — | pytorch, onnxruntime, pytorch-checkpoint, onnx | mobile, edge, desktop, server | Apache-2.0 / unknown | unknown |
| [DINOv2](catalog/vision/embeddings/dinov2.yaml) · [upstream](<https://github.com/facebookresearch/dinov2>) | collection / pretrained | image-embeddings, self-supervised-representations, feature-extraction | — | — | pytorch, pytorch-checkpoint | desktop, server | Apache-2.0 / unknown | unknown |
| [Core ML Stable Diffusion](pipelines/vision/ml-stable-diffusion.yaml) · [upstream](<https://github.com/apple-aiml-research/ml-stable-diffusion>) | toolkit / companion | image-generation, diffusion-inference | — | — | coreml | mobile, desktop, edge | MIT / not-provided | unknown |
| [Diffusers](pipelines/vision/diffusers.yaml) · [upstream](<https://github.com/huggingface/diffusers>) | toolkit / companion | image-generation, diffusion-inference | — | — | pytorch, onnxruntime, safetensors, onnx | desktop, server | Apache-2.0 / not-provided | unknown |
| [Latent Consistency Models (LCM)](catalog/vision/generative/latent-consistency.yaml) · [upstream](<https://huggingface.co/SimianLuo/LCM_Dreamshaper_v7>) | collection / pretrained | image-generation, diffusion-inference | — | — | diffusers, onnxruntime, safetensors | desktop, edge, server | MIT / unknown | unknown |
| [SDXL-Turbo / SD-Turbo](catalog/vision/generative/sdxl-turbo.yaml) · [upstream](<https://huggingface.co/stabilityai/sdxl-turbo>) | collection / pretrained | image-generation, diffusion-inference | — | — | diffusers, onnxruntime, coreml, safetensors, onnx | desktop, server, edge | MIT / Stability-AI-Community-License | unknown |
| [StyleGAN3](catalog/vision/generative/stylegan3.yaml) · [upstream](<https://github.com/NVlabs/stylegan3>) | collection / pretrained | image-generation, generative-modelling | — | — | pytorch, pytorch-checkpoint | server, desktop | NVIDIA-Source-Code-License / unknown | unknown |
| [OpenCV](pipelines/vision/opencv.yaml) · [upstream](<https://github.com/opencv/opencv>) | toolkit / companion | image-processing, classical-cv, dnn-inference | — | — | native-cpp, python, opencv-dnn, onnxruntime, onnx, caffemodel, tflite | embedded, mobile, edge, desktop, server | Apache-2.0 / not-provided | unknown |
| [EfficientSAM](catalog/vision/segmentation/efficient-sam.yaml) · [upstream](<https://github.com/yformer/EfficientSAM>) | collection / pretrained | image-segmentation, edge-segmentation | — | — | pytorch, onnxruntime, pytorch-checkpoint, onnx | mobile, edge, desktop | Apache-2.0 / unknown | unknown |
| [MobileSAM](catalog/vision/segmentation/mobile-sam.yaml) · [upstream](<https://github.com/ChaoningZhang/MobileSAM/blob/master/weights/mobile_sam.pt>) | model / pretrained | image-segmentation | 9.66M | — | pytorch, pytorch-checkpoint | edge | Apache-2.0 / unknown | unknown |
| [Segment Anything (SAM)](catalog/vision/segmentation/segment-anything.yaml) · [upstream](<https://huggingface.co/facebook/sam-vit-base>) | collection / pretrained | image-segmentation, promptable-segmentation | — | — | pytorch, onnxruntime, pytorch-checkpoint, onnx | desktop, server, edge | Apache-2.0 / Apache-2.0 | unknown |
| [RFDN](catalog/vision/super-resolution/rfdn.yaml) · [upstream](<https://github.com/njulj/RFDN>) | model / unknown | image-super-resolution | — | — | pytorch | desktop | MIT / unknown | luckfox-rv1106: unknown |
| [Real-ESRGAN](catalog/vision/super-resolution/real-esrgan.yaml) · [upstream](<https://github.com/xinntao/Real-ESRGAN>) | collection / pretrained | image-super-resolution, image-restoration | — | — | pytorch, ncnn, onnxruntime, pytorch-checkpoint, onnx | desktop, server, edge | BSD-3-Clause / unknown | unknown |
| [Big Vision (SigLIP)](catalog/vision/embeddings/big-vision.yaml) · [upstream](<https://github.com/google-research/big_vision>) | collection / pretrained | image-text-similarity, zero-shot-image-classification, embeddings | — | — | jax, pytorch, transformers, safetensors | desktop, server | Apache-2.0 / unknown | unknown |
| [CLIP](catalog/vision/embeddings/clip.yaml) · [upstream](<https://github.com/openai/CLIP>) | collection / pretrained | image-text-similarity, zero-shot-image-classification, embeddings | — | — | pytorch, onnxruntime, pytorch-checkpoint, onnx | desktop, server, edge | MIT / unknown | unknown |
| [MobileCLIP2-S0](catalog/vision/embeddings/mobileclip2-s0.yaml) · [upstream](<https://github.com/apple-aiml-research/ml-mobileclip>) | model / unknown | image-text-similarity, zero-shot-image-classification | 74.8M | — | pytorch, openclip | mobile, desktop | MIT / Apple-ML-Research-Model-TOU | luckfox-rv1106: unknown |
| [OpenCLIP](catalog/vision/embeddings/open-clip.yaml) · [upstream](<https://github.com/mlfoundations/open_clip>) | collection / pretrained | image-text-similarity, zero-shot-image-classification, embeddings | — | — | pytorch, onnxruntime, pytorch-checkpoint, onnx | desktop, server, edge | MIT / unknown | unknown |
| [SuperPoint](catalog/vision/features/superpoint.yaml) · [upstream](<https://github.com/magicleap/SuperPointPretrainedNetwork>) | model / unknown | keypoint-detection, descriptor-extraction | 1.3M | — | pytorch | edge | noncommercial-research-only / unknown | unknown |
| [Zero-DCE++](catalog/vision/enhancement/zero-dce-plus-plus.yaml) · [upstream](<https://github.com/Li-Chongyi/Zero-DCE_extension>) | model / unknown | low-light-enhancement | 10K | — | pytorch | desktop | CC-BY-NC-4.0 / unknown | luckfox-rv1106: unknown |
| [FreeMoCap](pipelines/motion-capture/freemocap.yaml) · [upstream](<https://github.com/freemocap/freemocap>) | pipeline / unknown | markerless-motion-capture | — | — | python | desktop | AGPL-3.0 / unknown | luckfox-rv1106: unknown |
| [Depth Anything V2 Small](catalog/vision/depth/depth-anything-v2-small.yaml) · [upstream](<https://huggingface.co/depth-anything/Depth-Anything-V2-Small>) | model / pretrained | monocular-depth-estimation | 24.8M | — | pytorch, pytorch-checkpoint | desktop | Apache-2.0 / Apache-2.0 | luckfox-rv1106: unknown |
| [Depth Pro](catalog/vision/depth/apple-depth-pro.yaml) · [upstream](<https://github.com/apple/ml-depth-pro>) | collection / pretrained | monocular-depth-estimation, metric-depth | — | — | pytorch, pytorch-checkpoint | desktop, server | unknown / unknown | unknown |
| [FastDepth](catalog/vision/depth/fastdepth.yaml) · [upstream](<https://github.com/dwofk/fast-depth>) | model / unknown | monocular-depth-estimation | — | — | pytorch | edge | MIT / unknown | unknown |
| [Lite-Mono](catalog/vision/depth/lite-mono.yaml) · [upstream](<https://github.com/noahzn/Lite-Mono>) | model / unknown | monocular-depth-estimation | — | — | pytorch | desktop | MIT / unknown | luckfox-rv1106: unknown |
| [MiDaS](catalog/vision/depth/midas.yaml) · [upstream](<https://github.com/isl-org/MiDaS>) | collection / pretrained | monocular-depth-estimation | — | — | pytorch, onnxruntime, pytorch-checkpoint, onnx, tflite | mobile, edge, desktop | MIT / unknown | unknown |
| [ZipDepth](catalog/vision/depth/zipdepth.yaml) · [upstream](<https://github.com/fabiotosi92/ZipDepth>) | model / unknown | monocular-depth-estimation | 6.1M | — | pytorch, onnxruntime, onnx | mobile, edge, desktop | MIT / unknown | luckfox-rv1106: unknown |
| [EasyMocap](pipelines/motion-capture/easymocap.yaml) · [upstream](<https://github.com/zju3dv/EasyMocap>) | toolkit / unknown | motion-capture, multi-view-pose-fitting | — | — | pytorch, opencv | desktop | Project-Registration-License-1.0 / unknown | luckfox-rv1106: unknown |
| [ByteTrack](catalog/vision/tracking/bytetrack.yaml) · [upstream](<https://github.com/ifzhang/ByteTrack>) | pipeline / unknown | multi-object-tracking | — | — | pytorch | edge | MIT / unknown | unknown |
| [Deep SORT](primitives/vision/deep-sort.yaml) · [upstream](<https://github.com/nwojke/deep_sort>) | primitive / companion | multi-object-tracking | — | — | python, tensorflow | desktop, edge, server | GPL-3.0 / not-applicable | unknown |
| [Norfair](pipelines/vision/norfair.yaml) · [upstream](<https://github.com/tryolabs/norfair>) | toolkit / companion | multi-object-tracking, tracking | — | — | python, numpy | desktop, edge, server | MIT / not-applicable | unknown |
| [OC-SORT](catalog/vision/tracking/oc-sort.yaml) · [upstream](<https://github.com/noahcao/OC_SORT>) | collection / companion | multi-object-tracking | — | — | python, pytorch | desktop, server, edge | MIT / unknown | unknown |
| [SORT](primitives/vision/sort.yaml) · [upstream](<https://github.com/abewley/sort>) | primitive / companion | multi-object-tracking | — | — | python, numpy | desktop, edge, server | GPL-3.0 / not-applicable | unknown |
| [Lightweight 3D Human Pose Demo](pipelines/pose/lightweight-3d-pose.yaml) · [upstream](<https://github.com/Daniil-Osokin/lightweight-human-pose-estimation-3d-demo.pytorch>) | pipeline / unknown | multi-person-3d-pose | — | — | pytorch, openvino | desktop | Apache-2.0 / unknown | luckfox-rv1106: unknown |
| [OpenPose](catalog/vision/pose/openpose.yaml) · [upstream](<https://github.com/CMU-Perceptual-Computing-Lab/openpose>) | collection / pretrained | multi-person-pose-estimation, hand-pose-estimation, face-landmark | — | — | native-cpp, caffe, caffemodel | desktop, server, edge | unknown / unknown | unknown |
| [Depth Anything 3 Small](catalog/vision/depth/depth-anything-3-small.yaml) · [upstream](<https://github.com/ByteDance-Seed/Depth-Anything-3>) | model / unknown | multi-view-depth-estimation, camera-pose-estimation | 80M | — | pytorch | desktop | Apache-2.0 / Apache-2.0 | luckfox-rv1106: unknown |
| [ImageBind](catalog/vision/embeddings/imagebind.yaml) · [upstream](<https://github.com/facebookresearch/ImageBind>) | collection / pretrained | multimodal-embeddings, cross-modal-retrieval | — | — | pytorch, pytorch-checkpoint | desktop, server | CC-BY-NC-SA-4.0 / unknown | unknown |
| [D-FINE](catalog/vision/detection/d-fine.yaml) · [upstream](<https://github.com/Peterande/D-FINE>) | collection / pretrained | object-detection, real-time-detection | — | — | pytorch, onnxruntime, pytorch-checkpoint, onnx | mobile, edge, desktop, server | Apache-2.0 / unknown | unknown |
| [DETR](catalog/vision/detection/detr.yaml) · [upstream](<https://github.com/facebookresearch/detr>) | collection / pretrained | object-detection | — | — | pytorch, pytorch-checkpoint, onnx | desktop, server, edge | Apache-2.0 / unknown | unknown |
| [Detectron2](pipelines/vision/detectron2.yaml) · [upstream](<https://github.com/facebookresearch/detectron2>) | toolkit / requires-training | object-detection, instance-segmentation, keypoint-detection | — | — | pytorch, onnxruntime, pytorch-checkpoint, onnx | desktop, server | Apache-2.0 / not-provided | unknown |
| [EfficientDet-Lite0](catalog/vision/detection/efficientdet-lite0.yaml) · [upstream](<https://www.tensorflow.org/lite/examples/object_detection/overview>) | model / unknown | object-detection | — | — | tflite | edge | unknown / unknown | unknown |
| [LibreYOLO](pipelines/vision/libreyolo.yaml) · [upstream](<https://github.com/LibreYOLO/libreyolo>) | toolkit / requires-training | object-detection, pose-estimation, instance-segmentation | — | — | pytorch, onnxruntime, onnx | edge, desktop, server | MIT / not-provided | unknown |
| [MMDetection](pipelines/vision/mmdetection.yaml) · [upstream](<https://github.com/open-mmlab/mmdetection>) | toolkit / requires-training | object-detection, instance-segmentation | — | — | pytorch, onnxruntime, onnx | desktop, server, edge | Apache-2.0 / not-provided | unknown |
| [NanoDet-Plus](catalog/vision/detection/nanodet-plus.yaml) · [upstream](<https://github.com/RangiLyu/nanodet#model-zoo>) | model / pretrained | object-detection | 1.17M | — | ncnn, MNN, openvino, onnx | edge | Apache-2.0 / unknown | unknown |
| [OpenCV Zoo](catalog/vision/classification/opencv-zoo.yaml) · [upstream](<https://github.com/opencv/opencv_zoo>) | collection / pretrained | object-detection, image-classification, face-detection, human-segmentation | — | — | opencv, onnxruntime, tflite, onnx, caffemodel | mobile, edge, desktop, server | Apache-2.0 / unknown | unknown |
| [PaddleDetection](pipelines/vision/paddledetection.yaml) · [upstream](<https://github.com/PaddlePaddle/PaddleDetection>) | toolkit / requires-training | object-detection, instance-segmentation, keypoint-detection, tracking | — | — | paddle, paddle-lite, onnxruntime, onnx | mobile, edge, desktop, server | Apache-2.0 / not-provided | unknown |
| [RT-DETR](catalog/vision/detection/rt-detr.yaml) · [upstream](<https://github.com/lyuwenyu/RT-DETR>) | collection / pretrained | object-detection, real-time-detection | — | — | pytorch, onnxruntime, pytorch-checkpoint, onnx | mobile, edge, desktop, server | Apache-2.0 / unknown | unknown |
| [Ultralytics YOLO](catalog/vision/detection/ultralytics.yaml) · [upstream](<https://github.com/ultralytics/ultralytics>) | collection / pretrained | object-detection, instance-segmentation, pose-estimation, image-classification | — | — | pytorch, onnxruntime, tflite, openvino, pytorch-checkpoint, onnx, openvino-ir | mobile, edge, desktop, server | AGPL-3.0 / AGPL-3.0 | unknown |
| [YOLOX](catalog/vision/detection/yolox.yaml) · [upstream](<https://github.com/Megvii-BaseDetection/YOLOX>) | collection / pretrained | object-detection | — | — | pytorch, onnxruntime, openvino, onnx, openvino-ir | mobile, edge, desktop, server | Apache-2.0 / unknown | unknown |
| [EasyOCR](pipelines/vision/easyocr.yaml) · [upstream](<https://github.com/JaidedAI/EasyOCR>) | toolkit / pretrained | ocr, text-detection, text-recognition | — | — | pytorch, onnxruntime, pytorch-checkpoint | desktop, server, edge | Apache-2.0 / unknown | unknown |
| [PP-OCRv6 Tiny](catalog/vision/ocr/pp-ocrv6-tiny.yaml) · [upstream](<https://github.com/PaddlePaddle/PaddleOCR>) | model / unknown | ocr | 1.5M | — | paddle | edge | Apache-2.0 / unknown | unknown |
| [PaddleOCR](pipelines/vision/paddleocr.yaml) · [upstream](<https://github.com/PaddlePaddle/PaddleOCR>) | toolkit / pretrained | ocr, text-detection, text-recognition, document-structure | — | — | paddle, paddle-lite, onnxruntime, onnx | mobile, edge, desktop, server | Apache-2.0 / not-provided | unknown |
| [Surya](pipelines/vision/surya.yaml) · [upstream](<https://github.com/VikParuchuri/surya>) | toolkit / pretrained | ocr, layout-analysis, table-recognition, reading-order | — | — | pytorch, pytorch-checkpoint | desktop, server | Apache-2.0 / unknown | unknown |
| [docTR](pipelines/vision/doctr.yaml) · [upstream](<https://github.com/mindee/doctr>) | toolkit / pretrained | ocr, document-text-detection, document-text-recognition | — | — | pytorch, tensorflow, onnxruntime, onnx, tflite, pytorch-checkpoint | desktop, server, edge | Apache-2.0 / unknown | unknown |
| [Grounding DINO](catalog/vision/detection/grounding-dino.yaml) · [upstream](<https://huggingface.co/IDEA-Research/grounding-dino-tiny>) | collection / pretrained | open-vocabulary-detection, text-conditioned-detection, zero-shot-detection | — | — | pytorch, onnxruntime, pytorch-checkpoint, onnx | desktop, server, edge | Apache-2.0 / Apache-2.0 | unknown |
| [Tesseract OCR](pipelines/vision/tesseract.yaml) · [upstream](<https://github.com/tesseract-ocr/tesseract>) | primitive / pretrained | optical-character-recognition | — | — | native-cpp, python, traineddata | embedded, mobile, edge, desktop, server | Apache-2.0 / not-provided | unknown |
| [Deep Person ReID (torchreid)](catalog/vision/tracking/deep-person-reid.yaml) · [upstream](<https://github.com/KaiyangZhou/deep-person-reid>) | collection / requires-training | person-re-identification, metric-learning, tracking | — | — | pytorch, pytorch-checkpoint, onnx | desktop, server, edge | MIT / unknown | unknown |
| [MediaPipe](pipelines/vision/mediapipe.yaml) · [upstream](<https://github.com/google-ai-edge/mediapipe>) | toolkit / companion | pose-estimation, face-detection, hand-tracking, object-detection | — | — | tflite, mediapipe-task | mobile, browser, desktop, edge | Apache-2.0 / unknown | unknown |
| [MoveNet Lightning](catalog/vision/pose/movenet-lightning.yaml) · [upstream](<https://www.tensorflow.org/hub/tutorials/movenet>) | model / pretrained | pose-estimation | — | 2.9 MB | tflite | edge | Apache-2.0 / unknown | unknown |
| [rtmlib](pipelines/pose/rtmlib.yaml) · [upstream](<https://github.com/Tau-J/rtmlib>) | toolkit / companion | pose-inference, pose-tracking | — | — | onnxruntime, python, onnx | desktop | Apache-2.0 / unknown | luckfox-rv1106: unknown; local-process-darwin-arm64-ddf7ff5ebd: reproduced |
| [U^2-Net](catalog/vision/segmentation/u2net.yaml) · [upstream](<https://github.com/xuebinqin/U-2-Net>) | collection / pretrained | salient-object-detection, background-removal, image-segmentation | — | — | pytorch, onnxruntime, pytorch-checkpoint, onnx | desktop, edge | Apache-2.0 / unknown | unknown |
| [MMSegmentation](pipelines/vision/mmsegmentation.yaml) · [upstream](<https://github.com/open-mmlab/mmsegmentation>) | toolkit / requires-training | semantic-segmentation, scene-parsing | — | — | pytorch, onnxruntime, onnx, pytorch-checkpoint | desktop, server, edge | Apache-2.0 / not-provided | unknown |
| [PIDNet-S](catalog/vision/segmentation/pidnet-s.yaml) · [upstream](<https://github.com/XuJiacong/PIDNet>) | model / unknown | semantic-segmentation | — | — | pytorch | desktop | MIT / unknown | luckfox-rv1106: unknown |
| [Segmentation Models PyTorch](catalog/vision/segmentation/segmentation-models-pytorch.yaml) · [upstream](<https://github.com/qubvel/segmentation_models.pytorch>) | collection / pretrained | semantic-segmentation, instance-segmentation | — | — | pytorch, onnxruntime, pytorch-checkpoint, onnx | mobile, edge, desktop, server | MIT / unknown | unknown |
| [MegaDetector-Classifier](pipelines/vision/megadetector-classifier.yaml) · [upstream](<https://github.com/microsoft/MegaDetector-Classifier>) | toolkit / requires-training | species-classification, model-fine-tuning | — | — | pytorch, pytorch-checkpoint | desktop, server | MIT / not-provided | unknown |
| [SpeciesNet](catalog/vision/classification/speciesnet.yaml) · [upstream](<https://github.com/google/cameratrapai>) | collection / pretrained | species-classification, wildlife-detection | — | — | pytorch, pytorch-checkpoint | desktop, server, edge | Apache-2.0 / unknown | unknown |
| [LightStereo (OpenStereo)](catalog/vision/depth/lightstereo.yaml) · [upstream](<https://github.com/XiandaGuo/OpenStereo>) | model / unknown | stereo-depth-estimation | — | — | pytorch | desktop | academic-noncommercial-only / unknown | luckfox-rv1106: unknown |
| [Table Transformer](catalog/vision/document/table-transformer.yaml) · [upstream](<https://huggingface.co/microsoft/table-transformer-detection>) | collection / pretrained | table-detection, table-structure-recognition, document-understanding | — | — | transformers, onnxruntime, safetensors, onnx | desktop, server, edge | MIT / MIT | unknown |
| [CosmoEdge](pipelines/vision/cosmo-edge.yaml) · [upstream](<https://github.com/cosmo-wander-ai/cosmo-edge>) | pipeline / companion | video-analytics, on-device-vlm, object-detection | — | — | native-cpp, rknn, onnx | edge | Apache-2.0 / not-applicable | unknown |
| [SAM 2](catalog/vision/segmentation/sam2.yaml) · [upstream](<https://github.com/facebookresearch/sam2>) | collection / pretrained | video-segmentation, promptable-segmentation, object-tracking | — | — | pytorch, onnxruntime, pytorch-checkpoint, onnx | desktop, server, edge | Apache-2.0 / Apache-2.0 | unknown |
| [Anomalib](pipelines/vision/anomalib.yaml) · [upstream](<https://github.com/openvinotoolkit/anomalib>) | toolkit / requires-training | visual-anomaly-detection, defect-detection | — | — | pytorch, openvino, onnxruntime, onnx, openvino-ir | desktop, server, edge | Apache-2.0 / not-provided | unknown |
| [LLaVA](catalog/vision/vlm/llava.yaml) · [upstream](<https://github.com/haotian-liu/LLaVA>) | collection / pretrained | visual-instruction-following, visual-question-answering, image-captioning | — | — | pytorch, transformers, safetensors | server, desktop | Apache-2.0 / unknown | unknown |
| [FastVLM](catalog/vision/vlm/fastvlm.yaml) · [upstream](<https://huggingface.co/apple/FastVLM-0.5B>) | collection / pretrained | visual-question-answering, image-captioning, on-device-vlm | — | — | mlx, transformers, safetensors | mobile, edge, desktop | unknown / unknown | unknown |
| [InternVL](catalog/vision/vlm/internvl.yaml) · [upstream](<https://huggingface.co/OpenGVLab/InternVL2-2B>) | collection / pretrained | visual-question-answering, image-captioning, ocr, on-device-vlm | — | — | transformers, llama-cpp, lmdeploy, safetensors, gguf | mobile, edge, desktop, server | MIT / Apache-2.0 | unknown |
| [MiniCPM-V](catalog/vision/vlm/minicpm-v.yaml) · [upstream](<https://huggingface.co/openbmb/MiniCPM-V-2_6>) | collection / pretrained | visual-question-answering, ocr, image-captioning, on-device-vlm | — | — | transformers, llama-cpp, safetensors, gguf | mobile, edge, desktop | Apache-2.0 / Apache-2.0 | unknown |
| [MobileVLM](catalog/vision/vlm/mobilevlm.yaml) · [upstream](<https://huggingface.co/mtgv/MobileVLM-1.7B>) | collection / pretrained | visual-question-answering, image-captioning, on-device-vlm | — | — | transformers, llama-cpp, ncnn, safetensors, gguf | mobile, edge, embedded | Apache-2.0 / Apache-2.0 | unknown |
| [Moondream](catalog/vision/vlm/moondream.yaml) · [upstream](<https://huggingface.co/vikhyatk/moondream2>) | collection / pretrained | visual-question-answering, image-captioning, on-device-vlm | — | — | transformers, onnxruntime, safetensors, onnx | edge, desktop, mobile | Apache-2.0 / Apache-2.0 | unknown |
| [PaliGemma](catalog/vision/vlm/paligemma.yaml) · [upstream](<https://huggingface.co/google/paligemma2-3b-pt-224>) | collection / pretrained | visual-question-answering, image-captioning, detection, segmentation | — | — | transformers, jax, safetensors | desktop, edge, server | Apache-2.0 / Gemma-Terms | unknown |
| [Phi-3-Vision](catalog/vision/vlm/phi-3-vision.yaml) · [upstream](<https://huggingface.co/microsoft/Phi-3-vision-128k-instruct>) | collection / pretrained | visual-question-answering, ocr, chart-reasoning, on-device-vlm | — | — | transformers, onnxruntime, safetensors, onnx | desktop, edge, server | MIT / MIT | unknown |
| [Qwen3-VL](catalog/vision/vlm/qwen3-vl.yaml) · [upstream](<https://huggingface.co/Qwen/Qwen3-VL-2B-Instruct>) | collection / pretrained | visual-question-answering, image-captioning, ocr, on-device-vlm | — | — | transformers, llama-cpp, vllm, mlx, safetensors, gguf | mobile, edge, desktop, server | Apache-2.0 / Apache-2.0 | unknown |
| [TinyLLaVA](catalog/vision/vlm/tinyllava.yaml) · [upstream](<https://huggingface.co/bczhou/TinyLLaVA-1.5B>) | collection / pretrained | visual-question-answering, image-captioning, on-device-vlm | — | — | transformers, llama-cpp, safetensors, gguf | mobile, edge, desktop | unknown / unknown | unknown |
| [MegaDetector V6](catalog/vision/detection/megadetector-v6.yaml) · [upstream](<https://github.com/microsoft/MegaDetector>) | collection / pretrained | wildlife-detection, object-detection | 2.3M | — | pytorch, onnxruntime, pytorch-checkpoint, onnx | edge, desktop, server | MIT / MIT, Apache-2.0 or AGPL-3.0 per variant | unknown |
| [PyTorch-Wildlife](pipelines/vision/pytorch-wildlife.yaml) · [upstream](<https://github.com/microsoft/Pytorch-Wildlife>) | toolkit / companion | wildlife-detection, species-classification, conservation-inference | — | — | pytorch, python, pytorch-checkpoint | desktop, server, edge | MIT / not-provided | unknown |

<a id="catalogue-weather"></a>

### Weather

| Entry / source | Kind / use | Task | Params | Model file | Runtime / format | Target class | License C / W | Compatibility |
|---|---|---|---:|---:|---|---|---|---|
| [GraphCast](catalog/weather/forecasting/graphcast.yaml) · [upstream](<https://github.com/google-deepmind/graphcast>) | collection / pretrained | weather-forecasting, medium-range-forecasting | — | — | jax, haiku | desktop, server | Apache-2.0 / unknown | unknown |

<!-- CATALOG:END -->
