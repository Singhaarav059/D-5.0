/**
 * Shared plumbing for post-hydration content overrides.
 *
 * The Framer runtime hydrates this page client-side and discards any
 * server-rendered text that doesn't match its compiled component tree. Each
 * section's override script waits for its root node to hydrate, mutates the
 * existing DOM in place (never replacing/removing nodes React owns), then
 * re-checks a fixed number of times in case Framer swaps in a different
 * responsive-variant subtree shortly after. No MutationObserver, no
 * setInterval, no unbounded loop - every run terminates on its own.
 */
window.DemazeOverride = {
  run: function (options) {
    var getRoot = options.getRoot;
    var isHydrated = options.isHydrated;
    var apply = options.apply;
    var verify = options.verify;
    var maxAttempts = options.maxAttempts || 30; // ~3s at 100ms
    var pollMs = options.pollMs || 100;
    var recheckDelaysMs = options.recheckDelaysMs || [300, 800, 1500, 3000, 5000];
    var attempts = 0;

    var task = {
      getRoot: getRoot,
      isHydrated: isHydrated,
      apply: apply,
      verify: verify,
      isVerified: function () {
        try {
          var root = getRoot();
          return !root || verify(root);
        } catch (e) {
          return false;
        }
      }
    };
    window.DemazeOverride.tasks.push(task);

    function scheduleRechecks() {
      recheckDelaysMs.forEach(function (delay) {
        setTimeout(function () {
          try {
            var root = getRoot();
            if (root && !verify(root)) {
              apply(root);
            }
          } catch (e) {
            /* swallow - next scheduled recheck will retry */
          }
          window.DemazeOverride.checkReadiness();
        }, delay);
      });
    }

    function tick() {
      attempts++;
      var root = getRoot();
      if (root && isHydrated(root)) {
        apply(root);
        scheduleRechecks();
        window.DemazeOverride.checkReadiness();
        return;
      }
      if (attempts < maxAttempts) {
        setTimeout(tick, pollMs);
      }
    }

    // Start polling immediately! Do NOT wait for window.onload, which blocks on slow network images
    tick();
    if (document.readyState !== 'complete') {
      window.addEventListener('DOMContentLoaded', tick);
      window.addEventListener('load', tick);
    }
  },

  tasks: [],

  // One-shot entrance for [data-dz-reveal] children of root; never re-hides on scroll back.
  reveal: function (root) {
    if (!('IntersectionObserver' in window) || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    var items = root.querySelectorAll('[data-dz-reveal]');
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (!e.isIntersecting) return;
        e.target.classList.add('is-in');
        io.unobserve(e.target);
      });
    }, { rootMargin: '0px 0px -10% 0px' });
    items.forEach(function (el) {
      if (el.getBoundingClientRect().top < window.innerHeight) return;
      el.style.setProperty('--dz-delay', (el.getAttribute('data-dz-reveal') || 0) + 'ms');
      el.classList.add('dz-reveal');
      io.observe(el);
    });
  },

  checkReadiness: function () {
    if (document.documentElement.classList.contains('demaze-ready')) return;

    var main = document.querySelector('[data-framer-name="Main"]') || document.querySelector('main');
    var isReactHydrated = !!(main && Object.keys(main).some(function (k) {
      return k.indexOf('__react') === 0;
    }));

    var tasks = window.DemazeOverride.tasks;
    var allTasksPass = tasks.length >= 10 && tasks.every(function (t) {
      return t.isVerified();
    });

    if ((isReactHydrated || document.readyState === 'complete') && allTasksPass) {
      window.DemazeOverride.markReady();
    }
  },

  markReady: function () {
    if (window.__demazeReadyTimer) clearTimeout(window.__demazeReadyTimer);
    document.documentElement.classList.add('demaze-ready');
  },
};

// Lightweight coordinator to unveil the moment React hydrates and all tasks pass
(function () {
  var coordinatorTimer = setInterval(function () {
    if (document.documentElement.classList.contains('demaze-ready')) {
      clearInterval(coordinatorTimer);
      return;
    }
    window.DemazeOverride.checkReadiness();
  }, 120);

  // Safety fallback after 2200ms
  setTimeout(function () {
    clearInterval(coordinatorTimer);
    window.DemazeOverride.markReady();
  }, 2200);
})();

// Enforce Section Order across Framer's Main flex container
(function () {
  var STYLE_ID = 'demaze-global-layout-order';
  if (document.getElementById(STYLE_ID)) return;
  var style = document.createElement('style');
  style.id = STYLE_ID;
  style.textContent =
    '[data-framer-name="Main"] {' +
    '  display: flex !important;' +
    '  flex-direction: column !important;' +
    '}' +
    '/* 1. Hero */' +
    '[data-framer-name="Main"] > section[data-framer-name="Hero"] { order: 1 !important; }' +
    '/* 2. Technology Stack */' +
    '[data-framer-name="Main"] > section[data-framer-name="Badge"] { order: 2 !important; }' +
    '/* 3. Featured Work (TASK 1: Moved directly after Tech Stack) */' +
    '[data-framer-name="Main"] > section[data-framer-name="Sricpt"] { order: 3 !important; }' +
    '/* 4. Core Capabilities (TASK 2: Placed after Featured Work) */' +
    '[data-framer-name="Main"] > section.framer-1e6ypd3,' +
    '[data-framer-name="Main"] > section[data-framer-name="Tools"]:has([data-framer-name="Grid"]) { order: 4 !important; }' +
    '/* 5. How We Work (TASK 3: Placed after Core Capabilities) */' +
    '[data-framer-name="Main"] > section[data-framer-name="Videos making Step"] { order: 5 !important; }' +
    '/* 6. Industries We Serve (TASK 6: Interactive sector mechanism) */' +
    '[data-framer-name="Main"] > section.framer-1p5myw3,' +
    '[data-framer-name="Main"] > section[data-framer-name="Tools"]:has([data-framer-name="Tab"]) { order: 6 !important; }' +
    '/* 7. About / Why Demaze (TASK 4 & 5: Consolidated Who We Are + Why Choose Us + What Drives Us differentiators) */' +
    '[data-framer-name="Main"] > section[data-framer-name="Why Demaze vs Traditional"],' +
    '[data-framer-name="Main"] > section[data-framer-name="Moviq vs Traditional Video"] { order: 7 !important; }' +
    '/* 8. FAQ (TASK 7: FAQ placed before Contact) */' +
    '[data-framer-name="Main"] > section[data-framer-name="Faq"] { order: 8 !important; }' +
    '/* 9. Contact (TASK 7: Placed after FAQ) */' +
    '[data-framer-name="Main"] > section.framer-1uf6wvw,' +
    '[data-framer-name="Main"] > section[data-framer-name="CTA"]:has(#demaze-contact-block) { order: 9 !important; }' +
    '/* Hide consolidated / redundant standalone sections */' +
    '[data-framer-name="Main"] > section[data-framer-name="Products"],' +
    '[data-framer-name="Main"] > section[data-framer-name="Ai Powered"],' +
    '[data-framer-name="Main"] > section[data-framer-name="CTA"]:not(:has(#demaze-contact-block)),' +
    '[data-framer-name="Main"] > section[data-framer-name="Pricing"] {' +
    '  display: none !important;' +
    '}';
  if (document.head) {
    document.head.appendChild(style);
  } else {
    document.addEventListener('DOMContentLoaded', function () {
      document.head.appendChild(style);
    });
  }
})();
