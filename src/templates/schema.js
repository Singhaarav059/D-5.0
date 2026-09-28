// Structured data (schema.org JSON-LD) for search engines: who Demaze is, what it offers, its work and its FAQ.
// layout.js writes each object into the page's <head>; everything here comes from content.js, so it never says more
// than the page does.
'use strict';

const C = require('../content');
const { SITE_URL, MANIFEST } = require('./helpers');

const ORG = `${SITE_URL}/#organization`;
const url = (href) => SITE_URL + href.replace(/^\./, '');

// The largest fallback image of a project screen, as an absolute URL with its size (for og:image and the case study).
const image = (key) => {
  const m = MANIFEST[key];
  const f = m.files.filter((x) => x.fmt !== 'webp').sort((a, b) => b.w - a.w)[0];
  return { url: `${SITE_URL}/assets/img/work/${f.file}`, w: f.w, h: Math.round((f.w * m.h) / m.w) };
};

const organization = () => ({
  '@context': 'https://schema.org',
  '@type': 'Organization',
  '@id': ORG,
  name: 'Demaze Technologies',
  alternateName: 'Demaze',
  url: `${SITE_URL}/`,
  logo: `${SITE_URL}/assets/img/icon-512.png`,
  image: `${SITE_URL}/assets/img/og.png`,
  description: C.tagline,
  email: C.email,
  address: {
    '@type': 'PostalAddress',
    streetAddress: C.address.replace(/, Gota, Ahmedabad$/, ', Gota'),
    addressLocality: 'Ahmedabad',
    addressRegion: 'Gujarat',
    addressCountry: 'IN',
  },
  founder: { '@type': 'Person', name: C.founder.name, jobTitle: C.founder.title, sameAs: [C.founder.href] },
  sameAs: C.socials.filter((s) => s.name === 'Instagram').map((s) => s.href), // (LinkedIn and X are the founder's)
  knowsAbout: C.services.map((s) => s.title),
});

const website = () => ({
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  '@id': `${SITE_URL}/#website`,
  name: 'Demaze Technologies',
  url: `${SITE_URL}/`,
  publisher: { '@id': ORG },
});

const faqPage = (limit = C.faq.length) => ({
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: C.faq.slice(0, limit).map((f) => ({ '@type': 'Question', name: f.q, acceptedAnswer: { '@type': 'Answer', text: f.a } })),
});

const services = () => ({
  '@context': 'https://schema.org',
  '@type': 'ItemList',
  name: 'Services',
  itemListElement: C.services.map((s, i) => ({
    '@type': 'ListItem',
    position: i + 1,
    item: { '@type': 'Service', name: s.title, description: s.description, url: `${SITE_URL}/services#${s.id}`, serviceType: s.items, provider: { '@id': ORG } },
  })),
});

const projects = (caseHref) => ({
  '@context': 'https://schema.org',
  '@type': 'ItemList',
  name: 'Projects',
  itemListElement: C.projects.map((p, i) => ({ '@type': 'ListItem', position: i + 1, name: p.title, url: url(caseHref(p)) })),
});

// trail: [[name, href], ...] from the home page down to this page
const breadcrumbs = (trail) => ({
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: trail.map(([name, href], i) => ({ '@type': 'ListItem', position: i + 1, name, item: url(href) })),
});

const caseStudy = (p, href) => ({
  '@context': 'https://schema.org',
  '@type': 'CreativeWork',
  '@id': `${url(href)}#case-study`,
  url: url(href),
  name: p.title,
  headline: p.title,
  alternativeHeadline: p.name,
  description: p.brief,
  abstract: p.outcome,
  about: p.sector,
  keywords: p.features.join(', '),
  image: image(p.image).url,
  creator: { '@id': ORG },
  publisher: { '@id': ORG },
});

module.exports = { organization, website, faqPage, services, projects, breadcrumbs, caseStudy, image };
