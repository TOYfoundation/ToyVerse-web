// Structure of the website. Texts live in src/i18n/locales/*.json under pages.<id>.
// hue: accent colour of the page (HSL hue), scene: first hero scene (0 city,
// 1 caravan, 2 chain network, 3 game salon, 4 machine hall).

export interface PageDef {
  id: string;
  hue: number;
  scene: number;
  /** step diagram "So greift alles ineinander": node positions, labels come from pages.<id>.flow */
  flow?: { h: number; nodes: [number, number][]; edges: [number, number][] };
}

export interface GroupDef {
  id: string;
  pages: string[];
}

export const PAGES: PageDef[] = [
  { id: 'start', hue: 262, scene: 0 },
  {
    id: 'verse',
    hue: 200,
    scene: 0,
    flow: {
      h: 300,
      nodes: [[200, 30], [62, 110], [200, 110], [338, 110], [62, 200], [200, 200], [338, 275]],
      edges: [[0, 1], [1, 2], [2, 4], [2, 5], [5, 6], [3, 2], [3, 5]],
    },
  },
  {
    id: 'toyquest',
    hue: 35,
    scene: 1,
    flow: { h: 210, nodes: [[62, 40], [200, 40], [338, 40], [338, 170], [200, 170]], edges: [[0, 1], [1, 2], [2, 3], [3, 4], [4, 0]] },
  },
  { id: 'zeit', hue: 150, scene: 4 },
  { id: 'maschinen', hue: 20, scene: 4 },
  {
    id: 'gangs',
    hue: 320,
    scene: 0,
    flow: { h: 210, nodes: [[62, 40], [200, 40], [338, 40], [200, 120], [62, 190]], edges: [[0, 1], [1, 2], [2, 3], [3, 0], [0, 4]] },
  },
  {
    id: 'salon',
    hue: 350,
    scene: 3,
    flow: { h: 210, nodes: [[62, 40], [200, 40], [338, 40], [200, 120]], edges: [[0, 1], [1, 2], [3, 2]] },
  },
  {
    id: 'toypay',
    hue: 190,
    scene: 2,
    flow: { h: 210, nodes: [[62, 40], [200, 40], [338, 40], [200, 170], [62, 170]], edges: [[0, 1], [1, 2], [1, 3], [3, 4], [1, 0]] },
  },
  { id: 'toycoin', hue: 45, scene: 2 },
  {
    id: 'wallet',
    hue: 280,
    scene: 2,
    flow: { h: 210, nodes: [[62, 40], [200, 40], [338, 40], [200, 170]], edges: [[0, 1], [1, 2], [2, 3], [3, 1]] },
  },
  {
    id: 'toycash',
    hue: 300,
    scene: 0,
    flow: { h: 210, nodes: [[62, 40], [200, 40], [338, 40], [200, 170], [62, 170]], edges: [[0, 1], [1, 2], [2, 3], [3, 1], [1, 4]] },
  },
  { id: 'offline', hue: 330, scene: 1 },
  {
    id: 'toychain',
    hue: 170,
    scene: 2,
    flow: { h: 210, nodes: [[62, 40], [200, 40], [338, 40], [200, 120], [200, 190]], edges: [[0, 1], [1, 2], [2, 3], [3, 4], [3, 0]] },
  },
  { id: 'mint', hue: 120, scene: 2 },
  { id: 'tx', hue: 210, scene: 2 },
  {
    id: 'toyscan',
    hue: 140,
    scene: 2,
    flow: { h: 210, nodes: [[62, 40], [200, 40], [338, 40], [200, 120], [200, 190]], edges: [[0, 3], [1, 3], [2, 3], [3, 4]] },
  },
  {
    id: 'toysafe',
    hue: 0,
    scene: 2,
    flow: {
      h: 210,
      nodes: [[62, 40], [200, 40], [338, 40], [338, 170], [200, 170], [62, 170]],
      edges: [[0, 1], [1, 2], [2, 3], [3, 4], [4, 1], [1, 5]],
    },
  },
  { id: 'ketten', hue: 230, scene: 1 },
  {
    id: 'roadmap',
    hue: 60,
    scene: 1,
    flow: { h: 210, nodes: [[62, 40], [200, 40], [338, 40], [200, 120], [200, 190]], edges: [[0, 1], [1, 2], [2, 3], [3, 4]] },
  },
  { id: 'download', hue: 10, scene: 4 },
  { id: 'community', hue: 100, scene: 0 },
  { id: 'kontakt', hue: 100, scene: 0 },
  { id: 'impressum', hue: 230, scene: 4 },
  { id: 'datenschutz', hue: 230, scene: 4 },
];

export const GROUPS: GroupDef[] = [
  { id: 'entdecken', pages: ['start', 'verse'] },
  { id: 'spielen', pages: ['toyquest', 'zeit', 'maschinen', 'gangs', 'salon'] },
  { id: 'bezahlen', pages: ['toypay', 'toycoin', 'wallet', 'toycash', 'offline'] },
  { id: 'technik', pages: ['toychain', 'mint', 'tx', 'toyscan', 'toysafe', 'ketten'] },
  { id: 'mitmachen', pages: ['roadmap', 'download', 'community', 'kontakt', 'impressum', 'datenschutz'] },
];

/**
 * "Passt dazu": pages that belong together across groups, so every part of
 * the ToyVerse links to the parts it works with (toycoin docs/spaeter/11-toyverse.md).
 */
export const RELATED: Record<string, string[]> = {
  verse: ['toychain', 'toypay', 'toyscan', 'toysafe'],
  toyquest: ['zeit', 'gangs', 'toypay'],
  zeit: ['maschinen', 'toychain', 'mint'],
  maschinen: ['zeit', 'toychain', 'toyquest'],
  gangs: ['toyquest', 'salon', 'toychain'],
  salon: ['toyquest', 'gangs', 'community'],
  toypay: ['toysafe', 'wallet', 'toycash', 'offline'],
  toycoin: ['toychain', 'mint', 'toyscan', 'ketten'],
  wallet: ['toysafe', 'toypay', 'toycoin'],
  toycash: ['offline', 'toypay', 'toysafe'],
  offline: ['toycash', 'toypay', 'toysafe'],
  toychain: ['mint', 'tx', 'toyscan', 'toysafe'],
  mint: ['toychain', 'toycoin', 'tx'],
  tx: ['toychain', 'mint', 'wallet'],
  toyscan: ['toysafe', 'toycoin', 'ketten'],
  toysafe: ['toypay', 'toyscan', 'wallet', 'community'],
  ketten: ['toycoin', 'toyscan', 'toysafe'],
  roadmap: ['toychain', 'download', 'community'],
  download: ['roadmap', 'toypay', 'wallet'],
  community: ['kontakt', 'roadmap', 'toysafe'],
  kontakt: ['community', 'wallet', 'download'],
};

/** Reading order for "previous / next". */
export const ORDER: string[] = GROUPS.flatMap((g) => g.pages);

export function page(id: string): PageDef {
  const p = PAGES.find((x) => x.id === id);
  if (!p) throw new Error(`Unknown page: ${id}`);
  return p;
}

export function groupOf(id: string): GroupDef {
  const g = GROUPS.find((x) => x.pages.includes(id));
  if (!g) throw new Error(`Page without group: ${id}`);
  return g;
}

/** Link to a page in a language, respecting the configured base path. */
export function href(lang: string, id: string): string {
  const base = import.meta.env.BASE_URL.replace(/\/?$/, '/');
  return id === 'start' ? `${base}${lang}/` : `${base}${lang}/${id}/`;
}
