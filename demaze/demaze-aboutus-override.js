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
 * "Who We Are" leads into "What Drives Us" - but moving a React-owned DOM
 * node to a different parent's child list (via insertBefore across
 * sections) crashes React's reconciler with a fatal, unrecoverable
 * "NotFoundError: removeChild"/"insertBefore" the next time it tries to
 * reconcile that subtree (confirmed live, not a guess). Content order stays
 * as MOVIQ built it - What Drives Us, then Who We Are - content only, no
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

  var STYLE_ID = 'demaze-aboutus-style';

  function ensureStyle() {
    if (document.getElementById(STYLE_ID)) return;
    var style = document.createElement('style');
    style.id = STYLE_ID;
    style.textContent =
      'section[data-framer-name="Products"]{padding: 60px 24px 50px!important;height:auto!important;min-height:auto!important;}' +
      'section[data-framer-name="Products"] h2{' +
      '  font-size:clamp(34px, 3.8vw, 46px)!important;font-weight:700!important;color:#0B0E17!important;margin:0 0 16px!important;opacity:1!important;transform:none!important;' +
      '}' +
      '.demaze-about-badges{display:flex;flex-wrap:wrap;gap:10px;justify-content:center;max-width:860px;margin:24px auto 32px;}' +
      '.demaze-about-badge{background:#fff;border:1px solid rgba(44,83,199,0.18);color:#2C53C7;font-size:12.5px;font-weight:600;' +
      'padding:6px 16px;border-radius:100px;box-shadow:0 2px 8px rgba(0,0,0,0.04);transition:all 0.2s ease;}' +
      '.demaze-about-badge:hover{transform:translateY(-1px);border-color:#2C53C7;box-shadow:0 4px 12px rgba(44,83,199,0.12);}' +
      '.demaze-founder-statement-block{max-width:820px;margin:40px auto 0;text-align:center;padding:40px 24px 20px;border-top:1px solid rgba(0,0,0,0.07);}' +
      '.demaze-founder-mark{font-size:56px;line-height:1;color:#5B4FE9;font-family:Georgia,serif;margin-bottom:6px;}' +
      '.demaze-founder-quote{font-family:"Stack Sans Headline", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif!important;font-size:clamp(20px,2.2vw,28px)!important;line-height:1.55!important;font-weight:500!important;color:#0b0f19!important;margin:0 0 24px!important;}' +
      '.demaze-founder-byline{display:flex!important;flex-direction:column!important;align-items:center!important;justify-content:center!important;gap:4px;margin:0 auto!important;text-align:center!important;}' +
      '.demaze-testimonial-avatar{width:72px!important;height:72px!important;border-radius:50%!important;object-fit:cover!important;object-position:center top!important;box-shadow:0 4px 18px rgba(0,0,0,0.12)!important;border:2px solid #5B4FE9!important;margin:0 auto 12px!important;display:block!important;}' +
      '.demaze-founder-info{text-align:center!important;}' +
      '.demaze-founder-name{font-size:16px;font-weight:700;color:#0b0f19;letter-spacing:-0.01em;}' +
      '.demaze-founder-title{font-size:13.5px;color:rgb(108, 119, 131);}';
    document.head.appendChild(style);
  }

  function applyOverride(section) {
    ensureStyle();
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
        'max-width:800px;margin:16px auto 0;text-align:center;font-size:16.5px;line-height:1.68;color:#3F4454;';
      p.textContent = content.paragraphs.join(' ');
      headerText.insertAdjacentElement('afterend', p);

      // Capability badges
      if (content.badges && content.badges.length > 0 && !section.querySelector('.demaze-about-badges')) {
        var badgesWrap = document.createElement('div');
        badgesWrap.className = 'demaze-about-badges';
        badgesWrap.innerHTML = content.badges
          .map(function (b) {
            return '<span class="demaze-about-badge">' + b + '</span>';
          })
          .join('');
        p.insertAdjacentElement('afterend', badgesWrap);

      }
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
