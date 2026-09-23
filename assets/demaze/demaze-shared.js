/**
 * Demaze Technologies - Shared Interactive Behaviors (MOVIQ Aligned Backend)
 * Handles:
 * - Lenis smooth inertia scrolling
 * - Moviq-style floating frosted glass navbar pill with smooth hover indicator
 * - Dynamic scroll-linked section unfolding & staggered entrance reveals
 * - Accessible mobile navigation drawer
 * - Interactive single-open accordions
 * - Dynamic copyright year
 */

(function () {
  'use strict';

  // 1. Initialize Lenis Smooth Scrolling
  function initLenis() {
    // If on homepage where Framer's React engine already bundles and controls its own Lenis instance,
    // do NOT instantiate a duplicate instance which would double-hook wheel events and RAF loops.
    var isHomepage = !!(document.querySelector('[data-framer-name="Main"]') || document.querySelector('section[data-framer-name="Hero"]'));
    if (isHomepage) {
      return;
    }

    if (typeof window.Lenis === 'function' && !window.lenis) {
      try {
        document.documentElement.style.setProperty('scroll-behavior', 'auto', 'important');
        document.body.style.setProperty('scroll-behavior', 'auto', 'important');

        window.lenis = new window.Lenis({
          duration: 1.15,
          easing: function (t) {
            return Math.min(1, 1.001 - Math.pow(2, -10 * t));
          },
          orientation: 'vertical',
          gestureOrientation: 'vertical',
          smoothWheel: true,
          wheelMultiplier: 1.0,
          touchMultiplier: 1.5,
          infinite: false,
          autoRaf: true
        });

        try {
          if (sessionStorage.getItem('__demaze_reload') === '1') {
            sessionStorage.removeItem('__demaze_reload');
            window.scrollTo(0, 0);
            window.lenis.scrollTo(0, { immediate: true });
          }
        } catch (_) {}
      } catch (e) {
        console.warn('Lenis init error:', e);
      }
    }
  }

  // 2. Site footer: one canonical markup for every page.
  var FOOTER_HTML =
    '<div class="dz-container">' +
    '  <div class="dz-footer-top">' +
    '    <div class="dz-footer-brand">' +
    '      <a href="/" class="dz-footer-logo"><img src="https://framerusercontent.com/images/g9sZPcgZ3bVZQgiCX8DybKWIy4.png?scale-down-to=512" alt="Demaze Technologies" width="112" height="35" loading="lazy" decoding="async"></a>' +
    '      <p>Demaze Technologies partners with ambitious companies to build scalable digital products, AI systems, and cloud infrastructure with dedicated senior engineering teams.</p>' +
    '    </div>' +
    '    <nav class="dz-footer-cols" aria-label="Footer">' +
    '      <div><h2 data-dz-font>Company</h2><ul><li><a href="/projects">Projects</a></li><li><a href="/services">Services</a></li><li><a href="/about-us">About us</a></li><li><a href="/contact">Contact</a></li></ul></div>' +
    '      <div><h2 data-dz-font>Services</h2><ul><li><a href="/services">AI &amp; Machine Learning</a></li><li><a href="/services">Web, Mobile App &amp; SaaS</a></li><li><a href="/services">Intelligent E-Commerce</a></li><li><a href="/services">Cloud Infrastructure</a></li></ul></div>' +
    '      <div><h2 data-dz-font>Contact</h2><ul><li><a href="mailto:contact@demazetech.com">contact@demazetech.com</a></li><li><a href="/contact">Book a call</a></li><li><address>A 804, Ganesh Glory 11, Jagatpur Road, Near S.G. Highway, Gota, Ahmedabad, India</address></li></ul></div>' +
    '    </nav>' +
    '  </div>' +
    '  <div class="dz-footer-bottom">© ' + new Date().getFullYear() + ' Demaze Technologies. All rights reserved.</div>' +
    '</div>';

  function initFooter() {
    var footer = document.querySelector('footer.demaze-footer');
    if (!footer) {
      // Homepage: mount after Framer's hydration root, outside React's tree.
      var root = document.getElementById('main');
      if (!root) return;
      footer = document.createElement('footer');
      footer.className = 'demaze-footer';
      root.insertAdjacentElement('afterend', footer);
    }
    footer.innerHTML = FOOTER_HTML;
  }

  // 3. Navigation Scroll State & Hover Pill
  function initNav() {
    var navBar = document.querySelector('.demaze-nav-bar');
    if (!navBar || navBar.__demazeScrollAttached) return;
    // Unified nav handles both homepage and subpages

    navBar.__demazeScrollAttached = true;
    var isScrolled = false;
    var scrollTicking = false;

    function onScroll() {
      var y = (window.lenis && typeof window.lenis.scroll === 'number') ? window.lenis.scroll : window.scrollY;
      var shouldBeScrolled = y > 50;
      if (shouldBeScrolled !== isScrolled) {
        isScrolled = shouldBeScrolled;
        navBar.classList.toggle('demaze-nav-scrolled', isScrolled);
      }
    }

    function requestScroll() {
      if (!scrollTicking) {
        scrollTicking = true;
        requestAnimationFrame(function () {
          onScroll();
          scrollTicking = false;
        });
      }
    }

    window.addEventListener('scroll', requestScroll, { passive: true });
    onScroll();

    // Moviq-style hover highlight indicator
    var navMenu = document.querySelector('.demaze-nav-menu');
    if (navMenu && !navMenu.__hoverPillBound) {
      navMenu.__hoverPillBound = true;
      var links = navMenu.querySelectorAll('.demaze-nav-item a');
      links.forEach(function (link) {
        link.addEventListener('mouseenter', function () {
          link.style.transform = 'translateY(-1px)';
        });
        link.addEventListener('mouseleave', function () {
          link.style.transform = '';
        });
      });
    }
  }

  // 4. Mobile Navigation Drawer
  function initMobileNav() {
    var toggleBtn = document.getElementById('demaze-mobile-btn') || document.querySelector('.demaze-mobile-toggle');
    var drawer = document.getElementById('demaze-subpage-drawer') || document.querySelector('.demaze-subpage-drawer');

    if (!toggleBtn || !drawer) return;

    function openDrawer() {
      toggleBtn.classList.add('active');
      toggleBtn.setAttribute('aria-expanded', 'true');
      drawer.classList.add('active');
      document.body.style.overflow = 'hidden';
    }

    function closeDrawer() {
      toggleBtn.classList.remove('active');
      toggleBtn.setAttribute('aria-expanded', 'false');
      drawer.classList.remove('active');
      document.body.style.overflow = '';
    }

    function toggleDrawer(e) {
      e.stopPropagation();
      if (drawer.classList.contains('active')) {
        closeDrawer();
      } else {
        openDrawer();
      }
    }

    toggleBtn.addEventListener('click', toggleDrawer);

    // Close on click outside
    document.addEventListener('click', function (e) {
      if (drawer.classList.contains('active') && !drawer.contains(e.target) && !toggleBtn.contains(e.target)) {
        closeDrawer();
      }
    });

    // Close on Escape key
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && drawer.classList.contains('active')) {
        closeDrawer();
      }
    });

    // Close when clicking any link inside drawer
    drawer.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', function () {
        closeDrawer();
      });
    });
  }

  // 5. Accessible Single-Open Accordions
  function initAccordions() {
    var accordions = document.querySelectorAll('.demaze-accordion, .faq-accordion-container');
    accordions.forEach(function (acc) {
      var items = acc.querySelectorAll('.demaze-accordion-item, .faq-accordion-item');

      items.forEach(function (item) {
        var header = item.querySelector('.demaze-accordion-header, .faq-accordion-header');
        if (!header) return;

        header.setAttribute('role', 'button');
        header.setAttribute('tabindex', '0');
        var isOpen = item.classList.contains('active') || item.classList.contains('open');
        header.setAttribute('aria-expanded', isOpen ? 'true' : 'false');

        function toggleItem() {
          var isCurrentlyOpen = item.classList.contains('active') || item.classList.contains('open');

          // Close other items in the same container (single-open behavior)
          items.forEach(function (other) {
            if (other !== item) {
              other.classList.remove('active', 'open');
              var otherHeader = other.querySelector('.demaze-accordion-header, .faq-accordion-header');
              if (otherHeader) otherHeader.setAttribute('aria-expanded', 'false');
            }
          });

          // Toggle current
          if (isCurrentlyOpen) {
            item.classList.remove('active', 'open');
            header.setAttribute('aria-expanded', 'false');
          } else {
            item.classList.add('active', 'open');
            header.setAttribute('aria-expanded', 'true');
          }
        }

        header.addEventListener('click', toggleItem);
        header.addEventListener('keydown', function (e) {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            toggleItem();
          }
        });
      });
    });
  }

  // 6. Reversible Smooth Scroll Storytelling Engine (Slow Appearance & Disappearance)
  function initUnfolding() {
    // Skip homepage: Framer's React engine manages section appearances and transforms on the homepage.
    // Applying .demaze-scroll-flow with CSS transform transitions creates severe layer thrashing with Framer Motion.
    if (document.querySelector('[data-framer-name="Main"]') || document.querySelector('section[data-framer-name="Hero"]')) {
      return;
    }

    var prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    function getTargets() {
      return document.querySelectorAll(
        '.demaze-subpage-section, .valist-unfold-section, .valist-capabilities-stage, .valist-process-stage, .demaze-industries-stage, .about-bento-grid, .values-grid, .valist-projects-grid, .contact-main-grid, .demaze-contact-grid, .valist-faq-container, .demaze-cta-banner, .valist-showcase-card, .valist-timeline-container'
      );
    }

    if (prefersReduced) {
      getTargets().forEach(function (el) {
        el.classList.add('is-scroll-revealed');
      });
      return;
    }

    function setupChildren(target) {
      if (target.__demazeStaggerSetup) return;
      target.__demazeStaggerSetup = true;

      // Stagger headings
      var headings = target.querySelectorAll('h2, h3, .demaze-section-title, .demaze-ind-heading, .valist-showcase-heading');
      headings.forEach(function (h) {
        h.classList.add('demaze-stagger-item', 'demaze-stagger-1');
      });

      // Stagger subtitles & paragraphs
      var subs = target.querySelectorAll('.demaze-section-subtitle, .demaze-ind-sub, .valist-showcase-desc, .service-row-desc');
      subs.forEach(function (p) {
        p.classList.add('demaze-stagger-item', 'demaze-stagger-2');
      });

      // Stagger cards & items
      var cards = target.querySelectorAll(
        '.valist-stagger-card, .valist-case-card, .project-case-card, .valist-process-card, .valist-metric-counter-card, .value-card, .about-bento-card, .valist-faq-card, .demaze-contact-card, .contact-form-shell, .calendly-embed-box, .service-feature-row, .demaze-ind-row, .partner-logo-item, .framer-1a3b5v'
      );
      cards.forEach(function (card, idx) {
        card.classList.add('demaze-stagger-item');
        card.classList.add('demaze-stagger-' + (Math.min(5, 3 + (idx % 3))));
      });
    }

    var observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          var el = entry.target;
          setupChildren(el);

          if (entry.isIntersecting) {
            // Slow, graceful entrance when scrolling into section
            el.classList.add('is-scroll-revealed');
            el.classList.add('is-unfolded');
            el.classList.remove('is-scroll-exited');

            // Also illuminate any accent highlights
            var highlights = el.querySelectorAll('.demaze-scroll-highlight, .valist-highlight-text');
            highlights.forEach(function (hl) {
              hl.classList.add('is-illuminated');
            });
          } else {
            // Smooth, slow exit when scrolling backwards past element (exiting towards bottom of viewport)
            if (entry.boundingClientRect.top > 0) {
              el.classList.remove('is-scroll-revealed');
              el.classList.add('is-scroll-exited');
            }
          }
        });
      },
      { threshold: [0, 0.08, 0.2], rootMargin: '0px 0px -40px 0px' }
    );

    function attach() {
      var currentTargets = getTargets();
      var winH = window.innerHeight || 800;

      currentTargets.forEach(function (el) {
        // Skip Hero section (must always remain visible at the top)
        if (el.closest('[data-framer-name="Hero"]') || el.classList.contains('demaze-hero-exempt') || el.classList.contains('demaze-subpage-hero')) {
          el.classList.add('is-scroll-revealed');
          return;
        }

        var rect = el.getBoundingClientRect();
        if (rect.width === 0 && rect.height === 0) return;

        el.classList.add('demaze-scroll-flow');
        setupChildren(el);

        // If already visible in current viewport, reveal
        if (rect.top < winH * 0.88 && rect.bottom > 0) {
          el.classList.add('is-scroll-revealed');
          el.classList.remove('is-scroll-exited');
        }

        if (!el.__demazeFlowObserved) {
          el.__demazeFlowObserved = true;
          observer.observe(el);
        }
      });
    }

    attach();

    // Recheck after DOM mutations or post-hydration
    var pollCount = 0;
    var attachInterval = setInterval(function () {
      pollCount++;
      attach();
      if (pollCount >= 5) {
        clearInterval(attachInterval);
      }
    }, 300);

    // Only re-check on resize or DOM layout changes - IntersectionObserver handles scroll reveals off the main thread
    window.addEventListener('resize', attach, { passive: true });
  }

  // 6b. Dynamic Mission Timeline Progress Drawing
  function initTimelineProgress() {
    var timeline = document.querySelector('.valist-timeline-container');
    if (!timeline || timeline.__valistTimelineInit) return;
    timeline.__valistTimelineInit = true;

    // Ensure progress bar element exists
    var bar = timeline.querySelector('.valist-timeline-progress-bar');
    if (!bar) {
      bar = document.createElement('div');
      bar.className = 'valist-timeline-progress-bar';
      timeline.prepend(bar);
    }

    var nodes = timeline.querySelectorAll('.valist-timeline-node');

    function onTimelineScroll() {
      var rect = timeline.getBoundingClientRect();
      var winH = window.innerHeight;
      var triggerPoint = winH * 0.65;
      var totalH = rect.height;
      var current = triggerPoint - rect.top;
      var progress = Math.max(0, Math.min(1, current / totalH));

      bar.style.transform = 'scaleY(' + progress + ')';

      nodes.forEach(function (node) {
        var nodeRect = node.getBoundingClientRect();
        if (nodeRect.top <= triggerPoint) {
          node.classList.add('is-passed');
        } else {
          node.classList.remove('is-passed');
        }
      });
    }

    var isTimelineVisible = false;
    if ('IntersectionObserver' in window) {
      var tObs = new IntersectionObserver(function (entries) {
        isTimelineVisible = entries[0].isIntersecting;
      }, { rootMargin: '100px 0px 100px 0px' });
      tObs.observe(timeline);
    } else {
      isTimelineVisible = true;
    }

    var timelineTicking = false;
    function requestTimelineScroll() {
      if (!isTimelineVisible) return;
      if (!timelineTicking) {
        timelineTicking = true;
        requestAnimationFrame(function () {
          onTimelineScroll();
          timelineTicking = false;
        });
      }
    }

    window.addEventListener('scroll', requestTimelineScroll, { passive: true });
    onTimelineScroll();
  }

  // 7. Valist Capabilities Unfolding Stage (Services)
  function initValistCapabilities() {
    var stages = document.querySelectorAll('.valist-capabilities-stage');
    stages.forEach(function (stage) {
      var navItems = stage.querySelectorAll('.valist-capability-nav-item');
      var panes = stage.querySelectorAll('.valist-showcase-pane');

      if (!navItems.length || !panes.length) return;

      var currentIndex = 0;
      var manualOverrideUntil = 0;

      function setActivePillar(targetIndex, isManual) {
        if (targetIndex < 0 || targetIndex >= navItems.length) return;
        currentIndex = targetIndex;
        if (isManual) {
          manualOverrideUntil = Date.now() + 4000;
        }

        navItems.forEach(function (btn, idx) {
          var isActive = idx === targetIndex;
          btn.classList.toggle('active', isActive);
          btn.setAttribute('aria-selected', isActive ? 'true' : 'false');
        });

        panes.forEach(function (pane, idx) {
          var isActive = idx === targetIndex;
          pane.classList.toggle('active', isActive);
        });
      }

      navItems.forEach(function (btn, idx) {
        btn.addEventListener('click', function () {
          setActivePillar(idx, true);
        });

        btn.addEventListener('mouseenter', function () {
          if (!btn.classList.contains('active')) {
            var titleEl = btn.querySelector('.nav-item-title');
            if (titleEl) titleEl.style.transform = 'translateX(2px)';
          }
        });

        btn.addEventListener('mouseleave', function () {
          if (!btn.classList.contains('active')) {
            var titleEl = btn.querySelector('.nav-item-title');
            if (titleEl) titleEl.style.transform = '';
          }
        });
      });

      // Scroll-driven auto-switching through the 4 capability pillars
      function handleScrollSwitch() {
        if (window.innerWidth < 992) return;
        if (Date.now() < manualOverrideUntil) return;

        var rect = stage.getBoundingClientRect();
        var totalDist = stage.offsetHeight - window.innerHeight;
        if (totalDist <= 0) return;

        var pinTop = 120;
        var scrollPassed = pinTop - rect.top;
        var progress = scrollPassed / totalDist;
        progress = Math.max(0, Math.min(1, progress));

        var targetIndex = 0;
        if (progress < 0.25) {
          targetIndex = 0;
        } else if (progress < 0.50) {
          targetIndex = 1;
        } else if (progress < 0.75) {
          targetIndex = 2;
        } else {
          targetIndex = 3;
        }

        if (targetIndex !== currentIndex) {
          setActivePillar(targetIndex, false);
        }
      }

      var isStageVisible = false;
      if ('IntersectionObserver' in window) {
        var sObs = new IntersectionObserver(function (entries) {
          isStageVisible = entries[0].isIntersecting;
        }, { rootMargin: '100px 0px 100px 0px' });
        sObs.observe(stage);
      } else {
        isStageVisible = true;
      }

      var capTicking = false;
      function requestScrollSwitch() {
        if (!isStageVisible) return;
        if (!capTicking) {
          capTicking = true;
          requestAnimationFrame(function () {
            handleScrollSwitch();
            capTicking = false;
          });
        }
      }

      window.addEventListener('scroll', requestScrollSwitch, { passive: true });
      handleScrollSwitch();
    });
  }

  // 8. Valist FAQ Accordion (Clean Rounded Cards with Purple Circle Toggle)
  function initValistFAQ() {
    var faqCards = document.querySelectorAll('.valist-faq-card');
    faqCards.forEach(function (card) {
      var header = card.querySelector('.valist-faq-header');
      if (!header || header.__valistBound) return;
      header.__valistBound = true;

      header.addEventListener('click', function () {
        var isOpen = card.classList.contains('open');

        // Single open: close siblings
        faqCards.forEach(function (other) {
          if (other !== card) {
            other.classList.remove('open');
          }
        });

        card.classList.toggle('open', !isOpen);
      });
    });
  }

  // 9. Valist Metric Counters Animation
  function initValistCounters() {
    var counterEls = document.querySelectorAll('.valist-counter-number[data-target]');
    if (!counterEls.length) return;

    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          var el = entry.target;
          var targetVal = parseInt(el.getAttribute('data-target'), 10);
          var prefix = el.getAttribute('data-prefix') || '';
          var suffix = el.getAttribute('data-suffix') || '';
          var duration = 1600;
          var start = 0;
          var startTime = null;

          function animateCounter(timestamp) {
            if (!startTime) startTime = timestamp;
            var progress = Math.min((timestamp - startTime) / duration, 1);
            // Ease-out expo
            var currentVal = Math.floor((1 - Math.pow(2, -10 * progress)) * targetVal);
            el.textContent = prefix + currentVal + suffix;
            if (progress < 1) {
              requestAnimationFrame(animateCounter);
            } else {
              el.textContent = prefix + targetVal + suffix;
            }
          }

          requestAnimationFrame(animateCounter);
          observer.unobserve(el);
        }
      });
    }, { threshold: 0.2 });

    counterEls.forEach(function (el) {
      observer.observe(el);
    });
  }

  // 10. Valist Scroll-Scrubbed Text Reveal
  function initValistScrollScrub() {
    var scrubContainers = document.querySelectorAll('.valist-scroll-scrub-text');
    scrubContainers.forEach(function (el) {
      if (el.__valistScrubInit) return;
      el.__valistScrubInit = true;

      var text = el.textContent.trim();
      var words = text.split(/\s+/);
      el.innerHTML = words.map(function (w) {
        return '<span class="word">' + w + '</span>';
      }).join(' ');

      var wordSpans = el.querySelectorAll('.word');

      function updateScrub() {
        var rect = el.getBoundingClientRect();
        var winH = window.innerHeight;
        // Progress through the viewport
        var startY = winH * 0.85;
        var endY = winH * 0.25;
        var totalDist = startY - endY;
        var current = startY - rect.top;
        var progress = Math.max(0, Math.min(1, current / totalDist));

        var litCount = Math.floor(progress * wordSpans.length);
        wordSpans.forEach(function (span, i) {
          span.classList.toggle('is-lit', i <= litCount);
        });
      }

      var isScrubVisible = false;
      if ('IntersectionObserver' in window) {
        var scrubObs = new IntersectionObserver(function (entries) {
          isScrubVisible = entries[0].isIntersecting;
        }, { rootMargin: '100px 0px 100px 0px' });
        scrubObs.observe(el);
      } else {
        isScrubVisible = true;
      }

      var scrubTicking = false;
      function requestScrub() {
        if (!isScrubVisible) return;
        if (!scrubTicking) {
          scrubTicking = true;
          requestAnimationFrame(function () {
            updateScrub();
            scrubTicking = false;
          });
        }
      }

      window.addEventListener('scroll', requestScrub, { passive: true });
      updateScrub();
    });
  }

  // 11. Valist Reveal Animations
  function initValistReveals() {
    var revealItems = document.querySelectorAll('.valist-reveal, .valist-case-card, .valist-process-card, .valist-metric-counter-card');
    if (!revealItems.length) return;

    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.08, rootMargin: '0px 0px -30px 0px' });

    revealItems.forEach(function (item, idx) {
      var stagger = (idx % 2) * 0.1;
      item.style.transitionDelay = stagger + 's';
      observer.observe(item);
    });
  }

  // Run on DOM ready
  function initAll() {
    initLenis();
    initFooter();
    initNav();
    initMobileNav();
    initAccordions();
    initUnfolding();
    initTimelineProgress();
    initValistCapabilities();
    initValistFAQ();
    initValistCounters();
    initValistScrollScrub();
    initValistReveals();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initAll);
  } else {
    initAll();
  }
})();

