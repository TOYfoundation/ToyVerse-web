// Small helpers shared by the demos.

/** Reads the texts a component put into data-t, and the page language. */
export function setup(el) {
  return { T: JSON.parse(el.dataset.t || '{}'), lang: document.documentElement.lang };
}

/** "{name}" placeholders, same rule as the build-time t(). */
export function fill(s, vars = {}) {
  return String(s).replace(/\{(\w+)\}/g, (_, k) => (k in vars ? String(vars[k]) : `{${k}}`));
}

export function num(lang, x, digits = 2) {
  return Number(x).toLocaleString(lang === 'wuu' ? 'zh-CN' : lang, { maximumFractionDigits: digits });
}

export function esc(s) {
  return String(s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c]);
}

export const reduced = () => matchMedia('(prefers-reduced-motion: reduce)').matches;

/** Creates an SVG element with attributes and appends it. */
export function mkn(name, attrs, parent) {
  const e = document.createElementNS('http://www.w3.org/2000/svg', name);
  for (const [k, v] of Object.entries(attrs)) e.setAttribute(k, v);
  parent.appendChild(e);
  return e;
}

/** Moves a small lock (or a "T" coin) from a to b inside an SVG, then calls cb. */
export function fly(svg, a, b, color, cb, coin) {
  const g = mkn('g', { style: `transition:transform .9s ease-in-out;transform:translate(${a[0]}px,${a[1]}px)` }, svg);
  if (coin) {
    mkn('circle', { r: 9, fill: color }, g);
    mkn('text', { 'text-anchor': 'middle', y: 4, 'font-size': 11, 'font-weight': 700, fill: '#111' }, g).textContent = 'T';
  } else {
    mkn('rect', { x: -9, y: -7, width: 18, height: 14, rx: 3, fill: color }, g);
    mkn('path', { d: 'M-3 -1v-2a3 3 0 0 1 6 0v2M-4 -1h8v6h-8z', fill: 'none', stroke: '#111', 'stroke-width': 1.3 }, g);
  }
  g.getBoundingClientRect();
  g.style.transform = `translate(${b[0]}px,${b[1]}px)`;
  setTimeout(() => {
    g.remove();
    if (cb) cb();
  }, reduced() ? 0 : 950);
}

/**
 * Drag with mouse, finger or pen. move(dx, dy) is called with the distance
 * since the last event; after release the motion coasts out with momentum
 * (not with reduced motion). Vertical page scrolling stays possible.
 */
export function drag(el, move, start) {
  let last = null;
  let vx = 0;
  let vy = 0;
  let coast = 0;
  el.addEventListener('pointerdown', (e) => {
    if (e.button > 0) return;
    cancelAnimationFrame(coast);
    last = [e.clientX, e.clientY, performance.now()];
    vx = vy = 0;
    el.setPointerCapture(e.pointerId);
    if (start) start();
  });
  el.addEventListener('pointermove', (e) => {
    if (!last) return;
    const now = performance.now();
    const dx = e.clientX - last[0];
    const dy = e.clientY - last[1];
    const dt = Math.max(1, now - last[2]);
    vx = (dx / dt) * 16;
    vy = (dy / dt) * 16;
    last = [e.clientX, e.clientY, now];
    move(dx, dy);
  });
  const end = () => {
    if (!last) return;
    last = null;
    if (reduced()) return;
    const step = () => {
      vx *= 0.94;
      vy *= 0.94;
      if (Math.abs(vx) < 0.05 && Math.abs(vy) < 0.05) return;
      move(vx, vy);
      coast = requestAnimationFrame(step);
    };
    coast = requestAnimationFrame(step);
  };
  el.addEventListener('pointerup', end);
  el.addEventListener('pointercancel', end);
}

/** Message line with "bad" colouring. */
export function say(el, text, bad) {
  el.textContent = text;
  el.style.color = bad ? '#e03131' : 'var(--mu)';
}
