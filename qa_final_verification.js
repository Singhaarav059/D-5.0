const puppeteer = require('puppeteer-core');

async function runQA() {
  const browser = await puppeteer.launch({
    executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 900 });

  console.log('Navigating to http://localhost:3000/ ...');
  await page.goto('http://localhost:3000/', { waitUntil: 'networkidle2', timeout: 30000 });
  await new Promise(r => setTimeout(r, 2500));

  // 1. Verify Section Order
  const sectionAudit = await page.evaluate(() => {
    const main = document.querySelector('[data-framer-name="Main"]');
    const sections = Array.from(main.children)
      .filter(c => window.getComputedStyle(c).display !== 'none' && c.tagName === 'SECTION')
      .map(c => {
        const rect = c.getBoundingClientRect();
        return {
          name: c.getAttribute('data-framer-name'),
          className: c.className,
          top: Math.round(rect.top + window.scrollY),
          height: Math.round(rect.height),
          heading: c.querySelector('h1, h2, h3, h4') ? c.querySelector('h1, h2, h3, h4').innerText.trim().replace(/\n/g, ' ') : ''
        };
      })
      .sort((a,b) => a.top - b.top);

    return sections;
  });

  console.log('\n=== SECTION AUDIT (ORDER OF APPEARANCE) ===');
  sectionAudit.forEach((s, i) => {
    console.log(`${i + 1}. "${s.name}" (top=${s.top}px, h=${s.height}px) -> ${s.heading}`);
  });

  // 2. Specific Feature Verifications
  const detailedChecks = await page.evaluate(() => {
    // Nav
    const nav = document.querySelector('nav[data-framer-name="Nav"]');
    const navStyle = nav ? window.getComputedStyle(nav) : null;
    const navLinks = Array.from(document.querySelectorAll('.demaze-nav-link')).map(a => ({
      text: a.innerText,
      color: window.getComputedStyle(a).color
    }));

    // Hero Explore Services button
    const heroSec = document.querySelector('section[data-framer-name="Hero"]');
    const exploreBtn = heroSec ? heroSec.querySelector('a[href="./services"], a[href="./integration"]') : null;
    const exploreP = exploreBtn ? exploreBtn.querySelector('p') : null;
    const exploreStyle = exploreBtn ? window.getComputedStyle(exploreBtn) : null;
    const explorePStyle = exploreP ? window.getComputedStyle(exploreP) : null;

    // Process step numbers
    const processSteps = Array.from(document.querySelectorAll('.demaze-process-step')).map(s => s.innerText);

    // Featured Projects
    const projectCards = Array.from(document.querySelectorAll('.demaze-project-card')).map(c => ({
      title: c.querySelector('.demaze-project-title') ? c.querySelector('.demaze-project-title').innerText : '',
      top: c.style.top,
      descClipped: c.querySelector('.demaze-project-desc') ? c.querySelector('.demaze-project-desc').scrollHeight > c.querySelector('.demaze-project-desc').clientHeight : false
    }));

    // Who We Are + Founder
    const productsSection = document.querySelector('section[data-framer-name="Products"]');
    const founderBlock = productsSection ? productsSection.querySelector('.demaze-founder-statement-block') : null;
    const founderQuote = founderBlock ? founderBlock.querySelector('.demaze-founder-quote').innerText : '';

    // Industries tabs active check
    const indSection = document.querySelectorAll('section[data-framer-name="Tools"]')[1];
    const tabs = indSection ? Array.from(indSection.querySelectorAll('[data-framer-name="Tab"] > div')).map((t, idx) => {
      const p = t.querySelector('p');
      const line = t.children[1] || t.querySelector('[style*="linear-gradient"]');
      return {
        idx,
        text: p ? p.innerText : '',
        textColor: p ? window.getComputedStyle(p).color : '',
        lineOpacity: line ? window.getComputedStyle(line).opacity : ''
      };
    }) : [];

    // What Drives Us card overlap check
    const whatSection = document.querySelector('section[data-framer-name="Ai Powered"]');
    const whatCards = whatSection ? Array.from(whatSection.querySelectorAll('[data-framer-name="Firs row"] > div, [data-framer-name="Second row"] > div')).filter(c => c.style.display !== 'none').map(c => {
      const header = c.querySelector('[data-framer-name="Feature Header"]');
      const img = Array.from(c.querySelectorAll('img')).find(i => i.getBoundingClientRect().height > 0);
      const headerRect = header ? header.getBoundingClientRect() : null;
      const imgRect = img ? img.getBoundingClientRect() : null;
      const isOverlapping = headerRect && imgRect && (headerRect.bottom > imgRect.top);
      return {
        title: header ? header.querySelector('[data-framer-name="Feature Title"]').innerText : '',
        isOverlapping,
        headerBottom: headerRect ? Math.round(headerRect.bottom) : 0,
        imgTop: imgRect ? Math.round(imgRect.top) : 0
      };
    }) : [];

    // FAQ answer text color
    const faqSection = document.querySelector('section[data-framer-name="Faq"]');
    const firstAnswer = faqSection ? faqSection.querySelector('[data-framer-name="answer-text"] p') : null;
    const answerColor = firstAnswer ? window.getComputedStyle(firstAnswer).color : '';

    return {
      navBg: navStyle ? navStyle.backgroundColor : '',
      navLinks,
      exploreBtnBg: exploreStyle ? exploreStyle.backgroundColor : '',
      exploreBtnColor: explorePStyle ? explorePStyle.color : (exploreStyle ? exploreStyle.color : ''),
      processSteps,
      projectCards,
      hasFounderInAboutUs: !!founderBlock,
      founderQuote,
      tab0LineOpacity: tabs[0] ? tabs[0].lineOpacity : '',
      tab1LineOpacity: tabs[1] ? tabs[1].lineOpacity : '',
      whatCards,
      faqAnswerColor: answerColor
    };
  });

  console.log('\n=== DETAILED FEATURE VERIFICATION ===');
  console.log('Nav background:', detailedChecks.navBg);
  console.log('Nav links:', detailedChecks.navLinks);
  console.log('Explore Services button background:', detailedChecks.exploreBtnBg, 'color:', detailedChecks.exploreBtnColor);
  console.log('Process step numbers:', detailedChecks.processSteps);
  console.log('Featured projects cards & depth tops:', detailedChecks.projectCards);
  console.log('Founder statement in Who We Are section:', detailedChecks.hasFounderInAboutUs, 'Quote:', detailedChecks.founderQuote);
  console.log('Industry Tab 0 (Active) underline opacity:', detailedChecks.tab0LineOpacity);
  console.log('Industry Tab 1 (Inactive) underline opacity:', detailedChecks.tab1LineOpacity);
  console.log('What Drives Us cards overlap audit (isOverlapping should be false):', detailedChecks.whatCards);
  console.log('FAQ answer text color (should be dark/readable, NOT white):', detailedChecks.faqAnswerColor);

  // 3. Responsive Overflow Test across multiple viewports
  const viewports = [
    { name: 'Desktop 1440', width: 1440, height: 900 },
    { name: 'Desktop 1280', width: 1280, height: 800 },
    { name: 'Tablet 1024', width: 1024, height: 768 },
    { name: 'Tablet 768', width: 768, height: 1024 },
    { name: 'Mobile 390', width: 390, height: 844 },
    { name: 'Mobile 375', width: 375, height: 667 }
  ];

  console.log('\n=== RESPONSIVE HORIZONTAL OVERFLOW CHECK ===');
  for (const vp of viewports) {
    await page.setViewport({ width: vp.width, height: vp.height });
    await new Promise(r => setTimeout(r, 600));
    const overflow = await page.evaluate(() => {
      const scrollW = document.documentElement.scrollWidth;
      const clientW = document.documentElement.clientWidth;
      return {
        scrollWidth: scrollW,
        clientWidth: clientW,
        hasOverflow: scrollW > clientW + 1
      };
    });
    console.log(`${vp.name} (${vp.width}px): scrollWidth=${overflow.scrollWidth}, clientWidth=${overflow.clientWidth}, hasOverflow=${overflow.hasOverflow}`);
  }

  // 4. Capture Full Screenshots for audit visual record
  console.log('\nCapturing desktop visual audit screenshot...');
  await page.setViewport({ width: 1440, height: 900 });
  await page.screenshot({ path: 'audit_moviq_redesign_desktop_1440.png', fullPage: true });

  console.log('Capturing mobile visual audit screenshot...');
  await page.setViewport({ width: 390, height: 844 });
  await page.screenshot({ path: 'audit_moviq_redesign_mobile_390.png', fullPage: true });

  await browser.close();
  console.log('\nQA Complete!');
}

runQA().catch(console.error);
