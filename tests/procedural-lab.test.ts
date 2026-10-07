import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import { loadEntries } from '../scripts/catalog.ts';
import { ADAPTERS } from '../recipes/procedural/contracts.mjs';
import { verifyObservation } from '../scripts/verify-procedural-runs.ts';
const entries=await loadEntries();
const expected=['fishdraw','wavefunctioncollapse-js','cellular-automata-js','martini','isosurface-js','d3-delaunay','delaunator','earcut','matter-js','cannon-es','tone-js','space-colonization-2d','fast-2d-poisson-disk-sampling','wfc-city-unity'];
test('lab research candidates retain 14 canonical documentation-only entries',()=>{
 const batch=entries.filter(e=>expected.includes(e.id));
 assert.deepEqual(batch.map(e=>e.id).sort(),expected.sort());
 for(const e of batch){assert.equal(e.learned,false);assert.equal(e.procedural.evidence_level,'documented');assert.deepEqual(e.compatibility,[]);assert.equal(e.requirements.ram_mb.measured_peak,null);assert.equal(entries.filter(x=>x.links.repository?.toLowerCase()===e.links.repository.toLowerCase()).length,1);}
 assert.equal(batch.find(e=>e.id==='space-colonization-2d')?.license.code,'CC-BY-NC-SA-4.0');
 assert.equal(batch.find(e=>e.id==='wfc-city-unity')?.procedural.integration,'native-reference');
});
test('lab dependencies are exact and separate from catalogue runtime',async()=>{
 const lab=JSON.parse(await fs.readFile('recipes/procedural/package.json','utf8'));const root=JSON.parse(await fs.readFile('package.json','utf8'));
 assert.equal(lab.private,true);for(const a of Object.values(ADAPTERS)){assert.equal(lab.dependencies[a.package],a.version);assert.ok(!root.dependencies?.[a.package]);}
});
const hash='a'.repeat(64);
const sample=()=>({schema_version:1,adapter:'noise',entry_id:'simplex-noise-js',config:{adapter:'noise',seed:42,detail:1},upstream:ADAPTERS.noise,generation_ms:[1,2,3],output_sha256:hash,repeated_output_equal:true,different_seed_changes_output:true,output_payload_bytes:16384,javascript_heap_peak_mb:null,scope:'Synthetic schema fixture only, NOT an actual performance observation.',observed_at:'2026-10-07T00:00:00Z',browser:'test-only',build:{schema_version:1,fixture_sha256:hash,bundler_version:'test',dependencies:{'simplex-noise':'4.0.3',roughjs:'4.6.6','@dgreenheck/ez-tree':'1.1.0',three:'0.169.0',zzfx:'1.4.0'},lock_sha256:hash,bundle_sha256:hash,bundle_bytes:1,source_tree_sha256:hash,zzfx_source_sha256:hash,adaptations:['test-only','test-only'],source:'recipes/procedural/',renderer:'test-only'}});
const ids=new Set(entries.map(e=>e.id));
test('observation validation preserves provenance, null heap RAM and actual adapter identity',()=>{
 verifyObservation(sample(),ids);
 for(const mutate of [(r:any)=>r.entry_id='zzfx',(r:any)=>r.config.adapter='tree',(r:any)=>r.upstream={...r.upstream,version:'latest'},(r:any)=>r.build.dependencies['simplex-noise']='latest',(r:any)=>r.output_sha256='bad',(r:any)=>r.javascript_heap_peak_mb=0,(r:any)=>r.generation_ms=[-1],(r:any)=>r.repeated_output_equal=false,(r:any)=>r.extra=true]){const r=sample();mutate(r);assert.throws(()=>verifyObservation(r,ids));}
 const r:any=sample();r.host_observation={os:'test',release:'test',architecture:'test',logical_cpus:1,browser_version:'test',headless:true,browser_process_tree_peak_rss_mb:10,sampling_interval_ms:20,samples:1,scope:'Synthetic schema fixture. This is not an actual measurement and cannot establish device fit.'};verifyObservation(r,ids);r.host_observation.samples=0;assert.throws(()=>verifyObservation(r,ids));
});
