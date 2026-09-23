// One-off: rebuild about-us.html main content from verified content only.
const fs = require('fs');
const ROOT = 'C:/Users/singh/Claude/Projects/Framer/';
global.window = {};
require(ROOT + 'demaze/demaze-content.js');
const C = window.DEMAZE_CONTENT;
const who = C.aboutUs.whoWeAre, values = C.aboutUs.whatDrivesUs.items, t = C.testimonial;

const html = `<header class="dz-page-hero">
    <div class="dz-container">
      <span class="dz-eyebrow">About us</span>
      <h1 class="dz-h1">More than developers, digital transformation architects</h1>
      <p class="dz-lead">${C.hero.description}</p>
      <div class="dz-actions"><a class="dz-btn" href="/contact">Book a call</a></div>
    </div>
  </header>

  <main id="main-content">
    <section class="dz-section" aria-labelledby="who-title">
      <div class="dz-container">
        <div class="dz-about-top">
          <div><span class="dz-eyebrow">Who we are</span><h2 class="dz-h2" id="who-title">A trusted, long-term technology partner</h2></div>
          <div class="dz-about-copy">${who.paragraphs.map(p => `<p>${p}</p>`).join('')}</div>
        </div>
        <ul class="dz-metrics">${C.metrics.items.map(m => `<li class="dz-metric"><span class="dz-metric-value">${m.value}</span><span class="dz-metric-label">${m.label}</span></li>`).join('')}</ul>
      </div>
    </section>

    <section class="dz-section dz-section--tint" aria-labelledby="values-title">
      <div class="dz-container">
        <div class="dz-section-head">
          <span class="dz-eyebrow">Our values</span>
          <h2 class="dz-h2" id="values-title">${C.aboutUs.whatDrivesUs.heading}</h2>
        </div>
        <ol class="dz-values">${values.map((v, i) => `<li><span class="dz-pillar-num">0${i + 1}</span><h3>${v.title}</h3><p>${v.description}</p></li>`).join('')}</ol>
      </div>
    </section>

    <section class="dz-section" aria-label="Founder">
      <div class="dz-container">
        <figure class="dz-founder">
          <img src="/assets/demaze/krupal_chaudhary.jpg" alt="${t.name}" width="180" height="197" loading="lazy" decoding="async">
          <div><blockquote><p>“${t.quote.replace(' - ', ', ')}”</p></blockquote>
          <figcaption><strong>${t.name}</strong>${t.title}, Demaze Technologies</figcaption></div>
        </figure>
      </div>
    </section>

    <section class="dz-section dz-section--flush dz-section--rule" aria-label="Frequently asked questions"><div data-dz-block="faq"></div></section>
    <div data-dz-block="contact"></div>
  </main>`;

let s = fs.readFileSync(ROOT + 'about-us.html', 'utf8');
const a = s.indexOf('<header class="demaze-subpage-hero');
const b = s.indexOf('</main>') + '</main>'.length;
if (a < 0 || b < a) throw new Error('markers');
s = s.slice(0, a) + html + s.slice(b);
if (!s.includes('/demaze/demaze-blocks.js')) s = s.replace('<script src="/assets/demaze/lenis.min.js"></script>', '<script src="/demaze/demaze-blocks.js"></script>\n  <script src="/assets/demaze/lenis.min.js"></script>');
fs.writeFileSync(ROOT + 'about-us.html', s);
console.log('about rebuilt');
