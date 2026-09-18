/**
 * Post-hydration content override for the Process section (MOVIQ's "Videos
 * making Step" section: heading + subtitle + 3 step cards in a flex row,
 * the middle one highlighted with an accent border).
 *
 * Demaze DOES have a real 4-step process (demazetech.com homepage "HOW WE
 * WORK: Our Process") — an earlier pass on this project hid this section
 * entirely on the belief that no Demaze process content existed anywhere on
 * their site; that was wrong (or the content was added since), so this
 * un-hides it and adapts MOVIQ's 3-card row to 4 cards instead.
 *
 * MOVIQ's 3 cards sit in a plain `display:flex` row (`flex:1 0 0px` each,
 * `nowrap`) — confirmed via computed style, not assumed — so a 4th card
 * added the same way just takes an equal flex share automatically, no CSS
 * rewrite needed. The two outer cards each carry a small inline
 * `translateX(...) scale(0.9)` offset tuned for the 3-card width; with a 4th
 * card narrowing every column, that offset would misalign, so it's cleared
 * on all cards rather than re-tuned by guesswork — a plain, evenly-spaced
 * 4-card row, no invented geometry.
 *
 * See demaze-override-core.js for why this waits/mutates/rechecks the way it does.
 */
(function () {
  var content = window.DEMAZE_CONTENT && window.DEMAZE_CONTENT.process;
  if (!content || !window.DemazeOverride) return;

  function getSection() {
    return document.querySelector('section[data-framer-name="Videos making Step"]');
  }

  function getCardContainers(section) {
    var wrapper = section.querySelector('[data-framer-name="Step wrapper"]');
    return wrapper ? wrapper.querySelectorAll(':scope > .ssr-variant > div') : [];
  }

  function isHydrated(section) {
    var cards = getCardContainers(section);
    return cards.length >= 3 && !!cards[0].querySelector('h6');
  }

  function ensureFourthCard(section) {
    var wrapper = section.querySelector('[data-framer-name="Step wrapper"]');
    var cards = getCardContainers(section);
    if (cards.length >= 4 || !wrapper) return;

    // Clone the last unhighlighted card ("Variant 1") as the base for the
    // new 4th slot, rather than inventing new markup/classes.
    var template = cards[cards.length - 1].closest('.ssr-variant');
    var clone = template.cloneNode(true);
    wrapper.appendChild(clone);
  }

  function applyOverride(section) {
    section.style.display = '';

    var heading = section.querySelector('[data-framer-name="Heading"] h2, h2');
    if (heading) heading.textContent = content.heading;

    // Subtitle ("Transform scripts into videos...") has no Demaze
    // equivalent one-liner — hide, don't remove.
    var subtitle = section.querySelector('[data-framer-name="Heading"] p');
    if (subtitle) subtitle.style.display = 'none';

    ensureFourthCard(section);

    var cards = getCardContainers(section);
    cards.forEach(function (card, i) {
      var step = content.steps[i];
      if (!step) return;

      // Clear the 3-card fan offset — see file header for why.
      card.style.transform = 'none';

      var title = card.querySelector('[data-framer-name="content"] h6');
      if (title) title.textContent = step.title;

      var description = card.querySelector('[data-framer-name="content"] p');
      if (description) description.textContent = step.description;

      var badge = card.querySelector('[data-framer-name="Badge Text"] p');
      if (badge) badge.textContent = 'Step ' + (i + 1);
    });
  }

  function verifyStuck(section) {
    if (section.style.display === 'none') return false;
    var cards = getCardContainers(section);
    if (cards.length !== content.steps.length) return false;
    var firstTitle = cards[0].querySelector('[data-framer-name="content"] h6');
    return !!(firstTitle && firstTitle.textContent.trim() === content.steps[0].title);
  }

  window.DemazeOverride.run({
    getRoot: getSection,
    isHydrated: isHydrated,
    apply: applyOverride,
    verify: verifyStuck,
  });
})();
