/** Shared, offline facets. Component kind, method and deployment are independent. */
export const METHODS = Object.freeze(['learned', 'procedural', 'rule-based', 'physics-based', 'hybrid']);
export const VIEWS = Object.freeze(['ai', 'procedural', 'hybrid']);
export const PROCEDURAL_CATEGORIES = Object.freeze(['worlds-environments', 'vegetation-ecosystems', 'images-materials', 'motion-behaviour', 'audio-music', 'foundations', 'narrative-text']);

/** Explicit metadata wins. Only legacy model/collection kinds imply learned. */
export function methodsOf(entry) {
  if (entry.methods) return entry.methods;
  if (entry.learned === false) return [];
  const kind = entry.kind ?? (entry.class === 'model-collection' ? 'collection' : entry.class === 'tracking-system' ? 'pipeline' : 'model');
  return entry.learned === true || ['model', 'collection'].includes(kind) ? ['learned'] : [];
}
export function viewOf(entry) {
  if (entry.recipe) return 'hybrid';
  if (methodsOf(entry).includes('procedural')) return 'procedural';
  if (methodsOf(entry).includes('learned')) return 'ai';
  return 'unclassified';
}
export function matchesFacets(entry, filters = {}) {
  return (!filters.view || viewOf(entry) === filters.view) &&
    (!filters.method || methodsOf(entry).includes(filters.method)) &&
    (!filters.proceduralCategory || (entry.procedural?.categories ?? []).includes(filters.proceduralCategory));
}
export function validateFacets(filters = {}) {
  for (const [key, allowed] of [['view', VIEWS], ['method', METHODS], ['proceduralCategory', PROCEDURAL_CATEGORIES]]) {
    if (filters[key] && !allowed.includes(filters[key])) throw new Error(`Invalid ${key}: ${filters[key]}`);
  }
}
/** N/A is different from an unmeasured model, and is never represented by zero. */
export function hasModelSize(entry) {
  return entry.learned !== false && !['primitive', 'toolkit', 'pipeline'].includes(entry.kind);
}
