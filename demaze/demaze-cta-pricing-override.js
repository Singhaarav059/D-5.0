/**
 * Cleans up MOVIQ's promotional CTA bands and Pricing section, none of which
 * have a Demaze equivalent, and repoints the one CTA that does (the instance
 * already linking to "./contact") at Demaze's real final CTA copy.
 *
 * MOVIQ's "CTA" data-framer-name repeats 3x on this page with identical
 * markup shape; only the third instance already targets "./contact" — that's
 * the stable identifying signal used to find it (never index into the
 * NodeList directly, per the Framer breakpoint-variant lesson in
 * DEMAZE_IMPLEMENTATION_STATE.md).
 *
 * See demaze-override-core.js for why this waits/mutates/rechecks the way it does.
 */
(function () {
  var content = window.DEMAZE_CONTENT && window.DEMAZE_CONTENT.finalCTA;
  if (!content || !window.DemazeOverride) return;

  function allCTAs() {
    return Array.prototype.slice.call(document.querySelectorAll('section[data-framer-name="CTA"]'));
  }

  function findFinalCTA() {
    return allCTAs().filter(function (s) {
      return !!s.querySelector('a[href="./contact"]');
    })[0] || null;
  }

  function findPromoCTAs() {
    return allCTAs().filter(function (s) {
      return !s.querySelector('a[href="./contact"]');
    });
  }

  function getPricing() {
    return document.querySelector('section[data-framer-name="Pricing"]');
  }

  // --- Promo CTA bands: hide entirely, no Demaze equivalent ---
  function isHydratedPromo(section) {
    var title = section.querySelector('[data-framer-name="Title"]');
    return !!(title && title.textContent.trim().length > 0);
  }

  function applyHide(section) {
    section.style.setProperty('display', 'none', 'important');
  }

  function verifyHidden(section) {
    return section.style.display === 'none';
  }

  // Two promo bands share identical content, so there's nothing to tell them
  // apart by except "not the one with a ./contact link" (the final CTA).
  // getRoot re-filters fresh on every tick/recheck rather than closing over a
  // captured node, so it keeps finding the right ones even if Framer swaps in
  // a different responsive-variant subtree later.
  [0, 1].forEach(function (promoIndex) {
    window.DemazeOverride.run({
      getRoot: function () {
        return findPromoCTAs()[promoIndex] || null;
      },
      isHydrated: isHydratedPromo,
      apply: applyHide,
      verify: verifyHidden,
    });
  });

  // --- Pricing: hide entirely, Demaze has no public pricing ---
  window.DemazeOverride.run({
    getRoot: getPricing,
    isHydrated: function (section) {
      return !!section.querySelector('[data-framer-name="Team Title"]');
    },
    apply: applyHide,
    verify: verifyHidden,
  });

  // --- Final CTA: keep the section, swap in real Demaze copy ---
  function isHydratedFinal(section) {
    var title = section.querySelector('[data-framer-name="Title"]');
    return !!(title && title.textContent.trim().length > 0);
  }

  function applyFinal(section) {
    var title = section.querySelector('[data-framer-name="Title"]');
    if (title) {
      var gradientSpan = title.querySelector('span');
      (gradientSpan || title).textContent = content.heading;
    }

    var subtitle = section.querySelector('[data-framer-name="Subtitle"]');
    if (subtitle) subtitle.style.setProperty('display', 'none', 'important');

    var buttons = Array.prototype.slice.call(
      section.querySelectorAll('[data-framer-name="CTA Buttons"] > *')
    );
    buttons.forEach(function (btn, i) {
      if (i === 0) {
        var textNode = btn.querySelector('[data-framer-name="Call to Action Text"]') || btn;
        textNode.textContent = content.primaryCTA.text;
        var link = btn.tagName === 'A' ? btn : btn.querySelector('a');
        if (link) link.setAttribute('href', content.primaryCTA.href);
      } else {
        btn.style.setProperty('display', 'none', 'important');
      }
    });
  }

  function verifyFinal(section) {
    var title = section.querySelector('[data-framer-name="Title"]');
    return !!(title && title.textContent.trim() === content.heading);
  }

  window.DemazeOverride.run({
    getRoot: findFinalCTA,
    isHydrated: isHydratedFinal,
    apply: applyFinal,
    verify: verifyFinal,
  });
})();
