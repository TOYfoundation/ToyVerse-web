// ToyScan traffic light with the criteria A1 to A9 of docs/05-toyscan.md.
// States: 0 green, 1 yellow, 2 red. A1, A2 and A5 red light the big red lamp.
import { setup, fill, num, esc } from '../util.js';

const $ = (id) => document.getElementById(id);

// [issued in million TOY, state per criterion A1..A9]
const SCENARIOS = [
  [3.2, [0, 0, 0, 0, 0, 0, 0, 0, 0]],
  [100.6, [2, 0, 0, 0, 0, 0, 0, 0, 0]],
  [3.2, [0, 2, 0, 0, 0, 0, 0, 0, 0]],
  [3.4, [0, 0, 1, 0, 0, 0, 0, 0, 0]],
  [3.2, [0, 0, 0, 0, 0, 0, 0, 0, 1]],
];

export function init() {
  const el = $('scan');
  if (!el) return;
  const { T, lang } = setup(el);
  function show(i) {
    const [issued, st] = SCENARIOS[i];
    const worst = Math.max(...st);
    const big = st[0] === 2 || st[1] === 2 || st[4] === 2;
    const text = T.scenarios[i];
    $('lm').className = `lamp${worst === 2 ? ' bad' : worst === 1 ? ' warn' : ''}`;
    $('ls').textContent = text[1];
    $('lw').textContent = text[2];
    $('bigred').classList.toggle('on', big);
    $('brs').innerHTML = [
      [T.minted, issued],
      [T.cap, 100],
    ]
      .map(([label, v]) => `<div>${esc(label)}: ${esc(fill(T.mio, { n: num(lang, v, 1) }))}</div><div class="bar2"><i style="width:${(v / 110) * 100}%"></i><u></u></div>`)
      .join('');
    $('cr3').innerHTML = T.criteria.map((c, j) => `<li${st[j] === 2 ? ' class="bad"' : st[j] === 1 ? ' class="mid"' : ''}>${esc(c)}</li>`).join('');
    $('sn2').querySelectorAll('button').forEach((b, j) => (b.className = `btn${j === i ? '' : ' al'}`));
  }
  $('sn2').innerHTML = T.scenarios.map((s, i) => `<button class="btn al" data-i="${i}">${esc(s[0])}</button>`).join('');
  $('sn2').onclick = (e) => {
    if (e.target.dataset.i) show(Number(e.target.dataset.i));
  };
  show(0);
}
