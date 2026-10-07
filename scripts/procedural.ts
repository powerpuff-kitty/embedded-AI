import { type Entry, escapeCell, upstream } from './catalog.ts';
import { PROCEDURAL_CATEGORIES, viewOf } from '../site/methods.mjs';

/** One generated view over canonical manifests; never a second source of entries. */
export function renderProceduralPage(entries: Entry[]): string {
  const components = entries.filter(e => viewOf(e) === 'procedural');
  const recipes = entries.filter(e => viewOf(e) === 'hybrid');
  const byId = new Map(entries.map(e => [e.id, e]));
  let out = '# Procedural generation & simulation\n\n> Generated from canonical YAML. Do not edit by hand; run `npm run index`.\n\n';
  out += `**${components.length} procedural components** and **${recipes.length} hybrid recipes**. Category memberships overlap; entries are not duplicated.\n\n`;
  out += '[Integration guide](PROCEDURAL-GUIDE.md) · [All components](CATALOGUE.md) · [Live procedural view](https://powerpuff-kitty.github.io/embedded-AI/?view=procedural) · [Hybrid recipes](https://powerpuff-kitty.github.io/embedded-AI/?view=hybrid)\n\n';
  out += 'A browser library, standalone browser reference, native library, native authoring reference and shader library are different integration scopes. None implies measured device fit. **unknown** is not a negative result; **not-applicable** is not zero. A seed alone is not a cross-version replay guarantee.\n\n';
  for (const category of PROCEDURAL_CATEGORIES) {
    const group = components.filter(e => e.procedural.categories.includes(category));
    if (!group.length) continue;
    out += `## ${category}\n\n| Component / source | Integration | Output | Seed / determinism | Code licence | Evidence |\n|---|---|---|---|---|---|\n`;
    for (const e of group) {
      out += `| [${escapeCell(e.name)}](../${e.path}) · [upstream](<${upstream(e)}>) | ${e.procedural.integration} | ${escapeCell((e.data?.outputs ?? e.io?.outputs ?? e.outputs ?? []).join(', '))} | ${e.procedural.seed_control} / ${e.procedural.determinism} | ${escapeCell(e.license.code)} | ${e.procedural.evidence_level} |\n`;
    }
    out += '\n';
  }
  out += '## Hybrid recipes\n\nDesign recipes are proposed contracts, **not runnable integrations**. Their component sources do not establish end-to-end performance.\n\n';
  for (const e of recipes) {
    const refs = e.recipe.components.map((c: any) => `[${escapeCell(c.id)}](../${byId.get(c.id)!.path})`).join(' + ');
    out += `### [${escapeCell(e.name)}](../${e.path})\n\nStatus: **${e.recipe.status}**. Components: ${refs}.\n\n`;
    for (const contract of e.recipe.contracts) out += `- ${escapeCell(contract)}\n`;
    out += '\n';
  }
  return out.trimEnd() + '\n';
}
