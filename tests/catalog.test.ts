import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import { Entry, loadEntries, validateEntries, renderCatalogue, renderIndex, updateReadme, formatParams, formatSize, escapeCell } from '../scripts/catalog.ts';
const entries = await loadEntries();
const sample = (): Entry => structuredClone(entries.find(e => e.id === 'zipdepth')!);

test('all 27 requested additions are indexed exactly once', () => {
  const wanted = ['movinet-a0-stream','tsm-mobilenetv2','mobileclip2-s0','st-gcnpp','transnet-v2','zero-dce-plus-plus','rfdn','fastdvdnet','robust-video-matting-mobilenetv3','pidnet-s','mediapipe-pose-lite','rtmpose-t','rtmlib','lightweight-3d-pose','videopose3d','easymocap','freemocap','mujoco','zipdepth','lite-mono','depth-anything-v2-small','lightstereo','depth-anything-3-small','orb-slam3','rtabmap','colmap','brush'];
  for (const id of wanted) assert.equal(entries.filter(e => e.id === id).length, 1, id);
  assert.equal(new Set(entries.map(e => e.id)).size, entries.length);
});
test('duplicate IDs are rejected', () => assert.throws(() => validateEntries([sample(), sample()]), /duplicate id/));
test('malformed URLs and invalid temporal modes are rejected', () => {
  const e = sample(); e.links.repository = 'tinyml'; assert.throws(() => validateEntries([e]), /http-url/);
  const f = sample(); f.io.temporal_mode = 'magic'; assert.throws(() => validateEntries([f]), /allowed values/);
});
test('reproduced requires local benchmark evidence', () => {
  const e = sample(); e.compatibility = [{ target: 'test-device', status: 'reproduced' }];
  assert.throws(() => validateEntries([e]), /benchmarks/);
});
test('companion pipelines cannot pretend to have one neural-model size', () => {
  const e = sample(); e.kind = 'pipeline'; assert.throws(() => validateEntries([e]), /single model size/);
});
test('README generation is idempotent and preserves surrounding prose', () => {
  const block = renderCatalogue(entries), original = 'BEFORE\n<!-- CATALOG:START -->old<!-- CATALOG:END -->\nAFTER\n';
  const first = updateReadme(original, block);
  assert.equal(updateReadme(first, block), first);
  assert.ok(first.startsWith('BEFORE\n')); assert.ok(first.endsWith('\nAFTER\n'));
  for (const e of entries) assert.ok(first.includes(`](${e.path})`), e.id);
  assert.throws(() => updateReadme('<!-- CATALOG:START -->', block), /markers/);
});
test('licences and compatibility are not collapsed misleadingly', () => {
  const e = sample(); e.license = { code: 'MIT', weights: 'unknown' };
  e.compatibility = [{ target: 'a', status: 'reported', evidence: 'https://example.org/report' }, { target: 'b', status: 'unsupported' }];
  const rendered = renderCatalogue([e]);
  assert.match(rendered, /MIT \/ unknown/); assert.match(rendered, /a: reported; b: unsupported/);
});
test('index includes companions and keeps legacy summary fields', () => {
  const parsed = JSON.parse(renderIndex(entries)); assert.equal(parsed.length, entries.length);
  assert.equal(parsed.find((e: any) => e.id === 'mujoco').kind, 'primitive');
  for (const e of parsed) for (const key of ['id','name','domain','tasks','class','parameters','file_size_mb','path','kind','upstream']) assert.ok(key in e);
});
test('size formatting preserves tiny models and unknowns', () => {
  assert.equal(formatParams(3340000), '3.34M'); assert.equal(formatParams(null), '—');
  assert.equal(formatSize(0.045), '45 kB'); assert.equal(formatSize(null), '—');
  assert.equal(escapeCell('a|b\nc'), 'a&#124;b c');
});
test('discovery includes companions and ignores templates; malformed YAML fails', async () => {
  const root = await fs.mkdtemp(path.join(os.tmpdir(), 'embedded-ai-test-'));
  try {
    for (const folder of ['catalog','pipelines','primitives']) await fs.mkdir(path.join(root,folder));
    const e = sample(); delete (e as any).path;
    await fs.writeFile(path.join(root,'catalog','one.yaml'), JSON.stringify(e));
    await fs.writeFile(path.join(root,'primitives','_template.yaml'), 'not valid: [');
    assert.equal((await loadEntries(root)).length, 1);
    await fs.writeFile(path.join(root,'pipelines','bad.yaml'), 'id: x\nid: y\n');
    await assert.rejects(loadEntries(root), /unique|Duplicate|duplicate/i);
  } finally { await fs.rm(root, { recursive: true, force: true }); }
});
