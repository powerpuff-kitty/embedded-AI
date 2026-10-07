/** Bounded, serializable inputs. This is not a general code-execution interface. */
export const ADAPTERS = Object.freeze({
  noise: { entry: 'simplex-noise-js', package: 'simplex-noise', version: '4.0.3', label: 'Noise field' },
  svg: { entry: 'rough-js', package: 'roughjs', version: '4.6.6', label: 'Vector sketch' },
  tree: { entry: 'ez-tree', package: '@dgreenheck/ez-tree', version: '1.1.0', label: 'Tree geometry' },
  audio: { entry: 'zzfx', package: 'zzfx', version: '1.4.0', label: 'Sound synthesis' },
});
export function configOf(value) {
  if (!value || typeof value !== 'object' || Array.isArray(value)) throw new Error('Expected a configuration object.');
  if (Object.keys(value).some(k => !['adapter', 'seed', 'detail'].includes(k))) throw new Error('Unknown configuration key.');
  if (!Object.hasOwn(ADAPTERS, value.adapter)) throw new Error('Unknown adapter.');
  for (const [key, max] of [['seed', 2147483647], ['detail', 3]]) {
    if (!Number.isInteger(value[key]) || value[key] < 1 || value[key] > max) throw new Error(`${key} must be an integer from 1 to ${max}.`);
  }
  return { adapter: value.adapter, seed: value.seed, detail: value.detail };
}
/** Local deterministic PRNG; never replaces global Math.random. Not cryptographic. */
export function rng(seed) {
  return () => { let t = seed += 0x6D2B79F5; t = Math.imul(t ^ t >>> 15, t | 1); t ^= t + Math.imul(t ^ t >>> 7, t | 61); return ((t ^ t >>> 14) >>> 0) / 4294967296; };
}
export function payloadBytes(output) {
  if (output.type === 'svg') return new TextEncoder().encode(output.svg);
  const arrays = output.type === 'tree' ? output.meshes.flatMap(m => [m.positions, m.indices]) : [output.values];
  const result = new Uint8Array(arrays.reduce((sum, a) => sum + a.byteLength, 0));
  let offset = 0;
  for (const a of arrays) { result.set(new Uint8Array(a.buffer, a.byteOffset, a.byteLength), offset); offset += a.byteLength; }
  return result;
}
export async function digest(output) {
  return [...new Uint8Array(await crypto.subtle.digest('SHA-256', payloadBytes(output)))].map(v => v.toString(16).padStart(2, '0')).join('');
}
