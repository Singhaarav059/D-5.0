// Full-page screenshots of the revamp site at phone/tablet widths: node .claude/shoot.js [page...]
const { chromium } = require(process.env.APPDATA + '/npm/node_modules/@playwright/cli/node_modules/playwright-core');
const pages = process.argv.slice(2).length ? process.argv.slice(2) : ['index', 'projects', 'services', 'about-us', 'contact'];
const sizes = { m: [390, 844], t: [820, 1180] };
(async () => {
  const b = await chromium.launch();
  for (const [k, [w, h]] of Object.entries(sizes)) {
    const ctx = await b.newContext({ viewport: { width: w, height: h }, deviceScaleFactor: 1, reducedMotion: 'reduce', isMobile: k === 'm', hasTouch: true });
    const p = await ctx.newPage();
    for (const n of pages) {
      await p.goto('http://localhost:3100/' + (n === 'index' ? '' : n), { waitUntil: 'networkidle' });
      await p.waitForTimeout(800);
      const over = await p.evaluate(() => [...document.querySelectorAll('body *')].filter((e) => { const r = e.getBoundingClientRect(); return r.width && (r.right > innerWidth + 1 || r.left < -1) && !e.closest('.marquee,[class*="__tabs"],.stack,.why__grid,.drives__grid,.steps,.services__stage,.seg'); }).slice(0, 8).map((e) => e.className || e.tagName));
      console.log(k, n, 'H=' + (await p.evaluate(() => document.body.scrollHeight)), over.length ? 'OVERFLOW: ' + over.join(', ') : '');
      const H = await p.evaluate(() => document.body.scrollHeight), seg = k === 'm' ? 1800 : 2000;
      for (let y = 0, i = 0; y < H; y += seg, i++) await p.screenshot({ path: `${__dirname}/shots/${k}-${n}-${i}.png`, fullPage: true, clip: { x: 0, y, width: w, height: Math.min(seg, H - y) } });
    }
    await ctx.close();
  }
  await b.close();
})();
