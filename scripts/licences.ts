import fs from 'node:fs/promises';
import { execFileSync } from 'node:child_process';
import { loadEntries } from './catalog.ts';

const write = process.argv.includes('--write');
const token = process.env.GITHUB_TOKEN || process.env.GH_TOKEN || (() => {
  try { return execFileSync('gh', ['auth', 'token'], { encoding: 'utf8' }).trim(); } catch { return ''; }
})();
const ghHeaders: Record<string, string> = { 'user-agent': 'embedded-ai-licence-audit' };
if (token) ghHeaders.authorization = `Bearer ${token}`;

const NORMALISE: Record<string, string> = {
  'apache-2.0': 'Apache-2.0', 'mit': 'MIT', 'bsd-3-clause': 'BSD-3-Clause', 'bsd-2-clause': 'BSD-2-Clause',
  'gpl-3.0': 'GPL-3.0', 'gpl-2.0': 'GPL-2.0', 'agpl-3.0': 'AGPL-3.0', 'lgpl-3.0': 'LGPL-3.0', 'mpl-2.0': 'MPL-2.0',
  'cc0-1.0': 'CC0-1.0', 'cc-by-4.0': 'CC-BY-4.0', 'cc-by-sa-4.0': 'CC-BY-SA-4.0', 'unlicense': 'Unlicense', 'isc': 'ISC'
};
const normalise = (value: string) => NORMALISE[value.toLowerCase()] ?? value;

const hostRepo = (url: string, host: string): string | null => {
  try { const u = new URL(url); if (u.hostname !== host) return null; const [owner, repo] = u.pathname.replace(/^\//, '').split('/'); return owner && repo ? `${owner}/${repo.replace(/\.git$/, '')}` : null; } catch { return null; }
};
async function getJson(url: string, headers: Record<string, string>) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 15000);
  try { const response = await fetch(url, { headers, signal: controller.signal }); return response.ok ? await response.json() : null; }
  catch { return null; } finally { clearTimeout(timer); }
}

const entries = await loadEntries() as any[];
type Job = { kind: 'code' | 'weights'; id: string; path: string; repo: string };
const jobs: Job[] = [];
for (const entry of entries) {
  if (entry.license?.code === 'unknown') {
    const repo = hostRepo(entry.links?.repository || entry.links?.model || '', 'github.com');
    if (repo) jobs.push({ kind: 'code', id: entry.id, path: entry.path, repo });
  }
  if (entry.license?.weights === 'unknown') {
    const repo = hostRepo(entry.links?.model || entry.links?.repository || entry.links?.homepage || '', 'huggingface.co');
    if (repo) jobs.push({ kind: 'weights', id: entry.id, path: entry.path, repo });
  }
}

const proposals: { kind: string; id: string; path: string; value: string }[] = [];
const manual: { kind: string; id: string; url: string }[] = [];
let cursor = 0;
async function worker() {
  while (cursor < jobs.length) {
    const job = jobs[cursor++];
    if (job.kind === 'code') {
      const data: any = await getJson(`https://api.github.com/repos/${job.repo}/license`, ghHeaders);
      const spdx = data?.license?.spdx_id;
      if (spdx && !['NOASSERTION', 'none'].includes(spdx)) proposals.push({ kind: 'code', id: job.id, path: job.path, value: spdx });
      else if (spdx === 'NOASSERTION') manual.push({ kind: 'code', id: job.id, url: data?.html_url || `https://github.com/${job.repo}` });
    } else {
      const data: any = await getJson(`https://huggingface.co/api/models/${job.repo}`, { 'user-agent': ghHeaders['user-agent'] });
      const tag = (data?.tags ?? []).find((t: string) => t.startsWith('license:'));
      const value = data?.cardData?.license ?? (tag ? tag.slice(8) : null);
      if (value) proposals.push({ kind: 'weights', id: job.id, path: job.path, value: normalise(String(value)) });
    }
  }
}
await Promise.all(Array.from({ length: 8 }, worker));

proposals.sort((a, b) => a.kind.localeCompare(b.kind) || a.id.localeCompare(b.id));
manual.sort((a, b) => a.id.localeCompare(b.id));
console.log(`Checked ${jobs.length} unknown licence(s) with a queryable host — ${proposals.length} resolvable from a primary source${token ? '' : ' (no GitHub token; rate-limited)'}.`);
for (const p of proposals) console.log(`${p.kind}\t${p.id}\t${p.value}\t${p.path}`);
if (manual.length) {
  console.log(`\n${manual.length} need manual review (custom/ambiguous licence — open the LICENSE and record the terms):`);
  for (const m of manual) console.log(`manual\t${m.id}\t${m.url}`);
}

if (write) {
  for (const p of proposals) {
    let source = await fs.readFile(p.path, 'utf8');
    const patterns = p.kind === 'code'
      ? ['code: unknown', 'code: "unknown"', '"code": "unknown"']
      : ['weights: unknown', 'weights: "unknown"', '"weights": "unknown"'];
    let replaced = false;
    for (const pattern of patterns) {
      if (source.includes(pattern)) {
        source = source.replace(pattern, pattern.replace('unknown', p.value));
        replaced = true;
        break;
      }
    }
    if (replaced) await fs.writeFile(p.path, source);
    else console.error(`could not update ${p.path}`);
  }
  console.log(`Wrote ${proposals.length} licence(s); run npm run index then npm run check.`);
}
