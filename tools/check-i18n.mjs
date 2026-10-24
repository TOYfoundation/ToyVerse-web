#!/usr/bin/env node
// Checks that every translation has the same keys and array lengths as German
// (the source language) and that {placeholders} match. Exit code 1 on errors.
import { readFileSync, readdirSync } from 'node:fs';
import { join, dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const dir = resolve(dirname(fileURLToPath(import.meta.url)), '..', 'src', 'i18n', 'locales');
const load = (f) => JSON.parse(readFileSync(join(dir, f), 'utf8'));
const de = load('de.json');
const codes = readFileSync(join(dir, '..', 'sprachen.tsv'), 'utf8').split('\n').slice(1).filter(Boolean).map((l) => l.split('|')[0]);
const errors = [];
const vars = (s) => [...s.matchAll(/\{(\w+)\}/g)].map((m) => m[1]).sort().join(',');

function cmp(a, b, path, code) {
  if (typeof a === 'string') {
    if (typeof b !== 'string') return errors.push(`${code}: ${path} must be text`);
    if (vars(a) !== vars(b)) errors.push(`${code}: ${path} placeholders differ ({${vars(a)}} vs {${vars(b)}})`);
    if (!b.trim() && a.trim()) errors.push(`${code}: ${path} is empty`);
    return;
  }
  if (Array.isArray(a)) {
    if (!Array.isArray(b) || a.length !== b.length) return errors.push(`${code}: ${path} must be a list of ${a.length}`);
    a.forEach((x, i) => cmp(x, b[i], `${path}[${i}]`, code));
    return;
  }
  if (!b || typeof b !== 'object' || Array.isArray(b)) return errors.push(`${code}: ${path} must be an object`);
  for (const k of Object.keys(a)) {
    if (!(k in b)) errors.push(`${code}: ${path}.${k} missing`);
    else cmp(a[k], b[k], `${path}.${k}`, code);
  }
  for (const k of Object.keys(b)) if (!(k in a)) errors.push(`${code}: ${path}.${k} not in de.json`);
}

const files = readdirSync(dir).filter((f) => f.endsWith('.json'));
for (const f of files) {
  const code = f.replace(/\.json$/, '');
  if (!codes.includes(code)) errors.push(`${f}: language code not in sprachen.tsv`);
  if (code !== 'de') cmp(de, load(f), '', code);
}
if (codes.length !== 45) errors.push(`sprachen.tsv: expected 45 languages, found ${codes.length}`);
if (errors.length) {
  console.error(errors.join('\n'));
  process.exit(1);
}
console.log(`i18n ok: ${files.length} of ${codes.length} languages translated (${files.map((f) => f.slice(0, -5)).join(', ')}).`);
