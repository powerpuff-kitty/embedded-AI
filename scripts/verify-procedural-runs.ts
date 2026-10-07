import fs from 'node:fs/promises';
import path from 'node:path';
import { pathToFileURL } from 'node:url';
import Ajv2020 from 'ajv/dist/2020.js';
import { ADAPTERS, configOf } from '../recipes/procedural/contracts.mjs';
const schema=JSON.parse(await fs.readFile(new URL('../schema/procedural-run.schema.json',import.meta.url),'utf8'));
const validate=new Ajv2020({strict:false,allErrors:true}).compile(schema);
export function verifyObservation(record:any, ids:Set<string>):void {
  if(!validate(record))throw new Error(`Invalid procedural observation: ${JSON.stringify(validate.errors)}`);
  const expected=ADAPTERS[record.adapter];configOf(record.config);
  if(!ids.has(record.entry_id)||record.entry_id!==expected.entry||record.config.adapter!==record.adapter)throw new Error('Adapter/entry/config mismatch');
  for(const key of ['entry','package','version','label'])if(record.upstream[key]!==expected[key])throw new Error('Upstream pin mismatch');
  if(record.build.dependencies[expected.package]!==expected.version)throw new Error('Build pin mismatch');
  const host=record.host_observation;
  if(host && ((host.samples===0)!==(host.browser_process_tree_peak_rss_mb===null)))throw new Error('RSS samples do not support the observation');
}
if(process.argv[1] && import.meta.url===pathToFileURL(path.resolve(process.argv[1])).href){
  const dir=process.argv[2]||'runs/procedural';
  const catalog=JSON.parse(await fs.readFile('generated/catalog.full.json','utf8'));
  const ids=new Set<string>(catalog.entries.map((e:any)=>e.id));
  for(const id of Object.keys(ADAPTERS))verifyObservation(JSON.parse(await fs.readFile(path.join(dir,`${id}.json`),'utf8')),ids);
  console.log('Verified four adapter observations; browser-tree RSS is not model or incremental adapter RAM.');
}
