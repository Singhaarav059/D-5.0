/**
 * About Demaze (MOVIQ's "Moviq vs Traditional Video" section).
 * Verified positioning copy, the four company metrics from demazetech.com, and
 * the founder's quote. Consolidates the old Who We Are / Why Choose Us content.
 */
(function () {
  var C = window.DEMAZE_CONTENT || {};
  var metrics = C.metrics && C.metrics.items;
  var t = C.testimonial;
  if (!window.DemazeOverride || !metrics || !t) return;

  var BLOCK = 'dz-about';
  var SECTION = 'section[data-framer-name="Moviq vs Traditional Video"], section[data-framer-name="Why Demaze vs Traditional"]';

  var COPY = [
    'Demaze Technologies is an engineering team of 35+ technologists and developers. We partner with growing companies to turn complex ideas into robust, production-ready digital products.',
    'We work directly alongside your internal team to design architecture, develop core features, and integrate software into your daily operations.',
    'Every engagement is led by senior engineers. You retain 100% code ownership from day one, with full visibility into every deliverable.'
  ];

  function ensureStyle() {
    if (document.getElementById('demaze-about-style')) return;
    var s = document.createElement('style');
    s.id = 'demaze-about-style';
    s.textContent = [
      "section[data-framer-name=\"Moviq vs Traditional Video\"],section[data-framer-name=\"Why Demaze vs Traditional\"]{display:block!important;height:auto!important;min-height:0!important;padding:var(--dz-section-y) 0!important;margin:0!important;background:var(--dz-paper)!important;overflow:visible!important;}",
      "section[data-framer-name=\"Moviq vs Traditional Video\"] > :not(.dz-about),section[data-framer-name=\"Why Demaze vs Traditional\"] > :not(.dz-about){display:none!important;}"
    ].join('');
    document.head.appendChild(s);
  }

  function build() {
    var el = document.createElement('div');
    el.className = BLOCK + ' dz-container';
    el.innerHTML =
      '<div class="dz-about-top">' +
      '  <div><span class="dz-eyebrow">About Demaze</span><h2 class="dz-h2">A senior engineering team that works inside yours</h2></div>' +
      '  <div class="dz-about-copy">' + COPY.map(function (p) { return '<p>' + p + '</p>'; }).join('') + '</div>' +
      '</div>' +
      '<ul class="dz-metrics">' + metrics.map(function (m, i) {
        return '<li class="dz-metric" data-dz-reveal="' + i * 60 + '"><span class="dz-metric-value">' + m.value + '</span><span class="dz-metric-label">' + m.label + '</span></li>';
      }).join('') + '</ul>' +
      '<figure class="dz-founder">' +
      '  <img src="./assets/demaze/krupal_chaudhary.jpg" alt="' + t.name + '" width="180" height="197" loading="lazy" decoding="async">' +
      '  <div><blockquote><p>“' + t.quote.replace(' - ', ', ') + '”</p></blockquote>' +
      '  <figcaption><strong>' + t.name + '</strong>' + t.title + ', Demaze Technologies</figcaption></div>' +
      '</figure>';
    return el;
  }

  function apply(section) {
    ensureStyle();
    if (section.querySelector('.' + BLOCK)) return;
    var el = build();
    section.appendChild(el);
    window.DemazeOverride.reveal(el);
  }

  window.DemazeOverride.run({
    getRoot: function () { return document.querySelector(SECTION); },
    isHydrated: function (s) { return !!s; },
    apply: apply,
    verify: function (s) { return !!(s && s.querySelector('.dz-founder')); }
  });
})();
