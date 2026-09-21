/**
 * How We Work / Our Process - Rebuilt faithfully matching Fora AI's Features section
 * (https://foraai.framer.website/ - "Features" section):
 * - Clean light tone, white background (#ffffff), refined grey eyebrow pill (#EEECED)
 * - Dual-tone display typography ("Engineering that Adapts to Scale")
 * - Signature 4-card Bento Grid layout with #F4F4F6 card surfaces, 30px border radius:
 *   1. Card 1 (Left Tall Card): Discovery & Architecture with chat/spec feed, Demaze AI response,
 *      syntax-highlighted code block, and memory status pill.
 *   2. Card 2 (Top Middle Card): Rapid Prototyping with staging action bar, live preview skeleton,
 *      and stakeholder verification badge.
 *   3. Card 3 (Top Right Card): Autonomous Build & QA with pink/coral gradient action card,
 *      canary rollout prompt, and interactive action buttons.
 *   4. Card 4 (Bottom Wide Card): Connect Your Stack with orbital rotating app constellation
 *      and smooth tech stack marquee (OpenAI, Python, LangChain, Kafka, Pinecone, AWS, Docker,
 *      Kubernetes, GitHub, PostgreSQL, Hugging Face, Slack, Notion).
 * - Fully responsive across Desktop (1440px), Tablet (1024px/768px), and Mobile (390px).
 */
(function () {
  var content = window.DEMAZE_CONTENT && window.DEMAZE_CONTENT.process;
  if (!window.DemazeOverride) return;

  var STYLE_ID = 'demaze-process-fora-style';
  var BLOCK_ID = 'demaze-process-fora-block';

  var TECH_STACK_APPS = [
    { name: 'OpenAI', icon: 'https://framerusercontent.com/images/XkdawulL9cthX7AFF1LI4bXv0o.png' },
    { name: 'Python', icon: 'https://framerusercontent.com/images/m9s52nA5urnyuoWxNt414Ghwo.png' },
    { name: 'LangChain', icon: 'https://framerusercontent.com/images/6yzPxfL2zbqicuK8rRc9eMVRIkM.png' },
    { name: 'Kafka', icon: 'https://framerusercontent.com/images/E38BAlxLDaA0pVazXApaqDRmLA.png' },
    { name: 'Pinecone', icon: 'https://framerusercontent.com/images/nlfwFe7bR5JQliZS9i8AghDDzBg.png' },
    { name: 'Hugging Face', icon: 'https://framerusercontent.com/images/MtA8cVDkuxvUGdyeyvSKiGb7qA.png' },
    { name: 'Figma', icon: 'https://framerusercontent.com/images/pkhh0EQ5InrWQZ4rekwPwzJ6px4.png?width=808&height=810' },
    { name: 'Slack', icon: 'https://framerusercontent.com/images/sPO3l9jrekyDIkw72r19RXoebQ.png?width=832&height=826' },
    { name: 'Notion', icon: 'https://framerusercontent.com/images/JMH2Clnl4mQx7hrDfSXujXDNPBY.png?width=1024&height=1024' },
    { name: 'GitHub', icon: 'https://framerusercontent.com/images/MRfVTgKvw7Tlxkf0bqVoJW8C8.jpg?width=400&height=400' },
    { name: 'Linear', icon: 'https://framerusercontent.com/images/DK2TndnnYvvsi6b7ruZBawDDz94.png?width=2106&height=2088' },
    { name: 'Chrome', icon: 'https://framerusercontent.com/images/Re5Nwt658dW1qeFFF0zVV8xDXg.png?width=1728&height=1818' }
  ];

  function ensureStyle() {
    if (document.getElementById(STYLE_ID)) return;
    var style = document.createElement('style');
    style.id = STYLE_ID;
    style.textContent =
      /* Section Container */
      'section[data-framer-name="Videos making Step"] {' +
      '  display: flex !important; flex-direction: column !important; align-items: center !important;' +
      '  width: 100% !important; height: auto !important; min-height: auto !important;' +
      '  padding: 36px 24px 56px !important; background: #ffffff !important;' +
      '  position: relative !important; z-index: 1 !important; overflow: visible !important;' +
      '  box-sizing: border-box !important;' +
      '}' +
      'section[data-framer-name="Videos making Step"] > :not(.' + BLOCK_ID + ') {' +
      '  display: none !important;' +
      '}' +

      /* Inner Wrapper */
      '.' + BLOCK_ID + ' {' +
      '  width: 100%; max-width: 1180px; margin: 0 auto; box-sizing: border-box;' +
      '  display: flex; flex-direction: column; align-items: center;' +
      '}' +

      /* Header */
      '.demaze-proc-header {' +
      '  display: flex; flex-direction: column; align-items: center; text-align: center; margin-bottom: 36px; max-width: 720px;' +
      '}' +
      '.demaze-proc-eyebrow {' +
      '  display: inline-flex; align-items: center; padding: 6px 16px; border-radius: 999px;' +
      '  background: rgba(6, 182, 212, 0.08); color: #0891B2; font-size: 12.5px; font-weight: 600;' +
      '  margin-bottom: 14px; border: 1px solid rgba(6, 182, 212, 0.2);' +
      '  letter-spacing: 0.04em; text-transform: uppercase;' +
      '}' +
      '.demaze-proc-heading {' +
      '  font-size: clamp(28px, 3.2vw, 38px); font-weight: 700; line-height: 1.2;' +
      '  letter-spacing: -0.025em; color: #09090B; margin: 0 0 12px;' +
      '  font-family: "Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;' +
      '}' +
      '.demaze-proc-dim {' +
      '  background: linear-gradient(135deg, #06B6D4 0%, #4F46E5 100%) !important;' +
      '  -webkit-background-clip: text !important;' +
      '  -webkit-text-fill-color: transparent !important;' +
      '  font-weight: 700;' +
      '}' +
      '.demaze-proc-subtitle {' +
      '  font-size: 15.5px; line-height: 1.6; color: #64748B; margin: 0;' +
      '  font-family: "Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;' +
      '}' +

      /* Bento Grid Container */
      '.demaze-proc-bento {' +
      '  display: flex; gap: 24px; width: 100%; align-items: stretch; justify-content: center; box-sizing: border-box;' +
      '}' +

      /* Card Base Styles matching Fora AI */
      '.demaze-bento-card {' +
      '  background: #F4F4F6; border-radius: 30px; padding: 30px 28px;' +
      '  box-sizing: border-box; display: flex; flex-direction: column; justify-content: space-between;' +
      '  position: relative; overflow: hidden; border: 1px solid rgba(0, 0, 0, 0.03);' +
      '  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.02);' +
      '  transition: transform 0.35s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.35s ease;' +
      '}' +
      '.demaze-bento-card:hover {' +
      '  transform: translateY(-4px);' +
      '  box-shadow: 0 16px 36px -10px rgba(15, 23, 42, 0.08), 0 4px 12px rgba(0, 0, 0, 0.03);' +
      '}' +
      '.demaze-card-title {' +
      '  font-size: 24px; font-weight: 600; color: #09090B; margin: 0 0 8px;' +
      '  letter-spacing: -0.015em;' +
      '  font-family: "Stack Sans Headline", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;' +
      '}' +
      '.demaze-card-desc {' +
      '  font-size: 15.5px; line-height: 1.5; color: #64748B; margin: 0 0 20px;' +
      '  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;' +
      '}' +

      /* Left Column: Card 1 (Tall) */
      '.demaze-card-1 {' +
      '  width: 386px; flex-shrink: 0; min-height: 610px;' +
      '}' +
      '.demaze-c1-feed {' +
      '  display: flex; flex-direction: column; gap: 12px; margin-top: auto; width: 100%;' +
      '}' +
      '.demaze-chat-user {' +
      '  background: linear-gradient(135deg, #ff7a93 0%, #ff5376 100%);' +
      '  color: #ffffff; border-radius: 18px 18px 4px 18px; padding: 12px 16px;' +
      '  font-size: 13.5px; font-weight: 500; line-height: 1.45;' +
      '  max-width: 90%; align-self: flex-end; box-shadow: 0 4px 14px rgba(255, 83, 118, 0.22);' +
      '}' +
      '.demaze-chat-row {' +
      '  display: flex; align-items: flex-start; gap: 10px; width: 100%;' +
      '}' +
      '.demaze-chat-avatar {' +
      '  width: 32px; height: 32px; border-radius: 50%; flex-shrink: 0;' +
      '  background: #ff5376; display: flex; align-items: center; justify-content: center;' +
      '  box-shadow: 0 2px 8px rgba(255, 83, 118, 0.25);' +
      '}' +
      '.demaze-chat-avatar img {' +
      '  width: 18px; height: 18px; object-fit: contain; filter: brightness(0) invert(1);' +
      '}' +
      '.demaze-chat-bot {' +
      '  background: #ffffff; color: #18181B; border-radius: 18px 18px 18px 4px;' +
      '  padding: 12px 16px; font-size: 13.5px; line-height: 1.45; font-weight: 500;' +
      '  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04); border: 1px solid rgba(0, 0, 0, 0.04);' +
      '}' +
      '.demaze-terminal {' +
      '  background: #0F172A; border-radius: 18px; padding: 14px 16px; width: 100%;' +
      '  box-shadow: 0 6px 20px rgba(15, 23, 42, 0.14); box-sizing: border-box;' +
      '  font-family: ui-monospace, SFMono-Regular, "JetBrains Mono", Menlo, Consolas, monospace;' +
      '  font-size: 12.5px; line-height: 1.6; color: #E2E8F0;' +
      '}' +
      '.demaze-t-kw { color: #C084FC; font-weight: 600; }' +
      '.demaze-t-var { color: #60A5FA; }' +
      '.demaze-t-fn { color: #38BDF8; }' +
      '.demaze-t-prop { color: #94A3B8; }' +
      '.demaze-t-str { color: #34D399; }' +
      '.demaze-t-meta { color: #64748B; font-size: 11px; margin-top: 6px; border-top: 1px solid rgba(255, 255, 255, 0.08); padding-top: 6px; }' +
      '.demaze-memory-pill {' +
      '  display: inline-flex; align-items: center; gap: 8px;' +
      '  background: rgba(255, 83, 118, 0.12); color: #E11D48; border-radius: 100px;' +
      '  padding: 6px 14px; font-size: 12px; font-weight: 600; width: fit-content; margin-top: 4px;' +
      '}' +
      '.demaze-memory-dot {' +
      '  width: 7px; height: 7px; border-radius: 50%; background: #E11D48;' +
      '}' +

      /* Right Column Container */
      '.demaze-proc-right-col {' +
      '  flex: 1; min-width: 0; max-width: 670px; display: flex; flex-direction: column; gap: 20px;' +
      '}' +

      /* Top Row: Cards 2 & 3 */
      '.demaze-proc-top-row {' +
      '  display: flex; gap: 20px; width: 100%;' +
      '}' +

      /* Card 2: Rapid Prototyping */
      '.demaze-card-2 {' +
      '  flex: 1; min-width: 0; min-height: 310px;' +
      '}' +
      '.demaze-proto-bar {' +
      '  background: #ffffff; border-radius: 100px; padding: 7px 8px 7px 16px;' +
      '  display: flex; align-items: center; justify-content: space-between;' +
      '  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.04); border: 1px solid rgba(0, 0, 0, 0.04);' +
      '  margin-top: auto;' +
      '}' +
      '.demaze-proto-bar span {' +
      '  font-size: 12.5px; color: #52525B; font-weight: 500;' +
      '}' +
      '.demaze-proto-arrow {' +
      '  width: 26px; height: 26px; border-radius: 50%; background: #FF5376;' +
      '  display: flex; align-items: center; justify-content: center; color: #ffffff;' +
      '  font-size: 12px; flex-shrink: 0;' +
      '}' +
      '.demaze-proto-box {' +
      '  background: #ffffff; border-radius: 18px; padding: 14px 16px; margin-top: 12px;' +
      '  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.04); border: 1px solid rgba(0, 0, 0, 0.04);' +
      '}' +
      '.demaze-proto-status {' +
      '  display: flex; align-items: center; gap: 7px; font-size: 12px; font-weight: 600; color: #10B981;' +
      '  margin-bottom: 10px;' +
      '}' +
      '.demaze-proto-status-dot {' +
      '  width: 7px; height: 7px; border-radius: 50%; background: #10B981;' +
      '}' +
      '.demaze-proto-skel {' +
      '  height: 6px; border-radius: 6px; background: #E4E4E7; margin-bottom: 6px;' +
      '}' +
      '.demaze-proto-skel.w80 { width: 85%; }' +
      '.demaze-proto-skel.w55 { width: 55%; margin-bottom: 0; }' +
      '.demaze-proto-verified {' +
      '  display: inline-flex; align-items: center; gap: 6px; padding: 5px 12px;' +
      '  border-radius: 100px; background: rgba(16, 185, 129, 0.10); color: #059669;' +
      '  font-size: 11.5px; font-weight: 600; margin-top: 10px; width: fit-content;' +
      '}' +

      /* Card 3: Autonomous Build & QA */
      '.demaze-card-3 {' +
      '  flex: 1; min-width: 0; min-height: 310px;' +
      '}' +
      '.demaze-qa-box {' +
      '  background: linear-gradient(135deg, #ff7a93 0%, #ff5376 100%);' +
      '  border-radius: 20px; padding: 18px; color: #ffffff;' +
      '  box-shadow: 0 6px 20px rgba(255, 83, 118, 0.22); margin-top: auto;' +
      '}' +
      '.demaze-qa-eyebrow {' +
      '  font-size: 11px; text-transform: uppercase; letter-spacing: 0.05em;' +
      '  color: rgba(255, 255, 255, 0.88); font-weight: 600; margin-bottom: 6px;' +
      '}' +
      '.demaze-qa-question {' +
      '  font-size: 15px; font-weight: 700; line-height: 1.35; margin-bottom: 14px;' +
      '}' +
      '.demaze-qa-btns {' +
      '  display: flex; gap: 8px;' +
      '}' +
      '.demaze-qa-btn-yes {' +
      '  background: #ffffff; color: #E11D48; border-radius: 100px;' +
      '  padding: 6px 13px; font-size: 12px; font-weight: 600;' +
      '  box-shadow: 0 2px 6px rgba(0,0,0,0.1); cursor: pointer;' +
      '  transition: transform 0.2s ease;' +
      '}' +
      '.demaze-qa-btn-yes:hover { transform: scale(1.04); }' +
      '.demaze-qa-btn-no {' +
      '  background: rgba(255, 255, 255, 0.25); color: #ffffff; border-radius: 100px;' +
      '  padding: 6px 13px; font-size: 12px; font-weight: 600; cursor: pointer;' +
      '  transition: background 0.2s ease;' +
      '}' +
      '.demaze-qa-btn-no:hover { background: rgba(255, 255, 255, 0.35); }' +

      /* Card 4: Connect Your Stack (Wide) matching Fora AI exact specs */
      '.demaze-card-4 {' +
      '  width: 100%; height: 273px; min-height: 273px; box-sizing: border-box;' +
      '  flex-direction: row; align-items: flex-start; justify-content: flex-start;' +
      '  padding: 28px 32px; position: relative; overflow: hidden;' +
      '}' +
      '.demaze-card-4-left {' +
      '  width: 260px; max-width: 260px; flex-shrink: 0; position: relative; z-index: 2; pointer-events: none;' +
      '}' +
      '.demaze-card-4-left .demaze-card-desc { margin-bottom: 0; }' +
      '.demaze-card-4-constellation {' +
      '  position: absolute; width: 505px; height: 505px; bottom: -252px; right: -104px;' +
      '  z-index: 1; pointer-events: none;' +
      '}' +
      '.demaze-orbit-wheel.demaze-orbit-outer-ring {' +
      '  width: 100%; height: 100%; position: relative;' +
      '  animation: demazeConstellationOrbit 46s linear infinite;' +
      '  will-change: transform;' +
      '}' +
      '.demaze-orbit-wheel-inner.demaze-orbit-inner-ring {' +
      '  position: absolute; inset: 100px;' +
      '  animation: demazeConstellationReverse 34s linear infinite;' +
      '  will-change: transform;' +
      '}' +
      '@keyframes demazeConstellationOrbit {' +
      '  from { transform: rotate(0deg); }' +
      '  to { transform: rotate(360deg); }' +
      '}' +
      '@keyframes demazeConstellationReverse {' +
      '  from { transform: rotate(0deg); }' +
      '  to { transform: rotate(-360deg); }' +
      '}' +

      /* Spoke Columns & App Badges matching Fora AI */
      '.demaze-spoke-65 {' +
      '  position: absolute; top: 0; bottom: 0; left: 50%; width: 65px;' +
      '  display: flex; flex-direction: column; justify-content: space-between; align-items: center;' +
      '  padding: 0; pointer-events: auto;' +
      '}' +
      '.demaze-node-65 {' +
      '  width: 65px; height: 65px; border-radius: 63px; overflow: hidden; flex-shrink: 0; position: relative;' +
      '  box-shadow: 0 4px 18px rgba(15, 23, 42, 0.08), 0 1px 3px rgba(0, 0, 0, 0.04);' +
      '  background: #ffffff; display: flex; align-items: center; justify-content: center;' +
      '  transition: transform 0.25s ease, box-shadow 0.25s ease;' +
      '}' +
      '.demaze-node-65:hover {' +
      '  transform: scale(1.12) !important;' +
      '  box-shadow: 0 8px 24px rgba(15, 23, 42, 0.16);' +
      '}' +
      '.demaze-node-65 img {' +
      '  width: 100%; height: 100%; object-fit: cover; display: block; border-radius: inherit;' +
      '}' +
      '.demaze-spoke-35 {' +
      '  position: absolute; top: 0; bottom: 0; left: 50%; width: 35px;' +
      '  display: flex; flex-direction: column; justify-content: space-between; align-items: center;' +
      '  padding: 0; pointer-events: auto;' +
      '}' +
      '.demaze-node-35 {' +
      '  width: 35px; height: 35px; border-radius: 43px; overflow: hidden; flex-shrink: 0; position: relative;' +
      '  box-shadow: 0 2px 10px rgba(15, 23, 42, 0.07);' +
      '  background: #ffffff; display: flex; align-items: center; justify-content: center;' +
      '  transition: transform 0.25s ease, box-shadow 0.25s ease;' +
      '}' +
      '.demaze-node-35:hover {' +
      '  transform: scale(1.15) !important;' +
      '  box-shadow: 0 4px 16px rgba(15, 23, 42, 0.16);' +
      '}' +
      '.demaze-node-35 img {' +
      '  width: 100%; height: 100%; object-fit: cover; display: block; border-radius: inherit;' +
      '}' +

      /* Responsive Marquee for Mobile/Tablet */
      '.demaze-stack-marquee-wrap {' +
      '  display: none; width: 100%; overflow: hidden; position: relative; margin-top: 16px;' +
      '  mask-image: linear-gradient(to right, transparent, black 15%, black 85%, transparent);' +
      '  -webkit-mask-image: linear-gradient(to right, transparent, black 15%, black 85%, transparent);' +
      '}' +
      '.demaze-stack-marquee-row {' +
      '  display: flex; gap: 14px; width: max-content;' +
      '  animation: demazeMarquee 20s linear infinite;' +
      '}' +
      '@keyframes demazeMarquee {' +
      '  from { transform: translateX(0); }' +
      '  to { transform: translateX(-50%); }' +
      '}' +
      '.demaze-marquee-pill {' +
      '  width: 48px; height: 48px; border-radius: 50%; background: #ffffff;' +
      '  display: flex; align-items: center; justify-content: center;' +
      '  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.06); border: 1px solid rgba(0, 0, 0, 0.05);' +
      '  flex-shrink: 0;' +
      '}' +
      '.demaze-marquee-pill img {' +
      '  width: 28px; height: 28px; object-fit: contain; border-radius: 6px;' +
      '}' +

      /* Responsive Breakpoints */
      '@media (max-width: 1040px) {' +
      '  section[data-framer-name="Videos making Step"] { padding: 75px 20px 85px !important; }' +
      '  .demaze-proc-bento { flex-direction: column; align-items: center; gap: 20px; }' +
      '  .demaze-card-1 { width: 100%; max-width: 680px; min-height: auto; }' +
      '  .demaze-proc-right-col { width: 100%; max-width: 680px; }' +
      '  .demaze-card-4 { height: 273px; min-height: 273px; }' +
      '}' +

      '@media (max-width: 680px) {' +
      '  section[data-framer-name="Videos making Step"] { padding: 60px 16px 70px !important; }' +
      '  .demaze-proc-header { margin-bottom: 36px; }' +
      '  .demaze-proc-top-row { flex-direction: column; gap: 20px; }' +
      '  .demaze-card-2, .demaze-card-3 { min-height: auto; }' +
      '  .demaze-bento-card { border-radius: 24px; padding: 24px 20px; }' +
      '  .demaze-card-title { font-size: 21px; }' +
      '  .demaze-card-desc { font-size: 14.5px; }' +
      '  .demaze-card-4 { height: auto; min-height: auto; flex-direction: column; align-items: flex-start; gap: 16px; }' +
      '  .demaze-card-4-constellation { display: none; }' +
      '  .demaze-stack-marquee-wrap { display: block; }' +
      '}';;
    document.head.appendChild(style);
  }

  function getProcessSection() {
    return document.querySelector('section[data-framer-name="Videos making Step"]');
  }

  function isHydrated(section) {
    return !!section;
  }

  var OUTER_SPOKES = [
    {
      angle: 0,
      top: { name: 'Figma', icon: 'https://framerusercontent.com/images/pkhh0EQ5InrWQZ4rekwPwzJ6px4.png?width=808&height=810' },
      bottom: { name: 'Slack', icon: 'https://framerusercontent.com/images/sPO3l9jrekyDIkw72r19RXoebQ.png?width=832&height=826' }
    },
    {
      angle: 23,
      top: { name: 'Notion', icon: 'https://framerusercontent.com/images/JMH2Clnl4mQx7hrDfSXujXDNPBY.png?width=1024&height=1024' },
      bottom: { name: 'OpenAI', icon: 'https://framerusercontent.com/images/q6TYVLjzAdGsfPL653l4KUo62w.png?width=426&height=430' }
    },
    {
      angle: 45,
      top: { name: 'Linear', icon: 'https://framerusercontent.com/images/DK2TndnnYvvsi6b7ruZBawDDz94.png?width=2106&height=2088' },
      bottom: { name: 'Python', icon: 'https://framerusercontent.com/images/m9s52nA5urnyuoWxNt414Ghwo.png' }
    },
    {
      angle: 68,
      top: { name: 'Sketch', icon: 'https://framerusercontent.com/images/Y8D5l1qrb3yH10pGTl25O4a9L0.jpg?width=736&height=736' },
      bottom: { name: 'LangChain', icon: 'https://framerusercontent.com/images/6yzPxfL2zbqicuK8rRc9eMVRIkM.png' }
    },
    {
      angle: 90,
      top: { name: 'GitHub', icon: 'https://framerusercontent.com/images/MRfVTgKvw7Tlxkf0bqVoJW8C8.jpg?width=400&height=400' },
      bottom: { name: 'Kafka', icon: 'https://framerusercontent.com/images/E38BAlxLDaA0pVazXApaqDRmLA.png' }
    },
    {
      angle: 112,
      top: { name: 'Chrome', icon: 'https://framerusercontent.com/images/Re5Nwt658dW1qeFFF0zVV8xDXg.png?width=1728&height=1818' },
      bottom: { name: 'Framer', icon: 'https://framerusercontent.com/images/ys4oTL2lYdKDfdrlLPl3LDRY.png?width=1761&height=1839' }
    },
    {
      angle: 135,
      top: { name: 'Discord', icon: 'https://framerusercontent.com/images/XeWCGuA2kcV1SoqBYdhi2eC8.jpg?width=980&height=980' },
      bottom: { name: 'Pinecone', icon: 'https://framerusercontent.com/images/nlfwFe7bR5JQliZS9i8AghDDzBg.png' }
    },
    {
      angle: 158,
      top: { name: 'VSCode', icon: 'https://framerusercontent.com/images/BGijJ9067qvpOmUTGEqdlmxFhmQ.png?width=512&height=512' },
      bottom: { name: 'Hugging Face', icon: 'https://framerusercontent.com/images/MtA8cVDkuxvUGdyeyvSKiGb7qA.png' }
    }
  ];

  var INNER_SPOKES = [
    {
      angle: 0,
      top: { name: 'App 1', icon: 'https://framerusercontent.com/images/XWV3ToSPgwKLoRS4BsA1z7zk.png?width=1280&height=1280' },
      bottom: { name: 'App 2', icon: 'https://framerusercontent.com/images/XWV3ToSPgwKLoRS4BsA1z7zk.png?width=1280&height=1280' }
    },
    {
      angle: 22,
      top: { name: 'App 3', icon: 'https://framerusercontent.com/images/o0zXm37n7mp8M1RAf6M4Ga28ui0.png?width=230&height=230' },
      bottom: { name: 'App 4', icon: 'https://framerusercontent.com/images/o0zXm37n7mp8M1RAf6M4Ga28ui0.png?width=230&height=230' }
    },
    {
      angle: 45,
      top: { name: 'App 5', icon: 'https://framerusercontent.com/images/2dTXUAQpn5rzQOL7lKEsYtLLFjY.png?width=1200&height=1170' },
      bottom: { name: 'App 6', icon: 'https://framerusercontent.com/images/2dTXUAQpn5rzQOL7lKEsYtLLFjY.png?width=1200&height=1170' }
    },
    {
      angle: 67,
      top: { name: 'App 7', icon: 'https://framerusercontent.com/images/Cdf08c28Yrjl5hKtE2cgevzSt9g.png?width=1200&height=630' },
      bottom: { name: 'App 8', icon: 'https://framerusercontent.com/images/Cdf08c28Yrjl5hKtE2cgevzSt9g.png?width=1200&height=630' }
    },
    {
      angle: 90,
      top: { name: 'App 9', icon: 'https://framerusercontent.com/images/eTkhMPhl62nrViQrNpxCEGvWaE.png?width=512&height=512' },
      bottom: { name: 'App 10', icon: 'https://framerusercontent.com/images/eTkhMPhl62nrViQrNpxCEGvWaE.png?width=512&height=512' }
    },
    {
      angle: 113,
      top: { name: 'App 11', icon: 'https://framerusercontent.com/images/jQo9RG3CJxTrdtG5b4RMVlenWQ.jpeg?width=225&height=225' },
      bottom: { name: 'App 12', icon: 'https://framerusercontent.com/images/jQo9RG3CJxTrdtG5b4RMVlenWQ.jpeg?width=225&height=225' }
    },
    {
      angle: 135,
      top: { name: 'App 13', icon: 'https://framerusercontent.com/images/H9NZcElmoHU0v78tfNUIL2rr9E.png?width=200&height=200' },
      bottom: { name: 'App 14', icon: 'https://framerusercontent.com/images/H9NZcElmoHU0v78tfNUIL2rr9E.png?width=200&height=200' }
    },
    {
      angle: 158,
      top: { name: 'App 15', icon: 'https://framerusercontent.com/images/eTkhMPhl62nrViQrNpxCEGvWaE.png?width=512&height=512' },
      bottom: { name: 'App 16', icon: 'https://framerusercontent.com/images/eTkhMPhl62nrViQrNpxCEGvWaE.png?width=512&height=512' }
    }
  ];

  function buildSpokes65(spokes) {
    return spokes.map(function (s) {
      return (
        '<div class="demaze-spoke-65" style="transform: translateX(-50%) rotate(' + s.angle + 'deg);">' +
        '  <div class="demaze-node-65" title="' + s.top.name + '">' +
        '    <img src="' + s.top.icon + '" alt="' + s.top.name + '" />' +
        '  </div>' +
        '  <div class="demaze-node-65" style="transform: rotate(180deg);" title="' + s.bottom.name + '">' +
        '    <img src="' + s.bottom.icon + '" alt="' + s.bottom.name + '" />' +
        '  </div>' +
        '</div>'
      );
    }).join('');
  }

  function buildSpokes35(spokes) {
    return spokes.map(function (s) {
      return (
        '<div class="demaze-spoke-35" style="transform: translateX(-50%) rotate(' + s.angle + 'deg);">' +
        '  <div class="demaze-node-35" title="' + s.top.name + '">' +
        '    <img src="' + s.top.icon + '" alt="' + s.top.name + '" />' +
        '  </div>' +
        '  <div class="demaze-node-35" style="transform: rotate(180deg);" title="' + s.bottom.name + '">' +
        '    <img src="' + s.bottom.icon + '" alt="' + s.bottom.name + '" />' +
        '  </div>' +
        '</div>'
      );
    }).join('');
  }

  function mountStage(section) {
    // Hide native MOVIQ children safely
    var nativeContainer = section.querySelector('[data-framer-name="Container"]');
    if (nativeContainer) {
      nativeContainer.style.setProperty('display', 'none', 'important');
    }

    var existing = section.querySelector('.' + BLOCK_ID);
    if (existing) return;

    var outer = document.createElement('div');
    outer.className = BLOCK_ID;

    // Header
    var headerHTML =
      '<div class="demaze-proc-header">' +
      '  <div class="demaze-proc-eyebrow">HOW WE WORK</div>' +
      '  <h2 class="demaze-proc-heading">' +
      '    Engineering that Adapts to <span class="demaze-proc-dim">Scale</span>' +
      '  </h2>' +
      '  <p class="demaze-proc-subtitle">' +
      '    A proven engineering methodology taking you from architectural discovery to high-throughput enterprise scale.' +
      '  </p>' +
      '</div>';

    // Build Card 1: Discovery & Architecture
    var card1HTML =
      '<div class="demaze-bento-card demaze-card-1">' +
      '  <div class="demaze-c1-top">' +
      '    <h3 class="demaze-card-title">Discovery &amp; Architecture</h3>' +
      '    <p class="demaze-card-desc">We map your workflows, eliminate technical bottlenecks, and define the complete blueprint before building.</p>' +
      '  </div>' +
      '  <div class="demaze-c1-feed">' +
      '    <div class="demaze-chat-user">We need autonomous agent orchestration with sub-second inference.</div>' +
      '    <div class="demaze-chat-row">' +
      '      <div class="demaze-chat-avatar"><img src="https://framerusercontent.com/images/g9sZPcgZ3bVZQgiCX8DybKWIy4.png?width=1344&height=420" alt="Demaze" /></div>' +
      '      <div class="demaze-chat-bot">Blueprint generated: LangChain + Kafka event bus with Pinecone vector memory.</div>' +
      '    </div>' +
      '    <div class="demaze-chat-user">Enforce zero data loss with self-healing failover.</div>' +
      '    <div class="demaze-chat-row">' +
      '      <div class="demaze-chat-avatar"><img src="https://framerusercontent.com/images/g9sZPcgZ3bVZQgiCX8DybKWIy4.png?width=1344&height=420" alt="Demaze" /></div>' +
      '      <div class="demaze-terminal">' +
      '        <div><span class="demaze-t-kw">const</span> <span class="demaze-t-var">agent</span> = <span class="demaze-t-kw">new</span> <span class="demaze-t-fn">AgentRuntime</span>({</div>' +
      '        <div style="padding-left:14px;"><span class="demaze-t-prop">model:</span> <span class="demaze-t-str">\'claude-3-5-sonnet\'</span>,</div>' +
      '        <div style="padding-left:14px;"><span class="demaze-t-prop">vectorStore:</span> <span class="demaze-t-str">\'Pinecone\'</span>,</div>' +
      '        <div style="padding-left:14px;"><span class="demaze-t-prop">resilience:</span> <span class="demaze-t-str">\'zero-data-loss\'</span></div>' +
      '        <div>});</div>' +
      '        <div class="demaze-t-meta">// TypeScript · Production Hardened</div>' +
      '      </div>' +
      '    </div>' +
      '    <div class="demaze-memory-pill">' +
      '      <span class="demaze-memory-dot"></span> Architecture Validated from Memory' +
      '    </div>' +
      '  </div>' +
      '</div>';

    // Build Card 2: Rapid Prototyping
    var card2HTML =
      '<div class="demaze-bento-card demaze-card-2">' +
      '  <div>' +
      '    <h3 class="demaze-card-title">Rapid Prototyping</h3>' +
      '    <p class="demaze-card-desc">Interactive prototypes to validate user flows and verify requirements with real feedback.</p>' +
      '  </div>' +
      '  <div class="demaze-proto-bar">' +
      '    <span>Deploy interactive build to staging</span>' +
      '    <span class="demaze-proto-arrow">➔</span>' +
      '  </div>' +
      '  <div class="demaze-proto-box">' +
      '    <div class="demaze-proto-status">' +
      '      <span class="demaze-proto-status-dot"></span> Build live on staging' +
      '    </div>' +
      '    <div class="demaze-proto-skel w80"></div>' +
      '    <div class="demaze-proto-skel w55"></div>' +
      '  </div>' +
      '  <div class="demaze-proto-verified">✓ Sent to Stakeholder Review</div>' +
      '</div>';

    // Build Card 3: Autonomous Build & QA
    var card3HTML =
      '<div class="demaze-bento-card demaze-card-3">' +
      '  <div>' +
      '    <h3 class="demaze-card-title">Automated Build &amp; QA</h3>' +
      '    <p class="demaze-card-desc">Autonomous CI/CD pipelines, validated models, and sub-second SLAs deployed daily.</p>' +
      '  </div>' +
      '  <div class="demaze-qa-box">' +
      '    <div class="demaze-qa-eyebrow">Demaze DevOps Engine</div>' +
      '    <div class="demaze-qa-question">Ready to trigger canary rollout v4.2?</div>' +
      '    <div class="demaze-qa-actions">' +
      '      <span class="demaze-qa-btn-yes">✓ Deploy Now</span>' +
      '      <span class="demaze-qa-btn-no">✕ Dry Run</span>' +
      '    </div>' +
      '  </div>' +
      '</div>';

    // Build Card 4: Connect Your Stack (With Exact Fora AI Orbital Constellation)
    var outerWheelSpokes = buildSpokes65(OUTER_SPOKES);
    var innerWheelSpokes = buildSpokes35(INNER_SPOKES);

    // Marquee pills for mobile fallback
    var marqueeItems = TECH_STACK_APPS.concat(TECH_STACK_APPS).map(function (a) {
      return (
        '<div class="demaze-marquee-pill" title="' + a.name + '">' +
        '  <img src="' + a.icon + '" alt="' + a.name + '" />' +
        '</div>'
      );
    }).join('');

    var card4HTML =
      '<div class="demaze-bento-card demaze-card-4">' +
      '  <div class="demaze-card-4-left">' +
      '    <h3 class="demaze-card-title">Connect Your Stack</h3>' +
      '    <p class="demaze-card-desc">Plug into your favorite tools and enterprise APIs, and let Demaze handle the rest.</p>' +
      '    <div class="demaze-stack-marquee-wrap">' +
      '      <div class="demaze-stack-marquee-row">' + marqueeItems + '</div>' +
      '    </div>' +
      '  </div>' +
      '  <div class="demaze-card-4-constellation">' +
      '    <div class="demaze-orbit-wheel demaze-orbit-outer-ring">' +
      outerWheelSpokes +
      '      <div class="demaze-orbit-wheel-inner demaze-orbit-inner-ring">' +
      innerWheelSpokes +
      '      </div>' +
      '    </div>' +
      '  </div>' +
      '</div>';

    // Assemble Bento Grid
    var bentoGridHTML =
      '<div class="demaze-proc-bento">' +
      card1HTML +
      '<div class="demaze-proc-right-col">' +
      '  <div class="demaze-proc-top-row">' +
      card2HTML +
      card3HTML +
      '  </div>' +
      card4HTML +
      '</div>' +
      '</div>';

    outer.innerHTML = headerHTML + bentoGridHTML;
    section.appendChild(outer);
  }

  function applyOverride(section) {
    ensureStyle();
    mountStage(section);
  }

  function verifyStuck(section) {
    var outer = section && section.querySelector('.' + BLOCK_ID);
    var cards = section && section.querySelectorAll('.demaze-bento-card');
    var orbit = section && section.querySelector('.demaze-orbit-wheel');
    return !!(outer && cards && cards.length === 4 && orbit);
  }

  window.DemazeOverride.run({
    getRoot: getProcessSection,
    isHydrated: isHydrated,
    apply: applyOverride,
    verify: verifyStuck
  });
})();
