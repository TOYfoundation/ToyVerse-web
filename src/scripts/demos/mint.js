// Mint machine (ported from the draft). Numbers follow the specification:
// first epoch 50,500 TOY over 1,440 blocks, about 35.07 TOY per block,
// split 50 % consensus, 40 % work lottery, 10 % refund pool.
import { setup, fill, num, mkn } from '../util.js';

const $ = (id) => document.getElementById(id);
const PER_BLOCK = 50500 / 1440;

export function init() {
  const el = $('mint');
  if (!el) return;
  const { T, lang } = setup(el);
  const s = $('mm');
  let devices = [];
  let pool = 0;
  let time = 0;
  let blocks = 0;
  let parts = 0;
  const W = { H: 3, P: 6, C: 12 };
  const PERIOD = { H: 2200, P: 1300, C: 700 };
  const COLOR = { H: '#3fd0c4', P: '#f2b632', C: '#e0883a' };
  const log = (x) => ($('ml').textContent = x);
  const toy = (b) => num(lang, b * PER_BLOCK, 2);
  function up() {
    const h = pool * 0.7;
    const first = Math.max(1, blocks - 8);
    $('hl').setAttribute('y', 130 - h);
    $('hl').setAttribute('height', h);
    $('kb').textContent = blocks;
    $('km2').textContent = toy(blocks);
    $('kd').textContent = devices.length;
    $('dv').innerHTML = devices
      .map((q, i) => `<rect x="${4 + i * 18}" y="116" width="14" height="22" rx="3" fill="${COLOR[q.k]}"/><text x="${11 + i * 18}" y="131" text-anchor="middle" font-size="9" fill="#111">${q.k}</text>`)
      .join('');
    let x = '';
    for (let j = first; j <= blocks; j++) {
      x += `<rect x="${(j - first) * 22}" y="0" width="18" height="18" rx="3" fill="var(--sf)" stroke="var(--acc)" stroke-width="2"/><text x="${(j - first) * 22 + 9}" y="13" text-anchor="middle" font-size="9" fill="var(--ink)">${j}</text>`;
    }
    $('cr2').innerHTML = x;
  }
  function token(w, c) {
    const e = mkn('rect', { x: 24, y: 141, width: 8, height: 8, rx: 2, fill: c, class: 'tkz' }, s);
    parts++;
    setTimeout(() => {
      e.remove();
      pool = Math.min(100, pool + w);
      up();
    }, 2200);
  }
  function block() {
    const n = parts;
    const press = $('ps');
    pool = 0;
    time = 0;
    parts = 0;
    blocks++;
    $('pp').setAttribute('opacity', '1');
    setTimeout(() => $('pp').setAttribute('opacity', '0'), 500);
    press.classList.remove('dn');
    void press.getBoundingClientRect();
    press.classList.add('dn');
    setTimeout(() => {
      $('mb2').setAttribute('opacity', '1');
      const c = mkn('circle', { cx: 341, cy: 156, r: 5, fill: '#f2b632', class: 'cd' }, s);
      setTimeout(() => {
        c.remove();
        $('tz').textContent = toy(blocks);
        $('mb2').setAttribute('opacity', '0');
      }, 800);
    }, 420);
    log(fill(T.block, { k: blocks, n, t: toy(1), a: num(lang, PER_BLOCK * 0.5, 2), b: num(lang, PER_BLOCK * 0.4, 2), c: num(lang, PER_BLOCK * 0.1, 2) }));
    up();
  }
  setInterval(() => {
    devices.forEach((d) => {
      d.c -= 200;
      if (d.c <= 0) {
        d.c = PERIOD[d.k] * (0.8 + Math.random() * 0.4);
        token(W[d.k], COLOR[d.k]);
      }
    });
    time += 200;
    if (pool >= 100 || (time >= 12000 && pool > 0)) block();
  }, 200);
  el.querySelectorAll('[data-k]').forEach((b) => {
    b.onclick = () => {
      if (devices.length >= 8) return log(T.full);
      devices.push({ k: b.dataset.k, c: 300 });
      log({ H: T.phone, P: T.pi, C: T.pc }[b.dataset.k]);
      up();
    };
  });
  $('sg').onclick = () => {
    token(8, 'var(--ink)');
    log(T.own);
  };
  $('sp2').onclick = () => {
    for (let i = 0; i < 12; i++) setTimeout(() => token(1, '#e03131'), i * 120);
    log(T.spamMsg);
  };
  $('rs').onclick = () => {
    devices = [];
    pool = 0;
    time = 0;
    blocks = 0;
    parts = 0;
    $('tz').textContent = '0';
    up();
    log(T.resetMsg);
  };
  up();
}
