// Mint machine (ported from the draft). Numbers follow the specification:
// first epoch 50,500 TOY over 1,440 blocks, about 35.07 TOY per block,
// split 50 % consensus, 40 % work lottery, 10 % refund pool.
import { setup, fill, num, mkn } from '../util.js';

const $ = (id) => document.getElementById(id);
const PER_BLOCK = 50500 / 1440;

// Small device icons on the work bench (x, y is the top-left corner).
const ICON = {
  H: (x, y, c) =>
    `<g class="dvc"><rect x="${x}" y="${y}" width="12" height="22" rx="3" fill="#1b1f4a" stroke="${c}" stroke-width="1.5"/><rect x="${x + 2}" y="${y + 3}" width="8" height="14" rx="1" fill="${c}" opacity=".85"/><circle cx="${x + 6}" cy="${y + 19.5}" r="1" fill="${c}"/></g>`,
  P: (x, y, c) =>
    `<g class="dvc"><rect x="${x - 2}" y="${y + 6}" width="18" height="15" rx="2" fill="#1f7a45" stroke="${c}" stroke-width="1.5"/><rect x="${x + 2}" y="${y + 9}" width="6" height="6" fill="#222"/><rect x="${x + 10}" y="${y + 9}" width="3" height="9" fill="#ccc"/><path d="M${x} ${y + 8}h14" stroke="${c}" stroke-dasharray="1 2"/></g>`,
  C: (x, y, c) =>
    `<g class="dvc"><rect x="${x - 3}" y="${y + 2}" width="20" height="14" rx="2" fill="#1b1f4a" stroke="${c}" stroke-width="1.5"/><rect x="${x - 1}" y="${y + 4}" width="16" height="10" fill="${c}" opacity=".8"/><path d="M${x + 7} ${y + 16}v4M${x + 2} ${y + 21}h10" stroke="${c}" stroke-width="2"/></g>`,
};

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
  let shownDevices = -1;
  let shownBlocks = -1;
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
    $('hwv').setAttribute('transform', `translate(0 ${(130 - h - 4).toFixed(1)})`);
    $('hwv').style.opacity = h > 1 ? '1' : '0';
    $('kb').textContent = blocks;
    $('km2').textContent = toy(blocks);
    $('kd').textContent = devices.length;
    if (devices.length !== shownDevices) {
      shownDevices = devices.length;
      $('dv').innerHTML = devices.map((q, i) => ICON[q.k](8 + i * 20, 112, COLOR[q.k])).join('');
    }
    if (blocks === shownBlocks) return;
    shownBlocks = blocks;
    let x = '';
    for (let j = first; j <= blocks; j++) {
      const bx = (j - first) * 24;
      x +=
        (j > first ? `<path d="M${bx - 6} 12h6" stroke="var(--acc)" stroke-width="2"/>` : '') +
        `<g${j === blocks ? ' class="newb"' : ''}><path d="M${bx} 5l9-5 9 5v12l-9 5-9-5z" fill="color-mix(in srgb,var(--acc) 25%,var(--bg))" stroke="var(--acc)" stroke-width="1.5"/><path d="M${bx} 5l9 5 9-5M${bx + 9} 10v12" fill="none" stroke="var(--acc)" stroke-width="1"/><text x="${bx + 9}" y="${j > 99 ? 18 : 19}" text-anchor="middle" font-size="${j > 99 ? 6 : 7}" font-weight="700" fill="var(--ink)">${j}</text></g>`;
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
    // A short golden flash where the stamp hits.
    const f = mkn('circle', { cx: 290, cy: 163, r: 26, fill: '#ffe08a', class: 'flash' }, s);
    setTimeout(() => f.remove(), 900);
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
