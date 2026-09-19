const puppeteer = require('puppeteer-core');
const fs = require('fs');
const path = require('path');

const delay = ms => new Promise(r => setTimeout(r, ms));
const SCREENSHOT_DIR = path.join(__dirname, 'docs', 'screenshots');
if (!fs.existsSync(SCREENSHOT_DIR)) {
  fs.mkdirSync(SCREENSHOT_DIR, { recursive: true });
}

async function smoothScroll(page) {
  await page.evaluate(async () => {
    await new Promise((resolve) => {
      let totalHeight = 0;
      const distance = 300;
      const timer = setInterval(() => {
        const scrollHeight = document.body.scrollHeight;
        window.scrollBy(0, distance);
        totalHeight += distance;

        if (totalHeight >= scrollHeight) {
          clearInterval(timer);
          window.scrollTo(0, 0); // scroll back to top
          resolve();
        }
      }, 100);
    });
  });
  await delay(800);
}

(async () => {
  console.log('=== Starting Phase 3 Subpages Verification ===');
  const browser = await puppeteer.launch({
    executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage();
  const subpages = ['projects', 'services', 'about-us', 'contact'];
  const auditResults = {};

  for (const sub of subpages) {
    console.log(`\nVerifying /${sub}...`);
    const errors = [];
    page.on('console', msg => {
      if (msg.type() === 'error') errors.push(msg.text());
    });

    // 1. Desktop 1440x900
    await page.setViewport({ width: 1440, height: 900 });
    await page.goto(`http://localhost:3000/${sub}`, { waitUntil: 'networkidle2' });
    await smoothScroll(page);

    const desktopFile = path.join(SCREENSHOT_DIR, `phase3-${sub}-desktop-1440.png`);
    await page.screenshot({ path: desktopFile, fullPage: true });

    // Check Framer badge
    const badgeVisible = await page.evaluate(() => {
      const b = document.querySelector('#__framer-badge-container, [data-framer-name="Made in Framer"], .framer-badge');
      if (!b) return false;
      const style = window.getComputedStyle(b);
      return style.display !== 'none' && style.visibility !== 'hidden' && style.opacity !== '0';
    });

    // Check broken images
    const brokenImgs = await page.evaluate(() => {
      return Array.from(document.querySelectorAll('img'))
        .filter(img => !img.complete || img.naturalWidth === 0)
        .map(img => img.src);
    });

    // Check headings
    const h1Text = await page.evaluate(() => {
      const h1 = document.querySelector('h1');
      return h1 ? h1.innerText.replace(/\s+/g, ' ').trim() : null;
    });

    console.log(`/${sub} Desktop:
- H1: "${h1Text}"
- Framer badge visible: ${badgeVisible}
- Broken images count: ${brokenImgs.length} ${brokenImgs.length ? JSON.stringify(brokenImgs) : ''}
- Errors: ${errors.length}`);

    // 2. Mobile 390x844
    await page.setViewport({ width: 390, height: 844, isMobile: true, hasTouch: true });
    await page.reload({ waitUntil: 'networkidle2' });
    await smoothScroll(page);

    const mobileFile = path.join(SCREENSHOT_DIR, `phase3-${sub}-mobile-390.png`);
    await page.screenshot({ path: mobileFile, fullPage: true });

    auditResults[sub] = {
      h1: h1Text,
      badgeVisible,
      brokenImages: brokenImgs.length,
      desktopScreenshot: desktopFile,
      mobileScreenshot: mobileFile
    };
  }

  await browser.close();
  console.log('\n=== Phase 3 Subpages Verification Summary ===');
  console.table(auditResults);
})();
