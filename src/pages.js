// The pages of the site: each one is the shared layout around a list of sections.
// To add a page, add an entry here (the key becomes public/<key>.html) and link it from NAV in templates/layout.js.
'use strict';

const C = require('./content');
const { btn, caseHref } = require('./templates/helpers');
const S = require('./templates/schema');
const { layout } = require('./templates/layout');
const { pageHero, faq, contact } = require('./templates/shared');
const { hero, work, studio } = require('./templates/home');
const { about, whyUs, founder } = require('./templates/about');
const { techStack, services, industries, processSection } = require('./templates/services');
const { projectsGrid } = require('./templates/projects');
const { visit } = require('./templates/contact');
const { caseStudy } = require('./templates/case');

const pages = {
  index: layout({
    slug: '',
    title: 'Demaze Technologies | Your Strategic Partner in Building Scalable AI Products',
    description: 'Demaze designs and builds AI software, web and mobile apps, SaaS and eCommerce platforms, from the first workshop to launch and beyond.',
    schema: [S.organization(), S.website(), S.faqPage()],
    // Home page order: hero, work, services, tools, industries, who we are, process, FAQ, contact.
    body: [hero(), work(), services(), techStack(), industries(), studio(), processSection(), faq(), contact()].join('\n'),
  }),
  projects: layout({
    slug: 'projects',
    title: 'Projects | Demaze Technologies',
    description: 'AI software, eCommerce platforms, SaaS and mobile apps Demaze Technologies has designed and built.',
    schema: [S.organization(), S.projects(caseHref), S.breadcrumbs([['Home', './'], ['Projects', './projects']])],
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
    schema: [S.organization(), S.services(), S.breadcrumbs([['Home', './'], ['Services', './services']])],
    body: [
      pageHero('Services', 'Apps, websites, <em>AI and more</em>', C.tagline),
      services(false), techStack(), industries(), processSection(), contact(),
    ].join('\n'),
  }),
  'about-us': layout({
    slug: 'about-us',
    title: 'About Us | Demaze Technologies',
    description: 'Demaze Technologies is a team of 35+ technologists in Ahmedabad building AI products, apps and platforms as a long-term partner to its clients.',
    schema: [S.organization(), S.breadcrumbs([['Home', './'], ['About us', './about-us']])],
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
    schema: [S.organization(), S.breadcrumbs([['Home', './'], ['Contact', './contact']])],
    body: [
      pageHero('Contact', 'Reach us <em>at anytime</em>', 'Feel free to email us if you have any questions or need more details, or book a call if that’s more convenient and easier for you.',
        `<div class="hero__ctas" data-hero-fade>${btn('Book with Calendly', C.calendly, 'btn--blue', 'target="_blank" rel="noopener"')}${btn(C.email, 'mailto:' + C.email, 'btn--white')}</div>`),
      contact({ form: true }), visit(), faq(),
    ].join('\n'),
  }),
};

// One case study page per project, at projects/<image key> (build.js writes it one folder down).
C.projects.forEach((p, i) => {
  const href = caseHref(p);
  const shot = S.image(p.image);
  pages[href.slice(2)] = layout({
    slug: href.slice(2),
    section: 'projects',
    title: `${p.title} | Case Study | Demaze Technologies`,
    description: p.brief,
    og: { ...shot, alt: `${p.title}, product screens` },
    schema: [S.organization(), S.caseStudy(p, href), S.breadcrumbs([['Home', './'], ['Projects', './projects'], [p.name, href]])],
    body: [caseStudy(p, i), contact()].join('\n'),
  });
});

module.exports = pages;
