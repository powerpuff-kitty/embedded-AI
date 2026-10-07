import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import { spawnSync } from 'node:child_process';
import { Entry, loadEntries, validateEntries, renderCatalogue, renderFullIndex, renderCoverage, renderAtAGlance, filterEntries, usageOf } from '../scripts/catalog.ts';
const entries = await loadEntries();
const batch = JSON.parse(await fs.readFile('docs/batches/business-2026-10-05.json', 'utf8'));
const additions = entries.filter(e => e.catalogue_batch === batch.id);
const sample = (): Entry => {
  const e = structuredClone(entries.find(e => e.id === 'kronos-mini')!);
  e.related = [];
  return e;
};

test('business expansion covers all 32 requested entries exactly once', () => {
  assert.equal(batch.expected_ids.length, 32);
  assert.equal(new Set(batch.expected_ids).size, 32);
  assert.deepEqual(additions.map(e => e.id).sort(), [...batch.expected_ids].sort());
  for (const id of batch.expected_ids) assert.equal(entries.filter(e => e.id === id).length, 1, id);
});

test('every new record states use, data, evaluation, limitations and memory unknowns', () => {
  for (const e of additions) {
    assert.notEqual(usageOf(e), 'unknown', e.id);
    assert.ok(e.usage.needs_data && e.usage.update_strategy, e.id);
    assert.ok(e.data.inputs.length && e.data.outputs.length, e.id);
    assert.ok(e.evaluation.length && e.limitations.length, e.id);
    assert.ok('minimum' in e.requirements.ram_mb && 'measured_peak' in e.requirements.ram_mb, e.id);
    assert.ok(e.evidence.length, e.id);
  }
});

test('invalid use and incomplete input metadata are rejected', () => {
  const e = sample(); e.usage.mode = 'ready-for-all-hardware';
  assert.throws(() => validateEntries([e]), /allowed values/);
  const f = sample(); f.data.inputs = [];
  assert.throws(() => validateEntries([f]), /fewer than 1/);
  const g = sample(); delete g.usage.update_strategy;
  assert.throws(() => validateEntries([g]), /update_strategy/);
});

test('pretrained individual models need a model-card link', () => {
  const e = sample(); delete e.links.model;
  assert.throws(() => validateEntries([e]), /model-card/);
});

test('numeric size claims require measurement scope and RAM cannot be negative', () => {
  const e = sample(); delete e.model.measurement_scope;
  assert.throws(() => validateEntries([e]), /measurement_scope/);
  const f = sample(); f.requirements.ram_mb.measured_peak = -1;
  assert.throws(() => validateEntries([f]), /must be >= 0/);
});

test('old entries are not silently promoted to pretrained', () => {
  const e = structuredClone(entries.find(e => e.id === 'zipdepth')!);
  delete e.usage;
  assert.equal(usageOf(e), 'unknown');
  assert.match(renderCatalogue([e]), /model \/ unknown/);
});

test('filters distinguish pretrained finance from tools that require fitting', () => {
  assert.deepEqual(filterEntries(entries, { domain: 'finance', usage: 'pretrained' }).map(e => e.id).sort(),
    ['finbert-prosus', 'kronos-mini', 'kronos-small']);
  const trained = filterEntries(entries, { domain: 'infrastructure', usage: 'requires-training' });
  assert.ok(trained.length >= 5);
  assert.ok(trained.every(e => usageOf(e) === 'requires-training'));
  assert.ok(trained.some(e => e.id === 'kitnet'));
  assert.ok(filterEntries(entries, { query: 'ANOMALY' }).some(e => e.id === 'kitnet'));
  assert.equal(filterEntries(entries, { task: 'constraint-optimization', kind: 'primitive' })[0].id, 'or-tools');
});

test('full JSON export retains evidence, licence, usage and input contracts', () => {
  const full = JSON.parse(renderFullIndex(entries));
  assert.equal(full.schema_version, 1);
  assert.equal(full.entries.length, entries.length);
  const e = full.entries.find((x: any) => x.id === 'gliner25-small');
  assert.equal(e.usage_mode, 'pretrained');
  assert.equal(e.model.parameters, 74000000);
  assert.ok(e.model.measurement_scope && e.evidence.length && e.data.inputs.length);
  assert.equal(e.requirements.ram_mb.measured_peak, null);
  assert.equal(e.license.weights, 'Apache-2.0');
});

test('coverage totals reconcile and expose missing measurements', () => {
  const report = JSON.parse(renderCoverage(entries));
  assert.equal(report.total, entries.length);
  for (const key of ['by_domain', 'by_kind', 'by_usage'])
    assert.equal((Object.values(report[key]) as number[]).reduce((a, b) => a + b, 0), entries.length);
  assert.equal(report.unknowns.usage, entries.filter(e => usageOf(e) === 'unknown').length);
  assert.equal(report.unknowns.measured_peak_ram, entries.filter(e => e.requirements?.ram_mb?.measured_peak == null).length);
  assert.ok(report.unknowns.measured_peak_ram >= additions.length);
});

test('coverage and the README expose evidence depth honestly', () => {
  const report = JSON.parse(renderCoverage(entries));
  const sourced = entries.filter(e => (e.evidence ?? []).length > 0).length;
  assert.equal(report.evidence.entries_with_source, sourced);
  assert.equal(report.evidence.reproduced, report.reproduced_entries);
  assert.equal(report.evidence.measured_ram, entries.filter(e => e.requirements?.ram_mb?.measured_peak != null).length);
  assert.ok(report.evidence.entries_official_link_only + report.evidence.entries_multiple_or_non_official <= sourced);
  const glance = renderAtAGlance(entries);
  assert.match(glance, /\*\*Evidence\*\*/);
  assert.match(glance, new RegExp(`${sourced} sourced`));
});

test('the business guide links every added manifest', async () => {
  const guide = await fs.readFile('docs/BUSINESS-AI.md', 'utf8');
  for (const e of additions) assert.ok(guide.includes(`../${e.path}`), e.id);
});

test('search CLI provides valid JSON and rejects invalid usage flags', () => {
  const result = spawnSync(process.execPath, ['--import', 'tsx', 'scripts/search.ts', '--domain', 'finance', '--usage', 'pretrained', '--json'], { encoding: 'utf8' });
  assert.equal(result.status, 0, result.stderr);
  assert.equal(JSON.parse(result.stdout).length, 3);
  const bad = spawnSync(process.execPath, ['--import', 'tsx', 'scripts/search.ts', '--usage', 'anything'], { encoding: 'utf8' });
  assert.notEqual(bad.status, 0);
  assert.match(bad.stderr, /Invalid --usage/);
});
