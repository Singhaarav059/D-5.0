/**
 * Post-hydration content override for the Core Capabilities section (MOVIQ's
 * "Tools" section: a heading + a 4-card service grid).
 *
 * Sits directly under "Our Work" on the home page. Clean, responsive,
 * immediately visible grid with zero ghosting or dead white space.
 *
 * See demaze-override-core.js for why this waits/mutates/rechecks the way it does.
 */
(function () {
  var content = window.DEMAZE_CONTENT && window.DEMAZE_CONTENT.coreCapabilities;
  if (!content || !window.DemazeOverride) return;

  var EYEBROW_CLASS = 'demaze-capabilities-eyebrow';
  var STYLE_ID = 'demaze-capabilities-style';
  var BRAND_BLUE = '#5B4FE9';
  var MUTED = '#6C7783';

  function ensureStyle() {
    if (document.getElementById(STYLE_ID)) return;
    var style = document.createElement('style');
    style.id = STYLE_ID;
    style.textContent =
      'section.framer-1e6ypd3, section[data-framer-name="Tools"]:has([data-framer-name="Grid"]){' +
      '  height:auto!important;min-height:auto!important;padding:70px 24px 50px!important;overflow:visible!important;' +
      '}' +
      'section.framer-1e6ypd3 [data-framer-name="Headline Container"], section[data-framer-name="Tools"] [data-framer-name="Headline Container"]{' +
      '  margin-bottom:32px!important;display:flex!important;flex-direction:column!important;align-items:center!important;text-align:center!important;' +
      '}' +
      'section.framer-1e6ypd3 h2, section[data-framer-name="Tools"] h2{' +
      '  opacity:1!important;visibility:visible!important;transform:none!important;color:#0B0E17!important;' +
      '  font-size:clamp(34px, 3.8vw, 46px)!important;font-weight:700!important;margin:0 0 16px!important;' +
      '}' +
      '.demaze-capabilities-stage{position:relative!important;height:auto!important;min-height:auto!important;display:block!important;margin:0 auto!important;}' +
      '.demaze-capabilities-viewport{position:relative!important;top:0!important;height:auto!important;display:block!important;width:100%!important;}' +
      '.demaze-capabilities-row{display:grid!important;grid-template-columns:repeat(4,1fr)!important;gap:20px!important;width:100%!important;max-width:1320px!important;margin:0 auto!important;align-items:stretch!important;}' +
      '.demaze-capabilities-block{min-width:0;background:#ffffff!important;border:1px solid rgba(0,0,0,0.08)!important;' +
      'border-radius:24px!important;padding:32px 24px!important;text-align:left;display:flex;flex-direction:column;' +
      'box-shadow:0 8px 24px rgba(0,0,0,0.04)!important;opacity:1!important;transform:none!important;' +
      'transition:transform 0.25s ease, box-shadow 0.25s ease, border-color 0.25s ease!important;}' +
      '.demaze-capabilities-block:hover{transform:translateY(-4px)!important;box-shadow:0 18px 44px rgba(91,79,233,0.12)!important;border-color:rgba(91,79,233,0.3)!important;}' +
      '.demaze-capabilities-block-icon{width:48px;height:48px;margin:0 0 20px;border-radius:14px;' +
      'display:flex;align-items:center;justify-content:center;background:#F0EEFF;border:1px solid rgba(91,79,233,0.12);overflow:hidden;color:' + BRAND_BLUE + ';flex-shrink:0;}' +
      '.demaze-capabilities-block-icon svg{width:24px;height:24px;stroke-width:2;}' +
      '.demaze-capabilities-block h6{font-size:18px;font-weight:700;color:#0B0E17;margin:0 0 10px;line-height:1.3;}' +
      '.demaze-capabilities-block p{font-size:13.5px;line-height:1.6;color:' + MUTED + ';margin:0 0 18px;}' +
      '.demaze-capabilities-sublist{list-style:none;padding:0;margin:auto 0 0 0;display:flex;flex-direction:column;gap:8px;border-top:1px solid rgba(0,0,0,0.06);padding-top:16px;}' +
      '.demaze-capabilities-sublist li{font-size:12.5px;line-height:1.4;color:#3F4454;display:flex;align-items:center;gap:8px;}' +
      '.demaze-capabilities-explore{display:inline-flex;align-items:center;gap:6px;font-size:13.5px;font-weight:600;color:' + BRAND_BLUE + ';text-decoration:none;margin-top:16px;padding-top:14px;border-top:1px solid rgba(0,0,0,0.06);transition:transform 0.2s ease;}' +
      '.demaze-capabilities-explore:hover{transform:translateX(3px);}' +
      '@media (max-width:1080px){' +
      '  .demaze-capabilities-row{grid-template-columns:repeat(2,1fr)!important;gap:18px!important;}' +
      '}' +
      '@media (max-width:640px){' +
      '  .demaze-capabilities-row{grid-template-columns:1fr!important;}' +
      '  .demaze-capabilities-block{margin-bottom:16px;}' +
      '}';
    document.head.appendChild(style);
  }

  var PILLAR_ICONS = [
    // 1. AI & Machine Learning
    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83"></path><circle cx="12" cy="12" r="4"></circle></svg>',
    // 2. Web, Mobile App & SaaS
    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><rect x="2" y="3" width="20" height="14" rx="2" ry="2"></rect><line x1="8" y1="21" x2="16" y2="21"></line><line x1="12" y1="17" x2="12" y2="21"></line></svg>',
    // 3. Intelligent E-Commerce
    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><circle cx="9" cy="21" r="1"></circle><circle cx="20" cy="21" r="1"></circle><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path></svg>',
    // 4. Cloud Infrastructure
    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M17.5 19H9a7 7 0 1 1 6.71-9h1.79a4.5 4.5 0 1 1 0 9Z"></path></svg>'
  ];

  function checkSmallSvg() {
    return (
      '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="' + BRAND_BLUE + '" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">' +
      '<polyline points="20 6 9 17 4 12"></polyline>' +
      '</svg>'
    );
  }

  function blockHTML(item, i) {
    var iconHTML = PILLAR_ICONS[i % PILLAR_ICONS.length];
    var sublistHTML = item.subItems
      ? '<ul class="demaze-capabilities-sublist">' +
        item.subItems
          .slice(0, 4)
          .map(function (s) {
            return '<li>' + checkSmallSvg() + '<span>' + s + '</span></li>';
          })
          .join('') +
        '</ul>'
      : '';
    return (
      '<div class="demaze-capabilities-block">' +
      '<div class="demaze-capabilities-block-icon">' + iconHTML + '</div>' +
      '<h6>' + item.title + '</h6>' +
      '<p>' + item.description + '</p>' +
      sublistHTML +
      '<a href="./services" class="demaze-capabilities-explore">Explore &rarr;</a>' +
      '</div>'
    );
  }

  function getSection() {
    return document.querySelector('section.framer-1e6ypd3, section[data-framer-name="Tools"]:has([data-framer-name="Grid"]), section[data-framer-name="Tools"]');
  }

  function isHydrated(section) {
    var h2 = section.querySelector('h2');
    var cards = section.querySelectorAll('a[href="./feature-detail-page"]');
    return !!(h2 && h2.textContent.trim().length > 0 && cards.length > 0);
  }

  function applyOverride(section) {
    ensureStyle();

    var headlineContainer = section.querySelector('[data-framer-name="Headline Container"]');
    var h2 = section.querySelector('h2');
    var gradientSpan = h2 && h2.querySelector('span');
    if (gradientSpan) {
      gradientSpan.textContent = content.heading;
    } else if (h2) {
      h2.textContent = content.heading;
    }

    var titleWrapper = h2 && h2.closest('[data-framer-name="Title"]');
    if (headlineContainer && titleWrapper && !headlineContainer.querySelector('.' + EYEBROW_CLASS)) {
      var eyebrow = document.createElement('div');
      eyebrow.className = EYEBROW_CLASS;
      eyebrow.style.display = 'inline-flex';
      eyebrow.style.alignItems = 'center';
      eyebrow.style.background = '#f1f2fe';
      eyebrow.style.color = BRAND_BLUE;
      eyebrow.style.fontSize = '12.5px';
      eyebrow.style.fontWeight = '600';
      eyebrow.style.letterSpacing = '0.04em';
      eyebrow.style.padding = '5px 14px';
      eyebrow.style.borderRadius = '100px';
      eyebrow.style.margin = '0 auto 14px';
      eyebrow.textContent = content.eyebrow;
      headlineContainer.insertBefore(eyebrow, titleWrapper);
    }

    var subtitle = section.querySelector('[data-framer-name="Subtitle"]');
    if (subtitle) subtitle.style.display = 'none';

    var grid = section.querySelector('[data-framer-name="Grid"]');
    if (grid && !grid.classList.contains('demaze-capabilities-stage')) {
      grid.classList.add('demaze-capabilities-stage');
      grid.innerHTML =
        '<div class="demaze-capabilities-viewport">' +
        '<div class="demaze-capabilities-row">' +
        content.items.map(blockHTML).join('') +
        '</div>' +
        '</div>';
    }
  }

  function verifyStuck(section) {
    var h2 = section.querySelector('h2');
    var headingOk = !!(h2 && h2.textContent.trim() === content.heading);
    var blocks = section.querySelectorAll('.demaze-capabilities-block');
    return headingOk && blocks.length === content.items.length;
  }

  window.DemazeOverride.run({
    getRoot: getSection,
    isHydrated: isHydrated,
    apply: applyOverride,
    verify: verifyStuck,
  });
})();
