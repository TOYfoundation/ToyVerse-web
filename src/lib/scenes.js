// Hero scenes of the ToyVerse (night city, caravan, chain network, game salon,
// machine hall). Ported from the website draft of 24.10.2026. Each function
// returns SVG markup; a seeded random generator keeps the output identical on
// every build. Animations come from CSS classes in global.css.

import toyverse from '../data/toyverse.json';

function rng(s) {
  return () => {
    s = (s * 9301 + 49297) % 233280;
    return s / 233280;
  };
}

function layer(depth, inner) {
  return `<div class="ly" style="--d:${depth}"><svg viewBox="0 0 800 300" preserveAspectRatio="xMidYMax slice" width="100%" height="100%" aria-hidden="true">${inner}</svg></div>`;
}

function sky(n, a, b, c) {
  return `<defs><linearGradient id="g${n}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${a}"/><stop offset=".6" stop-color="${b}"/><stop offset="1" stop-color="${c}"/></linearGradient></defs><rect width="800" height="300" fill="url(#g${n})"/>`;
}

function stars(r, k) {
  let s = '';
  for (let i = 0; i < k; i++) {
    s += `<circle class="tw" style="animation-delay:-${(r() * 4).toFixed(1)}s" cx="${(r() * 800) | 0}" cy="${(r() * 170) | 0}" r="${(r() * 1.2 + 0.4).toFixed(1)}" fill="#fff"/>`;
  }
  return s;
}

function buildings(r, color, min, max) {
  let s = '';
  let x = -10;
  while (x < 820) {
    const w = (40 + r() * 50) | 0;
    const h = min + r() * (max - min);
    s += `<rect x="${x}" y="${300 - h}" width="${w}" height="${h}"/>`;
    if (r() > 0.45) {
      s += `<path d="M${x + w * 0.1} ${300 - h}a${w * 0.4} ${w * 0.4} 0 0 1 ${w * 0.8} 0z"/><rect x="${x + w / 2 - 1}" y="${300 - h - w * 0.4 - 12}" width="2" height="12"/>`;
    } else if (r() > 0.6) {
      s += `<rect x="${x + w / 2 - 3}" y="${300 - h - 44}" width="6" height="44"/><path d="M${x + w / 2 - 6} ${300 - h - 44}l6-10 6 10z"/>`;
    }
    x += w + ((r() * 8) | 0);
  }
  return `<g fill="${color}">${s}</g>`;
}

function lantern(x, y, c) {
  return `<g class="sw" style="transform-origin:${x}px 0px;animation-delay:-${x % 4}s"><path d="M${x} 0V${y}" stroke="#000" stroke-opacity=".5"/><circle cx="${x}" cy="${y}" r="16" fill="${c}" opacity=".22"/><ellipse cx="${x}" cy="${y}" rx="5" ry="8" fill="${c}"/></g>`;
}

function city(n) {
  const r = rng(n + 7);
  let near = '';
  let win = '';
  let x = 0;
  while (x < 810) {
    const w = (60 + r() * 60) | 0;
    const h = (60 + r() * 50) | 0;
    near += `<rect x="${x}" y="${300 - h}" width="${w}" height="${h}"/>`;
    for (let i = 0; i < 3; i++) {
      win += `<rect class="fk" style="animation-delay:-${(r() * 4).toFixed(1)}s" x="${(x + 8 + r() * (w - 24)) | 0}" y="${(300 - h + 10 + r() * (h - 30)) | 0}" width="7" height="10" rx="1.5" fill="#ffcf70"/>`;
    }
    x += w + 6;
  }
  return (
    layer(
      4,
      sky(n, '#060926', '#2a1d68', '#d1683f') +
        stars(r, 46) +
        '<circle cx="610" cy="70" r="64" fill="#fdf3d0" opacity=".12"/><circle cx="610" cy="70" r="28" fill="#fdf3d0"/><circle cx="602" cy="64" r="5" fill="#e7dcb4"/><circle cx="620" cy="80" r="3.5" fill="#e7dcb4"/><g class="dr" fill="#fff" opacity=".07"><ellipse cx="200" cy="90" rx="90" ry="14"/><ellipse cx="260" cy="82" rx="60" ry="12"/></g>',
    ) +
    layer(10, buildings(r, '#241a60', 120, 190)) +
    layer(
      20,
      `<g fill="#0a0732">${near}</g>${win}` +
        lantern(120, 70, '#ffb347') +
        lantern(330, 95, '#ff8f5a') +
        lantern(560, 60, '#ffb347') +
        lantern(720, 100, '#ff8f5a') +
        '<path d="M770 300q-4-80-22-130M770 300q4-70 24-120" stroke="#050420" stroke-width="5" fill="none"/><path d="M748 170q-30-14-56 6M748 170q-4-30-34-34M752 170q30-16 58 2M752 170q8-30 38-30" stroke="#050420" stroke-width="3" fill="none"/>',
    )
  );
}

function camel(x) {
  return `<g transform="translate(${x} 0)"><ellipse rx="13" ry="6"/><circle cx="-2" cy="-8" r="4.5"/><path d="M10-2l5-13h5l1 3h-3l-3 12z"/><path d="M-9 4v11M-4 4v11M5 4v11M10 4v11" stroke="#14092f" stroke-width="2.2" fill="none"/></g>`;
}

function dunes(n) {
  const r = rng(n + 3);
  let sand = '';
  for (let i = 0; i < 14; i++) {
    sand += `<circle class="up" style="animation-delay:-${(r() * 6).toFixed(1)}s" cx="${(r() * 800) | 0}" cy="${(220 + r() * 70) | 0}" r="1.3" fill="#ffd9a0"/>`;
  }
  return (
    layer(
      4,
      sky(n, '#1b1957', '#b0436a', '#f7a95c') +
        stars(r, 22) +
        '<circle cx="540" cy="190" r="70" fill="#ffd28a" opacity=".2"/><circle cx="540" cy="190" r="34" fill="#ffe7b0"/><path fill="#7c2f62" d="M0 300V205Q150 165 300 200T600 195T800 180V300z"/>',
    ) +
    layer(
      10,
      `<path fill="#4f1f55" d="M0 300V238Q200 190 380 236T800 222V300z"/><g class="cv" fill="#14092f"><g transform="translate(0 228)">${camel(0)}${camel(34)}${camel(68)}${camel(102)}</g></g>`,
    ) +
    layer(20, `<path fill="#1c0f3d" d="M0 300V270Q250 236 500 270T800 260V300z"/>${sand}`)
  );
}

function cube(x, y, s, i) {
  return `<g class="gl" style="animation-delay:${i * 0.5}s"><path d="M${x} ${y - s}L${x + s} ${y - s / 2}L${x} ${y}L${x - s} ${y - s / 2}z" fill="#8ef3ea"/><path d="M${x - s} ${y - s / 2}L${x} ${y}V${y + s}L${x - s} ${y + s / 2}z" fill="#1f8f9a"/><path d="M${x} ${y}L${x + s} ${y - s / 2}V${y + s / 2}L${x} ${y + s}z" fill="#136a86"/></g>`;
}

function network(n) {
  const r = rng(n + 5);
  let grid = '';
  let cubes = '';
  let links = '';
  let packets = '';
  for (let i = 0; i < 6; i++) grid += `M0 ${(200 + i * i * 3.2) | 0}H800`;
  for (let x = -800; x <= 1600; x += 160) grid += `M400 200L${x} 300`;
  for (let i = 0; i < 5; i++) {
    const x = 130 + i * 135;
    cubes += cube(x, 138 + (i % 2) * 16, 30, i);
    if (i < 4) {
      links += `<path class="fl" d="M${x + 30} ${138 + (i % 2) * 16}L${x + 105} ${138 + ((i + 1) % 2) * 16}" stroke="#3fd0c4" stroke-width="2" stroke-dasharray="4 8" fill="none"/>`;
    }
  }
  for (let i = 0; i < 3; i++) packets += `<circle class="pk" style="animation-delay:-${i * 2}s" cx="160" cy="150" r="4" fill="#fff"/>`;
  // Labels in the picture: chain ID of the ToyChain testnet, a block, a valid signature
  const labels = [`chain ${toyverse.chainIds.testnet}`, 'block 4096', 'sig ✓'];
  let q = '';
  for (let i = 0; i < 16; i++) {
    q +=
      i < 3
        ? `<text class="up" style="animation-delay:-${i * 2}s" x="${120 + i * 220}" y="270" fill="#7fe9df" fill-opacity=".6" font-size="10" font-family="monospace">${labels[i]}</text>`
        : `<circle class="up" style="animation-delay:-${(r() * 6).toFixed(1)}s" cx="${(r() * 800) | 0}" cy="${(180 + r() * 110) | 0}" r="${(r() * 2 + 1).toFixed(1)}" fill="#7fe9df"/>`;
  }
  return (
    layer(
      4,
      sky(n, '#040615', '#0a1b4a', '#12437f') +
        stars(r, 30) +
        `<ellipse cx="400" cy="200" rx="500" ry="40" fill="#3fd0c4" opacity=".12"/><path d="${grid}" stroke="#3fd0c4" stroke-opacity=".35" fill="none"/>`,
    ) +
    layer(10, links + cubes + packets) +
    layer(20, q)
  );
}

function salon(n) {
  let arches = '';
  let cards = '';
  for (let i = 0; i < 8; i++) arches += `<path d="M${i * 110 - 20} 300V140a45 45 0 0 1 90 0V300z"/>`;
  [-26, -13, 0, 13, 26].forEach((d, j) => {
    cards += `<g transform="translate(400 258) rotate(${d})"><rect x="-13" y="-40" width="26" height="38" rx="3" fill="#f5f1e6"/><circle cx="0" cy="-21" r="4" fill="${j % 2 ? '#111' : '#c62828'}"/></g>`;
  });
  const stack = (x, y, c, k) => {
    let s = '';
    for (let q = 0; q < k; q++) s += `<ellipse cx="${x}" cy="${y - q * 5}" rx="14" ry="5" fill="${c}" stroke="#fff" stroke-opacity=".4"/>`;
    return s;
  };
  return (
    layer(4, sky(n, '#14081f', '#431532', '#6e2630') + `<g fill="#0004" stroke="#e0a85a" stroke-opacity=".35">${arches}</g>`) +
    layer(10, lantern(150, 80, '#ffb347') + lantern(330, 60, '#ff9d5c') + lantern(480, 100, '#ffb347') + lantern(660, 70, '#ff9d5c') + lantern(40, 120, '#ff9d5c')) +
    layer(
      20,
      `<ellipse cx="400" cy="300" rx="380" ry="70" fill="#0e5a50" stroke="#c9953a" stroke-width="4"/><g class="br" style="transform-origin:400px 258px">${cards}</g>` +
        stack(230, 282, '#c62828', 4) +
        stack(262, 288, '#1e6fd1', 3) +
        stack(560, 284, '#f2b632', 5) +
        stack(600, 290, '#c62828', 3),
    )
  );
}

function gear(x, y, r, c, t, reverse) {
  const n = Math.round(r / 4.5);
  const circ = 2 * Math.PI * r * 0.9;
  return `<g style="transform-origin:${x}px ${y}px;animation:rot ${t}s linear infinite${reverse ? ' reverse' : ''}"><circle cx="${x}" cy="${y}" r="${r * 0.9}" fill="none" stroke="${c}" stroke-width="${r * 0.22}" stroke-dasharray="${circ / n / 2} ${circ / n / 2}"/><circle cx="${x}" cy="${y}" r="${r * 0.78}" fill="#1a1208" stroke="${c}" stroke-width="4"/><path d="M${x - r * 0.7} ${y}H${x + r * 0.7}M${x} ${y - r * 0.7}V${y + r * 0.7}" stroke="${c}" stroke-width="5"/><circle cx="${x}" cy="${y}" r="${r * 0.2}" fill="${c}"/></g>`;
}

function machines(n) {
  let steam = '';
  for (let i = 0; i < 6; i++) steam += `<ellipse class="up" style="animation-delay:-${i}s" cx="${100 + i * 130}" cy="270" rx="26" ry="10" fill="#fff" opacity=".1"/>`;
  return (
    layer(
      4,
      sky(n, '#120c05', '#3a2711', '#7a5522') +
        '<g fill="#ffcf70" opacity=".18"><circle cx="300" cy="90" r="40"/><circle cx="620" cy="70" r="30"/></g>' +
        gear(120, 120, 90, '#6b4a1f', 60, 0) +
        gear(660, 110, 80, '#6b4a1f', 52, 1),
    ) +
    layer(10, gear(255, 150, 40, '#a8742c', 16, 1) + gear(150, 200, 60, '#c8923c', 24, 0) + gear(560, 170, 75, '#c8923c', 30, 0) + gear(470, 235, 35, '#a8742c', 14, 1)) +
    layer(20, '<rect y="288" width="800" height="12" fill="#0a0703"/>' + gear(690, 235, 45, '#e6b35a', 18, 1) + gear(330, 240, 55, '#e6b35a', 22, 0) + steam)
  );
}

export const SCENES = [city, dunes, network, salon, machines];
