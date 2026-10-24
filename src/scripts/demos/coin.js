// Emission curve marker and the 3D coin (coin ported from the draft).
import { setup, fill, num, reduced } from '../util.js';
import { issuedAfterYears } from '../../lib/emission.js';

const $ = (id) => document.getElementById(id);

export function init() {
  const el = $('emis');
  if (el) {
    const { T, lang } = setup(el);
    const { X0, Y0, XW, YH } = T.geo;
    const upd = () => {
      const y = Number($('emy').value);
      const m = issuedAfterYears(y);
      $('emd').setAttribute('cx', X0 + (y / 25) * XW);
      $('emd').setAttribute('cy', Y0 - (m / 1e8) * YH);
      $('emis-l').textContent = fill(T.label, { y: num(lang, y, 1), m: num(lang, m / 1e6, 1) });
    };
    $('emy').oninput = upd;
    upd();
  }
  const coin = $('cn');
  if (!coin) return;
  let s = '';
  for (let k = 0; k < 9; k++) {
    s += `<i${k === 0 || k === 8 ? ' class="fc"' : ''} style="transform:${k === 0 ? 'rotateY(180deg) translateZ(4px)' : `translateZ(${k - 4}px)`}">${k === 0 || k === 8 ? 'T' : ''}</i>`;
  }
  coin.innerHTML = s;
  let a = 0;
  let user = reduced();
  const draw = () => coin.style.setProperty('--a', `${a}deg`);
  $('ca').oninput = function () {
    a = Number(this.value);
    user = true;
    draw();
  };
  setInterval(() => {
    if (!user) {
      a = (a + 3) % 360;
      $('ca').value = a;
      draw();
    }
  }, 40);
  draw();
}
