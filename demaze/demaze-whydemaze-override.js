/**
 * Post-hydration content override for the Why Demaze section (MOVIQ's
 * "Moviq vs Traditional Video" section: 3-column card grid + metrics).
 */
(function () {
  var content = window.DEMAZE_CONTENT && window.DEMAZE_CONTENT.whyDemaze;
  var metrics = window.DEMAZE_CONTENT && window.DEMAZE_CONTENT.metrics;
  if (!content || !window.DemazeOverride) return;

  var METRICS_CLASS = 'demaze-metrics-row';
  var EYEBROW_CLASS = 'demaze-whydemaze-eyebrow';
  var STYLE_ID = 'demaze-whydemaze-style';
  var BRAND_BLUE = '#5B4FE9';
  var MUTED = '#6B7080';
  var INK_TEXT = '#0B0E17';
  var LINE_COLOR = '#E7E7F3';

  var SVG_ICONS = [
    '<svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#5B4FE9" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83"></path><circle cx="12" cy="12" r="4"></circle></svg>',
    '<svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#5B4FE9" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m11 17 2 2a1 1 0 0 0 1.4 0l4.6-4.6a1 1 0 0 0 0-1.4l-2-2"></path><path d="m18 10 1-1a2 2 0 0 0 0-2.8l-1.2-1.2a2 2 0 0 0-2.8 0l-1 1"></path><path d="m2 14 6-6"></path><path d="m7 19 6-6"></path></svg>',
    '<svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#5B4FE9" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="22 7 13.5 15.5 8.5 10.5 2 17"></polyline><polyline points="16 7 22 7 22 13"></polyline></svg>'
  ];

  function ensureStyle() {
    if (document.getElementById(STYLE_ID)) return;
    var style = document.createElement('style');
    style.id = STYLE_ID;
    style.textContent =
      'section[data-framer-name="Why Demaze vs Traditional"], section[data-framer-name="Moviq vs Traditional Video"]{' +
      '  height:auto!important;min-height:auto!important;padding:70px 24px 80px!important;overflow:visible!important;' +
      '}' +
      'section[data-framer-name="Why Demaze vs Traditional"] [data-framer-name="Container"], section[data-framer-name="Moviq vs Traditional Video"] [data-framer-name="Container"]{' +
      '  height:auto!important;min-height:auto!important;overflow:visible!important;' +
      '}' +
      'section[data-framer-name="Why Demaze vs Traditional"] h2, section[data-framer-name="Moviq vs Traditional Video"] h2{' +
      '  font-size:clamp(34px, 3.8vw, 46px)!important;font-weight:700!important;color:#0B0E17!important;margin:0 0 32px!important;' +
      '}' +
      'section[data-framer-name="Moviq vs Traditional Video"] [data-framer-name="Table"],' +
      '.demaze-whydemaze-row{' +
      '  display:grid!important;grid-template-columns:repeat(3,1fr)!important;gap:28px!important;' +
      '  width:100%!important;max-width:1240px!important;margin:0 auto!important;padding:0!important;' +
      '  background:transparent!important;border:none!important;border-radius:0!important;' +
      '  box-shadow:none!important;overflow:visible!important;height:auto!important;min-height:auto!important;' +
      '  box-sizing:border-box!important;align-items:stretch!important;' +
      '}' +
      '.demaze-whydemaze-card{' +
      '  background:#ffffff!important;border:1px solid ' + LINE_COLOR + '!important;' +
      '  border-radius:24px!important;padding:36px 30px!important;display:flex!important;flex-direction:column!important;' +
      '  box-shadow:0 1px 3px rgba(11,14,23,0.03), 0 12px 32px -8px rgba(60,50,140,0.08)!important;' +
      '  box-sizing:border-box!important;align-self:stretch!important;transition:all 0.3s cubic-bezier(0.16,1,0.3,1)!important;' +
      '  overflow:visible!important;' +
      '}' +
      '.demaze-whydemaze-card:hover{transform:translateY(-4px)!important;box-shadow:0 24px 48px -12px rgba(60,50,140,0.18)!important;border-color:rgba(91,79,233,0.35)!important;}' +
      '.demaze-whydemaze-icon{width:52px;height:52px;border-radius:14px;background:#F0EEFF;border:1px solid rgba(91,79,233,0.15);' +
      '  display:flex;align-items:center;justify-content:center;margin-bottom:22px;flex-shrink:0;}' +
      '.demaze-whydemaze-card h6{font-size:22px;font-weight:600;color:' + INK_TEXT + ';margin:0 0 12px;line-height:1.3;letter-spacing:-0.01em;}' +
      '.demaze-whydemaze-card p{font-size:15px;line-height:1.65;color:#3F4454;margin:0;}' +
      '@media (max-width:809px){.demaze-whydemaze-row{grid-template-columns:1fr!important;}}' +
      '.demaze-metrics-row{display:grid!important;grid-template-columns:repeat(4,1fr)!important;gap:0!important;' +
      '  width:100%!important;max-width:1200px!important;margin:52px auto 0!important;padding:44px 0 0!important;border-top:1px solid ' + LINE_COLOR + '!important;}' +
      '.demaze-metric{text-align:center;padding:0 24px;}' +
      '.demaze-metric:not(:last-child){border-right:1px solid ' + LINE_COLOR + ';}' +
      '.demaze-metric-value{font-size:clamp(38px,4.5vw,56px);font-weight:700;color:' + BRAND_BLUE + ';line-height:1.1;letter-spacing:-0.03em;font-variant-numeric:tabular-nums;}' +
      '.demaze-metric-label{font-size:14px;color:' + MUTED + ';margin-top:10px;font-weight:500;}' +
      '@media (max-width:809px){.demaze-metrics-row{grid-template-columns:repeat(2,1fr)!important;gap:36px 16px!important;}.demaze-metric:not(:last-child){border-right:none;}}';
    document.head.appendChild(style);
  }

  function metricHTML(item) {
    return (
      '<div class="demaze-metric">' +
      '<div class="demaze-metric-value">' + item.value + '</div>' +
      '<div class="demaze-metric-label">' + item.label + '</div>' +
      '</div>'
    );
  }

  function cardHTML(item, i) {
    var iconHTML = '<div class="demaze-whydemaze-icon">' + SVG_ICONS[i % SVG_ICONS.length] + '</div>';
    return (
      '<div class="demaze-whydemaze-card">' +
      iconHTML +
      '<h6>' + item.title + '</h6>' +
      '<p>' + item.description + '</p>' +
      '</div>'
    );
  }

  function getSection() {
    return document.querySelector('section[data-framer-name="Why Demaze vs Traditional"]') ||
           document.querySelector('section[data-framer-name="Moviq vs Traditional Video"]');
  }

  function getTable(section) {
    return section.querySelector('[data-framer-name="Table"]');
  }

  function isHydrated(section) {
    var h2 = section.querySelector('h2');
    var table = getTable(section);
    return !!(h2 && h2.textContent.trim().length > 0 && table);
  }

  function applyOverride(section) {
    ensureStyle();

    var headlineContainer = section.querySelector('[data-framer-name="Headline Container"]');
    var h2 = section.querySelector('h2');
    if (h2) {
      var span = h2.querySelector('span');
      (span || h2).textContent = content.heading;
    }

    var titleWrapper = h2 && h2.closest('[data-framer-name="Title"]');
    if (headlineContainer && titleWrapper && !headlineContainer.querySelector('.' + EYEBROW_CLASS)) {
      var eyebrow = document.createElement('div');
      eyebrow.className = EYEBROW_CLASS;
      eyebrow.style.cssText =
        'display:inline-flex;align-items:center;background:#F0EEFF;color:' +
        BRAND_BLUE +
        ';font-size:12.5px;font-weight:600;letter-spacing:0.1em;text-transform:uppercase;padding:6px 16px;border-radius:999px;margin:0 auto 16px;border:1px solid ' +
        LINE_COLOR +
        ';';
      eyebrow.textContent = content.eyebrow;
      headlineContainer.insertBefore(eyebrow, titleWrapper);
    }

    var subtitles = headlineContainer ? headlineContainer.querySelectorAll('[data-framer-name="Title"]') : [];
    if (subtitles.length > 1) subtitles[1].style.display = 'none';

    var table = getTable(section);
    if (table && !table.classList.contains('demaze-whydemaze-row')) {
      table.classList.add('demaze-whydemaze-row');
      table.innerHTML = content.items.map(cardHTML).join('');
    }

    if (metrics && metrics.items && !section.querySelector('.' + METRICS_CLASS)) {
      var mRow = document.createElement('div');
      mRow.className = METRICS_CLASS;
      mRow.innerHTML = metrics.items.map(metricHTML).join('');
      if (table) {
        table.insertAdjacentElement('afterend', mRow);
      } else {
        section.appendChild(mRow);
      }
    }
  }

  function verifyStuck(section) {
    var h2 = section.querySelector('h2');
    var headingOk = !!(h2 && h2.textContent.trim() === content.heading);
    var cards = section.querySelectorAll('.demaze-whydemaze-card');
    var metricsOk = !metrics || !!section.querySelector('.' + METRICS_CLASS);
    return headingOk && cards.length === content.items.length && metricsOk;
  }

  window.DemazeOverride.run({
    getRoot: getSection,
    isHydrated: isHydrated,
    apply: applyOverride,
    verify: verifyStuck,
  });
})();
