/** Bounded, versioned workload contracts; this module has no dependencies or DOM effects. */
export const ADAPTER_VERSION = '1.0.0';
export const ADAPTERS = Object.freeze({
  noise: {name:'Noise field', entry:'simplex-noise-js', version:'4.0.3', note:'Seeded simplex-noise scalar field. Not a terrain mesh.'},
  svg: {name:'SVG landscape', entry:'rough-js', version:'4.6.6', note:'Rough.js strokes and simplex-noise. Original fixture composition, not Shan Shui.'},
  tree: {name:'Tree geometry', entry:'ez-tree', version:'1.1.0', note:'EZ-Tree geometry-only adapter. Texture-free projection; no biological growth simulation.'},
  audio: {name:'Sound effect', entry:'zzfx', version:'1.4.0', note:'ZzFX sample-generation adapter. Seed selects pitch; no audio until Play.'},
});
export const DEFAULT_RECIPE = Object.freeze({schema_version:1, adapter:'noise', seed:42, detail:2});
export function validateRecipe(value) {
  if (!value || typeof value!=='object' || Array.isArray(value) || ![Object.prototype,null].includes(Object.getPrototypeOf(value))) throw new TypeError('Recipe must be a plain object.');
  const keys=Object.keys(value).sort();
  if (keys.join(',')!=='adapter,detail,schema_version,seed') throw new TypeError('Recipe requires exactly schema_version, adapter, seed and detail.');
  if (value.schema_version!==1) throw new RangeError('Unsupported recipe version.');
  if (!Object.hasOwn(ADAPTERS,value.adapter)) throw new RangeError('Unknown adapter.');
  if (!Number.isInteger(value.seed)||value.seed<1||value.seed>2147483646) throw new RangeError('Seed must be an integer from 1 to 2147483646.');
  if (!Number.isInteger(value.detail)||value.detail<1||value.detail>4) throw new RangeError('Detail must be an integer from 1 to 4.');
  return {schema_version:1,adapter:value.adapter,seed:value.seed,detail:value.detail};
}
export function recipeFromQuery(query) {
  const q=new URLSearchParams(query);
  for (const key of q.keys()) if (!['adapter','seed','detail'].includes(key) || q.getAll(key).length!==1) throw new RangeError('Unknown or repeated URL parameter.');
  return validateRecipe({schema_version:1,adapter:q.get('adapter')??'noise',seed:q.has('seed')?Number(q.get('seed')):42,detail:q.has('detail')?Number(q.get('detail')):2});
}
export function recipeQuery(recipe) {
  const r=validateRecipe(recipe);return new URLSearchParams({adapter:r.adapter,seed:String(r.seed),detail:String(r.detail)}).toString();
}
/** Isolated Park-Miller stream. Not cryptographic and never assigned to Math.random. */
export function randomStream(seed) {
  if (!Number.isInteger(seed)||seed<1||seed>2147483646) throw new RangeError('Invalid random seed.');
  let state=seed;return ()=>{state=state*16807%2147483647;return (state-1)/2147483646;};
}
const numericBytes=a=>{
  const out=new Uint8Array(a.length*4),dv=new DataView(out.buffer);
  for(let i=0;i<a.length;i++) a instanceof Uint32Array?dv.setUint32(i*4,a[i],true):dv.setFloat32(i*4,a[i],true);
  return out;
};
export function payloads(out) {
  if (out.kind==='svg') return [new TextEncoder().encode(out.svg)];
  if (out.kind==='noise') return [numericBytes(out.values)];
  if (out.kind==='audio') return [numericBytes(out.samples)];
  if (out.kind==='tree') return out.meshes.flatMap(m=>[numericBytes(m.positions),numericBytes(m.indices)]);
  throw new RangeError('Unknown output.');
}
export const outputBytes=out=>payloads(out).reduce((n,p)=>n+p.length,0);
export async function outputHash(out) {
  const parts=payloads(out),header=new TextEncoder().encode(JSON.stringify({kind:out.kind,width:out.width,height:out.height,sample_rate:out.sample_rate,meshes:out.meshes?.map(m=>({name:m.name,positions:m.positions.length,indices:m.indices.length})),lengths:parts.map(p=>p.length)}));
  const bytes=new Uint8Array(4+header.length+parts.reduce((s,a)=>s+a.length,0));
  new DataView(bytes.buffer).setUint32(0,header.length,true);bytes.set(header,4);
  let at=4+header.length;for(const a of parts){bytes.set(a,at);at+=a.length;}
  return Array.from(new Uint8Array(await crypto.subtle.digest('SHA-256',bytes)),v=>v.toString(16).padStart(2,'0')).join('');
}
export function validateOutput(out) {
  const finite=a=>{if(!a||!a.length||a.length>500000)throw new RangeError('Invalid output length.');for(const v of a)if(!Number.isFinite(v))throw new RangeError('Non-finite output.');};
  if(out.kind==='noise'){
    finite(out.values);if(out.values.length!==out.width*out.height||out.width>256||out.height>256)throw new RangeError('Invalid noise dimensions.');
    for(const v of out.values)if(v<0||v>1)throw new RangeError('Noise exceeds normalized range.');
  }else if(out.kind==='svg'){
    if(typeof out.svg!=='string'||out.svg.length>1000000||!out.svg.startsWith('<svg ')||!out.svg.endsWith('</svg>'))throw new RangeError('Invalid SVG output.');
    if(/<(?:script|foreignObject|image|use|iframe)\b|\bon\w+\s*=|\b(?:href|style)\s*=|url\s*\(/i.test(out.svg))throw new RangeError('Active SVG content.');
  }else if(out.kind==='tree'){
    if(!Array.isArray(out.meshes)||out.meshes.length!==2)throw new RangeError('Invalid tree meshes.');
    for(const m of out.meshes){finite(m.positions);finite(m.indices);if(m.positions.length%3||m.indices.length%3||m.positions.length/3>60000)throw new RangeError('Invalid mesh dimensions.');for(const i of m.indices)if(!Number.isInteger(i)||i<0||i>=m.positions.length/3)throw new RangeError('Invalid mesh index.');}
  }else if(out.kind==='audio'){
    finite(out.samples);if(out.sample_rate!==44100||out.samples.length>44100)throw new RangeError('Audio duration cap exceeded.');
    for(const v of out.samples)if(Math.abs(v)>0.20001)throw new RangeError('Audio gain cap exceeded.');
  }else throw new RangeError('Invalid output kind.');
  if(outputBytes(out)>2000000)throw new RangeError('Output byte cap exceeded.');
  return out;
}
export function percentile(sorted,p) {
  if(!sorted.length||p<=0||p>1||sorted.some(n=>!Number.isFinite(n)||n<0))throw new RangeError('Invalid percentile data.');
  return sorted[Math.max(0,Math.ceil(sorted.length*p)-1)];
}
export function exportOutput(out) {
  validateOutput(out);
  if(out.kind==='svg')return {name:'landscape.svg',type:'image/svg+xml',data:out.svg};
  if(out.kind==='audio'){
    const n=out.samples.length,b=new ArrayBuffer(44+n*2),v=new DataView(b);
    const text=(at,s)=>[...s].forEach((c,i)=>v.setUint8(at+i,c.charCodeAt(0)));
    text(0,'RIFF');v.setUint32(4,36+n*2,true);text(8,'WAVE');text(12,'fmt ');v.setUint32(16,16,true);v.setUint16(20,1,true);v.setUint16(22,1,true);v.setUint32(24,out.sample_rate,true);v.setUint32(28,out.sample_rate*2,true);v.setUint16(32,2,true);v.setUint16(34,16,true);text(36,'data');v.setUint32(40,n*2,true);
    for(let i=0;i<n;i++){const s=Math.max(-1,Math.min(1,out.samples[i]));v.setInt16(44+i*2,Math.round(s*(s<0?32768:32767)),true);}
    return {name:'sound.wav',type:'audio/wav',data:b};
  }
  if(out.kind==='tree'){
    let text='# EZ-Tree geometry-only fixture; not a watertight solid\n',base=1;
    for(const m of out.meshes){text+=`o ${m.name}\n`;for(let i=0;i<m.positions.length;i+=3)text+=`v ${m.positions[i]} ${m.positions[i+1]} ${m.positions[i+2]}\n`;for(let i=0;i<m.indices.length;i+=3)text+=`f ${base+m.indices[i]} ${base+m.indices[i+1]} ${base+m.indices[i+2]}\n`;base+=m.positions.length/3;}
    return {name:'tree.obj',type:'text/plain',data:text};
  }
  return {name:'heightfield.json',type:'application/json',data:JSON.stringify({kind:out.kind,width:out.width,height:out.height,values:Array.from(out.values)})};
}
