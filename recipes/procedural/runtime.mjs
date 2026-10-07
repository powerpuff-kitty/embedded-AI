import { createNoise2D } from 'simplex-noise';
import rough from 'roughjs/bundled/rough.esm.js';
import { Tree } from './node_modules/@dgreenheck/ez-tree/src/lib/tree.js';
import { ZZFX } from 'zzfx/ZzFX.js';
import { configOf, rng } from './contracts.mjs';

/** Actual pinned upstream algorithms, with geometry/audio side effects isolated at build time. */
export function generate(input) {
  const c = configOf(input);
  if (c.adapter === 'noise') {
    const size = c.detail * 64, values = new Float32Array(size * size), noise = createNoise2D(rng(c.seed));
    for (let y = 0; y < size; y++) for (let x = 0; x < size; x++) values[y * size + x] = noise(x / 28, y / 28);
    return { type: 'noise', size, values };
  }
  if (c.adapter === 'svg') {
    const r = rng(c.seed), g = rough.generator();
    const shapes = Array.from({ length: 12 * c.detail }, (_, i) => g.circle(30 + r() * 580, 30 + r() * 380, 12 + r() * 96,
      { seed: c.seed + i, roughness: 1.2, fill: '#bbd796', fillStyle: 'hachure', stroke: '#26443b', strokeWidth: 1.4 }));
    const paths = shapes.flatMap(s => g.toPaths(s)).map(p => `<path d="${p.d}" fill="${p.fill || 'none'}" stroke="${p.stroke || 'none'}" stroke-width="${p.strokeWidth || 1}"/>`).join('');
    return { type: 'svg', svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 440" width="640" height="440">${paths}</svg>` };
  }
  if (c.adapter === 'tree') {
    const tree = new Tree();
    tree.options.seed = c.seed;
    tree.options.branch.levels = 2;
    tree.options.branch.children = { 0: 4 + c.detail, 1: 3 + c.detail, 2: 2 };
    tree.options.bark.textured = false;
    tree.options.leaves.count = 3;
    try {
      tree.generate();
      const meshes = [tree.branchesMesh, tree.leavesMesh].map(mesh => ({
        positions: new Float32Array(mesh.geometry.attributes.position.array),
        indices: new Uint32Array(mesh.geometry.index.array),
      }));
      if (meshes.some(m => m.positions.length > 300000 || m.indices.length > 300000)) throw new Error('Geometry output exceeds fixture budget.');
      return { type: 'tree', meshes };
    } finally {
      tree.traverse(o => { o.geometry?.dispose(); for (const m of [].concat(o.material || [])) m.dispose(); });
    }
  }
  // Use a bounded sine preset. Internal frequency randomness and noise are disabled.
  // The seed selects a note; this is NOT a seeded version of every ZzFX preset.
  const frequency = 110 * 2 ** ((c.seed % 36) / 12);
  const values = new Float32Array(ZZFX.buildSamples(.3, 0, frequency, .01, .08 * c.detail, .12));
  if (values.length > 44100 || !values.every(Number.isFinite)) throw new Error('Invalid audio output.');
  return { type: 'audio', sampleRate: 44100, frequency, values };
}
