import fs from 'node:fs/promises';
import { loadEntries } from './catalog.ts';
if(process.argv.slice(2).some(x=>x!=='--check'))throw new Error('Usage: npm run reviews:check');
const batch=JSON.parse(await fs.readFile('reviews/priority-v02.json','utf8'));
const entries=await loadEntries();
if(batch.entry_ids.length!==15 || new Set(batch.entry_ids).size!==15)throw new Error('Expected 15 unique priority entries');
for(const id of batch.entry_ids){
 const e=entries.find(e=>e.id===id);
 if(!e||!e.review?.variant||!e.review?.artifact_reference||e.review?.level!=='documentation')throw new Error(`Missing source review: ${id}`);
 if(!e.data?.inputs.length||!e.evaluation?.length||!e.limitations?.length)throw new Error(`Incomplete usage contract: ${id}`);
 if(e.requirements.ram_mb.measured_peak!==null)throw new Error(`Keep device-dependent RAM in benchmark records, not an unscoped review: ${id}`);
}
console.log('15 priority documentation reviews checked; artifact integrity and hardware execution remain separate.');
