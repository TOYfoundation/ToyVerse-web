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

// ---- Hero slider ----
const hero = document.querySelector('.hero');
if (hero) {
  if (!reduced) {
    hero.addEventListener('pointermove', (e) => {
      const r = hero.getBoundingClientRect();
      hero.style.setProperty('--px', (e.clientX - r.left) / r.width - 0.5);
      hero.style.setProperty('--py', (e.clientY - r.top) / r.height - 0.5);
    });
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
