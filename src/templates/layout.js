// The page shell every page shares: <head> (meta, styles, scripts), the nav, <main> and the footer.
'use strict';

const C = require('../content');
const { SITE_URL, esc, pad, cal, icon } = require('./helpers');

const logo = `<a class="brand" href="./" aria-label="Demaze Technologies home"><img src="${C.logoMark}" alt="" width="28" height="28"><span>Demaze</span></a>`;

const NAV = [['Projects', './projects'], ['Services', './services'], ['About Us', './about-us'], ['Contact Us', './contact']];

function layout({ title, description, slug, body, noindex = false }) {
  const links = NAV.map(([t, h]) => `<a href="${h}"${h === './' + slug ? ' aria-current="page"' : ''}>${t}</a>`).join('');
  const canonical = `${SITE_URL}/${slug ? slug : ''}`;
  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${esc(title)}</title>
<meta name="description" content="${esc(description)}">
<meta name="theme-color" content="#07080f">
${noindex ? '<meta name="robots" content="noindex">' : `<link rel="canonical" href="${canonical}">`}
<link rel="icon" href="${C.logoMark}">
<meta property="og:title" content="${esc(title)}">
<meta property="og:description" content="${esc(description)}">
<meta property="og:image" content="${SITE_URL}/assets/img/og.png">
<meta property="og:image:width" content="1200">
<meta property="og:image:height" content="630">
<meta property="og:image:alt" content="Demaze: your strategic partner in building scalable AI products">
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
<script defer src="./assets/ink.js"></script>${slug ? '' : '\n<script type="module" src="./assets/cine.js"></script>'}${slug === 'contact' ? '\n<script type="module" src="./assets/visit3d.js"></script>' : ''}${slug === 'projects' || !slug ? '\n<script defer src="./assets/reel-kit.js"></script>\n<script defer src="./assets/reel.js"></script>\n<link rel="modulepreload" href="./assets/reel3d.js" data-reel3d>' : ''}
</head>
<body class="page-${slug || 'home'}">
<a class="skip" href="#main">Skip to content</a>
<header class="nav" data-nav>
  <div class="nav__bar">
    ${logo}
    <nav class="nav__links" aria-label="Primary" data-nav-links><i class="nav__pill" aria-hidden="true"></i>${links}</nav>
    <a class="btn btn--blue btn--sm nav__cta" ${cal}><span>Book A Call</span></a>
    <button class="nav__toggle" type="button" aria-expanded="false" aria-controls="menu" aria-label="Open menu"><span></span><span></span></button>
    <i class="nav__progress" aria-hidden="true"></i>
  </div>
  <div class="nav__scrim" data-nav-scrim hidden></div>
  <div class="nav__menu" id="menu" hidden>
    <nav class="nav__menu-links" aria-label="Menu">${NAV.map(([t, h], i) => `<a href="${h}" style="--i:${i}"${h === './' + slug ? ' aria-current="page"' : ''}><small>${pad(i + 1)}</small>${t}${icon.arrow}</a>`).join('')}</nav>
    <div class="nav__menu-foot" style="--i:${NAV.length}">
      <a class="btn btn--blue" ${cal}><span>Book A Call</span><i class="btn__icon">${icon.arrow}</i></a>
      <a class="nav__menu-mail" href="mailto:${C.email}">${icon.mail}${C.email}</a>
    </div>
  </div>
</header>
<main id="main">
${body}
</main>
${footer()}
</body>
</html>
`;
}

function footer() {
  return `<footer class="footer">
  <div class="footer__panel">
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
    <p class="footer__word" aria-hidden="true" data-word>${[...'Demaze'].map((c) => `<span>${c}</span>`).join('')}</p>
    <div class="footer__bottom"><span>Demaze Technologies © ${new Date().getFullYear()}. All rights reserved.</span><a href="#main" data-top>Back to top ↑</a></div>
  </div>
</footer>`;
}

module.exports = { layout };
