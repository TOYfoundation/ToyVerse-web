// Characters answer questions with a typewriter effect (ported from the draft).
import { setup, esc } from '../util.js';

const $ = (id) => document.getElementById(id);

export function init() {
  const el = $('npcs');
  if (!el) return;
  const { T } = setup(el);
  const [qo, qc] = T.quotes;
  let cur = -1;
  let typing;
  function say(text, fig) {
    clearInterval(typing);
    let k = 0;
    fig.classList.add('tk');
    typing = setInterval(() => {
      k += 2;
      $('sb').textContent = text.slice(0, k);
      if (k >= text.length) {
        clearInterval(typing);
        fig.classList.remove('tk');
      }
    }, 28);
  }
  el.addEventListener('click', (e) => {
    const b = e.target.closest('.nb');
    if (!b) return;
    cur = Number(b.dataset.i);
    el.querySelectorAll('.nb').forEach((x) => (x.style.outline = x === b ? '3px solid var(--acc)' : ''));
    $('qs').innerHTML = T.qa[cur].map((q, j) => `<button class="btn al" data-j="${j}">${esc(q[0])}</button>`).join('');
    say(`${T.names[cur]}: ${qo}${T.hello}${qc}`, b.querySelector('svg'));
  });
  $('qs').addEventListener('click', (e) => {
    const j = e.target.dataset.j;
    if (j == null || cur < 0) return;
    say(`${T.names[cur]}: ${qo}${T.qa[cur][j][1]}${qc}`, el.querySelectorAll('.nb')[cur].querySelector('svg'));
  });
}
