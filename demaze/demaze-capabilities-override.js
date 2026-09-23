/**
 * Core Capabilities (MOVIQ's first "Tools" section).
 * Four verified service pillars as an open 2x2 editorial grid. How We Work is
 * mounted after it inside this same section (demaze-process-override.js) so the
 * DOM reading order matches the visual order.
 */
(function () {
  var data = window.DEMAZE_CONTENT && window.DEMAZE_CONTENT.coreCapabilities;
  if (!data || !window.DemazeOverride) return;

  var BLOCK = 'dz-caps';

  function ensureStyle() {
    if (document.getElementById('demaze-capabilities-style')) return;
    var s = document.createElement('style');
    s.id = 'demaze-capabilities-style';
    s.textContent = [
      'section.framer-1e6ypd3,section[data-framer-name="Tools"]:has([data-framer-name="Grid"]){display:block!important;height:auto!important;min-height:0!important;padding:0!important;margin:0!important;background:var(--dz-paper)!important;overflow:visible!important;}',
      'section.framer-1e6ypd3 > :not(.dz-caps):not(.dz-process),section[data-framer-name="Tools"]:has([data-framer-name="Grid"]) > :not(.dz-caps):not(.dz-process){display:none!important;}',
      '.dz-caps{padding-top:var(--dz-section-y);padding-bottom:var(--dz-section-y);}',
      '.dz-caps-head{display:flex;align-items:flex-end;justify-content:space-between;gap:32px;margin-bottom:var(--dz-head-gap);}',
      '.dz-caps-head .dz-lead{max-width:52ch;}',
      '.dz-caps-grid{margin:0;padding:0;list-style:none;display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:56px 64px;}',
      '.dz-cap{border-top:1px solid var(--dz-line);padding-top:28px;display:grid;grid-template-columns:40px 1fr;column-gap:20px;}',
      '.dz-cap-icon{width:40px;height:40px;border-radius:10px;background:var(--dz-accent-soft);color:var(--dz-accent);display:grid;place-items:center;}',
      '.dz-cap-icon svg{width:20px;height:20px;}',
      '.dz-cap h3{margin:8px 0 10px;font:600 var(--dz-h3)/1.25 var(--dz-font-display);letter-spacing:-0.01em;color:var(--dz-ink);}',
      '.dz-cap p{margin:0 0 20px;font:400 15px/1.6 var(--dz-font-text);color:var(--dz-ink-2);max-width:52ch;}',
      '.dz-cap ul{margin:0;padding:0;list-style:none;display:grid;grid-template-columns:1fr 1fr;gap:10px 24px;}',
      '.dz-cap li{position:relative;padding-left:16px;font:400 14px/1.45 var(--dz-font-text);color:var(--dz-ink-3);}',
      '.dz-cap li::before{content:"";position:absolute;left:0;top:.62em;width:6px;height:1px;background:var(--dz-ink-3);}',
      '@media (max-width: 960px){.dz-caps-grid{grid-template-columns:1fr;gap:48px;}}',
      '@media (max-width: 640px){.dz-caps-head{flex-direction:column;align-items:flex-start;gap:24px;}.dz-cap{grid-template-columns:1fr;row-gap:16px;}.dz-cap h3{margin-top:0;}.dz-cap ul{grid-template-columns:1fr;}}'
    ].join('');
    document.head.appendChild(s);
  }

  function build() {
    var el = document.createElement('div');
    el.className = BLOCK + ' dz-container';
    el.innerHTML =
      '<div class="dz-caps-head">' +
      '  <div><span class="dz-eyebrow">' + data.eyebrow + '</span><h2 class="dz-h2">' + data.heading + '</h2><p class="dz-lead">' + data.subtitle + '</p></div>' +
      '  <a class="dz-link" href="' + data.cardHref + '">Explore services</a>' +
      '</div>' +
      '<ul class="dz-caps-grid">' +
      data.items.map(function (c, i) {
        return '<li class="dz-cap" data-dz-reveal="' + (i % 2) * 70 + '">' +
          '<span class="dz-cap-icon" aria-hidden="true">' + c.icon + '</span>' +
          '<div><h3>' + c.title + '</h3><p>' + c.description + '</p>' +
          '<ul>' + c.chips.map(function (x) { return '<li>' + x + '</li>'; }).join('') + '</ul></div>' +
          '</li>';
      }).join('') +
      '</ul>';
    return el;
  }

  function getSection() {
    return document.querySelector('section.framer-1e6ypd3, section[data-framer-name="Tools"]:has([data-framer-name="Grid"])');
  }

  function apply(section) {
    ensureStyle();
    if (section.querySelector('.' + BLOCK)) return;
    var el = build();
    section.insertBefore(el, section.querySelector('.dz-process'));
    window.DemazeOverride.reveal(el);
  }

  window.DemazeOverride.run({
    getRoot: getSection,
    isHydrated: function (s) { return !!s; },
    apply: apply,
    verify: function (s) { return !!(s && s.querySelectorAll('.dz-cap').length === 4); }
  });
})();
