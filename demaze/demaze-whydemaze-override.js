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
      'section[data-framer-name="Moviq vs Traditional Video"],section[data-framer-name="Why Demaze vs Traditional"]{display:block!important;height:auto!important;min-height:0!important;padding:var(--dz-section-y) 0!important;margin:0!important;background:var(--dz-paper)!important;overflow:visible!important;}',
      'section[data-framer-name="Moviq vs Traditional Video"] > :not(.dz-about),section[data-framer-name="Why Demaze vs Traditional"] > :not(.dz-about){display:none!important;}',
      '.dz-about-top{display:grid;grid-template-columns:minmax(0,6fr) minmax(0,6fr);gap:32px clamp(40px,6vw,96px);align-items:start;}',
      '.dz-about-copy p{margin:0 0 16px;font:400 var(--dz-lead)/1.65 var(--dz-font-text);color:var(--dz-ink-2);max-width:58ch;}',
      '.dz-about-copy p:first-child{color:var(--dz-ink);}',
      '.dz-metrics{margin:var(--dz-head-gap) 0 0;padding:0;list-style:none;display:grid;grid-template-columns:repeat(4,minmax(0,1fr));border-top:1px solid var(--dz-line);}',
      '.dz-metric{padding:28px 24px 0 0;}',
      '.dz-metric + .dz-metric{padding-left:24px;border-left:1px solid var(--dz-line);}',
      '.dz-metric-value{display:block;font:600 clamp(36px,4vw,52px)/1 var(--dz-font-display);letter-spacing:-0.01em;color:var(--dz-ink);font-variant-numeric:tabular-nums;}',
      '.dz-metric-label{display:block;margin-top:10px;font:400 14px/1.4 var(--dz-font-text);color:var(--dz-ink-3);}',
      '.dz-founder{margin:clamp(64px,8vw,112px) 0 0;display:grid;grid-template-columns:auto minmax(0,1fr);gap:clamp(28px,4vw,56px);align-items:center;}',
      '.dz-founder img{width:clamp(120px,14vw,180px);aspect-ratio:895/980;height:auto;object-fit:cover;border-radius:var(--dz-radius);display:block;background:var(--dz-paper-2);}',
      '.dz-founder blockquote{margin:0;}',
      '.dz-founder blockquote p{margin:0;max-width:34ch;font:500 clamp(22px,2.3vw,30px)/1.3 var(--dz-font-display)!important;letter-spacing:-0.005em;color:var(--dz-ink);text-wrap:pretty;}',
      '.dz-founder figcaption{margin-top:20px;font:400 15px/1.4 var(--dz-font-text);color:var(--dz-ink-3);}',
      '.dz-founder figcaption strong{display:block;font-weight:600;color:var(--dz-ink);}',
      '@media (max-width: 900px){.dz-about-top{grid-template-columns:1fr;}.dz-metrics{grid-template-columns:1fr 1fr;}.dz-metric:nth-child(3){padding-left:0;border-left:0;}.dz-metric:nth-child(n+3){margin-top:28px;border-top:1px solid var(--dz-line);}}',
      '@media (max-width: 600px){.dz-founder{grid-template-columns:1fr;gap:24px;}.dz-founder img{width:112px;}}'
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
