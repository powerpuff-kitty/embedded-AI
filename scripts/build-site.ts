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
const BASE='https://powerpuff-kitty.github.io/embedded-AI';
const domains=[...new Set(entries.map(e=>e.domain))].sort();
const upstreamOf=(e:any)=>e.links?.model||e.links?.repository||e.links?.homepage||e.links?.paper||'';
const llms=['# embedded-AI','',`> Evidence-first catalogue of on-device and embedded AI models, toolkits and non-AI primitives. ${entries.length} entries across ${domains.length} domains. Unknown data stays unknown; compatibility is only claimed with a stored measurement.`,'','## Data','',`- [catalog.json](${BASE}/data/catalog.json): full catalogue and benchmark records`,'- [catalog.full.json](https://github.com/powerpuff-kitty/embedded-AI/blob/main/generated/catalog.full.json): generated full metadata','- [README](https://github.com/powerpuff-kitty/embedded-AI): human-facing catalogue and YAML sources','','## Pages','',`- [Explorer](${BASE}/): offline need matcher, filters and comparison`,`- [Skeleton replay](${BASE}/skeleton.html): local pose JSONL replay`,'','## Domains','',...domains.map(d=>`- ${d}`),''].join('\n');
await fs.writeFile('dist/llms.txt',llms);
const full=['# embedded-AI — full catalogue','',`> ${entries.length} entries. Generated from YAML; unknown values are explicit; no compatibility is claimed without a stored benchmark.`,'',...entries.map((e:any)=>[`## ${e.name} (${e.id})`,`- domain: ${e.domain}`,`- kind: ${kindOf(e)} / ${e.usage?.mode ?? 'unknown'}`,`- tasks: ${(e.tasks??[]).join(', ')}`,`- licence: ${e.license?.code} / ${e.license?.weights}`,`- compatibility: ${(e.compatibility??[]).map((c:any)=>`${c.target}: ${c.status}`).join('; ')||'unknown'}`,`- upstream: ${upstreamOf(e)}`].join('\n'))].join('\n\n')+'\n';
await fs.writeFile('dist/llms-full.txt',full);
await fs.writeFile('dist/robots.txt',`User-agent: *\nAllow: /\n\nSitemap: ${BASE}/sitemap.xml\n`);
await fs.writeFile('dist/sitemap.xml',`<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n<url><loc>${BASE}/</loc></url>\n<url><loc>${BASE}/skeleton.html</loc></url>\n<url><loc>${BASE}/llms.txt</loc></url>\n<url><loc>${BASE}/llms-full.txt</loc></url>\n</urlset>\n`);
const required=['index.html','style.css','app.mjs','catalogue.mjs','needs.mjs','i18n.mjs','skeleton.html','skeleton.mjs','data/catalog.json','locales/en.json','robots.txt','sitemap.xml','llms.txt','llms-full.txt','.nojekyll'];
for(const name of required) await fs.access(path.join('dist',name));
const built=JSON.parse(await fs.readFile('dist/data/catalog.json','utf8'));
if(!Array.isArray(built.entries)||!built.entries.length) throw new Error('dist/data/catalog.json has no entries');
const html=await fs.readFile('dist/index.html','utf8');
if(!html.includes('app.mjs')||!html.includes('id="need"')) throw new Error('dist/index.html is missing the explorer or need matcher');
console.log(`Built static explorer: ${entries.length} entries, ${records.length} measured runs. Verified ${required.length} assets. No public deployment performed.`);
