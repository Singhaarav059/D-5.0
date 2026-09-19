const puppeteer = require('puppeteer-core');
const fs = require('fs');
const path = require('path');

const delay = ms => new Promise(r => setTimeout(r, ms));

const SCREENSHOT_DIR = path.join(__dirname, 'docs', 'screenshots');
if (!fs.existsSync(SCREENSHOT_DIR)) {
  fs.mkdirSync(SCREENSHOT_DIR, { recursive: true });
}

const ROUTES = [
  { name: 'home', url: 'http://localhost:3000/' },
  { name: 'services', url: 'http://localhost:3000/services' },
  { name: 'projects', url: 'http://localhost:3000/projects' },
  { name: 'about-us', url: 'http://localhost:3000/about-us' },
  { name: 'contact', url: 'http://localhost:3000/contact' },
];

(async () => {
  console.log('--- Starting Phase 1 Foundation Verification ---');
  const browser = await puppeteer.launch({
    executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage();

  // Test Route 1: Homepage Tokens & Nav Scrolled State
  console.log('\nTesting Homepage (http://localhost:3000/)...');
  await page.setViewport({ width: 1440, height: 900 });
  await page.goto('http://localhost:3000/', { waitUntil: 'networkidle2', timeout: 30000 });
  await delay(3000); // Allow hydration & overrides

  // Check CSS variables on :root
  const tokens = await page.evaluate(() => {
    const style = getComputedStyle(document.documentElement);
    return {
      bg: style.getPropertyValue('--bg').trim(),
      bgSoft: style.getPropertyValue('--bg-soft').trim(),
      ink: style.getPropertyValue('--ink').trim(),
      ink2: style.getPropertyValue('--ink-2').trim(),
      ink3: style.getPropertyValue('--ink-3').trim(),
      line: style.getPropertyValue('--line').trim(),
      brand: style.getPropertyValue('--brand').trim(),
      brandDeep: style.getPropertyValue('--brand-deep').trim(),
      brandTint: style.getPropertyValue('--brand-tint').trim(),
      gradientAccent: style.getPropertyValue('--gradient-accent').trim(),
      navMaxW: style.getPropertyValue('--nav-max-w').trim(),
      containerMaxW: style.getPropertyValue('--container-max-w').trim(),
    };
  });
  console.log('CSS Tokens on Homepage:', tokens);

  // Check Nav at top (scrollY = 0)
  const navInitial = await page.evaluate(() => {
    const nav = document.querySelector('nav[data-framer-name="Nav"]');
    if (!nav) return null;
    const style = getComputedStyle(nav);
    const link = nav.querySelector('.demaze-nav-link');
    return {
      height: style.height,
      borderRadius: style.borderRadius,
      background: style.backgroundColor,
      hasScrolledClass: nav.classList.contains('demaze-nav-scrolled'),
      linkColor: link ? getComputedStyle(link).color : null,
    };
  });
  console.log('Nav Initial State (top of hero):', navInitial);

  // Screenshot Nav Initial
  await page.screenshot({ path: path.join(SCREENSHOT_DIR, 'phase1-nav-initial-1440.png'), clip: { x: 0, y: 0, width: 1440, height: 180 } });

  // Scroll down to test scrolled nav state (using Lenis and dispatching scroll)
  await page.evaluate(() => {
    if (window.lenis) {
      window.lenis.scrollTo(400, { immediate: true });
    }
    window.scrollTo(0, 400);
    window.dispatchEvent(new Event('scroll'));
  });
  await delay(600);

  const navScrolled = await page.evaluate(() => {
    const nav = document.querySelector('nav[data-framer-name="Nav"]');
    if (!nav) return null;
    const style = getComputedStyle(nav);
    const link = nav.querySelector('.demaze-nav-link');
    return {
      height: style.height,
      hasScrolledClass: nav.classList.contains('demaze-nav-scrolled'),
      background: style.backgroundColor,
      linkColor: link ? getComputedStyle(link).color : null,
    };
  });
  console.log('Nav Scrolled State (scrollY = 300):', navScrolled);

  // Screenshot Nav Scrolled
  await page.screenshot({ path: path.join(SCREENSHOT_DIR, 'phase1-nav-scrolled-1440.png'), clip: { x: 0, y: 0, width: 1440, height: 180 } });

  // Check Homepage Footer (4-column unified footer)
  const homeFooter = await page.evaluate(() => {
    const footer = document.querySelector('footer');
    if (!footer) return null;
    const menus = Array.from(footer.querySelectorAll('[data-framer-name="Menu"]'));
    const menuData = menus.map(m => {
      const title = m.querySelector('[data-framer-name="Menu Title"]');
      const links = Array.from(m.querySelectorAll('a')).map(a => a.textContent.trim()).filter(Boolean);
      return {
        display: getComputedStyle(m).display,
        title: title ? title.textContent.trim() : null,
        linksCount: links.length,
        links: links
      };
    });
    const copyright = footer.querySelector('[data-framer-name="Footer Bottom"] p');
    return {
      menus: menuData,
      copyright: copyright ? copyright.textContent.trim() : null
    };
  });
  console.log('Homepage Footer Data:', JSON.stringify(homeFooter, null, 2));

  // Test Subpages: Check Nav, 4-Column Footer, Contact Cards, CTA Banner, Accordion
  for (const route of ROUTES.slice(1)) {
    console.log(`\nTesting ${route.name} (${route.url})...`);
    await page.goto(route.url, { waitUntil: 'networkidle2', timeout: 30000 });
    await delay(1000);

    const subpageAudit = await page.evaluate(() => {
      const nav = document.querySelector('.demaze-nav-bar');
      const footer = document.querySelector('.demaze-footer');
      const footerCols = footer ? Array.from(footer.querySelectorAll('.demaze-footer-col h4')).map(h => h.textContent.trim()) : [];
      const footerYear = footer ? footer.querySelector('.demaze-footer-year') : null;
      const ctaBanner = document.querySelector('.demaze-cta-banner');
      const contactCards = Array.from(document.querySelectorAll('.demaze-contact-card'));

      return {
        navExists: !!nav,
        navHeight: nav ? getComputedStyle(nav).height : null,
        footerExists: !!footer,
        footerBg: footer ? getComputedStyle(footer).backgroundColor : null,
        footerColumns: footerCols,
        footerYearText: footerYear ? footerYear.textContent.trim() : null,
        ctaBannerExists: !!ctaBanner,
        contactCardsCount: contactCards.length
      };
    });
    console.log(`${route.name} Audit Results:`, subpageAudit);

    // Capture desktop screenshot
    await page.screenshot({ path: path.join(SCREENSHOT_DIR, `phase1-${route.name}-desktop.png`), fullPage: true });
  }

  // Mobile Viewport Test (390px)
  console.log('\nTesting Mobile Viewport (390x844)...');
  await page.setViewport({ width: 390, height: 844 });
  await page.goto('http://localhost:3000/', { waitUntil: 'networkidle2', timeout: 30000 });
  await delay(2000);

  // Check mobile hamburger on home
  const mobileToggleVisible = await page.evaluate(() => {
    const btn = document.querySelector('.framer-1p6a152-container') || document.querySelector('[data-framer-name="Variant 1"]');
    return !!btn;
  });
  console.log('Mobile nav trigger on homepage:', mobileToggleVisible);

  // Test Subpage Mobile Navigation Drawer Toggle on /services
  await page.goto('http://localhost:3000/services', { waitUntil: 'networkidle2', timeout: 30000 });
  await delay(1000);

  const mobileSubpageBefore = await page.evaluate(() => {
    const drawer = document.getElementById('demaze-subpage-drawer');
    const toggle = document.getElementById('demaze-mobile-btn');
    return {
      drawerActive: drawer ? drawer.classList.contains('active') : false,
      toggleVisible: toggle ? getComputedStyle(toggle).display !== 'none' : false
    };
  });
  console.log('Mobile subpage before click:', mobileSubpageBefore);

  // Click mobile hamburger
  await page.click('#demaze-mobile-btn');
  await delay(400);

  const mobileSubpageAfter = await page.evaluate(() => {
    const drawer = document.getElementById('demaze-subpage-drawer');
    return {
      drawerActive: drawer ? drawer.classList.contains('active') : false,
      drawerDisplay: drawer ? getComputedStyle(drawer).display : null
    };
  });
  console.log('Mobile subpage after click:', mobileSubpageAfter);

  await page.screenshot({ path: path.join(SCREENSHOT_DIR, 'phase1-services-mobile-drawer-open.png') });

  // Close drawer
  await page.keyboard.press('Escape');
  await delay(400);

  const mobileSubpageClosed = await page.evaluate(() => {
    const drawer = document.getElementById('demaze-subpage-drawer');
    return {
      drawerActive: drawer ? drawer.classList.contains('active') : false
    };
  });
  console.log('Mobile subpage after Escape key:', mobileSubpageClosed);

  // Capture full page mobile screenshots
  await page.screenshot({ path: path.join(SCREENSHOT_DIR, 'phase1-services-mobile.png'), fullPage: true });

  await browser.close();
  console.log('\n--- Phase 1 Foundation Verification Complete ---');
})();
