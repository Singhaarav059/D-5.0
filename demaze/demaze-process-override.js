/**
 * The Process section (MOVIQ's "Videos making Step" 3-step block) is
 * hidden. Demaze DOES have real process content (demazetech.com homepage
 * "HOW WE WORK: Our Process", 4 steps: Discover & Define / Design &
 * Prototype / Build & Integrate / Launch & Scale) — this isn't a "no
 * content" call like the original hide decision was.
 *
 * It's hidden because un-hiding this specific section is confirmed unsafe
 * on mobile: its cards render inside Framer's own `.ssr-variant` wrapper
 * (an SSR/CSR breakpoint reconciliation marker unique to this section on
 * this page) that redraws itself post-hydration, and at mobile widths that
 * redraw crashes React's reconciler fatally (killing the whole page) some
 * seconds after load. This was tested exhaustively before landing on hide:
 *   - cloning a 4th physical card into the wrapper → crashed on mobile
 *   - nesting a 2nd step's content inside an existing card's leaf (zero new
 *     wrapper children, zero new siblings) → still crashed on mobile
 *   - plain text-only mutation on the 3 existing cards, no insertion
 *     anywhere at all → still crashed on mobile
 *   - this section simply hidden (`display:none`, its very first state) →
 *     zero errors, confirmed with the rest of this project's scripts
 *     enabled and disabled
 * So the crash isn't about *what* gets mutated inside this section — it's
 * un-hiding it at all that conflicts with its own delayed SSR/CSR redraw on
 * mobile. Confirmed absent when every script in this project is disabled,
 * so it's this section's un-hide specifically, not a pre-existing MOVIQ bug.
 *
 * Real Demaze process content (`window.DEMAZE_CONTENT.process`) is still in
 * demaze-content.js for whenever this gets revisited — e.g. if a rebuilt
 * (not un-hidden) process component turns out to be safe, or if Framer ships
 * a build without this reconciliation quirk.
 *
 * See demaze-override-core.js for why this waits/mutates/rechecks the way it does.
 */
(function () {
  if (!window.DemazeOverride) return;

  function getSection() {
    return document.querySelector('section[data-framer-name="Videos making Step"]');
  }

  function isHydrated(section) {
    return !!section.querySelector('h2');
  }

  function applyOverride(section) {
    section.style.display = 'none';
  }

  function verifyStuck(section) {
    return section.style.display === 'none';
  }

  window.DemazeOverride.run({
    getRoot: getSection,
    isHydrated: isHydrated,
    apply: applyOverride,
    verify: verifyStuck,
  });
})();
