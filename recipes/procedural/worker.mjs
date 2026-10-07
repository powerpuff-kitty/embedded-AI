import { generate } from './runtime.bundle.mjs';
import { configOf, digest, payloadBytes, ADAPTERS } from './contracts.mjs';
self.onmessage = async ({ data }) => {
  try {
    const config = configOf(data), times = [], hashes = [];
    let output;
    for (let i = 0; i < 3; i++) {
      const start = performance.now(); output = generate(config); times.push(performance.now() - start);
      hashes.push(await digest(output));
    }
    const alternate = generate({ ...config, seed: config.seed === 2147483647 ? 1 : config.seed + 1 });
    const differentSeedChangesOutput = await digest(alternate) !== hashes[0];
    if (!hashes.every(h => h === hashes[0])) throw new Error('Repeatability check failed.');
    self.postMessage({ output, report: {
      schema_version: 1, adapter: config.adapter, entry_id: ADAPTERS[config.adapter].entry,
      config, upstream: ADAPTERS[config.adapter], generation_ms: times, output_sha256: hashes[0],
      repeated_output_equal: true, different_seed_changes_output: differentSeedChangesOutput,
      output_payload_bytes: payloadBytes(output).byteLength, javascript_heap_peak_mb: null,
      scope: 'Three generation-only runs in one fresh worker; import, hashing, transfer and rendering excluded. Payload bytes are not RAM.'
    }});
  } catch (error) { self.postMessage({ error: error instanceof Error ? error.message : 'Generation failed.' }); }
};
