// The Demaze crew: plush characters living behind the page, drawn with Three.js on one fixed, full-viewport canvas
// inside the moving background (.amb, so site.css's mask fades them behind the text column). ambient.js imports this
// module after the page has loaded (never on Save-Data) and calls start().
//
// Each character is a little plush: cream-to-marker-coloured fur (shell texturing: every furry part is drawn as a
// stack of shells, one GPU instance each, and a fragment shader keeps only the strands, hashed from 3D cells on the
// rest surface, dark at the root and catching light at the tips), a smooth cream face, glossy black eyes, pink cheeks
// and a small smile. Accessories (a cap, a bow, glasses, headphones) tell them apart.
//
// They act rather than idle: two pass a football, a couple type on laptops, one dances in headphones with notes
// rising, and runners cross the bottom of the screen, faster while the page scrolls. Near the cursor they turn and
// wave. Wide screens get the whole crew (sitting and music in the side margins, football and runners along the
// bottom); tablets get the football and runners; phones only the runners. With reduced motion everyone holds one
// pose and the canvas is drawn once.
//
// The camera is orthographic in CSS pixels (world y up, 0 at the bottom of the viewport), so placing a character is
// placing it on the screen.

import * as THREE from './vendor/three/three.module.js';

const { Color, Vector3, Group, Mesh } = THREE;
const TAU = Math.PI * 2;
const clamp = (v, a, b) => Math.min(b, Math.max(a, v));
const lerp = (a, b, t) => a + (b - a) * t;
const damp = (a, b, k, dt) => a + (b - a) * (1 - Math.exp(-k * dt));
const smooth = (t) => t * t * (3 - 2 * t);
const rnd = (a, b) => a + Math.random() * (b - a);

const SHELLS = 18;

/* ---------- palette ---------- */

// fur: the cream plush and softened marker colours (site.css --sun, --mint, --lilac, --pink, --sky, --tomato)
const FUR = {
  cream: '#eee1cb', honey: '#f1c878', mint: '#93d8bf', lilac: '#c4b3f2', pink: '#f3b1c9', sky: '#a2cfee', tomato: '#f3a287',
};
const FACE = '#f7efe2';
const INK = '#1d1c1a';

/* ---------- lights (shared by the standard materials and the fur shader) ---------- */

const KEY_DIR = new Vector3(-0.55, 0.75, 0.62).normalize();
const FILL_DIR = new Vector3(0.85, 0.05, 0.5).normalize();
const KEY = new Color('#fff4e6').multiplyScalar(2.5);
const FILL = new Color('#dfe8ff').multiplyScalar(0.55);
const SKY = new Color('#fffaf2').multiplyScalar(0.95);
const GROUND = new Color('#b9ab97').multiplyScalar(0.95);

/* ---------- fur ---------- */

const furShared = {
  uShells: { value: SHELLS },
  uDensity: { value: 40 },
  uKeyDir: { value: KEY_DIR },
  uFillDir: { value: FILL_DIR },
  // three's lights reach a Lambert surface divided by pi; the fur matches that
  uKeyCol: { value: KEY.clone().multiplyScalar(1 / Math.PI) },
  uFillCol: { value: FILL.clone().multiplyScalar(1 / Math.PI) },
  uSky: { value: SKY.clone().multiplyScalar(1 / Math.PI) },
  uGround: { value: GROUND.clone().multiplyScalar(1 / Math.PI) },
};

const FUR_VERT = /* glsl */ `
uniform float uLen;
uniform float uShells;
uniform vec3 uLag;
out vec3 vP;
out vec3 vON;
out vec3 vN;
out float vH;
void main() {
  float h = float(gl_InstanceID) / (uShells - 1.0);
  vec3 p = position + normal * (uLen * h);
  vec4 wp = modelMatrix * vec4(p, 1.0);
  // the tips droop a little and trail the motion (uLag, in world units per unit of fur length)
  float s = length(modelMatrix[0].xyz);
  wp.xyz += (vec3(0.0, -0.35 * uLen, 0.0) + uLag * uLen) * s * h * h;
  vP = position;
  vON = normal;
  vN = normalize(transpose(inverse(mat3(modelMatrix))) * normal);
  vH = h;
  gl_Position = projectionMatrix * viewMatrix * wp;
}`;

const FUR_FRAG = /* glsl */ `
layout(location = 0) out vec4 pc_fragColor;
#define gl_FragColor pc_fragColor
uniform vec3 uColor;
uniform float uDensity;
uniform vec3 uKeyDir, uKeyCol, uFillDir, uFillCol, uSky, uGround;
in vec3 vP;
in vec3 vON;
in vec3 vN;
in float vH;
vec3 hash33(vec3 p) {
  p = fract(p * vec3(0.1031, 0.1030, 0.0973));
  p += dot(p, p.yxz + 33.33);
  return fract((p.xxy + p.yxx) * p.zyx);
}
void main() {
  // one strand per 3D cell of the rest surface, at a hashed spot, tapering from root to tip
  vec3 q = vP * uDensity;
  vec3 r = hash33(floor(q));
  vec3 d = fract(q) - 0.5 - (r - 0.5) * 0.45;
  vec3 on = normalize(vON);
  d -= dot(d, on) * on;
  float len = 0.6 + 0.4 * r.x;
  float alpha = 1.0;
  if (vH > 0.0) {
    float t = vH / len;
    float rad = 0.56 * (1.0 - t * t * 0.9);
    float dist = length(d);
    float w = max(fwidth(dist), 0.02);
    alpha = t > 1.0 ? 0.0 : 1.0 - smoothstep(rad - w, rad + w, dist);
    if (alpha < 0.02) discard;
  }
  vec3 N = normalize(vN);
  // wrapped diffuse: light bleeds round the soft surface
  float key = clamp((dot(N, uKeyDir) + 0.55) / 1.55, 0.0, 1.0);
  float fill = clamp((dot(N, uFillDir) + 0.6) / 1.6, 0.0, 1.0);
  vec3 amb = mix(uGround, uSky, N.y * 0.5 + 0.5);
  vec3 base = uColor * (0.93 + 0.12 * r.y);
  float ao = mix(0.6, 1.0, pow(vH, 0.8));
  vec3 col = base * (amb + uKeyCol * key * key + uFillCol * fill) * ao;
  // sheen at the silhouette and on the lit tips
  float rim = pow(1.0 - clamp(N.z, 0.0, 1.0), 3.0);
  col += (uKeyCol * 0.22 + base * 0.12) * rim * vH;
  col += base * 0.1 * vH * key;
  gl_FragColor = vec4(col, alpha);
  #include <tonemapping_fragment>
  #include <colorspace_fragment>
}`;

function furMaterial(color, lag, len) {
  return new THREE.ShaderMaterial({
    glslVersion: THREE.GLSL3,
    uniforms: { ...furShared, uColor: color, uLag: lag, uLen: { value: len } },
    vertexShader: FUR_VERT,
    fragmentShader: FUR_FRAG,
    alphaToCoverage: true,
  });
}

/* ---------- shared geometry and textures ---------- */

let G, T;

const capsule = (r, len) => new THREE.CapsuleGeometry(r, len, 6, 16).translate(0, -len / 2, 0);
function shells(geo) {
  const g = new THREE.InstancedBufferGeometry();
  g.index = geo.index;
  for (const k of ['position', 'normal']) g.setAttribute(k, geo.getAttribute(k));
  g.instanceCount = SHELLS;
  return g;
}

function canvasTexture(w, h, draw) {
  const c = document.createElement('canvas');
  c.width = w; c.height = h;
  draw(c.getContext('2d'), w, h);
  const t = new THREE.CanvasTexture(c);
  t.colorSpace = THREE.SRGBColorSpace;
  return t;
}

function glow(ctx, w, h, stops) {
  const g = ctx.createRadialGradient(w / 2, h / 2, 0, w / 2, h / 2, w / 2);
  stops.forEach(([o, c]) => g.addColorStop(o, c));
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, w, h);
}

// A football's panels: the truncated icosahedron's faces are the ones whose planes a ray from the centre meets
// first; the twelve pentagons (at an icosahedron's corners) are black, the twenty hexagons white, seams in between.
function ballTexture() {
  const p = (1 + Math.sqrt(5)) / 2;
  const ico = [];
  for (const a of [-1, 1]) for (const b of [-p, p]) ico.push([0, a, b], [a, b, 0], [b, 0, a]);
  const vs = ico.map((v) => new Vector3(...v).normalize());
  const hex = [];
  const edge = vs[0].distanceTo(vs.reduce((m, v) => (v !== vs[0] && v.distanceTo(vs[0]) < m.distanceTo(vs[0]) ? v : m), vs[1]));
  for (let i = 0; i < 12; i++) for (let j = i + 1; j < 12; j++) for (let k = j + 1; k < 12; k++) {
    const ok = (a, b) => Math.abs(vs[a].distanceTo(vs[b]) - edge) < 1e-3;
    if (ok(i, j) && ok(j, k) && ok(i, k)) hex.push(vs[i].clone().add(vs[j]).add(vs[k]).normalize());
  }
  const faces = [...vs.map((n) => [n, 1 / 1.027, true]), ...hex.map((n) => [n, 1, false])];
  return canvasTexture(256, 128, (ctx, w, h) => {
    const img = ctx.createImageData(w, h);
    const dir = new Vector3();
    for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) {
      const th = ((y + 0.5) / h) * Math.PI, ph = ((x + 0.5) / w) * TAU;
      dir.set(-Math.cos(ph) * Math.sin(th), Math.cos(th), Math.sin(ph) * Math.sin(th));
      let best = -1, second = -1, pent = false;
      for (const [n, k, isP] of faces) {
        const s = dir.dot(n) * k;
        if (s > best) { second = best; best = s; pent = isP; } else if (s > second) second = s;
      }
      const seam = best - second < 0.012;
      const v = seam ? 70 : pent ? 28 : 246;
      const i = (y * w + x) * 4;
      img.data[i] = v; img.data[i + 1] = v; img.data[i + 2] = v - (pent || seam ? 0 : 4); img.data[i + 3] = 255;
    }
    ctx.putImageData(img, 0, 0);
  });
}

function assets() {
  if (G) return;
  G = {
    head: new THREE.SphereGeometry(1, 36, 24),
    blob: new THREE.SphereGeometry(1, 30, 20),
    arm: capsule(0.17, 0.46),
    leg: capsule(0.23, 0.27),
    small: new THREE.SphereGeometry(1, 16, 12),
    plane: new THREE.PlaneGeometry(1, 1),
  };
  G.headF = shells(G.head);
  G.blobF = shells(G.blob);
  G.armF = shells(G.arm);
  G.legF = shells(G.leg);
  T = {
    blush: canvasTexture(64, 64, (c, w, h) => glow(c, w, h, [[0, 'rgba(255,128,150,0.62)'], [0.55, 'rgba(255,140,160,0.28)'], [1, 'rgba(255,150,170,0)']])),
    shadow: canvasTexture(64, 64, (c, w, h) => glow(c, w, h, [[0, 'rgba(40,30,20,0.34)'], [0.6, 'rgba(40,30,20,0.14)'], [1, 'rgba(40,30,20,0)']])),
    note: canvasTexture(64, 64, (c) => {
      c.fillStyle = '#fff';
      c.beginPath(); c.ellipse(22, 46, 11, 8, -0.4, 0, TAU); c.fill();
      c.beginPath(); c.ellipse(46, 40, 11, 8, -0.4, 0, TAU); c.fill();
      c.fillRect(30, 12, 4, 34); c.fillRect(54, 6, 4, 34);
      c.beginPath(); c.moveTo(30, 12); c.lineTo(58, 6); c.lineTo(58, 14); c.lineTo(30, 20); c.fill();
    }),
    logo: canvasTexture(64, 64, (c) => {
      c.fillStyle = '#f7f4ee';
      c.beginPath(); c.moveTo(18, 14); c.lineTo(50, 32); c.lineTo(18, 50); c.lineTo(27, 32); c.fill();
    }),
    ball: ballTexture(),
  };
}

/* ---------- materials ---------- */

const std = (color, rough = 0.8, extra = {}) => new THREE.MeshStandardMaterial({ color, roughness: rough, metalness: 0, ...extra });
let M;
function materials() {
  if (M) return;
  M = {
    face: std(FACE, 0.6, { emissive: new Color(FACE).multiplyScalar(0.22) }), // a little light from within, like felt
    eye: new THREE.MeshPhysicalMaterial({ color: '#0d0c0c', roughness: 0.12, clearcoat: 1, clearcoatRoughness: 0.05 }),
    glint: new THREE.MeshBasicMaterial({ color: '#ffffff', toneMapped: false }),
    mouth: std('#4a2f2a', 0.5),
    blush: new THREE.MeshBasicMaterial({ map: T.blush, transparent: true, depthWrite: false, toneMapped: false, polygonOffset: true, polygonOffsetFactor: -2, polygonOffsetUnits: -2 }),
    shadow: new THREE.MeshBasicMaterial({ map: T.shadow, transparent: true, depthWrite: false, toneMapped: false }),
    ink: std(INK, 0.4),
    lens: new THREE.MeshPhysicalMaterial({ color: '#ffffff', roughness: 0.05, transmission: 0, transparent: true, opacity: 0.16 }),
    ball: std('#ffffff', 0.45, { map: T.ball }),
    alu: std('#e2dfd9', 0.42),
    aluDark: std('#8f8c86', 0.5, { metalness: 0.3 }),
    logo: new THREE.MeshBasicMaterial({ map: T.logo, transparent: true, depthWrite: false, toneMapped: false }),
  };
}

/* ---------- a character ---------- */

// Proportions in head radii, feet on y = 0, facing +z. Pivots: hips carry the legs and the torso; the torso carries
// the body, arms and neck; the neck carries the head and face.
const HIP_Y = 0.5, SHOULDER = [0.68, 1.38, 0.02], NECK_Y = 1.56, HEAD_UP = 0.86;
const HEIGHT = 3.55; // feet to the top of the fur, for sizing

function part(parent, geo, mat, pos, scale) {
  const m = new Mesh(geo, mat);
  if (pos) m.position.set(...pos);
  if (scale) m.scale.set(...scale);
  m.frustumCulled = false;
  parent.add(m);
  return m;
}

// a point on the face plate (an ellipsoid), and its outward normal
const PLATE = { c: [0, -0.12, 0.7], r: [0.74, 0.63, 0.44] };
function onPlate(x, y, lift = 0) {
  const [cx, cy, cz] = PLATE.c, [a, b, c] = PLATE.r;
  const u = (x - cx) / a, v = (y - cy) / b;
  const w = Math.sqrt(Math.max(0, 1 - u * u - v * v));
  const p = new Vector3(x, y, cz + c * w);
  const n = new Vector3(u / a, v / b, w / c).normalize();
  p.addScaledVector(n, lift);
  return { p, n };
}
// sets a part flat on the face plate, its +z along the plate's normal (in the face's own space, not the world's)
const Z = new Vector3(0, 0, 1);
function stick(mesh, x, y, lift) {
  const { p, n } = onPlate(x, y, lift);
  mesh.position.copy(p);
  mesh.quaternion.setFromUnitVectors(Z, n);
}

function makeCharacter({ fur, acc, accColor = '#ff6242', side = 1 }) {
  const color = { value: new Color(fur) };
  const lag = { value: new Vector3() };
  const furM = (len) => furMaterial(color, lag, len);
  const mHead = furM(0.15), mBody = furM(0.16), mLimb = furM(0.11);

  const root = new Group();
  const rig = new Group(); // leans the whole figure towards the camera a touch, so the ground and head-top show
  rig.rotation.x = 0.2;
  root.add(rig);
  const shadow = part(rig, G.plane, M.shadow, [0, 0.01, 0.05], [2.3, 1.5, 1]);
  shadow.rotation.x = -Math.PI / 2;
  shadow.renderOrder = -1;

  const hips = new Group();
  rig.add(hips);
  const legs = [-1, 1].map((s) => {
    const pivot = new Group();
    pivot.position.set(0.3 * s, HIP_Y, 0.04);
    hips.add(pivot);
    part(pivot, G.legF, mLimb);
    return pivot;
  });
  const torso = new Group();
  torso.position.y = HIP_Y;
  hips.add(torso);
  const body = part(torso, G.blobF, mBody, [0, 0.52, 0], [0.76, 0.66, 0.66]);
  const arms = [-1, 1].map((s) => {
    const pivot = new Group();
    pivot.position.set(SHOULDER[0] * s, SHOULDER[1] - HIP_Y, SHOULDER[2]);
    torso.add(pivot);
    part(pivot, G.armF, mLimb);
    return pivot;
  });
  const neck = new Group();
  neck.position.y = NECK_Y - HIP_Y;
  torso.add(neck);
  const head = new Group();
  head.position.y = HEAD_UP;
  neck.add(head);
  part(head, G.headF, mHead, null, [1.04, 0.97, 1]);

  // the face: a smooth plate, glossy eyes with a catchlight, blush and a small smile
  const face = new Group();
  head.add(face);
  part(face, G.blob, M.face, PLATE.c, PLATE.r);
  const eyes = new Group();
  face.add(eyes);
  for (const s of [-1, 1]) {
    const e = new Group();
    stick(e, 0.27 * s, 0.02, -0.025);
    eyes.add(e);
    part(e, G.small, M.eye, [0, 0, 0], [0.1, 0.125, 0.07]);
    part(e, G.small, M.glint, [-0.032, 0.048, 0.058], [0.026, 0.026, 0.014]);
    const blush = part(face, G.plane, M.blush, null, [0.34, 0.22, 1]);
    stick(blush, 0.45 * s, -0.2, 0.01);
  }
  const mouth = part(face, new THREE.TorusGeometry(0.075, 0.016, 8, 20, Math.PI * 0.72), M.mouth);
  stick(mouth, 0, -0.24, 0.004);
  mouth.rotateZ(-Math.PI / 2 - Math.PI * 0.36);

  const extra = accessory(head, acc, accColor);

  const c = {
    root, rig, hips, torso, body, neck, head, arms, legs, eyes: eyes.children, shadow, color, lag, side, acc, extra,
    blinkAt: rnd(1, 4), blink: 0, att: 0, wave: rnd(0, TAU), look: { x: 0, y: 0 }, prev: new Vector3(),
  };
  return c;
}

function accessory(head, kind, tint) {
  const g = new Group();
  head.add(g);
  const mat = std(tint, 0.55);
  if (kind === 'cap') {
    const cap = new Group();
    cap.rotation.x = -0.22; // pushed back a little, off the eyes
    g.add(cap);
    part(cap, new THREE.SphereGeometry(1.14, 36, 14, 0, TAU, 0, Math.PI * 0.34), mat);
    const brim = part(cap, new THREE.CylinderGeometry(0.66, 0.66, 0.045, 32, 1, false, Math.PI / 2, Math.PI), mat, [0, 0.6, 0.78], [1, 1, 1.1]);
    brim.rotation.x = 0.28;
    part(cap, G.small, mat, [0, 1.14, 0], [0.09, 0.06, 0.09]);
  } else if (kind === 'bow') {
    // on the fur at the top of the head, off to one side, facing out
    const b = new Group();
    const n = new Vector3(0.5, 0.72, 0.48).normalize();
    b.position.copy(n).multiplyScalar(1.13);
    b.quaternion.setFromUnitVectors(Z, n);
    b.rotateZ(-0.55);
    g.add(b);
    const satin = std(tint, 0.3);
    for (const s of [-1, 1]) {
      const loop = part(b, G.small, satin, [0.22 * s, 0, 0], [0.26, 0.18, 0.1]);
      loop.rotation.z = 0.3 * s;
    }
    part(b, G.small, satin, [0, 0, 0.04], [0.1, 0.1, 0.09]);
  } else if (kind === 'glasses') {
    const ring = new THREE.TorusGeometry(0.17, 0.024, 8, 32);
    for (const s of [-1, 1]) {
      const r = part(g, ring, M.ink);
      stick(r, 0.26 * s, 0.0, 0.05);
      const lens = part(g, new THREE.CircleGeometry(0.16, 28), M.lens);
      stick(lens, 0.26 * s, 0.0, 0.052);
    }
    const bridge = part(g, new THREE.CylinderGeometry(0.018, 0.018, 0.16, 8), M.ink);
    stick(bridge, 0, 0.03, 0.08);
    bridge.rotateZ(Math.PI / 2);
    bridge.rotateX(Math.PI / 2);
  } else if (kind === 'headphones') {
    const band = part(g, new THREE.TorusGeometry(1.16, 0.06, 10, 40, Math.PI), M.ink, [0, 0, -0.08]);
    band.scale.set(1, 1.02, 1);
    for (const s of [-1, 1]) {
      const cup = part(g, new THREE.CylinderGeometry(0.28, 0.28, 0.18, 28), mat, [1.1 * s, 0.02, -0.08]);
      cup.rotation.z = Math.PI / 2;
      part(g, new THREE.CylinderGeometry(0.2, 0.2, 0.2, 24), M.ink, [1.18 * s, 0.02, -0.08]).rotation.z = Math.PI / 2;
    }
  }
  return g;
}

/* ---------- poses ---------- */

// A pose is a flat set of angles; activities write one, a wave is blended over it by the character's attention.
const REST = { yaw: 0, bob: 0, lean: 0, twist: 0, sway: 0, hx: 0, hy: 0, hz: 0, alx: 0, alz: 0.38, arx: 0, arz: -0.38, llx: 0, lrx: 0, sit: 0 };
const pose0 = () => ({ ...REST });

function apply(c, p) {
  c.root.rotation.y = p.yaw;
  c.hips.position.y = p.bob;
  c.torso.rotation.set(p.lean, p.twist, p.sway);
  c.head.rotation.set(p.hx, p.hy, p.hz);
  c.arms[1].rotation.set(p.alx, 0, p.alz); // the character's left arm (x > 0)
  c.arms[0].rotation.set(p.arx, 0, p.arz);
  c.legs[1].rotation.x = p.llx;
  c.legs[0].rotation.x = p.lrx;
}

// Turn to the viewer, look at the cursor and wave with the arm on the cursor's side.
function wave(c, p, t, env, keepYaw) {
  const a = smooth(c.att);
  if (a < 0.001) return p;
  const w = { ...p };
  const lookX = clamp(c.look.x, -1, 1), lookY = clamp(c.look.y, -1, 1);
  w.yaw = keepYaw ? p.yaw * 0.55 : 0;
  w.hy = lookX * 0.45 - (keepYaw ? p.yaw * 0.25 : 0);
  w.hx = -lookY * 0.25;
  w.hz = -lookX * 0.12;
  const left = lookX >= 0; // the cursor is to the character's left (screen right)
  const flap = Math.sin(t * 11 + c.wave) * 0.32;
  if (left) { w.alz = 2.55 + flap; w.alx = -0.25; } else { w.arz = -2.55 + flap; w.arx = -0.25; }
  const out = {};
  for (const k in p) out[k] = lerp(p[k], w[k], a);
  return out;
}

function blink(c, dt, t) {
  if (t > c.blinkAt) { c.blink = 0.14; c.blinkAt = t + rnd(2.2, 5.5); }
  c.blink = Math.max(0, c.blink - dt);
  const k = c.blink > 0 ? 0.12 + 0.88 * Math.abs(c.blink / 0.07 - 1) : 1;
  for (const e of c.eyes) e.scale.y = k;
}

/* ---------- props ---------- */

function pouf(color) {
  const g = new Group();
  // soft fabric: the marker colour, dusted towards the page
  const tone = new Color(color).lerp(new Color('#d7d2c8'), 0.35);
  part(g, G.blob, std(tone, 1), [0, 0.27, 0], [0.9, 0.28, 0.9]);
  part(g, G.small, std(tone.clone().multiplyScalar(0.8), 1), [0, 0.53, 0], [0.08, 0.03, 0.08]);
  const sh = part(g, G.plane, M.shadow, [0, 0.01, 0], [2.4, 2.2, 1]);
  sh.rotation.x = -Math.PI / 2;
  sh.renderOrder = -1;
  return g;
}

function laptop() {
  const g = new Group();
  part(g, new THREE.BoxGeometry(0.96, 0.05, 0.64), M.alu, [0, 0.025, 0]);
  const lid = new Group();
  lid.position.set(0, 0.05, 0.32); // hinge on the far edge
  lid.rotation.x = 1.85;
  g.add(lid);
  part(lid, new THREE.BoxGeometry(0.96, 0.03, 0.64), M.alu, [0, 0.015, -0.32]);
  const logo = part(lid, G.plane, M.logo, [0, 0.032, -0.32], [0.2, 0.2, 1]);
  logo.rotation.x = -Math.PI / 2;
  return { g, lid };
}

function football() {
  const g = new Group();
  const ball = part(g, G.blob, M.ball, [0, 0, 0], [0.3, 0.3, 0.3]);
  const sh = part(g, G.plane, M.shadow, [0, 0, 0], [0.8, 0.5, 1]);
  sh.rotation.x = -Math.PI / 2;
  sh.renderOrder = -1;
  return { g, ball, sh };
}

/* ---------- the acts ---------- */

// Each act owns its characters and props, is laid out in screen pixels and updated every frame.
// zone() is the screen rectangle (top-left origin) it occupies, which ambient.js keeps its doodles out of.

function place(obj, x, y, s, z = 0) {
  obj.position.set(x, y, z);
  obj.scale.setScalar(s);
}


// Two players passing a football along the bottom.
class Football {
  constructor(scene) {
    this.a = makeCharacter({ fur: FUR.cream, acc: 'cap', accColor: '#ff6242' });
    this.b = makeCharacter({ fur: FUR.mint, acc: 'bow', accColor: '#ffcb45' });
    this.ball = football();
    this.chars = [this.a, this.b];
    this.group = new Group();
    this.group.add(this.a.root, this.b.root, this.ball.g);
    scene.add(this.group);
    this.kicker = 0; // who has the ball
    this.phase = 'hold';
    this.t = 0;
    this.u = 0;
  }
  layout({ W, s, fx, y }) {
    this.s = s;
    this.gap = 7.8 * s;
    this.x0 = fx;
    place(this.a.root, fx, y, s, 40);
    place(this.b.root, fx + this.gap, y, s, 40);
    this.ball.g.scale.setScalar(s);
    this.y = y;
    this.foot = 1.05 * s; // ball rests this far in front of a player
    if (this.bx === undefined) this.bx = fx + this.foot;
    this.ball.g.position.set(this.bx, y + 0.3 * s * 0.98, 60);
    this.W = W;
  }
  zone(H) {
    const s = this.s;
    return { x: this.x0 - 1.4 * s, y: H - this.y - 4 * s, w: this.gap + 2.8 * s, h: 4.2 * s };
  }
  update(t, dt, env) {
    const s = this.s, A = this.a, B = this.b;
    const yawA = Math.PI / 2 - 0.62, yawB = -(Math.PI / 2 - 0.62);
    const from = this.kicker === 0 ? this.x0 + this.foot : this.x0 + this.gap - this.foot;
    const to = this.kicker === 0 ? this.x0 + this.gap - this.foot : this.x0 + this.foot;
    const kicker = this.kicker === 0 ? A : B, keeper = this.kicker === 0 ? B : A;
    this.t += dt;
    let kick = 0, trap = 0;
    if (this.phase === 'hold') {
      this.bx = from;
      // a player who is waving holds on to the ball
      if (this.t > 0.9 && kicker.att < 0.2) { this.phase = 'windup'; this.t = 0; }
    } else if (this.phase === 'windup') {
      kick = smooth(clamp(this.t / 0.42, 0, 1)); // leg back
      if (this.t > 0.42) { this.phase = 'strike'; this.t = 0; }
    } else if (this.phase === 'strike') {
      kick = 1 - 2.2 * smooth(clamp(this.t / 0.13, 0, 1)); // swing through
      if (this.t > 0.13) { this.phase = 'roll'; this.t = 0; this.dur = rnd(1.05, 1.35); }
    } else if (this.phase === 'roll') {
      const u = clamp(this.t / this.dur, 0, 1);
      kick = lerp(-1.2, 0, smooth(clamp(this.t / 0.5, 0, 1)));
      this.bx = lerp(from, to, 1 - (1 - u) * (1 - u) * (1 - 0.35 * u));
      trap = smooth(clamp((u - 0.72) / 0.28, 0, 1));
      if (u >= 1) { this.phase = 'trap'; this.t = 0; }
    } else if (this.phase === 'trap') {
      trap = 1 - smooth(clamp(this.t / 0.35, 0, 1));
      this.bx = to;
      if (this.t > 0.35) { this.kicker = 1 - this.kicker; this.phase = 'hold'; this.t = rnd(-0.4, 0.2); }
    }
    // roll the ball: its turn is the distance over its radius
    const dx = this.bx - this.ball.g.position.x;
    this.ball.ball.rotation.z -= dx / (0.3 * s);
    this.ball.g.position.x = this.bx;
    const hop = this.phase === 'roll' ? Math.max(0, Math.sin(clamp(this.t / 0.34, 0, 1) * Math.PI)) * 0.35 * s : 0;
    this.ball.g.position.y = this.y + 0.3 * s + hop;
    this.ball.sh.position.y = -0.3 - hop / s + 0.01;
    this.ball.sh.scale.set(0.8 - hop / s * 0.4, 0.5 - hop / s * 0.25, 1);

    for (const c of this.chars) {
      const mine = c === kicker; // the leg nearer the camera does the kicking
      const p = pose0();
      p.yaw = c === A ? yawA : yawB;
      const breathe = Math.sin(t * 2.1 + (c === A ? 0 : 1.7));
      p.bob = 0.015 * breathe;
      p.alz = 0.32; p.arz = -0.32;
      p.hx = 0.06;
      if (mine) {
        const k = kick; // >0 back, <0 through
        const leg = k * 0.95;
        if (c === A) p.lrx = leg; else p.llx = leg;
        p.lean = -k * 0.12;
        p.alx = -k * 0.6; p.arx = k * 0.5;
        p.alz = 0.32 + Math.abs(k) * 0.35; p.arz = -0.32 - Math.abs(k) * 0.35;
        p.bob += -Math.abs(k) * 0.05;
      } else {
        const lift = c === keeper ? trap : 0;
        if (c === A) p.lrx = -0.55 * lift; else p.llx = -0.55 * lift;
        p.hx = 0.1 + 0.06 * lift;
        // watches the ball come
        p.hy = this.phase === 'roll' ? (c === A ? -0.15 : 0.15) : 0;
      }
      blink(c, dt, t);
      apply(c, wave(c, p, t, env, false));
    }
  }
}

// A couple sitting on poufs with laptops on their laps: typing in bursts, reading, now and then turning to each other.
class Laptops {
  constructor(scene) {
    this.a = makeCharacter({ fur: FUR.lilac, acc: 'glasses', side: 1 });
    this.b = makeCharacter({ fur: FUR.honey, acc: 'bow', accColor: '#ff85b8', side: -1 });
    this.chars = [this.a, this.b];
    this.group = new Group();
    scene.add(this.group);
    this.seats = this.chars.map((c, i) => {
      const seat = new Group();
      seat.add(pouf(i ? '#62c1ff' : '#2fd0a0'));
      seat.add(c.root);
      const lap = laptop();
      c.torso.add(lap.g); // the laptop sits on the thighs, which ride with the torso here
      lap.g.position.set(0, 0.27, 0.62);
      lap.g.rotation.x = 0.05;
      c.lap = lap;
      this.group.add(seat);
      return seat;
    });
    for (const c of this.chars) {
      c.root.position.y = 0;
      c.shadow.visible = false;
      c.typing = rnd(0, 2);
      c.chat = rnd(4, 9);
    }
  }
  // Side by side, a little smaller than the rest of the crew when the margin is narrow.
  layout({ s, x, y, room }) {
    s = Math.min(s, room / 4.7);
    this.s = s;
    this.x = x;
    this.y = y;
    this.seats.forEach((seat, i) => {
      seat.position.set(x + (i ? 1.2 : -1.2) * s, y, i ? -30 : 20);
      seat.scale.setScalar(s);
      seat.rotation.y = i ? -0.42 : 0.42;
      seat.children[1].position.y = 0.17; // sitting on the pouf
    });
  }
  zone(H) {
    const s = this.s;
    return { x: this.x - 2.4 * s, y: H - this.y - 3.9 * s, w: 4.8 * s, h: 4.1 * s };
  }
  update(t, dt, env) {
    this.chars.forEach((c, i) => {
      const other = this.chars[1 - i];
      c.typing -= dt;
      c.chat -= dt;
      if (c.typing < -rnd(0.8, 1.6)) c.typing = rnd(1.5, 3.5); // a burst of typing, then a pause to read
      if (c.chat < 0 && other.chat > 1.5) { c.chat = rnd(7, 12); c.talk = 1.6; }
      c.talk = Math.max(0, (c.talk || 0) - dt);
      const typing = c.typing > 0;
      const p = pose0();
      p.sit = 1;
      p.llx = -1.5; p.lrx = -1.5;
      p.lean = 0.14 + 0.02 * Math.sin(t * 1.3 + i);
      p.hx = 0.24;
      const tap = (k) => (typing ? Math.max(0, Math.sin(t * 17 + k + i * 2)) * 0.07 + Math.sin(t * 5.3 + k * 3) * 0.02 : 0);
      p.alx = -0.72 - tap(0); p.arx = -0.72 - tap(1.7);
      p.alz = 0.12; p.arz = -0.12;
      if (!typing) { p.alx = -0.55; p.arx = -0.55; p.hx = 0.18; p.hz = 0.05 * Math.sin(t * 0.8 + i); }
      // a turn to the other one, with a little laugh
      const talk = smooth(clamp(Math.min(c.talk, 1.6 - c.talk) / 0.3, 0, 1));
      if (talk > 0) {
        p.hy = lerp(p.hy, i ? -0.75 : 0.75, talk);
        p.hx = lerp(p.hx, -0.05 + Math.sin(t * 16) * 0.03, talk);
        p.twist = (i ? -0.2 : 0.2) * talk;
      }
      const listen = smooth(clamp(Math.min(other.talk || 0, 1.6 - (other.talk || 0)) / 0.4, 0, 1));
      if (listen > 0) p.hy = lerp(p.hy, i ? -0.35 : 0.35, listen);
      blink(c, dt, t);
      c.lap.g.rotation.x = 0.05 - p.lean; // the laptop stays level on the lap
      const w = wave(c, p, t, env, false);
      // sitting down, the yaw belongs to the seat
      c.root.parent.rotation.y = lerp(i ? -0.42 : 0.42, 0, smooth(c.att));
      w.yaw = 0;
      apply(c, w);
    });
  }
}

// One dancing in headphones, notes rising.
class Dancer {
  constructor(scene) {
    this.c = makeCharacter({ fur: FUR.pink, acc: 'headphones', accColor: '#62c1ff' });
    this.chars = [this.c];
    this.group = new Group();
    this.group.add(this.c.root);
    scene.add(this.group);
    this.notes = [];
    this.nextNote = 0;
    this.spin = { at: rnd(6, 10), t: -1 };
    this.colors = ['#ff6242', '#ffcb45', '#2fd0a0', '#a58bff', '#62c1ff', '#ff85b8'].map((c) => new Color(c));
  }
  layout({ s, x, y }) {
    this.s = s; this.x = x; this.y = y;
    place(this.c.root, x, y, s, 0);
  }
  zone(H) {
    const s = this.s;
    return { x: this.x - 2 * s, y: H - this.y - 5.6 * s, w: 4 * s, h: 5.8 * s };
  }
  update(t, dt, env) {
    const c = this.c, s = this.s;
    const beat = t * (112 / 60) * Math.PI; // half a turn a beat
    const b = Math.abs(Math.sin(beat));
    const p = pose0();
    p.bob = b * 0.16;
    p.sway = Math.sin(beat) * 0.1;
    p.twist = Math.sin(beat * 0.5) * 0.25;
    p.hx = -0.05 + b * 0.1;
    p.hz = Math.sin(beat) * 0.12;
    const bar = Math.floor(beat / TAU) % 4; // arms change every two beats
    const up = Math.max(0, Math.sin(beat));
    if (bar < 2) { p.alz = 0.5 + 2.1 * up; p.arz = -0.5 - 2.1 * Math.max(0, -Math.sin(beat)); }
    else { p.alx = -1.2 - 0.3 * up; p.arx = -1.2 - 0.3 * (1 - up); p.alz = 0.5; p.arz = -0.5; }
    p.llx = Math.sin(beat) * 0.28; p.lrx = -Math.sin(beat) * 0.28;
    p.yaw = Math.sin(beat * 0.25) * 0.35;
    // now and then a full spin
    if (t > this.spin.at && this.spin.t < 0 && c.att < 0.1) this.spin.t = 0;
    if (this.spin.t >= 0) {
      this.spin.t += dt;
      const u = clamp(this.spin.t / 0.9, 0, 1);
      p.yaw += smooth(u) * TAU;
      p.bob += Math.sin(u * Math.PI) * 0.15;
      if (u >= 1) { this.spin.t = -1; this.spin.at = t + rnd(8, 14); }
    }
    blink(c, dt, t);
    apply(c, wave(c, p, t, env, false));

    // notes float up from the headphones, sway and fade
    if (t > this.nextNote && !env.still) {
      this.nextNote = t + rnd(0.45, 0.9);
      const m = new THREE.SpriteMaterial({ map: T.note, color: this.colors[Math.floor(Math.random() * 6)], transparent: true, depthWrite: false, toneMapped: false });
      const sp = new THREE.Sprite(m);
      const side = Math.random() < 0.5 ? -1 : 1;
      sp.userData = { t0: t, x: this.x + side * 1.2 * s, y: this.y + 3.3 * s, dx: side * rnd(0.3, 1.1) * s, sway: rnd(0, TAU), size: rnd(0.34, 0.5) * s };
      this.group.add(sp);
      this.notes.push(sp);
    }
    for (const n of this.notes.slice()) {
      const d = n.userData, u = (t - d.t0) / 2.4;
      if (u >= 1) { this.group.remove(n); n.material.dispose(); this.notes.splice(this.notes.indexOf(n), 1); continue; }
      n.position.set(d.x + d.dx * u + Math.sin(u * 7 + d.sway) * 0.2 * s, d.y + u * 2.4 * s, 80);
      n.material.opacity = Math.min(1, u * 6) * (1 - smooth(clamp((u - 0.55) / 0.45, 0, 1)));
      n.material.rotation = Math.sin(u * 6 + d.sway) * 0.3;
      n.scale.setScalar(d.size * (0.7 + 0.3 * Math.min(1, u * 4)));
    }
  }
}

// Runners crossing the bottom strip, faster while the page scrolls.
class Runners {
  constructor(scene, max) {
    this.scene = scene;
    this.max = max;
    this.pool = [
      makeCharacter({ fur: FUR.sky, acc: 'cap', accColor: '#ffcb45' }),
      makeCharacter({ fur: FUR.tomato, acc: 'headphones', accColor: '#2fd0a0' }),
      makeCharacter({ fur: FUR.cream, acc: 'bow', accColor: '#a58bff' }),
      makeCharacter({ fur: FUR.honey, acc: 'glasses' }),
    ];
    this.live = [];
    this.next = 0.6;
  }
  get chars() { return this.live.map((r) => r.c); }
  layout({ W, s, y, max }) {
    this.W = W; this.s = s; this.y = y; this.max = max;
    for (const r of this.live) { r.c.root.scale.setScalar(s); r.c.root.position.y = y; }
  }
  zone(H) { return { x: 0, y: H - this.y - 3.8 * this.s, w: this.W, h: 3.8 * this.s }; }
  spawn(t, x) {
    const free = this.pool.filter((c) => !this.live.some((r) => r.c === c));
    if (!free.length || this.live.length >= this.max) return;
    const c = free[Math.floor(Math.random() * free.length)];
    const dir = Math.random() < 0.5 ? 1 : -1;
    const s = this.s * rnd(0.9, 1.05);
    c.root.scale.setScalar(s);
    const start = x ?? (dir > 0 ? -2 * s : this.W + 2 * s);
    c.root.position.set(start, this.y, -40 - this.live.length * 30);
    this.scene.add(c.root);
    this.live.push({ c, dir, speed: rnd(1.9, 2.5), phase: rnd(0, TAU), s });
  }
  update(t, dt, env) {
    if (t > this.next && !env.still) { this.spawn(t); this.next = t + rnd(3.5, 8) * (this.max > 1 ? 1 : 1.6); }
    for (const r of this.live.slice()) {
      const { c, dir } = r;
      const slow = 1 - 0.55 * smooth(c.att);
      const v = r.speed * 2 * env.rush * slow; // head radii a second
      c.root.position.x += dir * v * r.s * dt;
      r.phase += (v * dt / 2.3) * TAU; // a stride covers about 2.3 head radii, so the feet don't slide
      const ph = r.phase, sw = Math.sin(ph);
      const p = pose0();
      p.yaw = dir * (Math.PI / 2 - 0.5);
      p.bob = Math.abs(Math.cos(ph)) * 0.2 - 0.05;
      p.lean = 0.22 + 0.06 * (env.rush - 1);
      p.llx = sw * 0.95; p.lrx = -sw * 0.95;
      p.alx = -sw * 1.0; p.arx = sw * 1.0;
      p.alz = 0.18; p.arz = -0.18;
      p.hx = -0.1;
      blink(c, dt, t);
      apply(c, wave(c, p, t, env, true));
      c.lag.value.set(-dir * 0.9 * env.rush, 0.2, 0);
      const x = c.root.position.x;
      if ((dir > 0 && x > this.W + 2.5 * r.s) || (dir < 0 && x < -2.5 * r.s)) {
        this.scene.remove(c.root);
        this.live.splice(this.live.indexOf(r), 1);
      }
    }
  }
}

/* ---------- the stage ---------- */

export function start(layer, { still = false } = {}) {
  const canvas = document.createElement('canvas');
  canvas.className = 'amb__crew3d';
  canvas.setAttribute('aria-hidden', 'true');
  let renderer;
  try {
    renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true, powerPreference: 'low-power' });
  } catch {
    return null;
  }
  assets();
  materials();
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.NeutralToneMapping;
  renderer.toneMappingExposure = 1.02;
  renderer.setClearColor(0x000000, 0);

  const scene = new THREE.Scene();
  const key = new THREE.DirectionalLight(KEY, 1);
  key.position.copy(KEY_DIR);
  const fill = new THREE.DirectionalLight(FILL, 1);
  fill.position.copy(FILL_DIR);
  scene.add(key, fill, new THREE.HemisphereLight(SKY, GROUND, 1));
  const camera = new THREE.OrthographicCamera(0, 1, 1, 0, -2000, 2000);
  camera.position.z = 1000;

  const acts = { football: new Football(scene), laptops: new Laptops(scene), dancer: new Dancer(scene), runners: new Runners(scene, 2) };
  const env = { W: 0, H: 0, still, rush: 1, pointer: { x: -1e4, y: -1e4 } };
  let active = [];

  // Who plays where, by screen: the side margins of a wide screen hold the couple and the dancer; the bottom holds
  // the football and the runners; tablets keep the bottom, phones only the runners.
  const layout = () => {
    const W = innerWidth, H = innerHeight;
    env.W = W; env.H = H;
    const wrap = W <= 560 ? W - 32 : Math.min(1200, W - 48);
    const edge = (W - wrap) / 2;
    const tier = W >= 1280 && edge >= 70 ? 'wide' : W >= 861 ? 'mid' : 'narrow';
    const px = tier === 'wide' ? clamp(edge * 0.95, 96, 128) : tier === 'mid' ? 84 : 64; // a character's height
    const s = px / HEIGHT;
    env.s = s;
    // a full-viewport canvas: 1.5 device pixels per CSS pixel at most keeps the GPU's fill cheap; the fur's strands
    // are sized to the pixels they land on
    const dpr = Math.min(devicePixelRatio || 1, 1.5);
    furShared.uDensity.value = clamp((s * dpr) / 1.5, 18, 44);
    renderer.setPixelRatio(dpr);
    renderer.setSize(W, H, false);
    camera.left = 0; camera.right = W; camera.top = H; camera.bottom = 0;
    camera.updateProjectionMatrix();

    for (const a of Object.values(acts)) a.group && (a.group.visible = false);
    active = [];
    if (tier === 'wide') {
      acts.laptops.layout({ s, x: edge / 2 + 12, y: H * 0.3, room: edge + 30 }); // may reach into the mask's fade
      acts.dancer.layout({ s, x: W - Math.max(edge * 0.5, 1.8 * s + 6), y: H * 0.5 });
      active.push(acts.laptops, acts.dancer);
    }
    if (tier !== 'narrow') {
      // in the right margin if it fits there, else as far right as it goes
      const span = 7.8 * s + 2.8 * s;
      acts.football.layout({ W, s, fx: (edge >= span + 24 ? W - edge / 2 - span / 2 : W - 12 - span) + 1.4 * s, y: 14 });
      active.push(acts.football);
    }
    acts.runners.layout({ W, s, y: 8, max: tier === 'narrow' ? 1 : 2 });
    active.push(acts.runners);
    for (const a of active) if (a.group) a.group.visible = true;
  };

  let last = performance.now() / 1000, t = 0, raf = 0, lastScroll = scrollY, rushAim = 1;
  const frame = (nowMs) => {
    raf = 0;
    const now = nowMs / 1000;
    const dt = Math.min(0.05, Math.max(0, now - last));
    last = now;
    t += dt;
    // scroll speed (px/s) hurries the runners; it eases back when the page stops
    const v = Math.abs(scrollY - lastScroll) / Math.max(dt, 1e-3);
    lastScroll = scrollY;
    rushAim = damp(rushAim, 1 + Math.min(2.2, v / 650), v > 0 ? 8 : 2, dt);
    env.rush = rushAim;
    step(dt);
    renderer.render(scene, camera);
    if (!still && !document.hidden) raf = requestAnimationFrame(frame);
  };

  const step = (dt) => {
    for (const a of active) {
      for (const c of a.chars) {
        const wp = c.root.getWorldPosition(new Vector3());
        const hx = wp.x, hy = wp.y + (c.hips.position.y + NECK_Y + HEAD_UP * 0.6) * env.s;
        const dx = env.pointer.x - hx, dy = (env.H - env.pointer.y) - hy;
        const d = Math.hypot(dx, dy);
        const near = d < Math.max(120, env.s * 5.2);
        c.att = damp(c.att, near ? 1 : 0, near ? 5 : 2.5, dt);
        if (near) { // look towards the cursor, else ease back to the act
          c.look.x = damp(c.look.x, clamp(dx / 160, -1, 1), 6, dt);
          c.look.y = damp(c.look.y, clamp(-dy / 160, -1, 1), 6, dt);
        }
        // fur tips trail movement a little
        if (a !== acts.runners) {
          const vx = (wp.x - c.prev.x) / Math.max(dt, 1e-3) / (env.s * 10);
          c.lag.value.set(damp(c.lag.value.x, -clamp(vx, -1, 1), 6, dt), 0, 0);
        }
        c.prev.copy(wp);
      }
      a.update(t, dt, env);
    }
  };

  layout();
  if (still) {
    // one finished frame: everyone mid-act
    acts.runners.spawn(0, env.W * 0.3);
    Object.assign(acts.football, { phase: 'roll', t: 0.5, dur: 1.2 });
    t = 2.35;
    step(0);
  }
  layer.after(canvas); // its own layer, so narrow screens can show it without the doodles' mask (site.css)
  frame(performance.now());
  requestAnimationFrame(() => canvas.classList.add('is-in'));

  let resizing = 0;
  addEventListener('resize', () => {
    clearTimeout(resizing);
    resizing = setTimeout(() => { layout(); if (still || !raf) frame(performance.now()); }, 150);
  });
  if (!still) {
    addEventListener('pointermove', (e) => { env.pointer.x = e.clientX; env.pointer.y = e.clientY; }, { passive: true });
    document.addEventListener('pointerleave', () => { env.pointer.x = env.pointer.y = -1e4; });
    document.addEventListener('visibilitychange', () => {
      if (!document.hidden && !raf) { last = performance.now() / 1000; raf = requestAnimationFrame(frame); }
    });
  }
  canvas.addEventListener('webglcontextlost', () => { cancelAnimationFrame(raf); canvas.remove(); });

  return {
    // screen rectangles (top-left origin) where the crew plays, for ambient.js to keep doodles out of
    zones: () => active.map((a) => a.zone(env.H)),
  };
}
