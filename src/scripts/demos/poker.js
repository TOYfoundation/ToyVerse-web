// Limit poker against two example characters, played with ducats only
// (decision of 24.10.2026: ToyCoin stakes only after a legal review).
// Hand evaluation and opponent logic ported from the draft.
import { setup, fill, num, esc } from '../util.js';
import { npc } from '../../lib/npc.js';

const $ = (id) => document.getElementById(id);
const SU = ['♠', '♥', '♦', '♣'];
const RK = ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K', 'A'];
const AGGR = { a: 1, b: 1.15 };
const SHOWN = [0, 3, 4, 5];

function eval5(h) {
  const v = h.map((c) => c.r).sort((a, b) => b - a);
  const flush = h.every((c) => c.s === h[0].s);
  const count = {};
  const low = v.join() === '14,5,4,3,2';
  v.forEach((x) => (count[x] = (count[x] || 0) + 1));
  const g = Object.keys(count)
    .map((k) => [count[k], Number(k)])
    .sort((a, b) => b[0] - a[0] || b[1] - a[1]);
  const straight = g.length === 5 && (v[0] - v[4] === 4 || low);
  const hi = low ? 5 : v[0];
  const rk = g.map((x) => x[1]);
  if (straight && flush) return [8, hi];
  if (g[0][0] === 4) return [7, ...rk];
  if (g[0][0] === 3 && g[1][0] === 2) return [6, ...rk];
  if (flush) return [5, ...v];
  if (straight) return [4, hi];
  if (g[0][0] === 3) return [3, ...rk];
  if (g[0][0] === 2 && g[1][0] === 2) return [2, ...rk];
  if (g[0][0] === 2) return [1, ...rk];
  return [0, ...v];
}
function cmp(a, b) {
  for (let i = 0; i < Math.max(a.length, b.length); i++) {
    const d = (a[i] || 0) - (b[i] || 0);
    if (d) return d;
  }
  return 0;
}
function combos(a, k) {
  const r = [];
  (function g(s, c) {
    if (c.length === k) return r.push(c);
    for (let i = s; i < a.length; i++) g(i + 1, c.concat([a[i]]));
  })(0, []);
  return r;
}
function best(hand, board, omaha) {
  let m = null;
  const take = (s) => {
    if (!m || cmp(s, m) > 0) m = s;
  };
  if (omaha) combos(hand, 2).forEach((p) => combos(board, 3).forEach((q) => take(eval5(p.concat(q)))));
  else combos(hand.concat(board), 5).forEach((c) => take(eval5(c)));
  return m;
}

export function init() {
  const el = $('poker');
  if (!el) return;
  const { T, lang } = setup(el);
  const NM = { p: T.you, a: T.opp[0], b: T.opp[1] };
  const f = (x) => num(lang, x, 2);
  let omaha = false;
  let unit = 1;
  let stack = 0;
  let net = 0;
  let invested = 0;
  let G;
  const handName = (s) => (s[0] === 8 && s[1] === 14 ? T.royal : T.hands[s[0]]);
  const card = (c) => `<div class="pc"><i><b></b><u${c.s === 1 || c.s === 2 ? ' style="color:#c62828"' : ''}>${RK[c.r - 2]}${SU[c.s]}</u></i></div>`;
  function strength(h, b) {
    if (b.length < 3) {
      const v = h.map((c) => c.r).sort((x, y) => y - x);
      let pair = 0;
      let suited = 0;
      for (let i = 0; i < h.length; i++)
        for (let j = i + 1; j < h.length; j++) {
          if (h[i].r === h[j].r) pair = 1;
          if (h[i].s === h[j].s) suited = 1;
        }
      return Math.min(1, ((v[0] + v[1]) / 28) * 0.7 + pair * 0.3 + suited * 0.05);
    }
    const v = best(h, b, omaha);
    return [0.12, 0.38, 0.58, 0.72, 0.8, 0.85, 0.92, 0.97, 1][v[0]] + ((v[1] || 0) / 14) * 0.04;
  }
  const msg = (t) => ($('pm').textContent = t);
  function ui() {
    $('sk').textContent = `${f(stack)} ${T.unit}`;
    $('nt').textContent = `${net >= 0 ? '+' : ''}${f(net)} ${T.unit}`;
    $('pt').textContent = f(G ? G.pot : 0);
  }
  function add(x) {
    const n = Math.max(1, Math.round(x / unit));
    G.pot += x;
    for (let i = 0; i < n && $('chs').children.length < 16; i++) {
      const e = document.createElement('span');
      e.className = 'chp';
      $('chs').appendChild(e);
    }
    ui();
  }
  const size = () => (G.st > 1 ? 2 * unit : unit);
  function talk(k) {
    const s = $(`o${k}`).querySelector('svg');
    s.classList.add('tk');
    setTimeout(() => s.classList.remove('tk'), 900);
  }
  function flipUp(sel, n) {
    document.querySelectorAll(sel).forEach((e, i) => {
      if (i < n) setTimeout(() => e.classList.add('up'), i * 120);
    });
  }
  function actions() {
    const s = size();
    const b = G.B;
    $('act').innerHTML = G.over
      ? `<button class="btn" id="nx">${esc(T.nextHand)}</button>`
      : `<button class="btn al" data-a="f">${esc(T.fold)}</button><button class="btn" data-a="c">${esc(b ? fill(T.call, { n: f(b) }) : T.check)}</button><button class="btn" data-a="r">${esc(b ? fill(T.raise, { n: f(b + s) }) : fill(T.bet, { n: f(s) }))}</button>`;
  }
  function hint() {
    const m = SHOWN[G.st];
    $('ph').textContent = m >= 3 ? fill(T.best, { h: handName(best(G.h, G.bd.slice(0, m), omaha)) }) : '';
  }
  function npcBets() {
    const s = size();
    const b = G.bd.slice(0, SHOWN[G.st]);
    ['a', 'b'].forEach((k) => {
      G.bt[k] = 0;
      if (G.al[k]) {
        if (strength(G[k], b) * AGGR[k] + Math.random() * 0.3 > 0.62) G.bt[k] = s;
        $(`s${k}`).textContent = G.bt[k] ? fill(T.npcBet, { n: f(s) }) : T.npcCheck;
        talk(k);
      }
    });
    G.B = Math.max(G.bt.a, G.bt.b);
    actions();
    ui();
  }
  function newHand() {
    const deck = [];
    const n = omaha ? 4 : 2;
    const buyin = Number($('bi').value);
    unit = buyin / 20;
    if (stack < 3 * unit) {
      if (G) msg(T.broke);
      stack = buyin;
    }
    for (let i = 0; i < 4; i++) for (let j = 2; j < 15; j++) deck.push({ r: j, s: i });
    for (let i = 51; i > 0; i--) {
      const j = (Math.random() * (i + 1)) | 0;
      [deck[i], deck[j]] = [deck[j], deck[i]];
    }
    G = { h: deck.splice(0, n), a: deck.splice(0, n), b: deck.splice(0, n), bd: deck.splice(0, 5), al: { a: 1, b: 1 }, pa: 1, st: 0, pot: 0, over: 0, bt: { a: 0, b: 0 }, B: 0 };
    invested = 0;
    $('chs').innerHTML = '';
    ['a', 'b'].forEach((k, q) => {
      $(`o${k}`).innerHTML = `${npc(q ? 3 : 0)}<div>${esc(NM[k])}</div><div class="dk3" id="h${k}">${G[k].map(card).join('')}</div><small id="s${k}"></small>`;
    });
    $('bd').innerHTML = G.bd.map(card).join('');
    $('hc').innerHTML = G.h.map(card).join('');
    flipUp('#hc .pc', 9);
    const ante = Math.min(unit, stack);
    stack -= ante;
    invested += ante;
    add(ante + 2 * unit);
    msg(`${omaha ? T.ruleOmaha : T.ruleHoldem} ${fill(T.start, { n: f(unit) })}`);
    $('ph').textContent = '';
    npcBets();
  }
  function finish(mode) {
    const sc = {};
    const winners = [];
    const shown = [];
    let top = null;
    const live = ['p', 'a', 'b'].filter((x) => (x === 'p' ? G.pa : G.al[x]));
    G.over = 1;
    if (mode === 2) {
      stack += G.pot;
      net += G.pot - invested;
      msg(fill(T.allFold, { n: f(G.pot) }));
      G.pot = 0;
      ui();
      return actions();
    }
    flipUp('#bd .pc', 5);
    ['a', 'b'].forEach((x) => {
      if (G.al[x]) flipUp(`#h${x} .pc`, 9);
    });
    live.forEach((x) => {
      sc[x] = best(x === 'p' ? G.h : G[x], G.bd, omaha);
      shown.push(`${NM[x]}: ${handName(sc[x])}`);
      if (!top || cmp(sc[x], top) > 0) top = sc[x];
    });
    live.forEach((x) => {
      if (cmp(sc[x], top) === 0) winners.push(x);
    });
    const share = G.pot / winners.length;
    if (winners.includes('p')) stack += share;
    net += (winners.includes('p') ? share : 0) - invested;
    msg((mode === 1 ? T.youFold : '') + fill(T.showdown, { list: shown.join(' · '), win: winners.map((x) => NM[x]).join(T.and), n: f(share) }));
    G.pot = 0;
    ui();
    actions();
  }
  function play(a) {
    if (G.over) return;
    const s = size();
    const b = G.B;
    const raise = a === 'r';
    const target = raise ? b + s : b;
    const board = G.bd.slice(0, SHOWN[G.st]);
    if (a === 'f') {
      G.pa = 0;
      return finish(1);
    }
    const pay = Math.min(target, stack);
    stack -= pay;
    invested += pay;
    add(pay);
    ['a', 'b'].forEach((k) => {
      if (!G.al[k]) return;
      const need = target - G.bt[k];
      const q = strength(G[k], board) + Math.random() * (raise ? 0.25 : 0.2);
      add(G.bt[k]);
      if (need > 0) {
        if (q > (raise ? 0.5 : 0.42)) {
          add(need);
          $(`s${k}`).textContent = T.npcCall;
        } else {
          G.al[k] = 0;
          $(`s${k}`).textContent = T.npcFold;
        }
        talk(k);
      }
    });
    if (!['a', 'b'].some((k) => G.al[k])) return finish(2);
    if (G.st === 3) return finish(0);
    G.st++;
    flipUp('#bd .pc', SHOWN[G.st]);
    msg(fill(T.newCards, { street: T.streets[G.st - 1] }));
    hint();
    npcBets();
  }
  function session() {
    stack = Number($('bi').value);
    net = 0;
    G = null;
    newHand();
  }
  $('pmod').onclick = (e) => {
    const m = e.target.dataset.m;
    if (!m) return;
    omaha = m === 'o';
    el.querySelectorAll('#pmod .lb').forEach((b) => b.classList.toggle('on', b.dataset.m === m));
    session();
  };
  $('bi').oninput = function () {
    $('bil').textContent = fill(T.buyin, { n: this.value });
    session();
  };
  $('act').onclick = (e) => {
    const a = e.target.dataset.a;
    if (a) play(a);
    else if (e.target.id === 'nx') newHand();
  };
  session();
}
