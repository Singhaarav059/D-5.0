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
  if (!content || !window.DemazeOverride) return;

  var STYLE_ID = 'demaze-contact-style';
  var BLOCK_ID = 'demaze-contact-block';
  var BRAND_BLUE = '#5B5FEF';
  var MUTED = 'rgb(108, 119, 131)';

  function ensureStyle() {
    if (document.getElementById(STYLE_ID)) return;
    var style = document.createElement('style');
    style.id = STYLE_ID;
    style.textContent =
      '.demaze-contact-wrap{width:100%;max-width:1120px;margin:48px auto 0;padding:0 20px;text-align:center;position:relative;z-index:2;}' +
      '.demaze-contact-header{text-align:center;margin-bottom:32px;}' +
      '.demaze-contact-eyebrow{display:inline-block;padding:5px 14px;border-radius:100px;background:#f1f2fe;color:' + BRAND_BLUE + ';font-size:12px;font-weight:600;margin-bottom:10px;letter-spacing:0.02em;}' +
      '.demaze-contact-heading{font-size:clamp(22px,2.6vw,32px);font-weight:700;color:rgb(0,0,0);margin:0;line-height:1.2;}' +
      '.demaze-contact-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:20px;max-width:1080px;margin:0 auto;text-align:left;}' +
      '.demaze-contact-card{display:flex;flex-direction:column;gap:12px;padding:22px 20px;background:#fff;border-radius:18px;border:1px solid rgba(0,0,0,0.07);box-shadow:0 8px 24px rgba(0,0,0,0.04);text-decoration:none;transition:all 0.25s ease;position:relative;}' +
      'a.demaze-contact-card:hover{transform:translateY(-3px);box-shadow:0 14px 36px rgba(91,95,239,0.12);border-color:rgba(91,95,239,0.35);}' +
      '.demaze-contact-top{display:flex;align-items:center;justify-content:space-between;}' +
      '.demaze-contact-icon{width:40px;height:40px;border-radius:12px;background:#f1f2fe;display:flex;align-items:center;justify-content:center;flex-shrink:0;color:' + BRAND_BLUE + ';}' +
      '.demaze-contact-tag{font-size:11px;font-weight:600;text-transform:uppercase;letter-spacing:0.04em;color:' + BRAND_BLUE + ';background:rgba(91,95,239,0.08);padding:3px 8px;border-radius:6px;}' +
      '.demaze-contact-card-info h4{font-size:15.5px;font-weight:700;color:rgb(0,0,0);margin:4px 0 4px;line-height:1.3;}' +
      '.demaze-contact-card-info p{font-size:12.5px;line-height:1.45;color:' + MUTED + ';margin:0 0 12px;}' +
      '.demaze-contact-link-text{font-size:12.5px;font-weight:600;color:' + BRAND_BLUE + ';display:inline-flex;align-items:center;gap:4px;}' +
      '@media (max-width:809px){.demaze-contact-grid{grid-template-columns:1fr;gap:14px;}}';
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

    wrap.innerHTML =
      '<div class="demaze-contact-header">' +
      '<span class="demaze-contact-eyebrow">' + content.eyebrow + '</span>' +
      '<h3 class="demaze-contact-heading">' + content.heading + '</h3>' +
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

  function applyOverride(section) {
    ensureStyle();
    if (document.getElementById(BLOCK_ID)) return;
    var container = section.querySelector('[data-framer-name="Container"]') || section;
    container.appendChild(buildBlock());
  }

  function verifyStuck() {
    return !!document.getElementById(BLOCK_ID);
  }

  window.DemazeOverride.run({
    getRoot: getFinalCTASection,
    isHydrated: isHydrated,
    apply: applyOverride,
    verify: verifyStuck,
  });
})();
