import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { createHash } from 'node:crypto';
import { build } from 'esbuild';
const here = path.dirname(fileURLToPath(import.meta.url));
const out = path.resolve(here, '../../dist/procedural');
const sha = data => createHash('sha256').update(data).digest('hex');
const pkg = JSON.parse(await fs.readFile(path.join(here, 'package.json'), 'utf8'));
const lockBytes = await fs.readFile(path.join(here, 'package-lock.json'));
const lock = JSON.parse(lockBytes);
for (const [name, version] of Object.entries(pkg.dependencies)) {
  const installed = JSON.parse(await fs.readFile(path.join(here, 'node_modules', name, 'package.json'), 'utf8'));
  if (installed.version !== version || lock.packages[`node_modules/${name}`].version !== version) throw new Error(`Dependency pin mismatch: ${name}`);
}
await fs.mkdir(out, { recursive: true });
const inspected = {};
await build({ entryPoints: [path.join(here, 'runtime.mjs')], outfile: path.join(out, 'runtime.bundle.mjs'),
  bundle: true, format: 'esm', platform: 'browser', target: 'es2022', minify: true, legalComments: 'eof', metafile: true,
  plugins: [{ name: 'documented-geometry-and-sample-only-adaptations', setup(b) {
    // Do not import EZ-Tree's image textures or start an AudioContext on module import.
    b.onResolve({ filter: /^\.\/textures$/ }, args => args.importer.includes('/ez-tree/') ? { path: 'textureless', namespace: 'lab' } : undefined);
    b.onLoad({ filter: /.*/, namespace: 'lab' }, () => ({ contents: 'export const getBarkTexture=()=>null; export const getLeafTexture=()=>null;', loader: 'js' }));
    b.onLoad({ filter: /[/\\]zzfx[/\\]ZzFX\.js$/ }, async args => {
      const source = await fs.readFile(args.path, 'utf8');
      const match = 'audioContext: new AudioContext,';
      if (source.split(match).length !== 2) throw new Error('ZzFX import-side-effect guard changed; inspect upstream.');
      inspected.zzfx_source_sha256 = sha(source);
      return { contents: source.replace(match, 'audioContext: null,'), loader: 'js' };
    });
  }}] });
for (const name of ['index.html','lab.css','app.mjs','contracts.mjs','worker.mjs']) await fs.copyFile(path.join(here,name),path.join(out,name));
const licenceFiles = [['simplex-noise','LICENSE'],['roughjs','LICENSE'],['@dgreenheck/ez-tree','LICENSE'],['three','LICENSE'],...['hachure-fill','path-data-parser','points-on-curve','points-on-path'].map(n=>[n,'LICENSE'])];
const notices = ['# Procedural lab third-party notices\n\nThese are code licences, not a licence grant for arbitrary input assets.'];
for (const [name, file] of licenceFiles) notices.push(`\n## ${name}\n\n${await fs.readFile(path.join(here,'node_modules',name,file),'utf8')}`);
const zz = await fs.readFile(path.join(here,'node_modules/zzfx/ZzFX.js'),'utf8');
notices.push('\n## zzfx\n\n' + zz.slice(zz.indexOf('ZzFX MIT License'), zz.indexOf("'use strict'")));
await fs.writeFile(path.join(out,'THIRD-PARTY-NOTICES.txt'),notices.join('\n'));
const bundle = await fs.readFile(path.join(out,'runtime.bundle.mjs'));
const fixtureSha = sha((await Promise.all(['runtime.mjs','contracts.mjs','worker.mjs'].map(n => fs.readFile(path.join(here,n),'utf8')))).join('\n'));
const bundler = JSON.parse(await fs.readFile(path.resolve(here,'../../node_modules/esbuild/package.json'),'utf8')).version;
const inputs = {};
// Hash the installed source tree consumed by the fixture so source changes cannot masquerade as the same pin.
async function visit(dir, prefix) { for (const entry of await fs.readdir(dir,{withFileTypes:true})) {
  if (entry.isDirectory()) await visit(path.join(dir,entry.name),`${prefix}/${entry.name}`);
  else if(entry.isFile()) inputs[`${prefix}/${entry.name}`] = sha(await fs.readFile(path.join(dir,entry.name)));
}}
for (const name of Object.keys(pkg.dependencies)) await visit(path.join(here,'node_modules',name),name);
await fs.writeFile(path.join(out,'build.json'), JSON.stringify({schema_version:1,fixture_sha256:fixtureSha,bundler_version:bundler,dependencies:pkg.dependencies,lock_sha256:sha(lockBytes),
  bundle_sha256:sha(bundle),bundle_bytes:bundle.length,source_tree_sha256:sha(JSON.stringify(Object.entries(inputs).sort())),...inspected,
  adaptations:['EZ-Tree texture module replaced by null texture getters; generation only, no image assets or textured renderer.',
    'ZzFX eager AudioContext removed; original sample builder retained. Playback owned by the host after explicit click.'],
  source:'recipes/procedural/',renderer:'Canvas 2D projection of actual generated 3D triangle meshes; no GPU benchmark.'},null,2)+'\n');
console.log(`Built four optional local procedural adapters (${bundle.length} bundle bytes). No network calls or models at runtime.`);
