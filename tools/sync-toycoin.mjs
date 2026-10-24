#!/usr/bin/env node
// Copies shared data from a checkout of Safehaigit/toycoin into the website:
//   i18n/sprachen.tsv, i18n/begriffe.tsv  -> src/i18n/
//   docs/STATUS.md (table "Überblick Meilensteine") -> src/data/status.json
// Usage: node tools/sync-toycoin.mjs [path-to-toycoin]   (default: ../toycoin)
import { readFileSync, writeFileSync, copyFileSync } from 'node:fs';
import { join, dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { execFileSync } from 'node:child_process';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const toycoin = resolve(process.argv[2] ?? join(root, '..', 'toycoin'));

for (const f of ['sprachen.tsv', 'begriffe.tsv']) copyFileSync(join(toycoin, 'i18n', f), join(root, 'src', 'i18n', f));

const langs = readFileSync(join(root, 'src', 'i18n', 'sprachen.tsv'), 'utf8').split('\n').filter((l) => l.trim()).length - 1;
if (langs !== 45) throw new Error(`Expected 45 languages, found ${langs}`);

// Same format ToyPost relies on: | M2 | Inhalt | ✅ fertig … |
const status = readFileSync(join(toycoin, 'docs', 'STATUS.md'), 'utf8');
const section = status.split('## Überblick Meilensteine')[1]?.split('\n## ')[0] ?? '';
const milestones = section
  .split('\n')
  .filter((l) => /^\|\s*M\d+\s*\|/.test(l))
  .map((l) => {
    const [, id, content, state] = l.split('|').map((c) => c.trim());
    return { id, content, done: /✅|fertig/.test(state ?? '') };
  });
if (milestones.length < 13) throw new Error(`Milestone table not found or incomplete (${milestones.length} rows)`);

let rev = 'unknown';
try {
  rev = execFileSync('git', ['-C', toycoin, 'rev-parse', '--short', 'HEAD']).toString().trim();
} catch {}
const date = status.match(/^Stand:\s*([0-9.]+)/m)?.[1] ?? '';
writeFileSync(
  join(root, 'src', 'data', 'status.json'),
  JSON.stringify({ source: `Safehaigit/toycoin docs/STATUS.md (commit ${rev})`, date, milestones }, null, 2) + '\n',
);
console.log(`Synced 45 languages, glossary and ${milestones.length} milestones (${milestones.filter((m) => m.done).length} done) from ${rev}.`);
