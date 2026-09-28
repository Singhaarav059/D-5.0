// The page shell every page shares: <head> (meta, styles, scripts), the nav, <main> and the footer.
'use strict';

const C = require('../content');
const { SITE_URL, esc, pad, cal, icon, pic } = require('./helpers');
const { doodle } = require('./doodles');
const { ambient } = require('./ambient');
const { svcTile } = require('./shared');

const logo = `<a class="brand" href="./" aria-label="Demaze Technologies home"><img src="${C.logoMark}" alt="" width="28" height="28"><span>Demaze</span></a>`;

const NAV = [['Projects', './projects'], ['Services', './services'], ['About', './about-us'], ['Contact', './contact']];

const chevronDown = '<svg class="nav__caret" viewBox="0 0 12 12" aria-hidden="true"><path d="M3 4.5 6 7.5 9 4.5"/></svg>';

// The two menus that open from the bar: what we build (the four services, each with its icon and a line on what it
// covers) and the work (the three latest case studies, straight into their stories). Each ends with a way forward.
const dropServices = () => `<div class="nav__drop" id="drop-services" data-drop-panel>
    <div class="nav__drop-grid">${C.services.map((s) => svcTile(s)).join('')}</div>
    <div class="nav__drop-side">
      <p><b>Not sure where to start?</b>Tell us the problem. In 30 minutes we’ll sketch the route through it.</p>
      <a class="btn btn--primary btn--sm" ${cal}><span>Book a call</span><i class="btn__icon">${icon.arrow}</i></a>
      <a class="nav__drop-link" href="./services">All services ${icon.arrow}</a>
    </div>
  </div>`;
const dropWork = () => `<div class="nav__drop nav__drop--work" id="drop-work" data-drop-panel>
    <div class="nav__drop-grid nav__drop-grid--work">${C.projects.slice(0, 3).map((p) => `<a class="nav__case" href="./projects#${p.image}"><span class="nav__case-shot" style="--tint:${p.tint}">${pic(p.image, '', { sizes: '220px', cls: 'nav__case-img' })}</span><b>${esc(p.name)}</b><small>${esc(p.sector)}</small></a>`).join('')}</div>
    <div class="nav__drop-side">
      <p><b>${C.projects.length} products, designed and built</b>From luxury automotive and fintech to legal, commerce and senior care.</p>
      <a class="nav__drop-link" href="./projects">All projects ${icon.arrow}</a>
    </div>
  </div>`;
const DROPS = { Projects: ['work', dropWork], Services: ['services', dropServices] };

function layout({ title, description, slug, body, noindex = false }) {
  const current = (h) => (h === './' + slug ? ' aria-current="page"' : '');
  const links = NAV.map(([t, h]) => DROPS[t]
    ? `<a class="nav__trigger" href="${h}"${current(h)} aria-expanded="false" aria-controls="drop-${DROPS[t][0]}" data-drop="${DROPS[t][0]}">${t}${chevronDown}</a>`
    : `<a href="${h}"${current(h)}>${t}</a>`).join('');
  const canonical = `${SITE_URL}/${slug ? slug : ''}`;
  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<style>@view-transition { navigation: auto; }</style>
<title>${esc(title)}</title>
<meta name="description" content="${esc(description)}">
<meta name="theme-color" content="#eef0f6">
${noindex ? '<meta name="robots" content="noindex">' : `<link rel="canonical" href="${canonical}">`}
<link rel="icon" href="${C.logoMark}">
<meta property="og:title" content="${esc(title)}">
<meta property="og:description" content="${esc(description)}">
<meta property="og:image" content="${SITE_URL}/assets/img/og.png">
<meta property="og:image:width" content="1200">
<meta property="og:image:height" content="630">
<meta property="og:image:alt" content="Demaze: AI products, without the maze. A route through a maze ending in the Demaze chevron.">
<meta property="og:url" content="${canonical}">
<meta property="og:type" content="website">
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="${esc(title)}">
<meta name="twitter:description" content="${esc(description)}">
<meta name="twitter:image" content="${SITE_URL}/assets/img/og.png">
<link rel="stylesheet" href="./assets/fonts.css">
<link rel="stylesheet" href="./assets/site.css">
<script defer src="./assets/boot.js"></script>
<script defer src="./assets/vendor/gsap.min.js"></script>
<script defer src="./assets/vendor/ScrollTrigger.min.js"></script>
<script defer src="./assets/vendor/lenis.min.js"></script>
<script defer src="./assets/site.js"></script>
<script defer src="./assets/journey.js"></script>
<script defer src="./assets/ambient.js"></script>${slug === 'contact' ? '\n<script type="module" src="./assets/visit3d.js"></script>' : ''}${slug === 'projects' || !slug ? '\n<script defer src="./assets/reel-kit.js"></script>\n<script defer src="./assets/reel.js"></script>\n<link rel="modulepreload" href="./assets/reel3d.js" data-reel3d>' : ''}
</head>
<body class="page-${slug || 'home'}">
${ambient()}
<a class="skip" href="#main">Skip to content</a>
<header class="nav" data-nav>
  <div class="nav__bar">
    ${logo}
    <nav class="nav__links" aria-label="Primary" data-nav-links><i class="nav__pill" aria-hidden="true"></i>${links}</nav>
    <a class="btn btn--primary btn--sm nav__cta" ${cal}><span>Book a call</span></a>
    <button class="nav__toggle" type="button" aria-expanded="false" aria-controls="menu" aria-label="Open menu"><span></span><span></span></button>
    <i class="nav__progress" aria-hidden="true"></i>
    ${dropWork()}
    ${dropServices()}
  </div>
  <div class="nav__scrim" data-nav-scrim hidden></div>
  <div class="nav__menu" id="menu" hidden>
    <nav class="nav__menu-links" aria-label="Menu">${NAV.map(([t, h], i) => `<a href="${h}" style="--i:${i}"${current(h)}><small>${pad(i + 1)}</small>${t}${icon.arrow}</a>`).join('')}</nav>
    <div class="nav__menu-svcs" style="--i:${NAV.length}">${C.services.map((s) => svcTile(s)).join('')}</div>
    <div class="nav__menu-foot" style="--i:${NAV.length + 1}">
      <a class="btn btn--primary" ${cal}><span>Book a call</span><i class="btn__icon">${icon.arrow}</i></a>
      <a class="nav__menu-mail" href="mailto:${C.email}">${icon.mail}${C.email}</a>
    </div>
  </div>
</header>
<main id="main">
${body}
</main>
${footer(slug)}
</body>
</html>
`;
}

// The footer closes on the route from the hero, now with the four stages on it as stations (the middle of each run
// of the line, as percentages of the drawing), ending in the chevron and the name.
const STOPS = [['bulb', 'sun', 'Idea', 24.8, 22.5], ['pencil', 'lilac', 'Design', 46, 67.5, true], ['gear', 'sky', 'Build', 67.1, 32.5], ['rocket', 'tomato', 'Launch', 89, 50, true]];

// The footer opens with the next page on the route through the site (content.js `next`).
function footer(slug) {
  const [label, line, href] = C.next[slug] || C.next[''];
  return `<footer class="footer">
  <div class="footer__panel">
    <a class="footer__next" href="${href}" data-reveal><small>Next up · ${esc(label)}</small><span>${esc(line)}</span><i class="footer__next-arrow">${doodle('arrow', { color: 'sun' })}</i></a>
    <div class="footer__top">
      <div class="footer__intro">
        ${logo}
        <p>${esc(C.tagline)}</p>
        <div class="footer__social">${C.socials.map((s) => `<a href="${s.href}" target="_blank" rel="noopener" aria-label="${s.name}">${icon[s.icon]}</a>`).join('')}</div>
      </div>
      <div class="footer__cols">
        <div><h3>Company</h3>${NAV.map(([t, h]) => `<a href="${h}">${t}</a>`).join('')}</div>
        <div><h3>Services</h3>${C.services.map((s) => `<a href="./services#${s.id}">${esc(s.title)}</a>`).join('')}</div>
        <div><h3>Reach us</h3><a href="mailto:${C.email}">${C.email}</a><a ${cal}>Book with Calendly</a><a href="${C.mapUrl}" target="_blank" rel="noopener">${esc(C.address)}</a></div>
      </div>
    </div>
    <div class="footer__mark" aria-hidden="true" data-draw>
      <div class="footer__trail">
        <svg class="footer__route" viewBox="0 0 600 80" preserveAspectRatio="none"><path d="M0 62H84V18H214V54H338V26H468V40H600"/></svg>
        ${STOPS.map(([d, c, label, x, y, below], i) => `<span class="footer__stop${below ? ' is-below' : ''}" style="left:${x}%;top:${y}%;--i:${i};--dd:var(--${c})">${doodle(d, { color: c })}<b>${label}</b></span>`).join('')}
      </div>
      <svg class="footer__chevron" viewBox="0 0 10 10"><path d="M0 0L10 5L0 10L3 5Z"/></svg>
      <span class="footer__word">Demaze${doodle('star', { color: 'sun', cls: 'footer__spark' })}${doodle('star', { color: 'pink', cls: 'footer__spark footer__spark--2' })}</span>
    </div>
    <div class="footer__bottom"><span>Demaze Technologies © ${new Date().getFullYear()}. All rights reserved.</span><a href="#main" data-top>Back to top ↑</a></div>
  </div>
</footer>`;
}

module.exports = { layout };
