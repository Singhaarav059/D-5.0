// Product tours: a short camera move over each project's real screens (project cards, home deck, case dialog).
// Every tour speaks the same way: from the whole screen the camera travels to three places, a blue marker lands on
// the thing that matters there and a caption names it (src/content.js `tour`), then it pulls back and loops. The
// screens differ from project to project, so the tours do too; the grammar never changes.
// Only one tour plays at a time: the one under the mouse (it keeps playing after the pointer leaves, until another
// is hovered or it scrolls away), otherwise the one in the middle of the screen (the topmost there, so the home deck
// plays the card on top). The rest rest on the full screenshot. With reduced motion, no GSAP or no JavaScript the
// screenshot simply stays as it is.
(() => {
  'use strict';
  const root = document.documentElement;
  if (!root.classList.contains('motion') || !window.gsap || matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  const MOVE = 1.3, HOLD = 2.5, LEAD = 0.5; // seconds: camera travel, time at each stop, pause on the whole screen

  const hosts = new Set();
  let picked = null, active = null, raf = 0;
  const choose = () => {
    raf = 0;
    const scope = document.querySelector('dialog[open]');
    const pool = [...hosts].filter((h) => h.tour.visible && (!scope || scope.contains(h)));
    let next = pool.includes(picked) ? picked : null;
    if (!next) {
      const cx = innerWidth / 2, cy = innerHeight / 2;
      const top = document.elementFromPoint(cx, cy)?.closest('.has-tour');
      if (pool.includes(top)) next = top;
      else {
        let best = Infinity;
        pool.forEach((h) => {
          const b = h.getBoundingClientRect();
          const d = Math.hypot(b.left + b.width / 2 - cx, b.top + b.height / 2 - cy);
          if (d < best) { best = d; next = h; }
        });
      }
    }
    if (next === active) return;
    const prev = active;
    active = next;
    prev?.tour?.sync();
    active?.tour?.sync();
  };
  const queue = () => { raf ||= requestAnimationFrame(choose); };
  addEventListener('scroll', queue, { passive: true });
  addEventListener('resize', queue);

  function build(host) {
    const img = host.querySelector('img');
    if (!img) return null;
    const stops = JSON.parse(host.dataset.tour);
    const pad = (n) => String(n).padStart(2, '0');

    // Overlay: the marker, the caption, a hairline for the loop and a pause button.
    const ui = document.createElement('div');
    ui.className = 'tour';
    ui.setAttribute('aria-hidden', 'true');
    ui.innerHTML = '<i class="tour__mark"><i></i></i><p class="tour__cap"><b></b><span></span></p><i class="tour__bar"><i></i></i>';
    const toggle = document.createElement('button');
    toggle.type = 'button';
    toggle.className = 'tour__toggle';
    toggle.setAttribute('aria-label', 'Pause the product tour');
    host.append(ui, toggle);
    host.classList.add('has-tour');
    const mark = ui.querySelector('.tour__mark'), dot = mark.firstChild, cap = ui.querySelector('.tour__cap'), bar = ui.querySelector('.tour__bar i');
    const [num, text] = cap.children;

    // The camera: which point of the screenshot is centred, and how close. The picture is drawn with
    // object-fit: contain, so work in the drawn picture's own box and keep the frame inside it once it fills it.
    const cam = { x: 0.5, y: 0.5, z: 1 };
    const apply = () => {
      const w = img.clientWidth, h = img.clientHeight;
      if (!w || !h || !img.naturalWidth) return;
      const a = img.naturalWidth / img.naturalHeight;
      const dw = w / h > a ? h * a : w, dh = w / h > a ? h : w / a;
      const ox = (w - dw) / 2, oy = (h - dh) / 2, z = cam.z;
      const px = ox + cam.x * dw, py = oy + cam.y * dh;
      const fit = (t, lo, hi, size) => (hi - lo >= size ? Math.min(-lo, Math.max(size - hi, t)) : (size - (hi - lo)) / 2 - lo);
      const tx = fit(w / 2 - px * z, ox * z, (ox + dw) * z, w);
      const ty = fit(h / 2 - py * z, oy * z, (oy + dh) * z, h);
      img.style.transform = `translate(${tx.toFixed(1)}px, ${ty.toFixed(1)}px) scale(${z.toFixed(4)})`;
      mark.style.transform = `translate(${(img.offsetLeft + px * z + tx).toFixed(1)}px, ${(img.offsetTop + py * z + ty).toFixed(1)}px)`;
    };
    const say = (i) => {
      num.textContent = `${pad(i + 1)} / ${pad(stops.length)}`;
      text.textContent = stops[i][3];
      gsap.fromTo(cap, { opacity: 0, y: 8 }, { opacity: 1, y: 0, duration: 0.45, ease: 'power3.out', overwrite: true });
    };
    const hush = () => gsap.to(cap, { opacity: 0, y: 4, duration: 0.3, ease: 'power2.in', overwrite: true });

    const tl = gsap.timeline({ repeat: -1, paused: true, onUpdate: () => bar.style.setProperty('--p', tl.progress().toFixed(4)) });
    tl.set(cam, { x: 0.5, y: 0.5, z: 1, onComplete: apply }, 0).set(dot, { opacity: 0, scale: 0.4 }, 0);
    let t = LEAD;
    stops.forEach(([x, y, z], i) => {
      tl.to(cam, { x, y, z, duration: MOVE, ease: 'power3.inOut', onUpdate: apply }, t)
        .call(say, [i], t + MOVE - 0.35)
        .to(dot, { opacity: 1, scale: 1, duration: 0.45, ease: 'back.out(2.2)' }, t + MOVE - 0.1)
        .to(dot, { opacity: 0, scale: 0.6, duration: 0.25, ease: 'power2.in' }, t + MOVE + HOLD - 0.3);
      t += MOVE + HOLD;
    });
    tl.to(cam, { x: 0.5, y: 0.5, z: 1, duration: MOVE, ease: 'power3.inOut', onUpdate: apply }, t)
      .call(hush, null, t)
      .set({}, {}, t + MOVE + LEAD);

    // Resting: the whole screenshot, nothing over it.
    let userPaused = false, visible = false, resting = true;
    const rest = () => { tl.pause(0); gsap.set(cap, { opacity: 0 }); gsap.set(dot, { opacity: 0 }); Object.assign(cam, { x: 0.5, y: 0.5, z: 1 }); apply(); resting = true; };
    // Ask for the sharpest file the first time a tour plays: the camera goes in up to about 2.6x.
    const sharpen = () => { host.querySelectorAll('source, img').forEach((el) => el.sizes && (el.sizes = '1600px')); };
    const sync = () => {
      const mine = active === host;
      const run = visible && mine && !userPaused && !document.hidden;
      if (run) {
        sharpen();
        if (resting) { resting = false; tl.play(0); } else tl.play();
      } else if (!mine && !resting) rest();
      else tl.pause();
      host.classList.toggle('is-touring', run || (mine && userPaused));
      toggle.classList.toggle('is-paused', userPaused);
    };
    toggle.addEventListener('click', (e) => {
      e.stopPropagation();
      userPaused = !userPaused;
      toggle.setAttribute('aria-label', userPaused ? 'Play the product tour' : 'Pause the product tour');
      sync();
    });
    host.addEventListener('pointerenter', (e) => { if (e.pointerType === 'mouse') { picked = host; queue(); } });
    const io = new IntersectionObserver(([e]) => { visible = e.isIntersecting; host.tour.visible = visible; queue(); sync(); }, { threshold: 0.35 });
    const ro = new ResizeObserver(apply);
    const vis = () => sync();
    document.addEventListener('visibilitychange', vis);
    if (!img.complete) img.addEventListener('load', apply, { once: true });

    host.tour = {
      tl, visible, sync,
      destroy() {
        hosts.delete(host);
        if (picked === host) picked = null;
        if (active === host) active = null;
        queue();
        tl.kill(); io.disconnect(); ro.disconnect();
        document.removeEventListener('visibilitychange', vis);
        ui.remove(); toggle.remove(); img.style.transform = '';
        host.classList.remove('has-tour', 'is-touring'); delete host.tour;
      },
    };
    hosts.add(host);
    io.observe(host);
    ro.observe(img);
    rest();
    return host.tour;
  }

  // Tours on the page (projects grid, home deck); the case dialog mounts its own with window.Tour.mount(figure).
  window.Tour = { mount: (host) => host.tour || build(host) };
  document.querySelectorAll('[data-tour]').forEach((h) => { if (!h.closest('template')) build(h); });
})();
