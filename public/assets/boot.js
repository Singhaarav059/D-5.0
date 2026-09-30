'use strict';

// Runs in <head>, before the page paints: decides motion or stillness for everything else, from the visitor's system
// setting (reduce motion); and when the visitor arrives through the curtain (site.js drew it over the last page),
// keeps it over this one from the first paint, with the page's name on it, until site.js lifts it.
(() => {
  const root = document.documentElement;
  try { localStorage.removeItem('demaze-motion'); } catch {} // (the old on-page switch's saved choice, now retired)
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  root.classList.add(reduced ? 'rm' : 'motion', 'js');
  let label = null;
  try { label = sessionStorage.getItem('dmz-curtain'); sessionStorage.removeItem('dmz-curtain'); } catch {}
  if (label && !reduced) {
    root.classList.add('curtain-in');
    root.style.setProperty('--curtain-label', JSON.stringify(label));
    // never leave the page covered, whatever happens to site.js
    window.setTimeout(() => root.classList.remove('curtain-in'), 3000);
  }
  // The opening plays once a visit, on the first page, and never with reduced motion or when arriving through the
  // curtain; site.js plays it and lifts it (and CSS bails out on its own if site.js never runs).
  let seen = true;
  try { seen = !!sessionStorage.getItem('dmz-intro'); sessionStorage.setItem('dmz-intro', '1'); } catch {}
  if (!seen && !label && !reduced) {
    root.classList.add('intro-on');
    window.setTimeout(() => root.classList.remove('intro-on'), 6000);
  }
})();
