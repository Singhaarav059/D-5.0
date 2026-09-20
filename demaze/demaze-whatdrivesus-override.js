/**
 * Post-hydration content override for "What Drives Us" (MOVIQ's "Ai
 * Powered" section: a heading + 4 feature cards in a clean 2x2 grid).
 */
(function () {
  var content = window.DEMAZE_CONTENT && window.DEMAZE_CONTENT.aboutUs && window.DEMAZE_CONTENT.aboutUs.whatDrivesUs;
  if (!content || !window.DemazeOverride) return;

  function getSection() {
    return document.querySelector('section[data-framer-name="Ai Powered"]');
  }

  function getRows(section) {
    return {
      firstRow: section.querySelector('[data-framer-name="Firs row"]'),
      secondRow: section.querySelector('[data-framer-name="Second row"]')
    };
  }

  function isHydrated(section) {
    var rows = getRows(section);
    if (!rows.firstRow || !rows.secondRow) return false;
    return rows.firstRow.children.length >= 3 &&
           rows.secondRow.children.length >= 2 &&
           !!rows.firstRow.children[0].querySelector('[data-framer-name="Feature Title"]');
  }

  var STYLE_ID = 'demaze-whatdrivesus-style';

  function ensureStyle() {
    if (document.getElementById(STYLE_ID)) return;
    var style = document.createElement('style');
    style.id = STYLE_ID;
    style.textContent =
      'section[data-framer-name="Ai Powered"]{height:auto!important;min-height:auto!important;padding:60px 24px 70px!important;overflow:visible!important;}' +
      'section[data-framer-name="Ai Powered"] h2{font-size:clamp(34px, 3.8vw, 46px)!important;font-weight:700!important;color:#0B0E17!important;margin-bottom:36px!important;text-align:center!important;}' +
      'section[data-framer-name="Ai Powered"] [data-framer-name="Cards wrapper"]{' +
      '  display:flex!important;flex-direction:column!important;gap:28px!important;' +
      '  width:100%!important;max-width:1240px!important;margin:0 auto!important;height:auto!important;' +
      '}' +
      'section[data-framer-name="Ai Powered"] [data-framer-name="Firs row"],' +
      'section[data-framer-name="Ai Powered"] [data-framer-name="Second row"]{' +
      '  display:grid!important;grid-template-columns:repeat(2,1fr)!important;grid-template-rows:none!important;grid-auto-rows:auto!important;gap:28px!important;' +
      '  width:100%!important;height:auto!important;align-items:stretch!important;' +
      '}' +
      'section[data-framer-name="Ai Powered"] [data-framer-name="Firs row"] > div:nth-child(3){' +
      '  display:none!important;position:absolute!important;width:0!important;height:0!important;min-height:0!important;' +
      '  margin:0!important;padding:0!important;overflow:hidden!important;pointer-events:none!important;' +
      '}' +
      'section[data-framer-name="Ai Powered"] [data-framer-name="Firs row"] > div,' +
      'section[data-framer-name="Ai Powered"] [data-framer-name="Second row"] > div{' +
      '  display:flex!important;flex-direction:column!important;justify-content:space-between!important;' +
      '  background:#ffffff!important;border:1px solid rgba(0,0,0,0.07)!important;border-radius:24px!important;' +
      '  padding:36px 32px 32px!important;box-shadow:0 12px 36px rgba(0,0,0,0.04)!important;' +
      '  height:auto!important;min-height:440px!important;width:100%!important;box-sizing:border-box!important;' +
      '  position:relative!important;overflow:hidden!important;transform:none!important;left:auto!important;' +
      '  transition:all 0.3s ease!important;' +
      '}' +
      'section[data-framer-name="Ai Powered"] [data-framer-name="Firs row"] > div:hover,' +
      'section[data-framer-name="Ai Powered"] [data-framer-name="Second row"] > div:hover{' +
      '  transform:translateY(-4px)!important;box-shadow:0 20px 48px rgba(0,0,0,0.08)!important;border-color:rgba(91,95,239,0.25)!important;' +
      '}' +
      'section[data-framer-name="Ai Powered"] [data-framer-name="Top"]{height:auto!important;max-height:none!important;min-height:auto!important;border:none!important;background:transparent!important;overflow:visible!important;width:100%!important;margin:0 0 24px!important;padding:0!important;display:flex!important;flex-direction:column!important;}' +
      'section[data-framer-name="Ai Powered"] [data-framer-name="Feature Header"],' +
      'section[data-framer-name="Ai Powered"] [data-framer-name="Feature Header"] > div{' +
      '  position:relative!important;z-index:2!important;width:100%!important;max-width:100%!important;min-width:0!important;height:auto!important;margin:0 0 20px!important;top:0!important;left:0!important;flex:none!important;align-self:stretch!important;' +
      '}' +
      'section[data-framer-name="Ai Powered"] [data-framer-name="Feature Title"]{' +
      '  font-size:clamp(20px,2.2vw,24px)!important;font-weight:700!important;color:#0b0f19!important;margin:0 0 12px!important;line-height:1.3!important;width:100%!important;max-width:100%!important;min-width:0!important;white-space:normal!important;word-break:normal!important;overflow-wrap:break-word!important;' +
      '}' +
      'section[data-framer-name="Ai Powered"] [data-framer-name="Feature Description"]{' +
      '  font-size:14.5px!important;line-height:1.65!important;color:rgb(108,119,131)!important;height:auto!important;width:100%!important;max-width:100%!important;min-width:0!important;white-space:normal!important;word-break:normal!important;overflow-wrap:break-word!important;' +
      '}' +
      'section[data-framer-name="Ai Powered"] [data-framer-name="Ai Avatar"] [data-framer-name="Images"]{' +
      '  display:block!important;width:100%!important;height:220px!important;max-height:220px!important;position:relative!important;border-radius:16px!important;overflow:hidden!important;background:#f8fafc!important;border:1px solid rgba(0,0,0,0.06)!important;margin-top:auto!important;' +
      '}' +
      'section[data-framer-name="Ai Powered"] [data-framer-name="Ai Avatar"] [data-framer-name="Images"] > div:nth-child(2),' +
      'section[data-framer-name="Ai Powered"] [data-framer-name="Ai Avatar"] [data-framer-name="Images"] > div:nth-child(3){' +
      '  display:none!important;' +
      '}' +
      'section[data-framer-name="Ai Powered"] [data-framer-name="Ai Avatar"] [data-framer-name="Images"] > div:nth-child(1){' +
      '  display:block!important;position:absolute!important;inset:0!important;width:100%!important;height:100%!important;max-width:100%!important;aspect-ratio:auto!important;border-radius:16px!important;' +
      '}' +
      'section[data-framer-name="Ai Powered"] [data-framer-name="Ai Avatar"] [data-framer-name="Images"] > div:nth-child(1) img{' +
      '  width:100%!important;height:100%!important;max-height:220px!important;object-fit:cover!important;object-position:center!important;display:block!important;border-radius:16px!important;' +
      '}' +
      'section[data-framer-name="Ai Powered"] [data-framer-name="AI Voice Studio"] [data-framer-name="Audio Image"]{' +
      '  display:none!important;' +
      '}' +
      'section[data-framer-name="Ai Powered"] [data-framer-name="AI Voice Studio"] [data-framer-name="Rectangle 161124870"]{' +
      '  width:100%!important;height:220px!important;max-height:220px!important;border-radius:16px!important;overflow:hidden!important;background:#f8fafc!important;border:1px solid rgba(0,0,0,0.06)!important;margin-top:auto!important;' +
      '}' +
      'section[data-framer-name="Ai Powered"] [data-framer-name="AI Voice Studio"] [data-framer-name="Rectangle 161124870"] img{' +
      '  width:100%!important;height:100%!important;max-height:220px!important;object-fit:cover!important;display:block!important;border-radius:16px!important;' +
      '}' +
      'section[data-framer-name="Ai Powered"] [data-framer-name="Images"],' +
      'section[data-framer-name="Ai Powered"] [data-framer-name="Rectangle 161124870"],' +
      'section[data-framer-name="Ai Powered"] [data-framer-name="Media Image"],' +
      'section[data-framer-name="Ai Powered"] [data-framer-name="Ai Avatar"] > div:not([data-framer-name="Feature Header"]),' +
      'section[data-framer-name="Ai Powered"] [data-framer-name="UGC Video Maker"] > div:not([data-framer-name="Feature Header"]),' +
      'section[data-framer-name="Ai Powered"] [data-framer-name="UGC Video Maker"] [data-framer-name="Rectangle 161124870"] > div{' +
      '  position:relative!important;top:auto!important;left:auto!important;bottom:auto!important;right:auto!important;width:100%!important;height:220px!important;max-height:220px!important;border-radius:16px!important;overflow:hidden!important;background:#f8fafc!important;border:1px solid rgba(0,0,0,0.06)!important;margin-top:auto!important;' +
      '}' +
      'section[data-framer-name="Ai Powered"] img{position:relative!important;width:100%!important;height:100%!important;max-height:220px!important;object-fit:cover!important;object-position:center!important;display:block!important;border-radius:16px!important;}' +
      '@media (max-width:809px){' +
      '  section[data-framer-name="Ai Powered"] [data-framer-name="Firs row"],' +
      '  section[data-framer-name="Ai Powered"] [data-framer-name="Second row"]{' +
      '    grid-template-columns:1fr!important;gap:20px!important;' +
      '  }' +
      '  section[data-framer-name="Ai Powered"] [data-framer-name="Cards wrapper"]{' +
      '    gap:20px!important;' +
      '  }' +
      '  section[data-framer-name="Ai Powered"] [data-framer-name="Firs row"] > div,' +
      '  section[data-framer-name="Ai Powered"] [data-framer-name="Second row"] > div{' +
      '    min-height:auto!important;padding:24px!important;' +
      '  }' +
      '}';
    document.head.appendChild(style);
  }

  var DEMO_GRAPHICS = [
    '/assets/demaze/ai_execution_graphic_1789813451769.jpg',
    '/assets/demaze/eng_ownership_graphic_1789813608834.jpg',
    '/assets/demaze/cloud_scale_graphic_1789813631564.jpg',
    'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1200&q=80'
  ];

  function applyOverride(section) {
    ensureStyle();

    var heading = section.querySelector('[data-framer-name="Main Heading"] h2');
    if (heading) {
      var span = heading.querySelector('span');
      (span || heading).textContent = content.heading;
    }

    var rows = getRows(section);
    if (!rows.firstRow || !rows.secondRow) return;

    var firstCards = rows.firstRow.children;
    var secondCards = rows.secondRow.children;
    if (firstCards.length < 3 || secondCards.length < 2) return;

    // First row: Child 0 -> Item 0, Child 1 -> Item 1, Child 2 -> HIDE
    // Second row: Child 0 -> Item 2, Child 1 -> Item 3
    var activeCards = [
      { card: firstCards[0], item: content.items[0], graphic: DEMO_GRAPHICS[0] },
      { card: firstCards[1], item: content.items[1], graphic: DEMO_GRAPHICS[1] },
      { card: secondCards[0], item: content.items[2], graphic: DEMO_GRAPHICS[2] },
      { card: secondCards[1], item: content.items[3], graphic: DEMO_GRAPHICS[3] }
    ];

    // Hide extra 3rd card in first row and remove from grid layout
    firstCards[2].style.setProperty('display', 'none', 'important');
    firstCards[2].style.setProperty('position', 'absolute', 'important');
    firstCards[2].style.setProperty('width', '0px', 'important');
    firstCards[2].style.setProperty('height', '0px', 'important');
    firstCards[2].style.setProperty('min-height', '0px', 'important');
    firstCards[2].style.setProperty('overflow', 'hidden', 'important');
    firstCards[2].style.setProperty('pointer-events', 'none', 'important');

    activeCards.forEach(function (entry) {
      var card = entry.card;
      var item = entry.item;
      var targetGraphic = entry.graphic || item.image;

      card.style.setProperty('display', 'flex', 'important');
      card.style.setProperty('transform', 'none', 'important');
      card.style.setProperty('left', 'auto', 'important');
      card.style.setProperty('opacity', '1', 'important');

      var title = card.querySelector('[data-framer-name="Feature Title"]');
      if (title) title.textContent = item.title;
      var desc = card.querySelector('[data-framer-name="Feature Description"]');
      if (desc) desc.textContent = item.description;

      var header = card.querySelector('[data-framer-name="Feature Header"]');
      if (header) {
        header.style.setProperty('width', '100%', 'important');
        header.style.setProperty('min-width', '0px', 'important');
      }

      // Handle image display per card
      var audioImg = card.querySelector('[data-framer-name="Audio Image"]');
      if (audioImg) {
        audioImg.style.setProperty('display', 'none', 'important');
        var rectImg = card.querySelector('[data-framer-name="Rectangle 161124870"] img');
        if (rectImg) {
          rectImg.style.setProperty('display', 'block', 'important');
          rectImg.setAttribute('src', targetGraphic);
          rectImg.setAttribute('srcset', '');
          rectImg.style.objectFit = 'cover';
          rectImg.style.borderRadius = '16px';
          rectImg.style.height = '220px';
          rectImg.style.width = '100%';
        }
      } else {
        var allImgs = card.querySelectorAll('img');
        if (allImgs.length > 0) {
          allImgs.forEach(function (img, idx) {
            if (idx === 0) {
              img.style.setProperty('display', 'block', 'important');
              img.setAttribute('src', targetGraphic);
              img.setAttribute('srcset', '');
              img.style.objectFit = 'cover';
              img.style.borderRadius = '16px';
              img.style.height = '220px';
              img.style.width = '100%';
            } else {
              img.style.setProperty('display', 'none', 'important');
            }
          });
        }
      }

      // Hide extra MOVIQ option badges
      var languageOption = card.querySelector('[data-framer-name="Option"]');
      if (languageOption) languageOption.style.display = 'none';
    });
  }

  function verifyStuck(section) {
    var rows = getRows(section);
    if (!rows.firstRow || !rows.secondRow || rows.firstRow.children.length < 3 || rows.secondRow.children.length < 2) return false;
    var firstTitle = rows.firstRow.children[0].querySelector('[data-framer-name="Feature Title"]');
    var thirdHidden = rows.firstRow.children[2].style.display === 'none';
    var fourthTitle = rows.secondRow.children[1].querySelector('[data-framer-name="Feature Title"]');
    return !!(firstTitle && firstTitle.textContent.trim() === content.items[0].title &&
              thirdHidden &&
              fourthTitle && fourthTitle.textContent.trim() === content.items[3].title);
  }

  window.DemazeOverride.run({
    getRoot: getSection,
    isHydrated: isHydrated,
    apply: applyOverride,
    verify: verifyStuck,
  });
})();
