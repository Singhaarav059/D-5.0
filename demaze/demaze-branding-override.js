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

    var menus = footer.querySelectorAll('[data-framer-name="Menu"]');
    menus.forEach(function (menu, i) {
      if (i === 0) {
        var title = menu.querySelector('[data-framer-name="Menu Title"]');
        if (title) title.style.display = 'none';
        var links = menu.querySelectorAll('a');
        links.forEach(function (a, j) {
          var item = content.footerLinks[j];
          if (!item) {
            a.style.display = 'none';
            return;
          }
          a.style.display = '';
          a.setAttribute('href', item.href);
          var textNode = a.querySelector('p') || a;
          textNode.textContent = item.text;
        });
      } else {
        menu.style.display = 'none';
      }
    });

    var bottomText = footer.querySelector('[data-framer-name="Footer Bottom"] p');
    if (bottomText) bottomText.textContent = content.copyright;

    // No confirmed Demaze social links — hide rather than invent.
    var social = footer.querySelector('[data-framer-name="Social"]');
    if (social) social.style.display = 'none';
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
