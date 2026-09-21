/**
 * Post-hydration content override for the Contact Section ("Reach Us At Anytime").
 * Sits directly before the footer on the live Demaze homepage (demazetech.com).
 *
 * Appended inside the Final CTA section's container so React's top-level
 * section list is never mutated (avoiding any reconciler issues).
 *
 * See demaze-override-core.js for why this waits/mutates/rechecks the way it does.
 */
(function () {
  var content = window.DEMAZE_CONTENT && window.DEMAZE_CONTENT.contact;
  var finalCTA = window.DEMAZE_CONTENT && window.DEMAZE_CONTENT.finalCTA;
  if (!content || !window.DemazeOverride) return;

  var STYLE_ID = 'demaze-contact-style';
  var BLOCK_ID = 'demaze-contact-block';
  var BRAND_BLUE = '#5B5FEF';
  var MUTED = '#6C7783';

  function ensureStyle() {
    if (document.getElementById(STYLE_ID)) return;
    var style = document.createElement('style');
    style.id = STYLE_ID;
    style.textContent =
      'section.framer-1uf6wvw,' +
      'section[data-framer-name="CTA"]:has(#demaze-contact-block){' +
      '  height:auto!important;min-height:auto!important;padding:80px 20px!important;overflow:visible!important;' +
      '}' +
      'section.framer-1uf6wvw [data-framer-name="Container"],' +
      'section[data-framer-name="CTA"]:has(#demaze-contact-block) [data-framer-name="Container"]{' +
      '  display:flex!important;flex-direction:column!important;align-items:center!important;justify-content:center!important;' +
      '  width:100%!important;max-width:1240px!important;margin:0 auto!important;padding:60px 32px!important;border-radius:32px!important;' +
      '  box-sizing:border-box!important;min-height:auto!important;height:auto!important;position:relative!important;overflow:hidden!important;' +
      '}' +
      'section.framer-1uf6wvw [data-framer-name="Headings"],' +
      'section[data-framer-name="CTA"]:has(#demaze-contact-block) [data-framer-name="Headings"],' +
      'section.framer-1uf6wvw [data-framer-name="CTA Buttons"],' +
      'section[data-framer-name="CTA"]:has(#demaze-contact-block) [data-framer-name="CTA Buttons"]{' +
      '  display:none!important;' +
      '}' +
      '.demaze-contact-wrap{width:100%!important;max-width:1160px!important;margin:0 auto!important;padding:0!important;text-align:center!important;position:relative!important;z-index:2!important;}' +
      '.demaze-contact-header{text-align:center!important;margin-bottom:36px!important;}' +
      '.demaze-contact-eyebrow{display:inline-block!important;padding:6px 16px!important;border-radius:100px!important;background:rgba(255,255,255,0.18)!important;color:#ffffff!important;border:1px solid rgba(255,255,255,0.35)!important;backdrop-filter:blur(10px)!important;-webkit-backdrop-filter:blur(10px)!important;font-size:12px!important;font-weight:600!important;margin-bottom:14px!important;letter-spacing:0.05em!important;text-transform:uppercase!important;}' +
      '.demaze-contact-heading{font-size:clamp(28px,3.2vw,42px)!important;font-weight:700!important;color:#ffffff!important;text-shadow:0 2px 14px rgba(0,0,0,0.55)!important;margin:0 0 12px!important;line-height:1.2!important;letter-spacing:-0.02em!important;}' +
      '.demaze-contact-tagline{font-size:clamp(15px,1.4vw,18px)!important;line-height:1.55!important;color:rgba(255,255,255,0.92)!important;text-shadow:0 1px 8px rgba(0,0,0,0.45)!important;max-width:740px!important;margin:0 auto!important;white-space:normal!important;width:100%!important;}' +
      '.demaze-contact-grid{display:grid!important;grid-template-columns:repeat(3,1fr)!important;gap:24px!important;max-width:1120px!important;margin:0 auto!important;text-align:left!important;}' +
      '.demaze-contact-card{display:flex!important;flex-direction:column!important;gap:14px!important;padding:26px 24px!important;background:rgba(255,255,255,0.96)!important;backdrop-filter:blur(16px)!important;-webkit-backdrop-filter:blur(16px)!important;border-radius:20px!important;border:1px solid rgba(255,255,255,0.8)!important;box-shadow:0 12px 32px rgba(0,0,0,0.12)!important;text-decoration:none!important;transition:all 0.25s ease!important;position:relative!important;}' +
      'a.demaze-contact-card:hover{transform:translateY(-4px)!important;box-shadow:0 20px 48px rgba(0,0,0,0.2)!important;background:#ffffff!important;}' +
      '.demaze-contact-top{display:flex!important;align-items:center!important;justify-content:space-between!important;}' +
      '.demaze-contact-icon{width:44px!important;height:44px!important;border-radius:12px!important;background:#f1f2fe!important;display:flex!important;align-items:center!important;justify-content:center!important;flex-shrink:0!important;color:' + BRAND_BLUE + '!important;}' +
      '.demaze-contact-tag{font-size:11px!important;font-weight:600!important;text-transform:uppercase!important;letter-spacing:0.05em!important;color:' + BRAND_BLUE + '!important;background:rgba(91,95,239,0.1)!important;padding:4px 10px!important;border-radius:8px!important;}' +
      '.demaze-contact-card-info h4{font-size:16px!important;font-weight:700!important;color:#0B0E17!important;margin:4px 0 4px!important;line-height:1.3!important;}' +
      '.demaze-contact-card-info p{font-size:13px!important;line-height:1.5!important;color:' + MUTED + '!important;margin:0 0 12px!important;}' +
      '.demaze-contact-link-text{font-size:13px!important;font-weight:600!important;color:' + BRAND_BLUE + '!important;display:inline-flex!important;align-items:center!important;gap:4px!important;margin-top:auto!important;}' +
      'section.framer-1uf6wvw [data-framer-name="Container"] [data-framer-background-image-wrapper]::after,' +
      'section[data-framer-name="CTA"]:has(#demaze-contact-block) [data-framer-name="Container"] [data-framer-background-image-wrapper]::after{' +
      '  content:""!important;position:absolute!important;inset:0!important;' +
      '  background:radial-gradient(circle at 50% 25%, rgba(14, 116, 144, 0.40) 0%, rgba(11, 14, 23, 0.72) 75%)!important;' +
      '  pointer-events:none!important;z-index:1!important;border-radius:inherit!important;' +
      '}' +
      '@media (max-width:809px){.demaze-contact-grid{grid-template-columns:1fr!important;gap:16px!important;}}';
    document.head.appendChild(style);
  }

  function getIcon(type) {
    if (type === 'email') {
      return '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline></svg>';
    }
    if (type === 'call') {
      return '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>';
    }
    return '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>';
  }

  function getTag(type) {
    if (type === 'email') return 'EMAIL';
    if (type === 'call') return 'MEETING';
    return 'LOCATION';
  }

  function getAction(type) {
    if (type === 'email') return 'Send Email &rarr;';
    if (type === 'call') return 'Schedule Call &rarr;';
    return 'View Location &rarr;';
  }

  function cardHTML(card) {
    var isLink = card.link && card.link !== '#';
    var tag = isLink ? 'a' : 'div';
    var hrefAttr = isLink ? ' href="' + card.link + '"' + (card.link.startsWith('http') ? ' target="_blank" rel="noopener"' : '') : '';
    return (
      '<' + tag + ' class="demaze-contact-card"' + hrefAttr + '>' +
      '<div class="demaze-contact-top">' +
      '<div class="demaze-contact-icon">' + getIcon(card.type) + '</div>' +
      '<span class="demaze-contact-tag">' + getTag(card.type) + '</span>' +
      '</div>' +
      '<div class="demaze-contact-card-info">' +
      '<h4>' + card.title + '</h4>' +
      '<p>' + card.desc + '</p>' +
      '</div>' +
      '<div class="demaze-contact-link-text">' + getAction(card.type) + '</div>' +
      '</' + tag + '>'
    );
  }

  function buildBlock() {
    var wrap = document.createElement('div');
    wrap.id = BLOCK_ID;
    wrap.className = 'demaze-contact-wrap';

    var cardsHTML = content.cards.map(cardHTML).join('');
    var taglineText = (finalCTA && finalCTA.heading) ? finalCTA.heading : "Let's connect and build smarter, faster, and stronger - together.";

    wrap.innerHTML =
      '<div class="demaze-contact-header">' +
      '<span class="demaze-contact-eyebrow">' + content.eyebrow + '</span>' +
      '<h3 class="demaze-contact-heading">' + content.heading + '</h3>' +
      '<p class="demaze-contact-tagline">' + taglineText + '</p>' +
      '</div>' +
      '<div class="demaze-contact-grid">' +
      cardsHTML +
      '</div>';

    return wrap;
  }

  function getFinalCTASection() {
    var ctas = document.querySelectorAll('section[data-framer-name="CTA"]');
    for (var i = 0; i < ctas.length; i++) {
      if (ctas[i].querySelector('a[href="./contact"]')) {
        return ctas[i];
      }
    }
    return null;
  }

  function isHydrated(section) {
    return !!section.querySelector('[data-framer-name="Title"]');
  }

  var TARGET_CTA_BG = './assets/demaze/hero-alpine-bg.jpg';
  function enforceCtaBg(section) {
    if (!section) return;
    var ctaImg = section.querySelector('[data-framer-background-image-wrapper] img');
    if (ctaImg) {
      if (ctaImg.getAttribute('src') !== TARGET_CTA_BG) {
        ctaImg.setAttribute('src', TARGET_CTA_BG);
        ctaImg.src = TARGET_CTA_BG;
      }
      if (ctaImg.hasAttribute('srcset')) {
        ctaImg.removeAttribute('srcset');
      }
    }
  }

  function applyOverride(section) {
    ensureStyle();
    enforceCtaBg(section);
    if (!section.__demaze_cta_obs) {
      var obs = new MutationObserver(function() {
        enforceCtaBg(section);
      });
      obs.observe(section, { attributes: true, subtree: true, attributeFilter: ['src', 'srcset'] });
      section.__demaze_cta_obs = obs;
    }
    if (document.getElementById(BLOCK_ID)) return;
    var container = section.querySelector('[data-framer-name="Container"]') || section;
    container.appendChild(buildBlock());
  }

  function verifyStuck() {
    var blockOk = !!document.getElementById(BLOCK_ID);
    var sec = getFinalCTASection();
    var img = sec ? sec.querySelector('[data-framer-background-image-wrapper] img') : null;
    var imgOk = !img || (img.getAttribute('src') === TARGET_CTA_BG);
    return blockOk && imgOk;
  }

  window.DemazeOverride.run({
    getRoot: getFinalCTASection,
    isHydrated: isHydrated,
    apply: applyOverride,
    verify: verifyStuck,
  });
})();
