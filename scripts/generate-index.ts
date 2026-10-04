import fs from "node:fs/promises";
import fg from "fast-glob";
import YAML from "yaml";

const paths=await fg("catalog/**/*.yaml",{ignore:["catalog/_template.yaml"]});
const models=[];
for(const path of paths){
  const m=YAML.parse(await fs.readFile(path,"utf8"));
  models.push({...m,path});
}
models.sort((a,b)=>a.domain.localeCompare(b.domain)||a.tasks[0].localeCompare(b.tasks[0])||a.name.localeCompare(b.name));

await fs.mkdir("generated",{recursive:true});
const rows=models.map(m=>({id:m.id,name:m.name,domain:m.domain,tasks:m.tasks,class:m.class,parameters:m.model?.parameters??null,file_size_mb:m.model?.file_size_mb??null,path:m.path}));
await fs.writeFile("generated/catalog.json",JSON.stringify(rows,null,2)+"\n");

const fmtParams=(n)=>n==null?"—":n>=1e9?`${(n/1e9).toFixed(1).replace(/\.0$/,"")}B`:n>=1e6?`${(n/1e6).toFixed(1).replace(/\.0$/,"")}M`:n>=1e3?`${(n/1e3).toFixed(0)}K`:`${n}`;
const fmtSize=(n)=>n==null?"—":n<1?`${Math.round(n*1000)} KB`:`${n} MB`;
const license=m=>m.license?.weights&&m.license.weights!=="unknown"?m.license.weights:(m.license?.code??"unknown");
const status=m=>{
  const s=(m.compatibility??[]).map(x=>x.status);
  if(s.includes("reproduced")) return "reproduced";
  if(s.includes("reported")) return "reported";
  if(s.includes("theoretical")) return "theoretical";
  if(s.includes("unsupported")) return "unsupported";
  return "unknown";
};
const upstream=m=>m.links?.model||m.links?.repository||m.links?.homepage||m.links?.paper;
const esc=s=>String(s??"—").replaceAll("|","\\|");
const target=m=>(m.deployment?.targets??[]).join(", ")||"—";
const runtime=m=>(m.formats??[]).join(", ")||"—";
const modelCell=m=>upstream(m)?`[${esc(m.name)}](${upstream(m)})`:esc(m.name);

const domains=[...new Set(models.map(m=>m.domain))];
let catalog="## 📚 Full Catalogue\n\n";
catalog+=`**${models.length} entries**. This section is generated from \`catalog/**/*.yaml\`; edit manifests rather than this table. Unknown values are intentionally shown as **—**.\n\n`;
catalog+="**Status:** `reproduced` = benchmarked by this project · `reported` = upstream/community evidence · `theoretical` = plausible but unverified · `unknown` = not established.\n\n";
for(const domain of domains){
  catalog+=`### ${domain[0].toUpperCase()+domain.slice(1)}\n\n`;
  catalog+="| Model | Task | Params | Size | Format/runtime | Target | License | Status | Manifest |\n";
  catalog+="|---|---|---:|---:|---|---|---|---|---|\n";
  for(const m of models.filter(x=>x.domain===domain)){
    catalog+=`| ${modelCell(m)} | ${esc(m.tasks.join(", "))} | ${fmtParams(m.model?.parameters)} | ${fmtSize(m.model?.file_size_mb)} | ${esc(runtime(m))} | ${esc(target(m))} | ${esc(license(m))} | ${status(m)} | [YAML](${m.path}) |\n`;
  }
  catalog+="\n";
}

const start="<!-- CATALOG:START -->";
const end="<!-- CATALOG:END -->";
let readme=await fs.readFile("README.md","utf8");
const block=`${start}\n\n${catalog}${end}`;
if(readme.includes(start)&&readme.includes(end)){
  readme=readme.replace(new RegExp(`${start}[\\s\\S]*?${end}`),block);
}else{
  const marker="## Hardware questions this repo should answer";
  readme=readme.includes(marker)?readme.replace(marker,`${block}\n\n${marker}`):readme+"\n\n"+block+"\n";
}
await fs.writeFile("README.md",readme);
console.log(`Generated JSON index and README catalogue for ${models.length} models.`);
