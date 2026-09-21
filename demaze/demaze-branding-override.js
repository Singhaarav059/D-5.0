/**
 * Post-hydration branding override: swaps MOVIQ's identity for Demaze's
 * across the header nav and footer, leaving MOVIQ's visual design (layout,
 * blur/pill nav bar, footer grid) untouched.
 *
 * Logo: hotlinked directly from the current demazetech.com homepage (its
 * own site is also a Framer export, so this is a real asset URL, not an
 * invented one) - the same hotlinking approach already used for the
 * Showcase project images in demaze-content.js.
 *
 * Nav links: confirmed live that MOVIQ's hamburger icon in `<nav>` doesn't
 * mount any link panel in this exported build (clicking it produces no DOM
 * change - no overlay, no new nodes anywhere in the document). What looked
 * like a nav dropdown in an earlier pass ("How It Works/Features/Use
 * Cases/Pricing/Demo") was actually the footer's own "Quick Links" column
 * (confirmed via `.closest('nav')` on every `[data-framer-name="Menu"]` in
 * the document - all 4 are inside `<footer>`, none in `<nav>`). Only the nav
 * logo is updated for now; there is no real nav link menu to update.
 *
 * Footer: MOVIQ has 4 link columns (Quick Links/Company/Resources/Legal)
 * plus a social-icon row. Demaze's real footer is a flat 4-link list with
 * no categories, so the first column is repurposed for those 4 links
 * (title hidden - no real category name for them) and the other 3 columns
 * + social row are hidden (no Demaze equivalents, and social links are
 * never invented).
 *
 * NOTE on risk: setting `style.display='none'` on these footer siblings was
 * observed, across repeated testing, to sometimes trigger a fatal React
 * reconciliation crash on mobile-width loads. Further testing showed this
 * crash is NOT deterministic - the exact same code, and even the plain
 * hidden-only state of other sections, crashed on some fresh-tab loads and
 * not others. It's a flaky timing race in Framer's own hydration that
 * scales with how much post-hydration DOM mutation happens, not a bug tied
 * to this specific operation, so it can't be fully eliminated by avoiding
 * this one technique - only reduced. Shipped anyway per explicit direction
 * to complete this content cleanup; see DEMAZE_IMPLEMENTATION_STATE.md for
 * the full investigation.
 *
 * See demaze-override-core.js for why this waits/mutates/rechecks the way it does.
 */
(function () {
  var content = window.DEMAZE_CONTENT && window.DEMAZE_CONTENT.branding;
  if (!content || !window.DemazeOverride) return;

  var LOGO_SRC = 'https://framerusercontent.com/images/g9sZPcgZ3bVZQgiCX8DybKWIy4.png?width=1344&height=420';
  var LOGO_ALT = 'Demaze Technologies logo';

  function getNav() {
    return document.querySelector('nav[data-framer-name="Nav"]');
  }

  function isHydrated() {
    var nav = getNav();
    var footer = document.querySelector('footer');
    return !!(nav && nav.querySelector('img') && footer && footer.querySelector('[data-framer-name="Menu"]'));
  }

  var NAV_STYLE_ID = 'demaze-nav-style';

  function ensureNavStyle() {
    if (document.getElementById(NAV_STYLE_ID)) return;
    var style = document.createElement('style');
    style.id = NAV_STYLE_ID;
    style.textContent =
      '.framer-1rmnfff-container, header{' +
      '  z-index:99999!important;' +
      '  transition:max-width 0.4s cubic-bezier(.22,1,.36,1), padding 0.4s ease!important;' +
      '}' +
      'nav[data-framer-name="Nav"]{' +
      '  height:64px!important;border-radius:100px!important;' +
      '  background:rgba(255,255,255,0.1)!important;' +
      '  backdrop-filter:blur(12px)!important;-webkit-backdrop-filter:blur(12px)!important;' +
      '  border:1px solid rgba(255,255,255,0.18)!important;' +
      '  box-shadow:none!important;' +
      '  transition:all 0.35s cubic-bezier(.22,1,.36,1)!important;}' +
      'nav[data-framer-name="Nav"] img{filter:none!important;max-height:36px!important;width:auto!important;transition:transform 0.25s ease;}' +
      'nav[data-framer-name="Nav"].demaze-nav-scrolled, .framer-v-2hoya3 nav[data-framer-name="Nav"]{' +
      '  background:rgba(15,23,42,0.85)!important;' +
      '  backdrop-filter:blur(16px)!important;-webkit-backdrop-filter:blur(16px)!important;' +
      '  border-color:rgba(255,255,255,0.15)!important;' +
      '  box-shadow:0 12px 36px rgba(0,0,0,0.3)!important;}' +
      'nav[data-framer-name="Nav"].demaze-nav-scrolled img, .framer-v-2hoya3 nav[data-framer-name="Nav"] img{filter:none!important;}' +
      '.demaze-nav-links-wrap{display:flex;align-items:center;gap:12px;margin:0 20px;z-index:2;}' +
      '.demaze-nav-link{color:#ffffff!important;font-size:14px;font-weight:500;text-decoration:none;' +
      '  padding:7px 14px;border-radius:100px;white-space:nowrap;opacity:0.90;' +
      '  transition:all 0.22s cubic-bezier(0.16,1,0.3,1);position:relative;background:transparent;}' +
      '.demaze-nav-link:hover{background:rgba(255,255,255,0.18)!important;opacity:1!important;transform:translateY(-1px);color:#ffffff!important;}' +
      'nav[data-framer-name="Nav"].demaze-nav-scrolled .demaze-nav-link, .framer-v-2hoya3 nav[data-framer-name="Nav"] .demaze-nav-link{color:#ffffff!important;opacity:0.92;}' +
      'nav[data-framer-name="Nav"].demaze-nav-scrolled .demaze-nav-link:hover, .framer-v-2hoya3 nav[data-framer-name="Nav"] .demaze-nav-link:hover{background:rgba(255,255,255,0.12)!important;opacity:1!important;transform:translateY(-1px);color:#ffffff!important;}' +
      '.demaze-nav-btn{display:inline-flex;align-items:center;justify-content:center;padding:9px 22px;' +
      '  border-radius:100px;background:#ffffff!important;color:#0f172a!important;font-size:13.5px;font-weight:600;text-decoration:none;' +
      '  transition:all 0.22s cubic-bezier(0.16,1,0.3,1);white-space:nowrap;box-shadow:0 4px 14px rgba(0,0,0,0.15);margin-left:8px;}' +
      '.demaze-nav-btn:hover{background:#ffffff!important;transform:translateY(-1px) scale(1.02);box-shadow:0 8px 24px rgba(0,0,0,0.22);color:#0f172a!important;}' +
      'nav[data-framer-name="Nav"] [data-framer-name="Menu"],' +
      'nav[data-framer-name="Nav"] [data-framer-name="Button"]{display:none!important;}' +
      '@media (max-width:809px){.demaze-nav-links-wrap{display:none!important;}}' +
      '.demaze-mobile-drawer{display:none;position:fixed;top:76px;left:16px;right:16px;background:rgba(15,23,42,0.92)!important;' +
      '  backdrop-filter:blur(24px);-webkit-backdrop-filter:blur(24px);border:1px solid rgba(255,255,255,0.15);' +
      '  border-radius:24px;padding:24px;box-shadow:0 24px 60px rgba(0,0,0,0.4);z-index:99999;flex-direction:column;gap:12px;animation:demazeFadeDown 0.25s cubic-bezier(.22,1,.36,1);}' +
      '.demaze-mobile-drawer.active{display:flex!important;}' +
      '.demaze-mobile-drawer a{color:#ffffff!important;font-size:16px;font-weight:500;text-decoration:none;padding:12px 16px;border-radius:12px;transition:background 0.2s, color 0.2s;}' +
      '.demaze-mobile-drawer a:hover{background:rgba(255,255,255,0.08);color:#38bdf8!important;}' +
      '.demaze-mobile-drawer .demaze-mobile-btn{background:#ffffff!important;color:#0f172a!important;text-align:center;font-weight:600;margin-top:8px;border-radius:999px;padding:12px 20px;box-shadow:0 8px 24px rgba(0,0,0,0.25);}' +
      '@keyframes demazeFadeDown{from{opacity:0;transform:translateY(-10px);}to{opacity:1;transform:translateY(0);}}';
    document.head.appendChild(style);
  }

  var TYPOGRAPHY_STYLE_ID = 'demaze-typography-style';
  function ensureTypography() {
    if (document.getElementById(TYPOGRAPHY_STYLE_ID)) return;
    var style = document.createElement('style');
    style.id = TYPOGRAPHY_STYLE_ID;
    style.textContent =
      '@font-face { font-family: "Stack Sans Headline"; src: url("https://fonts.gstatic.com/s/stacksansheadline/v1/1PtFg9jZXvmMnkLnuURbaukKZJTyrDV326uH6mSinjBIwc4zIgFCqgUA3ZCX.woff2"); font-display: swap; font-style: normal; font-weight: 300; }' +
      '@font-face { font-family: "Stack Sans Headline"; src: url("https://fonts.gstatic.com/s/stacksansheadline/v1/1PtFg9jZXvmMnkLnuURbaukKZJTyrDV326uH6mSinjBIwc5tIgFCqgUA3ZCX.woff2"); font-display: swap; font-style: normal; font-weight: 400; }' +
      '@font-face { font-family: "Stack Sans Headline"; src: url("https://fonts.gstatic.com/s/stacksansheadline/v1/1PtFg9jZXvmMnkLnuURbaukKZJTyrDV326uH6mSinjBIwc5fIgFCqgUA3ZCX.woff2"); font-display: swap; font-style: normal; font-weight: 500; }' +
      '@font-face { font-family: "Stack Sans Headline"; src: url("https://fonts.gstatic.com/s/stacksansheadline/v1/1PtFg9jZXvmMnkLnuURbaukKZJTyrDV326uH6mSinjBIwc6zJQFCqgUA3ZCX.woff2"); font-display: swap; font-style: normal; font-weight: 600; }' +
      '@font-face { font-family: "Stack Sans Headline"; src: url("https://fonts.gstatic.com/s/stacksansheadline/v1/1PtFg9jZXvmMnkLnuURbaukKZJTyrDV326uH6mSinjBIwc6KJQFCqgUA3ZCX.woff2"); font-display: swap; font-style: normal; font-weight: 700; }' +
      'h1, h2, h3, h4, h5, h6, [data-framer-name="Headline"], [data-framer-name="Title"], [data-framer-name="Section Title"], [data-framer-name="Tagline"], [data-framer-name="Hero Title"] {' +
      '  font-family: "Stack Sans Headline", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif !important;' +
      '}' +
      'body, p, span, li, a, input, textarea, button, select, blockquote, [data-framer-name="Desc"], [data-framer-name="Description"], [data-framer-name="Subtitle"], .demaze-testimonial-quote {' +
      '  font-family: "Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif !important;' +
      '}';
    document.head.appendChild(style);
  }

  function applyNav(nav) {
    ensureNavStyle();
    var logoImg = nav.querySelector('img');
    if (logoImg) {
      logoImg.setAttribute('src', LOGO_SRC);
      logoImg.setAttribute('srcset', '');
      logoImg.setAttribute('alt', LOGO_ALT);
    }

    // Completely hide MOVIQ's native navigation items
    var moviqMenu = nav.querySelector('[data-framer-name="Menu"]');
    if (moviqMenu) moviqMenu.style.setProperty('display', 'none', 'important');
    var moviqBtn = nav.querySelector('[data-framer-name="Button"]');
    if (moviqBtn) moviqBtn.style.setProperty('display', 'none', 'important');

    if (content.navLinks && !nav.querySelector('.demaze-nav-links-wrap')) {
      var linksWrap = document.createElement('div');
      linksWrap.className = 'demaze-nav-links-wrap';
      linksWrap.innerHTML = content.navLinks
        .map(function (l) {
          return '<a href="' + l.href + '" class="demaze-nav-link">' + l.text + '</a>';
        })
        .join('');

      var ctaBtn = document.createElement('a');
      ctaBtn.className = 'demaze-nav-btn';
      ctaBtn.href = content.ctaButton ? content.ctaButton.href : './contact';
      ctaBtn.textContent = content.ctaButton ? content.ctaButton.text : 'Book A Call';
      linksWrap.appendChild(ctaBtn);

      nav.appendChild(linksWrap);
    }

    // Scroll strengthening (RAF throttled with boolean diffing)
    if (!nav.__demazeScrollAttached) {
      nav.__demazeScrollAttached = true;
      var navScrollTicking = false;
      var isNavScrolled = false;
      function updateNavScroll() {
        var y = (window.lenis && typeof window.lenis.scroll === 'number') ? window.lenis.scroll : window.scrollY;
        var shouldBeScrolled = y > 360;
        if (shouldBeScrolled !== isNavScrolled) {
          isNavScrolled = shouldBeScrolled;
          nav.classList.toggle('demaze-nav-scrolled', isNavScrolled);
        }
      }
      function requestNavScroll() {
        if (!navScrollTicking) {
          navScrollTicking = true;
          requestAnimationFrame(function () {
            updateNavScroll();
            navScrollTicking = false;
          });
        }
      }
      window.addEventListener('scroll', requestNavScroll, { passive: true });
      updateNavScroll();
    }

    // Mobile drawer setup
    if (!document.getElementById('demaze-mobile-nav-drawer')) {
      var drawer = document.createElement('div');
      drawer.id = 'demaze-mobile-nav-drawer';
      drawer.className = 'demaze-mobile-drawer';
      drawer.innerHTML = content.navLinks
        .map(function (l) {
          return '<a href="' + l.href + '">' + l.text + '</a>';
        })
        .join('') +
        '<a href="./contact" class="demaze-mobile-btn">Book A Call</a>';
      document.body.appendChild(drawer);

      document.addEventListener(
        'click',
        function (e) {
          var d = document.getElementById('demaze-mobile-nav-drawer');
          if (!d) return;

          // Only allow mobile drawer toggle on mobile viewports (< 810px)
          if (window.innerWidth > 809) {
            d.classList.remove('active');
            return;
          }

          // STRICT CHECK: Only trigger from the header/nav hamburger icon, NEVER from FAQ or other section variants!
          var btn = e.target.closest('header .framer-1p6a152-container, nav .framer-1p6a152-container, nav [data-framer-name="Menu"], nav [data-framer-name="Button"]');
          if (btn) {
            e.preventDefault();
            e.stopPropagation();
            d.classList.toggle('active');
            return;
          }
          if (!d.contains(e.target)) {
            d.classList.remove('active');
          }
        },
        true
      );
    }
  }

  var FOOTER_STYLE_ID = 'demaze-footer-style';
  function ensureFooterStyle() {
    if (document.getElementById(FOOTER_STYLE_ID)) return;
    var style = document.createElement('style');
    style.id = FOOTER_STYLE_ID;
    style.textContent =
      'footer {' +
      '  background-color: #FAFAFC !important;' +
      '  border-top: 1px solid #EAEAEF !important;' +
      '  padding: 72px 24px 36px !important;' +
      '  width: 100% !important;' +
      '}' +
      'footer [data-framer-name="Container"], footer .framer-18n5lx {' +
      '  max-width: 1240px !important;' +
      '  width: 100% !important;' +
      '  margin: 0 auto !important;' +
      '  display: flex !important;' +
      '  justify-content: space-between !important;' +
      '  align-items: flex-start !important;' +
      '  gap: 56px !important;' +
      '}' +
      'footer .framer-n46yo {' +
      '  max-width: 380px !important;' +
      '  width: 100% !important;' +
      '  display: flex !important;' +
      '  flex-direction: column !important;' +
      '  gap: 10px !important;' +
      '}' +
      'footer .framer-1xbm4n0 {' +
      '  display: grid !important;' +
      '  grid-template-columns: repeat(3, minmax(140px, 1fr)) !important;' +
      '  gap: 48px !important;' +
      '  width: 100% !important;' +
      '  max-width: 740px !important;' +
      '  margin-left: auto !important;' +
      '}' +
      'footer [data-framer-name="Menu"] {' +
      '  display: flex !important;' +
      '  flex-direction: column !important;' +
      '}' +
      'footer [data-framer-name="Menu Title"] h6, footer [data-framer-name="Menu Title"] p {' +
      '  font-family: "Stack Sans Headline", -apple-system, sans-serif !important;' +
      '  font-size: 13px !important;' +
      '  font-weight: 700 !important;' +
      '  text-transform: uppercase !important;' +
      '  letter-spacing: 0.08em !important;' +
      '  color: #0F172A !important;' +
      '  margin-bottom: 18px !important;' +
      '  white-space: nowrap !important;' +
      '  word-break: normal !important;' +
      '  overflow-wrap: normal !important;' +
      '  width: max-content !important;' +
      '}' +
      'footer [data-framer-name="Menu Title"] {' +
      '  width: auto !important;' +
      '  min-width: max-content !important;' +
      '  white-space: nowrap !important;' +
      '}' +
      'footer [data-framer-name="Menu"] a {' +
      '  transition: all 0.2s cubic-bezier(.22, 1, .36, 1) !important;' +
      '  display: inline-flex !important;' +
      '  align-items: center !important;' +
      '  margin-bottom: 8px !important;' +
      '}' +
      'footer [data-framer-name="Menu"] a:hover {' +
      '  transform: translateX(4px) !important;' +
      '}' +
      'footer [data-framer-name="Menu"] a:hover p, footer [data-framer-name="Menu"] a.hover p,' +
      'footer [data-framer-name="Menu"] a:hover span, footer [data-framer-name="Menu"] a.hover span {' +
      '  color: #2563eb !important;' +
      '  -webkit-text-fill-color: #2563eb !important;' +
      '  background: none !important;' +
      '}' +
      '.demaze-footer-status-pill {' +
      '  display: inline-flex !important;' +
      '  align-items: center !important;' +
      '  gap: 8px !important;' +
      '  padding: 4px 12px !important;' +
      '  background: #F0FDF4 !important;' +
      '  border: 1px solid #BBF7D0 !important;' +
      '  border-radius: 999px !important;' +
      '  font-size: 11.5px !important;' +
      '  font-weight: 600 !important;' +
      '  color: #166534 !important;' +
      '  width: fit-content !important;' +
      '  margin: 4px 0 6px !important;' +
      '  letter-spacing: 0.02em !important;' +
      '}' +
      '.demaze-status-dot-pulse {' +
      '  width: 7px !important;' +
      '  height: 7px !important;' +
      '  border-radius: 50% !important;' +
      '  background-color: #22c55e !important;' +
      '  box-shadow: 0 0 0 0 rgba(34, 197, 94, 0.7) !important;' +
      '  animation: demazePulse 2s infinite !important;' +
      '}' +
      '@keyframes demazePulse {' +
      '  0% { box-shadow: 0 0 0 0 rgba(34, 197, 94, 0.7); }' +
      '  70% { box-shadow: 0 0 0 6px rgba(34, 197, 94, 0); }' +
      '  100% { box-shadow: 0 0 0 0 rgba(34, 197, 94, 0); }' +
      '}' +
      '.demaze-footer-action-btn {' +
      '  display: inline-flex !important;' +
      '  align-items: center !important;' +
      '  gap: 6px !important;' +
      '  padding: 8px 18px !important;' +
      '  background: #0B0E17 !important;' +
      '  color: #ffffff !important;' +
      '  border-radius: 999px !important;' +
      '  font-size: 13px !important;' +
      '  font-weight: 600 !important;' +
      '  text-decoration: none !important;' +
      '  width: fit-content !important;' +
      '  margin-top: 6px !important;' +
      '  transition: all 0.2s ease !important;' +
      '}' +
      '.demaze-footer-action-btn:hover {' +
      '  background: #2563eb !important;' +
      '  transform: translateY(-1px) !important;' +
      '}' +
      'footer .demaze-footer-hidden,' +
      'footer a[href*="enterprice"],' +
      'footer a[href*="home-2.0"],' +
      'footer a[href*="contract-sales"],' +
      'footer a[href*="price"]:not([href*="services"]){' +
      '  display:none!important;pointer-events:none!important;visibility:hidden!important;' +
      '  height:0!important;width:0!important;overflow:hidden!important;margin:0!important;padding:0!important;' +
      '}' +
      'footer [data-framer-name="Menu"]:nth-of-type(n+4) {' +
      '  display:none!important;pointer-events:none!important;visibility:hidden!important;' +
      '  height:0!important;width:0!important;overflow:hidden!important;margin:0!important;padding:0!important;' +
      '}' +
      '@media (max-width: 1024px) {' +
      '  footer [data-framer-name="Container"], footer .framer-18n5lx {' +
      '    flex-direction: column !important;' +
      '    gap: 40px !important;' +
      '  }' +
      '  footer .framer-1xbm4n0 {' +
      '    grid-template-columns: repeat(2, 1fr) !important;' +
      '    margin-left: 0 !important;' +
      '    max-width: 100% !important;' +
      '  }' +
      '}' +
      '@media (max-width: 640px) {' +
      '  footer .framer-1xbm4n0 {' +
      '    grid-template-columns: 1fr !important;' +
      '    gap: 32px !important;' +
      '  }' +
      '  footer, footer [data-framer-name="Footer Container"], footer [data-framer-name="Footer Bottom"] {' +
      '    padding-bottom: 120px !important;' +
      '  }' +
      '}';
    document.head.appendChild(style);
  }

  function applyFooter() {
    // 1. Permanently hide any Framer footers
    var framerFooters = document.querySelectorAll('footer:not(.demaze-footer)');
    framerFooters.forEach(function (f) {
      f.style.setProperty('display', 'none', 'important');
    });

    // 2. Mount unified Demaze footer if not already present
    if (document.querySelector('footer.demaze-footer')) return;

    var footerHTML =
      '<footer class="demaze-footer valist-unfold-section is-unfolded">' +
      '  <div class="demaze-footer-inner">' +
      '    <div class="demaze-footer-brand">' +
      '      <img src="https://framerusercontent.com/images/g9sZPcgZ3bVZQgiCX8DybKWIy4.png?scale-down-to=1024" alt="Demaze Technologies">' +
      '      <div class="demaze-footer-status-pill">' +
      '        <span class="demaze-status-dot-pulse"></span> Available for Enterprise AI Engagements' +
      '      </div>' +
      '      <div class="footer-tagline">Demaze Technologies</div>' +
      '      <div class="footer-mission">Empowering AI Innovation Worldwide</div>' +
      '      <p>' +
      '        We combine AI, software engineering, and automation with deep industry expertise to build scalable, sustainable solutions, working alongside you as a trusted, long-term partner.' +
      '      </p>' +
      '      <a href="/contact" class="demaze-footer-cta-pill">Schedule Strategy Call <span class="arrow">→</span></a>' +
      '    </div>' +
      '    <div class="demaze-footer-col">' +
      '      <h4>Navigation</h4>' +
      '      <ul class="demaze-footer-nav">' +
      '        <li><a href="/projects">Projects</a></li>' +
      '        <li><a href="/services">Services</a></li>' +
      '        <li><a href="/about-us">About Us</a></li>' +
      '        <li><a href="/contact">Contact Us</a></li>' +
      '      </ul>' +
      '    </div>' +
      '    <div class="demaze-footer-col">' +
      '      <h4>Reach Us</h4>' +
      '      <ul class="demaze-footer-nav">' +
      '        <li><a href="mailto:contact@demazetech.com">contact@demazetech.com</a></li>' +
      '        <li><a href="/contact">Schedule Strategy Call</a></li>' +
      '        <li><a href="/contact">Enterprise Solutions</a></li>' +
      '        <li><span style="color: #64748b; font-size: 13.5px; line-height: 1.5; display: block; margin-top: 6px;">Ahmedabad, Gujarat, India</span></li>' +
      '      </ul>' +
      '    </div>' +
      '    <div class="demaze-footer-col">' +
      '      <h4>Trust & Legal</h4>' +
      '      <ul class="demaze-footer-nav">' +
      '        <li><a href="/privacy-policy">Privacy Policy</a></li>' +
      '        <li><a href="/terms-conditions">Terms & Conditions</a></li>' +
      '        <li><a href="/contact">Enterprise Security</a></li>' +
      '      </ul>' +
      '    </div>' +
      '  </div>' +
      '  <div class="demaze-footer-bottom">' +
      '    <div class="demaze-footer-bottom-inner">' +
      '      <div class="demaze-footer-copyright">' +
      '        © 2026 Demaze Technologies. All rights reserved. Strategic Partner in Building Scalable AI Products.' +
      '      </div>' +
      '      <div class="demaze-footer-legal-links">' +
      '        <a href="/contact">Privacy Policy</a>' +
      '        <a href="/contact">Terms of Service</a>' +
      '        <a href="/contact">Security Standards</a>' +
      '      </div>' +
      '    </div>' +
      '  </div>' +
      '</footer>';

    var temp = document.createElement('div');
    temp.innerHTML = footerHTML;
    var newFooter = temp.firstElementChild;

    var main = document.querySelector('[data-framer-name="Main"]') || document.body;
    main.insertAdjacentElement('afterend', newFooter);
  }

  function applyOverride() {
    document.title = "Demaze Technologies - Your Strategic Partner in Building Scalable AI Products";
    ensureTypography();
    var nav = getNav();
    if (nav) applyNav(nav);
    applyFooter();
    document.querySelectorAll('img:not([alt])').forEach(function (img) {
      img.setAttribute('alt', '');
    });
  }

  function verifyStuck() {
    var nav = getNav();
    var navLogoOk = !!(nav && nav.querySelector('img'));
    var unifiedFooter = document.querySelector('footer.demaze-footer');
    return !!(navLogoOk && unifiedFooter);
  }

  window.DemazeOverride.run({
    getRoot: function () {
      return document.body;
    },
    isHydrated: isHydrated,
    apply: applyOverride,
    verify: verifyStuck,
  });
})();
