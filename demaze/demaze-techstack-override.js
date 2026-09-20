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
        '  border-radius:32px 32px 0 0!important;background:#ffffff!important;position:relative!important;z-index:2!important;' +
        '  margin-top:-32px!important;padding:56px 0 50px!important;box-shadow:0 -10px 40px rgba(0,0,0,0.03)!important;' +
        '}' +
        'section[data-framer-name="Badge"] h3{' +
        '  font-size:clamp(28px, 3vw, 36px)!important;font-weight:700!important;color:#0B0E17!important;letter-spacing:-0.02em!important;' +
        '  text-align:center!important;margin:0 0 32px!important;' +
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
        '  width:100%!important;padding:10px 0!important;' +
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
