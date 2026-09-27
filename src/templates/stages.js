// "How we work": one small scene per stage, drawn as the work itself looks (the workshop wall and the brief, the
// wireframe becoming a prototype, the code and its integrations, the launch and the scale). Each is an SVG on a
// 260 x 140 sheet in the site's ink and marker colours. The markup is the finished picture; journey.js builds it up
// and loops it while its stage is the current one (with reduced motion or no JS the finished picture is what shows).
// Parts that move are wrapper <g>s without a transform attribute, so an animated transform never replaces the one
// that places them. Decoration only: aria-hidden, the stage's own text says it all.
'use strict';

const { esc } = require('./helpers');

// A sheet of paper with a soft offset shadow, the ground of every scene.
const sheet = '<rect class="jart__shadow" x="4" y="5" width="254" height="134" rx="14"/><rect class="jart__sheet" x="1" y="1" width="254" height="134" rx="14"/>';

// A window: frame, title bar with three dots and an optional title.
const win = (x, y, w, h, { dark = false, title = '' } = {}) => `<rect class="jart__win${dark ? ' is-dark' : ''}" x="${x}" y="${y}" width="${w}" height="${h}" rx="9"/>
  <path class="jart__bar${dark ? ' is-dark' : ''}" d="M${x} ${y + 15}h${w}"/>
  ${[0, 1, 2].map((i) => `<circle class="jart__dot${dark ? ' is-dark' : ''}" cx="${x + 9 + i * 6}" cy="${y + 7.5}" r="1.9"/>`).join('')}
  ${title ? `<text class="jart__wtitle${dark ? ' is-dark' : ''}" x="${x + w / 2}" y="${y + 10.5}">${esc(title)}</text>` : ''}`;

const tick = (x, y, s = 1) => `<path class="jart__tick" d="M${x} ${y}l${2.6 * s} ${2.6 * s} ${5 * s}-${5.4 * s}"/>`;

// 01 Discover & Define: sticky notes go up on the workshop wall, a lens reads them, an arrow carries them into the
// brief, and its three lines are ticked off.
const NOTES = [['Users', 'sun', 14, 16, -4], ['Goals', 'pink', 60, 12, 3], ['Scope', 'sky', 18, 60, 3], ['KPIs', 'mint', 64, 58, -3]];
const discover = () => `${sheet}
  ${NOTES.map(([t, c, x, y, r], i) => `<g class="ja-note" data-i="${i}"><g transform="translate(${x} ${y}) rotate(${r} 21 18)">
    <rect class="jart__note-shadow" x="1.5" y="2" width="42" height="37" rx="2.5"/><rect class="jart__note" style="--c:var(--${c})" width="42" height="37" rx="2.5"/>
    <text class="jart__label" x="7" y="14">${t}</text><path class="jart__scrawl" d="M7 22.5h26M7 29h17"/></g></g>`).join('')}
  <g class="ja-lens"><g transform="translate(38 36)"><circle class="jart__glass" r="12.5"/><path class="jart__ink" d="M9 9l9.5 9.5"/></g></g>
  <path class="ja-arrow jart__flow" d="M112 76c14 2 22-4 40-12" pathLength="1"/><path class="ja-arrow-head jart__ink" d="M146 60l7 3.5-5 6"/>
  <g class="ja-doc">
    <rect class="jart__paper" x="162" y="15" width="82" height="108" rx="8"/>
    <text class="jart__title" x="172" y="33">Brief</text>
    <rect class="ja-goal jart__mark" style="--c:var(--sun)" x="172" y="40" width="46" height="7" rx="3.5"/>
    ${[62, 80, 98].map((y, i) => `<g class="ja-row" data-i="${i}"><rect class="jart__box" x="172" y="${y - 5}" width="10" height="10" rx="2.5"/><rect class="jart__line" x="188" y="${y - 2.5}" width="${[44, 36, 40][i]}" height="5" rx="2.5"/><g class="ja-check">${tick(174.5, y - 0.5)}</g></g>`).join('')}
    <g class="ja-stamp"><g transform="translate(206 110) rotate(-8)"><rect class="jart__stamp" x="-26" y="-8" width="52" height="16" rx="4"/><text class="jart__stamp-t" y="3.6">Signed off</text></g></g>
  </g>`;

// 02 Design & Prototype: the wireframe is drawn, then painted into the real interface; the cursor clicks the button
// and the phone prototype moves to the next screen.
const design = () => `${sheet}
  <g class="ja-window">${win(12, 14, 156, 112, { title: 'Home' })}</g>
  <g class="ja-wire">
    <rect x="22" y="38" width="86" height="42" rx="6"/><rect x="22" y="87" width="62" height="5" rx="2.5"/><rect x="22" y="96" width="42" height="5" rx="2.5"/>
    <rect x="22" y="106" width="46" height="13" rx="6.5"/><rect x="116" y="38" width="42" height="37" rx="6"/><rect x="116" y="81" width="42" height="38" rx="6"/>
    <path d="M22 38l86 42M108 38L22 80"/>
  </g>
  <g class="ja-paint">
    <rect class="jart__fill" style="--c:var(--lilac-tint)" x="22" y="38" width="86" height="42" rx="6"/>
    <circle class="jart__fill" style="--c:var(--lilac)" cx="92" cy="52" r="8"/><path class="jart__hill" d="M22 74l20-16 14 10 10-7 22 17v2H22z"/>
    <text class="jart__h" x="30" y="56">New season</text><rect class="jart__fill" style="--c:var(--ink)" x="30" y="61" width="30" height="3.5" rx="1.75" opacity=".3"/>
    <rect class="jart__fill" style="--c:var(--ink)" x="22" y="87" width="62" height="5" rx="2.5" opacity=".75"/><rect class="jart__fill" style="--c:var(--ink)" x="22" y="96" width="42" height="5" rx="2.5" opacity=".3"/>
    <rect class="jart__card" x="116" y="38" width="42" height="37" rx="6"/><rect class="jart__fill" style="--c:var(--sun)" x="121" y="43" width="32" height="18" rx="3.5"/><rect class="jart__fill" style="--c:var(--ink)" x="121" y="66" width="22" height="3.5" rx="1.75" opacity=".45"/>
    <rect class="jart__card" x="116" y="81" width="42" height="38" rx="6"/><rect class="jart__fill" style="--c:var(--sky)" x="121" y="86" width="32" height="18" rx="3.5"/><rect class="jart__fill" style="--c:var(--ink)" x="121" y="109" width="26" height="3.5" rx="1.75" opacity=".45"/>
    <g class="ja-btn"><rect class="jart__btn" x="22" y="106" width="46" height="13" rx="6.5"/><text class="jart__btn-t" x="45" y="115">Get started</text></g>
    <circle class="ja-ripple jart__ripple" cx="45" cy="112.5" r="12"/>
  </g>
  <g class="ja-phone">
    <rect class="jart__device" x="184" y="12" width="62" height="116" rx="12"/>
    <clipPath id="ja-screen"><rect x="188" y="17" width="54" height="106" rx="8.5"/></clipPath>
    <g clip-path="url(#ja-screen)">
      <rect class="jart__screen" x="188" y="17" width="54" height="106"/>
      <g class="ja-screen-a">
        <rect class="jart__fill" style="--c:var(--lilac-tint)" x="192" y="28" width="46" height="30" rx="5"/><circle class="jart__fill" style="--c:var(--lilac)" cx="229" cy="37" r="5"/>
        <rect class="jart__fill" style="--c:var(--ink)" x="192" y="64" width="36" height="4" rx="2" opacity=".75"/><rect class="jart__fill" style="--c:var(--ink)" x="192" y="72" width="26" height="4" rx="2" opacity=".3"/>
        <rect class="jart__fill" style="--c:var(--sun)" x="192" y="82" width="21" height="17" rx="3"/><rect class="jart__fill" style="--c:var(--sky)" x="217" y="82" width="21" height="17" rx="3"/>
        <rect class="jart__fill" style="--c:var(--ink)" x="192" y="106" width="30" height="9" rx="4.5"/>
      </g>
      <g class="ja-screen-b">
        <rect class="jart__screen" x="188" y="17" width="54" height="106"/>
        <circle class="jart__fill" style="--c:var(--mint)" cx="215" cy="56" r="13"/>${tick(208.5, 56, 1.35)}
        <rect class="jart__fill" style="--c:var(--ink)" x="197" y="78" width="36" height="4.5" rx="2.25" opacity=".75"/><rect class="jart__fill" style="--c:var(--ink)" x="202" y="87" width="26" height="4" rx="2" opacity=".3"/>
      </g>
    </g>
    <rect class="jart__notch" x="207" y="19.5" width="16" height="3.5" rx="1.75"/>
  </g>
  <g class="ja-cursor"><g transform="translate(47 111)"><path class="jart__cursor" d="M0 0v15l4-3.6 3 6.6 3-1.4-3-6.4h5.4z"/></g></g>`;

// 03 Build & Integrate: code is typed into the editor, the services it talks to light up as data runs down the wires,
// and the tests go green.
const CODE = [[['lilac', 14], ['text', 22], ['sky', 30]], [['text', 10], ['sun', 38]], [['lilac', 18], ['text', 16], ['mint', 26]], [['text', 12], ['sky', 24], ['text', 14]], [['lilac', 10], ['sun', 30]], [['text', 20]]];
const build = () => `${sheet}
  <g class="ja-editor">${win(12, 14, 150, 112, { dark: true, title: 'orders.ts' })}
    ${CODE.map((_, i) => `<text class="jart__ln" x="24" y="${43 + i * 11.5}">${i + 1}</text>`).join('')}
    ${CODE.map((line, i) => { let x = 34; return `<g class="ja-code" data-i="${i}">${line.map(([c, w]) => { const r = `<rect class="jart__tok" style="--c:${c === 'text' ? 'rgba(244,241,234,.55)' : `var(--${c})`}" x="${x}" y="${39.5 + i * 11.5}" width="${w}" height="4.6" rx="2.3"/>`; x += w + 4; return r; }).join('')}</g>`; }).join('')}
    <path class="jart__status" d="M12 112h150v5a9 9 0 01-9 9H21a9 9 0 01-9-9z"/>
    <g class="ja-running"><circle class="jart__spin" cx="22" cy="119" r="3.4" pathLength="1"/><text class="jart__status-t" x="30" y="122">Running tests…</text></g>
    <g class="ja-passed"><circle class="jart__fill" style="--c:var(--mint)" cx="22" cy="119" r="4.2"/>${tick(19.6, 119.2, 0.62)}<text class="jart__status-t is-ok" x="30" y="122">128 tests passed</text></g>
  </g>
  ${[['API', 34, 'sky'], ['Database', 70, 'sun'], ['AI model', 106, 'lilac']].map(([t, y, c], i) => `
  <path class="jart__wire" d="M162 ${[52, 70, 88][i]}C178 ${[52, 70, 88][i]} 176 ${y} 188 ${y}"/>
  <path class="ja-packet jart__packet" data-i="${i}" style="--c:var(--${c})" d="M162 ${[52, 70, 88][i]}C178 ${[52, 70, 88][i]} 176 ${y} 188 ${y}" pathLength="1"/>
  <g class="ja-node" data-i="${i}"><rect class="jart__paper" x="188" y="${y - 12}" width="60" height="24" rx="7"/><circle class="jart__fill ja-led" style="--c:var(--${c})" cx="199" cy="${y}" r="4"/><text class="jart__label" x="207" y="${y + 3.4}">${t}</text></g>`).join('')}`;

// 04 Launch & Scale: the product goes live, active users climb, and servers are added as the load grows.
const LINE = [[22, 112], [38, 107], [54, 109], [70, 99], [86, 96], [102, 84], [118, 80], [134, 68], [150, 58]];
const launch = () => {
  const d = `M${LINE.map((p) => p.join(' ')).join('L')}`;
  return `${sheet}
  <g class="ja-chart"><rect class="jart__paper" x="12" y="14" width="150" height="112" rx="9"/>
    <text class="jart__small" x="22" y="31">Active users</text>
    <text class="jart__big" x="22" y="49"><tspan class="ja-count">24.8</tspan>k</text>
    <g class="ja-growth"><rect class="jart__fill" style="--c:var(--mint-tint)" x="70" y="39" width="34" height="13" rx="6.5"/><text class="jart__pill-t is-ok" x="87" y="48.2">+38%</text></g>
    <g class="ja-live"><rect class="jart__fill" style="--c:var(--tomato-tint)" x="118" y="21" width="36" height="14" rx="7"/><circle class="jart__fill ja-live-dot" style="--c:var(--tomato)" cx="126" cy="28" r="2.6"/><text class="jart__pill-t" x="140" y="31.2">Live</text></g>
    <path class="jart__grid" d="M22 64H152M22 82H152M22 100H152M22 118H152"/>
    <path class="ja-area jart__area" d="${d}L150 118H22z"/>
    <path class="ja-line jart__trend" d="${d}" pathLength="1"/>
    <g class="ja-peak"><circle class="jart__halo" cx="150" cy="58" r="7"/><circle class="jart__peak" cx="150" cy="58" r="3.4"/></g>
  </g>
  <text class="jart__small" x="178" y="28">Servers</text>
  ${[0, 1, 2, 3].map((i) => `<g class="ja-server" data-i="${i}"><rect class="jart__paper" x="178" y="${35 + i * 21}" width="68" height="16" rx="5"/><circle class="jart__fill ja-led" style="--c:var(--mint)" cx="187" cy="${43 + i * 21}" r="2.4"/><rect class="jart__line" x="194" y="${41 + i * 21}" width="${[30, 24, 28, 20][i]}" height="4" rx="2"/><rect class="jart__meter" x="230" y="${39.5 + i * 21}" width="10" height="7" rx="1.5"/></g>`).join('')}
  <text class="jart__small is-ok" x="178" y="124">99.99% uptime</text>`;
};

const SCENES = [['discover', discover], ['design', design], ['build', build], ['launch', launch]];

const stageArt = (i) => {
  const [name, draw] = SCENES[i % SCENES.length];
  return `<svg class="jart" viewBox="0 0 260 140" data-scene="${name}" aria-hidden="true" focusable="false">${draw()}</svg>`;
};

module.exports = { stageArt };
