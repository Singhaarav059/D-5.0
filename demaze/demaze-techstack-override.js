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
        'section[data-framer-name="Badge"] li.ticker-item img{' +
        'opacity:0.75;transition:opacity 0.25s ease, transform 0.25s ease;}' +
        'section[data-framer-name="Badge"] li.ticker-item:hover img{' +
        'opacity:1;transform:scale(1.08);}' +
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
        img.style.maxHeight = '36px';
        img.style.width = 'auto';
      });

      // MOVIQ's ticker only shows bare logos with no name. Demaze's own
      // "Tools & Technologies" panel pairs each icon with its name, so add
      // one label per slot (li has no fixed height, so it grows to fit).
      var label = li.querySelector('.demaze-tech-label');
      if (!label) {
        label = document.createElement('div');
        label.className = 'demaze-tech-label framer-text framer-styles-preset-17kfgzm';
        label.style.marginTop = '8px';
        label.style.textAlign = 'center';
        label.style.color = 'rgb(108, 119, 131)';
        label.style.fontSize = '13px';
        label.style.whiteSpace = 'nowrap';
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
