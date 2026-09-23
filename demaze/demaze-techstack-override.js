/**
 * Post-hydration content override for the Technology Stack / Engineering Proof section
 * (MOVIQ's "Badge" section: Engineering Stack / Tools & Technologies + Architectural Proof Marquee).
 * Matched 1:1 with Demaze design system and ground-truth capabilities.
 */
(function () {
  var content = window.DEMAZE_CONTENT && window.DEMAZE_CONTENT.technologyStack;
  if (!content || !window.DemazeOverride) return;

  function getSection() {
    return document.querySelector('section[data-framer-name="Badge"]');
  }

  function isHydrated(section) {
    return !!(section && (section.querySelector('[data-framer-name="Container"]') || section.children.length > 0));
  }

  function applyOverride(section) {
    if (!document.getElementById('demaze-techstack-style')) {
      var tStyle = document.createElement('style');
      tStyle.id = 'demaze-techstack-style';
      tStyle.textContent =
        'section[data-framer-name="Badge"]{' +
        '  border-radius:28px 28px 0 0!important;background:linear-gradient(180deg, #f0f9ff 0%, #ffffff 54px, #ffffff 100%)!important;position:relative!important;z-index:2!important;' +
        '  margin-top:-28px!important;padding:46px 0 26px!important;height:auto!important;min-height:auto!important;box-shadow:0 -10px 40px rgba(2,132,199,0.04)!important;' +
        '}' +
        'section[data-framer-name="Badge"] [data-framer-name="Container"]{' +
        '  height:auto!important;min-height:auto!important;padding:0!important;margin:0 auto!important;' +
        '  display:flex!important;flex-direction:column!important;align-items:center!important;width:100%!important;max-width:100%!important;' +
        '}' +
        'section[data-framer-name="Badge"] [data-framer-name="Trusted by description"]{' +
        '  display:none!important;' +
        '}' +
        '.demaze-techstack-header{' +
        '  display:flex!important;flex-direction:column!important;align-items:center!important;' +
        '  text-align:center!important;margin:0 auto 28px!important;padding:0 20px!important;position:relative!important;z-index:5!important;' +
        '}' +
        '.demaze-techstack-eyebrow{' +
        '  display:inline-flex!important;align-items:center!important;padding:4px 14px!important;' +
        '  border-radius:999px!important;background:rgba(124, 58, 237, 0.08)!important;' +
        '  border:1px solid rgba(124, 58, 237, 0.20)!important;color:#7C3AED!important;' +
        '  font-size:11.5px!important;font-weight:700!important;letter-spacing:0.08em!important;' +
        '  text-transform:uppercase!important;margin-bottom:12px!important;' +
        '}' +
        '.demaze-techstack-title{' +
        '  font-size:clamp(26px, 3vw, 36px)!important;font-weight:700!important;color:#0F172A!important;' +
        '  letter-spacing:-0.025em!important;margin:0 auto 10px!important;line-height:1.2!important;' +
        '  font-family:"Inter", -apple-system, sans-serif!important;' +
        '}' +
        '.demaze-techstack-sub{' +
        '  font-size:15px!important;color:#64748B!important;margin:0 auto!important;' +
        '  max-width:620px!important;line-height:1.55!important;text-align:center!important;' +
        '}' +
        'section[data-framer-name="Badge"] [data-framer-name="Logo Ticker"],' +
        'section[data-framer-name="Badge"] .framer-ticker,' +
        'section[data-framer-name="Badge"] [class*="ticker"]{' +
        '  display:none!important;' +
        '}' +
        'section[data-framer-name="Badge"] .demaze-subpage-marquee{' +
        '  display:flex!important;overflow:hidden!important;width:100%!important;' +
        '  mask-image:linear-gradient(90deg,transparent,#000 6%,#000 94%,transparent)!important;' +
        '  -webkit-mask-image:linear-gradient(90deg,transparent,#000 6%,#000 94%,transparent)!important;' +
        '  padding:6px 0 8px!important;margin:0!important;' +
        '}' +
        'section[data-framer-name="Badge"] .demaze-subpage-marquee-track{' +
        '  display:flex!important;align-items:center!important;gap:14px!important;' +
        '  width:max-content!important;flex-shrink:0!important;' +
        '  animation:demazeMarquee 38s linear infinite!important;' +
        '}' +
        'section[data-framer-name="Badge"] .demaze-subpage-marquee:hover .demaze-subpage-marquee-track{' +
        '  animation-play-state:paused!important;' +
        '}' +
        'section[data-framer-name="Badge"] .marquee-brand-chip.demaze-proof-chip{' +
        '  display:inline-flex!important;align-items:center!important;gap:10px!important;' +
        '  padding:8px 16px!important;border-radius:12px!important;' +
        '  background:#ffffff!important;border:1px solid #E2E8F0!important;' +
        '  box-shadow:0 2px 6px rgba(15,23,42,0.03)!important;' +
        '  transition:all 0.25s ease!important;flex-shrink:0!important;cursor:default!important;' +
        '}' +
        'section[data-framer-name="Badge"] .marquee-brand-chip.demaze-proof-chip:hover{' +
        '  border-color:rgba(124, 58, 237, 0.4)!important;background:#ffffff!important;' +
        '  transform:translateY(-2px)!important;box-shadow:0 8px 20px rgba(124, 58, 237, 0.10)!important;' +
        '}' +
        'section[data-framer-name="Badge"] .marquee-brand-chip img{' +
        '  width:22px!important;height:22px!important;object-fit:contain!important;flex-shrink:0!important;' +
        '}' +
        'section[data-framer-name="Badge"] .demaze-chip-title{' +
        '  font-size:13.5px!important;font-weight:600!important;color:#0F172A!important;white-space:nowrap!important;' +
        '}' +
        'section[data-framer-name="Badge"] .demaze-chip-role{' +
        '  font-size:11px!important;font-weight:500!important;color:#6366F1!important;' +
        '  background:rgba(99,102,241,0.08)!important;border:1px solid rgba(99,102,241,0.18)!important;' +
        '  padding:2px 7px!important;border-radius:6px!important;white-space:nowrap!important;' +
        '}' +
        '@media (max-width:768px){' +
        '  section[data-framer-name="Badge"]{padding:38px 0 20px!important;}' +
        '  .demaze-techstack-header{margin-bottom:20px!important;}' +
        '  .demaze-techstack-sub{font-size:14px!important;}' +
        '  section[data-framer-name="Badge"] .marquee-brand-chip.demaze-proof-chip{padding:7px 13px!important;gap:8px!important;}' +
        '  section[data-framer-name="Badge"] .demaze-chip-title{font-size:13px!important;}' +
        '  section[data-framer-name="Badge"] .demaze-chip-role{font-size:10.5px!important;padding:2px 6px!important;}' +
        '}';
      document.head.appendChild(tStyle);
    }

    // Build or update the dedicated Tech Stack Header (Eyebrow + Title + Subtitle)
    var container = section.querySelector('[data-framer-name="Container"]') || section;
    var existingHdr = section.querySelector('.demaze-techstack-header');
    var subtitleText = content.subtitle || 'AI frameworks, vector databases, and real-time streaming infrastructure powering our systems.';

    if (!existingHdr) {
      var hdr = document.createElement('div');
      hdr.className = 'demaze-techstack-header';
      hdr.innerHTML =
        '<div class="demaze-techstack-eyebrow">' + (content.eyebrow || 'Engineering Stack') + '</div>' +
        '<h2 class="demaze-techstack-title">' + (content.heading || 'Tools & Technologies') + '</h2>' +
        '<p class="demaze-techstack-sub">' + subtitleText + '</p>';
      container.insertBefore(hdr, container.firstChild);
    } else {
      var eyeEl = existingHdr.querySelector('.demaze-techstack-eyebrow');
      if (eyeEl) eyeEl.textContent = content.eyebrow || 'Engineering Stack';
      var titleEl = existingHdr.querySelector('.demaze-techstack-title');
      if (titleEl) titleEl.textContent = content.heading || 'Tools & Technologies';
      var subEl = existingHdr.querySelector('.demaze-techstack-sub');
      if (subEl) subEl.textContent = subtitleText;
    }

    // Build or update the architectural proof marquee
    var marquee = section.querySelector('.demaze-subpage-marquee');
    var items = content.items || [];
    var setsHTML = [items, items].map(function (set) {
      return set.map(function (item) {
        var roleBadge = item.role ? '<span class="demaze-chip-role">' + item.role + '</span>' : '';
        return (
          '<div class="marquee-brand-chip demaze-proof-chip">' +
          '<img src="' + item.icon + '" alt="' + item.name + '" loading="eager" decoding="async">' +
          '<span class="demaze-chip-title">' + item.name + '</span>' +
          roleBadge +
          '</div>'
        );
      }).join('');
    }).join('');

    if (!marquee) {
      marquee = document.createElement('div');
      marquee.className = 'demaze-subpage-marquee';
      marquee.innerHTML = '<div class="demaze-subpage-marquee-track">' + setsHTML + '</div>';
      container.appendChild(marquee);
    } else {
      var track = marquee.querySelector('.demaze-subpage-marquee-track');
      if (track && track.innerHTML !== setsHTML) {
        track.innerHTML = setsHTML;
      }
    }
  }

  function verifyStuck(section) {
    var hdr = section && section.querySelector('.demaze-techstack-header');
    var eye = hdr && hdr.querySelector('.demaze-techstack-eyebrow');
    var isEyebrowCorrect = eye && eye.textContent.trim().toUpperCase() === 'ENGINEERING STACK';
    var marquee = section && section.querySelector('.demaze-subpage-marquee');
    var roles = marquee ? marquee.querySelectorAll('.demaze-chip-role') : [];
    return !!(hdr && isEyebrowCorrect && roles.length >= 16);
  }

  window.DemazeOverride.run({
    getRoot: getSection,
    isHydrated: isHydrated,
    apply: applyOverride,
    verify: verifyStuck,
  });
})();
