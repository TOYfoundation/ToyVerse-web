// Time travel: five levels, the same task (checking signatures) with ever more
// efficient machines. Levels 1-3 ancient, 4-5 add the outlook to modern times.
// Machines ported from the draft; the water clock is new.
import { setup, fill, num, esc } from '../util.js';

const $ = (id) => document.getElementById(id);

function abacus(label) {
  let s = '<rect x="50" y="40" width="260" height="130" rx="10" fill="#7a5522" stroke="#c9953a" stroke-width="4"/><rect x="62" y="52" width="236" height="106" rx="6" fill="#3a2a18"/>';
  for (let i = 0; i < 4; i++) {
    s += `<line x1="70" y1="${76 + i * 26}" x2="290" y2="${76 + i * 26}" stroke="#c9953a" stroke-width="2"/><g class="an bs" style="--d:${2.4 + i * 0.5}s;animation-delay:-${i * 0.7}s">`;
    for (let j = 0; j < 5; j++) s += `<circle cx="${84 + j * 17}" cy="${76 + i * 26}" r="8" fill="${['#e0883a', '#3fd0c4', '#f2b632', '#c62828'][i]}" stroke="#0006"/>`;
    s += '</g>';
  }
  return s + `<text x="180" y="30" text-anchor="middle" font-size="12" fill="var(--ink)">${esc(label)}</text>`;
}

function waterwheel(label) {
  let s = '<path d="M10 30Q40 30 62 62" stroke="#3fd0c4" stroke-width="6" fill="none"/>';
  for (let i = 0; i < 5; i++) s += `<circle class="an dp" style="--d:1.2s;animation-delay:-${i * 0.25}s" cx="${62 + i * 1.5}" cy="64" r="3" fill="#3fd0c4"/>`;
  s += '<g class="an sp1" style="--d:4s"><circle cx="90" cy="120" r="44" fill="none" stroke="#7a5522" stroke-width="6"/><path d="M46 120h88M90 76v88M59 89l62 62M121 89l-62 62" stroke="#7a5522" stroke-width="4"/>';
  for (let i = 0; i < 8; i++) s += `<rect x="86" y="72" width="8" height="12" fill="#c9953a" transform="rotate(${i * 45} 90 120)"/>`;
  s += '</g><line x1="90" y1="120" x2="210" y2="120" stroke="#7a5522" stroke-width="6"/><g class="an sp1" style="--d:4s"><circle cx="210" cy="120" r="14" fill="#a8742c"/><circle cx="210" cy="108" r="5" fill="#f2b632"/></g><g class="an hm" style="--d:4s"><rect x="215" y="96" width="90" height="8" rx="3" fill="#8a6a3a"/><rect x="290" y="88" width="22" height="24" rx="3" fill="#6b4a1f"/></g><circle cx="215" cy="100" r="4" fill="var(--ink)"/><rect x="274" y="114" width="50" height="14" rx="3" fill="#f2b632"/><rect x="260" y="128" width="78" height="18" rx="3" fill="#6b4a1f"/>';
  return s + `<text x="180" y="30" text-anchor="middle" font-size="12" fill="var(--ink)">${esc(label)}</text>`;
}

function waterclock(label) {
  // Upper vessel drips into a lower one; a float with a pointer rises along a scale.
  let s = '<path d="M110 44h90l-14 48h-62z" fill="#3a2a18" stroke="#c9953a" stroke-width="3"/><path d="M118 52h74l-10 34h-54z" fill="#3fd0c4" opacity=".75"/><rect x="152" y="92" width="6" height="10" fill="#c9953a"/>';
  for (let i = 0; i < 4; i++) s += `<circle class="an dp" style="--d:1s;animation-delay:-${i * 0.25}s" cx="155" cy="106" r="2.6" fill="#3fd0c4"/>`;
  s += '<rect x="120" y="110" width="70" height="80" rx="4" fill="none" stroke="#c9953a" stroke-width="3"/><rect class="an rs" style="--d:8s" x="123" y="122" width="64" height="66" fill="#3fd0c4" opacity=".55"/>';
  s += '<g class="an fu" style="--d:8s"><rect x="138" y="176" width="34" height="8" rx="3" fill="#f2b632"/><path d="M155 176V150H214" stroke="#f2b632" stroke-width="3" fill="none"/><path d="M214 146l10 4-10 4z" fill="#f2b632"/></g>';
  for (let i = 0; i < 7; i++) s += `<line x1="226" y1="${188 - i * 10}" x2="${i % 2 ? 236 : 244}" y2="${188 - i * 10}" stroke="var(--ink)" stroke-width="2"/>`;
  s += '<line x1="226" y1="126" x2="226" y2="190" stroke="var(--ink)" stroke-width="2"/>';
  return s + `<text x="180" y="30" text-anchor="middle" font-size="12" fill="var(--ink)">${esc(label)}</text>`;
}

function steam(label) {
  let s = '<rect x="8" y="104" width="64" height="50" rx="12" fill="#6b4a1f" stroke="#c9953a" stroke-width="3"/><circle class="an cb" style="--d:.8s" cx="40" cy="140" r="9" fill="#e0883a"/><rect x="26" y="70" width="14" height="34" fill="#6b4a1f"/>';
  for (let i = 0; i < 3; i++) s += `<ellipse class="an sm" style="--d:2.4s;animation-delay:-${i * 0.8}s" cx="33" cy="66" rx="9" ry="6" fill="#fff" opacity=".4"/>`;
  return (
    s +
    '<path d="M72 112H100" stroke="#8a6a3a" stroke-width="6"/><rect x="100" y="96" width="62" height="32" rx="4" fill="none" stroke="var(--ink)" stroke-width="3"/><rect id="pi" x="112" y="99" width="8" height="26" fill="var(--acc)"/><line id="pr" x1="120" y1="112" x2="190" y2="112" stroke="var(--ink)" stroke-width="4"/><rect id="xh" x="186" y="106" width="10" height="12" fill="var(--ink)"/><line id="cr9" x1="190" y1="112" x2="308" y2="112" stroke="#c9953a" stroke-width="5"/><g id="fw9"><circle cx="290" cy="112" r="44" fill="none" stroke="#7a5522" stroke-width="7"/><path d="M246 112h88M290 68v88M259 81l62 62M321 81l-62 62" stroke="#7a5522" stroke-width="4"/></g><circle id="pn" cx="308" cy="112" r="5" fill="#f2b632"/><circle cx="290" cy="112" r="6" fill="var(--ink)"/>' +
    `<text x="180" y="30" text-anchor="middle" font-size="12" fill="var(--ink)">${esc(label)}</text>`
  );
}

function crank(a) {
  // Slider-crank kinematics of the steam engine.
  const px = 290 + 18 * Math.cos(a);
  const py = 112 + 18 * Math.sin(a);
  const xh = px - Math.sqrt(8100 - (py - 112) * (py - 112));
  $('pi').setAttribute('x', xh - 70);
  $('pr').setAttribute('x1', xh - 62);
  $('pr').setAttribute('x2', xh);
  $('xh').setAttribute('x', xh - 5);
  $('cr9').setAttribute('x1', xh);
  $('cr9').setAttribute('x2', px);
  $('cr9').setAttribute('y2', py);
  $('pn').setAttribute('cx', px);
  $('pn').setAttribute('cy', py);
  $('fw9').setAttribute('transform', `rotate(${(a * 180) / Math.PI} 290 112)`);
}

function chip(label) {
  let s = '<rect x="90" y="30" width="180" height="140" rx="10" fill="#10163f" stroke="var(--acc)" stroke-width="3"/>';
  for (let i = 0; i < 6; i++) s += `<rect x="${108 + i * 28}" y="20" width="10" height="10" fill="var(--ln)"/><rect x="${108 + i * 28}" y="170" width="10" height="10" fill="var(--ln)"/>`;
  for (let i = 0; i < 3; i++)
    for (let j = 0; j < 3; j++)
      s += `<rect class="an cb" style="--d:${0.6 + ((i * 3 + j) % 4) * 0.35}s;animation-delay:-${(i + j) * 0.3}s" x="${118 + j * 52}" y="${46 + i * 40}" width="40" height="30" rx="4" fill="var(--acc)"/>`;
  return s + `<path class="an pl2" style="--d:1s" d="M113 30V46M169 30V46M225 30V46M141 170V150M197 170V150M253 170V150" stroke="#fff" stroke-width="2" stroke-dasharray="3 5"/><text x="180" y="196" text-anchor="middle" font-size="12" fill="var(--ink)">${esc(label)}</text>`;
}

const MACHINES = [abacus, waterwheel, waterclock, steam, chip];
const RATE = [1, 6, 20, 600, 600000];
const SPEED = [0.3, 0.8, 1.4, 6, 20];

export function init() {
  const el = $('zeit');
  if (!el) return;
  const { T, lang } = setup(el);
  let lv = 0;
  let run = !matchMedia('(prefers-reduced-motion: reduce)').matches;
  let queue = 0;
  let done = 0;
  let acc = 0;
  let angle = 0;
  let sp = 1;
  let typing;
  function speak(text) {
    clearInterval(typing);
    const fig = $('lf').firstChild;
    let k = 0;
    fig.classList.add('tk');
    typing = setInterval(() => {
      k += 2;
      $('lt').textContent = text.slice(0, k);
      if (k >= text.length) {
        clearInterval(typing);
        fig.classList.remove('tk');
      }
    }, 28);
  }
  const pauseText = $('rn').textContent;
  function set(i) {
    lv = i;
    const L = T.levels[i];
    $('mz2').innerHTML = MACHINES[i](L[3]);
    if (i === 3) crank(angle);
    el.querySelectorAll('.lb').forEach((b, j) => b.classList.toggle('on', j === i));
    $('rt').textContent = fill(T.rate, { r: num(lang, RATE[i], 0) });
    $('en').textContent = L[2];
    // Tint only the background scenes; a filter on the whole hero widens the page on phones.
    document.querySelectorAll('.hero .sd svg').forEach((svg) => (svg.style.filter = `hue-rotate(${i * 50}deg) saturate(${1 + i * 0.1})`));
    speak(`${fill(T.level, { n: i + 1 })}, ${L[0]}: ${L[1]}`);
  }
  $('lv').innerHTML = T.levels.map((L, i) => `<button class="lb" data-i="${i}">${i + 1} ${esc(L[0].split(' · ')[0])}</button>`).join('');
  $('lv').onclick = (e) => {
    if (e.target.dataset.i != null) set(Number(e.target.dataset.i));
  };
  $('sp3').oninput = function () {
    sp = Number(this.value);
    $('sv').textContent = num(lang, sp, 1);
    $('mz').style.setProperty('--sp', sp);
  };
  $('rn').onclick = () => {
    run = !run;
    $('mz').classList.toggle('run', run);
    $('rn').textContent = run ? pauseText : T.start;
  };
  $('jb').onclick = () => queue++;
  $('j10').onclick = () => (queue += 10);
  setInterval(() => {
    if (run) {
      if (lv === 3) crank((angle += sp * 0.2));
      if (queue > 0) {
        acc += SPEED[lv] * sp * 0.04;
        while (acc >= 1 && queue > 0) {
          acc--;
          queue--;
          done++;
        }
      } else acc = 0;
    }
    $('qn').textContent = queue;
    $('dn2').textContent = done;
  }, 40);
  $('mz').classList.toggle('run', run);
  $('rn').textContent = run ? pauseText : T.start;
  set(0);
}
