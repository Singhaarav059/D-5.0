/**
 * Post-hydration content override for the Technology Stack / Trust section
 * (MOVIQ's "Badge" section: Platforms & Partners / Tools & Technologies + marquee).
 * Matched 1:1 with /services marquee and design system.
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
        '  margin-top:-28px!important;padding:48px 0 24px!important;height:auto!important;min-height:auto!important;box-shadow:0 -10px 40px rgba(2,132,199,0.04)!important;' +
        '}' +
        'section[data-framer-name="Badge"] [data-framer-name="Container"]{' +
        '  height:auto!important;min-height:auto!important;padding:0!important;margin:0 auto!important;' +
        '  display:flex!important;flex-direction:column!important;align-items:center!important;' +
        '}' +
        'section[data-framer-name="Badge"] [data-framer-name="Trusted by description"]{' +
        '  display:none!important;' +
        '}' +
        '.demaze-techstack-header{' +
        '  display:flex!important;flex-direction:column!important;align-items:center!important;' +
        '  text-align:center!important;margin:0 auto 28px!important;position:relative!important;z-index:5!important;' +
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
        '  letter-spacing:-0.025em!important;margin:0 auto 8px!important;line-height:1.2!important;' +
        '  font-family:"Inter", -apple-system, sans-serif!important;' +
        '}' +
        '.demaze-techstack-sub{' +
        '  font-size:15px!important;color:#64748B!important;margin:0 auto!important;' +
        '  max-width:560px!important;line-height:1.5!important;' +
        '}' +
        'section[data-framer-name="Badge"] [data-framer-name="Logo Ticker"],' +
        'section[data-framer-name="Badge"] .framer-ticker,' +
        'section[data-framer-name="Badge"] [class*="ticker"]{' +
        '  display:none!important;' +
        '}' +
        'section[data-framer-name="Badge"] .demaze-subpage-marquee{' +
        '  display:flex!important;overflow:hidden!important;' +
        '  mask-image:linear-gradient(90deg,transparent,#000 8%,#000 92%,transparent)!important;' +
        '  -webkit-mask-image:linear-gradient(90deg,transparent,#000 8%,#000 92%,transparent)!important;' +
        '  width:100%!important;padding:4px 0 6px!important;margin:0!important;' +
        '}' +
        'section[data-framer-name="Badge"] .marquee-brand-chip{' +
        '  padding:8px 16px!important;border-radius:12px!important;background:#F8FAFC!important;border:1px solid #E2E8F0!important;' +
        '  transition:all 0.25s ease!important;' +
        '}' +
        'section[data-framer-name="Badge"] .marquee-brand-chip:hover{' +
        '  border-color:rgba(124, 58, 237, 0.4)!important;background:#ffffff!important;transform:translateY(-2px)!important;' +
        '  box-shadow:0 6px 16px rgba(124, 58, 237, 0.08)!important;' +
        '}';
      document.head.appendChild(tStyle);
    }

    // Build or update the dedicated Tech Stack Header (Eyebrow + Title + Subtitle)
    var container = section.querySelector('[data-framer-name="Container"]') || section;
    var existingHdr = section.querySelector('.demaze-techstack-header');
    if (!existingHdr) {
      var hdr = document.createElement('div');
      hdr.className = 'demaze-techstack-header';
      hdr.innerHTML =
        '<div class="demaze-techstack-eyebrow">' + (content.eyebrow || 'Platforms & Partners') + '</div>' +
        '<h2 class="demaze-techstack-title">' + (content.heading || 'Tools & Technologies') + '</h2>' +
        '<p class="demaze-techstack-sub">Powering high-scale enterprise intelligence and resilient automation</p>';
      container.insertBefore(hdr, container.firstChild);
    }

    // Build or update the /services matching marquee
    var marquee = section.querySelector('.demaze-subpage-marquee');
    if (!marquee) {
      marquee = document.createElement('div');
      marquee.className = 'demaze-subpage-marquee';

      var items = content.items;
      // 2 sets for seamless loop
      var setsHTML = [items, items].map(function (set) {
        return set.map(function (item) {
          return (
            '<div class="marquee-brand-chip">' +
            '<img src="' + item.icon + '" alt="' + item.name + '">' +
            '<span>' + item.name + '</span>' +
            '</div>'
          );
        }).join('');
      }).join('');

      marquee.innerHTML = '<div class="demaze-subpage-marquee-track">' + setsHTML + '</div>';
      container.appendChild(marquee);
    }
  }

  function verifyStuck(section) {
    var hdr = section && section.querySelector('.demaze-techstack-header');
    var marquee = section && section.querySelector('.demaze-subpage-marquee');
    var chips = marquee ? marquee.querySelectorAll('.marquee-brand-chip') : [];
    return !!(hdr && chips.length >= 16);
  }

  window.DemazeOverride.run({
    getRoot: getSection,
    isHydrated: isHydrated,
    apply: applyOverride,
    verify: verifyStuck,
  });
})();
