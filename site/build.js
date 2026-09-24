// Generates the static pages from content.js. Run: node site/build.js
const fs = require('fs');
const path = require('path');
const C = require('./content');

const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const pad = (n) => String(n).padStart(2, '0');
const cal = `href="${C.calendly}" target="_blank" rel="noopener"`;

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

const btn = (label, href, cls = 'btn--blue', extra = '') =>
  `<a class="btn ${cls}" href="${href}" ${extra}><span>${esc(label)}</span><i class="btn__icon">${icon.arrow}</i></a>`;
const eyebrow = (t, dark) => `<p class="eyebrow${dark ? ' eyebrow--dark' : ''}"><span class="eyebrow__dot"></span>${esc(t)}</p>`;
const logo = `<a class="brand" href="./" aria-label="Demaze Technologies home"><img src="${C.logoMark}" alt="" width="28" height="28"><span>Demaze</span></a>`;

const NAV = [['Projects', './projects'], ['Services', './services'], ['About Us', './about-us'], ['Contact Us', './contact']];

function layout({ title, description, slug, body }) {
  const links = NAV.map(([t, h]) => `<a href="${h}"${h === './' + slug ? ' aria-current="page"' : ''}>${t}</a>`).join('');
  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${esc(title)}</title>
<meta name="description" content="${esc(description)}">
<meta name="theme-color" content="#0f1330">
<link rel="icon" href="${C.logoMark}">
<meta property="og:title" content="${esc(title)}">
<meta property="og:description" content="${esc(description)}">
<meta property="og:image" content="https://framerusercontent.com/images/g9sZPcgZ3bVZQgiCX8DybKWIy4.png">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:opsz,wght@12..96,400..800&family=Figtree:wght@400..700&display=swap" rel="stylesheet">
<link rel="stylesheet" href="./assets/site.css">
<script>(function(d){var m=!matchMedia('(prefers-reduced-motion: reduce)').matches;d.classList.add(m?'motion':'rm','js');setTimeout(function(){if(!window.gsap)d.classList.remove('js')},4000)})(document.documentElement)</script>
<script defer src="https://cdn.jsdelivr.net/npm/gsap@3.12.5/dist/gsap.min.js"></script>
<script defer src="https://cdn.jsdelivr.net/npm/gsap@3.12.5/dist/ScrollTrigger.min.js"></script>
<script defer src="https://cdn.jsdelivr.net/npm/lenis@1.1.13/dist/lenis.min.js"></script>
<script defer src="./assets/liquid.js"></script>${slug ? '' : '<script defer src="./assets/flow.js"></script>'}
<script defer src="./assets/site.js"></script>
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
const sky = `<div class="hero__bg" aria-hidden="true"><img class="hero__sky" src="./assets/img/clouds.jpg" alt="" data-sky><i class="orb orb--a"></i><i class="orb orb--b"></i><i class="orb orb--c"></i><i class="hero__glow" data-glow></i></div>`;

// Engineering stack: the six "Tools & Technologies" tabs from the live site. The AI & ML tab keeps
// the grouped list with roles; every tab drives the orbit (rebuilt client-side on tab change).
const framerIcon = (id) => `https://framerusercontent.com/images/${id}?width=96`;
const stackTabs = () => C.tools.map((t, i) => ({
  tab: t.tab,
  items: i === 0
    ? C.stack.items.map((s) => ({ name: s.name, role: s.role, group: s.group, logo: framerIcon(s.icon) }))
    : t.items.map(([name, slug]) => ({ name, logo: slug ? `https://cdn.simpleicons.org/${slug}` : null })),
}));
// Same split as orbitNodes() in site.js: inner ring takes half (max 7), outer ring the rest.
const orbitNodes = (items) => {
  const inner = Math.min(7, Math.ceil(items.length / 2));
  return items.map((t, i) => {
    const ring = i < inner ? 0 : 1;
    const count = ring ? items.length - inner : inner;
    const k = ring ? i - inner : i;
    const a = ((-90 + (360 / count) * k + (ring ? 180 / count : 0)) * Math.PI) / 180;
    const r = ring ? 46 : 28;
    const mark = t.logo ? `<img src="${t.logo}" alt="" width="26" height="26" loading="lazy">` : `<b>${esc(t.name.slice(0, 2))}</b>`;
    return `<div class="orbit__node${ring ? ' is-outer' : ''}" data-tech="${esc(t.name)}" style="left:${(50 + Math.cos(a) * r).toFixed(2)}%;top:${(50 + Math.sin(a) * r).toFixed(2)}%"><span>${mark}</span></div>`;
  }).join('');
};
const stackItem = (t) => `<li class="stackx__item" data-tech="${esc(t.name)}">${t.logo ? `<img src="${t.logo}" alt="" width="22" height="22" loading="lazy">` : `<b class="stackx__mono">${esc(t.name.slice(0, 2))}</b>`}<span><b>${esc(t.name)}</b>${t.role ? `<small>${esc(t.role)}</small>` : ''}</span></li>`;

const techStack = () => {
  const tabs = stackTabs();
  return `<section class="section stackx" id="tools" data-stackx>
  <div class="wrap stackx__grid">
    <div class="stackx__copy" data-tabs>
      ${eyebrow('Platforms & partners')}
      <h2 class="h2" data-split>Tools &amp; technologies</h2>
      <p class="lead" data-reveal>${esc(C.stack.lead)}</p>
      <div class="seg" role="tablist" aria-label="Technology categories" data-reveal>${tabs.map((t, i) => `<button role="tab" type="button" id="stk-tab-${i}" aria-controls="stk-panel-${i}" aria-selected="${i === 0}" tabindex="${i === 0 ? 0 : -1}">${esc(t.tab)}</button>`).join('')}</div>
      ${tabs.map((t, i) => `<div class="stackx__panel" role="tabpanel" id="stk-panel-${i}" aria-labelledby="stk-tab-${i}"${i ? ' hidden' : ''}>${i === 0
        ? `<ul class="stackx__groups">${C.stack.groups.map((g) => `<li><h3>${esc(g)}</h3><ul>${t.items.filter((x) => x.group === g).map(stackItem).join('')}</ul></li>`).join('')}</ul>`
        : `<ul class="stackx__flat">${t.items.map(stackItem).join('')}</ul>`}</div>`).join('')}
    </div>
    <div class="orbit" aria-hidden="true" data-reveal>
      <i class="orbit__ring orbit__ring--outer"></i><i class="orbit__ring orbit__ring--inner"></i>
      <div class="orbit__track" data-orbit>${orbitNodes(tabs[0].items)}</div>
      <div class="orbit__core"><img src="${C.logoMark}" alt="" width="40" height="40"><span>Demaze</span></div>
    </div>
  </div>
</section>`;
};

const hero = () => `<section class="hero" data-hero>
  <div class="hero__panel">
    ${sky}
    <div class="hero__content">
      <h1 class="hero__title" data-split="hero">Your Strategic Partner in Building <em>Scalable AI Products</em></h1>
      <div class="hero__aside">
        <p class="hero__lead" data-hero-fade>${esc(C.tagline)}</p>
        <div class="hero__ctas" data-hero-fade>${btn("Let's Connect", './contact', 'btn--blue')}${btn('Explore Services', './services', 'btn--white')}</div>
      </div>
    </div>
    <!-- signal flow: scattered data streams into the Demaze core and leaves as clean, structured lines (flow.js) -->
    <div class="hero__flow" aria-hidden="true" data-flow>
      <canvas></canvas>
      <div class="hero__core"><img src="${C.logoMark}" alt="" width="56" height="56"></div>
    </div>
    <div class="hero__proof" data-hero-proof>
      <a class="hero__note" href="#founder">
        <img src="${C.founder.photo}" alt="" width="44" height="44">
        <span><q>When you thrive, we thrive</q><small>${C.founder.name}, ${C.founder.title}</small></span>
      </a>
      <ul class="hero__stats">${C.metrics.map((m) => `<li><b>${m.prefix}<span data-count="${m.value}">${m.value}</span>${m.suffix}</b><small>${m.label}</small></li>`).join('')}</ul>
    </div>
  </div>
</section>`;

// The 10 keywords from the live "About us" block, as a moving strip.
// Two rows run in opposite directions (the second outlined); scroll speed pushes them along (site.js).
const keywords = () => {
  const k = C.about.keywords;
  const row = (list) => list.map((t) => `<li>${esc(t)}</li>`).join('');
  const half = Math.ceil(k.length / 2);
  const a = row([...k.slice(0, half), ...k.slice(0, half)]), b = row([...k.slice(half), ...k.slice(half)]);
  return `<section class="strip strip--words" aria-label="What we stand for" data-words>
  <p class="sr-only">${k.map(esc).join(', ')}</p>
  <div class="marquee" aria-hidden="true"><ul class="marquee__track">${a}</ul><ul class="marquee__track">${a}</ul></div>
  <div class="marquee marquee--rev marquee--outline" aria-hidden="true"><ul class="marquee__track">${b}</ul><ul class="marquee__track">${b}</ul></div>
</section>`;
};

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
    <figure class="stack-card__media"><img src="${p.image}" alt="${esc(p.title)}, product screens" loading="lazy"></figure>
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

const servicePanel = (s, i) => `<article class="svc-panel${i === 0 ? ' is-active' : ''}" id="${s.id}" style="--c:${s.color}" data-svc-panel>
  <div class="svc-panel__art"><img src="${s.image}" alt="" loading="lazy"></div>
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

const whyUs = () => `<section class="section why">
  <div class="wrap">
    <div class="section-head">${eyebrow('Benefits')}<h2 class="h2" data-split>Why choose us</h2></div>
    <div class="why__grid" data-stagger>
      ${C.whyUs.map((w, i) => `<article class="why-card why-card--${i}"><div class="why-card__art"><img src="${w.image}" alt="" loading="lazy"></div><h3>${esc(w.title)}</h3><p>${esc(w.description)}</p></article>`).join('')}
    </div>
  </div>
</section>`;

const industries = () => `<section class="section industries" id="industries">
  <div class="wrap ind" data-tabs data-ind-auto>
    <div class="ind__side">
      ${eyebrow('Industries')}
      <h2 class="h2" data-split>Industries we serve</h2>
      <p class="lead" data-reveal>${C.industries.length} industries. Pick one to see the kinds of systems we build for it.</p>
      <div class="ind__tabs" role="tablist" aria-label="Industries">${C.industries.map(([n], i) => `<button role="tab" type="button" id="ind-tab-${i}" aria-controls="ind-panel-${i}" aria-selected="${i === 0}" tabindex="${i === 0 ? 0 : -1}">${esc(n)}</button>`).join('')}</div>
    </div>
    <div class="ind__stage">${C.industries.map(([n, items], i) => `<div class="ind__panel" role="tabpanel" id="ind-panel-${i}" aria-labelledby="ind-tab-${i}" style="--hue:${(i * 23) % 150 - 40}deg"${i ? ' hidden' : ''}><span class="ind__big" aria-hidden="true">${pad(i + 1)}</span><div class="ind__head"><span>${pad(i + 1)} / ${C.industries.length}</span><h3>${esc(n)}</h3></div><ul>${items.map((t) => `<li>${icon.check}${esc(t)}</li>`).join('')}</ul></div>`).join('')}</div>
  </div>
</section>`;

const process = () => `<section class="section process" data-process>
  <div class="wrap">
    <div class="section-head section-head--split">
      <div>${eyebrow('How we work')}<h2 class="h2" data-split>Our process</h2><p class="lead" data-reveal>Four clear stages, from the first workshop to long-term growth.</p></div>
      <div data-reveal>${btn('Book a call', C.calendly, 'btn--blue', 'target="_blank" rel="noopener"')}</div>
    </div>
    <ol class="steps">
      <i class="steps__line" aria-hidden="true"><i data-process-line></i></i>
      ${C.process.map((s, i) => `<li class="step" data-step><span class="step__num">${pad(i + 1)}<small>/${pad(C.process.length)}</small></span><h3>${esc(s.title)}</h3><p>${esc(s.description)}</p></li>`).join('')}
    </ol>
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
      <img class="quote__photo" src="${C.founder.photo}" alt="${C.founder.name}, ${C.founder.title}" width="300" height="330" loading="lazy" data-reveal>
    </figure>
  </div>
</section>`;

const faq = () => `<section class="section faq">
  <div class="wrap faq__grid">
    <div>${eyebrow('FAQs')}<h2 class="h2" data-split>Questions? Answers!</h2><p class="lead" data-reveal>Still curious? <a class="link" href="mailto:${C.email}">${C.email}</a></p></div>
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
      <form class="form" data-form data-reveal novalidate>
        <h3>Reach us at anytime</h3>
        <div class="form__row"><label>Name<input name="name" autocomplete="name" required></label>
        <label>Email<input name="email" type="email" autocomplete="email" required></label></div>
        <label>Subject of interest<select name="subject"><option>General enquiry</option>${C.services.map((s) => `<option>${esc(s.title)}</option>`).join('')}</select></label>
        <label>How may we assist you?<textarea name="message" rows="3" required></textarea></label>
        <button class="btn btn--blue" type="submit"><span>Submit</span><i class="btn__icon">${icon.arrow}</i></button>
        <p class="form__note" data-form-note aria-live="polite">Opens your email app with the message ready to send.</p>
      </form>
    </div>
  </div>
</section>`;

const statsBar = () => `<ul class="phero__stats" data-hero-fade>${C.metrics.map((m) => `<li><b>${m.prefix}<span data-count="${m.value}">${m.value}</span>${m.suffix}</b><small>${m.label}</small></li>`).join('')}</ul>`;

// Projects page: compact cards; each opens a dialog with the full case (content lives in a <template>).
const projectsGrid = () => `<section class="section projects">
  <div class="wrap">
    <div class="pgrid">${C.projects.map((p, i) => `<article class="pcard${i === 0 ? ' pcard--wide' : ''}" style="--tint:${p.tint}" data-reveal>
      <figure class="pcard__media"><img src="${p.image.replace('width=1600', 'width=1000')}" alt="" loading="lazy"></figure>
      <div class="pcard__body">
        <span class="pcard__num">${pad(i + 1)}</span>
        <h2><button type="button" class="pcard__btn" data-proj="${i}" aria-haspopup="dialog">${esc(p.title)}</button></h2>
        ${p.description ? `<p>${esc(p.description)}</p>` : ''}
        <span class="pcard__more">View project ${icon.arrow}</span>
      </div>
      <template data-proj-tpl="${i}">
        <figure class="pdlg__media" style="--tint:${p.tint}"><img src="${p.image}" alt="${esc(p.title)}, product screens"></figure>
        <div class="pdlg__body">
          <span class="pcard__num">${pad(i + 1)} / ${pad(C.projects.length)}</span>
          <h2 id="pdlg-title">${esc(p.title)}</h2>
          ${p.description ? `<p>${esc(p.description)}</p>` : ''}
          <h3>Highlights</h3>
          <ul class="checks checks--ink">${p.features.map((f) => `<li>${icon.check}${esc(f)}</li>`).join('')}</ul>
          <div class="pdlg__cta">${btn('Discuss a similar project', C.calendly, 'btn--blue', 'target="_blank" rel="noopener"')}</div>
        </div>
      </template>
    </article>`).join('')}</div>
  </div>
  <dialog class="pdlg" aria-labelledby="pdlg-title" data-pdlg data-lenis-prevent>
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
    body: [hero(), work(), services(), techStack(), industries(), whyUs(), keywords(), about(), process(), founder(), faq(), contact()].join('\n'),
  }),
  projects: layout({
    slug: 'projects',
    title: 'Projects | Demaze Technologies',
    description: 'AI software, eCommerce platforms, SaaS and mobile apps Demaze Technologies has designed and built.',
    body: [
      pageHero('Our work', 'The projects <em>we did</em>', `${C.projects.length} products across automotive, legal, commerce, fintech, education, media and more. Open any project for the full story.`, statsBar()),
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
      services(false), techStack(), industries(), process(), contact(),
    ].join('\n'),
  }),
  'about-us': layout({
    slug: 'about-us',
    title: 'About Us | Demaze Technologies',
    description: C.about.whoWeAre[0],
    body: [
      pageHero('What we are', 'More than developers: <em>digital transformation architects</em>', C.about.whoWeAre[1], statsBar()),
      keywords(), about({ link: false }), whyUs(), founder(), process(), contact(),
    ].join('\n'),
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

for (const [name, html] of Object.entries(pages)) {
  fs.writeFileSync(path.join(__dirname, name + '.html'), html);
  console.log('wrote', name + '.html', (html.length / 1024).toFixed(1) + 'KB');
}
