import test from 'node:test';
import assert from 'node:assert/strict';
import { needTool, searchTool, getTool, domainsTool, statsTool, version, entries } from '../mcp/tools.mjs';

test('MCP need tool ranks a need and explains the match', () => {
  const markdown = needTool({ query: 'offline wake word on a microcontroller', limit: 3 });
  assert.match(markdown, /# Matches for:/);
  assert.match(markdown, /rank score: \d+/);
  assert.ok(markdown.includes('upstream:'));
});

test('MCP need tool applies constraints and reports hidden matches', () => {
  const markdown = needTool({ query: 'detect people', pretrained: true });
  assert.match(markdown, /hidden by your constraints/);
});

test('MCP need tool rejects an empty query', () => {
  assert.throws(() => needTool({ query: '   ' }), /query is required/);
});

test('MCP search tool filters and caps results', () => {
  const markdown = searchTool({ domain: 'vision', usage: 'pretrained', limit: 5 });
  assert.match(markdown, /matching entries/);
});

test('MCP get tool returns an entry or a not-found message', () => {
  assert.match(getTool({ id: 'docling' }), /Docling/);
  assert.match(getTool({ id: 'definitely-not-an-id' }), /No entry with id/);
});

test('MCP domains and stats tools summarise the catalogue', () => {
  assert.match(domainsTool(), /domains, \d+ entries/);
  assert.match(statsTool(), /entries: \d+/);
  assert.equal(typeof version, 'string');
  assert.ok(entries.length > 500);
});
