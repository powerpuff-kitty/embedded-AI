import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import { LOCALES, LOCALE_NAMES, t, detectLocale, isRTL, loadLocale, initI18n } from '../site/i18n.mjs';

const read = async (url: string) => {
  const name = String(url).replace('./locales/', '');
  return { ok: true, json: async () => JSON.parse(await fs.readFile(`site/locales/${name}`, 'utf8')) };
};
const stubRoot = { querySelectorAll: () => [] } as any;
const SECTIONS = ['ui', 'domain', 'kind', 'usage'];

test('every locale has the full English key set in every section', async () => {
  const en = JSON.parse(await fs.readFile('site/locales/en.json', 'utf8'));
  for (const locale of LOCALES) {
    const data = JSON.parse(await fs.readFile(`site/locales/${locale}.json`, 'utf8'));
    for (const section of SECTIONS) {
      assert.deepEqual(Object.keys(data[section]).sort(), Object.keys(en[section]).sort(), `${locale}.${section}`);
      for (const value of Object.values(data[section])) assert.equal(typeof value, 'string', `${locale}.${section}`);
    }
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

test('t resolves nested keys, interpolates, switches locale and falls back', async () => {
  await initI18n({ root: stubRoot, fetchImpl: read });
  assert.equal(t('ui.countComponents', { n: 7 }), '7 matching components');
  assert.equal(t('domain.vision'), 'Vision');
  assert.equal(t('kind.model'), 'model');
  await loadLocale('de', read);
  assert.match(t('ui.needTitle'), /Bedarf/);
  assert.equal(t('ui.compare', { n: 2 }), 'Vergleichen (2/4)');
  assert.equal(t('domain.vision'), 'Vision');
  assert.equal(t('ui.thisKeyDoesNotExist'), 'ui.thisKeyDoesNotExist');
});
