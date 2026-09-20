/**
 * Our Process — Demaze's real 4-step process (Discover & Define / Design &
 * Prototype / Build & Integrate / Launch & Scale), with MOVIQ's native
 * scroll-linked unfolding card interaction.
 *
 * Symmetrically unfolds all 4 cards horizontally as the user scrolls into view,
 * matching the exact physics and feel of MOVIQ's "Videos making Step" section.
 */
(function () {
  var content = window.DEMAZE_CONTENT && window.DEMAZE_CONTENT.process;
  if (!content || !window.DemazeOverride) return;

  var STYLE_ID = 'demaze-process-style';
  var BLOCK_ID = 'demaze-process-block';

  var STEP_GRADIENTS = [
    'linear-gradient(135deg, #2563eb 0%, #38bdf8 100%)', // 1: Discover & Define
    'linear-gradient(135deg, #6366f1 0%, #a855f7 100%)', // 2: Design & Prototype
    'linear-gradient(135deg, #0ea5e9 0%, #10b981 100%)', // 3: Build & Integrate
    'linear-gradient(135deg, #10b981 0%, #059669 100%)', // 4: Launch & Scale
  ];

  var STEP_ICONS = [
    // 1: Search / Discovery
    '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#ffffff" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>',
    // 2: Design / Layers / Prototype
    '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#ffffff" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><polygon points="12 2 2 7 12 12 22 7 12 2"></polygon><polyline points="2 17 12 22 22 17"></polyline><polyline points="2 12 12 17 22 12"></polyline></svg>',
    // 3: Code / Build & Integrate
    '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#ffffff" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><polyline points="16 18 22 12 16 6"></polyline><polyline points="8 6 2 12 8 18"></polyline></svg>',
    // 4: Rocket / Launch & Scale
    '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#ffffff" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z"></path><path d="m12 15-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z"></path></svg>',
  ];

  function ensureStyle() {
    if (document.getElementById(STYLE_ID)) return;
    var style = document.createElement('style');
    style.id = STYLE_ID;
    style.textContent =
      'section[data-framer-name="Videos making Step"]{' +
      '  display:flex!important;flex-direction:column!important;align-items:center!important;' +
      '  width:100%!important;height:auto!important;min-height:auto!important;' +
      '  padding:50px 24px 60px!important;background:#ffffff!important;' +
      '  position:relative!important;z-index:1!important;overflow:visible!important;' +
      '}' +
      '.demaze-process-wrap{' +
      '  background:#ffffff;position:relative;z-index:1;padding:0;text-align:center;' +
      '  width:100%;max-width:1280px;margin:0 auto;' +
      '}' +
      '.demaze-process-eyebrow{' +
      '  display:inline-flex;align-items:center;gap:6px;' +
      '  background:rgba(37, 99, 235, 0.08);color:#2563eb;' +
      '  font-size:12px;font-weight:700;letter-spacing:0.06em;text-transform:uppercase;' +
      '  padding:6px 16px;border-radius:100px;border:1px solid rgba(37, 99, 235, 0.18);' +
      '  margin-bottom:16px;' +
      '}' +
      '.demaze-process-heading{' +
      '  font-size:clamp(32px, 4vw, 48px);font-weight:700;color:#0B0E17;' +
      '  margin:0 0 14px;letter-spacing:-0.025em;line-height:1.15;' +
      '}' +
      '.demaze-process-sub{' +
      '  font-size:clamp(15px, 1.2vw, 17px);color:#64748b;max-width:620px;' +
      '  margin:0 auto 56px;line-height:1.6;' +
      '}' +
      '.demaze-process-row{' +
      '  display:grid;grid-template-columns:repeat(4, 1fr);gap:20px;' +
      '  width:100%;margin:0 auto;position:relative;align-items:stretch;' +
      '  perspective:1200px;transform-style:preserve-3d;' +
      '}' +
      '.demaze-process-card{' +
      '  background:#ffffff;border:1px solid rgba(226, 232, 240, 0.9);' +
      '  border-radius:28px;padding:32px 24px;text-align:left;' +
      '  box-shadow:0 1px 3px rgba(0,0,0,0.02), 0 16px 36px -10px rgba(15, 23, 42, 0.06);' +
      '  display:flex;flex-direction:column;position:relative;z-index:1;' +
      '  will-change:transform, opacity;' +
      '  transition:box-shadow 0.3s ease, border-color 0.3s ease;' +
      '}' +
      '.demaze-process-card:hover{' +
      '  box-shadow:0 24px 50px -12px rgba(37, 99, 235, 0.16);' +
      '  border-color:rgba(37, 99, 235, 0.35);' +
      '}' +
      '.demaze-process-card-top{' +
      '  display:flex;align-items:center;justify-content:space-between;' +
      '  margin-bottom:24px;' +
      '}' +
      '.demaze-process-icon{' +
      '  width:44px;height:44px;border-radius:14px;' +
      '  display:inline-flex;align-items:center;justify-content:center;' +
      '  box-shadow:0 8px 18px rgba(0, 0, 0, 0.12);flex-shrink:0;' +
      '}' +
      '.demaze-process-step-num{' +
      '  font-size:12.5px;font-weight:700;color:#94a3b8;' +
      '  background:rgba(241, 245, 249, 0.8);padding:4px 10px;border-radius:8px;' +
      '  border:1px solid rgba(226, 232, 240, 0.8);' +
      '}' +
      '.demaze-process-card h3{' +
      '  font-size:20px;font-weight:700;color:#0B0E17;margin:0 0 12px;' +
      '  line-height:1.3;letter-spacing:-0.01em;' +
      '}' +
      '.demaze-process-card p{' +
      '  font-size:14.5px;line-height:1.65;color:#64748b;margin:0;' +
      '}' +
      '@media (max-width: 1024px){' +
      '  .demaze-process-row{grid-template-columns:repeat(2, 1fr);gap:18px;}' +
      '}' +
      '@media (max-width: 640px){' +
      '  section[data-framer-name="Videos making Step"]{padding:80px 18px 90px!important;}' +
      '  .demaze-process-row{grid-template-columns:1fr;gap:16px;}' +
      '  .demaze-process-card{padding:26px 20px;}' +
      '}';
    document.head.appendChild(style);
  }

  function cardHTML(step, i) {
    var grad = STEP_GRADIENTS[i % STEP_GRADIENTS.length];
    var icon = STEP_ICONS[i % STEP_ICONS.length];
    return (
      '<div class="demaze-process-card" data-step-index="' + i + '">' +
      '  <div class="demaze-process-card-top">' +
      '    <div class="demaze-process-icon" style="background:' + grad + '">' + icon + '</div>' +
      '    <span class="demaze-process-step-num">0' + (i + 1) + '</span>' +
      '  </div>' +
      '  <h3>' + step.title + '</h3>' +
      '  <p>' + step.description + '</p>' +
      '</div>'
    );
  }

  function getProcessSection() {
    return document.querySelector('section[data-framer-name="Videos making Step"]');
  }

  function isHydrated(section) {
    return !!section;
  }

  function applyOverride(section) {
    ensureStyle();

    // Clean up any accidental copy left in Hero
    var oldHeroBlock = document.querySelector('section[data-framer-name="Hero"] #' + BLOCK_ID);
    if (oldHeroBlock) oldHeroBlock.style.display = 'none';

    // Ensure section is visible in natural document flow
    section.style.setProperty('display', 'flex', 'important');
    section.style.setProperty('height', 'auto', 'important');
    section.style.setProperty('min-height', 'auto', 'important');

    // Hide native MOVIQ children without modifying their React tree
    var nativeContainer = section.querySelector('[data-framer-name="Container"]');
    if (nativeContainer) {
      nativeContainer.style.setProperty('display', 'none', 'important');
    }

    var block = document.getElementById(BLOCK_ID);
    if (!block) {
      block = document.createElement('div');
      block.id = BLOCK_ID;
      block.className = 'demaze-process-wrap';
      block.innerHTML =
        '<span class="demaze-process-eyebrow">' + (content.eyebrow || 'How We Work') + '</span>' +
        '<h2 class="demaze-process-heading">' + content.heading + '</h2>' +
        '<p class="demaze-process-sub">A structured, collaborative framework engineered to transform complex challenges into scalable AI products.</p>' +
        '<div class="demaze-process-row">' + content.steps.map(cardHTML).join('') + '</div>';
      section.appendChild(block);
    }

    // Bind MOVIQ scroll-linked card unfolding animation with zero forced reflows
    if (!section.__demazeProcessScrollBound) {
      section.__demazeProcessScrollBound = true;

      var processScrollTicking = false;
      var lastProgress = -1;
      var isProcessVisible = false;
      var cachedSectionTop = 0;

      function updateSectionMetrics() {
        var rect = section.getBoundingClientRect();
        var scrollY = (window.lenis && typeof window.lenis.scroll === 'number') ? window.lenis.scroll : window.scrollY;
        cachedSectionTop = rect.top + scrollY;
      }
      updateSectionMetrics();
      window.addEventListener('resize', updateSectionMetrics, { passive: true });

      if ('IntersectionObserver' in window) {
        var procObserver = new IntersectionObserver(function (entries) {
          isProcessVisible = entries[0].isIntersecting;
          if (isProcessVisible) {
            updateSectionMetrics();
            syncProcessScroll();
          }
        }, { rootMargin: '120px 0px 120px 0px' });
        procObserver.observe(section);
      } else {
        isProcessVisible = true;
      }

      function syncProcessScroll() {
        if (!isProcessVisible) return;

        var winH = window.innerHeight || 800;
        var scrollY = (window.lenis && typeof window.lenis.scroll === 'number') ? window.lenis.scroll : window.scrollY;
        var rectTop = cachedSectionTop - scrollY;

        // Progress 0 when section enters bottom 88% of screen; 1 when top reaches 28%
        var start = winH * 0.88;
        var end = winH * 0.28;
        var p = Math.min(1, Math.max(0, (start - rectTop) / (start - end)));

        // Skip DOM writes if progress hasn't changed noticeably
        if (Math.abs(p - lastProgress) < 0.003 && (p === 0 || p === 1)) return;
        lastProgress = p;

        var cards = section.querySelectorAll('.demaze-process-card');
        if (!cards || cards.length !== 4) return;

        var isDesktop = window.innerWidth > 768;

        // Unfold each card symmetrically
        if (isDesktop) {
          var xOffsets = [160, 50, -50, -160];
          var rotY = [-5, -2, 2, 5];
          var minScales = [0.90, 0.95, 0.95, 0.90];

          for (var i = 0; i < cards.length; i++) {
            var factor = 1 - p;
            var curX = (xOffsets[i] * factor).toFixed(2);
            var curRot = (rotY[i] * factor).toFixed(2);
            var curScale = (minScales[i] + (1 - minScales[i]) * p).toFixed(3);
            var curOp = (0.45 + 0.55 * p).toFixed(3);

            cards[i].style.transform = 'translate3d(' + curX + 'px, 0, 0) scale(' + curScale + ') rotateY(' + curRot + 'deg)';
            cards[i].style.opacity = curOp;
          }
        } else {
          // Responsive mobile/tablet stagger
          for (var j = 0; j < cards.length; j++) {
            var factorM = 1 - p;
            var curYM = (25 * factorM).toFixed(2);
            var curScaleM = (0.95 + 0.05 * p).toFixed(3);
            var curOpM = (0.50 + 0.50 * p).toFixed(3);
            cards[j].style.transform = 'translate3d(0, ' + curYM + 'px, 0) scale(' + curScaleM + ')';
            cards[j].style.opacity = curOpM;
          }
        }
      }

      function requestProcessScrollSync() {
        if (!isProcessVisible) return;
        if (!processScrollTicking) {
          processScrollTicking = true;
          requestAnimationFrame(function () {
            syncProcessScroll();
            processScrollTicking = false;
          });
        }
      }

      window.addEventListener('scroll', requestProcessScrollSync, { passive: true });
      syncProcessScroll();
    }
  }

  function verifyStuck() {
    var sec = getProcessSection();
    var secVisible = sec && sec.style.display !== 'none';
    var block = document.getElementById(BLOCK_ID);
    return !!(secVisible && block);
  }

  window.DemazeOverride.run({
    getRoot: getProcessSection,
    isHydrated: isHydrated,
    apply: applyOverride,
    verify: verifyStuck,
  });
})();
