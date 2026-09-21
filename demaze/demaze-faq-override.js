/**
 * Robust Native Demaze FAQ Accordion for Homepage.
 * Replaces Framer's fragile React FAQ component with an authentic, accessible
 * Demaze Valist accordion.
 * 
 * Guarantees:
 * 1. 100% Demaze verified questions and answers.
 * 2. Physically decouples from Framer's React state so "What is Moviq?" or
 *    "Can I customize my videos?" can NEVER appear when expanding or collapsing.
 * 3. Smooth Valist-style circular + / - toggles with cubic-bezier expansion.
 */
(function () {
  var content = window.DEMAZE_CONTENT && window.DEMAZE_CONTENT.faq;
  if (!content || !window.DemazeOverride) return;

  var STYLE_ID = 'demaze-faq-native-style';

  function ensureStyle() {
    if (document.getElementById(STYLE_ID)) return;
    var style = document.createElement('style');
    style.id = STYLE_ID;
    style.textContent =
      'section[data-framer-name="Faq"] { display: flex !important; flex-direction: column !important; align-items: center !important; width: 100% !important; height: auto !important; min-height: auto !important; padding: 64px 24px 72px !important; position: relative !important; overflow: visible !important; }' +
      'section[data-framer-name="Faq"] [data-framer-name="Container"] { width: 100% !important; max-width: 960px !important; margin: 0 auto !important; display: flex !important; flex-direction: column !important; align-items: center !important; gap: 28px !important; }' +
      'section[data-framer-name="Faq"] h2 { font-size: clamp(28px, 3.2vw, 40px) !important; font-weight: 700 !important; color: #0B0E17 !important; text-align: center !important; margin: 0 auto !important; letter-spacing: -0.02em !important; }' +
      'section[data-framer-name="Faq"] [data-framer-name="Subheading"], section[data-framer-name="Faq"] .framer-9kf38p, section[data-framer-name="Faq"] .framer-9kf38p p { text-align: center !important; font-size: 15px !important; color: #64748b !important; margin: 8px auto 0 !important; width: 100% !important; max-width: 580px !important; display: block !important; }' +
      'section[data-framer-name="Faq"] [data-framer-name="Heading"], section[data-framer-name="Faq"] [data-framer-name="title"] { opacity: 1 !important; transform: none !important; text-align: center !important; }' +
      '/* Permanently hide Framer\'s internal Moviq accordion and category tabs */' +
      'section[data-framer-name="Faq"] [data-framer-name="Basic ALl"], section[data-framer-name="Faq"] [data-framer-name="Tab"] { display: none !important; }' +
      
      '/* Native Demaze Valist Accordion */' +
      '.demaze-native-faq-wrapper { width: 100% !important; max-width: 860px !important; margin: 12px auto 0 !important; display: flex !important; flex-direction: column !important; gap: 14px !important; }' +
      '.demaze-native-faq-item { width: 100% !important; background: #ffffff !important; border: 1px solid rgba(0, 0, 0, 0.08) !important; border-radius: 18px !important; box-shadow: 0 4px 16px rgba(11, 14, 23, 0.03) !important; overflow: hidden !important; transition: border-color 0.25s ease, box-shadow 0.25s ease !important; }' +
      '.demaze-native-faq-item:hover { border-color: rgba(91, 79, 233, 0.3) !important; box-shadow: 0 8px 24px rgba(91, 79, 233, 0.06) !important; }' +
      '.demaze-native-faq-header { width: 100% !important; padding: 22px 24px !important; display: flex !important; align-items: center !important; justify-content: space-between !important; cursor: pointer !important; user-select: none !important; background: transparent !important; border: none !important; text-align: left !important; gap: 16px !important; }' +
      '.demaze-native-faq-question { font-size: 17px !important; font-weight: 600 !important; color: #0b0f19 !important; line-height: 1.4 !important; margin: 0 !important; transition: color 0.2s ease !important; flex: 1 !important; }' +
      '.demaze-native-faq-item.is-open .demaze-native-faq-question { color: #5B4FE9 !important; }' +
      '.demaze-native-faq-toggle { width: 34px !important; height: 34px !important; min-width: 34px !important; border-radius: 50% !important; background: #f1f5f9 !important; border: 1px solid rgba(0, 0, 0, 0.06) !important; display: flex !important; align-items: center !important; justify-content: center !important; transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1) !important; }' +
      '.demaze-native-faq-toggle svg { width: 14px !important; height: 14px !important; stroke: #0b0f19 !important; transition: transform 0.3s ease, stroke 0.3s ease !important; }' +
      '.demaze-native-faq-item.is-open .demaze-native-faq-toggle { background: #5B4FE9 !important; border-color: #5B4FE9 !important; transform: rotate(45deg) !important; }' +
      '.demaze-native-faq-item.is-open .demaze-native-faq-toggle svg { stroke: #ffffff !important; }' +
      '.demaze-native-faq-body { max-height: 0 !important; opacity: 0 !important; overflow: hidden !important; transition: max-height 0.4s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.3s ease, padding 0.3s ease !important; padding: 0 24px !important; }' +
      '.demaze-native-faq-item.is-open .demaze-native-faq-body { max-height: 400px !important; opacity: 1 !important; padding: 0 24px 24px !important; }' +
      '.demaze-native-faq-body p { font-size: 15px !important; line-height: 1.7 !important; color: #475569 !important; margin: 0 !important; border-top: 1px solid rgba(0, 0, 0, 0.05) !important; padding-top: 16px !important; }';
    document.head.appendChild(style);
  }

  function renderNativeAccordion(container) {
    if (container.querySelector('#demaze-native-faq-accordion')) return;

    var wrapper = document.createElement('div');
    wrapper.id = 'demaze-native-faq-accordion';
    wrapper.className = 'demaze-native-faq-wrapper valist-unfold-section is-unfolded';

    content.items.forEach(function (item, index) {
      var card = document.createElement('div');
      card.className = 'demaze-native-faq-item' + (index === 0 ? ' is-open' : '');
      card.id = 'demaze-faq-card-' + index;

      var header = document.createElement('button');
      header.type = 'button';
      header.className = 'demaze-native-faq-header';
      header.setAttribute('aria-expanded', index === 0 ? 'true' : 'false');
      header.setAttribute('aria-controls', 'demaze-faq-body-' + index);

      var q = document.createElement('h3');
      q.className = 'demaze-native-faq-question';
      q.textContent = item.question;

      var toggle = document.createElement('div');
      toggle.className = 'demaze-native-faq-toggle';
      toggle.innerHTML =
        '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">' +
        '<line x1="12" y1="5" x2="12" y2="19"></line>' +
        '<line x1="5" y1="12" x2="19" y2="12"></line>' +
        '</svg>';

      header.appendChild(q);
      header.appendChild(toggle);

      var body = document.createElement('div');
      body.className = 'demaze-native-faq-body';
      body.id = 'demaze-faq-body-' + index;

      var p = document.createElement('p');
      p.textContent = item.answer;
      body.appendChild(p);

      header.addEventListener('click', function () {
        var isOpen = card.classList.contains('is-open');
        // Close all cards for sleek single accordion feel
        wrapper.querySelectorAll('.demaze-native-faq-item').forEach(function (c) {
          c.classList.remove('is-open');
          c.querySelector('.demaze-native-faq-header').setAttribute('aria-expanded', 'false');
        });

        if (!isOpen) {
          card.classList.add('is-open');
          header.setAttribute('aria-expanded', 'true');
        }
      });

      card.appendChild(header);
      card.appendChild(body);
      wrapper.appendChild(card);
    });

    container.appendChild(wrapper);
  }

  function getSection() {
    return document.querySelector('section[data-framer-name="Faq"]');
  }

  function isHydrated(section) {
    return !!section.querySelector('[data-framer-name="Container"]');
  }

  function applyOverride(section) {
    ensureStyle();

    var container = section.querySelector('[data-framer-name="Container"]') || section;

    // Eyebrow, Heading & Subheading
    var tag = section.querySelector('[data-framer-name="Tag"] p, [data-framer-name="Badge Text"] p');
    if (tag && content.eyebrow) tag.textContent = content.eyebrow;

    var heading = section.querySelector('[data-framer-name="Heading"] h2, h2');
    if (heading && content.heading) {
      heading.textContent = content.heading;
    }

    var subheading = section.querySelector('[data-framer-name="Subheading"]');
    if (subheading && content.subheading) {
      subheading.textContent = content.subheading;
    }

    // Completely suppress Framer's internal accordion containers
    var basicAll = section.querySelector('[data-framer-name="Basic ALl"]');
    if (basicAll) basicAll.style.setProperty('display', 'none', 'important');
    var tab = section.querySelector('[data-framer-name="Tab"]');
    if (tab) tab.style.setProperty('display', 'none', 'important');

    // Mount Native Demaze Accordion
    renderNativeAccordion(container);
  }

  function verifyStuck(section) {
    var acc = section.querySelector('#demaze-native-faq-accordion');
    var items = section.querySelectorAll('.demaze-native-faq-item');
    return !!(acc && items.length === 5);
  }

  window.DemazeOverride.run({
    getRoot: getSection,
    isHydrated: isHydrated,
    apply: applyOverride,
    verify: verifyStuck,
  });
})();
