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
      var textBox = p.closest('[data-framer-name="Badge Text"]');
      if (textBox) textBox.style.width = 'auto';
    });

    var tagWrapper = hero.querySelector('[data-framer-name="Tag"]');
    if (tagWrapper) {
      tagWrapper.style.width = 'auto';
      tagWrapper.style.maxWidth = 'none';
    }

    // MOVIQ's second pill ("$29/Lifetime") has no Demaze equivalent — hide
    var pricePill = hero.querySelector('.framer-zeccam[data-framer-name="tag"]');
    if (pricePill) pricePill.style.display = 'none';

    // Headline
    var h1 = hero.querySelector('h1');
    if (h1) h1.textContent = content.headline;

    // Description
    var headlineWrapper = hero.querySelector('[data-framer-name="Headline"]');
    if (headlineWrapper && !hero.querySelector('.demaze-hero-desc')) {
      var desc = document.createElement('div');
      desc.className = 'demaze-hero-desc';
      var p = document.createElement('p');
      p.className = 'framer-text framer-styles-preset-17kfgzm';
      p.setAttribute('dir', 'auto');
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

    // Background image replacement (H-5: tulip replacement)
    var bgImg = hero.querySelector('[data-framer-background-image-wrapper="true"] img');
    if (bgImg) {
      bgImg.style.setProperty('display', 'none', 'important');
    }

    // Ensure style
    if (!document.getElementById('demaze-hero-style')) {
      var hStyle = document.createElement('style');
      hStyle.id = 'demaze-hero-style';
      hStyle.textContent =
        '@keyframes demazeHeroFadeUp{from{opacity:0;transform:translateY(16px);}to{opacity:1;transform:translateY(0);}}' +
        'section[data-framer-name="Hero"], .framer-xj5vkr{' +
        '  position:relative!important;overflow:visible!important;height:auto!important;min-height:auto!important;padding:85px 0 25px!important;' +
        '}' +
        'section[data-framer-name="Hero"] [data-framer-background-image-wrapper="true"]{' +
        '  height:100%!important;min-height:500px!important;' +
        '  background:radial-gradient(circle at 50% 30%, #1e1b4b 0%, #0f172a 60%, #020617 100%)!important;' +
        '}' +
        'section[data-framer-name="Hero"] [data-framer-background-image-wrapper="true"]::after{' +
        '  content:"";position:absolute;inset:0;' +
        '  background:radial-gradient(circle at 50% 40%, rgba(91, 79, 233, 0.18) 0%, rgba(8, 14, 28, 0.4) 50%, rgba(8, 14, 28, 0.9) 100%),' +
        '              linear-gradient(180deg, rgba(8, 14, 28, 0.35) 0%, rgba(8, 14, 28, 0.75) 100%);' +
        '  pointer-events:none;border-radius:inherit;z-index:1;' +
        '}' +
        'section[data-framer-name="Hero"] [data-framer-name="Container"], .framer-384jw6{' +
        '  position:relative!important;z-index:2!important;height:auto!important;min-height:auto!important;padding:16px 30px 30px!important;' +
        '}' +
        'section[data-framer-name="Hero"] [data-framer-name="Tag"]{' +
        '  animation:demazeHeroFadeUp 0.6s ease-out 0.1s both;position:relative;z-index:2;' +
        '}' +
        'section[data-framer-name="Hero"] h1{' +
        '  animation:demazeHeroFadeUp 0.6s ease-out 0.25s both;position:relative;z-index:2;text-wrap:balance;' +
        '  font-size:clamp(34px, 4vw, 50px)!important;line-height:1.18!important;margin:12px auto 0!important;' +
        '  color:#ffffff!important;text-shadow:0 2px 14px rgba(0,0,0,0.65)!important;' +
        '}' +
        'section[data-framer-name="Hero"] .demaze-hero-desc{' +
        '  animation:demazeHeroFadeUp 0.6s ease-out 0.4s both;position:relative;z-index:2;max-width:680px!important;margin:12px auto 0!important;text-align:center!important;' +
        '}' +
        'section[data-framer-name="Hero"] .demaze-hero-desc p{' +
        '  text-align:center!important;font-size:clamp(16px,1.3vw,18.5px)!important;line-height:1.65!important;' +
        '  color:rgba(255,255,255,0.98)!important;text-shadow:0 2px 10px rgba(0,0,0,0.75)!important;' +
        '}' +
        'section[data-framer-name="Hero"] [data-framer-name="Call to Action"], section[data-framer-name="Hero"] [data-framer-name="CTA Buttons"]{' +
        '  animation:demazeHeroFadeUp 0.6s ease-out 0.55s both;position:relative;z-index:2;gap:16px!important;margin-top:18px!important;' +
        '}' +
        'section[data-framer-name="Hero"] a[href*="contact"]{' +
        '  width:auto!important;min-width:160px!important;max-width:none!important;overflow:hidden!important;' +
        '}' +
        'section[data-framer-name="Hero"] a[href*="contact"] [data-framer-name="Title"]{' +
        '  overflow:hidden!important;height:24px!important;max-height:24px!important;position:relative!important;display:block!important;' +
        '}' +
        'section[data-framer-name="Hero"] a[href*="contact"] .framer-ef3qfq{' +
        '  position:absolute!important;top:100%!important;left:0!important;opacity:0!important;visibility:hidden!important;' +
        '}' +
        'section[data-framer-name="Hero"] a[href*="contact"]:hover .framer-ef3qfq{' +
        '  opacity:1!important;visibility:visible!important;' +
        '}' +
        'section[data-framer-name="Hero"] a[href*="services"], section[data-framer-name="Hero"] a[href*="integration"]{' +
        '  background:#ffffff!important;border:1px solid #ffffff!important;' +
        '  box-shadow:0 4px 18px rgba(0,0,0,0.25)!important;border-radius:100px!important;transition:all 0.25s ease!important;' +
        '  color:#0f172a!important;text-decoration:none!important;width:auto!important;min-width:160px!important;padding:0 26px!important;height:48px!important;display:inline-flex!important;align-items:center!important;justify-content:center!important;' +
        '}' +
        'section[data-framer-name="Hero"] a[href*="services"]:hover, section[data-framer-name="Hero"] a[href*="integration"]:hover{' +
        '  background:#f8fafc!important;transform:translateY(-2px)!important;box-shadow:0 8px 24px rgba(0,0,0,0.3)!important;' +
        '}' +
        'section[data-framer-name="Hero"] a[href*="services"] *, section[data-framer-name="Hero"] a[href*="integration"] *{' +
        '  color:#0f172a!important;font-weight:600!important;text-shadow:none!important;text-decoration:none!important;white-space:nowrap!important;' +
        '}';
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
