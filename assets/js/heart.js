// The LoveType heart: a small dark sculptural object revealed by the light, as on the app's
// Home screen. Raymarched in one fragment shader (no library). The heart never changes; only
// its lighting does. It reads the page light (window.LTLight) for direction and colour, so
// its highlights move with the edge light and change family with it.
//
//   <div class="heart" data-reveal="0.06"><canvas></canvas><svg>…fallback…</svg></div>
// Set el.dataset.reveal (0…1) at any time; the heart eases to it over ~1.8 s.

const VS = 'attribute vec2 p; void main(){ gl_Position = vec4(p, 0.0, 1.0); }';
const FS = `
precision highp float;
uniform vec2 res; uniform float time, reveal, yaw, pitch;
uniform vec3 keyDir, keyCol, rimCol, bloomCol, coreCol;
mat3 rot(float y, float x){
  float cy = cos(y), sy = sin(y), cx = cos(x), sx = sin(x);
  return mat3(cy, 0.0, -sy, 0.0, 1.0, 0.0, sy, 0.0, cy) * mat3(1.0, 0.0, 0.0, 0.0, cx, sx, 0.0, -sx, cx);
}
float dot2(vec2 v){ return dot(v, v); }
// The app's heart outline (two circles and two lines), exact 2D distance (Inigo Quilez).
float sdHeart(vec2 p){
  p.x = abs(p.x);
  if (p.y + p.x > 1.0) return sqrt(dot2(p - vec2(0.25, 0.75))) - sqrt(2.0) / 4.0;
  return sqrt(min(dot2(p - vec2(0.0, 1.0)), dot2(p - 0.5 * max(p.x + p.y, 0.0)))) * sign(p.x - p.y);
}
// Extruded with a rounded rim and a soft dome: the brand silhouette as a sculpted object.
float map(vec3 p){
  const float K = 1.28;
  float d2 = sdHeart(p.xy / K + vec2(0.0, 0.56)) * K;
  float dome = 0.1 * (1.0 - smoothstep(0.0, 0.85, length((p.xy - vec2(0.0, 0.06)) * vec2(0.9, 1.0))));
  float h = 0.15 + dome;
  const float r = 0.11;
  vec2 w = vec2(d2 + r, abs(p.z) - (h - r));
  return min(max(w.x, w.y), 0.0) + length(max(w, 0.0)) - r;
}
vec3 normalAt(vec3 p){
  const vec2 k = vec2(1.0, -1.0); const float e = 0.0015;
  return normalize(k.xyy * map(p + k.xyy * e) + k.yyx * map(p + k.yyx * e) + k.yxy * map(p + k.yxy * e) + k.xxx * map(p + k.xxx * e));
}
void main(){
  vec2 uv = (gl_FragCoord.xy - 0.5 * res) / res.y;
  vec3 ro = vec3(0.0, 0.0, 4.9);
  vec3 rd = normalize(vec3(uv, -2.15));
  mat3 R = rot(yaw, pitch);
  vec3 o = R * ro; vec3 d = R * rd;
  // Soft bloom behind the object, in the light's colour.
  float r = length(uv - vec2(0.0, -0.02));
  vec3 glow = mix(bloomCol, keyCol, 0.3) * exp(-r * r * 3.6) * (0.5 + 0.8 * reveal) + keyCol * exp(-r * r * 12.0) * (0.06 + 0.22 * reveal);
  float glowA = clamp(max(max(glow.r, glow.g), glow.b) * 1.4, 0.0, 1.0);
  float t = 1.9; float hit = -1.0;
  // Bounding sphere around the heart.
  float b = dot(o, d); float c = dot(o, o) - 0.9; float disc = b * b - c;
  if (disc > 0.0) {
    t = max(-b - sqrt(disc), 0.0);
    for (int i = 0; i < 96; i++) {
      vec3 p = o + d * t;
      float m = map(p);
      if (m < 0.0005) { hit = t; break; }
      t += m * 0.9;
      if (t > 7.5) break;
    }
  }
  if (hit < 0.0) { gl_FragColor = vec4(glow, glowA); return; }
  vec3 p = o + d * hit;
  vec3 n = normalAt(p);
  vec3 v = -d;
  vec3 L = normalize(R * keyDir);
  vec3 Lr = normalize(R * vec3(-keyDir.x, -keyDir.y * 0.4, -0.35));
  float ndv = clamp(dot(n, v), 0.0, 1.0);
  float fres = 0.04 + 0.96 * pow(1.0 - ndv, 5.0);
  // Near-black body; its lit side lifts slightly with reveal.
  vec3 body = vec3(0.008, 0.005, 0.008) + vec3(0.03, 0.018, 0.028) * reveal * clamp(dot(n, L), 0.0, 1.0);
  vec3 hK = normalize(L + v); vec3 hR = normalize(Lr + v);
  float specK = pow(clamp(dot(n, hK), 0.0, 1.0), 90.0) * 2.4 + pow(clamp(dot(n, hK), 0.0, 1.0), 14.0) * 0.07;
  float specR = pow(clamp(dot(n, hR), 0.0, 1.0), 40.0) * 0.9;
  // Environment: the glass around it, glowing at the edges.
  vec3 refl = reflect(-v, n);
  float envAmt = smoothstep(-0.2, 1.0, dot(refl, L));
  vec3 env = mix(bloomCol * 0.35, keyCol, envAmt) * (0.35 + 0.65 * smoothstep(-0.6, 1.0, refl.y));
  vec3 col = body;
  col += (keyCol * 0.7 + coreCol * 0.3) * specK * (0.08 + 0.92 * reveal);
  col += rimCol * specR * reveal;
  col += env * fres * (0.25 + 1.3 * reveal);
  // Rim light along the silhouette, in the lit colours.
  float rim = pow(1.0 - ndv, 3.0);
  col += mix(rimCol, keyCol, smoothstep(-0.3, 0.6, dot(n, L))) * rim * (0.06 + 0.95 * reveal);
  col = 1.0 - exp(-col * 1.35);
  gl_FragColor = vec4(col, 1.0);
}`;

const rgb = (h) => [1, 3, 5].map((i) => parseInt(h.slice(i, i + 2), 16) / 255);

class Heart {
  constructor(root) {
    this.root = root;
    this.canvas = root.querySelector('canvas');
    this.reveal = parseFloat(root.dataset.reveal || '0.1');
    this.visible = false;
    this.pointer = [0, 0];
    this.pointerS = [0, 0];
    const gl = this.canvas.getContext('webgl', { premultipliedAlpha: false, alpha: true, antialias: false, powerPreference: 'low-power' });
    if (!gl) throw new Error('no webgl');
    this.gl = gl;
    const sh = (type, src) => {
      const s = gl.createShader(type);
      gl.shaderSource(s, src);
      gl.compileShader(s);
      if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) throw new Error(gl.getShaderInfoLog(s));
      return s;
    };
    const prog = gl.createProgram();
    gl.attachShader(prog, sh(gl.VERTEX_SHADER, VS));
    gl.attachShader(prog, sh(gl.FRAGMENT_SHADER, FS));
    gl.linkProgram(prog);
    gl.useProgram(prog);
    gl.bindBuffer(gl.ARRAY_BUFFER, gl.createBuffer());
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]), gl.STATIC_DRAW);
    const loc = gl.getAttribLocation(prog, 'p');
    gl.enableVertexAttribArray(loc);
    gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);
    gl.enable(gl.BLEND);
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
    this.u = {};
    for (const n of ['res', 'time', 'reveal', 'yaw', 'pitch', 'keyDir', 'keyCol', 'rimCol', 'bloomCol', 'coreCol']) this.u[n] = gl.getUniformLocation(prog, n);
    gl.uniform3fv(this.u.coreCol, rgb('#FBEEF4'));
    root.classList.add('is-live');
  }

  draw(t, dt, reduced) {
    const { gl, u, canvas } = this;
    const w = canvas.clientWidth, h = canvas.clientHeight;
    if (!w || !h) return;
    const pr = Math.min(devicePixelRatio || 1, 1.5);
    const pw = Math.round(w * pr), ph = Math.round(h * pr);
    if (canvas.width !== pw || canvas.height !== ph) { canvas.width = pw; canvas.height = ph; }
    gl.viewport(0, 0, pw, ph);
    gl.clearColor(0, 0, 0, 0);
    gl.clear(gl.COLOR_BUFFER_BIT);
    const target = parseFloat(this.root.dataset.reveal || '0');
    this.reveal += (target - this.reveal) * (reduced ? 1 : 1 - Math.exp(-dt / 0.6));
    this.pointerS[0] += (this.pointer[0] - this.pointerS[0]) * (1 - Math.exp(-dt / 0.5));
    this.pointerS[1] += (this.pointer[1] - this.pointerS[1]) * (1 - Math.exp(-dt / 0.5));
    const light = window.LTLight?.model;
    const L = light ? light.f.light : [-0.48, -0.7];
    const colors = light?.colors;
    const key = colors ? colors.stops[1] : rgb('#DDA0B8');
    const rim = colors ? colors.stops[3] : rgb('#7080C0');
    const bloom = colors ? colors.bloom : rgb('#6B3A60');
    // Screen-space light (y down) → view space (y up), leaning toward the viewer.
    const kd = [L[0], -L[1], 0.75];
    const kl = Math.hypot(...kd);
    const idle = reduced ? 0 : Math.sin(t * 0.35) * 0.16;
    gl.uniform2f(u.res, pw, ph);
    gl.uniform1f(u.time, t);
    gl.uniform1f(u.reveal, this.reveal);
    gl.uniform1f(u.yaw, idle + this.pointerS[0] * 0.5);
    gl.uniform1f(u.pitch, (reduced ? 0 : Math.sin(t * 0.23) * 0.05) + this.pointerS[1] * 0.22);
    gl.uniform3f(u.keyDir, kd[0] / kl, kd[1] / kl, kd[2] / kl);
    gl.uniform3fv(u.keyCol, key);
    gl.uniform3fv(u.rimCol, rim);
    gl.uniform3fv(u.bloomCol, bloom);
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
  }
}

export function startHearts() {
  const roots = [...document.querySelectorAll('.heart')];
  if (!roots.length) return;
  const hearts = [];
  for (const r of roots) {
    try { hearts.push(new Heart(r)); } catch { /* SVG fallback stays */ }
  }
  if (!hearts.length) return;
  const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const io = new IntersectionObserver((es) => es.forEach((e) => {
    const h = hearts.find((x) => x.root === e.target);
    if (h) h.visible = e.isIntersecting;
  }), { rootMargin: '80px' });
  hearts.forEach((h) => io.observe(h.root));
  if (matchMedia('(pointer: fine)').matches && !reduced) {
    addEventListener('pointermove', (e) => {
      for (const h of hearts) {
        const b = h.root.getBoundingClientRect();
        h.pointer = [
          Math.max(-1, Math.min(1, (e.clientX - (b.left + b.width / 2)) / (innerWidth / 2))),
          Math.max(-1, Math.min(1, (e.clientY - (b.top + b.height / 2)) / (innerHeight / 2))),
        ];
      }
    }, { passive: true });
  }
  let last = performance.now(), acc = 0;
  const t0 = last;
  const tick = (ts) => {
    requestAnimationFrame(tick);
    const dt = (ts - last) / 1000;
    if (dt < 1 / 30 - 0.002) return;
    last = ts;
    acc = Math.min(dt, 0.1);
    for (const h of hearts) if (h.visible) h.draw((ts - t0) / 1000, acc, reduced);
  };
  requestAnimationFrame(tick);
}
