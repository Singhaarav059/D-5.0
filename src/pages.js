// The pages of the site: each one is the shared layout around a list of sections.
// To add a page, add an entry here (the key becomes public/<key>.html) and link it from NAV in templates/layout.js.
'use strict';

const C = require('./content');
const { btn } = require('./templates/helpers');
const { layout } = require('./templates/layout');
const { pageHero, faq, contact, band } = require('./templates/shared');
const { work, studio } = require('./templates/home');
const { journey } = require('./templates/journey');
const { about, stats, whyUs, founder } = require('./templates/about');
const { techStack, services, industries } = require('./templates/services');
const { projectsGrid } = require('./templates/projects');
const { visit } = require('./templates/contact');

const pages = {
  index: layout({
    slug: '',
    title: 'Demaze Technologies | Your Strategic Partner in Building Scalable AI Products',
    description: C.tagline,
    // Home page order: the hero that turns into "how we work", then proof (work), what we do (services), who we
    // are (studio), questions, contact. The tools map and industries live on the services page.
    body: [journey({ intro: true }), band(), work(), services(), studio(), faq(), contact()].join('\n'),
  }),
  projects: layout({
    slug: 'projects',
    title: 'Projects | Demaze Technologies',
    description: 'AI software, eCommerce platforms, SaaS and mobile apps Demaze Technologies has designed and built.',
    body: [
      pageHero('Projects', 'Products we’ve <em>designed and built</em>', `${C.projects.length} products across automotive, legal, commerce, fintech, education, media and more. Open any project for the full story.`, '', [['rocket', 'tomato'], ['star', 'sun'], ['heart', 'pink']]),
      projectsGrid(),
      contact(),
    ].join('\n'),
  }),
  services: layout({
    slug: 'services',
    title: 'Services | AI & ML, Web, Mobile, SaaS, eCommerce, Cloud | Demaze Technologies',
    description: 'AI & ML, web, mobile and SaaS development, intelligent eCommerce and cloud architecture from Demaze Technologies.',
    body: [
      pageHero('Services', 'Apps, websites, <em>AI and more</em>', C.tagline, '', [['pencil', 'lilac'], ['gear', 'sky'], ['bulb', 'sun']]),
      band(), services(false), techStack(), industries(), journey(), contact(),
    ].join('\n'),
  }),
  'about-us': layout({
    slug: 'about-us',
    title: 'About Us | Demaze Technologies',
    description: C.about.whoWeAre[0],
    body: [
      pageHero('About us', 'More than developers. <em>Digital transformation architects.</em>', C.about.whoWeAre[1], stats(), [['heart', 'pink'], ['bulb', 'sun'], ['star', 'mint']]),
      about(), whyUs(), founder(), journey(), contact(),
    ].join('\n'),
  }),
  404: layout({
    slug: '404',
    noindex: true,
    title: 'Page not found | Demaze Technologies',
    description: 'This page does not exist. Head back to the Demaze home page or browse our projects.',
    body: pageHero('Error 404', 'A dead end. <em>Let’s find your way back.</em>', 'The link may be old or mistyped. Everything we build is still one click away.',
      `<div class="hero__ctas" data-hero-fade>${btn('Back to home', './')}${btn('See our work', './projects', 'btn--ghost')}</div>`, [['ghost', 'lilac'], ['question', 'sky'], ['star', 'sun']]),
  }),
  contact: layout({
    slug: 'contact',
    title: 'Contact | Demaze Technologies',
    description: `Email ${C.email}, book a call, or visit us in Ahmedabad.`,
    body: [
      pageHero('Contact', 'Let’s talk about <em>what you’re building</em>', 'Email us with any question, or book a 30-minute call if that’s easier.',
        `<div class="hero__ctas" data-hero-fade>${btn('Book with Calendly', C.calendly, 'btn--primary', 'target="_blank" rel="noopener"')}${btn(C.email, 'mailto:' + C.email, 'btn--ghost')}</div>`, [['cup', 'tomato'], ['heart', 'pink'], ['star', 'sky']]),
      contact('form'), visit(), faq(),
    ].join('\n'),
  }),
};

module.exports = pages;
