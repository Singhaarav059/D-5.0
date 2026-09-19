/**
 * Post-hydration content override for the Core Capabilities section (MOVIQ's
 * "Tools" section: a heading + a 6-card grid).
 *
 * Demaze has 4 real service categories (from demazetech.com/services). Per
 * explicit direction (checked against a reference recording), the card area
 * is rebuilt as a scroll-driven "unfold" composition:
 *   - a tall scroll stage holds a sticky viewport
 *   - inside it, 4 blocks are laid out in their final horizontal row from
 *     the start, but begin translated down + transparent
 *   - each block has its own progress window within the stage's scroll
 *     range; as scroll advances through that window, the block eases up
 *     into its final position — blocks reveal with a stagger, not at once
 *   - this is driven by actual scroll position (via scroll/resize listeners
 *     + requestAnimationFrame), so scrolling back up reverses it naturally
 *
 * MOVIQ has no native version of this mechanism anywhere in the repo or the
 * live reference site (checked its appear-animation config directly — every
 * element there uses a one-shot "fade up once when visible" spring, never a
 * continuous scroll-scrubbed timeline). This is new logic, not extracted
 * from MOVIQ, built to match the requested reference behavior.
 *
 * See demaze-override-core.js for why the initial content swap (heading,
 * eyebrow) waits/rechecks the way it does; the scroll-unfold part below is a
 * separate, ongoing mechanism (a real scroll listener, not a bounded retry).
 */
(function () {
  var content = window.DEMAZE_CONTENT && window.DEMAZE_CONTENT.coreCapabilities;
  if (!content || !window.DemazeOverride) return;

  var EYEBROW_CLASS = 'demaze-capabilities-eyebrow';
  var STYLE_ID = 'demaze-capabilities-style';
  var BRAND_BLUE = '#5B5FEF';
  var MUTED = 'rgb(108, 119, 131)';

  function ensureStyle() {
    if (document.getElementById(STYLE_ID)) return;
    var style = document.createElement('style');
    style.id = STYLE_ID;
    style.textContent =
      // !important: MOVIQ's own rule for this element (".framer-ScIth
      // .framer-wte4vf") sets height:min-content and display:grid via an
      // ancestor+own-class selector, which beats a plain single-class
      // override on specificity — confirmed by testing (the stage was
      'section[data-framer-name="Tools"]:nth-of-type(2), section.framer-1p5myw3{display:none!important;}' +
      '.demaze-capabilities-stage{position:relative!important;height:auto!important;min-height:auto!important;padding:20px 0 60px!important;display:block!important;}' +
      '.demaze-capabilities-viewport{position:relative!important;top:0!important;height:auto!important;display:flex!important;align-items:stretch!important;width:100%!important;}' +
      '.demaze-capabilities-row{display:grid!important;grid-template-columns:repeat(4,1fr)!important;gap:20px!important;width:100%!important;max-width:1320px!important;margin:0 auto!important;align-items:stretch!important;}' +
      '.demaze-capabilities-block{min-width:0;background:linear-gradient(180deg,#f8f9fa 0%,#fff 100%);' +
      'border:1px solid rgba(0,0,0,0.07);border-radius:24px;padding:28px 20px;text-align:left;display:flex;flex-direction:column;' +
      'box-shadow:0 12px 32px rgba(0,0,0,0.04);opacity:1!important;transform:none!important;transition:all 0.25s ease;}' +
      '.demaze-capabilities-block:hover{transform:translateY(-4px)!important;box-shadow:0 18px 44px rgba(91,95,239,0.12)!important;border-color:rgba(91,95,239,0.3)!important;}' +
      '.demaze-capabilities-block-icon{width:52px;height:52px;margin:0 0 16px;border-radius:14px;' +
      'display:flex;align-items:center;justify-content:center;background:#fff;border:1px solid rgba(0,0,0,0.08);overflow:hidden;box-shadow:0 4px 12px rgba(0,0,0,0.04);}' +
      '.demaze-capabilities-block-icon img{width:100%;height:100%;object-fit:cover;display:block;}' +
      '.demaze-capabilities-block h6{font-size:17px;font-weight:700;color:rgb(33,37,41);margin:0 0 8px;line-height:1.3;}' +
      '.demaze-capabilities-block p{font-size:13px;line-height:1.55;color:' + MUTED + ';margin:0 0 16px;}' +
      '.demaze-capabilities-sublist{list-style:none;padding:0;margin:auto 0 0 0;display:flex;flex-direction:column;gap:7px;border-top:1px solid rgba(0,0,0,0.06);padding-top:14px;}' +
      '.demaze-capabilities-sublist li{font-size:12px;line-height:1.4;color:rgb(55,65,81);display:flex;align-items:center;gap:7px;}' +
      '.demaze-capabilities-sublist li::before{content:"";width:5px;height:5px;border-radius:50%;background:' + BRAND_BLUE + ';flex-shrink:0;}' +
      '@media (max-width:1024px){' +
      '.demaze-capabilities-row{grid-template-columns:repeat(2,1fr)!important;gap:16px!important;}' +
      '}' +
      '@media (max-width:640px){' +
      '.demaze-capabilities-row{grid-template-columns:1fr!important;}' +
      '.demaze-capabilities-block{margin-bottom:16px;}' +
      '}';
    document.head.appendChild(style);
  }

  function iconSvg() {
    return (
      '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">' +
      '<rect x="3" y="3" width="18" height="18" rx="4" stroke="' + BRAND_BLUE + '" stroke-width="1.5"/>' +
      '<path d="M3 9H21" stroke="' + BRAND_BLUE + '" stroke-width="1.5"/>' +
      '<path d="M9 9V21" stroke="' + BRAND_BLUE + '" stroke-width="1.5"/>' +
      '</svg>'
    );
  }

  function blockHTML(item) {
    var iconHTML = item.image
      ? '<img src="' + item.image + '" alt="' + item.title + '">'
      : iconSvg();
    var sublistHTML = item.subItems
      ? '<ul class="demaze-capabilities-sublist">' +
        item.subItems
          .map(function (s) {
            return '<li>' + s + '</li>';
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
      '</div>'
    );
  }

  // Each block's own [start, end] progress window within the stage's scroll
  // range (0 to 1), staggered so they reveal one after another rather than
  // all at once, with room at the end for the completed row to just sit
  // still before the section releases.
  function revealWindows(count) {
    var span = 0.55; // how much of the 0..1 range covers the full stagger
    var duration = 0.4; // each block's own reveal takes 40% of that span
    var windows = [];
    for (var i = 0; i < count; i++) {
      var start = (span * i) / Math.max(count - 1, 1);
      windows.push([start, Math.min(start + duration, 1)]);
    }
    return windows;
  }

  function easeOutCubic(t) {
    return 1 - Math.pow(1 - t, 3);
  }

  function clamp(v, min, max) {
    return Math.max(min, Math.min(max, v));
  }

  function initScrollUnfold(stage) {
    if (stage.dataset.demazeUnfoldInit) return;
    stage.dataset.demazeUnfoldInit = '1';

    var blocks = Array.prototype.slice.call(stage.querySelectorAll('.demaze-capabilities-block'));
    var windows = revealWindows(blocks.length);
    var ticking = false;

    function update() {
      ticking = false;
      // Below the desktop breakpoint the CSS fallback takes over (static,
      // fully visible) — skip the scroll math entirely there.
      if (window.innerWidth < 810) return;

      var rect = stage.getBoundingClientRect();
      var scrollable = rect.height - window.innerHeight;
      var progress = scrollable > 0 ? clamp(-rect.top / scrollable, 0, 1) : 1;

      blocks.forEach(function (block, i) {
        var w = windows[i];
        var t = clamp((progress - w[0]) / (w[1] - w[0]), 0, 1);
        var eased = easeOutCubic(t);
        block.style.opacity = String(eased);
        block.style.transform = 'translateY(' + (1 - eased) * 70 + 'px)';
      });
    }

    function onScroll() {
      if (!ticking) {
        ticking = true;
        requestAnimationFrame(update);
      }
    }

    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll, { passive: true });
    update();
  }

  function getSection() {
    return document.querySelector('section[data-framer-name="Tools"]');
  }

  function isHydrated(section) {
    var h2 = section.querySelector('h2');
    var cards = section.querySelectorAll('a[href="./feature-detail-page"]');
    return !!(h2 && h2.textContent.trim().length > 0 && cards.length > 0);
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
    var subtitle = section.querySelector('[data-framer-name="Subtitle"]');
    if (subtitle) subtitle.style.display = 'none';

    // Replace MOVIQ's 6-card grid with the 4-block capabilities stage.
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

    // Hide second Tools section ("AI Video Creation" - MOVIQ leftover)
    var allTools = document.querySelectorAll('section[data-framer-name="Tools"]');
    if (allTools.length > 1) {
      allTools[1].style.setProperty('display', 'none', 'important');
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
