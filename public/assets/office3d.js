// The Demaze studio: a small office in 3D (Three.js), with the Muse crew at work in it, in the home page's "who we
// are" section ([data-office]). ambient.js imports this module and the crew kit (crew3d.js: the characters, their
// springs and props) when the section comes near, and calls start(el, kit).
//
// The room: a warm floor and two walls, a window, two desks with laptops and chairs, pendant lamps, a whiteboard with
// the plan on it, a coffee machine, a bin and a plant, lit by the window with soft shadows. The crew, each running
// their own routine and reacting to each other:
//   Build (headphones) codes at the first desk, and now and then leans back to stretch;
//   Idea (cap) codes at the second, gets up for coffee: presses the machine, waits for the cup, carries it back,
//     sips while working, and next time takes the empty cup along for the bin;
//   Design (bow) draws the plan on the whiteboard and steps back to look at it;
//   Launch (glasses) points out the plan with Design, high-fives her, walks over to Build's desk to talk (Build
//     turns and chats back) and goes back to the board.
// They walk with a stride, turn toward where they are going, sit down and get up, and every joint follows through a
// spring (crew3d.js), so nothing snaps. Drawn only while on screen; with reduced motion, one moment of the day.

let K; // the crew kit
let THREE;

const W_ROOM = 38, D_ROOM = 20; // floor, in head radii (a character is 3.55 tall)
const BACK = -9, LEFT = -18;
const DESK = [{ x: -7, z: -2.6 }, { x: -1, z: -2.6 }];
const DESK_TOP = 2.1, SEAT_TOP = 1.2, CHAIR_Z = -4.3;
const MACHINE = { x: 14.6, z: -6.9 }, BIN = { x: 11.4, z: -7.4 }, BOARD = { x: 7, y: 4.4 };
const WALK = 2.7; // head radii per second
const SIZE = 1.15; // the crew beside the furniture: plush, a little bigger than people would be

/* ---------- small helpers ---------- */

const mat = (color, rough = 0.85, extra = {}) => new THREE.MeshStandardMaterial({ color, roughness: rough, metalness: 0, ...extra });
function box(parent, w, h, d, m, x, y, z, cast = true) {
  const mesh = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), m);
  mesh.position.set(x, y, z);
  mesh.castShadow = cast; mesh.receiveShadow = true;
  parent.add(mesh);
  return mesh;
}
function cyl(parent, rt, rb, h, m, x, y, z, seg = 20) {
  const mesh = new THREE.Mesh(new THREE.CylinderGeometry(rt, rb, h, seg), m);
  mesh.position.set(x, y, z);
  mesh.castShadow = true; mesh.receiveShadow = true;
  parent.add(mesh);
  return mesh;
}
function canvasTex(w, h, draw) {
  const c = document.createElement('canvas');
  c.width = w; c.height = h;
  draw(c.getContext('2d'), w, h);
  const t = new THREE.CanvasTexture(c);
  t.colorSpace = THREE.SRGBColorSpace;
  t.anisotropy = 4;
  return t;
}
const angTo = (dx, dz) => Math.atan2(dx, dz); // yaw that faces a direction (a character faces +z at yaw 0)
const wrap = (a) => Math.atan2(Math.sin(a), Math.cos(a));

/* ---------- the room ---------- */

function room(scene) {
  const g = new THREE.Group();
  scene.add(g);
  // floor: warm oak planks, a lilac rug under the desks
  const planks = canvasTex(512, 512, (c, w, h) => {
    c.fillStyle = '#c9ab86'; c.fillRect(0, 0, w, h);
    for (let y = 0; y < h; y += 32) {
      for (let x = (y / 32) % 2 ? -120 : 0; x < w; x += 240) {
        c.fillStyle = `hsl(32, ${28 + Math.random() * 8}%, ${60 + Math.random() * 6}%)`;
        c.fillRect(x + 1, y + 1, 238, 30);
      }
      c.fillStyle = 'rgba(70,45,20,0.25)'; c.fillRect(0, y, w, 1.5);
    }
  });
  planks.wrapS = planks.wrapT = THREE.RepeatWrapping;
  planks.repeat.set(3, 1.6);
  const floor = new THREE.Mesh(new THREE.PlaneGeometry(W_ROOM + 20, D_ROOM + 20), mat('#ffffff', 0.72, { map: planks }));
  floor.rotation.x = -Math.PI / 2;
  floor.position.set(0, 0, 0);
  floor.receiveShadow = true;
  g.add(floor);
  const rug = new THREE.Mesh(new THREE.CircleGeometry(1, 48), mat('#9d8cdc', 1));
  rug.rotation.x = -Math.PI / 2;
  rug.scale.set(8.6, 4.4, 1);
  rug.position.set(-4, 0.02, -3.2);
  rug.receiveShadow = true;
  g.add(rug);
  // walls, a skirting board, the window with the sky and a city far off
  const wallM = mat('#efe6d8', 0.95), sideM = mat('#e2d6c3', 0.95), skirt = mat('#d8c7ae', 0.8);
  box(g, W_ROOM + 20, 12, 0.4, wallM, 0, 6, BACK - 0.2, false);
  box(g, 0.4, 12, D_ROOM + 20, sideM, LEFT - 0.2, 6, 0, false);
  box(g, W_ROOM + 20, 0.5, 0.2, skirt, 0, 0.25, BACK + 0.05, false);
  box(g, 0.2, 0.5, D_ROOM + 20, skirt, LEFT + 0.05, 0.25, 0, false);
  const sky = canvasTex(512, 256, (c, w, h) => {
    const gr = c.createLinearGradient(0, 0, 0, h);
    gr.addColorStop(0, '#8cc4f2'); gr.addColorStop(0.7, '#d6ecfb'); gr.addColorStop(1, '#f6efe1');
    c.fillStyle = gr; c.fillRect(0, 0, w, h);
    c.fillStyle = 'rgba(120,150,190,0.55)';
    let x = 0;
    while (x < w) { const bw = 20 + Math.random() * 40, bh = 30 + Math.random() * 90; c.fillRect(x, h - bh, bw, bh); x += bw + 4; }
    c.fillStyle = 'rgba(255,255,255,0.7)';
    c.beginPath(); c.ellipse(120, 60, 60, 14, 0, 0, 7); c.ellipse(380, 40, 80, 16, 0, 0, 7); c.fill();
  });
  const win = new THREE.Mesh(new THREE.PlaneGeometry(10, 4.6), new THREE.MeshBasicMaterial({ map: sky, toneMapped: false }));
  win.position.set(-5.5, 6.6, BACK + 0.02);
  g.add(win);
  const frame = mat('#2c2c30', 0.5);
  box(g, 10.4, 0.25, 0.3, frame, -5.5, 8.95, BACK + 0.1, false);
  box(g, 10.4, 0.3, 0.5, frame, -5.5, 4.25, BACK + 0.2, false);
  for (const x of [-10.6, -5.5, -0.4]) box(g, 0.22, 4.6, 0.3, frame, x, 6.6, BACK + 0.1, false);
  // the plan on the whiteboard: a maze route from an idea to launch, and sticky notes
  const plan = canvasTex(768, 400, (c, w, h) => {
    c.fillStyle = '#fbfbf8'; c.fillRect(0, 0, w, h);
    c.strokeStyle = 'rgba(40,40,40,0.18)'; c.lineWidth = 3;
    for (let i = 0; i < 7; i++) { c.beginPath(); c.moveTo(70 + i * 90, 70); c.lineTo(70 + i * 90, 330); c.stroke(); }
    c.strokeStyle = '#3d5afe'; c.lineWidth = 9; c.lineCap = 'round'; c.lineJoin = 'round';
    c.beginPath(); c.moveTo(60, 300); c.lineTo(200, 300); c.lineTo(200, 170); c.lineTo(380, 170); c.lineTo(380, 250); c.lineTo(560, 250); c.lineTo(560, 110); c.lineTo(690, 110); c.stroke();
    c.fillStyle = '#3d5afe'; c.beginPath(); c.moveTo(690, 88); c.lineTo(730, 110); c.lineTo(690, 132); c.lineTo(700, 110); c.fill();
    const note = (x, y, col, text, r) => { c.save(); c.translate(x, y); c.rotate(r); c.fillStyle = col; c.fillRect(-46, -40, 92, 80); c.fillStyle = '#1d1c1a'; c.font = '600 18px sans-serif'; c.textAlign = 'center'; c.fillText(text, 0, 6); c.restore(); };
    note(120, 90, '#ffcb45', 'Idea', -0.08); note(300, 90, '#c4b3f2', 'Design', 0.05); note(470, 330, '#93d8bf', 'Build', -0.04); note(650, 300, '#ff9a86', 'Launch', 0.07);
  });
  const board = new THREE.Mesh(new THREE.PlaneGeometry(7.6, 3.95), mat('#ffffff', 0.4, { map: plan }));
  board.position.set(BOARD.x, BOARD.y, BACK + 0.06);
  g.add(board);
  const trim = mat('#bfc3cc', 0.35, { metalness: 0.6 });
  box(g, 7.9, 0.2, 0.2, trim, BOARD.x, BOARD.y + 2.07, BACK + 0.12, false);
  box(g, 7.9, 0.24, 0.45, trim, BOARD.x, BOARD.y - 2.08, BACK + 0.25, false);
  for (const s of [-1, 1]) box(g, 0.2, 4.3, 0.2, trim, BOARD.x + 3.95 * s, BOARD.y, BACK + 0.12, false);
  // a plant in the corner
  const pot = cyl(g, 0.95, 0.75, 1.6, mat('#e9dbc6', 0.7), -15.6, 0.8, -7.2);
  pot.castShadow = true;
  const leaf = [mat('#3e9a6c', 0.8), mat('#5cb88a', 0.8)];
  for (let i = 0; i < 9; i++) {
    const l = new THREE.Mesh(new THREE.SphereGeometry(0.9, 16, 12), leaf[i % 2]);
    const a = (i / 9) * Math.PI * 2;
    l.position.set(-15.6 + Math.cos(a) * 0.9, 2.6 + (i % 3) * 0.7, -7.2 + Math.sin(a) * 0.7);
    l.scale.set(0.8, 1.1, 0.8);
    l.castShadow = true;
    g.add(l);
  }
  return g;
}

function desk(scene, x, z) {
  const g = new THREE.Group();
  g.position.set(x, 0, z);
  scene.add(g);
  const top = mat('#f6f1e8', 0.45), metal = mat('#2c2c30', 0.4, { metalness: 0.5 });
  box(g, 5.2, 0.22, 2.6, top, 0, DESK_TOP - 0.11, 0);
  for (const sx of [-1, 1]) for (const sz of [-1, 1]) box(g, 0.16, DESK_TOP - 0.22, 0.16, metal, 2.4 * sx, (DESK_TOP - 0.22) / 2, 1.1 * sz);
  const lap = K.laptop();
  lap.scale.setScalar(1.55);
  lap.position.set(0, DESK_TOP, -0.85);
  lap.traverse((o) => { if (o.isMesh) o.castShadow = true; });
  g.add(lap);
  // the screen's glow on the keys, a mug of pens and a notebook
  const glowM = new THREE.MeshBasicMaterial({ color: '#bcd0ff', transparent: true, opacity: 0.18, depthWrite: false });
  const glow = new THREE.Mesh(new THREE.PlaneGeometry(1.4, 0.8), glowM);
  glow.rotation.x = -Math.PI / 2;
  glow.position.set(0, DESK_TOP + 0.02, -0.7);
  g.add(glow);
  cyl(g, 0.22, 0.2, 0.5, mat('#ff6242', 0.6), 1.9, DESK_TOP + 0.25, -0.6);
  for (let i = 0; i < 3; i++) { const p = cyl(g, 0.035, 0.035, 0.7, mat(['#3d5afe', '#1d1c1a', '#ffcb45'][i], 0.5), 1.85 + i * 0.06, DESK_TOP + 0.6, -0.62 + i * 0.05, 8); p.rotation.z = (i - 1) * 0.2; }
  box(g, 1.1, 0.08, 0.8, mat('#3d5afe', 0.7), -1.7, DESK_TOP + 0.04, -0.3).rotation.y = 0.25;
  return { g, lap, glow };
}

function chair(scene, x, z) {
  const g = new THREE.Group();
  g.position.set(x, 0, z);
  scene.add(g);
  const seat = mat('#3d5afe', 0.9), frame = mat('#2c2c30', 0.4, { metalness: 0.5 });
  box(g, 1.9, 0.28, 1.8, seat, 0, SEAT_TOP - 0.14, 0);
  const back = box(g, 1.9, 1.9, 0.26, seat, 0, SEAT_TOP + 0.95, -0.95);
  back.rotation.x = -0.08;
  cyl(g, 0.1, 0.1, SEAT_TOP - 0.4, frame, 0, (SEAT_TOP - 0.4) / 2 + 0.2, 0, 10);
  for (let i = 0; i < 5; i++) { const leg = box(g, 0.14, 0.1, 1.1, frame, 0, 0.18, 0); leg.rotation.y = (i / 5) * Math.PI * 2; leg.translateZ(0.5); }
  return g;
}

function lamp(scene, x, z) {
  const cord = new THREE.Mesh(new THREE.CylinderGeometry(0.03, 0.03, 3.2, 6), mat('#1d1c1a', 0.6));
  cord.position.set(x, 10.4, z);
  scene.add(cord);
  const shade = new THREE.Mesh(new THREE.ConeGeometry(0.9, 0.8, 24, 1, true), mat('#ffcb45', 0.6, { side: THREE.DoubleSide, emissive: new THREE.Color('#ffcb45'), emissiveIntensity: 0.25 }));
  shade.position.set(x, 8.6, z);
  scene.add(shade);
  const bulb = new THREE.Mesh(new THREE.SphereGeometry(0.22, 12, 8), new THREE.MeshBasicMaterial({ color: '#fff3d6', toneMapped: false }));
  bulb.position.set(x, 8.25, z);
  scene.add(bulb);
  const light = new THREE.PointLight('#ffd9a0', 22, 14, 1.6);
  light.position.set(x, 8.1, z);
  scene.add(light);
}

// The coffee machine: a lit panel of drinks behind glass, a screen and buttons, a slot where the cup drops.
function machine(scene) {
  const g = new THREE.Group();
  g.position.set(MACHINE.x, 0, MACHINE.z);
  g.rotation.y = -0.35; // turned a little toward the room
  scene.add(g);
  const body = mat('#26282f', 0.45), red = mat('#ff6242', 0.5);
  box(g, 3.1, 5.8, 2.4, body, 0, 2.9, 0);
  box(g, 3.12, 0.5, 2.42, red, 0, 5.55, 0, false);
  const sign = canvasTex(256, 48, (c, w, h) => { c.fillStyle = '#ff6242'; c.fillRect(0, 0, w, h); c.fillStyle = '#fff'; c.font = '700 30px sans-serif'; c.textAlign = 'center'; c.fillText('COFFEE', w / 2, 35); });
  const signM = new THREE.Mesh(new THREE.PlaneGeometry(2.4, 0.45), new THREE.MeshBasicMaterial({ map: sign, toneMapped: false }));
  signM.position.set(0, 5.55, 1.215);
  g.add(signM);
  // the lit window of drinks
  const shelf = new THREE.Mesh(new THREE.PlaneGeometry(1.9, 2.9), new THREE.MeshBasicMaterial({ color: '#fdf3de', toneMapped: false }));
  shelf.position.set(-0.45, 3.4, 1.21);
  g.add(shelf);
  const cans = ['#3d5afe', '#ff6242', '#2fd0a0', '#ffcb45', '#a58bff'];
  for (let r = 0; r < 4; r++) for (let k = 0; k < 4; k++) {
    const can = new THREE.Mesh(new THREE.CylinderGeometry(0.17, 0.17, 0.46, 12), mat(cans[(r + k) % 5], 0.4));
    can.position.set(-1.1 + k * 0.44, 2.3 + r * 0.72, 1.36);
    g.add(can);
  }
  const glass = new THREE.Mesh(new THREE.PlaneGeometry(2.0, 3.0), new THREE.MeshPhysicalMaterial({ color: '#ffffff', roughness: 0.05, transparent: true, opacity: 0.12 }));
  glass.position.set(-0.45, 3.4, 1.58);
  g.add(glass);
  // the screen, the buttons and the slot
  const screenM = new THREE.MeshBasicMaterial({ color: '#2fd0a0', toneMapped: false });
  const screen = new THREE.Mesh(new THREE.PlaneGeometry(0.62, 0.42), screenM);
  screen.position.set(1.0, 4.2, 1.215);
  g.add(screen);
  const buttons = [];
  for (let i = 0; i < 4; i++) {
    const b = new THREE.Mesh(new THREE.BoxGeometry(0.22, 0.22, 0.08), new THREE.MeshStandardMaterial({ color: '#f4f1ea', roughness: 0.4, emissive: new THREE.Color('#ffcb45'), emissiveIntensity: 0 }));
    b.position.set(0.86 + (i % 2) * 0.3, 3.55 - Math.floor(i / 2) * 0.32, 1.23);
    g.add(b);
    buttons.push(b);
  }
  box(g, 1.0, 0.9, 0.12, mat('#111216', 0.9), 0.95, 1.2, 1.18, false); // the slot's dark recess
  const slotLight = new THREE.PointLight('#fff1d0', 0, 3, 2);
  slotLight.position.set(0.95, 1.5, 1.6);
  g.add(slotLight);
  return { g, buttons, screen: screenM, slotLight, slot: new THREE.Vector3(0.95, 0.85, 1.05) };
}

// A paper cup of coffee with a sleeve and a lid.
function cup() {
  const g = new THREE.Group();
  const paper = mat('#fbf8f2', 0.7), sleeve = mat('#c98b4f', 0.8), lid = mat('#f4f1ea', 0.5);
  cyl(g, 0.2, 0.15, 0.5, paper, 0, 0.25, 0, 16);
  cyl(g, 0.205, 0.18, 0.2, sleeve, 0, 0.24, 0, 16);
  cyl(g, 0.215, 0.215, 0.06, lid, 0, 0.52, 0, 16);
  g.traverse((o) => { if (o.isMesh) o.castShadow = true; });
  return g;
}

/* ---------- the crew at work ---------- */

// One character in the room: where it stands, which way it faces, whether it is sitting, and a queue of things to do.
class Actor {
  constructor(office, spec, x, z, yaw) {
    this.o = office;
    this.c = K.makeCharacter({ ...spec, density: office.density });
    this.c.rig.rotation.x = 0; // (the crew band leans them toward its flat camera; here the camera looks down)
    this.c.root.scale.setScalar(SIZE);
    office.scene.add(this.c.root);
    this.x = x; this.z = z; this.yaw = yaw; this.y = 0;
    this.sit = 0; this.seated = false;
    this.phase = Math.random() * 6; // walk cycle
    this.speed = 0;
    this.queue = []; this.task = null; this.tt = 0;
    this.act = 'idle'; // what the arms and head are doing
    this.i = office.actors.length;
    this.over = null; // a reaction on top of the act: { name, t, dur }
    this.hand = null;
  }

  // the hand at the end of the right arm, for carrying things
  get palm() {
    if (!this.hand) { this.hand = new THREE.Group(); this.hand.position.set(0, -0.72, 0.14); this.c.arms[0].add(this.hand); }
    return this.hand;
  }

  plan(list) { this.queue.push(...list); }

  next() {
    this.task = this.queue.shift() || null;
    this.tt = 0;
    if (!this.task) return;
    const k = this.task;
    if (k.do === 'call') { k.fn(this); this.next(); }
  }

  update(dt, t) {
    if (!this.task) this.next();
    const k = this.task;
    this.tt += dt;
    let moving = false;
    this.act = 'idle';
    if (k) {
      if (k.do === 'walk') {
        const [tx, tz] = k.path[0];
        const dx = tx - this.x, dz = tz - this.z, d = Math.hypot(dx, dz);
        const aim = angTo(dx, dz);
        this.yaw += wrap(aim - this.yaw) * (1 - Math.exp(-9 * dt));
        // a stride starts slow, and turns slow down the walk until facing the way
        const facing = Math.max(0.25, Math.cos(wrap(aim - this.yaw)));
        this.speed = K.damp(this.speed, WALK * facing, 6, dt);
        const step = Math.min(d, this.speed * dt);
        if (d > 0.001) { this.x += (dx / d) * step; this.z += (dz / d) * step; }
        moving = true;
        if (d < 0.05) { k.path.shift(); if (!k.path.length) { this.speed = 0; this.next(); } }
      } else if (k.do === 'face') {
        this.yaw += wrap(k.yaw - this.yaw) * (1 - Math.exp(-7 * dt));
        if (Math.abs(wrap(k.yaw - this.yaw)) < 0.04 || this.tt > 1.4) this.next();
      } else if (k.do === 'sit' || k.do === 'stand') {
        const to = k.do === 'sit' ? 1 : 0;
        this.yaw += wrap(0 - this.yaw) * (1 - Math.exp(-8 * dt));
        this.sit = K.damp(this.sit, to, 5, dt);
        if (Math.abs(this.sit - to) < 0.02) { this.sit = to; this.seated = !!to; this.next(); }
      } else { // an act, for a while
        this.act = k.do;
        if (k.face !== undefined) this.yaw += wrap(k.face - this.yaw) * (1 - Math.exp(-6 * dt));
        if (this.tt >= (k.dur || 1)) this.next();
      }
    }
    if (!moving) this.speed = K.damp(this.speed, 0, 8, dt);
    if (this.over && t - this.over.t > this.over.dur) this.over = null;
    this.pose(dt, t, moving);
  }

  pose(dt, t, moving) {
    const c = this.c, p = K.pose0(), i = this.i;
    // breathing and a little weight shift, always
    p.br = 0.022 * Math.sin(t * 1.8 + i * 1.7);
    p.sway = 0.03 * Math.sin(t * 0.8 + i * 2.1);
    // walking: legs swing, arms counter-swing, a bob on each step, a lean into the stride
    const v = this.speed / WALK;
    if (v > 0.02) {
      this.phase += dt * this.speed * 2.4;
      const s = Math.sin(this.phase);
      p.llx = -0.62 * s * v; p.lrx = 0.62 * s * v;
      p.alx = 0.5 * s * v; p.arx = -0.5 * s * v;
      p.bob = 0.07 * Math.abs(Math.cos(this.phase)) * v;
      p.sq = -0.15 * Math.abs(Math.cos(this.phase)) * v + 0.08 * v;
      p.lean = 0.1 * v;
      p.twist = 0.08 * s * v;
      p.hy = -0.06 * s * v;
    }
    // sitting: hips down, legs forward under the desk, a little forward lean
    const st = this.sit;
    p.llx = K.lerp(p.llx, -1.45, st); p.lrx = K.lerp(p.lrx, -1.45, st);
    p.bob = K.lerp(p.bob, -0.24, st);
    p.lean = K.lerp(p.lean, 0.05, st);
    const a = this.act;
    if (a === 'type') { // bursts of typing, eyes on the screen
      const burst = Math.sin(t * 0.9 + i) > -0.3 ? 1 : 0.2;
      const tap = (k) => Math.max(0, Math.sin(t * 16 + k)) * 0.1 * burst;
      p.alx = -0.95 - tap(0); p.arx = -0.95 - tap(1.9);
      p.alz = 0.1; p.arz = -0.1;
      p.hx = 0.06 + 0.03 * Math.sin(t * 1.3); // (eyes on the screen, the face still up to the room)
      p.hy = 0.08 * Math.sin(t * 0.5 + i);
    } else if (a === 'stretch') {
      const k = Math.sin(Math.min(1, this.tt / (this.task.dur || 2)) * Math.PI);
      p.alz = K.lerp(p.alz, 2.8, k); p.arz = K.lerp(p.arz, -2.8, k);
      p.lean = K.lerp(p.lean, -0.18, k); p.hx = -0.35 * k; p.sq = -0.4 * k;
    } else if (a === 'sip') { // the cup up to the mouth and down
      const k = Math.sin(Math.min(1, this.tt / (this.task.dur || 1.6)) * Math.PI);
      p.arx = K.lerp(-0.95, -2.05, k); p.arz = K.lerp(-0.1, -0.75, k); p.hx = 0.2 - 0.3 * k;
      p.alx = -0.9; p.alz = 0.1;
    } else if (a === 'reach' || a === 'press') { // the right arm out, forward
      const k = Math.sin(Math.min(1, this.tt / (this.task.dur || 0.8)) * Math.PI);
      p.arx = -1.35 * k - 0.05; p.arz = -0.15; p.lean = 0.12 * k; p.hx = 0.2;
      if (a === 'reach') { p.arx = -1.0 * k; p.lean = 0.22 * k; p.hx = 0.3; }
    } else if (a === 'draw') { // marker on the board, small loops as the plan is drawn
      const u = t * 2.2;
      p.arx = -2.15 + 0.14 * Math.sin(u); p.arz = -0.35 + 0.12 * Math.cos(u * 1.3);
      p.hx = -0.15; p.lean = 0.05; p.twist = 0.06 * Math.sin(u * 0.5);
    } else if (a === 'look') { // stand back, hands on the body, head tilted
      p.hz = 0.12 * Math.sin(t * 0.7); p.hx = -0.1; p.alz = 0.2; p.arz = -0.2; p.alx = -0.2; p.arx = -0.2;
    } else if (a === 'point') { // the left arm along the plan, a pulse on each point
      p.alx = -1.55 - 0.1 * Math.abs(Math.sin(t * 3)); p.alz = 0.35; p.hy = 0.25; p.hx = -0.12;
    } else if (a === 'talk') { // hands going, the head nodding along
      p.alx = -0.55 + 0.3 * Math.sin(t * 4.2); p.arx = -0.5 + 0.3 * Math.sin(t * 3.7 + 1.5);
      p.alz = 0.35 + 0.12 * Math.sin(t * 2.3); p.arz = -0.35 - 0.12 * Math.sin(t * 2.9);
      p.hx = 0.08 * Math.sin(t * 5.5); p.hz = 0.06 * Math.sin(t * 2);
    } else if (a === 'nod') {
      p.hx = 0.16 * Math.max(0, Math.sin(t * 5)); p.alz = 0.25; p.arz = -0.25;
    } else if (a === 'wave') {
      p.alz = 2.55 + Math.sin(t * 11) * 0.32; p.alx = -0.25; p.hz = 0.1;
    } else if (a === 'hold') { // walking or standing with the cup
      p.arx = -1.1; p.arz = -0.1;
    }
    if (this.holding && a !== 'sip' && a !== 'reach' && a !== 'press') { p.arx = Math.min(p.arx, -1.05); p.arz = -0.12; }
    // reactions on top of the act: turning to a friend to chat, a high-five
    const ov = this.over;
    if (ov) {
      const k = Math.sin(Math.min(1, (t - ov.t) / ov.dur) * Math.PI);
      if (ov.name === 'chat') { // turn the head and chat back, still seated
        p.hy = K.lerp(p.hy, ov.look, Math.min(1, k * 2)); p.hx = K.lerp(p.hx, -0.05, k);
        p.alx = K.lerp(p.alx, -0.5 + 0.3 * Math.sin(t * 4), k); p.alz = K.lerp(p.alz, 0.4, k);
      } else if (ov.name === 'high5') {
        const up = Math.min(1, ((t - ov.t) / ov.dur) * 2.5);
        p.arx = K.lerp(p.arx, -2.7, up * k + (1 - k) * 0); p.arz = K.lerp(p.arz, -0.45, up);
        p.sq = -0.3 * k; p.bob += 0.08 * k;
      }
    }
    K.blink(c, dt, t);
    K.apply(c, p, dt);
    // where the character is: seated on the chair, or standing on the floor
    const seatY = SEAT_TOP - (0.5 - 0.28) * SIZE; // hips on the seat
    c.root.position.set(this.x, K.lerp(0, seatY, this.sit), this.z);
    c.root.rotation.y = this.yaw + (c.cur ? c.cur.yaw : 0);
  }
}

class Office {
  constructor(scene, density) {
    this.scene = scene;
    this.density = density;
    this.actors = [];
    room(scene);
    this.desks = DESK.map((d) => desk(scene, d.x, d.z));
    this.chairs = DESK.map((d) => chair(scene, d.x, CHAIR_Z - 0.2));
    DESK.forEach((d) => lamp(scene, d.x, d.z));
    lamp(scene, BOARD.x, -5.4);
    this.machine = machine(scene);
    // the bin by the machine
    cyl(scene, 0.6, 0.5, 1.4, new THREE.MeshStandardMaterial({ color: '#8e96a8', roughness: 0.4, metalness: 0.5 }), BIN.x, 0.7, BIN.z, 18);
    this.cup = cup();
    this.cup.visible = false;
    scene.add(this.cup);
    this.cupState = 'none'; // none | slot | hand | desk
    this.brewing = -1;

    const [FUR] = [K.FUR];
    const build = this.add({ fur: FUR.mint, acc: 'headphones', accColor: '#3d5afe' }, DESK[0].x, CHAIR_Z, 0);
    const idea = this.add({ fur: FUR.cream, acc: 'cap', accColor: '#ffcb45' }, DESK[1].x, CHAIR_Z, 0);
    const design = this.add({ fur: FUR.lilac, acc: 'bow', accColor: '#ff85b8' }, BOARD.x - 1.6, -6.4, Math.PI);
    const launch = this.add({ fur: FUR.honey, acc: 'glasses' }, BOARD.x + 1.9, -6.2, Math.PI - 0.3);
    build.sit = idea.sit = 1; build.seated = idea.seated = true;
    Object.assign(this, { build, idea, design, launch });
    this.loops();
  }

  add(spec, x, z, yaw) { const a = new Actor(this, spec, x, z, yaw); this.actors.push(a); return a; }

  // Each keeps its own day going; when a queue runs out it plans the next round.
  loops() {
    const o = this;
    const { build, idea, design, launch } = this;
    const call = (fn) => ({ do: 'call', fn });
    const again = (who, round) => call(() => who.plan(round()));
    const buildDay = () => [{ do: 'type', dur: 9 + Math.random() * 3 }, { do: 'stretch', dur: 2.2 }, { do: 'type', dur: 7 }, again(build, buildDay)];
    const deskSpot = (d) => [d.x + 1.5, d.z - 0.2]; // where the cup stands on the desk
    const AT_MACHINE = [14.3, -4.75], AT_BIN = [12.1, -6.3];
    const toMachine = [[DESK[1].x + 2.8, CHAIR_Z - 0.1], [9.6, CHAIR_Z - 0.2], [...AT_MACHINE]];
    const ideaDay = () => {
      const round = [{ do: 'type', dur: 6 + Math.random() * 2 }, { do: 'stand' }];
      if (o.cupState === 'desk') round.push({ do: 'reach', dur: 0.8 }, call(() => o.take(idea)));
      round.push({ do: 'walk', path: toMachine.map((p) => [...p]) });
      if (o.cupState === 'hand') round.push({ do: 'walk', path: [[...AT_BIN]] }, { do: 'face', yaw: angTo(BIN.x - AT_BIN[0], BIN.z - AT_BIN[1]) }, { do: 'reach', dur: 0.7 }, call(() => o.drop()), { do: 'walk', path: [[...AT_MACHINE]] });
      round.push(
        { do: 'face', yaw: angTo(15.13 - AT_MACHINE[0], -5.59 - AT_MACHINE[1]) }, // toward the slot
        { do: 'press', dur: 0.8 }, call(() => o.brew()),
        { do: 'idle', dur: 2.4 },
        { do: 'reach', dur: 0.9 }, call(() => o.take(idea)),
        { do: 'walk', path: toMachine.slice().reverse().map((p) => [...p]).concat([[DESK[1].x, CHAIR_Z]]) },
        { do: 'sit' },
        { do: 'sip', dur: 1.8 }, { do: 'type', dur: 4 }, { do: 'sip', dur: 1.6 }, { do: 'type', dur: 3 },
        { do: 'reach', dur: 0.8 }, call(() => o.put(DESK[1])),
        again(idea, ideaDay),
      );
      return round;
    };
    const designDay = () => [
      { do: 'draw', dur: 6 + Math.random() * 2, face: Math.PI },
      { do: 'walk', path: [[BOARD.x - 1.6, -5.5]] }, { do: 'face', yaw: Math.PI }, { do: 'look', dur: 2.6 },
      { do: 'walk', path: [[BOARD.x - 1.6, -6.4]] }, { do: 'face', yaw: Math.PI },
      again(design, designDay),
    ];
    const toBuild = [[BOARD.x + 1.9, -5.2], [-3.6, -5.2], [-5, -6.4], [DESK[0].x - 2.5, -6.4], [DESK[0].x - 2.5, CHAIR_Z - 0.4]];
    const launchDay = () => [
      { do: 'point', dur: 4, face: Math.PI - 0.2 },
      { do: 'face', yaw: angTo(-3.5, -0.2) }, { do: 'talk', dur: 2.6, face: angTo(-3.5, -0.2) },
      call(() => o.highFive()), { do: 'idle', dur: 1.3, face: angTo(-3.5, -0.2) },
      { do: 'nod', dur: 1.6, face: Math.PI },
      { do: 'walk', path: toBuild.map((p) => [...p]) },
      { do: 'face', yaw: angTo(2.5, 0.4) }, call(() => o.chat(true)),
      { do: 'talk', dur: 4.2, face: angTo(2.5, 0.4) }, { do: 'wave', dur: 1.1, face: angTo(2.5, 0.4) }, call(() => o.chat(false)),
      { do: 'walk', path: toBuild.slice().reverse().map((p) => [...p]).concat([[BOARD.x + 1.9, -6.2]]) },
      { do: 'face', yaw: Math.PI - 0.3 },
      again(launch, launchDay),
    ];
    build.plan(buildDay());
    idea.plan(ideaDay());
    design.plan(designDay());
    launch.plan(launchDay());
  }

  // the coffee: pressed, brewed, dropped in the slot, taken, carried, put down, thrown away
  brew() { this.brewing = 0; }
  take(who) {
    who.palm.add(this.cup);
    this.cup.position.set(0, -0.12, 0.02); // (kept upright each frame, in update)
    this.cup.visible = true;
    this.cupState = 'hand';
    who.holding = true;
  }
  put(d) {
    this.scene.add(this.cup);
    this.cup.rotation.set(0, 0, 0);
    this.cup.position.set(d.x + 1.5, DESK_TOP, d.z - 0.2);
    this.cupState = 'desk';
    this.idea.holding = false;
  }
  drop() { this.cup.visible = false; this.cupState = 'none'; this.idea.holding = false; }
  highFive() {
    const t = this.t;
    this.launch.over = { name: 'high5', t, dur: 1.1 };
    this.design.over = { name: 'high5', t: t + 0.05, dur: 1.1 };
  }
  chat(on) { if (on) this.build.over = { name: 'chat', t: this.t, dur: 5.4, look: -0.75 }; }

  update(dt, t) {
    this.t = t;
    for (const a of this.actors) a.update(dt, t);
    // the machine: a button lights, the screen blinks while it brews, the cup drops into the lit slot
    const m = this.machine;
    if (this.brewing >= 0) {
      this.brewing += dt;
      const b = this.brewing;
      m.buttons[1].material.emissiveIntensity = b < 0.4 ? 1.4 : 0.3 * (b < 2.4 ? 1 : 0);
      m.screen.color.set(Math.sin(b * 12) > 0 && b < 1.8 ? '#ffcb45' : '#2fd0a0');
      m.slotLight.intensity = b > 0.9 && b < 3 ? 6 : 0;
      if (b > 1.1 && this.cupState !== 'hand') {
        m.g.updateWorldMatrix(true, false);
        const world = m.slot.clone().applyMatrix4(m.g.matrixWorld);
        const k = Math.min(1, (b - 1.1) / 0.5);
        this.scene.add(this.cup);
        this.cup.rotation.set(0, -0.35, 0);
        this.cup.position.set(world.x, world.y + 0.6 * (1 - k * k), world.z);
        this.cup.visible = true;
        this.cupState = 'slot';
      }
      if (b > 3.4) { this.brewing = -1; m.buttons[1].material.emissiveIntensity = 0; }
    }
    // a carried cup stays upright whatever the arm does
    if (this.cupState === 'hand' && this.cup.parent) {
      this.cup.parent.updateWorldMatrix(true, false);
      this.cup.parent.getWorldQuaternion(this.cup.quaternion).invert();
    }
    // the laptop screens glow a little brighter while someone is typing
    this.desks.forEach((d, i) => { const who = i ? this.idea : this.build; d.glow.material.opacity = who.act === 'type' ? 0.3 : 0.14; });
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
  let renderer;
  try {
    renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: false, powerPreference: 'high-performance' });
  } catch {
    return null;
  }
  K.assets();
  K.materials();
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.NeutralToneMapping;
  renderer.toneMappingExposure = 1.05;
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFShadowMap;
  renderer.setClearColor('#e9dfcf');

  const scene = new THREE.Scene();
  scene.fog = new THREE.Fog('#e9dfcf', 60, 120);
  scene.add(new THREE.HemisphereLight('#fff6ea', '#b7a48c', 1.2));
  const sun = new THREE.DirectionalLight('#fff0dc', 2.6); // the window's light, from the back left and above
  sun.position.set(-12, 18, 10);
  sun.target.position.set(0, 0, -3);
  sun.castShadow = true;
  sun.shadow.mapSize.set(2048, 2048);
  Object.assign(sun.shadow.camera, { left: -24, right: 24, top: 16, bottom: -16, near: 1, far: 70 });
  sun.shadow.radius = 5;
  sun.shadow.bias = -0.0004;
  sun.shadow.normalBias = 0.03;
  scene.add(sun, sun.target);
  const windowFill = new THREE.PointLight('#dcecff', 30, 26, 1.4);
  windowFill.position.set(-5.5, 6, -6);
  scene.add(windowFill);

  const camera = new THREE.PerspectiveCamera(28, 2, 0.5, 200);
  const density = { value: 24 };
  const office = new Office(scene, density);
  el.prepend(canvas);

  let W = 0, H = 0;
  const layout = () => {
    W = el.clientWidth; H = el.clientHeight;
    if (!W || !H) return;
    const dpr = Math.min(devicePixelRatio || 1, 2);
    renderer.setPixelRatio(dpr);
    renderer.setSize(W, H, false);
    camera.aspect = W / H;
    // the whole room on wide frames; on narrower ones (tablets, phones) the camera crops in on the middle of the room
    // rather than shrinking the crew to fit its width
    const hfov = 2 * Math.atan((16.2 * K.clamp(camera.aspect / 2.1, 0.62, 1)) / 25);
    camera.fov = Math.max(28, (2 * Math.atan(Math.tan(hfov / 2) / camera.aspect) * 180) / Math.PI);
    camera.updateProjectionMatrix();
    // the fur's strands sized to the pixels a head radius covers
    const pxPerUnit = (H * SIZE) / (2 * 25 * Math.tan((camera.fov * Math.PI) / 360));
    density.value = K.clamp((pxPerUnit * dpr) / 3.2, 9, 24); // fuller strands than the band's: at this scale finer ones read as grain
  };
  const aim = new THREE.Vector3(1.2, 3.5, -4.8);
  const place = (t) => { // a slow drift, and a lean toward the pointer
    camera.position.set(2.2 + Math.sin(t * 0.07) * 1.0 + look.x * 2.2, 8.6 + look.y * -1, 20.5);
    camera.lookAt(aim);
  };
  const look = { x: 0, y: 0 }, aimLook = { x: 0, y: 0 };

  let on = false, raf = 0, last = performance.now() / 1000, t = 0;
  const frame = (now) => {
    raf = 0;
    const s = now / 1000, dt = Math.min(0.05, Math.max(0, s - last));
    last = s; t += dt;
    look.x = K.damp(look.x, aimLook.x, 3, dt); look.y = K.damp(look.y, aimLook.y, 3, dt);
    office.update(dt, t);
    place(t);
    renderer.render(scene, camera);
    if (on && !still && !document.hidden) raf = requestAnimationFrame(frame);
  };
  const resume = () => { if (still || raf || !on || document.hidden) return; last = performance.now() / 1000; raf = requestAnimationFrame(frame); };

  layout();
  if (still) { // one moment of the day: run the simulation forward quietly, then draw it once
    for (let i = 0; i < 60 * 14; i++) { t += 1 / 60; office.update(1 / 60, t); }
    place(t);
    renderer.render(scene, camera);
  } else frame(performance.now());
  el.classList.add('is-live');

  new IntersectionObserver(([e]) => { on = e.isIntersecting; resume(); }, { rootMargin: '100px 0px' }).observe(el);
  let resizing = 0;
  addEventListener('resize', () => { clearTimeout(resizing); resizing = setTimeout(() => { layout(); if (still) renderer.render(scene, camera); }, 150); });
  if (!still && matchMedia('(hover: hover) and (pointer: fine)').matches) {
    el.addEventListener('pointermove', (e) => { const r = el.getBoundingClientRect(); aimLook.x = (e.clientX - r.left) / r.width - 0.5; aimLook.y = (e.clientY - r.top) / r.height - 0.5; });
    el.addEventListener('pointerleave', () => { aimLook.x = aimLook.y = 0; });
  }
  document.addEventListener('visibilitychange', resume);
  canvas.addEventListener('webglcontextlost', () => { cancelAnimationFrame(raf); on = false; canvas.remove(); el.classList.remove('is-live'); });
  return { el };
}
