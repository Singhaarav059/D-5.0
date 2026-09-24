// Liquid hover: a small fluid simulation that ripples the hero sky image under the pointer.
// Ported from the previous Demaze hero (commit 9b9675d). Returns { splash(x, y) }, or false when unsupported,
// in which case the static <img> underneath simply stays visible.
window.initLiquid = function (box, src) {
  if (!box || box.querySelector('canvas')) return false;
  const canvas = document.createElement('canvas');
  canvas.className = 'liquid';
  const gl = canvas.getContext('webgl', { alpha: true, depth: false, antialias: false, premultipliedAlpha: true });
  if (!gl) return false;
  // Float render targets are required for the velocity/pressure fields.
  let type = gl.getExtension('OES_texture_float') && gl.FLOAT;
  gl.getExtension('OES_texture_float_linear');
  if (!type) {
    const half = gl.getExtension('OES_texture_half_float');
    gl.getExtension('OES_texture_half_float_linear');
    if (!half) return false;
    type = half.HALF_FLOAT_OES;
  }
  const photo = box.querySelector('img');
  box.insertBefore(canvas, photo ? photo.nextSibling : null); // above the photo, below glows/orbs

  const OVERSCAN = 1.2;
  const CURSOR_SIZE = 2.5, CURSOR_POWER = 5 + 0.9 * 50, DISTORT = 0.75;
  const mouse = { x: 0, y: 0, dx: 0, dy: 0, moved: false };
  let grid = { w: 0, h: 0 }, vel, pres, div, out, imgTex = null, imgAspect = 1, raf = null, visible = true;

  const VERT = `precision highp float;
attribute vec2 a_position; varying vec2 vUv, vL, vR, vT, vB; uniform vec2 u_texel;
void main(){ vUv=.5*(a_position+1.); vL=vUv-vec2(u_texel.x,0.); vR=vUv+vec2(u_texel.x,0.); vT=vUv+vec2(0.,u_texel.y); vB=vUv-vec2(0.,u_texel.y); gl_Position=vec4(a_position,0.,1.); }`;
  const H = 'precision highp float; precision highp sampler2D; varying vec2 vUv, vL, vR, vT, vB;\n';
  const shader = (src, t) => {
    const s = gl.createShader(t); gl.shaderSource(s, src); gl.compileShader(s);
    if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) throw new Error(gl.getShaderInfoLog(s));
    return s;
  };
  const program = (frag) => {
    const p = gl.createProgram();
    gl.attachShader(p, shader(VERT, gl.VERTEX_SHADER));
    gl.attachShader(p, shader(H + frag, gl.FRAGMENT_SHADER));
    gl.bindAttribLocation(p, 0, 'a_position');
    gl.linkProgram(p);
    const u = {};
    for (let i = 0; i < gl.getProgramParameter(p, gl.ACTIVE_UNIFORMS); i++) { const a = gl.getActiveUniform(p, i); u[a.name] = gl.getUniformLocation(p, a.name); }
    return { p, u };
  };

  let P;
  try {
    P = {
      splat: program(`uniform sampler2D u_input_texture; uniform float u_ratio; uniform vec3 u_point_value; uniform vec2 u_point; uniform float u_point_size;
void main(){ vec2 p=vUv-u_point; p.x*=u_ratio; vec3 s=.6*pow(2.,-dot(p,p)/u_point_size)*u_point_value; gl_FragColor=vec4(texture2D(u_input_texture,vUv).xyz+s,1.); }`),
      div: program(`uniform sampler2D u_velocity_texture;
void main(){ float L=texture2D(u_velocity_texture,vL).x, R=texture2D(u_velocity_texture,vR).x, T=texture2D(u_velocity_texture,vT).y, B=texture2D(u_velocity_texture,vB).y; gl_FragColor=vec4(.25*(R-L+T-B),0.,0.,1.); }`),
      pres: program(`uniform sampler2D u_pressure_texture; uniform sampler2D u_divergence_texture;
void main(){ float L=texture2D(u_pressure_texture,vL).x, R=texture2D(u_pressure_texture,vR).x, T=texture2D(u_pressure_texture,vT).x, B=texture2D(u_pressure_texture,vB).x; gl_FragColor=vec4((L+R+B+T-texture2D(u_divergence_texture,vUv).x)*.25,0.,0.,1.); }`),
      grad: program(`uniform sampler2D u_pressure_texture; uniform sampler2D u_velocity_texture;
void main(){ float L=texture2D(u_pressure_texture,vL).x, R=texture2D(u_pressure_texture,vR).x, T=texture2D(u_pressure_texture,vT).x, B=texture2D(u_pressure_texture,vB).x; vec2 v=texture2D(u_velocity_texture,vUv).xy-vec2(R-L,T-B); gl_FragColor=vec4(v,0.,1.); }`),
      adv: program(`uniform sampler2D u_velocity_texture; uniform sampler2D u_input_texture; uniform vec2 u_texel; uniform vec2 u_output_textel; uniform float u_dt; uniform float u_dissipation;
vec4 bilerp(sampler2D s, vec2 uv, vec2 t){ vec2 st=uv/t-.5, i=floor(st), f=fract(st);
  return mix(mix(texture2D(s,(i+vec2(.5,.5))*t),texture2D(s,(i+vec2(1.5,.5))*t),f.x),mix(texture2D(s,(i+vec2(.5,1.5))*t),texture2D(s,(i+vec2(1.5,1.5))*t),f.x),f.y); }
void main(){ vec2 c=vUv-u_dt*bilerp(u_velocity_texture,vUv,u_texel).xy*u_texel; gl_FragColor=u_dissipation*bilerp(u_input_texture,c,u_output_textel); }`),
      show: program(`uniform float u_ratio; uniform float u_img_ratio; uniform float u_disturb_power; uniform sampler2D u_output_texture; uniform sampler2D u_velocity_texture; uniform sampler2D u_img;
void main(){
  float off=texture2D(u_output_texture,vUv).r; vec2 v=texture2D(u_velocity_texture,vUv).xy+.001;
  vec2 uv=(vUv-.5)/.8333; vec2 sc=vec2(1.); if(u_ratio>u_img_ratio) sc.y=u_img_ratio/u_ratio; else sc.x=u_ratio/u_img_ratio;
  uv=uv*sc+.5; uv-=2.*u_disturb_power*normalize(v)*off;
  gl_FragColor=vec4(texture2D(u_img,vec2(clamp(uv.x,0.,1.),1.-clamp(uv.y,0.,1.))).rgb,1.); }`),
    };
  } catch (e) { canvas.remove(); return false; }

  // One full-screen quad, bound once.
  gl.bindBuffer(gl.ARRAY_BUFFER, gl.createBuffer());
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, -1, 1, 1, 1, 1, -1]), gl.STATIC_DRAW);
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, gl.createBuffer());
  gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array([0, 1, 2, 0, 2, 3]), gl.STATIC_DRAW);
  gl.vertexAttribPointer(0, 2, gl.FLOAT, false, 0, 0);
  gl.enableVertexAttribArray(0);
  const draw = (fbo) => {
    if (fbo) { gl.viewport(0, 0, fbo.w, fbo.h); gl.bindFramebuffer(gl.FRAMEBUFFER, fbo.fbo); }
    else { gl.viewport(0, 0, gl.drawingBufferWidth, gl.drawingBufferHeight); gl.bindFramebuffer(gl.FRAMEBUFFER, null); }
    gl.drawElements(gl.TRIANGLES, 6, gl.UNSIGNED_SHORT, 0);
  };
  const fbo = (w, h) => {
    const tex = gl.createTexture();
    gl.activeTexture(gl.TEXTURE0); gl.bindTexture(gl.TEXTURE_2D, tex);
    [gl.TEXTURE_MIN_FILTER, gl.TEXTURE_MAG_FILTER].forEach((k) => gl.texParameteri(gl.TEXTURE_2D, k, gl.LINEAR));
    [gl.TEXTURE_WRAP_S, gl.TEXTURE_WRAP_T].forEach((k) => gl.texParameteri(gl.TEXTURE_2D, k, gl.CLAMP_TO_EDGE));
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, w, h, 0, gl.RGBA, type, null);
    const f = gl.createFramebuffer();
    gl.bindFramebuffer(gl.FRAMEBUFFER, f);
    gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, tex, 0);
    gl.viewport(0, 0, w, h); gl.clear(gl.COLOR_BUFFER_BIT);
    return { fbo: f, w, h, attach: (slot) => { gl.activeTexture(gl.TEXTURE0 + slot); gl.bindTexture(gl.TEXTURE_2D, tex); return slot; } };
  };
  const double = (w, h) => { let a = fbo(w, h), b = fbo(w, h); return { tx: 1 / w, ty: 1 / h, read: () => a, write: () => b, swap() { [a, b] = [b, a]; } }; };

  const resize = () => {
    const w = box.clientWidth || 1440, h = box.clientHeight || 900, dpr = Math.min(devicePixelRatio || 1, 1.5);
    canvas.width = Math.round(w * OVERSCAN * dpr);
    canvas.height = Math.round(h * OVERSCAN * dpr);
    grid = { w: Math.round(256 * (w / h)), h: 256 };
    vel = double(grid.w, grid.h); pres = double(grid.w, grid.h); div = fbo(grid.w, grid.h); out = double(grid.w, grid.h);
  };
  const ratio = () => box.clientWidth / Math.max(1, box.clientHeight);
  const pointer = (x, y) => {
    const w = box.clientWidth * OVERSCAN, h = box.clientHeight * OVERSCAN;
    return [(x + (w - box.clientWidth) / 2) / w, 1 - (y + (h - box.clientHeight) / 2) / h];
  };
  const queue = []; // extra splats from outside (splash)

  const img = new Image();
  img.onload = () => {
    imgAspect = img.naturalWidth / img.naturalHeight;
    imgTex = gl.createTexture();
    gl.activeTexture(gl.TEXTURE0); gl.bindTexture(gl.TEXTURE_2D, imgTex);
    [gl.TEXTURE_MIN_FILTER, gl.TEXTURE_MAG_FILTER].forEach((k) => gl.texParameteri(gl.TEXTURE_2D, k, gl.LINEAR));
    [gl.TEXTURE_WRAP_S, gl.TEXTURE_WRAP_T].forEach((k) => gl.texParameteri(gl.TEXTURE_2D, k, gl.CLAMP_TO_EDGE));
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, img);
    canvas.classList.add('is-ready');
  };
  img.src = src;

  // Idle drift: when no real pointer has moved for a moment (always, on touch screens), a slow
  // virtual cursor wanders a Lissajous path so the water keeps rippling on its own.
  let lastReal = -1e9, drifting = false;
  const drift = (now) => {
    if (now - lastReal < 2200) { drifting = false; return; }
    const t = now / 1000, w = box.clientWidth, h = box.clientHeight;
    const x = w * (0.5 + 0.34 * Math.sin(t * 0.37)), y = h * (0.46 + 0.2 * Math.sin(t * 0.61 + 1.3));
    if (!drifting) { drifting = true; mouse.x = x; mouse.y = y; return; } // no splash on the hand-off
    const r = box.getBoundingClientRect();
    move(r.left + x, r.top + y);
  };

  const frame = (now) => {
    raf = null;
    if (!visible || document.hidden) return;
    drift(now);
    const dt = 1 / 60;
    const splat = (x, y, dx, dy, size, power) => {
      const [u, v] = pointer(x, y);
      gl.useProgram(P.splat.p);
      gl.uniform1f(P.splat.u.u_ratio, ratio());
      gl.uniform2f(P.splat.u.u_point, u, v);
      gl.uniform1f(P.splat.u.u_point_size, size * 0.001);
      gl.uniform1i(P.splat.u.u_input_texture, vel.read().attach(1));
      gl.uniform3f(P.splat.u.u_point_value, dx, -dy, 0);
      draw(vel.write()); vel.swap();
      gl.uniform1i(P.splat.u.u_input_texture, out.read().attach(1));
      gl.uniform3f(P.splat.u.u_point_value, power * 0.001, 0, 0);
      draw(out.write()); out.swap();
    };
    if (mouse.moved) { mouse.moved = false; splat(mouse.x, mouse.y, mouse.dx, mouse.dy, CURSOR_SIZE, CURSOR_POWER); }
    while (queue.length) splat(...queue.shift());
    gl.useProgram(P.div.p);
    gl.uniform2f(P.div.u.u_texel, vel.tx, vel.ty);
    gl.uniform1i(P.div.u.u_velocity_texture, vel.read().attach(1));
    draw(div);
    gl.useProgram(P.pres.p);
    gl.uniform2f(P.pres.u.u_texel, vel.tx, vel.ty);
    gl.uniform1i(P.pres.u.u_divergence_texture, div.attach(1));
    for (let i = 0; i < 16; i++) { gl.uniform1i(P.pres.u.u_pressure_texture, pres.read().attach(2)); draw(pres.write()); pres.swap(); }
    gl.useProgram(P.grad.p);
    gl.uniform2f(P.grad.u.u_texel, vel.tx, vel.ty);
    gl.uniform1i(P.grad.u.u_pressure_texture, pres.read().attach(1));
    gl.uniform1i(P.grad.u.u_velocity_texture, vel.read().attach(2));
    draw(vel.write()); vel.swap();
    gl.useProgram(P.adv.p);
    gl.uniform2f(P.adv.u.u_texel, vel.tx, vel.ty);
    gl.uniform2f(P.adv.u.u_output_textel, vel.tx, vel.ty);
    gl.uniform1i(P.adv.u.u_velocity_texture, vel.read().attach(1));
    gl.uniform1i(P.adv.u.u_input_texture, vel.read().attach(1));
    gl.uniform1f(P.adv.u.u_dt, dt); gl.uniform1f(P.adv.u.u_dissipation, 0.97);
    draw(vel.write()); vel.swap();
    gl.uniform1i(P.adv.u.u_input_texture, out.read().attach(2));
    gl.uniform1f(P.adv.u.u_dt, 8 * dt); gl.uniform1f(P.adv.u.u_dissipation, 0.98);
    draw(out.write()); out.swap();
    if (imgTex) {
      gl.useProgram(P.show.p);
      gl.uniform1f(P.show.u.u_ratio, ratio());
      gl.uniform1f(P.show.u.u_img_ratio, imgAspect);
      gl.uniform1f(P.show.u.u_disturb_power, DISTORT);
      gl.uniform1i(P.show.u.u_output_texture, out.read().attach(1));
      gl.uniform1i(P.show.u.u_velocity_texture, vel.read().attach(2));
      gl.activeTexture(gl.TEXTURE0); gl.bindTexture(gl.TEXTURE_2D, imgTex);
      gl.uniform1i(P.show.u.u_img, 0);
      draw(null);
    }
    raf = requestAnimationFrame(frame);
  };
  const start = () => { if (!raf && visible) raf = requestAnimationFrame(frame); };

  const host = box.closest('section') || box;
  const move = (x, y) => {
    const r = box.getBoundingClientRect();
    x -= r.left; y -= r.top;
    mouse.dx = 6 * (x - mouse.x); mouse.dy = 6 * (y - mouse.y);
    mouse.x = x; mouse.y = y; mouse.moved = true;
  };
  host.addEventListener('pointermove', (e) => { if (e.pointerType === 'mouse') lastReal = performance.now(); move(e.clientX, e.clientY); }, { passive: true });
  addEventListener('resize', () => { resize(); }, { passive: true });
  document.addEventListener('visibilitychange', start);
  new IntersectionObserver((e) => { visible = e[0].isIntersecting; start(); }).observe(host);

  resize();
  mouse.x = box.clientWidth / 2; mouse.y = box.clientHeight * 0.4;
  start();
  // Splash: a ring of outward pushes at a client point (used when a hero bubble pops).
  const splash = (cx, cy, strength = 1) => {
    const r = box.getBoundingClientRect(), x = cx - r.left, y = cy - r.top;
    for (let k = 0; k < 8; k++) {
      const a = (k / 8) * Math.PI * 2;
      queue.push([x + Math.cos(a) * 6, y + Math.sin(a) * 6, Math.cos(a) * 90 * strength, Math.sin(a) * 90 * strength, 1.6, 22 * strength]);
    }
    start();
  };
  return { splash };
};
