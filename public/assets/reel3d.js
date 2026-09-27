// Project reels, 3D heroes: phones, laptops, bags and the other product objects are modelled here in code with
// Three.js (cars are studio renders instead, see reel.js). One shared WebGL renderer draws each visible hero into its
// own 2D canvas, so sixteen reels never need sixteen WebGL contexts. Lighting comes from a code-built photo studio
// (softboxes and strip lights), turned into reflections with PMREM, so glass, metal and paint read as real materials.
// reel.js owns timing: it tweens a plain `state` object and calls hero.draw() on every frame it needs.

import * as THREE from './vendor/three/three.module.js';

const { Vector3, Color } = THREE;
const TAU = Math.PI * 2;

/* ---------- shared renderer and studio ---------- */

let renderer, envMap, bufW = 0, bufH = 0;

function core() {
  if (renderer) return;
  renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, preserveDrawingBuffer: true, powerPreference: 'high-performance' });
  renderer.setPixelRatio(1); // callers size canvases in device pixels
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.12;
  renderer.setClearColor(0x000000, 0);
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFShadowMap;
  const pmrem = new THREE.PMREMGenerator(renderer);
  envMap = pmrem.fromScene(studio(), 0.015).texture;
  pmrem.dispose();
}

// A dark studio: one big overhead softbox, long strip lights on every wall (the lines you see running
// along a car's flanks in showroom photos) and a faint blue bounce that matches the site.
function studio() {
  const s = new THREE.Scene();
  const room = new THREE.Mesh(new THREE.BoxGeometry(40, 16, 40), new THREE.MeshBasicMaterial({ color: 0x1b1d23, side: THREE.BackSide }));
  room.position.y = 7;
  s.add(room);
  const light = (w, h, pos, rot, k, tint = [1, 1, 1]) => {
    const m = new THREE.Mesh(new THREE.PlaneGeometry(w, h), new THREE.MeshBasicMaterial({ side: THREE.DoubleSide }));
    m.material.color.setRGB(tint[0] * k, tint[1] * k, tint[2] * k);
    m.position.set(...pos);
    m.rotation.set(...rot);
    s.add(m);
  };
  light(16, 7, [0, 14.8, 0], [Math.PI / 2, 0, 0], 4.2);
  // tall scrims either side: broad, soft highlights down a car's flanks
  light(14, 9, [6, 5, 19.7], [0, 0, 0], 1.6);
  light(14, 9, [-19.7, 5, 6], [0, Math.PI / 2, 0], 1.2);
  light(30, 0.7, [0, 5.5, -19.8], [0, 0, 0], 16);
  light(30, 0.5, [0, 2.6, -19.8], [0, 0, 0], 6);
  light(30, 0.7, [0, 5.5, 19.8], [0, 0, 0], 14);
  light(30, 0.35, [0, 2.2, 19.8], [0, 0, 0], 8);
  light(30, 0.7, [19.8, 5, 0], [0, Math.PI / 2, 0], 16);
  light(30, 0.4, [19.8, 2.4, 0], [0, Math.PI / 2, 0], 6);
  light(30, 0.7, [-19.8, 5, 0], [0, Math.PI / 2, 0], 10);
  light(8, 5, [12, 3, 14], [0, -Math.PI / 4, 0], 2.2);
  light(12, 3, [0, 0.05, 0], [-Math.PI / 2, 0, 0], 0.35);
  return s;
}

// Soft contact shadow under an object: a radial gradient drawn on a canvas.
function contactShadow(w, d, strength = 0.85) {
  const c = document.createElement('canvas');
  c.width = c.height = 128;
  const g = c.getContext('2d');
  const grad = g.createRadialGradient(64, 64, 0, 64, 64, 64);
  grad.addColorStop(0, `rgba(0,0,0,${strength})`);
  grad.addColorStop(0.55, `rgba(0,0,0,${strength * 0.45})`);
  grad.addColorStop(1, 'rgba(0,0,0,0)');
  g.fillStyle = grad;
  g.fillRect(0, 0, 128, 128);
  const m = new THREE.Mesh(new THREE.PlaneGeometry(w, d), new THREE.MeshBasicMaterial({ map: new THREE.CanvasTexture(c), transparent: true, depthWrite: false }));
  m.rotation.x = -Math.PI / 2;
  m.position.y = 0.003;
  return m;
}

function stage({ fov = 26, shadow = 5 } = {}) {
  const scene = new THREE.Scene();
  scene.environment = envMap;
  const camera = new THREE.PerspectiveCamera(fov, 2, 0.1, 200);
  const sun = new THREE.DirectionalLight(0xffffff, 1.6);
  sun.position.set(3, 10, 4);
  sun.castShadow = true;
  sun.shadow.mapSize.set(1024, 1024);
  sun.shadow.camera.left = sun.shadow.camera.bottom = -shadow;
  sun.shadow.camera.right = sun.shadow.camera.top = shadow;
  sun.shadow.radius = 6;
  sun.shadow.bias = -0.0004;
  scene.add(sun);
  const floor = new THREE.Mesh(new THREE.PlaneGeometry(60, 60), new THREE.ShadowMaterial({ opacity: 0.45 }));
  floor.rotation.x = -Math.PI / 2;
  floor.receiveShadow = true;
  scene.add(floor);
  return { scene, camera, sun };
}

// Place the camera on a sphere around a target: azimuth from +x towards +z, elevation above the floor.
function aim(camera, target, radius, az, el) {
  camera.position.set(
    target.x + radius * Math.cos(el) * Math.cos(az),
    target.y + radius * Math.sin(el),
    target.z + radius * Math.cos(el) * Math.sin(az),
  );
  camera.lookAt(target);
}

function shade(obj) {
  obj.traverse((o) => { if (o.isMesh && !o.material.transparent) { o.castShadow = true; o.receiveShadow = true; } });
  return obj;
}

/* ---------- materials ---------- */

const M = {
  glass: () => new THREE.MeshPhysicalMaterial({ color: 0x05070b, metalness: 0.2, roughness: 0.04, clearcoat: 1, envMapIntensity: 1.6 }),
  chrome: () => new THREE.MeshStandardMaterial({ color: 0xf2f4f7, metalness: 1, roughness: 0.08, envMapIntensity: 1.4 }),
  gloss: (hex = 0x07080b) => new THREE.MeshPhysicalMaterial({ color: hex, metalness: 0.1, roughness: 0.15, clearcoat: 1, clearcoatRoughness: 0.05 }),
  matte: (hex, rough = 0.7) => new THREE.MeshStandardMaterial({ color: hex, metalness: 0, roughness: rough }),
};

/* ---------- geometry helpers ---------- */

function tube(points, r, mat, closed = false) {
  const curve = new THREE.CatmullRomCurve3(points.map((p) => new Vector3(...p)), closed);
  return new THREE.Mesh(new THREE.TubeGeometry(curve, Math.max(24, points.length * 12), r, 10, closed), mat);
}

function roundedRect(w, h, r) {
  const s = new THREE.Shape();
  const x = -w / 2, y = -h / 2;
  s.moveTo(x + r, y);
  s.lineTo(x + w - r, y); s.quadraticCurveTo(x + w, y, x + w, y + r);
  s.lineTo(x + w, y + h - r); s.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
  s.lineTo(x + r, y + h); s.quadraticCurveTo(x, y + h, x, y + h - r);
  s.lineTo(x, y + r); s.quadraticCurveTo(x, y, x + r, y);
  return s;
}

// A rounded slab: extruded rounded rectangle with a soft bevel, centred on its depth.
function slab(w, h, d, r, bevel = 0.02, segs = 6) {
  const g = new THREE.ExtrudeGeometry(roundedRect(w - bevel * 2, h - bevel * 2, Math.max(0.001, r - bevel)), {
    depth: d - bevel * 2, bevelEnabled: true, bevelThickness: bevel, bevelSize: bevel, bevelSegments: segs, curveSegments: 16,
  });
  g.translate(0, 0, -(d - bevel * 2) / 2);
  return g;
}

function canvasTex(w, h, draw) {
  const c = document.createElement('canvas');
  c.width = w;
  c.height = h;
  draw(c.getContext('2d'), w, h);
  const t = new THREE.CanvasTexture(c);
  t.colorSpace = THREE.SRGBColorSpace;
  t.anisotropy = 8;
  return t;
}

/* ---------- other heroes ---------- */

// Phone: titanium frame, glass front, live app screen drawn in code, camera island on the back.
function phone({ accent = '#3d5afe', screen }) {
  const g = new THREE.Group();
  const W = 0.72, H = 1.5, D = 0.078;
  g.add(new THREE.Mesh(slab(W, H, D, 0.11, 0.02, 8), new THREE.MeshStandardMaterial({ color: 0x8e9299, metalness: 1, roughness: 0.28 })));
  const glassFront = new THREE.Mesh(new THREE.ShapeGeometry(roundedRect(W - 0.03, H - 0.03, 0.095)), M.glass());
  glassFront.position.z = D / 2 + 0.0015;
  g.add(glassFront);
  const tex = canvasTex(540, 1170, screen);
  const scr = new THREE.Mesh(new THREE.ShapeGeometry(roundedRect(W - 0.07, H - 0.07, 0.08)), new THREE.MeshBasicMaterial({ map: tex, toneMapped: false }));
  // ShapeGeometry UVs follow shape coords: remap to 0..1.
  const uv = scr.geometry.attributes.uv, p = scr.geometry.attributes.position;
  for (let i = 0; i < uv.count; i++) uv.setXY(i, p.getX(i) / (W - 0.07) + 0.5, p.getY(i) / (H - 0.07) + 0.5);
  scr.position.z = D / 2 + 0.003;
  g.add(scr);
  const island = new THREE.Mesh(new THREE.CapsuleGeometry(0.03, 0.12, 6, 16), M.gloss(0x000000));
  island.rotation.z = Math.PI / 2;
  island.position.set(0, H / 2 - 0.08, D / 2 + 0.005);
  g.add(island);
  // Back: frosted glass and a camera block with three lenses.
  const backGlass = new THREE.Mesh(new THREE.ShapeGeometry(roundedRect(W - 0.03, H - 0.03, 0.095)), new THREE.MeshPhysicalMaterial({ color: accent, roughness: 0.5, metalness: 0.2, clearcoat: 0.6 }));
  backGlass.rotation.y = Math.PI;
  backGlass.position.z = -D / 2 - 0.0015;
  g.add(backGlass);
  const cam = new THREE.Mesh(slab(0.3, 0.3, 0.03, 0.07, 0.01), M.glass());
  cam.position.set(0.15, H / 2 - 0.2, -D / 2 - 0.012);
  g.add(cam);
  for (const [x, y] of [[0.08, 0.63], [0.22, 0.63], [0.08, 0.5]]) {
    const lens = new THREE.Mesh(new THREE.CylinderGeometry(0.045, 0.05, 0.03, 32), new THREE.MeshStandardMaterial({ color: 0x0c0d10, metalness: 0.9, roughness: 0.15 }));
    lens.rotation.x = Math.PI / 2;
    lens.position.set(x, y, -D / 2 - 0.03);
    g.add(lens);
  }
  for (const [y, h] of [[0.35, 0.12], [0.18, 0.16]]) {
    const btn = new THREE.Mesh(new THREE.BoxGeometry(0.012, h, 0.03), new THREE.MeshStandardMaterial({ color: 0x9a9ea6, metalness: 1, roughness: 0.25 }));
    btn.position.set(W / 2 + 0.004, y, 0);
    g.add(btn);
  }
  g.position.y = H / 2 + 0.02;
  const root = new THREE.Group();
  root.add(g);
  shade(root);
  return { root, spinner: g, tex };
}

// Laptop: aluminium unibody, black keyboard, hinged lid with the product's screen.
function laptop({ screen }) {
  const root = new THREE.Group();
  const alu = new THREE.MeshStandardMaterial({ color: 0xbfc3ca, metalness: 1, roughness: 0.32 });
  const W = 2.2, D = 1.5;
  const base = new THREE.Mesh(slab(W, D, 0.06, 0.08, 0.02), alu);
  base.rotation.x = -Math.PI / 2;
  base.position.y = 0.03;
  root.add(base);
  const keyMat = M.matte(0x0d0e11, 0.6);
  const keys = new THREE.InstancedMesh(new THREE.BoxGeometry(0.12, 0.012, 0.11), keyMat, 14 * 5);
  const m4 = new THREE.Matrix4();
  let k = 0;
  for (let r = 0; r < 5; r++) for (let c = 0; c < 14; c++) { m4.makeTranslation(-0.92 + c * 0.142, 0.064, -0.62 + r * 0.13); keys.setMatrixAt(k++, m4); }
  root.add(keys);
  const pad = new THREE.Mesh(new THREE.BoxGeometry(0.8, 0.004, 0.46), new THREE.MeshStandardMaterial({ color: 0xb3b7be, metalness: 0.9, roughness: 0.4 }));
  pad.position.set(0, 0.061, 0.42);
  root.add(pad);
  const hinge = new THREE.Group();
  hinge.position.set(0, 0.06, -D / 2 + 0.02);
  root.add(hinge);
  const lid = new THREE.Group();
  hinge.add(lid);
  const shell = new THREE.Mesh(slab(W, 1.42, 0.04, 0.08, 0.015), alu);
  shell.position.set(0, 0.71, -0.02);
  lid.add(shell);
  const bezel = new THREE.Mesh(new THREE.ShapeGeometry(roundedRect(W - 0.03, 1.39, 0.07)), M.gloss(0x050507));
  bezel.position.set(0, 0.71, 0.0015);
  lid.add(bezel);
  const tex = canvasTex(1280, 800, screen);
  const scr = new THREE.Mesh(new THREE.PlaneGeometry(W - 0.14, 1.26), new THREE.MeshBasicMaterial({ map: tex, toneMapped: false }));
  scr.position.set(0, 0.72, 0.003);
  lid.add(scr);
  shade(root);
  return { root, lid: hinge, tex };
}

// Luxury paper bag: matte laminated card, folded top, rope handles, foil wordmark.
function bag({ color = 0x1f5c46, label }) {
  const root = new THREE.Group();
  const W = 1.3, H = 1.55, D = 0.5;
  const tex = canvasTex(512, 640, (g, w, h) => {
    g.fillStyle = new Color(color).getStyle();
    g.fillRect(0, 0, w, h);
    g.fillStyle = '#d8c38a';
    g.textAlign = 'center';
    g.font = '600 46px Georgia, serif';
    g.fillText(label, w / 2, h * 0.46);
    g.fillRect(w / 2 - 60, h * 0.5, 120, 2);
  });
  const paper = new THREE.MeshPhysicalMaterial({ map: tex, roughness: 0.55, metalness: 0, clearcoat: 0.35, clearcoatRoughness: 0.4 });
  const side = new THREE.MeshPhysicalMaterial({ color, roughness: 0.55, clearcoat: 0.35, clearcoatRoughness: 0.4 });
  const box = new THREE.Mesh(new THREE.BoxGeometry(W, H, D, 1, 1, 1), [side, side, side, side, paper, paper]);
  box.position.y = H / 2;
  root.add(box);
  // Side gusset crease.
  for (const s of [1, -1]) {
    const crease = new THREE.Mesh(new THREE.BoxGeometry(0.004, H * 0.9, 0.004), M.matte(0x000000, 1));
    crease.position.set(s * (W / 2 + 0.002), H * 0.52, 0);
    root.add(crease);
  }
  const rope = new THREE.MeshStandardMaterial({ color: 0xe9dcc0, roughness: 0.9 });
  for (const z of [D / 2 + 0.005, -D / 2 - 0.005]) {
    root.add(tube([[-0.25, H - 0.12, z], [-0.22, H + 0.3, z], [0, H + 0.42, z], [0.22, H + 0.3, z], [0.25, H - 0.12, z]], 0.018, rope));
    for (const x of [-0.25, 0.25]) {
      const eyelet = new THREE.Mesh(new THREE.TorusGeometry(0.03, 0.008, 8, 20), M.chrome());
      eyelet.position.set(x, H - 0.12, z);
      root.add(eyelet);
    }
  }
  shade(root);
  return { root, spinner: root };
}

// Gift box with a satin ribbon and bow; the lid lifts off and the gifts inside rise out (Fluent renders as sprites,
// so what is inside matches the illustrations in the rest of the reel).
function gift({ color = 0xff5a6e, products = ['basket', 'watch', 'headphone'] }) {
  const root = new THREE.Group();
  const loader = new THREE.TextureLoader();
  const items = products.slice(0, 3).map((name) => {
    const tex = loader.load(new URL(`img/reel/${name}.webp`, import.meta.url).href);
    tex.colorSpace = THREE.SRGBColorSpace;
    const sp = new THREE.Sprite(new THREE.SpriteMaterial({ map: tex, transparent: true, depthWrite: false }));
    sp.scale.setScalar(0.001);
    root.add(sp);
    return sp;
  });
  const card = new THREE.MeshPhysicalMaterial({ color, roughness: 0.6, clearcoat: 0.3, clearcoatRoughness: 0.5 });
  const satin = new THREE.MeshPhysicalMaterial({ color: 0xf4efe6, roughness: 0.35, sheen: 1, sheenRoughness: 0.3, sheenColor: new Color(0xffffff) });
  const S = 1.2;
  const box = new THREE.Mesh(slab(S, S * 0.8, S, 0.02, 0.01), card);
  box.rotation.x = -Math.PI / 2;
  box.scale.set(1, 1, 1);
  const base = new THREE.Mesh(new THREE.BoxGeometry(S, S * 0.8, S), card);
  base.position.y = S * 0.4;
  root.add(base);
  for (const r of [0, Math.PI / 2]) {
    const band = new THREE.Mesh(new THREE.BoxGeometry(0.16, S * 0.8 + 0.004, S + 0.006), satin);
    band.position.y = S * 0.4;
    band.rotation.y = r;
    root.add(band);
  }
  const lid = new THREE.Group();
  lid.position.y = S * 0.8;
  const lidBox = new THREE.Mesh(new THREE.BoxGeometry(S + 0.06, 0.2, S + 0.06), card);
  lidBox.position.y = 0.06;
  lid.add(lidBox);
  for (const r of [0, Math.PI / 2]) {
    const band = new THREE.Mesh(new THREE.BoxGeometry(0.16, 0.204, S + 0.066), satin);
    band.position.y = 0.06;
    band.rotation.y = r;
    lid.add(band);
  }
  for (const s of [1, -1]) {
    const loop = new THREE.Mesh(new THREE.TorusGeometry(0.2, 0.05, 16, 40), satin);
    loop.scale.set(1, 0.55, 0.45);
    loop.position.set(s * 0.19, 0.24, 0);
    loop.rotation.z = s * 0.35;
    lid.add(loop);
  }
  const knot = new THREE.Mesh(new THREE.SphereGeometry(0.08, 20, 16), satin);
  knot.scale.set(1, 0.7, 0.9);
  knot.position.y = 0.2;
  lid.add(knot);
  root.add(lid);
  shade(root);
  items.forEach((sp) => { sp.castShadow = false; sp.renderOrder = 2; });
  return { root, lid, items, spinner: root };
}

// Globe of latitude and longitude rings in brushed metal, with flight arcs and a stablecoin in orbit.
function globe({ color = 0x6b67b8 }) {
  const root = new THREE.Group();
  const R = 1;
  const orb = new THREE.Group();
  orb.position.y = 1.35;
  root.add(orb);
  const core = new THREE.Mesh(new THREE.SphereGeometry(R * 0.985, 64, 48), new THREE.MeshPhysicalMaterial({ color, roughness: 0.25, metalness: 0.3, clearcoat: 1, transmission: 0, envMapIntensity: 1.2 }));
  orb.add(core);
  const ringMat = new THREE.MeshStandardMaterial({ color: 0xe8ebf2, metalness: 1, roughness: 0.25 });
  for (let i = -3; i <= 3; i++) {
    const lat = (i / 4) * (Math.PI / 2);
    const r = Math.cos(lat) * R;
    const ring = new THREE.Mesh(new THREE.TorusGeometry(r, 0.006, 8, 96), ringMat);
    ring.rotation.x = Math.PI / 2;
    ring.position.y = Math.sin(lat) * R;
    orb.add(ring);
  }
  for (let i = 0; i < 6; i++) {
    const ring = new THREE.Mesh(new THREE.TorusGeometry(R, 0.006, 8, 96), ringMat);
    ring.rotation.y = (i / 6) * Math.PI;
    orb.add(ring);
  }
  // Arcs between cities, drawn as great-circle tubes lifted off the surface.
  const ll = (lat, lon) => new Vector3().setFromSphericalCoords(R, (90 - lat) * (Math.PI / 180), lon * (Math.PI / 180));
  const arcs = [];
  const glow = new THREE.MeshBasicMaterial({ color: 0xffffff, toneMapped: false });
  for (const [a, b] of [[[40.7, -74], [19, 72.8]], [[51.5, -0.1], [25.2, 55.3]], [[1.35, 103.8], [-33.9, 151.2]], [[37.8, -122.4], [35.7, 139.7]]]) {
    const A = ll(...a), B = ll(...b);
    const pts = [];
    for (let k = 0; k <= 40; k++) {
      const t = k / 40;
      const p = A.clone().lerp(B, t).normalize().multiplyScalar(R * (1 + 0.28 * Math.sin(Math.PI * t)));
      pts.push(p);
    }
    const curve = new THREE.CatmullRomCurve3(pts);
    const m = new THREE.Mesh(new THREE.TubeGeometry(curve, 60, 0.008, 6), new THREE.MeshBasicMaterial({ color: 0xbfcaff, transparent: true, opacity: 0.8, toneMapped: false }));
    orb.add(m);
    const dot = new THREE.Mesh(new THREE.SphereGeometry(0.03, 12, 12), glow);
    orb.add(dot);
    arcs.push({ curve, dot });
  }
  // The coin: minted edge, raised rim, embossed mark.
  const coinTex = canvasTex(512, 512, (g, w) => {
    const gr = g.createRadialGradient(w / 2, w / 2, 10, w / 2, w / 2, w / 2);
    gr.addColorStop(0, '#f6f7fb'); gr.addColorStop(1, '#aab0bd');
    g.fillStyle = gr; g.fillRect(0, 0, w, w);
    g.strokeStyle = 'rgba(40,44,60,0.55)'; g.lineWidth = 10;
    g.beginPath(); g.arc(w / 2, w / 2, w * 0.4, 0, TAU); g.stroke();
    g.fillStyle = 'rgba(40,44,60,0.7)'; g.textAlign = 'center'; g.textBaseline = 'middle';
    g.font = '700 230px Georgia, serif'; g.fillText('$', w / 2, w / 2 + 10);
  });
  const coin = new THREE.Group();
  // gold, and only partly metallic: a full mirror reflects the dark studio and reads as a black disc on a pale reel
  const face = new THREE.MeshStandardMaterial({ map: coinTex, color: 0xffd36b, metalness: 0.55, roughness: 0.3, emissive: 0x3a2600, emissiveIntensity: 0.4 });
  const edge = new THREE.MeshStandardMaterial({ color: 0xe0a83a, metalness: 0.6, roughness: 0.3 });
  const disc = new THREE.Mesh(new THREE.CylinderGeometry(0.34, 0.34, 0.06, 64), [edge, face, face]);
  disc.rotation.x = Math.PI / 2;
  coin.add(disc);
  coin.add(new THREE.Mesh(new THREE.TorusGeometry(0.335, 0.012, 10, 64), edge));
  root.add(coin);
  shade(root);
  return { root, orb, arcs, coin };
}

// 3D report chart: glass plinth, rising bars, a trend line and a printed report sheet.
function chart({ color = 0xc0392b, values = [0.35, 0.5, 0.45, 0.7, 0.62, 0.9] }) {
  const root = new THREE.Group();
  const plinth = new THREE.Mesh(slab(2.6, 1.3, 0.1, 0.1, 0.03), new THREE.MeshPhysicalMaterial({ color: 0xe9ecf2, roughness: 0.08, metalness: 0, transmission: 0.6, thickness: 0.3, clearcoat: 1 }));
  plinth.rotation.x = -Math.PI / 2;
  plinth.position.y = 0.05;
  root.add(plinth);
  const bars = [];
  values.forEach((v, i) => {
    const m = new THREE.Mesh(slab(0.26, 0.26, 1, 0.04, 0.02), new THREE.MeshPhysicalMaterial({ color: i === values.length - 1 ? color : 0xf2f3f6, roughness: 0.25, clearcoat: 1, metalness: 0.05 }));
    m.rotation.x = -Math.PI / 2;
    const g = new THREE.Group();
    g.position.set(-1 + i * 0.4, 0.1, 0);
    m.position.y = 0.5;
    g.add(m);
    g.userData.v = v * 1.6;
    root.add(g);
    bars.push(g);
  });
  const line = tube(values.map((v, i) => [-1 + i * 0.4, 0.1 + v * 1.6 + 0.18, 0.3]), 0.018, new THREE.MeshStandardMaterial({ color, metalness: 0.4, roughness: 0.3 }));
  root.add(line);
  const sheet = new THREE.Mesh(new THREE.BoxGeometry(0.85, 0.005, 1.15), M.matte(0xfbfbfd, 0.8));
  sheet.position.set(1.2, 0.32, 0.55);
  sheet.rotation.set(0.1, -0.5, 0.05);
  root.add(sheet);
  shade(root);
  return { root, bars, line, spinner: root };
}

// Document folders with sheets sliding out.
function folders({ color = 0x5b8aa6 }) {
  const root = new THREE.Group();
  const mats = [color, new Color(color).offsetHSL(0.04, 0, 0.1).getHex(), new Color(color).offsetHSL(-0.04, -0.1, -0.08).getHex()];
  const sheets = [];
  mats.forEach((c, i) => {
    const g = new THREE.Group();
    const shape = new THREE.Shape();
    shape.moveTo(-0.7, 0); shape.lineTo(0.7, 0); shape.lineTo(0.7, 0.95); shape.lineTo(-0.1, 0.95); shape.lineTo(-0.2, 1.08); shape.lineTo(-0.66, 1.08); shape.lineTo(-0.7, 1.04); shape.lineTo(-0.7, 0);
    const back = new THREE.Mesh(new THREE.ExtrudeGeometry(shape, { depth: 0.02, bevelEnabled: true, bevelSize: 0.01, bevelThickness: 0.01, bevelSegments: 3 }), new THREE.MeshPhysicalMaterial({ color: c, roughness: 0.5, clearcoat: 0.4 }));
    g.add(back);
    const paper = new THREE.Mesh(new THREE.BoxGeometry(1.25, 0.9, 0.01), M.matte(0xfbfbfd, 0.85));
    paper.position.set(0, 0.5, 0.05);
    g.add(paper);
    sheets.push(paper);
    const front = new THREE.Mesh(slab(1.4, 0.78, 0.02, 0.03, 0.008), new THREE.MeshPhysicalMaterial({ color: c, roughness: 0.5, clearcoat: 0.4 }));
    front.position.set(0, 0.39, 0.09);
    g.add(front);
    g.position.set(-0.45 + i * 0.45, 0.02 + i * 0.001, -0.5 + i * 0.5);
    g.rotation.y = 0.35 - i * 0.05;
    root.add(g);
  });
  shade(root);
  return { root, sheets, spinner: root };
}

// VR headset: gloss visor, fabric face cushion, adjustable strap.
function vr({ color = 0x3d8bfd }) {
  const root = new THREE.Group();
  const g = new THREE.Group();
  g.position.y = 0.75;
  root.add(g);
  const shell = new THREE.Mesh(slab(1.5, 0.82, 0.62, 0.3, 0.12, 10), new THREE.MeshPhysicalMaterial({ color: 0xf1f2f5, roughness: 0.35, clearcoat: 0.8 }));
  g.add(shell);
  const visor = new THREE.Mesh(slab(1.42, 0.74, 0.08, 0.27, 0.035, 8), new THREE.MeshPhysicalMaterial({ color: 0x050608, roughness: 0.05, metalness: 0.3, clearcoat: 1 }));
  visor.position.z = 0.32;
  g.add(visor);
  const band = new THREE.Mesh(new THREE.BoxGeometry(1.2, 0.03, 0.01), new THREE.MeshBasicMaterial({ color, toneMapped: false }));
  band.position.set(0, -0.24, 0.37);
  g.add(band);
  const cushion = new THREE.Mesh(slab(1.4, 0.72, 0.14, 0.26, 0.06), M.matte(0x2a2c31, 0.95));
  cushion.position.z = -0.36;
  g.add(cushion);
  // Head strap: a flat band looping round behind the visor.
  const strap = new THREE.Mesh(new THREE.TorusGeometry(0.62, 0.035, 10, 96), M.matte(0x1c1d21, 0.9));
  strap.rotation.x = Math.PI / 2;
  strap.scale.set(1.12, 1, 1);
  strap.scale.z = 3.2; // flatten the tube into a band
  strap.position.z = -0.78;
  g.add(strap);
  shade(root);
  return { root, spinner: g, band };
}

// Film clapperboard: slate with chalk markings and a hinged striped clapstick.
function clapper({ color = 0xff5b1f, label }) {
  const root = new THREE.Group();
  const slateTex = canvasTex(800, 560, (g, w, h) => {
    g.fillStyle = '#121316'; g.fillRect(0, 0, w, h);
    g.strokeStyle = 'rgba(255,255,255,0.8)'; g.lineWidth = 4;
    for (const y of [150, 290, 420]) { g.beginPath(); g.moveTo(24, y); g.lineTo(w - 24, y); g.stroke(); }
    g.beginPath(); g.moveTo(w / 2, 290); g.lineTo(w / 2, 420); g.stroke();
    g.fillStyle = 'rgba(255,255,255,0.9)'; g.font = '600 38px system-ui, sans-serif';
    g.fillText('PROD.', 36, 118); g.fillText('SCENE', 36, 262); g.fillText('TAKE', w / 2 + 16, 262);
    g.font = '700 64px system-ui, sans-serif'; g.fillText(label, 200, 122);
    g.fillText('1', 60, 390); g.fillText('1', w / 2 + 40, 390);
  });
  const slate = new THREE.Mesh(slab(1.8, 1.26, 0.08, 0.04, 0.015), [new THREE.MeshPhysicalMaterial({ map: slateTex, roughness: 0.6, clearcoat: 0.3 }), M.gloss(0x111215)]);
  slate.position.y = 0.66;
  root.add(slate);
  const stripes = (flip) => canvasTex(900, 110, (g, w, h) => {
    g.fillStyle = '#f4f4f4'; g.fillRect(0, 0, w, h);
    g.fillStyle = '#121316';
    for (let x = -100; x < w + 100; x += 150) { g.beginPath(); g.moveTo(x, 0); g.lineTo(x + 75, 0); g.lineTo(x + 75 + (flip ? -60 : 60), h); g.lineTo(x + (flip ? -60 : 60), h); g.fill(); }
    g.fillStyle = new Color(color).getStyle(); g.fillRect(0, h - 10, w, 10);
  });
  const lower = new THREE.Mesh(new THREE.BoxGeometry(1.8, 0.2, 0.09), [M.gloss(0x111215), M.gloss(0x111215), M.gloss(0x111215), M.gloss(0x111215), new THREE.MeshPhysicalMaterial({ map: stripes(false), roughness: 0.4, clearcoat: 0.6 }), M.gloss(0x111215)]);
  lower.position.y = 1.39;
  root.add(lower);
  const hinge = new THREE.Group();
  hinge.position.set(-0.9, 1.5, 0);
  root.add(hinge);
  const stick = new THREE.Mesh(new THREE.BoxGeometry(1.8, 0.2, 0.09), [M.gloss(0x111215), M.gloss(0x111215), M.gloss(0x111215), M.gloss(0x111215), new THREE.MeshPhysicalMaterial({ map: stripes(true), roughness: 0.4, clearcoat: 0.6 }), M.gloss(0x111215)]);
  stick.position.set(0.9, 0.1, 0);
  hinge.add(stick);
  const pin = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.05, 0.14, 20), M.chrome());
  pin.rotation.x = Math.PI / 2;
  pin.position.set(-0.86, 1.5, 0);
  root.add(pin);
  shade(root);
  return { root, stick: hinge, spinner: root };
}

// Shield: bevelled metal badge with an embossed tick.
function shield({ color = 0xe8612c }) {
  const root = new THREE.Group();
  const s = new THREE.Shape();
  s.moveTo(0, 1.25);
  s.bezierCurveTo(0.35, 1.1, 0.7, 1.05, 0.85, 1.05);
  s.lineTo(0.85, 0.45);
  s.bezierCurveTo(0.85, -0.15, 0.4, -0.5, 0, -0.7);
  s.bezierCurveTo(-0.4, -0.5, -0.85, -0.15, -0.85, 0.45);
  s.lineTo(-0.85, 1.05);
  s.bezierCurveTo(-0.7, 1.05, -0.35, 1.1, 0, 1.25);
  const g = new THREE.Group();
  g.position.y = 1.0;
  root.add(g);
  const body = new THREE.Mesh(new THREE.ExtrudeGeometry(s, { depth: 0.16, bevelEnabled: true, bevelThickness: 0.08, bevelSize: 0.07, bevelSegments: 10, curveSegments: 40 }),
    new THREE.MeshPhysicalMaterial({ color, metalness: 0.75, roughness: 0.22, clearcoat: 1, clearcoatRoughness: 0.05 }));
  body.position.z = -0.08;
  body.geometry.translate(0, -0.27, 0);
  g.add(body);
  const tick = tube([[-0.38, 0.0, 0.2], [-0.1, -0.28, 0.2], [0.42, 0.3, 0.2]], 0.07, M.chrome());
  g.add(tick);
  shade(root);
  return { root, spinner: g };
}

/* ---------- screens drawn in code ---------- */

function rr(g, x, y, w, h, r) { g.beginPath(); g.roundRect(x, y, w, h, r); }

// A phone app screen: status bar, header in the brand colour, title and a scrolling list of cards.
export function appScreen({ accent = '#3d5afe', dark = false, title = '', items = [] }) {
  return (g, w, h) => {
    const bg = dark ? '#0b0c10' : '#f6f6f8', ink = dark ? '#f2f2f5' : '#15161a', sub = dark ? '#8c8f99' : '#7b7e88', card = dark ? '#17181e' : '#ffffff';
    g.fillStyle = bg; g.fillRect(0, 0, w, h);
    g.fillStyle = accent; rr(g, 0, 0, w, 330, 0); g.fill();
    g.fillStyle = '#fff'; g.font = '600 26px system-ui, sans-serif'; g.fillText('9:41', 40, 58);
    g.font = '700 58px system-ui, sans-serif'; g.fillText(title, 40, 220);
    g.globalAlpha = 0.85; g.font = '500 26px system-ui, sans-serif'; g.fillText(items[0]?.[1] || '', 40, 270); g.globalAlpha = 1;
    items.forEach(([t, s], i) => {
      const y = 370 + i * 150;
      g.fillStyle = card; rr(g, 30, y, w - 60, 128, 26); g.fill();
      g.fillStyle = accent; g.globalAlpha = 0.16; rr(g, 52, y + 22, 84, 84, 20); g.fill(); g.globalAlpha = 1;
      g.fillStyle = accent; rr(g, 78, y + 48, 32, 32, 8); g.fill();
      g.fillStyle = ink; g.font = '600 32px system-ui, sans-serif'; g.fillText(t, 160, y + 58);
      g.fillStyle = sub; g.font = '400 24px system-ui, sans-serif'; g.fillText(s, 160, y + 96);
    });
    g.fillStyle = card; g.fillRect(0, h - 110, w, 110);
    for (let i = 0; i < 4; i++) { g.fillStyle = i === 0 ? accent : sub; rr(g, 70 + i * 120, h - 78, 36, 36, 10); g.fill(); }
    g.fillStyle = ink; g.globalAlpha = 0.9; rr(g, w / 2 - 70, h - 18, 140, 8, 4); g.fill(); g.globalAlpha = 1;
  };
}

// A web app screen: sidebar, top bar, stat tiles and a chart.
export function webScreen({ accent = '#3d5afe', title = '', nav = [], tiles = [] }) {
  return (g, w, h) => {
    g.fillStyle = '#f5f6f9'; g.fillRect(0, 0, w, h);
    g.fillStyle = '#12141b'; g.fillRect(0, 0, 230, h);
    g.fillStyle = '#fff'; g.font = '700 30px system-ui, sans-serif'; g.fillText(title, 28, 60);
    nav.forEach((t, i) => {
      if (i === 0) { g.fillStyle = accent; rr(g, 16, 96, 198, 46, 10); g.fill(); }
      g.fillStyle = i === 0 ? '#fff' : '#9a9eab'; g.font = '500 20px system-ui, sans-serif'; g.fillText(t, 34, 126 + i * 56);
    });
    g.fillStyle = '#fff'; g.fillRect(230, 0, w - 230, 70);
    g.fillStyle = '#15161a'; g.font = '700 26px system-ui, sans-serif'; g.fillText(nav[0] || '', 262, 45);
    tiles.forEach(([t, s], i) => {
      const x = 262 + i * ((w - 290) / tiles.length);
      const tw = (w - 290) / tiles.length - 20;
      g.fillStyle = '#fff'; rr(g, x, 100, tw, 130, 16); g.fill();
      g.fillStyle = accent; g.globalAlpha = 0.14; rr(g, x + 20, 122, 44, 44, 12); g.fill(); g.globalAlpha = 1;
      g.fillStyle = '#15161a'; g.font = '700 28px system-ui, sans-serif'; g.fillText(t, x + 20, 200);
      g.fillStyle = '#7b7e88'; g.font = '400 18px system-ui, sans-serif'; g.fillText(s, x + 80, 150);
    });
    g.fillStyle = '#fff'; rr(g, 262, 260, w - 290, h - 290, 16); g.fill();
    g.strokeStyle = accent; g.lineWidth = 5; g.beginPath();
    for (let i = 0; i <= 20; i++) { const x = 300 + (i / 20) * (w - 370); const y = h - 90 - (Math.sin(i * 0.7) * 0.3 + 0.5 + i * 0.02) * (h - 420); i ? g.lineTo(x, y) : g.moveTo(x, y); }
    g.stroke();
    g.globalAlpha = 0.08; g.lineTo(w - 70, h - 60); g.lineTo(300, h - 60); g.fillStyle = accent; g.fill(); g.globalAlpha = 1;
  };
}

/* ---------- heroes: model + camera + how state drives them ---------- */

const BUILD = {
  phone(o) {
    const st = stage({ fov: 26, shadow: 2 });
    const p = phone(o);
    st.scene.add(p.root);
    st.scene.add(contactShadow(1.6, 0.9, 0.8));
    const target = new Vector3(0, 0.78, 0);
    return {
      ...st,
      update(s) {
        p.root.position.y = (1 - s.enter) * -2.2;
        p.spinner.rotation.y = (1 - s.enter) * Math.PI * 1.5 - 0.35 + s.orbit * 0.5;
        p.spinner.rotation.x = -0.05;
        aim(st.camera, target, 3.7, 1.57, 0.1);
      },
    };
  },
  laptop(o) {
    const st = stage({ fov: 26, shadow: 2.4 });
    const l = laptop(o);
    st.scene.add(l.root);
    st.scene.add(contactShadow(3.2, 2.2, 0.75));
    const target = new Vector3(0, 0.55, 0);
    return {
      ...st,
      update(s) {
        l.root.position.y = (1 - s.enter) * -1.5;
        l.root.rotation.y = (1 - s.enter) * -1.2 + s.orbit * 0.4 - 0.3;
        l.lid.rotation.x = Math.PI / 2 - s.open * (Math.PI / 2 + 0.3); // closed flat, opens past upright
        aim(st.camera, target, 6.2, 1.57, 0.32);
      },
    };
  },
  bag(o) {
    const st = stage({ fov: 26, shadow: 2 });
    const b = bag(o);
    st.scene.add(b.root);
    st.scene.add(contactShadow(2.1, 1.2, 0.8));
    return {
      ...st,
      update(s) {
        b.root.position.y = (1 - s.enter) * 2.5;
        b.root.rotation.y = (1 - s.enter) * 2.4 - 0.45 + s.orbit * 0.5;
        aim(st.camera, new Vector3(0, 0.95, 0), 5.6, 1.57, 0.14);
      },
    };
  },
  gift(o) {
    const st = stage({ fov: 26, shadow: 2 });
    const b = gift(o);
    st.scene.add(b.root);
    st.scene.add(contactShadow(2.2, 2.2, 0.8));
    return {
      ...st,
      update(s, t) {
        b.root.position.y = (1 - s.enter) * 2.4;
        b.root.rotation.y = (1 - s.enter) * 2 + 0.6 + s.orbit * 0.5;
        // the lid lifts, swings off to the side and comes to rest leaning against the box
        const lift = Math.sin(Math.min(1, s.open) * Math.PI);
        b.lid.position.set(s.open * -1.05, 0.96 + lift * 0.7 - s.open * 0.62, s.open * 0.35);
        b.lid.rotation.z = s.open * 1.15;
        // the gifts rise out of the open box and fan out, the middle one highest
        const k = Math.max(0, Math.min(1, (s.open - 0.35) / 0.65));
        b.items.forEach((sp, i) => {
          const d = i - (b.items.length - 1) / 2, e = Math.max(0, Math.min(1, k * 1.25 - Math.abs(d) * 0.2));
          const ease = 1 - Math.pow(1 - e, 3);
          sp.scale.setScalar(0.001 + ease * (i === 1 ? 0.95 : 0.78));
          sp.position.set(0.1 + d * 0.72 * ease, 0.8 + ease * (i === 1 ? 1.05 : 0.78) + Math.sin(t * 2 + i) * 0.03 * ease, 0.3);
          sp.material.opacity = Math.min(1, e * 2);
        });
        aim(st.camera, new Vector3(0, 0.8 + s.open * 0.3, 0), 5.4 + s.open * 2.1, 1.57, 0.26);
      },
    };
  },
  globe(o) {
    const st = stage({ fov: 26, shadow: 2 });
    const b = globe(o);
    st.scene.add(b.root);
    st.scene.add(contactShadow(2, 2, 0.55));
    return {
      ...st,
      update(s, t) {
        b.root.scale.setScalar(0.6 + 0.4 * s.enter);
        b.orb.rotation.y = t * 0.35 + (1 - s.enter) * 2;
        b.arcs.forEach((a, i) => a.dot.position.copy(a.curve.getPoint((t * 0.4 + i * 0.27) % 1)));
        const a = t * 1.1;
        b.coin.position.set(Math.cos(a) * 1.45, 1.35 + Math.sin(a * 0.7) * 0.25, Math.sin(a) * 1.45);
        b.coin.rotation.y = a * 2.2;
        aim(st.camera, new Vector3(0, 1.3, 0), 6.4, 1.57, 0.12);
      },
    };
  },
  chart(o) {
    const st = stage({ fov: 26, shadow: 2.4 });
    const b = chart(o);
    st.scene.add(b.root);
    st.scene.add(contactShadow(3.4, 2, 0.7));
    return {
      ...st,
      update(s) {
        b.bars.forEach((g, i) => { const k = Math.min(1, Math.max(0, s.open * 1.6 - i * 0.12)); g.scale.y = 0.02 + g.userData.v * k; });
        b.line.material.opacity = s.open;
        b.root.rotation.y = -0.4 + s.orbit * 0.5 + (1 - s.enter) * -1;
        b.root.position.y = (1 - s.enter) * -1.2;
        aim(st.camera, new Vector3(0.1, 0.75, 0), 6.3, 1.57, 0.3);
      },
    };
  },
  folders(o) {
    const st = stage({ fov: 26, shadow: 2.4 });
    const b = folders(o);
    st.scene.add(b.root);
    st.scene.add(contactShadow(3, 2.2, 0.6));
    return {
      ...st,
      update(s) {
        b.sheets.forEach((p, i) => { p.position.y = 0.5 + Math.max(0, s.open * 1.4 - i * 0.2) * 0.45; });
        b.root.position.y = (1 - s.enter) * -1.6;
        b.root.rotation.y = -0.2 + s.orbit * 0.5;
        aim(st.camera, new Vector3(0, 0.62, 0), 6.9, 1.57, 0.25);
      },
    };
  },
  vr(o) {
    const st = stage({ fov: 26, shadow: 2 });
    const b = vr(o);
    st.scene.add(b.root);
    st.scene.add(contactShadow(2.2, 1.5, 0.6));
    return {
      ...st,
      update(s, t) {
        b.spinner.rotation.y = (1 - s.enter) * 2.6 + 0.5 + s.orbit * 0.6;
        b.spinner.position.y = 0.75 + (1 - s.enter) * 1.4 + Math.sin(t * 1.6) * 0.03;
        b.band.material.color.setScalar(0.4 + s.lights * 0.6);
        aim(st.camera, new Vector3(-0.35, 0.75, -0.3), 6.4, 1.57, 0.16);
      },
    };
  },
  clapper(o) {
    const st = stage({ fov: 26, shadow: 2 });
    const b = clapper(o);
    st.scene.add(b.root);
    st.scene.add(contactShadow(2.4, 1, 0.6));
    return {
      ...st,
      update(s) {
        b.stick.rotation.z = s.open * 0.5;
        b.root.position.y = (1 - s.enter) * 2.3;
        b.root.rotation.y = (1 - s.enter) * 1.4 - 0.35 + s.orbit * 0.5;
        aim(st.camera, new Vector3(-0.1, 0.95, 0), 6, 1.57, 0.1);
      },
    };
  },
  shield(o) {
    const st = stage({ fov: 26, shadow: 2 });
    const b = shield(o);
    st.scene.add(b.root);
    st.scene.add(contactShadow(1.8, 1, 0.55));
    return {
      ...st,
      update(s, t) {
        b.spinner.rotation.y = (1 - s.enter) * Math.PI * 2 - 0.35 + s.orbit * 0.6;
        b.spinner.position.y = 1.0 + (1 - s.enter) * -1.6 + Math.sin(t * 1.4) * 0.04;
        aim(st.camera, new Vector3(0, 1.0, 0), 5.4, 1.57, 0.12);
      },
    };
  },
};

// Build a hero. Returns { draw(state, time, ctx, w, h) } or throws if WebGL is unavailable.
export function createHero(kind, opts = {}) {
  core();
  const h = BUILD[kind](opts);
  return {
    draw(state, t, ctx, w, hgt) {
      if (!w || !hgt) return;
      if (w > bufW || hgt > bufH) { bufW = Math.max(bufW, w); bufH = Math.max(bufH, hgt); renderer.setSize(bufW, bufH, false); }
      h.update(state, t);
      h.camera.aspect = w / hgt;
      h.camera.updateProjectionMatrix();
      renderer.setViewport(0, bufH - hgt, w, hgt);
      renderer.setScissor(0, bufH - hgt, w, hgt);
      renderer.setScissorTest(true);
      renderer.clear();
      renderer.render(h.scene, h.camera);
      ctx.clearRect(0, 0, w, hgt);
      ctx.drawImage(renderer.domElement, 0, 0, w, hgt, 0, 0, w, hgt);
    },
  };
}
