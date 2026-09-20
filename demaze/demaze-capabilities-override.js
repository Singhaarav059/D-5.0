/**
 * Post-hydration content override for the Core Capabilities section (MOVIQ's
 * "Tools" section: 4 core service pillars).
 *
 * Redesigned in compact 2-in-a-row (2x2 grid) layout with inline text alignment,
 * glowing gradient badges, proper vector tech glyphs, 2x2 capability chips,
 * live telemetry metrics, and MOVIQ's signature scroll-linked unfolding motion.
 */
(function () {
  if (!window.DemazeOverride) return;

  var STYLE_ID = 'demaze-capabilities-redesign-style';

  var PILLARS = [
    {
      id: '01',
      tag: 'AI ENGINE',
      title: 'AI & Machine Learning',
      desc: 'Enterprise AI architectures, predictive models, and autonomous agent workflows engineered for mission-critical operations.',
      grad: 'linear-gradient(135deg, #4f46e5 0%, #7c3aed 50%, #ec4899 100%)',
      shadow: 'rgba(124, 58, 237, 0.35)',
      icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83"></path><circle cx="12" cy="12" r="4"></circle></svg>',
      metric: 'Sub-Second Inference',
      chips: [
        'Predictive Analytics & Forecasting',
        'NLP & Large Language Models',
        'Computer Vision & Image AI',
        'Generative AI & Model Tuning'
      ]
    },
    {
      id: '02',
      tag: 'FULL STACK',
      title: 'Web, Mobile App & SaaS',
      desc: 'Scalable full-stack software, cross-platform mobile apps, and multi-tenant SaaS platforms built for high-throughput performance.',
      grad: 'linear-gradient(135deg, #2563eb 0%, #06b6d4 100%)',
      shadow: 'rgba(37, 99, 235, 0.35)',
      icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="3" width="20" height="14" rx="2" ry="2"></rect><line x1="8" y1="21" x2="16" y2="21"></line><line x1="12" y1="17" x2="12" y2="21"></line></svg>',
      metric: '60 FPS Fluid UI',
      chips: [
        'Enterprise SaaS Platforms',
        'iOS & Android Mobile Apps',
        'High-Speed Web Applications',
        'Automated Workflow Engines'
      ]
    },
    {
      id: '03',
      tag: 'COMMERCE OS',
      title: 'Intelligent E-Commerce',
      desc: 'Headless commerce architectures, multi-vendor marketplaces, and AI recommendation engines maximizing checkout conversion rates.',
      grad: 'linear-gradient(135deg, #ea580c 0%, #f59e0b 50%, #e11d48 100%)',
      shadow: 'rgba(234, 88, 12, 0.35)',
      icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="9" cy="21" r="1"></circle><circle cx="20" cy="21" r="1"></circle><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path></svg>',
      metric: '99.99% Checkout SLA',
      chips: [
        'Headless & D2C Marketplaces',
        'AI Personalization & Search',
        'Global Payments & Fraud Shield',
        'Subscription & Billing Engines'
      ]
    },
    {
      id: '04',
      tag: 'DEVOPS & SRE',
      title: 'Cloud Infrastructure',
      desc: 'Cloud-native multi-cloud systems, Kubernetes orchestration, and automated zero-downtime CI/CD delivery pipelines.',
      grad: 'linear-gradient(135deg, #0284c7 0%, #10b981 100%)',
      shadow: 'rgba(2, 132, 199, 0.35)',
      icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17.5 19H9a7 7 0 1 1 6.71-9h1.79a4.5 4.5 0 1 1 0 9Z"></path></svg>',
      metric: 'Zero-Downtime SLAs',
      chips: [
        'AWS & Multi-Cloud Systems',
        'Kubernetes & Microservices',
        'Zero-Trust Security & SRE',
        'Automated CI/CD Delivery'
      ]
    }
  ];

  function ensureStyles() {
    if (document.getElementById(STYLE_ID)) return;
    var style = document.createElement('style');
    style.id = STYLE_ID;
    style.textContent =
      /* Hide native React container so it never triggers reconciliation errors */
      'section.framer-1e6ypd3 [data-framer-name="Container"],' +
      'section[data-framer-name="Tools"]:has([data-framer-name="Grid"]) [data-framer-name="Container"]{' +
      '  display: none !important;' +
      '}' +

      /* Section & Header Framing */
      'section.framer-1e6ypd3, section[data-framer-name="Tools"]:has([data-framer-name="Grid"]){' +
      '  height: auto !important; min-height: auto !important; padding: 90px 0 !important;' +
      '  overflow: visible !important; background: #ffffff !important; position: relative !important;' +
      '}' +
      '.demaze-cap-wrapper{' +
      '  width: 100%; max-width: 1240px; margin: 0 auto; padding: 0 24px; box-sizing: border-box;' +
      '}' +
      '.demaze-cap-header{' +
      '  text-align: center; margin-bottom: 48px; position: relative; z-index: 2;' +
      '}' +
      '.demaze-cap-eyebrow{' +
      '  display: inline-flex; align-items: center; gap: 8px;' +
      '  padding: 6px 16px; border-radius: 999px;' +
      '  background: rgba(37, 99, 235, 0.08); border: 1px solid rgba(37, 99, 235, 0.20);' +
      '  color: #2563eb; font-size: 12px; font-weight: 700; letter-spacing: 0.08em;' +
      '  text-transform: uppercase; margin-bottom: 14px;' +
      '}' +
      '.demaze-cap-heading{' +
      '  font-size: clamp(32px, 3.8vw, 50px); font-weight: 700; line-height: 1.15;' +
      '  color: #0f172a; margin: 0 0 14px; text-wrap: balance;' +
      '  font-family: "Stack Sans Headline", -apple-system, sans-serif;' +
      '  letter-spacing: -0.02em;' +
      '}' +
      '.demaze-cap-sub{' +
      '  font-size: clamp(15px, 1.2vw, 17px); line-height: 1.6; color: #64748b;' +
      '  max-width: 680px; margin: 0 auto; text-wrap: balance;' +
      '}' +

      /* 2x2 Capabilities Grid */
      '.demaze-cap-grid{' +
      '  display: grid; grid-template-columns: repeat(2, 1fr); gap: 24px;' +
      '  width: 100%; margin: 0 auto; perspective: 1200px; transform-style: preserve-3d;' +
      '}' +

      /* Outer Card Container for Unfolding Animation */
      '.demaze-cap-card-outer{' +
      '  will-change: transform, opacity; min-width: 0;' +
      '}' +

      /* Inner Card with Micro-Interactions */
      '.demaze-cap-card-inner{' +
      '  background: #ffffff; border: 1px solid #e2e8f0; border-radius: 24px;' +
      '  padding: 28px 30px; display: flex; flex-direction: column;' +
      '  box-shadow: 0 4px 20px rgba(15, 23, 42, 0.04), 0 0 0 1px rgba(226, 232, 240, 0.4);' +
      '  transition: transform 0.25s cubic-bezier(.22,1,.36,1), box-shadow 0.25s ease, border-color 0.25s ease;' +
      '  box-sizing: border-box; height: 100%;' +
      '}' +
      '.demaze-cap-card-inner:hover{' +
      '  transform: translateY(-5px); border-color: rgba(37, 99, 235, 0.35);' +
      '  box-shadow: 0 20px 40px -10px rgba(37, 99, 235, 0.14), 0 0 0 1px rgba(37, 99, 235, 0.2);' +
      '}' +

      /* Card Top Row */
      '.demaze-cap-card-top{' +
      '  display: flex; align-items: center; justify-content: space-between; margin-bottom: 20px;' +
      '}' +
      '.demaze-cap-badge{' +
      '  width: 52px; height: 52px; border-radius: 16px;' +
      '  display: flex; align-items: center; justify-content: center;' +
      '  color: #ffffff; flex-shrink: 0;' +
      '}' +
      '.demaze-cap-badge svg{ width: 26px; height: 26px; }' +
      '.demaze-cap-meta{ display: flex; align-items: center; gap: 8px; }' +
      '.demaze-cap-index{' +
      '  font-size: 11px; font-weight: 700; letter-spacing: 0.08em; text-transform: uppercase;' +
      '  color: #2563eb; background: rgba(37, 99, 235, 0.08); border: 1px solid rgba(37, 99, 235, 0.20);' +
      '  padding: 4px 10px; border-radius: 999px; font-family: ui-monospace, SFMono-Regular, Menlo, monospace;' +
      '}' +

      /* Inline Aligned Typography */
      '.demaze-cap-title{' +
      '  font-size: 22px; font-weight: 700; color: #0f172a; margin: 0 0 10px;' +
      '  line-height: 1.25; font-family: "Stack Sans Headline", -apple-system, sans-serif;' +
      '  letter-spacing: -0.01em; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;' +
      '}' +
      '.demaze-cap-desc{' +
      '  font-size: 14px; line-height: 1.55; color: #475569; margin: 0 0 20px;' +
      '  height: 44px; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden;' +
      '}' +

      /* 2x2 Feature Chips Grid */
      '.demaze-cap-chips{' +
      '  display: grid; grid-template-columns: repeat(2, 1fr); gap: 8px 10px; margin-bottom: 22px;' +
      '}' +
      '.demaze-cap-chip{' +
      '  display: flex; align-items: center; gap: 7px;' +
      '  background: #f8fafc; border: 1px solid #e2e8f0;' +
      '  padding: 7px 11px; border-radius: 10px;' +
      '  font-size: 12px; font-weight: 500; color: #334155;' +
      '  white-space: nowrap; overflow: hidden; text-overflow: ellipsis;' +
      '  transition: all 0.18s ease;' +
      '}' +
      '.demaze-cap-chip:hover{ background: #ffffff; border-color: #cbd5e1; color: #0f172a; }' +
      '.demaze-cap-chip-icon{ display: inline-flex; color: #2563eb; flex-shrink: 0; }' +
      '.demaze-cap-chip-icon svg{ width: 13px; height: 13px; }' +

      /* Card Footer */
      '.demaze-cap-footer{' +
      '  display: flex; align-items: center; justify-content: space-between;' +
      '  margin-top: auto; padding-top: 16px; border-top: 1px solid #f1f5f9;' +
      '}' +
      '.demaze-cap-live{' +
      '  display: flex; align-items: center; gap: 7px; font-size: 12px; font-weight: 600; color: #10b981;' +
      '}' +
      '.demaze-cap-live-dot{' +
      '  width: 6.5px; height: 6.5px; border-radius: 50%; background: #10b981;' +
      '  box-shadow: 0 0 8px #10b981;' +
      '}' +
      '.demaze-cap-link{' +
      '  display: inline-flex; align-items: center; gap: 6px; font-size: 13px; font-weight: 600;' +
      '  color: #2563eb; text-decoration: none !important; transition: gap 0.2s ease, color 0.2s ease;' +
      '}' +
      '.demaze-cap-link:hover{ color: #1d4ed8; gap: 9px; }' +
      '.demaze-cap-link svg{ width: 14px; height: 14px; }' +

      /* Responsive Media Queries */
      '@media (max-width: 1024px){' +
      '  .demaze-cap-wrapper{ padding: 0 20px; }' +
      '  .demaze-cap-grid{ grid-template-columns: 1fr; gap: 18px; }' +
      '  .demaze-cap-desc{ height: auto; -webkit-line-clamp: 3; }' +
      '}' +
      '@media (max-width: 640px){' +
      '  section.framer-1e6ypd3, section[data-framer-name="Tools"]:has([data-framer-name="Grid"]){ padding: 50px 0 !important; }' +
      '  .demaze-cap-wrapper{ padding: 0 16px; }' +
      '  .demaze-cap-card-inner{ padding: 22px 18px; }' +
      '  .demaze-cap-chips{ grid-template-columns: 1fr; }' +
      '  .demaze-cap-title{ white-space: normal; }' +
      '}';
    document.head.appendChild(style);
  }

  function bindUnfoldMotion(section) {
    if (section.__demazeCapScrollBound) return;
    section.__demazeCapScrollBound = true;

    var capScrollTicking = false;
    var lastProgress = -1;
    var isCapVisible = false;
    var cachedSectionTop = 0;

    function updateSectionMetrics() {
      var rect = section.getBoundingClientRect();
      var scrollY = (window.lenis && typeof window.lenis.scroll === 'number') ? window.lenis.scroll : window.scrollY;
      cachedSectionTop = rect.top + scrollY;
    }
    updateSectionMetrics();
    window.addEventListener('resize', updateSectionMetrics, { passive: true });

    if ('IntersectionObserver' in window) {
      var capObserver = new IntersectionObserver(function (entries) {
        isCapVisible = entries[0].isIntersecting;
        if (isCapVisible) {
          updateSectionMetrics();
          syncCapScroll();
        }
      }, { rootMargin: '120px 0px 120px 0px' });
      capObserver.observe(section);
    } else {
      isCapVisible = true;
    }

    function syncCapScroll() {
      if (!isCapVisible) return;

      var winH = window.innerHeight || 800;
      var scrollY = (window.lenis && typeof window.lenis.scroll === 'number') ? window.lenis.scroll : window.scrollY;
      var rectTop = cachedSectionTop - scrollY;

      // Progress 0 when section enters bottom 88% of screen; 1 when center reaches 40%
      var start = winH * 0.90;
      var end = winH * 0.38;
      var p = Math.min(1, Math.max(0, (start - rectTop) / (start - end)));

      if (Math.abs(p - lastProgress) < 0.003 && (p === 0 || p === 1)) return;
      lastProgress = p;

      var cards = section.querySelectorAll('.demaze-cap-card-outer');
      if (!cards || cards.length !== 4) return;

      var isDesktop = window.innerWidth > 1024;

      if (isDesktop) {
        // Symmetrically unfold outer cards towards outside as scroll progresses
        // Row 1: Card 0 unfolds left (-), Card 1 unfolds right (+)
        // Row 2: Card 2 unfolds left (-), Card 3 unfolds right (+)
        var xOffsets = [150, -150, 150, -150];
        var rotZ = [-3.5, 3.5, -3.5, 3.5];
        var minScale = 0.91;

        for (var i = 0; i < cards.length; i++) {
          var factor = 1 - p;
          var curX = (xOffsets[i] * factor).toFixed(2);
          var curRot = (rotZ[i] * factor).toFixed(2);
          var curScale = (minScale + (1 - minScale) * p).toFixed(3);
          var curOp = (0.45 + 0.55 * p).toFixed(3);

          cards[i].style.transform = 'translate3d(' + curX + 'px, 0, 0) scale(' + curScale + ') rotate(' + curRot + 'deg)';
          cards[i].style.opacity = curOp;
        }
      } else {
        // Mobile / Tablet smooth vertical stagger
        for (var j = 0; j < cards.length; j++) {
          var factorM = 1 - p;
          var curYM = (20 * factorM).toFixed(2);
          var curScaleM = (0.96 + 0.04 * p).toFixed(3);
          var curOpM = (0.50 + 0.50 * p).toFixed(3);
          cards[j].style.transform = 'translate3d(0, ' + curYM + 'px, 0) scale(' + curScaleM + ')';
          cards[j].style.opacity = curOpM;
        }
      }
    }

    function requestCapScrollSync() {
      if (!isCapVisible) return;
      if (!capScrollTicking) {
        capScrollTicking = true;
        requestAnimationFrame(function () {
          syncCapScroll();
          capScrollTicking = false;
        });
      }
    }

    window.addEventListener('scroll', requestCapScrollSync, { passive: true });
    syncCapScroll();
  }

  function mountCapabilitiesStage(section) {
    // Hide native React container so React's virtual DOM is not corrupted
    var nativeContainer = section.querySelector('[data-framer-name="Container"]');
    if (nativeContainer) {
      nativeContainer.style.setProperty('display', 'none', 'important');
    }

    if (section.querySelector('.demaze-cap-wrapper')) {
      return;
    }

    var wrapper = document.createElement('div');
    wrapper.className = 'demaze-cap-wrapper';

    // Section header
    var header = document.createElement('div');
    header.className = 'demaze-cap-header';
    header.innerHTML =
      '<span class="demaze-cap-eyebrow">' +
      '  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>' +
      '  Core Capabilities' +
      '</span>' +
      '<h2 class="demaze-cap-heading">Engineered for Exponential Scale</h2>' +
      '<p class="demaze-cap-sub">Comprehensive technical architectures designed, engineered, and deployed by Demaze\'s senior engineering team.</p>';
    wrapper.appendChild(header);

    // 2x2 Grid
    var grid = document.createElement('div');
    grid.className = 'demaze-cap-grid';

    PILLARS.forEach(function (item, idx) {
      var outer = document.createElement('div');
      outer.className = 'demaze-cap-card-outer';
      outer.dataset.cardIndex = idx;

      var chipsHTML = item.chips.map(function (c) {
        return (
          '<div class="demaze-cap-chip">' +
          '  <span class="demaze-cap-chip-icon">' +
          '    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>' +
          '  </span>' +
          '  <span>' + c + '</span>' +
          '</div>'
        );
      }).join('');

      outer.innerHTML =
        '<div class="demaze-cap-card-inner">' +
        '  <div class="demaze-cap-card-top">' +
        '    <div class="demaze-cap-badge" style="background:' + item.grad + ';box-shadow:0 8px 20px -3px ' + item.shadow + '">' +
        item.icon +
        '    </div>' +
        '    <div class="demaze-cap-meta">' +
        '      <span class="demaze-cap-index">' + item.id + ' · ' + item.tag + '</span>' +
        '    </div>' +
        '  </div>' +
        '  <h3 class="demaze-cap-title">' + item.title + '</h3>' +
        '  <p class="demaze-cap-desc">' + item.desc + '</p>' +
        '  <div class="demaze-cap-chips">' + chipsHTML + '</div>' +
        '  <div class="demaze-cap-footer">' +
        '    <div class="demaze-cap-live">' +
        '      <span class="demaze-cap-live-dot"></span>' +
        '      <span>' + item.metric + '</span>' +
        '    </div>' +
        '    <a href="./services" class="demaze-cap-link">' +
        '      <span>Explore Services</span>' +
        '      <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3.33 8h9.34M8 3.33 12.67 8 8 12.67"/></svg>' +
        '    </a>' +
        '  </div>' +
        '</div>';

      grid.appendChild(outer);
    });

    wrapper.appendChild(grid);
    section.appendChild(wrapper);

    bindUnfoldMotion(section);
  }

  function getSection() {
    return document.querySelector('section.framer-1e6ypd3, section[data-framer-name="Tools"]:has([data-framer-name="Grid"])') || document.querySelectorAll('section[data-framer-name="Tools"]')[0] || null;
  }

  function isHydrated(section) {
    return !!section;
  }

  function applyOverride(section) {
    ensureStyles();
    mountCapabilitiesStage(section);
  }

  function verifyStuck(section) {
    var cards = section && section.querySelectorAll('.demaze-cap-card-outer');
    return !!(cards && cards.length === 4);
  }

  window.DemazeOverride.run({
    getRoot: getSection,
    isHydrated: isHydrated,
    apply: applyOverride,
    verify: verifyStuck
  });
})();
