#!/usr/bin/env node
// Builds a test version of the website that runs straight from the file
// system (double-click, no web server). Input is the normal build in dist/.
//
// What it changes compared to dist/:
// - Absolute paths ("/de/toycoin/") become relative paths ending in index.html,
//   because file:// has no directory index and no site root.
// - ES module scripts become deferred classic scripts (bundled with rolldown),
//   because browsers block module scripts loaded from file://.
// - Font URLs in CSS become relative.
//
// Usage: npm run build && node tools/make-offline.mjs [outDir]
import { createHash } from 'node:crypto';
import { cp, mkdir, mkdtemp, readdir, readFile, rm, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { rolldown } from 'rolldown';

const DIST = path.resolve('dist');
const OUT = path.resolve(process.argv[2] || 'offline/ToyVerse-Testversion');
const ASTRO = path.join(OUT, '_astro');

async function walk(dir) {
  const out = [];
  for (const e of await readdir(dir, { withFileTypes: true })) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) out.push(...(await walk(p)));
    else out.push(p);
  }
  return out;
}

// "/de/toycoin/#x" seen from file f -> "../toycoin/index.html#x"
function rel(fromFile, url) {
  const m = url.match(/^([^?#]*)(.*)$/);
  let p = m[1];
  if (p.endsWith('/')) p += 'index.html';
  const target = path.join(OUT, p);
  let r = path.relative(path.dirname(fromFile), target).split(path.sep).join('/');
  if (!r.startsWith('.')) r = './' + r;
  return r + m[2];
}

const bundled = new Map(); // key -> file name in _astro
async function bundle(key, entryFile) {
  if (bundled.has(key)) return bundled.get(key);
  const b = await rolldown({
    input: entryFile,
    logLevel: 'silent',
    plugins: [
      {
        name: 'site-root',
        resolveId(id) {
          if (id.startsWith('/_astro/')) return path.join(DIST, id);
          return null;
        },
      },
    ],
  });
  const { output } = await b.generate({ format: 'iife', minify: true });
  await b.close();
  const code = output[0].code;
  const name = `classic.${createHash('sha256').update(code).digest('hex').slice(0, 10)}.js`;
  await writeFile(path.join(ASTRO, name), code);
  bundled.set(key, name);
  return name;
}

await rm(OUT, { recursive: true, force: true });
await mkdir(path.dirname(OUT), { recursive: true });
await cp(DIST, OUT, { recursive: true });
const tmp = await mkdtemp(path.join(tmpdir(), 'toyverse-offline-'));
const files = await walk(OUT);

// CSS: font URLs relative to the CSS file (all in _astro/).
for (const f of files.filter((f) => f.endsWith('.css'))) {
  const css = await readFile(f, 'utf8');
  await writeFile(f, css.replace(/url\(\/_astro\//g, 'url(./'));
}

let pages = 0;
for (const f of files.filter((f) => f.endsWith('.html'))) {
  let html = await readFile(f, 'utf8');

  // External module scripts -> deferred classic bundle.
  for (const m of [...html.matchAll(/<script type="module" src="(\/_astro\/[^"]+)"><\/script>/g)]) {
    const name = await bundle(m[1], path.join(DIST, m[1]));
    html = html.replace(m[0], `<script defer src="/_astro/${name}"></script>`);
  }
  // Inline module scripts -> bundled file, deferred like a module would be.
  for (const m of [...html.matchAll(/<script type="module">([\s\S]*?)<\/script>/g)]) {
    const key = createHash('sha256').update(m[1]).digest('hex');
    const entry = path.join(tmp, `${key}.js`);
    await writeFile(entry, m[1]);
    const name = await bundle(key, entry);
    html = html.replace(m[0], `<script defer src="/_astro/${name}"></script>`);
  }
  html = html.replace(/<link rel="modulepreload"[^>]*>/g, '');

  // Absolute site paths in attributes, meta refresh and the language redirect.
  html = html.replace(/\b(href|src)="(\/[^"/][^"]*|\/)"/g, (_, a, u) => `${a}="${rel(f, u)}"`);
  html = html.replace(/url=(\/[^"]*)"/g, (_, u) => `url=${rel(f, u)}"`);
  html = html.replace(/"url":"(\/[^"]*)"/g, (_, u) => `"url":"${rel(f, u)}"`);
  await writeFile(f, html);
  pages++;
}

// Fail loudly if anything still points at the site root or uses modules.
const left = [];
for (const f of (await walk(OUT)).filter((f) => f.endsWith('.html'))) {
  const html = await readFile(f, 'utf8');
  if (/type="module"/.test(html)) left.push(`${f}: module script`);
  const abs = html.match(/\b(?:href|src)="\/[^"]*"/);
  if (abs) left.push(`${f}: ${abs[0]}`);
}
await rm(tmp, { recursive: true, force: true });
await rm(path.join(OUT, '404.html'), { force: true });

// Short German guide for testers (the site's source language).
const { execSync } = await import('node:child_process');
let commit = 'unbekannt';
try {
  commit = execSync('git rev-parse --short HEAD').toString().trim();
} catch {}
const langs = (await readdir(OUT, { withFileTypes: true })).filter((e) => e.isDirectory() && e.name !== '_astro').length;
const date = new Date().toLocaleDateString('de-DE', { timeZone: 'Europe/Berlin' });
await writeFile(
  path.join(OUT, 'LIES-MICH.txt'),
  [
    'ToyVerse-Webseite: Testversion',
    `Stand ${date}, Version ${commit}, ${langs} Sprachen, ${pages - 1} Seiten`,
    '',
    'So startest du sie:',
    '1. Die ZIP-Datei ganz entpacken (nicht nur hineinschauen).',
    '2. Im entpackten Ordner index.html doppelt anklicken.',
    '   Die Seite öffnet sich in der Sprache deines Browsers, sonst auf Deutsch.',
    '',
    'Gut zu wissen:',
    '- Alles läuft nur in deinem Browser. Es wird nichts gesendet, es gibt keine Cookies.',
    '- Am besten in Chrome, Edge oder Safari testen. In Firefox kann es sein, dass',
    '  statt der Webseiten-Schrift die Systemschrift erscheint.',
    '- Das ist ein Zwischenstand: Testnet, Downloads, Impressum und Kontaktadresse',
    '  sind noch Platzhalter. Alle Sprachen außer Deutsch sind KI-Übersetzungen.',
    '- Zahlen in den Simulationen sind Beispiele. Testnet-TOY haben keinen Wert.',
    '',
  ].join('\r\n'),
);
if (left.length) {
  console.error(left.slice(0, 10).join('\n'));
  process.exit(1);
}
console.log(`offline ok: ${pages} pages, ${bundled.size} script bundles -> ${path.relative(process.cwd(), OUT)}`);
