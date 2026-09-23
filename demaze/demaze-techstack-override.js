/**
 * Engineering Stack (MOVIQ "Badge" section).
 * One composition: the verified 8-technology stack as a grouped list, beside an
 * abstract orbital map of the same technologies. Hovering either side highlights
 * the matching item on the other. The orbit is decorative (aria-hidden); the list
 * is the accessible content.
 */
(function () {
  var C = window.DEMAZE_CONTENT || {};
  var sys = C.engineeringSystems;
  if (!sys || !window.DemazeOverride) return;

  var BLOCK = 'dz-stack';
  var GROUPS = ['AI Models', 'Orchestration', 'Data & ML', 'Streaming & Search'];
  var LOGO = 'https://framerusercontent.com/images/g9sZPcgZ3bVZQgiCX8DybKWIy4.png?scale-down-to=512';

  function ensureStyle() {
    if (document.getElementById('demaze-techstack-style')) return;
    var s = document.createElement('style');
    s.id = 'demaze-techstack-style';
    s.textContent = [
      'section[data-framer-name="Badge"]{height:auto!important;min-height:0!important;padding:var(--dz-section-y) 0!important;margin:0!important;background:var(--dz-paper)!important;border-radius:0!important;box-shadow:none!important;position:relative!important;z-index:1!important;}',
      'section[data-framer-name="Badge"] [data-framer-name="Container"]{display:block!important;width:100%!important;max-width:none!important;height:auto!important;padding:0!important;margin:0!important;}',
      'section[data-framer-name="Badge"] [data-framer-name="Container"] > :not(.' + BLOCK + '){display:none!important;}',

      '.' + BLOCK + '{display:grid;grid-template-columns:minmax(0,5fr) minmax(0,6fr);gap:clamp(40px,6vw,96px);align-items:center;}',
      '.dz-stack-groups{margin:40px 0 0;padding:0;list-style:none;display:grid;grid-template-columns:1fr 1fr;gap:28px 32px;}',
      '.dz-stack-group h3{margin:0 0 10px;padding-bottom:10px;border-bottom:1px solid var(--dz-line);font:500 12px/1.2 var(--dz-font-mono);letter-spacing:.04em;text-transform:uppercase;color:var(--dz-ink-3);}',
      '.dz-stack-group ul{margin:0;padding:0;list-style:none;}',
      '.dz-stack-item{display:grid;grid-template-columns:24px 1fr;column-gap:12px;align-items:center;padding:8px 0;border-radius:8px;transition:opacity var(--dz-fast) ease;}',
      '.dz-stack-item img{width:22px;height:22px;object-fit:contain;grid-row:span 2;}',
      '.dz-stack-name{font:500 15px/1.3 var(--dz-font-text);color:var(--dz-ink);}',
      '.dz-stack-role{font:400 13px/1.35 var(--dz-font-text);color:var(--dz-ink-3);}',
      '.dz-stack.has-focus .dz-stack-item:not(.is-active){opacity:.4;}',

      '.dz-orbit{position:relative;width:100%;max-width:520px;aspect-ratio:1;margin:0 auto;}',
      '.dz-orbit::before{content:"";position:absolute;inset:-12%;background:radial-gradient(closest-side,var(--dz-sky),rgba(234,242,251,0) 72%);z-index:0;}',
      '.dz-orbit-ring{position:absolute;left:50%;top:50%;border-radius:50%;border:1px solid var(--dz-line);transform:translate(-50%,-50%);}',
      '.dz-orbit-ring--inner{width:56%;height:56%;}',
      '.dz-orbit-ring--outer{width:92%;height:92%;border-style:dashed;border-color:#d9dee7;}',
      '.dz-orbit-track{position:absolute;inset:0;animation:dzSpin 140s linear infinite;}',
      '.dz-orbit-track--outer{animation-duration:190s;animation-direction:reverse;}',
      '.dz-orbit-node{position:absolute;width:52px;height:52px;margin:-26px 0 0 -26px;border-radius:50%;background:var(--dz-paper);border:1px solid var(--dz-line);box-shadow:var(--dz-shadow);display:grid;place-items:center;transition:transform var(--dz-base) var(--dz-ease-out),border-color var(--dz-fast) ease,opacity var(--dz-fast) ease;}',
      '.dz-orbit-node span{display:grid;place-items:center;width:100%;height:100%;animation:dzSpin 140s linear infinite reverse;}',
      '.dz-orbit-track--outer .dz-orbit-node span{animation:dzSpin 190s linear infinite;}',
      '.dz-orbit-node img{width:26px;height:26px;object-fit:contain;}',
      '.dz-stack.has-focus .dz-orbit-node:not(.is-active){opacity:.35;}',
      '.dz-orbit-node.is-active{border-color:var(--dz-accent);transform:scale(1.12);}',
      '.dz-orbit-core{position:absolute;left:50%;top:50%;width:112px;height:112px;transform:translate(-50%,-50%);border-radius:50%;background:var(--dz-paper);border:1px solid var(--dz-line);box-shadow:var(--dz-shadow);display:grid;place-items:center;z-index:2;}',
      '.dz-orbit-core img{width:78px;height:auto;}',
      '.dz-stack.is-paused .dz-orbit-track,.dz-stack.is-paused .dz-orbit-node span,.dz-stack.has-focus .dz-orbit-track,.dz-stack.has-focus .dz-orbit-node span{animation-play-state:paused;}',
      '@keyframes dzSpin{to{transform:rotate(360deg);}}',
      '@media (prefers-reduced-motion: reduce){.dz-orbit-track,.dz-orbit-node span{animation:none!important;}}',

      '@media (max-width: 960px){',
      '  .' + BLOCK + '{grid-template-columns:1fr;gap:48px;}',
      '  .dz-orbit{max-width:400px;order:2;}',
      '}',
      '@media (max-width: 540px){',
      '  .dz-stack-groups{grid-template-columns:1fr 1fr;gap:24px 20px;}',
      '  .dz-orbit{max-width:320px;}',
      '  .dz-orbit-node{width:42px;height:42px;margin:-21px 0 0 -21px;}',
      '  .dz-orbit-node img{width:21px;height:21px;}',
      '  .dz-orbit-core{width:84px;height:84px;}',
      '  .dz-orbit-core img{width:58px;}',
      '}'
    ].join('');
    document.head.appendChild(s);
  }

  function nodeHTML(t, i, count, radiusPct) {
    var a = (-90 + (360 / count) * i + (radiusPct > 40 ? 45 : 0)) * Math.PI / 180;
    var left = (50 + Math.cos(a) * radiusPct).toFixed(2);
    var top = (50 + Math.sin(a) * radiusPct).toFixed(2);
    return '<div class="dz-orbit-node" data-tech="' + t.id + '" style="left:' + left + '%;top:' + top + '%"><span><img src="' + t.icon + '" alt="" loading="lazy" decoding="async" width="26" height="26"></span></div>';
  }

  function build() {
    var techs = sys.technologies;
    var inner = techs.filter(function (t) { return t.orbit === 'inner'; });
    var outer = techs.filter(function (t) { return t.orbit === 'outer'; });

    var groups = GROUPS.map(function (g) {
      var items = techs.filter(function (t) { return t.layer === g; }).map(function (t) {
        return '<li class="dz-stack-item" data-tech="' + t.id + '"><img src="' + t.icon + '" alt="" loading="lazy" decoding="async" width="22" height="22"><span class="dz-stack-name">' + t.name + '</span><span class="dz-stack-role">' + t.role + '</span></li>';
      }).join('');
      return '<li class="dz-stack-group"><h3 data-dz-font>' + g + '</h3><ul>' + items + '</ul></li>';
    }).join('');

    var el = document.createElement('div');
    el.className = BLOCK + ' dz-container';
    el.innerHTML =
      '<div class="dz-stack-copy">' +
      '  <span class="dz-eyebrow">' + sys.eyebrow + '</span>' +
      '  <h2 class="dz-h2">' + sys.heading + '</h2>' +
      '  <p class="dz-lead">' + sys.subtitle + '</p>' +
      '  <ul class="dz-stack-groups">' + groups + '</ul>' +
      '</div>' +
      '<div class="dz-orbit" aria-hidden="true">' +
      '  <div class="dz-orbit-ring dz-orbit-ring--outer"></div>' +
      '  <div class="dz-orbit-ring dz-orbit-ring--inner"></div>' +
      '  <div class="dz-orbit-track">' + inner.map(function (t, i) { return nodeHTML(t, i, inner.length, 28); }).join('') + '</div>' +
      '  <div class="dz-orbit-track dz-orbit-track--outer">' + outer.map(function (t, i) { return nodeHTML(t, i, outer.length, 46); }).join('') + '</div>' +
      '  <div class="dz-orbit-core"><img src="' + LOGO + '" alt="" width="78" height="24"></div>' +
      '</div>';
    return el;
  }

  function wire(el) {
    var parts = el.querySelectorAll('[data-tech]');
    function focus(id) {
      el.classList.toggle('has-focus', !!id);
      parts.forEach(function (p) { p.classList.toggle('is-active', p.getAttribute('data-tech') === id); });
    }
    parts.forEach(function (p) {
      p.addEventListener('pointerenter', function () { focus(p.getAttribute('data-tech')); });
      p.addEventListener('pointerleave', function () { focus(null); });
    });
    if ('IntersectionObserver' in window) {
      new IntersectionObserver(function (e) {
        el.classList.toggle('is-paused', !e[0].isIntersecting);
      }).observe(el);
    }
  }

  function getSection() { return document.querySelector('section[data-framer-name="Badge"]'); }

  function apply(section) {
    ensureStyle();
    var container = section.querySelector('[data-framer-name="Container"]') || section;
    if (container.querySelector('.' + BLOCK)) return;
    var el = build();
    container.appendChild(el);
    wire(el);
  }

  window.DemazeOverride.run({
    getRoot: getSection,
    isHydrated: function (s) { return !!(s && s.querySelector('[data-framer-name="Container"]')); },
    apply: apply,
    verify: function (s) { return !!(s && s.querySelectorAll('.dz-stack-item').length === 8); }
  });
})();
