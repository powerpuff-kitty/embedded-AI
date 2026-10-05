import { loadEntries } from './catalog.ts';
try { console.log(`Validated ${(await loadEntries()).length} catalogue entries.`); }
catch (error) { console.error(error instanceof Error ? error.message : error); process.exitCode = 1; }
