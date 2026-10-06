/**
 * Deterministic, explainable "match a need" ranking over catalogue entries.
 * No model weights, no network and no third-party runtime are used here.
 * Everything is derived from the committed metadata so results are reproducible
 * offline and can be unit-tested in Node.
 */

export const STOPWORDS = new Set([
  'a','an','the','to','for','of','on','in','with','and','or','my','i','me','we','you','want','need','would','like',
  'that','this','these','those','is','are','be','can','could','it','its','at','by','from','use','using','run','running',
  'some','any','how','do','does','make','build','without','no','not','very','best','good','get','give','find','show',
  'there','their','have','has','will','should','please','help','something','thing','things'
]);

const SYNONYMS = {
  person: ['people','human','humans','pedestrian','pedestrians','face','faces','crowd'],
  people: ['person','human','pedestrian','face','crowd'],
  car: ['vehicle','vehicles','automobile','driving'],
  vehicle: ['car','automobile'],
  detect: ['detection','detector','locate','localisation','localization','find','spot'],
  detection: ['detect','detector'],
  classify: ['classification','classifier','category','categorise','categorize'],
  classification: ['classify','classifier'],
  segment: ['segmentation','segmenter','mask','masking'],
  segmentation: ['segment','mask'],
  text: ['ocr','document','reading','read','recognise','recognize','caption'],
  ocr: ['text','document','reading','scan','scanned'],
  document: ['ocr','text','pdf','scan','scanned','layout','invoice','receipt','form'],
  speech: ['voice','audio','asr','transcription','transcribe','whisper'],
  voice: ['speech','audio','vad','speaker','dictation'],
  audio: ['sound','speech','voice','acoustic'],
  sound: ['audio','acoustic','noise'],
  noise: ['denoise','denoising','suppression','enhancement'],
  wake: ['wakeword','keyword','trigger','hotword'],
  keyword: ['wakeword','wake','hotword','command'],
  llm: ['language','generation','chat','generative','assistant'],
  language: ['text','nlp','llm'],
  embed: ['embedding','embeddings','similarity','retrieval','search','vector'],
  embedding: ['embed','similarity','retrieval'],
  anomaly: ['outlier','defect','fault','novelty','abnormal','intrusion','drift'],
  forecast: ['forecasting','prediction','predict','time-series','timeseries'],
  pose: ['keypoint','keypoints','skeleton','landmark','landmarks'],
  track: ['tracking','tracker','follow'],
  depth: ['distance','disparity','stereo','3d'],
  face: ['person','people','biometric','recognition'],
  gesture: ['hand','imu','motion'],
  vibration: ['bearing','motor','predictive-maintenance','accelerometer'],
  robot: ['robotics','manipulation','locomotion','actuator'],
  drone: ['uav','quadrotor','flight','aerial'],
  medical: ['healthcare','clinical','imaging','eeg','ecg','biosignal'],
  agriculture: ['crop','plant','weed','farm','agri'],
  geo: ['geospatial','satellite','earth-observation','remote-sensing'],
  satellite: ['geospatial','earth-observation','remote-sensing','aerial'],
  music: ['transcription','source-separation','midi'],
  game: ['gaming','agent','reinforcement','npc'],
  security: ['adversarial','robustness','malware','intrusion','threat'],
  mcu: ['microcontroller','tinyml','esp32','cortex-m','embedded','micro'],
  microcontroller: ['mcu','tinyml','esp32','embedded'],
  tinyml: ['mcu','microcontroller','embedded','tiny'],
  embedded: ['edge','mcu','on-device','tinyml'],
  edge: ['embedded','on-device','tinyml','mobile'],
  offline: ['local','on-device','privacy','air-gapped'],
  local: ['offline','on-device'],
  small: ['tiny','compact','lightweight','efficient','mobile','nano'],
  tiny: ['small','compact','lightweight','nano'],
  fast: ['efficient','low-latency','real-time','realtime','streaming'],
  realtime: ['real-time','low-latency','streaming'],
  camera: ['vision','image','video','rgb'],
  image: ['vision','picture','photo','rgb'],
  video: ['video','stream','frames'],
  recognise: ['recognition','classification'],
  recognize: ['recognition','classification'],
  recognition: ['recognise','recognize','classification'],
  identify: ['identification','recognition','classification'],
  translate: ['translation'],
  generate: ['generation','synthesis'],
  synthesis: ['generation','generative'],
  spiking: ['neuromorphic','snn','spike','spikes'],
  neuromorphic: ['spiking','snn','spike'],
  snn: ['spiking','neuromorphic'],
  spike: ['spiking','spikes','neuromorphic'],
  event: ['events','streaming','async'],
  genome: ['genomic','genomics','dna','sequencing'],
  genomic: ['genome','genomics','dna'],
  genomics: ['genome','genomic','dna'],
  dna: ['genome','genomic','sequencing','variant'],
  variant: ['variants','mutation','variant-calling'],
  sequencing: ['genome','dna','reads'],
  protein: ['proteins','proteomics','folding'],
  quantum: ['qubit','qml','variational'],
  qubit: ['quantum'],
  federated: ['federation','distributed','privacy-preserving'],
  privacy: ['private','federated','de-identification'],
  drug: ['molecule','molecular','pharma','drug-discovery'],
  molecule: ['molecular','chemistry','drug','cheminformatics'],
  molecular: ['molecule','chemistry','drug'],
  recommend: ['recommendation','recommender','ranking','personalisation'],
  recommendation: ['recommend','recommender','ranking'],
  recommender: ['recommend','recommendation','ranking'],
  fraud: ['fraud-detection','aml','anomaly','chargeback'],
  credit: ['fraud','transaction','card'],
  tryon: ['try-on','virtual-try-on','fashion'],
  fashion: ['clothing','garment','try-on','outfit'],
  clothing: ['fashion','garment','outfit'],
  garment: ['fashion','clothing','try-on'],
  outfit: ['fashion','clothing','try-on'],
  'try-on': ['fashion','garment','clothing'],
  clothes: ['fashion','garment','clothing','try-on'],
  sign: ['sign-language','gesture','gloss'],
  wildfire: ['fire','smoke','wildland'],
  fire: ['wildfire','smoke'],
  smoke: ['wildfire','fire'],
  flood: ['flooding','water','hydrology'],
  hydrology: ['streamflow','rainfall','catchment','river'],
  streamflow: ['hydrology','discharge','river'],
  forest: ['forestry','deforestation','trees','logging'],
  forestry: ['forest','deforestation','trees'],
  deforestation: ['forest','forestry','logging'],
  logging: ['deforestation','forest'],
  satellite: ['geospatial','earth-observation','remote-sensing','aerial'],
  remote: ['remote-sensing','satellite'],
  sports: ['athlete','biomechanics','motion-capture','pose'],
  athlete: ['sports','biomechanics'],
  astronomy: ['space','stars','galaxy','telescope'],
  space: ['astronomy','satellite','orbital'],
  exoplanet: ['astronomy','space','transit']
};

const FIELD_WEIGHTS = { name: 9, id: 7, task: 7, tag: 5, domain: 4, class: 4, description: 2, io: 2, training: 1 };

export function normalize(value) {
  return String(value ?? '').toLowerCase().replace(/[^a-z0-9+.#-]+/g, ' ').trim();
}

export function tokenize(query) {
  const base = normalize(query).split(/\s+/).filter(token => token && !STOPWORDS.has(token));
  const expanded = new Set();
  for (const token of base) {
    const stemmed = stem(token);
    for (const form of new Set([token, stemmed])) {
      expanded.add(form);
      for (const synonym of SYNONYMS[form] ?? []) expanded.add(synonym);
    }
  }
  return [...expanded];
}

/** Conservative suffix stripping so word-form variants match without hand-listing every form. */
export function stem(word) {
  if (word.length < 5) return word;
  for (const suffix of ['ing', 'ions', 'ion', 'ers', 'er', 'ed', 'ive', 'ly', 'ment', 'ness']) {
    if (word.endsWith(suffix) && word.length - suffix.length >= 4) return word.slice(0, -suffix.length);
  }
  if (word.endsWith('s') && word.length >= 5) return word.slice(0, -1);
  return word;
}

export function interpret(query) {
  const normalized = normalize(query);
  const tokens = tokenize(query);
  const has = (...words) => words.some(word => normalized.split(/\s+/).includes(word));
  return {
    tokens,
    wantsPretrained: has('ready','pretrained','pre-trained','out-of-the-box','notrain','untrained','existing') || /no train/.test(normalized),
    wantsTraining: has('train','training','fine-tune','finetune','adapt','custom','my','own') ,
    wantsOffline: has('offline','local','on-device','ondevice','air-gapped','airgapped','privacy','embedded','edge','privately'),
    wantsEdge: has('edge','embedded','mcu','microcontroller','tinyml','esp32','camera','mobile','wearable','robot'),
    wantsModel: has('model','network','detector','classifier','checkpoint','weights','net'),
    wantsTool: has('toolkit','library','framework','pipeline','sdk','train','training','convert','export')
  };
}

function fieldText(entry) {
  return {
    name: normalize(entry.name),
    id: normalize(entry.id),
    task: normalize((entry.tasks ?? []).join(' ')),
    tag: normalize((entry.tags ?? []).join(' ')),
    domain: normalize(entry.domain),
    class: normalize(entry.class),
    description: normalize(entry.description),
    io: normalize([...(entry.data?.inputs ?? []), ...(entry.data?.outputs ?? []), ...(entry.io?.inputs ?? []), ...(entry.io?.outputs ?? [])].join(' ')),
    training: normalize([entry.usage?.training, entry.usage?.needs_data].join(' '))
  };
}

export function scoreEntry(entry, intent) {
  const fields = fieldText(entry);
  let score = 0;
  const reasons = [];
  for (const token of intent.tokens) {
    let best = null;
    for (const [field, weight] of Object.entries(FIELD_WEIGHTS)) {
      if (fields[field].split(/[\s-]+/).includes(token)) {
        if (!best || weight > best.weight) best = { field, weight, token };
      } else if (fields[field].includes(token)) {
        const partial = Math.max(1, Math.round(weight / 3));
        if (!best || partial > best.weight) best = { field, weight: partial, token, partial: true };
      }
    }
    if (best) { score += best.weight; reasons.push(`${best.field}: ${best.token}${best.partial ? ' (partial)' : ''}`); }
  }
  const targets = entry.deployment?.targets ?? [];
  const usage = entry.usage?.mode ?? 'unknown';
  if (intent.wantsPretrained && usage === 'pretrained') { score += 5; reasons.push('pretrained weights'); }
  if (intent.wantsTraining && usage === 'requires-training') { score += 5; reasons.push('trainable'); }
  if (intent.wantsOffline && entry.deployment?.offline === true) { score += 3; reasons.push('offline documented'); }
  if (intent.wantsEdge && targets.some(t => ['edge','mobile','robot','browser'].includes(t))) { score += 2; reasons.push('edge/mobile target class'); }
  if (intent.wantsModel && ['model','collection'].includes(entry.kind)) { score += 3; reasons.push('is a model/collection'); }
  if (intent.wantsTool && ['toolkit','pipeline','primitive'].includes(entry.kind)) { score += 3; reasons.push('is a toolkit/pipeline'); }
  return { entry, score, reasons: [...new Set(reasons)] };
}

export function matchNeeds(entries, query, { limit = 40 } = {}) {
  const intent = interpret(query);
  if (!intent.tokens.length) return { intent, results: [] };
  const results = entries
    .map(entry => scoreEntry(entry, intent))
    .filter(({ score }) => score > 0)
    .sort((a, b) => b.score - a.score || a.entry.name.localeCompare(b.entry.name))
    .slice(0, limit);
  return { intent, results };
}

export function describeIntent(intent) {
  const notes = [];
  if (intent.wantsPretrained) notes.push('prefers pretrained weights');
  if (intent.wantsTraining) notes.push('expects training on your data');
  if (intent.wantsOffline) notes.push('prefers offline/on-device');
  if (intent.wantsEdge) notes.push('targets edge/mobile hardware');
  if (intent.wantsModel) notes.push('looking for a model');
  if (intent.wantsTool) notes.push('looking for a toolkit/pipeline');
  return notes;
}

/**
 * Apply explicit, user-chosen hard constraints to ranked matches. Returns the
 * kept results plus the excluded ones with a plain-language reason, so the UI
 * can explain why a plausible entry disappeared rather than hiding it silently.
 */
export function applyNeedConstraints(results, constraints = {}) {
  const kept = [], excluded = [];
  for (const result of results) {
    const entry = result.entry;
    const mode = entry.usage?.mode ?? 'unknown';
    if (constraints.offline && entry.deployment?.offline !== true) { excluded.push({ ...result, reason: 'offline operation is not documented', reasonKey: 'ui.reasonOffline' }); continue; }
    if (constraints.pretrained && mode !== 'pretrained') { excluded.push({ ...result, reason: `use mode is ${mode}, not pretrained`, reasonKey: 'ui.reasonNotPretrained', reasonParams: { mode } }); continue; }
    if (constraints.model && !['model', 'collection'].includes(entry.kind)) { excluded.push({ ...result, reason: `${entry.kind} is not a model or collection`, reasonKey: 'ui.reasonNotModel', reasonParams: { kind: entry.kind } }); continue; }
    if (constraints.permissiveWeights && ['unknown', 'not-provided', 'not-applicable'].includes(entry.license?.weights)) { excluded.push({ ...result, reason: `weights terms are ${entry.license?.weights}`, reasonKey: 'ui.reasonWeights', reasonParams: { terms: entry.license?.weights } }); continue; }
    kept.push(result);
  }
  return { kept, excluded };
}

export function upstreamOf(entry) {
  const links = entry.links ?? {};
  return links.model || links.repository || links.homepage || links.paper || '';
}

/** Markdown shortlist for the current selection, suitable for a chat or issue. */
export function shortlistMarkdown(entries) {
  const lines = ['# embedded-AI shortlist', ''];
  for (const entry of entries) {
    const upstream = upstreamOf(entry);
    lines.push(`- **${entry.name}** — ${entry.kind} / ${entry.usage?.mode ?? 'unknown'}`);
    lines.push(`  - tasks: ${(entry.tasks ?? []).join(', ') || 'unknown'}`);
    lines.push(`  - manifest: ${entry.path}`);
    if (upstream) lines.push(`  - upstream: ${upstream}`);
  }
  return lines.join('\n') + '\n';
}


