import fs from 'node:fs/promises';
import { existsSync } from 'node:fs';
import path from 'node:path';
import fg from 'fast-glob';
import YAML from 'yaml';
import Ajv2020 from 'ajv/dist/2020.js';

export type Entry = Record<string, any> & { id: string; name: string; domain: string; tasks: string[]; path: string };
const schema = JSON.parse(await fs.readFile(new URL('../schema/model.schema.json', import.meta.url), 'utf8'));
const ajv = new Ajv2020({ allErrors: true, strict: false });
ajv.addFormat('http-url', (value: string) => {
  try { const u = new URL(value); return ['http:', 'https:'].includes(u.protocol) && !!u.hostname && !u.username && !u.password; }
  catch { return false; }
});
const validate = ajv.compile(schema);
const cmp = (a: string, b: string) => a < b ? -1 : a > b ? 1 : 0;
export function kindOf(e: Entry): string {
  return e.kind ?? (e.class === 'tracking-system' ? 'pipeline' : e.class === 'model-collection' ? 'collection' : 'model');
}
export function validateEntries(entries: Entry[], root = process.cwd()): void {
  const errors: string[] = [], ids = new Set<string>();
  for (const e of entries) {
    if (!validate(e)) { errors.push(`${e.path}: ${ajv.errorsText(validate.errors, { separator: '; ' })}`); continue; }
    if (ids.has(e.id)) errors.push(`${e.path}: duplicate id ${e.id}`);
    ids.add(e.id);
    if (!Object.values(e.links).some(Boolean)) errors.push(`${e.path}: at least one upstream link is required`);
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
  const paths = await fg(['catalog/**/*.yaml', 'pipelines/**/*.yaml', 'primitives/**/*.yaml'], {
    cwd: root, ignore: ['**/_*.yaml'], followSymbolicLinks: false,
  });
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
  out += 'Names link to manifests; upstream links point to the original projects. **—** means unknown or not applicable, never zero. Model file sizes use decimal MB/kB and are not RAM requirements. Sizes are checkpoint-dependent; read each manifest for scope.\n\n';
  out += '**C / W** = code license / weights license. Unknown weights terms are never replaced by the code license. Target classes are upstream/proposed targets, not reproduced compatibility. Status is kept per hardware target; no global supported/unsupported badge is inferred.\n\n';
  out += 'Companion tools are included for composition, not labelled as tiny neural networks. Live/causal versus windowed/offline processing and camera/coordinate requirements are recorded in the new vision manifests. See [vision and 3D guide](docs/VISION-VIDEO-3D.md).\n\n';
  const domains = [...new Set(entries.map(e => e.domain))];
  out += domains.map(d => `[${escapeCell(d)}](#catalogue-${d})`).join(' · ') + '\n\n';
  for (const domain of domains) {
    out += `<a id="catalogue-${domain}"></a>\n\n### ${domain.charAt(0).toUpperCase() + domain.slice(1).replaceAll('-', ' ')}\n\n`;
    out += '| Entry / source | Kind | Task | Params | Model file | Runtime / format | Target class | License C / W | Compatibility |\n';
    out += '|---|---|---|---:|---:|---|---|---|---|\n';
    for (const e of entries.filter(e => e.domain === domain)) {
      const runtime = [...new Set([...(e.runtimes ?? []), ...(e.formats ?? [])])].join(', ') || '—';
      const compatibility = e.compatibility.length ? e.compatibility.map((c: any) => `${c.target}: ${c.status}`).join('; ') : 'unknown';
      out += `| [${escapeCell(e.name)}](${e.path}) · [upstream](<${upstream(e)}>) | ${kindOf(e)} | ${escapeCell(e.tasks.join(', '))} | ${formatParams(e.model.parameters)} | ${formatSize(e.model.file_size_mb)} | ${escapeCell(runtime)} | ${escapeCell(e.deployment.targets.join(', ') || '—')} | ${escapeCell(e.license.code)} / ${escapeCell(e.license.weights)} | ${escapeCell(compatibility)} |\n`;
    }
    out += '\n';
  }
  return out;
}
export function updateReadme(readme: string, catalogue: string): string {
  const start = '<!-- CATALOG:START -->', end = '<!-- CATALOG:END -->';
  const starts = readme.split(start).length - 1, ends = readme.split(end).length - 1;
  const block = `${start}\n\n${catalogue}${end}`;
  if (!starts && !ends) return readme.trimEnd() + '\n\n' + block + '\n';
  if (starts !== 1 || ends !== 1 || readme.indexOf(start) > readme.indexOf(end)) throw new Error('README catalogue markers are missing, duplicated or reversed');
  return readme.slice(0, readme.indexOf(start)) + block + readme.slice(readme.indexOf(end) + end.length);
}
export function renderIndex(entries: Entry[]): string {
  // Stable summary index; full source metadata remains in each linked YAML manifest.
  return '[\n' + entries.map(e => '  ' + JSON.stringify({ id: e.id, name: e.name, domain: e.domain, tasks: e.tasks, class: e.class,
    parameters: e.model.parameters ?? null, file_size_mb: e.model.file_size_mb ?? null, path: e.path, kind: kindOf(e), upstream: upstream(e) })).join(',\n') + '\n]\n';
}
