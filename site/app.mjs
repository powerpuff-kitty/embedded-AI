import { partition, safeURL, format } from './catalogue.mjs';
import { matchNeeds, applyNeedConstraints, shortlistMarkdown } from './needs.mjs';
import { initI18n, t, LOCALE_NAMES, getLocale, loadLocale, applyStatic } from './i18n.mjs';
const $ = selector => document.querySelector(selector);
const el = (tag,text,className) => { const node=document.createElement(tag); if(text!==undefined)node.textContent=String(text); if(className)node.className=className; return node; };
const form=$('#filters'), selected=new Set();
let entries=[],runs=[],needQuery='',sortKey=null,sortDir='asc';
const tr=(group,value)=>{const key=`${group}.${value}`;const rendered=t(key);return rendered===key?String(value):rendered;};
const groupText=(name,value)=>['domain','kind','usage'].includes(name)?tr(name,value):value;
const localizeReason=item=>item.reasonKey?t(item.reasonKey,item.reasonParams||{}):item.reason;
const link=(label,url)=>{const node=el('a',label); const safe=safeURL(url); if(safe){node.href=safe;node.target='_blank';node.rel='noopener noreferrer';}return node;};
const repoPath = path => 'https://github.com/powerpuff-kitty/embedded-AI/blob/main/'+path.split('/').map(encodeURIComponent).join('/');
function show(content){$('#detail-content').replaceChildren(content);$('#details').showModal();}
$('#close').onclick=()=>$('#details').close();
function field(dl,title,value){dl.append(el('dt',title),el('dd',value || t('ui.unknown')));}
function details(entry){
  const box=el('section');box.append(el('p',tr('domain',entry.domain),'eyebrow'),el('h2',entry.name),el('p',entry.description||t('ui.detailsDescriptionUnknown')));
  const dl=el('dl');field(dl,t('ui.detailsComponentUse'),`${tr('kind',entry.kind)} / ${tr('usage',entry.usage?.mode||'unknown')}`);
  field(dl,t('ui.detailsSizeScope'),entry.model?.measurement_scope||t('ui.detailsSizeScopeUnknown'));
  field(dl,t('ui.detailsLicense'),`${entry.license.code} / ${entry.license.weights}`);
  field(dl,t('ui.detailsInputs'),(entry.data?.inputs||entry.io?.inputs||[]).join('; '));field(dl,t('ui.detailsOutputs'),(entry.data?.outputs||entry.io?.outputs||[]).join('; '));
  field(dl,t('ui.detailsTraining'),entry.usage?.training);field(dl,t('ui.detailsReview'),entry.reviewed);box.append(dl);
  if(entry.limitations?.length){box.append(el('h3',t('ui.detailsLimitations')));const list=el('ul');entry.limitations.forEach(x=>list.append(el('li',x)));box.append(list);}
  box.append(el('h3',t('ui.detailsSources')),link(t('ui.detailsManifest'),repoPath(entry.path)));
  for(const evidence of entry.evidence||[]){const p=el('p');p.append(link(evidence.notes||evidence.type,evidence.url));box.append(p);}
  box.append(el('h3',t('ui.detailsRuns')));
  const measured=runs.filter(x=>x.entry_id===entry.id);
  if(!measured.length)box.append(el('p',t('ui.detailsNoRun')));
  for(const run of measured){box.append(el('p',`${run.hardware.id}: ${format(run.process_peak_rss_mb)} ${t('ui.rssUnit')}; p50 ${format(run.latency_ms.p50)} ms. ${run.model.scope}`));box.append(link(t('ui.detailsBenchmarkRecord'),repoPath(run.path)));}
  const raw=el('details');raw.append(el('summary',t('ui.detailsFullMetadata')),el('pre',JSON.stringify(entry,null,2)));box.append(raw);show(box);
}
function sorted(list){
  if(!sortKey)return list;
  const get=key=>entry=>key==='name'?entry.name.toLowerCase():key==='task'?(entry.tasks[0]||'').toLowerCase():entry.model.parameters;
  const value=get(sortKey);
  return [...list].sort((a,b)=>{const x=value(a),y=value(b);if(x==null&&y==null)return 0;if(x==null)return 1;if(y==null)return -1;const r=x<y?-1:x>y?1:0;return sortDir==='asc'?r:-r;});
}
function headerRow(){
  const row=el('tr');row.append(el('th',t('ui.tableSelect')));
  for(const column of [{sort:'name',label:t('ui.tableComponent')},{sort:'task',label:t('ui.tableTask')},{sort:'size',label:t('ui.tableSize')}]){
    const th=el('th');if(sortKey===column.sort)th.setAttribute('aria-sort',sortDir==='asc'?'ascending':'descending');else if(sortKey)th.setAttribute('aria-sort','none');
    const button=el('button',column.label,'sort');button.onclick=()=>{if(sortKey===column.sort)sortDir=sortDir==='asc'?'desc':'asc';else{sortKey=column.sort;sortDir='asc';}render();};th.append(button);row.append(th);
  }
  row.append(el('th',t('ui.filtersRuntime')));row.append(el('th',t('ui.tableEvidence')));return row;
}
function rowFor(entry,whyCell){
  const tr$=el('tr'),td=el('td'),check=document.createElement('input');check.type='checkbox';check.checked=selected.has(entry.id);check.setAttribute('aria-label',entry.name);
  check.onchange=()=>{if(check.checked&&selected.size>=4){check.checked=false;$('#error').textContent=t('ui.errorCompareMax');return;}check.checked?selected.add(entry.id):selected.delete(entry.id);updateCompare();};td.append(check);tr$.append(td);
  const name=el('td'),button=el('button',entry.name,'model-name');button.onclick=()=>details(entry);name.append(button,el('span',`${tr('domain',entry.domain)} / ${tr('kind',entry.kind)}`,'small'));tr$.append(name);
  if(whyCell){const why=el('td');why.append(...whyCell);tr$.append(why);}
  const task=el('td',entry.tasks.join(', '));task.append(el('span',tr('usage',entry.usage?.mode||'unknown'),'small'));tr$.append(task);
  const size=el('td',entry.model.parameters==null?t('ui.unknown'):`${format(entry.model.parameters/1e6)} ${t('ui.unitParams')}`);size.append(el('span',entry.model.file_size_mb==null?t('ui.unknown'):`${format(entry.model.file_size_mb)} ${t('ui.unitFile')}`,'small'));tr$.append(size);
  if(!whyCell)tr$.append(el('td',[...(entry.runtimes||[]),...(entry.formats||[])].join(', ')||t('ui.unknown')));
  const evidence=el('td'),observed=runs.filter(x=>x.entry_id===entry.id);evidence.append(el('span',observed.length?t('ui.measuredRunsCount',{n:observed.length}):t('ui.notMeasured'),'badge'));evidence.append(el('span',entry.reviewed?t('ui.sourcesReviewed',{date:entry.reviewed}):t('ui.reviewPending'),'small'));tr$.append(evidence);
  return tr$;
}
function table(list,container){
  container.replaceChildren();if(!list.length){container.append(el('p',t('ui.emptyFilter'),'empty'));return;}
  const wrapper=el('div',undefined,'table-wrap'),table=el('table');
  const head=el('thead');head.append(headerRow());table.append(head);
  const body=el('tbody');for(const entry of sorted(list))body.append(rowFor(entry,null));table.append(body);wrapper.append(table);container.append(wrapper);
}
function rankedTable(results,container){
  container.replaceChildren();if(!results.length){container.append(el('p',t('ui.emptyNeed'),'empty'));return;}
  const wrapper=el('div',undefined,'table-wrap'),table=el('table'),head=el('thead'),row=el('tr');
  for(const title of [t('ui.tableSelect'),t('ui.tableComponent'),t('ui.tableWhy'),t('ui.tableTask'),t('ui.tableSize'),t('ui.tableEvidence')])row.append(el('th',title));head.append(row);table.append(head);
  const body=el('tbody');
  for(const {entry,score,reasons} of results){body.append(rowFor(entry,[reasons.slice(0,4).join('; ')||t('ui.metadataMatch'),el('span',t('ui.rankScore',{n:score}),'small')]));}
  table.append(body);wrapper.append(table);container.append(wrapper);
}
function filters(){const data=Object.fromEntries(new FormData(form));return {...data,offline:!!data.offline,candidates:!!data.candidates};}
function updateCompare(){$('#compare').disabled=selected.size<2;$('#compare-label').textContent=t('ui.compare',{n:selected.size});$('#shortlist').disabled=selected.size<1;}
function render({focusResults=false}={}){
  $('#error').textContent='';
  if(needQuery){
    const constraints={offline:$('#need-offline').checked,pretrained:$('#need-pretrained').checked,model:$('#need-model').checked};
    const {intent,results}=matchNeeds(entries,needQuery,{limit:100});
    const {kept,excluded}=applyNeedConstraints(results,constraints);
    $('#count').textContent=t('ui.countNeed',{n:kept.length});
    const intentNotes=[intent.wantsPretrained&&t('ui.intentPretrained'),intent.wantsTraining&&t('ui.intentTraining'),intent.wantsOffline&&t('ui.intentOffline'),intent.wantsEdge&&t('ui.intentEdge'),intent.wantsModel&&t('ui.intentModel'),intent.wantsTool&&t('ui.intentTool')].filter(Boolean);
    $('#need-hint').textContent=[t('ui.needHintTokens',{tokens:intent.tokens.slice(0,12).join(', ')||'—'}),...intentNotes].join(' · ');
    const excludedBox=$('#need-excluded');excludedBox.replaceChildren();
    if(excluded.length){const reasons=[...new Set(excluded.map(localizeReason))].slice(0,3);excludedBox.append(el('p',t('ui.needExcludedCount',{n:excluded.length,reasons:reasons.join('; ')})),undefined);}
    $('#candidates-section').hidden=true;rankedTable(kept,$('#entries'));if(focusResults)$('#entries').focus();
    history.replaceState(null,'',location.pathname+'?need='+encodeURIComponent(needQuery));return;
  }
  $('#need-hint').textContent='';$('#need-excluded').replaceChildren();
  const f=filters(),result=partition(entries,f,runs);$('#count').textContent=t('ui.countComponents',{n:result.matching.length});
  if(f.ram&&!f.target)$('#error').textContent=t('ui.errorRamTarget');
  table(result.matching,$('#entries'));$('#candidates-section').hidden=!result.candidates.length;table(result.candidates,$('#candidates'));
  const params=new URLSearchParams();for(const [key,value]of Object.entries(f))if(value)params.set(key,value===true?'1':value);
  history.replaceState(null,'',location.pathname+(params.size?'?'+params:''));
}
let needTimer;
const runNeed=({focus=false}={})=>{needQuery=$('#need').value.trim();render({focusResults:focus});};
const scheduleNeed=()=>{clearTimeout(needTimer);needTimer=setTimeout(()=>runNeed(),300);};
$('#match').onclick=()=>runNeed({focus:true});
$('#need').addEventListener('input',scheduleNeed);
$('#need-clear').onclick=()=>{clearTimeout(needTimer);$('#need').value='';needQuery='';render();};
$('#need').addEventListener('keydown',event=>{if(event.key==='Enter'&&!event.shiftKey){event.preventDefault();clearTimeout(needTimer);runNeed({focus:true});}});
$('#compare').onclick=()=>{
  const items=entries.filter(e=>selected.has(e.id)),box=el('section');box.append(el('h2',t('ui.compareTitle')),el('p',t('ui.compareNote')));
  const wrapper=el('div',undefined,'table-wrap'),table=el('table',undefined,'comparison');
  const fields=[['Name',e=>e.name],['Kind / use',e=>`${tr('kind',e.kind)} / ${tr('usage',e.usage?.mode||'unknown')}`],['Tasks',e=>e.tasks.join(', ')],['Params',e=>format(e.model.parameters)],['File MB',e=>format(e.model.file_size_mb)],['Size scope',e=>e.model.measurement_scope||t('ui.unknown')],['Code / weights',e=>`${e.license.code} / ${e.license.weights}`],['Measured environments',e=>runs.filter(r=>r.entry_id===e.id).map(r=>`${r.hardware.id}: ${format(r.process_peak_rss_mb)} MB`).join('; ')||t('ui.none')],['Limitations',e=>(e.limitations||[]).join('; ')||t('ui.notReviewed')]];
  for(const[label,value]of fields){const row=el('tr');row.append(el('th',label));for(const e of items)row.append(el('td',value(e)));table.append(row);}wrapper.append(table);box.append(wrapper);show(box);
};
$('#shortlist').onclick=async()=>{const items=entries.filter(e=>selected.has(e.id)),text=shortlistMarkdown(items);try{await navigator.clipboard.writeText(text);$('#error').textContent=t('ui.errorClipboardOk',{n:items.length});}catch{$('#error').textContent=t('ui.errorClipboardFail');}};
for(const id of ['#need-offline','#need-pretrained','#need-model'])$(id).addEventListener('input',()=>{if(needQuery)render();});
form.addEventListener('input',render);form.addEventListener('reset',()=>setTimeout(render,0));
function options(name,values){const select=form.elements.namedItem(name);[...select.querySelectorAll('option')].forEach(o=>{if(o.value)o.remove();});for(const value of [...new Set(values)].filter(Boolean).sort()){const o=el('option',groupText(name,value));o.value=value;select.append(o);}}
function populate(){
  options('domain',entries.map(e=>e.domain));options('task',entries.flatMap(e=>e.tasks));options('kind',entries.map(e=>e.kind));options('usage',entries.map(e=>e.usage?.mode||'unknown'));options('runtime',entries.flatMap(e=>[...(e.runtimes||[]),...(e.formats||[])]));options('license',entries.map(e=>e.license.weights));options('target',['luckfox-rv1106','esp32',...runs.map(r=>r.hardware.id),...entries.flatMap(e=>(e.compatibility||[]).map(c=>c.target))]);
  const stats=$('#stats');stats.replaceChildren();
  for(const [value,label]of [[entries.length,t('ui.statsComponents')],[new Set(entries.map(e=>e.domain)).size,t('ui.statsDomains')],[entries.filter(e=>e.reviewed).length,t('ui.statsReviews')],[runs.length,t('ui.statsRuns')]]){const stat=el('div',undefined,'stat');stat.append(el('strong',value),el('span',label));stats.append(stat);}
}
try{
  await initI18n();
  const response=await fetch('./data/catalog.json');if(!response.ok)throw new Error(`Catalogue HTTP ${response.status}`);const data=await response.json();entries=data.entries;runs=data.benchmarks||[];
  const localeSelect=$('#locale');for(const code of Object.keys(LOCALE_NAMES)){const opt=el('option',LOCALE_NAMES[code]);opt.value=code;localeSelect.append(opt);}localeSelect.value=getLocale();
  localeSelect.addEventListener('change',async()=>{try{await loadLocale(localeSelect.value);localStorage.setItem('locale',localeSelect.value);}catch{}applyStatic(document);populate();updateCompare();render();});
  for(const [key,value]of new URLSearchParams(location.search)){const input=form.elements.namedItem(key);if(input){if(input.type==='checkbox')input.checked=value==='1';else input.value=value;}}
  const needParam=new URLSearchParams(location.search).get('need');if(needParam){$('#need').value=needParam;needQuery=needParam;}
  populate();render();
}catch(error){$('#entries').replaceChildren();$('#error').textContent=`Could not load the catalogue: ${error.message}. Build with npm run site:build and serve dist over HTTP.`;$('#count').textContent=t('ui.catalogUnavailable');}
