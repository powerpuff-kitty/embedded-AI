import test from 'node:test';
import assert from 'node:assert/strict';
import { tokenize, interpret, matchNeeds, describeIntent } from '../site/needs.mjs';
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
