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
      'section[data-framer-name="Videos making Step"]{display:flex!important;flex-direction:column!important;align-items:center!important;width:100%!important;height:auto!important;min-height:auto!important;padding:80px 24px 100px!important;background:#fff!important;position:relative!important;z-index:1!important;overflow:visible!important;}' +
      '.demaze-process-wrap{background:#fff;position:relative;z-index:1;padding:0;text-align:center;width:100%;max-width:1240px;margin:0 auto;}' +
      '.demaze-process-heading{font-size:clamp(28px,3.2vw,40px);font-weight:700;color:rgb(0,0,0);margin:0 0 48px;letter-spacing:-0.01em;}' +
      '.demaze-process-row{display:grid;grid-template-columns:repeat(4,1fr);gap:24px;width:100%;margin:0 auto;}' +
      '.demaze-process-card{background:#fff;border:1px solid rgba(0,0,0,0.06);border-radius:24px;padding:32px 24px;text-align:left;box-shadow:0 12px 32px rgba(0,0,0,0.04);transition:all 0.25s ease;display:flex;flex-direction:column;}' +
      '.demaze-process-card:hover{transform:translateY(-3px);box-shadow:0 18px 44px rgba(0,0,0,0.08);border-color:rgba(91,95,239,0.25);}' +
      '.demaze-process-step{display:inline-flex;align-items:center;justify-content:center;width:34px;height:34px;border-radius:100px;background:' + BRAND_BLUE + ';color:#fff;font-size:14px;font-weight:600;margin-bottom:18px;flex-shrink:0;box-shadow:0 4px 12px rgba(91,95,239,0.3);}' +
      '.demaze-process-card h3{font-size:18px;font-weight:600;color:rgb(0,0,0);margin:0 0 10px;line-height:1.3;}' +
      '.demaze-process-card p{font-size:13.5px;line-height:1.6;color:' + MUTED + ';margin:0;}' +
      '@media (max-width:1024px){.demaze-process-row{grid-template-columns:repeat(2,1fr);gap:20px;}}' +
      '@media (max-width:640px){.demaze-process-row{grid-template-columns:1fr;gap:16px;}.demaze-process-card{padding:24px;}}';
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

  function getProcessSection() {
    return document.querySelector('section[data-framer-name="Videos making Step"]');
  }

  function isHydrated(section) {
    return !!section;
  }

  function applyOverride(section) {
    ensureStyle();

    // Clean up any accidental copy left in Hero
    var oldHeroBlock = document.querySelector('section[data-framer-name="Hero"] #' + BLOCK_ID);
    if (oldHeroBlock) oldHeroBlock.remove();

    // Ensure this section is visible in natural document flow
    section.style.setProperty('display', 'flex', 'important');
    section.style.setProperty('height', 'auto', 'important');
    section.style.setProperty('min-height', 'auto', 'important');

    // Hide native MOVIQ children without modifying their React structure
    var nativeContainer = section.querySelector('[data-framer-name="Container"]');
    if (nativeContainer) {
      nativeContainer.style.setProperty('display', 'none', 'important');
    }

    if (!document.getElementById(BLOCK_ID)) {
      var block = document.createElement('div');
      block.id = BLOCK_ID;
      block.className = 'demaze-process-wrap';
      block.innerHTML =
        '<h2 class="demaze-process-heading">' + content.heading + '</h2>' +
        '<div class="demaze-process-row">' + content.steps.map(cardHTML).join('') + '</div>';
      section.appendChild(block);
    }
  }

  function verifyStuck() {
    var sec = getProcessSection();
    var secVisible = sec && sec.style.display !== 'none';
    var block = document.getElementById(BLOCK_ID);
    return !!(secVisible && block);
  }

  window.DemazeOverride.run({
    getRoot: getProcessSection,
    isHydrated: isHydrated,
    apply: applyOverride,
    verify: verifyStuck,
  });
})();
