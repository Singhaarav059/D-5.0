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

  var STYLE_ID = 'demaze-whatdrivesus-style';

  function ensureStyle() {
    if (document.getElementById(STYLE_ID)) return;
    var style = document.createElement('style');
    style.id = STYLE_ID;
    style.textContent =
      'section[data-framer-name="Ai Powered"]{height:auto!important;min-height:auto!important;padding:80px 24px 100px!important;overflow:visible!important;}' +
      'section[data-framer-name="Ai Powered"] [data-framer-name="Cards wrapper"]{height:auto!important;width:100%!important;max-width:1240px!important;margin:0 auto!important;display:flex!important;flex-direction:column!important;align-items:stretch!important;}' +
      'section[data-framer-name="Ai Powered"] [data-framer-name="Firs row"],' +
      'section[data-framer-name="Ai Powered"] [data-framer-name="Second row"]{' +
      'display:flex!important;flex-direction:row!important;gap:32px!important;width:100%!important;max-width:1240px!important;margin:0 auto 32px!important;height:auto!important;box-sizing:border-box!important;}' +
      'section[data-framer-name="Ai Powered"] [data-framer-name="Firs row"] > div,' +
      'section[data-framer-name="Ai Powered"] [data-framer-name="Second row"] > div{' +
      'flex:1 1 calc(50% - 16px)!important;width:calc(50% - 16px)!important;max-width:calc(50% - 16px)!important;min-width:0!important;' +
      'display:flex!important;flex-direction:column!important;justify-content:space-between!important;background:#ffffff!important;border:1px solid rgba(0,0,0,0.07)!important;' +
      'border-radius:24px!important;padding:36px 32px 32px!important;box-shadow:0 12px 36px rgba(0,0,0,0.04)!important;height:auto!important;min-height:440px!important;box-sizing:border-box!important;position:relative!important;overflow:hidden!important;transition:all 0.3s ease!important;}' +
      'section[data-framer-name="Ai Powered"] [data-framer-name="Firs row"] > div:hover,' +
      'section[data-framer-name="Ai Powered"] [data-framer-name="Second row"] > div:hover{' +
      'transform:translateY(-4px)!important;box-shadow:0 20px 48px rgba(0,0,0,0.08)!important;border-color:rgba(91,95,239,0.25)!important;}' +
      'section[data-framer-name="Ai Powered"] [data-framer-name="Top"]{height:auto!important;max-height:none!important;min-height:auto!important;border:none!important;background:transparent!important;overflow:visible!important;width:100%!important;margin:0 0 24px!important;padding:0!important;display:flex!important;flex-direction:column!important;}' +
      'section[data-framer-name="Ai Powered"] [data-framer-name="Feature Header"],' +
      'section[data-framer-name="Ai Powered"] [data-framer-name="Feature Header"] > div{' +
      'position:relative!important;z-index:2!important;width:100%!important;max-width:100%!important;min-width:0!important;height:auto!important;margin:0 0 24px!important;top:0!important;left:0!important;flex:none!important;align-self:stretch!important;}' +
      'section[data-framer-name="Ai Powered"] [data-framer-name="Feature Title"]{' +
      'font-size:clamp(20px,2.2vw,24px)!important;font-weight:700!important;color:#0b0f19!important;margin:0 0 12px!important;line-height:1.3!important;width:100%!important;max-width:100%!important;min-width:0!important;white-space:normal!important;word-break:normal!important;overflow-wrap:break-word!important;}' +
      'section[data-framer-name="Ai Powered"] [data-framer-name="Feature Description"]{' +
      'font-size:14.5px!important;line-height:1.65!important;color:rgb(108,119,131)!important;height:auto!important;width:100%!important;max-width:100%!important;min-width:0!important;white-space:normal!important;word-break:normal!important;overflow-wrap:break-word!important;}' +
      'section[data-framer-name="Ai Powered"] [data-framer-name="Images"],' +
      'section[data-framer-name="Ai Powered"] [data-framer-name="Rectangle 161124870"],' +
      'section[data-framer-name="Ai Powered"] [data-framer-name="Media Image"],' +
      'section[data-framer-name="Ai Powered"] [data-framer-name="Ai Avatar"] > div:not([data-framer-name="Feature Header"]),' +
      'section[data-framer-name="Ai Powered"] [data-framer-name="UGC Video Maker"] > div:not([data-framer-name="Feature Header"]),' +
      'section[data-framer-name="Ai Powered"] [data-framer-name="UGC Video Maker"] [data-framer-name="Rectangle 161124870"] > div{' +
      'position:relative!important;top:auto!important;left:auto!important;bottom:auto!important;right:auto!important;width:100%!important;height:220px!important;max-height:220px!important;border-radius:16px!important;overflow:hidden!important;background:#f8fafc!important;border:1px solid rgba(0,0,0,0.06)!important;margin-top:auto!important;}' +
      'section[data-framer-name="Ai Powered"] img{position:relative!important;width:100%!important;height:100%!important;max-height:220px!important;object-fit:cover!important;object-position:center!important;display:block!important;border-radius:16px!important;}' +
      'section[data-framer-name="Ai Powered"] .framer-1wvatk4{display:none!important;}' +
      '@media (max-width:809px){' +
      'section[data-framer-name="Ai Powered"] [data-framer-name="Firs row"],' +
      'section[data-framer-name="Ai Powered"] [data-framer-name="Second row"]{' +
      'flex-direction:column!important;gap:20px!important;margin-bottom:20px!important;}' +
      'section[data-framer-name="Ai Powered"] [data-framer-name="Firs row"] > div,' +
      'section[data-framer-name="Ai Powered"] [data-framer-name="Second row"] > div{' +
      'flex:1 1 100%!important;width:100%!important;max-width:100%!important;min-height:auto!important;padding:24px!important;}' +
      '}';
    document.head.appendChild(style);
  }

  function applyOverride(section) {
    ensureStyle();

    var heading = section.querySelector('[data-framer-name="Main Heading"] h2');
    if (heading) {
      var span = heading.querySelector('span');
      (span || heading).textContent = content.heading;
    }

    var row1 = section.querySelector('[data-framer-name="Firs row"]');
    var row2 = section.querySelector('[data-framer-name="Second row"]');
    
    // Balance cards into 2 + 2
    if (row1 && row2 && row1.children.length === 3) {
      var card3 = row1.children[2];
      if (card3) {
        row2.insertBefore(card3, row2.firstChild);
      }
    }

    var cards = getCards(section);
    cards.forEach(function (card, i) {
      var item = content.items[i];
      if (!item) {
        card.style.setProperty('display', 'none', 'important');
        return;
      }
      card.style.display = 'flex';
      var title = card.querySelector('[data-framer-name="Feature Title"]');
      if (title) title.textContent = item.title;
      var desc = card.querySelector('[data-framer-name="Feature Description"]');
      if (desc) desc.textContent = item.description;

      var header = card.querySelector('[data-framer-name="Feature Header"]');
      if (header) {
        header.style.setProperty('width', '100%', 'important');
        header.style.setProperty('min-width', '0px', 'important');
      }

      var allImgs = card.querySelectorAll('img');
      if (allImgs.length > 0 && item.image) {
        if (i === 1 && allImgs.length > 1) {
          // Keep the top waveform UI element
          allImgs[0].src = 'https://framerusercontent.com/images/mEUH0ODJikF8cY6okrEAv9CVdpg.png?width=287&height=40';
          allImgs[0].setAttribute('srcset', '');
          allImgs[0].style.height = '40px';
          allImgs[0].style.width = 'auto';
          allImgs[0].style.maxHeight = '40px';
          allImgs[0].style.objectFit = 'contain';

          // Set the main bottom visual image
          allImgs[1].src = item.image;
          allImgs[1].setAttribute('srcset', '');
          allImgs[1].style.objectFit = 'cover';
          allImgs[1].style.objectPosition = 'center';
          allImgs[1].style.borderRadius = '16px';
          allImgs[1].style.maxHeight = '220px';
          allImgs[1].style.height = '220px';
          allImgs[1].style.width = '100%';
        } else {
          var mainImg = allImgs[0];
          mainImg.setAttribute('src', item.image);
          mainImg.setAttribute('srcset', '');
          mainImg.style.objectFit = 'cover';
          mainImg.style.objectPosition = 'center';
          mainImg.style.borderRadius = '16px';
          mainImg.style.maxHeight = '220px';
          mainImg.style.height = '220px';
          mainImg.style.width = '100%';
        }
      }

      // Hide extra MOVIQ option badges
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
