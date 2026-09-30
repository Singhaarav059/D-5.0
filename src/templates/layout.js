// The page shell every page shares: <head> (meta, styles, scripts), the background, the nav, <main>, the footer and
// the curtain that sweeps between pages (site.js).
'use strict';

const C = require('../content');
const { SITE_URL, esc, pad, cal, caseHref, pic, icon, SVC_ART } = require('./helpers');
const { doodle } = require('./doodles');
const { chevron } = require('./maze');

const NAV = [['Projects', './projects'], ['Services', './services'], ['About', './about-us'], ['Contact', './contact']];

// A service as a small tile: its drawing, name and what it covers (the Services menu and the phone menu).
const svcTile = (s) => `<a class="nav__svc" href="./services#${s.id}"><span class="nav__svc-icon" style="--dd:var(--${SVC_ART[s.id][1]})">${doodle(SVC_ART[s.id][0], { color: SVC_ART[s.id][1] })}</span><span><b>${esc(s.title)}</b><small>${esc(s.summary)}</small></span></a>`;
const chevronDown = '<svg class="nav__caret" viewBox="0 0 12 12" aria-hidden="true"><path d="M3 4.5 6 7.5 9 4.5"/></svg>';

// The two menus that open from the bar, each a preview of its page: the three latest case studies, and the four
// services. Each ends with a way forward.
const dropWork = () => `<div class="nav__drop nav__drop--work" id="drop-work" data-drop-panel>
    <div class="nav__drop-grid nav__drop-grid--work">${C.projects.slice(0, 3).map((p) => `<a class="nav__case" href="${caseHref(p)}"><span class="nav__case-shot" style="--tint:${p.tint}">${pic(p.image, '', { sizes: '220px', cls: 'nav__case-img' })}</span><b>${esc(p.name)}</b><small>${esc(p.sector)}</small></a>`).join('')}</div>
    <div class="nav__drop-side">
      <p><b>${C.projects.length} products, designed and built</b>From luxury automotive and fintech to legal, commerce and senior care.</p>
      <a class="nav__drop-link" href="./projects">All projects ${icon.arrow}</a>
    </div>
  </div>`;
const dropServices = () => `<div class="nav__drop" id="drop-services" data-drop-panel>
    <div class="nav__drop-grid">${C.services.map(svcTile).join('')}</div>
    <div class="nav__drop-side">
      <p><b>Not sure where to start?</b>Tell us the problem and we’ll map the route: what to build first, and what to skip.</p>
      <a class="btn btn--blue btn--sm" ${cal}><span>Book a call</span><i class="btn__dot" aria-hidden="true">→</i></a>
      <a class="nav__drop-link" href="./services">All services ${icon.arrow}</a>
    </div>
  </div>`;
const DROPS = { Projects: ['work', dropWork], Services: ['services', dropServices] };

// The background: an aura in the colour of the section in view (site.js follows [data-room]), two quiet glows and the
// maze tile; on screens with wide margins, five doodles drift in them.
const DRIFT = [
  ['left:2.5%;top:24%;width:30px', '0 0 24 24', '<path d="M12 2l2.6 6.4L21 9l-5 4.4L17.5 20 12 16.6 6.5 20 8 13.4 3 9l6.4-.6z" fill="#ffcb45" stroke="#f4f1ea" stroke-width="1.4" stroke-linejoin="round"/>'],
  ['right:3%;top:38%;width:46px', '0 0 40 20', '<path d="M2 12c5-10 9 6 14-2s9 6 14-2 6 4 8 2" fill="none" stroke="#ff85b8" stroke-width="3" stroke-linecap="round"/>'],
  ['left:4%;top:70%;width:26px', '0 0 24 24', '<circle cx="12" cy="12" r="8" fill="#2fd0a0"/><circle cx="12" cy="12" r="8" fill="none" stroke="#f4f1ea" stroke-width="1.4" stroke-dasharray="3 3"/>'],
  ['right:4.5%;top:14%;width:24px', '0 0 24 24', '<path d="M12 1v22M1 12h22M4.5 4.5l15 15M19.5 4.5l-15 15" stroke="#62c1ff" stroke-width="2" stroke-linecap="round"/>'],
  ['right:2.5%;top:78%;width:28px', '0 0 24 24', '<path d="M4 12l6 6L20 5" fill="none" stroke="#a58bff" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>'],
];
const backdrop = () => `<div class="bg" aria-hidden="true"><div class="bg__aura" data-aura></div><div class="bg__glow"></div><div class="bg__maze"></div></div>
<div class="drift" aria-hidden="true">${DRIFT.map(([pos, vb, art]) => `<svg data-drift viewBox="${vb}" style="${pos}">${art}</svg>`).join('')}</div>`;

// `section` is the nav entry a page belongs under (a case study sits under Projects); `schema` is its structured data
// (templates/schema.js), `og` a sharing image other than the site card, `next` the footer's next stop, `room` the
// colour the aura starts in.
// Pages that show project reels (home, projects and the case studies) load the reel player and GSAP, which it runs on.
function layout({ title, description, slug, body, noindex = false, section = slug, schema = [], og = null, next = null }) {
  const reels = !slug || section === 'projects';
  const current = (h) => (h === './' + section ? ' aria-current="page"' : '');
  const canonical = `${SITE_URL}/${slug ? slug : ''}`;
  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${esc(title)}</title>
<meta name="description" content="${esc(description)}">
<meta name="theme-color" content="#0b0b10">
<meta name="color-scheme" content="dark">
${noindex ? '<meta name="robots" content="noindex">' : `<link rel="canonical" href="${canonical}">`}
<link rel="icon" href="${C.logoMark}">
<link rel="apple-touch-icon" href="./assets/img/icon-180.png">
<link rel="manifest" href="./manifest.webmanifest">
<meta name="apple-mobile-web-app-title" content="Demaze">
<meta property="og:title" content="${esc(title)}">
<meta property="og:description" content="${esc(description)}">
${og ? `<meta property="og:image" content="${og.url}">
<meta property="og:image:width" content="${og.w}">
<meta property="og:image:height" content="${og.h}">
<meta property="og:image:alt" content="${esc(og.alt)}">` : `<meta property="og:image" content="${SITE_URL}/assets/img/og.png">
<meta property="og:image:width" content="1200">
<meta property="og:image:height" content="630">
<meta property="og:image:alt" content="Demaze: AI products, without the maze. A route through a maze ending in the Demaze chevron.">`}
<meta property="og:url" content="${canonical}">
<meta property="og:type" content="website">
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="${esc(title)}">
<meta name="twitter:description" content="${esc(description)}">
<meta name="twitter:image" content="${og ? og.url : `${SITE_URL}/assets/img/og.png`}">
<link rel="stylesheet" href="./assets/fonts.css">
<link rel="stylesheet" href="./assets/site.css">
<script src="./assets/boot.js"></script>
<script defer src="./assets/site.js"></script>${slug === 'contact' ? '\n<script type="module" src="./assets/visit3d.js"></script>' : ''}${reels ? '\n<script defer src="./assets/vendor/gsap.min.js"></script>\n<script defer src="./assets/reel-kit.js"></script>\n<script defer src="./assets/reel.js"></script>\n<link rel="modulepreload" href="./assets/reel3d.js" data-reel3d>' : ''}
${schema.map((d) => `\n<script type="application/ld+json">${JSON.stringify(d).replace(/</g, '\\u003c')}</script>`).join('')}
</head>
<body class="page-${(slug || 'home').replace(/\//g, '-')}" data-crew-src="./assets/crew3d.js">
<div class="curtain" data-curtain aria-hidden="true"><div class="curtain__inner">
  <span class="curtain__kicker">${chevron()}Demaze · on the route to</span>
  <span class="curtain__label" data-curtain-label></span>
  <span class="curtain__march" aria-hidden="true">${march()}</span>
  ${[['star', 'sun'], ['rocket', 'tomato'], ['bulb', 'sky'], ['heart', 'pink']].map(([d, c], i) => doodle(d, { color: c, cls: `curtain__dd curtain__dd--${i + 1}` })).join('')}
</div></div>
${backdrop()}
<a class="skip" href="#main">Skip to content</a>
<header class="nav" data-nav>
  <div class="nav__bar">
    <a class="nav__brand" href="./" aria-label="Demaze Technologies home"><img src="${C.logoMark}" alt="" width="24" height="24"><span>Demaze</span></a>
    <nav class="nav__links" aria-label="Primary" data-nav-links><i class="nav__pill" aria-hidden="true"></i>${NAV.map(([t, h]) => (DROPS[t]
      ? `<a class="nav__trigger" href="${h}"${current(h)} aria-expanded="false" aria-controls="drop-${DROPS[t][0]}" data-drop="${DROPS[t][0]}">${t}${chevronDown}</a>`
      : `<a href="${h}"${current(h)}>${t}</a>`)).join('')}</nav>
    <a class="btn btn--blue btn--sm nav__cta" ${cal} data-magnet><span>Book a call</span><i class="btn__dot" aria-hidden="true">→</i></a>
    <button class="nav__toggle" type="button" aria-expanded="false" aria-controls="menu" aria-label="Open menu" data-menu-toggle><span></span><span></span></button>
    <i class="nav__progress" data-progress aria-hidden="true"></i>
    ${dropWork()}
    ${dropServices()}
  </div>
  <div class="nav__scrim" data-nav-scrim hidden></div>
  <div class="nav__menu" id="menu" hidden>
    <nav class="nav__menu-links" aria-label="Menu">${NAV.map(([t, h], i) => `<a href="${h}" style="--i:${i}"${current(h)}><small>${pad(i + 1)}</small>${t}${icon.arrow}</a>`).join('')}</nav>
    <div class="nav__menu-svcs" style="--i:${NAV.length}">${C.services.map(svcTile).join('')}</div>
    <div class="nav__menu-foot" style="--i:${NAV.length + 1}">
      <a class="btn btn--blue" ${cal}><span>Book a call</span><i class="btn__dot" aria-hidden="true">→</i></a>
      <a class="nav__menu-mail" href="mailto:${C.email}">${C.email}</a>
    </div>
  </div>
</header>
<main id="main">
${body}
</main>
${footer(next || C.next[slug] || C.next[''])}
</body>
</html>
`;
}

// The curtain's loader: five chevrons (the logo's arrow) made of dots, one per stage colour and the brand blue, lit in
// a wave that marches left to right (site.css .curtain__march).
const MARCH = ['var(--sun)', 'var(--lilac)', 'var(--sky)', 'var(--tomato)', 'var(--blue)'];
function march() {
  const rows = 9, pitch = 9, dots = [];
  MARCH.forEach((c, k) => {
    for (let r = 0; r < rows; r++) {
      const x = 4 - Math.abs(r - 4);
      for (const dx of [0, 1]) dots.push(`<i style="--x:${k * pitch + x + dx};--y:${r};--c:${c}"></i>`);
    }
  });
  return dots.join('');
}

// The footer: the next page on the route through the site (content.js `next`), the links, then the route itself
// (Idea → Design → Build → Launch) as a field of dots (site.js lights the route dot by dot, each stop rippling in its
// colour as the head passes; the SVG is the drawing without JS or with reduced motion), then the chevron and the name.
const ROUTE = 'M0 62H84V18H214V54H338V26H468V40H600';
const STOPS = [[149, 18, 'var(--sun)', 'Idea', 2], [276, 54, 'var(--lilac)', 'Design', 80], [403, 26, 'var(--sky)', 'Build', 10], [534, 40, 'var(--tomato)', 'Launch', 66]];
function footer([label, line, href]) {
  return `<footer class="footer" data-room="#3d5afe">
  <div class="footer__panel">
    <a class="footer__next" href="${href}" data-reveal><span><small>Next up · ${esc(label)}</small><b>${esc(line)}</b></span><i data-magnet aria-hidden="true">→</i></a>
    <div class="footer__cols">
      <div class="footer__intro"><span class="footer__brand"><img src="${C.logoMark}" alt="" width="26" height="26">Demaze</span><p>AI, software engineering and automation with deep industry expertise, as a long-term partner.</p></div>
      <div><h3>Company</h3>${NAV.map(([t, h]) => `<a href="${h}">${t}</a>`).join('')}</div>
      <div><h3>Services</h3>${C.services.map((s) => `<a href="./services#${s.id}">${esc(s.title)}</a>`).join('')}</div>
      <div><h3>Reach us</h3><a href="mailto:${C.email}">${C.email}</a><a ${cal}>Book a 30-minute call</a><a href="./contact#brief">Send a brief</a><a class="footer__addr" href="${C.mapUrl}" target="_blank" rel="noopener">${esc(C.address)}</a></div>
    </div>
    <div class="footer__mark" aria-hidden="true">
      <div class="footer__route-head"><span>The route, every time</span><span>Idea → Launch</span></div>
      <div class="footer__matrix" data-matrix data-route="${ROUTE}" data-stops="${esc(JSON.stringify(STOPS.map(([x, y, c, t, ty]) => [x, y, c.slice(6, -1), t, ty < y ? -1 : 1])))}">
        <svg class="footer__route" viewBox="-10 -6 620 100">
          <path class="is-track" d="${ROUTE}"/>
          <path class="is-drawn" data-drawin data-dur="2600" pathLength="1" d="${ROUTE}"/>
          ${STOPS.map(([x, y, c, t, ty]) => `<circle cx="${x}" cy="${y}" r="7" style="fill:${c}"/><text x="${x}" y="${ty}">${t.toUpperCase()}</text>`).join('')}
        </svg>
      </div>
      <div class="footer__word">${chevron()}<span data-words><span data-w>Demaze</span></span></div>
    </div>
    <div class="footer__bottom">
      <span>Demaze Technologies © ${new Date().getFullYear()} · Ahmedabad, India</span>
      <span class="footer__links"><a href="#main">Back to top ↑</a>${C.socials.map((s) => `<a href="${s.href}" target="_blank" rel="noopener">${s.name}</a>`).join('')}</span>
    </div>
  </div>
</footer>`;
}

module.exports = { layout, NAV };
