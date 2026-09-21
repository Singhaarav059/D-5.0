/**
 * Post-hydration content override for the Technology Stack / Trust section
 * only (MOVIQ's "Badge" section: a heading + a logo ticker).
 * Matched 1:1 with /services marquee.
 */
(function () {
  var content = window.DEMAZE_CONTENT && window.DEMAZE_CONTENT.technologyStack;
  if (!content || !window.DemazeOverride) return;

  function getSection() {
    return document.querySelector('section[data-framer-name="Badge"]');
  }

  function isHydrated(section) {
    var h3 = section.querySelector('h3');
    return !!(h3 && h3.textContent.trim().length > 0);
  }

  function applyOverride(section) {
    if (!document.getElementById('demaze-techstack-style')) {
      var tStyle = document.createElement('style');
      tStyle.id = 'demaze-techstack-style';
      tStyle.textContent =
        'section[data-framer-name="Badge"]{' +
        '  border-radius:28px 28px 0 0!important;background:#ffffff!important;position:relative!important;z-index:2!important;' +
        '  margin-top:-28px!important;padding:36px 0 18px!important;height:auto!important;min-height:auto!important;box-shadow:0 -10px 40px rgba(0,0,0,0.03)!important;' +
        '}' +
        'section[data-framer-name="Badge"] [data-framer-name="Container"],' +
        'section[data-framer-name="Badge"] [data-framer-name="Trusted by description"]{' +
        '  height:auto!important;min-height:auto!important;padding:0!important;margin:0 auto!important;' +
        '}' +
        'section[data-framer-name="Badge"] h3{' +
        '  font-size:clamp(24px, 2.8vw, 32px)!important;font-weight:700!important;color:#0B0E17!important;letter-spacing:-0.02em!important;' +
        '  text-align:center!important;margin:0 auto 20px!important;' +
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

    var h3 = section.querySelector('h3');
    if (h3) h3.textContent = content.heading;

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
      section.appendChild(marquee);
    }
  }

  function verifyStuck(section) {
    var h3 = section.querySelector('h3');
    var headingOk = !!(h3 && h3.textContent.trim() === content.heading);
    var marquee = section.querySelector('.demaze-subpage-marquee');
    var chips = marquee ? marquee.querySelectorAll('.marquee-brand-chip') : [];
    return headingOk && chips.length >= 16;
  }

  window.DemazeOverride.run({
    getRoot: getSection,
    isHydrated: isHydrated,
    apply: applyOverride,
    verify: verifyStuck,
  });
})();
