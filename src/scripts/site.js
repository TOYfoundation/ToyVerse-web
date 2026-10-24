// Behaviour on every page: group menu, mobile menu, hero slider and parallax,
// tilt effect, logo rotation on scroll. Ported from the draft of 24.10.2026.

const $ = (id) => document.getElementById(id);
const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;

// ---- Menu ----
const menu = $('menu');
const groupNav = $('gn');
const menuBtn = $('mb');

function closeMenu() {
  menu.classList.remove('o');
  document.querySelectorAll('.gb, #mb').forEach((b) => b.setAttribute('aria-expanded', 'false'));
}

function openMenu(i) {
  const isOpen = menu.classList.contains('o') && menu.dataset.i === String(i);
  closeMenu();
  if (isOpen) return;
  menu.classList.add('o');
  menu.classList.toggle('one', i >= 0);
  menu.dataset.i = String(i);
  [...menu.children].forEach((s, j) => s.classList.toggle('s', j === i));
  if (i >= 0) groupNav.children[i].setAttribute('aria-expanded', 'true');
  else menuBtn.setAttribute('aria-expanded', 'true');
}

groupNav.addEventListener('click', (e) => {
  const b = e.target.closest('.gb');
  if (b) openMenu(Number(b.dataset.i));
});
menuBtn.addEventListener('click', () => openMenu(-1));
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    closeMenu();
    document.querySelectorAll('details.ls[open]').forEach((d) => d.removeAttribute('open'));
  }
});
document.addEventListener('click', (e) => {
  if (!e.target.closest('header')) {
    closeMenu();
    document.querySelectorAll('details.ls[open]').forEach((d) => d.removeAttribute('open'));
  }
});

// ---- Logo rotation and tilt ----
window.addEventListener('scroll', () => document.documentElement.style.setProperty('--sr', `${scrollY * 0.4}deg`), { passive: true });
document.addEventListener('pointermove', (e) => {
  const el = e.target.closest && e.target.closest('.tilt, .ci');
  if (!el || reduced) return;
  const r = el.getBoundingClientRect();
  el.style.setProperty('--ry', `${((e.clientX - r.left) / r.width - 0.5) * 16}deg`);
  el.style.setProperty('--rx', `${(0.5 - (e.clientY - r.top) / r.height) * 16}deg`);
});
document.addEventListener('pointerout', (e) => {
  const el = e.target.closest && e.target.closest('.tilt, .ci');
  if (el && !el.contains(e.relatedTarget)) {
    el.style.setProperty('--rx', '0deg');
    el.style.setProperty('--ry', '0deg');
  }
});

// ---- Pointer effects, batched once per frame ----
// Spotlight on cards and stages, eyes of the characters following the pointer.
let lastPointer = null;
let pointerFrame = 0;
function pointerTick() {
  pointerFrame = 0;
  const e = lastPointer;
  if (!e) return;
  const glow = e.target.closest && e.target.closest('.c, .sim, .pv');
  if (glow) {
    const r = glow.getBoundingClientRect();
    glow.style.setProperty('--mx', `${e.clientX - r.left}px`);
    glow.style.setProperty('--my', `${e.clientY - r.top}px`);
  }
  document.querySelectorAll('svg.n').forEach((fig) => {
    const r = fig.getBoundingClientRect();
    if (r.bottom < 0 || r.top > innerHeight || !r.width) return;
    const dx = e.clientX - (r.left + r.width / 2);
    const dy = e.clientY - (r.top + r.height * 0.3);
    const d = Math.hypot(dx, dy) || 1;
    const k = Math.min(1, d / 240);
    fig.style.setProperty('--ex', ((dx / d) * k).toFixed(2));
    fig.style.setProperty('--eyy', ((dy / d) * k).toFixed(2));
  });
}
if (!reduced) {
  document.addEventListener(
    'pointermove',
    (e) => {
      lastPointer = e;
      if (!pointerFrame) pointerFrame = requestAnimationFrame(pointerTick);
    },
    { passive: true },
  );
}

// ---- Hero slider ----
const hero = document.querySelector('.hero');
if (hero) {
  if (!reduced) {
    hero.addEventListener('pointermove', (e) => {
      const r = hero.getBoundingClientRect();
      const x = (e.clientX - r.left) / r.width;
      const y = (e.clientY - r.top) / r.height;
      hero.style.setProperty('--px', (x - 0.5).toFixed(3));
      hero.style.setProperty('--py', (y - 0.5).toFixed(3));
      hero.style.setProperty('--lx', (x * 100).toFixed(1));
      hero.style.setProperty('--ly', (y * 100).toFixed(1));
      hero.style.setProperty('--lo', '1');
    });
    hero.addEventListener('pointerleave', () => hero.style.setProperty('--lo', '0'));
    // Depth while scrolling: layers drift at different speeds, the title lifts away.
    let scrollFrame = 0;
    const onScroll = () => {
      scrollFrame = 0;
      const y = Math.min(Math.max(scrollY, 0), hero.offsetHeight);
      hero.style.setProperty('--sy', y.toFixed(0));
    };
    window.addEventListener(
      'scroll',
      () => {
        if (!scrollFrame) scrollFrame = requestAnimationFrame(onScroll);
      },
      { passive: true },
    );
  }
  const scenes = hero.querySelectorAll('.sd');
  const texts = hero.querySelectorAll('.sl .hw');
  const dots = $('dots');
  const caption = $('cp');
  const captions = JSON.parse(hero.dataset.captions || '[]');
  const label = hero.dataset.imageLabel || '{n}';
  let s = 0;
  dots.innerHTML = [...scenes].map((_, i) => `<button class="dot" aria-label="${label.replace('{n}', i + 1)}" data-i="${i}"></button>`).join('');
  const show = (n) => {
    s = (n + scenes.length) % scenes.length;
    scenes.forEach((e, i) => e.classList.toggle('on', i === s));
    texts.forEach((e, i) => e.classList.toggle('on', i === s));
    caption.textContent = captions[Number(scenes[s].dataset.k)] || '';
    dots.querySelectorAll('.dot').forEach((d, i) => d.classList.toggle('on', i === s));
  };
  $('sp').addEventListener('click', () => show(s - 1));
  $('sn').addEventListener('click', () => show(s + 1));
  dots.addEventListener('click', (e) => {
    if (e.target.dataset.i) show(Number(e.target.dataset.i));
  });
  let timer = reduced ? 0 : setInterval(() => show(s + 1), 7000);
  hero.addEventListener('focusin', () => {
    clearInterval(timer);
    timer = 0;
  });
  show(0);
}
