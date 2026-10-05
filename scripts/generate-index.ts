import fs from 'node:fs/promises';
import { loadEntries, renderCatalogue, renderIndex, renderFullIndex, renderCoverage, updateReadme } from './catalog.ts';
try {
  const args = process.argv.slice(2);
  if (args.some(a => a !== '--check')) throw new Error('Usage: npm run index -- [--check]');
  const entries = await loadEntries();
  const outputs = new Map([
    ['README.md', updateReadme(await fs.readFile('README.md', 'utf8'), renderCatalogue(entries))],
    ['generated/catalog.json', renderIndex(entries)],
    ['generated/catalog.full.json', renderFullIndex(entries)],
    ['generated/coverage.json', renderCoverage(entries)],
  ]);
  if (args.includes('--check')) {
    const stale: string[] = [];
    for (const [file, expected] of outputs) {
      const actual = await fs.readFile(file, 'utf8').catch((error: NodeJS.ErrnoException) => { if (error.code === 'ENOENT') return null; throw error; });
      if (actual !== expected) stale.push(file);
    }
    if (stale.length) throw new Error(`Stale generated files: ${stale.join(', ')}. Run npm run index and commit the outputs.`);
    console.log(`README and all JSON exports are current (${entries.length} entries).`);
  } else {
    await fs.mkdir('generated', { recursive: true });
    for (const [file, content] of outputs) await fs.writeFile(file, content);
    console.log(`Generated README and all JSON exports (${entries.length} entries).`);
  }
} catch (error) { console.error(error instanceof Error ? error.message : error); process.exitCode = 1; }
