/**
 * How We Work (MOVIQ "Videos making Step" section).
 * The four verified delivery phases as an open, numbered editorial sequence.
 */
(function () {
  var data = window.DEMAZE_CONTENT && window.DEMAZE_CONTENT.process;
  if (!data || !window.DemazeOverride) return;

  var BLOCK = 'dz-process';

  function ensureStyle() {
    if (document.getElementById('demaze-process-style')) return;
    var s = document.createElement('style');
    s.id = 'demaze-process-style';
    s.textContent = [
      '.dz-process-band{background:var(--dz-paper-2);padding:var(--dz-section-y) 0;}',
      '.dz-process-head{display:grid;grid-template-columns:minmax(0,7fr) minmax(0,5fr);gap:32px 64px;align-items:end;margin-bottom:var(--dz-head-gap);}',
      '.dz-process-head .dz-lead{margin:0;}',
      '.dz-steps{margin:0;padding:0;list-style:none;display:grid;grid-template-columns:repeat(4,minmax(0,1fr));column-gap:32px;row-gap:0;}',
      '.dz-step{border-top:1px solid var(--dz-line);padding-top:24px;position:relative;display:grid;grid-row:span 4;grid-template-rows:subgrid;align-content:start;}',
      '.dz-step::before{content:"";position:absolute;left:0;top:-1px;width:32px;height:2px;background:var(--dz-accent);}',
      '.dz-step-num{display:block;margin-bottom:28px;font:500 13px/1 var(--dz-font-mono);color:var(--dz-accent);}',
      '.dz-step h3{margin:0 0 12px;font:600 var(--dz-h3)/1.25 var(--dz-font-display);letter-spacing:-0.01em;color:var(--dz-ink);}',
      '.dz-step p{margin:0 0 24px;font:400 15px/1.6 var(--dz-font-text);color:var(--dz-ink-2);}',
      '.dz-step ul{margin:0;padding:0;list-style:none;}',
      '.dz-step li{padding:9px 0;border-top:1px solid var(--dz-line-soft);font:400 14px/1.45 var(--dz-font-text);color:var(--dz-ink-3);}',
      '@media (max-width: 1080px){.dz-steps{grid-template-columns:repeat(2,minmax(0,1fr));column-gap:40px;}.dz-step:nth-child(n+3){margin-top:56px;}}',
      '@media (max-width: 760px){.dz-process-head{grid-template-columns:1fr;gap:0;}.dz-process-head .dz-lead{margin-top:16px;}}',
      '@media (max-width: 600px){.dz-steps{grid-template-columns:1fr;}.dz-step{display:block;}.dz-step + .dz-step{margin-top:40px;}.dz-step-num{margin-bottom:16px;}}'
    ].join('');
    document.head.appendChild(s);
  }

  function build() {
    var el = document.createElement('div');
    el.className = BLOCK + ' dz-process-band';
    el.innerHTML = '<div class="dz-container">' +
      '<div class="dz-process-head">' +
      '  <div><span class="dz-eyebrow">' + data.eyebrow + '</span><h2 class="dz-h2">' + data.heading + '</h2></div>' +
      '  <p class="dz-lead">' + data.subtitle + '</p>' +
      '</div>' +
      '<ol class="dz-steps">' +
      data.steps.map(function (st, i) {
        return '<li class="dz-step" data-dz-reveal="' + i * 70 + '">' +
          '<span class="dz-step-num">' + st.id + '</span>' +
          '<h3>' + st.title + '</h3>' +
          '<p>' + st.description + '</p>' +
          '<ul>' + st.deliverables.map(function (d) { return '<li>' + d + '</li>'; }).join('') + '</ul>' +
          '</li>';
      }).join('') +
      '</ol></div>';
    return el;
  }

  // Mounted inside the Core Capabilities section so DOM order matches visual order.
  function getSection() { return document.querySelector('section.framer-1e6ypd3, section[data-framer-name="Tools"]:has([data-framer-name="Grid"])'); }

  function apply(section) {
    ensureStyle();
    if (section.querySelector('.' + BLOCK)) return;
    var el = build();
    section.appendChild(el);
    window.DemazeOverride.reveal(el);
  }

  window.DemazeOverride.run({
    getRoot: getSection,
    isHydrated: function (s) { return !!s; },
    apply: apply,
    verify: function (s) { return !!(s && s.querySelectorAll('.dz-step').length === 4); }
  });
})();
