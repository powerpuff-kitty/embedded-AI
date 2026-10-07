import fs from 'node:fs/promises';
import { renderProceduralPage } from './procedural.ts';
import { loadEntries, renderCatalogueSummary, renderCataloguePage, renderIndex, renderFullIndex, renderCoverage, renderAtAGlance, renderDomains, replaceBlock } from './catalog.ts';
try {
  const args = process.argv.slice(2);
  if (args.some(a => a !== '--check')) throw new Error('Usage: npm run index -- [--check]');
  const entries = await loadEntries();
  const readme = await fs.readFile('README.md', 'utf8');
  const withSummary = replaceBlock(readme, '<!-- CATALOGUE:START -->', '<!-- CATALOGUE:END -->', renderCatalogueSummary(entries));
  const withGlance = replaceBlock(withSummary, '<!-- AT-A-GLANCE:START -->', '<!-- AT-A-GLANCE:END -->', renderAtAGlance(entries));
  const withDomains = replaceBlock(withGlance, '<!-- DOMAINS:START -->', '<!-- DOMAINS:END -->', renderDomains(entries));
  const outputs = new Map([
    ['README.md', withDomains],
    ['docs/CATALOGUE.md', renderCataloguePage(entries)],
    ['docs/PROCEDURAL.md', renderProceduralPage(entries)],
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
    console.log(`README, catalogue guides and JSON exports are current (${entries.length} entries).`);
  } else {
    await fs.mkdir('generated', { recursive: true });
    for (const [file, content] of outputs) await fs.writeFile(file, content);
    console.log(`Generated README, catalogue guides and JSON exports (${entries.length} entries).`);
  }
} catch (error) { console.error(error instanceof Error ? error.message : error); process.exitCode = 1; }
