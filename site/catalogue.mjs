/** Pure catalogue queries shared by the browser and Node tests. */
export const number = value => typeof value === 'number' && Number.isFinite(value) && value >= 0 ? value : null;
export const format = value => number(value) === null ? 'Unknown' : new Intl.NumberFormat('en', { maximumFractionDigits: 2 }).format(value);
export function budgetEvidence(entry, filters, runs = []) {
  if (!filters.target) return { status: 'unknown', reason: 'Choose an exact measured environment.' };
  const matching = runs.filter(r => r.entry_id === entry.id && r.hardware?.id === filters.target && number(r.process_peak_rss_mb) !== null);
  if (!matching.length) return { status: 'unknown', reason: 'No measured run on this target.' };
  const worst = matching.reduce((a,b) => a.process_peak_rss_mb > b.process_peak_rss_mb ? a : b);
  return { status: filters.ram && worst.process_peak_rss_mb > Number(filters.ram) ? 'over-budget' : 'observed',
           ram: worst.process_peak_rss_mb, reason: 'Observed process RSS for the linked workloads, not guaranteed device fit.', run: worst };
}
export function partition(entries, filters = {}, runs = []) {
  const matching = [], candidates = [];
  if(filters.ram && (!Number.isFinite(Number(filters.ram)) || Number(filters.ram)<0))return {matching,candidates};
  for (const entry of entries) {
    const haystack = [entry.name, entry.id, entry.domain, entry.description, ...(entry.tasks || []), ...(entry.tags || [])].join(' ').toLowerCase();
    if (filters.q && !haystack.includes(filters.q.toLowerCase())) continue;
    if (filters.domain && entry.domain !== filters.domain) continue;
    if (filters.task && !entry.tasks.includes(filters.task)) continue;
    if (filters.kind && entry.kind !== filters.kind) continue;
    if (filters.usage && (entry.usage?.mode || 'unknown') !== filters.usage) continue;
    if (filters.runtime && ![...(entry.runtimes || []), ...(entry.formats || [])].includes(filters.runtime)) continue;
    if (filters.offline && entry.deployment?.offline !== true) continue;
    if (filters.license && entry.license?.weights !== filters.license) continue;
    if (filters.target || filters.ram) {
      const evidence = budgetEvidence(entry, filters, runs);
      if (evidence.status === 'over-budget') continue;
      if (evidence.status === 'unknown') { if (filters.candidates) candidates.push(entry); continue; }
    }
    matching.push(entry);
  }
  const sort = (a,b) => a.name.localeCompare(b.name);
  return { matching: matching.sort(sort), candidates: candidates.sort(sort) };
}
export function safeURL(value) {
  try { const url = new URL(value); return ['https:', 'http:'].includes(url.protocol) && !url.username && !url.password ? url.href : null; }
  catch { return null; }
}
