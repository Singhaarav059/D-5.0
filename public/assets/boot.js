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
  // The opening plays once a visit, on the first page, and never with reduced motion; CSS takes it down on its own
  // if site.js never runs.
  let seen = true;
  try { seen = !!sessionStorage.getItem('dmz-opening'); sessionStorage.setItem('dmz-opening', '1'); } catch (e) { /* storage blocked: no opening */ }
  if (!seen && !reduced) {
    root.classList.add('intro-on');
    window.setTimeout(() => root.classList.remove('intro-on'), 6000);
  }
})();
