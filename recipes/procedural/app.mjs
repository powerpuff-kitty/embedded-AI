import { ADAPTERS, configOf } from './contracts.mjs';
const $ = id => document.getElementById(id), canvas = $('canvas'), ctx = canvas.getContext('2d');
const descriptions = {noise:'A seeded scalar field, not an AI-generated landscape.',svg:'Rough.js drawing primitives, exported as real SVG paths.',tree:'EZ-Tree triangle geometry, projected in 2D. No textures or GPU benchmark.',audio:'A bounded ZzFX sine preset. The seed selects a note; no automatic playback.'};
let worker = null, timeout = null, current = null, report = null, audio = null, source = null, revision = 0;
let build = null;
const status = (text,state) => { $('status').textContent=text; $('status').dataset.state=state; };
function stopSound() { if(source){try{source.stop();}catch{}source.disconnect();source=null;} if(audio){audio.close().catch(()=>{});audio=null;} }
function cancel() { revision++;worker?.terminate();worker=null;clearTimeout(timeout);timeout=null;$('stop').disabled=true;$('generate').disabled=false;stopSound(); }
function reset() { cancel();current=null;report=null;$('empty').hidden=false;ctx.clearRect(0,0,canvas.width,canvas.height);
  for(const id of ['play','output','receipt'])$(id).disabled=true;
  for(const id of ['latency','bytes','repeat'])$(id).textContent='—';
  $('title').textContent=ADAPTERS[$('adapter').value].label;$('description').textContent=descriptions[$('adapter').value];
  $('source').href=`../?entry=${ADAPTERS[$('adapter').value].entry}`;$('report').textContent='No run yet.';status('Ready. Nothing runs automatically.','idle'); }
function download(blob,name) { const url=URL.createObjectURL(blob),a=document.createElement('a');a.href=url;a.download=name;a.click();setTimeout(()=>URL.revokeObjectURL(url),1000); }
function json(value) { return JSON.stringify(value,(_,v)=>ArrayBuffer.isView(v)?Array.from(v):v,2); }
async function render(o) {
  ctx.fillStyle='#edf1e5';ctx.fillRect(0,0,960,560);
  if(o.type==='noise') {
    const small=document.createElement('canvas');small.width=small.height=o.size;const c=small.getContext('2d'),img=c.createImageData(o.size,o.size);
    for(let i=0;i<o.values.length;i++){const v=(o.values[i]+1)/2;img.data.set([40+v*185,72+v*160,58+v*110,255],i*4);}c.putImageData(img,0,0);
    ctx.drawImage(small,0,0,960,560);
  } else if(o.type==='svg') {
    // Render as an image, not DOM markup: SVG scripting cannot enter the document.
    const url=URL.createObjectURL(new Blob([o.svg],{type:'image/svg+xml'}));const image=new Image();
    try {await new Promise((resolve,reject)=>{image.onload=resolve;image.onerror=()=>reject(new Error('SVG image decoding failed.'));image.src=url;});ctx.drawImage(image,70,0,820,560);} finally {URL.revokeObjectURL(url);}
  } else if(o.type==='tree') {
    const meshes=o.meshes.map(m=>{const points=[];for(let i=0;i<m.positions.length;i+=3){const [x,y,z]=m.positions.slice(i,i+3);points.push([x*.87+z*.5,-y,z*.87-x*.5]);}return {points,indices:m.indices};});
    const points=meshes.flatMap(m=>m.points),xs=points.map(p=>p[0]),ys=points.map(p=>p[1]);
    const minX=Math.min(...xs),maxX=Math.max(...xs),minY=Math.min(...ys),maxY=Math.max(...ys),scale=Math.min(750/(maxX-minX||1),470/(maxY-minY||1));
    const project=p=>[480+(p[0]-(minX+maxX)/2)*scale,275+(p[1]-(minY+maxY)/2)*scale];
    const triangles=[];meshes.forEach((m,mesh)=>{for(let i=0;i<m.indices.length;i+=3){const p=[m.points[m.indices[i]],m.points[m.indices[i+1]],m.points[m.indices[i+2]]];triangles.push({p,mesh,depth:p.reduce((s,v)=>s+v[2],0)});}});
    triangles.sort((a,b)=>a.depth-b.depth);for(const t of triangles){ctx.beginPath();t.p.map(project).forEach(([x,y],i)=>i?ctx.lineTo(x,y):ctx.moveTo(x,y));ctx.closePath();ctx.fillStyle=t.mesh?'#8fae72':'#52654b';ctx.strokeStyle=t.mesh?'#77995f':'#667953';ctx.lineWidth=.4;ctx.fill();ctx.stroke();}
  } else {
    ctx.strokeStyle='#cad7bd';ctx.beginPath();ctx.moveTo(36,280);ctx.lineTo(924,280);ctx.stroke();ctx.strokeStyle='#244638';ctx.lineWidth=1.5;ctx.beginPath();
    // Min/max envelope preserves high-frequency waveform visibility under downsampling.
    for(let x=0;x<888;x++){const start=Math.floor(x*o.values.length/888),end=Math.max(start+1,Math.floor((x+1)*o.values.length/888));let lo=0,hi=0;for(let i=start;i<end;i++){lo=Math.min(lo,o.values[i]);hi=Math.max(hi,o.values[i]);}ctx.moveTo(36+x,280+lo*550);ctx.lineTo(36+x,280+hi*550);}ctx.stroke();
  }
}
$('controls').addEventListener('submit',async event=>{
  event.preventDefault();reset();let config;
  try { config=configOf({adapter:$('adapter').value,seed:Number($('seed').value),detail:Number($('detail').value)}); }
  catch(e){status(e.message,'error');return;}
  const token=revision;history.replaceState(null,'',`?${new URLSearchParams(config)}`);
  $('generate').disabled=true;$('stop').disabled=false;status('Generating in a worker and checking three identical-seed runs…','running');
  try {
    if(!build){const response=await fetch('./build.json');if(!response.ok)throw new Error('Build receipt unavailable. Run npm run lab:install and npm run lab:build from the checkout.');build=await response.json();}
    if(token!==revision)return;
    worker=new Worker('./worker.mjs',{type:'module'});
    const fail=message=>{if(token!==revision)return;cancel();status(message,'error');};
    timeout=setTimeout(()=>fail('Stopped after the 10-second fixture time limit.'),10000);
    worker.onerror=()=>fail('Worker failed. Check that the optional lab bundle was built.');
    worker.onmessage=async ({data})=>{
      if(token!==revision)return;if(data.error){fail(data.error);return;}
      worker.terminate();worker=null;clearTimeout(timeout);
      try { await render(data.output);if(token!==revision)return;
        current=data.output;report={...data.report,build,observed_at:new Date().toISOString(),browser:navigator.userAgent};
        const sorted=[...report.generation_ms].sort((a,b)=>a-b);
        $('latency').textContent=`${sorted[1].toFixed(2)} ms`;$('bytes').textContent=`${(report.output_payload_bytes/1024).toFixed(1)} KiB`;$('repeat').textContent='Identical';
        $('empty').hidden=true;$('play').disabled=current.type!=='audio';$('output').disabled=$('receipt').disabled=false;
        $('report').textContent=json(report);$('generate').disabled=false;$('stop').disabled=true;
        status('Verified locally. Same-seed outputs match; this is not a device-fit guarantee.','ready');
      } catch(e){fail(e.message);}
    };
    worker.postMessage(config);
  } catch(e){cancel();status(e.message,'error');}
});
for(const id of ['adapter','seed','detail'])$(id).addEventListener('change',reset);
$('stop').onclick=()=>{cancel();status('Stopped.','idle');};
$('play').onclick=async ()=>{if(current?.type!=='audio')return;stopSound();try{audio=new AudioContext();await audio.resume();const buffer=audio.createBuffer(1,current.values.length,current.sampleRate);buffer.getChannelData(0).set(current.values);source=audio.createBufferSource();source.buffer=buffer;const gain=audio.createGain();gain.gain.value=.35;source.connect(gain);gain.connect(audio.destination);source.onended=()=>gain.disconnect();source.start();status('Playing one short, volume-limited sound.','ready');}catch(e){stopSound();status(e.message,'error');}};
$('receipt').onclick=()=>report&&download(new Blob([json(report)],{type:'application/json'}),`procedural-${report.adapter}-run.json`);
$('output').onclick=()=>{if(!current)return;if(current.type==='svg'){download(new Blob([current.svg],{type:'image/svg+xml'}),'procedural-sketch.svg');return;}if(current.type==='audio'){
  const n=current.values.length,b=new ArrayBuffer(44+n*2),v=new DataView(b);const text=(at,s)=>[...s].forEach((c,i)=>v.setUint8(at+i,c.charCodeAt(0)));
  text(0,'RIFF');v.setUint32(4,36+n*2,true);text(8,'WAVE');text(12,'fmt ');v.setUint32(16,16,true);v.setUint16(20,1,true);v.setUint16(22,1,true);v.setUint32(24,current.sampleRate,true);v.setUint32(28,current.sampleRate*2,true);v.setUint16(32,2,true);v.setUint16(34,16,true);text(36,'data');v.setUint32(40,n*2,true);current.values.forEach((x,i)=>v.setInt16(44+i*2,Math.max(-1,Math.min(1,x))*32767,true));download(new Blob([b],{type:'audio/wav'}),'procedural-sound.wav');return;}
  download(new Blob([json({config:report.config,output:current})],{type:'application/json'}),`procedural-${current.type}.json`);
};
document.addEventListener('visibilitychange',()=>{if(document.hidden){const running=$('status').dataset.state==='running';cancel();if(running)status('Paused because the page is hidden.','idle');}});
window.addEventListener('pagehide',cancel);
const q=new URLSearchParams(location.search);if(q.size){try{const c=configOf({adapter:q.get('adapter')||'noise',seed:Number(q.get('seed')||42),detail:Number(q.get('detail')||1)});for(const [k,v]of Object.entries(c))$(k).value=v;}catch{status('Invalid URL configuration; defaults retained.','error');}}
reset();
