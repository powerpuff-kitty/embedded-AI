import { partition, safeURL, format } from './catalogue.mjs';
import { matchNeeds, describeIntent, applyNeedConstraints, shortlistMarkdown } from './needs.mjs';
const $ = selector => document.querySelector(selector);
const el = (tag,text,className) => { const node=document.createElement(tag); if(text!==undefined)node.textContent=String(text); if(className)node.className=className; return node; };
const form=$('#filters'), selected=new Set();
let entries=[],runs=[],needQuery='';
const link=(label,url)=>{const node=el('a',label); const safe=safeURL(url); if(safe){node.href=safe;node.target='_blank';node.rel='noopener noreferrer';}return node;};
const repoPath = path => 'https://github.com/powerpuff-kitty/embedded-AI/blob/main/'+path.split('/').map(encodeURIComponent).join('/');
function show(content){$('#detail-content').replaceChildren(content);$('#details').showModal();}
$('#close').onclick=()=>$('#details').close();
function field(dl,title,value){dl.append(el('dt',title),el('dd',value || 'Unknown'));}
function details(entry){
  const box=el('section');box.append(el('p',entry.domain.toUpperCase(),'eyebrow'),el('h2',entry.name),el('p',entry.description||'Description not reviewed.'));
  const dl=el('dl');field(dl,'Component / use',`${entry.kind} / ${entry.usage?.mode||'unknown'}`);
  field(dl,'Size scope',entry.model?.measurement_scope||'Not reviewed; no RAM estimate inferred.');
  field(dl,'Code / weights licence',`${entry.license.code} / ${entry.license.weights}`);
  field(dl,'Inputs',(entry.data?.inputs||entry.io?.inputs||[]).join('; '));field(dl,'Outputs',(entry.data?.outputs||entry.io?.outputs||[]).join('; '));
  field(dl,'Training / data',entry.usage?.training);field(dl,'Review',entry.reviewed);box.append(dl);
  if(entry.limitations?.length){box.append(el('h3','Limitations'));const list=el('ul');entry.limitations.forEach(x=>list.append(el('li',x)));box.append(list);}
  box.append(el('h3','Sources'),link('YAML manifest',repoPath(entry.path)));
  for(const evidence of entry.evidence||[]){const p=el('p');p.append(link(evidence.notes||evidence.type,evidence.url));box.append(p);}
  box.append(el('h3','Measured runs'));
  const measured=runs.filter(x=>x.entry_id===entry.id);
  if(!measured.length)box.append(el('p','No measured run recorded.'));
  for(const run of measured){box.append(el('p',`${run.hardware.id}: ${format(run.process_peak_rss_mb)} MB process RSS; p50 ${format(run.latency_ms.p50)} ms. ${run.model.scope}`));box.append(link('Benchmark record',repoPath(run.path)));}
  const raw=el('details');raw.append(el('summary','Full metadata'),el('pre',JSON.stringify(entry,null,2)));box.append(raw);show(box);
}
function table(list,container){
  container.replaceChildren();if(!list.length){container.append(el('p','No matching entries. Try fewer filters or inspect untested candidates.','empty'));return;}
  const wrapper=el('div',undefined,'table-wrap'),table=el('table'),head=el('thead'),row=el('tr');
  for(const title of ['Select','Component','Task / use','Model size','Runtime','Evidence'])row.append(el('th',title));head.append(row);table.append(head);
  const body=el('tbody');
  for(const entry of list){
    const tr=el('tr'),td=el('td'),check=document.createElement('input');check.type='checkbox';check.checked=selected.has(entry.id);check.setAttribute('aria-label',`Compare ${entry.name}`);
    check.onchange=()=>{if(check.checked&&selected.size>=4){check.checked=false;$('#error').textContent='Compare up to four components at once.';return;}check.checked?selected.add(entry.id):selected.delete(entry.id);updateCompare();};td.append(check);tr.append(td);
    const name=el('td'),button=el('button',entry.name,'model-name');button.onclick=()=>details(entry);name.append(button,el('span',`${entry.domain} / ${entry.kind}`,'small'));tr.append(name);
    const task=el('td',entry.tasks.join(', '));task.append(el('span',entry.usage?.mode||'unknown','small'));tr.append(task);
    const size=el('td',entry.model.parameters==null?'Unknown':format(entry.model.parameters/1e6)+'M params');size.append(el('span',entry.model.file_size_mb==null?'File size unknown':format(entry.model.file_size_mb)+' MB file','small'));tr.append(size);
    tr.append(el('td',[...(entry.runtimes||[]),...(entry.formats||[])].join(', ')||'Unknown'));
    const evidence=el('td'),observed=runs.filter(x=>x.entry_id===entry.id);evidence.append(el('span',observed.length?`${observed.length} measured run(s)`:'Not measured','badge'));evidence.append(el('span',entry.reviewed?'Sources reviewed '+entry.reviewed:'Review pending','small'));tr.append(evidence);body.append(tr);
  }
  table.append(body);wrapper.append(table);container.append(wrapper);
}
function rankedTable(results,container){
  container.replaceChildren();if(!results.length){container.append(el('p','No entries matched. Try naming the task, sensor or constraint differently.','empty'));return;}
  const wrapper=el('div',undefined,'table-wrap'),table=el('table'),head=el('thead'),row=el('tr');
  for(const title of ['Select','Component','Why it matched','Task / use','Model size','Evidence'])row.append(el('th',title));head.append(row);table.append(head);
  const body=el('tbody');
  for(const {entry,score,reasons} of results){
    const tr=el('tr'),td=el('td'),check=document.createElement('input');check.type='checkbox';check.checked=selected.has(entry.id);check.setAttribute('aria-label',`Compare ${entry.name}`);
    check.onchange=()=>{if(check.checked&&selected.size>=4){check.checked=false;$('#error').textContent='Compare up to four components at once.';return;}check.checked?selected.add(entry.id):selected.delete(entry.id);updateCompare();};td.append(check);tr.append(td);
    const name=el('td'),button=el('button',entry.name,'model-name');button.onclick=()=>details(entry);name.append(button,el('span',`${entry.domain} / ${entry.kind}`,'small'));tr.append(name);
    const why=el('td',reasons.slice(0,4).join('; ')||'metadata match');why.append(el('span',`rank score ${score}`,'small'));tr.append(why);
    const task=el('td',entry.tasks.join(', '));task.append(el('span',entry.usage?.mode||'unknown','small'));tr.append(task);
    const size=el('td',entry.model.parameters==null?'Unknown':format(entry.model.parameters/1e6)+'M params');size.append(el('span',entry.model.file_size_mb==null?'File size unknown':format(entry.model.file_size_mb)+' MB file','small'));tr.append(size);
    const evidence=el('td'),observed=runs.filter(x=>x.entry_id===entry.id);evidence.append(el('span',observed.length?`${observed.length} measured run(s)`:'Not measured','badge'));evidence.append(el('span',entry.reviewed?'Sources reviewed '+entry.reviewed:'Review pending','small'));tr.append(evidence);body.append(tr);
  }
  table.append(body);wrapper.append(table);container.append(wrapper);
}
function filters(){const data=Object.fromEntries(new FormData(form));return {...data,offline:!!data.offline,candidates:!!data.candidates};}
function updateCompare(){$('#compare').disabled=selected.size<2;$('#compare').textContent=`Compare (${selected.size}/4)`;$('#shortlist').disabled=selected.size<1;}
function render(){
  $('#error').textContent='';
  if(needQuery){
    const constraints={offline:$('#need-offline').checked,pretrained:$('#need-pretrained').checked,model:$('#need-model').checked};
    const {intent,results}=matchNeeds(entries,needQuery,{limit:100});
    const {kept,excluded}=applyNeedConstraints(results,constraints);
    $('#count').textContent=`${kept.length} matching component(s) for your need`;
    $('#need-hint').textContent=[`Interpreted tokens: ${intent.tokens.slice(0,12).join(', ')||'none'}`,...describeIntent(intent)].join(' · ');
    const excludedBox=$('#need-excluded');excludedBox.replaceChildren();
    if(excluded.length){const reasons=[...new Set(excluded.map(x=>x.reason))].slice(0,3);excludedBox.append(el('p',`${excluded.length} ranked match(es) hidden by your constraints: ${reasons.join('; ')}.`,undefined));excludedBox.className='fine';}
    $('#candidates-section').hidden=true;rankedTable(kept,$('#entries'));
    history.replaceState(null,'',location.pathname+'?need='+encodeURIComponent(needQuery));return;
  }
  $('#need-hint').textContent='';$('#need-excluded').replaceChildren();
  const f=filters(),result=partition(entries,f,runs);$('#count').textContent=`${result.matching.length} matching components`;
  if(f.ram&&!f.target)$('#error').textContent='Choose an exact target before applying a measured-memory budget. Unknowns are not confirmed fits.';
  table(result.matching,$('#entries'));$('#candidates-section').hidden=!result.candidates.length;table(result.candidates,$('#candidates'));
  const params=new URLSearchParams();for(const [key,value]of Object.entries(f))if(value)params.set(key,value===true?'1':value);
  history.replaceState(null,'',location.pathname+(params.size?'?'+params:''));
}
$('#match').onclick=()=>{needQuery=$('#need').value.trim();render();};
$('#need-clear').onclick=()=>{$('#need').value='';needQuery='';render();};
$('#need').addEventListener('keydown',event=>{if(event.key==='Enter'&&(event.metaKey||event.ctrlKey)){needQuery=$('#need').value.trim();render();}});
$('#compare').onclick=()=>{
  const items=entries.filter(e=>selected.has(e.id)),box=el('section');box.append(el('h2','Compare components'),el('p','Latency and RAM observations are workload-specific. Different hosts or variants are not directly ranked.'));
  const wrapper=el('div',undefined,'table-wrap'),t=el('table',undefined,'comparison');
  const fields=[['Name',e=>e.name],['Kind / use',e=>`${e.kind} / ${e.usage?.mode||'unknown'}`],['Tasks',e=>e.tasks.join(', ')],['Params',e=>format(e.model.parameters)],['File MB',e=>format(e.model.file_size_mb)],['Size scope',e=>e.model.measurement_scope||'Unknown'],['Code / weights',e=>`${e.license.code} / ${e.license.weights}`],['Measured environments',e=>runs.filter(r=>r.entry_id===e.id).map(r=>`${r.hardware.id}: ${format(r.process_peak_rss_mb)} MB`).join('; ')||'None'],['Limitations',e=>(e.limitations||[]).join('; ')||'Not reviewed']];
  for(const[label,value]of fields){const row=el('tr');row.append(el('th',label));for(const e of items)row.append(el('td',value(e)));t.append(row);}wrapper.append(t);box.append(wrapper);show(box);
};
$('#shortlist').onclick=async()=>{const items=entries.filter(e=>selected.has(e.id)),text=shortlistMarkdown(items);try{await navigator.clipboard.writeText(text);$('#error').textContent=`Copied ${items.length} component(s) to the clipboard as Markdown.`;}catch{$('#error').textContent='Clipboard unavailable; shortlist was not copied.';}};
for(const id of ['#need-offline','#need-pretrained','#need-model'])$(id).addEventListener('input',()=>{if(needQuery)render();});
form.addEventListener('input',render);form.addEventListener('reset',()=>setTimeout(render,0));
function options(name,values){const select=form.elements.namedItem(name);for(const value of [...new Set(values)].filter(Boolean).sort()) {const o=el('option',value);o.value=value;select.append(o);}}
try{
  const response=await fetch('./data/catalog.json');if(!response.ok)throw new Error(`Catalogue HTTP ${response.status}`);const data=await response.json();entries=data.entries;runs=data.benchmarks||[];
  options('domain',entries.map(e=>e.domain));options('task',entries.flatMap(e=>e.tasks));options('kind',entries.map(e=>e.kind));options('usage',entries.map(e=>e.usage?.mode||'unknown'));options('runtime',entries.flatMap(e=>[...(e.runtimes||[]),...(e.formats||[])]));options('license',entries.map(e=>e.license.weights));options('target',['luckfox-rv1106','esp32',...runs.map(r=>r.hardware.id),...entries.flatMap(e=>(e.compatibility||[]).map(c=>c.target))]);
  for(const [key,value]of new URLSearchParams(location.search)){const input=form.elements.namedItem(key);if(input){if(input.type==='checkbox')input.checked=value==='1';else input.value=value;}}
  const needParam=new URLSearchParams(location.search).get('need');if(needParam){$('#need').value=needParam;needQuery=needParam;}
  for(const [value,label]of [[entries.length,'Components'],[new Set(entries.map(e=>e.domain)).size,'Domains'],[entries.filter(e=>e.reviewed).length,'Source reviews'],[runs.length,'Measured runs']]){const stat=el('div',undefined,'stat');stat.append(el('strong',value),el('span',label));$('#stats').append(stat);}render();
}catch(error){$('#error').textContent=`Could not load the catalogue: ${error.message}. Build with npm run site:build and serve dist over HTTP.`;$('#count').textContent='Catalogue unavailable';}
