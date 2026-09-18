/**
 * Post-hydration content override for the FAQ section (MOVIQ's "Faq"
 * section: category tabs — Basic All/Payment/License/Support — over an
 * accordion of 6 question/answer cards).
 *
 * Demaze's 5 real FAQs (from demazetech.com homepage) aren't categorized, so
 * the tab bar is hidden rather than inventing categories for it. MOVIQ has 6
 * card slots; Demaze has 5 real items, so the 6th card is hidden rather than
 * inventing filler, per project convention.
 *
 * The accordion's own expand/collapse click behavior is untouched — this
 * only ever mutates text content, never removes/rebuilds the interactive
 * nodes React owns.
 *
 * See demaze-override-core.js for why this waits/mutates/rechecks the way it does.
 */
(function () {
  var content = window.DEMAZE_CONTENT && window.DEMAZE_CONTENT.faq;
  if (!content || !window.DemazeOverride) return;

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

  function applyOverride(section) {
    // Heading + subheading.
    var heading = section.querySelector('[data-framer-name="Heading"] h2, h2');
    if (heading) setGradientText(heading, content.heading);
    var subheading = section.querySelector('[data-framer-name="Subheading"]');
    if (subheading) subheading.textContent = content.subheading;

    // Category tab bar has no Demaze equivalent — hide, don't remove.
    var tabBar = section.querySelector('[data-framer-name="Basic ALl"]');
    if (tabBar) tabBar.style.display = 'none';

    // Each question-row's parent is the bordered card holding exactly one
    // question-row + one answer-container.
    var rows = section.querySelectorAll('[data-framer-name="question-row"]');
    rows.forEach(function (row, i) {
      var card = row.parentElement;
      var item = content.items[i];
      if (!item) {
        card.style.display = 'none';
        return;
      }
      card.style.display = '';
      var questionText = row.querySelector('[data-framer-name="question-text"] h6');
      setGradientText(questionText, item.question);

      var answerText = card.querySelector('[data-framer-name="answer-text"] p');
      if (answerText) answerText.textContent = item.answer;
    });
  }

  function verifyStuck(section) {
    var rows = section.querySelectorAll('[data-framer-name="question-row"]');
    if (rows.length === 0) return false;
    var firstQuestion = rows[0].querySelector('[data-framer-name="question-text"] h6');
    var tabBar = section.querySelector('[data-framer-name="Basic ALl"]');
    return (
      !!(firstQuestion && firstQuestion.textContent.trim() === content.items[0].question) &&
      !!(tabBar && tabBar.style.display === 'none')
    );
  }

  window.DemazeOverride.run({
    getRoot: getSection,
    isHydrated: isHydrated,
    apply: applyOverride,
    verify: verifyStuck,
  });
})();
