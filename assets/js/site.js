// LoveType site behaviour. Every block is guarded, so one module serves every page.
import { startGlare } from './glare.js';
import { track } from './analytics.js';

document.documentElement.classList.add('js');
const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];

// The light is decoration: start it once the page is idle, and only on a real GPU.
// Software renderers (SwiftShader, llvmpipe) would spend the CPU on it instead.
function hasGpu() {
  try {
    const gl = document.createElement('canvas').getContext('webgl');
    if (!gl) return false;
    const ext = gl.getExtension('WEBGL_debug_renderer_info');
    const r = ext ? gl.getParameter(ext.UNMASKED_RENDERER_WEBGL) : '';
    gl.getExtension('WEBGL_lose_context')?.loseContext();
    return !/swiftshader|llvmpipe|software|basic render/i.test(r);
  } catch { return false; }
}
const idle = (fn, t) => ('requestIdleCallback' in window ? requestIdleCallback(fn, { timeout: t }) : setTimeout(fn, 200));
addEventListener('load', () => idle(() => {
  if (!hasGpu()) { document.documentElement.classList.add('no-webgl'); startGlare({ static: true }); return; }
  startGlare();
  if ($('.heart')) import('./heart.js').then((m) => m.startHearts());
}, 1500), { once: true });

// Header: solid once the page moves; mobile menu.
const header = $('.site-header');
if (header) {
  const onScroll = () => header.classList.toggle('scrolled', scrollY > 24);
  addEventListener('scroll', onScroll, { passive: true });
  onScroll();
  $('.menu-btn')?.addEventListener('click', (e) => {
    const open = document.body.classList.toggle('menu-open');
    e.currentTarget.setAttribute('aria-expanded', String(open));
  });
  $$('.site-nav a').forEach((a) => a.addEventListener('click', () => document.body.classList.remove('menu-open')));
}

document.addEventListener('click', (e) => {
  const a = e.target.closest?.('[data-lang-switch]');
  if (a) track('language_switched', { from: document.documentElement.lang, to: a.dataset.langSwitch });
});

// Reveal on scroll.
const rvo = new IntersectionObserver((es) => es.forEach((e) => {
  if (e.isIntersecting) { e.target.classList.add('in'); rvo.unobserve(e.target); }
}), { rootMargin: '0px 0px -8% 0px' });
$$('.rv').forEach((el) => rvo.observe(el));

// CTA glint: once after load, then every 9 s while visible (as in the app).
$$('[data-glint]').forEach((pill) => {
  const run = () => { pill.classList.remove('glinting'); void pill.offsetWidth; pill.classList.add('glinting'); };
  if (reduced) return;
  setTimeout(run, 1200);
  let visible = true;
  new IntersectionObserver(([e]) => (visible = e.isIntersecting)).observe(pill);
  setInterval(() => visible && !document.hidden && run(), 9000);
});

// Home story: each test step lights a part of the heart and swaps the phone screen.
const steps = $$('[data-step]');
if (steps.length) {
  const shots = $$('.story-stage .screen img');
  const heroHeart = $('.hero-stage .heart');
  const dots = $$('.progress-dots li');
  const so = new IntersectionObserver((es) => es.forEach((e) => {
    if (!e.isIntersecting) return;
    const n = +e.target.dataset.step;
    shots.forEach((img) => img.classList.toggle('off', +img.dataset.shot !== n));
    dots.forEach((d, i) => d.classList.toggle('on', i < n));
    if (heroHeart) heroHeart.dataset.reveal = String([0.08, 0.38, 0.68, 1][n] ?? 0.08);
  }), { rootMargin: '-45% 0px -45% 0px' });
  steps.forEach((s) => so.observe(s));
}

// The reveal section lights its heart fully when it arrives.
$$('[data-heart-on]').forEach((sec) => {
  const h = $('.heart', sec);
  if (!h) return;
  new IntersectionObserver(([e]) => {
    h.dataset.reveal = e.isIntersecting ? '1' : '0.2';
    if (e.isIntersecting) window.LTLight?.wake();
  }, { threshold: 0.35 }).observe(sec);
});

// Languages: the same question, in each language the app speaks.
const langLine = $('.lang-line');
if (langLine && !reduced) {
  const spans = $$('span', langLine);
  let i = 0;
  setInterval(() => {
    if (document.hidden) return;
    spans[i].classList.add('off');
    i = (i + 1) % spans.length;
    spans[i].classList.remove('off');
  }, 2600);
}

// Copy buttons (sample lines).
$$('[data-copy]').forEach((b) => b.addEventListener('click', async () => {
  try { await navigator.clipboard.writeText(b.dataset.copy); } catch {}
  track('starter_line_copied', { path: location.pathname });
  const t = b.querySelector('span');
  const old = t.textContent;
  t.textContent = b.dataset.copied || 'Copied';
  window.LTLight?.nudge();
  setTimeout(() => (t.textContent = old), 1600);
}));

// Share code: settles from scrambled characters, like a code being typed in.
$$('[data-scramble]').forEach((el) => {
  const final = el.textContent;
  const A = '0123456789ABCDEFGHJKMNPQRSTVWXYZ';
  if (reduced) return;
  new IntersectionObserver(([e], o) => {
    if (!e.isIntersecting) return;
    o.disconnect();
    let f = 0;
    const id = setInterval(() => {
      f++;
      el.textContent = final.split('').map((c, i) => (f > 8 + i * 5 ? c : A[(Math.random() * A.length) | 0])).join('');
      if (f > 8 + final.length * 5) { clearInterval(id); el.textContent = final; window.LTLight?.nudge(); }
    }, 45);
  }, { threshold: 0.6 }).observe(el);
});

// Pair picker (home + compatibility hub).
const picker = $('[data-picker]');
if (picker) {
  const data = JSON.parse($('#pair-data').textContent);
  let dim = 'attachment';
  let you = null, them = null;
  const out = $('.picker-out', picker);
  const rowYou = $('[data-row="you"]', picker);
  const rowThem = $('[data-row="them"]', picker);
  const drawRow = (row, which) => {
    row.innerHTML = '';
    for (const [k, label] of data.dims[dim].types) {
      const b = document.createElement('button');
      b.type = 'button';
      b.textContent = label;
      b.setAttribute('aria-pressed', String((which === 'you' ? you : them) === k));
      b.addEventListener('click', () => {
        if (which === 'you') you = k; else them = k;
        draw();
        if (you && them) { window.LTLight?.nudge(); track('pair_picked', { dimension: dim, pair: [you, them].sort().join('+') }); }
      });
      row.appendChild(b);
    }
  };
  const draw = () => {
    picker.dataset.family = data.dims[dim].family;
    drawRow(rowYou, 'you');
    drawRow(rowThem, 'them');
    if (you && them) {
      const key = [you, them].sort().join('+');
      const p = data.pairs[dim][key];
      out.innerHTML = p
        ? `<p class="label">${p.eyebrow}</p><h3 class="statement-s">${p.title}</h3><p class="body">${p.lede}</p><p><a class="text-link" href="${p.url}">Read the full pairing <span class="arr" aria-hidden="true">→</span></a></p>`
        : '';
    } else {
      out.innerHTML = `<p class="label">${data.dims[dim].hint}</p><p class="body">${data.dims[dim].empty}</p>`;
    }
  };
  $$('.tabs button', picker).forEach((b) => b.addEventListener('click', () => {
    dim = b.dataset.dim;
    you = them = null;
    $$('.tabs button', picker).forEach((x) => x.setAttribute('aria-selected', String(x === b)));
    window.LTLight?.model.setScene({ family: data.dims[dim].family });
    draw();
  }));
  draw();
}

// Compare: decode a partner's 4-character code (same format as the app; nothing is sent anywhere).
const ALPHABET = '0123456789ABCDEFGHJKMNPQRSTVWXYZ';
const KEYS = {
  attachment: ['Secure', 'Anxious', 'Avoidant', 'FearfulAvoidant'],
  love: ['Words', 'Time', 'Touch', 'Acts', 'Symbols', 'Experiences'],
  conflict: ['Pursuer', 'Withdrawer', 'Fixer', 'Peacekeeper', 'Defender', 'Processor'],
};
export function decodeCode(raw) {
  const s = (raw || '').toUpperCase().replace(/[^0-9A-Z]/g, '').replace(/[ILO]/g, (c) => ({ I: '1', L: '1', O: '0' })[c]);
  if (s.length !== 4) return null;
  const [v, hi, lo, ck] = [...s].map((c) => ALPHABET.indexOf(c));
  if (v !== 1 || hi < 0 || lo < 0 || ck < 0 || (hi * 7 + lo * 13 + 17) % 32 !== ck) return null;
  const payload = hi * 32 + lo;
  if (payload > 143) return null;
  return { attachment: KEYS.attachment[Math.floor(payload / 36)], love: KEYS.love[Math.floor((payload % 36) / 6)], conflict: KEYS.conflict[payload % 6] };
}
const tool = $('[data-compare]');
if (tool) {
  const data = JSON.parse($('#compare-data').textContent);
  const theirs = $('#their-code', tool);
  const mine = $('#my-code', tool);
  const msg = $('.code-msg', tool);
  const card = $('.result-card', tool);
  const archetype = (p) => {
    const scores = Object.fromEntries(data.order.map((k) => [k, 0]));
    for (const [dim, key] of [['attachment', p.attachment], ['love', p.love], ['conflict', p.conflict]]) {
      for (const [k, pts] of Object.entries(data.points[dim][key] || {})) scores[k] += pts;
    }
    return Object.entries(scores).sort((a, b) => b[1] - a[1])[0][0];
  };
  let fromUrl = null;
  const render = () => {
    const t = decodeCode(theirs.value);
    const m = mine && mine.value.trim() ? decodeCode(mine.value) : null;
    const len = theirs.value.replace(/[^0-9a-z]/gi, '').length;
    if (!t) {
      card.classList.remove('on');
      msg.textContent = len >= 4 ? data.ui.bad : '';
      return;
    }
    msg.textContent = '';
    const a = archetype(t);
    const A = data.archetypes[a];
    let html = `<p class="label">${data.ui.theirType}</p><h2 class="statement-s" style="margin-top:10px">${A.label}</h2><p class="body" style="margin-top:8px">${A.tagline}</p>
      <div class="dims">${['attachment', 'love', 'conflict'].map((d) => {
        const ty = data.types[d][t[d]];
        return `<a href="${ty.url}"${data.en ? '' : ' hreflang="en"'} data-family="${ty.family}"><span class="label">${ty.dim}</span><span class="serif">${ty.label}</span><span class="small">${ty.short}</span></a>`;
      }).join('')}</div>`;
    if (m) {
      html += `<p class="label" style="margin-top:30px;display:block">${data.ui.together}</p><div class="dims">${['attachment', 'love', 'conflict'].map((d) => {
        const key = [m[d], t[d]].sort().join('+');
        const p = data.pairs[d][key];
        return p ? `<a href="${p.url}"><span class="label">${data.dimNames[d]}</span><span class="serif">${p.title}</span><span class="small">${data.ui.readPair}</span></a>` : '';
      }).join('')}</div>`;
    } else if (mine && mine.value.trim().length >= 4) {
      html += `<p class="code-msg">${data.ui.badMine}</p>`;
    }
    html += `<p class="small" style="margin-top:22px">${data.ui.full}</p>`;
    card.innerHTML = html;
    card.classList.add('on');
    window.LTLight?.nudge();
    if (!tool.dataset.tracked) { tool.dataset.tracked = '1'; track('compare_code_decoded', { source: fromUrl ? 'link' : 'typed', with_own_code: !!m }); }
  };
  theirs.addEventListener('input', render);
  mine?.addEventListener('input', render);
  fromUrl = new URLSearchParams(location.search).get('code') || (location.pathname.match(/^\/compare\/([0-9a-z-]{4,6})\/?$/i) || [])[1];
  if (fromUrl) { theirs.value = fromUrl.toUpperCase(); render(); }
}
