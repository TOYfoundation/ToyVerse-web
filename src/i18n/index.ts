// Languages and texts of the website.
// sprachen.tsv and begriffe.tsv are copied from Safehaigit/toycoin (i18n/) by
// tools/sync-toycoin.mjs, so the website uses the same 45 languages and terms
// as wallet, TOYPAY and ToyScan (decision 103 of the Toy projects).
import sprachenTsv from './sprachen.tsv?raw';

export interface Language {
  code: string;
  /** native name, e.g. "Deutsch" */
  name: string;
  dir: 'ltr' | 'rtl';
  script: string;
}

export const LANGUAGES: Language[] = sprachenTsv
  .split('\n')
  .filter((l) => l.trim())
  .slice(1)
  .map((l) => {
    const [code = '', name = '', dir = 'ltr', script = ''] = l.split('|');
    return { code, name, dir: dir === 'rtl' ? 'rtl' : 'ltr', script };
  });

type Messages = Record<string, unknown>;
const files = import.meta.glob<{ default: Messages }>('./locales/*.json', { eager: true });
const MESSAGES: Record<string, Messages> = {};
for (const [path, mod] of Object.entries(files)) {
  const code = path.replace(/^.*\/(.+)\.json$/, '$1');
  MESSAGES[code] = mod.default;
}

/** German is the source language, English the fallback for missing texts. */
export const SOURCE = 'de';
export const FALLBACK = 'en';

/**
 * Pages are only built for languages that have a translation file.
 * The other languages of the 45 are listed as "coming", so no URL
 * serves English text under a foreign language code.
 */
export const AVAILABLE: Language[] = LANGUAGES.filter((l) => MESSAGES[l.code]);

export function language(code: string): Language {
  const l = LANGUAGES.find((x) => x.code === code);
  if (!l) throw new Error(`Unknown language: ${code}`);
  return l;
}

function lookup(m: Messages | undefined, key: string): unknown {
  let cur: unknown = m;
  for (const part of key.split('.')) {
    if (cur && typeof cur === 'object' && part in (cur as Record<string, unknown>)) {
      cur = (cur as Record<string, unknown>)[part];
    } else {
      return undefined;
    }
  }
  return cur;
}

/** Raw value (string, array or object) for a key, with fallback. Throws if missing everywhere. */
export function tv<T = unknown>(lang: string, key: string): T {
  for (const code of [lang, FALLBACK, SOURCE]) {
    const v = lookup(MESSAGES[code], key);
    if (v !== undefined) return v as T;
  }
  throw new Error(`Missing text: ${key}`);
}

/** Text for a key with {name} placeholders. */
export function t(lang: string, key: string, vars: Record<string, string | number> = {}): string {
  const v = tv<unknown>(lang, key);
  if (typeof v !== 'string') throw new Error(`Text ${key} is not a string`);
  return v.replace(/\{(\w+)\}/g, (_, k: string) => (k in vars ? String(vars[k]) : `{${k}}`));
}

/** Locale for number formatting (Intl), e.g. "de-DE". */
export function intlLocale(lang: string): string {
  return lang === 'wuu' ? 'zh-CN' : lang;
}
