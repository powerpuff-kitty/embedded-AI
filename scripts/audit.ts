import path from 'node:path';
import { loadEntries } from './catalog.ts';

const entries = await loadEntries();
const report: string[] = [];
const strict = process.argv.includes('--strict');
const kebab = /^[a-z0-9][a-z0-9-]*$/;
const isoDate = /^[0-9]{4}-[0-9]{2}-[0-9]{2}$/;
const problems: Record<string, string[]> = { 'id/filename': [], naming: [], description: [], reviewed: [], duplicateName: [] };
const names = new Map<string, string[]>();

for (const entry of entries) {
  if (path.basename(entry.path, '.yaml') !== entry.id) problems['id/filename'].push(`${entry.id} (\u2192 ${entry.path})`);
  for (const [field, value] of [['domain', entry.domain], ['class', entry.class], ...(entry.tasks ?? []).map((t: string) => ['task', t] as [string, string])]) {
    if (!kebab.test(value)) problems.naming.push(`${entry.id}: ${field} "${value}"`);
  }
  if (!entry.description || entry.description.trim().length < 20) problems.description.push(`${entry.id} (${(entry.description ?? '').length} chars)`);
  if (!entry.reviewed || !isoDate.test(entry.reviewed)) problems.reviewed.push(`${entry.id} (${entry.reviewed ?? 'missing'})`);
  const key = entry.name.trim().toLowerCase();
  if (!names.has(key)) names.set(key, []);
  (names.get(key) as string[]).push(entry.id);
}
for (const [name, ids] of names) if (ids.length > 1) problems.duplicateName.push(`${name}: ${ids.join(', ')}`);

const unknownCode = entries.filter(e => e.license?.code === 'unknown').length;
const unknownWeights = entries.filter(e => ['unknown'].includes(e.license?.weights)).length;
const measuredPeak = entries.filter(e => e.requirements?.ram_mb?.measured_peak != null).length;
const compat = { reproduced: 0, reported: 0, unknown: 0 };
for (const e of entries) for (const c of e.compatibility ?? []) if (c.status in compat) (compat as any)[c.status]++;

report.push(`Catalogue hygiene audit — ${entries.length} entries, ${new Set(entries.map(e => e.domain)).size} domains.`);
for (const [label, list] of Object.entries(problems)) report.push(`${label}: ${list.length}${list.length ? '  e.g. ' + list.slice(0, 8).join(' | ') : ''}`);
report.push(`unknown code licence: ${unknownCode}; unknown weights licence: ${unknownWeights}; entries with measured RAM: ${measuredPeak}`);
report.push(`compatibility: reproduced ${compat.reproduced}, reported ${compat.reported}, unknown ${compat.unknown}`);
console.log(report.join('\n'));

const structural = problems['id/filename'].length + problems.naming.length + problems.reviewed.length;
if (strict && structural) process.exitCode = 1;
