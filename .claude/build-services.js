// One-off: rebuild services.html <header>…</main> with the Demaze design system.
const fs = require('fs');
const ROOT = 'C:/Users/singh/Claude/Projects/Framer/';
global.window = {};
require(ROOT + 'demaze/demaze-content.js');
const C = window.DEMAZE_CONTENT;

const PILLARS = [
  { id: '01', title: 'AI & Machine Learning', img: '/assets/demaze/ai_execution_graphic_1789813451769.jpg', alt: '',
    desc: 'We build AI-powered solutions that transform data into insights, automate complex tasks, and drive smarter decisions. From predictive analytics to computer vision and generative AI, our systems help businesses innovate and scale with confidence.' },
  { id: '02', title: 'Web, Mobile App & SaaS', img: 'https://framerusercontent.com/images/jHPfuoOX9UNd8Es5s5F3M8wzzo.png?scale-down-to=1024', alt: 'Investigative case management software screens',
    desc: 'We create scalable software and applications that deliver seamless user experiences and business value. From enterprise SaaS platforms to web and mobile apps, our solutions are built to perform, adapt, and grow with your needs.' },
  { id: '03', title: 'Intelligent E-Commerce', img: 'https://framerusercontent.com/images/K9H6ej2APXMnI3TZXYvyYkXZtJQ.png?scale-down-to=1024', alt: 'AI-powered luxury eCommerce app screens',
    desc: 'We build intelligent eCommerce platforms that elevate shopping experiences, improve conversions, and drive growth. From multi-vendor marketplaces to subscription commerce and AI-powered personalization, our solutions help retailers grow.' },
  { id: '04', title: 'Cloud Infrastructure & DevOps', img: 'https://framerusercontent.com/images/7tURVBvnRlwhQdd3SABZp9NRAQ.png?scale-down-to=1024', alt: '',
    desc: 'We design cloud architectures for scalability, security, and resilience. From cloud migration to DevOps automation and disaster recovery, our services help you optimize performance and reduce infrastructure costs.' }
];
PILLARS.forEach((p, i) => { p.items = C.coreCapabilities.items[i].subItems; });

const li = a => a.map(x => `<li>${x}</li>`).join('');

const html = `<header class="dz-page-hero">
    <div class="dz-container">
      <span class="dz-eyebrow">Services</span>
      <h1 class="dz-h1">Apps, websites, AI and more</h1>
      <p class="dz-lead">${C.hero.description}</p>
      <div class="dz-actions"><a class="dz-btn" href="/contact">Book a call</a><a class="dz-btn dz-btn--secondary" href="/projects">See our projects</a></div>
    </div>
  </header>

  <main id="main-content">
    <section class="dz-section" aria-labelledby="pillars-title">
      <div class="dz-container">
        <div class="dz-section-head">
          <span class="dz-eyebrow">${C.coreCapabilities.eyebrow}</span>
          <h2 class="dz-h2" id="pillars-title">${C.coreCapabilities.heading}</h2>
          <p class="dz-lead">${C.coreCapabilities.subtitle}</p>
        </div>
        <div class="dz-pillars">
${PILLARS.map(p => `          <article class="dz-pillar">
            <div class="dz-pillar-media"><img src="${p.img}" alt="${p.alt}" loading="lazy" decoding="async" width="1024" height="768"></div>
            <div class="dz-pillar-body">
              <span class="dz-pillar-num">${p.id}</span>
              <h3>${p.title}</h3>
              <p>${p.desc}</p>
              <ul class="dz-dash-list">${li(p.items)}</ul>
            </div>
          </article>`).join('\n')}
        </div>
      </div>
    </section>

    <section class="dz-section dz-section--tint" aria-labelledby="stack-title">
      <div class="dz-container">
        <div class="dz-section-head">
          <span class="dz-eyebrow">${C.engineeringSystems.eyebrow}</span>
          <h2 class="dz-h2" id="stack-title">Tools &amp; technologies</h2>
          <p class="dz-lead">${C.technologyStack.subtitle}</p>
        </div>
        <ul class="dz-tech-grid">
${C.engineeringSystems.technologies.map(t => `          <li><img src="${t.icon}" alt="" width="28" height="28" loading="lazy" decoding="async"><span><strong>${t.name}</strong>${t.role}</span></li>`).join('\n')}
        </ul>
      </div>
    </section>

    <section class="dz-section" aria-labelledby="industries-title">
      <div class="dz-container">
        <div class="dz-section-head">
          <span class="dz-eyebrow">Industries</span>
          <h2 class="dz-h2" id="industries-title">${C.industries.heading}</h2>
          <p class="dz-lead">Domains where we have delivered production software, and the broader ones we support.</p>
        </div>
        <div class="dz-ind-static">
          <div>
            <div class="dz-label">Proven through delivered projects</div>
            <ul>${C.industries.flagshipDomains.map(d => `<li><strong>${d.name}</strong><span>${d.caseProof}</span></li>`).join('')}</ul>
          </div>
          <div>
            <div class="dz-label">Also supported</div>
            <ul>${C.industries.secondaryDomains.map(d => `<li><strong>${d.name}</strong><span>${d.tagline}</span></li>`).join('')}</ul>
          </div>
        </div>
      </div>
    </section>

    <section class="dz-section dz-section--flush" aria-label="Frequently asked questions"><div data-dz-block="faq"></div></section>
    <div data-dz-block="contact"></div>
  </main>`;

let s = fs.readFileSync(ROOT + 'services.html', 'utf8');
const a = s.indexOf('<header class="demaze-subpage-hero');
const b = s.indexOf('</main>') + '</main>'.length;
if (a < 0 || b < a) throw new Error('markers');
s = s.slice(0, a) + html + s.slice(b);
// Drop the old industries tab script (it follows demaze-shared.js).
const sa = s.indexOf('<script>\n    // Initialize Industry Tabs');
if (sa >= 0) s = s.slice(0, sa) + s.slice(s.indexOf('</script>', sa) + '</script>'.length);
if (!s.includes('/demaze/demaze-blocks.js')) s = s.replace('<script src="/assets/demaze/lenis.min.js"></script>', '<script src="/demaze/demaze-blocks.js"></script>\n  <script src="/assets/demaze/lenis.min.js"></script>');
fs.writeFileSync(ROOT + 'services.html', s);
console.log('services.html rebuilt', s.length);
