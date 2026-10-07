import {generate} from './adapters.mjs';
import {validateRecipe,outputBytes,outputHash,percentile,ADAPTER_VERSION} from './core.mjs';
let buildInfo;
self.onmessage=async({data})=>{
  const id=data?.id;
  try{
    if(!Number.isInteger(id)||!['generate','benchmark'].includes(data.action))throw new Error('Invalid worker request.');
    const recipe=validateRecipe(data.recipe);let output;
    if(data.action==='generate'){
      const start=performance.now();output=generate(recipe);const elapsed=performance.now()-start;
      self.postMessage({id,ok:true,output,elapsed_ms:elapsed,bytes:outputBytes(output),hash:await outputHash(output)});return;
    }
    if(!buildInfo){const r=await fetch('./build-info.json');if(!r.ok)throw new Error('Build provenance unavailable.');buildInfo=await r.json();}
    generate(recipe); // one untimed warm-up; does not create an AudioContext
    const times=[],hashes=[];
    for(let i=0;i<8;i++){
      const start=performance.now();output=generate(recipe);times.push(performance.now()-start);hashes.push(await outputHash(output));
    }
    const sorted=[...times].sort((a,b)=>a-b),repeated=hashes.every(h=>h===hashes[0]);
    const report={schema_version:1,adapter_version:ADAPTER_VERSION,kind:'procedural-browser-observation',recipe,environment:{user_agent:navigator.userAgent,platform:navigator.platform||'unknown',hardware_concurrency:navigator.hardwareConcurrency??null},provenance:buildInfo,measurements:{warmup_iterations:1,iterations:8,latency_ms:{samples:times,p50:percentile(sorted,.5),p95:percentile(sorted,.95)},output_payload_bytes:outputBytes(output),process_peak_rss_mb:null},validation:{finite_and_bounded:true,same_runtime_repeatable:repeated,output_sha256:hashes[0],repeat_hashes:hashes},scope:'Synchronous generation and output validation in a dedicated worker; excludes loading, hashing, transfer, rendering and playback. Payload bytes are not RAM. Same-runtime fixture observation, not device or upstream-library certification.'};
    self.postMessage({id,ok:true,output,report,hash:hashes.at(-1),bytes:outputBytes(output),elapsed_ms:times.at(-1)});
  }catch(error){self.postMessage({id,ok:false,error:error instanceof Error?error.message:String(error)});}
};
