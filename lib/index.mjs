/**
 * Public API for the embedded-ai-catalog package.
 *
 * Zero runtime dependencies. The catalogue data ships as JSON inside the
 * package, and the need matcher is reused from `site/needs.mjs` so the CLI,
 * the web explorer and this package always rank identically.
 *
 * Stable surface: `entries`, `coverage`, `get`, `domains`, `search`, `need`,
 * `shortlist`, `upstreamOf`, `version`. Everything else is internal and may
 * change without a major version bump.
 */
import { readFileSync } from 'node:fs';
import { matchesFacets, validateFacets } from '../site/methods.mjs';
export { METHODS, VIEWS, PROCEDURAL_CATEGORIES, methodsOf, viewOf } from '../site/methods.mjs';
import {
  matchNeeds,
  applyNeedConstraints,
  describeIntent,
  shortlistMarkdown,
  upstreamOf as upstreamOfEntry,
} from '../site/needs.mjs';

const load = (relative) => JSON.parse(readFileSync(new URL(relative, import.meta.url), 'utf8'));

const full = load('../generated/catalog.full.json');
const pkg = load('../package.json');

/** Package version, mirroring package.json. */
export const version = pkg.version;

/** The full catalogue entries, including every recorded field. */
export const entries = full.entries;

/** Coverage and unknown-count summary (generated/coverage.json). */
export const coverage = load('../generated/coverage.json');

const byId = new Map(entries.map((entry) => [entry.id, entry]));

/** Look up a single entry by its stable id. Returns null when absent. */
export function get(id) {
  return byId.get(id) ?? null;
}

/** Sorted list of domain slugs present in the catalogue. */
export const domains = Object.freeze([...new Set(entries.map((e) => e.domain))].sort());

const usageMode = (entry) => entry.usage_mode ?? entry.usage?.mode ?? 'unknown';

/**
 * Metadata search over id, name, description, tasks and tags.
 * Mirrors the `npm run search` CLI.
 */
export function search(query = '', filters = {}) {
  validateFacets(filters);
  const needle = String(query).toLowerCase();
  return entries.filter((entry) => matchesFacets(entry, filters) &&
    (!filters.domain || entry.domain === filters.domain) &&
    (!filters.task || (entry.tasks ?? []).includes(filters.task)) &&
    (!filters.kind || entry.kind === filters.kind) &&
    (!filters.usage || usageMode(entry) === filters.usage) &&
    (!needle || [entry.id, entry.name, entry.description ?? '', ...(entry.tasks ?? []), ...(entry.tags ?? []), ...(entry.methods ?? []), ...(entry.procedural?.categories ?? [])].join(' ').toLowerCase().includes(needle))
  );
}

/**
 * Rank entries against a plain-language need.
 *
 * @param {string} query e.g. "detect people offline with a tiny model"
 * @param {object} [options]
 * @param {number} [options.limit=20] max results returned
 * @param {object} [options.constraints] hard filters: {offline,pretrained,model,permissiveWeights,view,method,proceduralCategory}
 * @returns {{query:string,intent:string[],results:Array,excluded:Array}}
 */
export function need(query, { limit = 20, constraints = {} } = {}) {
  const { intent, results } = matchNeeds(entries, query, { limit: entries.length });
  const { kept, excluded } = applyNeedConstraints(results, constraints);
  return { query, intent: describeIntent(intent), results: kept.slice(0, limit), excluded };
}

/** Markdown shortlist for a selection of entries, suitable for a chat or issue. */
export const shortlist = shortlistMarkdown;

/** Best upstream URL for an entry (model card, repo, homepage or paper). */
export const upstreamOf = upstreamOfEntry;
