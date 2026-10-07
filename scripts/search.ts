import { parseArgs } from 'node:util';
import { loadEntries, filterEntries, kindOf, usageOf } from './catalog.ts';
try {
  const { values } = parseArgs({ options: { domain: { type: 'string' }, task: { type: 'string' }, kind: { type: 'string' },
    view: { type: 'string' }, method: { type: 'string' }, proceduralCategory: { type: 'string' }, usage: { type: 'string' }, query: { type: 'string' }, json: { type: 'boolean', default: false }, help: { type: 'boolean' } }, strict: true });
  if (values.help) {
    console.log('npm run search -- [--domain DOMAIN] [--task TASK] [--kind KIND] [--usage pretrained|requires-training|companion|unknown] [--view ai|procedural|hybrid] [--method METHOD] [--proceduralCategory CATEGORY] [--query TEXT] [--json]');
  } else {
    if (values.usage && !['pretrained', 'requires-training', 'companion', 'unknown'].includes(values.usage)) throw new Error('Invalid --usage');
    if (values.kind && !['model', 'collection', 'pipeline', 'toolkit', 'primitive'].includes(values.kind)) throw new Error('Invalid --kind');
    const matches = filterEntries(await loadEntries(), values);
    if (values.json) console.log(JSON.stringify(matches, null, 2));
    else {
      console.log('ID\tDOMAIN\tKIND\tUSE\tMANIFEST');
      for (const e of matches) console.log([e.id, e.domain, kindOf(e), usageOf(e), e.path].join('\t'));
      console.error(`${matches.length} matching entries`);
    }
  }
} catch (error) { console.error(error instanceof Error ? error.message : error); process.exitCode = 1; }
