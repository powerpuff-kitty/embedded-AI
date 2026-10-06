import test from 'node:test';
import assert from 'node:assert/strict';
import { tokenize, interpret, matchNeeds, describeIntent, applyNeedConstraints, shortlistMarkdown, upstreamOf, stem } from '../site/needs.mjs';
import { loadEntries } from '../scripts/catalog.ts';
const entries = await loadEntries();

test('the need tokenizer expands synonyms and drops stopwords', () => {
  const tokens = tokenize('I want to detect people offline');
  assert.ok(tokens.includes('people'));
  assert.ok(tokens.includes('person')); // synonym expansion
  assert.ok(tokens.includes('offline'));
  assert.ok(!tokens.includes('the'));
  assert.ok(!tokens.includes('want'));
});

test('interpretation reads constraints from plain language', () => {
  const intent = interpret('offline tiny person detector on a camera');
  assert.equal(intent.wantsOffline, true);
  assert.equal(intent.wantsEdge, true);
  assert.ok(describeIntent(intent).length > 0);
});

test('an image/person need surfaces vision components with reasons', () => {
  const { results } = matchNeeds(entries, 'detect people in camera images offline');
  assert.ok(results.length > 0);
  assert.ok(results.some(r => r.entry.domain === 'vision'));
  for (const r of results.slice(0, 5)) assert.ok(r.reasons.length > 0, r.entry.id);
});

test('a speech need surfaces speech-to-text components', () => {
  const { results } = matchNeeds(entries, 'transcribe speech from a microphone offline');
  assert.ok(results.some(r => (r.entry.tasks || []).includes('speech-to-text')), results.slice(0, 10).map(r => r.entry.id).join(','));
});

test('a maintenance need surfaces the vibration fault component', () => {
  const { results } = matchNeeds(entries, 'anomaly detection on a vibration sensor');
  assert.ok(results.some(r => r.entry.id === 'bearing-fault-detection'));
});

test('empty and stopword-only queries return no matches', () => {
  assert.deepEqual(matchNeeds(entries, '   ').results, []);
  assert.deepEqual(matchNeeds(entries, 'the a of to').results, []);
});

test('ranking is deterministic for the same query', () => {
  const a = matchNeeds(entries, 'anomaly detection on vibration sensor');
  const b = matchNeeds(entries, 'anomaly detection on vibration sensor');
  assert.deepEqual(a.results.map(r => [r.entry.id, r.score]), b.results.map(r => [r.entry.id, r.score]));
});

test('constraints exclude entries and explain why', () => {
  const { results } = matchNeeds(entries, 'detect people offline');
  const { kept, excluded } = applyNeedConstraints(results, { offline: true });
  assert.ok(kept.length > 0);
  assert.ok(kept.every(r => r.entry.deployment?.offline === true));
  assert.ok(excluded.every(r => typeof r.reason === 'string' && r.reason.length > 0));
  const pretrainedOnly = applyNeedConstraints(results, { pretrained: true });
  assert.ok(pretrainedOnly.kept.every(r => (r.entry.usage?.mode ?? 'unknown') === 'pretrained'));
});

test('shortlist markdown names tasks and sources', () => {
  const sample = entries.find(e => e.id === 'zipdepth')!;
  const markdown = shortlistMarkdown([sample]);
  assert.match(markdown, /# embedded-AI shortlist/);
  assert.ok(markdown.includes(sample.name));
  assert.ok(markdown.includes(sample.path));
  assert.equal(upstreamOf(sample), sample.links.model || sample.links.repository || sample.links.homepage || sample.links.paper);
});

test('light stemming connects word forms', () => {
  assert.equal(stem('detecting'), 'detect');
  assert.equal(stem('classifying'), 'classify');
  assert.equal(stem('objects'), 'object');
  assert.ok(tokenize('detecting people').includes('detect'));
});

test('a gerund query still surfaces detection components', () => {
  const { results } = matchNeeds(entries, 'detecting objects in images');
  assert.ok(results.some(r => (r.entry.tasks || []).some(task => task.includes('detection'))), results.slice(0, 8).map(r => r.entry.id).join(','));
});
