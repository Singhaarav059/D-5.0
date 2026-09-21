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
    var footer = document.querySelector('footer');
    if (!footer) return;
    ensureFooterStyle();

    var footerLogoImg = footer.querySelector('[data-framer-name="Logo"] img');
    if (footerLogoImg) {
      footerLogoImg.setAttribute('src', LOGO_SRC);
      footerLogoImg.setAttribute('srcset', '');
      footerLogoImg.setAttribute('alt', LOGO_ALT);
    }

    var tagline = footer.querySelector('[data-framer-name="Tagline"]');
    if (tagline) tagline.textContent = content.name;

    var desc = footer.querySelector('[data-framer-name="Desc"]');
    if (desc) desc.textContent = content.footerTagline;

    // Inject status chip and action CTA button in Brand column if not present
    var brandCol = footer.querySelector('.framer-n46yo') || (footerLogoImg ? footerLogoImg.closest('div') : null);
    if (brandCol && !brandCol.querySelector('.demaze-footer-status-pill')) {
      var statusPill = document.createElement('div');
      statusPill.className = 'demaze-footer-status-pill';
      statusPill.innerHTML = '<span class="demaze-status-dot-pulse"></span> Available for Enterprise AI Engagements';
      var logoLink = brandCol.querySelector('[data-framer-name="Logo"]') || brandCol.firstElementChild;
      if (logoLink && logoLink.nextSibling) {
        brandCol.insertBefore(statusPill, logoLink.nextSibling);
      } else {
        brandCol.appendChild(statusPill);
      }
    }
    if (brandCol && !brandCol.querySelector('.demaze-footer-action-btn')) {
      var ctaBtn = document.createElement('a');
      ctaBtn.className = 'demaze-footer-action-btn';
      ctaBtn.setAttribute('href', './contact');
      ctaBtn.innerHTML = 'Schedule Strategy Call <span style="font-size:14px;">→</span>';
      brandCol.appendChild(ctaBtn);
    }

    // 3 Balanced Columns (Navigation, Reach Us, Trust & Legal) - Zero "Services" Section
    var menus = footer.querySelectorAll('[data-framer-name="Menu"]');
    var columnsData = [
      {
        title: "Navigation",
        links: [
          { text: "Projects", href: "./projects" },
          { text: "Services", href: "./services" },
          { text: "About Us", href: "./about-us" },
          { text: "Contact Us", href: "./contact" }
        ]
      },
      {
        title: "Reach Us",
        links: [
          { text: "contact@demazetech.com", href: "mailto:contact@demazetech.com" },
          { text: "Schedule Strategy Call", href: "./contact" },
          { text: "Ahmedabad, Gujarat, India", href: "./contact" }
        ]
      },
      {
        title: "Trust & Legal",
        links: [
          { text: "Privacy Policy", href: "./privacy-policy" },
          { text: "Terms of Service", href: "./terms-conditions" },
          { text: "Enterprise Security", href: "./contact" }
        ]
      }
    ];

    menus.forEach(function (menu, i) {
      var col = columnsData[i];
      if (col && col.links) {
        menu.style.display = '';
        var titleNode = menu.querySelector('[data-framer-name="Menu Title"]');
        if (titleNode) {
          var titleH = titleNode.querySelector('h6') || titleNode.querySelector('p') || titleNode;
          titleH.textContent = col.title;
          titleNode.style.display = '';
          titleH.style.setProperty('font-size', '13px', 'important');
          titleH.style.setProperty('font-weight', '700', 'important');
          titleH.style.setProperty('text-transform', 'uppercase', 'important');
          titleH.style.setProperty('letter-spacing', '0.08em', 'important');
          titleH.style.setProperty('color', '#0F172A', 'important');
          titleH.style.setProperty('font-family', '"Stack Sans Headline", -apple-system, sans-serif', 'important');
        }
        var links = menu.querySelectorAll('a');
        links.forEach(function (a, j) {
          var item = col.links[j];
          var container = a.closest('[class*="-container"]') || a;
          if (!item) {
            a.classList.add('demaze-footer-hidden');
            a.style.setProperty('display', 'none', 'important');
            if (container !== a) {
              container.classList.add('demaze-footer-hidden');
              container.style.setProperty('display', 'none', 'important');
            }
            var emptyNode = a.querySelector('p') || a;
            if (emptyNode) emptyNode.textContent = '';
            return;
          }
          // Purge dead Pricing links
          var linkText = (item.text || '').trim().toLowerCase();
          if (linkText === 'pricing' || linkText.indexOf('pricing') !== -1 || (item.href && item.href.indexOf('pricing') !== -1)) {
            a.classList.add('demaze-footer-hidden');
            a.style.setProperty('display', 'none', 'important');
            if (container !== a) {
              container.classList.add('demaze-footer-hidden');
              container.style.setProperty('display', 'none', 'important');
            }
            return;
          }
          a.classList.remove('demaze-footer-hidden');
          a.style.display = '';
          if (container !== a) {
            container.classList.remove('demaze-footer-hidden');
            container.style.display = '';
          }
          a.setAttribute('href', item.href);

          // Store verified Demaze text permanently on element
          a.__demazeVerifiedText = item.text;

          function enforceLinkText() {
            var targetText = a.__demazeVerifiedText;
            if (!targetText) return;
            var textSpan = a.querySelector('span[data-text-fill="true"]');
            if (textSpan) {
              if (textSpan.textContent !== targetText) {
                textSpan.textContent = targetText;
              }
            } else {
              var textP = a.querySelector('p') || a;
              if (textP && textP.textContent !== targetText) {
                textP.textContent = targetText;
              }
            }
          }

          enforceLinkText();

          var textNode = a.querySelector('p') || a;
          textNode.style.setProperty('font-family', '"Inter", -apple-system, sans-serif', 'important');
          textNode.style.setProperty('font-size', '14px', 'important');
          textNode.style.setProperty('color', '#475569', 'important');

          // Attach hover capture listeners to prevent Framer React state from reverting text
          if (!a.__demazeHoverBound) {
            a.__demazeHoverBound = true;
            ['mouseenter', 'mouseover', 'pointerenter', 'focus'].forEach(function (evtName) {
              a.addEventListener(evtName, function () {
                enforceLinkText();
              }, { capture: true, passive: true });
            });

            // MutationObserver to catch React variant re-render safely
            var isEnforcing = false;
            var linkObserver = new MutationObserver(function () {
              if (isEnforcing) return;
              isEnforcing = true;
              enforceLinkText();
              isEnforcing = false;
            });
            linkObserver.observe(a, { childList: true, subtree: true });
          }
        });
      } else {
        menu.style.display = 'none';
      }
    });

    // Hide any rogue unused links in footer
    var rogueLinks = footer.querySelectorAll('a');
    rogueLinks.forEach(function (a) {
      var txt = (a.textContent || '').trim().toLowerCase();
      var href = (a.getAttribute('href') || '').toLowerCase();
      if (txt === 'pricing' || href.indexOf('pricing') !== -1 || href === './price' || href === '/price' ||
          href.indexOf('enterprice') !== -1 || href.indexOf('home-2.0') !== -1 || href.indexOf('contract-sales') !== -1) {
        a.classList.add('demaze-footer-hidden');
        a.style.setProperty('display', 'none', 'important');
        var container = a.closest('[class*="-container"]') || a;
        if (container) {
          container.classList.add('demaze-footer-hidden');
          container.style.setProperty('display', 'none', 'important');
        }
      }
    });

    // Format bottom copyright + tagline
    var bottomContainer = footer.querySelector('[data-framer-name="Footer Bottom"]');
    if (bottomContainer) {
      bottomContainer.innerHTML =
        '<div class="demaze-footer-bottom-row" style="display:flex!important;justify-content:space-between!important;align-items:center!important;width:100%!important;flex-wrap:wrap!important;gap:12px!important;font-size:13.5px!important;color:#64748b!important;font-family:\'Inter\',-apple-system,sans-serif!important;">' +
        '<span>' + content.copyright + '</span>' +
        '<span style="color:#64748b!important;font-weight:500!important;">' + (content.tagline || "Empowering AI Innovation Worldwide") + '</span>' +
        '</div>';
    }

    // No confirmed Demaze social links - hide
    var social = footer.querySelector('[data-framer-name="Social"]');
    if (social) social.style.display = 'none';
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
    var navLogoOk = !!(nav && nav.querySelector('img') && nav.querySelector('img').getAttribute('src') === LOGO_SRC);
    var footer = document.querySelector('footer');
    var bottomText = footer && footer.querySelector('[data-framer-name="Footer Bottom"]');
    return !!(navLogoOk && bottomText && bottomText.textContent.includes(content.copyright));
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
