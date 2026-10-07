import fs from 'node:fs/promises';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {createHash} from 'node:crypto';
import {build} from 'esbuild';
const here=path.dirname(fileURLToPath(import.meta.url)),root=path.resolve(here,'../..');
const sha=b=>createHash('sha256').update(b).digest('hex');
const pins=JSON.parse(await fs.readFile(path.join(here,'upstream-pins.json'),'utf8'));
for(const [file,expected]of Object.entries(pins.files_sha256))if(sha(await fs.readFile(path.join(here,'node_modules',file)))!==expected)throw new Error(`Upstream source changed: ${file}`);
const args=process.argv.slice(2);if(args.some(a=>!['--tests','--with-procedural'].includes(a)))throw new Error('Usage: node recipes/procedural/build.mjs [--tests]');
const out=args.includes('--tests')?path.join(here,'build'):path.join(root,'dist/lab');
await fs.mkdir(out,{recursive:true});
const plugins=[{name:'explicit-geometry-and-synthesis-adapters',setup(b){
  b.onResolve({filter:/^@dgreenheck\/ez-tree$/},()=>({path:path.join(here,'node_modules/@dgreenheck/ez-tree/src/lib/tree.js')}));
  b.onResolve({filter:/^\.\/textures$/},a=>a.importer===path.join(here,'node_modules/@dgreenheck/ez-tree/src/lib/tree.js')?{path:path.join(here,'src/geometry-textures.mjs')}:null);
  b.onLoad({filter:/[/\\]zzfx[/\\]ZzFX\.js$/},async a=>{
    let s=await fs.readFile(a.path,'utf8');
    for(const [from,to]of [['audioContext: new AudioContext,','audioContext: null,'],['randomness*2*Math.random() - randomness','randomness*2*0.5 - randomness']]){
      if(s.split(from).length!==2)throw new Error('Upstream patch is no longer uniquely applicable.');s=s.replace(from,to);
    }
    return {contents:s,loader:'js',resolveDir:path.dirname(a.path)};
  });
}}];
await build({entryPoints:[path.join(here,'src/adapters.mjs')],outfile:path.join(out,'adapters.mjs'),bundle:true,format:'esm',platform:'browser',target:['es2022'],minify:true,legalComments:'eof',plugins,logLevel:'warning'});
for(const n of ['core.mjs','worker.mjs','app.mjs','render.mjs','index.html','style.css'])await fs.copyFile(path.join(here,'src',n),path.join(out,n));
const lockBytes=await fs.readFile(path.join(here,'package-lock.json')),lock=JSON.parse(lockBytes),pkg=JSON.parse(await fs.readFile(path.join(here,'package.json'),'utf8'));
const info={schema_version:1,adapter_version:'1.0.0',lock_sha256:sha(lockBytes),bundle_sha256:sha(await fs.readFile(path.join(out,'adapters.mjs'))),dependencies:pkg.dependencies,adaptations:pins.adaptations,assets_bytes:(await fs.stat(path.join(out,'adapters.mjs'))).size};
await fs.writeFile(path.join(out,'build-info.json'),JSON.stringify(info,null,2)+'\n');
let notices='# Procedural browser lab: third-party notices\n\n'+pins.adaptations.join('\n\n')+'\n';
for(const key of Object.keys(lock.packages).filter(k=>k.startsWith('node_modules/')&&!k.startsWith('node_modules/@esbuild/')&&!k.endsWith('/esbuild'))){
  const dir=path.join(here,key);const ls=await fs.readdir(dir);const name=ls.find(n=>/^licen[sc]e(?:\..*)?$/i.test(n));
  if(!name)throw new Error(`No licence file found for ${key}`);
  notices+=`\n\n## ${key.replace('node_modules/','')} ${lock.packages[key].version}\n\n`+await fs.readFile(path.join(dir,name),'utf8');
}
await fs.writeFile(path.join(out,'THIRD-PARTY.txt'),notices);
console.log(`Built procedural lab: ${info.assets_bytes} bundle bytes. No model download, image textures or audio playback.`);
