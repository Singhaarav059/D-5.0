// The page shell every page shares: <head> (meta, styles, scripts), the nav, <main> and the footer.
'use strict';

const C = require('../content');
const { SITE_URL, esc, pad, cal, icon } = require('./helpers');

const logo = `<a class="brand" href="./" aria-label="Demaze Technologies home"><img src="${C.logoMark}" alt="" width="28" height="28"><span>Demaze</span></a>`;

// The logo's chevron on its 128px grid (scripts/app-icons.js draws the icons from the same points).
const CHEVRON = 'M0 0L128 64L0 128L40 79.3L76 64L40 48.7Z';

// The opening, on the first page of a visit (boot.js decides; site.js plays it): the chevron draws itself and fills,
// the name rises beside it, then the sheet folds into the nav bar as the logo flies to its place there.
const intro = () => `<div class="intro" data-intro aria-hidden="true">
  <div class="intro__lock" data-ilock>
    <svg class="intro__mark" data-ic viewBox="-4 -4 136 136"><path class="intro__mark-line" data-icl pathLength="1" d="${CHEVRON}"/><path class="intro__mark-fill" data-icf d="${CHEVRON}"/></svg>
    <span class="intro__word" data-it>${[...'Demaze'].map((ch) => `<span><span>${ch}</span></span>`).join('')}</span>
  </div>
  <p class="intro__tag" data-itag>${C.hero.eyebrow.map(esc).join(' · ')}</p>
</div>`;

const NAV = [['Projects', './projects'], ['Services', './services'], ['About Us', './about-us'], ['Contact Us', './contact']];

// `section` is the nav entry a page sits under (a case study sits under Projects); `schema` is its structured data
// (templates/schema.js); `og` is a sharing image other than the site card ({ url, w, h, alt }).
function layout({ title, description, slug, body, noindex = false, section = slug, schema = [], og = null }) {
  const current = (h) => (h === './' + slug ? ' aria-current="page"' : h === './' + section ? ' aria-current="true"' : '');
  const links = NAV.map(([t, h]) => `<a href="${h}"${current(h)}>${t}</a>`).join('');
  const reels = slug === 'projects' || !slug || section === 'projects';
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
<link rel="apple-touch-icon" href="./assets/img/icon-180.png">
<link rel="manifest" href="./manifest.webmanifest">
<meta property="og:title" content="${esc(title)}">
<meta property="og:description" content="${esc(description)}">
<meta property="og:image" content="${og ? og.url : `${SITE_URL}/assets/img/og.png`}">
<meta property="og:image:width" content="${og ? og.w : 1200}">
<meta property="og:image:height" content="${og ? og.h : 630}">
<meta property="og:image:alt" content="${og ? esc(og.alt) : 'Demaze: your strategic partner in building scalable AI products'}">
<meta property="og:url" content="${canonical}">
<meta property="og:type" content="${section === 'projects' && slug !== 'projects' ? 'article' : 'website'}">
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="${esc(title)}">
<meta name="twitter:description" content="${esc(description)}">
<meta name="twitter:image" content="${og ? og.url : `${SITE_URL}/assets/img/og.png`}">${schema.map((d) => `\n<script type="application/ld+json">${JSON.stringify(d).replace(/</g, '\\u003c')}</script>`).join('')}
<link rel="stylesheet" href="./assets/fonts.css">
<link rel="stylesheet" href="./assets/site.css">
<script src="./assets/boot.js"></script>
<script defer src="./assets/vendor/gsap.min.js"></script>
<script defer src="./assets/vendor/ScrollTrigger.min.js"></script>
<script defer src="./assets/vendor/lenis.min.js"></script>
<script defer src="./assets/site.js"></script>
<script defer src="./assets/ink.js"></script>${slug ? '' : '\n<script type="module" src="./assets/cine.js"></script>'}${slug === 'contact' ? '\n<script type="module" src="./assets/visit3d.js"></script>' : ''}${reels ? '\n<script defer src="./assets/reel-kit.js"></script>\n<script defer src="./assets/reel.js"></script>\n<link rel="modulepreload" href="./assets/reel3d.js" data-reel3d>' : ''}
</head>
<body class="page-${(section || 'home').replace('/', '-')}${section !== slug ? ' page-case' : ''}">
${intro()}
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
    <nav class="nav__menu-links" aria-label="Menu">${NAV.map(([t, h], i) => `<a href="${h}" style="--i:${i}"${current(h)}><small>${pad(i + 1)}</small>${t}${icon.arrow}</a>`).join('')}</nav>
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
