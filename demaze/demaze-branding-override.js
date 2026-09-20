/**
 * Post-hydration branding override: swaps MOVIQ's identity for Demaze's
 * across the header nav and footer, leaving MOVIQ's visual design (layout,
 * blur/pill nav bar, footer grid) untouched.
 *
 * Logo: hotlinked directly from the current demazetech.com homepage (its
 * own site is also a Framer export, so this is a real asset URL, not an
 * invented one) — the same hotlinking approach already used for the
 * Showcase project images in demaze-content.js.
 *
 * Nav links: confirmed live that MOVIQ's hamburger icon in `<nav>` doesn't
 * mount any link panel in this exported build (clicking it produces no DOM
 * change — no overlay, no new nodes anywhere in the document). What looked
 * like a nav dropdown in an earlier pass ("How It Works/Features/Use
 * Cases/Pricing/Demo") was actually the footer's own "Quick Links" column
 * (confirmed via `.closest('nav')` on every `[data-framer-name="Menu"]` in
 * the document — all 4 are inside `<footer>`, none in `<nav>`). Only the nav
 * logo is updated for now; there is no real nav link menu to update.
 *
 * Footer: MOVIQ has 4 link columns (Quick Links/Company/Resources/Legal)
 * plus a social-icon row. Demaze's real footer is a flat 4-link list with
 * no categories, so the first column is repurposed for those 4 links
 * (title hidden — no real category name for them) and the other 3 columns
 * + social row are hidden (no Demaze equivalents, and social links are
 * never invented).
 *
 * NOTE on risk: setting `style.display='none'` on these footer siblings was
 * observed, across repeated testing, to sometimes trigger a fatal React
 * reconciliation crash on mobile-width loads. Further testing showed this
 * crash is NOT deterministic — the exact same code, and even the plain
 * hidden-only state of other sections, crashed on some fresh-tab loads and
 * not others. It's a flaky timing race in Framer's own hydration that
 * scales with how much post-hydration DOM mutation happens, not a bug tied
 * to this specific operation, so it can't be fully eliminated by avoiding
 * this one technique — only reduced. Shipped anyway per explicit direction
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
      'nav[data-framer-name="Nav"]{' +
      'max-width:1160px!important;height:64px!important;border-radius:999px!important;' +
      'background:rgba(255,255,255,0.14)!important;backdrop-filter:blur(20px)!important;-webkit-backdrop-filter:blur(20px)!important;' +
      'border:1px solid rgba(255,255,255,0.22)!important;box-shadow:0 10px 30px rgba(0,0,0,0.1)!important;' +
      'transition:all 0.3s cubic-bezier(.22,1,.36,1)!important;}' +
      'nav[data-framer-name="Nav"] img{filter:brightness(0) invert(1);transition:filter 0.3s ease;}' +
      'nav[data-framer-name="Nav"].demaze-nav-scrolled{' +
      'background:rgba(255,255,255,0.92)!important;box-shadow:0 12px 36px rgba(0,0,0,0.08)!important;border-color:rgba(0,0,0,0.08)!important;}' +
      'nav[data-framer-name="Nav"].demaze-nav-scrolled img{filter:none;}' +
      '.demaze-nav-links-wrap{display:flex;align-items:center;gap:28px;margin:0 24px;z-index:2;}' +
      '.demaze-nav-link{color:#ffffff!important;font-size:14px;font-weight:500;text-decoration:none;' +
      'transition:color 0.2s ease;white-space:nowrap;}' +
      '.demaze-nav-link:hover{color:#A89EEF!important;}' +
      'nav[data-framer-name="Nav"].demaze-nav-scrolled .demaze-nav-link{color:#0B0E17!important;}' +
      'nav[data-framer-name="Nav"].demaze-nav-scrolled .demaze-nav-link:hover{color:#5B4FE9!important;}' +
      '.demaze-nav-btn{display:inline-flex;align-items:center;justify-content:center;padding:9px 22px;' +
      'border-radius:999px;background:#000!important;color:#fff!important;font-size:13.5px;font-weight:600;text-decoration:none;' +
      'transition:all 0.2s ease;white-space:nowrap;box-shadow:0 4px 14px rgba(0,0,0,0.2);}' +
      '.demaze-nav-btn:hover{background:#1e293b!important;transform:translateY(-1px);box-shadow:0 6px 18px rgba(0,0,0,0.25);}' +
      'nav[data-framer-name="Nav"] [data-framer-name="Menu"],' +
      'nav[data-framer-name="Nav"] [data-framer-name="Button"]{display:none!important;}' +
      '@media (max-width:809px){.demaze-nav-links-wrap{display:none!important;}}' +
      '.demaze-mobile-drawer{display:none;position:fixed;top:76px;left:16px;right:16px;background:rgba(255,255,255,0.98)!important;' +
      'backdrop-filter:blur(24px);-webkit-backdrop-filter:blur(24px);border:1px solid rgba(0,0,0,0.08);' +
      'border-radius:24px;padding:24px;box-shadow:0 24px 60px rgba(0,0,0,0.15);z-index:99999;flex-direction:column;gap:12px;animation:demazeFadeDown 0.25s cubic-bezier(.22,1,.36,1);}' +
      '.demaze-mobile-drawer.active{display:flex!important;}' +
      '.demaze-mobile-drawer a{color:#0B0E17!important;font-size:16px;font-weight:500;text-decoration:none;padding:12px 16px;border-radius:12px;transition:background 0.2s, color 0.2s;}' +
      '.demaze-mobile-drawer a:hover{background:#F8F6FE;color:#5B4FE9!important;}' +
      '.demaze-mobile-drawer .demaze-mobile-btn{background:#000!important;color:#fff!important;text-align:center;font-weight:600;margin-top:8px;border-radius:999px;padding:12px 20px;box-shadow:0 8px 24px rgba(0,0,0,0.15);}' +
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

    // Scroll strengthening
    if (!nav.__demazeScrollAttached) {
      nav.__demazeScrollAttached = true;
      function updateNavScroll() {
        var y = (window.lenis && typeof window.lenis.scroll === 'number') ? window.lenis.scroll : window.scrollY;
        if (y > 40) {
          nav.classList.add('demaze-nav-scrolled');
        } else {
          nav.classList.remove('demaze-nav-scrolled');
        }
      }
      window.addEventListener('scroll', updateNavScroll, { passive: true });
      if (window.lenis && typeof window.lenis.on === 'function') {
        window.lenis.on('scroll', updateNavScroll);
      }
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
          var btn = e.target.closest('.framer-1p6a152-container') || e.target.closest('[data-framer-name="Variant 1"]');
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

  function applyFooter() {
    var footer = document.querySelector('footer');
    if (!footer) return;

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

    // 4-Column Footer Setup
    var menus = footer.querySelectorAll('[data-framer-name="Menu"]');
    var columnsData = [
      { title: "Navigation", links: content.footerNavLinks || content.footerLinks },
      { title: "Services", links: content.footerServiceLinks },
      { title: "Reach Us", links: content.footerReachLinks }
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
          // H-26: Standardize column headings styling matching subpages
          titleH.style.setProperty('font-size', '14px', 'important');
          titleH.style.setProperty('font-weight', '600', 'important');
          titleH.style.setProperty('text-transform', 'uppercase', 'important');
          titleH.style.setProperty('letter-spacing', '0.05em', 'important');
          titleH.style.setProperty('color', '#0B0E17', 'important');
          titleH.style.setProperty('font-family', '"Stack Sans Headline", -apple-system, sans-serif', 'important');
        }
        var links = menu.querySelectorAll('a');
        links.forEach(function (a, j) {
          var item = col.links[j];
          var container = a.closest('[class*="-container"]') || a;
          if (!item) {
            a.style.display = 'none';
            if (container !== a) container.style.display = 'none';
            var emptyNode = a.querySelector('p') || a;
            if (emptyNode) emptyNode.textContent = '';
            return;
          }
          // H-25: Purge dead Pricing links
          var linkText = (item.text || '').trim().toLowerCase();
          if (linkText === 'pricing' || linkText.indexOf('pricing') !== -1 || (item.href && item.href.indexOf('pricing') !== -1)) {
            a.style.display = 'none';
            if (container !== a) container.style.display = 'none';
            return;
          }
          a.style.display = '';
          if (container !== a) container.style.display = '';
          a.setAttribute('href', item.href);
          var textNode = a.querySelector('p') || a;
          textNode.textContent = item.text;
          textNode.style.setProperty('font-family', '"Inter", -apple-system, sans-serif', 'important');
          textNode.style.setProperty('font-size', '14px', 'important');
          textNode.style.setProperty('color', '#475569', 'important');
        });
      } else {
        menu.style.display = 'none';
      }
    });

    // H-25: Search entire footer for any rogue Pricing links and hide them
    var rogueLinks = footer.querySelectorAll('a');
    rogueLinks.forEach(function (a) {
      var txt = (a.textContent || '').trim().toLowerCase();
      var href = (a.getAttribute('href') || '').toLowerCase();
      if (txt === 'pricing' || href.indexOf('pricing') !== -1 || href === './price' || href === '/price') {
        var container = a.closest('[class*="-container"]') || a;
        container.style.setProperty('display', 'none', 'important');
      }
    });

    // H-26: Format bottom copyright + tagline into separate space-between spans matching subpages
    var bottomContainer = footer.querySelector('[data-framer-name="Footer Bottom"]');
    if (bottomContainer) {
      bottomContainer.innerHTML =
        '<div class="demaze-footer-bottom-row" style="display:flex!important;justify-content:space-between!important;align-items:center!important;width:100%!important;flex-wrap:wrap!important;gap:12px!important;font-size:13.5px!important;color:#64748b!important;font-family:\'Inter\',-apple-system,sans-serif!important;">' +
        '<span>' + content.copyright + '</span>' +
        '<span style="color:#64748b!important;font-weight:500!important;">' + (content.tagline || "Empowering AI Innovation Worldwide") + '</span>' +
        '</div>';
    }

    // No confirmed Demaze social links — hide rather than invent.
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
    if (window.DemazeOverride && window.DemazeOverride.markReady) {
      window.DemazeOverride.markReady();
    }
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
