// The Demaze studio: a small office in 3D (Three.js), with the Muse crew at work in it, in the home page's "who we
// are" section ([data-office]). site.js imports this module and the crew kit (crew3d.js: the characters, their
// springs and props) when the section comes near, and calls start(el, kit).
//
// The room: oak floor, a window with the sun coming through it onto the desks, two desks with laptops and office
// chairs that swivel and roll, pendant lamps, a whiteboard at the crew's height, a kitchenette with an espresso
// machine and a sink, a bookshelf, plants, a beanbag, and a wall clock that keeps the visitor's time. Lit by the sun
// through the window, a soft room light and the room's own reflections (a small environment map drawn once).
//
// The crew, each running their own day and reacting to each other:
//   Build (headphones) codes at the first desk, nodding along to the music, stretches, fixes the headphones;
//   Idea (cap) codes at the second, then gets up (the chair rolls back), steps out, walks to the kitchen, takes a
//     mug, sets it under the machine, presses brew, waits for the pour, carries it back steaming, sits and sips;
//     next time the empty mug goes to the sink first;
//   Design (bow) draws the plan on the whiteboard side-on, walking along as the line grows, hops to stick the notes,
//     steps back to look; when it's done she and Launch celebrate, and she wipes it for the next one;
//   Launch (glasses) points out the plan, talks it over with Design, walks over to Build (who swivels round to chat)
//     and back.
// Walking is planned: a grid of the furniture, A* round it, the corners rounded off; nobody walks through anything,
// and when two meet, one waits (glancing at the other) or finds a way round. Every joint follows a spring
// (crew3d.js), so nothing snaps. Drawn only while on screen; with reduced motion, one moment of the day.

let K; // the crew kit
let THREE;

/* ---------- the floor plan (in head radii; a character is 3.55 tall, times SIZE) ---------- */

const SIZE = 1.15; // the crew beside the furniture: plush, a little bigger than people would be
const BACK = -9, LEFT = -18, RIGHT = 20, FRONT = 8;
const DESKS = [{ x: -9.2, z: -1.9 }, { x: -2.8, z: -1.9 }];
const DESK_W = 5, DESK_D = 2.2, DESK_TOP = 2.1;
const SEAT_Z = -3.9, SEAT_TOP = 1.22, ROLL = 1.6; // a chair's home, its seat, and how far it rolls back
const EXIT = [[-13.05, SEAT_Z], [1.2, SEAT_Z]]; // where each desk's sitter steps out to
const WIN = { x0: -12, x1: -2, y0: 3.9, y1: 8.7 };
const BOARD = { x: 6.2, y: 2.2, w: 7.4, h: 2.6 }; // low: the crew's arms are short
const DRAW_Z = -7.3; // where Design stands to draw, side-on, arm out to the board
const COUNTER = { x0: 12.3, x1: 19.6, z: -7, top: 2.2 };
const MACHINE_X = 14.2, MACHINE_Z = -7.6, SINK_X = 18.3, STACK = [15.5, -7.25], BIN = [11.25, -8.05], BEAN = [10, 1.6], SIDE = [12.6, 1.3];
const SPOT = { coffee: [15.55, -5.95], sink: [18.1, -5.9], board: [11.3, -5.2], visit: [-6.0, -5.1], bean: [10, 4.9] };
const WALK = 2.9; // head radii per second
const R_BODY = 1.05, R_PAIR = 2.45; // clearance from furniture, and between two of the crew
const HEAD_H = 2.95; // from the root to the eyes, in world units at SIZE

/* ---------- small helpers ---------- */

const mat = (color, rough = 0.85, extra = {}) => new THREE.MeshStandardMaterial({ color, roughness: rough, metalness: 0, ...extra });
const angTo = (dx, dz) => Math.atan2(dx, dz); // yaw that faces a direction (a character faces +z at yaw 0)
const wrap = (a) => Math.atan2(Math.sin(a), Math.cos(a));
const val = (v, ...a) => (typeof v === 'function' ? v(...a) : v);
const rand = (a, b) => a + Math.random() * (b - a);

function add(parent, geo, m, x = 0, y = 0, z = 0, cast = true) {
  const mesh = new THREE.Mesh(geo, m);
  mesh.position.set(x, y, z);
  mesh.castShadow = cast; mesh.receiveShadow = true;
  parent.add(mesh);
  return mesh;
}

// A box with rounded edges and corners (the RoundedBoxGeometry idea: a subdivided cube whose vertices are pushed
// out onto spheres at the corners), so the furniture catches light on its edges instead of looking cut from paper.
const RB = new Map();
function rgeo(w, h, d, r, seg = 3) {
  const key = [w, h, d, r, seg].join();
  if (RB.has(key)) return RB.get(key);
  const n = seg * 2 + 1;
  r = Math.min(r, (Math.min(w, h, d) / 2) * 0.999);
  const g = new THREE.BoxGeometry(1, 1, 1, n, n, n).toNonIndexed();
  const pos = g.attributes.position.array, nor = g.attributes.normal.array;
  const bx = w / 2 - r, by = h / 2 - r, bz = d / 2 - r, half = 0.5 / n;
  const v = new THREE.Vector3();
  for (let i = 0; i < pos.length; i += 3) {
    const x = pos[i], y = pos[i + 1], z = pos[i + 2];
    v.set(x - Math.sign(x) * half, y - Math.sign(y) * half, z - Math.sign(z) * half).normalize();
    pos[i] = bx * Math.sign(x) + v.x * r; pos[i + 1] = by * Math.sign(y) + v.y * r; pos[i + 2] = bz * Math.sign(z) + v.z * r;
    nor[i] = v.x; nor[i + 1] = v.y; nor[i + 2] = v.z;
  }
  RB.set(key, g);
  return g;
}
const rbox = (parent, w, h, d, r, m, x, y, z, cast = true) => add(parent, rgeo(w, h, d, r), m, x, y, z, cast);
const cyl = (parent, rt, rb, h, m, x, y, z, seg = 24) => add(parent, new THREE.CylinderGeometry(rt, rb, h, seg), m, x, y, z);

function canvasTex(w, h, draw, repeat) {
  const c = document.createElement('canvas');
  c.width = w; c.height = h;
  draw(c.getContext('2d'), w, h);
  const t = new THREE.CanvasTexture(c);
  t.colorSpace = THREE.SRGBColorSpace;
  t.anisotropy = 8;
  if (repeat) { t.wrapS = t.wrapT = THREE.RepeatWrapping; t.repeat.set(...repeat); }
  return t;
}
function noise(c, w, h, n, alpha) { // speckle, for plaster and felt
  for (let i = 0; i < n; i++) {
    c.fillStyle = Math.random() < 0.5 ? `rgba(0,0,0,${alpha * Math.random()})` : `rgba(255,255,255,${alpha * Math.random()})`;
    c.fillRect(Math.random() * w, Math.random() * h, 1 + Math.random() * 2, 1 + Math.random() * 2);
  }
}
function wood(c, w, h, base, rows = 1) { // long grain along the width
  c.fillStyle = base; c.fillRect(0, 0, w, h);
  for (let i = 0; i < 90 * rows; i++) {
    const y = Math.random() * h, amp = 1 + Math.random() * 3, ph = Math.random() * 7;
    c.strokeStyle = `rgba(${Math.random() < 0.7 ? '90,55,25' : '255,240,220'},${0.05 + Math.random() * 0.08})`;
    c.lineWidth = 0.6 + Math.random() * 1.4;
    c.beginPath();
    for (let x = 0; x <= w; x += 16) c.lineTo(x, y + Math.sin(x * 0.01 + ph) * amp);
    c.stroke();
  }
}
const soft = () => canvasTex(64, 64, (c, w, h) => { // a round soft blot: contact shadows and steam
  const g = c.createRadialGradient(w / 2, h / 2, 0, w / 2, h / 2, w / 2);
  g.addColorStop(0, 'rgba(255,255,255,1)'); g.addColorStop(0.55, 'rgba(255,255,255,0.45)'); g.addColorStop(1, 'rgba(255,255,255,0)');
  c.fillStyle = g; c.fillRect(0, 0, w, h);
});

/* ---------- the room ---------- */

let SOFT, AO, CASTER;
// a soft dark patch on the floor under a piece of furniture: the light it keeps from the floor
function ao(parent, x, z, w, d, k = 0.5) {
  const m = new THREE.Mesh(new THREE.PlaneGeometry(w, d), AO.clone());
  m.material.opacity = k;
  m.rotation.x = -Math.PI / 2;
  m.position.set(x, 0.015, z);
  m.renderOrder = -1;
  parent.add(m);
  return m;
}

function room(scene) {
  const g = new THREE.Group();
  scene.add(g);
  // the floor: oak planks with grain and seams
  const planks = canvasTex(1024, 1024, (c, w, h) => {
    c.fillStyle = '#6d4a2c'; c.fillRect(0, 0, w, h);
    const row = h / 8;
    for (let r = 0; r < 8; r++) {
      let x = -Math.random() * 300;
      while (x < w) {
        const len = 280 + Math.random() * 360;
        const l = 58 + Math.random() * 9, s = 30 + Math.random() * 10;
        c.save(); c.beginPath(); c.rect(x + 2, r * row + 2, len - 4, row - 4); c.clip();
        c.translate(x, r * row);
        wood(c, len, row, `hsl(${30 + Math.random() * 5}, ${s}%, ${l}%)`, 0.25);
        c.restore();
        x += len;
      }
    }
  }, [6.5, 4.2]);
  const floor = add(g, new THREE.PlaneGeometry(RIGHT - LEFT + 24, 36), mat('#ffffff', 0.62, { map: planks }), 2, 0, 6, false);
  floor.rotation.x = -Math.PI / 2;
  // the rug under the desks: woven, with a border
  const rugT = canvasTex(1024, 512, (c, w, h) => {
    const r = 80;
    c.beginPath(); c.roundRect(4, 4, w - 8, h - 8, r); c.fillStyle = '#8f80d8'; c.fill();
    c.save(); c.clip();
    for (let y = 0; y < h; y += 6) { c.fillStyle = `rgba(40,20,90,${0.05 + (y / 6 % 2) * 0.04})`; c.fillRect(0, y, w, 3); }
    noise(c, w, h, 9000, 0.12);
    c.restore();
    c.lineWidth = 16; c.strokeStyle = '#f2ecff'; c.beginPath(); c.roundRect(40, 40, w - 80, h - 80, r - 30); c.stroke();
    c.lineWidth = 5; c.strokeStyle = '#ffcb45'; c.beginPath(); c.roundRect(64, 64, w - 128, h - 128, r - 44); c.stroke();
  });
  const rug = add(g, new THREE.PlaneGeometry(15.5, 7.6), new THREE.MeshStandardMaterial({ map: rugT, roughness: 1, transparent: true, alphaTest: 0.5 }), -6, 0.03, -2.4, false);
  rug.rotation.x = -Math.PI / 2;

  // the walls: plaster above, panelling below a rail; the back wall is built round the window, so the sun comes in
  const plaster = canvasTex(256, 256, (c, w, h) => { c.fillStyle = '#f1e7d8'; c.fillRect(0, 0, w, h); noise(c, w, h, 2500, 0.018); }, [8, 3]);
  const wallM = mat('#ffffff', 0.95, { map: plaster }), sideM = mat('#e6d9c6', 0.95, { map: plaster });
  const panelT = canvasTex(256, 128, (c, w, h) => { c.fillStyle = '#d9c3a1'; c.fillRect(0, 0, w, h); for (let x = 0; x < w; x += 32) { c.fillStyle = 'rgba(80,50,20,0.22)'; c.fillRect(x, 0, 2, h); c.fillStyle = 'rgba(255,255,255,0.18)'; c.fillRect(x + 2, 0, 1, h); } }, [14, 1]);
  const panelM = mat('#ffffff', 0.7, { map: panelT });
  const T = 0.4, WZ = BACK - T / 2, H = 13, x0 = LEFT - 6, x1 = RIGHT + 6;
  rbox(g, WIN.x0 - x0, H, T, 0.01, wallM, (x0 + WIN.x0) / 2, H / 2, WZ);
  rbox(g, x1 - WIN.x1, H, T, 0.01, wallM, (x1 + WIN.x1) / 2, H / 2, WZ);
  rbox(g, WIN.x1 - WIN.x0, WIN.y0, T, 0.01, wallM, (WIN.x0 + WIN.x1) / 2, WIN.y0 / 2, WZ);
  rbox(g, WIN.x1 - WIN.x0, H - WIN.y1, T, 0.01, wallM, (WIN.x0 + WIN.x1) / 2, (H + WIN.y1) / 2, WZ);
  rbox(g, T, H, 40, 0.01, sideM, LEFT - T / 2, H / 2, 10);
  rbox(g, x1 - x0, 2.6, 0.12, 0.02, panelM, 2, 1.3, BACK + 0.06, false);
  rbox(g, 0.12, 2.6, 30, 0.02, panelM, LEFT + 0.06, 1.3, 6, false);
  const rail = mat('#b89770', 0.55);
  rbox(g, x1 - x0, 0.14, 0.24, 0.05, rail, 2, 2.62, BACK + 0.12, false);
  rbox(g, 0.24, 0.14, 30, 0.05, rail, LEFT + 0.12, 2.62, 6, false);
  rbox(g, x1 - x0, 0.36, 0.16, 0.04, mat('#c9ad85', 0.6), 2, 0.18, BACK + 0.2, false);
  rbox(g, 0.16, 0.36, 30, 0.04, mat('#c9ad85', 0.6), LEFT + 0.2, 0.18, 6, false);

  // the window: a frame, mullions, a sill; outside, the sky, drifting clouds and the city
  const frame = mat('#2b2c31', 0.45, { metalness: 0.2 });
  const wx = (WIN.x0 + WIN.x1) / 2, wy = (WIN.y0 + WIN.y1) / 2, ww = WIN.x1 - WIN.x0, wh = WIN.y1 - WIN.y0;
  rbox(g, ww + 0.3, 0.22, 0.5, 0.06, frame, wx, WIN.y1, BACK);
  rbox(g, ww + 0.3, 0.22, 0.5, 0.06, frame, wx, WIN.y0, BACK);
  for (const x of [WIN.x0, WIN.x0 + ww / 3, WIN.x0 + (2 * ww) / 3, WIN.x1]) rbox(g, 0.18, wh, 0.36, 0.05, frame, x, wy, BACK);
  rbox(g, ww, 0.12, 0.3, 0.04, frame, wx, WIN.y0 + wh * 0.7, BACK);
  rbox(g, ww + 1, 0.2, 1.0, 0.08, mat('#efe6d8', 0.5), wx, WIN.y0 - 0.1, BACK + 0.4);
  const sky = canvasTex(1024, 512, (c, w, h) => {
    const gr = c.createLinearGradient(0, 0, 0, h);
    gr.addColorStop(0, '#6fb2ee'); gr.addColorStop(0.65, '#cfe6fa'); gr.addColorStop(1, '#f7ecd9');
    c.fillStyle = gr; c.fillRect(0, 0, w, h);
    for (const [col, lo, hi] of [['rgba(150,175,210,0.55)', 90, 230], ['rgba(110,135,175,0.75)', 40, 150]]) {
      let x = -10;
      c.fillStyle = col;
      while (x < w) { const bw = 30 + Math.random() * 70, bh = lo + Math.random() * (hi - lo); c.fillRect(x, h - bh, bw, bh); x += bw + 6; }
    }
    c.fillStyle = 'rgba(255,255,255,0.35)';
    for (let i = 0; i < 160; i++) c.fillRect(Math.random() * w, h - 40 - Math.random() * 180, 3, 4);
    // tree tops just outside
    for (let i = 0; i < 14; i++) { c.fillStyle = i % 2 ? '#4f9b6a' : '#3f8a5c'; c.beginPath(); c.arc(i * 80 + Math.random() * 30, h + 10, 60 + Math.random() * 30, 0, 7); c.fill(); }
  });
  add(g, new THREE.PlaneGeometry(ww + 8, wh + 5), new THREE.MeshBasicMaterial({ map: sky, toneMapped: false }), wx, wy, BACK - 3, false);
  const cloudT = canvasTex(1024, 256, (c) => {
    c.fillStyle = 'rgba(255,255,255,0.92)';
    for (const [x, y, s] of [[120, 90, 1], [420, 60, 1.3], [700, 110, 0.9], [930, 70, 1.1]]) {
      for (let k = 0; k < 6; k++) { c.beginPath(); c.ellipse(x + (k - 2.5) * 26 * s, y + Math.sin(k * 1.7) * 8, 40 * s, 22 * s, 0, 0, 7); c.fill(); }
    }
  });
  cloudT.wrapS = THREE.RepeatWrapping;
  const clouds = add(g, new THREE.PlaneGeometry(ww + 8, 2.6), new THREE.MeshBasicMaterial({ map: cloudT, transparent: true, depthWrite: false, toneMapped: false }), wx, WIN.y1 - 0.8, BACK - 2.6, false);

  // a bookshelf on the left wall, facing the room
  const shelf = new THREE.Group();
  shelf.position.set(LEFT + 0.75, 0, -4.2);
  shelf.rotation.y = Math.PI / 2;
  g.add(shelf);
  const oakT = canvasTex(512, 128, (c, w, h) => wood(c, w, h, '#c89d6c'));
  const oak = mat('#ffffff', 0.6, { map: oakT });
  const SW = 4.6, SH = 6.6, SD = 1.3;
  for (const s of [-1, 1]) rbox(shelf, 0.18, SH, SD, 0.05, oak, (s * SW) / 2, SH / 2, 0);
  for (let k = 0; k < 5; k++) rbox(shelf, SW, 0.16, SD, 0.05, oak, 0, 0.25 + k * 1.55, 0);
  rbox(shelf, SW, SH, 0.06, 0.02, mat('#e3d4bd', 0.9), 0, SH / 2, -SD / 2 + 0.03, false);
  const covers = ['#3d5afe', '#ff6242', '#ffcb45', '#2fd0a0', '#a58bff', '#1d1c1a', '#f4f1ea', '#ff85b8', '#62c1ff'];
  for (let k = 0; k < 4; k++) {
    let x = -SW / 2 + 0.2;
    const stop = k === 1 ? 0.6 : SW / 2 - 0.2;
    while (x < stop - 0.2) {
      const bw = rand(0.14, 0.26), bh = rand(0.9, 1.3), lean = x > stop - 0.6 && k === 2 ? 0.25 : 0;
      const b = rbox(shelf, bw, bh, rand(0.8, 1.0), 0.03, mat(covers[(Math.random() * covers.length) | 0], 0.7), x + bw / 2, 0.33 + k * 1.55 + bh / 2, 0.05);
      b.rotation.z = -lean;
      x += bw + 0.02;
    }
    if (k === 1) { // a small plant and a framed photo on this one
      const pot = cyl(shelf, 0.3, 0.24, 0.5, mat('#e8d9c4', 0.6), 1.2, 0.33 + 1.55 + 0.25, 0);
      for (let i = 0; i < 6; i++) { const l = add(shelf, new THREE.SphereGeometry(0.22, 12, 8), mat(i % 2 ? '#4aa874' : '#3a8f60', 0.8), 1.2 + Math.cos(i) * 0.18, 2.35 + (i % 3) * 0.12, Math.sin(i) * 0.18); l.scale.set(1, 0.6, 1); }
      pot.castShadow = true;
    }
  }
  ao(g, LEFT + 1.1, -4.2, 2.6, 5.4, 0.55);

  // a snake plant in the corner, in a ceramic pot
  plant(g, -15.7, -7.3, 1);
  return { g, clouds };
}

function plant(parent, x, z, s) {
  const g = new THREE.Group();
  g.position.set(x, 0, z);
  g.scale.setScalar(s);
  parent.add(g);
  const pts = [[0, 0], [0.78, 0], [0.9, 0.12], [1.0, 1.35], [1.08, 1.45], [1.05, 1.55], [0.9, 1.5]].map(([a, b]) => new THREE.Vector2(a, b));
  add(g, new THREE.LatheGeometry(pts, 40), mat('#f0e3cf', 0.45));
  add(g, new THREE.CircleGeometry(0.92, 32), mat('#4a3526', 1), 0, 1.42, 0).rotation.x = -Math.PI / 2;
  const leafA = mat('#3f8f5f', 0.7, { side: THREE.DoubleSide }), leafB = mat('#6fb783', 0.7, { side: THREE.DoubleSide });
  for (let i = 0; i < 13; i++) {
    const h = rand(2.2, 3.6);
    const blade = add(g, new THREE.ConeGeometry(0.2, h, 5, 1), i % 3 ? leafA : leafB, 0, 0, 0);
    blade.scale.z = 0.28;
    const a = (i / 13) * Math.PI * 2 + rand(-0.2, 0.2), rr = rand(0.1, 0.6);
    blade.position.set(Math.cos(a) * rr, 1.4 + h / 2, Math.sin(a) * rr);
    blade.rotation.set(Math.sin(a) * rand(0.06, 0.22), rand(0, Math.PI), -Math.cos(a) * rand(0.06, 0.22));
  }
  ao(parent, x, z, 3 * s, 3 * s, 0.6);
  return g;
}

function desk(scene, x, z, mine) {
  const g = new THREE.Group();
  g.position.set(x, 0, z);
  scene.add(g);
  const topT = canvasTex(1024, 256, (c, w, h) => wood(c, w, h, '#dcc19a'));
  const top = mat('#ffffff', 0.5, { map: topT }), metal = mat('#26272c', 0.35, { metalness: 0.6 });
  rbox(g, DESK_W, 0.14, DESK_D, 0.06, top, 0, DESK_TOP - 0.07, 0);
  // sled legs: a post at each corner of each end, tied by a foot and a rail
  for (const s of [-1, 1]) {
    const lx = s * (DESK_W / 2 - 0.3);
    for (const sz of [-1, 1]) rbox(g, 0.12, DESK_TOP - 0.14, 0.12, 0.05, metal, lx, (DESK_TOP - 0.14) / 2, sz * (DESK_D / 2 - 0.2));
    rbox(g, 0.13, 0.08, DESK_D - 0.2, 0.04, metal, lx, 0.04, 0);
    rbox(g, 0.12, 0.1, DESK_D - 0.3, 0.04, metal, lx, DESK_TOP - 0.2, 0);
  }
  rbox(g, DESK_W - 0.7, 0.08, 0.1, 0.03, metal, 0, DESK_TOP - 0.2, -DESK_D / 2 + 0.25);
  ao(g, 0, 0, DESK_W + 1, DESK_D + 1, 0.45);
  const lap = K.laptop();
  lap.scale.setScalar(1.55);
  lap.position.set(0, DESK_TOP, -0.52);
  lap.traverse((o) => { if (o.isMesh) o.castShadow = true; });
  g.add(lap);
  // a cable from the laptop down the back leg
  const cable = new THREE.CatmullRomCurve3([[0.7, DESK_TOP + 0.02, -0.2], [1.6, DESK_TOP + 0.02, 0.5], [2.15, DESK_TOP - 0.05, 0.85], [2.2, 1.0, 0.95], [2.3, 0.05, 1.2]].map((p) => new THREE.Vector3(...p)));
  add(g, new THREE.TubeGeometry(cable, 40, 0.035, 6), mat('#1d1c1a', 0.6));
  // the things on each desk
  const pens = cyl(g, 0.2, 0.18, 0.46, mat(mine ? '#ff6242' : '#3d5afe', 0.5), -1.9, DESK_TOP + 0.23, -0.4);
  pens.castShadow = true;
  for (let i = 0; i < 3; i++) { const p = cyl(g, 0.035, 0.035, 0.7, mat(['#3d5afe', '#1d1c1a', '#ffcb45'][i], 0.5), -1.94 + i * 0.05, DESK_TOP + 0.62, -0.42 + (i - 1) * 0.05, 8); p.rotation.z = (i - 1) * 0.18; }
  const book = rbox(g, 1.1, 0.1, 0.8, 0.03, mat(mine ? '#2fd0a0' : '#ffcb45', 0.7), -1.35, DESK_TOP + 0.05, 0.35);
  book.rotation.y = 0.3;
  if (mine) { // Build: a succulent and a sticky note on the laptop
    cyl(g, 0.24, 0.2, 0.34, mat('#f4f1ea', 0.5), 1.95, DESK_TOP + 0.17, 0.5);
    for (let i = 0; i < 7; i++) { const l = add(g, new THREE.SphereGeometry(0.12, 10, 8), mat('#6fb783', 0.7), 1.95 + Math.cos(i * 0.9) * 0.1, DESK_TOP + 0.42 + (i % 2) * 0.06, 0.5 + Math.sin(i * 0.9) * 0.1); l.scale.set(0.8, 1.4, 0.8); }
  } else { // Idea: a small stack of books
    rbox(g, 0.9, 0.14, 0.7, 0.03, mat('#a58bff', 0.7), 1.85, DESK_TOP + 0.07, 0.45);
    rbox(g, 0.8, 0.12, 0.62, 0.03, mat('#ff6242', 0.7), 1.85, DESK_TOP + 0.2, 0.45).rotation.y = 0.2;
  }
  // the screen's cool light on the keys, brighter while someone types
  const glow = add(g, new THREE.PlaneGeometry(1.3, 0.8), new THREE.MeshBasicMaterial({ color: '#c8d6ff', transparent: true, opacity: 0.12, depthWrite: false }), 0, DESK_TOP + 0.09, -0.62, false);
  glow.rotation.x = -Math.PI / 2;
  return { g, lap, glow };
}

// An office chair: five-star base on casters, gas lift, a padded seat and a curved back. It swivels (the whole
// chair turns with its sitter) and rolls back when they stand.
function chair(scene, x, z) {
  const g = new THREE.Group();
  g.position.set(x, 0, z);
  scene.add(g);
  const fabric = mat('#3d5afe', 0.95), dark = mat('#222328', 0.4, { metalness: 0.5 }), black = mat('#111114', 0.6);
  for (let i = 0; i < 5; i++) {
    const a = (i / 5) * Math.PI * 2;
    const leg = rbox(g, 0.16, 0.12, 1.05, 0.05, dark, Math.sin(a) * 0.5, 0.22, Math.cos(a) * 0.5);
    leg.rotation.y = a;
    add(g, new THREE.SphereGeometry(0.11, 12, 8), black, Math.sin(a) * 1.0, 0.11, Math.cos(a) * 1.0);
  }
  cyl(g, 0.16, 0.18, 0.2, dark, 0, 0.3, 0);
  cyl(g, 0.08, 0.08, SEAT_TOP - 0.55, mat('#c8ccd4', 0.25, { metalness: 0.8 }), 0, (SEAT_TOP - 0.55) / 2 + 0.35, 0, 12);
  rbox(g, 1.3, 0.12, 1.1, 0.05, dark, 0, SEAT_TOP - 0.33, 0);
  rbox(g, 1.85, 0.3, 1.7, 0.14, fabric, 0, SEAT_TOP - 0.15, 0);
  rbox(g, 0.18, 1.2, 0.14, 0.05, dark, 0, SEAT_TOP + 0.2, -0.86).rotation.x = -0.1;
  const back = rbox(g, 1.85, 1.55, 0.26, 0.12, fabric, 0, SEAT_TOP + 1.05, -0.98);
  back.rotation.x = -0.12;
  const shadow = ao(scene, x, z, 2.6, 2.6, 0.45);
  return { g, home: z, x, z, shadow, yaw: 0 };
}

function lamp(scene, x, z, y = 8.4) {
  cyl(scene, 0.025, 0.025, 13 - y, mat('#1d1c1a', 0.6), x, (13 + y) / 2, z, 6).castShadow = false;
  const outside = mat('#ffcb45', 0.55), inside = new THREE.MeshStandardMaterial({ color: '#fff6e0', emissive: new THREE.Color('#ffe2a8'), emissiveIntensity: 0.9, roughness: 0.6, side: THREE.BackSide });
  const pts = [[0.12, 0.62], [0.2, 0.6], [0.55, 0.35], [0.95, 0.02], [0.98, 0]].map(([a, b]) => new THREE.Vector2(a, b));
  const shade = add(scene, new THREE.LatheGeometry(pts, 36), outside, x, y - 0.4, z);
  shade.castShadow = false;
  add(scene, new THREE.LatheGeometry(pts.map((p) => new THREE.Vector2(p.x * 0.97, p.y - 0.01)), 36), inside, x, y - 0.4, z, false);
  add(scene, new THREE.SphereGeometry(0.2, 16, 10), new THREE.MeshBasicMaterial({ color: '#fff4dc', toneMapped: false }), x, y - 0.45, z, false);
  const light = new THREE.PointLight('#ffd9a0', 9, 11, 1.6);
  light.position.set(x, y - 0.7, z);
  scene.add(light);
}

// The plan on the whiteboard, drawn as the designer draws it: the route from an idea to launch, and a sticky note
// for each stage. progress (0..1) is how much of the route is drawn; wiped (0..1) how much has been erased.
class Board {
  constructor(scene) {
    this.canvas = document.createElement('canvas');
    this.canvas.width = 1024; this.canvas.height = 360;
    this.tex = new THREE.CanvasTexture(this.canvas);
    this.tex.colorSpace = THREE.SRGBColorSpace;
    this.tex.anisotropy = 8;
    const g = new THREE.Group();
    g.position.set(BOARD.x, BOARD.y, BACK + 0.34);
    scene.add(g);
    add(g, new THREE.PlaneGeometry(BOARD.w, BOARD.h), mat('#ffffff', 0.25, { map: this.tex, metalness: 0.05 }), 0, 0, 0.04, false);
    const trim = mat('#c9ccd3', 0.3, { metalness: 0.7 });
    rbox(g, BOARD.w + 0.24, 0.14, 0.14, 0.05, trim, 0, BOARD.h / 2 + 0.05, 0.03);
    rbox(g, 0.14, BOARD.h + 0.2, 0.14, 0.05, trim, -BOARD.w / 2 - 0.05, 0, 0.03);
    rbox(g, 0.14, BOARD.h + 0.2, 0.14, 0.05, trim, BOARD.w / 2 + 0.05, 0, 0.03);
    rbox(g, BOARD.w + 0.24, 0.12, 0.42, 0.05, trim, 0, -BOARD.h / 2 - 0.06, 0.2);
    for (let i = 0; i < 3; i++) rbox(g, 0.5, 0.07, 0.08, 0.035, mat(['#3d5afe', '#ff6242', '#1d1c1a'][i], 0.5), -2.4 + i * 0.6, -BOARD.h / 2 + 0.03, 0.26).rotation.y = 0.1 * i;
    rbox(g, 0.6, 0.16, 0.24, 0.05, mat('#2b2c31', 0.7), 2.6, -BOARD.h / 2 + 0.08, 0.24);
    // the route, in board units (u across 0..1, v down 0..1), low where the crew can reach
    this.route = [[0.05, 0.8], [0.22, 0.8], [0.22, 0.55], [0.46, 0.55], [0.46, 0.74], [0.7, 0.74], [0.7, 0.5], [0.93, 0.5]];
    this.len = [0];
    for (let i = 1; i < this.route.length; i++) this.len.push(this.len[i - 1] + Math.hypot((this.route[i][0] - this.route[i - 1][0]) * 2.85, this.route[i][1] - this.route[i - 1][1]));
    this.notes = [[0.08, 0.2, '#ffcb45', 'Idea', -0.06], [0.33, 0.2, '#c4b3f2', 'Design', 0.05], [0.58, 0.22, '#93d8bf', 'Build', -0.04], [0.84, 0.2, '#ff9a86', 'Launch', 0.06]];
    this.stuck = 0; // notes up so far
    this.progress = 0; this.wiped = 0;
    this.drawn = -1;
    this.redraw();
  }
  get done() { return this.progress >= 1 && this.stuck >= 4; }
  // where the pen is: world x, y of the route's end so far
  tip(p = this.progress) {
    const L = this.len[this.len.length - 1] * Math.min(1, p);
    let i = 1;
    while (i < this.len.length - 1 && this.len[i] < L) i++;
    const k = (L - this.len[i - 1]) / (this.len[i] - this.len[i - 1] || 1);
    const [u0, v0] = this.route[i - 1], [u1, v1] = this.route[i];
    const u = u0 + (u1 - u0) * k, v = v0 + (v1 - v0) * k;
    return { x: BOARD.x + (u - 0.5) * BOARD.w, y: BOARD.y + (0.5 - v) * BOARD.h, z: BACK + 0.4 };
  }
  note(i) { const [u, v] = this.notes[i]; return { x: BOARD.x + (u - 0.5) * BOARD.w, y: BOARD.y + (0.5 - v) * BOARD.h, z: BACK + 0.4 }; }
  reset() { this.progress = 0; this.wiped = 0; this.stuck = 0; }
  redraw() {
    // redrawn (and sent to the GPU again) in steps of about a pixel on screen, not on every frame of a stroke
    const key = `${Math.floor(this.progress * 250)}|${Math.floor(this.wiped * 250)}|${this.stuck}`;
    if (key === this.drawn) return;
    this.drawn = key;
    const c = this.canvas.getContext('2d'), w = this.canvas.width, h = this.canvas.height;
    c.fillStyle = '#fcfcf9'; c.fillRect(0, 0, w, h);
    c.fillStyle = 'rgba(60,70,90,0.05)';
    for (let i = 0; i < 6; i++) c.fillRect(0, 60 + i * 55, w, 1);
    // ghost of old plans, never quite wiped
    c.strokeStyle = 'rgba(61,90,254,0.05)'; c.lineWidth = 14; c.beginPath(); c.moveTo(80, 120); c.lineTo(400, 150); c.stroke();
    this.notes.slice(0, this.stuck).forEach(([u, v, col, text, r]) => {
      c.save(); c.translate(u * w, v * h); c.rotate(r);
      c.fillStyle = 'rgba(0,0,0,0.12)'; c.fillRect(-58, -40, 122, 86);
      c.fillStyle = col; c.fillRect(-62, -44, 122, 86);
      c.fillStyle = '#1d1c1a'; c.font = '600 30px "Bricolage Grotesque", sans-serif'; c.textAlign = 'center'; c.fillText(text, 0, 10);
      c.restore();
    });
    const L = this.len[this.len.length - 1] * this.progress;
    if (L > 0) {
      c.strokeStyle = '#3d5afe'; c.lineWidth = 11; c.lineCap = 'round'; c.lineJoin = 'round';
      c.beginPath(); c.moveTo(this.route[0][0] * w, this.route[0][1] * h);
      for (let i = 1; i < this.route.length; i++) {
        if (this.len[i] <= L) c.lineTo(this.route[i][0] * w, this.route[i][1] * h);
        else { const k = (L - this.len[i - 1]) / (this.len[i] - this.len[i - 1]); c.lineTo((this.route[i - 1][0] + (this.route[i][0] - this.route[i - 1][0]) * k) * w, (this.route[i - 1][1] + (this.route[i][1] - this.route[i - 1][1]) * k) * h); break; }
      }
      c.stroke();
      c.fillStyle = '#3d5afe'; c.beginPath(); c.arc(this.route[0][0] * w, this.route[0][1] * h, 14, 0, 7); c.fill();
      if (this.progress >= 1) { const [u, v] = this.route[this.route.length - 1]; c.beginPath(); c.moveTo(u * w + 4, v * h - 22); c.lineTo(u * w + 40, v * h); c.lineTo(u * w + 4, v * h + 22); c.fill(); }
    }
    if (this.wiped > 0) { // erased so far, left to right, with a smudge at the edge
      const x = this.wiped * w;
      c.fillStyle = '#fcfcf9'; c.fillRect(0, 0, x, h);
      const gr = c.createLinearGradient(x, 0, x + 60, 0);
      gr.addColorStop(0, '#fcfcf9'); gr.addColorStop(1, 'rgba(252,252,249,0)');
      c.fillStyle = gr; c.fillRect(x, 0, 60, h);
    }
    this.tex.needsUpdate = true;
  }
}

// The kitchenette: base cabinets, a counter, an espresso machine and a grinder, a sink, a shelf of jars and mugs.
function kitchen(scene) {
  const g = new THREE.Group();
  scene.add(g);
  const { x0, x1, z, top } = COUNTER, cx = (x0 + x1) / 2, cw = x1 - x0, cd = BACK - z;
  const body = mat('#eee6d8', 0.55), handle = mat('#2b2c31', 0.3, { metalness: 0.6 });
  rbox(g, cw, top - 0.3, -cd - 0.05, 0.05, body, cx, (top - 0.3) / 2 + 0.25, (BACK + z) / 2);
  rbox(g, cw - 0.1, 0.25, -cd - 0.2, 0.02, mat('#2b2c31', 0.8), cx, 0.125, (BACK + z) / 2 - 0.1, false);
  const doors = 4, dw = cw / doors;
  for (let i = 0; i < doors; i++) {
    const dx = x0 + dw * (i + 0.5);
    rbox(g, dw - 0.08, top - 0.45, 0.08, 0.04, mat('#f4eee4', 0.5), dx, (top - 0.3) / 2 + 0.25, z + 0.03);
    rbox(g, 0.5, 0.07, 0.08, 0.035, handle, dx, top - 0.5, z + 0.12);
  }
  const stone = canvasTex(512, 128, (c, w, h) => { c.fillStyle = '#f6f2eb'; c.fillRect(0, 0, w, h); noise(c, w, h, 2500, 0.15); for (let i = 0; i < 90; i++) { c.fillStyle = ['#ff6242', '#3d5afe', '#ffcb45', '#8e96a8'][i % 4]; c.globalAlpha = 0.35; c.fillRect(Math.random() * w, Math.random() * h, 2 + Math.random() * 3, 2 + Math.random() * 3); } c.globalAlpha = 1; });
  rbox(g, cw + 0.2, 0.18, -cd + 0.2, 0.06, mat('#ffffff', 0.3, { map: stone }), cx, top - 0.09, (BACK + z) / 2 + 0.1);
  ao(g, cx, z + 0.4, cw + 1.2, 1.6, 0.4);
  // the sink and its tap
  rbox(g, 1.6, 0.04, 1.1, 0.02, mat('#9aa1ad', 0.25, { metalness: 0.8 }), SINK_X, top + 0.005, -7.9, false);
  const tap = new THREE.CatmullRomCurve3([[0, 0, 0], [0, 0.7, 0], [0, 0.95, 0.2], [0, 0.85, 0.5]].map((p) => new THREE.Vector3(...p)));
  add(g, new THREE.TubeGeometry(tap, 20, 0.06, 10), mat('#d4d8de', 0.15, { metalness: 0.9 }), SINK_X, top, -8.55);
  // the espresso machine
  const m = new THREE.Group();
  m.position.set(MACHINE_X, top, MACHINE_Z);
  g.add(m);
  const steel = mat('#d9dce1', 0.22, { metalness: 0.85 }), red = mat('#ff6242', 0.45);
  rbox(m, 1.9, 1.7, 1.3, 0.16, red, 0, 0.95, 0);
  rbox(m, 1.94, 0.26, 1.34, 0.1, steel, 0, 1.85, 0);
  rbox(m, 1.94, 0.12, 1.34, 0.05, steel, 0, 0.12, 0);
  const tray = rbox(m, 1.2, 0.08, 0.7, 0.03, steel, 0, 0.12, 0.72);
  tray.castShadow = false;
  cyl(m, 0.24, 0.24, 0.26, steel, 0, 1.12, 0.72);
  const handleP = rbox(m, 0.12, 0.12, 0.8, 0.05, mat('#1d1c1a', 0.4), 0.3, 1.0, 0.95);
  handleP.rotation.y = -0.5;
  const gauge = add(m, new THREE.CircleGeometry(0.18, 28), mat('#fbf8f2', 0.3), -0.55, 1.35, 0.66, false);
  add(m, new THREE.TorusGeometry(0.19, 0.03, 8, 28), steel, -0.55, 1.35, 0.66);
  const needle = rbox(m, 0.02, 0.14, 0.01, 0.005, mat('#ff2a2a', 0.4), -0.55, 1.35, 0.68, false);
  needle.geometry = rgeo(0.025, 0.15, 0.01, 0.005, 1).clone().translate(0, 0.07, 0);
  needle.rotation.z = 1.2;
  gauge.castShadow = false;
  const buttons = [0, 1].map((i) => {
    const b = add(m, new THREE.CylinderGeometry(0.09, 0.09, 0.06, 20), new THREE.MeshStandardMaterial({ color: '#f4f1ea', roughness: 0.4, emissive: new THREE.Color('#ffcb45'), emissiveIntensity: 0 }), 0.72, 0.9 - i * 0.28, 0.66);
    b.rotation.x = Math.PI / 2;
    return b;
  });
  // the pour: a thin stream from the group head into the cup
  const stream = add(m, new THREE.CylinderGeometry(0.028, 0.02, 1, 8), mat('#5a3420', 0.3), 0, 0.6, 0.72, false);
  stream.visible = false;
  // the grinder and a stack of mugs
  cyl(g, 0.34, 0.28, 0.9, mat('#1d1c1a', 0.4), MACHINE_X + 2.5, top + 0.45, -8.3);
  const hop = cyl(g, 0.26, 0.16, 0.45, mat('#e8f0ff', 0.3, { transparent: true, opacity: 0.45 }), MACHINE_X + 2.5, top + 1.12, -8.3);
  hop.castShadow = false;
  cyl(g, 0.22, 0.15, 0.3, mat('#5a3420', 0.9), MACHINE_X + 2.5, top + 1.06, -8.3);
  for (let i = 0; i < 3; i++) { const mg = mug('#f4f1ea'); mg.position.set(STACK[0], top + i * 0.37, STACK[1]); mg.rotation.y = i * 0.9; g.add(mg); }
  // a shelf above, with jars, mugs and a trailing plant
  const oakT = canvasTex(512, 64, (c, w, h) => wood(c, w, h, '#c89d6c'));
  rbox(g, cw - 0.8, 0.16, 1.1, 0.05, mat('#ffffff', 0.6, { map: oakT }), cx, 5.6, BACK + 0.55);
  for (let i = 0; i < 4; i++) {
    const jx = x0 + 0.9 + i * 0.75;
    cyl(g, 0.26, 0.26, 0.7 - i * 0.08, mat('#eaf2ff', 0.08, { transparent: true, opacity: 0.5 }), jx, 5.68 + (0.7 - i * 0.08) / 2, BACK + 0.55).castShadow = false;
    cyl(g, 0.22, 0.22, 0.5 - i * 0.08, mat(['#5a3420', '#f3e0b5', '#c98b4f', '#2fd0a0'][i], 0.9), jx, 5.68 + (0.5 - i * 0.08) / 2 + 0.02, BACK + 0.55);
    cyl(g, 0.27, 0.27, 0.08, mat('#b89770', 0.6), jx, 5.72 + 0.7 - i * 0.08, BACK + 0.55);
  }
  for (let i = 0; i < 3; i++) { const mg = mug(['#3d5afe', '#ffcb45', '#2fd0a0'][i]); mg.position.set(x0 + 4.3 + i * 0.7, 5.68, BACK + 0.6); mg.rotation.y = 0.6; g.add(mg); }
  const pot = cyl(g, 0.34, 0.28, 0.5, mat('#f0e3cf', 0.45), x1 - 0.9, 5.93, BACK + 0.55);
  pot.castShadow = true;
  trailing(g, x1 - 0.9, 6.15, BACK + 0.6);
  // the bin
  cyl(g, 0.58, 0.48, 1.5, mat('#8e96a8', 0.35, { metalness: 0.6 }), BIN[0], 0.75, BIN[1], 28);
  cyl(g, 0.6, 0.6, 0.08, mat('#6d7484', 0.3, { metalness: 0.6 }), BIN[0], 1.52, BIN[1], 28);
  ao(g, BIN[0], BIN[1], 1.6, 1.6, 0.5);
  return { g, m, buttons, stream, needle, trayAt: new THREE.Vector3(MACHINE_X, top + 0.16, MACHINE_Z + 0.72), spoutY: top + 0.98 };
}

// A trailing pothos: heart-shaped leaves along a few vines that hang over the shelf's edge.
function trailing(parent, x, y, z) {
  const heart = new THREE.Shape();
  heart.moveTo(0, 0); heart.bezierCurveTo(0.14, 0.05, 0.2, 0.2, 0, 0.34); heart.bezierCurveTo(-0.2, 0.2, -0.14, 0.05, 0, 0);
  const leafG = new THREE.ShapeGeometry(heart, 6);
  const greens = ['#3f8f5f', '#4fa56f', '#6fb783'].map((c) => mat(c, 0.6, { side: THREE.DoubleSide }));
  const stem = mat('#3a7a50', 0.8);
  for (let v = 0; v < 5; v++) {
    const a = (v / 5) * Math.PI * 2, len = rand(0.8, 2.4);
    const pts = [[x + Math.cos(a) * 0.15, y, z + Math.sin(a) * 0.15], [x + Math.cos(a) * 0.45, y - 0.05, z + 0.3 + Math.sin(a) * 0.2], [x + Math.cos(a) * 0.55, y - len * 0.6, z + 0.55], [x + Math.cos(a) * 0.5 + rand(-0.2, 0.2), y - len, z + 0.6]];
    const curve = new THREE.CatmullRomCurve3(pts.map((p) => new THREE.Vector3(...p)));
    add(parent, new THREE.TubeGeometry(curve, 16, 0.018, 5), stem, 0, 0, 0, false);
    const n = Math.round(len * 5);
    for (let k = 1; k <= n; k++) {
      const p = curve.getPoint(k / (n + 0.5));
      const leaf = add(parent, leafG, greens[(k + v) % 3], p.x, p.y, p.z);
      leaf.rotation.set(rand(-0.6, 0.2), rand(-1, 1), Math.PI + rand(-0.9, 0.9));
      leaf.scale.setScalar(rand(0.8, 1.2));
    }
  }
  for (let k = 0; k < 7; k++) { // a crown of leaves in the pot
    const leaf = add(parent, leafG, greens[k % 3], x + rand(-0.2, 0.2), y + 0.05, z + rand(-0.2, 0.2));
    leaf.rotation.set(rand(-0.5, 0.5), (k / 7) * Math.PI * 2, rand(-0.4, 0.4));
  }
}

// A mug: a lathed cup with a handle, and coffee in it that fills.
function mug(color = '#ffcb45') {
  const g = new THREE.Group();
  const pts = [[0, 0], [0.19, 0], [0.21, 0.03], [0.21, 0.36], [0.19, 0.36], [0.18, 0.05], [0, 0.05]].map(([a, b]) => new THREE.Vector2(a, b));
  add(g, new THREE.LatheGeometry(pts, 28), mat(color, 0.35));
  const h = add(g, new THREE.TorusGeometry(0.1, 0.03, 8, 16, Math.PI * 1.2), mat(color, 0.35), 0.21, 0.19, 0);
  h.rotation.z = -Math.PI * 0.6;
  const coffee = add(g, new THREE.CircleGeometry(0.18, 24), mat('#4a2a18', 0.25), 0, 0.3, 0, false);
  coffee.rotation.x = -Math.PI / 2;
  coffee.visible = false;
  g.userData.coffee = coffee;
  return g;
}

// The corner by the window: a beanbag and a floor lamp; the wall clock, and prints above the board.
function dressing(scene) {
  const weave = canvasTex(256, 256, (c, w, h) => { c.fillStyle = '#2fae88'; c.fillRect(0, 0, w, h); for (let y = 0; y < h; y += 4) { c.fillStyle = `rgba(0,40,30,${0.06 + (y / 4 % 2) * 0.05})`; c.fillRect(0, y, w, 2); } noise(c, w, h, 3000, 0.08); }, [4, 3]);
  const prof = [[0, 0], [1.25, 0.02], [1.55, 0.35], [1.6, 0.75], [1.45, 1.15], [1.1, 1.45], [0.6, 1.62], [0, 1.66]].map(([a, b]) => new THREE.Vector2(a, b));
  const bag = add(scene, new THREE.LatheGeometry(new THREE.SplineCurve(prof).getPoints(24), 48), mat('#ffffff', 1, { map: weave }), BEAN[0], 0, BEAN[1]);
  bag.scale.set(1, 0.95, 0.92);
  // the hollow sat into it: the top pressed down toward the front
  const pos = bag.geometry.attributes.position;
  for (let i = 0; i < pos.count; i++) {
    const x = pos.getX(i), y = pos.getY(i), z = pos.getZ(i);
    const k = Math.max(0, 1 - Math.hypot(x, z - 0.35) / 1.1) * Math.max(0, (y - 0.9) / 0.76);
    pos.setY(i, y - k * 0.55);
  }
  bag.geometry.computeVertexNormals();
  ao(scene, BEAN[0], BEAN[1], 4.2, 3.8, 0.6);
  // a side table by it, with a mug and a little plant
  const [sx, sz] = SIDE, legM = mat('#26272c', 0.35, { metalness: 0.6 });
  cyl(scene, 0.85, 0.85, 0.12, mat('#ffffff', 0.5, { map: canvasTex(256, 64, (c, w, h) => wood(c, w, h, '#c89d6c')) }), sx, 1.55, sz, 40);
  for (let i = 0; i < 3; i++) { const a = (i / 3) * Math.PI * 2 + 0.4; const leg = cyl(scene, 0.05, 0.05, 1.6, legM, sx + Math.sin(a) * 0.45, 0.78, sz + Math.cos(a) * 0.45, 8); leg.rotation.set(Math.cos(a) * 0.18, 0, -Math.sin(a) * 0.18); }
  const sm = mug('#3d5afe'); sm.position.set(sx - 0.3, 1.61, sz + 0.25); sm.rotation.y = -0.6; scene.add(sm);
  cyl(scene, 0.22, 0.17, 0.36, mat('#f0e3cf', 0.45), sx + 0.3, 1.79, sz - 0.2);
  for (let i = 0; i < 6; i++) { const l = add(scene, new THREE.SphereGeometry(0.16, 10, 8), mat(i % 2 ? '#4aa874' : '#3a8f60', 0.8), sx + 0.3 + Math.cos(i) * 0.12, 2.05 + (i % 3) * 0.1, sz - 0.2 + Math.sin(i) * 0.12); l.scale.set(0.8, 1.3, 0.8); }
  ao(scene, sx, sz, 2.2, 2.2, 0.45);
  const round = add(scene, new THREE.CircleGeometry(3.3, 48), mat('#f3e6cf', 1), BEAN[0], 0.025, BEAN[1] + 0.6, false);
  round.rotation.x = -Math.PI / 2;
  add(scene, new THREE.RingGeometry(2.9, 3.05, 48), mat('#ff6242', 1), BEAN[0], 0.03, BEAN[1] + 0.6, false).rotation.x = -Math.PI / 2;
  // the clock: the visitor's own time
  const face = canvasTex(256, 256, (c, w) => {
    c.fillStyle = '#fbf8f2'; c.beginPath(); c.arc(w / 2, w / 2, w / 2, 0, 7); c.fill();
    c.fillStyle = '#1d1c1a';
    for (let i = 0; i < 12; i++) { c.save(); c.translate(w / 2, w / 2); c.rotate((i / 12) * Math.PI * 2); c.fillRect(-3, -w / 2 + 14, 6, i % 3 ? 14 : 26); c.restore(); }
    c.font = '700 20px "Bricolage Grotesque", sans-serif'; c.textAlign = 'center'; c.fillStyle = '#3d5afe'; c.fillText('demaze', w / 2, w * 0.7);
  });
  const clock = new THREE.Group();
  clock.position.set(0.2, 6.6, BACK + 0.1);
  scene.add(clock);
  const rim = cyl(clock, 0.95, 0.95, 0.2, mat('#1d1c1a', 0.4), 0, 0, 0.1, 48);
  rim.rotation.x = Math.PI / 2;
  add(clock, new THREE.CircleGeometry(0.85, 48), new THREE.MeshStandardMaterial({ map: face, roughness: 0.4 }), 0, 0, 0.21, false);
  const hand = (len, w, color, z) => { const h = new THREE.Group(); h.position.z = z; clock.add(h); add(h, rgeo(w, len, 0.02, w / 2 - 0.001, 1), mat(color, 0.4), 0, len / 2 - 0.08, 0, false); return h; };
  const hands = { h: hand(0.5, 0.07, '#1d1c1a', 0.23), m: hand(0.72, 0.05, '#1d1c1a', 0.25), s: hand(0.78, 0.02, '#ff6242', 0.27) };
  // prints above the board: the brand's shapes, framed
  const prints = [
    (c, w, h) => { c.fillStyle = '#ffcb45'; c.fillRect(0, 0, w, h); c.fillStyle = '#1d1c1a'; c.beginPath(); c.moveTo(w * 0.3, h * 0.25); c.lineTo(w * 0.75, h * 0.5); c.lineTo(w * 0.3, h * 0.75); c.lineTo(w * 0.42, h * 0.5); c.fill(); },
    (c, w, h) => { c.fillStyle = '#3d5afe'; c.fillRect(0, 0, w, h); c.strokeStyle = '#f4f1ea'; c.lineWidth = 10; c.lineJoin = 'round'; c.beginPath(); c.moveTo(w * 0.15, h * 0.8); c.lineTo(w * 0.15, h * 0.5); c.lineTo(w * 0.5, h * 0.5); c.lineTo(w * 0.5, h * 0.25); c.lineTo(w * 0.85, h * 0.25); c.stroke(); c.fillStyle = '#ff6242'; c.beginPath(); c.arc(w * 0.85, h * 0.25, 16, 0, 7); c.fill(); },
    (c, w, h) => { c.fillStyle = '#f4f1ea'; c.fillRect(0, 0, w, h); for (const [x, y, r, col] of [[0.35, 0.4, 0.22, '#a58bff'], [0.62, 0.58, 0.2, '#2fd0a0'], [0.45, 0.7, 0.1, '#ff6242']]) { c.fillStyle = col; c.beginPath(); c.arc(x * w, y * h, r * w, 0, 7); c.fill(); } },
  ];
  prints.forEach((draw, i) => {
    const x = BOARD.x - 2.6 + i * 2.6, y = 5.6 + (i === 1 ? 0.3 : 0);
    rbox(scene, 1.9, 2.4, 0.12, 0.04, mat('#1d1c1a', 0.5), x, y, BACK + 0.08);
    add(scene, new THREE.PlaneGeometry(1.6, 2.1), new THREE.MeshStandardMaterial({ map: canvasTex(192, 256, draw), roughness: 0.7 }), x, y, BACK + 0.15, false);
  });
  return { hands };
}

// Everything that never moves, merged: the room is some 350 pieces of furniture and props, each its own draw call
// (and again in each shadow map) every frame, which kept the main thread busy for most of a frame. Pieces that share a
// look (roughness, metal, texture, shadows) become one mesh, each piece's colour kept per vertex. Transparent pieces
// (they are sorted by depth) and `keep` (whatever the day moves, lights or retextures) stay as they are.
const LOOK = ['roughness', 'metalness', 'envMapIntensity', 'side', 'flatShading', 'opacity', 'alphaTest', 'depthWrite', 'depthTest', 'toneMapped', 'polygonOffset', 'polygonOffsetFactor', 'polygonOffsetUnits', 'wireframe'];
const MAPS = ['normalMap', 'roughnessMap', 'metalnessMap', 'aoMap', 'lightMap', 'bumpMap', 'emissiveMap', 'alphaMap', 'displacementMap', 'envMap'];
function bake(scene, keep) {
  const skip = new Set();
  for (const o of keep) o?.traverse?.((c) => skip.add(c));
  scene.updateMatrixWorld(true);
  const shown = (o) => { for (let p = o; p; p = p.parent) if (!p.visible) return false; return true; };
  const sets = new Map();
  scene.traverse((m) => {
    if (!m.isMesh || m.isInstancedMesh || skip.has(m) || !shown(m) || m.renderOrder) return;
    const mt = m.material, g = m.geometry;
    if (!mt?.isMeshStandardMaterial || mt.transparent || mt.vertexColors || MAPS.some((k) => mt[k])) return;
    if (g.isInstancedBufferGeometry || !g.attributes.normal || g.morphAttributes.position || m.matrixWorld.determinant() < 0) return;
    const key = [mt.type, mt.map?.uuid, mt.emissive.getHexString(), mt.emissiveIntensity, ...LOOK.map((k) => mt[k]), m.castShadow, m.receiveShadow, !!g.attributes.uv].join();
    if (!sets.has(key)) sets.set(key, []);
    sets.get(key).push(m);
  });
  const nm = new THREE.Matrix3(), v = new THREE.Vector3();
  let n = 0;
  for (const list of sets.values()) {
    if (list.length < 2) continue;
    const uv = !!list[0].geometry.attributes.uv;
    let verts = 0, idx = 0;
    for (const m of list) { const g = m.geometry, c = g.attributes.position.count; verts += c; idx += g.index ? g.index.count : c; }
    const P = new Float32Array(verts * 3), N = new Float32Array(verts * 3), C = new Float32Array(verts * 3), U = uv ? new Float32Array(verts * 2) : null;
    const I = verts > 65535 ? new Uint32Array(idx) : new Uint16Array(idx);
    let o = 0, oi = 0;
    for (const m of list) {
      const g = m.geometry, pos = g.attributes.position, nor = g.attributes.normal, col = m.material.color, c = pos.count;
      nm.getNormalMatrix(m.matrixWorld);
      for (let i = 0; i < c; i++) {
        v.fromBufferAttribute(pos, i).applyMatrix4(m.matrixWorld); v.toArray(P, (o + i) * 3);
        v.fromBufferAttribute(nor, i).applyMatrix3(nm).normalize(); v.toArray(N, (o + i) * 3);
        C[(o + i) * 3] = col.r; C[(o + i) * 3 + 1] = col.g; C[(o + i) * 3 + 2] = col.b;
        if (uv) { U[(o + i) * 2] = g.attributes.uv.getX(i); U[(o + i) * 2 + 1] = g.attributes.uv.getY(i); }
      }
      if (g.index) for (let i = 0; i < g.index.count; i++) I[oi++] = g.index.getX(i) + o;
      else for (let i = 0; i < c; i++) I[oi++] = o + i;
      o += c;
      m.removeFromParent();
    }
    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.BufferAttribute(P, 3));
    geo.setAttribute('normal', new THREE.BufferAttribute(N, 3));
    geo.setAttribute('color', new THREE.BufferAttribute(C, 3));
    if (uv) geo.setAttribute('uv', new THREE.BufferAttribute(U, 2));
    geo.setIndex(new THREE.BufferAttribute(I, 1));
    const material = list[0].material.clone();
    material.color.set('#ffffff');
    material.vertexColors = true;
    const merged = new THREE.Mesh(geo, material);
    merged.castShadow = list[0].castShadow; merged.receiveShadow = list[0].receiveShadow;
    merged.matrixAutoUpdate = false;
    scene.add(merged);
    n += list.length - 1;
  }
  return n;
}

// A soft room made of light, drawn once into an environment map: the window's daylight, the ceiling, the warm floor.
// It gives the metal, the board, the mugs and the machine something to reflect.
function environment(renderer) {
  const s = new THREE.Scene();
  const panel = (w, h, color, k, x, y, z, rx = 0, ry = 0) => {
    const m = new THREE.Mesh(new THREE.PlaneGeometry(w, h), new THREE.MeshBasicMaterial({ color: new THREE.Color(color).multiplyScalar(k), side: THREE.DoubleSide }));
    m.position.set(x, y, z); m.rotation.set(rx, ry, 0);
    s.add(m);
  };
  s.add(new THREE.Mesh(new THREE.BoxGeometry(60, 26, 44), new THREE.MeshBasicMaterial({ color: new THREE.Color('#c9b69b').multiplyScalar(0.8), side: THREE.BackSide })));
  panel(60, 44, '#7a5a3c', 0.9, 0, -12.9, 0, -Math.PI / 2);
  panel(14, 7, '#eaf4ff', 5, -7, 3, -21.9);
  panel(8, 8, '#fff1dc', 2.2, 0, 12.9, 0, Math.PI / 2);
  panel(20, 12, '#fff8ee', 1.1, 0, 2, 21.9);
  const pm = new THREE.PMREMGenerator(renderer);
  const tex = pm.fromScene(s, 0.03).texture;
  pm.dispose();
  return tex;
}

/* ---------- walking: a grid of the room, A* round the furniture, corners rounded off ---------- */

const NB = [[1, 0, 1], [-1, 0, 1], [0, 1, 1], [0, -1, 1], [1, 1, Math.SQRT2], [1, -1, Math.SQRT2], [-1, 1, Math.SQRT2], [-1, -1, Math.SQRT2]];

class Nav {
  constructor() {
    this.c = 0.25;
    this.x0 = LEFT; this.z0 = BACK;
    this.nx = Math.ceil((RIGHT - LEFT) / this.c); this.nz = Math.ceil((FRONT - BACK) / this.c);
    const N = this.nx * this.nz;
    this.base = new Uint8Array(N); this.work = new Uint8Array(N);
    this.gs = new Float32Array(N); this.from = new Int32Array(N); this.closed = new Uint8Array(N);
    this.each((i, x, z) => { if (x < LEFT + 0.95 || z < BACK + 0.95 || x > RIGHT - 0.8 || z > FRONT - 0.5) this.base[i] = 1; });
  }
  each(fn) { for (let j = 0; j < this.nz; j++) for (let i = 0; i < this.nx; i++) fn(j * this.nx + i, this.x0 + (i + 0.5) * this.c, this.z0 + (j + 0.5) * this.c); }
  rect(x0, z0, x1, z1, pad = R_BODY) {
    this.each((i, x, z) => { const dx = Math.max(x0 - x, 0, x - x1), dz = Math.max(z0 - z, 0, z - z1); if (dx * dx + dz * dz < pad * pad) this.base[i] = 1; });
  }
  disc(grid, cx, cz, r) {
    const { c, nx, nz } = this;
    const i0 = Math.max(0, Math.floor((cx - r - this.x0) / c)), i1 = Math.min(nx - 1, Math.floor((cx + r - this.x0) / c));
    const j0 = Math.max(0, Math.floor((cz - r - this.z0) / c)), j1 = Math.min(nz - 1, Math.floor((cz + r - this.z0) / c));
    for (let j = j0; j <= j1; j++) for (let i = i0; i <= i1; i++) {
      const x = this.x0 + (i + 0.5) * c, z = this.z0 + (j + 0.5) * c;
      if ((x - cx) ** 2 + (z - cz) ** 2 < r * r) grid[j * nx + i] = 1;
    }
  }
  cell(x, z) { return [Math.floor((x - this.x0) / this.c), Math.floor((z - this.z0) / this.c)]; }
  blocked(grid, x, z) {
    const [i, j] = this.cell(x, z);
    return i < 0 || j < 0 || i >= this.nx || j >= this.nz || grid[j * this.nx + i] === 1;
  }
  nearest(grid, x, z) { // the nearest open cell to a point
    const [ci, cj] = this.cell(x, z);
    for (let r = 0; r < 14; r++) {
      let best = -1, bd = Infinity;
      for (let j = cj - r; j <= cj + r; j++) for (let i = ci - r; i <= ci + r; i++) {
        if (Math.max(Math.abs(i - ci), Math.abs(j - cj)) !== r || i < 0 || j < 0 || i >= this.nx || j >= this.nz) continue;
        const k = j * this.nx + i;
        if (!grid[k]) { const d = (i - ci) ** 2 + (j - cj) ** 2; if (d < bd) { bd = d; best = k; } }
      }
      if (best >= 0) return best;
    }
    return -1;
  }
  clear(grid, ax, az, bx, bz) { // a straight line between two points crosses no blocked cell
    const n = Math.ceil(Math.hypot(bx - ax, bz - az) / (this.c * 0.4));
    for (let k = 1; k < n; k++) if (this.blocked(grid, ax + ((bx - ax) * k) / n, az + ((bz - az) * k) / n)) return false;
    return true;
  }
  astar(grid, si, ei) {
    const { nx, nz, gs, from, closed } = this;
    gs.fill(Infinity); closed.fill(0);
    const ex = ei % nx, ez = (ei / nx) | 0;
    const H = (i) => { const dx = Math.abs((i % nx) - ex), dz = Math.abs(((i / nx) | 0) - ez); return dx + dz + (Math.SQRT2 - 2) * Math.min(dx, dz); };
    const hi = [], hf = [];
    const push = (i, f) => { let k = hi.length; hi.push(i); hf.push(f); while (k) { const p = (k - 1) >> 1; if (hf[p] <= f) break; hi[k] = hi[p]; hf[k] = hf[p]; k = p; } hi[k] = i; hf[k] = f; };
    const pop = () => {
      const top = hi[0], li = hi.pop(), lf = hf.pop();
      if (hi.length) {
        let k = 0;
        for (;;) { let c = 2 * k + 1; if (c >= hi.length) break; if (c + 1 < hi.length && hf[c + 1] < hf[c]) c++; if (hf[c] >= lf) break; hi[k] = hi[c]; hf[k] = hf[c]; k = c; }
        hi[k] = li; hf[k] = lf;
      }
      return top;
    };
    gs[si] = 0; from[si] = -1; push(si, H(si));
    while (hi.length) {
      const i = pop();
      if (i === ei) break;
      if (closed[i]) continue;
      closed[i] = 1;
      const x = i % nx, z = (i / nx) | 0;
      for (const [dx, dz, w] of NB) {
        const X = x + dx, Z = z + dz;
        if (X < 0 || Z < 0 || X >= nx || Z >= nz) continue;
        const j = Z * nx + X;
        if (grid[j] || closed[j]) continue;
        if (dx && dz && (grid[z * nx + X] || grid[Z * nx + x])) continue;
        const g = gs[i] + w;
        if (g < gs[j]) { gs[j] = g; from[j] = i; push(j, g + H(j)); }
      }
    }
    if (gs[ei] === Infinity) return null;
    const out = [];
    for (let i = ei; i !== -1; i = from[i]) out.push([this.x0 + ((i % nx) + 0.5) * this.c, this.z0 + (((i / nx) | 0) + 0.5) * this.c]);
    return out.reverse();
  }
  // A path from a to b for one of the crew, round the furniture, the chairs and whoever is standing still (or,
  // with `all`, whoever is in the way at all): string-pulled to its corners, the corners rounded.
  path(a, b, who, all) {
    const g = this.work;
    g.set(this.base);
    for (const ch of who.o.chairs) if (ch !== who.chair) this.disc(g, ch.x, ch.z, 1.0 + R_BODY);
    for (const o of who.o.actors) if (o !== who && (all || o.speed < 0.3)) this.disc(g, o.x, o.z, R_PAIR);
    const si = this.nearest(g, a[0], a[1]), ei = this.nearest(g, b[0], b[1]);
    if (si < 0 || ei < 0) return null;
    const cells = this.astar(g, si, ei);
    if (!cells) return null;
    const raw = [a, ...cells.slice(1, -1), b];
    // string-pull: keep only the corners a straight walk can't skip
    const pts = [raw[0]];
    let anchor = 0;
    for (let j = 2; j < raw.length; j++) {
      if (!this.clear(g, raw[anchor][0], raw[anchor][1], raw[j][0], raw[j][1])) { anchor = j - 1; pts.push(raw[anchor]); }
    }
    pts.push(raw[raw.length - 1]);
    return this.round(g, pts);
  }
  // each corner becomes a curve (a quadratic through the corner), as tight as the room needs
  round(g, pts) {
    if (pts.length < 3) return pts;
    const out = [pts[0]];
    for (let i = 1; i < pts.length - 1; i++) {
      const [ax, az] = pts[i - 1], [bx, bz] = pts[i], [cx, cz] = pts[i + 1];
      const la = Math.hypot(ax - bx, az - bz), lc = Math.hypot(cx - bx, cz - bz);
      let r = Math.min(1.6, la * 0.45, lc * 0.45), curve = null;
      while (r > 0.15 && !curve) {
        const p0 = [bx + ((ax - bx) / la) * r, bz + ((az - bz) / la) * r], p2 = [bx + ((cx - bx) / lc) * r, bz + ((cz - bz) / lc) * r];
        const c = [];
        for (let k = 0; k <= 8; k++) { const u = k / 8, w0 = (1 - u) ** 2, w1 = 2 * u * (1 - u), w2 = u * u; c.push([w0 * p0[0] + w1 * bx + w2 * p2[0], w0 * p0[1] + w1 * bz + w2 * p2[1]]); }
        if (c.every(([x, z]) => !this.blocked(this.base, x, z))) curve = c; else r *= 0.5;
      }
      out.push(...(curve || [[bx, bz]]));
    }
    out.push(pts[pts.length - 1]);
    return out;
  }
}

class Path {
  constructor(pts) {
    this.p = pts; this.d = [0];
    for (let i = 1; i < pts.length; i++) this.d.push(this.d[i - 1] + Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1]));
    this.total = this.d[this.d.length - 1];
  }
  at(s) {
    s = Math.max(0, Math.min(this.total, s));
    let i = 1;
    while (i < this.d.length - 1 && this.d[i] < s) i++;
    const k = (s - this.d[i - 1]) / (this.d[i] - this.d[i - 1] || 1);
    return [this.p[i - 1][0] + (this.p[i][0] - this.p[i - 1][0]) * k, this.p[i - 1][1] + (this.p[i][1] - this.p[i - 1][1]) * k];
  }
}

/* ---------- the crew at work ---------- */

// One of the crew in the room: where they stand, which way they face, whether they sit, what they hold, what they
// look at, and a queue of things to do.
class Actor {
  constructor(o, spec, x, z, yaw, name) {
    this.o = o; this.name = name;
    this.c = K.makeCharacter({ ...spec, density: o.density });
    this.c.rig.rotation.x = 0; // (the crew band leans them toward its flat camera; here the camera looks down)
    this.c.root.scale.setScalar(SIZE);
    // shadows from a plain copy of each furry part (one draw, not a stack of fur shells), invisible to the camera
    const casts = [];
    this.c.root.traverse((m) => { if (m.isMesh && m.geometry.isInstancedBufferGeometry) casts.push(m); });
    for (const m of casts) {
      const geo = new THREE.BufferGeometry();
      geo.index = m.geometry.index;
      geo.setAttribute('position', m.geometry.getAttribute('position'));
      const proxy = new THREE.Mesh(geo, CASTER);
      proxy.position.copy(m.position); proxy.scale.copy(m.scale); proxy.quaternion.copy(m.quaternion);
      proxy.castShadow = true; proxy.frustumCulled = false;
      m.parent.add(proxy);
    }
    o.scene.add(this.c.root);
    this.x = x; this.z = z; this.yaw = yaw;
    this.i = o.actors.length;
    this.sit = 0; this.chair = null;
    this.speed = 0; this.accel = 0; this.turn = 0; this.phase = Math.random() * 6;
    this.queue = []; this.task = null; this.tt = 0; this.act = 'idle';
    this.path = null; this.s = 0; this.blocked = 0;
    this.over = null; // a reaction on top of the act: { name, t, dur }
    this.gazeW = 0; this.gaze = null; this.glance = null; this.idleLook = { t: rand(2, 5), yaw: 0 };
    this.extraLean = 0; this.extraSq = 0; this.extraBob = 0;
    this.lag = new THREE.Vector3(); this.lagV = new THREE.Vector3(); this.px = x; this.pz = z;
    this.hands = [null, null];
    this.holding = null;
  }

  // a group at the end of an arm (0: right, 1: left), for things held
  palm(k = 0) {
    if (!this.hands[k]) { const h = new THREE.Group(); h.position.set(0, -0.7, 0.1); this.c.arms[k].add(h); this.hands[k] = h; }
    return this.hands[k];
  }
  head() { return { x: this.x, y: this.c.root.position.y + HEAD_H, z: this.z }; }
  plan(list) { this.queue.push(...list); }
  moving() { return this.speed > 0.3; }

  next() {
    this.task = this.queue.shift() || null;
    this.tt = 0; this.path = null; this.blocked = 0;
    if (!this.task) return;
    const k = this.task;
    if (k.do === 'call') { k.fn(this); this.next(); }
  }

  update(dt, t) {
    if (!this.task) this.next();
    const k = this.task;
    this.tt += dt;
    this.act = 'idle';
    this.gaze = null;
    this.extraLean = this.extraSq = this.extraBob = 0;
    const yaw0 = this.yaw;
    let walking = false;
    if (k) {
      if (k.gaze) this.gaze = val(k.gaze, this);
      if (k.do === 'go' || k.do === 'step') walking = this.follow(dt, k);
      else if (k.do === 'face') {
        this.turnTo(val(k.yaw, this), dt, 7);
        if (Math.abs(wrap(val(k.yaw, this) - this.yaw)) < 0.04 || this.tt > 1.6) this.next();
      } else if (k.do === 'stand') this.rise(dt, k);
      else if (k.do === 'sit') this.lower(dt, k);
      else if (k.do === 'wait') {
        this.act = k.act || 'idle';
        if (k.face !== undefined) this.turnTo(val(k.face, this), dt, 6);
        if (k.until() || this.tt > (k.max || 20)) this.next();
      } else { // an act, for a while
        this.act = k.do;
        if (k.face !== undefined) this.turnTo(val(k.face, this), dt, 6);
        if (k.tick) k.tick(this, dt, t);
        if (this.tt >= (val(k.dur, this) || 1) || (k.until && k.until())) this.next();
      }
    }
    if (!walking) { const v0 = this.speed; this.speed = K.damp(this.speed, 0, 10, dt); this.accel = (this.speed - v0) / Math.max(dt, 1e-3); }
    // shuffles (drawing along the board) count as walking for the legs
    const moved = Math.hypot(this.x - this.px, this.z - this.pz) / Math.max(dt, 1e-3);
    if (!walking && moved > 0.05) this.speed = Math.max(this.speed, Math.min(WALK * 0.6, moved));
    this.turn = K.damp(this.turn, wrap(this.yaw - yaw0) / Math.max(dt, 1e-3), 12, dt);
    this.phase += (this.speed * 2.9 + Math.abs(this.turn) * 1.4 * (1 - this.sit)) * dt;
    // the fur trails the motion and springs back
    const vx = (this.x - this.px) / Math.max(dt, 1e-3), vz = (this.z - this.pz) / Math.max(dt, 1e-3);
    this.px = this.x; this.pz = this.z;
    const tx = -vx * 0.18, tz = -vz * 0.18;
    this.lagV.x += ((tx - this.lag.x) * 90 - this.lagV.x * 11) * dt; this.lagV.z += ((tz - this.lag.z) * 90 - this.lagV.z * 11) * dt;
    this.lag.addScaledVector(this.lagV, dt);
    this.c.lag.value.copy(this.lag);
    if (this.over && t - this.over.t > this.over.dur) this.over = null;
    this.look(dt, t, walking);
    this.pose(dt, t);
  }

  turnTo(yaw, dt, k) { this.yaw += wrap(yaw - this.yaw) * (1 - Math.exp(-k * dt)); }

  // a small sideways move along the board, unless it would take them into someone
  shuffle(x, dt) {
    const nx = K.damp(this.x, x, 3, dt);
    if (!this.o.crowd(this, nx, this.z)) this.x = nx;
  }

  // Walk the path: turn toward it first, ease in, slow for corners and to stop, and never step into anyone.
  follow(dt, k) {
    if (!this.path) {
      if ((k.retry = (k.retry || 0) - dt) > 0) return false;
      const to = val(k.to, this);
      const pts = k.do === 'step' ? [[this.x, this.z], to] : this.o.nav.path([this.x, this.z], to, this, k.avoid);
      if (!pts) { k.retry = 0.6; k.avoid = false; return false; }
      this.path = new Path(pts); this.s = 0;
    }
    const P = this.path, left = P.total - this.s;
    if (left < 0.01) { this.x = P.p[P.p.length - 1][0]; this.z = P.p[P.p.length - 1][1]; this.next(); return false; }
    const ahead = P.at(this.s + 0.5), far = P.at(this.s + 1.6);
    if (k.side === undefined) k.side = k.do === 'step' && !k.back && P.total < 1.6;
    const aim = left > 0.12 && !k.side ? angTo(ahead[0] - this.x, ahead[1] - this.z) + (k.back ? Math.PI : 0) : this.yaw;
    const err = wrap(aim - this.yaw);
    this.turnTo(aim, dt, this.speed < 0.6 ? 6 : 4.5);
    // how sharp the path bends a little ahead, to slow for it
    const bend = Math.abs(wrap(angTo(far[0] - ahead[0], far[1] - ahead[1]) - aim));
    const top = (k.do === 'step' ? WALK * 0.55 : WALK) * (1 - 0.35 * Math.min(1, bend));
    const aimSpeed = Math.min(top, Math.sqrt(2 * 2.6 * left) + 0.1) * Math.max(0, Math.cos(err)) ** 3;
    const v0 = this.speed;
    this.speed = K.damp(this.speed, aimSpeed, aimSpeed > this.speed ? 3.2 : 7, dt);
    const ds = Math.min(left, this.speed * dt);
    const [nx, nz] = P.at(this.s + ds);
    const who = this.o.crowd(this, nx, nz);
    if (who) { // someone's there: wait, look at them, and after a moment find a way round
      this.speed = K.damp(v0, 0, 14, dt);
      this.blocked += dt;
      this.glance = { who, until: this.o.t + 0.6 };
      if (this.blocked > 0.7 && k.do === 'go') { this.path = null; k.avoid = true; this.blocked = 0; }
      this.accel = (this.speed - v0) / Math.max(dt, 1e-3);
      return true;
    }
    this.blocked = 0;
    this.s += ds; this.x = nx; this.z = nz;
    this.accel = (this.speed - v0) / Math.max(dt, 1e-3);
    return true;
  }

  // Getting up: a lean forward to push off, up, and the chair rolls back behind.
  rise(dt, k) {
    // someone passing behind the chair: wait for them before pushing back into them
    const ch = this.chair;
    const behind = ch && this.o.actors.find((o) => o !== this && Math.hypot(o.x - ch.x, o.z - (ch.home - ROLL)) < 2.7);
    if (behind && this.tt < 0.3 && (k.waited = (k.waited || 0) + dt) < 5) { this.tt = 0; this.glance = { who: behind, until: this.o.t + 0.5 }; return; }
    const u = Math.min(1, this.tt / 1.05);
    this.sit = 1 - K.smooth(K.clamp((u - 0.22) / 0.62, 0, 1));
    this.extraLean = 0.42 * Math.sin(Math.min(1, u / 0.85) * Math.PI);
    this.extraSq = -0.25 * Math.sin(K.clamp((u - 0.5) / 0.5, 0, 1) * Math.PI);
    if (ch) { // and never into anyone
      const z = ch.home - ROLL * K.smooth(K.clamp((u - 0.3) / 0.6, 0, 1));
      if (!this.o.actors.some((o) => o !== this && Math.hypot(o.x - ch.x, o.z - z) < 1.95)) ch.z = z;
    }
    if (u >= 1) { this.sit = 0; this.next(); }
  }

  // Sitting down: face the desk, lower with a lean, a little squash as the seat takes the weight; the chair rolls in.
  lower(dt, k) {
    this.seatY = k.y ?? SEAT_TOP - (0.5 - 0.28) * SIZE;
    this.turnTo(k.yaw ?? 0, dt, 8);
    const u = Math.min(1, this.tt / 1.15);
    this.sit = K.smooth(K.clamp(u / 0.7, 0, 1));
    this.extraLean = 0.32 * Math.sin(Math.min(1, u / 0.75) * Math.PI);
    this.extraSq = 0.35 * Math.sin(K.clamp((u - 0.6) / 0.3, 0, 1) * Math.PI);
    if (this.chair) { k.from ??= this.chair.z; this.chair.z = K.lerp(k.from, this.chair.home, K.smooth(K.clamp((u - 0.35) / 0.65, 0, 1))); }
    if (u >= 1) { this.sit = 1; this.next(); }
  }

  // Where the eyes go: what the task says, else a glance at whoever is passing, else ahead along the path, else,
  // now and then, a look around.
  look(dt, t, walking) {
    let target = null, w = 0;
    if (this.glance && this.o.t > this.glance.until) this.glance = null;
    if (this.gaze) { target = this.gaze; w = 1; }
    else if (this.glance) { target = this.glance.who.head(); w = 0.9; }
    else if (walking && this.path) { const [x, z] = this.path.at(this.s + 3); target = { x, y: HEAD_H * 0.85, z }; w = 0.7; }
    this.gazeW = K.damp(this.gazeW, w, 5, dt);
    if (target) this.gazeAt = target;
    if (this.act === 'idle' && !target) { // a look around, every few seconds
      this.idleLook.t -= dt;
      if (this.idleLook.t < 0) { this.idleLook.t = rand(2.5, 6); this.idleLook.yaw = Math.random() < 0.4 ? 0 : rand(-0.7, 0.7); }
    } else this.idleLook.yaw = 0;
  }

  pose(dt, t) {
    const c = this.c, p = K.pose0(), i = this.i, st = this.sit;
    p.br = 0.024 * Math.sin(t * 1.7 + i * 1.7);
    p.sway = 0.025 * Math.sin(t * 0.7 + i * 2.1) * (1 - st);
    p.hy = this.idleLook.yaw;
    // the walk: legs from the hips, arms counter-swinging a beat behind, the weight over each foot in turn, a bob
    // as the legs pass, the hips and shoulders twisting against each other, a lean into the pace
    const v = K.clamp(this.speed / WALK, 0, 1.2) * (1 - st);
    const turning = K.clamp(Math.abs(this.turn) / 3, 0, 1) * (1 - st) * (1 - Math.min(1, v * 3));
    const gait = Math.max(v, turning * 0.5);
    if (gait > 0.01) {
      const s = Math.sin(this.phase), sa = Math.sin(this.phase - 0.45);
      p.llx = -0.66 * s * gait; p.lrx = 0.66 * s * gait;
      p.alx = 0.5 * sa * v; p.arx = -0.5 * sa * v;
      p.alz = 0.38 + 0.1 * v; p.arz = -0.38 - 0.1 * v;
      p.bob = 0.1 * gait * (1 - Math.abs(s)) - 0.035 * gait;
      p.sway += 0.08 * s * gait;
      p.twist = 0.12 * s * v;
      p.hy -= 0.08 * s * v; p.hz = -0.05 * s * gait;
      p.lean = 0.07 * v + K.clamp(this.accel * 0.035, -0.1, 0.12);
      p.sq = 0.12 * gait * (Math.abs(s) - 0.5);
    }
    // sitting: hips down, legs forward under the desk
    p.llx = K.lerp(p.llx, -1.45, st); p.lrx = K.lerp(p.lrx, -1.45, st);
    p.bob = K.lerp(p.bob, -0.24, st);
    p.lean = K.lerp(p.lean, 0.06, st);
    const a = this.act, k = this.task, u = k ? Math.min(1, this.tt / (val(k.dur, this) || 1)) : 0;
    const arc = Math.sin(u * Math.PI); // in and out over the act
    if (a === 'type') { // bursts of typing, eyes on the screen; Build nods along to the music
      const burst = Math.sin(t * 0.8 + i * 2) > -0.35 ? 1 : 0.15;
      const tap = (q) => Math.max(0, Math.sin(t * 17 + q)) * 0.09 * burst;
      p.alx = -1.0 - tap(0); p.arx = -1.0 - tap(1.9);
      p.alz = 0.14; p.arz = -0.14;
      p.hx = 0.14 + 0.03 * Math.sin(t * 1.3);
      p.hy = 0.06 * Math.sin(t * 0.45 + i);
      p.lean = 0.12;
      if (this.name === 'build') { const beat = Math.max(0, Math.sin(t * Math.PI * 1.85)); p.hx += 0.09 * beat * beat; p.hz = 0.05 * Math.sin(t * Math.PI * 0.925); }
    } else if (a === 'stretch') { // arms up, back arched, a yawn's worth of head back
      const e = K.smooth(K.clamp(u / 0.35, 0, 1)) * (1 - K.smooth(K.clamp((u - 0.7) / 0.3, 0, 1)));
      p.alz = K.lerp(0.38, 2.75, e); p.arz = K.lerp(-0.38, -2.75, e); p.alx = p.arx = -0.2 * e;
      p.lean = K.lerp(p.lean, -0.2, e); p.hx = -0.4 * e; p.sq = -0.45 * e + 0.2 * Math.sin(K.clamp((u - 0.7) / 0.3, 0, 1) * Math.PI);
      p.twist = 0.1 * Math.sin(u * Math.PI * 2) * e;
    } else if (a === 'phones') { // a hand up to the headphones, settling them
      const e = Math.sin(K.clamp(u, 0, 1) * Math.PI);
      p.alz = K.lerp(0.4, 2.3, e); p.alx = -0.5 * e; p.hz = 0.14 * e; p.hx = -0.05;
      p.arx = -1.0; p.arz = -0.14;
    } else if (a === 'sip') { // the mug up, a sip with the head tipped, down again
      const e = K.smooth(K.clamp(u / 0.35, 0, 1)) * (1 - K.smooth(K.clamp((u - 0.72) / 0.28, 0, 1)));
      p.arx = K.lerp(-1.0, -2.1, e); p.arz = K.lerp(-0.14, -0.62, e); p.hx = K.lerp(0.12, -0.28, e); p.hz = -0.06 * e;
      p.alx = -0.9; p.alz = 0.14; p.lean = K.lerp(0.12, -0.05, e);
    } else if (a === 'reach') { // the right arm to something at `k.h` (0 low .. 1 high), a lean in
      const e = K.smooth(K.clamp(u / 0.45, 0, 1)) * (1 - K.smooth(K.clamp((u - 0.6) / 0.4, 0, 1)));
      const h = k.h ?? 0.5;
      p.arx = K.lerp(p.arx, K.lerp(-1.2, -2.05, h), e); p.arz = K.lerp(p.arz, -0.12, e);
      p.lean = K.lerp(p.lean, 0.2 - h * 0.08, e); p.hx = K.lerp(p.hx, 0.25 - h * 0.35, e);
      p.alz = K.lerp(p.alz, 0.55, e);
    } else if (a === 'press') { // a quick poke, and back
      const e = Math.sin(K.clamp(u / 0.5, 0, 1) * Math.PI);
      p.arx = -1.7 * Math.max(e, 0.35 * arc) - 0.1; p.arz = -0.2; p.lean = 0.12 * e; p.hx = 0.1;
    } else if (a === 'draw') { // side-on to the board, left arm out to it, the pen following the line
      const tip = this.o.board.tip();
      const hgt = K.clamp((tip.y - 1.3) / 0.9, 0, 1);
      const sc = Math.sin(t * 9) * 0.05 * this.o.drawing;
      p.alz = K.lerp(1.3, 2.15, hgt) + sc; p.alx = -0.15 + Math.cos(t * 7) * 0.05;
      p.sway = -0.08; p.lean = 0.03;
      p.arz = -0.5; p.arx = 0.15;
    } else if (a === 'note') { // a hop up to stick a note at the top of the board
      const hop = Math.sin(K.clamp((u - 0.25) / 0.45, 0, 1) * Math.PI);
      const crouch = Math.sin(K.clamp(u / 0.25, 0, 1) * Math.PI) * (u < 0.25 ? 1 : 0);
      const land = Math.sin(K.clamp((u - 0.7) / 0.2, 0, 1) * Math.PI);
      p.alz = K.lerp(0.5, 2.6, Math.max(hop, K.clamp((u - 0.15) / 0.2, 0, 1) * (u < 0.75 ? 1 : 0))); p.alx = -0.1;
      p.arz = -0.6 - 0.6 * hop;
      this.extraBob = hop * 0.55 - crouch * 0.12 - land * 0.06;
      p.sq = crouch * 0.7 - hop * 0.55 + land * 0.5;
      p.sway = -0.1 * hop;
    } else if (a === 'erase') { // wide circles with the eraser, along the board
      const w = t * 6;
      p.alz = 1.7 + Math.sin(w) * 0.35; p.alx = Math.cos(w) * 0.25;
      p.sway = -0.08 + Math.sin(w) * 0.04; p.lean = 0.04;
    } else if (a === 'look') { // stand back, hands behind, head tilted, weighing it up
      p.hz = 0.14 * Math.sin(t * 0.6 + i); p.hx = -0.1;
      p.alx = 0.4; p.arx = 0.4; p.alz = 0.25; p.arz = -0.25;
      p.sway += 0.03 * Math.sin(t * 0.5);
    } else if (a === 'point') { // an arm along the plan, a pulse on each point
      const e = K.smooth(K.clamp(u / 0.2, 0, 1)) * (1 - K.smooth(K.clamp((u - 0.85) / 0.15, 0, 1)));
      p.alx = K.lerp(0, -1.6 - 0.12 * Math.abs(Math.sin(t * 3.2)), e); p.alz = K.lerp(0.38, 0.5 + 0.15 * Math.sin(t * 1.1), e);
      p.arz = -0.3; p.arx = 0.1;
    } else if (a === 'talk') { // hands going, the head nodding along, weight shifting
      p.alx = -0.6 + 0.32 * Math.sin(t * 4.2); p.arx = -0.55 + 0.32 * Math.sin(t * 3.7 + 1.5);
      p.alz = 0.4 + 0.14 * Math.sin(t * 2.3); p.arz = -0.4 - 0.14 * Math.sin(t * 2.9);
      p.hx = 0.08 * Math.sin(t * 5.5); p.hz = 0.07 * Math.sin(t * 1.9);
      p.sway += 0.03 * Math.sin(t * 1.3); p.twist = 0.06 * Math.sin(t * 1.7);
    } else if (a === 'nod' || a === 'listen') {
      p.hx = 0.15 * Math.max(0, Math.sin(t * (a === 'nod' ? 5 : 2.6))); p.hz = 0.08;
      p.alx = 0.25; p.arx = 0.25; p.alz = 0.3; p.arz = -0.3;
    } else if (a === 'wave') {
      const e = K.smooth(K.clamp(u / 0.2, 0, 1)) * (1 - K.smooth(K.clamp((u - 0.8) / 0.2, 0, 1)));
      p.alz = K.lerp(0.38, 2.5 + Math.sin(t * 11) * 0.32, e); p.alx = -0.25 * e; p.hz = 0.12 * e;
    } else if (a === 'think') { // a hand to the chin, the other across, weighing it up
      const e = K.smooth(K.clamp(u / 0.2, 0, 1)) * (1 - K.smooth(K.clamp((u - 0.85) / 0.15, 0, 1)));
      p.arx = K.lerp(p.arx, -1.9, e); p.arz = K.lerp(p.arz, 0.35, e);
      p.alx = K.lerp(p.alx, -0.7, e); p.alz = K.lerp(p.alz, -0.15, e);
      p.hz += 0.12 * e * Math.sin(t * 0.8); p.hx += 0.05 * e;
    } else if (a === 'lap') { // in the beanbag, the laptop on the knees, typing and reading
      const burst = Math.sin(t * 0.7) > -0.2 ? 1 : 0.1;
      const tap = (q) => Math.max(0, Math.sin(t * 15 + q)) * 0.08 * burst;
      p.alx = -0.75 - tap(0); p.arx = -0.75 - tap(1.7); p.alz = 0.2; p.arz = -0.2;
      p.hx = 0.3 + 0.04 * Math.sin(t * 0.8); p.hy = 0.1 * Math.sin(t * 0.3); p.lean = -0.08;
    } else if (a === 'cheer') { // both arms up, a little jump, a squash on landing
      const hop = Math.abs(Math.sin(u * Math.PI * 2));
      p.alz = 2.5 + 0.2 * Math.sin(t * 12); p.arz = -2.5 - 0.2 * Math.sin(t * 12 + 1);
      this.extraBob = hop * 0.4 * arc; p.sq = arc * (0.3 - hop * 0.6);
    }
    // something carried in the right hand stays up in front
    if (this.holding && a !== 'sip' && a !== 'reach' && a !== 'press') { p.arx = Math.min(p.arx, -1.05); p.arz = -0.14; }
    // reactions on top of the act
    this.chatW = K.damp(this.chatW || 0, this.over && this.over.name === 'chat' ? 1 : 0, 3.5, dt);
    {
      const g = this.chatW;
      if (g > 0.005) { // turned round in the chair to a visitor: gestures while talking, nods while listening
        const talking = Math.sin(this.o.t * 0.9) > 0;
        p.alx = K.lerp(p.alx, talking ? -0.7 + 0.3 * Math.sin(t * 4) : -0.4, g); p.alz = K.lerp(p.alz, talking ? 0.5 + 0.15 * Math.sin(t * 2.5) : 0.3, g);
        p.arx = K.lerp(p.arx, -0.5, g); p.arz = K.lerp(p.arz, -0.3, g);
        p.hx = K.lerp(p.hx, talking ? 0.06 * Math.sin(t * 5) : 0.12 * Math.max(0, Math.sin(t * 2.6)), g);
        p.lean = K.lerp(p.lean, -0.04, g);
      }
    }
    // the gaze: the head turns to it, the body helps past what a neck can do
    if (this.gazeW > 0.01 && this.gazeAt) {
      const g = this.gazeAt, hd = this.head();
      const rel = wrap(angTo(g.x - hd.x, g.z - hd.z) - this.yaw);
      const yawH = K.clamp(rel, -1.15, 1.15);
      const pitch = K.clamp(-Math.atan2(g.y - hd.y, Math.hypot(g.x - hd.x, g.z - hd.z)) * 0.8, -0.5, 0.45);
      p.hy = K.lerp(p.hy, yawH, this.gazeW);
      p.hx = K.lerp(p.hx, pitch, this.gazeW * 0.8);
      p.twist += K.clamp(rel - yawH, -0.5, 0.5) * 0.5 * this.gazeW;
    }
    p.lean += this.extraLean; p.sq += this.extraSq; p.bob += this.extraBob;
    K.blink(c, dt, t);
    K.apply(c, p, dt);
    // where the character is: seated on the chair, or standing on the floor
    const seatY = this.seatY ?? SEAT_TOP - (0.5 - 0.28) * SIZE;
    c.root.position.set(this.x, K.lerp(0, seatY, this.sit), this.z);
    c.root.rotation.y = this.yaw + (c.cur ? c.cur.yaw : 0);
    c.shadow.visible = this.sit < 0.3;
    if (this.chair && this.sit > 0.5) this.chair.yaw = this.yaw;
  }
}

class Office {
  constructor(scene, density) {
    this.scene = scene;
    this.density = density;
    this.actors = [];
    this.t = 0;
    const r = room(scene);
    this.clouds = r.clouds;
    this.desks = DESKS.map((d, i) => desk(scene, d.x, d.z, i === 0));
    this.chairs = DESKS.map((d) => chair(scene, d.x, SEAT_Z));
    DESKS.forEach((d) => lamp(scene, d.x, d.z));
    lamp(scene, BOARD.x, -6.2, 9);
    this.kitchen = kitchen(scene);
    this.board = new Board(scene);
    this.drawing = 0;
    this.decor = dressing(scene);
    // the walkable floor
    this.nav = new Nav();
    for (const d of DESKS) this.nav.rect(d.x - DESK_W / 2, d.z - DESK_D / 2, d.x + DESK_W / 2, d.z + DESK_D / 2);
    this.nav.rect(COUNTER.x0, BACK, COUNTER.x1, COUNTER.z);
    this.nav.rect(LEFT, -6.6, LEFT + 1.5, -1.8);
    this.nav.rect(-15.7 - 1.1, -7.3 - 1.1, -15.7 + 1.1, -7.3 + 1.1, R_BODY * 0.9);
    this.nav.rect(BIN[0] - 0.6, BIN[1] - 0.6, BIN[0] + 0.6, BIN[1] + 0.6, R_BODY * 0.9);
    this.nav.rect(BEAN[0] - 1.5, BEAN[1] - 1.3, BEAN[0] + 1.5, BEAN[1] + 1.3);
    this.nav.rect(SIDE[0] - 0.85, SIDE[1] - 0.85, SIDE[0] + 0.85, SIDE[1] + 0.85, R_BODY * 0.9);
    // the mug Idea carries, and the one left in the sink
    this.mug = mug('#ffcb45');
    this.mug.visible = false;
    scene.add(this.mug);
    this.mugAt = 'none'; // none | tray | hand | desk
    this.fill = 0; this.steam = 0;
    this.sinkMug = mug('#ffcb45');
    this.sinkMug.visible = false;
    this.sinkMug.position.set(SINK_X - 0.2, COUNTER.top - 0.02, -7.9);
    this.sinkMug.rotation.set(0.25, 0.8, 1.2);
    scene.add(this.sinkMug);
    this.brew = -1;
    this.puffs = Array.from({ length: 6 }, (_, k) => {
      const sp = new THREE.Sprite(new THREE.SpriteMaterial({ map: SOFT, color: '#ffffff', transparent: true, opacity: 0, depthWrite: false }));
      sp.userData.k = k / 6;
      scene.add(sp);
      return sp;
    });
    const marker = new THREE.Group();
    add(marker, new THREE.CylinderGeometry(0.06, 0.06, 0.42, 10), mat('#3d5afe', 0.4));
    add(marker, new THREE.CylinderGeometry(0.066, 0.066, 0.14, 10), mat('#1d1c1a', 0.4), 0, 0.25, 0);
    marker.rotation.x = Math.PI / 2;
    this.marker = marker;

    const F = K.FUR;
    const build = this.add({ fur: F.mint, acc: 'headphones', accColor: '#3d5afe' }, DESKS[0].x, SEAT_Z, 0, 'build');
    const idea = this.add({ fur: F.cream, acc: 'cap', accColor: '#ffcb45' }, DESKS[1].x, SEAT_Z, 0, 'idea');
    const design = this.add({ fur: F.lilac, acc: 'bow', accColor: '#ff85b8' }, BOARD.x - 3.4, DRAW_Z, Math.PI / 2, 'design');
    const launch = this.add({ fur: F.honey, acc: 'glasses' }, ...SPOT.board, Math.PI + 0.6, 'launch');
    build.chair = this.chairs[0]; idea.chair = this.chairs[1];
    build.sit = idea.sit = 1;
    design.palm(1).add(marker);
    Object.assign(this, { build, idea, design, launch });
    this.pairs = new Map();
    this.days();
  }

  add(spec, x, z, yaw, name) { const a = new Actor(this, spec, x, z, yaw, name); this.actors.push(a); return a; }

  // Would stepping to (x, z) take `who` into another of the crew? (Stepping away from someone is always allowed.)
  crowd(who, x, z) {
    for (const o of this.actors) {
      if (o === who) continue;
      const d1 = Math.hypot(o.x - x, o.z - z);
      if (d1 < R_PAIR - 0.1 && d1 < Math.hypot(o.x - who.x, o.z - who.z) - 1e-4) return o;
    }
    for (const ch of this.chairs) { // a chair rolled back into the way since the path was planned
      if (ch === who.chair) continue;
      const d1 = Math.hypot(ch.x - x, ch.z - z);
      if (d1 < 1.0 + R_BODY * 0.85 && d1 < Math.hypot(ch.x - who.x, ch.z - who.z) - 1e-4) return { head: () => ({ x: ch.x, y: 1.5, z: ch.z }) };
    }
    return null;
  }

  // Each keeps their own day going; when a queue runs out it plans the next round.
  days() {
    const o = this, b = this.board;
    const { build, idea, design, launch } = this;
    const call = (fn) => ({ do: 'call', fn });
    const again = (who, day) => call(() => who.plan(day()));
    const toward = (who) => (me) => angTo(who.x - me.x, who.z - me.z);

    const buildDay = () => [
      { do: 'type', dur: rand(9, 12) }, { do: 'stretch', dur: 2.6 },
      { do: 'type', dur: rand(6, 8) }, { do: 'phones', dur: 1.4 },
      again(build, buildDay),
    ];

    const [ex, ez] = EXIT[1], seat = [DESKS[1].x, SEAT_Z];
    const onDesk = () => new THREE.Vector3(DESKS[1].x + 1.55, DESK_TOP + 0.01, DESKS[1].z - 0.35);
    const ideaDay = () => {
      const round = [{ do: 'type', dur: rand(7, 9) }];
      if (o.mugAt === 'desk') round.push({ do: 'reach', dur: 0.9, h: 0.1, gaze: () => onDesk() }, call(() => o.hold(idea)));
      round.push({ do: 'stand' }, { do: 'step', to: [ex, ez] });
      if (o.mugAt === 'hand') {
        round.push(
          { do: 'go', to: SPOT.sink }, { do: 'face', yaw: Math.PI + 0.1 },
          { do: 'reach', dur: 1.0, h: 0.35, gaze: { x: SINK_X, y: COUNTER.top, z: -7.9 } }, call(() => o.toSink()),
        );
      }
      const tray = { x: MACHINE_X, y: COUNTER.top + 0.3, z: MACHINE_Z + 0.72 };
      const atMachine = angTo(MACHINE_X - SPOT.coffee[0], MACHINE_Z + 0.72 - SPOT.coffee[1]); // (from its right: the camera sees the pour)
      round.push(
        { do: 'go', to: SPOT.coffee }, { do: 'face', yaw: angTo(STACK[0] - SPOT.coffee[0], STACK[1] - SPOT.coffee[1]) },
        { do: 'reach', dur: 0.9, h: 0.45, gaze: { x: STACK[0], y: COUNTER.top + 0.6, z: STACK[1] } }, call(() => o.hold(idea, true)),
        { do: 'face', yaw: atMachine },
        { do: 'reach', dur: 0.9, h: 0.4, gaze: tray }, call(() => o.toTray()),
        { do: 'press', dur: 0.7, gaze: { x: MACHINE_X + 0.72, y: COUNTER.top + 0.9, z: MACHINE_Z + 0.66 } }, call(() => o.startBrew()),
        { do: 'wait', until: () => o.brew < 0, max: 5, gaze: tray, act: 'idle' },
        { do: 'reach', dur: 0.9, h: 0.4, gaze: tray }, call(() => o.hold(idea)),
        { do: 'go', to: [ex, ez] }, { do: 'step', to: seat }, { do: 'sit' },
        { do: 'sip', dur: 2.0 }, { do: 'type', dur: rand(4, 5) }, { do: 'sip', dur: 1.8 }, { do: 'type', dur: 3 },
        { do: 'reach', dur: 0.9, h: 0.1, gaze: () => onDesk() }, call(() => o.toDesk()),
        again(idea, ideaDay),
      );
      return round;
    };

    // Design draws a stretch of the route, steps back to look, and goes on; a note goes up for each stage she
    // reaches. When the plan is done she waits for Launch to celebrate, then wipes the board.
    const penX = () => K.clamp(b.tip().x - 0.05, BOARD.x - BOARD.w / 2 + 0.4, BOARD.x + BOARD.w / 2 - 0.6);
    const drawBit = (len) => ({
      do: 'draw', dur: len, face: Math.PI / 2, gaze: () => b.tip(),
      until: () => b.progress >= 1,
      tick: (me, dt) => {
        o.drawing = 1;
        b.progress = Math.min(1, b.progress + dt / 20);
        me.shuffle(penX(), dt);
      },
    });
    const noteFor = (i) => [
      { do: 'step', to: () => [K.clamp(b.note(i).x - 0.1, BOARD.x - BOARD.w / 2 + 0.4, BOARD.x + BOARD.w / 2 - 0.6), DRAW_Z] }, { do: 'face', yaw: Math.PI / 2 },
      { do: 'note', dur: 1.25, gaze: () => b.note(i) }, call(() => { b.stuck = Math.max(b.stuck, i + 1); }),
      { do: 'idle', dur: 0.3, face: Math.PI / 2 },
    ];
    const designDay = () => {
      const round = [];
      const due = Math.min(4, Math.floor(b.progress * 4 + 0.999)); // a note for each quarter drawn
      if (b.stuck === 0) round.push(...noteFor(0));
      else if (b.stuck < due) round.push(...noteFor(b.stuck));
      if (b.progress < 1) {
        round.push({ do: 'step', to: () => [penX(), DRAW_Z] }, { do: 'face', yaw: Math.PI / 2 }, drawBit(rand(5, 7)));
        round.push(call(() => { o.drawing = 0; }));
        if (Math.random() < 0.45) round.push({ do: 'step', to: () => [Math.min(design.x, BOARD.x + 1.2), -5.5], back: true }, { do: 'face', yaw: Math.PI + 0.2 }, { do: 'look', dur: rand(1.8, 2.6), gaze: () => b.tip() });
        round.push(again(design, designDay));
        return round;
      }
      if (b.stuck < 4) { round.push(again(design, designDay)); return round; }
      return [
        { do: 'step', to: [BOARD.x + 1.6, -6.4] }, { do: 'face', yaw: toward(launch) },
        { do: 'wait', until: () => launch.atBoard, max: 9, act: 'look', gaze: () => launch.head() },
        { do: 'face', yaw: toward(launch) }, call(() => o.cheer()), { do: 'cheer', dur: 1.8, gaze: () => launch.head() },
        { do: 'idle', dur: 1.2, gaze: { x: BOARD.x, y: BOARD.y, z: BACK } },
        { do: 'step', to: [BOARD.x - BOARD.w / 2 + 0.4, DRAW_Z] }, { do: 'face', yaw: Math.PI / 2 },
        call(() => { design.hands[1].visible = false; }),
        { do: 'erase', dur: 3.4, face: Math.PI / 2, gaze: () => ({ x: design.x, y: BOARD.y, z: BACK }), tick: (me, dt) => { b.wiped = Math.min(1, b.wiped + dt / 3.2); me.shuffle(K.clamp(BOARD.x - BOARD.w / 2 + b.wiped * BOARD.w, BOARD.x - BOARD.w / 2 + 0.4, BOARD.x + BOARD.w / 2 - 0.6), dt); } },
        call(() => { b.reset(); design.hands[1].visible = true; }),
        { do: 'step', to: [BOARD.x - 0.5, -5.6] }, { do: 'face', yaw: Math.PI }, { do: 'look', dur: 1.6 },
        again(design, designDay),
      ];
    };

    // Launch goes over the plan with Design, then over to Build's desk to talk it through, and back.
    const atBoard = (on) => call(() => { launch.atBoard = on; });
    const launchDay = () => [
      { do: 'go', to: SPOT.board }, atBoard(true),
      { do: 'point', dur: 3.6, face: () => angTo(b.tip().x - launch.x, BACK - launch.z) + 0.3, gaze: () => b.tip() },
      { do: 'talk', dur: 3, face: toward(design), gaze: () => design.head() },
      { do: 'nod', dur: 1.8, face: () => angTo(b.tip().x - launch.x, BACK - launch.z), gaze: () => b.tip() },
      { do: 'think', dur: rand(2.5, 4), gaze: () => b.tip() },
      { do: 'wait', until: () => !(b.progress >= 1 && b.stuck >= 4 && b.wiped === 0), max: 14, act: 'look', gaze: () => design.head() },
      { do: 'idle', dur: 1.5, gaze: () => b.tip() },
      atBoard(false),
      ...((visits = !visits) ? visit() : bean()),
      again(launch, launchDay),
    ];
    let visits = false;
    const visit = () => [
      { do: 'go', to: SPOT.visit }, { do: 'face', yaw: toward(build) }, call(() => o.chat(true)),
      { do: 'talk', dur: 4.2, gaze: () => build.head() }, { do: 'listen', dur: 3, gaze: () => build.head() },
      { do: 'talk', dur: 2, gaze: () => build.head() }, { do: 'wave', dur: 1.2, gaze: () => build.head() }, call(() => o.chat(false)),
    ];
    // a sit in the beanbag with a laptop, going over the launch notes
    const bean = () => [
      { do: 'go', to: SPOT.bean }, { do: 'face', yaw: 0 },
      { do: 'step', to: [BEAN[0], BEAN[1] + 1.0], back: true }, { do: 'sit', y: 1.0, yaw: 0 },
      call(() => o.lapOn(true)), { do: 'lap', dur: rand(9, 12) }, call(() => o.lapOn(false)),
      { do: 'stand', noChair: true }, { do: 'step', to: SPOT.bean },
    ];
    build.plan(buildDay());
    idea.plan(ideaDay());
    design.plan(designDay());
    launch.plan([{ do: 'point', dur: 2.5, face: Math.PI + 0.6, gaze: () => b.tip() }, ...launchDay()]);
  }

  // the coffee: a mug taken, set under the machine, brewed, carried, put down, and later to the sink
  hold(who, fresh) {
    who.palm(0).add(this.mug);
    this.mug.position.set(0, -0.2, 0.05);
    this.mug.visible = true;
    if (fresh) { this.fill = 0; this.steam = 0; }
    this.mugAt = 'hand';
    who.holding = this.mug;
  }
  release(who) { if (who) who.holding = null; }
  lapOn(on) {
    if (!this.lap) {
      this.lap = K.laptop();
      this.lap.position.set(0, 0.2, 0.66); this.lap.rotation.x = 0.1;
      this.lap.traverse((m) => { if (m.isMesh) m.castShadow = true; });
      this.launch.c.torso.add(this.lap);
    }
    this.lap.visible = on;
  }
  toTray() {
    this.scene.add(this.mug);
    this.mug.quaternion.identity(); this.mug.rotation.y = -0.4;
    this.mug.position.copy(this.kitchen.trayAt);
    this.mugAt = 'tray';
    this.release(this.idea);
  }
  toDesk() {
    this.scene.add(this.mug);
    this.mug.quaternion.identity(); this.mug.rotation.y = 0.5;
    this.mug.position.set(DESKS[1].x + 1.55, DESK_TOP + 0.01, DESKS[1].z - 0.35);
    this.mugAt = 'desk';
    this.release(this.idea);
  }
  toSink() { this.mug.visible = false; this.mugAt = 'none'; this.sinkMug.visible = true; this.release(this.idea); }
  startBrew() { this.brew = 0; }
  cheer() {
    if (!this.launch.atBoard) return;
    this.launch.queue.unshift({ do: 'cheer', dur: 1.8, face: (me) => angTo(this.design.x - me.x, this.design.z - me.z), gaze: () => this.design.head() });
    if (this.launch.task && this.launch.task.do === 'wait') this.launch.next();
  }
  chat(on) {
    const b = this.build;
    if (on) {
      b.over = { name: 'chat', t: this.t, dur: 30 };
      b.queue.unshift({ do: 'idle', dur: 12, face: () => angTo(this.launch.x - b.x, this.launch.z - b.z) * 0.75, gaze: () => this.launch.head(), until: () => !b.over });
      if (b.task && b.task.do !== 'idle') b.next();
    } else if (b.over && b.over.name === 'chat') {
      b.over = null;
      b.queue.unshift({ do: 'face', yaw: 0 });
    }
  }

  update(dt, t) {
    this.t = t;
    for (const a of this.actors) a.update(dt, t);
    // a glance at whoever walks by, returned, now and then
    for (const a of this.actors) {
      if (!a.moving()) continue;
      for (const b of this.actors) {
        if (b === a) continue;
        const dx = b.x - a.x, dz = b.z - a.z, d = Math.hypot(dx, dz);
        const key = a.i * 8 + b.i;
        if (d < 5.5 && Math.cos(wrap(angTo(dx, dz) - a.yaw)) > 0.25 && t > (this.pairs.get(key) || 0)) {
          this.pairs.set(key, t + rand(9, 15));
          if (!a.gaze) a.glance = { who: b, until: t + 1.3 };
          if (!b.gaze) b.glance = { who: a, until: t + 1.6 };
        }
      }
    }
    // the machine: a button lights, the gauge climbs, it pours, the mug fills and steams
    const km = this.kitchen;
    if (this.brew >= 0) {
      this.brew += dt;
      const u = this.brew;
      km.buttons[0].material.emissiveIntensity = u < 3 ? 1.2 : 0;
      km.needle.rotation.z = 1.2 - 1.9 * K.smooth(K.clamp(u / 0.8, 0, 1)) * (1 - K.smooth(K.clamp((u - 3) / 0.6, 0, 1)));
      const pour = u > 0.7 && u < 2.9;
      km.stream.visible = pour;
      if (pour) {
        const surface = km.trayAt.y - COUNTER.top + 0.07 + this.fill * 0.25, spout = km.spoutY - COUNTER.top; // (machine space)
        km.stream.scale.y = Math.max(0.05, spout - surface);
        km.stream.position.y = (spout + surface) / 2;
        km.stream.scale.x = km.stream.scale.z = 1 + 0.15 * Math.sin(t * 40);
        this.fill = Math.min(1, this.fill + dt / 2.1);
        this.steam = 1;
      }
      if (u > 3.4) { this.brew = -1; km.buttons[0].material.emissiveIntensity = 0; km.stream.visible = false; }
    }
    const coffee = this.mug.userData.coffee;
    coffee.visible = this.fill > 0.02;
    coffee.position.y = 0.07 + this.fill * 0.25;
    // a carried mug stays upright whatever the arm does
    if (this.mugAt === 'hand' && this.mug.parent) {
      this.mug.parent.updateWorldMatrix(true, false);
      this.mug.parent.getWorldQuaternion(this.mug.quaternion).invert();
    }
    // steam off fresh coffee, fading as it cools
    this.steam = Math.max(0, this.steam - dt / 26);
    const at = this.mug.getWorldPosition(new THREE.Vector3());
    for (const sp of this.puffs) {
      const k = (sp.userData.k + t * 0.45) % 1;
      sp.position.set(at.x + Math.sin(t * 1.3 + sp.userData.k * 9) * 0.08 * (1 + k), at.y + 0.4 + k * 0.9, at.z + Math.cos(t + sp.userData.k * 7) * 0.05);
      sp.scale.setScalar(0.18 + k * 0.4);
      sp.material.opacity = this.mug.visible ? 0.28 * this.steam * Math.sin(k * Math.PI) * this.fill : 0;
    }
    // chairs: rolled and swivelled
    for (const ch of this.chairs) {
      ch.g.position.z = ch.z;
      const sat = this.actors.some((a) => a.chair === ch && a.sit > 0.5);
      if (!sat) ch.yaw = K.damp(ch.yaw, 0.35, 1.5, dt);
      ch.g.rotation.y = ch.yaw;
      ch.shadow.position.z = ch.z;
    }
    this.board.redraw();
    // the laptop screens light the keys while someone is typing
    this.desks.forEach((d, i) => { const who = i ? this.idea : this.build; d.glow.material.opacity = K.damp(d.glow.material.opacity, who.act === 'type' ? 0.26 : 0.1, 4, dt); });
    this.clouds.material.map.offset.x = t * 0.004;
    // the clock keeps real time
    const now = new Date(), s = now.getSeconds(), m = now.getMinutes() + s / 60, h = (now.getHours() % 12) + m / 60;
    const { hands } = this.decor;
    hands.s.rotation.z = -(s / 60) * Math.PI * 2; hands.m.rotation.z = -(m / 60) * Math.PI * 2; hands.h.rotation.z = -(h / 12) * Math.PI * 2;
  }
}

/* ---------- the stage ---------- */

export function start(el, kit) {
  K = kit;
  THREE = kit.THREE;
  const still = !document.documentElement.classList.contains('motion');
  const canvas = document.createElement('canvas');
  canvas.className = 'office__canvas';
  canvas.setAttribute('aria-hidden', 'true');
  // Phone-sized frames get half-size shadow maps: at that width a 2048 map puts several texels under every screen
  // pixel. (Multisampling stays on everywhere: the fur's strands are cut out with alpha to coverage, which needs it.)
  const narrow = Math.min(el.clientWidth || innerWidth, innerWidth) < 700;
  const shadowSize = narrow ? 1024 : 2048;
  let renderer;
  try {
    renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: false });
  } catch {
    return null;
  }
  // checking each shader's log makes the page wait for the GPU to finish compiling it (tens of ms each, with the
  // scroll frozen); only worth it while working on the scene locally
  renderer.debug.checkShaderErrors = /^(localhost|127\.)/.test(location.hostname);
  K.assets();
  K.materials();
  SOFT = soft();
  const aoMap = canvasTex(64, 64, (c, w, h) => { // (an alpha map reads the green channel: white is dark here)
    c.fillStyle = '#000'; c.fillRect(0, 0, w, h);
    const g = c.createRadialGradient(w / 2, h / 2, 0, w / 2, h / 2, w / 2);
    g.addColorStop(0, '#e6e6e6'); g.addColorStop(0.5, '#808080'); g.addColorStop(1, '#000');
    c.fillStyle = g; c.fillRect(0, 0, w, h);
  });
  aoMap.colorSpace = THREE.NoColorSpace;
  CASTER = new THREE.MeshBasicMaterial({ colorWrite: false, depthWrite: false });
  AO = new THREE.MeshBasicMaterial({ color: '#2a1d10', alphaMap: aoMap, transparent: true, depthWrite: false, opacity: 0.5 });
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.NeutralToneMapping;
  renderer.toneMappingExposure = 1.0;
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFShadowMap;
  renderer.setClearColor('#e9dfcf');

  const scene = new THREE.Scene();
  scene.environment = environment(renderer);
  scene.environmentIntensity = 0.5;
  scene.add(new THREE.HemisphereLight('#fff4e4', '#9c8466', 0.7));
  // the sun, low and warm, in through the window: its panes fall across the floor and the desks
  const sun = new THREE.DirectionalLight('#ffdcaa', 7.5);
  sun.target.position.set(-5, 0, -2);
  sun.position.set(-5 - 0.3 * 40, 0.62 * 40, -2 - 0.75 * 40);
  sun.castShadow = true;
  sun.shadow.mapSize.set(shadowSize, shadowSize);
  Object.assign(sun.shadow.camera, { left: -26, right: 26, top: 20, bottom: -20, near: 5, far: 90 });
  sun.shadow.radius = 4;
  sun.shadow.bias = -0.0005;
  sun.shadow.normalBias = 0.04;
  scene.add(sun, sun.target);
  // the room light, from above and in front: soft shadows of the crew and the furniture on the floor
  const room = new THREE.DirectionalLight('#fff6ea', 1.0);
  room.position.set(6, 22, 16);
  room.target.position.set(1, 0, -3);
  room.castShadow = true;
  room.shadow.mapSize.set(shadowSize, shadowSize);
  Object.assign(room.shadow.camera, { left: -24, right: 24, top: 16, bottom: -16, near: 1, far: 70 });
  room.shadow.radius = 8;
  room.shadow.bias = -0.0004;
  room.shadow.normalBias = 0.03;
  scene.add(room, room.target);
  const windowFill = new THREE.PointLight('#dcecff', 16, 20, 1.4);
  windowFill.position.set(-7, 6, -6);
  scene.add(windowFill);

  const camera = new THREE.PerspectiveCamera(28, 2, 0.5, 200);
  const density = { value: 24 };
  const office = new Office(scene, density);
  // small props (books, leaves, pens, jars) keep out of the shadow maps: their shadows don't show, their draws cost
  const sphere = new THREE.Sphere(), wscale = new THREE.Vector3();
  scene.updateMatrixWorld(true);
  scene.traverse((o) => {
    if (!o.isMesh || !o.castShadow || o.geometry.isInstancedBufferGeometry || o.material === CASTER) return;
    o.geometry.computeBoundingSphere();
    sphere.copy(o.geometry.boundingSphere);
    if (sphere.radius * o.getWorldScale(wscale).x < 0.32) o.castShadow = false;
  });
  const km = office.kitchen;
  bake(scene, [
    ...office.actors.map((a) => a.c.root), ...office.chairs.flatMap((c) => [c.g, c.shadow]), ...office.desks.map((d) => d.glow),
    ...km.buttons, km.needle, km.stream, ...Object.values(office.decor.hands), office.clouds,
    office.mug, office.sinkMug, office.marker, ...office.puffs,
  ]);
  el.prepend(canvas);

  let W = 0, H = 0, cap = 2; // cap: the most device pixels per CSS pixel; lowered if frames keep running long
  const layout = () => {
    W = el.clientWidth; H = el.clientHeight;
    if (!W || !H) return;
    const dpr = Math.min(devicePixelRatio || 1, W < 700 ? 1.5 : 2, cap);
    renderer.setPixelRatio(dpr);
    renderer.setSize(W, H, false);
    camera.aspect = W / H;
    // the whole room on wide frames; on narrower ones (tablets, phones) the camera crops in on the middle of the room
    // rather than shrinking the crew to fit its width
    const hfov = 2 * Math.atan((15.6 * K.clamp(camera.aspect / 2.1, 0.62, 1)) / 25);
    camera.fov = Math.max(28, (2 * Math.atan(Math.tan(hfov / 2) / camera.aspect) * 180) / Math.PI);
    camera.updateProjectionMatrix();
    // the fur's strands sized to the pixels a head radius covers
    const pxPerUnit = (H * SIZE) / (2 * 25 * Math.tan((camera.fov * Math.PI) / 360));
    density.value = K.clamp((pxPerUnit * dpr) / 3.2, 9, 24); // fuller strands than the band's: at this scale finer ones read as grain
  };
  const aim = new THREE.Vector3(1.6, 2.7, -4.2);
  const look = { x: 0, y: 0 }, aimLook = { x: 0, y: 0 };
  const place = (t) => { // a slow drift, and a lean toward the pointer
    camera.position.set(2.2 + Math.sin(t * 0.07) * 1.0 + look.x * 2.2, 8.6 + look.y * -1, 20.5);
    camera.lookAt(aim);
  };

  // The shadow maps are redrawn every other frame: the crew's shadows keep up at 30 per second, which does not show,
  // and it halves what the two maps cost
  renderer.shadowMap.autoUpdate = false;
  let on = false, ready = false, raf = 0, last = performance.now() / 1000, t = 0, n = 0;
  // frames arriving slower than 40 a second for a couple of seconds: draw fewer pixels (down to 1 per CSS px)
  let slow = 0;
  const pace = (gap) => {
    if (gap > 0.2 || cap <= 1) return; // (a stall, such as the tab coming back, is not the scene's doing)
    slow = gap > 1 / 40 ? slow + gap : Math.max(0, slow - gap * 0.5);
    if (slow > 2) { slow = 0; cap = Math.max(1, Math.min(cap, renderer.getPixelRatio()) - 0.25); layout(); }
  };
  const draw = () => { renderer.shadowMap.needsUpdate = n++ % 2 === 0; renderer.render(scene, camera); };
  const frame = (now) => {
    raf = 0;
    if (!on || document.hidden) return;
    const s = now / 1000;
    // at most 60 a second on 120 Hz screens (every other refresh): twice the frames would cost twice as much for
    // motion this slow. 60 and 90 Hz screens draw every refresh.
    if (s - last < 1 / 96) { raf = requestAnimationFrame(frame); return; }
    const gap = s - last, dt = Math.min(0.05, Math.max(0, gap));
    last = s; t += dt;
    pace(gap);
    look.x = K.damp(look.x, aimLook.x, 3, dt); look.y = K.damp(look.y, aimLook.y, 3, dt);
    office.update(dt, t);
    place(t);
    draw();
    raf = requestAnimationFrame(frame);
  };
  const resume = () => { if (still || !ready || raf || !on || document.hidden) return; last = performance.now() / 1000; raf = requestAnimationFrame(frame); };

  layout();
  if (still) { // one moment of the day: run the simulation forward quietly, then draw it once
    for (let i = 0; i < 60 * 16; i++) { t += 1 / 60; office.update(1 / 60, t); }
    place(t);
  }
  // where the browser can, compile every shader off the main thread first (the scroll would freeze while they compile), then show the room
  place(t);
  (renderer.extensions.has('KHR_parallel_shader_compile') ? renderer.compileAsync(scene, camera) : new Promise((resolve) => setTimeout(resolve, 0))).catch(() => {}).then(() => {
    renderer.shadowMap.needsUpdate = true;
    renderer.render(scene, camera);
    el.classList.add('is-live');
    ready = true;
    resume();
  });

  new IntersectionObserver(([e]) => { on = e.isIntersecting; resume(); }, { rootMargin: '100px 0px' }).observe(el);
  let resizing = 0;
  addEventListener('resize', () => { clearTimeout(resizing); resizing = setTimeout(() => { layout(); if (still && ready) { renderer.shadowMap.needsUpdate = true; renderer.render(scene, camera); } }, 150); });
  if (!still && matchMedia('(hover: hover) and (pointer: fine)').matches) {
    // where the frame is, read once as the pointer enters rather than on every move (each read lays the page out)
    let r = null;
    el.addEventListener('pointerenter', () => { r = el.getBoundingClientRect(); });
    el.addEventListener('pointermove', (e) => { r ||= el.getBoundingClientRect(); aimLook.x = (e.clientX - r.left) / r.width - 0.5; aimLook.y = (e.clientY - r.top) / r.height - 0.5; }, { passive: true });
    el.addEventListener('pointerleave', () => { aimLook.x = aimLook.y = 0; r = null; });
    addEventListener('scroll', () => { r = null; }, { passive: true }); // (the frame moved: read it again on the next move)
  }
  document.addEventListener('visibilitychange', resume);
  canvas.addEventListener('webglcontextlost', () => { cancelAnimationFrame(raf); on = false; canvas.remove(); el.classList.remove('is-live'); });
  // for checks: the crew's positions (collisions are tested against these), and a way to step and draw a frame
  el.office = office;
  el.officeStep = (dt) => { t += dt; office.update(dt, t); place(t); draw(); return canvas; };
  return { el };
}
