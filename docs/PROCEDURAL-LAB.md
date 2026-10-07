# Procedural browser lab

[Open the lab](https://powerpuff-kitty.github.io/embedded-AI/lab/) · [Source](../recipes/procedural/) · [Procedural catalogue](PROCEDURAL.md)

Four runnable, procedural-only fixtures now complement the catalogue. They do not run an LLM, implement a hybrid AI recipe or certify upstream projects on all hardware. Catalogue browsing itself still acquires no generator dependencies.

## Executed components

| Fixture | Pinned upstream | Local integration | Export |
|---|---|---|---|
| Noise field | simplex-noise 4.0.3 | Isolated seeded RNG and bounded four-octave scalar field | Heightfield JSON |
| SVG landscape | Rough.js 4.6.6 + simplex-noise 4.0.3 | Original landscape composition with seeded strokes and numeric-only controls | SVG |
| Tree geometry | EZ-Tree 1.1.0 + Three.js 0.169.0 | Geometry-only adapter; original tree generation, no bark or leaf image loading | OBJ mesh |
| Sound effect | ZzFX 1.4.0 | Sample-generation adapter; seed selects pitch, no eager AudioContext | PCM WAV |

The landscape is not Shan Shui and the tree is not a biological growth model. Leaves in the texture-free preview are geometric billboards. The exported tree is not guaranteed watertight or printable. WAV files contain synthesized samples, not recorded speech or a trained music model.

### Explicit upstream adaptations

EZ-Tree's npm package is pinned and its internal tree entrypoint is selected for the geometry fixture. The texture provider is replaced with a no-image implementation; bark texturing is disabled and leaf maps are null. This avoids loading or redistributing photographic texture assets. The tree-generation algorithm is unchanged.

ZzFX normally creates an AudioContext at module import. The build replaces that initializer with null and fixes its built-in frequency randomness to its midpoint. Only `buildSamples` is called; playback is handled by the host after the Play button. The recipe seed determines application-level pitch variation. This is a synthesis-only adapter, not a test of upstream playback or its randomization API.

These changes are build plugins, not silent edits to node_modules. `upstream-pins.json` contains SHA-256 checks on affected upstream files; uniquely matching patches fail closed after unexpected upstream changes. `package-lock.json` pins the complete dependency tree and package integrity. `build-info.json` records the lock hash, compiled-adapter hash, versions and adaptation notes. Full dependency licence notices ship in `THIRD-PARTY.txt`.

## Run locally

Use Node 22 for this development workflow. The normal catalogue remains separately usable without the lab dependencies.

```sh
npm ci --ignore-scripts
npm run lab:install
npm run lab:test
npm run site:build -- --with-procedural
npm run site:serve
# Open http://127.0.0.1:4173/lab/
```

`npm run lab:build` builds only `dist/lab/`. It must follow a catalogue site build for the surrounding catalogue links to resolve. GitHub Pages installs the pinned optional package and builds the combined site. This change does not publish either npm package.

## Execution and controls

No generator worker is created until Generate or Test repeatability is selected. Every request gets a fresh dedicated worker and isolated random stream. A completed request releases its worker. Stop, control changes, page hiding and navigation terminate outstanding work. Late worker responses and delayed SVG decodes cannot overwrite a newer selection.

Recipes contain exactly four fields: `schema_version`, `adapter`, `seed` and `detail`. Seeds are integers 1–2147483646; detail is an integer 1–4. Unknown fields, unsupported versions and invalid ranges are rejected. Recipe files are limited to 2 KiB. URL parameters round-trip the same controls; loading a recipe or a deep link never starts computation automatically.

Resolution, branch counts, SVG path precision and sound duration are bounded before running upstream code. Output validation checks finite samples, normalized fields, mesh indices, payload size and sound amplitude. There is also a worker timeout. The interface does not accept arbitrary shader, sketch, SVG, JavaScript or model-generated source. Generated SVG is displayed as an image, not inserted into the page DOM. The SVG checks are defence-in-depth for trusted generators, not a general-purpose untrusted-SVG sanitizer.

Audio generation is silent. Only Play creates/resumes an AudioContext. Playback is one bounded voice, with a sample amplitude limit of 0.2, and is stoppable. That is a numerical amplitude cap, not a guarantee of a safe acoustic volume on every device; keep the device volume comfortable.

The built page has a same-origin content-security policy without unsafe-eval. Dependencies are served locally; no remote CDN, model, image asset, telemetry or file upload is required. Use HTTPS or localhost because output hashing requires Web Crypto.

## Measurements and evidence

Test repeatability performs one untimed warm-up followed by eight independently generated outputs. Reports record nearest-rank p50/p95 synchronous generation times, including output validation but excluding module loading, hashing, worker transfer, rendering and playback. Every output is hashed with a type/dimension header and little-endian numeric payloads.

`output_payload_bytes` counts raw numeric or SVG payloads, not object overhead, heap size or process RSS. `process_peak_rss_mb` is deliberately null. Eight equal hashes show only repeatability of that fixture within the tested runtime. They do not guarantee cross-browser, cross-version or cross-architecture equality.

Reports follow [the procedural observation schema](../schema/procedural-observation.schema.json), separate from neural-model/process-RSS records. The validator also reconciles percentiles and repeat hashes:

```sh
npm run lab:observations -- runs/procedural/observations
# Or validate reviewed observations kept under benchmarks/procedural-results:
npm run lab:observations
```

Observations do not automatically change any manifest to reproduced, measured RAM or device-compatible. Upstream family metadata and the three hybrid recipes keep their prior evidence/status boundaries.

## Additional researched projects

These eight entries are documentation-backed additions, not projects executed by the lab:

| Entry | Useful addition | Integration boundary |
|---|---|---|
| [Manifold](../primitives/procedural/manifold.yaml) | Solid geometry, mesh Boolean operations and level sets | Validate manifold input; native and WASM bindings have separate requirements |
| [three-bvh-csg](../primitives/procedural/three-bvh-csg.yaml) | Constructive solid geometry for Three.js | Upstream labels it experimental; watertight brushes required |
| [d3-delaunay](../primitives/procedural/d3-delaunay.yaml) | Voronoi cells and neighbourhood queries | Adds functionality on top of Delaunator; 2D coordinates, not a 3D reconstruction engine |
| [isosurface](../primitives/procedural/isosurface.yaml) | Surface nets, marching cubes and marching tetrahedra | Requires an existing scalar field; resolution and topology need validation |
| [canvas-sketch](../primitives/procedural/canvas-sketch.yaml) | Generative-art authoring and lifecycle | Sketch code is supplied by the application; CLI export and runtime differ |
| [canvas-sketch-util](../primitives/procedural/canvas-sketch-util.yaml) | Seeded randomness, geometry and pen-plotter utilities | Distinct companion package, not a model or turnkey generator |
| [Tone.js](../primitives/procedural/tone-js.yaml) | Synthesizers, musical scheduling and effects | Requires user audio activation; sampled instruments need separate assets |
| [Scribbletune](../primitives/procedural/scribbletune.yaml) | Pattern-based rhythms, melodies and MIDI construction | MIDI is event data; use a synthesizer for audible output |

Primary upstream repositories, maintainer documentation and licence evidence are recorded in each canonical YAML manifest. No device-memory estimates were invented.
