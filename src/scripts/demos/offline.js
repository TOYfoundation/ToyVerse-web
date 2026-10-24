// Offline payments with ToyCash (ported from the draft). The limit follows the
// decided levels 20 / 50 / 100 / 250 / 500 € (days and payments). The device-bound
// key needed above 100 € is assumed to be present in this example.
import { setup, fill, fly, say } from '../util.js';

const $ = (id) => document.getElementById(id);
const LEVELS = [
  [20, 0, 0],
  [50, 14, 10],
  [100, 60, 40],
  [250, 180, 100],
  [500, 365, 250],
];

export function init() {
  const el = $('off');
  if (!el) return;
  const { T } = setup(el);
  const s = $('os2');
  let days = 0;
  let pays = 0;
  let used = 0;
  let pending = [];
  let id = 0;
  let received = 0;
  const A = [100, 120];
  const B = [258, 120];
  const level = () => LEVELS.reduce((best, l, i) => (days >= l[1] && pays >= l[2] ? i : best), 0);
  const cap = () => LEVELS[level()][0];
  const msg = (t, bad) => say($('os'), t, bad);
  function ui() {
    const c = cap();
    $('aml').textContent = fill(T.amount, { n: $('am').value });
    $('cb').style.width = `${Math.min((used / c) * 100, 100)}%`;
    $('cl').textContent = fill(T.limit, { used, cap: c, s: level() + 1, days, n: pays });
    $('t1').textContent = fill(T.freeAmt, { n: c - used });
    $('t2').textContent = received ? `+${received} €` : '';
    document.querySelectorAll('#steps tbody tr').forEach((r, i) => r.classList.toggle('on', i === level()));
  }
  $('am').oninput = ui;
  $('pay').onclick = () => {
    const a = Number($('am').value);
    if (used + a > cap()) return msg(fill(T.over, { n: a }), true);
    used += a;
    received += a;
    id++;
    pending.push({ i: id, a });
    fly(s, A, B, '#3fd0c4');
    msg(fill(T.paid, { n: a }));
    ui();
  };
  $('chs').onclick = () => {
    if (!pending.length) return msg(T.first);
    const last = pending[pending.length - 1];
    pending.push({ i: last.i, a: last.a });
    received += last.a;
    fly(s, A, B, '#e03131');
    msg(T.double, true);
    ui();
  };
  $('sy').onclick = () => {
    if (!pending.length) return msg(T.nothing);
    const seen = {};
    let ok = 0;
    let li = '';
    pending.forEach((p) => {
      if (seen[p.i]) li += `<li class="bad">${fill(T.badNote, { i: p.i, n: p.a })}</li>`;
      else {
        seen[p.i] = 1;
        ok++;
        li += `<li>${fill(T.okNote, { i: p.i, n: p.a })}</li>`;
      }
    });
    const bad = pending.length - ok;
    fly(s, B, [180, 24], bad ? '#e03131' : '#3fd0c4', () => {
      $('ch2').setAttribute('stroke', bad ? '#e03131' : '#1fcf6b');
      setTimeout(() => $('ch2').setAttribute('stroke', 'var(--acc)'), 1200);
    });
    $('pl').innerHTML = li;
    pays += ok;
    used = 0;
    pending = [];
    received = 0;
    msg(bad ? T.caught : fill(T.synced, { n: ok }), bad > 0);
    ui();
  };
  $('mo').onclick = () => {
    days += 30;
    pays += 60;
    msg(T.monthMsg);
    ui();
  };
  ui();
}
