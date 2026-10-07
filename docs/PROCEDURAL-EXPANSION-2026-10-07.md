# Procedural expansion: geometry, navigation, motion and replay

Reviewed 2026-10-07. This batch adds 12 canonical manifests to the shared catalogue; it does not create a second database or replace the existing procedural infrastructure. See the [generated procedural table](PROCEDURAL.md) and [integration guide](PROCEDURAL-GUIDE.md).

## Added components

Names link to the canonical records, which retain primary upstream sources, code licences, inputs, outputs and limitations.

| Component | Integration recorded | Useful building block |
|---|---|---|
| [FastNoise2](../primitives/procedural/fastnoise2.yaml) | Native C++; WASM compilation path | Node-graph noise and serialized generator configuration |
| [WaveFunctionCollapse JS](../primitives/procedural/wavefunctioncollapse-js.yaml) | Browser / Node.js | Constraint-based pixel and tile-pattern generation with an injectable RNG |
| [Delaunator](../primitives/procedural/delaunator.yaml) | Browser / Node.js | Delaunay triangulation of 2D points |
| [Earcut](../primitives/procedural/earcut.yaml) | Browser / Node.js | Triangulation of polygons with holes |
| [JSCAD Modeling](../primitives/procedural/jscad-modeling.yaml) | Browser / Node.js | Parametric geometry and constructive solid geometry |
| [recast-navigation-js](../primitives/procedural/recast-navigation-js.yaml) | Browser / Node.js + WASM | Navigation meshes, path queries and crowds |
| [Fullik / FIK](../primitives/procedural/fullik.yaml) | Browser library | FABRIK inverse kinematics |
| [Rapier](../primitives/procedural/rapier.yaml) | Rust; JavaScript/WASM binding path | 2D and 3D rigid-body physics |
| [cannon-es](../primitives/procedural/cannon-es.yaml) | Browser / Node.js | 3D rigid-body physics |
| [Matter.js](../primitives/procedural/matter-js.yaml) | Browser / Node.js | 2D rigid-body physics |
| [seedrandom](../primitives/procedural/seedrandom.yaml) | Browser / Node.js | Local seeded random streams and optional state snapshots |
| [fishdraw](../primitives/procedural/fishdraw.yaml) | Node.js CLI / library | Procedural fish illustrations and drawing-data export |

WaveFunctionCollapse JS is a distinct upstream JavaScript port, related to the existing C# reference rather than a duplicate entry. FastNoise2 likewise complements, rather than replaces, FastNoise Lite. Delaunator triangulates point sets; Earcut triangulates polygon boundaries. JSCAD Modeling covers the embeddable module rather than all authoring and file-export tools in its monorepo.

## Suggested evaluation order

For a generated game world, first validate geometry, then derive the navigation representation, then add motion. Treat Delaunator, Earcut, JSCAD and noise generators as alternatives or complementary stages with explicit adapters, not automatically interchangeable formats. Recast consumes triangle positions and indices; an SVG or RGBA image is not already a navigation mesh.

For a living diorama, compare Matter.js for 2D scenes against Rapier or cannon-es for 3D scenes. Keep entity ownership, resources, growth and decomposition in the authoritative simulation ledger. Physics and inverse kinematics do not implement those rules. A local model may propose allowlisted actions but must not mutate the ledger or execute arbitrary modeling scripts.

For procedural artwork, fishdraw complements the existing Shan, Shui and Rough.js records. Its exported lines and drawing animations are presentation, not simulated animal behaviour.

For replay, use isolated random streams and preserve algorithm/version, configuration, initial state and event ordering. Enable seedrandom state snapshots explicitly. Never replace global Math.random as an integration shortcut, and never use a procedural PRNG for cryptographic secrets. Seeded randomness does not make floating-point physics or variable-timestep crowd simulation universally deterministic.

## Verification boundary

The new records are **documented**, not hardware-benchmarked. Null RAM measurements remain unknown; model sizes are null and weights are **not-applicable**, not zero. Offline operation assumes dependencies, input assets and any WASM binaries have been bundled. Generated outputs do not grant licences to input assets or third-party dependencies.

The catalogue regression tests check canonical upstream uniqueness, non-model metadata, procedural/AI separation, method/category discovery, and important dimensionality and replay distinctions. They do not execute the upstream generators or establish target-device performance.

```sh
npm run validate
npm test
npm run index
npm run check
npm run audit -- --strict
npm run site:build
npm run search -- --view procedural --method physics-based
```

Publishing a new npm package version remains a separate release action. Existing hybrid recipes remain explicitly design-only.
