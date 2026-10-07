import {ADAPTERS,validateRecipe,recipeFromQuery,recipeQuery,exportOutput} from './core.mjs';
import {renderOutput} from './render.mjs';
const $=id=>document.getElementById(id);
let adapter='noise',last=null,report=null,worker=null,request=0,timer=null,audio=null,source=null,audioRequest=0;
const status=s=>{$('status').textContent=s;};
function recipe(){return validateRecipe({schema_version:1,adapter,seed:Number($('seed').value),detail:Number($('detail').value)});}
function syncUI(){
  const a=ADAPTERS[adapter];$('stage-name').textContent=a.name.toUpperCase();$('stage-seed').textContent='SEED / '+$('seed').value;$('detail-value').value=$('detail').value;
  for(const button of document.querySelectorAll('[data-adapter]'))button.setAttribute('aria-pressed',String(button.dataset.adapter===adapter));
  $('upstream').textContent=`${a.entry} · ${a.version}`;$('upstream').href='../c/'+a.entry+'.html';$('scope').textContent=a.note;$('play').hidden=adapter!=='audio';
}
function stopAudio(){audioRequest++;if(source){try{source.stop();}catch{}source.disconnect();source=null;}if(audio?.state==='running')audio.suspend().catch(()=>{});}
function cancel(message='Stopped.'){
  request++;worker?.terminate();worker=null;clearTimeout(timer);stopAudio();$('running').hidden=true;$('stop').disabled=true;$('generate').disabled=false;$('benchmark').disabled=false;status(message);
}
function invalidate(){cancel('Ready. Generate to apply these controls.');last=null;report=null;$('export').disabled=true;$('report-export').disabled=true;$('play').disabled=true;$('report-details').hidden=true;$('verification').textContent='Not benchmarked with these controls.';$('metrics').textContent='';$('preview').classList.remove('visible');$('empty').hidden=false;$('error').textContent='';syncUI();}
function loadRecipe(r){r=validateRecipe(r);adapter=r.adapter;$('seed').value=r.seed;$('detail').value=r.detail;invalidate();history.replaceState(null,'','?'+recipeQuery(r));}
async function run(action){
  let r;try{r=recipe();}catch(e){$('error').textContent=e.message;return;}
  cancel('');last=null;report=null;$('export').disabled=true;$('report-export').disabled=true;$('play').disabled=true;$('report-details').hidden=true;$('verification').textContent='Not benchmarked with these controls.';
  const id=++request;$('error').textContent='';$('generate').disabled=true;$('benchmark').disabled=true;$('stop').disabled=false;$('running').textContent=action==='benchmark'?'Checking eight independent generations…':'Generating locally…';$('running').hidden=false;
  status(action==='benchmark'?'Running one warm-up and eight measured iterations.':'Generating in an isolated worker.');syncUI();history.replaceState(null,'','?'+recipeQuery(r));
  worker=new Worker('./worker.mjs',{type:'module'});
  const fail=message=>{if(id!==request)return;cancel('Generation failed.');$('error').textContent=message;};
  timer=setTimeout(()=>fail('Workload timed out and was terminated. Try a lower detail level.'),action==='benchmark'?20000:8000);
  worker.onerror=e=>fail(e.message||'Worker could not start. Serve the built site over HTTP or HTTPS.');
  worker.onmessage=async({data})=>{
    if(data.id!==id||id!==request)return;
    if(!data.ok){fail(data.error);return;}
    try{
      // Draw on a detached canvas first so a stale decode cannot overwrite a newer selection.
      const staging=document.createElement('canvas');staging.width=960;staging.height=540;await renderOutput(staging,data.output);
      if(id!==request)return;
      last={recipe:r,output:data.output};report=data.report??null;
      $('preview').getContext('2d').drawImage(staging,0,0);$('preview').classList.add('visible');$('empty').hidden=true;
      $('metrics').textContent=`${data.elapsed_ms.toFixed(2)} ms · ${(data.bytes/1024).toFixed(1)} KiB payload`;
      $('export').disabled=false;$('play').disabled=adapter!=='audio';$('report-export').disabled=!report;
      $('verification').textContent=report?(report.validation.same_runtime_repeatable?'8 / 8 identical output hashes in this worker.':'Outputs differed. Inspect the report before relying on replay.'):`SHA-256 · ${data.hash.slice(0,20)}…`;
      if(report){$('report').textContent=JSON.stringify(report,null,2);$('report-details').hidden=false;}
      clearTimeout(timer);worker.terminate();worker=null;$('running').hidden=true;$('stop').disabled=true;$('generate').disabled=false;$('benchmark').disabled=false;status(report?'Observation ready. Nothing was uploaded.':'Generated. Worker released; preview and exports are local.');
    }catch(e){fail(e.message);}
  };
  worker.postMessage({id,action,recipe:r});
}
function save(name,type,data){const blob=new Blob([data],{type}),url=URL.createObjectURL(blob),a=document.createElement('a');a.href=url;a.download=name;a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);}
$('controls').onsubmit=e=>{e.preventDefault();run('generate');};$('benchmark').onclick=()=>run('benchmark');$('stop').onclick=()=>cancel();
for(const id of ['seed','detail'])$(id).addEventListener('input',invalidate);
for(const button of document.querySelectorAll('[data-adapter]'))button.onclick=()=>{adapter=button.dataset.adapter;invalidate();};
$('shuffle').onclick=()=>{const v=crypto.getRandomValues(new Uint32Array(1))[0];$('seed').value=v%2147483646+1;invalidate();};
$('export').onclick=()=>{if(last){const f=exportOutput(last.output);save(f.name,f.type,f.data);}};
$('recipe-export').onclick=()=>{try{save('procedural-recipe.json','application/json',JSON.stringify(recipe(),null,2));}catch(e){$('error').textContent=e.message;}};
$('report-export').onclick=()=>{if(report)save('procedural-observation.json','application/json',JSON.stringify(report,null,2));};
$('recipe-import').onchange=async e=>{const file=e.target.files[0];try{if(!file)return;if(file.size>2048)throw new Error('Recipe exceeds the 2 KiB limit.');loadRecipe(JSON.parse(await file.text()));status('Recipe loaded. Press Generate to run it.');}catch(e){$('error').textContent=e.message;}finally{$('recipe-import').value='';}};
$('play').onclick=async()=>{
  if(last?.output.kind!=='audio')return;
  try{
    stopAudio();const token=audioRequest,chosen=last;audio??=new AudioContext();await audio.resume();if(token!==audioRequest||last!==chosen||document.hidden)return;const out=chosen.output,b=audio.createBuffer(1,out.samples.length,out.sample_rate);b.copyToChannel(out.samples,0);source=audio.createBufferSource();source.buffer=b;source.connect(audio.destination);source.start();$('stop').disabled=false;
    const current=source;source.onended=()=>{current.disconnect();if(source===current){source=null;if(!worker)$('stop').disabled=true;audio.suspend().catch(()=>{});}};status('Playing one bounded sound.');
  }catch(e){$('error').textContent='Audio unavailable: '+e.message;}
};
document.addEventListener('visibilitychange',()=>{if(document.hidden)cancel('Paused because this page is hidden.');});
window.addEventListener('pagehide',()=>{cancel('');audio?.close().catch(()=>{});});
try{loadRecipe(recipeFromQuery(location.search));status('Ready. Generation starts only when requested.');}catch(e){syncUI();$('error').textContent=e.message;}
