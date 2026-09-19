/**
 * Post-hydration content override for the Technology Stack / Trust section
 * only (MOVIQ's "Badge" section: a heading + a logo ticker).
 * See demaze-override-core.js for why this waits/mutates/rechecks the way it does.
 */
(function () {
  var content = window.DEMAZE_CONTENT && window.DEMAZE_CONTENT.technologyStack;
  if (!content || !window.DemazeOverride) return;

  function getSection() {
    return document.querySelector('section[data-framer-name="Badge"]');
  }

  function isHydrated(section) {
    var h3 = section.querySelector('h3');
    var firstImg = section.querySelector('li.ticker-item img');
    return !!(h3 && h3.textContent.trim().length > 0 && firstImg && firstImg.getAttribute('src'));
  }

  function applyOverride(section) {
    if (!document.getElementById('demaze-techstack-style')) {
      var tStyle = document.createElement('style');
      tStyle.id = 'demaze-techstack-style';
      tStyle.textContent =
        'section[data-framer-name="Badge"]{border-radius:32px 32px 0 0!important;background:#ffffff!important;position:relative!important;z-index:2!important;margin-top:-32px!important;padding:48px 0!important;}' +
        'section[data-framer-name="Badge"] h3{' +
        'font-size:19px!important;font-weight:500!important;color:#6B7080!important;letter-spacing:-0.01em!important;text-align:center!important;margin:0 0 28px!important;}' +
        'section[data-framer-name="Badge"] [data-framer-name="Logo Ticker"],' +
        'section[data-framer-name="Badge"] .framer-ticker,' +
        'section[data-framer-name="Badge"] [class*="ticker"]{' +
        'mask-image:linear-gradient(90deg,transparent,#000 12%,#000 88%,transparent)!important;' +
        '-webkit-mask-image:linear-gradient(90deg,transparent,#000 12%,#000 88%,transparent)!important;}' +
        'section[data-framer-name="Badge"] li.ticker-item{' +
        'display:inline-flex!important;flex-direction:row!important;align-items:center!important;gap:10px!important;margin:0 32px!important;cursor:default;}' +
        'section[data-framer-name="Badge"] li.ticker-item img{' +
        'height:28px!important;max-height:28px!important;width:auto!important;object-fit:contain!important;' +
        'filter:grayscale(100%)!important;opacity:0.6!important;transition:filter 0.25s ease, opacity 0.25s ease, transform 0.25s ease!important;}' +
        'section[data-framer-name="Badge"] li.ticker-item:hover img{' +
        'filter:grayscale(0%)!important;opacity:1!important;transform:scale(1.08)!important;}' +
        'section[data-framer-name="Badge"] .demaze-tech-label{' +
        'font-size:15px!important;font-weight:500!important;color:#3F4454!important;white-space:nowrap!important;margin:0!important;transition:color 0.25s ease!important;}' +
        'section[data-framer-name="Badge"] li.ticker-item:hover .demaze-tech-label{' +
        'color:#0B0E17!important;}' +
        'section[data-framer-name="Badge"] [data-framer-name="Logo Ticker"]:hover,' +
        'section[data-framer-name="Badge"] .framer-ticker:hover,' +
        'section[data-framer-name="Badge"] ul:hover{' +
        'animation-play-state:paused!important;}';
      document.head.appendChild(tStyle);
    }

    // Heading. MOVIQ splits it into two differently-colored text runs; Demaze's
    // real heading ("Tools & Technologies") has no such split, so this
    // collapses it to one plain text node in the heading's own color.
    var h3 = section.querySelector('h3');
    if (h3) h3.textContent = content.heading;

    // Logo ticker: each <li> renders two responsive-variant duplicates of the
    // same logo image. Map ticker position -> content item (cycling if the
    // ticker has more slots than items), updating every image in the <li>.
    var items = content.items;
    var tickerItems = section.querySelectorAll('li.ticker-item');
    tickerItems.forEach(function (li, i) {
      var item = items[i % items.length];
      li.querySelectorAll('img').forEach(function (img) {
        img.setAttribute('src', item.icon);
        img.setAttribute('srcset', '');
        img.setAttribute('alt', item.name + ' logo');
        img.style.objectFit = 'contain';
        img.style.maxHeight = '28px';
        img.style.height = '28px';
        img.style.width = 'auto';
      });

      // MOVIQ's ticker only shows bare logos with no name. Demaze's own
      // "Tools & Technologies" panel pairs each icon with its name, so add
      // one label per slot on the shared baseline.
      var label = li.querySelector('.demaze-tech-label');
      if (!label) {
        label = document.createElement('span');
        label.className = 'demaze-tech-label';
        li.appendChild(label);
      }
      label.textContent = item.name;
    });
  }

  function verifyStuck(section) {
    var h3 = section.querySelector('h3');
    var headingOk = !!(h3 && h3.textContent.trim() === content.heading);
    var firstImg = section.querySelector('li.ticker-item img');
    var logosOk = !!(firstImg && firstImg.getAttribute('src') === content.items[0].icon);
    var firstLabel = section.querySelector('li.ticker-item .demaze-tech-label');
    var labelsOk = !!(firstLabel && firstLabel.textContent.trim() === content.items[0].name);
    return headingOk && logosOk && labelsOk;
  }

  window.DemazeOverride.run({
    getRoot: getSection,
    isHydrated: isHydrated,
    apply: applyOverride,
    verify: verifyStuck,
  });
})();
