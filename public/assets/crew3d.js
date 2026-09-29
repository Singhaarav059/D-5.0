// The Demaze crew: plush characters drawn with Three.js on one canvas (with their route drawn as SVG under it), in
// the crew band of the contact block ([data-crew]). ambient.js imports this module after the page has loaded (never
// on Save-Data) and calls start().
//
// Each character is a little plush: cream-to-marker-coloured fur (shell texturing: every furry part is drawn as a
// stack of shells, one GPU instance each, and a fragment shader keeps only the strands, hashed from 3D cells on the
// rest surface, dark at the root and catching light at the tips), a smooth cream face, glossy black eyes, pink cheeks
// and a small smile. Accessories (a cap, a bow, glasses, headphones) tell them apart.
//
// They work the Demaze process on a maze route: an idea is had, designed, built and launched, over and over (see
// "the journey" below). They watch the idea as it travels, and near the cursor they turn and wave (on touch screens,
// a tap near them). They are drawn only while the band is on screen. With reduced motion they hold one moment of the
// journey and the canvas is drawn once.
//
// The camera is orthographic in CSS pixels (world y up, 0 at the bottom of the canvas), so placing a character is
// placing it on the canvas.

import * as THREE from './vendor/three/three.module.js';

const { Color, Vector3, Group, Mesh } = THREE;
const TAU = Math.PI * 2;
const clamp = (v, a, b) => Math.min(b, Math.max(a, v));
const lerp = (a, b, t) => a + (b - a) * t;
const damp = (a, b, k, dt) => a + (b - a) * (1 - Math.exp(-k * dt));
const smooth = (t) => t * t * (3 - 2 * t);
const rnd = (a, b) => a + Math.random() * (b - a);

const SHELLS = 22;

/* ---------- palette ---------- */

// fur: the cream plush and softened marker colours (site.css --sun, --mint, --lilac)
const FUR = { cream: '#eee1cb', honey: '#f1c878', mint: '#93d8bf', lilac: '#c4b3f2' };
const FACE = '#f7efe2';
const INK = '#1d1c1a';

/* ---------- lights (shared by the standard materials and the fur shader) ---------- */

const KEY_DIR = new Vector3(-0.55, 0.75, 0.62).normalize();
const FILL_DIR = new Vector3(0.85, 0.05, 0.5).normalize();
const KEY = new Color('#fff1de').multiplyScalar(2.8);
const FILL = new Color('#dfe8ff').multiplyScalar(0.5);
const SKY = new Color('#fffaf2').multiplyScalar(0.95);
const GROUND = new Color('#b4b9c9').multiplyScalar(0.95); // the page's cool light bouncing up

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
    float rad = 0.64 * (1.0 - t * t * 0.85);
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
  vec3 base = uColor * (0.97 + 0.05 * r.y); // (a strong per-strand tint read as grain at this size)
  float ao = mix(0.72, 1.0, pow(vH, 0.7));
  vec3 col = base * (amb + uKeyCol * key * key + uFillCol * fill) * ao;
  // sheen at the silhouette and on the lit tips
  float rim = pow(1.0 - clamp(N.z, 0.0, 1.0), 3.0);
  col += (uKeyCol * 0.34 + base * 0.16) * rim * vH; // a brighter rim keeps the silhouette clean on dark and coloured grounds
  col += base * 0.1 * vH * key;
  gl_FragColor = vec4(col, alpha);
  #include <tonemapping_fragment>
  #include <colorspace_fragment>
}`;

// `density`: the strand-size uniform of the scene the character is in (each scene sizes strands to its own pixels)
function furMaterial(color, lag, len, density = furShared.uDensity) {
  return new THREE.ShaderMaterial({
    glslVersion: THREE.GLSL3,
    uniforms: { ...furShared, uDensity: density, uColor: color, uLag: lag, uLen: { value: len } },
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
    logo: canvasTexture(64, 64, (c) => {
      c.fillStyle = '#f7f4ee';
      c.beginPath(); c.moveTo(18, 14); c.lineTo(50, 32); c.lineTo(18, 50); c.lineTo(27, 32); c.fill();
    }),
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
    alu: std('#e2dfd9', 0.42),
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

function makeCharacter({ fur, acc, accColor = '#ff6242', side = 1, density }) {
  const color = { value: new Color(fur) };
  const lag = { value: new Vector3() };
  const furM = (len) => furMaterial(color, lag, len, density);
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
// sq: squash (+) and stretch (-) of the body; br: breath.
const REST = { yaw: 0, bob: 0, lean: 0, twist: 0, sway: 0, hx: 0, hy: 0, hz: 0, alx: 0, alz: 0.38, arx: 0, arz: -0.38, llx: 0, lrx: 0, sit: 0, sq: 0, br: 0 };
const pose0 = () => ({ ...REST });

// The pose a character shows follows the pose it is given through a spring on every joint, so every change eases in,
// overshoots a touch and settles, the same way for all of them (no snapping between acts). Arms are stiffer, so
// typing and waving stay quick; the head lags the body a little, for follow-through.
const STIFF = { alx: 420, alz: 420, arx: 420, arz: 420, hx: 150, hy: 150, hz: 150, sq: 520, br: 400, bob: 300 };
function apply(c, target, dt = 0) {
  if (!c.cur || !dt) { c.cur = { ...target }; c.vel = {}; for (const k in target) c.vel[k] = 0; }
  else {
    const h = Math.min(dt, 1 / 30);
    for (const k in target) {
      const kk = STIFF[k] || 220, d = 2 * Math.sqrt(kk) * 0.78; // a little under critical: a small, soft overshoot
      c.vel[k] += ((target[k] - c.cur[k]) * kk - c.vel[k] * d) * h;
      c.cur[k] += c.vel[k] * h;
    }
  }
  const p = c.cur;
  c.root.rotation.y = p.yaw;
  c.hips.position.y = p.bob;
  c.torso.rotation.set(p.lean, p.twist, p.sway);
  c.head.rotation.set(p.hx, p.hy, p.hz);
  c.arms[1].rotation.set(p.alx, 0, p.alz); // the character's left arm (x > 0)
  c.arms[0].rotation.set(p.arx, 0, p.arz);
  c.legs[1].rotation.x = p.llx;
  c.legs[0].rotation.x = p.lrx;
  // squash and stretch keep the volume; the breath lifts the chest
  const sq = clamp(p.sq, -1, 1);
  c.body.scale.set(0.76 * (1 + sq * 0.08), 0.66 * (1 - sq * 0.13 + p.br), 0.66 * (1 + sq * 0.08));
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
  return g;
}

// A light bulb: the idea, before it is had.
function bulb() {
  const g = new Group();
  const glass = std('#fff8e1', 0.2, { emissive: new Color('#ffcb45'), emissiveIntensity: 0, transparent: true, opacity: 0.92 });
  part(g, G.small, glass, [0, 0.12, 0], [0.3, 0.32, 0.3]);
  part(g, new THREE.CylinderGeometry(0.12, 0.1, 0.2, 14), std('#b9bdc8', 0.35, { metalness: 0.4 }), [0, -0.22, 0]);
  return { g, glass };
}

// A pencil for the designer's hand.
function pencil() {
  const g = new Group();
  part(g, new THREE.CylinderGeometry(0.055, 0.055, 0.46, 10), std('#a58bff', 0.5), [0, 0, 0]);
  part(g, new THREE.ConeGeometry(0.055, 0.14, 10), std('#f3d9b4', 0.7), [0, -0.3, 0]).rotation.x = Math.PI;
  part(g, new THREE.ConeGeometry(0.022, 0.05, 8), M.ink, [0, -0.36, 0]).rotation.x = Math.PI;
  return g;
}

// A small rocket: the product's ride out.
function rocket() {
  const g = new Group();
  const body = new Group();
  g.add(body);
  const white = std('#f7f8fb', 0.32), red = std('#ff6242', 0.45);
  part(body, new THREE.CylinderGeometry(0.25, 0.3, 0.95, 22), white, [0, 0.78, 0]);
  part(body, new THREE.ConeGeometry(0.25, 0.46, 22), red, [0, 1.48, 0]);
  const win = part(body, new THREE.CircleGeometry(0.11, 20), std('#62c1ff', 0.15, { emissive: new Color('#62c1ff'), emissiveIntensity: 0.25 }), [0, 0.96, 0.265]);
  win.rotation.x = -0.05;
  for (let k = 0; k < 3; k++) {
    const fin = part(body, new THREE.BoxGeometry(0.05, 0.36, 0.26), red, [0, 0.42, 0]);
    fin.rotation.y = (k / 3) * TAU + 0.5;
    fin.translateZ(0.3);
  }
  const flame = new Group();
  flame.position.y = 0.26;
  body.add(flame);
  part(flame, new THREE.ConeGeometry(0.17, 0.55, 16), new THREE.MeshBasicMaterial({ color: '#ffcb45', toneMapped: false, transparent: true, opacity: 0.95 }), [0, -0.3, 0]).rotation.x = Math.PI;
  part(flame, new THREE.ConeGeometry(0.09, 0.32, 12), new THREE.MeshBasicMaterial({ color: '#ffffff', toneMapped: false }), [0, -0.2, 0.01]).rotation.x = Math.PI;
  flame.scale.setScalar(0);
  return { g, body, flame };
}

// The idea itself as it travels: a glowing orb; design gives it a ring, build makes it a thing (a cube).
function idea() {
  const g = new Group();
  const core = part(g, G.small, std('#fff4c8', 0.3, { emissive: new Color('#ffcb45'), emissiveIntensity: 1.1 }), null, [0.2, 0.2, 0.2]);
  const ring = part(g, new THREE.TorusGeometry(0.34, 0.035, 10, 40), std('#a58bff', 0.3, { emissive: new Color('#a58bff'), emissiveIntensity: 0.4 }));
  ring.rotation.set(1.2, 0.2, 0);
  const cube = part(g, new THREE.BoxGeometry(0.34, 0.34, 0.34), new THREE.MeshPhysicalMaterial({ color: '#3d5afe', roughness: 0.25, clearcoat: 1, clearcoatRoughness: 0.1, emissive: new Color('#3d5afe'), emissiveIntensity: 0.25 }));
  const sh = part(g, G.plane, M.shadow, null, [0.7, 0.45, 1]);
  sh.rotation.x = -Math.PI / 2;
  sh.renderOrder = -1;
  return { g, core, ring, cube, sh };
}

/* ---------- the journey ---------- */

// The crew's one act is the Demaze process, run as a relay along a maze route. Idea thinks; a bulb lights over their
// head, they jump, and the idea drops into their hands. Each worker throws it on to the next (a wind-up, an arc, the
// route lighting up under it), and the next turns, holds their arms out and catches it with a squash. Design holds it
// up and sketches a ring round it; Build codes it on the laptop until it pops into a product; Launch lobs it into the
// rocket, counts down on a raised hand, and everyone looks up and cheers the rocket off, a ripple down the line. Then
// a new rocket rolls out, and a new idea. Everyone watches the idea travel. Whoever the cursor comes near stops to
// wave, and if it's their turn, the idea waits for them.

const STAGES = [
  { label: 'Idea', mark: '#ffcb45', fur: FUR.cream, acc: 'cap', accColor: '#ffcb45' },
  { label: 'Design', mark: '#a58bff', fur: FUR.lilac, acc: 'bow', accColor: '#ff85b8' },
  { label: 'Build', mark: '#62c1ff', fur: FUR.mint, acc: 'headphones', accColor: '#3d5afe' },
  { label: 'Launch', mark: '#ff6242', fur: FUR.honey, acc: 'glasses' },
];

// [phase, seconds]: the work at each stage, and the road between them
const PHASES = [['idea', 3.6], ['toss', 1.25], ['design', 3.4], ['toss', 1.25], ['build', 3.6], ['toss', 1.25], ['launch', 5.8]];
const CYCLE = PHASES.reduce((a, [, d]) => a + d, 0);

const SVGNS = 'http://www.w3.org/2000/svg';
const svgEl = (name, attrs = {}) => {
  const el = document.createElementNS(SVGNS, name);
  for (const k in attrs) el.setAttribute(k, attrs[k]);
  return el;
};

class Journey {
  constructor(scene, still) {
    this.group = new Group();
    scene.add(this.group);
    this.still = still;
    this.crew = STAGES.map((st) => {
      const c = makeCharacter(st);
      this.group.add(c.root);
      return c;
    });
    this.chars = this.crew;
    for (const c of this.crew) c.palms = [0, 1].map((k) => { const h = new Group(); h.position.set(0, -0.62, 0.14); c.arms[k].add(h); return h; });
    const [ideaC, designC, buildC] = this.crew;
    this.bulb = bulb();
    ideaC.root.add(this.bulb.g);
    this.bulb.g.position.set(-0.55, 4.05, 0.2);
    this.bulb.g.scale.setScalar(0.9);
    this.pencil = pencil();
    designC.arms[0].add(this.pencil);
    this.pencil.position.set(0, -0.66, 0.1);
    this.pencil.rotation.x = -0.5;
    this.laptop = laptop();
    buildC.torso.add(this.laptop);
    this.laptop.position.set(0, 0.27, 0.62);
    this.rocket = rocket();
    this.group.add(this.rocket.g);
    this.orb = idea();
    this.group.add(this.orb.g);
    this.t = 0;
    this.v = new Vector3();

    // the route, its stations and their names, drawn crisp as SVG under the canvas
    this.svg = svgEl('svg', { class: 'amb__route', 'aria-hidden': 'true' });
    this.glowPath = this.svg.appendChild(svgEl('path', { class: 'amb__route-glow', pathLength: '1' }));
    this.linePath = this.svg.appendChild(svgEl('path', { class: 'amb__route-line' }));
    this.donePath = this.svg.appendChild(svgEl('path', { class: 'amb__route-done', pathLength: '1' }));
    this.stops = STAGES.map((st) => {
      const g = this.svg.appendChild(svgEl('g', { class: 'amb__stop', style: `--mk:${st.mark}` }));
      const disc = g.appendChild(svgEl('ellipse'));
      const text = g.appendChild(svgEl('text'));
      text.textContent = st.label;
      return { g, disc, text };
    });
  }

  // Four stations in a row across the crew band, stepping up and down like a corridor of the maze. The route runs
  // just in front of their feet, so the idea rolls past them rather than through them, and ends at the rocket,
  // beside Launch.
  layout({ W, H, s }) {
    this.W = W; this.H = H; this.s = s;
    const sp = (W - 3.9 * s) / 3, base = H - 0.55 * s - 24, jog = 0.5 * s;
    this.pts = STAGES.map((_, i) => ({ x: 1.3 * s + i * sp, y: base - (i % 2 ? jog : 0) }));
    const ry = (i) => this.pts[i].y + 0.55 * s;
    const route = [[this.pts[0].x - 0.9 * s, ry(0)]], at = [];
    for (let i = 0; i < 3; i++) {
      const mx = (this.pts[i].x + this.pts[i + 1].x) / 2;
      route.push([this.pts[i].x + 0.7 * s, ry(i)]);
      at.push(route.length - 1);
      route.push([mx, ry(i)], [mx, ry(i + 1)]);
    }
    route.push([this.pts[3].x + 1.7 * s, ry(3)]);
    at.push(route.length - 1);
    this.pad = { x: route[route.length - 1][0], y: H - ry(3) };
    this.rest = this.pts.map((p, i) => (i === 3 ? { x: this.pad.x, y: this.pad.y + 0.2 * s } : { x: p.x + 0.7 * s, y: H - ry(i) + 0.2 * s }));
    this.crew.forEach((c) => { c.face = 0.3; }); // turned a little towards where the idea goes
    this.trace(route, at, this.pts.map((_, i) => ry(i) + 15));
  }

  // The route (screen points), the indices of its stations, and where each station's name goes: measured, drawn,
  // and the crew put on their stations.
  trace(route, at, labelY) {
    const { H, s } = this;
    this.route = route.map(([x, y]) => ({ x, y: H - y })); // world (y up)
    this.segs = [];
    const dist = [0];
    for (let i = 1; i < this.route.length; i++) {
      const a = this.route[i - 1], b = this.route[i], len = Math.hypot(b.x - a.x, b.y - a.y);
      this.segs.push({ a, b, d0: dist[i - 1], len });
      dist.push(dist[i - 1] + len);
    }
    this.total = dist[dist.length - 1];
    this.stationD = at.map((k) => dist[k]);
    const dAttr = route.map(([x, y], i) => `${i ? 'L' : 'M'}${x.toFixed(1)} ${y.toFixed(1)}`).join('');
    for (const p of [this.glowPath, this.linePath, this.donePath]) p.setAttribute('d', dAttr);
    this.svg.setAttribute('viewBox', `0 0 ${this.W} ${H}`);
    this.pts.forEach((p, i) => {
      const { disc, text } = this.stops[i];
      disc.setAttribute('cx', p.x); disc.setAttribute('cy', p.y);
      disc.setAttribute('rx', (1.15 * s).toFixed(1)); disc.setAttribute('ry', (0.38 * s).toFixed(1));
      text.setAttribute('x', p.x); text.setAttribute('y', labelY[i].toFixed(1));
    });
    this.crew.forEach((c, i) => place(c.root, this.pts[i].x, H - this.pts[i].y, s, 20 + i * 5));
    this.rocket.g.scale.setScalar(s);
    this.orb.g.scale.setScalar(s);
  }


  at(d) { // a point on the route, d pixels along it
    d = clamp(d, 0, this.total);
    for (const sg of this.segs) if (d <= sg.d0 + sg.len) {
      const u = sg.len ? (d - sg.d0) / sg.len : 0;
      return { x: lerp(sg.a.x, sg.b.x, u), y: lerp(sg.a.y, sg.b.y, u) };
    }
    return this.route[this.route.length - 1];
  }

  // where the cycle is: phase index, name, seconds into it, and its length
  phase(t) {
    let acc = 0;
    for (let i = 0; i < PHASES.length; i++) {
      const [name, dur] = PHASES[i];
      if (t < acc + dur) return { i, name, u: t - acc, dur };
      acc += dur;
    }
    return { i: PHASES.length - 1, name: 'launch', u: PHASES[PHASES.length - 1][1], dur: PHASES[PHASES.length - 1][1] };
  }

  update(t, dt, env) {
    const s = this.s, H = this.H;
    const crew = this.crew, [, , buildC] = crew;
    // the cycle's clock: a little faster while the page scrolls; it waits for a station whose worker is waving (never
    // mid-throw, never once the rocket is lit)
    const ph0 = this.phase(this.t);
    const worker = { idea: 0, design: 1, build: 2, launch: 3 }[ph0.name];
    const hold = worker !== undefined && crew[worker].att > 0.4 && !(ph0.name === 'launch' && ph0.u > 0.8);
    if (!hold) this.t = (this.t + dt * (1 + 0.6 * (env.rush - 1))) % CYCLE;
    const ph = this.phase(this.t);
    const u = ph.u, st = [0, 0, 1, 1, 2, 2, 3][ph.i]; // the station the idea is at, or is flying from
    const o = this.orb, r = this.rocket;
    const wp = (obj) => obj.getWorldPosition(this.v);
    const ramp = (a, b) => smooth(clamp((u - a) / (b - a), 0, 1)); // 0 before a, 1 after b, eased
    const bump = (a, b) => Math.sin(clamp((u - a) / (b - a), 0, 1) * Math.PI); // up and down between a and b
    // where a character holds the idea: between the palms (Design holds it up in one hand, Build on the laptop)
    const palms = (i) => {
      const c = crew[i], a = wp(c.palms[0]).clone(), b = wp(c.palms[1]);
      return { x: (a.x + b.x) / 2, y: (a.y + b.y) / 2 + 0.16 * s };
    };
    const holdAt = (i) => {
      if (i === 1) { const p = wp(crew[1].palms[1]); return { x: p.x - 0.05 * s, y: p.y + 0.16 * s }; }
      if (i === 2 && !(ph.name === 'build' && u > 2.9) && ph.name !== 'toss') { const p = wp(this.laptop); return { x: p.x, y: p.y + 0.5 * s }; }
      return palms(i);
    };
    const dAt = (i) => this.stationD[i];
    let pos, floor, show = { core: 1, ring: 0, cube: 0 }, bulbLit = 0, done = 0, flight = null, pop = 0;
    let rocketY = 0, flame = 0, rocketIn = 1, shake = 0;

    if (ph.name === 'idea') {
      // the bulb flickers on over Idea's head; the idea drops out of it into Idea's hands
      bulbLit = u < 0.9 ? 0 : u < 1.3 ? (Math.sin(u * 60) > 0 ? 1 : 0.25) : u < 2.9 ? 1 : 1 - ramp(2.9, 3.4);
      const from = wp(this.bulb.g).clone(), to = holdAt(0), k = ramp(1.8, 2.45);
      pos = { x: lerp(from.x, to.x, k), y: lerp(from.y, to.y, k) + Math.sin(k * Math.PI) * 0.35 * s };
      show.core = ramp(1.5, 1.85);
      floor = this.rest[0].y;
    } else if (ph.name === 'toss') {
      // thrown in an arc to the next one, who catches it
      const k = clamp((u - 0.38) / 0.62, 0, 1);
      const a = holdAt(st), b = holdAt(st + 1);
      if (u < 0.38) pos = a;
      else {
        const lift = 1.25 * s + Math.abs(b.x - a.x) * 0.08;
        pos = { x: lerp(a.x, b.x, k), y: lerp(a.y, b.y, k) + 4 * lift * k * (1 - k) };
        flight = { vx: (b.x - a.x), vy: (b.y - a.y) + 4 * lift * (1 - 2 * k) };
      }
      show = { core: st >= 2 ? 0 : 1, ring: st === 1 ? 1 : 0, cube: st >= 2 ? 1 : 0 };
      floor = lerp(this.rest[st].y, this.rest[st + 1].y, k);
      done = lerp(dAt(st), dAt(st + 1), smooth(k)) / this.total;
    } else if (ph.name === 'design') {
      // held up in one hand while the other sketches a ring round it
      pos = holdAt(1);
      show.ring = ramp(0.7, 2.4);
      floor = this.rest[1].y;
      done = dAt(1) / this.total;
    } else if (ph.name === 'build') {
      // on the laptop, coded into a product (a pop), lifted up to throw
      pos = holdAt(2);
      const m = ramp(1.5, 2.3);
      pop = bump(1.9, 2.5);
      show = { core: 1 - m, ring: 1 - m, cube: m };
      floor = u > 2.9 ? this.rest[2].y : pos.y - 0.45 * s;
      done = dAt(2) / this.total;
    } else { // launch: loaded into the rocket, a count of three, lift-off, everyone cheering it up
      const hatch = { x: this.pad.x, y: this.pad.y + 1.15 * s }, a = holdAt(3), k = ramp(0.55, 1.0);
      pos = { x: lerp(a.x, hatch.x, k), y: lerp(a.y, hatch.y, k) + Math.sin(k * Math.PI) * 0.8 * s };
      show = { core: 0, ring: 0, cube: 1 - ramp(0.95, 1.1) };
      floor = lerp(this.rest[3].y, this.pad.y, k);
      shake = (u > 1.0 && u < 1.25) || (u > 2.3 && u < 2.9) ? 1 : 0;
      flame = ramp(2.3, 2.6) * (u < 4.4 ? 1 : 0);
      const lift = Math.max(0, u - 2.8);
      rocketY = 0.5 * 2600 * lift * lift * (s / 30);
      rocketIn = u < 4.5 ? 1 : ramp(4.9, 5.4); // a new one rolls out
      if (u >= 4.5) rocketY = 0;
      done = 1 - ramp(3.2, 4.4);
    }
    if (this.still) done = Math.max(done, dAt(2) / this.total);

    // the idea: squashes and stretches along its flight, spins, pops as it changes
    o.g.position.set(pos.x, pos.y, 60);
    const vis = Math.max(show.core, show.ring, show.cube);
    const sp = flight ? Math.min(0.22, Math.hypot(flight.vx, flight.vy) / (60 * s)) : 0;
    o.g.rotation.z = flight ? Math.atan2(flight.vy, flight.vx) - Math.PI / 2 : 0;
    o.core.scale.set(0.24 * (1 - sp * 0.5), 0.24 * (1 + sp), 0.24).multiplyScalar(Math.max(0.001, show.core) * (1 + pop * 0.4));
    o.ring.scale.setScalar(Math.max(0.001, show.ring) * (1 + pop * 0.3));
    o.ring.rotation.z = t * 1.2;
    o.cube.scale.setScalar(Math.max(0.001, show.cube) * (1 + pop * 0.35));
    o.cube.rotation.set(0.5 + t * 0.4 + (flight ? t * 6 : 0), t * 0.7, 0);
    o.g.visible = vis > 0.01;
    // its shadow stays on the ground under it, fainter the higher it is
    const height = (pos.y - floor) / s;
    o.sh.position.set(0, -height - 0.18, 0);
    o.sh.scale.set(0.7 * vis * clamp(1 - height / 4, 0.3, 1), 0.45 * vis * clamp(1 - height / 4, 0.3, 1), 1);
    o.sh.visible = !flight && height < 3;

    // the bulb and the rocket
    this.bulb.glass.emissiveIntensity = 1.6 * bulbLit;
    this.bulb.g.scale.setScalar(0.9 * (1 + 0.15 * bump(0.9, 1.4) * (ph.name === 'idea' ? 1 : 0)));
    r.g.position.set(this.pad.x + (shake ? Math.sin(t * 70) * 0.03 * s : 0), this.pad.y + rocketY, 10);
    r.body.scale.setScalar(Math.max(0.001, rocketIn));
    r.flame.scale.set(flame, flame * (0.85 + 0.25 * Math.sin(t * 40)), flame);
    r.g.visible = rocketIn > 0.01 && this.pad.y + rocketY < H + 80;
    this.svgProgress = done;

    // the crew: each watches the idea, does their part when it's with them, gets ready to catch it, and all of them
    // see the rocket off
    const rocketUp = ph.name === 'launch' && u > 2.3 && u < 4.6;
    crew.forEach((c, i) => {
      const p = pose0();
      const cw = c.root.position;
      const headY = cw.y + (NECK_Y + HEAD_UP * 0.6) * s;
      const tx = rocketUp ? r.g.position.x : pos.x, ty = rocketUp ? Math.min(r.g.position.y + 1.2 * s, H + 40) : pos.y;
      const lx = clamp((tx - cw.x) / (5 * s), -1, 1), ly = clamp((ty - headY) / (4 * s), -1, 1);
      let yaw = c.face;
      // alive while waiting: breathing, a slow weight shift, the odd tilt of the head
      p.bob = 0.012 * Math.sin(t * 2.1 + i * 1.3);
      p.br = 0.022 * Math.sin(t * 1.8 + i * 1.7);
      p.sway = 0.035 * Math.sin(t * 0.8 + i * 2.1);
      p.hz = 0.05 * Math.sin(t * 0.6 + i);
      const turn = (to, k) => { yaw = lerp(yaw, to, k); };
      const holdPose = (k) => { p.alx = lerp(p.alx, -0.95, k); p.arx = lerp(p.arx, -0.95, k); p.alz = lerp(p.alz, 0.14, k); p.arz = lerp(p.arz, -0.14, k); };
      const ready = (k) => { // arms out for the catch, a bounce on the toes
        p.alx = lerp(p.alx, -1.15, k); p.arx = lerp(p.arx, -1.15, k); p.alz = lerp(p.alz, 0.55, k); p.arz = lerp(p.arz, -0.55, k);
        p.bob += 0.05 * Math.abs(Math.sin(t * 9)) * k; p.lean += 0.06 * k;
      };
      const caught = (at) => { const e = bump(at, at + 0.3); p.sq += 0.55 * e; p.lean -= 0.14 * e; p.bob -= 0.05 * e; };
      const throwIt = () => { // two hands up and back, then over and forward, and a follow-through
        const back = ramp(0, 0.3) * (1 - ramp(0.34, 0.46)), fwd = bump(0.34, 0.75);
        p.alx = p.arx = lerp(lerp(-0.95, -2.8, back), -1.25, fwd);
        p.alz = 0.25; p.arz = -0.25;
        p.lean += -0.16 * back + 0.24 * fwd; p.sq += -0.35 * back + 0.25 * fwd;
      };
      if (i === 0) { // Idea: thinks, jumps when the bulb lights, catches the idea, throws it on
        if (ph.name === 'idea') {
          const think = 1 - ramp(0.85, 1.0);
          p.arx = lerp(0, -1.9, think); p.arz = lerp(-0.38, 0.35, think); p.hz += 0.12 * think; p.hx = -0.25;
          const crouch = u > 0.95 && u < 1.25 ? Math.sin(((u - 0.95) / 0.3) * Math.PI * 0.5) : 0;
          const jump = bump(1.25, 1.7), land = bump(1.7, 1.95);
          p.bob += jump * 0.4 - crouch * 0.1; p.sq += crouch * 0.9 - jump * 0.7 + land * 0.6;
          if (u > 1.0 && u < 1.8) { p.alz = 0.38 + jump * 1.9; p.arz = -0.38 - jump * 1.9; }
          if (u > 1.8) { holdPose(ramp(1.8, 2.2)); caught(2.4); }
          if (u > 2.6) { p.hx = 0.3 * (1 - ramp(3.1, 3.3)); p.bob += 0.04 * Math.abs(Math.sin(t * 7)) * (1 - ramp(3.1, 3.3)); } // a delighted look at it
          turn(0.9, ramp(3.0, 3.5));
          if (u < 1.9) p.hx = -0.35; // up at the bulb
        } else if (ph.name === 'toss' && st === 0) { turn(0.9, 1 - ramp(0.8, 1.25)); throwIt(); }
        else if (ph.name === 'launch' && u > 4.9) { turn(0, 0); p.hx = -0.2 * ramp(4.9, 5.4); } // looking up: the next one
      } else if (i === 1) { // Design: ready, catches, holds it up and sketches round it, throws it on
        if (ph.name === 'toss' && st === 0) { turn(-0.8, ramp(0, 0.35)); ready(ramp(0.1, 0.4) * (1 - ramp(1.0, 1.1))); if (u > 1.0) holdPose(1); caught(1.0); }
        else if (ph.name === 'design') {
          turn(-0.8, 1 - ramp(0, 0.4));
          const up = ramp(0.2, 0.6) * (1 - ramp(2.9, 3.2));
          p.alx = lerp(-0.95, -1.3, up); p.alz = lerp(0.14, 0.3, up);
          const work = ramp(0.5, 0.8) * (1 - ramp(2.5, 2.8));
          p.arx = lerp(-0.95, -1.35 + Math.sin(t * 7) * 0.2, Math.max(work, 1 - up)); p.arz = lerp(-0.14, -0.1 + Math.cos(t * 7) * 0.16, work);
          p.lean = 0.08 * work; p.hz += 0.08 * work * Math.sin(t * 2);
          if (u > 2.6) { p.hx = -0.1; p.hy = -0.2; } // holds it off to look
          if (u > 2.9) holdPose(ramp(2.9, 3.2));
          turn(0.9, ramp(3.0, 3.4));
        } else if (ph.name === 'toss' && st === 1) { turn(0.9, 1 - ramp(0.8, 1.25)); throwIt(); }
      } else if (i === 2) { // Build: sits with the laptop, catches, codes it into a product, lifts it, throws it on
        p.llx = -1.5; p.lrx = -1.5;
        p.bob = -0.24 + 0.01 * Math.sin(t * 2);
        p.lean = 0.12;
        const typing = ph.name === 'build' && u > 0.4 && u < 2.8 ? 1 : 0.25 * Math.max(0, Math.sin(t * 0.7));
        const tap = (q) => Math.max(0, Math.sin(t * 17 + q)) * 0.1 * typing;
        p.alx = -0.72 - tap(0); p.arx = -0.72 - tap(1.7);
        p.alz = 0.12; p.arz = -0.12;
        if (ph.name === 'build') {
          p.hx = 0.22 + 0.06 * Math.max(0, Math.sin(t * 11)) * typing; // eyes on it, nodding along
          if (u > 1.9 && u < 2.6) { p.hx = -0.15; p.sq += 0.3 * bump(1.9, 2.3); } // the pop: a jump back
          if (u > 2.8) { const lift = ramp(2.8, 3.1); p.alx = p.arx = lerp(-0.72, -1.2, lift); p.alz = 0.14; p.arz = -0.14; p.hx = 0.1; }
          turn(0.8, ramp(3.1, 3.5));
        } else if (ph.name === 'toss' && st === 1) { turn(-0.6, ramp(0, 0.35) * (1 - ramp(0.9, 1.25))); ready(ramp(0.1, 0.4) * (1 - ramp(0.95, 1.05))); caught(1.0); }
        else if (ph.name === 'toss' && st === 2) { turn(0.8, 1 - ramp(0.8, 1.25)); throwIt(); p.lean += 0.12; }
        this.laptop.rotation.x = 0.05 - p.lean;
      } else { // Launch: ready, catches, loads the rocket, counts down, sees it off
        if (ph.name === 'toss' && st === 2) { turn(-0.8, ramp(0, 0.35)); ready(ramp(0.1, 0.4) * (1 - ramp(1.0, 1.1))); if (u > 1.0) holdPose(1); caught(1.0); }
        else if (ph.name === 'launch') {
          turn(0.9, ramp(0, 0.45) * (1 - ramp(1.15, 1.5)));
          if (u < 1.0) { // an underarm lob into the hatch
            const swing = bump(0.35, 0.95);
            p.alx = p.arx = lerp(-0.95, -0.2, ramp(0.2, 0.45)) + (-1.3 * swing);
            p.alz = 0.2; p.arz = -0.2; p.lean = 0.12 * swing;
          }
          if (u > 1.2 && u < 2.3) { // three, two, one: a finger up, a nod each
            const c3 = Math.floor((u - 1.25) / 0.35), inBeat = ((u - 1.25) % 0.35) / 0.35;
            p.alz = 2.2 + 0.25 * Math.sin(inBeat * Math.PI); p.alx = -0.3;
            if (c3 >= 0 && c3 < 3) p.hx = 0.18 * Math.sin(inBeat * Math.PI);
          }
        }
      }
      // everyone sees the rocket off: they look up after it and cheer, a ripple from Launch down the line
      if (rocketUp) {
        const d = (3 - i) * 0.12, cheer = ramp(2.9 + d, 3.2 + d) * (1 - ramp(4.2 + d, 4.6 + d));
        const hop = i === 2 ? 0 : Math.abs(Math.sin((u - d) * 9));
        p.alz = lerp(p.alz, 2.5 + Math.sin(t * 9 + i) * 0.2, cheer); p.arz = lerp(p.arz, -2.5 - Math.sin(t * 9 + i + 1) * 0.2, cheer);
        p.alx = lerp(p.alx, -0.2, cheer); p.arx = lerp(p.arx, -0.2, cheer);
        p.bob += cheer * hop * 0.14; p.sq += cheer * (0.3 - hop * 0.6);
        turn(0, cheer);
      } else if (ph.name === 'launch' && u > 1.2 && u < 2.3 && i < 3) { p.lean += 0.06; p.hx -= 0.05; } // waiting for it
      p.yaw = yaw;
      p.hy = clamp(lx * 0.9 - yaw * 0.6, -0.9, 0.9);
      p.hx += clamp(-ly * 0.45, -0.5, 0.35);
      blink(c, dt, t);
      apply(c, wave(c, p, t, env, false), this.still ? 0 : dt);
    });
  }

  draw() { // the route lights up behind the idea as it travels
    const off = (1 - this.svgProgress).toFixed(4);
    this.donePath.style.strokeDashoffset = off;
    this.glowPath.style.strokeDashoffset = off;
  }
}

/* ---------- the stage ---------- */

const place = (obj, x, y, s, z = 0) => { obj.position.set(x, y, z); obj.scale.setScalar(s); };

export function start() {
  const band = document.querySelector('[data-crew]');
  if (!band) return null;
  const still = !document.documentElement.classList.contains('motion');
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

  const journey = new Journey(scene, still);
  const env = { W: 0, H: 0, still, rush: 1, pointer: { x: -1e4, y: -1e4 } };
  let on = false, seen = false; // on: the band has room for them; seen: it is on screen
  const client = { x: -1e4, y: -1e4 }; // the pointer, in viewport pixels

  const layout = () => {
    band.classList.add('is-live');
    const W = band.clientWidth;
    on = W >= 240;
    band.classList.toggle('is-live', on);
    canvas.hidden = journey.svg.hidden = !on;
    if (!on) return;
    if (canvas.parentNode !== band) band.append(journey.svg, canvas);
    const s = Math.min(32, W / (W < 600 ? 16 : 12.5)); // a character's scale: at most 114px tall; room between them on phones
    const H = Math.ceil(5 * s + 30);
    band.style.height = H + 'px';
    env.W = W; env.H = H; env.s = s;
    // up to 2 device pixels per CSS pixel, so the fur and faces are crisp on retina screens; the strands are sized to
    // the pixels they land on, a little fuller than one pixel so they read as plush, not grain
    const dpr = Math.min(devicePixelRatio || 1, 2);
    furShared.uDensity.value = clamp((s * dpr) / 1.7, 16, 34);
    renderer.setPixelRatio(dpr);
    renderer.setSize(W, H, false);
    camera.left = 0; camera.right = W; camera.top = H; camera.bottom = 0;
    camera.updateProjectionMatrix();
    journey.layout({ W, H, s });
  };
  const playing = () => on && seen;

  let last = performance.now() / 1000, t = 0, raf = 0, lastScroll = scrollY, rushAim = 1;
  const frame = (nowMs) => {
    raf = 0;
    if (!on || (!still && !playing())) return;
    const now = nowMs / 1000;
    const dt = Math.min(0.05, Math.max(0, now - last));
    last = now;
    t += dt;
    // scroll speed (px/s) hurries the idea along; it eases back when the page stops
    const v = Math.abs(scrollY - lastScroll) / Math.max(dt, 1e-3);
    lastScroll = scrollY;
    rushAim = damp(rushAim, 1 + Math.min(1.5, v / 900), v > 0 ? 6 : 2, dt);
    env.rush = rushAim;
    const box = canvas.getBoundingClientRect();
    env.pointer.x = client.x - box.left; env.pointer.y = client.y - box.top;
    step(dt);
    renderer.render(scene, camera);
    journey.draw();
    if (!still && !document.hidden) raf = requestAnimationFrame(frame);
  };
  const resume = () => {
    if (still || raf || !playing() || document.hidden) return;
    last = performance.now() / 1000;
    raf = requestAnimationFrame(frame);
  };

  const step = (dt) => {
    for (const c of journey.chars) {
      const wp = c.root.position;
      const hx = wp.x, hy = wp.y + (c.hips.position.y + NECK_Y + HEAD_UP * 0.6) * env.s;
      const dx = env.pointer.x - hx, dy = (env.H - env.pointer.y) - hy;
      const near = Math.hypot(dx, dy) < Math.max(70, env.s * 4.5);
      c.att = damp(c.att, near ? 1 : 0, near ? 5 : 2.5, dt);
      if (near) { // look towards the cursor, else ease back to the act
        c.look.x = damp(c.look.x, clamp(dx / 120, -1, 1), 6, dt);
        c.look.y = damp(c.look.y, clamp(-dy / 120, -1, 1), 6, dt);
      }
    }
    journey.update(t, dt, env);
  };

  layout();
  if (still) {
    // one finished frame: the idea mid-journey, on the laptop at Build
    journey.t = PHASES.slice(0, 4).reduce((a, [, d]) => a + d, 0) + 1.2;
    t = 2;
    step(0);
  }
  frame(performance.now());
  requestAnimationFrame(() => { canvas.classList.add('is-in'); journey.svg.classList.add('is-in'); });

  if ('IntersectionObserver' in window) {
    new IntersectionObserver(([e]) => { seen = e.isIntersecting; resume(); }, { rootMargin: '80px 0px' }).observe(band);
  } else seen = true;

  let resizing = 0;
  addEventListener('resize', () => {
    clearTimeout(resizing);
    resizing = setTimeout(() => { layout(); if (still) frame(performance.now()); else resume(); }, 150);
  });
  if (!still) {
    addEventListener('pointermove', (e) => { client.x = e.clientX; client.y = e.clientY; }, { passive: true });
    document.addEventListener('pointerleave', () => { client.x = client.y = -1e4; });
    // on touch screens there is no cursor to come near: a tap near one of them gets a wave for a moment
    let lift = 0;
    addEventListener('pointerdown', (e) => {
      if (e.pointerType === 'mouse') return;
      client.x = e.clientX; client.y = e.clientY;
      clearTimeout(lift);
      lift = setTimeout(() => { client.x = client.y = -1e4; }, 1800);
    }, { passive: true });
    document.addEventListener('visibilitychange', resume);
  }
  canvas.addEventListener('webglcontextlost', () => {
    cancelAnimationFrame(raf);
    on = false;
    canvas.remove(); journey.svg.remove();
    band.classList.remove('is-live');
  });

  // for checks: step the band and draw a frame
  band.crewStep = (dt) => { t += dt; step(dt); renderer.render(scene, camera); journey.draw(); return canvas; };
  return { band };
}

// The character kit, for other scenes (office3d.js): build a character, pose it through its springs, blink, and the
// props and materials they share. `M` and `G` are filled by materials() and assets().
export { THREE, assets, materials, makeCharacter, pose0, apply, blink, laptop, std, part, place, FUR, M, G, furShared, clamp, lerp, damp, smooth, TAU, NECK_Y, HEAD_UP, HIP_Y };
