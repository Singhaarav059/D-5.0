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
 * Footer — KNOWN LIMITATION, read before touching this again: MOVIQ has 4
 * link columns (Quick Links/Company/Resources/Legal) plus a social-icon
 * row. The original plan was to repurpose the first column for Demaze's 4
 * real footer links and hide the other 3 columns + social row entirely
 * (no Demaze equivalents). Confirmed live, repeatedly, that setting
 * `style.display='none'` on those footer siblings crashes React's
 * reconciler fatally on mobile width, sometime after load — isolated by
 * bisecting every override on this page down to this single operation:
 * text-only mutations here never crash (mobile or desktop), across dozens
 * of fresh-tab reloads; adding the hides back in reproduces the crash
 * every time. So for now, only the first column's link text/hrefs are
 * updated to Demaze's copy; the Company/Resources/Legal columns and social
 * icons are left showing MOVIQ's own content. Revisit if a safe way to
 * remove them (e.g. a real fix rather than inline style toggling) is found.
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

  function applyNav(nav) {
    var logoImg = nav.querySelector('img');
    if (logoImg) {
      logoImg.setAttribute('src', LOGO_SRC);
      logoImg.setAttribute('srcset', '');
      logoImg.setAttribute('alt', LOGO_ALT);
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

    // Only the first column's links get Demaze's real text/hrefs — see file
    // header for why the other 3 columns and social row are left alone.
    var firstMenu = footer.querySelector('[data-framer-name="Menu"]');
    if (firstMenu) {
      var links = firstMenu.querySelectorAll('a');
      links.forEach(function (a, j) {
        var item = content.footerLinks[j];
        if (!item) return;
        a.setAttribute('href', item.href);
        var textNode = a.querySelector('p') || a;
        textNode.textContent = item.text;
      });
    }

    var bottomText = footer.querySelector('[data-framer-name="Footer Bottom"] p');
    if (bottomText) bottomText.textContent = content.copyright;
  }

  function applyOverride() {
    var nav = getNav();
    if (nav) applyNav(nav);
    applyFooter();
  }

  function verifyStuck() {
    var nav = getNav();
    var navLogoOk = !!(nav && nav.querySelector('img') && nav.querySelector('img').getAttribute('src') === LOGO_SRC);
    var footer = document.querySelector('footer');
    var bottomText = footer && footer.querySelector('[data-framer-name="Footer Bottom"] p');
    return !!(navLogoOk && bottomText && bottomText.textContent.trim() === content.copyright);
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
