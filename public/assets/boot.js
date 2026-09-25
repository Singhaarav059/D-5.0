'use strict';

(() => {
  const root = document.documentElement;
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  root.classList.add(reduced ? 'rm' : 'motion', 'js');
  window.setTimeout(() => {
    if (!window.gsap) root.classList.remove('js');
  }, 4000);
})();
