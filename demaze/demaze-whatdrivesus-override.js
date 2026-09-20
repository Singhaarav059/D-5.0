/**
 * Post-hydration content override for "What Drives Us" (MOVIQ's "Ai Powered" section).
 *
 * Adapted from Cognira's Use Cases section:
 * - Split header with eyebrow pill, bold display title, and descriptive subtitle.
 * - Sticky navigation sidebar (left) with 4 tab items + "Partner With Us" CTA.
 * - Smooth scroll-spy that dynamically highlights the active tab as cards scroll past.
 * - Click-to-scroll on tabs with smooth offset targeting.
 * - 4 high-end split cards (left: copy, tags, chips; right: bespoke designer UI mockup).
 * - 100% responsive: on tablets & mobile, sidebar adapts to a horizontal sticky pill bar.
 * - Hydration safe: hides native container without deleting nodes.
 */
(function () {
  if (!window.DemazeOverride) return;

  var STYLE_ID = 'demaze-whatdrivesus-cognira-style';

  var PILLARS = [
    {
      id: '01',
      navTitle: 'Autonomous AI & Velocity',
      eyebrow: '01 · AGENTIC VELOCITY',
      title: 'Autonomous Agents.<br>Zero Delivery Lag.',
      description: 'We architect self-healing agent pipelines and generative workflows that compress months of legacy engineering into hours—accelerating time-to-market while strictly preserving enterprise grade verification and safety.',
      chips: ['Autonomous Agents', 'Sub-Second Inference', 'Automated CI/CD'],
      glow: 'radial-gradient(ellipse at center, rgba(99, 102, 241, 0.22) 0%, rgba(13, 14, 20, 0) 70%)',
      accentColor: '#6366f1',
      badgeText: 'LIVE · 142ms',
      fileName: 'agent_runtime.ts',
      mockupType: 'ai'
    },
    {
      id: '02',
      navTitle: 'Extreme Scale & Resilience',
      eyebrow: '02 · HIGH-THROUGHPUT CLOUD',
      title: 'Extreme Scalability.<br>Zero Downtime.',
      description: 'From distributed multi-region Kubernetes clusters to sub-millisecond edge data planes, our architectures are hardened for peak enterprise loads—ensuring uninterrupted SLAs when concurrent traffic spikes 100x.',
      chips: ['Multi-Region Mesh', 'Auto-Scaling Pods', '99.999% SLA'],
      glow: 'radial-gradient(ellipse at center, rgba(6, 182, 212, 0.22) 0%, rgba(13, 14, 20, 0) 70%)',
      accentColor: '#06b6d4',
      badgeText: '99.999% SLA',
      fileName: 'cluster_mesh.k8s',
      mockupType: 'scale'
    },
    {
      id: '03',
      navTitle: 'Relentless Craftsmanship',
      eyebrow: '03 · OBSESSIVE PRECISION',
      title: 'Sub-Millisecond Speed.<br>60 FPS Fluidity.',
      description: 'We reject sloppy defaults and uncalibrated code. Every micro-interaction, database indexing strategy, and WebGL shader is obsessively profiled and benchmarked to deliver instant response and butter-smooth motion.',
      chips: ['60 FPS Fluid UI', 'Zero-Jank WebGL', 'Sub-50ms TTFB'],
      glow: 'radial-gradient(ellipse at center, rgba(16, 185, 129, 0.22) 0%, rgba(13, 14, 20, 0) 70%)',
      accentColor: '#10b981',
      badgeText: 'Lighthouse 100',
      fileName: 'performance_profiler.trace',
      mockupType: 'craft'
    },
    {
      id: '04',
      navTitle: 'Direct Senior Ownership',
      eyebrow: '04 · RADICAL ACCOUNTABILITY',
      title: 'Direct Partnership.<br>Zero Bureaucracy.',
      description: 'No non-technical account managers, no junior delegating. You work directly with principal architects and senior engineers who have skin in the game, deploying production-tested code with absolute ownership.',
      chips: ['Principal Engineers', 'Daily GitOps Deploys', 'Direct Architect Sync'],
      glow: 'radial-gradient(ellipse at center, rgba(245, 158, 11, 0.22) 0%, rgba(13, 14, 20, 0) 70%)',
      accentColor: '#f59e0b',
      badgeText: 'CANARY · VERIFIED',
      fileName: 'gitops_pipeline.yaml',
      mockupType: 'ownership'
    }
  ];

  function ensureStyles() {
    if (document.getElementById(STYLE_ID)) return;
    var style = document.createElement('style');
    style.id = STYLE_ID;
    style.textContent =
      /* Hide native MOVIQ container safely */
      'section[data-framer-name="Ai Powered"] [data-framer-name="Container"] {' +
      '  display: none !important;' +
      '}' +

      /* Section Darkroom Showcase Framing */
      'section[data-framer-name="Ai Powered"] {' +
      '  height: auto !important; min-height: auto !important;' +
      '  padding: 120px 24px 130px !important;' +
      '  overflow: visible !important;' +
      '  background: radial-gradient(circle at 50% 0%, rgba(37, 99, 235, 0.08) 0%, rgba(9, 10, 15, 1) 75%), #090a0f !important;' +
      '  border-top: 1px solid rgba(255, 255, 255, 0.08) !important;' +
      '  border-bottom: 1px solid rgba(255, 255, 255, 0.08) !important;' +
      '  position: relative !important;' +
      '  box-sizing: border-box !important;' +
      '  color: #ffffff !important;' +
      '}' +

      /* Outer Wrapper */
      '.demaze-drives-wrapper {' +
      '  width: 100%; max-width: 1240px; margin: 0 auto; box-sizing: border-box; position: relative;' +
      '}' +

      /* Split Section Header (Cognira style) */
      '.demaze-drives-header {' +
      '  display: flex; justify-content: space-between; align-items: flex-end;' +
      '  margin-bottom: 56px; gap: 32px;' +
      '}' +
      '.demaze-drives-header-left { flex: 1; min-width: 0; }' +
      '.demaze-drives-eyebrow {' +
      '  display: inline-flex; align-items: center; gap: 8px;' +
      '  padding: 5px 14px; border-radius: 999px;' +
      '  background: rgba(255, 255, 255, 0.06); border: 1px solid rgba(255, 255, 255, 0.12);' +
      '  color: rgba(255, 255, 255, 0.85); font-size: 11.5px; font-weight: 600;' +
      '  letter-spacing: 0.06em; text-transform: uppercase; margin-bottom: 16px;' +
      '}' +
      '.demaze-drives-eyebrow-dot {' +
      '  width: 6px; height: 6px; border-radius: 50%; background: #3b82f6;' +
      '  box-shadow: 0 0 10px #3b82f6;' +
      '}' +
      '.demaze-drives-title {' +
      '  font-size: clamp(32px, 3.8vw, 48px); font-weight: 700; line-height: 1.15;' +
      '  color: #ffffff; letter-spacing: -0.025em; margin: 0;' +
      '  font-family: "Stack Sans Headline", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;' +
      '}' +
      '.demaze-drives-header-right {' +
      '  max-width: 440px; flex-shrink: 0; padding-bottom: 6px;' +
      '}' +
      '.demaze-drives-subtitle {' +
      '  font-size: 15px; line-height: 1.6; color: rgba(255, 255, 255, 0.65);' +
      '  margin: 0; font-weight: 400;' +
      '}' +

      /* Split Body (Sticky Sidebar + Cards) */
      '.demaze-drives-body {' +
      '  display: flex; gap: 48px; align-items: flex-start; position: relative;' +
      '}' +

      /* Sticky Sidebar */
      '.demaze-drives-sidebar {' +
      '  width: 250px; position: sticky; top: 120px; flex-shrink: 0;' +
      '  display: flex; flex-direction: column; gap: 14px; z-index: 10;' +
      '}' +
      '.demaze-drives-nav {' +
      '  background: #0f1015; border: 1px solid rgba(255, 255, 255, 0.08);' +
      '  border-radius: 18px; padding: 6px;' +
      '  box-shadow: 0 12px 36px rgba(0, 0, 0, 0.4);' +
      '  display: flex; flex-direction: column; gap: 4px;' +
      '}' +
      '.demaze-drives-tab {' +
      '  display: flex; align-items: center; gap: 10px; padding: 13px 14px;' +
      '  border-radius: 12px; border: 1px solid transparent;' +
      '  background: transparent; color: rgba(255, 255, 255, 0.55);' +
      '  font-size: 13px; font-weight: 500; text-align: left;' +
      '  cursor: pointer; transition: all 0.22s cubic-bezier(0.16, 1, 0.3, 1);' +
      '  width: 100%; box-sizing: border-box; outline: none; font-family: inherit;' +
      '}' +
      '.demaze-drives-tab:hover {' +
      '  color: rgba(255, 255, 255, 0.9); background: rgba(255, 255, 255, 0.04);' +
      '}' +
      '.demaze-drives-tab.is-active {' +
      '  background: rgba(255, 255, 255, 0.10); color: #ffffff;' +
      '  border-color: rgba(255, 255, 255, 0.12); font-weight: 600;' +
      '  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.35);' +
      '}' +
      '.demaze-drives-tab-dot {' +
      '  width: 6px; height: 6px; border-radius: 50%;' +
      '  background: rgba(255, 255, 255, 0.3); flex-shrink: 0;' +
      '  transition: all 0.22s ease;' +
      '}' +
      '.demaze-drives-tab.is-active .demaze-drives-tab-dot {' +
      '  background: #3b82f6; box-shadow: 0 0 8px #3b82f6;' +
      '}' +
      '.demaze-drives-tab-text { white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }' +

      /* Sidebar CTA Button */
      '.demaze-drives-cta {' +
      '  display: flex; align-items: center; justify-content: center; gap: 8px;' +
      '  width: 100%; padding: 12px 20px; border-radius: 999px;' +
      '  background: #ffffff; color: #0a0b10; font-size: 13px; font-weight: 600;' +
      '  text-decoration: none; box-sizing: border-box;' +
      '  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.2);' +
      '  transition: transform 0.2s ease, box-shadow 0.2s ease, background-color 0.2s ease;' +
      '}' +
      '.demaze-drives-cta:hover {' +
      '  background: #f1f5f9; transform: translateY(-2px);' +
      '  box-shadow: 0 10px 28px rgba(255, 255, 255, 0.22);' +
      '}' +

      /* Cards Column */
      '.demaze-drives-cards {' +
      '  flex: 1; min-width: 0; display: flex; flex-direction: column; gap: 32px;' +
      '}' +

      /* Individual Split Card */
      '.demaze-drives-card {' +
      '  background: #0f1015; border: 1px solid rgba(255, 255, 255, 0.08);' +
      '  border-radius: 32px; padding: 34px 36px;' +
      '  display: flex; align-items: stretch; gap: 36px;' +
      '  box-sizing: border-box; position: relative; overflow: hidden;' +
      '  box-shadow: 0 16px 40px rgba(0, 0, 0, 0.35);' +
      '  transition: border-color 0.3s ease, box-shadow 0.3s ease, transform 0.3s ease;' +
      '}' +
      '.demaze-drives-card:hover {' +
      '  border-color: rgba(255, 255, 255, 0.16);' +
      '  box-shadow: 0 24px 60px rgba(0, 0, 0, 0.5);' +
      '}' +

      /* Card Left: Copy & Chips */
      '.demaze-card-left {' +
      '  flex: 1; min-width: 0; display: flex; flex-direction: column;' +
      '  justify-content: space-between; z-index: 2;' +
      '}' +
      '.demaze-card-tag {' +
      '  font-size: 11px; font-weight: 700; letter-spacing: 0.08em;' +
      '  text-transform: uppercase; color: rgba(255, 255, 255, 0.45);' +
      '  margin-bottom: 14px; display: flex; align-items: center; gap: 7px;' +
      '}' +
      '.demaze-card-tag-dot {' +
      '  width: 5px; height: 5px; border-radius: 50%; background: #3b82f6;' +
      '}' +
      '.demaze-card-title {' +
      '  font-size: clamp(24px, 2.5vw, 30px); font-weight: 700; line-height: 1.18;' +
      '  color: #ffffff; margin: 0 0 14px;' +
      '  font-family: "Stack Sans Headline", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;' +
      '  letter-spacing: -0.015em;' +
      '}' +
      '.demaze-card-desc {' +
      '  font-size: 14px; line-height: 1.62; color: rgba(255, 255, 255, 0.65);' +
      '  margin: 0 0 28px; font-weight: 400;' +
      '}' +
      '.demaze-card-chips {' +
      '  display: flex; flex-wrap: wrap; gap: 8px; margin-top: auto;' +
      '}' +
      '.demaze-card-chip {' +
      '  display: inline-flex; align-items: center; gap: 6px;' +
      '  padding: 6px 13px; border-radius: 999px;' +
      '  background: rgba(255, 255, 255, 0.05); border: 1px solid rgba(255, 255, 255, 0.10);' +
      '  color: rgba(255, 255, 255, 0.85); font-size: 11.5px; font-weight: 500;' +
      '  transition: all 0.2s ease;' +
      '}' +
      '.demaze-card-chip:hover {' +
      '  background: rgba(255, 255, 255, 0.10); border-color: rgba(255, 255, 255, 0.2);' +
      '  color: #ffffff; transform: translateY(-1px);' +
      '}' +

      /* Card Right: High-End UI Mockup */
      '.demaze-card-right {' +
      '  flex: 1.15; min-width: 0; display: flex; align-items: center;' +
      '  justify-content: center; position: relative; border-radius: 22px;' +
      '  overflow: hidden; padding: 20px; box-sizing: border-box;' +
      '  background: rgba(0, 0, 0, 0.35); border: 1px solid rgba(255, 255, 255, 0.04);' +
      '}' +
      '.demaze-card-glow {' +
      '  position: absolute; inset: 0; pointer-events: none; z-index: 1;' +
      '}' +

      /* UI Window Mockup */
      '.demaze-mockup-window {' +
      '  width: 100%; border-radius: 16px; position: relative; z-index: 2;' +
      '  background: rgba(15, 16, 22, 0.92); border: 1px solid rgba(255, 255, 255, 0.11);' +
      '  backdrop-filter: blur(14px); -webkit-backdrop-filter: blur(14px);' +
      '  box-shadow: 0 16px 40px rgba(0, 0, 0, 0.6);' +
      '  display: flex; flex-direction: column; overflow: hidden;' +
      '}' +
      '.demaze-mockup-header {' +
      '  display: flex; align-items: center; justify-content: space-between;' +
      '  padding: 10px 14px; border-bottom: 1px solid rgba(255, 255, 255, 0.07);' +
      '  background: rgba(255, 255, 255, 0.02);' +
      '}' +
      '.demaze-mockup-dots {' +
      '  display: flex; align-items: center; gap: 5px;' +
      '}' +
      '.demaze-mockup-dot {' +
      '  width: 9px; height: 9px; border-radius: 50%; display: inline-block;' +
      '}' +
      '.demaze-mockup-dot.red { background: #ef4444; }' +
      '.demaze-mockup-dot.yellow { background: #f59e0b; }' +
      '.demaze-mockup-dot.green { background: #10b981; }' +
      '.demaze-mockup-file {' +
      '  font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;' +
      '  font-size: 11px; color: rgba(255, 255, 255, 0.6);' +
      '}' +
      '.demaze-mockup-badge {' +
      '  display: inline-flex; align-items: center; gap: 6px; padding: 2px 8px;' +
      '  border-radius: 6px; border: 1px solid transparent;' +
      '  font-size: 10px; font-weight: 700; letter-spacing: 0.06em;' +
      '}' +
      '.demaze-mockup-pulse {' +
      '  width: 5px; height: 5px; border-radius: 50%; background: currentColor;' +
      '  box-shadow: 0 0 6px currentColor;' +
      '  animation: demazePulse 1.8s infinite ease-in-out;' +
      '}' +
      '@keyframes demazePulse {' +
      '  0%, 100% { transform: scale(0.9); opacity: 0.7; }' +
      '  50% { transform: scale(1.3); opacity: 1; }' +
      '}' +
      '.demaze-mockup-body {' +
      '  padding: 14px 16px; font-family: ui-monospace, SFMono-Regular, Menlo, monospace;' +
      '  font-size: 11.5px; line-height: 1.6; color: rgba(255, 255, 255, 0.75);' +
      '}' +
      '.demaze-mockup-footer {' +
      '  display: grid; grid-template-columns: repeat(3, 1fr); gap: 8px;' +
      '  padding: 10px 14px; border-top: 1px solid rgba(255, 255, 255, 0.07);' +
      '  background: rgba(0, 0, 0, 0.25);' +
      '}' +
      '.demaze-stat-col { display: flex; flex-direction: column; gap: 2px; }' +
      '.demaze-stat-label {' +
      '  font-size: 8.5px; font-weight: 700; letter-spacing: 0.08em;' +
      '  text-transform: uppercase; color: rgba(255, 255, 255, 0.4);' +
      '}' +
      '.demaze-stat-val {' +
      '  font-size: 12px; font-weight: 700; color: #ffffff;' +
      '  font-family: ui-monospace, SFMono-Regular, Menlo, monospace;' +
      '}' +
      '.text-green { color: #10b981 !important; }' +
      '.text-cyan { color: #06b6d4 !important; }' +
      '.text-accent { color: #818cf8 !important; }' +
      '.text-amber { color: #f59e0b !important; }' +

      /* Syntax Highlighting for Code Mockups */
      '.c-kw { color: #c084fc; font-weight: 600; }' +
      '.c-var { color: #67e8f9; }' +
      '.c-fn { color: #60a5fa; }' +
      '.c-prop { color: #cbd5e1; }' +
      '.c-str { color: #34d399; }' +
      '.c-num { color: #f472b6; }' +
      '.c-bool { color: #fb923c; }' +
      '.demaze-code-line { margin: 2px 0; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }' +
      '.demaze-code-line.indent { padding-left: 14px; }' +

      /* Mockup 2 (Cluster Nodes) */
      '.demaze-node-item { margin-bottom: 9px; }' +
      '.demaze-node-item:last-child { margin-bottom: 0; }' +
      '.demaze-node-info {' +
      '  display: flex; justify-content: space-between; align-items: center;' +
      '  font-size: 11px; margin-bottom: 4px; font-family: ui-monospace, SFMono-Regular, monospace;' +
      '}' +
      '.demaze-node-name { color: #ffffff; font-weight: 600; }' +
      '.demaze-node-stat { color: rgba(255, 255, 255, 0.5); font-size: 10px; }' +
      '.demaze-node-bar {' +
      '  height: 5px; border-radius: 999px; background: rgba(255, 255, 255, 0.08);' +
      '  overflow: hidden; position: relative;' +
      '}' +
      '.demaze-node-fill {' +
      '  height: 100%; border-radius: 999px; background: linear-gradient(90deg, #0284c7, #06b6d4);' +
      '}' +

      /* Mockup 3 (Frame Profiler) */
      '.demaze-fps-header {' +
      '  display: flex; justify-content: space-between; align-items: center;' +
      '  font-size: 10px; font-weight: 700; letter-spacing: 0.06em;' +
      '  margin-bottom: 12px; color: rgba(255, 255, 255, 0.5);' +
      '}' +
      '.demaze-fps-timeline {' +
      '  display: flex; align-items: flex-end; gap: 8px; height: 54px;' +
      '  padding: 4px 6px; background: rgba(0, 0, 0, 0.35); border-radius: 8px;' +
      '  border: 1px solid rgba(255, 255, 255, 0.05);' +
      '}' +
      '.demaze-fps-bar {' +
      '  flex: 1; border-radius: 3px 3px 0 0;' +
      '  background: linear-gradient(to top, rgba(16, 185, 129, 0.4), #10b981);' +
      '  position: relative; display: flex; justify-content: center;' +
      '}' +
      '.demaze-fps-val {' +
      '  position: absolute; top: -14px; font-size: 8.5px; color: #10b981;' +
      '  font-family: ui-monospace, SFMono-Regular, monospace; font-weight: 700;' +
      '}' +

      /* Mockup 4 (GitOps Canary) */
      '.demaze-commit-row {' +
      '  display: flex; align-items: center; gap: 10px; padding: 7px 0;' +
      '  border-bottom: 1px solid rgba(255, 255, 255, 0.05);' +
      '}' +
      '.demaze-commit-row:last-child { border-bottom: none; }' +
      '.demaze-commit-dot {' +
      '  width: 7px; height: 7px; border-radius: 50%; background: #f59e0b;' +
      '  box-shadow: 0 0 6px #f59e0b; flex-shrink: 0;' +
      '}' +
      '.demaze-commit-info { flex: 1; min-width: 0; }' +
      '.demaze-commit-title {' +
      '  font-size: 11px; font-weight: 600; color: #ffffff;' +
      '  white-space: nowrap; overflow: hidden; text-overflow: ellipsis;' +
      '}' +
      '.demaze-commit-meta { font-size: 9.5px; color: rgba(255, 255, 255, 0.45); }' +
      '.demaze-commit-status {' +
      '  font-size: 10px; font-weight: 700; padding: 2px 7px; border-radius: 4px;' +
      '  background: rgba(16, 185, 129, 0.12); border: 1px solid rgba(16, 185, 129, 0.25);' +
      '}' +

      /* Responsive Rules */
      '@media (max-width: 1024px) {' +
      '  section[data-framer-name="Ai Powered"] { padding: 100px 20px 80px !important; }' +
      '  .demaze-drives-header {' +
      '    flex-direction: column; align-items: flex-start; gap: 14px; margin-bottom: 32px;' +
      '  }' +
      '  .demaze-drives-body {' +
      '    flex-direction: column; gap: 24px;' +
      '  }' +
      '  .demaze-drives-sidebar {' +
      '    width: 100%; position: sticky; top: 75px; z-index: 100;' +
      '    flex-direction: row; align-items: center; gap: 10px;' +
      '  }' +
      '  .demaze-drives-nav {' +
      '    flex-direction: row; overflow-x: auto; width: 100%;' +
      '    -webkit-overflow-scrolling: touch; padding: 6px; gap: 6px;' +
      '    background: rgba(15, 16, 21, 0.94); backdrop-filter: blur(20px); -webkit-backdrop-filter: blur(20px);' +
      '    scrollbar-width: none; -ms-overflow-style: none;' +
      '  }' +
      '  .demaze-drives-nav::-webkit-scrollbar { display: none; }' +
      '  .demaze-drives-tab {' +
      '    flex: 0 0 auto !important; width: auto !important; padding: 9px 15px; font-size: 12px;' +
      '  }' +
      '  .demaze-drives-cta { display: none; }' +
      '  .demaze-drives-card {' +
      '    flex-direction: column; padding: 26px 22px; gap: 24px; border-radius: 24px;' +
      '  }' +
      '  .demaze-card-right {' +
      '    padding: 14px; border-radius: 16px;' +
      '  }' +
      '}' +
      '@media (max-width: 640px) {' +
      '  .demaze-drives-title { font-size: 28px !important; }' +
      '  .demaze-card-title { font-size: 22px !important; }' +
      '  .demaze-mockup-footer { grid-template-columns: 1fr 1fr; }' +
      '  .demaze-mockup-footer .demaze-stat-col:last-child { display: none; }' +
      '}';

    document.head.appendChild(style);
  }

  function createMockupHTML(pillar) {
    if (pillar.mockupType === 'ai') {
      return (
        '<div class="demaze-card-glow" style="background:' + pillar.glow + '"></div>' +
        '<div class="demaze-mockup-window">' +
        '  <div class="demaze-mockup-header">' +
        '    <div class="demaze-mockup-dots">' +
        '      <span class="demaze-mockup-dot red"></span>' +
        '      <span class="demaze-mockup-dot yellow"></span>' +
        '      <span class="demaze-mockup-dot green"></span>' +
        '    </div>' +
        '    <div class="demaze-mockup-file">' + pillar.fileName + '</div>' +
        '    <div class="demaze-mockup-badge text-green" style="background:rgba(16,185,129,0.12);border-color:rgba(16,185,129,0.3)">' +
        '      <span class="demaze-mockup-pulse"></span>' +
        '      <span>' + pillar.badgeText + '</span>' +
        '    </div>' +
        '  </div>' +
        '  <div class="demaze-mockup-body">' +
        '    <div class="demaze-code-line"><span class="c-kw">const</span> <span class="c-var">engine</span> = <span class="c-kw">new</span> <span class="c-fn">AgentPipeline</span>({</div>' +
        '    <div class="demaze-code-line indent"><span class="c-prop">mode:</span> <span class="c-str">\'parallel-synthesis\'</span>,</div>' +
        '    <div class="demaze-code-line indent"><span class="c-prop">concurrency:</span> <span class="c-num">64</span>,</div>' +
        '    <div class="demaze-code-line indent"><span class="c-prop">verifyProof:</span> <span class="c-bool">true</span></div>' +
        '    <div class="demaze-code-line">});</div>' +
        '    <div class="demaze-code-line"><span class="c-kw">await</span> <span class="c-var">engine</span>.<span class="c-fn">dispatch</span>({ <span class="c-prop">target:</span> <span class="c-str">\'prod-mesh\'</span> });</div>' +
        '  </div>' +
        '  <div class="demaze-mockup-footer">' +
        '    <div class="demaze-stat-col">' +
        '      <div class="demaze-stat-label">THROUGHPUT</div>' +
        '      <div class="demaze-stat-val">1,840 req/s</div>' +
        '    </div>' +
        '    <div class="demaze-stat-col">' +
        '      <div class="demaze-stat-label">LATENCY</div>' +
        '      <div class="demaze-stat-val text-accent">38ms</div>' +
        '    </div>' +
        '    <div class="demaze-stat-col">' +
        '      <div class="demaze-stat-label">SAFETY SCORE</div>' +
        '      <div class="demaze-stat-val text-green">99.98%</div>' +
        '    </div>' +
        '  </div>' +
        '</div>'
      );
    }

    if (pillar.mockupType === 'scale') {
      return (
        '<div class="demaze-card-glow" style="background:' + pillar.glow + '"></div>' +
        '<div class="demaze-mockup-window">' +
        '  <div class="demaze-mockup-header">' +
        '    <div class="demaze-mockup-dots">' +
        '      <span class="demaze-mockup-dot red"></span>' +
        '      <span class="demaze-mockup-dot yellow"></span>' +
        '      <span class="demaze-mockup-dot green"></span>' +
        '    </div>' +
        '    <div class="demaze-mockup-file">' + pillar.fileName + '</div>' +
        '    <div class="demaze-mockup-badge text-cyan" style="background:rgba(6,182,212,0.12);border-color:rgba(6,182,212,0.3)">' +
        '      <span class="demaze-mockup-pulse"></span>' +
        '      <span>' + pillar.badgeText + '</span>' +
        '    </div>' +
        '  </div>' +
        '  <div class="demaze-mockup-body">' +
        '    <div class="demaze-node-item">' +
        '      <div class="demaze-node-info">' +
        '        <span class="demaze-node-name">US-East (Primary)</span>' +
        '        <span class="demaze-node-stat">42 Pods · 18ms</span>' +
        '      </div>' +
        '      <div class="demaze-node-bar"><div class="demaze-node-fill" style="width:88%"></div></div>' +
        '    </div>' +
        '    <div class="demaze-node-item">' +
        '      <div class="demaze-node-info">' +
        '        <span class="demaze-node-name">EU-Central</span>' +
        '        <span class="demaze-node-stat">32 Pods · 24ms</span>' +
        '      </div>' +
        '      <div class="demaze-node-bar"><div class="demaze-node-fill" style="width:76%"></div></div>' +
        '    </div>' +
        '    <div class="demaze-node-item">' +
        '      <div class="demaze-node-info">' +
        '        <span class="demaze-node-name">AP-South</span>' +
        '        <span class="demaze-node-stat">28 Pods · 31ms</span>' +
        '      </div>' +
        '      <div class="demaze-node-bar"><div class="demaze-node-fill" style="width:64%"></div></div>' +
        '    </div>' +
        '  </div>' +
        '  <div class="demaze-mockup-footer">' +
        '    <div class="demaze-stat-col">' +
        '      <div class="demaze-stat-label">CLUSTER LOAD</div>' +
        '      <div class="demaze-stat-val">2.4M req/m</div>' +
        '    </div>' +
        '    <div class="demaze-stat-col">' +
        '      <div class="demaze-stat-label">FAILOVER</div>' +
        '      <div class="demaze-stat-val text-green">Auto-Engaged</div>' +
        '    </div>' +
        '    <div class="demaze-stat-col">' +
        '      <div class="demaze-stat-label">PACKET LOSS</div>' +
        '      <div class="demaze-stat-val text-cyan">0.000%</div>' +
        '    </div>' +
        '  </div>' +
        '</div>'
      );
    }

    if (pillar.mockupType === 'craft') {
      return (
        '<div class="demaze-card-glow" style="background:' + pillar.glow + '"></div>' +
        '<div class="demaze-mockup-window">' +
        '  <div class="demaze-mockup-header">' +
        '    <div class="demaze-mockup-dots">' +
        '      <span class="demaze-mockup-dot red"></span>' +
        '      <span class="demaze-mockup-dot yellow"></span>' +
        '      <span class="demaze-mockup-dot green"></span>' +
        '    </div>' +
        '    <div class="demaze-mockup-file">' + pillar.fileName + '</div>' +
        '    <div class="demaze-mockup-badge text-green" style="background:rgba(16,185,129,0.12);border-color:rgba(16,185,129,0.3)">' +
        '      <span class="demaze-mockup-pulse"></span>' +
        '      <span>' + pillar.badgeText + '</span>' +
        '    </div>' +
        '  </div>' +
        '  <div class="demaze-mockup-body">' +
        '    <div class="demaze-fps-header">' +
        '      <span>FRAME RENDER (16.6ms BUDGET)</span>' +
        '      <span class="text-green">60 FPS LOCKED</span>' +
        '    </div>' +
        '    <div class="demaze-fps-timeline">' +
        '      <div class="demaze-fps-bar" style="height:26px"><span class="demaze-fps-val">3.4ms</span></div>' +
        '      <div class="demaze-fps-bar" style="height:30px"><span class="demaze-fps-val">3.8ms</span></div>' +
        '      <div class="demaze-fps-bar" style="height:24px"><span class="demaze-fps-val">3.1ms</span></div>' +
        '      <div class="demaze-fps-bar" style="height:34px"><span class="demaze-fps-val">4.2ms</span></div>' +
        '      <div class="demaze-fps-bar" style="height:28px"><span class="demaze-fps-val">3.5ms</span></div>' +
        '      <div class="demaze-fps-bar" style="height:25px"><span class="demaze-fps-val">3.2ms</span></div>' +
        '    </div>' +
        '  </div>' +
        '  <div class="demaze-mockup-footer">' +
        '    <div class="demaze-stat-col">' +
        '      <div class="demaze-stat-label">LCP SPEED</div>' +
        '      <div class="demaze-stat-val text-green">0.52s</div>' +
        '    </div>' +
        '    <div class="demaze-stat-col">' +
        '      <div class="demaze-stat-label">INPUT DELAY</div>' +
        '      <div class="demaze-stat-val text-green">8ms</div>' +
        '    </div>' +
        '    <div class="demaze-stat-col">' +
        '      <div class="demaze-stat-label">LAYOUT SHIFT</div>' +
        '      <div class="demaze-stat-val text-green">0.000</div>' +
        '    </div>' +
        '  </div>' +
        '</div>'
      );
    }

    if (pillar.mockupType === 'ownership') {
      return (
        '<div class="demaze-card-glow" style="background:' + pillar.glow + '"></div>' +
        '<div class="demaze-mockup-window">' +
        '  <div class="demaze-mockup-header">' +
        '    <div class="demaze-mockup-dots">' +
        '      <span class="demaze-mockup-dot red"></span>' +
        '      <span class="demaze-mockup-dot yellow"></span>' +
        '      <span class="demaze-mockup-dot green"></span>' +
        '    </div>' +
        '    <div class="demaze-mockup-file">' + pillar.fileName + '</div>' +
        '    <div class="demaze-mockup-badge text-amber" style="background:rgba(245,158,11,0.12);border-color:rgba(245,158,11,0.3)">' +
        '      <span class="demaze-mockup-pulse"></span>' +
        '      <span>' + pillar.badgeText + '</span>' +
        '    </div>' +
        '  </div>' +
        '  <div class="demaze-mockup-body">' +
        '    <div class="demaze-commit-row">' +
        '      <div class="demaze-commit-dot"></div>' +
        '      <div class="demaze-commit-info">' +
        '        <div class="demaze-commit-title">feat(core): canary rollout v4.2</div>' +
        '        <div class="demaze-commit-meta">Commit <span class="text-accent">#e48b29f</span> · Verified by Principal SRE</div>' +
        '      </div>' +
        '      <div class="demaze-commit-status text-green">PASSED</div>' +
        '    </div>' +
        '    <div class="demaze-commit-row">' +
        '      <div class="demaze-commit-dot"></div>' +
        '      <div class="demaze-commit-info">' +
        '        <div class="demaze-commit-title">arch(edge): zero-downtime switch</div>' +
        '        <div class="demaze-commit-meta">Automated Rollback Guard · 0 incidents</div>' +
        '      </div>' +
        '      <div class="demaze-commit-status text-green">ACTIVE</div>' +
        '    </div>' +
        '  </div>' +
        '  <div class="demaze-mockup-footer">' +
        '    <div class="demaze-stat-col">' +
        '      <div class="demaze-stat-label">SRE OWNERSHIP</div>' +
        '      <div class="demaze-stat-val">Direct Sync</div>' +
        '    </div>' +
        '    <div class="demaze-stat-col">' +
        '      <div class="demaze-stat-label">INCIDENT SLA</div>' +
        '      <div class="demaze-stat-val text-green">&lt; 15 mins</div>' +
        '    </div>' +
        '    <div class="demaze-stat-col">' +
        '      <div class="demaze-stat-label">DEPLOY CADENCE</div>' +
        '      <div class="demaze-stat-val">Daily CI/CD</div>' +
        '    </div>' +
        '  </div>' +
        '</div>'
      );
    }

    return '';
  }

  function bindScrollSpyAndNavigation(wrapper) {
    var tabs = wrapper.querySelectorAll('.demaze-drives-tab');
    var cards = wrapper.querySelectorAll('.demaze-drives-card');
    if (!tabs.length || !cards.length) return;

    var currentActive = -1;
    var isTicking = false;

    function updateActiveTab() {
      // Find card that intersects best with the eye-line (~35% of viewport height)
      var viewportFocusY = window.innerHeight * 0.36;
      var activeIndex = 0;
      var minDistance = Infinity;

      for (var i = 0; i < cards.length; i++) {
        var rect = cards[i].getBoundingClientRect();
        var distance = Math.abs(rect.top - viewportFocusY);
        if (rect.top <= viewportFocusY + 120 && rect.bottom >= viewportFocusY - 120) {
          if (distance < minDistance) {
            minDistance = distance;
            activeIndex = i;
          }
        }
      }

      if (activeIndex !== currentActive) {
        currentActive = activeIndex;
        for (var t = 0; t < tabs.length; t++) {
          if (t === activeIndex) {
            tabs[t].classList.add('is-active');
            if (window.innerWidth <= 1024 && tabs[t].parentElement) {
              var parent = tabs[t].parentElement;
              var tabLeft = tabs[t].offsetLeft - parent.offsetLeft;
              parent.scrollTo({ left: tabLeft - 30, behavior: 'smooth' });
            }
          } else {
            tabs[t].classList.remove('is-active');
          }
        }
      }
    }

    function onScroll() {
      if (!isTicking) {
        isTicking = true;
        requestAnimationFrame(function () {
          updateActiveTab();
          isTicking = false;
        });
      }
    }

    window.addEventListener('scroll', onScroll, { passive: true });
    if (window.lenis && typeof window.lenis.on === 'function') {
      window.lenis.on('scroll', onScroll);
    }

    // Click to scroll
    tabs.forEach(function (tab, idx) {
      tab.addEventListener('click', function (e) {
        e.preventDefault();
        var targetCard = cards[idx];
        if (!targetCard) return;

        var headerOffset = window.innerWidth <= 1024 ? 140 : 120;
        var cardRect = targetCard.getBoundingClientRect();
        var targetY = window.pageYOffset + cardRect.top - headerOffset;

        if (window.lenis && typeof window.lenis.scrollTo === 'function') {
          window.lenis.scrollTo(targetY, { duration: 0.75 });
        } else {
          window.scrollTo({ top: targetY, behavior: 'smooth' });
        }
      });
    });

    // Initial check
    updateActiveTab();
  }

  function mountStage(section) {
    // Hide native React container safely
    var nativeContainer = section.querySelector('[data-framer-name="Container"]');
    if (nativeContainer) {
      nativeContainer.style.setProperty('display', 'none', 'important');
    }

    if (section.querySelector('.demaze-drives-wrapper')) {
      return;
    }

    var wrapper = document.createElement('div');
    wrapper.className = 'demaze-drives-wrapper';

    // Header (Cognira style split layout)
    var header = document.createElement('div');
    header.className = 'demaze-drives-header';
    header.innerHTML =
      '<div class="demaze-drives-header-left">' +
      '  <div class="demaze-drives-eyebrow">' +
      '    <span class="demaze-drives-eyebrow-dot"></span>' +
      '    <span>What Drives Us</span>' +
      '  </div>' +
      '  <h2 class="demaze-drives-title">' +
      '    Engineering Principles.<br>' +
      '    Relentless Execution.' +
      '  </h2>' +
      '</div>' +
      '<div class="demaze-drives-header-right">' +
      '  <p class="demaze-drives-subtitle">' +
      '    How we build at Demaze Technologies: zero compromise on architecture, radical transparency in execution, and software engineered for compounding scale.' +
      '  </p>' +
      '</div>';
    wrapper.appendChild(header);

    // Body (Split Sidebar + Cards Stack)
    var body = document.createElement('div');
    body.className = 'demaze-drives-body';

    // Sticky Sidebar
    var sidebar = document.createElement('aside');
    sidebar.className = 'demaze-drives-sidebar';

    var nav = document.createElement('div');
    nav.className = 'demaze-drives-nav';

    PILLARS.forEach(function (p, idx) {
      var btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'demaze-drives-tab' + (idx === 0 ? ' is-active' : '');
      btn.dataset.tabTarget = idx;
      btn.innerHTML =
        '<span class="demaze-drives-tab-dot"></span>' +
        '<span class="demaze-drives-tab-text">' + p.navTitle + '</span>';
      nav.appendChild(btn);
    });

    sidebar.appendChild(nav);

    // Action button
    var cta = document.createElement('a');
    cta.className = 'demaze-drives-cta';
    cta.href = './contact';
    cta.innerHTML =
      '<span>Partner With Us</span>' +
      '<svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">' +
      '  <path d="M3.33 8h9.34M8 3.33 12.67 8 8 12.67"/>' +
      '</svg>';
    sidebar.appendChild(cta);

    body.appendChild(sidebar);

    // Cards Column
    var cardsCol = document.createElement('div');
    cardsCol.className = 'demaze-drives-cards';

    PILLARS.forEach(function (pillar, idx) {
      var card = document.createElement('div');
      card.className = 'demaze-drives-card';
      card.dataset.cardIndex = idx;

      var chipsHTML = pillar.chips.map(function (c) {
        return '<span class="demaze-card-chip">' + c + '</span>';
      }).join('');

      card.innerHTML =
        '<div class="demaze-card-left">' +
        '  <div>' +
        '    <div class="demaze-card-tag">' +
        '      <span class="demaze-card-tag-dot"></span>' +
        '      <span>' + pillar.eyebrow + '</span>' +
        '    </div>' +
        '    <h3 class="demaze-card-title">' + pillar.title + '</h3>' +
        '    <p class="demaze-card-desc">' + pillar.description + '</p>' +
        '  </div>' +
        '  <div class="demaze-card-chips">' + chipsHTML + '</div>' +
        '</div>' +
        '<div class="demaze-card-right">' +
        createMockupHTML(pillar) +
        '</div>';

      cardsCol.appendChild(card);
    });

    body.appendChild(cardsCol);
    wrapper.appendChild(body);
    section.appendChild(wrapper);

    bindScrollSpyAndNavigation(wrapper);
  }

  function getSection() {
    return document.querySelector('section[data-framer-name="Ai Powered"]');
  }

  function isHydrated(section) {
    return !!section;
  }

  function applyOverride(section) {
    ensureStyles();
    mountStage(section);
  }

  function verifyStuck(section) {
    var cards = section && section.querySelectorAll('.demaze-drives-card');
    return !!(cards && cards.length === 4);
  }

  window.DemazeOverride.run({
    getRoot: getSection,
    isHydrated: isHydrated,
    apply: applyOverride,
    verify: verifyStuck
  });
})();
