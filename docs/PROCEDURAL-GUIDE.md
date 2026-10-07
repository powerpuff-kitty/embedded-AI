# Procedural generation and hybrid integration

## One catalogue, independent classifications

AI models and procedural tools share one YAML source, validation pipeline, exports, explorer, CLI, package and MCP interface. New non-learned generators live in `primitives/procedural/`; existing simulations keep their canonical paths. Hybrid compositions live in `pipelines/hybrid/` and reference component IDs, never copied manifests. [Generated catalogue](PROCEDURAL.md).

`kind` describes what a component is: model, collection, pipeline, toolkit or primitive. `methods` describes how it works and can combine `learned`, `procedural`, `rule-based`, `physics-based` and `hybrid`. It does not describe where it runs. `learned: false` requires null model sizes and `weights: not-applicable`; zero would incorrectly imply a measured model.

The `ai` view includes entries with the learned method. For backward compatibility, unannotated model/collection kinds imply learned unless explicitly marked false. Other legacy companions remain unclassified and available in All components; we do not silently call every non-AI tool procedural. Explicit methods override inference. The `procedural` view contains non-recipe procedural components; `hybrid` contains recipe manifests. Method counts can overlap; view counts partition entries, including unclassified.

## Metadata contract

| Field | Meaning |
|---|---|
| `procedural.categories` | Multiple task families, not duplicated entries. |
| `procedural.integration` | browser-library, browser-reference, native-library, native-reference, or shader-library. |
| `procedural.seed_control` | built-in, injectable, not-exposed, not-applicable or unknown. A simulation's initial pattern is not necessarily a PRNG seed. |
| `procedural.determinism` | conditional, not-guaranteed or unknown. Conditional requires pinned versions, configuration, RNG and runtime evaluation. |
| `procedural.controls` | Documented parameters or control inputs. |
| `procedural.assets` | Known additional asset needs; an empty list means none identified in the reviewed scope, not a transitive dependency audit. |
| `procedural.incremental` | Can the algorithm advance incrementally? `null` means unverified; it is not a latency claim. |
| `procedural.serialization` | Documented configuration/state/output persistence support, or unknown. Host application persistence does not establish upstream support. |
| `procedural.evidence_level` | documented, inspected or reproduced; reproduced requires a stored benchmark-backed compatibility record. |
| `data.inputs` / `data.outputs` | Use existing I/O fields; SVG artwork, scalar fields, meshes, joint poses and audio are not interchangeable. |

Code licences do not automatically cover samples, music, textures, model weights or dependencies. Hardware compatibility and RAM stay unknown unless supported by actual measurements. Native authoring references are included for offline generation/adaptation, not presented as embeddable browser or MCU libraries. The catalogue does not download or execute these upstream tools.

## Search and integration

```sh
npm run search -- --view procedural
npm run search -- --method procedural --proceduralCategory audio-music
npm run need -- "procedural terrain" --view procedural
npm run search -- --view hybrid
```

From a checkout (or a subsequently published package containing this feature):

```js
import { search, need, get, methodsOf } from './lib/index.mjs';
const audio = search('', { view: 'procedural', proceduralCategory: 'audio-music' });
const terrain = need('procedural terrain', {
  limit: 5, constraints: { view: 'procedural', method: 'rule-based' }
});
const recipe = get('hybrid-living-world');
const components = recipe.recipe.components.map(({ id, role }) => ({ entry: get(id), role }));
```

CLI, package and MCP `search`/`need` accept `view`, `method` and `proceduralCategory`. These are hard constraints applied before the result limit; unknown categories are rejected. Explorer links preserve those facets through reload and language changes. The explorer's need mode retains its separate offline/pretrained/model checkboxes; other metadata filters apply in ordinary catalogue mode. Adding code here does not publish a new npm release.

## Hybrid recipe requirements

Each recipe must have pipeline kind, learned/procedural/hybrid methods, and at least two distinct canonical non-recipe components, including both a learned and procedural component. Self, dangling and nested recipe references are rejected. `status: design` must not declare an executable entrypoint or reproduced compatibility. `status: runnable` requires an existing safe path under `recipes/`; actual performance claims still require benchmark records.

The initial living-world, procedural-art and game-sound recipes are **design-only**. They intentionally do not select a model checkpoint, promise browser fit, or masquerade as working demos.

For a living world, the deterministic application simulation owns entities and resource transactions. The model proposes bounded actions; validation and game rules decide whether they happen. The renderer draws the recorded state. Track creations, removals and decay as explicit events with resources accounted for; a pretty ecosystem renderer or cellular automaton does not automatically conserve matter.

For generated art, validate numeric controls, isolate third-party generators, and sanitize SVG. Never execute arbitrary model-generated source. For audio, select allowlisted presets, cap duration/gain/voices/buffer sizes and require user audio activation. Preserve seeds, versions and event logs, but test rather than assume replay consistency.

## Next evidence milestone

Add pinned, opt-in runnable adapters with small fixtures for noise, SVG, tree geometry and audio. Test outputs, repeatability, time and memory on named browsers/devices. Promote only the specific tested adapter and environment, not the upstream family or every target. Keep model downloads and heavier desktop generation explicit and optional.
