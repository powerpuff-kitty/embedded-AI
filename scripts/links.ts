import { loadEntries } from './catalog.ts';
const entries = await loadEntries();
const urls = new Map<string, string[]>();
for (const entry of entries) {
  const add = (value?: string | null) => {
    if (!value) return;
    try { const url = new URL(value); if (!['http:', 'https:'].includes(url.protocol) || url.hostname === 'localhost') return; }
    catch { return; }
    if (!urls.has(value)) urls.set(value, []);
    (urls.get(value) as string[]).push(entry.id);
  };
  for (const link of Object.values(entry.links ?? {})) add(link as string);
  for (const evidence of entry.evidence ?? []) add(evidence.url);
}

const targets = [...urls.keys()].sort();
const concurrency = Number(process.argv.find(a => a.startsWith('--concurrency='))?.split('=')[1] ?? 6);
const timeoutMs = Number(process.argv.find(a => a.startsWith('--timeout='))?.split('=')[1] ?? 15000);
const results: { url: string; status: number | string; entries: string[] }[] = [];

async function check(url: string) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const response = await fetch(url, { redirect: 'follow', signal: controller.signal, headers: { 'user-agent': 'embedded-ai-link-audit' } });
    await response.body?.cancel?.();
    results.push({ url, status: response.status, entries: urls.get(url) as string[] });
  } catch (error) {
    results.push({ url, status: error instanceof Error ? error.message.split('\n')[0].slice(0, 40) : 'error', entries: urls.get(url) as string[] });
  } finally {
    clearTimeout(timer);
  }
}

let cursor = 0;
async function worker() { while (cursor < targets.length) { const url = targets[cursor++]; await check(url); } }
await Promise.all(Array.from({ length: concurrency }, worker));

const failures = results.filter(r => typeof r.status === 'string' || (r.status as number) >= 400);
results.sort((a, b) => String(a.status).localeCompare(String(b.status)) || a.url.localeCompare(b.url));
console.log(`Checked ${results.length} unique URL(s) from ${entries.length} entries — ${failures.length} failure(s).`);
for (const failure of failures) console.log(`${failure.status}\t${failure.url}\t${failure.entries.join(',')}`);
if (process.argv.includes('--strict') && failures.length) process.exitCode = 1;
