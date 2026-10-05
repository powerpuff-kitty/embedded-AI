import test from 'node:test';
import assert from 'node:assert/strict';
import { partition,budgetEvidence,safeURL } from '../site/catalogue.mjs';
import { parseSkeleton, syntheticSkeleton } from '../site/skeleton.mjs';
const e={id:'test',name:'Test',domain:'audio',kind:'model',tasks:['vad'],model:{file_size_mb:1},deployment:{offline:true},license:{weights:'MIT'}};
const r={entry_id:'test',hardware:{id:'host-a'},process_peak_rss_mb:80};
test('tiny file does not establish hardware memory fit',()=>{
 assert.equal(partition([e],{target:'rv1106',ram:'256'}).matching.length,0);
 assert.equal(partition([e],{target:'rv1106',ram:'256',candidates:true}).candidates.length,1);
});
test('observed memory filters retain hardware identity and conservative maximum',()=>{
 assert.equal(partition([e],{target:'host-a',ram:'90'},[r]).matching.length,1);
 assert.equal(partition([e],{target:'host-a',ram:'60',candidates:true},[r]).matching.length,0);
 assert.equal(budgetEvidence(e,{target:'host-b'},[r]).status,'unknown');
 assert.equal(budgetEvidence(e,{target:'host-a',ram:90},[r,{...r,process_peak_rss_mb:100}]).status,'over-budget');
});
test('pretrained and offline filters do not guess missing metadata',()=>{
 assert.equal(partition([e],{usage:'pretrained'}).matching.length,0);
 assert.equal(partition([e],{offline:true}).matching.length,1);
 assert.equal(partition([{...e,deployment:{}}],{offline:true}).matching.length,0);
});
test('external links reject executable or credentialed URLs',()=>{
 assert.equal(safeURL('javascript:alert(1)'),null);assert.equal(safeURL('https://u:p@example.com'),null);
 assert.equal(safeURL('https://example.org/model'),'https://example.org/model');
});
test('synthetic skeleton fixture is replayable but is not model evidence',()=>{
 const data=parseSkeleton(syntheticSkeleton());
 assert.equal(data.frames.length,60);assert.equal(data.meta.not_model_output,true);
 assert.throws(()=>parseSkeleton('{"type":"metadata"}\n{}'),/metadata/);
});
test('skeleton reader rejects malformed joints and reversed time',()=>{
 const rows=syntheticSkeleton().trim().split('\n').map(JSON.parse);rows[2].time_seconds=-1;
 assert.throws(()=>parseSkeleton(rows.map(JSON.stringify).join('\n')),/unordered/);
 rows[2].time_seconds=1;rows[1].people[0].joints[0]=['x',2];
 assert.throws(()=>parseSkeleton(rows.map(JSON.stringify).join('\n')),/keypoint/i);
});
