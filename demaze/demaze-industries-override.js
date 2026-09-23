/**
 * Industries (MOVIQ's second "Tools" section).
 * Six domains backed by documented Demaze projects, plus seven broader domains.
 * Disclosure pattern: each domain is a button (aria-expanded) controlling one
 * detail panel. Desktop shows the panel in the right column; below 960px the
 * panel moves directly under the selected domain.
 */
(function () {
  if (!window.DemazeOverride) return;

  var PRIMARY = [
    {
      name: 'Automotive & Mobility',
      tagline: 'Dealership & workshop operations',
      desc: 'Software for automotive dealership networks: used-vehicle appraisal, multi-bank EMI financing calculations, and connected workshop scheduling.',
      proof: { title: 'AI-based software for luxury car dealers', summary: 'Built for one of India\'s largest luxury automotive dealership groups, covering appraisal algorithms, multi-bank EMI calculations, and refurbishment tracking.' },
      caps: ['Automated vehicle valuation', 'Multi-bank EMI engine', 'Dealership operations', 'Workshop bay scheduling', 'Refurbishment tracking']
    },
    {
      name: 'Legal Tech & Compliance',
      tagline: 'Investigative case management',
      desc: 'Secure web platforms for investigators and professional practices, with encrypted evidence storage, case workflows, and report generation.',
      proof: { title: 'Investigative case management software', summary: 'A web-based workspace for private investigators with encrypted evidence indexing, automated case workflows, and subscription billing.' },
      caps: ['AI-assisted evidence tools', 'Encrypted document vaults', 'Automated case workflows', 'Subscription billing', 'Audit logging']
    },
    {
      name: 'Intelligent E-Commerce',
      tagline: 'Marketplaces & unified commerce',
      desc: 'Commerce platforms combining multi-vendor marketplaces, live video selling, and AI-driven recommendations.',
      proof: { title: 'AI-powered luxury eCommerce platform', summary: 'A luxury retail platform with virtual try-on, a custom drag-and-drop CMS, and multi-channel inventory automation.' },
      caps: ['Multi-vendor marketplaces', 'AI personalization & try-on', 'Auction engines', 'Drag-and-drop CMS', 'Multi-currency checkout']
    },
    {
      name: 'Logistics & Fleet Automation',
      tagline: 'On-demand dispatch & tracking',
      desc: 'Dispatch engines, route optimization, live courier tracking, and multi-store fulfillment for delivery operations.',
      proof: { title: 'On-demand grocery delivery app', summary: 'Customer ordering, in-store shopper batching, and courier dispatch with live GPS tracking in one system.' },
      caps: ['Courier dispatch', 'Live GPS tracking', 'Route optimization', 'Multi-store batching', 'Fulfillment inventory sync']
    },
    {
      name: 'Financial AI & Banking',
      tagline: 'Lending analysis & payment rails',
      desc: 'Financial statement parsing, automated CMA report generation for corporate loan sanctioning, and cross-border payment rails.',
      proof: { title: 'Global payment transfer platform', summary: 'A cross-border remittance platform with real-time FX rate feeds, automated AML/KYC screening, and multi-tier bank settlement.' },
      caps: ['Financial statement parsing', 'CMA report generation', 'Cross-border payments', 'KYC/AML screening', 'Balance sheet stress testing']
    },
    {
      name: 'Generative AI & Media',
      tagline: 'Script-to-visual storyboarding',
      desc: 'Generative tools for directors and studios that turn scripts into storyboard frames with consistent characters and framing controls.',
      proof: { title: 'Storyboard creation for films with AI', summary: 'Visualize scene beats, keep character appearance consistent across frames, and export director presentation packages.' },
      caps: ['Script-to-image generation', 'Character consistency', 'Cinematic framing tools', 'Presentation packages', 'Prompt-to-scene sequencing']
    }
  ];

  var SECONDARY = [
    { name: 'Healthcare & Wellbeing', desc: 'Wellness platforms, coaching and counseling portals, and senior engagement communities.', proof: { title: 'Sukoon senior support platform', summary: 'Counseling booking, caregiver portals, and social meetups for seniors.' }, caps: ['Senior care engagement', 'Coaching & counseling portals', 'Caregiver dashboards', 'Community tools'] },
    { name: 'Education & EdTech', desc: 'Learning platforms with video lessons, assessments, and certification.', proof: { title: 'LMS platform', summary: 'An academy platform with automated grading, progress analytics, and course management.' }, caps: ['Learning management', 'Video course delivery', 'Automated grading', 'Certification'] },
    { name: 'HR Tech & Talent', desc: 'Recruitment software that matches candidates to requisitions and automates interview scheduling.', proof: { title: 'Recruitment platform', summary: 'Candidate matching with semantic resume parsing and automated interview scheduling.' }, caps: ['Resume parsing', 'Candidate matching', 'Interview scheduling', 'Hiring analytics'] },
    { name: 'Enterprise SaaS & Workflows', desc: 'Operational workspaces unifying task pipelines, geofenced attendance, and role-based document access.', proof: { title: 'Task, staff & document management platform', summary: 'Multi-tenant software with permission-tiered documents and geofenced attendance.' }, caps: ['Multi-tenant SaaS', 'Kanban task pipelines', 'Geofenced attendance', 'Role-based permissions'] },
    { name: 'B2B Commerce & Procurement', desc: 'Procurement platforms for bulk corporate orders and multi-company billing.', proof: { title: 'B2B corporate gifting marketplace', summary: 'A portal for corporate gifting orders and procurement workflows.' }, caps: ['Bulk order management', 'Corporate accounts', 'Procurement workflows', 'Multi-company invoicing'] },
    { name: 'Food & Delivery Operations', desc: 'Ordering apps, in-store picking workflows, and courier dispatch integration.', proof: { title: 'Grocery delivery app', summary: 'Multi-store catalogs, mobile ordering, and courier pickup kept in sync.' }, caps: ['Mobile ordering', 'Catalog sync', 'Shopper picking', 'Courier dispatch'] },
    { name: 'Retail Storefronts & POS', desc: 'Point-of-sale integrations, omnichannel catalogs, loyalty programs, and checkout flows.', proof: null, caps: ['Omnichannel POS sync', 'Inventory reconciliation', 'Loyalty programs', 'Checkout optimization'] }
  ];

  var ALL = PRIMARY.concat(SECONDARY);
  var BLOCK = 'dz-ind';

  function ensureStyle() {
    if (document.getElementById('demaze-industries-style')) return;
    var s = document.createElement('style');
    s.id = 'demaze-industries-style';
    s.textContent = [
      'section.framer-1p5myw3,section[data-framer-name="Tools"]:has([data-framer-name="Tab"]){display:block!important;height:auto!important;min-height:0!important;padding:var(--dz-section-y) 0!important;margin:0!important;background:var(--dz-paper)!important;overflow:visible!important;}',
      'section.framer-1p5myw3 > :not(.dz-ind),section[data-framer-name="Tools"]:has([data-framer-name="Tab"]) > :not(.dz-ind){display:none!important;}',
      '.dz-ind-head{margin-bottom:var(--dz-head-gap);}',
      '.dz-ind-body{display:grid;grid-template-columns:minmax(0,5fr) minmax(0,7fr);gap:clamp(40px,6vw,96px);align-items:start;}',
      '.dz-ind-label{display:block;margin:0 0 10px;font:500 12px/1.2 var(--dz-font-mono);letter-spacing:.04em;text-transform:uppercase;color:var(--dz-ink-3);}',
      '.dz-ind-list{margin:0 0 40px;padding:0;list-style:none;border-top:1px solid var(--dz-line);}',
      '.dz-ind-list li{border-bottom:1px solid var(--dz-line);}',
      '.dz-ind-btn{all:unset;box-sizing:border-box;width:100%;display:grid;grid-template-columns:1fr auto;align-items:center;gap:16px;padding:16px 4px;cursor:pointer;min-height:48px;transition:color var(--dz-fast) ease;}',
      '.dz-ind-btn:focus-visible{outline:2px solid var(--dz-accent);outline-offset:2px;border-radius:6px;}',
      '.dz-ind-name{display:block;font:500 17px/1.3 var(--dz-font-text);color:var(--dz-ink-2);}',
      '.dz-ind-tag{display:block;margin-top:2px;font:400 14px/1.4 var(--dz-font-text);color:var(--dz-ink-3);}',
      '.dz-ind-btn::after{content:"";width:8px;height:8px;border-right:1.5px solid currentColor;border-top:1.5px solid currentColor;transform:rotate(45deg);color:var(--dz-line);transition:color var(--dz-fast) ease,transform var(--dz-base) var(--dz-ease-out);}',
      '.dz-ind-btn[aria-expanded="true"] .dz-ind-name{color:var(--dz-ink);font-weight:600;}',
      '.dz-ind-btn[aria-expanded="true"]::after{color:var(--dz-accent);}',
      '@media (hover:hover) and (pointer:fine){.dz-ind-btn:hover .dz-ind-name{color:var(--dz-ink);}.dz-ind-btn:hover::after{color:var(--dz-ink-3);}}',
      '.dz-ind-list--compact .dz-ind-btn{padding:12px 4px;}',
      '.dz-ind-list--compact .dz-ind-name{font-size:15px;}',
      '.dz-ind-panel{position:sticky;top:120px;padding:40px;border-radius:var(--dz-radius-lg);background:var(--dz-paper-2);}',
      '.dz-ind-panel h3{margin:0 0 12px;font:600 clamp(24px,2.2vw,30px)/1.15 var(--dz-font-display);letter-spacing:-0.01em;color:var(--dz-ink);}',
      '.dz-ind-panel > p{margin:0 0 32px;font:400 16px/1.6 var(--dz-font-text);color:var(--dz-ink-2);max-width:56ch;}',
      '.dz-ind-proof{padding:24px 0;border-top:1px solid var(--dz-line);border-bottom:1px solid var(--dz-line);margin-bottom:28px;}',
      '.dz-ind-proof strong{display:block;margin:0 0 6px;font:600 16px/1.35 var(--dz-font-text);color:var(--dz-ink);}',
      '.dz-ind-proof p{margin:0;font:400 15px/1.6 var(--dz-font-text);color:var(--dz-ink-2);}',
      '.dz-ind-caps{margin:0 0 32px;padding:0;list-style:none;display:grid;grid-template-columns:1fr 1fr;gap:10px 24px;}',
      '.dz-ind-caps li{position:relative;padding-left:16px;font:400 14px/1.45 var(--dz-font-text);color:var(--dz-ink-3);}',
      '.dz-ind-caps li::before{content:"";position:absolute;left:0;top:.62em;width:6px;height:1px;background:var(--dz-ink-3);}',
      '.dz-ind-panel.is-swapping > *{animation:dzIndIn 240ms var(--dz-ease-out);}',
      '@keyframes dzIndIn{from{opacity:0;transform:translateY(4px);}}',
      '@media (prefers-reduced-motion: reduce){.dz-ind-panel.is-swapping > *{animation:none;}}',
      '@media (max-width: 960px){',
      '  .dz-ind-body{grid-template-columns:1fr;}',
      '  .dz-ind-panel{position:static;padding:24px 20px;margin:0 0 16px;border-radius:var(--dz-radius);}',
      '  .dz-ind-list li .dz-ind-panel{margin-top:4px;}',
      '  .dz-ind-list .dz-ind-panel h3{display:none;}',
      '  .dz-ind-btn[aria-expanded="true"]::after{transform:rotate(135deg);}',
      '}',
      '@media (max-width: 540px){.dz-ind-caps{grid-template-columns:1fr;}}'
    ].join('');
    document.head.appendChild(s);
  }

  function item(d, i) {
    return '<li><button type="button" class="dz-ind-btn" id="dz-ind-' + i + '" aria-expanded="' + (i === 0) + '" aria-controls="dz-ind-panel" data-i="' + i + '">' +
      '<span><span class="dz-ind-name">' + d.name + '</span>' + (d.tagline ? '<span class="dz-ind-tag">' + d.tagline + '</span>' : '') + '</span>' +
      '</button></li>';
  }

  function panelHTML(d) {
    return '<h3>' + d.name + '</h3><p>' + d.desc + '</p>' +
      (d.proof ? '<div class="dz-ind-proof"><div class="dz-ind-label">Project</div><strong>' + d.proof.title + '</strong><p>' + d.proof.summary + '</p></div>' : '') +
      '<div class="dz-ind-label">What we build</div>' +
      '<ul class="dz-ind-caps">' + d.caps.map(function (c) { return '<li>' + c + '</li>'; }).join('') + '</ul>' +
      '<a class="dz-link" href="./contact">Discuss your project</a>';
  }

  function build() {
    var C = (window.DEMAZE_CONTENT && window.DEMAZE_CONTENT.industries) || {};
    var el = document.createElement('div');
    el.className = BLOCK + ' dz-container';
    el.innerHTML =
      '<div class="dz-ind-head"><span class="dz-eyebrow">' + (C.eyebrow || 'Industries') + '</span>' +
      '<h2 class="dz-h2">' + (C.heading || 'Industries we know through the work') + '</h2>' +
      '<p class="dz-lead">' + (C.subtitle || '') + '</p></div>' +
      '<div class="dz-ind-body"><div>' +
      '<div class="dz-ind-label">Proven through delivered projects</div>' +
      '<ul class="dz-ind-list">' + PRIMARY.map(item).join('') + '</ul>' +
      '<div class="dz-ind-label">Also supported</div>' +
      '<ul class="dz-ind-list dz-ind-list--compact">' + SECONDARY.map(function (d, i) { return item(d, i + PRIMARY.length); }).join('') + '</ul>' +
      '</div><div class="dz-ind-slot"><div class="dz-ind-panel" id="dz-ind-panel" role="region" aria-labelledby="dz-ind-0">' + panelHTML(ALL[0]) + '</div></div></div>';
    return el;
  }

  function wire(el) {
    var panel = el.querySelector('.dz-ind-panel');
    var slot = el.querySelector('.dz-ind-slot');
    var btns = el.querySelectorAll('.dz-ind-btn');
    var mq = window.matchMedia('(max-width: 960px)');
    var current = 0;

    function place() {
      if (mq.matches) btns[current].parentElement.appendChild(panel);
      else slot.appendChild(panel);
    }

    function select(i) {
      if (i === current) return;
      current = i;
      btns.forEach(function (b, j) { b.setAttribute('aria-expanded', String(j === i)); });
      panel.setAttribute('aria-labelledby', 'dz-ind-' + i);
      panel.innerHTML = panelHTML(ALL[i]);
      panel.classList.remove('is-swapping');
      void panel.offsetWidth;
      panel.classList.add('is-swapping');
      place();
    }

    btns.forEach(function (b) {
      b.addEventListener('click', function () { select(+b.getAttribute('data-i')); });
    });
    (mq.addEventListener ? mq.addEventListener('change', place) : mq.addListener(place));
    place();
  }

  function getSection() {
    return document.querySelector('section.framer-1p5myw3, section[data-framer-name="Tools"]:has([data-framer-name="Tab"])');
  }

  function apply(section) {
    ensureStyle();
    if (section.querySelector('.' + BLOCK)) return;
    var el = build();
    section.appendChild(el);
    wire(el);
  }

  window.DemazeOverride.run({
    getRoot: getSection,
    isHydrated: function (s) { return !!(s && s.querySelector('[data-framer-name="Container"]')); },
    apply: apply,
    verify: function (s) { return !!(s && s.querySelectorAll('.dz-ind-btn').length === ALL.length); }
  });
})();
