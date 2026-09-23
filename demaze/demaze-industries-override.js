/**
 * Post-hydration content override for the Industries section.
 *
 * Implements the Proof-First Two-Tier Architecture:
 * - Tier 1: 6 Flagship / Proven Domains with verified case-study proof
 * - Tier 2: 7 Broader Domains actively supported by Demaze's engineering capabilities
 *
 * Fully responsive, zero nested scroll traps, zero header collision, and 100% accessible.
 */
(function () {
  if (!window.DemazeOverride) return;

  var ICONS = {
    card: '<rect width="20" height="14" x="2" y="5" rx="2"/><line x1="2" x2="22" y1="10" y2="10"/>',
    pulse: '<path d="M22 12h-4l-3 9L9 3l-3 9H2"/>',
    bag: '<path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z"/><path d="M3 6h18"/><path d="M16 10a4 4 0 0 1-8 0"/>',
    truck: '<path d="M14 18V6a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v11a1 1 0 0 0 1 1h2"/><path d="M15 18H9"/><path d="M19 18h2a1 1 0 0 0 1-1v-3.65a1 1 0 0 0-.22-.62l-3.48-4.35A1 1 0 0 0 17.52 8H14"/><circle cx="17" cy="18" r="2"/><circle cx="7" cy="18" r="2"/>',
    layers: '<path d="M12.83 2.18a2 2 0 0 0-1.66 0L2.6 6.08a1 1 0 0 0 0 1.83l8.58 3.91a2 2 0 0 0 1.66 0l8.58-3.9a1 1 0 0 0 0-1.83Z"/><path d="m22 17.65-9.17 4.16a2 2 0 0 1-1.66 0L2 17.65"/><path d="m22 12.65-9.17 4.16a2 2 0 0 1-1.66 0L2 12.65"/>',
    car: '<path d="M19 17h2c.6 0 1-.4 1-1v-3c0-.9-.7-1.7-1.5-1.9C18.7 10.6 16 10 16 10s-1.3-1.4-2.2-2.3c-.5-.4-1.1-.7-1.8-.7H5c-.6 0-1.1.4-1.4.9l-1.4 2.9A3.7 3.7 0 0 0 2 12v4c0 .6.4 1 1 1h2"/><circle cx="7" cy="17" r="2"/><path d="M9 17h6"/><circle cx="17" cy="17" r="2"/>',
    film: '<rect width="20" height="20" x="2" y="2" rx="2.18"/><line x1="7" x2="7" y1="2" y2="22"/><line x1="17" x2="17" y1="2" y2="22"/><line x1="2" x2="22" y1="12" y2="12"/>',
    cap: '<path d="M22 10v6"/><path d="m2 10 10-5 10 5-10 5z"/><path d="M6 12v5c3 3 9 3 12 0v-5"/>',
    utensils: '<path d="M3 2v7c0 1.1.9 2 2 2h4a2 2 0 0 0 2-2V2"/><path d="M7 2v20"/><path d="M21 15V2a5 5 0 0 0-5 5v6c0 1.1.9 2 2 2h3Zm0 0v7"/>',
    scale: '<path d="m16 16 3-8 3 8c-.87.65-1.92 1-3 1s-2.13-.35-3-1Z"/><path d="m2 16 3-8 3 8c-.87.65-1.92 1-3 1s-2.13-.35-3-1Z"/><path d="M7 21h10"/><path d="M12 3v18"/><path d="M3 7h2c2 0 5-1 7-2 2 1 5 2 7 2h2"/>',
    users: '<path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>',
    phone: '<rect width="14" height="20" x="5" y="2" rx="2"/><path d="M12 18h.01"/>',
    factory: '<path d="M2 20a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V8l-7 5V8l-7 5V4a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2Z"/><path d="M17 18h1"/><path d="M12 18h1"/><path d="M7 18h1"/>'
  };

  function svg(key) {
    var p = ICONS[key] || ICONS.layers;
    return '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' + p + '</svg>';
  }

  // TIER 1: FLAGSHIP / PROVEN DOMAINS (Backed by verified case studies)
  var FLAGSHIP_DOMAINS = [
    {
      id: '01',
      tier: 1,
      tierBadge: 'PROVEN PRODUCTION DEPLOYMENT',
      icon: 'car',
      name: 'Automotive & Mobility',
      tagline: 'Dealership & Workshop OS',
      desc: 'High-performance software for automotive dealership networks, automating used vehicle appraisals, instant multi-bank EMI financing calculations, and connected workshop service scheduling.',
      proofCase: {
        title: 'Featured Project: AI-Based Software for Luxury Car Dealers',
        summary: 'Architected and deployed for one of India\'s largest luxury automotive dealership groups, streamlining used car appraisal algorithms, instant multi-bank EMI calculations, and refurbishment tracking.'
      },
      caps: ['Automated Vehicle Valuation AI', 'Instant Multi-Bank EMI Engines', 'Dealership Operations OS', 'Workshop Bay Scheduling', 'Fleet Refurbishment Tracking'],
      subsectors: ['Luxury Dealerships', 'Automotive CRM', 'Service Operations', 'Financing Calculators']
    },
    {
      id: '02',
      tier: 1,
      tierBadge: 'PROVEN PRODUCTION DEPLOYMENT',
      icon: 'scale',
      name: 'Legal Tech & Compliance',
      tagline: 'Investigative Case Management',
      desc: 'Secure, zero-trust web platforms built for legal investigators and professional practices, featuring encrypted media vaults, automated case transcription, and compliance report generation.',
      proofCase: {
        title: 'Featured Project: Investigative Case Management Software',
        summary: 'Secure web-based operating system empowering private investigators with encrypted evidence indexing, automated case workflows, and subscription-based auto-billing.'
      },
      caps: ['AI-Powered Evidence Tools', 'Encrypted Document Vaults', 'Automated Case Workflows', 'Subscription Auto-Billing', 'Audit Log Compliance'],
      subsectors: ['Legal Practice OS', 'Case Evidence Management', 'Document Automation', 'Secure Client Portals']
    },
    {
      id: '03',
      tier: 1,
      tierBadge: 'PROVEN PRODUCTION DEPLOYMENT',
      icon: 'bag',
      name: 'Intelligent E-Commerce',
      tagline: 'Marketplaces & Unified Commerce',
      desc: 'Modern commerce ecosystems combining multi-vendor marketplaces, dynamic drop auctions, live video shopping, and AI recommendation engines engineered for high-concurrency transactions.',
      proofCase: {
        title: 'Featured Project: AI-Powered Luxury eCommerce Platform',
        summary: 'High-performance luxury retail and lifestyle commerce platform featuring virtual try-on models, custom drag-and-drop CMS, and automated multi-channel inventory synchronization.'
      },
      caps: ['Multi-Vendor Marketplaces', 'AI Personalization & Try-Ons', 'Dynamic Auction Engines', 'Custom Drag-and-Drop CMS', 'Multi-Currency Checkout'],
      subsectors: ['Luxury Commerce', 'B2B Marketplaces', 'Live Video Selling', 'Inventory Management']
    },
    {
      id: '04',
      tier: 1,
      tierBadge: 'PROVEN PRODUCTION DEPLOYMENT',
      icon: 'truck',
      name: 'Logistics & Fleet Automation',
      tagline: 'On-Demand Dispatch & Telematics',
      desc: 'Mission-critical dispatch engines, dynamic route optimization, real-time courier GPS tracking, and multi-hub fulfillment synchronization for high-velocity delivery operations.',
      proofCase: {
        title: 'Documented Case Study: Multi-Shopper On-Demand Delivery & Dispatch',
        summary: 'Real-time grocery logistics application synchronizing customer ordering, in-store personal shopper batching, and automated courier dispatch with live GPS tracking.'
      },
      caps: ['Dynamic Courier Dispatch', 'Real-Time GPS Telematics', 'Automated Route Optimization', 'Multi-Store Batching', 'Fulfillment Inventory Sync'],
      subsectors: ['On-Demand Delivery', 'Fleet Routing', 'Last-Mile Logistics', 'Warehouse Sync']
    },
    {
      id: '05',
      tier: 1,
      tierBadge: 'PROVEN PRODUCTION DEPLOYMENT',
      icon: 'card',
      name: 'Financial AI & Banking',
      tagline: 'Lending Analysis & Payment Rails',
      desc: 'AI financial statement parsing engines, automated Credit Monitoring Arrangement (CMA) generation for corporate loan sanctioning, and secure cross-border payment transfer rails.',
      proofCase: {
        title: 'Featured Project: Global Payment Transfer Platform',
        summary: 'High-throughput cross-border remittance engine engineered with real-time foreign exchange rate feeds, automated AML/KYC identity screening, and bank-grade multi-tier settlement rails.'
      },
      caps: ['AI Financial Statement Parsing', 'Bank-Ready CMA Report Generation', 'Cross-Border Payment Rails', 'Automated KYC/AML Screening', 'Balance Sheet Stress Testing'],
      subsectors: ['Commercial Lending', 'Payment Transfer Rails', 'Regulatory Screening', 'Credit Analysis']
    },
    {
      id: '06',
      tier: 1,
      tierBadge: 'PROVEN PRODUCTION DEPLOYMENT',
      icon: 'film',
      name: 'Generative AI & Media',
      tagline: 'Script-to-Visual Storyboarding',
      desc: 'Generative AI software tools for directors and creative studios, turning cinematic scripts into visual storyboard frames with strict character consistency and directorial framing controls.',
      proofCase: {
        title: 'Documented Case Study: AI Storyboard Creation Engine for Films',
        summary: 'Engineered generative diffusion workflows allowing filmmakers to visualize scene beats, preserve character appearance across frames, and export director presentation packages.'
      },
      caps: ['Script-to-Image Generation', 'Character Model Consistency', 'Cinematic Framing Tools', 'Director Production Packages', 'Prompt-to-Scene Sequencing'],
      subsectors: ['Generative Media', 'Film Pre-Production', 'Content Creation Tools', 'Creative Studio Workflows']
    }
  ];

  // TIER 2: BROADER DOMAINS (Grounded in Demaze's engineering source material)
  var SECONDARY_DOMAINS = [
    {
      id: '07',
      tier: 2,
      tierBadge: 'ADDITIONAL SUPPORTED DOMAIN',
      icon: 'pulse',
      name: 'Healthcare & Wellbeing',
      tagline: 'Community & Senior Support',
      desc: 'Digital wellness platforms, personalized coaching workflows, senior engagement networks, and compassionate mental health communities.',
      proofCase: {
        title: 'Relevant Project Proof: Sukoon Senior Support Platform',
        summary: 'Developed dedicated community web software featuring 1-on-1 counseling booking, caregiver portals, and interactive social meetups for seniors.'
      },
      caps: ['Senior Care Engagement Platforms', 'Coaching & Counseling Portals', 'Caregiver Dashboards', 'Community Engagement Tools'],
      subsectors: ['Digital Wellbeing', 'Senior Care', 'Community Health', 'Counseling Portals']
    },
    {
      id: '08',
      tier: 2,
      tierBadge: 'ADDITIONAL SUPPORTED DOMAIN',
      icon: 'cap',
      name: 'Education & EdTech',
      tagline: 'Digital Learning & LMS',
      desc: 'Scalable digital academy platforms supporting concurrent learners with video lesson delivery, timed interactive assessments, and automated certification.',
      proofCase: {
        title: 'Relevant Project Proof: Educational LMS Platform',
        summary: 'Engineered an academy platform with automated grading, student progress analytics, and interactive course management.'
      },
      caps: ['Learning Management Systems (LMS)', 'Video Course Delivery', 'Automated Grading Engines', 'Certification Generation'],
      subsectors: ['Online Academies', 'Interactive Assessments', 'Student Portals', 'Corporate Training']
    },
    {
      id: '09',
      tier: 2,
      tierBadge: 'ADDITIONAL SUPPORTED DOMAIN',
      icon: 'users',
      name: 'HR Tech & Talent',
      tagline: 'Recruitment & Matching AI',
      desc: 'Intelligent talent acquisition engines using NLP to evaluate candidate resumes against technical requisitions with unbiased ranking and interview automation.',
      proofCase: {
        title: 'Relevant Project Proof: Intelligent Recruitment Platform',
        summary: 'Built candidate matching software utilizing semantic text parsing and automated interview scheduling.'
      },
      caps: ['Semantic Resume Parsing', 'Candidate Matching Engines', 'Interview Scheduling Automation', 'Hiring Pipeline Analytics'],
      subsectors: ['Recruitment Automation', 'Technical Sourcing', 'Applicant Tracking', 'Candidate Portals']
    },
    {
      id: '10',
      tier: 2,
      tierBadge: 'ADDITIONAL SUPPORTED DOMAIN',
      icon: 'layers',
      name: 'Enterprise SaaS & Workflows',
      tagline: 'Operational Workspaces',
      desc: 'Integrated organizational operations workspaces unifying Kanban project management, geofenced staff attendance verification, and role-based document permissions.',
      proofCase: {
        title: 'Relevant Project Proof: Task, Staff & Document Management Platform',
        summary: 'Engineered multi-tenant enterprise software with permission-tiered document storage and geofenced attendance.'
      },
      caps: ['Multi-Tenant SaaS Core', 'Kanban Task Pipelines', 'Geofenced Staff Verification', 'Role-Based Document Permissions'],
      subsectors: ['Enterprise Workflows', 'Internal Tooling', 'Document Portals', 'Operational Dashboards']
    },
    {
      id: '11',
      tier: 2,
      tierBadge: 'ADDITIONAL SUPPORTED DOMAIN',
      icon: 'factory',
      name: 'B2B Commerce & Procurement',
      tagline: 'Corporate Gifting & Wholesale',
      desc: 'Enterprise procurement platforms automating bulk corporate orders, multi-company account billing, and cross-border delivery reconciliation.',
      proofCase: {
        title: 'Relevant Project Proof: B2B Corporate Gifting Marketplace',
        summary: 'Delivered an enterprise portal automating corporate swag distribution and corporate procurement compliance.'
      },
      caps: ['Bulk Order Management', 'Corporate Account Portals', 'Procurement Workflows', 'Multi-Company Invoicing'],
      subsectors: ['B2B Wholesale', 'Corporate Procurement', 'Vendor Portals', 'Account Management']
    },
    {
      id: '12',
      tier: 2,
      tierBadge: 'ADDITIONAL SUPPORTED DOMAIN',
      icon: 'utensils',
      name: 'Food & Delivery Operations',
      tagline: 'Multi-Store Delivery Apps',
      desc: 'Customer ordering applications, in-store personal shopper pick-lists, and integrated on-demand courier dispatch systems.',
      proofCase: {
        title: 'Relevant Project Proof: On-Demand Grocery Delivery Architecture',
        summary: 'Synchronizing multi-store inventory catalogs, customer mobile ordering, and real-time courier pickup.'
      },
      caps: ['Customer Mobile Ordering', 'Multi-Store Catalog Sync', 'Shopper Picking Workflows', 'Courier Dispatch Integration'],
      subsectors: ['On-Demand Food', 'Grocery Delivery', 'Catalog Synchronization', 'Store Operations']
    },
    {
      id: '13',
      tier: 2,
      tierBadge: 'ADDITIONAL SUPPORTED DOMAIN',
      icon: 'phone',
      name: 'Retail Storefronts & POS',
      tagline: 'Omnichannel Operations',
      desc: 'Point-of-sale integrations, omnichannel catalog synchronization, customer loyalty programs, and digital checkout flows.',
      proofCase: {
        title: 'Relevant Capability Proof: Retail Digital Product Engineering',
        summary: 'Synchronizing digital storefronts with inventory reconciliation and unified customer payment accounts.'
      },
      caps: ['Omnichannel POS Sync', 'Inventory Reconciliation', 'Loyalty Program Engines', 'Checkout Optimization'],
      subsectors: ['Store Operations', 'Loyalty Programs', 'Digital Storefronts', 'Payment Terminals']
    }
  ];

  var ALL_DOMAINS = FLAGSHIP_DOMAINS.concat(SECONDARY_DOMAINS);
  var activeIndex = 0;

  function getSection() {
    var sections = document.querySelectorAll('section[data-framer-name="Tools"]');
    return sections[1] || document.querySelector('section.framer-1p5myw3') || null;
  }

  function isHydrated(section) {
    var container = section && section.querySelector('[data-framer-name="Container"]');
    return !!container;
  }

  var STYLE_ID = 'demaze-industries-twotier-style';

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

      /* Section Framing */
      '.framer-1p5myw3, section[data-framer-name="Tools"]:has([data-framer-name="Tab"]){' +
      '  padding: 96px 0 104px !important;' +
      '  position: relative !important;' +
      '  background: #ffffff !important;' +
      '}' +
      '.demaze-industries-wrapper{' +
      '  width: 100%; max-width: 1240px; margin: 0 auto; padding: 0 24px; box-sizing: border-box;' +
      '}' +

      /* Section Header */
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
      '  font-size: clamp(32px, 3.8vw, 48px); font-weight: 700; line-height: 1.15;' +
      '  color: #0f172a; margin: 0 0 14px; text-wrap: balance;' +
      '  font-family: "Stack Sans Headline", -apple-system, sans-serif;' +
      '  letter-spacing: -0.02em;' +
      '}' +
      '.demaze-ind-sub{' +
      '  font-size: clamp(15px, 1.2vw, 17px); line-height: 1.6; color: #475569;' +
      '  max-width: 720px; margin: 0 auto; text-wrap: balance;' +
      '}' +

      /* Master Stage: 2-Column Desktop Grid */
      '.demaze-industries-stage{' +
      '  display: grid; grid-template-columns: 1.1fr 0.9fr; gap: 0;' +
      '  background: #ffffff;' +
      '  border: 1px solid #e2e8f0; border-radius: 24px;' +
      '  box-shadow: 0 20px 50px -15px rgba(15, 23, 42, 0.07), 0 0 0 1px rgba(226, 232, 240, 0.6);' +
      '  overflow: hidden; margin: 0 auto;' +
      '  position: relative; z-index: 2;' +
      '}' +

      /* Left: Two-Tier Directory (NO nested scroll prison) */
      '.demaze-ind-directory{' +
      '  padding: 24px; display: flex; flex-direction: column; gap: 18px;' +
      '  background: #ffffff; border-right: 1px solid #f1f5f9;' +
      '  box-sizing: border-box;' +
      '}' +

      /* Tier Group Headers */
      '.demaze-tier-header{' +
      '  display: flex; align-items: center; justify-content: space-between;' +
      '  margin-bottom: 10px; padding-bottom: 6px; border-bottom: 1px solid #f1f5f9;' +
      '}' +
      '.demaze-tier-title-wrap{' +
      '  display: flex; align-items: center; gap: 8px;' +
      '}' +
      '.demaze-tier-label{' +
      '  font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.08em; color: #0f172a;' +
      '}' +
      '.demaze-tier-badge{' +
      '  font-size: 10px; font-weight: 700; padding: 2px 8px; border-radius: 999px;' +
      '  letter-spacing: 0.04em;' +
      '}' +
      '.demaze-tier-badge.tier-1{' +
      '  background: rgba(37, 99, 235, 0.10); color: #1d4ed8; border: 1px solid rgba(37, 99, 235, 0.22);' +
      '}' +
      '.demaze-tier-badge.tier-2{' +
      '  background: #f1f5f9; color: #64748b; border: 1px solid #e2e8f0;' +
      '}' +

      /* Tier 1 Grid (Prominent Flagship Cards) */
      '.demaze-tier1-grid{' +
      '  display: grid; grid-template-columns: 1fr 1fr; gap: 8px;' +
      '}' +
      '.demaze-ind-row{' +
      '  display: flex; align-items: center; gap: 10px;' +
      '  width: 100%; min-height: 48px; padding: 10px 12px; background: #ffffff;' +
      '  border: 1px solid #e2e8f0; border-radius: 12px; box-sizing: border-box;' +
      '  cursor: pointer; text-align: left; transition: all 0.2s cubic-bezier(.22,1,.36,1);' +
      '  outline: none; user-select: none; position: relative;' +
      '}' +
      '.demaze-ind-row:hover{' +
      '  background: #f8fafc; border-color: #cbd5e1; transform: translateY(-1px);' +
      '  box-shadow: 0 4px 12px rgba(15, 23, 42, 0.04);' +
      '}' +
      '.demaze-ind-row:focus-visible{' +
      '  outline: 2px solid #2563eb !important; outline-offset: 2px !important;' +
      '}' +
      '.demaze-ind-row.active{' +
      '  background: rgba(37, 99, 235, 0.06); border-color: #2563eb;' +
      '  box-shadow: 0 4px 16px rgba(37, 99, 235, 0.14);' +
      '}' +
      '.demaze-row-id{' +
      '  font-size: 10.5px; font-weight: 700; font-family: ui-monospace, SFMono-Regular, Menlo, monospace;' +
      '  color: #64748b; letter-spacing: 0.02em; flex-shrink: 0;' +
      '}' +
      '.demaze-ind-row.active .demaze-row-id{' +
      '  color: #1d4ed8;' +
      '}' +
      '.demaze-row-icon{' +
      '  display: inline-flex; align-items: center; justify-content: center;' +
      '  width: 28px; height: 28px; border-radius: 8px;' +
      '  background: #f1f5f9; color: #475569; flex-shrink: 0;' +
      '  transition: all 0.2s ease;' +
      '}' +
      '.demaze-row-icon svg{ width: 15px; height: 15px; }' +
      '.demaze-ind-row:hover .demaze-row-icon{' +
      '  background: #e2e8f0; color: #0f172a;' +
      '}' +
      '.demaze-ind-row.active .demaze-row-icon{' +
      '  background: #2563eb; color: #ffffff;' +
      '  box-shadow: 0 2px 8px rgba(37, 99, 235, 0.35);' +
      '}' +
      '.demaze-row-meta{' +
      '  display: flex; flex-direction: column; min-width: 0; flex: 1;' +
      '}' +
      '.demaze-row-name{' +
      '  font-size: 12.5px; font-weight: 600; color: #0f172a;' +
      '  white-space: normal; word-break: normal; overflow-wrap: break-word;' +
      '  line-height: 1.3;' +
      '}' +
      '.demaze-row-tagline{' +
      '  font-size: 10.5px; color: #64748b; line-height: 1.2;' +
      '  white-space: normal; word-break: normal; overflow-wrap: break-word;' +
      '}' +
      '.demaze-ind-row.active .demaze-row-name{ color: #1d4ed8; }' +
      '.demaze-ind-row.active .demaze-row-tagline{ color: #2563eb; }' +

      /* Tier 2 Subordinate List */
      '.demaze-tier2-grid{' +
      '  display: grid; grid-template-columns: repeat(2, 1fr); gap: 6px 8px;' +
      '}' +
      '.demaze-ind-row.tier-2{' +
      '  background: #f8fafc; border-color: #f1f5f9; min-height: 48px; padding: 12px 12px;' +
      '  border-radius: 8px;' +
      '}' +
      '.demaze-ind-row.tier-2:hover{' +
      '  background: #f1f5f9; border-color: #e2e8f0;' +
      '}' +
      '.demaze-ind-row.tier-2.active{' +
      '  background: rgba(37, 99, 235, 0.07); border-color: #2563eb;' +
      '}' +
      '.demaze-ind-row.tier-2 .demaze-row-icon{' +
      '  width: 24px; height: 24px; border-radius: 6px;' +
      '}' +
      '.demaze-ind-row.tier-2 .demaze-row-icon svg{ width: 13px; height: 13px; }' +
      '.demaze-ind-row.tier-2 .demaze-row-name{' +
      '  font-size: 12px; font-weight: 500; color: #475569;' +
      '}' +
      '.demaze-ind-row.tier-2.active .demaze-row-name{' +
      '  color: #0f172a; font-weight: 700;' +
      '}' +

      /* Right: Detail Stage Panel */
      '.demaze-ind-detail{' +
      '  padding: 32px; display: flex; flex-direction: column; justify-content: space-between;' +
      '  background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%);' +
      '  position: relative; box-sizing: border-box;' +
      '  scroll-margin-top: 96px;' +
      '}' +
      '.demaze-detail-content{' +
      '  display: flex; flex-direction: column; gap: 18px;' +
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
      '  width: 50px; height: 50px; border-radius: 14px;' +
      '  background: #ffffff; border: 1px solid #e2e8f0;' +
      '  box-shadow: 0 4px 14px rgba(15, 23, 42, 0.08);' +
      '  display: flex; align-items: center; justify-content: center;' +
      '  color: #2563eb; flex-shrink: 0;' +
      '}' +
      '.demaze-detail-badge-icon svg{ width: 26px; height: 26px; }' +
      '.demaze-detail-eyebrow{' +
      '  font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.09em;' +
      '  color: #2563eb; margin-bottom: 4px; display: flex; align-items: center; gap: 6px;' +
      '}' +
      '.demaze-detail-eyebrow.tier-2{ color: #64748b; }' +
      '.demaze-detail-title{' +
      '  font-size: 24px; font-weight: 700; color: #0f172a; margin: 0; line-height: 1.2;' +
      '  font-family: "Stack Sans Headline", -apple-system, sans-serif;' +
      '}' +
      '.demaze-detail-desc{' +
      '  font-size: 14px; line-height: 1.65; color: #475569; margin: 0;' +
      '}' +

      /* Verified Case Proof Card (Inside Tier 1 details) */
      '.demaze-verified-proof-card{' +
      '  background: #ffffff; border: 1px solid rgba(37, 99, 235, 0.22); border-radius: 12px;' +
      '  padding: 14px 16px; box-shadow: 0 4px 12px rgba(37, 99, 235, 0.05);' +
      '}' +
      '.demaze-proof-header{' +
      '  display: flex; align-items: center; gap: 6px; font-size: 10.5px; font-weight: 700;' +
      '  color: #2563eb; text-transform: uppercase; letter-spacing: 0.08em; margin-bottom: 4px;' +
      '}' +
      '.demaze-proof-title{' +
      '  font-size: 12.5px; font-weight: 700; color: #0f172a; margin-bottom: 4px;' +
      '}' +
      '.demaze-proof-summary{' +
      '  font-size: 12px; color: #64748b; line-height: 1.5; margin: 0;' +
      '}' +

      /* Section titles & chips */
      '.demaze-detail-section-title{' +
      '  font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.08em;' +
      '  color: #94a3b8; margin-bottom: 8px;' +
      '}' +
      '.demaze-detail-chips{' +
      '  display: flex; flex-wrap: wrap; gap: 6px;' +
      '}' +
      '.demaze-chip{' +
      '  font-size: 12px; font-weight: 500; padding: 4px 12px; border-radius: 999px;' +
      '  background: #ffffff; color: #0f172a;' +
      '  border: 1px solid #e2e8f0; box-shadow: 0 1px 3px rgba(0,0,0,0.03);' +
      '}' +
      '.demaze-chip.primary{' +
      '  background: rgba(37, 99, 235, 0.08); color: #1d4ed8;' +
      '  border-color: rgba(37, 99, 235, 0.22); font-weight: 600;' +
      '}' +

      /* Detail Footer */
      '.demaze-detail-footer{' +
      '  display: flex; align-items: center; justify-content: space-between; gap: 16px;' +
      '  margin-top: 24px; padding-top: 20px; border-top: 1px solid #e2e8f0;' +
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
      '  padding: 12px 22px; border-radius: 999px; min-height: 48px; box-sizing: border-box;' +
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
      '.demaze-detail-btn:focus-visible{' +
      '  outline: 2px solid #2563eb !important; outline-offset: 2px !important;' +
      '}' +
      '.demaze-detail-btn svg{ width: 14px; height: 14px; transition: transform 0.2s ease; fill: currentColor; }' +
      '.demaze-detail-btn:hover svg{ transform: translateX(3px); }' +

      /* Verified Engineering Telemetry (Replacing 19+ vanity metric) */
      '.demaze-ind-telemetry{' +
      '  display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px;' +
      '  margin: 24px auto 0;' +
      '}' +
      '.demaze-telemetry-box{' +
      '  background: #ffffff; border: 1px solid #e2e8f0; border-radius: 16px;' +
      '  padding: 20px 22px; box-shadow: 0 4px 16px rgba(15, 23, 42, 0.04);' +
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
      '  font-size: 12px; color: #64748b; line-height: 1.4;' +
      '}' +

      /* Responsive Breakpoints */
      '@media (max-width: 1024px){' +
      '  .demaze-industries-wrapper{ padding: 0 20px; }' +
      '  .demaze-industries-stage{ grid-template-columns: 1fr; border-radius: 20px; }' +
      '  .demaze-ind-directory{ border-right: none; border-bottom: 1px solid #f1f5f9; padding: 20px 18px; max-height: none !important; overflow: visible !important; }' +
      '  .demaze-tier1-grid{ grid-template-columns: 1fr 1fr; gap: 10px; }' +
      '  .demaze-tier2-grid{ grid-template-columns: repeat(2, 1fr); gap: 8px; }' +
      '  .demaze-ind-detail{ padding: 26px 22px; border-radius: 0 0 20px 20px; }' +
      '  .demaze-ind-telemetry{ grid-template-columns: repeat(3, 1fr); gap: 12px; }' +
      '}' +
      '@media (max-width: 768px){' +
      '  .framer-1p5myw3, section[data-framer-name="Tools"]:has([data-framer-name="Tab"]){ padding: 64px 0 !important; }' +
      '  .demaze-industries-wrapper{ padding: 0 16px; }' +
      '  .demaze-ind-header{ margin-bottom: 28px; }' +
      '  .demaze-ind-heading{ font-size: 28px; }' +
      '  .demaze-tier1-grid{ grid-template-columns: 1fr; gap: 8px; }' +
      '  .demaze-tier2-grid{ grid-template-columns: 1fr; gap: 8px; }' +
      '  .demaze-ind-row{ min-height: 48px !important; padding: 12px 14px !important; }' +
      '  .demaze-ind-row.tier-2{ min-height: 48px !important; padding: 12px 14px !important; }' +
      '  .demaze-ind-directory{ padding: 16px 14px; }' +
      '  .demaze-ind-detail{ padding: 22px 18px; }' +
      '  .demaze-detail-title{ font-size: 21px; }' +
      '  .demaze-ind-telemetry{ grid-template-columns: 1fr; gap: 12px; margin-top: 16px; }' +
      '  .demaze-detail-footer{ flex-direction: column; align-items: flex-start; gap: 14px; }' +
      '  .demaze-detail-btn{ width: 100%; justify-content: center; min-height: 48px !important; padding: 12px 20px !important; }' +
      '}';
    document.head.appendChild(style);
  }

  function renderDetail(container, idx) {
    var item = ALL_DOMAINS[idx];
    var panel = container.querySelector('.demaze-ind-detail');
    if (!panel) return;

    var proofHTML = '';
    if (item.proofCase) {
      proofHTML =
        '<div class="demaze-verified-proof-card">' +
        '  <div class="demaze-proof-header">' +
        '    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"/></svg>' +
        '    ' + (item.tier === 1 ? 'Verified Client Production Proof' : 'Demonstrated Project Alignment') +
        '  </div>' +
        '  <div class="demaze-proof-title">' + item.proofCase.title + '</div>' +
        '  <p class="demaze-proof-summary">' + item.proofCase.summary + '</p>' +
        '</div>';
    }

    panel.innerHTML =
      '<div class="demaze-detail-content">' +
      '  <div class="demaze-detail-head">' +
      '    <div class="demaze-detail-badge-icon">' + svg(item.icon) + '</div>' +
      '    <div>' +
      '      <span class="demaze-detail-eyebrow ' + (item.tier === 2 ? 'tier-2' : '') + '">' +
      '        ' + (item.tier === 1 ? '★ TIER 1 · ' : 'TIER 2 · ') + item.tierBadge +
      '      </span>' +
      '      <h3 class="demaze-detail-title">' + item.name + '</h3>' +
      '    </div>' +
      '  </div>' +
      '  <p class="demaze-detail-desc">' + item.desc + '</p>' +
      proofHTML +
      '  <div>' +
      '    <div class="demaze-detail-section-title">ENGINEERING CAPABILITIES</div>' +
      '    <div class="demaze-detail-chips">' +
      item.caps.map(function (c) {
        return '<span class="demaze-chip primary">' + c + '</span>';
      }).join('') +
      '    </div>' +
      '  </div>' +
      '  <div>' +
      '    <div class="demaze-detail-section-title">DOMAIN FOCUS AREAS</div>' +
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

    // Leave React's container DOM tree intact to avoid reconciliation errors
    origContainer.style.setProperty('display', 'none', 'important');

    if (section.querySelector('.demaze-industries-wrapper')) {
      return;
    }

    var wrapper = document.createElement('div');
    wrapper.className = 'demaze-industries-wrapper';

    // 1. Positioning Section Header
    var headerEl = document.createElement('div');
    headerEl.className = 'demaze-ind-header';
    headerEl.innerHTML =
      '  <span class="demaze-ind-eyebrow">' +
      '    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>' +
      '    Demonstrated Domain Depth' +
      '  </span>' +
      '  <h2 class="demaze-ind-heading">Industries We Know Through the Work</h2>' +
      '  <p class="demaze-ind-sub">Our deepest expertise comes from architecting and deploying real production software. Explore the core sectors where we have built battle-tested systems, alongside the broader domains we actively engineer.</p>';
    wrapper.appendChild(headerEl);

    // 2. Build Master Stage
    var stage = document.createElement('div');
    stage.className = 'demaze-industries-stage';

    // Left directory
    var directory = document.createElement('div');
    directory.className = 'demaze-ind-directory';
    directory.setAttribute('role', 'tablist');

    // TIER 1 SECTION
    var tier1Wrap = document.createElement('div');
    tier1Wrap.innerHTML =
      '<div class="demaze-tier-header">' +
      '  <div class="demaze-tier-title-wrap">' +
      '    <span class="demaze-tier-label">Demonstrated Depth</span>' +
      '    <span class="demaze-tier-badge tier-1">Tier 1 · Flagship Domains</span>' +
      '  </div>' +
      '</div>';
    var tier1Grid = document.createElement('div');
    tier1Grid.className = 'demaze-tier1-grid';

    // TIER 2 SECTION
    var tier2Wrap = document.createElement('div');
    tier2Wrap.innerHTML =
      '<div class="demaze-tier-header" style="margin-top: 8px;">' +
      '  <div class="demaze-tier-title-wrap">' +
      '    <span class="demaze-tier-label">Additional Supported Domains</span>' +
      '    <span class="demaze-tier-badge tier-2">Tier 2 · Extended Capabilities</span>' +
      '  </div>' +
      '</div>';
    var tier2Grid = document.createElement('div');
    tier2Grid.className = 'demaze-tier2-grid';

    ALL_DOMAINS.forEach(function (item, idx) {
      var row = document.createElement('button');
      row.type = 'button';
      row.className = 'demaze-ind-row' + (item.tier === 2 ? ' tier-2' : '') + (idx === 0 ? ' active' : '');
      row.setAttribute('role', 'tab');
      row.setAttribute('aria-selected', idx === 0 ? 'true' : 'false');
      row.setAttribute('tabindex', idx === 0 ? '0' : '-1');
      row.dataset.index = idx;

      if (item.tier === 1) {
        row.innerHTML =
          '<span class="demaze-row-id">' + item.id + '</span>' +
          '<span class="demaze-row-icon">' + svg(item.icon) + '</span>' +
          '<div class="demaze-row-meta">' +
          '  <span class="demaze-row-name">' + item.name + '</span>' +
          '  <span class="demaze-row-tagline">' + item.tagline + '</span>' +
          '</div>';
        tier1Grid.appendChild(row);
      } else {
        row.innerHTML =
          '<span class="demaze-row-id">' + item.id + '</span>' +
          '<span class="demaze-row-icon">' + svg(item.icon) + '</span>' +
          '<div class="demaze-row-meta">' +
          '  <span class="demaze-row-name">' + item.name + '</span>' +
          '</div>';
        tier2Grid.appendChild(row);
      }

      function activate(isUserClick) {
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

        // On mobile / small screens, smoothly scroll to detail panel clearing the floating navbar
        if (isUserClick && window.innerWidth <= 1024) {
          var detailPanel = stage.querySelector('.demaze-ind-detail');
          if (detailPanel) {
            var rect = detailPanel.getBoundingClientRect();
            window.scrollBy({ top: rect.top - 88, behavior: 'smooth' });
          }
        }
      }

      row.addEventListener('mouseenter', function () {
        if (window.innerWidth > 1024) activate(false);
      });
      row.addEventListener('click', function () {
        activate(true);
      });
      row.addEventListener('focus', function () {
        activate(false);
      });
    });

    tier1Wrap.appendChild(tier1Grid);
    tier2Wrap.appendChild(tier2Grid);

    directory.appendChild(tier1Wrap);
    directory.appendChild(tier2Wrap);
    stage.appendChild(directory);

    // Right detail panel
    var detail = document.createElement('div');
    detail.className = 'demaze-ind-detail';
    detail.setAttribute('role', 'tabpanel');
    stage.appendChild(detail);

    wrapper.appendChild(stage);

    // Initial detail render
    renderDetail(stage, 0);

    // Keyboard navigation across all rows
    directory.addEventListener('keydown', function (e) {
      var keys = { ArrowDown: 1, ArrowRight: 1, ArrowUp: -1, ArrowLeft: -1 };
      var allRows = directory.querySelectorAll('.demaze-ind-row');
      if (keys[e.key]) {
        e.preventDefault();
        var nextIdx = (activeIndex + keys[e.key] + ALL_DOMAINS.length) % ALL_DOMAINS.length;
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

    var telemetry = document.createElement('div');
    telemetry.className = 'demaze-ind-telemetry';
    telemetry.innerHTML =
      '<div class="demaze-telemetry-box">' +
      '  <span class="demaze-telemetry-num">45+ Projects Delivered</span>' +
      '  <span class="demaze-telemetry-title">Production Deployments</span>' +
      '  <span class="demaze-telemetry-desc">Scalable AI and cloud architectures deployed across diverse client domains.</span>' +
      '</div>' +
      '<div class="demaze-telemetry-box">' +
      '  <span class="demaze-telemetry-num">$10M+ Value Generated</span>' +
      '  <span class="demaze-telemetry-title">Client Business Value</span>' +
      '  <span class="demaze-telemetry-desc">Created through custom software automation, modernized workflows, and operational efficiency.</span>' +
      '</div>' +
      '<div class="demaze-telemetry-box">' +
      '  <span class="demaze-telemetry-num">100% Code Ownership</span>' +
      '  <span class="demaze-telemetry-title">Complete IP Transfer</span>' +
      '  <span class="demaze-telemetry-desc">Direct technical collaboration with full code ownership, complete documentation, and zero vendor lock-in.</span>' +
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
