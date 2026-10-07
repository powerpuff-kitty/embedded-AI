import fs from 'node:fs/promises';
import path from 'node:path';
import Ajv2020 from 'ajv/dist/2020.js';
const schema=JSON.parse(await fs.readFile('schema/procedural-observation.schema.json','utf8'));
const validate=new Ajv2020({allErrors:true,strict:false}).compile(schema);
const root=process.argv[2]??'benchmarks/procedural-results';
let count=0;
async function visit(dir:string):Promise<void>{
 for(const d of await fs.readdir(dir,{withFileTypes:true}).catch((e:any)=>{if(e.code==='ENOENT')return [];throw e;})){
  const p=path.join(dir,d.name);if(d.isSymbolicLink())throw new Error(`Symlink not allowed: ${p}`);
  if(d.isDirectory())await visit(p);
  else if(d.name.endsWith('.json')){
   const r=JSON.parse(await fs.readFile(p,'utf8'));if(!validate(r))throw new Error(`${p}: ${JSON.stringify(validate.errors)}`);
   const hashes=r.validation.repeat_hashes,identical=hashes.every((h:string)=>h===hashes[0]);
   if(identical!==r.validation.same_runtime_repeatable||r.validation.output_sha256!==hashes[0])throw new Error(`${p}: inconsistent replay evidence`);
   const s=[...r.measurements.latency_ms.samples].sort((a,b)=>a-b);
   for(const [key,pct]of [['p50',.5],['p95',.95]] as const)if(r.measurements.latency_ms[key]!==s[Math.ceil(s.length*pct)-1])throw new Error(`${p}: inconsistent percentile`);
   count++;
  }
 }
}
await visit(root);console.log(`Validated ${count} scoped procedural observations. These do not promote catalogue compatibility.`);
