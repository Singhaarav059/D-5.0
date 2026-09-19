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
      '.demaze-contact-wrap{width:100%;max-width:1160px;margin:80px auto 0;padding:0 24px;text-align:left;position:relative;z-index:2;}' +
      '.demaze-contact-header{text-align:center;margin-bottom:48px;}' +
      '.demaze-contact-eyebrow{display:inline-block;padding:6px 16px;border-radius:100px;background:#f1f2fe;color:' + BRAND_BLUE + ';font-size:12.5px;font-weight:600;margin-bottom:12px;letter-spacing:0.02em;}' +
      '.demaze-contact-heading{font-size:clamp(26px,3.2vw,38px);font-weight:700;color:rgb(0,0,0);margin:0;line-height:1.2;}' +
      '.demaze-contact-grid{display:flex;flex-direction:row;gap:36px;align-items:stretch;}' +
      '.demaze-contact-cards{flex:1 1 420px;display:flex;flex-direction:column;gap:18px;}' +
      '.demaze-contact-card{display:flex;align-items:flex-start;gap:18px;padding:24px;background:#fff;border-radius:20px;border:1px solid rgba(0,0,0,0.06);box-shadow:0 8px 24px rgba(0,0,0,0.04);text-decoration:none;transition:all 0.2s ease;}' +
      'a.demaze-contact-card:hover{transform:translateY(-2px);box-shadow:0 12px 32px rgba(0,0,0,0.08);border-color:rgba(91,95,239,0.3);}' +
      '.demaze-contact-icon{width:46px;height:46px;border-radius:12px;background:#f1f2fe;display:flex;align-items:center;justify-content:center;flex-shrink:0;color:' + BRAND_BLUE + ';}' +
      '.demaze-contact-card-info{flex:1;min-width:0;}' +
      '.demaze-contact-card-info h4{font-size:16px;font-weight:600;color:rgb(0,0,0);margin:0 0 6px;}' +
      '.demaze-contact-card-info p{font-size:13.5px;line-height:1.5;color:' + MUTED + ';margin:0;}' +
      '.demaze-contact-form-card{flex:1.2 1 500px;background:#fff;border-radius:24px;padding:36px;border:1px solid rgba(0,0,0,0.06);box-shadow:0 12px 36px rgba(0,0,0,0.05);}' +
      '.demaze-contact-form-card h3{font-size:20px;font-weight:600;color:rgb(0,0,0);margin:0 0 24px;}' +
      '.demaze-form-row{display:flex;gap:16px;margin-bottom:16px;}' +
      '.demaze-form-group{display:flex;flex-direction:column;gap:6px;flex:1;margin-bottom:16px;}' +
      '.demaze-form-group label{font-size:13px;font-weight:500;color:rgb(55,65,81);}' +
      '.demaze-form-group input, .demaze-form-group textarea{width:100%;padding:12px 14px;border:1px solid rgba(0,0,0,0.1);border-radius:12px;font-size:14px;color:rgb(0,0,0);background:#f9fafb;outline:none;transition:border-color 0.2s, background-color 0.2s;box-sizing:border-box;font-family:inherit;}' +
      '.demaze-form-group input:focus, .demaze-form-group textarea:focus{border-color:' + BRAND_BLUE + ';background:#fff;box-shadow:0 0 0 3px rgba(91,95,239,0.1);}' +
      '.demaze-form-submit{display:inline-flex;align-items:center;justify-content:center;width:100%;padding:14px;border-radius:100px;background:rgb(0,0,0);color:#fff;font-size:15px;font-weight:600;border:none;cursor:pointer;transition:all 0.2s ease;margin-top:8px;box-shadow:0 4px 14px rgba(0,0,0,0.12);}' +
      '.demaze-form-submit:hover{background:rgb(33,37,41);transform:translateY(-1px);box-shadow:0 6px 20px rgba(0,0,0,0.18);}' +
      '@media (max-width:809px){' +
      '.demaze-contact-grid{flex-direction:column;gap:24px;}' +
      '.demaze-form-row{flex-direction:column;gap:0;}' +
      '.demaze-contact-form-card{padding:24px;}' +
      '}';
    document.head.appendChild(style);
  }

  function getIcon(type) {
    if (type === 'email') {
      return '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline></svg>';
    }
    if (type === 'call') {
      return '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>';
    }
    return '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>';
  }

  function cardHTML(card) {
    var isLink = card.link && card.link !== '#';
    var tag = isLink ? 'a' : 'div';
    var hrefAttr = isLink ? ' href="' + card.link + '"' : '';
    return (
      '<' + tag + classAttr(isLink) + hrefAttr + '>' +
      '<div class="demaze-contact-icon">' + getIcon(card.type) + '</div>' +
      '<div class="demaze-contact-card-info">' +
      '<h4>' + card.title + '</h4>' +
      '<p>' + card.desc + '</p>' +
      '</div>' +
      '</' + tag + '>'
    );
  }

  function classAttr(isLink) {
    return ' class="demaze-contact-card"';
  }

  function buildBlock() {
    var wrap = document.createElement('div');
    wrap.id = BLOCK_ID;
    wrap.className = 'demaze-contact-wrap';

    var cardsHTML = content.cards.map(cardHTML).join('');

    var formHTML =
      '<div class="demaze-contact-form-card">' +
      '<h3>' + content.form.title + '</h3>' +
      '<form class="demaze-contact-form" onsubmit="event.preventDefault(); alert(\'Thank you for reaching out to Demaze Technologies! We will get back to you shortly.\');">' +
      '<div class="demaze-form-row">' +
      '<div class="demaze-form-group">' +
      '<label>Name</label>' +
      '<input type="text" name="name" placeholder="Your name" required>' +
      '</div>' +
      '<div class="demaze-form-group">' +
      '<label>Email</label>' +
      '<input type="email" name="email" placeholder="Your email address" required>' +
      '</div>' +
      '</div>' +
      '<div class="demaze-form-group">' +
      '<label>Subject Of Interest</label>' +
      '<input type="text" name="subject" placeholder="e.g. AI & ML, Custom SaaS, App Development">' +
      '</div>' +
      '<div class="demaze-form-group">' +
      '<label>How may we assist you?</label>' +
      '<textarea name="message" rows="4" placeholder="Tell us about your project..."></textarea>' +
      '</div>' +
      '<button type="submit" class="demaze-form-submit">' + content.form.submitText + ' &rarr;</button>' +
      '</form>' +
      '</div>';

    wrap.innerHTML =
      '<div class="demaze-contact-header">' +
      '<span class="demaze-contact-eyebrow">' + content.eyebrow + '</span>' +
      '<h2 class="demaze-contact-heading">' + content.heading + '</h2>' +
      '</div>' +
      '<div class="demaze-contact-grid">' +
      '<div class="demaze-contact-cards">' + cardsHTML + '</div>' +
      formHTML +
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
