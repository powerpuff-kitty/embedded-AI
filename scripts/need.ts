import { parseArgs } from 'node:util';
import { loadEntries } from './catalog.ts';
import { matchNeeds, applyNeedConstraints, describeIntent } from '../site/needs.mjs';
try {
  const { values, positionals } = parseArgs({ allowPositionals: true, options: {
    limit: { type: 'string', default: '15' }, json: { type: 'boolean', default: false },
    offline: { type: 'boolean', default: false }, pretrained: { type: 'boolean', default: false },
    view: { type: 'string' }, method: { type: 'string' }, proceduralCategory: { type: 'string' },
    model: { type: 'boolean', default: false }, help: { type: 'boolean' } }, strict: true });
  if (values.help || !positionals.length) {
    console.log('npm run need -- "describe what you need" [--limit N] [--offline] [--pretrained] [--model] [--view ai|procedural|hybrid] [--method METHOD] [--proceduralCategory CATEGORY] [--json]');
  } else {
    const limit = Number(values.limit);
    if (!Number.isInteger(limit) || limit < 1 || limit > 200) throw new Error('Invalid --limit (expected an integer 1-200)');
    const query = positionals.join(' ');
    const entries = await loadEntries();
    const { intent, results } = matchNeeds(entries, query, { limit: entries.length });
    const { kept, excluded } = applyNeedConstraints(results, { offline: values.offline, pretrained: values.pretrained, model: values.model, view: values.view, method: values.method, proceduralCategory: values.proceduralCategory });
    const shown = kept.slice(0, limit);
    if (values.json) {
      console.log(JSON.stringify({ query, intent: describeIntent(intent), excluded_by_constraints: excluded.length,
        results: shown.map(r => ({ id: r.entry.id, name: r.entry.name, score: r.score, domain: r.entry.domain, kind: r.entry.kind,
          usage: r.entry.usage?.mode ?? 'unknown', tasks: r.entry.tasks, manifest: r.entry.path, reasons: r.reasons })) }, null, 2));
    } else {
      console.log(`Ranked ${kept.length} match(es)${excluded.length ? `, ${excluded.length} hidden by constraints` : ''} for: ${query}`);
      console.log('RANK\tSCORE\tID\tDOMAIN\tKIND\tUSE\tWHY');
      shown.forEach((r, index) => console.log([index + 1, r.score, r.entry.id, r.entry.domain, r.entry.kind,
        r.entry.usage?.mode ?? 'unknown', r.reasons.slice(0, 4).join('; ')].join('\t')));
      if (excluded.length) console.error(`${excluded.length} higher-ranked match(es) were excluded by the selected hard constraints.`);
    }
  }
} catch (error) { console.error(error instanceof Error ? error.message : error); process.exitCode = 1; }
