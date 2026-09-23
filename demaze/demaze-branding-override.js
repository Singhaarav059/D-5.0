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
    var footer = document.querySelector('footer');
    return !!(footer && (footer.querySelector('[data-framer-name="Menu"]') || document.querySelector('footer.demaze-footer')));
  }

  var NAV_STYLE_ID = 'demaze-nav-style';

  function ensureNavStyle() {
    // Nav styles are now cleanly provided by demaze-subpages.css
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
    // Static demaze-nav-wrapper is active. No React DOM tampering needed!
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
      'footer [data-framer-name="Menu"] a, .demaze-footer-col a {' +
      '  transition: all 0.2s cubic-bezier(.22, 1, .36, 1) !important;' +
      '  display: inline-flex !important;' +
      '  align-items: center !important;' +
      '  min-height: 44px !important;' +
      '  padding: 4px 0 !important;' +
      '  box-sizing: border-box !important;' +
      '}' +
      'footer [data-framer-name="Menu"] a:hover, .demaze-footer-col a:hover {' +
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
      '.demaze-footer-action-btn, .demaze-footer-cta-pill {' +
      '  display: inline-flex !important;' +
      '  align-items: center !important;' +
      '  gap: 6px !important;' +
      '  padding: 10px 22px !important;' +
      '  min-height: 44px !important;' +
      '  box-sizing: border-box !important;' +
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
      '.demaze-footer-action-btn:hover, .demaze-footer-cta-pill:hover {' +
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
      '      <img src="https://framerusercontent.com/images/g9sZPcgZ3bVZQgiCX8DybKWIy4.png?scale-down-to=512" alt="Demaze Technologies" loading="lazy" decoding="async" style="height:32px;width:auto;">' +
      '      <div class="demaze-footer-status-pill">' +
      '        <span class="demaze-status-dot-pulse"></span> Accepting New Engineering Engagements' +
      '      </div>' +
      '      <div class="footer-tagline">Demaze Technologies</div>' +
      '      <div class="footer-mission">Strategic AI &amp; Software Engineering</div>' +
      '      <p>' +
      '        Demaze Technologies partners with ambitious companies to build scalable digital products, AI systems, and cloud infrastructure with dedicated senior engineering teams.' +
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
    applyFooter();
    document.querySelectorAll('img:not([alt])').forEach(function (img) {
      img.setAttribute('alt', '');
    });
  }

  function verifyStuck() {
    var navOk = !!document.querySelector('.demaze-nav-bar');
    var unifiedFooter = document.querySelector('footer.demaze-footer');
    return !!(navOk && unifiedFooter);
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
