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

  var INDUSTRY_IMAGES = {
    'Healthcare': 'https://framerusercontent.com/images/VsL7mX1NiP3eW5xTBH6fPjjVFfw.png?width=3924&height=3500',
    'Automotive': 'https://framerusercontent.com/images/bVi4OWXFwyZEQNbjP5qntMAjM.png?width=3924&height=3500',
    'Legal & Professional Services': 'https://framerusercontent.com/images/jHPfuoOX9UNd8Es5s5F3M8wzzo.png?width=4872&height=2740',
    'Retail': 'https://framerusercontent.com/images/kl6BbE7vPzKmqIbeDQ2Qi0qBgrw.png?width=2198&height=1650',
    'Ecommerce': 'https://framerusercontent.com/images/K9H6ej2APXMnI3TZXYvyYkXZtJQ.png?width=1962&height=1750',
    'Fintech': 'https://framerusercontent.com/images/n2k5j6C5nfmufhjsYnF8HXy5qY.png?width=4096&height=4096',
    'Logistics': 'https://framerusercontent.com/images/d6j0sZ9K35yv7jK9Z2lJ98c0dY.png?width=4096&height=4096',
    'Insurance': '/assets/demaze/cloud_scale_graphic_1789813631564.jpg',
    'SaaS Products': '/assets/demaze/eng_ownership_graphic_1789813608834.jpg',
  };

  function paintActiveTab(section) {
    var tabWrap = getTabWrap(section);
    if (tabWrap) {
      tabWrap.style.setProperty('display', 'flex', 'important');
      tabWrap.style.setProperty('flex-wrap', 'wrap', 'important');
      tabWrap.style.setProperty('gap', '10px 12px', 'important');
      tabWrap.style.setProperty('justify-content', 'center', 'important');
      tabWrap.style.setProperty('max-width', '1120px', 'important');
      tabWrap.style.setProperty('margin', '0 auto 36px', 'important');
      tabWrap.style.setProperty('width', '100%', 'important');
      tabWrap.style.setProperty('height', 'auto', 'important');
    }
    Array.prototype.forEach.call(tabWrap.children, function (tabEl, i) {
      var isActive = i === activeIndex;
      var p = tabEl.querySelector('p');
      if (p) {
        p.style.color = isActive ? '#5B4FE9' : '#3F4454';
        p.style.fontWeight = isActive ? '600' : '500';
        p.style.fontSize = '14px';
        p.style.margin = '0';
        p.style.transition = 'color 0.2s ease';
      }
      var line = tabEl.children[1] || tabEl.querySelector('[style*="linear-gradient"]');
      if (line) {
        line.style.display = 'none'; // purge inconsistent gradient underlines
      }
      tabEl.style.cursor = 'pointer';
      tabEl.style.height = '38px';
      tabEl.style.display = 'inline-flex';
      tabEl.style.alignItems = 'center';
      tabEl.style.justifyContent = 'center';
      tabEl.style.padding = '0 16px';
      tabEl.style.margin = '0';
      tabEl.style.whiteSpace = 'nowrap';
      tabEl.style.borderRadius = '999px';
      tabEl.style.border = isActive ? '1px solid #5B4FE9' : '1px solid #E7E7F3';
      tabEl.style.background = isActive ? '#F0EEFF' : '#FFFFFF';
      tabEl.style.boxShadow = isActive ? '0 4px 12px rgba(91,79,233,0.15)' : 'none';
      tabEl.style.transition = 'all 0.2s ease';
      tabEl.setAttribute('role', 'tab');
      tabEl.setAttribute('aria-selected', isActive ? 'true' : 'false');
      tabEl.setAttribute('tabindex', isActive ? '0' : '-1');
    });
  }

  function renderPanel(section) {
    var industry = content.items[activeIndex];

    var titleEl = section.querySelector('[data-framer-name="Headings Title"] h4');
    if (titleEl) {
      var span = titleEl.querySelector('span');
      (span || titleEl).textContent = industry.name;
    }

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
    for (var j = industry.subItems.length; j < existing.length; j++) {
      existing[j].style.display = 'none';
    }

    // Update panel visual
    var panelImgs = section.querySelectorAll('img');
    var mainPanelImg = panelImgs[panelImgs.length - 1];
    if (mainPanelImg) {
      var targetImg = INDUSTRY_IMAGES[industry.name] || '/assets/demaze/ai_execution_graphic_1789813451769.jpg';
      mainPanelImg.src = targetImg;
      mainPanelImg.style.borderRadius = '20px';
      mainPanelImg.style.objectFit = 'cover';
    }

    var panel = section.querySelector('[data-framer-name="Text Content"]');
    if (panel) {
      panel.style.transition = 'transform 0.2s ease';
      panel.style.opacity = '1';
      panel.style.transform = 'translateY(2px)';
      setTimeout(function () {
        panel.style.transform = 'translateY(0)';
      }, 40);
    }
  }

  var hoverTimer = null;
  function wireTabClicks(section) {
    var tabWrap = getTabWrap(section);
    if (tabWrap.__demazeWired) return;
    tabWrap.__demazeWired = true;
    tabWrap.setAttribute('role', 'tablist');

    function selectTab(tabEl) {
      if (!tabEl) return;
      activeIndex = Array.prototype.indexOf.call(tabWrap.children, tabEl);
      paintActiveTab(section);
      renderPanel(section);
    }

    tabWrap.addEventListener('click', function (event) {
      var tabEl = event.target;
      while (tabEl && tabEl.parentElement !== tabWrap) {
        tabEl = tabEl.parentElement;
      }
      if (!tabEl) return;
      event.stopPropagation();
      event.preventDefault();
      selectTab(tabEl);
    }, true);

    // Desktop hover intent delay (120ms)
    tabWrap.addEventListener('mouseover', function (event) {
      var tabEl = event.target;
      while (tabEl && tabEl.parentElement !== tabWrap) {
        tabEl = tabEl.parentElement;
      }
      if (!tabEl) return;
      clearTimeout(hoverTimer);
      hoverTimer = setTimeout(function () {
        selectTab(tabEl);
      }, 120);
    });

    tabWrap.addEventListener('mouseout', function () {
      clearTimeout(hoverTimer);
    });

    // Keyboard arrow navigation
    tabWrap.addEventListener('keydown', function (event) {
      if (event.key === 'ArrowRight' || event.key === 'ArrowDown') {
        event.preventDefault();
        activeIndex = (activeIndex + 1) % content.items.length;
        paintActiveTab(section);
        renderPanel(section);
        tabWrap.children[activeIndex].focus();
      } else if (event.key === 'ArrowLeft' || event.key === 'ArrowUp') {
        event.preventDefault();
        activeIndex = (activeIndex - 1 + content.items.length) % content.items.length;
        paintActiveTab(section);
        renderPanel(section);
        tabWrap.children[activeIndex].focus();
      }
    });
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
