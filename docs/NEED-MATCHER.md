# Matching a need to a component

The explorer at `site/` (built to `dist/`) accepts a plain-language description of
what you want to do and ranks catalogue entries against it. It is **deterministic
and offline**: no model weights are bundled or fetched, no third-party runtime is
loaded, no network request is made, and the strict Content-Security-Policy is
unchanged.

## Using it

1. Open the explorer and type a need, for example
   `detect people on a camera offline with a tiny model` or
   `transcribe speech from a microphone` or `anomaly detection on a vibration sensor`.
2. Press **Find matching AI** (or Ctrl/Cmd+Enter). Results are ranked, and the
   **Why it matched** column lists the metadata fields that produced the score.
3. Optional hard constraints narrow the list: *only offline-documented*,
   *only pretrained weights*, *only models/collections*. Excluded matches are
   counted with the reason, so nothing disappears silently.
4. Select up to four entries to **Compare**, or **Copy shortlist** to place a
   Markdown list (name, tasks, manifest, upstream link) on your clipboard.
5. The query is shareable as `?need=...`.

The same ranking is available from the terminal:

```sh
npm run need -- "detect people offline with a tiny model"
npm run need -- "transcribe speech" --pretrained --json --limit 10
```

## How ranking works (`site/needs.mjs`)

- **Tokenize** the query, drop stopwords, apply light suffix stemming (so
  *detecting*/*detection* and *objects*/*object* map together), and expand
  synonyms (`people` → `person`, `human`, `face`, `crowd`; `speech` → `voice`,
  `asr`, `whisper`; `mcu` → `tinyml`, `esp32`, `embedded`).
- **Interpret intent**: pretrained vs train-on-your-data, offline/edge, and
  model vs toolkit.
- **Score** each entry across `name`, `id`, `tasks`, `tags`, `domain`, `class`,
  `description` and input/output fields, weighted per field, then add intent
  bonuses (for example `pretrained weights`, `offline documented`,
  `edge/mobile target class`).
- **Rank** by score and return the reasons, so a result can be audited rather
  than trusted blindly.

## Limitations

- Matching uses the **committed metadata only**. An entry that is genuinely
  relevant but poorly described will rank low. Improving the manifest is the fix.
- It is **not semantic search**. It will not understand arbitrary paraphrases
  outside the synonym table. A future opt-in embedding reranker would relax the
  CSP and fetch weights, which this repository deliberately does not do by default.
- A high rank is **not** a compatibility claim. Compatibility status stays
  `unknown` unless a matching benchmark record exists.

## Extending it

Add synonyms in `SYNONYMS` or adjust `FIELD_WEIGHTS` in `site/needs.mjs`. Pure
functions (`tokenize`, `interpret`, `matchNeeds`, `applyNeedConstraints`,
`shortlistMarkdown`) are covered by `tests/needs.test.ts`.
