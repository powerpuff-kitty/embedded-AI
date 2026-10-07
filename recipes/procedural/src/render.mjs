/** Canvas presentation only. Exported generator data remains the source of truth. */
export async function renderOutput(canvas,out){
  const c=canvas.getContext('2d');if(!c)throw new Error('Canvas 2D is unavailable.');
  const W=canvas.width,H=canvas.height;c.clearRect(0,0,W,H);c.fillStyle='#edece0';c.fillRect(0,0,W,H);
  if(out.kind==='svg'){
    const url=URL.createObjectURL(new Blob([out.svg],{type:'image/svg+xml'}));
    try{const img=new Image();img.src=url;await img.decode();c.drawImage(img,0,0,W,H);}finally{URL.revokeObjectURL(url);}return;
  }
  if(out.kind==='noise'){
    const img=c.createImageData(out.width,out.height),stops=[[.15,[35,76,74]],[.4,[81,124,115]],[.46,[183,192,153]],[.55,[139,164,112]],[.68,[73,111,72]],[.9,[229,224,197]],[1,[249,246,232]]];
    for(let i=0;i<out.values.length;i++){
      const h=out.values[i];let j=stops.findIndex(([v])=>h<=v);if(j<0)j=stops.length-1;
      const [lo,a]=stops[Math.max(0,j-1)],[hi,b]=stops[j],t=hi===lo?0:Math.max(0,(h-lo)/(hi-lo));
      const band=Math.floor(h*28)%2===0?1:.94;for(let k=0;k<3;k++)img.data[i*4+k]=(a[k]+(b[k]-a[k])*t)*band;img.data[i*4+3]=255;
    }
    const off=typeof OffscreenCanvas==='function'?new OffscreenCanvas(out.width,out.height):document.createElement('canvas');off.width=out.width;off.height=out.height;off.getContext('2d').putImageData(img,0,0);
    c.imageSmoothingEnabled=false;const size=H-38;c.drawImage(off,(W-size)/2,19,size,size);
    c.strokeStyle='#516651';c.lineWidth=1;c.strokeRect((W-size)/2-.5,18.5,size+1,size+1);
    return;
  }
  if(out.kind==='audio'){
    c.strokeStyle='#cad0bf';c.lineWidth=1;
    for(let x=60;x<W-40;x+=60){c.beginPath();c.moveTo(x,45);c.lineTo(x,H-45);c.stroke();}
    c.beginPath();c.moveTo(40,H/2);c.lineTo(W-40,H/2);c.stroke();
    c.fillStyle='#417463';
    const columns=W-80;
    for(let x=0;x<columns;x++){
      const from=Math.floor(x*out.samples.length/columns),to=Math.max(from+1,Math.floor((x+1)*out.samples.length/columns));let low=0,high=0;
      for(let j=from;j<to;j++){low=Math.min(low,out.samples[j]);high=Math.max(high,out.samples[j]);}
      c.fillRect(x+40,H/2-high*1000,1,Math.max(1,(high-low)*1000));
    }
    c.font='13px monospace';c.fillStyle='#426351';c.fillText('0 s',40,H-22);c.fillText(`${(out.samples.length/out.sample_rate).toFixed(3)} s`,W-110,H-22);return;
  }
  const yaw=.7,cos=Math.cos(yaw),sin=Math.sin(yaw);
  const project=(x,y,z)=>[x*cos+z*sin,-y+(x*sin-z*cos)*.23,x*sin-z*cos];
  let minX=Infinity,minY=Infinity,maxX=-Infinity,maxY=-Infinity;
  const all=out.meshes.map(m=>{
    const vs=[];for(let i=0;i<m.positions.length;i+=3){const v=project(...m.positions.slice(i,i+3));vs.push(v);minX=Math.min(minX,v[0]);maxX=Math.max(maxX,v[0]);minY=Math.min(minY,v[1]);maxY=Math.max(maxY,v[1]);}
    return {...m,vs};
  });
  const scale=Math.min((W-180)/(maxX-minX),(H-65)/(maxY-minY)),ox=W/2-(minX+maxX)/2*scale,oy=(H-35)-(maxY)*scale;
  c.fillStyle='#d0d2bf';c.beginPath();c.ellipse(W/2,H-31,110,12,0,0,Math.PI*2);c.fill();
  const faces=[];
  for(const m of all)for(let i=0;i<m.indices.length;i+=3){const v=[m.vs[m.indices[i]],m.vs[m.indices[i+1]],m.vs[m.indices[i+2]]];faces.push({v,name:m.name,depth:v.reduce((n,p)=>n+p[2],0)/3});}
  faces.sort((a,b)=>a.depth-b.depth);
  for(const {v,name,depth} of faces){
    const light=Math.max(23,Math.min(56,36+depth*1.5));c.fillStyle=name==='branches'?`hsl(33 22% ${light-8}%)`:`hsl(135 22% ${light}%)`;
    c.beginPath();c.moveTo(ox+v[0][0]*scale,oy+v[0][1]*scale);c.lineTo(ox+v[1][0]*scale,oy+v[1][1]*scale);c.lineTo(ox+v[2][0]*scale,oy+v[2][1]*scale);c.closePath();c.fill();
  }
}
