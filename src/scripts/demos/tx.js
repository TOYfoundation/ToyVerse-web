// Free quota per epoch: Q = max(10, 100 x (1 - load)) (specification 7.2).
// Above the quota: fee about 0.00015 TOY per transfer times a factor that
// doubles every 10 further transactions in the same block, at most 1,024.
import { setup, fill, num } from '../util.js';

const $ = (id) => document.getElementById(id);

export function init() {
  const el = $('tx');
  if (!el) return;
  const { T, lang } = setup(el);
  let q = 55;
  let n = 0;
  function upd() {
    const load = Number($('ld').value);
    q = Math.max(10, Math.round(100 * (1 - load / 100)));
    $('lv').textContent = fill(T.load, { n: load });
    $('fr').textContent = fill(T.free, { a: Math.max(q - n, 0), b: q });
    $('tb').style.width = `${Math.min((n / q) * 100, 100)}%`;
  }
  $('ld').oninput = upd;
  $('sd').onclick = () => {
    n++;
    if (n <= q) $('tm').textContent = T.sentFree;
    else {
      const over = n - q;
      const factor = Math.min(1024, 2 ** Math.floor((over - 1) / 10));
      $('tm').textContent = fill(T.sentFee, { fee: num(lang, 0.00015 * factor, 6), f: factor });
    }
    upd();
  };
  $('tr').onclick = () => {
    n = 0;
    $('tm').textContent = '';
    upd();
  };
  upd();
}
