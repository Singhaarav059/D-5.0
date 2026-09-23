// One-off: rebuild projects.html main content from its existing card data.
const fs = require('fs');
const ROOT = 'C:/Users/singh/Claude/Projects/Framer/';
let s = fs.readFileSync(ROOT + 'projects.html', 'utf8');

const strip = x => x.replace(/<[^>]+>/g, '').replace(/\s+/g, ' ').trim();
const cards = [];
const re = /<article class="valist-case-card[^"]*" data-category="([^"]+)">([\s\S]*?)<\/article>/g;
let m;
while ((m = re.exec(s))) {
  const b = m[2];
  const img = (b.match(/<img src="([^"]+)"/) || [])[1];
  cards.push({
    cat: m[1],
    img,
    tag: strip((b.match(/valist-pill-tag-mini">([\s\S]*?)<\/span>/) || [])[1] || ''),
    title: strip((b.match(/valist-pill-title">([\s\S]*?)<\/h2>/) || [])[1] || ''),
    desc: strip((b.match(/valist-case-desc">([\s\S]*?)<\/p>/) || [])[1] || ''),
    feats: [...b.matchAll(/valist-tag-chip">([\s\S]*?)<\/span>/g)].map(x => strip(x[1]))
  });
}
if (cards.length !== 14) throw new Error('expected 14 cards, got ' + cards.length);

const FIX = [
  ['military-grade document permission tiers', 'tiered document permissions'],
  ['Leading online retail ecosystem across Australia and New Zealand', 'Online retail ecosystem across Australia and New Zealand'],
];
cards.forEach(c => FIX.forEach(([a, b]) => { c.desc = c.desc.replace(a, b); }));
const title = t => t.charAt(0) + t.slice(1).replace(/\b(Software|Platform|Marketplace|App|Management|Case|Luxury|Payment|Transfer|Report|Generation|Recruitment|Corporate|Gifting|Courses|Engagement|Support|Service|Customer|Document|Staff|Task|Food|Grocery|Delivery|Creation|Films|Storyboard|Educational)\b/g, w => w.toLowerCase());
cards.forEach(c => { c.title = title(c.title).replace(/\bai\b/g, 'AI').replace(/\bcma\b/g, 'CMA').replace(/\bb2b\b/gi, 'B2B').replace(/\blms\b/gi, 'LMS'); });

const FILTERS = [];
s.replace(/<button type="button" class="filter-btn[^"]*" data-filter="([^"]+)">([^<]+)<\/button>/g, (_, f, t) => { FILTERS.push([f, t.replace(/\s*\(\d+\)/, '')]); });
const count = f => f === 'all' ? cards.length : cards.filter(c => c.cat === f).length;

const html = `<header class="dz-page-hero">
    <div class="dz-container">
      <span class="dz-eyebrow">Projects</span>
      <h1 class="dz-h1">Software we have designed, built and shipped</h1>
      <p class="dz-lead">A selection of AI software, enterprise platforms and digital products delivered for clients across industries.</p>
    </div>
  </header>

  <main id="main-content">
    <section class="dz-section" aria-label="Projects">
      <div class="dz-container">
        <div class="dz-filters" role="group" aria-label="Filter projects by industry">
${FILTERS.filter(([f]) => count(f)).map(([f, t], i) => `          <button type="button" class="dz-filter" data-filter="${f}" aria-pressed="${i === 0}">${t}<span>${count(f)}</span></button>`).join('\n')}
        </div>
        <ul class="dz-projects">
${cards.map(c => `          <li class="dz-project" data-category="${c.cat}">
            <div class="dz-project-media"><img src="${c.img}" alt="" loading="lazy" decoding="async" width="1024" height="768"></div>
            <p class="dz-project-domain">${c.tag}</p>
            <h2>${c.title}</h2>
            <p>${c.desc}</p>
            <ul class="dz-dash-list">${c.feats.map(f => `<li>${f}</li>`).join('')}</ul>
          </li>`).join('\n')}
        </ul>
      </div>
    </section>
    <div data-dz-block="contact"></div>
  </main>`;

const a = s.indexOf('<header class="demaze-subpage-hero');
const b = s.indexOf('</main>') + '</main>'.length;
s = s.slice(0, a) + html + s.slice(b);
const sa = s.indexOf('<script>\n    // Category Filter Functionality');
s = s.slice(0, sa) + `<script>
    (function () {
      var btns = document.querySelectorAll('.dz-filter');
      var cards = document.querySelectorAll('.dz-project');
      btns.forEach(function (btn) {
        btn.addEventListener('click', function () {
          var f = btn.getAttribute('data-filter');
          btns.forEach(function (b) { b.setAttribute('aria-pressed', String(b === btn)); });
          cards.forEach(function (c) { c.hidden = f !== 'all' && c.getAttribute('data-category') !== f; });
        });
      });
    })();
  </script>` + s.slice(s.indexOf('</script>', sa) + '</script>'.length);
if (!s.includes('/demaze/demaze-content.js')) s = s.replace('<script src="/assets/demaze/lenis.min.js"></script>', '<script src="/demaze/demaze-content.js"></script>\n  <script src="/demaze/demaze-blocks.js"></script>\n  <script src="/assets/demaze/lenis.min.js"></script>');
fs.writeFileSync(ROOT + 'projects.html', s);
console.log(cards.map(c => c.cat + ' | ' + c.title).join('\n'));
