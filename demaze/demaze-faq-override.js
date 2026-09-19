/**
 * Post-hydration content override for the FAQ section (MOVIQ's "Faq" section).
 * Ensures:
 * 1. Category tabs ("Tab") are hidden, while the accordion wrapper ("Basic ALl")
 *    remains completely visible (display: flex !important).
 * 2. All 5 verified Demaze questions and answers are rendered.
 * 3. Any Framer scroll-appear opacity:0 / translateY(80px) is overridden so the
 *    section is immediately visible and correctly formatted.
 * 4. React variant toggles (accordion expand/collapse) are intercepted with a
 *    MutationObserver / click handler so Demaze answers are never overwritten
 *    with MOVIQ defaults.
 * 5. Card 6 (index 5) is hidden (Demaze has 5 FAQs).
 */
(function () {
  var content = window.DEMAZE_CONTENT && window.DEMAZE_CONTENT.faq;
  if (!content || !window.DemazeOverride) return;

  var STYLE_ID = 'demaze-faq-style';

  function ensureStyle() {
    if (document.getElementById(STYLE_ID)) return;
    var style = document.createElement('style');
    style.id = STYLE_ID;
    style.textContent =
      'section[data-framer-name="Faq"]{display:flex!important;flex-direction:column!important;align-items:center!important;width:100%!important;height:auto!important;min-height:auto!important;padding:80px 24px 120px!important;position:relative!important;overflow:visible!important;}' +
      'section[data-framer-name="Faq"] [data-framer-name="Container"]{width:100%!important;max-width:1100px!important;margin:0 auto!important;display:flex!important;flex-direction:column!important;align-items:center!important;gap:40px!important;}' +
      'section[data-framer-name="Faq"] [data-framer-name="Heading"], section[data-framer-name="Faq"] [data-framer-name="Subheading"], section[data-framer-name="Faq"] [data-framer-name="title"]{opacity:1!important;transform:none!important;}' +
      'section[data-framer-name="Faq"] [data-framer-name="Basic ALl"]{display:flex!important;flex-direction:column!important;align-items:center!important;width:100%!important;max-width:860px!important;margin:0 auto!important;gap:16px!important;opacity:1!important;transform:none!important;}' +
      'section[data-framer-name="Faq"] [data-framer-name="Tab"]{display:none!important;}' +
      'section[data-framer-name="Faq"] [data-framer-name="Basic ALl"] > div{width:100%!important;background:#ffffff!important;border:1px solid rgba(0,0,0,0.07)!important;border-radius:24px!important;box-shadow:0 8px 24px rgba(0,0,0,0.03)!important;transition:all 0.25s ease!important;}' +
      'section[data-framer-name="Faq"] [data-framer-name="Basic ALl"] > div:hover{border-color:rgba(91,95,239,0.25)!important;box-shadow:0 12px 32px rgba(0,0,0,0.06)!important;}' +
      'section[data-framer-name="Faq"] [data-framer-name="question-row"]{cursor:pointer!important;user-select:none!important;}' +
      'section[data-framer-name="Faq"] [data-framer-name="question-text"] h6{font-size:18px!important;font-weight:600!important;color:#0b0f19!important;}' +
      'section[data-framer-name="Faq"] [data-framer-name="answer-text"] p{font-size:15px!important;line-height:1.7!important;color:#475569!important;margin-top:12px!important;}';
    document.head.appendChild(style);
  }

  function getSection() {
    return document.querySelector('section[data-framer-name="Faq"]');
  }

  function isHydrated(section) {
    var rows = section.querySelectorAll('[data-framer-name="question-row"]');
    return rows.length > 0 && !!rows[0].querySelector('h6');
  }

  function setGradientText(el, text) {
    if (!el) return;
    var span = el.querySelector('span');
    (span || el).textContent = text;
  }

  function syncAnswers(section) {
    var rows = section.querySelectorAll('[data-framer-name="question-row"]');
    rows.forEach(function (row, i) {
      var card = row.parentElement;
      var item = content.items[i];
      if (!item) {
        card.style.setProperty('display', 'none', 'important');
        var containerParent = card.closest('.framer-1h9d0pl-container, .framer-1o23p5d-container, [class*="-container"]');
        if (containerParent && containerParent !== section && !containerParent.contains(rows[0])) {
          containerParent.style.setProperty('display', 'none', 'important');
        }
        return;
      }
      card.style.setProperty('display', 'flex', 'important');

      var questionText = row.querySelector('[data-framer-name="question-text"] h6');
      if (questionText && questionText.textContent.trim() !== item.question) {
        setGradientText(questionText, item.question);
      }

      var answerP = card.querySelector('[data-framer-name="answer-text"] p');
      if (answerP && answerP.textContent.trim() !== item.answer) {
        answerP.textContent = item.answer;
      }
    });
  }

  var observerAttached = false;

  function attachAccordionObserver(section) {
    if (observerAttached) return;
    var basicAll = section.querySelector('[data-framer-name="Basic ALl"]');
    if (!basicAll) return;

    // Observe changes to accordion nodes (Framer re-renders on expand/collapse)
    var observer = new MutationObserver(function () {
      syncAnswers(section);
    });
    observer.observe(basicAll, { childList: true, subtree: true, attributes: true, attributeFilter: ['class', 'style'] });

    // Also attach click handler for instant UI response
    basicAll.addEventListener('click', function () {
      setTimeout(function () {
        syncAnswers(section);
      }, 50);
      setTimeout(function () {
        syncAnswers(section);
      }, 200);
    });

    observerAttached = true;
  }

  function applyOverride(section) {
    ensureStyle();

    // Eyebrow, Heading & Subheading
    var tag = section.querySelector('[data-framer-name="Tag"] p, [data-framer-name="Badge Text"] p');
    if (tag && content.eyebrow) tag.textContent = content.eyebrow;

    var heading = section.querySelector('[data-framer-name="Heading"] h2, h2');
    if (heading) setGradientText(heading, content.heading);

    var subheading = section.querySelector('[data-framer-name="Subheading"]');
    if (subheading) subheading.textContent = content.subheading;

    // Make sure scroll-appear transform/opacity is reset to fully visible
    var appearEls = section.querySelectorAll('[style*="opacity:0"], [style*="opacity: 0"], [style*="translateY"]');
    appearEls.forEach(function (el) {
      el.style.setProperty('opacity', '1', 'important');
      el.style.setProperty('transform', 'none', 'important');
    });

    // Keep Basic All visible, hide Tab
    var basicAll = section.querySelector('[data-framer-name="Basic ALl"]');
    if (basicAll) {
      basicAll.style.setProperty('display', 'flex', 'important');
      basicAll.style.setProperty('opacity', '1', 'important');
    }
    var tab = section.querySelector('[data-framer-name="Tab"]');
    if (tab) {
      tab.style.setProperty('display', 'none', 'important');
    }

    // Sync Q&A texts
    syncAnswers(section);

    // Attach interactive observer
    attachAccordionObserver(section);
  }

  function verifyStuck(section) {
    var rows = section.querySelectorAll('[data-framer-name="question-row"]');
    if (rows.length === 0) return false;
    var firstQ = rows[0].querySelector('[data-framer-name="question-text"] h6');
    var basicAll = section.querySelector('[data-framer-name="Basic ALl"]');
    var isVisible = basicAll && window.getComputedStyle(basicAll).display !== 'none';
    return !!(firstQ && firstQ.textContent.trim() === content.items[0].question && isVisible);
  }

  window.DemazeOverride.run({
    getRoot: getSection,
    isHydrated: isHydrated,
    apply: applyOverride,
    verify: verifyStuck,
  });
})();
