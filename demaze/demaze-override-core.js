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
          // A stale root from a mid-swap DOM (e.g. a section whose subtree
          // Framer is actively replacing) shouldn't take down other
          // sections' independent recheck timers.
          try {
            var root = getRoot();
            if (root && !verify(root)) {
              apply(root);
            }
          } catch (e) {
            /* swallow — next scheduled recheck (or this section's own
               longer-term fix, if it has one) will retry */
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

    if (document.readyState === 'complete') {
      tick();
    } else {
      window.addEventListener('load', tick);
    }
  },
};
