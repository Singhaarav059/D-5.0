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
      tabWrap.appendChild(template.cloneNode(true));
    }
  }

  function setTabLabel(tabEl, text) {
    var textNode = tabEl.querySelector('[data-framer-component-type="RichTextContainer"] p') || tabEl.querySelector('p');
    if (textNode) textNode.textContent = text;
  }

  function paintActiveTab(section) {
    var tabWrap = getTabWrap(section);
    Array.prototype.forEach.call(tabWrap.children, function (tabEl, i) {
      var p = tabEl.querySelector('p');
      if (p) p.style.color = i === activeIndex ? ACTIVE_COLOR : INACTIVE_COLOR;
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
  }

  function wireTabClicks(section) {
    var tabWrap = getTabWrap(section);
    // Guard on the node itself, not a module-level flag — if Framer ever
    // swaps in a fresh Tab wrapper element (confirmed happening for the
    // similar case in the Process section), a flag alone would leave the
    // new live node with no listener at all.
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

  function applyOverride(section) {
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
