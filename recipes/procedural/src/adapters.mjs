import {createNoise2D} from 'simplex-noise';
import rough from 'roughjs';
import {Tree} from '@dgreenheck/ez-tree';
import {ZZFX} from 'zzfx';
import {validateRecipe,validateOutput,randomStream} from './core.mjs';
const clamp=n=>Math.max(0,Math.min(1,n));
function field(r){
  const n=64*r.detail,noise=createNoise2D(randomStream(r.seed)),values=new Float32Array(n*n);
  for(let y=0;y<n;y++)for(let x=0;x<n;x++){
    let a=1,sum=0,weight=0,f=2.4;
    for(let o=0;o<4;o++){sum+=a*noise(x/n*f,y/n*f);weight+=a;a*=.5;f*=2;}
    const dx=x/n-.5,dy=y/n-.5;values[y*n+x]=clamp(.55+.55*sum/weight-.65*(dx*dx+dy*dy));
  }
  return {kind:'noise',width:n,height:n,values};
}
function landscape(r){
  const g=rough.generator(),noise=createNoise2D(randomStream(r.seed));let serial=0;
  const shapes=[],ink=['#b8c0ac','#9daa95','#819881','#537c68','#335f54'];
  const add=d=>{for(const p of g.toPaths(d))shapes.push(`<path d="${p.d}" stroke="${p.stroke}" stroke-width="${p.strokeWidth}" fill="${p.fill||'none'}"/>`);};
  const opts=(extra={})=>({seed:((r.seed+serial++)%2147483646)+1,fixedDecimalPlaceDigits:2,roughness:1.3,stroke:'#244b42',strokeWidth:1,...extra});
  add(g.circle(742,112,83,opts({fill:'#dcb36e',fillStyle:'solid',stroke:'none'})));
  for(let layer=0;layer<5;layer++){
    const top=[];for(let x=-10;x<=970;x+=12){const h=145+layer*65+noise(x/250,layer*1.8)*65+noise(x/75,layer)*12;top.push([x,h]);}
    add(g.polygon([...top,[970,540],[-10,540]],opts({fill:ink[layer],fillStyle:'solid',stroke:'#426552'})));
    for(let j=0;j<r.detail+2;j++){const y=layer*1.8+j*.045;const pts=top.map(([x,h])=>[x,h+12+j*5+noise(x/220,y)*2]);add(g.linearPath(pts,opts({stroke:layer<2?'#d4d8c7':'#97ae99',strokeWidth:.7,roughness:.3})));}
  }
  for(let i=0;i<4+r.detail*3;i++){
    const x=60+i*840/(4+r.detail*3),y=420+noise(x/170,8)*42,h=24+noise(x/45,9)*10;
    add(g.line(x,y,x,y-h*2,opts({stroke:'#173e37',strokeWidth:2})));
    add(g.polygon([[x,y-h*2-15],[x-12,y-h*.5],[x+12,y-h*.5]],opts({fill:'#214e42',fillStyle:'solid',stroke:'#214e42'})));
  }
  return {kind:'svg',width:960,height:540,svg:`<svg xmlns="http://www.w3.org/2000/svg" width="960" height="540" viewBox="0 0 960 540"><rect width="960" height="540" fill="#edece0"/>${shapes.join('')}</svg>`};
}
function tree(r){
  const t=new Tree();
  try {
    t.options.seed=r.seed;t.options.bark.textured=false;t.options.branch.levels=3;
    t.options.branch.children={0:3+r.detail,1:2+r.detail,2:2};
    t.options.branch.sections={0:8,1:6,2:4,3:3};t.options.branch.segments={0:6,1:5,2:4,3:3};
    t.options.leaves.count=2;t.options.leaves.size=1.6;t.options.trellis.enabled=false;t.generate();
    return {kind:'tree',meshes:[['branches',t.branches],['leaves',t.leaves]].map(([name,m])=>({name,positions:Float32Array.from(m.verts),indices:Uint32Array.from(m.indices)}))};
  } finally {t.traverse(o=>{o.geometry?.dispose();if(o.material){for(const m of Array.isArray(o.material)?o.material:[o.material])m.dispose();}});}
}
function sound(r){
  const rng=randomStream(r.seed),notes=[0,3,5,7,10,12,15,19],semi=notes[Math.floor(rng()*notes.length)],hz=180*Math.pow(2,semi/12)*(1+rng()*.08);
  // Only synthesized samples are used: no upstream AudioContext or playback hooks.
  const samples=ZZFX.buildSamples(.17,0,hz,.012,.035,.12+r.detail*.065,r.detail%3,1,.08*(rng()-.5),0,hz*.5,.035,0,0,0,0,0,.6,.03,0,0);
  return {kind:'audio',sample_rate:44100,samples:Float32Array.from(samples)};
}
export function generate(recipe){const r=validateRecipe(recipe);return validateOutput(({noise:field,svg:landscape,tree,audio:sound})[r.adapter](r));}
