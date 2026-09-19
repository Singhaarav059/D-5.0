/**
 * Post-hydration content override for Industries We Serve (MOVIQ's 2nd
 * "Tools" section: a tab bar — Text to Video/AI Image/AI Voice/AI Video
 * Editing — over a single content panel with a heading, paragraph, and an
 * 8-item checklist).
 *
 * Demaze has 19 real industries, each with its own real sub-item list
 * (demazetech.com homepage "INDUSTRIES: Industries We Serve"). This tab
 * bar's shape — click a tab, swap the panel below it — is the closest
 * native MOVIQ pattern for that, so it's extended from 4 tabs to 19 rather
 * than building a new component. MOVIQ's own tab-switch logic is React
 * state internal to its compiled bundle and only knows about its original 4
 * panels, so it can't be reused for the other 15; this installs its own
 * capture-phase click handler (stopping propagation before MOVIQ's own
 * handler on the original 4 tabs can swap in MOVIQ's panel content) and
 * rebuilds the panel's heading/checklist directly for whichever industry
 * was clicked. The checklist is rebuilt to the exact sub-item count per
 * industry (8 or 9) rather than truncating/padding to MOVIQ's original
 * fixed 8 slots.
 *
 * See demaze-override-core.js for why this waits/mutates/rechecks the way it does.
 */
(function () {
  var content = window.DEMAZE_CONTENT && window.DEMAZE_CONTENT.industries;
  if (!content || !window.DemazeOverride) return;

  var ACTIVE_COLOR = 'rgb(0, 0, 0)';
  var INACTIVE_COLOR = 'rgb(33, 37, 41)';
  var activeIndex = 0;

  function getSection() {
    var sections = document.querySelectorAll('section[data-framer-name="Tools"]');
    return sections[1] || null;
  }

  function getTabWrap(section) {
    return section.querySelector('[data-framer-name="Tab"]');
  }

  function isHydrated(section) {
    var tabWrap = getTabWrap(section);
    var list = section.querySelector('[data-framer-name="list"]');
    return !!(tabWrap && tabWrap.children.length > 0 && list && list.children.length > 0);
  }

  function ensureTabs(section) {
    var tabWrap = getTabWrap(section);
    if (tabWrap.children.length >= content.items.length) return;
    var template = tabWrap.children[0];
    while (tabWrap.children.length < content.items.length) {
      var clone = template.cloneNode(true);
      var cloneLine = clone.children[1] || clone.querySelector('[style*="linear-gradient"]');
      if (cloneLine) cloneLine.style.opacity = '0';
      tabWrap.appendChild(clone);
    }
  }

  function setTabLabel(tabEl, text) {
    var textNode = tabEl.querySelector('[data-framer-component-type="RichTextContainer"] p') || tabEl.querySelector('p');
    if (textNode) textNode.textContent = text;
  }

  function paintActiveTab(section) {
    var tabWrap = getTabWrap(section);
    Array.prototype.forEach.call(tabWrap.children, function (tabEl, i) {
      var isActive = i === activeIndex;
      var p = tabEl.querySelector('p');
      if (p) {
        p.style.color = isActive ? '#0b0f19' : 'rgb(108, 119, 131)';
        p.style.fontWeight = isActive ? '700' : '500';
        p.style.transition = 'color 0.2s ease, font-weight 0.2s ease';
      }
      var line = tabEl.children[1] || tabEl.querySelector('[style*="linear-gradient"]');
      if (line) {
        line.style.opacity = isActive ? '1' : '0';
        line.style.transition = 'opacity 0.25s ease';
      }
      tabEl.style.cursor = 'pointer';
      tabEl.style.padding = '8px 14px';
      tabEl.style.margin = '2px 4px';
      tabEl.style.borderRadius = '8px';
    });
  }

  function renderPanel(section) {
    var industry = content.items[activeIndex];

    var titleEl = section.querySelector('[data-framer-name="Headings Title"] h4');
    if (titleEl) {
      var span = titleEl.querySelector('span');
      (span || titleEl).textContent = industry.name;
    }

    // No per-industry description or "Style Guide Provided:" label exists
    // for Demaze — hide both rather than inventing filler text.
    var guideLabel = section.querySelector('[data-framer-name="Guide"] > [data-framer-name="Style Guide Provided:"]');
    if (guideLabel) guideLabel.style.display = 'none';
    var panelSubtitle = section.querySelector('[data-framer-name="Headings Title"] p');
    if (panelSubtitle) panelSubtitle.style.display = 'none';

    var list = section.querySelector('[data-framer-name="list"]');
    var template = list.querySelector(':scope > div');
    var existing = Array.prototype.slice.call(list.children);
    industry.subItems.forEach(function (text, i) {
      var item = existing[i];
      if (!item) {
        item = template.cloneNode(true);
        list.appendChild(item);
        existing.push(item);
      }
      item.style.display = '';
      var textEl = item.querySelector('[data-framer-name="Videos per Month Detail"] p') || item.querySelector('p');
      if (textEl) textEl.textContent = text;
    });
    // Hide any leftover slots beyond this industry's real sub-item count.
    for (var j = industry.subItems.length; j < existing.length; j++) {
      existing[j].style.display = 'none';
    }

    // Gentle micro-fade on panel content
    var panel = section.querySelector('[data-framer-name="Text Content"]');
    if (panel) {
      panel.style.transition = 'opacity 0.2s ease, transform 0.2s ease';
      panel.style.opacity = '0.6';
      panel.style.transform = 'translateY(3px)';
      setTimeout(function () {
        panel.style.opacity = '1';
        panel.style.transform = 'translateY(0)';
      }, 50);
    }
  }

  function wireTabClicks(section) {
    var tabWrap = getTabWrap(section);
    if (tabWrap.__demazeWired) return;
    tabWrap.__demazeWired = true;
    tabWrap.addEventListener(
      'click',
      function (event) {
        var tabEl = event.target;
        while (tabEl && tabEl.parentElement !== tabWrap) {
          tabEl = tabEl.parentElement;
        }
        if (!tabEl) return;
        event.stopPropagation();
        event.preventDefault();
        activeIndex = Array.prototype.indexOf.call(tabWrap.children, tabEl);
        paintActiveTab(section);
        renderPanel(section);
      },
      true
    );
  }

  var STYLE_ID = 'demaze-industries-style';

  function ensureStyle() {
    if (document.getElementById(STYLE_ID)) return;
    var style = document.createElement('style');
    style.id = STYLE_ID;
    style.textContent =
      'section[data-framer-name="Tools"]:has([data-framer-name="Tab"]) [data-framer-name="Tab"],' +
      'section.framer-1p5myw3 [data-framer-name="Tab"]{' +
      'display:flex!important;flex-wrap:wrap!important;gap:8px 10px!important;justify-content:center!important;' +
      'padding:16px 0 24px!important;width:100%!important;max-width:1100px!important;margin:0 auto!important;}' +
      'section[data-framer-name="Tools"]:has([data-framer-name="Tab"]) [data-framer-name="Tab"] > div,' +
      'section.framer-1p5myw3 [data-framer-name="Tab"] > div{' +
      'flex:none!important;cursor:pointer!important;user-select:none!important;transition:all 0.2s ease!important;}' +
      'section[data-framer-name="Tools"]:has([data-framer-name="Tab"]) [data-framer-name="Tab"] > div:hover p,' +
      'section.framer-1p5myw3 [data-framer-name="Tab"] > div:hover p{color:#2C53C7!important;}' +
      '@media (max-width:809px){' +
      'section[data-framer-name="Tools"]:has([data-framer-name="Tab"]) [data-framer-name="Tab"],' +
      'section.framer-1p5myw3 [data-framer-name="Tab"]{' +
      'flex-wrap:nowrap!important;overflow-x:auto!important;justify-content:flex-start!important;padding:12px 16px!important;-webkit-overflow-scrolling:touch!important;}' +
      'section[data-framer-name="Tools"]:has([data-framer-name="Tab"]) [data-framer-name="Tab"]::-webkit-scrollbar,' +
      'section.framer-1p5myw3 [data-framer-name="Tab"]::-webkit-scrollbar{display:none!important;}' +
      '}';
    document.head.appendChild(style);
  }

  function applyOverride(section) {
    ensureStyle();
    var titleEl = section.querySelector('[data-framer-name="Title"] h2');
    if (titleEl) {
      var span = titleEl.querySelector('span');
      (span || titleEl).textContent = content.heading;
    }
    var subtitle = section.querySelector('[data-framer-name="Subtitle"]');
    if (subtitle) subtitle.style.display = 'none';

    ensureTabs(section);
    content.items.forEach(function (industry, i) {
      var tabWrap = getTabWrap(section);
      setTabLabel(tabWrap.children[i], industry.name);
    });

    wireTabClicks(section);
    paintActiveTab(section);
    renderPanel(section);
  }

  function verifyStuck(section) {
    var tabWrap = getTabWrap(section);
    var firstTabText = tabWrap.children[0] && tabWrap.children[0].querySelector('p');
    var titleEl = section.querySelector('[data-framer-name="Headings Title"] h4');
    return !!(
      tabWrap.children.length === content.items.length &&
      firstTabText &&
      firstTabText.textContent.trim() === content.items[0].name &&
      titleEl &&
      titleEl.textContent.trim() === content.items[activeIndex].name
    );
  }

  window.DemazeOverride.run({
    getRoot: getSection,
    isHydrated: isHydrated,
    apply: applyOverride,
    verify: verifyStuck,
  });
})();
