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
      '.demaze-showcase-grid{display:flex!important;flex-direction:row!important;gap:48px!important;' +
      'align-items:flex-start!important;background:transparent!important;padding:0!important;border:none!important;}' +
      '.demaze-showcase-left{flex:0 0 300px!important;}' +
      '.demaze-showcase-eyebrow{display:inline-flex;align-items:center;gap:8px;background:#f1f2fe;color:' + BRAND_BLUE + ';' +
      'font-size:13px;font-weight:600;letter-spacing:0.02em;padding:6px 14px;border-radius:100px;margin-bottom:20px;}' +
      '.demaze-showcase-heading{font-size:clamp(24px,3vw,34px);font-weight:600;color:rgb(0,0,0);margin:0;line-height:1.2;}' +
      '.demaze-project-stack{flex:1 1 auto!important;min-width:0!important;display:block!important;' +
      'background:transparent!important;padding:0!important;border:none!important;width:auto!important;}' +
      '.demaze-project-card{background:#fff;border-radius:28px;box-shadow:0 20px 60px rgba(0,0,0,0.10);' +
      'display:flex;gap:40px;align-items:center;flex-wrap:wrap;padding:40px;margin-bottom:32px;}' +
      '.demaze-project-text{flex:1 1 280px;min-width:240px;}' +
      '.demaze-project-media{flex:1 1 320px;min-width:240px;border-radius:20px;overflow:hidden;background:#f1f2f4;' +
      'aspect-ratio:1.15;}' +
      '.demaze-project-media img{width:100%;height:100%;object-fit:cover;display:block;}' +
      '.demaze-project-title{font-size:clamp(19px,2.2vw,26px);font-weight:600;color:rgb(0,0,0);margin:0 0 12px;line-height:1.25;}' +
      '.demaze-project-desc{color:' + MUTED + ';font-size:15px;line-height:1.6;margin:0 0 20px;}' +
      '.demaze-project-features{list-style:none;padding:0;margin:0;display:flex;flex-direction:column;gap:12px;}' +
      '.demaze-project-features li{display:flex;align-items:flex-start;gap:10px;color:rgb(33,37,41);font-size:14px;line-height:1.5;}' +
      '.demaze-project-features svg{flex:none;margin-top:2px;}' +
      '@media (min-width:810px){' +
      '.demaze-showcase-left{position:sticky!important;top:110px!important;}' +
      '.demaze-project-card{position:sticky;}' +
      '}' +
      '@media (max-width:809px){' +
      '.demaze-showcase-grid{flex-direction:column!important;gap:24px!important;}' +
      '.demaze-showcase-left{flex:none!important;width:100%!important;position:static!important;}' +
      '.demaze-project-card{padding:24px;gap:24px;position:static!important;}' +
      '}';
    document.head.appendChild(style);
  }

  function checkIcon() {
    return (
      '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">' +
      '<circle cx="12" cy="12" r="11" stroke="' + BRAND_BLUE + '" stroke-width="1.5"/>' +
      '<path d="M7.5 12.5L10.5 15.5L16.5 9" stroke="' + BRAND_BLUE + '" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"/>' +
      '</svg>'
    );
  }

  function cardHTML(project, i) {
    var topOffset = 110 + i * 28;
    var featureItems = project.features
      .map(function (f) {
        return '<li>' + checkIcon() + '<span>' + f + '</span></li>';
      })
      .join('');
    return (
      '<div class="demaze-project-card" style="top:' + topOffset + 'px;z-index:' + (i + 1) + ';">' +
      '<div class="demaze-project-text">' +
      '<h3 class="demaze-project-title">' + project.title + '</h3>' +
      '<p class="demaze-project-desc">' + project.description + '</p>' +
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
