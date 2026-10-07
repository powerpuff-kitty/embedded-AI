import fs from 'node:fs/promises';
import path from 'node:path';
import Ajv2020 from 'ajv/dist/2020.js';
import YAML from 'yaml';
import { loadEntries, kindOf } from './catalog.ts';
import { methodsOf, viewOf } from '../site/methods.mjs';
const entries = await loadEntries();
const hardware: any[] = [];
for(const file of await fs.readdir('hardware').catch(() => [])){
  if(!file.endsWith('.yaml')) continue;
  const doc = YAML.parse(await fs.readFile(path.join('hardware', file), 'utf8'));
  if(doc?.id) hardware.push({id:doc.id,name:doc.name,class:doc.class,notes:doc.notes});
}
hardware.sort((a,b)=>a.id.localeCompare(b.id));
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
for(const name of ['index.html','style.css','app.mjs','catalogue.mjs','needs.mjs','methods.mjs','i18n.mjs','logo.svg','og.png','skeleton.html','skeleton.mjs'])await fs.copyFile(`site/${name}`,`dist/${name}`);
await fs.mkdir('dist/locales',{recursive:true});
for(const name of await fs.readdir('site/locales'))await fs.copyFile(path.join('site','locales',name),path.join('dist','locales',name));
await fs.writeFile('dist/data/catalog.json',JSON.stringify({schema_version:1,entries:entries.map(e=>({...e,kind:kindOf(e),methods:methodsOf(e),view:viewOf(e)})),benchmarks:records,hardware}));
await fs.writeFile('dist/.nojekyll','');
// Optional procedural lab shell; lab:build adds pinned local runtime and its receipt.
await fs.mkdir('dist/procedural', { recursive: true });
for (const name of ['index.html','lab.css','app.mjs','contracts.mjs','worker.mjs']) await fs.copyFile(`recipes/procedural/${name}`, `dist/procedural/${name}`);

const BASE='https://powerpuff-kitty.github.io/embedded-AI';
const domains=[...new Set(entries.map(e=>e.domain))].sort();
const upstreamOf=(e:any)=>e.links?.model||e.links?.repository||e.links?.homepage||e.links?.paper||'';
const llms=['# embedded-AI','',`> A machine-readable catalogue of embeddable AI: models, toolkits and non-AI primitives for local and resource-constrained computing. ${entries.length} entries across ${domains.length} domains. Unknown data stays unknown.`,'','## Data','',`- [catalog.json](${BASE}/data/catalog.json): full catalogue and benchmark records`,'- [catalog.full.json](https://github.com/powerpuff-kitty/embedded-AI/blob/main/generated/catalog.full.json): generated full metadata','- [README](https://github.com/powerpuff-kitty/embedded-AI): human-facing catalogue and YAML sources','','## Pages','',`- [Explorer](${BASE}/): offline need matcher, filters and comparison`,`- [Domains](${BASE}/domains.html): all domains with counts`,`- [Skeleton replay](${BASE}/skeleton.html): local pose JSONL replay`,'','## Domains','',...domains.map(d=>`- ${d}`),''].join('\n');
await fs.writeFile('dist/llms.txt',llms);
const full=['# embedded-AI — full catalogue','',`> ${entries.length} entries. Generated from YAML; unknown values are explicit; no compatibility is claimed without a stored benchmark.`,'',...entries.map((e:any)=>[`## ${e.name} (${e.id})`,`- domain: ${e.domain}`,`- kind: ${kindOf(e)} / ${e.usage?.mode ?? 'unknown'}`,`- tasks: ${(e.tasks??[]).join(', ')}`,`- licence: ${e.license?.code} / ${e.license?.weights}`,`- compatibility: ${(e.compatibility??[]).map((c:any)=>`${c.target}: ${c.status}`).join('; ')||'unknown'}`,`- upstream: ${upstreamOf(e)}`,`- page: ${BASE}/c/${e.id}.html`].join('\n'))].join('\n\n')+'\n';
await fs.writeFile('dist/llms-full.txt',full);
await fs.writeFile('dist/robots.txt',`User-agent: *\nAllow: /\n\nSitemap: ${BASE}/sitemap.xml\n`);

const esc = (value: any) => String(value ?? '\u2014').replace(/[&<>"]/g, c => ({ '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;' } as Record<string,string>)[c]);
await fs.mkdir('dist/c',{recursive:true});
for (const entry of entries as any[]) {
  const title = `${entry.name} \u2014 embedded-AI catalogue`;
  const description = entry.description || `${entry.name} in the embedded-AI catalogue.`;
  const jsonld = JSON.stringify({ '@context':'https://schema.org','@type':'SoftwareApplication', name:entry.name, description, url:`${BASE}/c/${entry.id}.html`, applicationCategory:entry.domain, keywords:(entry.tasks||[]).join(', '), license:entry.license?.weights, codeRepository:entry.links?.repository||undefined, operatingSystem:(entry.runtimes||[]).join(', ') }).replace(/</g,'\\u003c');
  const linkItems = Object.entries(entry.links||{}).filter(([,u])=>u).map(([k,u])=>`<li>${esc(k)}: <a href="${esc(u)}" target="_blank" rel="noopener noreferrer">${esc(u)}</a></li>`).join('');
  const evidence = (entry.evidence||[]).map((ev:any)=>`<li><a href="${esc(ev.url)}" target="_blank" rel="noopener noreferrer">${esc(ev.notes||ev.type)}</a></li>`).join('') || '<li>Not reviewed.</li>';
  const compat = (entry.compatibility||[]).length ? (entry.compatibility as any[]).map(c=>`<li>${esc(c.target)}: ${esc(c.status)}</li>`).join('') : '<li>unknown (no measured evidence)</li>';
  const html = `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${esc(title)}</title><meta name="description" content="${esc(description)}"><link rel="canonical" href="${BASE}/c/${entry.id}.html"><meta name="robots" content="index,follow"><meta property="og:type" content="article"><meta property="og:title" content="${esc(title)}"><meta property="og:description" content="${esc(description)}"><meta property="og:url" content="${BASE}/c/${entry.id}.html"><meta property="og:image" content="${BASE}/og.png"><meta name="twitter:card" content="summary_large_image"><meta name="twitter:image" content="${BASE}/og.png"><script type="application/ld+json">${jsonld}</script><link rel="stylesheet" href="../style.css"></head><body><main><p class="eyebrow">${esc(entry.domain)} / ${esc(kindOf(entry))}</p><h1>${esc(entry.name)}</h1><p>${esc(description)}</p><dl><dt>Methods</dt><dd>${esc(methodsOf(entry).join(", ")||"unclassified")}</dd>${entry.procedural?`<dt>Procedural metadata</dt><dd><pre>${esc(JSON.stringify(entry.procedural,null,2))}</pre></dd>`:""}${entry.recipe?`<dt>Recipe — ${esc(entry.recipe.status)}</dt><dd><pre>${esc(JSON.stringify(entry.recipe,null,2))}</pre></dd>`:""}<dt>Use</dt><dd>${esc(entry.usage?.mode ?? 'unknown')}</dd><dt>Tasks</dt><dd>${esc((entry.tasks||[]).join(', '))}</dd><dt>Runtimes / formats</dt><dd>${esc([...(entry.runtimes||[]),...(entry.formats||[])].join(', ')||'unknown')}</dd><dt>Code / weights licence</dt><dd>${esc(entry.license?.code)} / ${esc(entry.license?.weights)}</dd><dt>Compatibility</dt><dd><ul>${compat}</ul></dd></dl><h2>Sources</h2><ul>${linkItems||'<li>Not reviewed.</li>'}</ul><h2>Evidence</h2><ul>${evidence}</ul><h2>Limitations</h2><ul>${(entry.limitations||['Not reviewed.']).map((l:string)=>`<li>${esc(l)}</li>`).join('')}</ul><p><a href="../">\u2190 embedded-AI catalogue</a> \u00b7 <a href="../?entry=${entry.id}">open in the explorer</a></p></main></body></html>\n`;
  await fs.writeFile(`dist/c/${entry.id}.html`, html);
}

const byDomain = new Map<string, number>();
for (const entry of entries) byDomain.set(entry.domain, (byDomain.get(entry.domain) ?? 0) + 1);
const domainList = [...byDomain.entries()].sort((a, b) => a[0].localeCompare(b[0]));
const domainsJsonld = JSON.stringify({ '@context':'https://schema.org','@type':'ItemList', name:'embedded-AI domains', numberOfItems:domainList.length, itemListElement:domainList.map(([d,n],i)=>({ '@type':'ListItem', position:i+1, name:d, description:`${n} entries` })) }).replace(/</g,'\\u003c');
const domainsHtml = `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Domains — embedded-AI catalogue</title><meta name="description" content="All ${domainList.length} domains in the embedded-AI catalogue, with entry counts."><link rel="canonical" href="${BASE}/domains.html"><meta name="robots" content="index,follow"><meta property="og:type" content="website"><meta property="og:title" content="Domains — embedded-AI catalogue"><meta property="og:url" content="${BASE}/domains.html"><meta property="og:image" content="${BASE}/og.png"><meta name="twitter:card" content="summary_large_image"><meta name="twitter:image" content="${BASE}/og.png"><script type="application/ld+json">${domainsJsonld}</script><link rel="stylesheet" href="style.css"></head><body><main><p class="eyebrow">embedded-AI catalogue</p><h1>Domains</h1><p>${entries.length} entries across ${domainList.length} domains.</p><ul>${domainList.map(([d,n])=>`<li><a href="./?domain=${encodeURIComponent(d)}">${esc(d)}</a> (${n})</li>`).join('')}</ul><p><a href="./">\u2190 embedded-AI catalogue</a></p></main></body></html>\n`;
await fs.writeFile('dist/domains.html', domainsHtml);

const sitemapUrls=[`${BASE}/`,`${BASE}/domains.html`,`${BASE}/skeleton.html`,`${BASE}/procedural/`,...entries.map(e=>`${BASE}/c/${e.id}.html`),`${BASE}/llms.txt`,`${BASE}/llms-full.txt`];
await fs.writeFile('dist/sitemap.xml',`<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${sitemapUrls.map(u=>`<url><loc>${u}</loc></url>`).join('\n')}\n</urlset>\n`);
const required=['index.html','style.css','app.mjs','catalogue.mjs','needs.mjs','methods.mjs','i18n.mjs','logo.svg','og.png','skeleton.html','skeleton.mjs','data/catalog.json','locales/en.json','robots.txt','sitemap.xml','llms.txt','llms-full.txt','.nojekyll'];
for(const name of required) await fs.access(path.join('dist',name));
const built=JSON.parse(await fs.readFile('dist/data/catalog.json','utf8'));
if(!Array.isArray(built.entries)||!built.entries.length) throw new Error('dist/data/catalog.json has no entries');
const html=await fs.readFile('dist/index.html','utf8');
if(!html.includes('app.mjs')||!html.includes('id="need"')) throw new Error('dist/index.html is missing the explorer or need matcher');
console.log(`Built static explorer: ${entries.length} entries, ${records.length} measured runs. Verified ${required.length} assets. No public deployment performed.`);
