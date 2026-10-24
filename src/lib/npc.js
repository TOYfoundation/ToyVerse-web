// NPC figures of the ToyVerse (merchant, guard, scholar, sultan, caravan leader),
// ported from the website draft of 24.10.2026. Used at build time and in the
// browser (poker table, voucher demo). Animations: .n0 to .n4 and .wk1 in global.css.

const NP = [
  ['#2f9e6f', '#e8c26a', '#e0a77c'],
  ['#5b6280', '#c9953a', '#c98f66'],
  ['#6a3fb5', '#f1e6c8', '#e8b48a'],
  ['#a3262a', '#f2b632', '#d9a074'],
  ['#c27a2c', '#e8d8b0', '#b97d55'],
];

export function npc(i) {
  const [robe, trim, skin] = NP[i];
  const hat = [
    `<ellipse cx="50" cy="33" rx="17" ry="9" fill="${trim}"/><path d="M36 33q14-18 28 0z" fill="${trim}"/><circle cx="50" cy="22" r="3" fill="#c62828"/>`,
    '<path d="M36 40a14 14 0 0 1 28 0z" fill="#9aa0b8"/><rect x="48" y="22" width="4" height="10" fill="#c9953a"/>',
    `<rect x="37" y="27" width="26" height="9" rx="4" fill="${trim}"/><circle cx="50" cy="26" r="3" fill="#7a5522"/>`,
    `<path d="M37 36l3-15 5 8 5-11 5 11 5-8 3 15z" fill="${trim}"/><circle cx="50" cy="20" r="2.5" fill="#c62828"/>`,
    `<path d="M35 42q0-22 15-22t15 22q-7-9-15-9t-15 9z" fill="${trim}"/>`,
  ][i];
  const beard = ['', '', '<path d="M38 50q12 18 24 0q-12 6-24 0z" fill="#eee"/>', '<path d="M40 50q10 14 20 0q-10 5-20 0z" fill="#2a1a10"/>', ''][i];
  const face = [
    '<path d="M44 48q6-3 12 0" stroke="#3a2a18" stroke-width="2" fill="none"/>',
    '',
    '<circle cx="45" cy="43" r="4" fill="none" stroke="#333"/><circle cx="55" cy="43" r="4" fill="none" stroke="#333"/>',
    '',
    '',
  ][i];
  const leftHand = ['', '<path d="M6 66h22v22q-11 12-22 0z" fill="#7a2a2a" stroke="#c9953a" stroke-width="2"/>', '', '', ''][i];
  const rightHand = [
    '<g class="bm"><path d="M58 98H92" stroke="#7a5522" stroke-width="2"/><path d="M60 98l-4 12h8zM90 98l-4 12h8z" fill="#c9953a"/></g>',
    '<g class="sp"><path d="M75 24V146" stroke="#8a6a3a" stroke-width="3"/><path d="M75 14l-4 12h8z" fill="#cfd3e6"/></g>',
    '',
    '<path d="M74.5 100V68" stroke="#c9953a" stroke-width="3"/><circle cx="74.5" cy="65" r="4" fill="#2fd0c4"/>',
    `<path d="M75 36V146" stroke="#8a6a3a" stroke-width="3"/><circle cx="75" cy="34" r="3.5" fill="${trim}"/>`,
  ][i];
  const extra = i === 0 ? '<ellipse cx="14" cy="134" rx="11" ry="9" fill="#b58a4a"/><path d="M9 126q5-6 10 0" stroke="#7a5522" stroke-width="2" fill="none"/>' : '';
  const book =
    i === 2
      ? '<rect x="38" y="84" width="24" height="16" rx="2" fill="#7a3f1f"/><rect x="39" y="85" width="11" height="14" fill="#efe6cf"/><rect class="pg2" x="50" y="85" width="11" height="14" fill="#f5f1e6"/>'
      : '';
  const cape = i === 3 ? '<path class="cpe" d="M28 58Q50 50 72 58L86 130Q50 142 14 130z" fill="#6e1216"/>' : '';
  return (
    `<svg class="n n${i}${i === 4 ? ' wk1' : ''}" viewBox="0 0 100 150" aria-hidden="true"><ellipse cx="50" cy="145" rx="24" ry="4" fill="#000" opacity=".25"/>${extra}<g class="bd">${cape}` +
    '<g class="lgA" style="transform-origin:42px 104px"><rect x="37" y="104" width="10" height="36" rx="4" fill="#2b2140"/><path d="M34 138h15v5h-17z" fill="#3a2a18"/></g>' +
    '<g class="lgB" style="transform-origin:58px 104px"><rect x="53" y="104" width="10" height="36" rx="4" fill="#2b2140"/><path d="M51 138h15v5h-17z" fill="#3a2a18"/></g>' +
    `<path d="M30 60Q50 52 70 60L75 114Q50 122 25 114z" fill="${robe}"/><rect x="27" y="90" width="46" height="6" fill="${trim}"/><path d="M43 58L50 72L57 58z" fill="${trim}"/>${book}` +
    `<g class="aL" style="transform-origin:25px 62px"><rect x="21" y="62" width="9" height="32" rx="4.5" fill="${robe}"/><circle cx="25.5" cy="96" r="4.5" fill="${skin}"/>${leftHand}</g>` +
    `<g class="aR" style="transform-origin:75px 62px"><rect x="70" y="62" width="9" height="32" rx="4.5" fill="${robe}"/><circle cx="74.5" cy="96" r="4.5" fill="${skin}"/>${rightHand}</g>` +
    `<g class="hd" style="transform-origin:50px 58px"><rect x="46" y="54" width="8" height="6" fill="${skin}"/><circle cx="50" cy="44" r="13" fill="${skin}"/>${beard}` +
    '<g class="ey"><circle cx="45" cy="43" r="1.6" fill="#222"/><circle cx="55" cy="43" r="1.6" fill="#222"/></g>' +
    `<path class="mo" d="M46 51q4 3 8 0" stroke="#5a2a1a" stroke-width="1.6" fill="none" stroke-linecap="round"/>${face}${hat}</g></g></svg>`
  );
}

/** Small icons of the start page tiles. */
export const ICON_GEAR =
  '<svg viewBox="0 0 80 80" aria-hidden="true"><g class="rt"><circle cx="40" cy="40" r="24" fill="none" stroke="var(--acc)" stroke-width="9" stroke-dasharray="6.3 6.3"/><circle cx="40" cy="40" r="18" fill="var(--sf)" stroke="var(--acc)" stroke-width="3"/><circle cx="40" cy="40" r="5" fill="var(--acc)"/></g></svg>';
export const ICON_COIN =
  '<svg viewBox="0 0 80 80" aria-hidden="true"><circle cx="40" cy="40" r="30" fill="#c58f1f" stroke="#f2b632" stroke-width="5"/><text x="40" y="52" text-anchor="middle" font-size="34" font-weight="700" font-family="Georgia,serif" fill="#7a5200">T</text></svg>';
