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
    if (!navBar) return;

    function onScroll() {
      var y = (window.lenis && typeof window.lenis.scroll === 'number') ? window.lenis.scroll : window.scrollY;
      if (y > 40) {
        navBar.classList.add('demaze-nav-scrolled');
      } else {
        navBar.classList.remove('demaze-nav-scrolled');
      }
    }

    window.addEventListener('scroll', onScroll, { passive: true });
    if (window.lenis && typeof window.lenis.on === 'function') {
      window.lenis.on('scroll', onScroll);
    }
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

    // Safety fallback: ensure all content becomes visible after page loads
    setTimeout(function () {
      targets.forEach(function (el) {
        el.classList.add('is-unfolded');
      });
    }, 1500);
  }

  // Run on DOM ready
  function initAll() {
    initLenis();
    initFooterYear();
    initNav();
    initMobileNav();
    initAccordions();
    initUnfolding();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initAll);
  } else {
    initAll();
  }
})();
