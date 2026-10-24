// Characters answer questions in a speech bubble with a typewriter effect.
// The bubble points at the chosen character, who gestures while talking.
import { setup, esc, reduced } from '../util.js';

const $ = (id) => document.getElementById(id);

export function init() {
  const el = $('npcs');
  if (!el) return;
  const { T } = setup(el);
  const [qo, qc] = T.quotes;
  const figs = [...el.querySelectorAll('.nb')];
  let cur = -1;
  let typing;
  function say(text) {
    clearInterval(typing);
    const fig = figs[cur].querySelector('svg');
    const out = $('sb');
    if (reduced()) {
      out.textContent = text;
      return;
    }
    let k = 0;
    fig.classList.add('tk');
    out.innerHTML = '<span></span><i class="cur"></i>';
    const span = out.firstChild;
    typing = setInterval(() => {
      k += 2;
      span.textContent = text.slice(0, k);
      if (k >= text.length) {
        clearInterval(typing);
        fig.classList.remove('tk');
        setTimeout(() => out.querySelector('.cur')?.remove(), 1200);
      }
    }, 26);
  }
  function choose(i) {
    cur = i;
    figs.forEach((b, j) => {
      b.classList.toggle('on', j === i);
      b.setAttribute('aria-pressed', String(j === i));
    });
    // Point the bubble at the chosen figure.
    const r = figs[i].getBoundingClientRect();
    const box = $('bub').getBoundingClientRect();
    const rtl = getComputedStyle(el).direction === 'rtl';
    const center = r.left + r.width / 2 - box.left;
    const pos = rtl ? box.width - center : center;
    $('bub').style.setProperty('--bx', `${Math.max(12, pos - 8)}px`);
    $('qs').innerHTML = T.qa[i].map((q, j) => `<button class="btn al" data-j="${j}">${esc(q[0])}</button>`).join('');
    say(`${T.names[i]}: ${qo}${T.hello}${qc}`);
  }
  el.addEventListener('click', (e) => {
    const b = e.target.closest('.nb');
    if (b) choose(Number(b.dataset.i));
  });
  $('qs').addEventListener('click', (e) => {
    const b = e.target.closest('[data-j]');
    if (!b || cur < 0) return;
    $('qs')
      .querySelectorAll('button')
      .forEach((x) => x.classList.toggle('on', x === b));
    say(`${T.names[cur]}: ${qo}${T.qa[cur][b.dataset.j][1]}${qc}`);
  });
}
