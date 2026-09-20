/**
 * Post-hydration content override for the Why Demaze section (MOVIQ's
 * "Moviq vs Traditional Video" section).
 *
 * Faithfully adapts the exact split layout and light-mode glass style
 * from Fora AI (https://foraai.framer.website/ - "Why Us" section):
 * - Left column: Large high-end glass testimonial card with dunes background image,
 *   progressive blur gradient overlay, 5 golden stars, Demaze Founder quote,
 *   and Krupal Chaudhary author byline.
 * - Right column: "Why choose us?" grey glass eyebrow pill, dual-tone display heading
 *   ("Built to deliver results, Not just Promises"), 3 editorial value-proposition
 *   paragraphs, and 2 frosted glass stat cards ("3X Faster Delivery" & "$10M+ Client Value Generated").
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
      '  padding: 100px 32px 110px !important;' +
      '  overflow: visible !important;' +
      '  background: #ffffff !important;' +
      '  position: relative !important;' +
      '  box-sizing: border-box !important;' +
      '}' +

      /* Outer Flex Container matching Fora AI */
      '.' + WRAPPER_CLASS + ' {' +
      '  width: 100%; max-width: 1200px; margin: 0 auto; box-sizing: border-box;' +
      '  display: flex; flex-direction: row; align-items: stretch; justify-content: space-between;' +
      '  gap: 48px; position: relative; z-index: 2;' +
      '}' +

      /* Left Testimonial Card (Fora Dune Glass Style) */
      '.demaze-fora-left {' +
      '  width: 478px; max-width: 100%; height: 590px; border-radius: 32px;' +
      '  position: relative; overflow: hidden; display: flex; flex-direction: column; justify-content: flex-end;' +
      '  flex-shrink: 0; box-sizing: border-box;' +
      '  box-shadow: 0 20px 50px -12px rgba(15, 23, 42, 0.16), 0 2px 6px rgba(0, 0, 0, 0.04);' +
      '  border: 1px solid rgba(255, 255, 255, 0.4);' +
      '  transition: transform 0.4s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.4s ease;' +
      '}' +
      '.demaze-fora-left:hover {' +
      '  transform: translateY(-4px);' +
      '  box-shadow: 0 28px 60px -12px rgba(15, 23, 42, 0.22), 0 4px 12px rgba(0, 0, 0, 0.06);' +
      '}' +
      '.demaze-fora-left-bg {' +
      '  position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover;' +
      '  display: block; z-index: 1; pointer-events: none;' +
      '  transition: transform 0.7s cubic-bezier(0.16, 1, 0.3, 1);' +
      '}' +
      '.demaze-fora-left:hover .demaze-fora-left-bg {' +
      '  transform: scale(1.03);' +
      '}' +

      /* Dark gradient to ensure high readability */
      '.demaze-fora-left-gradient {' +
      '  position: absolute; inset: 0; z-index: 2; pointer-events: none;' +
      '  background: linear-gradient(180deg, rgba(0,0,0,0) 18%, rgba(15, 23, 42, 0.25) 45%, rgba(15, 23, 42, 0.75) 75%, rgba(15, 23, 42, 0.92) 100%);' +
      '}' +

      /* Progressive blur glass overlay at bottom */
      '.demaze-fora-left-blur {' +
      '  position: absolute; inset: 0; z-index: 3; pointer-events: none; border-radius: 32px;' +
      '  backdrop-filter: blur(14px); -webkit-backdrop-filter: blur(14px);' +
      '  mask-image: linear-gradient(to bottom, rgba(0,0,0,0) 0%, rgba(0,0,0,0) 35%, rgba(0,0,0,0.85) 70%, rgba(0,0,0,1) 100%);' +
      '  -webkit-mask-image: linear-gradient(to bottom, rgba(0,0,0,0) 0%, rgba(0,0,0,0) 35%, rgba(0,0,0,0.85) 70%, rgba(0,0,0,1) 100%);' +
      '}' +

      /* Glass content container */
      '.demaze-fora-left-content {' +
      '  position: relative; z-index: 10; padding: 34px 32px; display: flex; flex-direction: column;' +
      '  justify-content: flex-end; box-sizing: border-box;' +
      '}' +
      '.demaze-fora-stars {' +
      '  display: flex; align-items: center; gap: 4px; color: #F59E0B; font-size: 20px;' +
      '  letter-spacing: 2px; margin-bottom: 16px; line-height: 1;' +
      '  text-shadow: 0 2px 8px rgba(0, 0, 0, 0.4);' +
      '}' +
      '.demaze-fora-quote {' +
      '  font-size: clamp(17px, 1.75vw, 21.5px); font-weight: 500; line-height: 1.42;' +
      '  color: #FFFFFF; margin: 0 0 22px; letter-spacing: -0.01em;' +
      '  font-family: "Stack Sans Headline", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;' +
      '  text-shadow: 0 2px 10px rgba(0, 0, 0, 0.35);' +
      '}' +
      '.demaze-fora-user-name {' +
      '  font-size: 18px; font-weight: 600; color: #FFFFFF; margin: 0 0 3px;' +
      '  font-family: "Stack Sans Headline", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;' +
      '  letter-spacing: -0.01em; text-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);' +
      '}' +
      '.demaze-fora-user-role {' +
      '  font-size: 14.5px; font-weight: 400; color: rgba(255, 255, 255, 0.85); margin: 0;' +
      '  letter-spacing: 0.01em;' +
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
      '  display: inline-flex; align-items: center; padding: 6px 14px; border-radius: 12px;' +
      '  background: #EEECED; color: #18181B; font-size: 13.5px; font-weight: 500;' +
      '  margin-bottom: 20px; align-self: flex-start; border: 1px solid rgba(0, 0, 0, 0.05);' +
      '  backdrop-filter: blur(6px); -webkit-backdrop-filter: blur(6px);' +
      '}' +
      '.demaze-fora-heading {' +
      '  font-size: clamp(36px, 4.2vw, 54px); font-weight: 700; line-height: 1.14;' +
      '  letter-spacing: -0.025em; color: #09090B; margin: 0 0 24px;' +
      '  font-family: "Stack Sans Headline", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;' +
      '}' +
      '.demaze-fora-dim {' +
      '  color: #71717A !important; font-weight: 600;' +
      '}' +
      '.demaze-fora-text {' +
      '  display: flex; flex-direction: column; gap: 14px; max-width: 620px;' +
      '}' +
      '.demaze-fora-text p {' +
      '  font-size: 15.5px; line-height: 1.65; color: #52525B; margin: 0;' +
      '  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;' +
      '}' +

      /* 2 Frosted Glass Stat Cards (Fora AI style) */
      '.demaze-fora-stats {' +
      '  display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-top: 36px; width: 100%;' +
      '}' +
      '.demaze-fora-stat-card {' +
      '  background: rgba(244, 244, 246, 0.88);' +
      '  backdrop-filter: blur(16px); -webkit-backdrop-filter: blur(16px);' +
      '  border: 1px solid rgba(228, 228, 231, 0.85);' +
      '  border-radius: 28px; padding: 26px 24px; box-sizing: border-box;' +
      '  display: flex; flex-direction: column; justify-content: space-between;' +
      '  min-height: 146px;' +
      '  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.02);' +
      '  transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);' +
      '}' +
      '.demaze-fora-stat-card:hover {' +
      '  transform: translateY(-3px);' +
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

  function mountStage(section) {
    var existing = section.querySelector('.' + WRAPPER_CLASS);
    if (existing) return;

    var quoteText =
      (testimonial && testimonial.quote) ||
      "We harness your vision and data to build AI-driven solutions that help your brand stand out and grow revenue. When you thrive, we thrive — and we're with you, executing every step of the way.";
    var authorName = (testimonial && testimonial.name) || "Krupal Chaudhary";
    var authorRole = (testimonial && testimonial.title ? testimonial.title + ", Demaze Technologies" : "Founder & CEO, Demaze Technologies");

    var wrapper = document.createElement('div');
    wrapper.className = WRAPPER_CLASS;

    // Build Left Testimonial Dune Glass Card
    var leftCard = document.createElement('div');
    leftCard.className = 'demaze-fora-left';
    leftCard.innerHTML =
      '<img class="demaze-fora-left-bg" src="https://framerusercontent.com/images/iXJ14TtQhbQPpmn0VgyAV5eBQI.png?width=1800&height=2400" alt="Why Demaze" />' +
      '<div class="demaze-fora-left-gradient"></div>' +
      '<div class="demaze-fora-left-blur"></div>' +
      '<div class="demaze-fora-left-content">' +
      '  <div class="demaze-fora-stars">★★★★★</div>' +
      '  <p class="demaze-fora-quote">"' + quoteText + '"</p>' +
      '  <div class="demaze-fora-user">' +
      '    <div class="demaze-fora-user-name">' + authorName + '</div>' +
      '    <div class="demaze-fora-user-role">' + authorRole + '</div>' +
      '  </div>' +
      '</div>';

    // Build Right Column: Eyebrow + Dual-Tone Title + 3 Paragraphs + 2 Glass Stat Cards
    var rightCol = document.createElement('div');
    rightCol.className = 'demaze-fora-right';
    rightCol.innerHTML =
      '<div class="demaze-fora-right-top">' +
      '  <div class="demaze-fora-eyebrow">Why choose us?</div>' +
      '  <h2 class="demaze-fora-heading">' +
      '    Built to deliver <span class="demaze-fora-dim">results,</span><br class="demaze-fora-br">' +
      '    Not just <span class="demaze-fora-dim">Promises</span>' +
      '  </h2>' +
      '  <div class="demaze-fora-text">' +
      '    <p>Demaze was built for ambitious companies that can\'t afford to lose velocity. Whether you\'re architecting enterprise AI, scaling custom cloud systems, or automating core operations — Demaze steps in and gets it done.</p>' +
      '    <p>We analyze your workflows, eliminate technical bottlenecks, and build production-ready solutions that integrate directly into how your teams operate.</p>' +
      '    <p>Within the first deployment cycle, our partners consistently experience accelerated delivery, reduced overhead, and measurable business growth.</p>' +
      '  </div>' +
      '</div>' +
      '<div class="demaze-fora-stats">' +
      '  <div class="demaze-fora-stat-card">' +
      '    <div class="demaze-fora-stat-value">3X</div>' +
      '    <div class="demaze-fora-stat-content">' +
      '      <div class="demaze-fora-stat-title">Faster Delivery</div>' +
      '      <div class="demaze-fora-stat-sub">in the first deployment cycle</div>' +
      '    </div>' +
      '  </div>' +
      '  <div class="demaze-fora-stat-card">' +
      '    <div class="demaze-fora-stat-value">$10M+</div>' +
      '    <div class="demaze-fora-stat-content">' +
      '      <div class="demaze-fora-stat-title">Client Value Generated</div>' +
      '      <div class="demaze-fora-stat-sub">across 45+ completed projects</div>' +
      '    </div>' +
      '  </div>' +
      '</div>';

    wrapper.appendChild(leftCard);
    wrapper.appendChild(rightCol);

    section.appendChild(wrapper);
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
    return !!(wrapper && left && right && stats && stats.length === 2);
  }

  window.DemazeOverride.run({
    getRoot: getSection,
    isHydrated: isHydrated,
    apply: applyOverride,
    verify: verifyStuck
  });
})();
