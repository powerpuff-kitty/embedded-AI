import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import { LOCALES, LOCALE_NAMES, t, detectLocale, isRTL, loadLocale, initI18n } from '../site/i18n.mjs';

const read = async (url: string) => {
  const name = String(url).replace('./locales/', '');
  return { ok: true, json: async () => JSON.parse(await fs.readFile(`site/locales/${name}`, 'utf8')) };
};
const stubRoot = { querySelectorAll: () => [] } as any;

test('every locale has exactly the English key set and only string values', async () => {
  const en = JSON.parse(await fs.readFile('site/locales/en.json', 'utf8'));
  for (const locale of LOCALES) {
    const data = JSON.parse(await fs.readFile(`site/locales/${locale}.json`, 'utf8'));
    assert.deepEqual(Object.keys(data).sort(), Object.keys(en).sort(), `${locale} keys differ`);
    for (const [key, value] of Object.entries(data)) assert.equal(typeof value, 'string', `${locale}.${key}`);
  }
});

test('locale names and RTL flags are complete', () => {
  assert.equal(Object.keys(LOCALE_NAMES).length, LOCALES.length);
  assert.equal(isRTL('ar'), true);
  assert.equal(isRTL('en'), false);
});

test('detectLocale honours storage and navigator, with base-language fallback', () => {
  assert.equal(detectLocale({ getItem: () => 'ja' } as any, ['en']), 'ja');
  assert.equal(detectLocale({ getItem: () => null } as any, ['de-DE', 'en']), 'de');
  assert.equal(detectLocale({ getItem: () => null } as any, ['zh-Hant']), 'zh-Hans');
  assert.equal(detectLocale({ getItem: () => null } as any, ['xx-YY']), 'en');
});

test('t interpolates params, switches locale and falls back to English', async () => {
  await initI18n({ root: stubRoot, fetchImpl: read });
  assert.equal(t('countComponents', { n: 7 }), '7 matching components');
  await loadLocale('de', read);
  assert.match(t('needTitle'), /Bedarf/);
  assert.equal(t('compare', { n: 2 }), 'Vergleichen (2/4)');
  assert.equal(t('thisKeyDoesNotExist'), 'thisKeyDoesNotExist');
});
