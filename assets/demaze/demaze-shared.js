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

  // 6. Moviq-Style Section Unfolding & Entrance Animation Observer
  function initUnfolding() {
    var prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    var targets = document.querySelectorAll(
      '.project-case-card, .service-feature-row, .why-benefit-card, .stat-metric-card, .about-who-grid, .contact-info-card, .contact-form-container, .demaze-reveal, .demaze-unfold'
    );

    if (prefersReduced) {
      targets.forEach(function (el) {
        el.classList.add('is-unfolded');
      });
      return;
    }

    if (!('IntersectionObserver' in window)) {
      targets.forEach(function (el) {
        el.classList.add('is-unfolded');
      });
      return;
    }

    // Set initial unfold class
    targets.forEach(function (el, idx) {
      el.classList.add('demaze-unfold');
      // Stagger slight transition delay within clusters
      var stagger = (idx % 3) * 0.08;
      el.style.transitionDelay = stagger + 's';
    });

    var observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-unfolded');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.05, rootMargin: '0px 0px -40px 0px' }
    );

    targets.forEach(function (el) {
      observer.observe(el);
    });
  }

  // 7. Valist Capabilities Unfolding Stage (Services)
  function initValistCapabilities() {
    var stages = document.querySelectorAll('.valist-capabilities-stage');
    stages.forEach(function (stage) {
      var navItems = stage.querySelectorAll('.valist-capability-nav-item');
      var panes = stage.querySelectorAll('.valist-showcase-pane');

      if (!navItems.length || !panes.length) return;

      function setActivePillar(targetIndex) {
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
          setActivePillar(idx);
        });

        btn.addEventListener('mouseenter', function () {
          // Subtle focus on hover
          if (!btn.classList.contains('active')) {
            btn.querySelector('.nav-item-title').style.transform = 'translateX(2px)';
          }
        });

        btn.addEventListener('mouseleave', function () {
          if (!btn.classList.contains('active')) {
            btn.querySelector('.nav-item-title').style.transform = '';
          }
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

