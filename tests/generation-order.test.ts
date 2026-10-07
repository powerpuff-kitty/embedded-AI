import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import YAML from 'yaml';

test('generation jobs refresh exports before parity tests while PR checks remain read-only', async () => {
  const catalog = YAML.parse(await fs.readFile('.github/workflows/catalog.yml', 'utf8'));
  const pages = YAML.parse(await fs.readFile('.github/workflows/pages.yml', 'utf8'));
  for (const job of [catalog.jobs['generate-main'], pages.jobs.build]) {
    const commands = job.steps.map((step: any) => step.run ?? '');
    const generate = commands.findIndex((run: string) => run.trim() === 'npm run index');
    const check = commands.findIndex((run: string) => run.includes('npm run check'));
    assert.ok(generate >= 0 && check > generate, 'refresh generated exports before check imports the package');
    assert.ok(commands.slice(0, generate).every((run: string) => !/npm (?:run )?test/.test(run)), 'parity tests must not run against stale exports');
  }
  const prCommands = catalog.jobs.validate.steps.map((step: any) => step.run ?? '');
  assert.ok(prCommands.includes('npm run index -- --check'));
  assert.ok(!prCommands.includes('npm run index'), 'PR freshness checking must not rewrite generated files');
});
