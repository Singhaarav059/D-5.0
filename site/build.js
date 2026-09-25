// Generates the static pages from content.js. Run: node site/build.js
const fs = require('fs');
const path = require('path');
const C = require('./content');

const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const pad = (n) => String(n).padStart(2, '0');
const cal = `href="${C.calendly}" target="_blank" rel="noopener"`;
const SITE_URL = (process.env.SITE_URL || 'https://demazetech.com').replace(/\/$/, '');

const icon = {
  arrow: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>',
  plus: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 5v14M5 12h14" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>',
  check: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12.5l4.5 4.5L19 7.5" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/></svg>',
  mail: '<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="3" y="5" width="18" height="14" rx="3" fill="none" stroke="currentColor" stroke-width="1.8"/><path d="M4 7l8 6 8-6" fill="none" stroke="currentColor" stroke-width="1.8"/></svg>',
  cal: '<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="3" y="5" width="18" height="16" rx="3" fill="none" stroke="currentColor" stroke-width="1.8"/><path d="M3 10h18M8 3v4M16 3v4" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/></svg>',
  pin: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 21s-7-6.2-7-11.5a7 7 0 0114 0C19 14.8 12 21 12 21z" fill="none" stroke="currentColor" stroke-width="1.8"/><circle cx="12" cy="9.5" r="2.5" fill="none" stroke="currentColor" stroke-width="1.8"/></svg>',
  linkedin: '<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M4.98 3.5A2.5 2.5 0 1 1 5 8.5a2.5 2.5 0 0 1-.02-5zM3 9.75h4v11H3zM9.5 9.75h3.8v1.5h.05c.53-1 1.83-2.05 3.77-2.05 4.03 0 4.78 2.65 4.78 6.1v5.45h-4v-4.83c0-1.15-.02-2.63-1.6-2.63-1.61 0-1.85 1.25-1.85 2.55v4.91h-4z"/></svg>',
  x: '<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M17.75 3h3.07l-6.7 7.66L22 21h-6.17l-4.83-6.32L5.47 21H2.4l7.17-8.2L2 3h6.33l4.37 5.78zm-1.08 16.2h1.7L7.4 4.73H5.58z"/></svg>',
  instagram: '<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="3" y="3" width="18" height="18" rx="5" fill="none" stroke="currentColor" stroke-width="1.8"/><circle cx="12" cy="12" r="4" fill="none" stroke="currentColor" stroke-width="1.8"/><circle cx="17.3" cy="6.7" r="1.2" fill="currentColor"/></svg>',
};

// Local images (assets/img/work, generated from the old Framer originals): a <picture> with AVIF at the
// widths in the manifest and a PNG/JPEG fallback. `small` picks the avatar-sized variants.
const MANIFEST = JSON.parse(fs.readFileSync(path.join(__dirname, 'assets/img/work/manifest.json'), 'utf8'));
const pic = (key, alt, { sizes = '100vw', small = false, attrs = 'loading="lazy" decoding="async"', cls = '' } = {}) => {
  const m = MANIFEST[key];
  if (!m) throw new Error(`missing image ${key}`);
  const fit = m.files.filter((f) => (small ? f.w <= 200 : f.w > 200));
  const avif = fit.filter((f) => f.fmt === 'avif').sort((a, b) => a.w - b.w);
  const fb = fit.filter((f) => f.fmt !== 'avif').sort((a, b) => b.w - a.w)[0];
  const u = (f) => `./assets/img/work/${f.file}`;
  const h = Math.round((fb.w * m.h) / m.w);
  return `<picture><source type="image/avif" srcset="${avif.map((f) => `${u(f)} ${f.w}w`).join(', ')}" sizes="${sizes}"><img${cls ? ` class="${cls}"` : ''} src="${u(fb)}" alt="${esc(alt)}" width="${fb.w}" height="${h}" ${attrs}></picture>`;
};

const btn = (label, href, cls = 'btn--blue', extra = '') =>
  `<a class="btn ${cls}" href="${href}" ${extra}><span>${esc(label)}</span><i class="btn__icon">${icon.arrow}</i></a>`;
const eyebrow = (t, dark) => `<p class="eyebrow${dark ? ' eyebrow--dark' : ''}"><span class="eyebrow__dot"></span>${esc(t)}</p>`;
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
<script defer src="./assets/ink.js"></script>${slug ? '' : '\n<script type="module" src="./assets/cine.js"></script>'}
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

// ---------- sections ----------
// Subpage heroes share the home stage: near-black with one blue light (no photo).
const sky = `<div class="hero__bg" aria-hidden="true"><i class="hero__glow" data-glow></i></div>`;

// Engineering stack: the six "Tools & Technologies" tabs from the live site. The AI & ML tab keeps
// the grouped list with roles; every tab drives the orbit (rebuilt client-side on tab change).
const framerIcon = (id) => `./assets/img/tech/ai-${id.replace(/\.\w+$/, '')}.png`; // vendored from Framer at 192px
// Brand marks are vendored from simpleicons into assets/img/tech (the CSP only allows self-hosted images);
// a slug with no local file (.svg preferred, .png for marks only published as bitmaps) falls back to the monogram.
const techIcon = (slug) => {
  const file = slug && [`${slug}.svg`, `${slug}.png`].find((f) => fs.existsSync(path.join(__dirname, 'assets/img/tech', f)));
  return file ? `./assets/img/tech/${file}` : null;
};
const stackTabs = () => C.tools.map((t, i) => ({
  tab: t.tab,
  items: i === 0
    ? C.stack.items.map((s) => ({ name: s.name, role: s.role, group: s.group, logo: framerIcon(s.icon) }))
    : t.items.map(([name, slug]) => ({ name, logo: techIcon(slug) })),
}));
// Knowledge map (after a "knowledge index" UI): the Demaze sphere wires into six discipline cards, and the
// active card fans out to its tools. All six lists ship in the HTML as tab panels; site.js draws the wires.
const KMAP_ICONS = {
  'AI & ML': '<path d="M12 3v3M12 18v3M3 12h3M18 12h3M6.3 6.3l2.1 2.1M15.6 15.6l2.1 2.1M6.3 17.7l2.1-2.1M15.6 8.4l2.1-2.1"/><circle cx="12" cy="12" r="3"/>',
  Web: '<rect x="3" y="4" width="18" height="16" rx="2.5"/><path d="M3 9h18M7 6.5h.01M10 6.5h.01"/>',
  'Mobile App': '<rect x="7" y="2.5" width="10" height="19" rx="2.5"/><path d="M11 18.5h2"/>',
  'UI/UX': '<path d="M4 20l4-1 11-11-3-3L5 16l-1 4z"/><path d="M14 6l3 3"/>',
  eCommerce: '<path d="M5 8h14l-1.2 11.2a2 2 0 01-2 1.8H8.2a2 2 0 01-2-1.8L5 8z"/><path d="M9 8V6.5a3 3 0 016 0V8"/>',
  Cloud: '<path d="M7 18h10.5a4 4 0 00.6-7.96A6 6 0 006.3 9.5 4.3 4.3 0 007 18z"/>',
};
const kmapIcon = (tab) => `<svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round">${KMAP_ICONS[tab] || KMAP_ICONS.Web}</svg>`;
const kmapItem = (t) => `<li class="kmap__item"><i class="kmap__dot" data-kmap-dot></i>${t.logo ? `<img src="${t.logo}" alt="" width="22" height="22" loading="lazy">` : `<b class="kmap__mono">${esc(t.name.slice(0, 2))}</b>`}<span>${esc(t.name)}</span>${t.role ? `<small>${esc(t.role)}</small>` : ''}</li>`;

const techStack = () => {
  const tabs = stackTabs();
  const total = new Set(tabs.flatMap((t) => t.items.map((x) => x.name))).size;
  return `<section class="section kmap" id="tools" data-kmap>
  <div class="wrap">
    <div class="section-head">
      <h2 class="h2" data-split>Tools &amp; technologies</h2>
      <p class="lead" data-reveal>${esc(C.stack.lead)}</p>
    </div>
    <div class="kmap__stage" data-tabs data-kmap-stage data-reveal>
      <svg class="kmap__wires" aria-hidden="true" data-kmap-wires></svg>
      <div class="kmap__core" aria-hidden="true">
        <p class="kmap__title">Demaze stack</p>
        <p class="kmap__sub"><b>${tabs.length}</b> disciplines · <b>${total}</b> tools</p>
        <canvas class="kmap__sphere" width="440" height="440" data-kmap-sphere></canvas>
        <p class="kmap__live"><i></i>Stack index</p>
      </div>
      <div class="kmap__cats" role="tablist" aria-label="Technology categories" aria-orientation="vertical">${tabs.map((t, i) => `
        <button class="kmap__cat" role="tab" type="button" id="stk-tab-${i}" aria-controls="stk-panel-${i}" aria-selected="${i === 0}" tabindex="${i === 0 ? 0 : -1}" data-kmap-cat>
          <span class="kmap__icon">${kmapIcon(t.tab)}</span><span class="kmap__name">${esc(t.tab)}</span><span class="kmap__count"><b>${t.items.length}</b> tools</span>
        </button>`).join('')}
      </div>
      <div class="kmap__lists">${tabs.map((t, i) => `
        <div class="kmap__panel" role="tabpanel" id="stk-panel-${i}" aria-labelledby="stk-tab-${i}"${i ? ' hidden' : ''}><ul class="kmap__list">${t.items.map(kmapItem).join('')}</ul></div>`).join('')}
      </div>
    </div>
  </div>
</section>`;
};

// Home hero: a short code-drawn opening (cine.js) — a spark grows into a network of connections that folds
// into a dotted globe — then the globe settles as a horizon under the headline. Without JS it is just the copy.
const hero = () => `<section class="hero hero--cine" data-hero>
  <div class="hero__panel">
    <div class="cine" aria-hidden="true" data-cine>
      <i class="cine__glow"></i>
      <div class="cine__globe" data-globe></div>
      <svg class="cine__net" data-net></svg>
      <div class="cine__tokens" data-tokens></div>
      <p class="cine__label"><i></i>Demaze Technologies</p>
      <p class="cine__caption" data-caption></p>
    </div>
    <div class="hero__content">
      <h1 class="hero__title" data-split="hero">Your Strategic Partner in Building <em>Scalable AI Products</em></h1>
      <div class="hero__aside">
        <p class="hero__lead" data-hero-fade>${esc(C.tagline)}</p>
        <div class="hero__ctas" data-hero-fade>${btn("Let's Connect", './contact', 'btn--blue')}${btn('Explore Services', './services', 'btn--white')}</div>
      </div>
    </div>
    <div class="hero__proof" data-hero-proof>
      <a class="hero__note" href="#founder">
        ${pic(C.founder.photo, '', { small: true, sizes: '44px', attrs: 'decoding="async"' })}
        <span><q>When you thrive, we thrive</q><small>${C.founder.name}, ${C.founder.title}</small></span>
      </a>
      <ul class="hero__stats">${C.metrics.map((m) => `<li><b>${m.prefix}<span data-count="${m.value}">${m.value}</span>${m.suffix}</b><small>${m.label}</small></li>`).join('')}</ul>
    </div>
  </div>
</section>`;

// "About us": Who We Are beside the four What Drives Us values (both from the live homepage).
const about = ({ metrics = false, link = true } = {}) => `<section class="section about" id="about">
  <div class="wrap about__grid">
    <div class="about__copy">
      ${eyebrow('About us')}
      <h2 class="h2" data-split>Who we are</h2>
      <p class="about__text" data-scrub-words>${esc(C.about.whoWeAre[0])}</p>
      <p class="about__sub" data-reveal>${esc(C.about.whoWeAre[1])}</p>
      ${link ? `<a class="link-arrow" href="./about-us" data-reveal>More about us ${icon.arrow}</a>` : ''}
    </div>
    <div class="about__drives">
      <h3 class="about__label" data-reveal>What drives us</h3>
      <div class="drives__grid" data-stagger>${C.about.drives.map((d, i) => `<article class="drive drive--${i}"><span>${pad(i + 1)}</span><h4>${esc(d.title)}</h4><p>${esc(d.description)}</p></article>`).join('')}</div>
    </div>
  </div>
  ${metrics ? `<div class="wrap"><ul class="metrics" data-stagger>${C.metrics.map((m) => `<li class="metric"><span class="metric__value">${m.prefix}<b data-count="${m.value}">${m.value}</b>${m.suffix}</span><span class="metric__label">${m.label}</span></li>`).join('')}</ul></div>` : ''}
</section>`;

const projectCard = (p, i, total) => `<article class="stack-card" style="--tint:${p.tint};--i:${i}" data-stack-card>
  <div class="stack-card__inner">
    <i class="stack-card__shade" aria-hidden="true"></i>
    <div class="stack-card__copy">
      <span class="stack-card__num">${pad(i + 1)} / ${pad(total)}</span>
      <h3>${esc(p.title)}</h3>
      <p>${esc(p.description)}</p>
      <ul class="tags">${p.features.map((f) => `<li>${esc(f)}</li>`).join('')}</ul>
    </div>
    <figure class="stack-card__media">${pic(p.image, `${p.title}, product screens`, { sizes: '(max-width: 860px) 92vw, 560px' })}</figure>
  </div>
</article>`;

const work = () => `<section class="section work" id="work">
  <div class="wrap">
    <div class="section-head section-head--split">
      <div>${eyebrow('Our work')}<h2 class="h2" data-split>The projects we did</h2><p class="lead" data-reveal>Four of the ${C.projects.length} products we’ve designed and built, from luxury automotive to senior care.</p></div>
      <div>${btn('View all work', './projects', 'btn--white')}</div>
    </div>
    <div class="stack" data-deck>${C.projects.slice(0, 4).map((p, i) => projectCard(p, i, 4)).join('')}</div>
  </div>
</section>`;

// Service art, drawn in code (same line-and-dot language as the globe and the knowledge map).
// .flow strokes carry a moving dash (CSS) so each drawing has one quiet sign of life.
const SVC_ART = {
  ai: `<g class="art__edges">${[[40, 40], [40, 70], [40, 100]].flatMap(([x1, y1]) => [[120, 28], [120, 56], [120, 84], [120, 112]].map(([x2, y2]) => `<path d="M${x1} ${y1}L${x2} ${y2}"/>`)).join('')}${[[120, 28], [120, 56], [120, 84], [120, 112]].flatMap(([x1, y1]) => [[200, 52], [200, 88]].map(([x2, y2]) => `<path d="M${x1} ${y1}L${x2} ${y2}"/>`)).join('')}</g>
    <path class="flow" d="M40 70L120 56L200 88"/>
    ${[[40, 40], [40, 70], [40, 100], [120, 28], [120, 56], [120, 84], [120, 112], [200, 52], [200, 88]].map(([x, y], i) => `<circle class="art__node${i === 1 || i === 4 || i === 8 ? ' is-hot' : ''}" cx="${x}" cy="${y}" r="6"/>`).join('')}`,
  web: `<rect class="art__frame" x="22" y="20" width="150" height="100" rx="9"/><path class="art__edges" d="M22 38H172"/>
    ${[34, 44, 54].map((x) => `<circle class="art__dot" cx="${x}" cy="29" r="2.5"/>`).join('')}
    <rect class="art__block" x="36" y="50" width="60" height="30" rx="4"/><rect class="art__block" x="104" y="50" width="54" height="12" rx="3"/><rect class="art__block" x="104" y="68" width="40" height="12" rx="3"/>
    <path class="art__edges" d="M36 92H158M36 104H130"/>
    <rect class="art__frame is-front" x="160" y="46" width="52" height="88" rx="10"/><path class="art__edges" d="M178 124H194"/>
    <rect class="art__block is-hot" x="168" y="60" width="36" height="22" rx="4"/>
    <path class="flow" d="M96 65C124 65 132 71 168 71"/>`,
  ecom: `<path class="art__frame" d="M36 54H92L86 118H42Z"/><path class="art__edges" d="M50 54V46A14 14 0 0 1 78 46V54"/>
    <path class="flow" d="M94 86C126 86 130 58 158 58"/>
    <rect class="art__frame is-front" x="158" y="36" width="52" height="44" rx="6"/><path class="art__edges" d="M158 50H210M184 36V50"/>
    <rect class="art__frame" x="150" y="94" width="66" height="36" rx="6"/><rect class="art__block is-hot" x="158" y="102" width="18" height="12" rx="2"/><path class="art__edges" d="M182 118H208"/>
    <path class="flow" d="M184 80V94"/>
    ${[[64, 84], [58, 100], [72, 100]].map(([x, y]) => `<circle class="art__dot" cx="${x}" cy="${y}" r="2.5"/>`).join('')}`,
  cloud: `<path class="art__frame" d="M78 70H168A22 22 0 0 0 164 26A32 32 0 0 0 104 30A24 24 0 0 0 78 70Z"/>
    ${[[62, 118], [122, 122], [182, 118]].map(([x, y]) => `<path class="flow" d="M122 70L${x} ${y - 10}"/><rect class="art__frame is-front" x="${x - 20}" y="${y - 10}" width="40" height="22" rx="5"/><circle class="art__dot is-hot" cx="${x - 10}" cy="${y + 1}" r="2.5"/><path class="art__edges" d="M${x - 2} ${y + 1}H${x + 12}"/>`).join('')}
    <circle class="art__node is-hot" cx="122" cy="48" r="7"/>`,
};
const serviceArt = (id) => `<svg class="svc-art" viewBox="0 0 240 140" aria-hidden="true">${SVC_ART[id] || SVC_ART.web}</svg>`;

const servicePanel = (s, i) => `<article class="svc-panel${i === 0 ? ' is-active' : ''}" id="${s.id}" style="--c:${s.color}" data-svc-panel>
  <div class="svc-panel__art">${serviceArt(s.id)}</div>
  <div class="svc-panel__body">
    <h3>${esc(s.title)}</h3>
    <p>${esc(s.description)}</p>
    <ul class="checks">${s.items.map((t) => `<li>${icon.check}${esc(t)}</li>`).join('')}</ul>
  </div>
</article>`;

const services = (withHead = true) => `<section class="section services" data-services>
  <div class="services__pin">
    <div class="wrap services__grid">
      <div class="services__side">
        ${withHead ? `${eyebrow('Services', true)}<h2 class="h2" data-split>Apps, websites, AI and more</h2>` : ''}
        <ol class="svc-list" role="list">${C.services.map((s, i) => `<li><button type="button" class="svc-list__btn${i === 0 ? ' is-active' : ''}" data-svc-btn="${i}"><span class="svc-list__num">${pad(i + 1)}</span>${esc(s.title)}<i class="svc-list__bar"><i></i></i></button></li>`).join('')}</ol>
      </div>
      <div class="services__stage">${C.services.map(servicePanel).join('')}</div>
    </div>
  </div>
</section>`;

const reasons = () => `<ol class="reasons" data-stagger>${C.whyUs.map((w, i) => `<li class="reason"><span class="reason__num">${pad(i + 1)}</span><h3>${esc(w.title)}</h3><p>${esc(w.description)}</p></li>`).join('')}</ol>`;

const whyUs = () => `<section class="section why">
  <div class="wrap">
    <div class="section-head"><h2 class="h2" data-split>Why choose us</h2></div>
    ${reasons()}
  </div>
</section>`;

// Home: one "who we are" section in place of four (about, what drives us, why us, founder quote):
// the story and the founder's words side by side, then the three reasons as numbered columns.
const studio = () => `<section class="section studio" id="about">
  <div class="wrap">
    <div class="studio__top">
      <div class="studio__copy">
        ${eyebrow('About us')}
        <h2 class="h2" data-split>Who we are</h2>
        <p class="about__text" data-scrub-words>${esc(C.about.whoWeAre[0])}</p>
        <p class="about__sub" data-reveal>${esc(C.about.whoWeAre[1])}</p>
        <a class="link-arrow" href="./about-us" data-reveal>More about us ${icon.arrow}</a>
      </div>
      <figure class="studio__quote" data-reveal>
        <blockquote>“${esc(C.founder.quote)}”</blockquote>
        <figcaption>${pic(C.founder.photo, '', { small: true, sizes: '52px' })}<span><a href="${C.founder.href}" target="_blank" rel="noopener">${C.founder.name}</a><small>${C.founder.title}</small></span></figcaption>
      </figure>
    </div>
    ${reasons()}
  </div>
</section>`;

const industries = () => `<section class="section industries" id="industries">
  <div class="wrap ind" data-tabs data-ind-auto>
    <div class="ind__side">
      <h2 class="h2" data-split>Industries we serve</h2>
      <p class="lead" data-reveal>${C.industries.length} industries. Pick one to see the kinds of systems we build for it.</p>
      <div class="ind__tabs" role="tablist" aria-label="Industries">${C.industries.map(([n], i) => `<button role="tab" type="button" id="ind-tab-${i}" aria-controls="ind-panel-${i}" aria-selected="${i === 0}" tabindex="${i === 0 ? 0 : -1}">${esc(n)}</button>`).join('')}</div>
    </div>
    <div class="ind__stage">${C.industries.map(([n, items], i) => `<div class="ind__panel" role="tabpanel" id="ind-panel-${i}" aria-labelledby="ind-tab-${i}" style="--hue:${(i * 23) % 150 - 40}deg"${i ? ' hidden' : ''}><span class="ind__big" aria-hidden="true">${pad(i + 1)}</span><div class="ind__head"><span>${pad(i + 1)} / ${C.industries.length}</span><h3>${esc(n)}</h3></div><ul>${items.map((t) => `<li>${icon.check}${esc(t)}</li>`).join('')}</ul></div>`).join('')}</div>
  </div>
</section>`;

// "How we work", told on paper: an ink character walks through the four stages while the page scrolls
// (ink.js draws it; the stage text below is the real content and reads fine without the drawing).
const processSection = () => `<section class="section process ink" data-process data-ink>
  <div class="ink__track">
    <div class="ink__sticky">
      <div class="ink__paper">
        <i class="grain" aria-hidden="true"></i>
        <div class="ink__head">
          <div>${eyebrow('How we work', true)}<h2 class="h2 ink__title">From a first idea to a product at scale</h2></div>
          <div>${btn('Book a call', C.calendly, 'btn--ink', 'target="_blank" rel="noopener"')}</div>
        </div>
        <div class="ink__stage"><canvas class="ink__canvas" aria-hidden="true" data-ink-canvas></canvas></div>
        <ol class="ink__steps">${C.process.map((s, i) => `
          <li class="ink__step" data-ink-step><span class="ink__num">${pad(i + 1)} / ${pad(C.process.length)}</span><h3>${esc(s.title)}</h3><p>${esc(s.description)}</p></li>`).join('')}
        </ol>
      </div>
    </div>
  </div>
</section>`;

const founder = () => `<section class="section quote" id="founder">
  <div class="quote__panel">
    <i class="grain" aria-hidden="true"></i>
    <figure class="wrap quote__inner">
      <div>
        <blockquote><p data-scrub-words>“${esc(C.founder.quote)}”</p></blockquote>
        <figcaption data-reveal><span><a href="${C.founder.href}" target="_blank" rel="noopener">${C.founder.name}</a><small>${C.founder.title}</small></span></figcaption>
      </div>
      ${pic(C.founder.photo, `${C.founder.name}, ${C.founder.title}`, { sizes: '300px', cls: 'quote__photo', attrs: 'loading="lazy" data-reveal' })}
    </figure>
  </div>
</section>`;

const faq = () => `<section class="section faq">
  <div class="wrap faq__grid">
    <div><h2 class="h2" data-split>Questions, answered</h2><p class="lead" data-reveal>Still curious? <a class="link" href="mailto:${C.email}">${C.email}</a></p></div>
    <div class="acc" data-stagger>
      ${C.faq.map((f, i) => `<div class="acc__item"><h3><button type="button" aria-expanded="false" aria-controls="faq-${i}" id="faq-q-${i}" data-acc><span class="acc__num">${pad(i + 1)}</span><span class="acc__q">${esc(f.q)}</span><i class="acc__icon">${icon.plus}</i></button></h3><div class="acc__a" id="faq-${i}" role="region" aria-labelledby="faq-q-${i}"><div><p>${esc(f.a)}</p></div></div></div>`).join('')}
    </div>
  </div>
</section>`;

const contact = (id = 'contact') => `<section class="section contact" id="${id}">
  <div class="contact__panel">
    <i class="grain" aria-hidden="true"></i><i class="contact__orb" aria-hidden="true"></i>
    <div class="contact__grid">
      <div class="contact__copy">
        ${eyebrow('Contact', true)}
        <h2 class="h2 contact__title" data-split>${esc(C.closing)}</h2>
        <ul class="contact__ways" data-stagger>
          <li><a href="mailto:${C.email}"><i>${icon.mail}</i><span><small>Feel free to email us if you have any questions or need more details!</small>${C.email}</span></a></li>
          <li><a ${cal}><i>${icon.cal}</i><span><small>Feel free to book a call if that’s more convenient and easier for you.</small>Book with Calendly</span></a></li>
          <li><a href="${C.mapUrl}" target="_blank" rel="noopener"><i>${icon.pin}</i><span><small>Office Location</small>${esc(C.address)}</span></a></li>
        </ul>
      </div>
      <form class="form" data-form data-reveal action="/api/contact" method="post" novalidate>
        <h3>Reach us at anytime</h3>
        <div class="form__row"><label>Name<input name="name" autocomplete="name" maxlength="120" required></label>
        <label>Email<input name="email" type="email" autocomplete="email" maxlength="254" required></label></div>
        <label>Subject of interest<select name="subject"><option>General enquiry</option>${C.services.map((s) => `<option>${esc(s.title)}</option>`).join('')}</select></label>
        <label>How may we assist you?<textarea name="message" rows="3" maxlength="5000" minlength="10" required></textarea></label>
        <label class="form__trap" aria-hidden="true">Website<input name="website" tabindex="-1" autocomplete="off"></label>
        <button class="btn btn--blue" type="submit"><span>Submit</span><i class="btn__icon">${icon.arrow}</i></button>
        <p class="form__note" data-form-note aria-live="polite">Your details are sent securely when contact delivery is configured; otherwise your email app will be offered as a fallback.</p>
      </form>
    </div>
  </div>
</section>`;


// Projects page: compact cards; each opens a dialog with the full case (content lives in a <template>).
const projectsGrid = () => `<section class="section projects">
  <div class="wrap">
    <div class="pgrid">${C.projects.map((p, i) => `<article class="pcard${i === 0 ? ' pcard--wide' : ''}" style="--tint:${p.tint}" data-reveal>
      <figure class="pcard__media">${pic(p.image, `${p.title}, project preview`, { sizes: '(max-width: 560px) 92vw, (max-width: 1024px) 46vw, 400px' })}</figure>
      <div class="pcard__body">
        <span class="pcard__num">${pad(i + 1)}</span>
        <h2><button type="button" class="pcard__btn" data-proj="${i}" aria-haspopup="dialog">${esc(p.title)}</button></h2>
        ${p.description ? `<p>${esc(p.description)}</p>` : ''}
        <span class="pcard__more">View project ${icon.arrow}</span>
      </div>
      <template data-proj-tpl="${i}">
        <figure class="pdlg__media" style="--tint:${p.tint}">${pic(p.image, `${p.title}, product screens`, { sizes: '(max-width: 860px) 92vw, 820px' })}</figure>
        <div class="pdlg__body">
          <span class="pcard__num">${pad(i + 1)} / ${pad(C.projects.length)}</span>
          <h2 id="pdlg-title-${i}">${esc(p.title)}</h2>
          ${p.description ? `<p>${esc(p.description)}</p>` : ''}
          <h3>Highlights</h3>
          <ul class="checks checks--ink">${p.features.map((f) => `<li>${icon.check}${esc(f)}</li>`).join('')}</ul>
          <div class="pdlg__cta">${btn('Discuss a similar project', C.calendly, 'btn--blue', 'target="_blank" rel="noopener"')}</div>
        </div>
      </template>
    </article>`).join('')}</div>
  </div>
  <dialog class="pdlg" aria-label="Project details" data-pdlg data-lenis-prevent>
    <button type="button" class="pdlg__close" aria-label="Close" data-pdlg-close>${icon.plus}</button>
    <div class="pdlg__inner" data-pdlg-body></div>
  </dialog>
</section>`;

// Contact page: office map (Google Maps embed, no key needed) + directions.
const visit = () => `<section class="section visit">
  <div class="wrap visit__grid">
    <div class="visit__map" data-reveal><iframe title="Map of the Demaze Technologies office in Gota, Ahmedabad" src="https://maps.google.com/maps?q=Ganesh%20Glory%2011%2C%20Jagatpur%20Road%2C%20Gota%2C%20Ahmedabad&z=15&output=embed" loading="lazy" referrerpolicy="no-referrer-when-downgrade"></iframe></div>
    <div class="visit__copy">
      ${eyebrow('Office location')}
      <h2 class="h2" data-split>Visit us in Ahmedabad</h2>
      <p class="lead" data-reveal>${esc(C.address)}</p>
      <div class="hero__ctas visit__ctas" data-reveal>${btn('Get directions', C.mapUrl, 'btn--blue', 'target="_blank" rel="noopener"')}${btn('Book with Calendly', C.calendly, 'btn--white', 'target="_blank" rel="noopener"')}</div>
    </div>
  </div>
</section>`;

const pageHero = (kicker, title, lead, extra = '') => `<section class="phero" data-hero>
  <div class="phero__panel">
    ${sky}
    <div class="phero__content">
      <p class="hero__eyebrow" data-hero-fade><span>${esc(kicker)}</span></p>
      <h1 class="phero__title" data-split="hero">${title}</h1>
      <p class="hero__lead" data-hero-fade>${esc(lead)}</p>
      ${extra}
    </div>
  </div>
</section>`;

// ---------- pages ----------
const pages = {
  index: layout({
    slug: '',
    title: 'Demaze Technologies | Your Strategic Partner in Building Scalable AI Products',
    description: C.tagline,
    // Same order as the live homepage: work, services, tools, industries, why us, about, process, FAQ, contact.
    body: [hero(), work(), services(), techStack(), industries(), studio(), processSection(), faq(), contact()].join('\n'),
  }),
  projects: layout({
    slug: 'projects',
    title: 'Projects | Demaze Technologies',
    description: 'AI software, eCommerce platforms, SaaS and mobile apps Demaze Technologies has designed and built.',
    body: [
      pageHero('Our work', 'The projects <em>we did</em>', `${C.projects.length} products across automotive, legal, commerce, fintech, education, media and more. Open any project for the full story.`),
      projectsGrid(),
      contact(),
    ].join('\n'),
  }),
  services: layout({
    slug: 'services',
    title: 'Services | AI & ML, Web, Mobile, SaaS, eCommerce, Cloud | Demaze Technologies',
    description: 'AI & ML, web, mobile and SaaS development, intelligent eCommerce and cloud architecture from Demaze Technologies.',
    body: [
      pageHero('Services', 'Apps, websites, <em>AI and more</em>', C.tagline),
      services(false), techStack(), industries(), processSection(), contact(),
    ].join('\n'),
  }),
  'about-us': layout({
    slug: 'about-us',
    title: 'About Us | Demaze Technologies',
    description: C.about.whoWeAre[0],
    body: [
      pageHero('What we are', 'More than developers: <em>digital transformation architects</em>', C.about.whoWeAre[1]),
      about({ link: false }), whyUs(), founder(), processSection(), contact(),
    ].join('\n'),
  }),
  404: layout({
    slug: '404',
    noindex: true,
    title: 'Page not found | Demaze Technologies',
    description: 'This page does not exist. Head back to the Demaze home page or browse our projects.',
    body: pageHero('Error 404', 'This page <em>drifted off the map</em>', 'The link may be old or mistyped. Everything we build is still one click away.',
      `<div class="hero__ctas" data-hero-fade>${btn('Back to home', './', 'btn--blue')}${btn('See our work', './projects', 'btn--white')}</div>`),
  }),
  contact: layout({
    slug: 'contact',
    title: 'Contact | Demaze Technologies',
    description: `Email ${C.email}, book a call, or visit us in Ahmedabad.`,
    body: [
      pageHero('Contact', 'Reach us <em>at anytime</em>', 'Feel free to email us if you have any questions or need more details, or book a call if that’s more convenient and easier for you.',
        `<div class="hero__ctas" data-hero-fade>${btn('Book with Calendly', C.calendly, 'btn--blue', 'target="_blank" rel="noopener"')}${btn(C.email, 'mailto:' + C.email, 'btn--white')}</div>`),
      contact('form'), visit(), faq(),
    ].join('\n'),
  }),
};

// Fingerprint local assets (./assets/...) with a hash of their contents so a deploy never serves new
// pages with stale CSS/JS; the server caches fingerprinted URLs for a year.
const crypto = require('crypto');
const fingerprints = new Map();
const fingerprint = (html) => html.replace(/(src|href)="\.\/(assets\/[^"?#]+)"/g, (m, attr, rel) => {
  if (!fingerprints.has(rel)) {
    const file = path.join(__dirname, rel);
    fingerprints.set(rel, fs.existsSync(file) ? crypto.createHash('sha1').update(fs.readFileSync(file)).digest('hex').slice(0, 10) : null);
  }
  const v = fingerprints.get(rel);
  return v ? `${attr}="./${rel}?v=${v}"` : m;
});

for (const [name, page] of Object.entries(pages)) {
  const html = fingerprint(page);
  fs.writeFileSync(path.join(__dirname, name + '.html'), html);
  console.log('wrote', name + '.html', (html.length / 1024).toFixed(1) + 'KB');
}
