/**
 * Our Process — Demaze's real 4-step process (Discover & Define / Design &
 * Prototype / Build & Integrate / Launch & Scale), from
 * demazetech.com homepage "HOW WE WORK: Our Process".
 *
 * MOVIQ's native "Videos making Step" section (a 3-card row) is the obvious
 * candidate for this content. Confirmed live, exhaustively, that touching
 * that section's children — a cloned 4th card, nested extra content in an
 * existing card, even plain text-only edits with zero new nodes — can
 * trigger a fatal React reconciliation crash on mobile-width loads. Also
 * confirmed: this crash is NOT deterministic — the exact same code was
 * observed to crash on some fresh-tab loads and not others, including the
 * plain hidden state and pure unmodified MOVIQ with zero of this project's
 * scripts. It's a flaky timing race in Framer's own hydration, not a bug
 * tied to one specific technique, so no code change here can promise zero
 * risk — only lower it.
 *
 * This builds a brand-new, fully custom 4-card block appended as a nested
 * leaf inside Hero's own container (the same pattern already used for the
 * Founder Testimonial, which has been the most-tested single mutation in
 * this project across this session with no observed crash tied to it
 * specifically). MOVIQ's native "Videos making Step" section is hidden via
 * its own root `display:none` only — never mutated further — since hiding
 * a section root (with zero mutation of its children) was the one
 * operation confirmed safe across every test run this entire session.
 *
 * See DEMAZE_IMPLEMENTATION_STATE.md for the full investigation history.
 * See demaze-override-core.js for why this waits/mutates/rechecks the way it does.
 */
(function () {
  var content = window.DEMAZE_CONTENT && window.DEMAZE_CONTENT.process;
  if (!content || !window.DemazeOverride) return;

  var STYLE_ID = 'demaze-process-style';
  var BLOCK_ID = 'demaze-process-block';
  var BRAND_BLUE = '#5B5FEF';
  var MUTED = 'rgb(108, 119, 131)';

  function ensureStyle() {
    if (document.getElementById(STYLE_ID)) return;
    var style = document.createElement('style');
    style.id = STYLE_ID;
    style.textContent =
      '.demaze-process-wrap{background:#fff;position:relative;z-index:1;padding:80px 24px;text-align:center;}' +
      '.demaze-process-heading{font-size:clamp(26px,3.2vw,38px);font-weight:600;color:rgb(0,0,0);margin:0 0 40px;}' +
      '.demaze-process-row{display:flex;flex-direction:row;gap:24px;flex-wrap:wrap;justify-content:center;max-width:1200px;margin:0 auto;}' +
      '.demaze-process-card{flex:1 1 240px;max-width:280px;background:#fff;border:1px solid rgba(0,0,0,0.06);' +
      'border-radius:24px;padding:28px 24px;text-align:left;box-shadow:0 12px 32px rgba(0,0,0,0.05);}' +
      '.demaze-process-step{display:inline-flex;align-items:center;justify-content:center;width:32px;height:32px;' +
      'border-radius:100px;background:' + BRAND_BLUE + ';color:#fff;font-size:13px;font-weight:600;margin-bottom:16px;}' +
      '.demaze-process-card h3{font-size:17px;font-weight:600;color:rgb(0,0,0);margin:0 0 10px;}' +
      '.demaze-process-card p{font-size:14px;line-height:1.6;color:' + MUTED + ';margin:0;}' +
      '@media (max-width:809px){.demaze-process-row{flex-direction:column;align-items:stretch;}' +
      '.demaze-process-card{max-width:none;}}';
    document.head.appendChild(style);
  }

  function cardHTML(step, i) {
    return (
      '<div class="demaze-process-card">' +
      '<div class="demaze-process-step">' + (i + 1) + '</div>' +
      '<h3>' + step.title + '</h3>' +
      '<p>' + step.description + '</p>' +
      '</div>'
    );
  }

  function getAnchorSection() {
    return document.querySelector('section[data-framer-name="Hero"]');
  }

  function isHydrated(section) {
    return !!section.querySelector('[data-framer-name="Container"]');
  }

  function hideNativeSection() {
    var native = document.querySelector('section[data-framer-name="Videos making Step"]');
    if (native && native.style.display !== 'none') native.style.display = 'none';
  }

  function applyOverride(section) {
    hideNativeSection();
    ensureStyle();
    if (document.getElementById(BLOCK_ID)) return;
    var container = section.querySelector('[data-framer-name="Container"]');
    if (!container) return;

    var block = document.createElement('div');
    block.id = BLOCK_ID;
    block.className = 'demaze-process-wrap';
    block.innerHTML =
      '<h2 class="demaze-process-heading">' + content.heading + '</h2>' +
      '<div class="demaze-process-row">' + content.steps.map(cardHTML).join('') + '</div>';
    container.appendChild(block);
  }

  function verifyStuck() {
    var native = document.querySelector('section[data-framer-name="Videos making Step"]');
    var nativeHidden = !native || native.style.display === 'none';
    return nativeHidden && !!document.getElementById(BLOCK_ID);
  }

  window.DemazeOverride.run({
    getRoot: getAnchorSection,
    isHydrated: isHydrated,
    apply: applyOverride,
    verify: verifyStuck,
  });
})();
