/**
 * Post-hydration content override for the Why Demaze section (MOVIQ's
 * "Moviq vs Traditional Video" section).
 *
 * Faithfully adapts the exact split layout and light-mode glass style
 * from Fora AI (https://foraai.framer.website/ - "Why Us" section):
 * - Left column: Large high-end glass testimonial card with dunes background image,
 *   progressive blur gradient overlay, 5 golden stars, Krupal's profile pic,
 *   Demaze Founder quote, and Krupal Chaudhary author byline.
 * - Right column: "Why choose us?" grey glass eyebrow pill, dual-tone display heading
 *   ("Built to deliver results, Not just Promises"), editorial value-proposition
 *   paragraphs with scroll-scrubbed word highlighting, and 2 frosted glass stat cards.
 * - Fully responsive across Desktop (1440px), Tablet (768px), and Mobile (375px).
 * - Hydration safe: hides native container without deleting React-managed DOM nodes.
 */
(function () {
  var content = window.DEMAZE_CONTENT && window.DEMAZE_CONTENT.whyDemaze;
  var metrics = window.DEMAZE_CONTENT && window.DEMAZE_CONTENT.metrics;
  var testimonial = window.DEMAZE_CONTENT && window.DEMAZE_CONTENT.testimonial;
  if (!window.DemazeOverride) return;

  var STYLE_ID = 'demaze-whydemaze-fora-style';
  var WRAPPER_CLASS = 'demaze-whydemaze-fora-wrapper';

  function ensureStyle() {
    if (document.getElementById(STYLE_ID)) return;
    var style = document.createElement('style');
    style.id = STYLE_ID;
    style.textContent =
      /* Hide native MOVIQ container safely so React reconciler never errors on resize */
      'section[data-framer-name="Why Demaze vs Traditional"] > [data-framer-name="Container"],' +
      'section[data-framer-name="Moviq vs Traditional Video"] > [data-framer-name="Container"] {' +
      '  display: none !important;' +
      '}' +

      /* Section Styling - Clean Light Tone */
      'section[data-framer-name="Why Demaze vs Traditional"],' +
      'section[data-framer-name="Moviq vs Traditional Video"] {' +
      '  height: auto !important; min-height: auto !important;' +
      '  padding: 44px 24px 52px !important;' +
      '  overflow: visible !important;' +
      '  background: #ffffff !important;' +
      '  position: relative !important;' +
      '  box-sizing: border-box !important;' +
      '}' +

      /* Outer Flex Container matching Fora AI */
      '.' + WRAPPER_CLASS + ' {' +
      '  width: 100%; max-width: 1200px; margin: 0 auto; box-sizing: border-box;' +
      '  display: flex; flex-direction: row; align-items: stretch; justify-content: space-between;' +
      '  gap: 36px; position: relative; z-index: 2;' +
      '}' +

      /* Left Testimonial Card (Fora Dune Glass Style) */
      '.demaze-fora-left {' +
      '  width: 440px; max-width: 100%; height: 500px; border-radius: 24px;' +
      '  position: relative; overflow: hidden; display: flex; flex-direction: column; justify-content: flex-end;' +
      '  flex-shrink: 0; box-sizing: border-box;' +
      '  box-shadow: 0 16px 40px -12px rgba(15, 23, 42, 0.12), 0 2px 6px rgba(0, 0, 0, 0.04);' +
      '  border: 1px solid rgba(255, 255, 255, 0.4);' +
      '}' +
      '.demaze-fora-left-bg {' +
      '  position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover; object-position: center top;' +
      '  z-index: 1;' +
      '  transition: transform 0.7s cubic-bezier(0.16, 1, 0.3, 1);' +
      '}' +
      '.demaze-fora-left:hover .demaze-fora-left-bg {' +
      '  transform: scale(1.03);' +
      '}' +

      /* Dark gradient to ensure high readability */
      '.demaze-fora-left-gradient {' +
      '  position: absolute; inset: 0; z-index: 2; pointer-events: none;' +
      '  background: linear-gradient(180deg, rgba(0,0,0,0) 14%, rgba(15, 23, 42, 0.30) 42%, rgba(15, 23, 42, 0.82) 75%, rgba(15, 23, 42, 0.95) 100%);' +
      '}' +

      /* Progressive blur glass overlay at bottom */
      '.demaze-fora-left-blur {' +
      '  position: absolute; inset: 0; z-index: 3; pointer-events: none; border-radius: 24px;' +
      '  backdrop-filter: blur(14px); -webkit-backdrop-filter: blur(14px);' +
      '  mask-image: linear-gradient(to bottom, rgba(0,0,0,0) 0%, rgba(0,0,0,0) 30%, rgba(0,0,0,0.85) 68%, rgba(0,0,0,1) 100%);' +
      '  -webkit-mask-image: linear-gradient(to bottom, rgba(0,0,0,0) 0%, rgba(0,0,0,0) 30%, rgba(0,0,0,0.85) 68%, rgba(0,0,0,1) 100%);' +
      '}' +

      /* Glass content container */
      '.demaze-fora-left-content {' +
      '  position: relative; z-index: 10; padding: 36px 28px 30px; display: flex; flex-direction: column;' +
      '  align-items: center; text-align: center; justify-content: flex-end; box-sizing: border-box;' +
      '}' +
      '.demaze-fora-author-header {' +
      '  display: flex; flex-direction: column; align-items: center; text-align: center; gap: 14px; margin-bottom: 22px; width: 100%;' +
      '}' +
      '.demaze-fora-avatar {' +
      '  width: 100px !important; height: 100px !important; border-radius: 50%; object-fit: cover; object-position: center top;' +
      '  border: 4px solid rgba(255, 255, 255, 0.98); margin: 0 auto;' +
      '  box-shadow: 0 14px 36px rgba(0, 0, 0, 0.45), 0 0 0 1px rgba(255, 255, 255, 0.25); background: #ffffff;' +
      '  flex-shrink: 0;' +
      '}' +
      '.demaze-fora-user {' +
      '  display: flex; flex-direction: column; align-items: center; text-align: center;' +
      '}' +
      '.demaze-fora-user-name {' +
      '  font-size: 19px !important; font-weight: 700 !important; color: #ffffff !important; -webkit-text-fill-color: #ffffff !important; margin: 0 0 4px;' +
      '  font-family: "Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;' +
      '  letter-spacing: -0.01em; text-shadow: 0 2px 10px rgba(0, 0, 0, 0.5) !important; text-align: center;' +
      '}' +
      '.demaze-fora-user-role {' +
      '  font-size: 13.5px !important; font-weight: 500 !important; color: rgba(255, 255, 255, 0.92) !important; -webkit-text-fill-color: rgba(255, 255, 255, 0.92) !important; margin: 0;' +
      '  letter-spacing: 0.01em; text-shadow: 0 1px 6px rgba(0, 0, 0, 0.4) !important; text-align: center;' +
      '}' +
      '.demaze-fora-quote, .demaze-fora-quote * {' +
      '  font-size: 15.5px !important; font-weight: 500 !important; line-height: 1.6 !important;' +
      '  color: #ffffff !important; -webkit-text-fill-color: #ffffff !important; margin: 0; letter-spacing: -0.01em;' +
      '  font-family: "Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;' +
      '  text-shadow: 0 2px 12px rgba(0, 0, 0, 0.6) !important; text-align: center !important;' +
      '}' +
      '}' +

      /* Right Column: Content + Stats */
      '.demaze-fora-right {' +
      '  flex: 1; min-width: 0; display: flex; flex-direction: column; justify-content: space-between;' +
      '  box-sizing: border-box;' +
      '}' +
      '.demaze-fora-right-top {' +
      '  display: flex; flex-direction: column; align-items: flex-start;' +
      '}' +
      '.demaze-fora-eyebrow {' +
      '  display: inline-flex; align-items: center; padding: 5px 14px; border-radius: 999px;' +
      '  background: rgba(16, 185, 129, 0.08); color: #059669; font-size: 12px; font-weight: 600;' +
      '  margin-bottom: 14px; align-self: flex-start; border: 1px solid rgba(16, 185, 129, 0.2);' +
      '  text-transform: uppercase; letter-spacing: 0.06em;' +
      '}' +
      '.demaze-fora-heading {' +
      '  font-size: clamp(26px, 3vw, 36px); font-weight: 700; line-height: 1.2;' +
      '  letter-spacing: -0.025em; color: #09090B; margin: 0 0 16px;' +
      '  font-family: "Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;' +
      '}' +
      '.demaze-fora-dim {' +
      '  background: linear-gradient(135deg, #10B981 0%, #059669 100%) !important;' +
      '  -webkit-background-clip: text !important;' +
      '  -webkit-text-fill-color: transparent !important;' +
      '  font-weight: 700;' +
      '}' +
      '.demaze-fora-text {' +
      '  display: flex; flex-direction: column; gap: 12px; max-width: 600px;' +
      '}' +
      '.demaze-fora-text p {' +
      '  font-size: 15px; line-height: 1.65; margin: 0;' +
      '  font-family: "Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;' +
      '}' +

      /* Scroll Highlight Words (Right Side Only) */
      '.demaze-scroll-word {' +
      '  color: #64748B;' +
      '  transition: color 0.18s cubic-bezier(0.16, 1, 0.3, 1);' +
      '  will-change: color;' +
      '  display: inline;' +
      '}' +
      '.demaze-scroll-word.demaze-word-active {' +
      '  color: #059669;' +
      '  font-weight: 600;' +
      '}' +

      /* 2 Frosted Glass Stat Cards (Fora AI style) */
      '.demaze-fora-stats {' +
      '  display: grid; grid-template-columns: 1fr 1fr; gap: 16px; margin-top: 24px; width: 100%;' +
      '}' +
      '.demaze-fora-stat-card {' +
      '  background: rgba(244, 244, 246, 0.88);' +
      '  backdrop-filter: blur(16px); -webkit-backdrop-filter: blur(16px);' +
      '  border: 1px solid rgba(228, 228, 231, 0.85);' +
      '  border-radius: 20px; padding: 20px 20px; box-sizing: border-box;' +
      '  display: flex; flex-direction: column; justify-content: space-between;' +
      '  min-height: 120px;' +
      '  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.02);' +
      '  transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);' +
      '}' +
      '.demaze-fora-stat-card:hover {' +
      '  transform: translateY(-3px);' +
      '  border-color: rgba(16, 185, 129, 0.3);' +
      '  background: rgba(244, 244, 246, 0.98);' +
      '  border-color: rgba(91, 79, 233, 0.28);' +
      '  box-shadow: 0 14px 32px -8px rgba(91, 79, 233, 0.08), 0 4px 12px rgba(0, 0, 0, 0.03);' +
      '}' +
      '.demaze-fora-stat-value {' +
      '  font-size: 46px; font-weight: 700; color: #09090B; line-height: 1;' +
      '  letter-spacing: -0.03em; margin-bottom: 12px; font-variant-numeric: tabular-nums;' +
      '  font-family: "Stack Sans Headline", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;' +
      '}' +
      '.demaze-fora-stat-title {' +
      '  font-size: 16px; font-weight: 600; color: #09090B; line-height: 1.3; margin-bottom: 4px;' +
      '  font-family: "Stack Sans Headline", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;' +
      '}' +
      '.demaze-fora-stat-sub {' +
      '  font-size: 13.5px; color: #71717A; line-height: 1.4; font-weight: 400;' +
      '}' +

      /* Responsive Breakpoints */
      '@media (max-width: 990px) {' +
      '  section[data-framer-name="Why Demaze vs Traditional"],' +
      '  section[data-framer-name="Moviq vs Traditional Video"] {' +
      '    padding: 70px 24px 80px !important;' +
      '  }' +
      '  .' + WRAPPER_CLASS + ' {' +
      '    flex-direction: column; align-items: center; gap: 44px;' +
      '  }' +
      '  .demaze-fora-left { width: 100%; max-width: 580px; height: 530px; }' +
      '  .demaze-fora-right { width: 100%; max-width: 580px; }' +
      '}' +

      '@media (max-width: 600px) {' +
      '  section[data-framer-name="Why Demaze vs Traditional"],' +
      '  section[data-framer-name="Moviq vs Traditional Video"] {' +
      '    padding: 60px 16px 70px !important;' +
      '  }' +
      '  .' + WRAPPER_CLASS + ' {' +
      '    gap: 36px;' +
      '  }' +
      '  .demaze-fora-left { height: 540px; border-radius: 26px; }' +
      '  .demaze-fora-left-content { padding: 26px 20px; }' +
      '  .demaze-fora-stars { margin-bottom: 12px; font-size: 19px; }' +
      '  .demaze-fora-avatar { width: 50px; height: 50px; }' +
      '  .demaze-fora-quote { font-size: 15px; margin-bottom: 16px; line-height: 1.42; }' +
      '  .demaze-fora-br { display: none; }' +
      '  .demaze-fora-stats { grid-template-columns: 1fr; gap: 14px; }' +
      '  .demaze-fora-stat-card { border-radius: 22px; padding: 22px; }' +
      '  .demaze-fora-stat-value { font-size: 38px; }' +
      '}';
    document.head.appendChild(style);
  }

  function getSection() {
    return document.querySelector('section[data-framer-name="Why Demaze vs Traditional"]') ||
           document.querySelector('section[data-framer-name="Moviq vs Traditional Video"]');
  }

  function isHydrated(section) {
    return !!section;
  }

  function wrapWordsInSpans(text) {
    var words = text.split(/\s+/);
    return words.map(function (w) {
      return '<span class="demaze-scroll-word">' + w + '</span>';
    }).join(' ');
  }

  function mountStage(section) {
    var existing = section.querySelector('.' + WRAPPER_CLASS);
    if (existing) return;

    var quoteText =
      "We harness your vision and data to build AI-driven solutions that help your brand stand out and grow revenue. When you thrive, we thrive, and we're with you, executing every step of the way.";
    var authorName = (testimonial && testimonial.name) || "Krupal Chaudhary";
    var authorRole = (testimonial && testimonial.title ? testimonial.title + ", Demaze Technologies" : "Founder & CEO, Demaze Technologies");
    var fallbackAvatar = (testimonial && testimonial.avatar) || "https://framerusercontent.com/images/e57nypBBfPrAXfYYyYgNJBgJBo.jpeg?width=895&height=980";
    var authorAvatar = "./assets/demaze/krupal_chaudhary.jpg";

    var wrapper = document.createElement('div');
    wrapper.className = WRAPPER_CLASS;

    // Build Left Testimonial Card with Author Header at top, Quote, and Rating Stars below the comment
    var leftCard = document.createElement('div');
    leftCard.className = 'demaze-fora-left';
    leftCard.innerHTML =
      '<img class="demaze-fora-left-bg" src="./assets/demaze/subpage-clouds-wide.jpg" alt="Why Demaze" loading="lazy" decoding="async" />' +
      '<div class="demaze-fora-left-gradient"></div>' +
      '<div class="demaze-fora-left-blur"></div>' +
      '<div class="demaze-fora-left-content">' +
      '  <div class="demaze-fora-author-header">' +
      '    <img class="demaze-fora-avatar" src="' + authorAvatar + '" onerror="this.onerror=null;this.src=\'' + fallbackAvatar + '\'" alt="' + authorName + '" loading="eager" decoding="async" />' +
      '    <div class="demaze-fora-user">' +
      '      <div class="demaze-fora-user-name">' + authorName + '</div>' +
      '      <div class="demaze-fora-user-role">' + authorRole + '</div>' +
      '    </div>' +
      '  </div>' +
      '  <p class="demaze-fora-quote">"' + quoteText + '"</p>' +
      '</div>';

    // Right Column paragraphs combining Who We Are + Why Choose Us + What Drives Us differentiators
    var p1 = "Demaze Technologies is an engineering team of 35+ technologists and developers. We partner with growing companies to turn complex ideas into robust, production-ready digital products.";
    var p2 = "We work directly alongside your internal team to design architecture, develop core features, and integrate scalable software into your daily operations.";
    var p3 = "Every engagement is led directly by senior engineers. You retain 100% code ownership from day one, with complete visibility into every deliverable.";

    // Build Right Column: Eyebrow + Dual-Tone Title + 3 Paragraphs with Word Highlight Spans + 2 Differentiator Cards
    var rightCol = document.createElement('div');
    rightCol.className = 'demaze-fora-right';
    rightCol.innerHTML =
      '<div class="demaze-fora-right-top">' +
      '  <div class="demaze-fora-eyebrow">About Demaze</div>' +
      '  <h2 class="demaze-fora-heading">' +
      '    Built to deliver <span class="demaze-fora-dim">results,</span><br class="demaze-fora-br">' +
      '    Not just <span class="demaze-fora-dim">promises</span>' +
      '  </h2>' +
      '  <div class="demaze-fora-text">' +
      '    <p>' + wrapWordsInSpans(p1) + '</p>' +
      '    <p>' + wrapWordsInSpans(p2) + '</p>' +
      '    <p>' + wrapWordsInSpans(p3) + '</p>' +
      '  </div>' +
      '</div>' +
      '<div class="demaze-fora-stats">' +
      '  <div class="demaze-fora-stat-card">' +
      '    <div class="demaze-fora-stat-value">35+</div>' +
      '    <div class="demaze-fora-stat-content">' +
      '      <div class="demaze-fora-stat-title">Technologists & Engineers</div>' +
      '      <div class="demaze-fora-stat-sub">Led directly by senior architects</div>' +
      '    </div>' +
      '  </div>' +
      '  <div class="demaze-fora-stat-card">' +
      '    <div class="demaze-fora-stat-value">100%</div>' +
      '    <div class="demaze-fora-stat-content">' +
      '      <div class="demaze-fora-stat-title">Code Ownership</div>' +
      '      <div class="demaze-fora-stat-sub">Direct IP transfer from day one</div>' +
      '    </div>' +
      '  </div>' +
      '</div>';

    wrapper.appendChild(leftCard);
    wrapper.appendChild(rightCol);

    section.appendChild(wrapper);

    // Attach Scroll-Scrubbed Word Highlighting on Right Side Text Only
    var wordElements = Array.from(rightCol.querySelectorAll('.demaze-scroll-word'));
    if (wordElements.length > 0) {
      var isWhyVisible = false;
      if ('IntersectionObserver' in window) {
        var whyObs = new IntersectionObserver(function (entries) {
          isWhyVisible = entries[0].isIntersecting;
          if (isWhyVisible) onScroll();
        }, { rootMargin: '100px 0px 100px 0px' });
        whyObs.observe(section);
      } else {
        isWhyVisible = true;
      }

      var cachedTargetEl = null;
      var isTicking = false;
      function onScroll() {
        if (!isWhyVisible) return;
        if (!isTicking) {
          isTicking = true;
          requestAnimationFrame(function () {
            if (!cachedTargetEl) {
              cachedTargetEl = rightCol.querySelector('.demaze-fora-text') || rightCol;
            }
            var rect = cachedTargetEl.getBoundingClientRect();
            var windowH = window.innerHeight || document.documentElement.clientHeight;
            // Reveal starts when top of text enters view (at 82% viewport)
            // and completes 100% when text is centered in view (at 45% viewport)
            var startY = windowH * 0.82;
            var endY = windowH * 0.45;
            var totalDist = Math.max(1, rect.height + (startY - endY));
            var currentDist = startY - rect.top;
            var progress = currentDist / totalDist;
            progress = Math.max(0, Math.min(1, progress));

            var activeCount = Math.round(progress * wordElements.length);
            for (var i = 0; i < wordElements.length; i++) {
              if (i < activeCount) {
                if (!wordElements[i].classList.contains('demaze-word-active')) {
                  wordElements[i].classList.add('demaze-word-active');
                }
              } else {
                if (wordElements[i].classList.contains('demaze-word-active')) {
                  wordElements[i].classList.remove('demaze-word-active');
                }
              }
            }
            isTicking = false;
          });
        }
      }

      window.addEventListener('scroll', onScroll, { passive: true });
      window.addEventListener('resize', onScroll, { passive: true });
      // Initial trigger
      onScroll();
    }
  }

  function applyOverride(section) {
    ensureStyle();
    mountStage(section);
  }

  function verifyStuck(section) {
    var wrapper = section && section.querySelector('.' + WRAPPER_CLASS);
    var left = section && section.querySelector('.demaze-fora-left');
    var right = section && section.querySelector('.demaze-fora-right');
    var stats = section && section.querySelectorAll('.demaze-fora-stat-card');
    var avatar = section && section.querySelector('.demaze-fora-avatar');
    var words = section && section.querySelectorAll('.demaze-scroll-word');
    return !!(wrapper && left && right && stats && stats.length === 2 && avatar && words.length > 0);
  }

  window.DemazeOverride.run({
    getRoot: getSection,
    isHydrated: isHydrated,
    apply: applyOverride,
    verify: verifyStuck
  });
})();
