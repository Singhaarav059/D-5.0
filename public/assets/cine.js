// Home hero opening, drawn entirely in code.
//   0.0s  a single "idea" token lights up          — "Every product starts with a spark."
//   1.3s  capability tokens join and wire together  — "We connect it to intelligence."
//   2.9s  the network folds into a dotted globe     — "And scale it to the world."
//   4.3s  the globe settles as a horizon under the headline and keeps turning.
// site.js decides per session whether the opening plays (data-intro="play") or starts at rest.
// The globe is Three.js; everything before it is DOM + SVG so the type stays crisp.

const cine = document.querySelector('[data-cine]');
const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;

const TOKENS = ['data', 'models', 'agents', 'web', 'mobile', 'cloud', 'design', 'security', 'users', 'scale'];
const CAPTIONS = [
  ['Every product starts with a ', 'spark', '.'],
  ['We connect it to ', 'intelligence', '.'],
  ['And scale it to the ', 'world', '.'],
];
const svgNS = 'http://www.w3.org/2000/svg';
const wait = (ms) => new Promise((r) => setTimeout(r, ms));

// ---------- opening: tokens + attention lines ----------
function caption(el, [a, em, b]) {
  el.classList.remove('is-on');
  setTimeout(() => {
    el.replaceChildren(a, Object.assign(document.createElement('em'), { textContent: em }), b);
    el.classList.add('is-on');
  }, el.textContent ? 380 : 0);
}

async function opening() {
  const box = cine.getBoundingClientRect();
  const W = box.width, H = box.height;
  const cx = W / 2, cy = H * 0.44;
  const rx = Math.min(W * 0.36, 460), ry = Math.min(H * 0.24, 210);
  const tokens = cine.querySelector('[data-tokens]');
  const net = cine.querySelector('[data-net]');
  const cap = cine.querySelector('[data-caption]');
  net.setAttribute('viewBox', `0 0 ${W} ${H}`);

  const token = (text, x, y, cls = '') => {
    const t = document.createElement('span');
    t.className = 'cine__token ' + cls;
    t.textContent = text;
    t.style.setProperty('--x', x + 'px');
    t.style.setProperty('--y', y + 'px');
    tokens.append(t);
    return t;
  };
  const path = (d, cls, delay) => {
    const p = document.createElementNS(svgNS, 'path');
    p.setAttribute('d', d);
    p.setAttribute('class', cls);
    p.setAttribute('pathLength', '1');
    p.style.animationDelay = delay + 'ms';
    net.append(p);
    return p;
  };

  // 1. the spark
  const core = token('idea', cx, cy, 'is-core');
  await wait(60);
  core.classList.add('is-on');
  caption(cap, CAPTIONS[0]);
  await wait(1250);

  // 2. capabilities arrive and wire up: centre → each, then a few links between neighbours
  const pts = TOKENS.map((text, i) => {
    const a = (-90 + (360 / TOKENS.length) * i + 8) * Math.PI / 180;
    const x = cx + Math.cos(a) * rx, y = cy + Math.sin(a) * ry;
    const el = token(text, x, y);
    setTimeout(() => el.classList.add('is-on'), 70 * i);
    return { x, y, el };
  });
  caption(cap, CAPTIONS[1]);
  pts.forEach((p, i) => {
    const mx = (cx + p.x) / 2 + (p.y - cy) * 0.18, my = (cy + p.y) / 2 - (p.x - cx) * 0.18;
    path(`M${cx},${cy} Q${mx},${my} ${p.x},${p.y}`, 'cine__edge', 120 + 70 * i);
  });
  pts.forEach((p, i) => [2, 3].forEach((k) => {
    const q = pts[(i + k) % pts.length];
    path(`M${p.x},${p.y} Q${cx + (p.x + q.x - 2 * cx) * 0.2},${cy + (p.y + q.y - 2 * cy) * 0.2} ${q.x},${q.y}`, 'cine__edge is-faint', 700 + 45 * i);
  }));
  await wait(1600);

  // 3. fold into the globe
  caption(cap, CAPTIONS[2]);
  cine.classList.add('is-folding');
  pts.forEach((p) => { p.el.style.setProperty('--x', cx + 'px'); p.el.style.setProperty('--y', cy + 'px'); });
  await wait(500);
  cine.classList.add('is-globe');
  await wait(1100);

  // 4. rest: the globe glides down to the horizon, captions give way to the headline
  cap.classList.remove('is-on');
  cine.classList.add('is-rest');
  cine.dispatchEvent(new Event('cine:rest')); // site.js brings the headline in now
  await wait(1200);
  tokens.replaceChildren();
  net.replaceChildren();
}

// ---------- globe ----------
function hash(n) { const s = Math.sin(n) * 43758.5453; return s - Math.floor(s); }
function noise3(x, y, z) {
  const X = Math.floor(x), Y = Math.floor(y), Z = Math.floor(z);
  const fx = x - X, fy = y - Y, fz = z - Z;
  const u = fx * fx * (3 - 2 * fx), v = fy * fy * (3 - 2 * fy), w = fz * fz * (3 - 2 * fz);
  const h = (i, j, k) => hash((X + i) * 127.1 + (Y + j) * 311.7 + (Z + k) * 74.7);
  const l = (a, b, t) => a + (b - a) * t;
  return l(l(l(h(0, 0, 0), h(1, 0, 0), u), l(h(0, 1, 0), h(1, 1, 0), u), v),
    l(l(h(0, 0, 1), h(1, 0, 1), u), l(h(0, 1, 1), h(1, 1, 1), u), v), w);
}
// Abstract continents: fBm on the unit sphere, thresholded.
const land = (x, y, z) => {
  let f = 0, a = 0.55, s = 1.6;
  for (let o = 0; o < 4; o++) { f += a * noise3(x * s + 11.3, y * s + 3.7, z * s + 5.1); s *= 2.05; a *= 0.5; }
  return f - Math.abs(y) * 0.12; // thinner near the poles
};

async function globe(host, playIntro) {
  const THREE = await import('./vendor/three/three.module.js');
  const small = matchMedia('(max-width: 860px)').matches;
  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'high-performance' });
  renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
  renderer.outputColorSpace = THREE.LinearSRGBColorSpace;
  host.append(renderer.domElement);

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(30, 1, 0.1, 50);
  camera.position.set(0, 0, 4.9);
  const world = new THREE.Group();
  world.rotation.set(0.38, -0.6, 0.08);
  scene.add(world);

  // Body: a dark sphere that hides the far-side dots, with a soft blue rim.
  world.add(new THREE.Mesh(new THREE.SphereGeometry(0.995, 64, 48), new THREE.ShaderMaterial({
    vertexShader: 'varying vec3 vN; varying vec3 vV; void main(){ vec4 mv = modelViewMatrix * vec4(position,1.); vN = normalize(normalMatrix * normal); vV = normalize(-mv.xyz); gl_Position = projectionMatrix * mv; }',
    fragmentShader: 'varying vec3 vN; varying vec3 vV; void main(){ float f = pow(1. - max(dot(vN, vV), 0.), 2.6); vec3 c = mix(vec3(.02,.025,.07), vec3(.22,.3,.9), f * .55); gl_FragColor = vec4(c, 1.); }',
  })));
  // Atmosphere halo.
  scene.add(new THREE.Mesh(new THREE.SphereGeometry(1.2, 64, 48), new THREE.ShaderMaterial({
    side: THREE.BackSide, transparent: true, depthWrite: false, blending: THREE.AdditiveBlending,
    vertexShader: 'varying vec3 vN; varying vec3 vV; void main(){ vec4 mv = modelViewMatrix * vec4(position,1.); vN = normalize(normalMatrix * normal); vV = normalize(-mv.xyz); gl_Position = projectionMatrix * mv; }',
    fragmentShader: 'varying vec3 vN; varying vec3 vV; void main(){ float f = pow(max(dot(vN, vV), 0.), 3.2); gl_FragColor = vec4(vec3(.3,.42,1.), f * .6); }',
  })));

  // Dots: a Fibonacci sphere, bright on land, sparse and faint over water; a few twinkling "cities".
  const N = small ? 7000 : 14000;
  const pos = [], size = [], bright = [], phase = [];
  const cities = [];
  for (let i = 0; i < N; i++) {
    const y = 1 - (i + 0.5) / N * 2, r = Math.sqrt(1 - y * y), th = i * 2.399963;
    const x = Math.cos(th) * r, z = Math.sin(th) * r;
    const l = land(x, y, z);
    const isLand = l > 0.5;
    if (!isLand && hash(i * 1.7) > 0.16) continue;
    const city = isLand && hash(i * 3.1) > 0.972;
    pos.push(x * 1.002, y * 1.002, z * 1.002);
    size.push(city ? 2.6 : isLand ? 1.35 : 0.9);
    bright.push(city ? 1.8 : isLand ? 0.9 + (l - 0.5) * 1.4 : 0.26);
    phase.push(city ? hash(i) * 6.283 : -1);
    if (city) cities.push(new THREE.Vector3(x, y, z));
  }
  const geo = new THREE.BufferGeometry();
  geo.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3));
  geo.setAttribute('aSize', new THREE.Float32BufferAttribute(size, 1));
  geo.setAttribute('aBright', new THREE.Float32BufferAttribute(bright, 1));
  geo.setAttribute('aPhase', new THREE.Float32BufferAttribute(phase, 1));
  const dotU = { uTime: { value: 0 }, uPx: { value: 1 }, uReveal: { value: playIntro ? 0 : 1 } };
  world.add(new THREE.Points(geo, new THREE.ShaderMaterial({
    uniforms: dotU, transparent: true, depthWrite: false, blending: THREE.AdditiveBlending,
    vertexShader: `attribute float aSize; attribute float aBright; attribute float aPhase;
      uniform float uTime; uniform float uPx; uniform float uReveal; varying float vA; varying float vCity;
      void main(){
        vec4 mv = modelViewMatrix * vec4(position, 1.);
        vec3 n = normalize(normalMatrix * position);
        float facing = smoothstep(-.05, .45, dot(n, normalize(-mv.xyz)));
        float tw = aPhase < 0. ? 1. : .65 + .35 * sin(uTime * 1.6 + aPhase);
        // reveal sweeps from the top of the globe downward during the opening
        float sweep = 1. - smoothstep(uReveal * 3.4 - 1.2, uReveal * 3.4 - .3, 1. - position.y);
        vA = aBright * facing * tw * sweep; vCity = aPhase < 0. ? 0. : 1.;
        gl_PointSize = aSize * uPx * (7.5 / -mv.z);
        gl_Position = projectionMatrix * mv;
      }`,
    fragmentShader: `varying float vA; varying float vCity;
      void main(){
        float d = length(gl_PointCoord - .5);
        float a = (1. - smoothstep(.1, .5, d)) * vA;
        vec3 c = mix(vec3(.55,.65,1.), vec3(1.,.96,.88), vCity);
        gl_FragColor = vec4(c * a, a);
      }`,
  })));

  // Arcs between cities with a pulse of light travelling along each.
  const arcU = { uTime: { value: 0 }, uReveal: dotU.uReveal };
  const arcGeo = new THREE.BufferGeometry();
  const ap = [], at = [], ao = [];
  const ARCS = small ? 12 : 22, SEG = 72;
  for (let k = 0; k < ARCS && cities.length > 2; k++) {
    const a = cities[Math.floor(hash(k * 9.1) * cities.length)];
    const b = cities[Math.floor(hash(k * 5.3 + 1) * cities.length)];
    const dist = a.distanceTo(b);
    if (dist < 0.35 || dist > 1.3) continue;
    const off = hash(k * 2.7);
    for (let s = 0; s < SEG; s++) {
      for (const t of [s / SEG, (s + 1) / SEG]) {
        const p = new THREE.Vector3().copy(a).lerp(b, t).normalize().multiplyScalar(1 + Math.sin(Math.PI * t) * dist * 0.1);
        ap.push(p.x, p.y, p.z); at.push(t); ao.push(off);
      }
    }
  }
  arcGeo.setAttribute('position', new THREE.Float32BufferAttribute(ap, 3));
  arcGeo.setAttribute('aT', new THREE.Float32BufferAttribute(at, 1));
  arcGeo.setAttribute('aOff', new THREE.Float32BufferAttribute(ao, 1));
  world.add(new THREE.LineSegments(arcGeo, new THREE.ShaderMaterial({
    uniforms: arcU, transparent: true, depthWrite: false, blending: THREE.AdditiveBlending,
    vertexShader: 'attribute float aT; attribute float aOff; varying float vT; varying float vOff; void main(){ vT = aT; vOff = aOff; gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.); }',
    fragmentShader: `uniform float uTime; uniform float uReveal; varying float vT; varying float vOff;
      void main(){
        float head = fract(uTime * .16 + vOff) * 1.6 - .3;
        float pulse = (1. - smoothstep(0., .22, abs(vT - head))) * step(vT, head + .02);
        float a = (.05 + pulse * .9) * smoothstep(.6, 1., uReveal);
        gl_FragColor = vec4(vec3(.62,.72,1.) * a, a);
      }`,
  })));

  const resize = () => {
    const s = host.clientWidth;
    renderer.setSize(s, s, false);
    dotU.uPx.value = renderer.getPixelRatio() * Math.max(1, s / 700);
  };
  resize();
  new ResizeObserver(resize).observe(host);

  const tilt = { x: 0, y: 0, tx: 0, ty: 0 };
  if (!reduced && matchMedia('(hover: hover) and (pointer: fine)').matches) {
    addEventListener('pointermove', (e) => { tilt.tx = (e.clientX / innerWidth - 0.5) * 0.25; tilt.ty = (e.clientY / innerHeight - 0.5) * 0.12; }, { passive: true });
  }

  let time = 0, last = 0, raf = 0, onScreen = true, revealFrom = null;
  const draw = () => {
    world.rotation.y = -0.6 + time * 0.045 + tilt.x;
    world.rotation.x = 0.38 + tilt.y;
    dotU.uTime.value = arcU.uTime.value = time;
    renderer.render(scene, camera);
  };
  const tick = (now) => {
    raf = requestAnimationFrame(tick);
    const dt = last ? Math.min(0.05, (now - last) / 1000) : 0;
    last = now; time += dt;
    tilt.x += (tilt.tx - tilt.x) * 0.04; tilt.y += (tilt.ty - tilt.y) * 0.04;
    if (revealFrom !== null) dotU.uReveal.value = Math.min(1, (time - revealFrom) / 1.8);
    draw();
  };
  const play = () => { if (!raf && onScreen && !document.hidden && !reduced) { last = 0; raf = requestAnimationFrame(tick); } };
  const stop = () => { cancelAnimationFrame(raf); raf = 0; };
  new IntersectionObserver(([e]) => { onScreen = e.isIntersecting; onScreen ? play() : stop(); }).observe(host);
  document.addEventListener('visibilitychange', () => (document.hidden ? stop() : play()));
  draw();
  play();
  cine.classList.add('has-globe');
  return { reveal: () => { revealFrom = time; if (reduced) { dotU.uReveal.value = 1; draw(); } } };
}

// ---------- run ----------
async function run() {
  // site.js runs first and sets data-intro; default to rest if it never did.
  const play = cine.dataset.intro === 'play' && !reduced;
  cine.classList.add(play ? 'is-playing' : 'is-rest');
  const host = cine.querySelector('[data-globe]');
  const g = globe(host, play).catch(() => null); // no WebGL2: the glow and copy carry the hero
  if (!play) { const G = await g; if (G) G.reveal(); return; }
  // Opened in a background tab: hold the opening until it can actually be seen.
  if (document.hidden) await new Promise((r) => document.addEventListener('visibilitychange', r, { once: true }));
  const seq = opening();
  // start drawing the globe as the network folds (2.9s in), whether or not three.js has arrived yet
  await wait(3300);
  const G = await g;
  if (G) G.reveal();
  await seq;
}

if (cine) run();
