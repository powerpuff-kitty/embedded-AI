import fs from 'node:fs/promises';
import { existsSync } from 'node:fs';
import path from 'node:path';
import { discoverManifests } from './discover.ts';
import YAML from 'yaml';
import Ajv2020 from 'ajv/dist/2020.js';

export type Entry = Record<string, any> & { id: string; name: string; domain: string; tasks: string[]; path: string };
const schema = JSON.parse(await fs.readFile(new URL('../schema/model.schema.json', import.meta.url), 'utf8'));
const businessSchema = JSON.parse(await fs.readFile(new URL('../schema/business-metadata.schema.json', import.meta.url), 'utf8'));
const ajv = new Ajv2020({ allErrors: true, strict: false });
ajv.addFormat('http-url', (value: string) => {
  try { const u = new URL(value); return ['http:', 'https:'].includes(u.protocol) && !!u.hostname && !u.username && !u.password; }
  catch { return false; }
});
const validate = ajv.compile(schema), validateBusiness = ajv.compile(businessSchema);
const cmp = (a: string, b: string) => a < b ? -1 : a > b ? 1 : 0;
export function kindOf(e: Entry): string {
  return e.kind ?? (e.class === 'tracking-system' ? 'pipeline' : e.class === 'model-collection' ? 'collection' : 'model');
}
export const usageOf = (e: Entry): string => e.usage?.mode ?? 'unknown';
export function validateEntries(entries: Entry[], root = process.cwd()): void {
  const errors: string[] = [], ids = new Set<string>();
  for (const e of entries) {
    if (ids.has(e.id)) errors.push(`${e.path}: duplicate id ${e.id}`);
    ids.add(e.id);
    const candidate: Record<string, unknown> = { ...e };
    delete candidate.path;
    if (!validate(candidate)) { errors.push(`${e.path}: ${ajv.errorsText(validate.errors, { separator: '; ' })}`); continue; }
    if (!Object.values(e.links).some(Boolean)) errors.push(`${e.path}: at least one upstream link is required`);
    if (e.catalogue_batch === 'business-2026-10-05' || e.usage !== undefined) {
      if (!validateBusiness(e)) errors.push(`${e.path}: ${ajv.errorsText(validateBusiness.errors, { separator: '; ' })}`);
      if (usageOf(e) === 'pretrained' && kindOf(e) === 'model' && !e.links.model)
        errors.push(`${e.path}: pretrained model requires an explicit model-card/artifact link`);
    }
    if (['pipeline', 'toolkit', 'primitive'].includes(kindOf(e)) && (e.model.parameters != null || e.model.file_size_mb != null))
      errors.push(`${e.path}: companion tools must not claim a single model size`);
    for (const c of e.compatibility) {
      if (c.status === 'reproduced') {
        const p = c.benchmark;
        if (typeof p !== 'string' || !p.startsWith('benchmarks/') || p.split('/').includes('..') || !existsSync(path.join(root, p)))
          errors.push(`${e.path}: reproduced status requires an existing benchmarks/ record`);
      }
      if (['reported', 'theoretical'].includes(c.status) && !c.evidence)
        errors.push(`${e.path}: ${c.status} compatibility requires evidence`);
    }
  }
  for (const e of entries) for (const id of e.related ?? []) if (!ids.has(id)) errors.push(`${e.path}: unknown related id ${id}`);
  if (errors.length) throw new Error(errors.join('\n'));
}
export async function loadEntries(root = process.cwd()): Promise<Entry[]> {
  const paths = await discoverManifests(root);
  if (!paths.length) throw new Error('No catalogue entries found');
  const entries: Entry[] = [];
  for (const p of paths.sort(cmp)) {
    const doc = YAML.parseDocument(await fs.readFile(path.join(root, p), 'utf8'), { uniqueKeys: true });
    if (doc.errors.length) throw new Error(`${p}: ${doc.errors.map(e => e.message).join('; ')}`);
    const value = doc.toJS({ maxAliasCount: 20 });
    if (!value || typeof value !== 'object' || Array.isArray(value)) throw new Error(`${p}: expected a mapping`);
    entries.push({ ...value, path: p });
  }
  validateEntries(entries, root);
  return entries.sort((a, b) => cmp(a.domain, b.domain) || cmp(a.tasks[0], b.tasks[0]) || cmp(a.name, b.name) || cmp(a.id, b.id));
}
export function escapeCell(value: unknown): string {
  return String(value ?? '—').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
    .replace(/\|/g, '&#124;').replace(/\[/g, '&#91;').replace(/\]/g, '&#93;').replace(/[\r\n]+/g, ' ');
}
export const upstream = (e: Entry): string => e.links.model || e.links.repository || e.links.homepage || e.links.paper;
export function formatParams(n: number | null): string {
  if (n == null) return '—';
  const divisor = n >= 1e9 ? 1e9 : n >= 1e6 ? 1e6 : n >= 1e3 ? 1e3 : 1;
  const suffix = divisor === 1e9 ? 'B' : divisor === 1e6 ? 'M' : divisor === 1e3 ? 'K' : '';
  return `${Number((n / divisor).toFixed(3))}${suffix}`;
}
export const formatSize = (n: number | null): string => n == null ? '—' : n < 1 ? `${Number((n * 1000).toFixed(3))} kB` : `${n} MB`;
export function renderCatalogue(entries: Entry[]): string {
  let out = `## Full catalogue\n\n**${entries.length} entries**, including models, collections, pipelines, toolkits and non-AI primitives. Generated from YAML in \`catalog/\`, \`pipelines/\` and \`primitives/\`.\n\n`;
  out += 'Names link to manifests; upstream links point to original projects. **—** means unknown or not applicable, never zero. Parameter counts and model files are not RAM budgets. Read measurement scope and runtime notes.\n\n';
  out += '**Use:** `pretrained` = published weights, still requiring task data/evaluation; `requires-training` = fit or adapt on your data; `companion` = supporting pipeline/tool; `unknown` = not reviewed. Kind and use are independent: a training toolkit is not a pretrained business model.\n\n';
  out += '**C / W** = code license / weights license. Unknown weights terms are never replaced by code terms. Target classes are upstream/proposed targets, not reproduced compatibility. Status remains per hardware target.\n\n';
  out += 'This is a curated, expandable catalogue, not an exhaustive list of every AI or a guarantee that all entries fit embedded boards. Companion tools and desktop references are labelled separately.\n\n';
  out += 'Guides: [vision, video and 3D](docs/VISION-VIDEO-3D.md) · [finance, administration and business](docs/BUSINESS-AI.md). Exports: [summary](generated/catalog.json) · [full metadata](generated/catalog.full.json) · [coverage and unknowns](generated/coverage.json).\n\n';
  const domains = [...new Set(entries.map(e => e.domain))];
  out += domains.map(d => `[${escapeCell(d)}](#catalogue-${d})`).join(' · ') + '\n\n';
  for (const domain of domains) {
    out += `<a id="catalogue-${domain}"></a>\n\n### ${domain.charAt(0).toUpperCase() + domain.slice(1).replaceAll('-', ' ')}\n\n`;
    out += '| Entry / source | Kind / use | Task | Params | Model file | Runtime / format | Target class | License C / W | Compatibility |\n';
    out += '|---|---|---|---:|---:|---|---|---|---|\n';
    for (const e of entries.filter(e => e.domain === domain)) {
      const runtime = [...new Set([...(e.runtimes ?? []), ...(e.formats ?? [])])].join(', ') || '—';
      const compatibility = e.compatibility.length ? e.compatibility.map((c: any) => `${c.target}: ${c.status}`).join('; ') : 'unknown';
      out += `| [${escapeCell(e.name)}](${e.path}) · [upstream](<${upstream(e)}>) | ${kindOf(e)} / ${usageOf(e)} | ${escapeCell(e.tasks.join(', '))} | ${formatParams(e.model.parameters)} | ${formatSize(e.model.file_size_mb)} | ${escapeCell(runtime)} | ${escapeCell(e.deployment.targets.join(', ') || '—')} | ${escapeCell(e.license.code)} / ${escapeCell(e.license.weights)} | ${escapeCell(compatibility)} |\n`;
    }
    out += '\n';
  }
  return out;
}
export function renderCatalogueSummary(entries: Entry[]): string {
  const domains = new Set(entries.map(e => e.domain)).size;
  return `**${entries.length} entries** across ${domains} domains — models, collections, pipelines, toolkits and non-AI primitives. Browse the full generated catalogue in [docs/CATALOGUE.md](docs/CATALOGUE.md); machine-readable exports are in [\`generated/\`](generated/).`;
}
export function renderCataloguePage(entries: Entry[]): string {
  return `# embedded-AI catalogue\n\n> Generated from YAML in \`catalog/\`, \`pipelines/\` and \`primitives/\`. Do not edit by hand — run \`npm run index\` to regenerate.\n\n${renderCatalogue(entries)}`;
}
export function renderAtAGlance(entries: Entry[]): string {
  const domains = new Set(entries.map(e => e.domain)).size;
  const kinds = new Set(entries.map(kindOf)).size;
  return [
    '| | |',
    '|---|---|',
    `| **${entries.length} entries** | models, collections, pipelines, toolkits and primitives |`,
    `| **${domains} domains** | vision, audio, language, robotics, gaming, genomics and more |`,
    `| **${kinds} kinds** | model · collection · pipeline · toolkit · primitive |`,
  ].join('\n');
}
const DOMAIN_ORDER = ['audio', 'video', 'vision', 'language', 'geospatial', 'weather', 'climate', 'time-series', 'engineering', 'robotics', 'control', 'science', 'genomics', 'drug-discovery', 'sensors', 'mapping', 'simulation', 'gaming', 'music', 'healthcare', 'agriculture', 'automotive', 'manufacturing', 'finance', 'fraud-detection', 'recommendation', 'administrative', 'business', 'infrastructure', 'energy', 'security', 'runtime', 'telecom', 'networking', 'benchmark', 'artificial-life', 'neuromorphic', 'event-vision', 'education', 'trust-and-safety', 'federated-learning', 'quantum', 'marine', 'accessibility', 'environment', 'fashion', 'space', 'hydrology', 'forestry', 'sports', 'graph', 'retrieval', 'agents', 'reasoning'];
const DOMAIN_TITLES: Record<string, string> = { 'time-series': 'Time series', engineering: 'Engineering/CAD', 'drug-discovery': 'Drug discovery', administrative: 'Administration', infrastructure: 'IT infrastructure', 'artificial-life': 'Artificial life', 'event-vision': 'Event vision', 'trust-and-safety': 'Trust & safety', 'federated-learning': 'Federated learning', 'fraud-detection': 'Fraud detection' };
const domainTitle = (d: string): string => DOMAIN_TITLES[d] ?? d.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
export function renderDomains(entries: Entry[]): string {
  const domains = [...new Set(entries.map(e => e.domain))];
  const ordered = [...DOMAIN_ORDER.filter(d => domains.includes(d)), ...domains.filter(d => !DOMAIN_ORDER.includes(d)).sort(cmp)];
  return `${domains.length} domains: ${ordered.map(domainTitle).join(' · ')}.`;
}
export function replaceBlock(readme: string, start: string, end: string, body: string): string {
  const starts = readme.split(start).length - 1, ends = readme.split(end).length - 1;
  const block = `${start}\n${body.trimEnd()}\n${end}`;
  if (!starts && !ends) return readme.trimEnd() + '\n\n' + block + '\n';
  if (starts !== 1 || ends !== 1 || readme.indexOf(start) > readme.indexOf(end)) throw new Error(`README markers ${start} / ${end} are missing, duplicated or reversed`);
  return readme.slice(0, readme.indexOf(start)) + block + readme.slice(readme.indexOf(end) + end.length);
}
export function updateReadme(readme: string, catalogue: string): string {
  return replaceBlock(readme, '<!-- CATALOG:START -->', '<!-- CATALOG:END -->', catalogue);
}
export function renderIndex(entries: Entry[]): string {
  return '[\n' + entries.map(e => '  ' + JSON.stringify({ id: e.id, name: e.name, domain: e.domain, tasks: e.tasks, class: e.class,
    parameters: e.model.parameters ?? null, file_size_mb: e.model.file_size_mb ?? null, path: e.path, kind: kindOf(e), upstream: upstream(e), usage_mode: usageOf(e) })).join(',\n') + '\n]\n';
}
export function renderFullIndex(entries: Entry[]): string {
  return JSON.stringify({ schema_version: 1, entries: entries.map(e => ({ ...e, kind: kindOf(e), usage_mode: usageOf(e) })) }, null, 2) + '\n';
}
export function renderCoverage(entries: Entry[]): string {
  const countBy = (fn: (e: Entry) => string) => Object.fromEntries([...new Set(entries.map(fn))].sort(cmp).map(key => [key, entries.filter(e => fn(e) === key).length]));
  return JSON.stringify({ total: entries.length, by_domain: countBy(e => e.domain), by_kind: countBy(kindOf), by_usage: countBy(usageOf),
    unknowns: { usage: entries.filter(e => usageOf(e) === 'unknown').length, code_license: entries.filter(e => e.license.code === 'unknown').length,
      weights_license: entries.filter(e => e.license.weights === 'unknown').length, measured_peak_ram: entries.filter(e => e.requirements?.ram_mb?.measured_peak == null).length },
    reproduced_entries: entries.filter(e => e.compatibility.some((c: any) => c.status === 'reproduced')).length,
    note: 'Counts describe catalogue coverage, not deployment guarantees. Unknown RAM is not estimated from weights. Non-neural tools can legitimately lack model sizes.' }, null, 2) + '\n';
}
export function filterEntries(entries: Entry[], filters: { domain?: string; task?: string; kind?: string; usage?: string; query?: string } = {}): Entry[] {
  return entries.filter(e => (!filters.domain || e.domain === filters.domain) && (!filters.task || e.tasks.includes(filters.task)) &&
    (!filters.kind || kindOf(e) === filters.kind) && (!filters.usage || usageOf(e) === filters.usage) &&
    (!filters.query || [e.id, e.name, e.description ?? '', ...(e.tags ?? [])].join(' ').toLowerCase().includes(filters.query.toLowerCase())));
}
