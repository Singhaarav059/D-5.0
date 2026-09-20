const puppeteer = require('puppeteer-core');
const fs = require('fs');
const path = require('path');

const delay = ms => new Promise(r => setTimeout(r, ms));

const SCREENSHOT_DIR = path.join(__dirname, 'docs', 'screenshots');
if (!fs.existsSync(SCREENSHOT_DIR)) {
  fs.mkdirSync(SCREENSHOT_DIR, { recursive: true });
}

(async () => {
  console.log('--- Starting Phase 2 Homepage Verification ---');
  const browser = await puppeteer.launch({
    executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage();
  const consoleErrors = [];
  page.on('console', msg => {
    if (msg.type() === 'error') {
      const txt = msg.text();
      // Ignore noiseless known React hydration / font warnings if non-breaking
      if (!txt.includes('removeEventListener') && !txt.includes('editorbar')) {
        consoleErrors.push(txt);
      }
    }
  });

  // 1. Desktop Audit (1440x900)
  await page.setViewport({ width: 1440, height: 900 });
  await page.goto('http://localhost:3000/', { waitUntil: 'networkidle2', timeout: 30000 });
  await delay(4000);

  const sectionsAudit = await page.evaluate(() => {
    const results = [];
    document.querySelectorAll('section').forEach((sec, idx) => {
      const name = sec.getAttribute('data-framer-name') || sec.className || 'section-' + idx;
      const rect = sec.getBoundingClientRect();
      const style = window.getComputedStyle(sec);
      const isVisible = style.display !== 'none' && style.visibility !== 'hidden' && rect.height > 0;
      const h1 = sec.querySelector('h1')?.textContent.trim();
      const h2 = sec.querySelector('h2')?.textContent.trim();
      const h3 = sec.querySelector('h3')?.textContent.trim();
      const h4 = sec.querySelector('h4')?.textContent.trim();

      results.push({
        idx,
        name,
        display: style.display,
        visible: isVisible,
        top: Math.round(rect.top + window.scrollY),
        height: Math.round(rect.height),
        heading: h1 || h2 || h3 || h4 || null
      });
    });

    // Check Made in Framer badge visibility
    const badge = document.querySelector('#__framer-badge-container, [data-framer-name="Made in Framer"], .framer-badge');
    const badgeVisible = badge ? window.getComputedStyle(badge).display !== 'none' : false;

    // Check FAQPage schema
    const schemaScript = document.querySelector('script[type="application/ld+json"]');
    const hasFaqSchema = schemaScript ? schemaScript.textContent.includes('FAQPage') : false;

    return {
      sections: results,
      badgeVisible,
      hasFaqSchema
    };
  });

  console.log('Homepage Sections Audit:');
  sectionsAudit.sections.forEach(s => {
    console.log(`[${s.idx}] ${s.name.padEnd(28)} | Visible: ${s.visible ? 'YES' : 'NO '} | Top: ${String(s.top).padStart(5)}px | Height: ${String(s.height).padStart(5)}px | Heading: ${s.heading || ' - '}`);
  });
  console.log('Made in Framer Badge Visible:', sectionsAudit.badgeVisible);
  console.log('Has FAQPage JSON-LD Schema:', sectionsAudit.hasFaqSchema);

  // Take full desktop screenshot
  await page.screenshot({ path: path.join(SCREENSHOT_DIR, 'phase2-homepage-desktop-1440.png'), fullPage: true });
  console.log('Saved phase2-homepage-desktop-1440.png');

  // 2. Mobile Audit (390x844)
  await page.setViewport({ width: 390, height: 844, isMobile: true, hasTouch: true });
  await page.goto('http://localhost:3000/', { waitUntil: 'networkidle2', timeout: 30000 });
  await delay(3000);

  await page.screenshot({ path: path.join(SCREENSHOT_DIR, 'phase2-homepage-mobile-390.png'), fullPage: true });
  console.log('Saved phase2-homepage-mobile-390.png');

  console.log('Console Errors count:', consoleErrors.length);
  if (consoleErrors.length > 0) {
    console.log('Console Errors:', consoleErrors.slice(0, 5));
  }

  await browser.close();
  console.log('--- Phase 2 Verification Completed ---');
})();
