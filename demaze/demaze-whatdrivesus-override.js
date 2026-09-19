/**
 * Post-hydration content override for "What Drives Us" (MOVIQ's "Ai
 * Powered" section: a heading + 5 feature cards across 2 rows, each with a
 * title, description, and decorative product-mockup image).
 *
 * Demaze has 4 real "What Drives Us" items (from demazetech.com homepage,
 * part of the same "WHAT WE ARE" block as Who We Are). The 5th card slot is
 * hidden rather than filled with a 5th invented item. No per-item photos
 * exist for these on the live site, so each card's decorative image is left
 * as MOVIQ's own artwork rather than invented — same treatment already used
 * for the Process section's generic step icon.
 *
 * See demaze-override-core.js for why this waits/mutates/rechecks the way it does.
 */
(function () {
  var content = window.DEMAZE_CONTENT && window.DEMAZE_CONTENT.aboutUs && window.DEMAZE_CONTENT.aboutUs.whatDrivesUs;
  if (!content || !window.DemazeOverride) return;

  function getSection() {
    return document.querySelector('section[data-framer-name="Ai Powered"]');
  }

  function getCards(section) {
    var rows = section.querySelectorAll('[data-framer-name="Firs row"], [data-framer-name="Second row"]');
    var cards = [];
    rows.forEach(function (row) {
      Array.prototype.forEach.call(row.children, function (c) {
        cards.push(c);
      });
    });
    return cards;
  }

  function isHydrated(section) {
    var cards = getCards(section);
    return cards.length >= 5 && !!cards[0].querySelector('[data-framer-name="Feature Title"]');
  }

  function applyOverride(section) {
    var heading = section.querySelector('[data-framer-name="Main Heading"] h2');
    if (heading) {
      var span = heading.querySelector('span');
      (span || heading).textContent = content.heading;
    }

    var cards = getCards(section);
    cards.forEach(function (card, i) {
      var item = content.items[i];
      if (!item) {
        card.style.display = 'none';
        return;
      }
      card.style.display = '';
      var title = card.querySelector('[data-framer-name="Feature Title"]');
      if (title) title.textContent = item.title;
      var desc = card.querySelector('[data-framer-name="Feature Description"]');
      if (desc) desc.textContent = item.description;

      var cardImg = card.querySelector('img');
      if (cardImg && item.image) {
        cardImg.setAttribute('src', item.image);
        cardImg.setAttribute('srcset', '');
        cardImg.style.objectFit = 'cover';
        cardImg.style.borderRadius = '16px';
        cardImg.style.maxHeight = '220px';
      }

      // The "AI Voice Studio" card has an extra nested language-option list
      // (Canadian/Chinese/English) beyond title+description+image — no
      // Demaze equivalent, hide it rather than leaving MOVIQ copy showing.
      var languageOption = card.querySelector('[data-framer-name="Option"]');
      if (languageOption) languageOption.style.display = 'none';
    });
  }

  function verifyStuck(section) {
    var cards = getCards(section);
    var firstTitle = cards[0] && cards[0].querySelector('[data-framer-name="Feature Title"]');
    var fifthHidden = cards[4] && cards[4].style.display === 'none';
    return !!(firstTitle && firstTitle.textContent.trim() === content.items[0].title && fifthHidden);
  }

  window.DemazeOverride.run({
    getRoot: getSection,
    isHydrated: isHydrated,
    apply: applyOverride,
    verify: verifyStuck,
  });
})();
