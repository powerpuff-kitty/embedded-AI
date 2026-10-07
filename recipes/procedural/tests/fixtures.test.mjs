import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import {createHash} from 'node:crypto';
import {generate} from '../build/adapters.mjs';
import {ADAPTERS,DEFAULT_RECIPE,validateRecipe,recipeFromQuery,recipeQuery,randomStream,validateOutput,outputBytes,outputHash,exportOutput,percentile} from '../src/core.mjs';
const fixture=(adapter,seed=42,detail=2)=>({schema_version:1,adapter,seed,detail});
test('recipe rejects unsupported versions, keys, prototypes and budgets',()=>{
 for(const value of [null,[],{}, { ...DEFAULT_RECIPE, seed:0},{...DEFAULT_RECIPE,seed:Infinity},{...DEFAULT_RECIPE,seed:1.4},{...DEFAULT_RECIPE,seed:2147483647},{...DEFAULT_RECIPE,detail:0},{...DEFAULT_RECIPE,detail:5},{...DEFAULT_RECIPE,adapter:'__proto__'},{...DEFAULT_RECIPE,schema_version:2},{...DEFAULT_RECIPE,script:'alert(1)'},new Date()])assert.throws(()=>validateRecipe(value));
 assert.deepEqual(validateRecipe(DEFAULT_RECIPE),DEFAULT_RECIPE);
 assert.throws(()=>generate({...DEFAULT_RECIPE,detail:1000000}));
});
test('strict URL round trip and unexpected keys',()=>{
 for(const adapter of Object.keys(ADAPTERS)){const r=fixture(adapter,2147483646,4);assert.deepEqual(recipeFromQuery(recipeQuery(r)),r);}
 for(const q of ['seed=1&seed=2','adapter=bad','seed=NaN','detail=4.5','src=evil','__proto__=bad'])assert.throws(()=>recipeFromQuery(q));
});
test('isolated RNG does not replace global randomness and never leaves its interval',()=>{
 const original=Math.random,a=randomStream(42),b=randomStream(42);for(let i=0;i<10000;i++){const n=a();assert.equal(n,b());assert.ok(n>=0&&n<1);}assert.equal(Math.random,original);assert.throws(()=>randomStream(0));
});
for(const adapter of Object.keys(ADAPTERS))for(const detail of [1,2,3,4])test(`${adapter} detail ${detail}: real generation, bounds, replay and seed variation`,async()=>{
 const r=fixture(adapter,42,detail),out=generate(r),again=generate(r),other=generate(fixture(adapter,913,detail));
 assert.equal(out.kind,adapter);validateOutput(out);assert.ok(outputBytes(out)>0&&outputBytes(out)<=2000000);
 assert.equal(await outputHash(out),await outputHash(again));assert.notEqual(await outputHash(out),await outputHash(other));
 const f=exportOutput(out);assert.ok(f.name&&f.type&&f.data);
});
test('sample-generation import has no DOM, AudioContext, image requests or playback effects',()=>{
 assert.equal(typeof globalThis.document,'undefined');assert.equal(typeof globalThis.AudioContext,'undefined');
 assert.ok(generate(fixture('audio')).samples.length>0);assert.ok(generate(fixture('tree')).meshes.length===2);
});
test('exports retain dimensions, geometry indexing, SVG and PCM WAV headers',()=>{
 const n=generate(fixture('noise'));const json=JSON.parse(exportOutput(n).data);assert.equal(json.values.length,json.width*json.height);
 const tree=generate(fixture('tree'));const obj=exportOutput(tree).data;assert.match(obj,/\no branches\n/);assert.match(obj,/\no leaves\n/);assert.equal(obj.split('\n').filter(s=>s.startsWith('v ')).length,tree.meshes.reduce((s,m)=>s+m.positions.length/3,0));
 const svg=generate(fixture('svg'));assert.match(exportOutput(svg).data,/^<svg xmlns=/);assert.doesNotMatch(svg.svg,/<script|href=/i);
 const sound=generate(fixture('audio')),v=new DataView(exportOutput(sound).data);assert.equal(v.getUint32(24,true),44100);assert.equal(v.getUint32(40,true),sound.samples.length*2);assert.equal(v.getUint16(22,true),1);
});
test('output guards reject unexpected ranges, active markup and broken indices',()=>{
 assert.throws(()=>validateOutput({kind:'noise',width:1,height:1,values:Float32Array.of(NaN)}));
 assert.throws(()=>validateOutput({kind:'audio',sample_rate:44100,samples:Float32Array.of(.9)}));
 for(const injected of ['<script/>','<foreignObject/>','<path onload="x"/>','<path style="x"/>','<path fill="url(x)"/>'])assert.throws(()=>validateOutput({kind:'svg',svg:`<svg >${injected}</svg>`}));
 const t=generate(fixture('tree'));t.meshes[0].indices[0]=999999;assert.throws(()=>validateOutput(t));
});
test('nearest-rank percentiles and report provenance',async()=>{
 assert.equal(percentile([1,2,3,4,5,6,7,8],.5),4);assert.equal(percentile([1,2,3,4,5,6,7,8],.95),8);assert.throws(()=>percentile([],1));
 const info=JSON.parse(await fs.readFile(new URL('../build/build-info.json',import.meta.url))),lock=await fs.readFile(new URL('../package-lock.json',import.meta.url));
 assert.equal(info.lock_sha256,createHash('sha256').update(lock).digest('hex'));assert.equal(info.dependencies.zzfx,'1.4.0');assert.equal(info.adaptations.length,2);
 const notices=await fs.readFile(new URL('../build/THIRD-PARTY.txt',import.meta.url),'utf8');assert.match(notices,/Frank Force/);assert.match(notices,/Jonas Wagner/);
});
