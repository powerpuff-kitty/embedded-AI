# Runnable procedural fixtures

See [the lab guide](../../docs/PROCEDURAL-LAB.md) for setup, source adaptations, safety limits and evidence interpretation.

```sh
npm ci --ignore-scripts
npm test
node build.mjs
```

Run those commands from this directory. Open the built lab through the repository's HTTP server, not file://. No upstream generator, model or audio is executed merely by viewing catalogue entries.

Direct dependencies are intentionally kept in this private optional package, separate from the zero-runtime-dependency catalogue package. Upstream source checksums guard the texture-free EZ-Tree and silent ZzFX initialization adaptations.
