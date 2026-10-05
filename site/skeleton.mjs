export function syntheticSkeleton(){
  const base=[[320,80],[310,76],[330,76],[300,80],[340,80],[285,145],[355,145],[260,210],[380,210],[245,270],[395,270],[295,270],[345,270],[280,355],[360,355],[270,440],[370,440]];
  const records=[{type:'metadata',schema_version:1,skeleton:'coco-17',coordinates:'image-pixels',fps:15,synthetic:true,license:'CC0-1.0',not_model_output:true}];
  for(let i=0;i<60;i++)records.push({type:'frame',index:i,time_seconds:i/15,width:640,height:480,people:[{track_id:0,joints:base.map(([x,y],j)=>[x+(j>6?12*Math.sin(i/8):0),y,1])}]});
  return records.map(record=>JSON.stringify(record)).join('\n')+'\n';
}
export const BONES = [[0,1],[0,2],[1,3],[2,4],[5,6],[5,7],[7,9],[6,8],[8,10],[5,11],[6,12],[11,12],[11,13],[13,15],[12,14],[14,16]];
export function parseSkeleton(text) {
  if(text.length>32*1024*1024)throw new Error('File exceeds 32 MB viewer limit. Split long recordings.');
  const records=text.trim().split(/\r?\n/).filter(Boolean).map(line=>JSON.parse(line));
  const meta=records.shift();
  if(!meta || meta.type!=='metadata' || meta.schema_version!==1 || meta.skeleton!=='coco-17')throw new Error('Expected COCO-17 metadata version 1.');
  if(!records.length||records.length>100000)throw new Error('Expected 1–100000 frames.');
  let last=-Infinity;
  for(const frame of records){
    if(frame.type!=='frame'||!Number.isFinite(frame.time_seconds)||frame.time_seconds<last||!Array.isArray(frame.people)||!Number.isFinite(frame.width)||!Number.isFinite(frame.height)||frame.width<=0||frame.height<=0)throw new Error('Invalid frame or unordered timestamps.');
    last=frame.time_seconds;
    if(frame.people.length>100)throw new Error('Too many people in a frame.');
    for(const person of frame.people){
      if(!Array.isArray(person.joints)||person.joints.length!==17)throw new Error('Expected COCO-17 joints.');
      for(const joint of person.joints)if(joint!==null&&(!Array.isArray(joint)||joint.length<2||!joint.slice(0,2).every(Number.isFinite)))throw new Error('Invalid keypoint.');
    }
  }
  return {meta,frames:records};
}
if(typeof document!=='undefined'){
  const el=id=>document.getElementById(id),ctx=el('canvas').getContext('2d');
  let data=null,playing=false,started=0,offset=0;
  function render(index){
    if(!data)return;
    const frame=data.frames[index];el('frame').value=String(index);
    ctx.clearRect(0,0,960,540);ctx.fillStyle='#f2f4ee';ctx.fillRect(0,0,960,540);
    const scale=Math.min(920/frame.width,480/frame.height),dx=(960-frame.width*scale)/2,dy=(540-frame.height*scale)/2;
    const point=p=>[p[0]*scale+dx,p[1]*scale+dy];
    for(const person of frame.people){
      const joints=person.joints;ctx.strokeStyle='#204f43';ctx.fillStyle='#204f43';ctx.lineWidth=3;
      for(const [a,b]of BONES){if(!joints[a]||!joints[b])continue;ctx.beginPath();ctx.moveTo(...point(joints[a]));ctx.lineTo(...point(joints[b]));ctx.stroke();}
      for(const p of joints){if(!p)continue;ctx.beginPath();ctx.arc(...point(p),4,0,Math.PI*2);ctx.fill();}
      const first=joints.find(Boolean);if(first){ctx.font='14px sans-serif';const [x,y]=point(first);ctx.fillText(`track ${person.track_id??'?'}`,x+8,y-8);}
    }
    el('status').textContent=`${index+1} / ${data.frames.length} · ${frame.time_seconds.toFixed(3)} seconds · ${data.meta.synthetic?'SYNTHETIC FIXTURE — not model output':'image-relative coordinates'}`;
  }
  function load(text){data=parseSkeleton(text);playing=false;el('play').textContent='Play';el('play').disabled=false;el('frame').disabled=false;el('frame').max=String(data.frames.length-1);el('meta').textContent=JSON.stringify(data.meta,null,2);render(0);}
  el('file').addEventListener('change',async event=>{try{const file=event.target.files[0];if(!file)return;if(file.size>32*1024*1024)throw new Error('File exceeds 32 MB.');load(await file.text());}catch(error){el('status').textContent=error.message;}});
  el('demo').onclick=()=>load(syntheticSkeleton());
  el('frame').oninput=()=>{playing=false;el('play').textContent='Play';render(Number(el('frame').value));};
  el('play').onclick=()=>{if(!data)return;playing=!playing;el('play').textContent=playing?'Pause':'Play';started=performance.now();offset=data.frames[Number(el('frame').value)].time_seconds;};
  function tick(now){if(playing&&data){const target=offset+(now-started)/1000;let i=Number(el('frame').value);while(i+1<data.frames.length&&data.frames[i+1].time_seconds<=target)i++;render(i);if(i===data.frames.length-1){playing=false;el('play').textContent='Play';}}requestAnimationFrame(tick);}requestAnimationFrame(tick);
}
