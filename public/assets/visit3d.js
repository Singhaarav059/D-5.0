// Contact page: the office card as a small 3D diorama of Gota, Ahmedabad: S.G. Highway, Jagatpur Road,
// a lit office tower under a floating pin, traffic, and the route in. Stylised, not to scale.
// The SVG map in the same card is the fallback: it stays until this has drawn a frame (and for good
// if WebGL or the module is unavailable). Loads only when the card nears the viewport.

const card = document.querySelector('[data-visit3d]');
const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;

// World units, x = east, z = south. The highway leans slightly; Jagatpur Road runs east off it.
const hwyX = (z) => -9 - z * 0.08;
const jrZ = (x) => 0.6 + (x - hwyX(0.6)) * 0.06;
const OFFICE = { x: 5, z: -1.6, w: 3, h: 7.5 };
const PARKS = [{ x: 18, z: -15, w: 11, d: 9 }, { x: -25, z: 13, w: 9, d: 7 }];

let seed = 11;
const rand = () => ((seed = (seed * 16807) % 2147483647) - 1) / 2147483646;

if (card) {
  new IntersectionObserver((entries, io) => {
    if (!entries[0].isIntersecting) return;
    io.disconnect();
    init().catch((e) => console.warn('visit3d:', e)); // any failure leaves the SVG map in place
  }, { rootMargin: '300px' }).observe(card);
}

const FOG_VERT = `
#include <fog_pars_vertex>`;

async function init() {
  const THREE = await import('./vendor/three/three.module.js');
  const host = card.querySelector('.visit3d');
  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'low-power' });
  renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
  host.append(renderer.domElement);

  const BG = new THREE.Color('#0a0d20');
  const scene = new THREE.Scene();
  scene.fog = new THREE.Fog(BG, 30, 66);
  const camera = new THREE.PerspectiveCamera(32, 1.6, 0.5, 200);
  const target = new THREE.Vector3(OFFICE.x - 1.5, 4.5, OFFICE.z + 1.5);
  const U = (extra) => THREE.UniformsUtils.merge([THREE.UniformsLib.fog, extra]);
  const time = { value: 0 };

  // ---------- ground: dark plate, side-street grid, glow and a scan ripple around the office ----------
  const ground = new THREE.Mesh(new THREE.PlaneGeometry(200, 200).rotateX(-Math.PI / 2), new THREE.ShaderMaterial({
    fog: true,
    uniforms: U({ uOffice: { value: new THREE.Vector2(OFFICE.x, OFFICE.z) } }),
    vertexShader: `varying vec3 vW;${FOG_VERT}
      void main() { vec4 w = modelMatrix * vec4(position, 1.0); vW = w.xyz; vec4 mvPosition = viewMatrix * w; gl_Position = projectionMatrix * mvPosition;
      #include <fog_vertex>
      }`,
    fragmentShader: `uniform vec2 uOffice; uniform float uTime; varying vec3 vW;
      #include <fog_pars_fragment>
      void main() {
        vec2 p = vW.xz / 5.0;
        vec2 g = abs(fract(p) - 0.5) / fwidth(p);
        float line = 1.0 - min(min(g.x, g.y) / 6.0, 1.0);
        float d = distance(vW.xz, uOffice);
        float r = mod(uTime * 5.0, 36.0);
        float wave = exp(-abs(d - r) * 1.2) * (1.0 - r / 36.0);
        vec3 col = vec3(0.035, 0.045, 0.11) + line * vec3(0.05, 0.06, 0.13);
        col += vec3(0.12, 0.16, 0.5) * (exp(-d * 0.14) * 0.5 + wave * 0.35);
        gl_FragColor = vec4(col, 1.0);
        #include <fog_fragment>
      }`,
  }));
  ground.material.uniforms.uTime = time;
  scene.add(ground);

  // ---------- roads ----------
  const roadMat = (len, width, dashed) => new THREE.ShaderMaterial({
    fog: true,
    uniforms: U({ uLen: { value: len }, uW: { value: width }, uDash: { value: dashed ? 1 : 0 } }),
    vertexShader: `varying vec2 vUv;${FOG_VERT}
      void main() { vUv = uv; vec4 mvPosition = modelViewMatrix * vec4(position, 1.0); gl_Position = projectionMatrix * mvPosition;
      #include <fog_vertex>
      }`,
    fragmentShader: `uniform float uLen, uW, uDash; varying vec2 vUv;
      #include <fog_pars_fragment>
      void main() {
        float x = vUv.x * uW, y = vUv.y * uLen;
        vec3 col = vec3(0.09, 0.11, 0.25);
        float edge = step(x, 0.1) + step(uW - 0.1, x);
        float centre = step(abs(x - uW * 0.5), 0.05) * step(0.5, fract(y / 1.4));
        float lanes = uDash * step(abs(abs(x - uW * 0.5) - uW * 0.25), 0.03) * step(0.6, fract(y / 1.4));
        col += vec3(0.35, 0.4, 0.7) * clamp(edge, 0.0, 1.0) * 0.6 + vec3(0.8, 0.8, 0.9) * (centre * 0.5 + lanes * 0.3);
        gl_FragColor = vec4(col, 1.0);
        #include <fog_fragment>
      }`,
  });
  const road = (ax, az, bx, bz, width, dashed) => {
    const len = Math.hypot(bx - ax, bz - az);
    const m = new THREE.Mesh(new THREE.PlaneGeometry(width, len).rotateX(-Math.PI / 2), roadMat(len, width, dashed));
    m.position.set((ax + bx) / 2, 0.02, (az + bz) / 2);
    m.rotation.y = Math.atan2(bx - ax, bz - az);
    scene.add(m);
    return m.rotation.y;
  };
  const HWY_W = 4, JR_W = 2.4;
  const hwyYaw = road(hwyX(-80), -80, hwyX(80), 80, HWY_W, true);
  const jrX0 = hwyX(0.6) + HWY_W / 2;
  const jrYaw = road(jrX0, jrZ(jrX0), 80, jrZ(80), JR_W, false);

  // ---------- city blocks: instanced boxes with a window shader ----------
  const lots = [];
  const inPark = (x, z, m) => PARKS.some((p) => Math.abs(x - p.x) < p.w / 2 + m && Math.abs(z - p.z) < p.d / 2 + m);
  for (let gx = -45; gx <= 45; gx += 5) {
    for (let gz = -45; gz <= 45; gz += 5) {
      if (Math.abs(gx - hwyX(gz)) < 4.6) continue;
      if (gx > hwyX(gz) && Math.abs(gz - jrZ(gx)) < 3.6) continue;
      if (Math.abs(gx - OFFICE.x) < 4.5 && Math.abs(gz - OFFICE.z) < 4) continue;
      if (inPark(gx, gz, 1.5) || Math.hypot(gx - OFFICE.x, gz - OFFICE.z) > 48) continue;
      const near = Math.max(0, 1 - Math.abs(gx - hwyX(gz)) / 14);
      const tall = () => 0.8 + Math.pow(rand(), 2.2) * 6 + near * rand() * 4;
      if (rand() > 0.62) {
        const d = 3.4 * (0.8 + rand() * 0.2);
        lots.push([gx - 0.95, gz, 1.6, d, tall()], [gx + 0.95, gz, 1.6, d, tall()]);
      } else {
        lots.push([gx + (rand() - 0.5) * 0.6, gz + (rand() - 0.5) * 0.6, 2.4 + rand() * 1.2, 2.4 + rand() * 1.2, tall()]);
      }
    }
  }
  const box = new THREE.BoxGeometry(1, 1, 1).translate(0, 0.5, 0);
  const towerMat = (base, top, lit, lit2, on) => new THREE.ShaderMaterial({
    fog: true,
    uniforms: U({ uBase: { value: new THREE.Color(base) }, uTop: { value: new THREE.Color(top) }, uLit: { value: new THREE.Color(lit) }, uLit2: { value: new THREE.Color(lit2) }, uOn: { value: on } }),
    vertexShader: `attribute float aSeed; varying vec3 vW, vN; varying float vH, vSeed;${FOG_VERT}
      void main() {
        vec4 w = modelMatrix * instanceMatrix * vec4(position, 1.0);
        vW = w.xyz; vN = normal; vH = instanceMatrix[1][1]; vSeed = aSeed;
        vec4 mvPosition = viewMatrix * w; gl_Position = projectionMatrix * mvPosition;
        #include <fog_vertex>
      }`,
    fragmentShader: `uniform vec3 uBase, uTop, uLit, uLit2; uniform float uOn; varying vec3 vW, vN; varying float vH, vSeed;
      #include <fog_pars_fragment>
      float hash(vec2 p) { return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
      void main() {
        vec3 col = uTop;
        if (vN.y < 0.5) {
          float y = vW.y;
          col = mix(uBase * 0.7, uBase * 1.7, y / max(vH, 0.001));
          float u = abs(vN.x) > 0.5 ? vW.z : vW.x;
          vec2 cell = floor(vec2(u / 0.5, y / 0.55));
          vec2 f = fract(vec2(u / 0.5, y / 0.55));
          float win = step(0.25, f.x) * step(f.x, 0.75) * step(0.3, f.y) * step(f.y, 0.72) * step(0.45, y) * step(y, vH - 0.2);
          float on = step(uOn, hash(cell + vSeed * 7.13));
          vec3 lit = mix(uLit, uLit2, step(0.55, hash(cell.yx + vSeed)));
          col = mix(col, lit, win * on * 0.9) + win * (1.0 - on) * 0.025;
          col += smoothstep(vH - 0.1, vH, y) * vec3(0.25, 0.3, 0.55);
        }
        gl_FragColor = vec4(col, 1.0);
        #include <fog_fragment>
      }`,
  });
  const instanced = (items, mat) => {
    const mesh = new THREE.InstancedMesh(box, mat, items.length);
    const o = new THREE.Object3D();
    items.forEach(([x, z, w, d, h], i) => { o.position.set(x, 0, z); o.scale.set(w, h, d); o.updateMatrix(); mesh.setMatrixAt(i, o.matrix); });
    mesh.geometry = box.clone();
    mesh.geometry.setAttribute('aSeed', new THREE.InstancedBufferAttribute(new Float32Array(items.map(() => rand() * 100)), 1));
    scene.add(mesh);
    return mesh;
  };
  instanced(lots, towerMat('#131a3d', '#1b2350', '#ffd9a0', '#9fb4ff', 0.66));
  instanced([[OFFICE.x, OFFICE.z, OFFICE.w, OFFICE.w, OFFICE.h]], towerMat('#1f33a8', '#4c66ff', '#ffffff', '#b9c6ff', 0.3));
  const edges = new THREE.LineSegments(new THREE.EdgesGeometry(new THREE.BoxGeometry(OFFICE.w, OFFICE.h, OFFICE.w)), new THREE.LineBasicMaterial({ color: '#9fb2ff', transparent: true, opacity: 0.8 }));
  edges.position.set(OFFICE.x, OFFICE.h / 2, OFFICE.z);
  scene.add(edges);

  // ---------- parks ----------
  const trees = [];
  for (const p of PARKS) {
    const lawn = new THREE.Mesh(new THREE.PlaneGeometry(p.w, p.d).rotateX(-Math.PI / 2), new THREE.MeshBasicMaterial({ color: '#0d2b25' }));
    lawn.position.set(p.x, 0.03, p.z);
    scene.add(lawn);
    for (let i = 0; i < (p.w * p.d) / 3.2; i++) trees.push([p.x + (rand() - 0.5) * (p.w - 1), p.z + (rand() - 0.5) * (p.d - 1), 0.6 + rand() * 0.6]);
  }
  const treeMesh = new THREE.InstancedMesh(new THREE.ConeGeometry(0.45, 1.2, 6).translate(0, 0.6, 0), new THREE.MeshBasicMaterial({ color: '#ffffff' }), trees.length);
  const o = new THREE.Object3D(), c = new THREE.Color();
  trees.forEach(([x, z, s], i) => {
    o.position.set(x, 0, z); o.scale.setScalar(s); o.updateMatrix(); treeMesh.setMatrixAt(i, o.matrix);
    treeMesh.setColorAt(i, c.setHSL(0.43 + rand() * 0.05, 0.55, 0.16 + rand() * 0.08));
  });
  scene.add(treeMesh);

  // ---------- the route in: down the highway, east on Jagatpur Road, up to the door ----------
  const route = [[hwyX(-60) + 0.9, -60], [hwyX(0.2) + 0.9, 0.2], [OFFICE.x, jrZ(OFFICE.x) - 0.5], [OFFICE.x, OFFICE.z + OFFICE.w / 2 + 0.1]];
  const pos = [], dist = [];
  let run = 0;
  for (let i = 0; i < route.length - 1; i++) {
    const [ax, az] = route[i], [bx, bz] = route[i + 1];
    const len = Math.hypot(bx - ax, bz - az), nx = -(bz - az) / len * 0.24, nz = (bx - ax) / len * 0.24;
    const quad = [[ax - nx, az - nz, run], [ax + nx, az + nz, run], [bx + nx, bz + nz, run + len], [bx - nx, bz - nz, run + len]];
    for (const k of [0, 1, 2, 0, 2, 3]) { pos.push(quad[k][0], 0.06, quad[k][1]); dist.push(quad[k][2]); }
    run += len;
  }
  const routeGeo = new THREE.BufferGeometry();
  routeGeo.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3));
  routeGeo.setAttribute('aD', new THREE.Float32BufferAttribute(dist, 1));
  scene.add(new THREE.Mesh(routeGeo, new THREE.ShaderMaterial({
    transparent: true, depthWrite: false, blending: THREE.AdditiveBlending,
    uniforms: { uTime: time, uEnd: { value: run } },
    vertexShader: 'attribute float aD; varying float vD; void main() { vD = aD; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }',
    fragmentShader: `uniform float uTime, uEnd; varying float vD;
      void main() {
        float f = fract(vD * 0.5 - uTime * 1.1);
        float dash = smoothstep(0.0, 0.1, f) * (1.0 - smoothstep(0.3, 0.45, f));
        float fade = smoothstep(0.0, 22.0, vD);
        gl_FragColor = vec4(vec3(0.45, 0.55, 1.0) * (dash * 1.1 + 0.2) * fade, 1.0);
      }`,
  })));

  // ---------- traffic (left-hand, as in India): white heading south/east, red heading north/west ----------
  const cars = [];
  const lane = (road, off, dir, n) => { for (let i = 0; i < n; i++) cars.push({ road, off, dir, s: rand(), v: 0.012 + rand() * 0.01 }); };
  lane('h', 0.55, 1, 7); lane('h', 1.45, 1, 6); lane('h', -0.55, -1, 7); lane('h', -1.45, -1, 6);
  lane('j', -0.55, 1, 5); lane('j', 0.55, -1, 5);
  const carMesh = new THREE.InstancedMesh(new THREE.BoxGeometry(0.34, 0.16, 0.7).translate(0, 0.1, 0), new THREE.MeshBasicMaterial({ color: '#ffffff' }), cars.length);
  cars.forEach((car, i) => carMesh.setColorAt(i, c.set(car.dir > 0 ? '#fff1cf' : '#ff4d63')));
  scene.add(carMesh);
  const placeCars = (dt) => {
    cars.forEach((car, i) => {
      car.s = (car.s + car.v * dt * car.dir + 1) % 1;
      if (car.road === 'h') {
        const z = -60 + car.s * 120;
        o.position.set(hwyX(z) + car.off, 0.03, z); o.rotation.set(0, hwyYaw, 0);
      } else {
        const x = jrX0 + car.s * 60;
        o.position.set(x, 0.03, jrZ(x) + car.off); o.rotation.set(0, jrYaw, 0);
      }
      o.scale.setScalar(1); o.updateMatrix(); carMesh.setMatrixAt(i, o.matrix);
    });
    carMesh.instanceMatrix.needsUpdate = true;
  };
  placeCars(0);

  // ---------- office marker: ground rings, a beam and a floating pin ----------
  const rings = [0, 1, 2].map(() => {
    const r = new THREE.Mesh(new THREE.RingGeometry(1, 1.12, 64).rotateX(-Math.PI / 2), new THREE.MeshBasicMaterial({ color: '#6d86ff', transparent: true, depthWrite: false, blending: THREE.AdditiveBlending }));
    r.position.set(OFFICE.x, 0.05, OFFICE.z);
    scene.add(r);
    return r;
  });
  const PIN_Y = OFFICE.h + 2.8;
  const beam = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.05, PIN_Y - OFFICE.h - 1, 8), new THREE.MeshBasicMaterial({ color: '#6d86ff', transparent: true, opacity: 0.7 }));
  beam.position.set(OFFICE.x, OFFICE.h + (PIN_Y - OFFICE.h - 1) / 2, OFFICE.z);
  scene.add(beam);
  const pin = new THREE.Group();
  const blue = new THREE.MeshBasicMaterial({ color: '#3d5afe' });
  pin.add(new THREE.Mesh(new THREE.SphereGeometry(0.9, 32, 16), blue));
  const tip = new THREE.Mesh(new THREE.ConeGeometry(0.66, 1.6, 32).rotateX(Math.PI), blue);
  tip.position.y = -1.05;
  pin.add(tip);
  const dot = new THREE.Mesh(new THREE.CircleGeometry(0.34, 32), new THREE.MeshBasicMaterial({ color: '#ffffff' }));
  dot.position.z = 0.91;
  pin.add(dot);
  const glowTex = (() => {
    const cv = document.createElement('canvas'); cv.width = cv.height = 64;
    const g = cv.getContext('2d'), grad = g.createRadialGradient(32, 32, 0, 32, 32, 32);
    grad.addColorStop(0, 'rgba(109,134,255,0.9)'); grad.addColorStop(1, 'rgba(109,134,255,0)');
    g.fillStyle = grad; g.fillRect(0, 0, 64, 64);
    return new THREE.CanvasTexture(cv);
  })();
  const halo = new THREE.Sprite(new THREE.SpriteMaterial({ map: glowTex, transparent: true, depthWrite: false, blending: THREE.AdditiveBlending }));
  halo.scale.setScalar(5.5);
  halo.renderOrder = -1;
  pin.add(halo);
  pin.position.set(OFFICE.x, PIN_Y, OFFICE.z);
  scene.add(pin);

  // ---------- HTML tags pinned to 3D points (text stays crisp) ----------
  const tags = [...card.querySelectorAll('[data-visit-tag]')].map((el) => ({
    el,
    at: { office: new THREE.Vector3(OFFICE.x, PIN_Y + 1.4, OFFICE.z), sg: new THREE.Vector3(hwyX(12), 0, 12), jr: new THREE.Vector3(13, 0, jrZ(13)) }[el.dataset.visitTag],
  }));
  const v = new THREE.Vector3();
  let W = 1, H = 1;
  const placeTags = () => tags.forEach(({ el, at }) => {
    v.copy(at).project(camera);
    el.style.transform = `translate(${((v.x + 1) / 2) * W}px, ${((1 - v.y) / 2) * H}px) translate(-50%, -100%)`;
  });

  // ---------- camera, sizing, loop ----------
  const resize = () => {
    W = host.clientWidth || 1; H = host.clientHeight || 1;
    renderer.setSize(W, H, false);
    camera.aspect = W / H;
    camera.updateProjectionMatrix();
  };
  resize();

  const tilt = { x: 0, y: 0, tx: 0, ty: 0 };
  if (!reduced && matchMedia('(hover: hover) and (pointer: fine)').matches) {
    card.addEventListener('pointermove', (e) => {
      const r = card.getBoundingClientRect();
      tilt.tx = ((e.clientX - r.left) / r.width - 0.5) * 0.5;
      tilt.ty = ((e.clientY - r.top) / r.height - 0.5) * 6;
    }, { passive: true });
    card.addEventListener('pointerleave', () => { tilt.tx = tilt.ty = 0; });
  }

  let t = 0, last = 0, raf = 0, onScreen = true;
  const draw = () => {
    const a = 0.75 + t * 0.05 + tilt.x;
    camera.position.set(target.x + Math.sin(a) * 38, 26 + tilt.y, target.z + Math.cos(a) * 38);
    camera.lookAt(target);
    time.value = t;
    pin.position.y = PIN_Y + Math.sin(t * 2) * 0.25;
    pin.rotation.y = a;
    rings.forEach((r, i) => {
      const k = (t * 0.35 + i / 3) % 1;
      r.scale.setScalar(1.6 + k * 6);
      r.material.opacity = (1 - k) * 0.6;
    });
    renderer.render(scene, camera);
    placeTags();
  };
  const tick = (now) => {
    raf = requestAnimationFrame(tick);
    const dt = last ? Math.min(0.05, (now - last) / 1000) : 0;
    last = now; t += dt;
    tilt.x += (tilt.tx - tilt.x) * 0.05; tilt.y += (tilt.ty - tilt.y) * 0.05;
    placeCars(dt);
    draw();
  };
  const play = () => { if (!raf && onScreen && !document.hidden && !reduced) { last = 0; raf = requestAnimationFrame(tick); } };
  const stop = () => { cancelAnimationFrame(raf); raf = 0; };
  new ResizeObserver(() => { resize(); if (!raf) draw(); }).observe(host);
  new IntersectionObserver(([e]) => { onScreen = e.isIntersecting; onScreen ? play() : stop(); }).observe(host);
  document.addEventListener('visibilitychange', () => (document.hidden ? stop() : play()));

  draw();
  card.classList.add('has-3d');
  play();
}
