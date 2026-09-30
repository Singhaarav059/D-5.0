// The pages of the site: each one is the shared layout around a list of sections.
// To add a page, add an entry here (the key becomes public/<key>.html) and link it from NAV in templates/layout.js.
// A key with a slash is a page one folder down (projects/<case>); build.js points its links back up to the root.
'use strict';

const C = require('./content');
const { caseHref, btn, kicker, words } = require('./templates/helpers');
const S = require('./templates/schema');
const { layout } = require('./templates/layout');
const { maze } = require('./templates/maze');
const { pageHead } = require('./templates/shared');
const { hero, tape, howWeWork, work, services, studio, start } = require('./templates/home');
const { projectsGrid } = require('./templates/projects');
const { caseStudy } = require('./templates/case');
const { serviceList, tools, industries, faq } = require('./templates/services');
const { intro, drives, founder, why } = require('./templates/about');
const { contact, visit } = require('./templates/contact');

const SECTORS = new Set(C.projects.map((p) => p.sector)).size;

const pages = {
  index: layout({
    slug: '',
    title: 'Demaze Technologies | Your Strategic Partner in Building Scalable AI Products',
    description: 'Demaze designs and builds AI software, web and mobile apps, SaaS and eCommerce platforms, from the first workshop to launch and beyond.',
    schema: [S.organization(), S.website()],
    body: [hero(), tape(), howWeWork(), work(), services(), studio(), start()].join('\n'),
  }),
  projects: layout({
    slug: 'projects',
    title: 'Projects | Demaze Technologies',
    description: 'AI software, eCommerce platforms, SaaS and mobile apps Demaze Technologies has designed and built.',
    schema: [S.organization(), S.projects(caseHref), S.breadcrumbs([['Home', './'], ['Projects', './projects']])],
    body: [
      pageHead({ label: 'Projects', title: `${C.projects.length} products, <em>designed and built.</em>`, room: '#ff6242',
        lead: `From luxury automotive and fintech to legal, commerce and senior care: ${SECTORS} sectors in all. Every card plays a short film of the product: open one for its story.` }),
      projectsGrid(),
    ].join('\n'),
  }),
  services: layout({
    slug: 'services',
    title: 'Services | AI & ML, Web, Mobile, SaaS, eCommerce, Cloud | Demaze Technologies',
    description: 'AI & ML, web, mobile and SaaS development, intelligent eCommerce and cloud architecture from Demaze Technologies.',
    schema: [S.organization(), S.services(), S.faqPage(), S.breadcrumbs([['Home', './'], ['Services', './services']])],
    body: [
      pageHead({ label: 'Services', title: 'Four crafts, <em>one team.</em>', room: '#2fd0a0', lead: 'AI, software, commerce and cloud, built together so the product works as one system from day one.' }),
      serviceList(), tools(), industries(), faq(),
    ].join('\n'),
  }),
  'about-us': layout({
    slug: 'about-us',
    title: 'About Us | Demaze Technologies',
    description: 'Demaze Technologies is a team of 35+ technologists in Ahmedabad building AI products, apps and platforms as a long-term partner to its clients.',
    schema: [S.organization(), S.breadcrumbs([['Home', './'], ['About us', './about-us']])],
    body: [intro(), drives(), founder(), why()].join('\n'),
  }),
  contact: layout({
    slug: 'contact',
    title: 'Contact | Demaze Technologies',
    description: `Email ${C.email}, book a call, or visit us in Ahmedabad.`,
    schema: [S.organization(), S.breadcrumbs([['Home', './'], ['Contact', './contact']])],
    body: [contact(), visit()].join('\n'),
  }),
  404: layout({
    slug: '404',
    noindex: true,
    title: 'Page not found | Demaze Technologies',
    description: 'This page does not exist. Head back to the Demaze home page or browse our projects.',
    body: `<section class="wrap lost" data-room="#ff6242">
  <div class="lost__copy">
    ${kicker('404 · Page not found', 'kicker--tomato')}
    <h1 class="display display--hero" data-words>${words('Dead <em>end.</em>')}</h1>
    <p class="lead" data-reveal>Even good routes hit one. This page isn’t on the map, but these are.</p>
    <div class="actions" data-reveal>${btn('Back to the start', './', { tone: 'paper' })}${btn('See the work', './projects', { tone: 'ghost' })}</div>
  </div>
  ${maze({ cols: 12, rows: 8, seed: 5, tone: 'lost' })}
</section>`,
  }),
};

// Search engines show about 160 characters of a description: keep whole sentences that fit, else cut at a word.
const fit = (text, max = 160) => {
  if (text.length <= max) return text;
  const sentences = text.match(/[^.!?]+[.!?]+/g) || [];
  let out = '';
  for (const s of sentences) { if ((out + s).trim().length > max) break; out += s; }
  return out.trim() || `${text.slice(0, max - 1).replace(/\s+\S*$/, '')}…`;
};

// One case study page per project, in the grid's order.
C.projects.forEach((p, i) => {
  const href = caseHref(p);
  const og = S.image(p.image);
  pages[href.slice(2)] = layout({
    slug: href.slice(2),
    section: 'projects',
    title: `${p.title} | Case study | Demaze Technologies`,
    description: fit(`${p.brief} ${p.outcome}`),
    og: { ...og, alt: `${p.title}, product screens` },
    next: C.next.case,
    schema: [S.organization(), S.caseStudy(p, href), S.breadcrumbs([['Home', './'], ['Projects', './projects'], [p.name, href]])],
    body: caseStudy(p, i),
  });
});

module.exports = pages;
