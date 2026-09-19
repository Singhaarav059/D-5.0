/**
 * Post-hydration content override for the Why Demaze section (MOVIQ's
 * "Moviq vs Traditional Video" section: a 3-column comparison table —
 * category labels, "Riveup" (MOVIQ's own product) checklist, and a
 * "Traditional Video Production" competitor checklist).
 *
 * Demaze has no competitor-comparison content. Their real equivalent
 * (demazetech.com homepage -> "BENEFITS: Why Choose Us", just after
 * Industries) is 3 full cards — icon, bold title, real paragraph — not a
 * checklist. MOVIQ's checkmark-row format only fits one short line per row,
 * which flattened that real content into a single truncated line, so this
 * replaces the whole comparison table with 3 cards matching Demaze's own
 * presentation instead of squeezing the content into MOVIQ's row shape.
 *
 * See demaze-override-core.js for why this waits/mutates/rechecks the way it does.
 */
(function () {
  var content = window.DEMAZE_CONTENT && window.DEMAZE_CONTENT.whyDemaze;
  var metrics = window.DEMAZE_CONTENT && window.DEMAZE_CONTENT.metrics;
  if (!content || !window.DemazeOverride) return;

  var METRICS_CLASS = 'demaze-metrics-row';

  var EYEBROW_CLASS = 'demaze-whydemaze-eyebrow';
  var STYLE_ID = 'demaze-whydemaze-style';
  var BRAND_BLUE = '#5B5FEF';
  var MUTED = 'rgb(108, 119, 131)';

  var ICONS = [
    'https://api.iconify.design/lucide/cpu.svg?color=%235B5FEF',
    'https://api.iconify.design/lucide/handshake.svg?color=%235B5FEF',
    'https://api.iconify.design/lucide/trending-up.svg?color=%235B5FEF',
  ];

  function ensureStyle() {
    if (document.getElementById(STYLE_ID)) return;
    var style = document.createElement('style');
    style.id = STYLE_ID;
    style.textContent =
      '.demaze-whydemaze-row{display:flex!important;flex-direction:row!important;gap:24px!important;' +
      'width:100%!important;flex-wrap:wrap;background:transparent!important;padding:0!important;border:none!important;}' +
      '.demaze-whydemaze-card{flex:1 1 260px;min-width:240px;background:#fff;border:1px solid rgba(0,0,0,0.06);' +
      'border-radius:24px;padding:32px;display:flex;flex-direction:column;}' +
      '.demaze-whydemaze-icon{width:48px;height:48px;border-radius:100px;background:#f1f2fe;' +
      'display:flex;align-items:center;justify-content:center;margin-bottom:20px;}' +
      '.demaze-whydemaze-art{width:100%;height:150px;object-fit:contain;margin-bottom:20px;display:block;}' +
      '.demaze-whydemaze-card h6{font-size:18px;font-weight:600;color:rgb(0,0,0);margin:0 0 12px;}' +
      '.demaze-whydemaze-card p{font-size:14px;line-height:1.6;color:' + MUTED + ';margin:0;}' +
      '@media (max-width:809px){.demaze-whydemaze-row{flex-direction:column!important;}}' +
      '.demaze-metrics-row{display:flex!important;flex-direction:row!important;gap:24px;flex-wrap:wrap;' +
      'width:100%;justify-content:space-between;margin-top:40px;padding-top:40px;border-top:1px solid rgba(0,0,0,0.08);}' +
      '.demaze-metric{flex:1 1 140px;text-align:center;}' +
      '.demaze-metric-value{font-size:clamp(28px,3.4vw,40px);font-weight:700;color:' + BRAND_BLUE + ';line-height:1.1;}' +
      '.demaze-metric-label{font-size:13px;color:' + MUTED + ';margin-top:6px;}';
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
    var iconHTML = item.image
      ? '<img class="demaze-whydemaze-art" src="' + item.image + '" alt="' + item.title + '">'
      : '<div class="demaze-whydemaze-icon"><img src="' + ICONS[i % ICONS.length] + '" width="22" height="22" alt=""></div>';
    return (
      '<div class="demaze-whydemaze-card">' +
      iconHTML +
      '<h6>' + item.title + '</h6>' +
      '<p>' + item.description + '</p>' +
      '</div>'
    );
  }

  function getSection() {
    return document.querySelector('section[data-framer-name="Moviq vs Traditional Video"]');
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

    // Heading. The gradient effect lives on an inner <span data-text-fill>,
    // so update that span's text in place — replacing h2's own textContent
    // would delete the span and lose the gradient-clip styling with it.
    var headlineContainer = section.querySelector('[data-framer-name="Headline Container"]');
    var h2 = section.querySelector('h2');
    var gradientSpan = h2 && h2.querySelector('span');
    if (gradientSpan) {
      gradientSpan.textContent = content.heading;
    } else if (h2) {
      h2.textContent = content.heading;
    }

    // Eyebrow — MOVIQ has no badge slot here, so add one above the heading,
    // matching the small pill treatment used elsewhere on this page.
    var titleWrapper = h2 && h2.closest('[data-framer-name="Title"]');
    if (headlineContainer && titleWrapper && !headlineContainer.querySelector('.' + EYEBROW_CLASS)) {
      var eyebrow = document.createElement('div');
      eyebrow.className = EYEBROW_CLASS;
      eyebrow.style.display = 'inline-flex';
      eyebrow.style.alignItems = 'center';
      eyebrow.style.background = '#f1f2fe';
      eyebrow.style.color = BRAND_BLUE;
      eyebrow.style.fontSize = '13px';
      eyebrow.style.fontWeight = '600';
      eyebrow.style.letterSpacing = '0.02em';
      eyebrow.style.padding = '6px 14px';
      eyebrow.style.borderRadius = '100px';
      eyebrow.style.margin = '0 auto 16px';
      eyebrow.textContent = content.eyebrow;
      headlineContainer.insertBefore(eyebrow, titleWrapper);
    }

    // Subtitle has no Demaze equivalent copy for this heading — hide, don't
    // remove, so React still owns the node.
    var subtitles = headlineContainer ? headlineContainer.querySelectorAll('[data-framer-name="Title"]') : [];
    if (subtitles.length > 1) subtitles[1].style.display = 'none';

    // Replace the whole comparison table (category labels + us column +
    // competitor column) with 3 cards matching Demaze's real presentation.
    var table = getTable(section);
    if (table && !table.classList.contains('demaze-whydemaze-row')) {
      table.classList.add('demaze-whydemaze-row');
      table.innerHTML = content.items.map(cardHTML).join('');
    }

    // Metrics: extends this same custom-built section with a stat row
    // rather than a separate MOVIQ slot, per the approved "Why Demaze +
    // Metrics" combined composition.
    if (metrics && table && !section.querySelector('.' + METRICS_CLASS)) {
      var row = document.createElement('div');
      row.className = METRICS_CLASS;
      row.innerHTML = metrics.items.map(metricHTML).join('');
      table.insertAdjacentElement('afterend', row);
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
