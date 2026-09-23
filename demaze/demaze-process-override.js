/**
 * Engineering Systems: Connected Intelligence, Built for Production
 * (Post-hydration content override for section[data-framer-name="Videos making Step"], Order: 3)
 *
 * Repurposes the spatial/orbital connected visual system into a Demaze-specific
 * interactive engineering architecture section.
 *
 * Features:
 * - 100% verified Demaze engineering stack (OpenAI, Hugging Face, LangChain, Python,
 *   TensorFlow, Pinecone, Apache Kafka, Elasticsearch).
 * - Central Demaze Production Runtime Core with subtle ambient status pulse.
 * - Dual concentric orbital tracks (Inner: Core AI & Orchestration, Outer: Data, Streaming & Open Transformers).
 * - Counter-rotating nodes ensuring technology logos remain upright at all times.
 * - Interactive hover & touch inspection: reveals exact approved P1.7 role and architectural function.
 * - Conceptual flow bar: AI Models → Orchestration → Data & ML → Streaming & Search → Production Systems.
 * - Performance hardened: pauses CSS animations when offscreen via IntersectionObserver;
 *   prefers-reduced-motion compliant; 0 horizontal overflow across 1440px, 768px, and 375px.
 */
(function () {
  if (!window.DemazeOverride) return;

  var STYLE_ID = 'demaze-engineering-systems-style';
  var BLOCK_ID = 'demaze-engineering-systems-block';

  var FALLBACK_SYSTEMS = {
    eyebrow: 'ENGINEERING SYSTEMS',
    heading: 'Connected Intelligence, Built for Production',
    subtitle:
      'How Demaze connects foundation AI models, orchestration frameworks, and real-time data infrastructure into resilient production software.',
    conceptualFlow: [
      { step: '01', label: 'AI Models' },
      { step: '02', label: 'Orchestration' },
      { step: '03', label: 'Data & ML' },
      { step: '04', label: 'Streaming & Search' },
      { step: '05', label: 'Production Systems' }
    ],
    technologies: [
      {
        id: 'openai',
        name: 'OpenAI',
        role: 'Large Language Models',
        layer: 'AI Models',
        orbit: 'inner',
        angle: 0,
        icon: 'https://framerusercontent.com/images/XkdawulL9cthX7AFF1LI4bXv0o.png',
        desc: 'Proprietary foundation LLMs for complex reasoning, multi-turn dialogue, and structured JSON output.'
      },
      {
        id: 'langchain',
        name: 'LangChain',
        role: 'LLM Orchestration',
        layer: 'Orchestration',
        orbit: 'inner',
        angle: 90,
        icon: 'https://framerusercontent.com/images/6yzPxfL2zbqicuK8rRc9eMVRIkM.png',
        desc: 'Multi-agent routing, dynamic tool invocation, and retrieval-augmented context management.'
      },
      {
        id: 'python',
        name: 'Python',
        role: 'Core AI & APIs',
        layer: 'Orchestration',
        orbit: 'inner',
        angle: 180,
        icon: 'https://framerusercontent.com/images/m9s52nA5urnyuoWxNt414Ghwo.png',
        desc: 'High-concurrency backend services, model execution pipelines, and enterprise API gateways.'
      },
      {
        id: 'tensorflow',
        name: 'TensorFlow',
        role: 'Machine Learning Models',
        layer: 'Data & ML',
        orbit: 'inner',
        angle: 270,
        icon: 'https://framerusercontent.com/images/ZDKJY420KwTFElm5cbE51nd1uI.png',
        desc: 'Custom predictive algorithms, vehicle appraisal valuations, and financial risk stress-testing.'
      },
      {
        id: 'huggingface',
        name: 'Hugging Face',
        role: 'Open-Source AI Models',
        layer: 'AI Models',
        orbit: 'outer',
        angle: 45,
        icon: 'https://framerusercontent.com/images/MtA8cVDkuxvUGdyeyvSKiGb7qA.png',
        desc: 'Open-weight transformers, domain-adapted embedding models, and specialized local inference.'
      },
      {
        id: 'pinecone',
        name: 'Pinecone Database',
        role: 'Vector Database',
        layer: 'Data & ML',
        orbit: 'outer',
        angle: 135,
        icon: 'https://framerusercontent.com/images/nlfwFe7bR5JQliZS9i8AghDDzBg.png',
        desc: 'Sub-second vector similarity search, long-term semantic memory, and scalable hybrid retrieval.'
      },
      {
        id: 'kafka',
        name: 'Apache Kafka',
        role: 'Real-Time Streaming',
        layer: 'Streaming & Search',
        orbit: 'outer',
        angle: 225,
        icon: 'https://framerusercontent.com/images/E38BAlxLDaA0pVazXApaqDRmLA.png',
        desc: 'Distributed event streaming, real-time FX rate feeds, and asynchronous transaction pipelines.'
      },
      {
        id: 'elasticsearch',
        name: 'Elasticsearch',
        role: 'Search & Indexing',
        layer: 'Streaming & Search',
        orbit: 'outer',
        angle: 315,
        icon: 'https://framerusercontent.com/images/CEWChIc50KX3RlDIkbgZZdxje4M.png',
        desc: 'Full-text evidence indexing, faceted search, and multi-tenant audit trail query execution.'
      }
    ]
  };

  function getSystemsData() {
    var raw = (window.DEMAZE_CONTENT && window.DEMAZE_CONTENT.engineeringSystems) || {};
    return {
      eyebrow: raw.eyebrow || FALLBACK_SYSTEMS.eyebrow,
      heading: raw.heading || FALLBACK_SYSTEMS.heading,
      subtitle: raw.subtitle || FALLBACK_SYSTEMS.subtitle,
      conceptualFlow: raw.conceptualFlow || FALLBACK_SYSTEMS.conceptualFlow,
      technologies: (raw.technologies && raw.technologies.length === 8) ? raw.technologies : FALLBACK_SYSTEMS.technologies
    };
  }

  function ensureStyle() {
    if (document.getElementById(STYLE_ID)) return;
    var style = document.createElement('style');
    style.id = STYLE_ID;
    style.textContent =
      /* Section Framing */
      'section[data-framer-name="Videos making Step"] {' +
      '  display: flex !important; flex-direction: column !important; align-items: center !important;' +
      '  width: 100% !important; height: auto !important; min-height: auto !important;' +
      '  padding: 48px 20px 64px !important; background: #ffffff !important;' +
      '  position: relative !important; z-index: 1 !important; overflow: hidden !important;' +
      '  box-sizing: border-box !important;' +
      '}' +
      'section[data-framer-name="Videos making Step"] > :not(.' + BLOCK_ID + ') {' +
      '  display: none !important;' +
      '}' +

      /* Inner Container */
      '.' + BLOCK_ID + ' {' +
      '  width: 100%; max-width: 1160px; margin: 0 auto; box-sizing: border-box;' +
      '  display: flex !important; flex-direction: column; align-items: center;' +
      '}' +

      /* Header */
      '.demaze-sys-header {' +
      '  display: flex; flex-direction: column; align-items: center; text-align: center; margin-bottom: 24px; max-width: 760px;' +
      '}' +
      '.demaze-sys-eyebrow {' +
      '  display: inline-flex; align-items: center; padding: 5px 15px; border-radius: 999px;' +
      '  background: rgba(14, 116, 144, 0.08); color: #0e7490; font-size: 11.5px; font-weight: 700;' +
      '  margin-bottom: 12px; border: 1px solid rgba(14, 116, 144, 0.20);' +
      '  letter-spacing: 0.06em; text-transform: uppercase;' +
      '}' +
      '.demaze-sys-heading {' +
      '  font-size: clamp(28px, 3.4vw, 42px); font-weight: 700; line-height: 1.18;' +
      '  letter-spacing: -0.02em; color: #09090B; margin: 0 0 10px; text-wrap: balance;' +
      '  font-family: "Stack Sans Headline", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;' +
      '}' +
      '.demaze-sys-dim {' +
      '  background: linear-gradient(135deg, #06B6D4 0%, #4F46E5 100%) !important;' +
      '  -webkit-background-clip: text !important;' +
      '  -webkit-text-fill-color: transparent !important;' +
      '  font-weight: 700;' +
      '}' +
      '.demaze-sys-subtitle {' +
      '  font-size: 15px; line-height: 1.55; color: #475569; margin: 0; max-width: 660px; text-wrap: balance;' +
      '  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;' +
      '}' +

      /* Conceptual Flow Strip */
      '.demaze-sys-pipeline {' +
      '  display: flex; align-items: center; justify-content: center; gap: 8px;' +
      '  flex-wrap: wrap; margin-bottom: 32px; width: 100%;' +
      '}' +
      '.demaze-sys-pipeline-tag {' +
      '  display: inline-flex; align-items: center; font-size: 11px; font-weight: 600; color: #64748b;' +
      '  letter-spacing: 0.05em; text-transform: uppercase;' +
      '  font-family: ui-monospace, SFMono-Regular, Menlo, monospace;' +
      '  margin-right: 4px;' +
      '}' +
      '.demaze-sys-step {' +
      '  display: inline-flex; align-items: center; gap: 6px; padding: 4px 11px;' +
      '  background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 999px;' +
      '  font-size: 11px; font-weight: 600; color: #475569;' +
      '  font-family: ui-monospace, SFMono-Regular, Menlo, monospace; letter-spacing: 0.02em;' +
      '  transition: all 0.2s ease;' +
      '}' +
      '.demaze-sys-step-num { color: #0284c7; font-weight: 700; }' +
      '.demaze-sys-arrow { color: #cbd5e1; font-size: 12px; }' +

      /* Spatial Systems Arena */
      '.demaze-sys-stage {' +
      '  width: 100%; max-width: 920px; background: #ffffff;' +
      '  border: 1px solid #e2e8f0; border-radius: 32px; padding: 36px 24px 28px;' +
      '  box-shadow: 0 4px 24px rgba(15, 23, 42, 0.04), 0 1px 2px rgba(0, 0, 0, 0.02);' +
      '  display: flex; flex-direction: column; align-items: center; box-sizing: border-box;' +
      '  position: relative; overflow: hidden;' +
      '}' +

      /* Orbital Canvas Arena */
      '.demaze-sys-arena {' +
      '  width: 520px; height: 520px; position: relative; margin: 0 auto;' +
      '  display: flex; align-items: center; justify-content: center;' +
      '}' +

      /* Background Orbit Guides (SVG) */
      '.demaze-sys-svg-guides {' +
      '  position: absolute; inset: 0; width: 100%; height: 100%; pointer-events: none;' +
      '}' +

      /* Central Core Node */
      '.demaze-sys-center-core {' +
      '  width: 90px; height: 90px; border-radius: 50%; background: #ffffff;' +
      '  border: 1.5px solid rgba(37, 99, 235, 0.25);' +
      '  box-shadow: 0 10px 30px rgba(37, 99, 235, 0.12), 0 0 0 4px rgba(37, 99, 235, 0.05);' +
      '  display: flex; flex-direction: column; align-items: center; justify-content: center;' +
      '  position: absolute; z-index: 10; cursor: pointer; padding: 4px; box-sizing: border-box;' +
      '  transition: transform 0.25s ease, box-shadow 0.25s ease;' +
      '}' +
      '.demaze-sys-center-core:hover {' +
      '  transform: scale(1.06); box-shadow: 0 14px 36px rgba(37, 99, 235, 0.20), 0 0 0 6px rgba(37, 99, 235, 0.08);' +
      '}' +
      '.demaze-sys-core-mark {' +
      '  width: 42px; height: auto; object-fit: contain; display: block;' +
      '}' +
      '.demaze-sys-core-label {' +
      '  font-size: 7.5px; font-weight: 700; color: #1e40af; letter-spacing: 0.07em;' +
      '  text-transform: uppercase; margin-top: 3px; text-align: center; line-height: 1.1;' +
      '}' +
      '.demaze-sys-core-sub {' +
      '  font-size: 6px; font-weight: 600; color: #64748b; letter-spacing: 0.02em;' +
      '  margin-top: 2px; text-align: center; line-height: 1.1; white-space: nowrap;' +
      '}' +
      '.demaze-sys-core-pulse {' +
      '  position: absolute; width: 90px; height: 90px; border-radius: 50%;' +
      '  border: 1px solid rgba(37, 99, 235, 0.35); pointer-events: none; z-index: 8;' +
      '  animation: demazeCorePulse 3.6s cubic-bezier(0.25, 1, 0.5, 1) infinite;' +
      '}' +
      '@keyframes demazeCorePulse {' +
      '  0% { transform: scale(1); opacity: 0.7; }' +
      '  100% { transform: scale(1.65); opacity: 0; }' +
      '}' +

      /* Orbit Track Rings (Rotating Containers) */
      '.demaze-orbit-track {' +
      '  position: absolute; border-radius: 50%;' +
      '  transform-origin: center center; will-change: transform;' +
      '  pointer-events: none;' +
      '}' +
      '.demaze-orbit-track-inner {' +
      '  width: 51.92%; height: 51.92%; z-index: 5;' +
      '  animation: demazeOrbitCW 50s linear infinite;' +
      '}' +
      '.demaze-orbit-track-outer {' +
      '  width: 84.62%; height: 84.62%; z-index: 4;' +
      '  animation: demazeOrbitCCW 65s linear infinite;' +
      '}' +
      '@keyframes demazeOrbitCW {' +
      '  from { transform: rotate(0deg); }' +
      '  to { transform: rotate(360deg); }' +
      '}' +
      '@keyframes demazeOrbitCCW {' +
      '  from { transform: rotate(0deg); }' +
      '  to { transform: rotate(-360deg); }' +
      '}' +

      /* Orbit Nodes */
      '.demaze-orbit-node-anchor {' +
      '  position: absolute; width: 0; height: 0;' +
      '}' +
      '.demaze-orbit-node {' +
      '  position: absolute; transform: translate(-50%, -50%);' +
      '  width: 54px; height: 54px; border-radius: 50%; background: #ffffff;' +
      '  border: 1px solid #e2e8f0;' +
      '  box-shadow: 0 4px 16px rgba(15, 23, 42, 0.08), 0 1px 2px rgba(0, 0, 0, 0.03);' +
      '  display: flex; align-items: center; justify-content: center;' +
      '  cursor: pointer; transition: transform 0.22s ease, box-shadow 0.22s ease, border-color 0.22s ease;' +
      '  pointer-events: auto;' +
      '}' +
      '.demaze-orbit-node:hover, .demaze-orbit-node.is-active {' +
      '  transform: translate(-50%, -50%) scale(1.18);' +
      '  border-color: #2563eb;' +
      '  box-shadow: 0 10px 26px rgba(37, 99, 235, 0.22), 0 0 0 2px rgba(37, 99, 235, 0.15);' +
      '  z-index: 20;' +
      '}' +
      '.demaze-orbit-node img {' +
      '  width: 28px; height: 28px; object-fit: contain; display: block;' +
      '}' +

      /* Counter-Rotating inner wrappers so logos remain perfectly upright */
      '.demaze-node-counter-inner {' +
      '  display: flex; align-items: center; justify-content: center;' +
      '  width: 100%; height: 100%; will-change: transform;' +
      '  animation: demazeOrbitCCW 50s linear infinite;' +
      '}' +
      '.demaze-node-counter-outer {' +
      '  display: flex; align-items: center; justify-content: center;' +
      '  width: 100%; height: 100%; will-change: transform;' +
      '  animation: demazeOrbitCW 65s linear infinite;' +
      '}' +

      /* Pause motion on hover or when offscreen */
      '.demaze-sys-arena:hover .demaze-orbit-track,' +
      '.demaze-sys-arena:hover .demaze-node-counter-inner,' +
      '.demaze-sys-arena:hover .demaze-node-counter-outer,' +
      '.demaze-sys-paused .demaze-orbit-track,' +
      '.demaze-sys-paused .demaze-node-counter-inner,' +
      '.demaze-sys-paused .demaze-node-counter-outer,' +
      '.demaze-sys-paused .demaze-sys-core-pulse {' +
      '  animation-play-state: paused !important;' +
      '}' +

      /* Interactive Inspector Deck (Below Arena) */
      '.demaze-sys-deck {' +
      '  width: 100%; max-width: 680px; margin-top: 24px; padding: 16px 20px;' +
      '  background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 18px;' +
      '  box-sizing: border-box; display: flex; flex-direction: column; gap: 8px;' +
      '  transition: all 0.2s ease;' +
      '}' +
      '.demaze-sys-deck-top {' +
      '  display: flex; align-items: center; justify-content: space-between; gap: 12px; flex-wrap: wrap;' +
      '}' +
      '.demaze-sys-deck-title-group {' +
      '  display: flex; align-items: center; gap: 10px;' +
      '}' +
      '.demaze-sys-deck-icon {' +
      '  width: 24px; height: 24px; object-fit: contain;' +
      '}' +
      '.demaze-sys-deck-name {' +
      '  font-size: 16px; font-weight: 700; color: #0f172a;' +
      '  font-family: "Stack Sans Headline", -apple-system, sans-serif;' +
      '}' +
      '.demaze-sys-deck-badges {' +
      '  display: flex; align-items: center; gap: 6px;' +
      '}' +
      '.demaze-sys-deck-role {' +
      '  font-size: 11px; font-weight: 700; color: #2563eb; background: rgba(37, 99, 235, 0.08);' +
      '  border: 1px solid rgba(37, 99, 235, 0.20); padding: 3px 9px; border-radius: 6px;' +
      '  font-family: ui-monospace, monospace; text-transform: uppercase; letter-spacing: 0.04em;' +
      '}' +
      '.demaze-sys-deck-layer {' +
      '  font-size: 11px; font-weight: 600; color: #0e7490; background: rgba(14, 116, 144, 0.08);' +
      '  border: 1px solid rgba(14, 116, 144, 0.20); padding: 3px 9px; border-radius: 6px;' +
      '}' +
      '.demaze-sys-deck-desc {' +
      '  font-size: 13.5px; line-height: 1.5; color: #475569; margin: 0;' +
      '}' +

      /* Mobile Quick Selection Chips */
      '.demaze-sys-chips-deck {' +
      '  display: none; grid-template-columns: repeat(2, 1fr); gap: 8px; width: 100%; margin-top: 20px;' +
      '}' +
      '.demaze-sys-chip-btn {' +
      '  display: flex; align-items: center; gap: 8px; padding: 8px 12px;' +
      '  background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 12px;' +
      '  font-size: 12px; font-weight: 600; color: #334155;' +
      '  cursor: pointer; min-height: 48px; box-sizing: border-box;' +
      '  transition: all 0.18s ease;' +
      '}' +
      '.demaze-sys-chip-btn:hover, .demaze-sys-chip-btn.is-active {' +
      '  background: #ffffff; border-color: #2563eb; color: #0f172a;' +
      '  box-shadow: 0 4px 12px rgba(37, 99, 235, 0.12);' +
      '}' +
      '.demaze-sys-chip-btn img { width: 20px; height: 20px; object-fit: contain; }' +

      /* Responsive Rules */
      '@media (max-width: 900px) {' +
      '  .demaze-sys-stage { border-radius: 24px; padding: 28px 16px 24px; }' +
      '  .demaze-sys-arena { width: 420px; height: 420px; }' +
      '  .demaze-orbit-node { width: 44px; height: 44px; }' +
      '  .demaze-orbit-node img { width: 22px; height: 22px; }' +
      '  .demaze-sys-center-core, .demaze-sys-core-pulse { width: 76px; height: 76px; }' +
      '  .demaze-sys-core-mark { width: 34px; }' +
      '  .demaze-sys-core-label { font-size: 6.5px; }' +
      '  .demaze-sys-core-sub { font-size: 5.5px; }' +
      '}' +
      '@media (max-width: 640px) {' +
      '  section[data-framer-name="Videos making Step"] { padding: 36px 12px 48px !important; }' +
      '  .demaze-sys-pipeline { display: none; }' +
      '  .demaze-sys-stage { border-radius: 20px; padding: 20px 12px 18px; }' +
      '  .demaze-sys-arena { width: 280px; height: 280px; }' +
      '  .demaze-orbit-node { width: 34px; height: 34px; }' +
      '  .demaze-orbit-node img { width: 17px; height: 17px; }' +
      '  .demaze-sys-center-core, .demaze-sys-core-pulse { width: 60px; height: 60px; }' +
      '  .demaze-sys-core-mark { width: 26px; }' +
      '  .demaze-sys-core-label { font-size: 5.5px; }' +
      '  .demaze-sys-core-sub { font-size: 4.8px; }' +
      '  .demaze-sys-deck { margin-top: 16px; padding: 14px 14px; }' +
      '  .demaze-sys-deck-top { flex-direction: column; align-items: flex-start; gap: 6px; }' +
      '  .demaze-sys-deck-name { font-size: 15px; }' +
      '  .demaze-sys-deck-badges { flex-wrap: wrap; }' +
      '  .demaze-sys-deck-role, .demaze-sys-deck-layer { font-size: 10px; padding: 2px 7px; }' +
      '  .demaze-sys-deck-desc { font-size: 12.5px; }' +
      '  .demaze-sys-chips-deck { display: grid; }' +
      '}' +

      /* Reduced Motion Compliance */
      '@media (prefers-reduced-motion: reduce) {' +
      '  .demaze-orbit-track,' +
      '  .demaze-node-counter-inner,' +
      '  .demaze-node-counter-outer,' +
      '  .demaze-sys-core-pulse {' +
      '    animation: none !important;' +
      '  }' +
      '}';
    document.head.appendChild(style);
  }

  function getSection() {
    return document.querySelector('section[data-framer-name="Videos making Step"]');
  }

  function isHydrated(section) {
    return !!section;
  }

  function mountSystemsStage(section) {
    var nativeContainer = section.querySelector('[data-framer-name="Container"]');
    if (nativeContainer) {
      nativeContainer.style.setProperty('display', 'none', 'important');
    }

    var existing = section.querySelector('.' + BLOCK_ID);
    if (existing) return;

    var data = getSystemsData();
    var techList = data.technologies;

    var outer = document.createElement('div');
    outer.className = BLOCK_ID;

    // 1. Header
    var headerHTML =
      '<div class="demaze-sys-header">' +
      '  <div class="demaze-sys-eyebrow">' + data.eyebrow + '</div>' +
      '  <h2 class="demaze-sys-heading">' +
      '    Connected Intelligence, Built for <span class="demaze-sys-dim">Production</span>' +
      '  </h2>' +
      '  <p class="demaze-sys-subtitle">' +
      '    ' + data.subtitle +
      '  </p>' +
      '</div>';

    // 2. Conceptual Flow Pipeline
    var flowStepsHTML = data.conceptualFlow.map(function (step, i) {
      var isLast = i === data.conceptualFlow.length - 1;
      return (
        '<div class="demaze-sys-step">' +
        '  <span class="demaze-sys-step-num">' + step.step + '</span>' +
        '  <span>' + step.label + '</span>' +
        '</div>' +
        (!isLast ? '<span class="demaze-sys-arrow">→</span>' : '')
      );
    }).join('');

    var pipelineHTML =
      '<div class="demaze-sys-pipeline">' +
      '  <span class="demaze-sys-pipeline-tag">Conceptual system view</span>' +
      flowStepsHTML +
      '</div>';

    // 3. Spatial Orbital Arena
    var innerTechs = techList.filter(function (t) { return t.orbit === 'inner'; });
    var outerTechs = techList.filter(function (t) { return t.orbit === 'outer'; });

    // Inner Nodes (Nodes positioned along 50% radius of rotating container)
    var innerNodesHTML = innerTechs.map(function (t) {
      var rad = (t.angle * Math.PI) / 180;
      var left = (50 + Math.cos(rad) * 50).toFixed(2);
      var top = (50 + Math.sin(rad) * 50).toFixed(2);

      return (
        '<div class="demaze-orbit-node-anchor" style="left: ' + left + '%; top: ' + top + '%;">' +
        '  <div class="demaze-orbit-node" data-tech-id="' + t.id + '" role="button" tabindex="0" aria-label="' + t.name + ' · ' + t.role + '">' +
        '    <div class="demaze-node-counter-inner">' +
        '      <img src="' + t.icon + '" alt="' + t.name + '" loading="eager" decoding="async" />' +
        '    </div>' +
        '  </div>' +
        '</div>'
      );
    }).join('');

    // Outer Nodes (Nodes positioned along 50% radius of rotating container)
    var outerNodesHTML = outerTechs.map(function (t) {
      var rad = (t.angle * Math.PI) / 180;
      var left = (50 + Math.cos(rad) * 50).toFixed(2);
      var top = (50 + Math.sin(rad) * 50).toFixed(2);

      return (
        '<div class="demaze-orbit-node-anchor" style="left: ' + left + '%; top: ' + top + '%;">' +
        '  <div class="demaze-orbit-node" data-tech-id="' + t.id + '" role="button" tabindex="0" aria-label="' + t.name + ' · ' + t.role + '">' +
        '    <div class="demaze-node-counter-outer">' +
        '      <img src="' + t.icon + '" alt="' + t.name + '" loading="eager" decoding="async" />' +
        '    </div>' +
        '  </div>' +
        '</div>'
      );
    }).join('');

    var arenaHTML =
      '<div class="demaze-sys-stage">' +
      '  <div class="demaze-sys-arena">' +
      '    <svg class="demaze-sys-svg-guides" viewBox="0 0 520 520" fill="none" xmlns="http://www.w3.org/2000/svg">' +
      '      <!-- Concentric Orbital Guide Tracks -->' +
      '      <circle cx="260" cy="260" r="135" stroke="rgba(14, 165, 233, 0.20)" stroke-width="1.2" stroke-dasharray="4 6" />' +
      '      <circle cx="260" cy="260" r="220" stroke="rgba(99, 102, 241, 0.16)" stroke-width="1.2" stroke-dasharray="4 6" />' +
      '      <!-- Ray Connectors -->' +
      '      <line x1="260" y1="260" x2="260" y2="40" stroke="rgba(14, 165, 233, 0.08)" stroke-width="1" />' +
      '      <line x1="260" y1="260" x2="480" y2="260" stroke="rgba(14, 165, 233, 0.08)" stroke-width="1" />' +
      '      <line x1="260" y1="260" x2="260" y2="480" stroke="rgba(14, 165, 233, 0.08)" stroke-width="1" />' +
      '      <line x1="260" y1="260" x2="40" y2="260" stroke="rgba(14, 165, 233, 0.08)" stroke-width="1" />' +
      '      <line x1="260" y1="260" x2="415" y2="105" stroke="rgba(99, 102, 241, 0.06)" stroke-width="1" />' +
      '      <line x1="260" y1="260" x2="105" y2="415" stroke="rgba(99, 102, 241, 0.06)" stroke-width="1" />' +
      '    </svg>' +
      '    <div class="demaze-sys-core-pulse"></div>' +
      '    <div class="demaze-sys-center-core" role="button" tabindex="0" title="DEMAZE CORE · AI + Software Systems" aria-label="DEMAZE CORE · AI + Software Systems">' +
      '      <img src="https://framerusercontent.com/images/g9sZPcgZ3bVZQgiCX8DybKWIy4.png?width=1344&height=420" alt="Demaze Core" class="demaze-sys-core-mark" />' +
      '      <span class="demaze-sys-core-label">DEMAZE CORE</span>' +
      '      <span class="demaze-sys-core-sub">AI + Software Systems</span>' +
      '    </div>' +
      '    <!-- Inner Orbit Track (270px) -->' +
      '    <div class="demaze-orbit-track demaze-orbit-track-inner">' +
      innerNodesHTML +
      '    </div>' +
      '    <!-- Outer Orbit Track (440px) -->' +
      '    <div class="demaze-orbit-track demaze-orbit-track-outer">' +
      outerNodesHTML +
      '    </div>' +
      '  </div>' +

      '  <!-- Live Inspection Deck -->' +
      '  <div class="demaze-sys-deck" id="demaze-sys-deck">' +
      '    <div class="demaze-sys-deck-top">' +
      '      <div class="demaze-sys-deck-title-group">' +
      '        <img src="https://framerusercontent.com/images/6yzPxfL2zbqicuK8rRc9eMVRIkM.png" alt="LangChain" class="demaze-sys-deck-icon" id="sys-deck-icon" />' +
      '        <span class="demaze-sys-deck-name" id="sys-deck-name">LangChain</span>' +
      '      </div>' +
      '      <div class="demaze-sys-deck-badges">' +
      '        <span class="demaze-sys-deck-role" id="sys-deck-role">LLM Orchestration</span>' +
      '        <span class="demaze-sys-deck-layer" id="sys-deck-layer">Orchestration</span>' +
      '      </div>' +
      '    </div>' +
      '    <p class="demaze-sys-deck-desc" id="sys-deck-desc">' +
      '      Multi-agent routing, dynamic tool invocation, and retrieval-augmented context management.' +
      '    </p>' +
      '  </div>' +

      '  <!-- Mobile Quick Selection Chips -->' +
      '  <div class="demaze-sys-chips-deck">' +
      techList.map(function (t) {
        return (
          '<button type="button" class="demaze-sys-chip-btn" data-tech-id="' + t.id + '">' +
          '  <img src="' + t.icon + '" alt="' + t.name + '" />' +
          '  <span>' + t.name + '</span>' +
          '</button>'
        );
      }).join('') +
      '  </div>' +
      '</div>';

    outer.innerHTML = headerHTML + pipelineHTML + arenaHTML;
    section.appendChild(outer);

    // 4. Interactive State Wiring
    var deckIcon = outer.querySelector('#sys-deck-icon');
    var deckName = outer.querySelector('#sys-deck-name');
    var deckRole = outer.querySelector('#sys-deck-role');
    var deckLayer = outer.querySelector('#sys-deck-layer');
    var deckDesc = outer.querySelector('#sys-deck-desc');
    var nodes = outer.querySelectorAll('.demaze-orbit-node, .demaze-sys-chip-btn');

    var techMap = {};
    techList.forEach(function (t) { techMap[t.id] = t; });

    function selectTech(id) {
      var item = techMap[id];
      if (!item) return;

      if (deckIcon) deckIcon.src = item.icon;
      if (deckName) deckName.textContent = item.name;
      if (deckRole) deckRole.textContent = item.role;
      if (deckLayer) deckLayer.textContent = item.layer;
      if (deckDesc) deckDesc.textContent = item.desc;

      nodes.forEach(function (n) {
        if (n.getAttribute('data-tech-id') === id) {
          n.classList.add('is-active');
        } else {
          n.classList.remove('is-active');
        }
      });
    }

    nodes.forEach(function (node) {
      var id = node.getAttribute('data-tech-id');
      node.addEventListener('mouseenter', function () { selectTech(id); });
      node.addEventListener('focus', function () { selectTech(id); });
      node.addEventListener('click', function () { selectTech(id); });
      node.addEventListener('keydown', function (e) {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          selectTech(id);
        }
      });
    });

    function selectCore() {
      if (deckName) deckName.textContent = 'DEMAZE CORE';
      if (deckRole) deckRole.textContent = 'AI + Software Systems';
      if (deckLayer) deckLayer.textContent = 'Conceptual Ecosystem';
      if (deckDesc) deckDesc.textContent = 'Connected engineering ecosystem bringing together AI models, orchestration frameworks, and production software.';
      if (deckIcon) deckIcon.src = 'https://framerusercontent.com/images/g9sZPcgZ3bVZQgiCX8DybKWIy4.png?width=1344&height=420';
      nodes.forEach(function (n) { n.classList.remove('is-active'); });
    }

    var coreHub = outer.querySelector('.demaze-sys-center-core');
    if (coreHub) {
      coreHub.addEventListener('mouseenter', selectCore);
      coreHub.addEventListener('focus', selectCore);
      coreHub.addEventListener('click', selectCore);
      coreHub.addEventListener('keydown', function (e) {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          selectCore();
        }
      });
    }

    // 5. Performance Observer: Pause animations when offscreen
    if ('IntersectionObserver' in window) {
      var arenaEl = outer.querySelector('.demaze-sys-stage');
      var observer = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (arenaEl) {
            if (entry.isIntersecting) {
              arenaEl.classList.remove('demaze-sys-paused');
            } else {
              arenaEl.classList.add('demaze-sys-paused');
            }
          }
        });
      }, { rootMargin: '100px' });
      observer.observe(section);
    }
  }

  function applyOverride(section) {
    ensureStyle();
    mountSystemsStage(section);
  }

  function verifyStuck(section) {
    var outer = section && section.querySelector('.' + BLOCK_ID);
    var arena = section && section.querySelector('.demaze-sys-arena');
    var nodes = section && section.querySelectorAll('.demaze-orbit-node');
    return !!(outer && arena && nodes && nodes.length === 8);
  }

  window.DemazeOverride.run({
    getRoot: getSection,
    isHydrated: isHydrated,
    apply: applyOverride,
    verify: verifyStuck
  });
})();
