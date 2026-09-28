'use strict';

// Runs in <head>, before the page paints: decides motion or stillness for everything else. The visitor's own choice
// (the "Motion" switch in the footer and menu, saved in this browser) wins over the system setting.
(() => {
  const root = document.documentElement;
  let pref = null;
  try { pref = localStorage.getItem('demaze-motion'); } catch {}
  const reduced = pref === 'off' || (pref !== 'on' && window.matchMedia('(prefers-reduced-motion: reduce)').matches);
  root.classList.add(reduced ? 'rm' : 'motion', 'js');
  window.setTimeout(() => {
    if (!window.gsap) root.classList.remove('js');
  }, 4000);

  // Page-to-page transitions: none when still; and a transition the browser skips (a hidden tab, a fast second
  // click) is not an error.
  const settle = (vt) => { if (!vt) return; if (reduced) vt.skipTransition(); [vt.ready, vt.finished, vt.updateCallbackDone].forEach((p) => p && p.catch(() => {})); };
  window.addEventListener('pageswap', (e) => settle(e.viewTransition));
  window.addEventListener('pagereveal', (e) => settle(e.viewTransition));
})();
