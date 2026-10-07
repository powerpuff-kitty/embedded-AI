import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import { loadEntries, validateEntries, filterEntries, renderCoverage, renderIndex, renderFullIndex } from '../scripts/catalog.ts';
import { renderProceduralPage } from '../scripts/procedural.ts';
import { methodsOf, viewOf, hasModelSize, matchesFacets, validateFacets, PROCEDURAL_CATEGORIES } from '../site/methods.mjs';
import { partition } from '../site/catalogue.mjs';
import { search, need, get, entries as packaged } from '../lib/index.mjs';
import { searchTool, needTool, getTool, statsTool } from '../mcp/tools.mjs';
const entries = await loadEntries();
const byId = new Map(entries.map(e => [e.id, e]));
const ids = (items: any[]) => items.map(e => e.id).sort();
const changed = (id: string, mutate: (e: any) => void) => entries.map(e => {
  const copy = structuredClone(e); if (e.id === id) mutate(copy); return copy;
});
const cli = (...args: string[]) => spawnSync(process.execPath, ['--import', 'tsx', ...args], { encoding: 'utf8' });

test('method inference is conservative and explicit metadata wins', () => {
  assert.deepEqual(methodsOf({kind:'primitive'}), []);
  assert.deepEqual(methodsOf({kind:'model',learned:false}), []);
  assert.deepEqual(methodsOf({class:'tracking-system'}), []);
  assert.deepEqual(methodsOf({class:'model-collection'}), ['learned']);
  assert.deepEqual(methodsOf({}), ['learned']);
  assert.deepEqual(methodsOf({learned:true,kind:'primitive'}), ['learned']);
  assert.deepEqual(methodsOf({kind:'primitive',methods:['procedural','physics-based']}), ['procedural','physics-based']);
  assert.equal(viewOf({kind:'primitive'}), 'unclassified');
  assert.equal(viewOf({kind:'model'}), 'ai');
  assert.equal(viewOf(byId.get('ez-tree')), 'procedural');
  assert.equal(viewOf(byId.get('hybrid-living-world')), 'hybrid');
  assert.equal(hasModelSize(byId.get('ez-tree')), false);
  assert.equal(hasModelSize(byId.get('smollm')), true);
});

test('new canonical batch is sourced, nonlearned and not claimed reproduced', () => {
  const additions = entries.filter(e => e.path.startsWith('primitives/procedural/'));
  assert.equal(additions.length, 24);
  for (const e of additions) {
    assert.equal(e.learned, false); assert.equal(e.license.weights, 'not-applicable');
    assert.equal(e.model.parameters, null); assert.equal(e.model.file_size_mb, null);
    assert.equal(e.requirements.ram_mb.measured_peak, null);
    assert.equal(e.procedural.evidence_level, 'documented');
    assert.ok(e.evidence.some((x:any) => x.type === 'official' && x.url === e.links.repository));
    assert.equal(entries.filter(x => x.links.repository?.toLowerCase() === e.links.repository.toLowerCase()).length, 1);
  }
  assert.equal(byId.get('wavefunctioncollapse')!.license.code, 'MIT');
  assert.match(byId.get('wavefunctioncollapse')!.limitations.join(' '), /excluded from the software licence/);
  assert.equal(byId.get('jsfxr')!.license.code, 'Unlicense');
  assert.equal(byId.get('infinigen')!.procedural.integration, 'native-reference');
  assert.equal(byId.get('shan-shui-inf')!.procedural.integration, 'browser-reference');
});

test('all seven categories are populated without moving existing entries', () => {
  for (const category of PROCEDURAL_CATEGORIES) assert.ok(entries.some(e => e.procedural?.categories.includes(category)));
  assert.equal(byId.get('lenia')!.path, 'primitives/artificial-life/lenia.yaml');
  assert.equal(byId.get('mujoco')!.path, 'primitives/simulation/mujoco.yaml');
  assert.equal(filterEntries(entries, {view:'procedural'}).length, 29);
  assert.equal(filterEntries(entries, {view:'hybrid'}).length, 3);
});

test('facets intersect identically in scripts, package and browser', () => {
  for (const filters of [{view:'procedural'}, {view:'ai'}, {view:'hybrid'}, {method:'physics-based'},
    {view:'procedural',method:'rule-based',proceduralCategory:'audio-music'}, {view:'ai',proceduralCategory:'foundations'}]) {
    const expected=ids(filterEntries(entries,filters));
    assert.deepEqual(ids(search('',filters)), expected);
    assert.deepEqual(ids(partition(packaged,filters).matching), expected);
  }
  assert.equal(matchesFacets({}, {proceduralCategory:'foundations'}), false);
  for (const key of ['view','method','proceduralCategory']) {
    assert.throws(()=>validateFacets({[key]:'bad'}), /Invalid/);
    assert.throws(()=>search('',{[key]:'bad'}), /Invalid/);
    assert.throws(()=>need('procedural',{constraints:{[key]:'bad'}}), /Invalid/);
  }
});

test('constraints apply before limits and procedural need is explained', () => {
  const result=need('procedural sound effects',{limit:2,constraints:{view:'procedural',proceduralCategory:'audio-music'}});
  assert.equal(result.results.length,2);
  assert.ok(result.intent.join(' ').includes('procedural'));
  for (const {entry,reasons} of result.results) {
    assert.ok(entry.procedural.categories.includes('audio-music'));
    assert.ok(reasons.some((s:string)=>s.includes('procedural')));
  }
  assert.ok(result.excluded.length>0);
});

test('CLI metadata and need filters agree with the package', () => {
  let result=cli('scripts/search.ts','--view','procedural','--proceduralCategory','audio-music','--json');
  assert.equal(result.status,0,result.stderr);
  assert.deepEqual(ids(JSON.parse(result.stdout)),ids(search('',{view:'procedural',proceduralCategory:'audio-music'})));
  result=cli('scripts/need.ts','procedural terrain','--view','procedural','--limit','3','--json');
  assert.equal(result.status,0,result.stderr);
  assert.deepEqual(JSON.parse(result.stdout).results.map((e:any)=>e.id),need('procedural terrain',{limit:3,constraints:{view:'procedural'}}).results.map((r:any)=>r.entry.id));
  result=cli('scripts/search.ts','--method','not-an-enum');
  assert.equal(result.status,1);assert.match(result.stderr,/Invalid method/);
  result=cli('scripts/need.ts','procedural','--view','not-an-enum');
  assert.equal(result.status,1);assert.match(result.stderr,/Invalid view/);
});

test('MCP exposes facets, recipe status and method coverage', () => {
  assert.match(searchTool({view:'hybrid'}), /3 matching entries/);
  assert.match(searchTool({view:'procedural',proceduralCategory:'audio-music'}), /ZzFX/);
  assert.doesNotMatch(needTool({query:'procedural',view:'procedural',proceduralCategory:'audio-music'}), /Infinigen/);
  assert.match(getTool({id:'ez-tree'}), /seed: built-in; determinism: conditional/);
  assert.match(getTool({id:'hybrid-living-world'}), /recipe status: design/);
  assert.match(getTool({id:'hybrid-living-world'}), /component: smollm/);
  assert.match(statsTool(), /procedural 29/);
});

for (const [label, mutate, pattern] of [
  ['invalid method',(e:any)=>e.methods=['voodoo'],/allowed values/],
  ['invalid category',(e:any)=>e.procedural.categories=['bad'],/allowed values/],
  ['missing metadata',(e:any)=>delete e.procedural,/requires metadata/],
  ['metadata without method',(e:any)=>e.methods=['rule-based'],/metadata requires/],
  ['false but learned',(e:any)=>e.methods.push('learned'),/conflicts/],
  ['true without learned',(e:any)=>e.learned=true,/requires learned/],
  ['zero model size',(e:any)=>e.model.parameters=0,/non-learned/],
  ['unknown rather than NA weights',(e:any)=>e.license.weights='unknown',/not-applicable/],
  ['reproduction without record',(e:any)=>e.procedural.evidence_level='reproduced',/benchmark-backed/],
] as const) test(`procedural validation rejects ${label}`, () => {
  assert.throws(()=>validateEntries(changed('ez-tree',mutate)),pattern);
});

for (const [label,mutate,pattern] of [
  ['dangling',(e:any)=>e.recipe.components[0].id='missing-component',/invalid recipe component/],
  ['self',(e:any)=>e.recipe.components[0].id=e.id,/invalid recipe component/],
  ['nested',(e:any)=>e.recipe.components[0].id='hybrid-game-sound',/invalid recipe component/],
  ['duplicate',(e:any)=>e.recipe.components[1].id='smollm',/duplicate recipe component/],
  ['only procedural',(e:any)=>e.recipe.components[0].id='rough-js',/both learned and procedural/],
  ['no hybrid method',(e:any)=>e.methods=e.methods.filter((x:string)=>x!=='hybrid'),/hybrid recipe requires/],
  ['malformed shape',(e:any)=>e.recipe.components=null,/must be array/],
  ['design entrypoint',(e:any)=>e.recipe.entrypoint='recipes/__init__.py',/design recipe is not runnable/],
  ['runnable missing path',(e:any)=>e.recipe.status='runnable',/existing recipes/],
  ['runnable missing file',(e:any)=>{e.recipe.status='runnable';e.recipe.entrypoint='recipes/missing-file.py';},/existing recipes/],
  ['runnable traversal',(e:any)=>{e.recipe.status='runnable';e.recipe.entrypoint='recipes/../README.md';},/existing recipes/],
] as const) test(`recipe validation rejects ${label}`, () => {
  assert.throws(()=>validateEntries(changed('hybrid-living-world',mutate)),pattern);
});

test('runnable and reproduced status require concrete local references', async () => {
  const dir=await fs.mkdtemp(path.join(os.tmpdir(),'procedural-'));
  try {
    await fs.mkdir(path.join(dir,'recipes'),{recursive:true});await fs.writeFile(path.join(dir,'recipes/demo.mjs'),'// Test fixture only');
    const subset=['smollm','ez-tree','yuka','hybrid-living-world'].map(id=>structuredClone(byId.get(id)!));
    const r=subset.at(-1)!;r.recipe.status='runnable';r.recipe.entrypoint='recipes/demo.mjs';
    validateEntries(subset,dir);
    const p=subset[1];await fs.mkdir(path.join(dir,'benchmarks'),{recursive:true});await fs.writeFile(path.join(dir,'benchmarks/fixture.json'),'{}');
    p.procedural.evidence_level='reproduced';p.compatibility=[{target:'test-fixture',status:'reproduced',benchmark:'benchmarks/fixture.json'}];
    validateEntries(subset,dir);
  } finally { await fs.rm(dir,{recursive:true,force:true}); }
});

test('generated views preserve metadata, canonical links and overlapping method counts', () => {
  const full=JSON.parse(renderFullIndex(entries));const summary=JSON.parse(renderIndex(entries));const coverage=JSON.parse(renderCoverage(entries));
  assert.equal(full.entries.find((e:any)=>e.id==='ez-tree').procedural.seed_control,'built-in');
  assert.equal(summary.find((e:any)=>e.id==='ez-tree').view,'procedural');
  assert.equal(coverage.by_view.procedural,29);assert.equal(coverage.by_view.hybrid,3);
  assert.equal(Object.values(coverage.by_view).reduce((a:any,b:any)=>a+b,0),entries.length);
  assert.ok(coverage.by_method.procedural>coverage.by_view.procedural);
  const markdown=renderProceduralPage(entries);
  assert.match(markdown,/29 procedural components/);assert.match(markdown,/not runnable integrations/);
  assert.match(markdown,/\.\.\/primitives\/artificial-life\/lenia.yaml/);
  assert.match(markdown,/\.\.\/catalog\//);
  assert.ok(!renderProceduralPage([]).includes('## audio-music'));
  assert.equal(get('hybrid-living-world').recipe.status,'design');
});
