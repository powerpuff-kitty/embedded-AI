import test from 'node:test';
import assert from 'node:assert/strict';
import { loadEntries, filterEntries } from '../scripts/catalog.ts';
import { viewOf, hasModelSize } from '../site/methods.mjs';

const expected = ['fastnoise2', 'wavefunctioncollapse-js', 'delaunator', 'fullik', 'rapier',
  'cannon-es', 'matter-js', 'recast-navigation-js', 'seedrandom', 'earcut', 'fishdraw', 'jscad-modeling'];
const entries = await loadEntries();
const byId = new Map(entries.map(entry => [entry.id, entry]));
const repositoryKey = (url: string = '') => url.toLowerCase().replace(/\.git\/?$/, '').replace(/\/$/, '');

test('procedural expansion uses unique canonical upstreams and non-model metadata', () => {
  for (const id of expected) {
    const entry = byId.get(id);
    assert.ok(entry, `${id} must be a canonical entry`);
    assert.equal(entry.catalogue_batch, 'procedural-expansion-2026-10-07');
    assert.equal(entry.learned, false);
    assert.equal(entry.usage.mode, 'companion');
    assert.equal(entry.model.parameters, null);
    assert.equal(entry.model.file_size_mb, null);
    assert.equal(entry.license.weights, 'not-applicable');
    assert.equal(viewOf(entry), 'procedural');
    assert.equal(hasModelSize(entry), false);
    const siblings = entries.filter(other => repositoryKey(other.links?.repository) === repositoryKey(entry.links.repository));
    assert.equal(siblings.length, 1, `${id} must not duplicate another upstream repository`);
  }
});

test('new components are discoverable with the existing method and category filters', () => {
  const physics = new Set(filterEntries(entries, { view: 'procedural', method: 'physics-based' }).map(e => e.id));
  for (const id of ['rapier', 'cannon-es', 'matter-js']) assert.ok(physics.has(id));
  const foundations = new Set(filterEntries(entries, { view: 'procedural', proceduralCategory: 'foundations' }).map(e => e.id));
  for (const id of ['seedrandom', 'delaunator', 'earcut', 'jscad-modeling']) assert.ok(foundations.has(id));
  const ai = new Set(filterEntries(entries, { view: 'ai' }).map(e => e.id));
  for (const id of expected) assert.ok(!ai.has(id));
});

test('ports, dimensions and replay metadata retain their integration boundaries', () => {
  const wfc = byId.get('wavefunctioncollapse-js')!;
  assert.notEqual(wfc.links.repository, byId.get('wavefunctioncollapse')!.links.repository);
  assert.ok(wfc.related.includes('wavefunctioncollapse'));
  assert.equal(wfc.procedural.seed_control, 'injectable');
  assert.equal(wfc.procedural.incremental, true);
  assert.equal(byId.get('seedrandom')!.procedural.serialization, 'state');
  assert.equal(byId.get('recast-navigation-js')!.procedural.integration, 'browser-library');
  assert.equal(byId.get('fastnoise2')!.procedural.integration, 'native-library');
  assert.equal(byId.get('fishdraw')!.procedural.serialization, 'outputs-only');
  assert.ok(byId.get('matter-js')!.data.outputs.includes('2D physics state'));
  assert.ok(byId.get('cannon-es')!.data.outputs.includes('3D physics state'));
  for (const id of ['earcut', 'delaunator']) assert.equal(byId.get(id)!.license.code, 'ISC');
});
