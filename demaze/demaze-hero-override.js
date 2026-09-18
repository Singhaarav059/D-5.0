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

    // Foreground product screenshot — MOVIQ-specific, no Demaze equivalent.
    // Hidden, not removed. Match on the appear-id directly (its wrapper shape
    // varies by breakpoint the same way the badge's does).
    var screenshotEl = hero.querySelector('[data-framer-appear-id="1ib2jhf"]');
    if (screenshotEl) {
      var screenshotOuter = screenshotEl.closest('.ssr-variant') || screenshotEl;
      screenshotOuter.style.display = 'none';
    }

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

    // Secondary CTA
    var secondaryLink = hero.querySelector('a[href="./integration"]');
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
