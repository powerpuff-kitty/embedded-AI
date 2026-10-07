import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import Ajv2020 from 'ajv/dist/2020.js';
import {loadEntries,filterEntries} from '../scripts/catalog.ts';
const entries=await loadEntries();
const names=['manifold','three-bvh-csg','d3-delaunay','isosurface','canvas-sketch','canvas-sketch-util','tone-js','scribbletune'];
test('browser-lab research batch is canonical, scoped, documented and nonlearned',()=>{
 const batch=entries.filter(e=>e.catalogue_batch==='procedural-lab-expansion-2026-10-07');assert.deepEqual(batch.map(e=>e.id).sort(),names.slice().sort());
 for(const e of batch){assert.equal(e.learned,false);assert.equal(e.license.weights,'not-applicable');assert.equal(e.model.parameters,null);assert.equal(e.requirements.ram_mb.measured_peak,null);assert.equal(e.procedural.evidence_level,'documented');assert.deepEqual(e.compatibility,[]);assert.ok(e.limitations.length>=2);assert.equal(entries.filter(x=>x.links.repository===e.links.repository).length,1);assert.ok(filterEntries(entries,{view:'procedural'}).includes(e));assert.ok(!filterEntries(entries,{view:'ai'}).includes(e));}
});
test('optional lab versions, adaptation guards and references are present',async()=>{
 const pkg=JSON.parse(await fs.readFile('recipes/procedural/package.json','utf8'));
 assert.equal(pkg.private,true);for(const v of Object.values(pkg.dependencies))assert.match(String(v),/^\d+\.\d+\.\d+$/);
 const pins=JSON.parse(await fs.readFile('recipes/procedural/upstream-pins.json','utf8'));for(const h of Object.values(pins.files_sha256))assert.match(String(h),/^[a-f0-9]{64}$/);assert.equal(pins.adaptations.length,2);
 for(const id of ['simplex-noise-js','rough-js','ez-tree','zzfx'])assert.ok(entries.find(e=>e.id===id));
 for(const e of entries.filter(e=>e.recipe))assert.equal(e.recipe.status,'design','Procedural fixtures must not pretend to execute hybrid AI recipes');
});
test('observation schema keeps output bytes distinct from unmeasured process memory',async()=>{
 const s=JSON.parse(await fs.readFile('schema/procedural-observation.schema.json','utf8'));new Ajv2020({strict:false}).compile(s);
 assert.deepEqual(s.properties.measurements.properties.process_peak_rss_mb,{type:'null'});
 assert.equal(s.properties.measurements.properties.iterations.const,8);
 assert.equal(s.properties.provenance.properties.lock_sha256.pattern,'^[a-f0-9]{64}$');
});
