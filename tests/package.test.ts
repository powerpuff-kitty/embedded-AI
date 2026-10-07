import test from 'node:test';
import assert from 'node:assert/strict';
import { entries, coverage, get, domains, search, need, shortlist, upstreamOf, version } from '../lib/index.mjs';

test('package exposes the generated catalogue', () => {
  assert.equal(entries.length, coverage.total);
  assert.equal(version, '0.2.0');
  assert.equal(domains.length, Object.keys(coverage.by_domain).length);
  assert.deepEqual(domains, [...domains].sort());
});

test('get resolves ids and returns null for unknown', () => {
  assert.equal(get('docling').name, 'Docling');
  assert.equal(get('does-not-exist'), null);
});

test('need ranks a focused query and explains itself', () => {
  const { results, intent } = need('transcribe speech from a microphone', { limit: 5 });
  assert.ok(results.length > 0 && results.length <= 5);
  assert.ok(results[0].score > 0);
  assert.ok(results[0].reasons.length > 0);
  assert.ok(Array.isArray(intent));
});

test('need constraints report excluded matches instead of hiding them', () => {
  const { results, excluded } = need('detect people', { constraints: { pretrained: true } });
  assert.ok(results.every((r) => (r.entry.usage_mode ?? r.entry.usage?.mode) === 'pretrained'));
  assert.ok(excluded.every((r) => typeof r.reason === 'string'));
});

test('search filters by domain and free text', () => {
  const vision = search('', { domain: 'vision' });
  assert.ok(vision.length > 0);
  assert.ok(vision.every((e) => e.domain === 'vision'));
  assert.ok(search('docling').some((e) => e.id === 'docling'));
});

test('shortlist renders markdown with manifest and upstream', () => {
  const md = shortlist([get('docling')]);
  assert.match(md, /# embedded-AI shortlist/);
  assert.match(md, /manifest:/);
  assert.equal(upstreamOf(get('docling')), 'https://github.com/docling-project/docling');
});
