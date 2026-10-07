# Procedural browser lab

Four **runnable procedural fixtures**, not hybrid AI recipes. Each uses pinned upstream generator code and bounded inputs. The general catalogue remains dependency-light: these packages are installed only through the separate lab command. No model, credentials, inference service, camera or microphone is used.

## Run from a checkout

```sh
npm ci --ignore-scripts
npm run lab:install                 # explicit acquisition of the pinned optional npm packages
npm run site:build
npm run lab:build                   # builds dist/procedural, without network access
npm run lab:test                    # actual pinned algorithms in Node
npm run site:serve                  # open /procedural/ on the local server
```

The deployed explorer also links to **Procedural lab**. Press **Generate & verify** to opt in. No generator is loaded or executed before that action. No external CDN requests occur at runtime. A hosted page is not an offline-installable PWA: serve the built files locally for internet-independent operation.

## Fixtures and adaptations

| Adapter | Pinned package | Scope | Output |
|---|---|---|---|
| noise | simplex-noise 4.0.3 | 64–192 squared scalar field; injected local PRNG | Float32 values as JSON |
| svg | roughjs 4.6.6 | 12–36 fixed-style geometric drawing primitives | SVG |
| tree | @dgreenheck/ez-tree 1.1.0 + three 0.169.0 | Depth-2 tree with bounded branch counts; textureless geometry | Vertex/index JSON |
| audio | zzfx 1.4.0 | Bounded sine preset; frequency randomness and noise disabled | Mono PCM WAV |

Primary sources: [simplex-noise](https://github.com/jwagner/simplex-noise.js), [Rough.js](https://github.com/rough-stuff/rough), [EZ-Tree](https://github.com/dgreenheck/ez-tree), [Three.js](https://github.com/mrdoob/three.js), [ZzFX](https://github.com/KilledByAPixel/ZzFX). Package tarball integrity and transitive versions are pinned in `package-lock.json`.

The build performs **two explicit adaptations**. EZ-Tree's texture module is replaced with null texture getters, retaining its geometry algorithm while excluding images and DOM-dependent loading. ZzFX's eager `new AudioContext` is replaced with null, retaining `buildSamples`; the host creates a playback context only after a separate Play click. Neither adaptation certifies the full upstream library in a worker. The builder guards the source replacement and emits package pins, fixture/source/lock/bundle hashes and third-party notices. The tree preview is a Canvas 2D projection of actual 3D triangles, not a Three.js/WebGL performance test.

Only `{adapter, seed, detail}` is accepted. Seed must be an integer 1–2147483647 and detail 1–3; arbitrary code, paths, shaders, URLs and unbounded dimensions are rejected. Workers stop on cancellation, page hide or a 10-second time limit. Audio is under one second, single-voice and gain-limited. Generated SVG is decoded as an image, never inserted as document markup. Output and run-report downloads stay local.

## Evidence

Each run repeats identical inputs three times and compares SHA-256 of the raw output payload, then tries the next seed. Timings include only generator execution, not import, hashing, worker transfer or preview rendering. Byte counts describe the output payload, **not peak memory**. Matching output on one runtime does not promise cross-browser, cross-version or cross-device determinism. In the audio fixture, seeds map to 36 notes; distinct arbitrary seeds can therefore collide.

```sh
# Install these test-only dependencies, then the browser, explicitly:
python3 -m pip install playwright==1.55.0 psutil==7.2.2
python3 -m playwright install chromium
npm run lab:browser
npm run lab:verify
```

Browser checks use a fresh Chromium process tree per adapter, verify no external requests, outputs, exports, permalink reload, cancellation and 390px layout, and save screenshots plus four success reports under `runs/procedural/`. `PLAYWRIGHT_CHROMIUM_EXECUTABLE` can select an already installed browser. Failed checks do not create success observations.

Where available, the runner samples the sum of Chromium process RSS every 20 ms during load, generation, rendering and checks. Shared pages may be double-counted. This is **whole-browser sampled overhead**, not incremental adapter RAM or MCU fit. JavaScript peak heap remains null. The report schema and verifier keep these values distinct from the catalogue's model benchmark and hardware-budget system; these fixture results do not promote upstream compatibility automatically.

CI uploads observations as run-specific artifacts. Reviewed observations may be retained separately under `benchmarks/procedural/`; never overwrite evidence from another environment or silently relabel a documented component as universally reproduced.
