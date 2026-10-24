// Machine counter and four meshing gears with a crank (ported from the draft).
import { setup, fill, num, reduced } from '../util.js';

const $ = (id) => document.getElementById(id);

export function init() {
  const c = $('mcount');
  if (c) {
    const { T } = setup(c);
    $('mc').oninput = function () {
      $('mcl').textContent = fill(T.slider, { n: this.value });
      $('mbar').style.width = `${this.value / 2.56}%`;
    };
  }
  const el = $('gears');
  if (!el) return;
  const { T, lang } = setup(el);
  const D = [[70, 40], [138, 28], [202, 36], [258, 20]];
  let s = '';
  let a = 0;
  let user = reduced();
  D.forEach((d, i) => {
    const n = Math.round((2 * Math.PI * d[1]) / 10);
    const L = (Math.PI * d[1]) / n;
    s += `<g id="gg${i}" style="transform-origin:${d[0]}px 100px"><circle cx="${d[0]}" cy="100" r="${d[1]}" fill="none" stroke="var(--acc)" stroke-width="9" stroke-dasharray="${L} ${L}"/><circle cx="${d[0]}" cy="100" r="${d[1] - 8}" fill="var(--sf)" stroke="var(--acc)" stroke-width="2"/><path d="M${d[0] - d[1] + 12} 100H${d[0] + d[1] - 12}M${d[0]} ${112 - d[1]}V${88 + d[1]}" stroke="var(--acc)" stroke-width="3"/><circle cx="${d[0]}" cy="100" r="4" fill="var(--ink)"/>${i ? '' : `<circle cx="${d[0] + d[1] - 14}" cy="100" r="6" fill="#f2b632"/>`}</g>`;
  });
  $('gsv').innerHTML = s;
  function draw() {
    D.forEach((d, i) => {
      const n = Math.round((2 * Math.PI * d[1]) / 10);
      $(`gg${i}`).style.transform = `rotate(${(i % 2 ? -1 : 1) * a * (D[0][1] / d[1]) + (i % 2 ? 180 / n : 0)}deg)`;
    });
    $('gt').textContent = fill(T.text, { x: num(lang, D[0][1] / D[3][1], 1) });
  }
  $('cr').oninput = function () {
    a = Number(this.value);
    user = true;
    draw();
  };
  setInterval(() => {
    if (!user) {
      a = (a + 2) % 720;
      $('cr').value = a;
      draw();
    }
  }, 40);
  draw();
}
