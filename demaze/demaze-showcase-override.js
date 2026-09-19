/**
 * Post-hydration content override for the Featured Projects section (MOVIQ's
 * "Sricpt" section).
 *
 * MOVIQ's original markup here is a plain two-image row with no text slot.
 * Per explicit direction (matched against a reference recording, not just a
 * screenshot), this is rebuilt as:
 *   - a left column (eyebrow + section heading) that stays sticky/fixed in
 *     place while the section scrolls past — desktop only (>=810px, matching
 *     MOVIQ's own tablet breakpoint)
 *   - a right column: an ordered stack of project cards, each already
 *     positioned one under the next. Each card sticks at a slightly larger
 *     `top` offset than the one before it, so as you scroll, the current
 *     card holds its pinned position while the next card's box (positioned
 *     right after it in normal flow) rises and progressively covers it —
 *     the previous card's top edge stays visible as a thin strip until the
 *     next one fully takes over the active position. No carousel, fade, or
 *     side-entry transitions — this is pure position:sticky + document flow.
 *
 * Below 810px this collapses to a plain stacked column (heading, then cards,
 * no sticky/stacking) since the effect was only requested for desktop.
 *
 * See demaze-override-core.js for why this waits/mutates/rechecks the way it does.
 */
(function () {
  var content = window.DEMAZE_CONTENT && window.DEMAZE_CONTENT.visualShowcase;
  if (!content || !window.DemazeOverride) return;

  var STYLE_ID = 'demaze-showcase-style';
  var BRAND_BLUE = '#5B5FEF';
  var MUTED = 'rgb(108, 119, 131)';

  function ensureStyle() {
    if (document.getElementById(STYLE_ID)) return;
    var style = document.createElement('style');
    style.id = STYLE_ID;
    style.textContent =
      // !important throughout this block: MOVIQ's own rules for these nodes
      // (e.g. ".framer-ScIth .framer-1a3dchp") combine an ancestor class with
      // the element's own class, which beats a plain single-class override
      // on specificity alone — confirmed by testing, not a defensive guess.
      '.demaze-showcase-grid{display:flex!important;flex-direction:row!important;gap:40px!important;' +
      'align-items:flex-start!important;background:transparent!important;padding:0!important;border:none!important;width:100%!important;max-width:1320px!important;margin:0 auto!important;}' +
      '.demaze-showcase-left{flex:0 0 280px!important;}' +
      '.demaze-showcase-eyebrow{display:inline-flex;align-items:center;gap:8px;background:#f1f2fe;color:' + BRAND_BLUE + ';' +
      'font-size:13px;font-weight:600;letter-spacing:0.02em;padding:6px 14px;border-radius:100px;margin-bottom:16px;}' +
      '.demaze-showcase-heading{font-size:clamp(24px,2.8vw,34px);font-weight:700;color:rgb(0,0,0);margin:0;line-height:1.2;letter-spacing:-0.01em;}' +
      '.demaze-project-stack{flex:1 1 auto!important;min-width:0!important;display:block!important;' +
      'background:transparent!important;padding:0!important;border:none!important;width:auto!important;}' +
      '.demaze-project-card{background:#fff;border-radius:24px;border:1px solid rgba(0,0,0,0.07);box-shadow:0 16px 44px rgba(0,0,0,0.07);' +
      'display:grid!important;grid-template-columns:1.2fr 1fr!important;gap:28px!important;align-items:center!important;padding:28px 30px!important;margin-bottom:64px!important;box-sizing:border-box;}' +
      '.demaze-project-text{display:flex;flex-direction:column;justify-content:center;min-width:0;}' +
      '.demaze-project-media{border-radius:16px;overflow:hidden;background:#f1f2f4;max-height:280px;height:260px;width:100%;box-shadow:0 4px 16px rgba(0,0,0,0.06);}' +
      '.demaze-project-media img{width:100%;height:100%;object-fit:cover;display:block;}' +
      '.demaze-project-title{font-size:clamp(18px,2vw,22px);font-weight:700;color:rgb(0,0,0);margin:0 0 10px;line-height:1.3;}' +
      '.demaze-project-desc{color:' + MUTED + ';font-size:13.5px;line-height:1.55;margin:0 0 16px;' +
      'display:-webkit-box;-webkit-line-clamp:3;-webkit-box-orient:vertical;overflow:hidden;}' +
      '.demaze-project-features{list-style:none;padding:0;margin:0;display:grid!important;grid-template-columns:repeat(2,1fr)!important;gap:8px 14px!important;}' +
      '.demaze-project-features li{display:flex;align-items:flex-start;gap:8px;color:rgb(33,37,41);font-size:12.5px;line-height:1.35;}' +
      '.demaze-project-features svg{flex:none;margin-top:1px;width:15px;height:15px;}' +
      '@media (min-width:810px){' +
      '.demaze-showcase-left{position:sticky!important;top:100px!important;}' +
      '.demaze-project-card{position:sticky;top:100px;}' +
      '}' +
      '@media (max-width:809px){' +
      '.demaze-showcase-grid{flex-direction:column!important;gap:24px!important;}' +
      '.demaze-showcase-left{flex:none!important;width:100%!important;position:static!important;}' +
      '.demaze-project-card{grid-template-columns:1fr!important;padding:22px;gap:20px;position:static!important;margin-bottom:24px!important;}' +
      '.demaze-project-media{height:200px;max-height:220px;}' +
      '.demaze-project-features{grid-template-columns:1fr!important;}' +
      '}' +
      '.demaze-showcase-cta-wrap{margin-top:28px;display:inline-block;}' +
      '.demaze-showcase-cta{display:inline-flex;align-items:center;gap:8px;padding:12px 26px;border-radius:100px;background:#fff;border:1px solid rgba(0,0,0,0.12);color:rgb(0,0,0);font-weight:600;font-size:14px;text-decoration:none;box-shadow:0 6px 18px rgba(0,0,0,0.05);transition:all 0.2s ease;}' +
      '.demaze-showcase-cta:hover{background:#f8f9fa;border-color:rgba(0,0,0,0.2);transform:translateY(-1px);box-shadow:0 8px 24px rgba(0,0,0,0.08);}';
    document.head.appendChild(style);
  }

  function checkIcon() {
    return (
      '<svg width="15" height="15" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">' +
      '<circle cx="12" cy="12" r="11" stroke="' + BRAND_BLUE + '" stroke-width="1.75"/>' +
      '<path d="M7.5 12.5L10.5 15.5L16.5 9" stroke="' + BRAND_BLUE + '" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>' +
      '</svg>'
    );
  }

  function cardHTML(project, i) {
    var featureItems = project.features
      .map(function (f) {
        return '<li>' + checkIcon() + '<span>' + f + '</span></li>';
      })
      .join('');
    return (
      '<div class="demaze-project-card" style="z-index:' + (i + 1) + ';">' +
      '<div class="demaze-project-text">' +
      '<h3 class="demaze-project-title">' + project.title + '</h3>' +
      '<p class="demaze-project-desc" title="' + project.description.replace(/"/g, '&quot;') + '">' + project.description + '</p>' +
      '<ul class="demaze-project-features">' + featureItems + '</ul>' +
      '</div>' +
      '<div class="demaze-project-media"><img src="' + project.image + '" alt="' + project.title + '"></div>' +
      '</div>'
    );
  }

  function getSection() {
    return document.querySelector('section[data-framer-name="Sricpt"]');
  }

  function isHydrated(section) {
    var h2 = section.querySelector('h2');
    var firstImg = section.querySelector('[data-framer-name="Section Container"] img');
    return !!(h2 && h2.textContent.trim().length > 0 && firstImg && firstImg.getAttribute('src'));
  }

  function applyOverride(section) {
    ensureStyle();

    var outerContainer = section.querySelector('[data-framer-name="Container"]');
    var headlineContainer = section.querySelector('[data-framer-name="Headline Container"]');
    var sectionContainer = section.querySelector('[data-framer-name="Section Container"]');
    if (!outerContainer || !headlineContainer || !sectionContainer) return;

    outerContainer.classList.add('demaze-showcase-grid');
    headlineContainer.classList.add('demaze-showcase-left');

    // Heading: move eyebrow above it, left-align (MOVIQ centered it as a
    // full-width banner heading; it's now a sidebar heading), and set text.
    var h2 = headlineContainer.querySelector('h2');
    if (h2 && !headlineContainer.querySelector('.demaze-showcase-eyebrow')) {
      var eyebrow = document.createElement('div');
      eyebrow.className = 'demaze-showcase-eyebrow';
      eyebrow.textContent = content.eyebrow;
      headlineContainer.insertBefore(eyebrow, h2.parentElement);
    }
    h2.classList.add('demaze-showcase-heading');
    h2.style.textAlign = 'left';
    var gradientSpan = h2.querySelector('span');
    var headingTarget = gradientSpan || h2;
    headingTarget.style.setProperty('--framer-text-alignment', 'left');
    headingTarget.textContent = content.heading;

    // View all work CTA
    if (content.viewAllCTA && !headlineContainer.querySelector('.demaze-showcase-cta-wrap')) {
      var ctaWrap = document.createElement('div');
      ctaWrap.className = 'demaze-showcase-cta-wrap';
      ctaWrap.innerHTML = '<a href="' + content.viewAllCTA.href + '" class="demaze-showcase-cta">' + content.viewAllCTA.text + ' &rarr;</a>';
      headlineContainer.appendChild(ctaWrap);
    }

    // Subtitle has no Demaze equivalent copy — hide, don't remove, so React
    // still owns the node.
    var subtitle = section.querySelector('[data-framer-name="Subtitle"]');
    if (subtitle) subtitle.style.display = 'none';

    if (!sectionContainer.classList.contains('demaze-project-stack')) {
      sectionContainer.classList.add('demaze-project-stack');
      sectionContainer.innerHTML = content.projects.map(cardHTML).join('');
    }
  }

  function verifyStuck(section) {
    var h2 = section.querySelector('h2');
    var headingOk = !!(h2 && h2.textContent.trim() === content.heading);
    var cards = section.querySelectorAll('.demaze-project-card');
    var gridOk = !!section.querySelector('.demaze-showcase-grid');
    return headingOk && gridOk && cards.length === content.projects.length;
  }

  window.DemazeOverride.run({
    getRoot: getSection,
    isHydrated: isHydrated,
    apply: applyOverride,
    verify: verifyStuck,
  });
})();
