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
      'section[data-framer-name="Sricpt"]{height:auto!important;min-height:0!important;padding:var(--dz-section-y) 0!important;overflow:visible!important;background:var(--dz-paper)!important;}' +
      '.demaze-showcase-grid{display:grid!important;grid-template-columns:minmax(0,3fr) minmax(0,9fr)!important;gap:clamp(40px,5vw,64px)!important;align-items:start!important;width:100%!important;max-width:calc(var(--dz-container) + 2 * var(--dz-gutter))!important;margin:0 auto!important;padding:0 var(--dz-gutter)!important;box-sizing:border-box!important;background:none!important;border:0!important;}' +
      '.demaze-showcase-left{position:sticky!important;top:120px!important;display:flex!important;flex-direction:column!important;align-items:flex-start!important;text-align:left!important;gap:0!important;width:auto!important;height:auto!important;z-index:2;}' +
      '.demaze-showcase-left > *{width:auto!important;}' +
      '.demaze-showcase-heading, .demaze-showcase-heading *{margin:0!important;font:600 var(--dz-h2)/1.08 var(--dz-font-display)!important;letter-spacing:-0.01em!important;color:var(--dz-ink)!important;-webkit-text-fill-color:var(--dz-ink)!important;background:none!important;text-align:left!important;}' +
      '.demaze-showcase-lead{margin:16px 0 0;font:400 var(--dz-lead)/1.6 var(--dz-font-text);color:var(--dz-ink-2);max-width:34ch;}' +
      '.demaze-showcase-cta-wrap{margin-top:28px;}' +
      '.demaze-project-stack{display:block!important;min-width:0!important;width:auto!important;padding:0!important;background:none!important;border:0!important;}' +
      '.demaze-project-card{display:grid!important;grid-template-columns:minmax(0,7fr) minmax(0,5fr)!important;gap:40px!important;align-items:center!important;padding:32px!important;margin-bottom:24px!important;box-sizing:border-box;background:var(--dz-paper);border:1px solid var(--dz-line);border-radius:var(--dz-radius-lg);box-shadow:var(--dz-shadow);}' +
      '.demaze-project-text{display:flex;flex-direction:column;min-width:0;}' +
      '.demaze-project-domain{margin:0 0 12px;font:600 12px/1.2 var(--dz-font-text);letter-spacing:.08em;text-transform:uppercase;color:var(--dz-accent);}' +
      '.demaze-project-title{margin:0 0 12px!important;font:600 clamp(20px,1.8vw,24px)/1.2 var(--dz-font-display)!important;letter-spacing:-0.01em;color:var(--dz-ink);text-wrap:balance;}' +
      '.demaze-project-desc{margin:0 0 20px;font:400 15px/1.6 var(--dz-font-text);color:var(--dz-ink-2);}' +
      '.demaze-project-features{list-style:none;margin:0 0 24px;padding:0;display:grid;grid-template-columns:1fr 1fr;gap:8px 20px;}' +
      '.demaze-project-features li{position:relative;padding-left:16px;font:400 14px/1.4 var(--dz-font-text);color:var(--dz-ink-3);}' +
      '.demaze-project-features li::before{content:"";position:absolute;left:0;top:.6em;width:6px;height:1px;background:var(--dz-ink-3);}' +
      '.demaze-project-media{aspect-ratio:4/3;border-radius:var(--dz-radius);overflow:hidden;background:var(--dz-paper-2);display:flex;align-items:center;justify-content:center;padding:16px;box-sizing:border-box;}' +
      '.demaze-project-media img{width:100%;height:100%;object-fit:contain;display:block;}' +
      '@media (max-width:1024px){.demaze-showcase-grid{grid-template-columns:1fr!important;}.demaze-showcase-left{position:static!important;}.demaze-showcase-lead{max-width:52ch;}}' +
      '@media (max-width:809px){.demaze-project-card{position:static!important;grid-template-columns:1fr!important;gap:24px!important;padding:20px!important;}.demaze-project-media{order:-1;}}' +
      '@media (max-width:520px){.demaze-project-features{grid-template-columns:1fr;}}';
    document.head.appendChild(style);
  }

  function cardHTML(project, i) {
    var featureItems = project.features
      .map(function (f) {
        return '<li>' + f + '</li>';
      })
      .join('');
    var baseImg = project.image.split('?')[0];
    var imgUrl = baseImg + '?scale-down-to=1024';
    var stickyTop = 110 + i * 28;
    var domainBadge = project.domainTag
      ? '<p class="demaze-project-domain">' + project.domainTag + '</p>'
      : '';
    var projectHref = project.href || './projects';
    return (
      '<div class="demaze-project-card" style="position:sticky;top:' + stickyTop + 'px;z-index:' + (i + 1) + ';">' +
      '<div class="demaze-project-text">' +
      domainBadge +
      '<h3 class="demaze-project-title">' + project.title + '</h3>' +
      '<p class="demaze-project-desc">' + project.description + '</p>' +
      '<ul class="demaze-project-features">' + featureItems + '</ul>' +
      '<a href="' + projectHref + '" class="dz-link">View project</a>' +

      '</div>' +
      '<div class="demaze-project-media"><img src="' + imgUrl + '" alt="' + project.title + '" loading="lazy" decoding="async" width="1024" height="768"></div>' +
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
      eyebrow.className = 'dz-eyebrow demaze-showcase-eyebrow';
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
      ctaWrap.innerHTML = '<a href="' + content.viewAllCTA.href + '" class="dz-btn dz-btn--secondary">' + content.viewAllCTA.text + '</a>';
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
