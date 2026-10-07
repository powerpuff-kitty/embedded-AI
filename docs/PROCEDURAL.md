# Procedural generation & simulation

> Generated from canonical YAML. Do not edit by hand; run `npm run index`.

**29 procedural components** and **3 hybrid recipes**. Category memberships overlap; entries are not duplicated.

[Integration guide](PROCEDURAL-GUIDE.md) · [All components](CATALOGUE.md) · [Live procedural view](https://powerpuff-kitty.github.io/embedded-AI/?view=procedural) · [Hybrid recipes](https://powerpuff-kitty.github.io/embedded-AI/?view=hybrid)

A browser library, standalone browser reference, native library, native authoring reference and shader library are different integration scopes. None implies measured device fit. **unknown** is not a negative result; **not-applicable** is not zero. A seed alone is not a cross-version replay guarantee.

## worlds-environments

| Component / source | Integration | Output | Seed / determinism | Code licence | Evidence |
|---|---|---|---|---|---|
| [WaveFunctionCollapse](../primitives/procedural/wavefunctioncollapse.yaml) · [upstream](<https://github.com/mxgmn/WaveFunctionCollapse>) | native-reference | bitmaps and tilemaps | unknown / unknown | MIT | documented |
| [rot.js](../primitives/procedural/rot-js.yaml) · [upstream](<https://github.com/ondras/rot.js>) | browser-library | tilemaps and navigation results | unknown / unknown | BSD-3-Clause | documented |
| [MarkovJunior](../primitives/procedural/markovjunior.yaml) · [upstream](<https://github.com/mxgmn/MarkovJunior>) | native-reference | bitmap and voxel patterns | unknown / unknown | MIT | documented |
| [Infinigen](../primitives/procedural/infinigen.yaml) · [upstream](<https://github.com/princeton-vl/infinigen>) | native-reference | generated scenes and rendered data | unknown / unknown | BSD-3-Clause | documented |
| [THREE.Terrain](../primitives/procedural/three-terrain.yaml) · [upstream](<https://github.com/IceCreamYou/THREE.Terrain>) | browser-library | terrain mesh and height data | unknown / unknown | MIT | documented |
| [FastNoise Lite](../primitives/procedural/fastnoise-lite.yaml) · [upstream](<https://github.com/Auburn/FastNoiseLite>) | native-library | scalar-noise-fields | unknown / unknown | MIT | documented |
| [noise-rs](../primitives/procedural/noise-rs.yaml) · [upstream](<https://github.com/Razaekel/noise-rs>) | native-library | noise fields and optional image outputs | unknown / unknown | MIT OR Apache-2.0 | documented |
| [simplex-noise.js](../primitives/procedural/simplex-noise-js.yaml) · [upstream](<https://github.com/jwagner/simplex-noise.js>) | browser-library | scalar-noise-values | injectable / conditional | MIT | documented |
| [{Shan, Shui}*](../primitives/procedural/shan-shui-inf.yaml) · [upstream](<https://github.com/LingDong-/shan-shui-inf>) | browser-reference | svg-artwork | built-in / conditional | MIT | documented |

## vegetation-ecosystems

| Component / source | Integration | Output | Seed / determinism | Code licence | Evidence |
|---|---|---|---|---|---|
| [CAPOW (Continuous Cellular Automata)](../primitives/artificial-life/capow.yaml) · [upstream](<https://github.com/rudyrucker/capow>) | native-reference | evolved-fields | unknown / unknown | GPL-3.0 | documented |
| [Lenia](../primitives/artificial-life/lenia.yaml) · [upstream](<https://github.com/Chakazul/Lenia>) | browser-reference | evolved-fields | unknown / unknown | MIT | documented |
| [lenia_ca (Rust)](../primitives/artificial-life/lenia-ca.yaml) · [upstream](<https://github.com/BirdbrainEngineer/lenia_ca>) | native-library | evolved-fields | unknown / unknown | MIT | documented |
| [Lindenmayer](../primitives/procedural/lindenmayer.yaml) · [upstream](<https://github.com/nylki/lindenmayer>) | browser-library | expanded symbol sequences | unknown / unknown | MIT | documented |
| [Reaction-Diffusion Playground](../primitives/artificial-life/reaction-diffusion-playground.yaml) · [upstream](<https://github.com/jasonwebb/reaction-diffusion-playground>) | browser-reference | evolved-patterns | unknown / unknown | CC-BY-NC-SA-4.0 | documented |
| [EZ-Tree](../primitives/procedural/ez-tree.yaml) · [upstream](<https://github.com/dgreenheck/ez-tree>) | browser-library | tree geometry | built-in / conditional | MIT | documented |
| [poisson-disk-sampling](../primitives/procedural/poisson-disk-sampling.yaml) · [upstream](<https://github.com/kchapelier/poisson-disk-sampling>) | browser-library | sample-point coordinates | injectable / conditional | MIT | documented |

## images-materials

| Component / source | Integration | Output | Seed / determinism | Code licence | Evidence |
|---|---|---|---|---|---|
| [Reaction-Diffusion Playground](../primitives/artificial-life/reaction-diffusion-playground.yaml) · [upstream](<https://github.com/jasonwebb/reaction-diffusion-playground>) | browser-reference | evolved-patterns | unknown / unknown | CC-BY-NC-SA-4.0 | documented |
| [FastNoise Lite](../primitives/procedural/fastnoise-lite.yaml) · [upstream](<https://github.com/Auburn/FastNoiseLite>) | native-library | scalar-noise-fields | unknown / unknown | MIT | documented |
| [noise-rs](../primitives/procedural/noise-rs.yaml) · [upstream](<https://github.com/Razaekel/noise-rs>) | native-library | noise fields and optional image outputs | unknown / unknown | MIT OR Apache-2.0 | documented |
| [simplex-noise.js](../primitives/procedural/simplex-noise-js.yaml) · [upstream](<https://github.com/jwagner/simplex-noise.js>) | browser-library | scalar-noise-values | injectable / conditional | MIT | documented |
| [Material Maker](../primitives/procedural/material-maker.yaml) · [upstream](<https://github.com/RodZill4/material-maker>) | native-reference | material textures | unknown / unknown | MIT | documented |
| [glNoise](../primitives/procedural/glnoise.yaml) · [upstream](<https://github.com/FarazzShaikh/glNoise>) | shader-library | noise-enabled shader source and values | unknown / unknown | MIT | documented |
| [webgl-noise](../primitives/procedural/webgl-noise.yaml) · [upstream](<https://github.com/ashima/webgl-noise>) | shader-library | shader noise values | unknown / unknown | MIT | documented |
| [Rough.js](../primitives/procedural/rough-js.yaml) · [upstream](<https://github.com/rough-stuff/rough>) | browser-library | svg or canvas drawing | built-in / conditional | MIT | documented |
| [{Shan, Shui}*](../primitives/procedural/shan-shui-inf.yaml) · [upstream](<https://github.com/LingDong-/shan-shui-inf>) | browser-reference | svg-artwork | built-in / conditional | MIT | documented |

## motion-behaviour

| Component / source | Integration | Output | Seed / determinism | Code licence | Evidence |
|---|---|---|---|---|---|
| [THREE.IK](../primitives/procedural/three-ik.yaml) · [upstream](<https://github.com/jsantell/THREE.IK>) | browser-library | updated joint poses | not-applicable / unknown | MIT | documented |
| [closed-chain-ik-js](../primitives/procedural/closed-chain-ik-js.yaml) · [upstream](<https://github.com/gkjohnson/closed-chain-ik-js>) | browser-library | solved joint configurations | not-applicable / unknown | Apache-2.0 | documented |
| [OpenSteer](../primitives/procedural/opensteer.yaml) · [upstream](<https://github.com/meshula/OpenSteer>) | native-library | steering forces and motion updates | unknown / unknown | MIT | documented |
| [Yuka](../primitives/procedural/yuka.yaml) · [upstream](<https://github.com/Mugen87/yuka>) | browser-library | steering and behaviour updates | unknown / unknown | MIT | documented |
| [MuJoCo](../primitives/simulation/mujoco.yaml) · [upstream](<https://github.com/google-deepmind/mujoco>) | native-library | simulated-state, contacts | not-applicable / unknown | Apache-2.0 | documented |

## audio-music

| Component / source | Integration | Output | Seed / determinism | Code licence | Evidence |
|---|---|---|---|---|---|
| [ZzFXM](../primitives/procedural/zzfxm.yaml) · [upstream](<https://github.com/keithclark/ZzFXM>) | browser-library | synthesized music | unknown / unknown | MIT | documented |
| [ZzFX](../primitives/procedural/zzfx.yaml) · [upstream](<https://github.com/KilledByAPixel/ZzFX>) | browser-library | synthesized audio | unknown / unknown | MIT | documented |
| [jsfxr](../primitives/procedural/jsfxr.yaml) · [upstream](<https://github.com/chr15m/jsfxr>) | browser-library | audio buffer or wav | unknown / unknown | Unlicense | documented |

## foundations

| Component / source | Integration | Output | Seed / determinism | Code licence | Evidence |
|---|---|---|---|---|---|
| [Lindenmayer](../primitives/procedural/lindenmayer.yaml) · [upstream](<https://github.com/nylki/lindenmayer>) | browser-library | expanded symbol sequences | unknown / unknown | MIT | documented |
| [FastNoise Lite](../primitives/procedural/fastnoise-lite.yaml) · [upstream](<https://github.com/Auburn/FastNoiseLite>) | native-library | scalar-noise-fields | unknown / unknown | MIT | documented |
| [noise-rs](../primitives/procedural/noise-rs.yaml) · [upstream](<https://github.com/Razaekel/noise-rs>) | native-library | noise fields and optional image outputs | unknown / unknown | MIT OR Apache-2.0 | documented |
| [simplex-noise.js](../primitives/procedural/simplex-noise-js.yaml) · [upstream](<https://github.com/jwagner/simplex-noise.js>) | browser-library | scalar-noise-values | injectable / conditional | MIT | documented |
| [poisson-disk-sampling](../primitives/procedural/poisson-disk-sampling.yaml) · [upstream](<https://github.com/kchapelier/poisson-disk-sampling>) | browser-library | sample-point coordinates | injectable / conditional | MIT | documented |
| [glNoise](../primitives/procedural/glnoise.yaml) · [upstream](<https://github.com/FarazzShaikh/glNoise>) | shader-library | noise-enabled shader source and values | unknown / unknown | MIT | documented |
| [webgl-noise](../primitives/procedural/webgl-noise.yaml) · [upstream](<https://github.com/ashima/webgl-noise>) | shader-library | shader noise values | unknown / unknown | MIT | documented |

## narrative-text

| Component / source | Integration | Output | Seed / determinism | Code licence | Evidence |
|---|---|---|---|---|---|
| [Tracery](../primitives/procedural/tracery.yaml) · [upstream](<https://github.com/galaxykate/tracery>) | browser-library | expanded text | unknown / unknown | Apache-2.0 | documented |

## Hybrid recipes

Design recipes are proposed contracts, **not runnable integrations**. Their component sources do not establish end-to-end performance.

### [Hybrid game-sound director](../pipelines/hybrid/hybrid-game-sound.yaml)

Status: **design**. Components: [smollm](../catalog/language/on-device/smollm.yaml) + [zzfx](../primitives/procedural/zzfx.yaml) + [zzfxm](../primitives/procedural/zzfxm.yaml).

- The model selects approved presets; duration, gain, simultaneous voices and total buffer memory are hard-limited.
- Music patterns and sequences must be supplied; the synthesizer does not autonomously compose them.
- Activate audio through user interaction and keep a deterministic event log; randomized synthesis requires explicit replay tests.

### [Hybrid living-world companion](../pipelines/hybrid/hybrid-living-world.yaml)

Status: **design**. Components: [smollm](../catalog/language/on-device/smollm.yaml) + [ez-tree](../primitives/procedural/ez-tree.yaml) + [yuka](../primitives/procedural/yuka.yaml).

- A simulation ledger owns entity creation, deletion, resources, growth and decay; model output cannot mutate it directly.
- Validate model-proposed intents against an allowlisted JSON schema, budgets and current state.
- Store initial state, event log, RNG state and component versions; rendering never becomes the source of truth.

### [Hybrid procedural-art assistant](../pipelines/hybrid/hybrid-procedural-art.yaml)

Status: **design**. Components: [smollm](../catalog/language/on-device/smollm.yaml) + [shan-shui-inf](../primitives/procedural/shan-shui-inf.yaml) + [rough-js](../primitives/procedural/rough-js.yaml).

- Do not execute model-generated JavaScript, SVG scripts or arbitrary filesystem paths.
- Persist validated parameters, seed and generator versions; sanitize SVG before embedding.
- An adapter chooses the landscape renderer or geometric sketch renderer; these are not automatically compatible scene formats.
