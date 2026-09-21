/**
 * Post-hydration content override for the Industries We Serve section.
 *
 * Implements the compact, high-end 19-industry directory with interactive
 * hover animation, SVG logo glyphs, capability detail panel, and telemetry cards
 * from the Demaze design system.
 */
(function () {
  var content = window.DEMAZE_CONTENT && window.DEMAZE_CONTENT.industries;
  if (!content || !window.DemazeOverride) return;

  var ICONS = {
    card: '<rect width="20" height="14" x="2" y="5" rx="2"/><line x1="2" x2="22" y1="10" y2="10"/>',
    pulse: '<path d="M22 12h-4l-3 9L9 3l-3 9H2"/>',
    bag: '<path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z"/><path d="M3 6h18"/><path d="M16 10a4 4 0 0 1-8 0"/>',
    truck: '<path d="M14 18V6a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v11a1 1 0 0 0 1 1h2"/><path d="M15 18H9"/><path d="M19 18h2a1 1 0 0 0 1-1v-3.65a1 1 0 0 0-.22-.62l-3.48-4.35A1 1 0 0 0 17.52 8H14"/><circle cx="17" cy="18" r="2"/><circle cx="7" cy="18" r="2"/>',
    layers: '<path d="M12.83 2.18a2 2 0 0 0-1.66 0L2.6 6.08a1 1 0 0 0 0 1.83l8.58 3.91a2 2 0 0 0 1.66 0l8.58-3.9a1 1 0 0 0 0-1.83Z"/><path d="m22 17.65-9.17 4.16a2 2 0 0 1-1.66 0L2 17.65"/><path d="m22 12.65-9.17 4.16a2 2 0 0 1-1.66 0L2 12.65"/>',
    gamepad: '<line x1="6" x2="10" y1="11" y2="11"/><line x1="8" x2="8" y1="9" y2="13"/><line x1="15" x2="15.01" y1="12" y2="12"/><line x1="18" x2="18.01" y1="10" y2="10"/><rect width="20" height="12" x="2" y="6" rx="5"/>',
    trend: '<polyline points="22 7 13.5 15.5 8.5 10.5 2 17"/><polyline points="16 7 22 7 22 13"/>',
    car: '<path d="M19 17h2c.6 0 1-.4 1-1v-3c0-.9-.7-1.7-1.5-1.9C18.7 10.6 16 10 16 10s-1.3-1.4-2.2-2.3c-.5-.4-1.1-.7-1.8-.7H5c-.6 0-1.1.4-1.4.9l-1.4 2.9A3.7 3.7 0 0 0 2 12v4c0 .6.4 1 1 1h2"/><circle cx="7" cy="17" r="2"/><path d="M9 17h6"/><circle cx="17" cy="17" r="2"/>',
    zap: '<polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>',
    building: '<path d="M6 22V4a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v18Z"/><path d="M6 12H4a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h2"/><path d="M18 9h2a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2h-2"/><path d="M10 6h4"/><path d="M10 10h4"/><path d="M10 14h4"/>',
    film: '<rect width="20" height="20" x="2" y="2" rx="2.18"/><line x1="7" x2="7" y1="2" y2="22"/><line x1="17" x2="17" y1="2" y2="22"/><line x1="2" x2="22" y1="12" y2="12"/>',
    cap: '<path d="M22 10v6"/><path d="m2 10 10-5 10 5-10 5z"/><path d="M6 12v5c3 3 9 3 12 0v-5"/>',
    utensils: '<path d="M3 2v7c0 1.1.9 2 2 2h4a2 2 0 0 0 2-2V2"/><path d="M7 2v20"/><path d="M21 15V2a5 5 0 0 0-5 5v6c0 1.1.9 2 2 2h3Zm0 0v7"/>',
    scale: '<path d="m16 16 3-8 3 8c-.87.65-1.92 1-3 1s-2.13-.35-3-1Z"/><path d="m2 16 3-8 3 8c-.87.65-1.92 1-3 1s-2.13-.35-3-1Z"/><path d="M7 21h10"/><path d="M12 3v18"/><path d="M3 7h2c2 0 5-1 7-2 2 1 5 2 7 2h2"/>',
    users: '<path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>',
    shield: '<path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z"/>',
    phone: '<rect width="14" height="20" x="5" y="2" rx="2"/><path d="M12 18h.01"/>',
    factory: '<path d="M2 20a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V8l-7 5V8l-7 5V4a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2Z"/><path d="M17 18h1"/><path d="M12 18h1"/><path d="M7 18h1"/>',
    trophy: '<path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6"/><path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18"/><path d="M4 22h16"/><path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22"/><path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22"/><path d="M18 2H6v7a6 6 0 0 0 12 0V2Z"/>'
  };

  function svg(key) {
    var p = ICONS[key] || ICONS.layers;
    return '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' + p + '</svg>';
  }

  var INDUSTRIES = [
    {
      id: '01',
      icon: 'pulse',
      name: 'Healthcare & HealthTech',
      metric: 'Clinical Telemetry',
      desc: 'HIPAA-compliant clinical platforms, AI patient triage, diagnostic intelligence models, and EHR practice workflow automation.',
      caps: ['Telemedicine Platforms', 'Electronic Health Records (EHR)', 'AI Triage Assistants', 'Hospital Management OS'],
      subsectors: ['Clinical AI', 'Telehealth', 'Pharma', 'Medical IoT']
    },
    {
      id: '02',
      icon: 'card',
      name: 'FinTech & Banking',
      metric: 'Ledger & Fraud AI',
      desc: 'High-throughput transaction processing, AI fraud prevention, regulatory compliance automation, and algorithmic underwriting.',
      caps: ['Real-Time Fraud Engine', 'Automated KYC/AML', 'Algorithmic Underwriting', 'High-Speed Ledger'],
      subsectors: ['Digital Banking', 'Payment Rails', 'Crypto & Web3', 'Credit Scoring']
    },
    {
      id: '03',
      icon: 'truck',
      name: 'Logistics & Fleet',
      metric: 'Fleet & Route IoT',
      desc: 'Autonomous dispatch algorithms, route optimization engines, cold-chain telemetry, and multi-hub inventory reconciliation.',
      caps: ['Route Optimization', 'Fleet Telematics', 'Predictive Restocking', 'Warehouse Robotics'],
      subsectors: ['Supply Chain', 'Last-Mile Delivery', 'Cold-Chain', 'Telematics']
    },
    {
      id: '04',
      icon: 'bag',
      name: 'Retail & Omnichannel',
      metric: 'Unified Commerce',
      desc: 'Point-of-sale intelligence, inventory management platforms, omnichannel customer loyalty, and algorithmic dynamic pricing.',
      caps: ['Omnichannel POS', 'Inventory Sync', 'Staff Management OS', 'Retail Analytics Dashboards'],
      subsectors: ['Store Operations', 'Loyalty Engines', 'CRM Suites', 'Price Management']
    },
    {
      id: '05',
      icon: 'bag',
      name: 'E-Commerce Marketplaces',
      metric: 'Headless Commerce',
      desc: 'High-performance multi-vendor marketplaces, live social auctions, virtual try-ons, and AI product recommendation engines.',
      caps: ['Multi-Vendor Marketplaces', 'B2B Wholesale Platforms', 'Dynamic Pricing Engine', 'Checkout Optimization'],
      subsectors: ['B2B E-Commerce', 'B2C Storefronts', 'Live Shopping', 'Order Management']
    },
    {
      id: '06',
      icon: 'cap',
      name: 'Education & EdTech',
      metric: 'Adaptive Learning',
      desc: 'Adaptive learning platforms, automated grading assistants, interactive virtual classrooms, and predictive progress analytics.',
      caps: ['Learning Management (LMS)', 'Virtual Classrooms', 'AI Tutoring Systems', 'Certification Automation'],
      subsectors: ['Online Courses', 'Student Information', 'Assessment Engines', 'Corporate L&D']
    },
    {
      id: '07',
      icon: 'trend',
      name: 'BFSI & WealthTech',
      metric: 'Institutional Core',
      desc: 'Enterprise financial software with institutional security, automated wealth advisory engines, audit trails, and risk scoring.',
      caps: ['Core Banking Systems', 'Loan Origination OS', 'Risk Management Models', 'Regulatory AML Tools'],
      subsectors: ['Asset Management', 'Investment Portals', 'Audit Trails', 'Credit Monitoring']
    },
    {
      id: '08',
      icon: 'gamepad',
      name: 'Gaming & Interactive 3D',
      metric: 'Real-Time WebGL',
      desc: 'Ultra-low latency streaming architectures, real-time player telemetry, interactive 3D WebGL scenes, and tournament backends.',
      caps: ['Interactive 3D WebGL', 'Sub-Second Streaming', 'Tournament Management', 'In-Game Payment Rails'],
      subsectors: ['Fantasy Platforms', 'Esports Engines', 'Community Hubs', 'Player Analytics']
    },
    {
      id: '09',
      icon: 'zap',
      name: 'Energy & Utilities',
      metric: 'Smart Grid IoT',
      desc: 'Smart grid IoT sensor ingestion, equipment failure prediction, consumption forecasting, and utility billing synchronization.',
      caps: ['Grid Telemetry OS', 'Predictive Maintenance', 'IoT Sensor Ingestion', 'Energy Trading Platforms'],
      subsectors: ['Renewables', 'Utility Billing', 'Grid Optimization', 'Meter Data']
    },
    {
      id: '10',
      icon: 'building',
      name: 'Real Estate & PropTech',
      metric: 'PropTech & Staging',
      desc: 'AI property valuation, virtual staging pipelines, tenant management portals, and automated digital lease execution.',
      caps: ['Property Management OS', 'Automated Valuation Models', 'Virtual Tour Platforms', 'Rental Management Apps'],
      subsectors: ['PropTech', 'Facility Management', 'Property Listing', 'Investment Portals']
    },
    {
      id: '11',
      icon: 'film',
      name: 'Media & Entertainment',
      metric: 'GenAI & Streaming',
      desc: 'Generative AI script-to-storyboard pipelines, automated transcription, digital asset management, and adaptive streaming.',
      caps: ['GenAI Storyboards', 'Speech-to-Text NLP', 'DRM Asset Cloud', 'Live Broadcast Solutions'],
      subsectors: ['Streaming Media', 'Content Creation', 'Digital Publishing', 'Video Processing']
    },
    {
      id: '12',
      icon: 'layers',
      name: 'SaaS Products & Cloud',
      metric: 'Multi-Tenant AI',
      desc: 'Cloud-native multi-tenant SaaS platforms with autonomous AI agents, usage-based billing, and extensible API architectures.',
      caps: ['Multi-Tenant Core', 'Agent Workflows', 'Usage-Based Billing', 'RAG Knowledge Index'],
      subsectors: ['Enterprise Cloud', 'API Infrastructure', 'Workflow Automation', 'Analytics Dashboards']
    },
    {
      id: '13',
      icon: 'car',
      name: 'Automotive & Mobility',
      metric: 'Dealership OS',
      desc: 'Operating systems for dealerships, automating vehicle appraisal, instant EMI financing calculations, and workshop bay scheduling.',
      caps: ['Dealership Management OS', 'Vehicle Valuation AI', 'Service Scheduling', 'Fleet Tracking Systems'],
      subsectors: ['Car Rental', 'Automotive CRM', 'Parts Inventory', 'Financing Calculators']
    },
    {
      id: '14',
      icon: 'utensils',
      name: 'Food & Beverage',
      metric: 'Kitchen & Order OS',
      desc: 'Kitchen display systems, cold-chain temperature telemetry, loyalty applications, and automated restaurant reservation suites.',
      caps: ['Kitchen Display OS', 'Multi-Vendor Delivery', 'Food Safety Compliance', 'Inventory Tracking'],
      subsectors: ['Restaurant Management', 'Ordering Apps', 'Cold-Chain IoT', 'Recipe Systems']
    },
    {
      id: '15',
      icon: 'scale',
      name: 'Legal & Professional',
      metric: 'Zero-Trust Vaults',
      desc: 'Secure case management for legal teams with AI transcription, document indexing, and automated contract lifecycle handling.',
      caps: ['Legal Practice OS', 'Document Automation', 'Contract Lifecycle AI', 'Compliance Tracking'],
      subsectors: ['Case Management', 'Time & Billing', 'Client Portals', 'Court Filing']
    },
    {
      id: '16',
      icon: 'users',
      name: 'Human Resources & Talent',
      metric: 'Talent & Matching',
      desc: 'Intelligent candidate matching, resume parsing pipelines, employee onboarding automation, and organizational retention analytics.',
      caps: ['Applicant Tracking (ATS)', 'Employee Onboarding', 'Workforce Analytics', 'Performance Management'],
      subsectors: ['Recruitment AI', 'Payroll Systems', 'Self-Service Portals', 'Talent Retention']
    },
    {
      id: '17',
      icon: 'shield',
      name: 'Insurance & InsurTech',
      metric: 'Claims Automation',
      desc: 'Automated claim adjudication pipelines, digital policy administration, risk scoring engines, and instant payout rails.',
      caps: ['Policy Management OS', 'Claims Processing AI', 'Risk Assessment Models', 'Underwriting Automation'],
      subsectors: ['InsurTech CRM', 'Premium Calculators', 'Self-Service Apps', 'Regulatory Reporting']
    },
    {
      id: '18',
      icon: 'phone',
      name: 'Social Commerce & Creators',
      metric: 'Live Commerce',
      desc: 'Social discovery merged with instant commerce: live streaming shopping, creator affiliate tracking, and one-click checkout.',
      caps: ['Live Video Shopping', 'Creator Affiliate Sync', 'Peer-to-Peer Marketplaces', 'Social Analytics Tools'],
      subsectors: ['Creator Economy', 'Social Discovery', 'Crypto Checkout', 'UGC Management']
    },
    {
      id: '19',
      icon: 'factory',
      name: 'Manufacturing & B2B',
      metric: 'Industrial IoT',
      desc: 'Industrial IoT predictive maintenance, procurement automation, factory floor visualization, and legacy ERP modernization.',
      caps: ['Manufacturing Execution (MES)', 'Predictive Maintenance', 'Procurement Automation', 'Production Planning'],
      subsectors: ['Supply Chain', 'Vendor Management', 'B2B Marketplaces', 'Quality Control']
    }
  ];

  var activeIndex = 0;

  function getSection() {
    var sections = document.querySelectorAll('section[data-framer-name="Tools"]');
    return sections[1] || document.querySelector('section.framer-1p5myw3') || null;
  }

  function isHydrated(section) {
    var container = section && section.querySelector('[data-framer-name="Container"]');
    return !!container;
  }

  var STYLE_ID = 'demaze-industries-stage-style';

  function ensureStyles() {
    if (document.getElementById(STYLE_ID)) return;
    var style = document.createElement('style');
    style.id = STYLE_ID;
    style.textContent =
      /* Hide Moviq native tab container */
      '.framer-1p5myw3 .framer-1jo2wal-container,' +
      'section[data-framer-name="Tools"]:has([data-framer-name="Tab"]) .framer-1jo2wal-container{' +
      '  display: none !important;' +
      '}' +

      /* Section & Header Framing */
      '.framer-1p5myw3, section[data-framer-name="Tools"]:has([data-framer-name="Tab"]){' +
      '  padding: 100px 0 !important;' +
      '  position: relative !important;' +
      '  background: #ffffff !important;' +
      '}' +
      '.demaze-industries-wrapper{' +
      '  width: 100%; max-width: 1240px; margin: 0 auto; padding: 0 24px; box-sizing: border-box;' +
      '}' +
      '.demaze-ind-header{' +
      '  text-align: center; margin-bottom: 40px; position: relative; z-index: 2;' +
      '}' +
      '.demaze-ind-eyebrow{' +
      '  display: inline-flex; align-items: center; gap: 8px;' +
      '  padding: 6px 16px; border-radius: 999px;' +
      '  background: rgba(37, 99, 235, 0.08); border: 1px solid rgba(37, 99, 235, 0.20);' +
      '  color: #2563eb; font-size: 12px; font-weight: 700; letter-spacing: 0.08em;' +
      '  text-transform: uppercase; margin-bottom: 14px;' +
      '}' +
      '.demaze-ind-heading{' +
      '  font-size: clamp(32px, 3.8vw, 52px); font-weight: 700; line-height: 1.15;' +
      '  color: #0f172a; margin: 0 0 14px; text-wrap: balance;' +
      '  font-family: "Stack Sans Headline", -apple-system, sans-serif;' +
      '}' +
      '.demaze-ind-sub{' +
      '  font-size: clamp(15px, 1.2vw, 17.5px); line-height: 1.6; color: #64748b;' +
      '  max-width: 680px; margin: 0 auto; text-wrap: balance;' +
      '}' +

      /* Master Stage Container */
      '.demaze-industries-stage{' +
      '  display: grid; grid-template-columns: 1.12fr 0.88fr; gap: 0;' +
      '  background: #ffffff;' +
      '  border: 1px solid #e2e8f0; border-radius: 24px;' +
      '  box-shadow: 0 20px 50px -15px rgba(15, 23, 42, 0.07), 0 0 0 1px rgba(226, 232, 240, 0.6);' +
      '  overflow: hidden; margin: 0 auto;' +
      '  position: relative; z-index: 2;' +
      '}' +

      /* Left: 19 Compact Rows in a Clean 2-Column Grid */
      '.demaze-ind-directory{' +
      '  display: grid; grid-template-columns: 1fr 1fr; gap: 4px 8px;' +
      '  padding: 20px 18px; align-content: start;' +
      '  background: #ffffff; border-right: 1px solid #f1f5f9;' +
      '}' +
      '.demaze-ind-directory::-webkit-scrollbar {' +
      '  width: 6px; height: 6px;' +
      '}' +
      '.demaze-ind-directory::-webkit-scrollbar-track {' +
      '  background: #f8fafc; border-radius: 4px;' +
      '}' +
      '.demaze-ind-directory::-webkit-scrollbar-thumb {' +
      '  background: #cbd5e1; border-radius: 4px;' +
      '}' +
      '.demaze-ind-directory::-webkit-scrollbar-thumb:hover {' +
      '  background: #94a3b8;' +
      '}' +
      '.demaze-ind-row{' +
      '  display: flex; align-items: center; gap: 8px;' +
      '  width: 100%; padding: 7px 10px; background: transparent;' +
      '  border: 1px solid transparent; border-radius: 10px;' +
      '  cursor: pointer; text-align: left; transition: all 0.18s cubic-bezier(.22,1,.36,1);' +
      '  outline: none; user-select: none;' +
      '}' +
      '.demaze-ind-row:hover{' +
      '  background: #f8fafc; border-color: #e2e8f0;' +
      '  transform: translateX(3px);' +
      '}' +
      '.demaze-ind-row.active{' +
      '  background: rgba(37, 99, 235, 0.08); border-color: rgba(37, 99, 235, 0.28);' +
      '  transform: translateX(4px); box-shadow: 0 2px 8px rgba(37, 99, 235, 0.08);' +
      '}' +
      '.demaze-row-id{' +
      '  font-size: 10.5px; font-weight: 700; font-family: ui-monospace, SFMono-Regular, Menlo, monospace;' +
      '  color: #94a3b8; letter-spacing: 0.02em; flex-shrink: 0; min-width: 16px;' +
      '  transition: color 0.18s ease;' +
      '}' +
      '.demaze-ind-row.active .demaze-row-id{' +
      '  color: #2563eb;' +
      '}' +
      '.demaze-row-icon{' +
      '  display: inline-flex; align-items: center; justify-content: center;' +
      '  width: 26px; height: 26px; border-radius: 6px;' +
      '  background: #f1f5f9; color: #64748b; flex-shrink: 0;' +
      '  transition: all 0.18s ease;' +
      '}' +
      '.demaze-row-icon svg{ width: 14px; height: 14px; }' +
      '.demaze-ind-row:hover .demaze-row-icon{' +
      '  background: #e2e8f0; color: #0f172a;' +
      '}' +
      '.demaze-ind-row.active .demaze-row-icon{' +
      '  background: #2563eb; color: #ffffff;' +
      '  box-shadow: 0 2px 8px rgba(37, 99, 235, 0.35);' +
      '}' +
      '.demaze-row-name{' +
      '  font-size: 12.5px; font-weight: 500; color: #475569;' +
      '  white-space: nowrap; overflow: hidden; text-overflow: ellipsis;' +
      '  line-height: 1.3; transition: all 0.18s ease;' +
      '}' +
      '.demaze-ind-row:hover .demaze-row-name{ color: #0f172a; }' +
      '.demaze-ind-row.active .demaze-row-name{' +
      '  color: #0f172a; font-weight: 700;' +
      '}' +

      /* Right: Interactive Capability Detail Panel */
      '.demaze-ind-detail{' +
      '  padding: 30px 32px; display: flex; flex-direction: column; justify-content: space-between;' +
      '  background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%);' +
      '  position: relative;' +
      '}' +
      '.demaze-detail-content{' +
      '  display: flex; flex-direction: column; gap: 16px;' +
      '  animation: demazeDetailFade 0.25s cubic-bezier(.22,1,.36,1);' +
      '}' +
      '@keyframes demazeDetailFade{' +
      '  from { opacity: 0; transform: translateY(6px); }' +
      '  to { opacity: 1; transform: translateY(0); }' +
      '}' +
      '.demaze-detail-head{' +
      '  display: flex; align-items: flex-start; gap: 16px;' +
      '}' +
      '.demaze-detail-badge-icon{' +
      '  width: 48px; height: 48px; border-radius: 12px;' +
      '  background: #ffffff; border: 1px solid #e2e8f0;' +
      '  box-shadow: 0 4px 14px rgba(15, 23, 42, 0.08);' +
      '  display: flex; align-items: center; justify-content: center;' +
      '  color: #2563eb; flex-shrink: 0;' +
      '}' +
      '.demaze-detail-badge-icon svg{ width: 24px; height: 24px; }' +
      '.demaze-detail-eyebrow{' +
      '  font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.09em;' +
      '  color: #2563eb; margin-bottom: 4px; display: block;' +
      '}' +
      '.demaze-detail-title{' +
      '  font-size: 22px; font-weight: 700; color: #0f172a; margin: 0; line-height: 1.25;' +
      '  font-family: "Stack Sans Headline", -apple-system, sans-serif;' +
      '}' +
      '.demaze-detail-desc{' +
      '  font-size: 14px; line-height: 1.65; color: #475569; margin: 0;' +
      '}' +
      '.demaze-detail-section-title{' +
      '  font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.08em;' +
      '  color: #94a3b8; margin-bottom: 8px;' +
      '}' +
      '.demaze-detail-chips{' +
      '  display: flex; flex-wrap: wrap; gap: 7px;' +
      '}' +
      '.demaze-chip{' +
      '  font-size: 12px; font-weight: 500; padding: 4.5px 12px; border-radius: 999px;' +
      '  background: #ffffff; color: #0f172a;' +
      '  border: 1px solid #e2e8f0; box-shadow: 0 1px 3px rgba(0,0,0,0.03);' +
      '}' +
      '.demaze-chip.primary{' +
      '  background: rgba(37, 99, 235, 0.08); color: #2563eb;' +
      '  border-color: rgba(37, 99, 235, 0.22); font-weight: 600;' +
      '}' +
      '.demaze-detail-footer{' +
      '  display: flex; align-items: center; justify-content: space-between; gap: 16px;' +
      '  margin-top: 24px; padding-top: 18px; border-top: 1px solid #e2e8f0;' +
      '}' +
      '.demaze-detail-live{' +
      '  display: flex; align-items: center; gap: 7px; font-size: 11.5px; font-weight: 600; color: #10b981;' +
      '}' +
      '.demaze-detail-live-dot{' +
      '  width: 7px; height: 7px; border-radius: 50%; background: #10b981;' +
      '  box-shadow: 0 0 8px #10b981; animation: demazeLiveGlow 2s infinite ease-in-out;' +
      '}' +
      '@keyframes demazeLiveGlow{' +
      '  0%,100%{ opacity: 0.6; transform: scale(0.9); } 50%{ opacity: 1; transform: scale(1.15); box-shadow: 0 0 10px #10b981; }' +
      '}' +
      '.demaze-detail-btn{' +
      '  display: inline-flex; align-items: center; gap: 8px;' +
      '  background: #0284c7 !important; color: #ffffff !important; -webkit-text-fill-color: #ffffff !important;' +
      '  padding: 10px 20px; border-radius: 999px;' +
      '  font-size: 13px; font-weight: 600; text-decoration: none !important;' +
      '  transition: all 0.2s cubic-bezier(.22,1,.36,1); box-shadow: 0 4px 16px rgba(2, 132, 199, 0.28);' +
      '}' +
      '.demaze-detail-btn, .demaze-detail-btn *, .demaze-detail-btn span{' +
      '  color: #ffffff !important; -webkit-text-fill-color: #ffffff !important; text-decoration: none !important;' +
      '}' +
      '.demaze-detail-btn:hover{' +
      '  background: #0369a1 !important; transform: translateY(-2px);' +
      '  box-shadow: 0 8px 24px rgba(2, 132, 199, 0.45);' +
      '}' +
      '.demaze-detail-btn svg{ width: 14px; height: 14px; transition: transform 0.2s ease; fill: currentColor; }' +
      '.demaze-detail-btn:hover svg{ transform: translateX(3px); }' +

      /* Telemetry Metric Cards Below the Stage */
      '.demaze-ind-telemetry{' +
      '  display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px;' +
      '  margin: 20px auto 0;' +
      '}' +
      '.demaze-telemetry-box{' +
      '  background: #ffffff; border: 1px solid #e2e8f0; border-radius: 16px;' +
      '  padding: 18px 22px; box-shadow: 0 4px 16px rgba(15, 23, 42, 0.04);' +
      '  transition: transform 0.25s ease, border-color 0.25s ease, box-shadow 0.25s ease;' +
      '  display: flex; flex-direction: column; gap: 4px;' +
      '}' +
      '.demaze-telemetry-box:hover{' +
      '  transform: translateY(-2px); border-color: rgba(37, 99, 235, 0.35);' +
      '  box-shadow: 0 10px 24px rgba(15, 23, 42, 0.08);' +
      '}' +
      '.demaze-telemetry-num{' +
      '  font-size: 24px; font-weight: 700; color: #0f172a;' +
      '  font-family: "Stack Sans Headline", -apple-system, sans-serif;' +
      '}' +
      '.demaze-telemetry-title{' +
      '  font-size: 13px; font-weight: 600; color: #2563eb;' +
      '}' +
      '.demaze-telemetry-desc{' +
      '  font-size: 11.5px; color: #64748b; line-height: 1.4;' +
      '}' +

      /* Responsive Breakpoints */
      '@media (max-width: 1024px){' +
      '  .demaze-industries-wrapper{ padding: 0 20px; }' +
      '  .demaze-industries-stage{ grid-template-columns: 1fr; border-radius: 20px; }' +
      '  .demaze-ind-directory{ border-right: none; border-bottom: 1px solid #f1f5f9; padding: 14px 12px; max-height: 280px; overflow-y: auto; }' +
      '  .demaze-ind-detail{ padding: 22px 20px; }' +
      '  .demaze-ind-telemetry{ grid-template-columns: repeat(3, 1fr); gap: 12px; }' +
      '}' +
      '@media (max-width: 768px){' +
      '  .framer-1p5myw3, section[data-framer-name="Tools"]:has([data-framer-name="Tab"]){ padding: 60px 0 !important; }' +
      '  .demaze-industries-wrapper{ padding: 0 16px; }' +
      '  .demaze-ind-header{ margin-bottom: 24px; }' +
      '  .demaze-ind-heading{ font-size: 28px; }' +
      '  .demaze-ind-directory{ grid-template-columns: 1fr; max-height: 250px; overflow-y: auto; }' +
      '  .demaze-ind-telemetry{ grid-template-columns: 1fr; gap: 12px; margin-top: 16px; }' +
      '  .demaze-detail-footer{ flex-direction: column; align-items: flex-start; gap: 14px; }' +
      '  .demaze-detail-btn{ width: 100%; justify-content: center; }' +
      '}';
    document.head.appendChild(style);
  }

  function renderDetail(container, idx) {
    var item = INDUSTRIES[idx];
    var panel = container.querySelector('.demaze-ind-detail');
    if (!panel) return;

    panel.innerHTML =
      '<div class="demaze-detail-content">' +
      '  <div class="demaze-detail-head">' +
      '    <div class="demaze-detail-badge-icon">' + svg(item.icon) + '</div>' +
      '    <div>' +
      '      <span class="demaze-detail-eyebrow">VERTICAL ' + item.id + ' · ' + item.metric + '</span>' +
      '      <h3 class="demaze-detail-title">' + item.name + '</h3>' +
      '    </div>' +
      '  </div>' +
      '  <p class="demaze-detail-desc">' + item.desc + '</p>' +
      '  <div>' +
      '    <div class="demaze-detail-section-title">ENGINEERING CAPABILITIES</div>' +
      '    <div class="demaze-detail-chips">' +
      item.caps.map(function (c) {
        return '<span class="demaze-chip primary">' + c + '</span>';
      }).join('') +
      '    </div>' +
      '  </div>' +
      '  <div>' +
      '    <div class="demaze-detail-section-title">DOMAIN SPECIALIZATIONS</div>' +
      '    <div class="demaze-detail-chips">' +
      item.subsectors.map(function (s) {
        return '<span class="demaze-chip">' + s + '</span>';
      }).join('') +
      '    </div>' +
      '  </div>' +
      '</div>' +
      '<div class="demaze-detail-footer">' +
      '  <div class="demaze-detail-live">' +
      '    <span class="demaze-detail-live-dot"></span>' +
      '    <span>Production-Grade Architecture</span>' +
      '  </div>' +
      '  <a href="./contact" class="demaze-detail-btn">' +
      '    <span>Discuss ' + item.name.split(' ')[0] + ' Solutions</span>' +
      '    <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3.33 8h9.34M8 3.33 12.67 8 8 12.67"/></svg>' +
      '  </a>' +
      '</div>';
  }

  function mountIndustriesStage(section) {
    var origContainer = section.querySelector('[data-framer-name="Container"]');
    if (!origContainer) return;

    // Leave React's container DOM tree 100% intact to prevent React removeChild reconciliation errors,
    // simply hide it with CSS display none!
    origContainer.style.setProperty('display', 'none', 'important');

    if (section.querySelector('.demaze-industries-wrapper')) {
      return;
    }

    var wrapper = document.createElement('div');
    wrapper.className = 'demaze-industries-wrapper';

    // 1. Clean Section Header
    var headerEl = document.createElement('div');
    headerEl.className = 'demaze-ind-header';
    headerEl.innerHTML =
      '  <span class="demaze-ind-eyebrow">' +
      '    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>' +
      '    Domain Expertise' +
      '  </span>' +
      '  <h2 class="demaze-ind-heading">Industries We Serve</h2>' +
      '  <p class="demaze-ind-sub">Engineered AI, SaaS, and automation architectures delivering high-impact business outcomes across 19+ diverse sectors.</p>';
    wrapper.appendChild(headerEl);

    // 2. Build Master Stage
    var stage = document.createElement('div');
    stage.className = 'demaze-industries-stage';

    // Left directory
    var directory = document.createElement('div');
    directory.className = 'demaze-ind-directory';
    directory.setAttribute('role', 'tablist');

    INDUSTRIES.forEach(function (item, idx) {
      var row = document.createElement('button');
      row.type = 'button';
      row.className = 'demaze-ind-row' + (idx === 0 ? ' active' : '');
      row.setAttribute('role', 'tab');
      row.setAttribute('aria-selected', idx === 0 ? 'true' : 'false');
      row.setAttribute('tabindex', idx === 0 ? '0' : '-1');
      row.dataset.index = idx;

      row.innerHTML =
        '<span class="demaze-row-id">' + item.id + '</span>' +
        '<span class="demaze-row-icon">' + svg(item.icon) + '</span>' +
        '<span class="demaze-row-name">' + item.name + '</span>';

      function activate() {
        if (activeIndex === idx) return;
        activeIndex = idx;
        var allRows = directory.querySelectorAll('.demaze-ind-row');
        allRows.forEach(function (r, rIdx) {
          var on = rIdx === idx;
          r.classList.toggle('active', on);
          r.setAttribute('aria-selected', on ? 'true' : 'false');
          r.tabIndex = on ? 0 : -1;
        });
        renderDetail(stage, idx);
        if (directory.scrollHeight > directory.clientHeight + 10) {
          row.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
        }
      }

      row.addEventListener('mouseenter', activate);
      row.addEventListener('click', activate);
      row.addEventListener('focus', activate);

      directory.appendChild(row);
    });

    stage.appendChild(directory);

    // Right detail panel
    var detail = document.createElement('div');
    detail.className = 'demaze-ind-detail';
    detail.setAttribute('role', 'tabpanel');
    stage.appendChild(detail);

    wrapper.appendChild(stage);

    // Initial detail render
    renderDetail(stage, 0);

    // Keyboard support for roving tabindex
    directory.addEventListener('keydown', function (e) {
      var keys = { ArrowDown: 1, ArrowRight: 1, ArrowUp: -1, ArrowLeft: -1 };
      var allRows = directory.querySelectorAll('.demaze-ind-row');
      if (keys[e.key]) {
        e.preventDefault();
        var nextIdx = (activeIndex + keys[e.key] + INDUSTRIES.length) % INDUSTRIES.length;
        allRows[nextIdx].click();
        allRows[nextIdx].focus();
      } else if (e.key === 'Home') {
        e.preventDefault();
        allRows[0].click();
        allRows[0].focus();
      } else if (e.key === 'End') {
        e.preventDefault();
        allRows[allRows.length - 1].click();
        allRows[allRows.length - 1].focus();
      }
    });

    // 3. Append Telemetry Metric Cards below stage
    var telemetry = document.createElement('div');
    telemetry.className = 'demaze-ind-telemetry';
    telemetry.innerHTML =
      '<div class="demaze-telemetry-box">' +
      '  <span class="demaze-telemetry-num">19+ Verticals</span>' +
      '  <span class="demaze-telemetry-title">Cross-Industry Architectures</span>' +
      '  <span class="demaze-telemetry-desc">Deep domain specialization tailored from FinTech to HealthTech.</span>' +
      '</div>' +
      '<div class="demaze-telemetry-box">' +
      '  <span class="demaze-telemetry-num">45+ Deployments</span>' +
      '  <span class="demaze-telemetry-title">Production AI & Cloud Systems</span>' +
      '  <span class="demaze-telemetry-desc">Zero downtime, high-throughput architectures live in the real world.</span>' +
      '</div>' +
      '<div class="demaze-telemetry-box">' +
      '  <span class="demaze-telemetry-num">99.4% SLA</span>' +
      '  <span class="demaze-telemetry-title">Autonomous Precision & Speed</span>' +
      '  <span class="demaze-telemetry-desc">Validated models, sub-second inference, and verified enterprise security.</span>' +
      '</div>';
    wrapper.appendChild(telemetry);

    section.appendChild(wrapper);
  }

  function applyOverride(section) {
    ensureStyles();
    mountIndustriesStage(section);
  }

  function verifyStuck(section) {
    var stage = section && section.querySelector('.demaze-industries-stage');
    var activeRow = section && section.querySelector('.demaze-ind-row.active');
    return !!(stage && activeRow);
  }

  window.DemazeOverride.run({
    getRoot: getSection,
    isHydrated: isHydrated,
    apply: applyOverride,
    verify: verifyStuck
  });
})();
