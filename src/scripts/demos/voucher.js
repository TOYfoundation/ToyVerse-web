// ToyCash vouchers: bearer, multi-use and group (ported from the draft).
// The issuer keeps the state of each voucher; the ToyChain makes it verifiable.
import { setup, fill, num, esc, say } from '../util.js';
import { npc } from '../../lib/npc.js';

const $ = (id) => document.getElementById(id);
// [type, value, group members, redemptions]
const PRESETS = [
  ['g', 90, [0, 1, 3], 4],
  ['i', 20, [0, 1], 4],
  ['m', 100, [0, 1], 10],
];
const FIGURE = [1, 2, 4, 3];

export function init() {
  const el = $('vch');
  if (!el) return;
  const { T, lang } = setup(el);
  const fm = (x) => num(lang, x, 2);
  const names = T.customers;
  let type = 'i';
  let V = null;
  let last = 0;
  let group = [0, 1];
  let uses = 4;
  let busy = false;
  const msg = (t, bad) => say($('vm'), t, bad);
  function options() {
    let h = '';
    if (type === 'm') h = `<label for="vn" id="vnl">${esc(fill(T.uses, { n: uses }))}</label><input id="vn" type="range" min="2" max="10" value="${uses}">`;
    if (type === 'g') h = `<p style="margin:.4rem 0">${esc(T.members)}</p>${names.map((c, i) => `<button class="lb${group.includes(i) ? ' on' : ''}" data-g="${i}">${esc(c)}</button>`).join('')}`;
    $('vo').innerHTML = h;
    $('vd').textContent = T.types[type][2];
    el.querySelectorAll('#vt .lb').forEach((b) => b.classList.toggle('on', b.dataset.t === type));
  }
  function ticket() {
    let r = parseInt(V.sr, 16);
    let q = '';
    for (let i = 0; i < 25; i++) {
      r = (r * 9301 + 49297) % 233280;
      if (r % 2) q += `<rect x="${(i % 5) * 6}" y="${((i / 5) | 0) * 6}" width="5" height="5"/>`;
    }
    return `<div class="vtk"><div><b>${esc(T.types[V.t][1])}</b><span>${fm(V.val)} €</span><small>${esc(fill(T.serial, { s: V.sr }))}</small></div><svg viewBox="0 0 30 30" width="44" height="44" fill="currentColor" aria-hidden="true">${q}</svg></div>`;
  }
  function ui() {
    const d = V ? V.val - V.left : 0;
    $('vb2').style.width = `${V ? (d / V.val) * 100 : 0}%`;
    $('vs2').textContent = V ? fill(T.redeemed, { u: V.used, n: V.n, r: fm(Math.max(0, V.left)) }) : '';
  }
  function make() {
    const val = Number($('vw').value);
    if (type === 'g' && group.length < 2) return msg(T.needTwo, true);
    const n = type === 'm' ? uses : type === 'g' ? group.length : 1;
    V = { t: type, val, left: val, n, used: 0, by: {}, g: type === 'g' ? group.slice() : null, sr: Math.random().toString(16).slice(2, 8).toUpperCase() };
    $('vk').innerHTML = ticket();
    $('vl').innerHTML = '';
    msg(fill(T.created, { type: T.types[type][1], v: fm(val), n, s: fm(val / n) }));
    ui();
  }
  function rule(i) {
    const name = names[i];
    const share = V.val / V.n;
    if (V.t === 'i' && V.used >= 1) return [false, T.doneI];
    if (V.t === 'm' && V.used >= V.n) return [false, fill(T.doneM, { n: V.n })];
    if (V.t === 'g') {
      if (!V.g.includes(i)) return [false, fill(T.notMember, { name })];
      if (V.by[i]) return [false, fill(T.already, { name })];
    }
    V.used++;
    V.by[i] = (V.by[i] || 0) + 1;
    V.left = Math.round((V.left - share) * 100) / 100;
    return [true, fill(T.ok, { name, n: fm(share) })];
  }
  function attempt(i, cb) {
    const stage = $('sg2');
    const a = $('cs').children[i];
    const b = $('sh');
    const sr = stage.getBoundingClientRect();
    const ar = a.getBoundingClientRect();
    const br = b.getBoundingClientRect();
    const tix = document.createElement('div');
    const fig = a.querySelector('svg');
    const shopFig = b.querySelector('svg');
    tix.className = 'tix';
    tix.style.left = `${ar.left - sr.left + ar.width / 2 - 13}px`;
    tix.style.top = `${ar.top - sr.top + 30}px`;
    stage.appendChild(tix);
    fig.classList.add('wk1');
    tix.getBoundingClientRect();
    tix.style.transform = `translate(${br.left - ar.left + br.width / 2 - ar.width / 2}px,0)`;
    setTimeout(() => {
      tix.remove();
      fig.classList.remove('wk1');
      const [ok, text] = rule(i);
      const li = document.createElement('li');
      a.classList.add(ok ? 'ok' : 'no');
      setTimeout(() => a.classList.remove('ok', 'no'), 1200);
      li.textContent = text;
      if (!ok) li.className = 'bad';
      $('vl').appendChild(li);
      $('vb').textContent = ok ? T.thanks : T.sorry;
      shopFig.classList.add('tk');
      setTimeout(() => shopFig.classList.remove('tk'), 900);
      msg(text + (ok ? '' : T.rejected), !ok);
      ui();
      cb(ok);
    }, 880);
  }
  $('vt').onclick = (e) => {
    if (e.target.dataset.t) {
      type = e.target.dataset.t;
      options();
    }
  };
  $('vo').onclick = (e) => {
    const g = e.target.dataset.g;
    if (g == null) return;
    const k = group.indexOf(Number(g));
    if (k >= 0) group.splice(k, 1);
    else group.push(Number(g));
    options();
  };
  $('vo').oninput = (e) => {
    if (e.target.id === 'vn') {
      uses = Number(e.target.value);
      $('vnl').textContent = fill(T.uses, { n: uses });
    }
  };
  $('vw').oninput = function () {
    $('vwl').textContent = fill(T.value, { n: this.value });
  };
  $('vc').onclick = make;
  $('vp').onclick = (e) => {
    const p = e.target.dataset.p;
    if (p == null) return;
    const [t, v, g, n] = PRESETS[Number(p)];
    type = t;
    $('vw').value = v;
    $('vwl').textContent = fill(T.value, { n: v });
    group = g.slice();
    uses = n;
    options();
    make();
  };
  $('cs').innerHTML = names.map((c, i) => `<button class="cb3" data-i="${i}" aria-label="${esc(fill(T.redeems, { name: c }))}">${npc(FIGURE[i])}<div>${esc(c)}</div></button>`).join('');
  $('sh').innerHTML = `${npc(0)}<div>${esc(T.shop)}</div><small id="vb">${esc(T.welcome)}</small>`;
  $('cs').onclick = (e) => {
    const b = e.target.closest('.cb3');
    if (!b) return;
    if (!V) return msg(T.first, true);
    if (busy) return;
    busy = true;
    last = Number(b.dataset.i);
    attempt(last, () => (busy = false));
  };
  $('vx2').onclick = () => {
    if (!V) return msg(T.first, true);
    if (busy) return;
    busy = true;
    attempt(last, (a) =>
      attempt(last, (b) => {
        busy = false;
        msg(a && b ? T.dblBoth : T.dblCaught, !(a && b));
      }),
    );
  };
  options();
  ui();
}
