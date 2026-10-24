#!/usr/bin/env node
// Checks every internal link and asset in the built site (dist/). Exit code 1 on broken links.
import { readFileSync, readdirSync, statSync, existsSync } from 'node:fs';
import { join, dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const dist = resolve(dirname(fileURLToPath(import.meta.url)), '..', 'dist');
const base = (process.env.BASE_PATH || '/').replace(/\/?$/, '/');
const files = [];
(function walk(d) {
  for (const f of readdirSync(d)) {
    const p = join(d, f);
    if (statSync(p).isDirectory()) walk(p);
    else if (p.endsWith('.html')) files.push(p);
  }
})(dist);

const broken = [];
for (const file of files) {
  const html = readFileSync(file, 'utf8');
  for (const [, url] of html.matchAll(/(?:href|src)="([^"#?]+)[^"]*"/g)) {
    if (/^(https?:|mailto:|data:)/.test(url) || !url.startsWith('/')) continue;
    if (!url.startsWith(base)) {
      broken.push(`${file.slice(dist.length)}: ${url} (outside base ${base})`);
      continue;
    }
    const rel = url.slice(base.length);
    const target = join(dist, rel);
    const ok = url.endsWith('/') ? existsSync(join(target, 'index.html')) : existsSync(target);
    if (!ok) broken.push(`${file.slice(dist.length)}: ${url}`);
  }
}
if (broken.length) {
  console.error(`Broken links:\n${[...new Set(broken)].join('\n')}`);
  process.exit(1);
}
console.log(`Links ok: ${files.length} pages checked.`);
