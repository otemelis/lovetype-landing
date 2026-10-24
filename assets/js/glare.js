// LoveType edge light: the browser window is the glass.
// WebGL port of the app's edge-light shader, shared with POIS (withpois.com); only the
// palette differs. Sections set the scene with data-light attributes:
//   data-light="attachment|loveStyle|conflict|profile|full"
//   data-coverage="0..1"  data-intensity="0..1.2"  data-wake (sweep the ring on entry)
// Exposes window.LTLight = { model, nudge(), wake() } so other pieces (the heart) can read
// the light direction and family colour.

const FAMILIES = {
  attachment: { accent: '#C07090', bloom: '#7A2E52', spectrum: ['#F0C4D6', '#DDA0B8', '#C07090', '#9A5070', '#E8C8D8'] },
  loveStyle: { accent: '#A080C0', bloom: '#4E2F78', spectrum: ['#D8C4EC', '#C0A0DC', '#A080C0', '#7A58A0', '#E6D8F4'] },
  conflict: { accent: '#7080C0', bloom: '#2E3A80', spectrum: ['#C4CCF0', '#98A4DC', '#7080C0', '#4E5CA0', '#D8DEF6'] },
  profile: { accent: '#B085A0', bloom: '#5A2E50', spectrum: ['#E8C8D8', '#B085A0', '#8B5E80', '#C07090', '#DDA0B8'] },
  full: { accent: '#C07090', bloom: '#6B3A60', spectrum: ['#DDA0B8', '#C07090', '#A080C0', '#7080C0', '#E8C8D8'] },
};
const CORE = '#FBEEF4';
const WARM = '#DDA0B8';
const GROUND = '#0E0910';

const STYLE = {
  glareWidth: 1.2, glareFocus: 1.1, glareBrightness: 1.25, edgeLevel: 0.14,
  counterReflection: 0.22, dispersion: 0.95, colourSpread: 38, colourInCore: 0.1, dome: 0.55,
  irregularity: 0.7, hairline: 0.75, startAngle: -64, tiltSensitivity: 1.2, tiltResponse: 0.55,
  breathe: 0.7, nudgeDuration: 0.9, beginDuration: 1.7,
};
const VIVID = { saturation: 1.3, falloff: 1.14, core: 1.4, dome: 0.85 };

const VS = 'attribute vec2 p; void main(){ gl_Position = vec4(p, 0.0, 1.0); }';
const FS = `
precision highp float;
uniform float cornerN, vSat, vGamma, vCore, vFog;
uniform vec2 size; uniform float radius, time, coverage, head, intensity, warmth, lift, travel, travelAngle, wave, waveAmp, width, scale;
uniform vec4 look, look2; uniform vec3 look3; uniform vec3 stops[5];
uniform vec2 light; uniform vec3 coreColor, bloomColor, warmColor, accentColor, bgColor;
const float PI = 3.14159265;
float sdRoundRect(vec2 p, vec2 h, float r){
  vec2 q = abs(p) - h + r;
  vec2 m = max(q, 0.0) / max(r, 1e-3);
  float cornerLen = r * pow(pow(m.x, cornerN) + pow(m.y, cornerN), 1.0 / cornerN);
  return cornerLen + min(max(q.x,q.y),0.0) - r;
}
float hash12(vec2 p){ vec3 p3 = fract(vec3(p.xyx) * .1031); p3 += dot(p3, p3.yzx + 33.33); return fract((p3.x + p3.y) * p3.z); }
float angDiff(float a, float b){ float d = a - b; return atan(sin(d), cos(d)); }
vec3 rampColor(float t){
  float x = clamp(t, 0.0, 1.0) * 4.0;
  float fi = min(floor(x), 3.0);
  float f = x - fi;
  vec3 a = stops[0]; vec3 b = stops[1];
  for (int i = 0; i < 4; i++) { if (float(i) == fi) { a = stops[i]; b = stops[i + 1]; } }
  return mix(a, b, smoothstep(0.0, 1.0, f));
}
void main(){
  vec2 position = vec2(gl_FragCoord.x, size.y*scale - gl_FragCoord.y) / scale;
  vec2 c = size * .5; vec2 p = position - c;
  float sd = sdRoundRect(p, c, radius);
  if (sd > 0.5) { gl_FragColor = vec4(0.0); return; }
  float e = max(-sd, 0.0);
  float edgeScale = clamp(look.x, .5, 1.4);
  float domeR = 80.0 * look.x * width;
  float edgeReach = 130.0 * width * edgeScale;
  float reach = max(edgeReach, look3.z > .001 ? domeR * 2.6 : 0.0);
  if (e > reach) { gl_FragColor = vec4(bgColor, 1.0); return; }
  vec2 n = p / c;
  vec2 q = abs(p) - c + radius; float qm = max(q.x, q.y);
  vec2 soft = vec2(exp((q.x - qm)/24.0), exp((q.y - qm)/24.0));
  vec2 outward = normalize(soft) * vec2(p.x < 0.0 ? -1.0 : 1.0, p.y < 0.0 ? -1.0 : 1.0);
  vec2 ne = (p + outward * e) / c;
  float a = atan(ne.y, ne.x); vec2 dir = vec2(cos(a), sin(a));
  float strength = clamp(length(light), 0.0, 1.0);
  vec2 L = strength > 1e-4 ? light / max(length(light), 1e-4) : vec2(-.5, -.86);
  float facing = dot(dir, L); float lightAngle = atan(L.y, L.x);
  float sharp = mix(2.0, 9.0, strength) * look.y;
  float lobe = pow(clamp(.5 + .5*facing, 0.0, 1.0), sharp);
  float counter = pow(clamp(.5 - .5*facing, 0.0, 1.0), sharp*1.8) * look2.x;
  float fromLight = abs(angDiff(a, lightAngle));
  float front = coverage * PI * 1.12;
  float covered = 1.0 - smoothstep(front - .55, front + .02, fromLight);
  float ring = look.w * covered;
  float headGlow = head * exp(-pow((fromLight - front) / .22, 2.0));
  float irr = .5 + .5*look2.z*(.55*sin(a*3.0 + time*.19) + .30*sin(a*5.0 - time*.11 + 1.7) + .15*sin(a*11.0 + time*.31 + 4.1));
  float td = angDiff(a, travelAngle); float travelGlow = travel * exp(-td*td/.22);
  float up = clamp(.5 - .5*n.y, 0.0, 1.0); float liftMul = mix(1.0, .35 + 1.25*up, lift);
  float cd = angDiff(a, lightAngle + wave*2.0*PI); float tail = cd < 0.0 ? .9 : .25;
  float waveGlow = waveAmp * exp(-cd*cd/tail);
  float energy = (ring + lobe*look.z + counter + travelGlow*.55 + headGlow) * (.7 + .6*irr) * liftMul;
  energy = energy*intensity + waveGlow*intensity;
  float w = width * edgeScale * (5.0 + 9.0*irr + 16.0*lobe + 14.0*waveGlow);
  float hair = exp(-e/1.1) * (.3 + 1.6*lobe + headGlow + waveGlow);
  float core = exp(-e/(w*.2)); float bloom = exp(-e/w); float bloomWide = exp(-e/(w*1.35));
  float side = angDiff(a, lightAngle);
  float drift = .04 * sin(time * .07);
  vec3 ramp = rampColor(side / max(look3.x, .05) * .5 + .5 + drift);
  float colourAmt = clamp(clamp(lobe*3.0, 0.0, 1.0) * look2.y, 0.0, 1.0) * (1.0 - warmth);
  vec3 cool = mix(bloomColor, ramp, colourAmt);
  vec3 coreC = mix(mix(coreColor, ramp, colourAmt * look3.y), warmColor, warmth*.6);
  vec3 bloomC = mix(cool, warmColor, warmth);
  vec3 edgeTint = mix(accentColor, warmColor, warmth);
  vec3 col = coreC*(core*.6*vCore + hair*look2.w*vCore) + bloomC*bloom*.9 + edgeTint*bloomWide*.12*(headGlow + waveGlow + .25);
  col *= energy * (1.0 - smoothstep(edgeReach*.45, edgeReach, e));
  if (look3.z > .001) {
    vec2 lp = L / max(abs(L.x), abs(L.y)) * c;
    vec2 dv = p - lp;
    float dd = length(dv) / domeR;
    float dome = exp(-dd*dd*.9) * look3.z * look.z * strength * liftMul;
    float along = dot(dv, vec2(-L.y, L.x)) / (domeR * max(look3.x, .05) / .6);
    vec3 domeC = mix(mix(bloomColor, rampColor(along*.5 + .5 + drift), clamp(look2.y, 0.0, 1.0)), warmColor, warmth);
    col += domeC * dome * .8 * intensity * vFog;
  }
  col = 1.0 - exp(-col*1.25);
  float lum = dot(col, vec3(0.2126, 0.7152, 0.0722));
  col = max(mix(vec3(lum), col, vSat), 0.0);
  col = pow(col, vec3(vGamma));
  col += (hash12(position*scale) - .5) / 255.0;
  float edgeAA = 1.0 - smoothstep(-0.5, 0.5, sd);
  gl_FragColor = vec4((bgColor + col) * edgeAA, edgeAA);
}`;

const rgb = (h) => [1, 3, 5].map((i) => parseInt(h.slice(i, i + 2), 16) / 255);
const now = () => performance.now() / 1000;
const approach = (x, t, tau, dt) => x + (t - x) * (1 - Math.exp(-dt / tau));
const homeAngle = () => -Math.PI / 2 + (STYLE.startAngle * Math.PI) / 180;
const HOME = 0.85;

// Light state for one frame, eased toward the active scene.
class LightModel {
  constructor() {
    this.scene = { family: 'profile', coverage: 0.16, intensity: 0.62, width: 0.85, breathe: 0.05 };
    this.reduced = false;
    this.pointer = null;
    this.t0 = now();
    this.last = null;
    this.wakeStart = -1;
    this.nudgeStart = -1;
    const h = homeAngle();
    this.lightPos = [Math.cos(h) * HOME, Math.sin(h) * HOME];
    this.lightVel = [0, 0];
    const fam = FAMILIES.profile;
    this.colors = { stops: fam.spectrum.map(rgb), bloom: rgb(fam.bloom), accent: rgb(fam.accent) };
    this.f = { time: 0, light: [...this.lightPos], coverage: 0.16, head: 0, intensity: 0.62, travel: 0, travelAngle: 0, wave: 0, waveAmp: 0, width: 0.85 };
  }

  setScene(s) {
    Object.assign(this.scene, s);
    if (s.wake && !this.reduced) this.wake();
  }

  wake() {
    this.wakeStart = now();
    this.wakeFrom = Math.min(this.f.coverage, 0.35);
  }

  nudge(delay = 0) {
    this.nudgeStart = now() + delay;
  }

  get busy() {
    const t = now();
    return (this.wakeStart > 0 && t - this.wakeStart < STYLE.beginDuration + 0.4) || this.nudgeStart > 0 || Math.hypot(...this.lightVel) > 0.02 || this.colorMoving;
  }

  step() {
    const at = now();
    const f = this.f;
    const dt = Math.min(Math.max(at - (this.last ?? at), 0), 1 / 20);
    this.last = at;
    const rm = this.reduced;
    const sc = this.scene;
    f.time = (at - this.t0) * (rm ? 0.35 : 1);

    // Palette crossfade toward the scene's family.
    const fam = FAMILIES[sc.family] || FAMILIES.profile;
    const k = 1 - Math.exp(-dt / 0.6);
    let moving = false;
    const lerp3 = (cur, hex) => {
      const t = rgb(hex);
      for (let i = 0; i < 3; i++) {
        const d = t[i] - cur[i];
        if (Math.abs(d) > 0.002) moving = true;
        cur[i] += d * k;
      }
    };
    fam.spectrum.forEach((h, i) => lerp3(this.colors.stops[i], h));
    lerp3(this.colors.bloom, fam.bloom);
    lerp3(this.colors.accent, fam.accent);
    this.colorMoving = moving;

    const sweeping = this.wakeStart > 0 && at - this.wakeStart < STYLE.beginDuration;
    if (sweeping && !rm) {
      const p = Math.min((at - this.wakeStart) / STYLE.beginDuration, 1);
      const e = p * p * (3 - 2 * p);
      f.coverage = this.wakeFrom + (1 - this.wakeFrom) * e;
      f.head = Math.sin(p * Math.PI) * 1.1;
      f.travel = approach(f.travel, 0.55, 0.5, dt);
    } else {
      if (this.wakeStart > 0) this.wakeStart = -1;
      f.coverage = approach(f.coverage, rm ? Math.max(sc.coverage, 0.5) : sc.coverage, 1.1, dt);
      f.head = approach(f.head, 0, 0.3, dt);
      f.travel = approach(f.travel, 0, 1.5, dt);
    }
    f.width = approach(f.width, sc.width ?? 0.95, 1.2, dt);
    let target = sweeping ? 1.05 : sc.intensity;
    if (!rm && sc.breathe) target *= 1 + sc.breathe * STYLE.breathe * Math.sin((2 * Math.PI * f.time) / 10);
    f.intensity = approach(f.intensity, target, sweeping ? 0.5 : 1.0, dt);
    f.travelAngle += dt * (sweeping ? 1.6 : 0.45);
    if (f.travelAngle > Math.PI) f.travelAngle -= 2 * Math.PI;

    f.wave = 0;
    f.waveAmp = 0;
    if (this.nudgeStart > 0) {
      const p = (at - this.nudgeStart) / STYLE.nudgeDuration;
      if (p >= 1) this.nudgeStart = -1;
      else if (p > 0) {
        if (rm) f.intensity += 0.25 * Math.sin(p * Math.PI);
        else { f.wave = p; f.waveAmp = 0.8 * Math.sin(p * Math.PI); }
      }
    }

    // Pointer stands in for tilting the phone: heavy, critically damped.
    const home = homeAngle();
    let tx = Math.cos(home) * HOME;
    let ty = Math.sin(home) * HOME;
    if (!rm && this.pointer) {
      const angle = home - STYLE.tiltSensitivity * (-this.pointer[0] * 0.32);
      tx = Math.cos(angle) * HOME;
      ty = Math.sin(angle) * HOME + this.pointer[1] * 0.22;
    }
    const omega = 4.2 / STYLE.tiltResponse;
    const ax = omega * omega * (tx - this.lightPos[0]) - 2 * omega * this.lightVel[0];
    const ay = omega * omega * (ty - this.lightPos[1]) - 2 * omega * this.lightVel[1];
    this.lightVel[0] += ax * dt;
    this.lightVel[1] += ay * dt;
    this.lightPos[0] += this.lightVel[0] * dt;
    this.lightPos[1] += this.lightVel[1] * dt;
    f.light = [this.lightPos[0], this.lightPos[1]];
    return f;
  }
}

function createRenderer(canvas) {
  const gl = canvas.getContext('webgl', { antialias: false, premultipliedAlpha: true, alpha: true, powerPreference: 'low-power' });
  if (!gl) return null;
  try {
    if (matchMedia('(color-gamut: p3)').matches) gl.drawingBufferColorSpace = 'display-p3';
  } catch {}
  const compile = (type, src) => {
    const s = gl.createShader(type);
    gl.shaderSource(s, src);
    gl.compileShader(s);
    if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) throw new Error(gl.getShaderInfoLog(s));
    return s;
  };
  const prog = gl.createProgram();
  gl.attachShader(prog, compile(gl.VERTEX_SHADER, VS));
  gl.attachShader(prog, compile(gl.FRAGMENT_SHADER, FS));
  gl.linkProgram(prog);
  if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) throw new Error('link');
  gl.useProgram(prog);
  gl.bindBuffer(gl.ARRAY_BUFFER, gl.createBuffer());
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]), gl.STATIC_DRAW);
  const loc = gl.getAttribLocation(prog, 'p');
  gl.enableVertexAttribArray(loc);
  gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);
  const u = {};
  for (const n of ['size', 'scale', 'radius', 'time', 'light', 'coverage', 'head', 'intensity', 'warmth', 'lift', 'travel', 'travelAngle', 'wave', 'waveAmp', 'width', 'coreColor', 'bloomColor', 'warmColor', 'accentColor', 'bgColor', 'stops', 'look', 'look2', 'look3', 'cornerN', 'vSat', 'vGamma', 'vCore', 'vFog']) u[n] = gl.getUniformLocation(prog, n);
  const s = STYLE;
  gl.uniform3fv(u.coreColor, rgb(CORE));
  gl.uniform3fv(u.warmColor, rgb(WARM));
  gl.uniform3fv(u.bgColor, rgb(GROUND));
  gl.uniform4f(u.look, s.glareWidth, s.glareFocus, s.glareBrightness, s.edgeLevel);
  gl.uniform4f(u.look2, s.counterReflection, s.dispersion, s.irregularity, s.hairline);
  gl.uniform3f(u.look3, (s.colourSpread * Math.PI) / 180, s.colourInCore, s.dome);
  gl.uniform1f(u.vSat, VIVID.saturation);
  gl.uniform1f(u.vGamma, VIVID.falloff);
  gl.uniform1f(u.vCore, VIVID.core);
  gl.uniform1f(u.vFog, VIVID.dome);
  gl.uniform1f(u.warmth, 0);
  gl.uniform1f(u.lift, 0);
  let lost = false;
  canvas.addEventListener('webglcontextlost', (e) => { e.preventDefault(); lost = true; });
  return {
    render(f, colors, t) {
      if (lost) return;
      const pw = Math.max(1, Math.round(t.width * t.pr));
      const ph = Math.max(1, Math.round(t.height * t.pr));
      if (canvas.width !== pw || canvas.height !== ph) { canvas.width = pw; canvas.height = ph; }
      gl.viewport(0, 0, pw, ph);
      const scale = t.pr * t.unit;
      gl.uniform2f(u.size, pw / scale, ph / scale);
      gl.uniform1f(u.scale, scale);
      gl.uniform1f(u.radius, t.radius);
      gl.uniform1f(u.cornerN, t.cornerN);
      gl.uniform1f(u.time, f.time);
      gl.uniform2f(u.light, f.light[0], f.light[1]);
      gl.uniform1f(u.coverage, f.coverage);
      gl.uniform1f(u.head, f.head);
      gl.uniform1f(u.intensity, f.intensity);
      gl.uniform1f(u.travel, f.travel);
      gl.uniform1f(u.travelAngle, f.travelAngle);
      gl.uniform1f(u.wave, f.wave);
      gl.uniform1f(u.waveAmp, f.waveAmp);
      gl.uniform1f(u.width, f.width);
      gl.uniform3fv(u.stops, new Float32Array(colors.stops.flat()));
      gl.uniform3fv(u.bloomColor, colors.bloom);
      gl.uniform3fv(u.accentColor, colors.accent);
      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
    },
  };
}

function frameLoop(draw, fps) {
  let raf = 0, last = 0, running = false;
  const tick = (ts) => {
    if (!running) return;
    raf = requestAnimationFrame(tick);
    if (ts - last < 1000 / fps() - 2) return;
    last = ts;
    draw();
  };
  return {
    start() { if (!running) { running = true; raf = requestAnimationFrame(tick); } },
    stop() { running = false; cancelAnimationFrame(raf); },
  };
}

function sceneFrom(el) {
  const d = el.dataset;
  const s = { family: d.light || 'profile' };
  if (d.coverage) s.coverage = parseFloat(d.coverage);
  if (d.intensity) s.intensity = parseFloat(d.intensity);
  if (d.width) s.width = parseFloat(d.width);
  if ('wake' in d) s.wake = true;
  return s;
}

export function startGlare({ static: staticOnly = false } = {}) {
  const canvas = document.querySelector('.viewport-light');
  const model = new LightModel();
  window.LTLight = { model, nudge: (d) => model.nudge(d), wake: () => model.wake(), families: FAMILIES };
  if (!canvas || staticOnly) return model;
  let renderer = null;
  try { renderer = createRenderer(canvas); } catch { renderer = null; }
  if (!renderer) { document.documentElement.classList.add('no-webgl'); return model; }

  const rmq = matchMedia('(prefers-reduced-motion: reduce)');
  model.reduced = rmq.matches;
  rmq.addEventListener?.('change', () => (model.reduced = rmq.matches));

  // The page's opening scene, then whichever zone crosses the middle of the viewport.
  const first = document.querySelector('[data-light]');
  if (first) Object.assign(model.scene, sceneFrom(first), { wake: false });
  const io = new IntersectionObserver((entries) => {
    for (const e of entries) if (e.isIntersecting) model.setScene(sceneFrom(e.target));
  }, { rootMargin: '-50% 0px -50% 0px' });
  document.querySelectorAll('[data-light]').forEach((el) => io.observe(el));

  if (matchMedia('(pointer: fine)').matches) {
    addEventListener('pointermove', (e) => {
      if (e.pointerType === 'mouse') model.pointer = [(e.clientX / innerWidth) * 2 - 1, (e.clientY / innerHeight) * 2 - 1];
    }, { passive: true });
    document.documentElement.addEventListener('pointerleave', () => (model.pointer = null));
  }

  let lastW = 0, lastH = 0, corner = { radius: 38, n: 2 };
  const squircle = typeof CSS !== 'undefined' && CSS.supports && CSS.supports('corner-shape', 'squircle');
  const draw = () => {
    const w = canvas.clientWidth, h = canvas.clientHeight;
    if (!w || !h) return;
    let pr = Math.min(devicePixelRatio || 1, 1.5);
    const budget = 2.0e6;
    if (w * h * pr * pr > budget) pr = Math.max(0.75, Math.sqrt(budget / (w * h)));
    const unit = Math.min(w, h) < 600 ? 1 : Math.min(Math.max(Math.min(w, h) / 560, 1), 1.4);
    if (w !== lastW || h !== lastH) {
      const css = parseFloat(getComputedStyle(canvas).getPropertyValue('--glass-radius')) || 38;
      corner = { radius: css, n: squircle ? 4 : 2 };
      lastW = w; lastH = h;
    }
    renderer.render(model.step(), model.colors, { width: w, height: h, pr, unit, radius: corner.radius / unit, cornerN: corner.n });
  };
  const loop = frameLoop(draw, () => (model.busy ? 30 : 20));
  loop.start();
  document.addEventListener('visibilitychange', () => (document.hidden ? loop.stop() : loop.start()));
  return model;
}
