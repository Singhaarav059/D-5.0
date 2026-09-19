/**
 * Post-hydration content override for the Hero section only.
 * See demaze-override-core.js for why this waits/mutates/rechecks the way it does.
 */
(function () {
  var content = window.DEMAZE_CONTENT && window.DEMAZE_CONTENT.hero;
  if (!content || !window.DemazeOverride) return;

  function getHero() {
    return document.querySelector('section[data-framer-name="Hero"]');
  }

  function isHydrated(hero) {
    var h1 = hero.querySelector('h1');
    return !!(h1 && h1.textContent.trim().length > 0);
  }

  function applyOverride(hero) {
    // Badge text. Framer mounts a different DOM shape per breakpoint (with or
    // without an .ssr-variant wrapper), so match on Tag > Badge Text > p and
    // exclude the price pill rather than relying on a fixed wrapper shape.
    var badgeParagraphs = Array.prototype.filter.call(
      hero.querySelectorAll('[data-framer-name="Tag"] [data-framer-name="Badge Text"] p'),
      function (p) {
        return !p.closest('.framer-zeccam');
      }
    );
    badgeParagraphs.forEach(function (p) {
      p.textContent = content.badge;
      // MOVIQ's stylesheet caps this text box at width:67% of the pill,
      // sized for the original (shorter) phrase. Override it inline so
      // Demaze's longer phrase isn't force-wrapped at that fixed fraction.
      var textBox = p.closest('[data-framer-name="Badge Text"]');
      if (textBox) textBox.style.width = 'auto';
    });

    // The pill itself also has an inline pixel width computed for the
    // original phrase. Clear it so the pill sizes to the new content
    // (it can still wrap naturally on narrow viewports if truly needed).
    var tagWrapper = hero.querySelector('[data-framer-name="Tag"]');
    if (tagWrapper) {
      tagWrapper.style.width = 'auto';
      tagWrapper.style.maxWidth = 'none';
    }

    // MOVIQ's second pill ("$29/Lifetime") has no Demaze equivalent — hide,
    // don't remove, so React still owns the node.
    var pricePill = hero.querySelector('.framer-zeccam[data-framer-name="tag"]');
    if (pricePill) pricePill.style.display = 'none';

    // Headline
    var h1 = hero.querySelector('h1');
    if (h1) h1.textContent = content.headline;

    // Description — MOVIQ's hero has no matching node, so insert one after
    // the headline wrapper, reusing an existing MOVIQ text style preset.
    var headlineWrapper = hero.querySelector('[data-framer-name="Headline"]');
    if (headlineWrapper && !hero.querySelector('.demaze-hero-desc')) {
      var desc = document.createElement('div');
      desc.className = 'demaze-hero-desc';
      desc.style.maxWidth = '600px';
      desc.style.margin = '24px auto 0';
      var p = document.createElement('p');
      p.className = 'framer-text framer-styles-preset-17kfgzm';
      p.setAttribute('dir', 'auto');
      // The hero sits over a busy photo background, not a plain surface, so
      // this reuses the headline's white treatment (plus a soft shadow for
      // a smaller/lighter weight) instead of MOVIQ's on-white muted gray.
      p.style.color = 'rgba(255, 255, 255, 0.92)';
      p.style.textShadow = '0 1px 6px rgba(0, 0, 0, 0.45)';
      p.textContent = content.description;
      desc.appendChild(p);
      headlineWrapper.insertAdjacentElement('afterend', desc);
    }

    // Foreground product screenshot — removed completely per user direction
    var screenshotEls = hero.querySelectorAll('[data-framer-appear-id="1ib2jhf"], .framer-1ib2jhf');
    screenshotEls.forEach(function (el) {
      var outer = el.closest('.ssr-variant') || el;
      outer.style.setProperty('display', 'none', 'important');
      el.style.setProperty('display', 'none', 'important');
    });

    // Primary CTA
    var primaryLink = hero.querySelector('a[href="./contact"]');
    if (primaryLink) {
      primaryLink.setAttribute('href', content.primaryCTA.href);
      primaryLink
        .querySelectorAll('[data-framer-name="Get In Touch"] p')
        .forEach(function (p) {
          p.textContent = content.primaryCTA.text;
        });
    }

    // Ensure style
    if (!document.getElementById('demaze-hero-style')) {
      var hStyle = document.createElement('style');
      hStyle.id = 'demaze-hero-style';
      hStyle.textContent =
        '@keyframes demazeHeroFadeUp{from{opacity:0;transform:translateY(16px);}to{opacity:1;transform:translateY(0);}}' +
        'section[data-framer-name="Hero"] [data-framer-name="Tag"]{animation:demazeHeroFadeUp 0.6s ease-out 0.1s both;}' +
        'section[data-framer-name="Hero"] h1{animation:demazeHeroFadeUp 0.6s ease-out 0.25s both;}' +
        'section[data-framer-name="Hero"] .demaze-hero-desc{animation:demazeHeroFadeUp 0.6s ease-out 0.4s both;}' +
        'section[data-framer-name="Hero"] [data-framer-name="Call to Action"]{animation:demazeHeroFadeUp 0.6s ease-out 0.55s both;}' +
        'section[data-framer-name="Hero"] a[href="./services"], section[data-framer-name="Hero"] a[href="./integration"]{' +
        'background:rgba(255,255,255,0.18)!important;border:1px solid rgba(255,255,255,0.38)!important;' +
        'backdrop-filter:blur(10px)!important;-webkit-backdrop-filter:blur(10px)!important;' +
        'box-shadow:0 4px 16px rgba(0,0,0,0.15)!important;border-radius:100px!important;transition:all 0.25s ease!important;color:#ffffff!important;text-decoration:none!important;}' +
        'section[data-framer-name="Hero"] a[href="./services"]:hover, section[data-framer-name="Hero"] a[href="./integration"]:hover{' +
        'background:rgba(255,255,255,0.28)!important;border-color:rgba(255,255,255,0.6)!important;transform:translateY(-1px)!important;}' +
        'section[data-framer-name="Hero"] a[href="./services"] *, section[data-framer-name="Hero"] a[href="./integration"] *{' +
        'color:#ffffff!important;font-weight:600!important;text-shadow:0 1px 3px rgba(0,0,0,0.4)!important;text-decoration:none!important;}';
      document.head.appendChild(hStyle);
    }

    // Secondary CTA
    var secondaryLink = hero.querySelector('a[href="./integration"], a[href="./services"]');
    if (secondaryLink) {
      secondaryLink.setAttribute('href', content.secondaryCTA.href);
      secondaryLink
        .querySelectorAll('[data-framer-name="Call to Action Text"] p')
        .forEach(function (p) {
          p.textContent = content.secondaryCTA.text;
        });
    }
  }

  function verifyStuck(hero) {
    var h1 = hero.querySelector('h1');
    var headlineOk = !!(h1 && h1.textContent.trim() === content.headline);
    var badgeOk = Array.prototype.every.call(
      hero.querySelectorAll('[data-framer-name="Tag"] [data-framer-name="Badge Text"] p'),
      function (p) {
        return p.closest('.framer-zeccam') || p.textContent.trim() === content.badge;
      }
    );
    return headlineOk && badgeOk;
  }

  window.DemazeOverride.run({
    getRoot: getHero,
    isHydrated: isHydrated,
    apply: applyOverride,
    verify: verifyStuck,
  });
})();
