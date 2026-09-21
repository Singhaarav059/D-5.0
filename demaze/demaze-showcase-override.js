/**
 * Post-hydration content override for the Featured Projects section (MOVIQ's
 * "Sricpt" section).
 *
 * MOVIQ's original markup here is a plain two-image row with no text slot.
 * Per explicit direction (matched against a reference recording, not just a
 * screenshot), this is rebuilt as:
 *   - a left column (eyebrow + section heading) that stays sticky/fixed in
 *     place while the section scrolls past - desktop only (>=810px, matching
 *     MOVIQ's own tablet breakpoint)
 *   - a right column: an ordered stack of project cards, each already
 *     positioned one under the next. Each card sticks at a slightly larger
 *     `top` offset than the one before it, so as you scroll, the current
 *     card holds its pinned position while the next card's box (positioned
 *     right after it in normal flow) rises and progressively covers it  - 
 *     the previous card's top edge stays visible as a thin strip until the
 *     next one fully takes over the active position. No carousel, fade, or
 *     side-entry transitions - this is pure position:sticky + document flow.
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
      // on specificity alone - confirmed by testing, not a defensive guess.
      'section[data-framer-name="Sricpt"]{height:auto!important;min-height:auto!important;padding:44px 24px 48px!important;overflow:visible!important;}' +
      '.demaze-showcase-grid{display:flex!important;flex-direction:row!important;gap:36px!important;' +
      'align-items:flex-start!important;background:transparent!important;padding:0!important;border:none!important;width:100%!important;max-width:1200px!important;margin:0 auto!important;}' +
      '.demaze-showcase-left{flex:0 0 320px!important;position:sticky!important;top:110px!important;height:fit-content!important;align-self:flex-start!important;z-index:2;}' +
      '.demaze-showcase-eyebrow{display:inline-flex;align-items:center;gap:8px;background:rgba(99, 102, 241, 0.08);color:#4F46E5;' +
      'font-size:12px;font-weight:600;letter-spacing:0.08em;text-transform:uppercase;padding:5px 14px;border-radius:999px;margin-bottom:14px;border:1px solid rgba(99, 102, 241, 0.2);}' +
      '.demaze-showcase-heading{font-size:clamp(26px,3vw,36px);font-weight:700;color:#0B0E17;margin:0 0 16px;line-height:1.2;letter-spacing:-0.025em;}' +
      '.demaze-project-stack{flex:1 1 auto!important;min-width:0!important;display:block!important;' +
      'background:transparent!important;padding:0 0 16px 0!important;border:none!important;width:auto!important;}' +
      '.demaze-project-card{background:#fff;border-radius:20px;border:1px solid #E7E7F3;box-shadow:0 1px 2px rgba(11,14,23,0.04), 0 12px 36px rgba(60,50,140,0.06);' +
      'display:grid!important;grid-template-columns:1.15fr 1fr!important;gap:24px!important;align-items:center!important;padding:22px 24px!important;margin-bottom:24px!important;box-sizing:border-box;transition:all 0.3s ease;}' +
      '.demaze-project-text{display:flex;flex-direction:column;justify-content:center;min-width:0;}' +
      '.demaze-project-media{border-radius:16px;overflow:hidden;background:linear-gradient(135deg, #F0EEFF 0%, #E8E5FF 100%);border:1px solid rgba(91,79,233,0.15);aspect-ratio:16/10;max-height:300px;height:auto;width:100%;box-shadow:0 6px 20px rgba(0,0,0,0.03);display:flex;align-items:center;justify-content:center;padding:10px;box-sizing:border-box;}' +
      '.demaze-project-media img{width:100%;height:100%;object-fit:contain;object-position:center;display:block;transition:transform 0.4s ease;}' +
      '.demaze-project-card:hover .demaze-project-media img{transform:scale(1.02);}' +
      '.demaze-project-title{font-size:clamp(18px,2vw,22px);font-weight:700;color:#0B0E17;margin:0 0 10px;line-height:1.3;letter-spacing:-0.015em;}' +
      '.demaze-project-desc{color:#3F4454;font-size:14px;line-height:1.6;margin:0 0 16px;display:block;overflow:visible;}' +
      '.demaze-project-features{list-style:none;padding:0;margin:0;display:grid!important;grid-template-columns:repeat(2,1fr)!important;gap:8px 14px!important;}' +
      '.demaze-project-features li{display:flex;align-items:flex-start;gap:8px;color:#0B0E17;font-size:12.5px;line-height:1.4;font-weight:500;}' +
      '.demaze-project-features svg{flex:none;margin-top:2px;width:15px;height:15px;}' +
      '@media (max-width:809px){' +
      '.demaze-showcase-grid{flex-direction:column!important;gap:20px!important;}' +
      '.demaze-showcase-left{flex:none!important;width:100%!important;position:static!important;}' +
      '.demaze-project-card{grid-template-columns:1fr!important;padding:20px;gap:18px;position:static!important;margin-bottom:20px!important;top:auto!important;}' +
      '.demaze-project-media{aspect-ratio:16/10;max-height:240px;}' +
      '.demaze-project-features{grid-template-columns:1fr!important;}' +
      '}' +
      '.demaze-showcase-cta-wrap{margin-top:22px;display:inline-block;}' +
      '.demaze-showcase-cta{display:inline-flex;align-items:center;gap:8px;padding:10px 22px;border-radius:999px;background:#0B0E17;border:1px solid #0B0E17;color:#fff;font-weight:600;font-size:13.5px;text-decoration:none;box-shadow:0 4px 14px rgba(0,0,0,0.12);transition:all 0.2s ease;}' +
      '.demaze-showcase-cta:hover{background:#212251;border-color:#212251;transform:translateY(-1px);box-shadow:0 6px 18px rgba(0,0,0,0.18);}';
    document.head.appendChild(style);
  }

  function checkIcon() {
    return (
      '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">' +
      '<circle cx="12" cy="12" r="11" fill="rgba(91,95,239,0.1)" stroke="' + BRAND_BLUE + '" stroke-width="1.75"/>' +
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
    var baseImg = project.image.split('?')[0];
    var imgUrl = baseImg + '?scale-down-to=1024';
    var stickyTop = 100 + i * 22;
    return (
      '<div class="demaze-project-card" style="position:sticky;top:' + stickyTop + 'px;z-index:' + (i + 1) + ';">' +
      '<div class="demaze-project-text">' +
      '<h3 class="demaze-project-title">' + project.title + '</h3>' +
      '<p class="demaze-project-desc">' + project.description + '</p>' +
      '<ul class="demaze-project-features">' + featureItems + '</ul>' +
      '</div>' +
      '<div class="demaze-project-media"><img src="' + imgUrl + '" alt="' + project.title + '" loading="lazy"></div>' +
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

    // Subtitle has no Demaze equivalent copy - hide, don't remove, so React
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
