const puppeteer = require('puppeteer-core');

const pages = [
  { name: 'Home', url: 'http://localhost:3000/' },
  { name: 'Services', url: 'http://localhost:3000/services' },
  { name: 'Projects', url: 'http://localhost:3000/projects' },
  { name: 'About Us', url: 'http://localhost:3000/about-us' },
  { name: 'Contact', url: 'http://localhost:3000/contact' }
];

(async () => {
  const browser = await puppeteer.launch({
    executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });
  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 900 });

  console.log('=== PHASE 4 AUDIT: HEADING HIERARCHY, IMAGES, METAS, JSON-LD, NAV & FOOTER ===\n');

  for (const p of pages) {
    await page.goto(p.url, { waitUntil: 'networkidle2', timeout: 30000 });
    await new Promise(r => setTimeout(r, 3500));

    const audit = await page.evaluate(() => {
      const title = document.title;
      const metaDesc = document.querySelector('meta[name="description"]')?.content || 'NONE';
      const canonical = document.querySelector('link[rel="canonical"]')?.href || 'NONE';
      const ogTitle = document.querySelector('meta[property="og:title"]')?.content || 'NONE';
      const ogDesc = document.querySelector('meta[property="og:description"]')?.content || 'NONE';
      const ogImage = document.querySelector('meta[property="og:image"]')?.content || 'NONE';
      const twitterCard = document.querySelector('meta[name="twitter:card"]')?.content || 'NONE';

      const h1s = Array.from(document.querySelectorAll('h1')).map(el => el.textContent.replace(/\s+/g, ' ').trim());
      const h2s = Array.from(document.querySelectorAll('h2')).map(el => el.textContent.replace(/\s+/g, ' ').trim());

      const skipLink = !!document.querySelector('a[href="#main-content"]');
      const mainContent = !!document.querySelector('#main-content');

      const imgs = Array.from(document.querySelectorAll('img'));
      const imgsWithoutAlt = imgs.filter(img => !img.hasAttribute('alt') || img.alt.trim() === '').map(img => img.src);

      const jsonLdScripts = Array.from(document.querySelectorAll('script[type="application/ld+json"]'));
      const jsonLdTypes = [];
      jsonLdScripts.forEach(s => {
        try {
          const d = JSON.parse(s.textContent);
          if (Array.isArray(d)) {
            d.forEach(item => jsonLdTypes.push(item['@type']));
          } else if (d['@type']) {
            jsonLdTypes.push(d['@type']);
          }
        } catch (e) {
          jsonLdTypes.push('PARSE_ERROR');
        }
      });

      const bodyText = document.body.innerText;
      const has2026 = bodyText.includes('2026');
      const hasTagline = bodyText.includes('Empowering AI Innovation Worldwide');

      const navExists = !!document.querySelector('.demaze-nav-bar, nav');
      const footerExists = !!document.querySelector('.demaze-footer, footer');

      return {
        title,
        metaDesc,
        canonical,
        ogTitle,
        ogDesc,
        ogImage,
        twitterCard,
        h1s,
        h2Count: h2s.length,
        skipLink,
        mainContent,
        imgCount: imgs.length,
        imgsWithoutAlt,
        jsonLdTypes,
        has2026,
        hasTagline,
        navExists,
        footerExists
      };
    });

    console.log(`\n--- Page: ${p.name} (${p.url}) ---`);
    console.log(`Title: "${audit.title}"`);
    console.log(`Meta Desc: "${audit.metaDesc.substring(0, 60)}..."`);
    console.log(`Canonical: "${audit.canonical}"`);
    console.log(`OG Image: "${audit.ogImage}"`);
    console.log(`Twitter Card: "${audit.twitterCard}"`);
    console.log(`H1 count: ${audit.h1s.length}`);
    audit.h1s.forEach((t, i) => console.log(`  H1[${i+1}]: "${t}"`));
    console.log(`H2 count: ${audit.h2Count}`);
    console.log(`Skip link: ${audit.skipLink}, #main-content target: ${audit.mainContent}`);
    console.log(`Images total: ${audit.imgCount}, without alt: ${audit.imgsWithoutAlt.length}`);
    if (audit.imgsWithoutAlt.length > 0) {
      console.log(`  Sample imgs without alt:`, audit.imgsWithoutAlt.slice(0, 4));
    }
    console.log(`JSON-LD: ${audit.jsonLdTypes.join(', ') || 'NONE'}`);
    console.log(`Footer has 2026: ${audit.has2026}, has standard tagline: ${audit.hasTagline}`);
    console.log(`Nav: ${audit.navExists}, Footer: ${audit.footerExists}`);
  }

  await browser.close();
})();
