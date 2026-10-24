// Animated step diagram, ported from the draft (function xs). Without
// JavaScript the ordered list of steps stays visible.
function esc(s) {
  return String(s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c]);
}

export function initFlows() {
  document.querySelectorAll('[data-flow]').forEach((el) => {
    const E = JSON.parse(el.dataset.flow);
    const N = E.steps.length;
    // Right-to-left pages mirror the layout so the flow reads from right to left.
    if (getComputedStyle(el).direction === 'rtl') E.nodes = E.nodes.map(([l, x, y]) => [l, 400 - x, y]);
    const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
    let k = 0;
    let playing = !reduced;
    el.innerHTML = `<div class="xv"></div><div class="xc"><button class="mb xp" aria-label="${esc(E.ui.back)}"><span class="chv" aria-hidden="true"></span></button><input class="xr" type="range" min="1" max="${N}" value="1" aria-label="${esc(E.ui.step)}"><button class="mb xn" aria-label="${esc(E.ui.next)}"><span class="chv f" aria-hidden="true"></span></button><button class="mb xa"></button></div><h3 class="xt" style="font:700 1.3rem var(--ser);margin:.8rem 0 .1rem"></h3><p class="xd" aria-live="polite" style="margin:0;color:var(--mu)"></p>`;
    const q = (c) => el.querySelector(c);
    function draw() {
      const s = E.steps[k];
      const a = E.nodes[s[0]];
      const b = E.nodes[s[1]];
      const edges = E.steps
        .map((st) => {
          const u = E.nodes[st[0]];
          const v = E.nodes[st[1]];
          return `<line x1="${u[1]}" y1="${u[2]}" x2="${v[1]}" y2="${v[2]}" stroke="var(--ln)" stroke-width="2"/>`;
        })
        .join('');
      const active = `<line class="fl" x1="${a[1]}" y1="${a[2]}" x2="${b[1]}" y2="${b[2]}" stroke="var(--acc)" stroke-width="3" stroke-dasharray="6 8"/>`;
      const nodes = E.nodes
        .map((n, i) => {
          const on = i === s[0] || i === s[1];
          return `<rect x="${n[1] - 54}" y="${n[2] - 20}" width="108" height="40" rx="12" fill="var(--bg)" stroke="${on ? 'var(--acc)' : 'var(--ln)'}" stroke-width="${on ? 2.5 : 1.5}"${on ? ' style="filter:drop-shadow(0 0 8px var(--acc))"' : ''}/><text x="${n[1]}" y="${n[2] + 5}" text-anchor="middle" font-size="13" font-weight="600" fill="var(--ink)">${esc(n[0])}</text>`;
        })
        .join('');
      const packet = reduced ? '' : `<circle r="6" fill="var(--acc)"><animateMotion dur="1.4s" repeatCount="indefinite" path="M${a[1]} ${a[2]}L${b[1]} ${b[2]}"/></circle>`;
      q('.xv').innerHTML = `<svg viewBox="0 0 400 ${E.h}" role="img" aria-label="${esc(E.ui.label)}">${edges}${active}${nodes}${packet}</svg>`;
      // Shrink labels that are wider than their box (long words in some languages).
      q('.xv')
        .querySelectorAll('text')
        .forEach((t) => {
          const w = t.getComputedTextLength();
          if (w > 98) t.setAttribute('font-size', String(Math.max(8, (13 * 98) / w).toFixed(1)));
        });
      q('.xt').textContent = `${k + 1}. ${s[2]}`;
      q('.xd').textContent = s[3];
      q('.xr').value = k + 1;
    }
    const go = (i) => {
      k = (i + N) % N;
      draw();
    };
    const btn = () => {
      q('.xa').textContent = playing ? E.ui.pause : E.ui.auto;
      q('.xa').setAttribute('aria-pressed', String(playing));
    };
    const stop = () => {
      playing = false;
      btn();
    };
    q('.xp').onclick = () => {
      stop();
      go(k - 1);
    };
    q('.xn').onclick = () => {
      stop();
      go(k + 1);
    };
    q('.xr').oninput = () => {
      stop();
      go(Number(q('.xr').value) - 1);
    };
    q('.xa').onclick = () => {
      playing = !playing;
      btn();
    };
    setInterval(() => {
      if (playing) go(k + 1);
    }, 3200);
    btn();
    draw();
  });
}
