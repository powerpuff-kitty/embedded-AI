import fs from "node:fs/promises"; import fg from "fast-glob"; import YAML from "yaml"; import Ajv from "ajv";
const schema=JSON.parse(await fs.readFile("schema/model.schema.json","utf8")); const check=new Ajv({allErrors:true,strict:false}).compile(schema);
const paths=await fg("catalog/**/*.yaml",{ignore:["catalog/_template.yaml"]}); let bad=false;
for(const p of paths){const d=YAML.parse(await fs.readFile(p,"utf8")); if(!check(d)){bad=true; console.error(p,check.errors);}}
if(bad) process.exit(1); console.log(`Validated ${paths.length} manifests`);