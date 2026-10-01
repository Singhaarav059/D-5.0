'use strict';

// Runs in <head>, before the page paints: decides motion or stillness from the visitor's system setting (reduce
// motion), and whether this is the first page of a visit, which opens with the brand (site.js plays it).
(() => {
  const root = document.documentElement;
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  root.classList.add(reduced ? 'rm' : 'motion', 'js');
  window.setTimeout(() => {
    if (!window.gsap) root.classList.remove('js');
  }, 4000);
  // Arriving through the curtain (site.js drew it over the last page): keep it over this one from the first paint, with
  // this page's name on it, until site.js folds it away; never leave the page covered whatever happens to site.js.
  let label = null;
  try { label = sessionStorage.getItem('dmz-curtain'); sessionStorage.removeItem('dmz-curtain'); } catch (e) { /* storage blocked */ }
  if (label && !reduced) {
    root.classList.add('curtain-in');
    root.style.setProperty('--curtain-label', JSON.stringify(label));
    window.setTimeout(() => root.classList.remove('curtain-in'), 3000);
  }
  // The opening plays once a visit, on the first page, and never with reduced motion; CSS takes it down on its own
  // if site.js never runs.
  let seen = true;
  try { seen = !!sessionStorage.getItem('dmz-opening'); sessionStorage.setItem('dmz-opening', '1'); } catch (e) { /* storage blocked: no opening */ }
  if (!seen && !label && !reduced) {
    root.classList.add('intro-on');
    window.setTimeout(() => root.classList.remove('intro-on'), 6000);
  }
})();
