// ToySafe demo (toycoin docs/spaeter/14-toysafe.md):
// 1. Protection level: share of the checklist the visitor has set up, with the next useful step.
// 2. Risk check before sending: the light only warns, the decision stays with the user (principle G3).
import { setup, fill } from '../util.js';

const $ = (id) => document.getElementById(id);

// Light per example recipient: 0 green (known), 1 yellow (new), 2 red (look-alike, warning list, old token).
const LIGHT = [0, 1, 2, 2, 2];
const CLS = ['', 'warn', 'bad'];

export function init() {
  const el = $('safe');
  if (!el) return;
  const { T } = setup(el);
  const boxes = [...el.querySelectorAll('input[type="checkbox"]')];
  const total = boxes.length;

  function level() {
    const n = boxes.filter((b) => b.checked).length;
    const idx = n === 0 ? 0 : n <= 2 ? 1 : n < total ? 2 : 3;
    $('sfr').style.setProperty('--p', String(Math.round((n / total) * 100)));
    $('sfn').textContent = `${n}/${total}`;
    const open = boxes.findIndex((b) => !b.checked);
    const next = open < 0 ? T.allDone : fill(T.nextStep, { s: T.checks[open] });
    $('sfs').textContent = `${fill(T.level, { n, m: total })} · ${T.levels[idx]}. ${next}`;
  }
  boxes.forEach((b) => b.addEventListener('change', level));

  const buttons = [...el.querySelectorAll('[data-r]')];
  el.querySelector('.sfp').addEventListener('click', (e) => {
    const b = e.target.closest('[data-r]');
    if (!b) return;
    const i = Number(b.dataset.r);
    buttons.forEach((x) => x.setAttribute('aria-pressed', String(x === b)));
    const lamp = $('sfa');
    lamp.hidden = false;
    lamp.className = `lamp ${CLS[LIGHT[i]]}`.trim();
    $('sfm').textContent = `${T.lights[LIGHT[i]]}: ${T.results[i]}`;
  });
  level();
}
