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
      } catch (e) {
        console.warn('Lenis init error:', e);
      }
    }
  }

  // 2. Dynamic Footer Year
  function initFooterYear() {
    var yearEls = document.querySelectorAll('.demaze-footer-year, #footerYear');
    var currentYear = new Date().getFullYear();
    yearEls.forEach(function (el) {
      el.textContent = currentYear;
    });
  }

  // 3. Navigation Scroll State & Hover Pill
  function initNav() {
    var navBar = document.querySelector('.demaze-nav-bar');
    if (!navBar || navBar.__demazeScrollAttached) return;
    // On homepage, demaze-branding-override.js handles the header scroll state
    if (document.querySelector('section[data-framer-name="Hero"]')) return;

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

  // 6. Valist Signature Section Unfolding & Cascading Motion Engine
  function initUnfolding() {
    var prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    function getSections() {
      return document.querySelectorAll(
        '.valist-unfold-section, .demaze-subpage-section, .valist-capabilities-stage, .valist-process-stage, .valist-metric-counters-grid, .valist-timeline-container, .about-bento-grid, .values-grid, .industries-shell, .valist-faq-container, .demaze-cta-banner, .demaze-contact-grid, .contact-main-grid, .valist-projects-grid, main > section:not([data-framer-name="Hero"]), [data-framer-name="Main"] > section:not([data-framer-name="Hero"])'
      );
    }

    if (prefersReduced || !('IntersectionObserver' in window)) {
      getSections().forEach(function (el) {
        el.classList.add('is-unfolded');
      });
      return;
    }

    function unfoldTarget(target) {
      if (target.classList.contains('is-unfolded')) return;
      target.classList.add('is-unfolded');

      // Stagger all child cards inside the newly unfolded section
      var cards = target.querySelectorAll(
        '.valist-stagger-card, .valist-case-card, .project-case-card, .valist-process-card, .valist-metric-counter-card, .value-card, .about-bento-card, .service-feature-row, .valist-faq-card, .demaze-contact-card, .calendly-embed-box, .contact-form-shell, [data-framer-name*="Card"], [data-framer-name*="Item"], [data-framer-name*="Row"], .framer-1a3b5v'
      );
      cards.forEach(function (card, idx) {
        card.style.transitionDelay = (0.06 * (idx % 8)) + 's';
      });

      // Illuminate any accent highlights inside the section
      var highlights = target.querySelectorAll('.demaze-scroll-highlight');
      highlights.forEach(function (hl) {
        hl.classList.add('is-illuminated');
      });
    }

    var observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            unfoldTarget(entry.target);
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.05, rootMargin: '0px 0px -20px 0px' }
    );

    function attachObservers() {
      // If page is gated (like on homepage prepaint gate), wait until demaze-ready is applied
      var isGated = document.documentElement.matches(':not(.demaze-ready)') && document.getElementById('demaze-prepaint-gate');
      if (isGated) return;

      var currentTargets = getSections();
      var winH = window.innerHeight || 800;

      currentTargets.forEach(function (el) {
        var rect = el.getBoundingClientRect();
        // Skip hidden 0-dimension placeholders
        if (rect.width === 0 && rect.height === 0) return;

        // If element is already scrolled past or visible in the current viewport, unfold immediately
        if (rect.top < winH * 0.88 && rect.bottom > 0) {
          unfoldTarget(el);
          return;
        }

        if (!el.__valistObserved) {
          el.__valistObserved = true;
          observer.observe(el);
        }
      });
    }

    // Run initial attach
    attachObservers();

    // Listen for readiness gate on homepage
    if (window.MutationObserver) {
      var gateObserver = new MutationObserver(function () {
        if (document.documentElement.classList.contains('demaze-ready')) {
          attachObservers();
          gateObserver.disconnect();
        }
      });
      gateObserver.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });
    }

    // Periodic check to bind any post-hydrated React sections smoothly
    var polls = 0;
    var pollTimer = setInterval(function () {
      polls++;
      attachObservers();
      if (polls > 20) clearInterval(pollTimer);
    }, 250);

    // Also attach on scroll
    window.addEventListener('scroll', attachObservers, { passive: true });
    if (window.lenis && typeof window.lenis.on === 'function') {
      window.lenis.on('scroll', attachObservers);
    }
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

    window.addEventListener('scroll', onTimelineScroll, { passive: true });
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
          manualOverrideUntil = Date.now() + 2500;
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

        var topOffset = 130;
        var progress = (-rect.top + topOffset) / totalDist;

        if (progress >= 0 && progress <= 1) {
          var targetIndex = Math.min(3, Math.max(0, Math.floor(progress * 4)));
          if (targetIndex !== currentIndex) {
            setActivePillar(targetIndex, false);
          }
        }
      }

      window.addEventListener('scroll', handleScrollSwitch, { passive: true });
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

      window.addEventListener('scroll', updateScrub, { passive: true });
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
    initFooterYear();
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

