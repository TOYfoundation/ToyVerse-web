#!/usr/bin/env node
// Checks the website against the shared ToyVerse values (src/data/toyverse.json,
// copied from TOYfoundation/toycoin shared/toyverse.json by `npm run sync:toycoin`).
// Texts that repeat protocol values (chain IDs, decimals) must match in every language.
import { readFileSync, readdirSync } from 'node:fs';
import { join, dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const m = JSON.parse(readFileSync(join(root, 'src', 'data', 'toyverse.json'), 'utf8'));
const errors = [];
if (m.schema !== 'toyverse/1') errors.push(`toyverse.json: unknown schema ${m.schema}`);
if (m.toy?.decimals !== 18 || m.toy?.maxSupplyUnits !== '100000000000000000000000000') errors.push('toyverse.json: decimals or supply cap changed');
if (m.i18n?.languages !== 45) errors.push('toyverse.json: expected 45 languages');
if (!m.legacyTokens?.every((t) => t.isToyChainToy === false && /^0x[0-9a-fA-F]{40}$/.test(t.address))) errors.push('toyverse.json: bad legacy token list');

const dir = join(root, 'src', 'i18n', 'locales');
const testnet = String(m.chainIds.testnet);
const mainnet = String(m.chainIds.mainnet);
for (const f of readdirSync(dir).filter((x) => x.endsWith('.json'))) {
  const p = JSON.parse(readFileSync(join(dir, f), 'utf8')).pages;
  if (p.wallet.facts[1][1] !== testnet) errors.push(`${f}: pages.wallet.facts[1] must be the testnet chain ID ${testnet}`);
  if (!p.wallet.facts[2][1].includes(String(m.toy.decimals))) errors.push(`${f}: pages.wallet.facts[2] must name ${m.toy.decimals} decimals`);
  const tech = p.toycoin.rows[5][1];
  if (!tech.includes(testnet) || !tech.includes(mainnet)) errors.push(`${f}: pages.toycoin.rows[5] must name chain IDs ${testnet} and ${mainnet}`);
}
if (errors.length) {
  console.error(errors.join('\n'));
  process.exit(1);
}
console.log(`toyverse.json ok: chain IDs ${mainnet}/${testnet}, ${m.toy.decimals} decimals, ${m.legacyTokens.length} legacy tokens, texts in line.`);
