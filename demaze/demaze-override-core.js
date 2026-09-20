/**
 * Shared plumbing for post-hydration content overrides.
 *
 * The Framer runtime hydrates this page client-side and discards any
 * server-rendered text that doesn't match its compiled component tree. Each
 * section's override script waits for its root node to hydrate, mutates the
 * existing DOM in place (never replacing/removing nodes React owns), then
 * re-checks a fixed number of times in case Framer swaps in a different
 * responsive-variant subtree shortly after. No MutationObserver, no
 * setInterval, no unbounded loop — every run terminates on its own.
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

    function scheduleRechecks() {
      recheckDelaysMs.forEach(function (delay) {
        setTimeout(function () {
          try {
            var root = getRoot();
            if (root && !verify(root)) {
              apply(root);
            }
          } catch (e) {
            /* swallow — next scheduled recheck will retry */
          }
        }, delay);
      });
    }

    function tick() {
      attempts++;
      var root = getRoot();
      if (root && isHydrated(root)) {
        apply(root);
        scheduleRechecks();
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
  markReady: function () {
    if (window.__demazeReadyTimer) clearTimeout(window.__demazeReadyTimer);
    document.documentElement.classList.add('demaze-ready');
  },
};

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
    '/* 2. Technology Stack / Trust */' +
    '[data-framer-name="Main"] > section[data-framer-name="Badge"] { order: 2 !important; }' +
    '/* 3. Our Process */' +
    '[data-framer-name="Main"] > section[data-framer-name="Videos making Step"] { order: 3 !important; }' +
    '/* 4. Featured Projects */' +
    '[data-framer-name="Main"] > section[data-framer-name="Sricpt"] { order: 4 !important; }' +
    '/* 5. Core Capabilities */' +
    '[data-framer-name="Main"] > section.framer-1e6ypd3,' +
    '[data-framer-name="Main"] > section[data-framer-name="Tools"]:has([data-framer-name="Grid"]) { order: 5 !important; }' +
    '/* 6. Who We Are + Founder */' +
    '[data-framer-name="Main"] > section[data-framer-name="Products"] { order: 6 !important; }' +
    '/* 7. Industries We Serve */' +
    '[data-framer-name="Main"] > section.framer-1p5myw3,' +
    '[data-framer-name="Main"] > section[data-framer-name="Tools"]:has([data-framer-name="Tab"]) { order: 7 !important; }' +
    '/* 8. What Drives Us */' +
    '[data-framer-name="Main"] > section[data-framer-name="Ai Powered"] { order: 8 !important; }' +
    '/* 9. Why Demaze + Metrics */' +
    '[data-framer-name="Main"] > section[data-framer-name="Moviq vs Traditional Video"] { order: 9 !important; }' +
    '/* 10. Final CTA */' +
    '[data-framer-name="Main"] > section[data-framer-name="CTA"] { order: 10 !important; }' +
    '/* 11. FAQ */' +
    '[data-framer-name="Main"] > section[data-framer-name="Faq"] { order: 11 !important; }';
  if (document.head) {
    document.head.appendChild(style);
  } else {
    document.addEventListener('DOMContentLoaded', function () {
      document.head.appendChild(style);
    });
  }
})();
