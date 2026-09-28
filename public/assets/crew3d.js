// The Demaze crew: plush characters living behind the page, drawn with Three.js on one fixed, full-viewport canvas
// (with their route drawn as SVG under it). ambient.js imports this module after the page has loaded (never on
// Save-Data) and calls start().
//
// Each character is a little plush: cream-to-marker-coloured fur (shell texturing: every furry part is drawn as a
// stack of shells, one GPU instance each, and a fragment shader keeps only the strands, hashed from 3D cells on the
// rest surface, dark at the root and catching light at the tips), a smooth cream face, glossy black eyes, pink cheeks
// and a small smile. Accessories (a cap, a bow, glasses, headphones) tell them apart.
//
// They work the Demaze process on a maze route down the right margin: an idea is had, designed, built and launched,
// over and over (see "the journey" below). They watch the idea as it travels, and near the cursor they turn and
// wave. They play where the right margin has room for them (wide screens); with reduced motion they hold one moment
// of the journey and the canvas is drawn once.
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

// fur: the cream plush and softened marker colours (site.css --sun, --mint, --lilac)
const FUR = { cream: '#eee1cb', honey: '#f1c878', mint: '#93d8bf', lilac: '#c4b3f2' };
const FACE = '#f7efe2';
const INK = '#1d1c1a';

/* ---------- lights (shared by the standard materials and the fur shader) ---------- */

const KEY_DIR = new Vector3(-0.55, 0.75, 0.62).normalize();
const FILL_DIR = new Vector3(0.85, 0.05, 0.5).normalize();
const KEY = new Color('#fff4e6').multiplyScalar(2.5);
const FILL = new Color('#dfe8ff').multiplyScalar(0.55);
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
    glow: canvasTexture(64, 64, (c, w, h) => glow(c, w, h, [[0, 'rgba(255,255,255,1)'], [0.35, 'rgba(255,255,255,0.45)'], [1, 'rgba(255,255,255,0)']])),
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

const halo = (color, size) => {
  const sp = new THREE.Sprite(new THREE.SpriteMaterial({ map: T.glow, color, transparent: true, depthWrite: false, blending: THREE.AdditiveBlending, toneMapped: false }));
  sp.scale.setScalar(size);
  return sp;
};

// A light bulb: the idea, before it is had.
function bulb() {
  const g = new Group();
  const glass = std('#fff8e1', 0.2, { emissive: new Color('#ffcb45'), emissiveIntensity: 0, transparent: true, opacity: 0.92 });
  part(g, G.small, glass, [0, 0.12, 0], [0.3, 0.32, 0.3]);
  part(g, new THREE.CylinderGeometry(0.12, 0.1, 0.2, 14), std('#b9bdc8', 0.35, { metalness: 0.4 }), [0, -0.22, 0]);
  const h = halo('#ffcb45', 1.6);
  h.position.y = 0.12;
  g.add(h);
  return { g, glass, halo: h };
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
  const h = halo('#ff9a4a', 1.4);
  h.position.y = -0.35;
  flame.add(h);
  flame.scale.setScalar(0);
  return { g, body, flame };
}

// The idea itself as it travels: a glowing orb; design gives it a ring, build makes it a thing (a cube).
function idea() {
  const g = new Group();
  const core = part(g, G.small, std('#fff4c8', 0.3, { emissive: new Color('#ffcb45'), emissiveIntensity: 1.1 }), null, [0.2, 0.2, 0.2]);
  const h = halo('#ffcb45', 1.1);
  g.add(h);
  const ring = part(g, new THREE.TorusGeometry(0.34, 0.035, 10, 40), std('#a58bff', 0.3, { emissive: new Color('#a58bff'), emissiveIntensity: 0.4 }));
  ring.rotation.set(1.2, 0.2, 0);
  const cube = part(g, new THREE.BoxGeometry(0.34, 0.34, 0.34), new THREE.MeshPhysicalMaterial({ color: '#3d5afe', roughness: 0.25, clearcoat: 1, clearcoatRoughness: 0.1, emissive: new Color('#3d5afe'), emissiveIntensity: 0.25 }));
  const sh = part(g, G.plane, M.shadow, null, [0.7, 0.45, 1]);
  sh.rotation.x = -Math.PI / 2;
  sh.renderOrder = -1;
  return { g, core, halo: h, ring, cube, sh };
}

/* ---------- the journey ---------- */

// The crew's one act is the Demaze process, run on a maze route down the right margin: at Idea a bulb lights and
// the idea drops out of it; it rolls along the route to Design, where it is sketched and gains a ring; to Build,
// where it hops onto a laptop and is coded into a product; to Launch, where it is loaded into a rocket that lifts
// off, and a new idea is had at the top. Everyone watches the idea travel. Whoever the cursor comes near stops to
// wave, and if it's their turn, the idea waits for them.

const STAGES = [
  { label: 'Idea', mark: '#ffcb45', fur: FUR.cream, acc: 'cap', accColor: '#ffcb45' },
  { label: 'Design', mark: '#a58bff', fur: FUR.lilac, acc: 'bow', accColor: '#ff85b8' },
  { label: 'Build', mark: '#62c1ff', fur: FUR.mint, acc: 'headphones', accColor: '#3d5afe' },
  { label: 'Launch', mark: '#ff6242', fur: FUR.honey, acc: 'glasses' },
];

// [phase, seconds]: the work at each stage, and the road between them
const PHASES = [['idea', 3.4], ['road', 2.2], ['design', 3.4], ['road', 2.2], ['build', 3.6], ['road', 2.2], ['launch', 5]];
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

  // Four stations down the right margin, alternating either side of its middle, as one block centred on the screen.
  // The route runs down the middle and turns in to each station, like a corridor of the maze; it ends at the rocket.
  layout({ W, H, edge, s }) {
    this.W = W; this.H = H; this.s = s; this.edge = edge;
    const cx = W - edge / 2, off = Math.min(1.3 * s + 6, edge / 2 - 1.15 * s - 6); // whole, inside the margin
    const gap = clamp((H - 220) / 3.4, 4.6 * s, 7.4 * s);
    const y0 = H / 2 - 1.5 * gap + 1.4 * s; // the first station's feet (screen y), the block centred
    this.pts = STAGES.map((_, i) => ({ x: i === 3 ? cx + off : cx + (i % 2 ? off : -off), y: y0 + gap * i }));
    this.cx = cx;
    const route = [[this.pts[0].x, this.pts[0].y]], at = [0];
    for (let i = 0; i < 3; i++) {
      const p = this.pts[i], n = this.pts[i + 1];
      route.push([cx, p.y], [cx, n.y]);
      if (i < 2) route.push([n.x, n.y]);
      at.push(route.length - 1);
    }
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
    this.svg.setAttribute('viewBox', `0 0 ${W} ${H}`);
    this.pts.forEach((p, i) => {
      const { disc, text } = this.stops[i];
      disc.setAttribute('cx', p.x); disc.setAttribute('cy', p.y);
      disc.setAttribute('rx', (1.15 * s).toFixed(1)); disc.setAttribute('ry', (0.38 * s).toFixed(1));
      text.setAttribute('x', p.x); text.setAttribute('y', (p.y + 0.38 * s + 13).toFixed(1));
    });
    this.crew.forEach((c, i) => {
      place(c.root, this.pts[i].x, H - this.pts[i].y, s, 20 + i * 5);
      c.face = this.pts[i].x < cx ? 0.38 : -0.38; // turned a little towards the route
    });
    this.pad = { x: cx - 0.1 * s, y: H - this.pts[3].y };
    this.rocket.g.scale.setScalar(s);
    this.orb.g.scale.setScalar(s);
    this.top = this.pts[0].y - 4.4 * s;
  }

  zone() { return { x: this.W - this.edge, y: 0, w: this.edge, h: this.H }; } // the whole right margin is theirs

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
    const [ideaC, designC, buildC, launchC] = this.crew;
    // the cycle's clock: a little faster while the page scrolls; it waits for a station whose worker is waving
    const ph0 = this.phase(this.t);
    const worker = { idea: ideaC, design: designC, build: buildC, launch: launchC }[ph0.name];
    if (!(worker && worker.att > 0.4 && !(ph0.name === 'launch' && ph0.u > 0.8))) this.t = (this.t + dt * (1 + 0.6 * (env.rush - 1))) % CYCLE;
    const ph = this.phase(this.t);
    const u = ph.u, st = [0, 0, 1, 1, 2, 2, 3][ph.i]; // the station the idea is at, or has left
    const o = this.orb;
    // the idea's rest spot at a station: on the route side of its worker; at Launch, the foot of the rocket
    const foot = (i) => (i === 3 ? { x: this.pad.x, y: this.pad.y + 0.2 * s } : { x: this.pts[i].x + (this.pts[i].x < this.cx ? 0.62 : -0.62) * s, y: H - this.pts[i].y + 0.2 * s });
    const wp = (obj) => obj.getWorldPosition(this.v);
    let pos, floor, show = { core: 1, ring: 0, cube: 0 }, bulbLit = 0, done = 0;
    let rocketY = 0, flame = 0, rocketIn = 1, shake = 0;

    // how far the idea has come, for the route's lit part
    const dAt = (i) => this.stationD[i];
    if (ph.name === 'idea') {
      // the bulb flickers on, the idea drops out of it
      const f = u < 0.9 ? 0 : u < 1.3 ? (Math.sin(u * 60) > 0 ? 1 : 0.2) : u < 2.9 ? 1 : 1 - smooth(clamp((u - 2.9) / 0.5, 0, 1));
      bulbLit = f;
      const from = wp(this.bulb.g).clone(), to = foot(0);
      const k = smooth(clamp((u - 1.8) / 0.8, 0, 1));
      pos = { x: lerp(from.x, to.x, k), y: lerp(from.y, to.y, k) + Math.sin(k * Math.PI) * 0.6 * s };
      show.core = smooth(clamp((u - 1.5) / 0.4, 0, 1));
      floor = to.y;
      done = 0;
    } else if (ph.name === 'road') {
      const k = smooth(u / ph.dur);
      const d = lerp(dAt(st), dAt(st + 1), k);
      const p = this.at(d);
      const a = foot(st), b = foot(st + 1);
      // leave the rest spot onto the route, travel, step off at the next
      const edge = Math.min(1, Math.min(k, 1 - k) / 0.12);
      pos = { x: lerp(k < 0.5 ? a.x : b.x, p.x, edge), y: lerp(k < 0.5 ? a.y : b.y, p.y, edge) + 0.22 * s * edge };
      show = { core: st >= 2 ? 0 : 1, ring: st === 1 ? 1 : 0, cube: st >= 2 ? 1 : 0 };
      floor = pos.y - 0.22 * s * edge;
      done = d / this.total;
    } else if (ph.name === 'design') {
      // up in front of the designer, sketched, a ring drawn round it, and down again
      const a = foot(1);
      const up = smooth(clamp(u / 0.5, 0, 1)) * (1 - smooth(clamp((u - 2.8) / 0.5, 0, 1)));
      pos = { x: a.x - 0.1 * s, y: a.y + up * 1.3 * s + Math.sin(t * 3) * 0.05 * s * up };
      show.ring = smooth(clamp((u - 0.7) / 1.8, 0, 1));
      floor = a.y;
      done = dAt(1) / this.total;
    } else if (ph.name === 'build') {
      // a hop onto the laptop, coded into a thing, a hop back down
      const a = foot(2), top = wp(this.laptop).clone();
      const on = smooth(clamp(u / 0.6, 0, 1)) * (1 - smooth(clamp((u - 2.9) / 0.6, 0, 1)));
      const hop = Math.sin(clamp(u / 0.6, 0, 1) * Math.PI) + Math.sin(clamp((u - 2.9) / 0.6, 0, 1) * Math.PI);
      pos = { x: lerp(a.x, top.x, on), y: lerp(a.y, top.y + 0.55 * s, on) + hop * 0.45 * s };
      const m = smooth(clamp((u - 1.5) / 1, 0, 1));
      show = { core: 1 - m, ring: 1 - m, cube: m };
      floor = on > 0.5 ? top.y + 0.1 * s : a.y; // on the laptop, its shadow falls on the keys
      done = dAt(2) / this.total;
    } else { // launch
      const a = foot(3), hatch = { x: this.pad.x, y: this.pad.y + 1.1 * s };
      const k = smooth(clamp(u / 0.7, 0, 1));
      pos = { x: lerp(a.x, hatch.x, k), y: lerp(a.y, hatch.y, k) + Math.sin(k * Math.PI) * 0.9 * s };
      show = { core: 0, ring: 0, cube: 1 - smooth(clamp((u - 0.5) / 0.25, 0, 1)) };
      floor = lerp(a.y, hatch.y, k);
      shake = u > 0.8 && u < 1.6 ? 1 : 0;
      flame = smooth(clamp((u - 0.9) / 0.4, 0, 1)) * (u < 3.4 ? 1 : 0);
      const lift = Math.max(0, u - 1.5);
      rocketY = 0.5 * 2600 * lift * lift * (s / 30); // accelerating, off the top of the screen by about u = 3.2
      rocketIn = u < 3.9 ? 1 : 0;
      if (u >= 3.9) rocketIn = smooth(clamp((u - 4.1) / 0.5, 0, 1)); // a new one rolls out
      if (u >= 3.9) rocketY = 0;
      done = 1 - smooth(clamp((u - 2.2) / 1.2, 0, 1));
    }
    if (this.still) done = Math.max(done, dAt(2) / this.total);

    // the idea
    o.g.position.set(pos.x, pos.y, 60);
    const vis = Math.max(show.core, show.ring, show.cube);
    o.core.scale.setScalar(0.2 * Math.max(0.001, show.core));
    o.halo.material.opacity = 0.8 * show.core;
    o.ring.scale.setScalar(Math.max(0.001, show.ring));
    o.ring.rotation.z = t * 1.2;
    o.cube.scale.setScalar(Math.max(0.001, show.cube));
    o.cube.rotation.set(0.5 + t * 0.4, t * 0.7, 0);
    o.g.visible = vis > 0.01;
    // its shadow stays on the ground under it, fainter the higher it is
    const height = (pos.y - floor) / s;
    o.sh.position.y = -height - 0.18;
    o.sh.scale.set(0.7 * vis, 0.45 * vis, 1);
    o.sh.visible = height < 3;

    // the bulb and the rocket
    this.bulb.glass.emissiveIntensity = 1.6 * bulbLit;
    this.bulb.halo.material.opacity = 0.9 * bulbLit;
    const r = this.rocket;
    r.g.position.set(this.pad.x + (shake ? Math.sin(t * 70) * 0.03 * s : 0), this.pad.y + rocketY, 10);
    r.body.scale.setScalar(Math.max(0.001, rocketIn));
    r.flame.scale.set(flame, flame * (0.85 + 0.25 * Math.sin(t * 40)), flame);
    r.g.visible = rocketIn > 0.01 && this.pad.y + rocketY < H + 80;

    this.svgProgress = done;

    // the crew: each watches the idea and does their part when it's with them
    this.crew.forEach((c, i) => {
      const p = pose0();
      const cw = c.root.position;
      const headY = cw.y + (NECK_Y + HEAD_UP * 0.6) * s;
      const tx = (ph.name === 'launch' && u > 1.4 && i === 3) ? r.g.position.x : pos.x;
      const ty = (ph.name === 'launch' && u > 1.4 && i === 3) ? Math.min(r.g.position.y, H) : pos.y;
      const lx = clamp((tx - cw.x) / (5 * s), -1, 1), ly = clamp((ty - headY) / (5 * s), -1, 1);
      p.yaw = c.face;
      p.hy = clamp(lx * 0.9 - c.face * 0.6, -0.9, 0.9);
      p.hx = clamp(-ly * 0.45, -0.45, 0.35);
      p.bob = 0.012 * Math.sin(t * 2.1 + i * 1.3);
      const mine = st === i && ph.name !== 'road';
      if (i === 0) { // Idea: points at the bulb, jumps when it lights
        const lit = ph.name === 'idea' ? smooth(clamp((u - 0.3) / 0.5, 0, 1)) * (1 - smooth(clamp((u - 2.8) / 0.5, 0, 1))) : 0;
        p.arz = lerp(-0.38, -2.55, lit); p.arx = -0.2 * lit;
        const jump = ph.name === 'idea' ? Math.max(0, Math.sin(clamp((u - 1.25) / 0.45, 0, 1) * Math.PI)) : 0;
        p.bob += jump * 0.35;
        p.alz = 0.38 + jump * 0.9;
        if (ph.name === 'idea' && u < 1.8) p.hx = -0.35; // looking up at the bulb
      } else if (i === 1) { // Design: sketches in the air round the idea
        const work = mine ? smooth(clamp((u - 0.4) / 0.4, 0, 1)) * (1 - smooth(clamp((u - 2.7) / 0.4, 0, 1))) : 0;
        p.arx = lerp(-0.1, -1.25 + Math.sin(t * 7) * 0.18, work);
        p.arz = lerp(-0.38, -0.2 + Math.cos(t * 7) * 0.14, work);
        p.lean = 0.08 * work;
      } else if (i === 2) { // Build: sits with the laptop, typing in bursts while the idea is on it
        p.llx = -1.5; p.lrx = -1.5;
        p.bob = -0.24 + 0.01 * Math.sin(t * 2);
        p.lean = 0.12;
        const typing = mine && u > 0.5 && u < 2.9 ? 1 : 0.25 * Math.max(0, Math.sin(t * 0.7));
        const tap = (k) => Math.max(0, Math.sin(t * 17 + k)) * 0.08 * typing;
        p.alx = -0.72 - tap(0); p.arx = -0.72 - tap(1.7);
        p.alz = 0.12; p.arz = -0.12;
        if (mine) p.hx = Math.max(p.hx, 0.2);
        this.laptop.rotation.x = 0.05 - p.lean;
      } else { // Launch: cheers the rocket up, then waves it off
        const cheer = ph.name === 'launch' ? smooth(clamp((u - 1.4) / 0.4, 0, 1)) * (1 - smooth(clamp((u - 3.4) / 0.5, 0, 1))) : 0;
        p.alz = lerp(0.38, 2.5 + Math.sin(t * 9) * 0.2, cheer);
        p.arz = lerp(-0.38, -2.5 - Math.sin(t * 9 + 1) * 0.2, cheer);
        p.bob += cheer * Math.abs(Math.sin(t * 9)) * 0.08;
      }
      blink(c, dt, t);
      apply(c, wave(c, p, t, env, false));
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

  const journey = new Journey(scene, still);
  const env = { W: 0, H: 0, still, rush: 1, pointer: { x: -1e4, y: -1e4 } };
  let on = false; // the crew plays only where the right margin has room for them

  const layout = () => {
    const W = innerWidth, H = innerHeight;
    env.W = W; env.H = H;
    const edge = (W - Math.min(1200, W - 48)) / 2;
    on = edge >= 84 && H >= 560;
    canvas.hidden = journey.svg.hidden = !on;
    if (!on) return;
    const px = clamp(edge * 0.55, 60, 80); // a character's height
    const s = px / HEIGHT;
    env.s = s;
    // a full-viewport canvas: 1.5 device pixels per CSS pixel at most keeps the GPU's fill cheap; the fur's strands
    // are sized to the pixels they land on
    const dpr = Math.min(devicePixelRatio || 1, 1.5);
    furShared.uDensity.value = clamp((s * dpr) / 1.2, 18, 44);
    renderer.setPixelRatio(dpr);
    renderer.setSize(W, H, false);
    camera.left = 0; camera.right = W; camera.top = H; camera.bottom = 0;
    camera.updateProjectionMatrix();
    journey.layout({ W, H, edge, s });
  };

  let last = performance.now() / 1000, t = 0, raf = 0, lastScroll = scrollY, rushAim = 1;
  const frame = (nowMs) => {
    raf = 0;
    if (!on) return;
    const now = nowMs / 1000;
    const dt = Math.min(0.05, Math.max(0, now - last));
    last = now;
    t += dt;
    // scroll speed (px/s) hurries the idea along; it eases back when the page stops
    const v = Math.abs(scrollY - lastScroll) / Math.max(dt, 1e-3);
    lastScroll = scrollY;
    rushAim = damp(rushAim, 1 + Math.min(1.5, v / 900), v > 0 ? 6 : 2, dt);
    env.rush = rushAim;
    step(dt);
    renderer.render(scene, camera);
    journey.draw();
    if (!still && !document.hidden) raf = requestAnimationFrame(frame);
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
  layer.after(journey.svg, canvas); // their own layers above the doodles (site.css)
  frame(performance.now());
  requestAnimationFrame(() => { canvas.classList.add('is-in'); journey.svg.classList.add('is-in'); });

  let resizing = 0;
  addEventListener('resize', () => {
    clearTimeout(resizing);
    resizing = setTimeout(() => { layout(); if (on && (still || !raf)) { last = performance.now() / 1000; frame(performance.now()); } }, 150);
  });
  if (!still) {
    addEventListener('pointermove', (e) => { env.pointer.x = e.clientX; env.pointer.y = e.clientY; }, { passive: true });
    document.addEventListener('pointerleave', () => { env.pointer.x = env.pointer.y = -1e4; });
    document.addEventListener('visibilitychange', () => {
      if (!document.hidden && !raf && on) { last = performance.now() / 1000; raf = requestAnimationFrame(frame); }
    });
  }
  canvas.addEventListener('webglcontextlost', () => { cancelAnimationFrame(raf); canvas.remove(); journey.svg.remove(); });

  return {
    // screen rectangles (top-left origin) where the crew plays, for ambient.js to keep doodles out of
    zones: () => (on ? [journey.zone()] : []),
  };
}
