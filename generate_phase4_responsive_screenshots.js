const puppeteer = require('puppeteer-core');
const fs = require('fs');
const path = require('path');

const delay = ms => new Promise(r => setTimeout(r, ms));
const SCREENSHOT_DIR = path.join(__dirname, 'docs', 'screenshots');
if (!fs.existsSync(SCREENSHOT_DIR)) {
  fs.mkdirSync(SCREENSHOT_DIR, { recursive: true });
}

const VIEWPORTS = [
  { width: 1920, height: 1080, name: '1920' },
  { width: 1440, height: 900, name: '1440' },
  { width: 1024, height: 768, name: '1024' },
  { width: 768, height: 1024, name: '768' },
  { width: 390, height: 844, name: '390', isMobile: true }
];

const PAGES = [
  { id: 'home', url: 'http://localhost:3000/' },
  { id: 'services', url: 'http://localhost:3000/services' },
  { id: 'projects', url: 'http://localhost:3000/projects' },
  { id: 'about-us', url: 'http://localhost:3000/about-us' },
  { id: 'contact', url: 'http://localhost:3000/contact' }
];

async function smoothScroll(page) {
  await page.evaluate(async () => {
    await new Promise((resolve) => {
      let totalHeight = 0;
      const distance = 400;
      const timer = setInterval(() => {
        const scrollHeight = document.body.scrollHeight;
        window.scrollBy(0, distance);
        totalHeight += distance;

        if (totalHeight >= scrollHeight) {
          clearInterval(timer);
          window.scrollTo(0, 0);
          resolve();
        }
      }, 80);
    });
  });
  await delay(600);
}

(async () => {
  console.log('=== PHASE 4: FULL RESPONSIVE QA & SCREENSHOT VERIFICATION (1920, 1440, 1024, 768, 390) ===\n');

  const browser = await puppeteer.launch({
    executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage();
  const results = [];

  for (const p of PAGES) {
    console.log(`\nTesting Page: /${p.id}...`);

    for (const vp of VIEWPORTS) {
      await page.setViewport({
        width: vp.width,
        height: vp.height,
        isMobile: vp.isMobile || false,
        hasTouch: vp.isMobile || false
      });

      const errors = [];
      const onConsole = msg => {
        if (msg.type() === 'error') {
          // filter out harmless third-party / favicon errors if any
          const text = msg.text();
          if (!text.includes('favicon.ico')) errors.push(text);
        }
      };
      page.on('console', onConsole);

      await page.goto(p.url, { waitUntil: 'networkidle2', timeout: 40000 });
      // wait for hydration & layout
      await delay(p.id === 'home' ? 3500 : 1200);

      // smooth scroll to trigger all reveals & lazy assets
      await smoothScroll(page);

      // Audit layout metrics
      const metrics = await page.evaluate(() => {
        const docWidth = document.documentElement.scrollWidth;
        const winWidth = window.innerWidth;
        const hasHorizontalOverflow = docWidth > winWidth;

        const badgeEl = document.querySelector('#__framer-badge-container, [data-framer-name="Made in Framer"], .framer-badge');
        let badgeVisible = false;
        if (badgeEl) {
          const rect = badgeEl.getBoundingClientRect();
          const style = window.getComputedStyle(badgeEl);
          badgeVisible = (rect.width > 0 && rect.height > 0 && style.display !== 'none' && style.visibility !== 'hidden' && style.opacity !== '0');
        }

        const brokenImgs = Array.from(document.querySelectorAll('img')).filter(img => {
          return img.complete && img.naturalWidth === 0;
        }).map(img => img.src);

        return {
          docWidth,
          winWidth,
          hasHorizontalOverflow,
          badgeVisible,
          brokenImgsCount: brokenImgs.length,
          brokenImgs
        };
      });

      // Capture screenshot
      const shotPath = path.join(SCREENSHOT_DIR, `responsive-${p.id}-${vp.name}.png`);
      await page.screenshot({ path: shotPath, fullPage: true });

      page.off('console', onConsole);

      const status = {
        page: p.id,
        viewport: vp.name,
        overflow: metrics.hasHorizontalOverflow ? `OVERFLOW (${metrics.docWidth}px > ${metrics.winWidth}px)` : 'OK',
        badge: metrics.badgeVisible ? 'VISIBLE (FAIL)' : 'HIDDEN (PASS)',
        brokenImages: metrics.brokenImgsCount,
        errorsCount: errors.length,
        screenshot: shotPath
      };

      results.push(status);
      console.log(`  [${vp.name}px] Overflow: ${status.overflow} | Badge: ${status.badge} | Broken Imgs: ${status.brokenImages} | Console Errors: ${status.errorsCount}`);
    }
  }

  await browser.close();

  console.log('\n=== RESPONSIVE AUDIT SUMMARY ===');
  console.table(results.map(r => ({
    Page: r.page,
    Viewport: r.viewport,
    Overflow: r.overflow,
    Badge: r.badge,
    BrokenImgs: r.brokenImages,
    Errors: r.errorsCount
  })));

  const totalErrors = results.reduce((sum, r) => sum + r.errorsCount + (r.overflow !== 'OK' ? 1 : 0) + (r.badge.includes('FAIL') ? 1 : 0) + r.brokenImages, 0);
  console.log(`\nTotal Validation Anomalies: ${totalErrors}`);
})();
