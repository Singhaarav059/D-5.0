/**
 * Demaze Technologies - Shared Interactive Behaviors (Phase 1: Foundation)
 * Handles:
 * - Dynamic copyright year
 * - Nav scroll states (transparent/glass over hero -> solid frosted on scroll)
 * - Accessible mobile navigation drawer
 * - Interactive single-open accordions
 * - IntersectionObserver reveal wrapper with prefers-reduced-motion fallback
 */

(function () {
  'use strict';

  // 1. Dynamic Footer Year
  function initFooterYear() {
    var yearEls = document.querySelectorAll('.demaze-footer-year, #footerYear');
    var currentYear = new Date().getFullYear();
    yearEls.forEach(function (el) {
      el.textContent = currentYear;
    });
  }

  // 2. Navigation Scroll State
  function initNavScroll() {
    var navBar = document.querySelector('.demaze-nav-bar');
    if (!navBar) return;

    function onScroll() {
      if (window.scrollY > 40) {
        navBar.classList.add('demaze-nav-scrolled');
      } else {
        navBar.classList.remove('demaze-nav-scrolled');
      }
    }

    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  // 3. Mobile Navigation Drawer
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

  // 4. Accessible Single-Open Accordions
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

  // 5. Reveal Animation Observer with prefers-reduced-motion check
  function initReveals() {
    var prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    var revealEls = document.querySelectorAll('.demaze-reveal');

    if (prefersReduced) {
      revealEls.forEach(function (el) {
        el.classList.add('demaze-revealed');
      });
      return;
    }

    if (!('IntersectionObserver' in window)) {
      revealEls.forEach(function (el) {
        el.classList.add('demaze-revealed');
      });
      return;
    }

    var observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add('demaze-revealed');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
    );

    revealEls.forEach(function (el) {
      observer.observe(el);
    });
  }

  // Run on DOM ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function () {
      initFooterYear();
      initNavScroll();
      initMobileNav();
      initAccordions();
      initReveals();
    });
  } else {
    initFooterYear();
    initNavScroll();
    initMobileNav();
    initAccordions();
    initReveals();
  }
})();
