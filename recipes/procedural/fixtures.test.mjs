import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import { generate } from '../../dist/procedural/runtime.bundle.mjs';
import { ADAPTERS, configOf, rng, digest, payloadBytes } from './contracts.mjs';

for (const adapter of Object.keys(ADAPTERS)) {
  test(`${adapter}: pinned generator, finite bounded output, repeatability and seed response`, async () => {
    for (const detail of [1,3]) {
      const c={adapter,seed:42,detail};const before=Math.random;
      const a=generate(c),b=generate(c),changed=generate({...c,seed:43});
      assert.equal(Math.random,before);assert.equal(await digest(a),await digest(b));assert.notEqual(await digest(a),await digest(changed));
      assert.ok(payloadBytes(a).length>0 && payloadBytes(a).length<1024*1024);
      if(a.type==='svg') {assert.match(a.svg,/^<svg /);assert.match(a.svg,/<path /);assert.doesNotMatch(a.svg,/<script|onload|<foreignObject|href=|url\(/i);}
      else if(a.type==='tree') {for(const m of a.meshes){assert.ok(m.positions.length>0);assert.equal(m.positions.length%3,0);assert.equal(m.indices.length%3,0);assert.ok(m.positions.every(Number.isFinite));assert.ok(m.indices.every(i=>i<m.positions.length/3));}}
      else {assert.ok(a.values.every(Number.isFinite));if(a.type==='noise')assert.ok(a.values.every(v=>v>=-1.01&&v<=1.01));else{assert.ok(a.values.length<=a.sampleRate);assert.ok(a.values.every(v=>Math.abs(v)<=1));}}
    }
  });
}
test('reject unbounded, coerced and unknown parameters',()=>{
  const c={adapter:'noise',seed:42,detail:1};
  for(const change of [{adapter:'__proto__'},{adapter:'script'},{seed:NaN},{seed:Infinity},{seed:0},{seed:-1},{seed:'42'},{seed:2147483648},{detail:99},{detail:1.1},{code:'eval()'}])assert.throws(()=>generate({...c,...change}));
  for(const value of [null,[],42,{}])assert.throws(()=>configOf(value));
});
test('fixture PRNG is local and repeatable',()=>{const a=rng(7),b=rng(7);for(let i=0;i<100;i++){const x=a();assert.equal(x,b());assert.ok(x>=0&&x<1);}});
test('bundle pins, notices and source receipts are present',async()=>{
  const build=JSON.parse(await fs.readFile('dist/procedural/build.json','utf8'));
  for(const a of Object.values(ADAPTERS))assert.equal(build.dependencies[a.package],a.version);
  assert.equal(build.adaptations.length,2);assert.match(build.bundle_sha256,/^[a-f0-9]{64}$/);assert.match(build.fixture_sha256,/^[a-f0-9]{64}$/);
  const notices=await fs.readFile('dist/procedural/THIRD-PARTY-NOTICES.txt','utf8');for(const text of ['simplex-noise','roughjs','ez-tree','three','ZzFX MIT License'])assert.ok(notices.includes(text));
});
