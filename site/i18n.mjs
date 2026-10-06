/**
 * Minimal dependency-free i18n for the static explorer.
 * UI chrome is translated; catalogue data (names, tasks) stays in its source language.
 * Untranslated keys fall back to English so partial locales never break the UI.
 */
export const LOCALES = ['en', 'es', 'fr', 'de', 'pt', 'it', 'ru', 'zh-Hans', 'ja', 'ko', 'ar', 'hi'];
export const LOCALE_NAMES = {
  en: 'English', es: 'Español', fr: 'Français', de: 'Deutsch', pt: 'Português', it: 'Italiano',
  ru: 'Русский', 'zh-Hans': '简体中文', ja: '日本語', ko: '한국어', ar: 'العربية', hi: 'हिन्दी'
};
const RTL = new Set(['ar', 'he', 'fa', 'ur']);
let messages = {};
let fallback = {};
let current = 'en';

export const getLocale = () => current;
export const isRTL = (locale = current) => RTL.has(locale);

export function detectLocale(storage = globalThis.localStorage, languages = globalThis.navigator?.languages) {
  const param = new URLSearchParams(globalThis.location?.search ?? '').get('lang');
  if (param && LOCALES.includes(param)) return param;
  const saved = storage?.getItem?.('locale');
  if (saved && LOCALES.includes(saved)) return saved;
  for (const tag of languages ?? [globalThis.navigator?.language]) {
    if (!tag) continue;
    if (LOCALES.includes(tag)) return tag;
    const base = tag.split('-')[0];
    if (LOCALES.includes(base)) return base;
    const scripted = LOCALES.find(candidate => candidate.toLowerCase().startsWith(base));
    if (scripted) return scripted;
  }
  return 'en';
}

export async function loadLocale(locale, fetchImpl = globalThis.fetch) {
  const response = await fetchImpl(`./locales/${locale}.json`);
  if (!response.ok) throw new Error(`Locale ${locale} unavailable (HTTP ${response.status})`);
  messages = await response.json();
  current = locale;
  return messages;
}

export async function initI18n({ root = document, fetchImpl = globalThis.fetch } = {}) {
  fallback = await (await fetchImpl('./locales/en.json')).json();
  const locale = detectLocale();
  try { await loadLocale(locale, fetchImpl); } catch { messages = fallback; current = 'en'; }
  applyStatic(root);
  return current;
}

export function t(key, params = {}) {
  const lookup = (source) => key.split('.').reduce((acc, part) => (acc && typeof acc === 'object' ? acc[part] : undefined), source);
  const template = lookup(messages) ?? lookup(fallback) ?? key;
  return String(template).replace(/\{(\w+)\}/g, (match, name) => (name in params ? params[name] : match));
}

export function applyStatic(root = document, doc = globalThis.document) {
  root.querySelectorAll('[data-i18n]').forEach(element => { element.textContent = t(element.dataset.i18n); });
  root.querySelectorAll('[data-i18n-placeholder]').forEach(element => { element.placeholder = t(element.dataset.i18nPlaceholder); });
  root.querySelectorAll('[data-i18n-title]').forEach(element => { element.title = t(element.dataset.i18nTitle); });
  if (doc?.documentElement) { doc.documentElement.lang = current; doc.documentElement.dir = isRTL(current) ? 'rtl' : 'ltr'; }
}
