import fs from 'node:fs/promises';
import path from 'node:path';
import Ajv2020 from 'ajv/dist/2020.js';
import { loadEntries, kindOf } from './catalog.ts';
const entries = await loadEntries();
const records: any[] = [];
const schema = JSON.parse(await fs.readFile('schema/benchmark.schema.json','utf8'));
const validate = new Ajv2020({allErrors:true,strict:false}).compile(schema);
async function visit(dir: string): Promise<void> {
  for(const item of await fs.readdir(dir,{withFileTypes:true}).catch((e:any)=>{if(e.code==='ENOENT')return [];throw e;})){
    const file=path.posix.join(dir,item.name);
    if(item.isSymbolicLink())continue;
    if(item.isDirectory())await visit(file);
    else if(item.isFile()&&item.name.endsWith('.json')){
      const record=JSON.parse(await fs.readFile(file,'utf8'));
      if(!validate(record))throw new Error(`${file}: invalid benchmark record ${JSON.stringify(validate.errors)}`);
      if(!entries.some(e=>e.id===record.entry_id))throw new Error(`${file}: unknown entry ${record.entry_id}`);
      records.push({...record,path:file});
    }
  }
}
await visit('benchmarks/results');
await fs.mkdir('dist/data',{recursive:true});
for(const name of ['index.html','style.css','app.mjs','catalogue.mjs','needs.mjs','i18n.mjs','skeleton.html','skeleton.mjs'])await fs.copyFile(`site/${name}`,`dist/${name}`);
await fs.mkdir('dist/locales',{recursive:true});
for(const name of await fs.readdir('site/locales'))await fs.copyFile(path.join('site','locales',name),path.join('dist','locales',name));
await fs.writeFile('dist/data/catalog.json',JSON.stringify({schema_version:1,entries:entries.map(e=>({...e,kind:kindOf(e)})),benchmarks:records}));
await fs.writeFile('dist/.nojekyll','');
const required=['index.html','style.css','app.mjs','catalogue.mjs','needs.mjs','i18n.mjs','skeleton.html','skeleton.mjs','data/catalog.json','locales/en.json','.nojekyll'];
for(const name of required) await fs.access(path.join('dist',name));
const built=JSON.parse(await fs.readFile('dist/data/catalog.json','utf8'));
if(!Array.isArray(built.entries)||!built.entries.length) throw new Error('dist/data/catalog.json has no entries');
const html=await fs.readFile('dist/index.html','utf8');
if(!html.includes('app.mjs')||!html.includes('id="need"')) throw new Error('dist/index.html is missing the explorer or need matcher');
console.log(`Built static explorer: ${entries.length} entries, ${records.length} measured runs. Verified ${required.length} assets. No public deployment performed.`);
