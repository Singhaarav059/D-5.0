/**
 * Post-hydration content override for "Who We Are" (MOVIQ's "Products"
 * section: a centered heading + a 9-image gallery, no per-item text slots).
 *
 * The gallery has no legitimate Demaze equivalent (no real product/team
 * photos to place there) and is hidden rather than filled with stock
 * imagery. The heading slot becomes "Who We Are"; since MOVIQ's Products
 * section has no body-paragraph slot at all, one paragraph node is added
 * beneath the heading (matching the eyebrow-injection precedent already used
 * in the Showcase/Capabilities/Why-Demaze overrides) to carry Demaze's real
 * narrative text.
 *
 * MOVIQ's document order has "Ai Powered" (What Drives Us) BEFORE
 * "Products" (Who We Are). The approved mapping proposed reordering them so
 * "Who We Are" leads into "What Drives Us" — but moving a React-owned DOM
 * node to a different parent's child list (via insertBefore across
 * sections) crashes React's reconciler with a fatal, unrecoverable
 * "NotFoundError: removeChild"/"insertBefore" the next time it tries to
 * reconcile that subtree (confirmed live, not a guess). Content order stays
 * as MOVIQ built it — What Drives Us, then Who We Are — content only, no
 * DOM reordering.
 *
 * See demaze-override-core.js for why this waits/mutates/rechecks the way it does.
 */
(function () {
  var content = window.DEMAZE_CONTENT && window.DEMAZE_CONTENT.aboutUs && window.DEMAZE_CONTENT.aboutUs.whoWeAre;
  if (!content || !window.DemazeOverride) return;

  var PARA_CLASS = 'demaze-whoweare-paragraph';

  function getSection() {
    return document.querySelector('section[data-framer-name="Products"]');
  }

  function isHydrated(section) {
    var heading = section.querySelector('[data-framer-name="Header Text"] h2');
    return !!(heading && heading.textContent.trim().length > 0);
  }

  function applyOverride(section) {
    var heading = section.querySelector('[data-framer-name="Header Text"] h2');
    if (heading) {
      var span = heading.querySelector('span');
      (span || heading).textContent = content.heading;
    }

    if (!section.querySelector('.' + PARA_CLASS)) {
      var headerText = section.querySelector('[data-framer-name="Header Text"]');
      var p = document.createElement('p');
      p.className = PARA_CLASS;
      p.style.cssText =
        'max-width:760px;margin:20px auto 0;text-align:center;font-size:16px;line-height:1.7;color:rgb(108, 119, 131);';
      p.textContent = content.paragraphs.join(' ');
      headerText.insertAdjacentElement('afterend', p);
    }

    var gallery = section.querySelector('[data-framer-name="Gallary"]');
    if (gallery) gallery.style.display = 'none';
  }

  function verifyStuck(section) {
    var heading = section.querySelector('[data-framer-name="Header Text"] h2');
    return !!(heading && heading.textContent.trim() === content.heading);
  }

  window.DemazeOverride.run({
    getRoot: getSection,
    isHydrated: isHydrated,
    apply: applyOverride,
    verify: verifyStuck,
  });
})();
