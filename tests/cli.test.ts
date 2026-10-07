import test from 'node:test';
import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';

const run = (args: string[]) => spawnSync(process.execPath, ['--import', 'tsx', ...args], { encoding: 'utf8' });

test('validate CLI reports the validated entry count', () => {
  const result = run(['scripts/validate.ts']);
  assert.equal(result.status, 0, result.stderr);
  assert.match(result.stdout, /Validated \d+ catalogue entries\./);
});

test('audit CLI reports hygiene and exits zero on a clean tree', () => {
  const result = run(['scripts/audit.ts']);
  assert.equal(result.status, 0, result.stderr);
  assert.match(result.stdout, /Catalogue hygiene audit/);
  assert.match(result.stdout, /unknown weights licence: \d+/);
  assert.match(result.stdout, /compatibility: reproduced \d+, reported \d+, unknown \d+/);
});

test('audit --strict fails only on structural problems', () => {
  const result = run(['scripts/audit.ts', '--strict']);
  assert.equal(result.status, 0, result.stderr);
});

test('search CLI without --json prints a header row', () => {
  const result = run(['scripts/search.ts', '--domain', 'vision', '--kind', 'model']);
  assert.equal(result.status, 0, result.stderr);
  assert.match(result.stdout, /^ID\tDOMAIN\tKIND\tUSE\tMANIFEST/);
});
