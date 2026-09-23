/**
 * Shared behaviour for every page: Lenis on subpages (the homepage uses
 * Framer's), the canonical footer, nav scroll state, the mobile drawer and a
 * one-shot section reveal on subpages.
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

  // Run on DOM ready
  function initAll() {
    initLenis();
    initFooter();
    initNav();
    initMobileNav();
    initReveal();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initAll);
  } else {
    initAll();
  }
})();

