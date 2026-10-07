/**
 * Pure tool implementations for the embedded-AI MCP server.
 *
 * Kept free of the MCP SDK so they can be unit-tested directly. Each function
 * returns a Markdown string. In a checkout, use the sibling catalogue so tests exercise current edits;
 * installed MCP packages fall back to their embedded-ai-catalog dependency.
 */
const catalog = await (async () => {
  try { return await import('../lib/index.mjs'); }
  catch (error) { if (error.code !== 'ERR_MODULE_NOT_FOUND') throw error; return await import('embedded-ai-catalog'); }
})();

export const version = catalog.version;
export const entries = catalog.entries;
export const coverage = catalog.coverage;

const upstream = (entry) => catalog.upstreamOf(entry) || 'not recorded';
const use = (entry) => `${entry.kind} / ${entry.usage_mode ?? entry.usage?.mode ?? 'unknown'}`;

function entryLine(entry, index) {
  const tasks = (entry.tasks ?? []).join(', ') || 'unknown';
  return [
    `${index}. **${entry.name}** (\`${entry.id}\`) — ${use(entry)} · ${entry.domain}`,
    `   - tasks: ${tasks}`,
    `   - upstream: ${upstream(entry)}`,
    `   - manifest: \`${entry.path}\``,
  ].join('\n');
}

export function needTool({ query, limit = 10, offline = false, pretrained = false, model = false, view, method, proceduralCategory } = {}) {
  if (!query || !String(query).trim()) throw new Error('query is required');
  const { intent, results, excluded } = catalog.need(query, { limit, constraints: { offline, pretrained, model, view, method, proceduralCategory } });
  const head = [`# Matches for: ${query}`, '', intent.length ? `Intent: ${intent.join(', ')}` : 'Intent: (none detected)', ''];
  if (!results.length) head.push('No entries matched. Try naming the task, sensor or constraint differently.');
  else head.push(...results.map((r, i) => `${entryLine(r.entry, i + 1)}\n   - rank score: ${r.score}${r.reasons.length ? ` · why: ${r.reasons.slice(0, 4).join('; ')}` : ''}`));
  if (excluded.length) head.push('', `_${excluded.length} higher-ranked match(es) were hidden by your constraints._`);
  return head.join('\n');
}

export function searchTool({ query = '', domain, task, kind, usage, view, method, proceduralCategory, limit = 25 } = {}) {
  const matches = catalog.search(query, { domain, task, kind, usage, view, method, proceduralCategory });
  const shown = matches.slice(0, limit);
  const head = [`# ${matches.length} matching entries`, ''];
  if (!matches.length) head.push('Nothing matched those filters.');
  else {
    head.push(...shown.map((entry, i) => entryLine(entry, i + 1)));
    if (matches.length > shown.length) head.push('', `_Showing ${shown.length} of ${matches.length}; narrow the query for the rest._`);
  }
  return head.join('\n');
}

export function getTool({ id } = {}) {
  if (!id) throw new Error('id is required');
  const entry = catalog.get(id);
  if (!entry) return `No entry with id \`${id}\`. Use the search tool to find one.`;
  const lines = [
    `# ${entry.name} (\`${entry.id}\`)`,
    '',
    entry.description || '_(no reviewed description)_',
    '',
    `- kind / use: ${use(entry)}`,
    `- domain: ${entry.domain}`,
    `- tasks: ${(entry.tasks ?? []).join(', ') || 'unknown'}`,
    `- runtimes / formats: ${[...(entry.runtimes ?? []), ...(entry.formats ?? [])].join(', ') || 'unknown'}`,
    `- licence (code / weights): ${entry.license?.code} / ${entry.license?.weights}`,
    `- offline: ${entry.deployment?.offline === true ? 'documented' : 'unknown'}`,
    `- compatibility: ${(entry.compatibility ?? []).map((c) => `${c.target}: ${c.status}`).join('; ') || 'unknown'}`,
    `- upstream: ${upstream(entry)}`,
    `- manifest: \`${entry.path}\``,
  ];
  if (entry.methods?.length) lines.push(`- methods: ${entry.methods.join(', ')}`);
  if (entry.procedural) lines.push(`- procedural: ${entry.procedural.categories.join(', ')} / ${entry.procedural.integration}`, `- seed: ${entry.procedural.seed_control}; determinism: ${entry.procedural.determinism}`);
  if (entry.recipe) lines.push(`- recipe status: ${entry.recipe.status}`, ...entry.recipe.components.map(c => `- component: ${c.id} — ${c.role}`));
  if ((entry.limitations ?? []).length) lines.push('', 'Limitations:', ...entry.limitations.map((l) => `- ${l}`));
  return lines.join('\n');
}

export function domainsTool() {
  const byDomain = catalog.coverage.by_domain;
  const rows = Object.entries(byDomain).sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]));
  return ['# Domains', '', `${rows.length} domains, ${catalog.coverage.total} entries:`, '', ...rows.map(([d, n]) => `- ${d} (${n})`)].join('\n');
}

export function statsTool() {
  const c = catalog.coverage;
  const e = c.evidence ?? {};
  return [
    `# embedded-AI catalogue (v${version})`,
    '',
    `- entries: ${c.total}`,
    `- domains: ${Object.keys(c.by_domain).length}`,
    `- views: ${Object.entries(c.by_view ?? {}).map(([k, n]) => `${k} ${n}`).join(', ')}`,
    `- methods (overlapping): ${Object.entries(c.by_method ?? {}).map(([k, n]) => `${k} ${n}`).join(', ')}`,
    `- kinds: ${Object.entries(c.by_kind).map(([k, n]) => `${k} ${n}`).join(', ')}`,
    `- entries with a source: ${e.entries_with_source ?? 'unknown'} (${e.entries_official_link_only ?? '?'} official-link only)`,
    `- measured RAM: ${e.measured_ram ?? 0} · reproduced compatibility: ${e.reproduced ?? 0} · reported: ${e.reported ?? 0}`,
    `- unknown weights licence: ${c.unknowns?.weights_license ?? 'unknown'}`,
    '',
    '_Evidence status is reported honestly: most entries stop at an official link with no measured or reproduced result._',
  ].join('\n');
}
