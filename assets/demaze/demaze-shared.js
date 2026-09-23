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
      var first = drawer.querySelector('a');
      if (first) first.focus({ preventScroll: true });
    }

    function closeDrawer() {
      var hadFocus = drawer.contains(document.activeElement);
      toggleBtn.classList.remove('active');
      toggleBtn.setAttribute('aria-expanded', 'false');
      drawer.classList.remove('active');
      document.body.style.overflow = '';
      if (hadFocus) toggleBtn.focus({ preventScroll: true });
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

  // 6. One-shot section reveal on subpages (the homepage uses DemazeOverride.reveal).
  function initReveal() {
    if (document.querySelector('[data-framer-name="Main"]')) return;
    if (!('IntersectionObserver' in window) || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (!e.isIntersecting) return;
        e.target.classList.add('is-in');
        io.unobserve(e.target);
      });
    }, { rootMargin: '0px 0px -10% 0px' });
    document.querySelectorAll('body > section, main > section, .demaze-cta-banner').forEach(function (el) {
      if (el.getBoundingClientRect().top < window.innerHeight) return;
      el.classList.add('dz-reveal');
      io.observe(el);
    });
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

      function setActivePillar(targetIndex, isManual) {
        if (targetIndex < 0 || targetIndex >= navItems.length) return;

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
      });

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
    initReveal();
    initTimelineProgress();
    initValistCapabilities();
    initValistFAQ();
    initValistCounters();
    initValistReveals();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initAll);
  } else {
    initAll();
  }
})();

