import { page, write, esc, attr, appPill, phone, heart, faqJson, ARROW, APP_STORE, SITE, url, LANGS } from '../lib.mjs';
import { TYPES, ARCH, DIMENSIONS, ARCHETYPES, PAIRS, appData } from '../model.mjs';

const LANG_LINES = [
  ['en', 'How do you love?', 'English'],
  ['es', '¿Cómo amas?', 'Español'],
  ['pt-BR', 'Como você ama?', 'Português'],
  ['ja', 'あなたは、どう愛する？', '日本語'],
  ['zh-Hant', '你是怎麼愛的？', '繁體中文'],
  ['id', 'Bagaimana kamu mencintai?', 'Bahasa Indonesia'],
];
const fill = (s, v) => s.replace(/\{(\w+)\}/g, (_, k) => v[k]);
const STEP_DIMS = ['attachment', 'love', 'conflict'];

function pairData() {
  const dims = {};
  for (const dim of ['attachment', 'love', 'conflict']) {
    const D = DIMENSIONS[dim];
    dims[dim] = {
      family: D.family,
      types: D.order.map((k) => [k, D.short[k]]),
      hint: 'Pick both styles',
      empty: dim === 'attachment' ? 'Choose your attachment style, then theirs.' : dim === 'love' ? 'Choose your love style, then theirs.' : 'Choose your conflict style, then theirs.',
    };
  }
  const pairs = { attachment: {}, love: {}, conflict: {} };
  for (const p of PAIRS) pairs[p.dim][p.key] = { title: esc(p.title), lede: esc(p.lede), url: p.path, eyebrow: esc(p.D.eyebrow) };
  return JSON.stringify({ dims, pairs }).replace(/</g, '\\u003c');
}

export function pickerBlock() {
  return `<div class="picker rv" data-picker data-family="attachment">
      <div class="tabs" role="tablist" aria-label="Dimension">
        <button type="button" role="tab" data-dim="attachment" aria-selected="true">Attachment</button>
        <button type="button" role="tab" data-dim="love" aria-selected="false">Love style</button>
        <button type="button" role="tab" data-dim="conflict" aria-selected="false">Conflict</button>
      </div>
      <div class="picker-rows">
        <div class="picker-row"><span class="label">You</span><div class="opt-row" data-row="you"></div></div>
        <div class="picker-row"><span class="label">Them</span><div class="opt-row" data-row="them"></div></div>
      </div>
      <div class="picker-out" aria-live="polite"></div>
      <script type="application/json" id="pair-data">${pairData()}</script>
    </div>`;
}

export function buildHome(S) {
  const H = S.home;
  const en = S.lang === 'en';
  const dir = en ? '' : S.lang.toLowerCase();
  const A = appData(S.lang);
  const shots = en
    ? { q: 'question-attachment', 1: 'result-attachment', 2: 'result-love', 3: 'result-conflict' }
    : { q: 'question-attachment', 1: 'result-attachment', 2: 'home', 3: 'question-conflict' };
  const ph = (shot, alt, o = {}) => phone(shot, alt, { ...o, dir });
  const chips = (dim) => DIMENSIONS[dim].order.map((k) => `<a class="chip" href="${TYPES[dim][k].path}"${en ? '' : ' hreflang="en"'}><i></i>${esc(dim === 'conflict' && !en ? A.conflict[k].label : S.short[dim][k])}</a>`).join('');
  const steps = H.steps.map((st, i) => {
    const dim = STEP_DIMS[i];
    const D = DIMENSIONS[dim];
    const n = i + 1;
    return `<article class="step stack" data-step="${n}" data-light="${D.family}" data-family="${D.family}" data-coverage="${(0.16 + n * 0.27).toFixed(2)}" data-intensity="${(0.66 + n * 0.1).toFixed(2)}">
          <p class="label">${fill(H.testOf, { n })}<span class="sep">·</span>${fill(H.questions, { n: D.questions })}<span class="sep">·</span>${fill(H.minutes, { n: D.minutes })}</p>
          <h3 class="statement">${esc(st.title)}<span class="dim">${esc(st.sub)}</span></h3>
          <p class="lead">${esc(st.body)}</p>
          <div class="chips">${chips(dim)}</div>
          <p><a class="text-link" href="/${D.path}/"${en ? '' : ' hreflang="en"'}>${esc(st.all)}${S.chrome.enOnly} ${ARROW}</a></p>
          ${ph(shots[n], H.resultAlt, { cls: 'phone-inline' })}
        </article>`;
  }).join('\n');
  const cloud = ARCHETYPES.order.map((k, i) => `<a class="rv" style="--d:${(i * 0.05).toFixed(2)}s" href="${ARCH[k].path}"${en ? '' : ' hreflang="en"'}><span class="serif">${esc(A.combined[k].label)}</span><span class="small">${esc(A.combined[k].tagline)}</span></a>`).join('');
  const pb = A.playbook.SteadyBuilder;
  const twin = (c) => `<svg viewBox="2 3 20 18.4"><path fill="${c}" d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/></svg>`;
  const P = (p) => (en ? p : `${S.prefix}${p.replace(/^\//, '')}`);
  const pill = (where) => appPill(S.chrome.getFree, where);

  const pickSection = en ? `
<section class="section" id="compatibility" data-light="profile" data-coverage="0.35" data-intensity="0.75" aria-labelledby="pick-h">
  <div class="wrap read" style="max-width:calc(900px + 2 * var(--gutter))">
    <header class="stack" style="--gap:18px">
      <p class="label rv">${esc(H.pick.label)}</p>
      <h2 class="statement rv" id="pick-h">${esc(H.pick.h[0])}<span class="dim">${esc(H.pick.h[1])}</span></h2>
      <p class="lead rv">${esc(H.pick.lead)}</p>
    </header>
    ${pickerBlock()}
    <p class="rv" style="margin-top:22px"><a class="text-link" href="/compatibility/">${esc(H.pick.all)} ${ARROW}</a></p>
  </div>
</section>` : `
<section class="section-tight" id="compatibility" data-light="profile" data-coverage="0.35" data-intensity="0.75" aria-labelledby="pick-h">
  <div class="wrap read" style="max-width:calc(900px + 2 * var(--gutter))">
    <p class="label rv">${esc(H.pick.label)}</p>
    <h2 class="statement rv" id="pick-h" style="margin-top:14px">${esc(H.pick.h[0])}<span class="dim">${esc(H.pick.h[1])}</span></h2>
    <p class="lead rv" style="margin-top:18px">${esc(H.pick.lead)}</p>
    <p class="rv" style="margin-top:22px"><a class="text-link" href="/compatibility/" hreflang="en">${esc(H.pick.all)}${S.chrome.enOnly} ${ARROW}</a></p>
  </div>
</section>`;

  const main = `
<section class="hero" data-light="profile" data-coverage="0.26" data-intensity="0.82" data-width="1">
  <div class="wrap hero-grid">
    <div class="hero-copy stack">
      <p class="label rv">${esc(H.label)}</p>
      <h1 class="display rv rv-blur" style="--d:.08s">${esc(H.h1[0])}<span class="dim">${esc(H.h1[1])}</span></h1>
      <p class="lead rv" style="--d:.16s">${esc(H.lead)}</p>
      <div class="cta-row rv" style="--d:.24s">${pill('hero')}<a class="text-link" href="#tests">${esc(H.how)} ${ARROW}</a></div>
      <p class="meta-line rv" style="--d:.3s">${H.meta.map((m) => `<span>${esc(m)}</span>`).join('')}</p>
    </div>
    <div class="hero-stage">
      ${heart(0.08)}
      <ol class="progress-dots" aria-label="${attr(H.dotsLabel)}">
        <li style="--c:var(--rose-l)">${esc(H.dots[0])}</li><li style="--c:var(--violet-l)">${esc(H.dots[1])}</li><li style="--c:var(--blue-l)">${esc(H.dots[2])}</li>
      </ol>
    </div>
  </div>
</section>

<section class="story" id="tests" aria-labelledby="tests-h">
  <div class="wrap story-grid">
    <div class="story-steps">
      <header class="step stack" data-step="0" data-light="profile" data-coverage="0.2" data-intensity="0.7">
        <p class="label">${esc(H.story.label)}</p>
        <h2 class="statement" id="tests-h">${esc(H.story.h[0])}<span class="dim">${esc(H.story.h[1])}</span></h2>
        <p class="lead">${esc(H.story.lead)}</p>
        ${ph(shots.q, H.story.questionAlt, { cls: 'phone-inline' })}
      </header>
      ${steps}
    </div>
    <div class="story-stage" aria-hidden="true">
      <div class="phone" style="--glow:rgb(192 112 144 / .55)"><div class="screen">
        ${['q', 1, 2, 3].map((k, i) => `<img data-shot="${i}"${i ? ' class="off"' : ''} src="/assets/screens/${dir ? dir + '/' : ''}${shots[k]}-720.webp" width="720" height="1565" alt="" loading="lazy">`).join('\n        ')}
      </div></div>
    </div>
  </div>
</section>

<section class="section reveal-sec" id="lovetype" data-light="full" data-coverage="1" data-intensity="0.95" data-width="1.05" data-wake data-heart-on aria-labelledby="lt-h">
  <div class="wrap">
    ${heart(0.2)}
    <p class="label rv">${esc(H.reveal.label)}</p>
    <h2 class="statement rv" id="lt-h" style="margin-top:14px">${esc(H.reveal.h[0])}<span class="dim">${esc(H.reveal.h[1])}</span></h2>
    <p class="lead rv" style="margin:22px auto 0">${esc(H.reveal.lead)}</p>
    <div class="types-cloud">${cloud}</div>
    <p class="rv" style="margin-top:34px"><a class="text-link" href="/lovetypes/"${en ? '' : ' hreflang="en"'}>${esc(H.reveal.all)}${S.chrome.enOnly} ${ARROW}</a></p>
  </div>
</section>

<section class="section" id="new" aria-labelledby="new-h">
  <div class="wrap">
    <header class="center stack" style="--gap:16px;margin-bottom:clamp(70px,9vw,130px)">
      <p class="label rv">${esc(H.news.label)}</p>
      <h2 class="statement rv" id="new-h">${esc(H.news.h[0])}<span class="dim">${esc(H.news.h[1])}</span></h2>
    </header>

    <div class="feature" data-light="conflict" data-family="conflict" data-coverage="0.55" data-intensity="0.85">
      <div class="feature-copy stack">
        <p class="label rv">${esc(H.compare.label[0])}<span class="sep">·</span>${esc(H.compare.label[1])}</p>
        <h3 class="statement rv">${esc(H.compare.h[0])}<span class="dim">${esc(H.compare.h[1])}</span></h3>
        <p class="lead rv">${esc(H.compare.lead)}</p>
        <ul class="bullets rv">${H.compare.bullets.map((b) => `<li>${esc(b)}</li>`).join('')}</ul>
        <p class="rv"><a class="text-link" href="${P('/compare/')}">${esc(H.compare.link)} ${ARROW}</a></p>
      </div>
      <div class="feature-media rv">
        ${ph('compare-result', H.compare.alt, { glow: 'rgb(112 128 192 / .6)' })}
        <div class="float float-code" aria-hidden="true"><span class="label">${esc(H.compare.codeLabel)}</span><div class="code" data-scramble>10E7</div><div class="twin-hearts">${twin('#DDA0B8')}${twin('#98A4DC')}</div></div>
      </div>
    </div>

    <div class="feature flip" data-light="loveStyle" data-family="loveStyle" data-coverage="0.55" data-intensity="0.85">
      <div class="feature-copy stack">
        <p class="label rv">${esc(H.playbook.label)}</p>
        <h3 class="statement rv">${esc(H.playbook.h[0])}<span class="dim">${esc(H.playbook.h[1])}</span></h3>
        <p class="lead rv">${esc(H.playbook.lead)}</p>
        <figure class="starter rv"><span class="label">${esc(fill(H.playbook.starter, { name: A.combined.SteadyBuilder.label }))}</span><blockquote>“${esc(pb.example)}”</blockquote><button class="copy-btn" type="button" data-copy="${attr(pb.example)}" data-copied="${attr(H.playbook.copied)}">⧉ <span>${esc(H.playbook.copy)}</span></button></figure>
        <p class="rv"><a class="text-link" href="/dating-profile-playbook/"${en ? '' : ' hreflang="en"'}>${esc(H.playbook.link)}${S.chrome.enOnly} ${ARROW}</a></p>
      </div>
      <div class="feature-media rv">
        ${ph('playbook', H.playbook.alt, { glow: 'rgb(160 128 192 / .6)' })}
      </div>
    </div>

    <div class="feature" data-light="attachment" data-family="attachment" data-coverage="0.55" data-intensity="0.85">
      <div class="feature-copy stack">
        <p class="label rv">${esc(H.manual.label)}</p>
        <h3 class="statement rv">${esc(H.manual.h[0])}<span class="dim">${esc(H.manual.h[1])}</span></h3>
        <p class="lead rv">${esc(H.manual.lead)}</p>
        <ul class="bullets rv">${H.manual.bullets.map((b) => `<li>${esc(b)}</li>`).join('')}</ul>
      </div>
      <div class="feature-media rv">
        ${ph('love-manual', H.manual.alt, { glow: 'rgb(192 112 144 / .6)' })}
      </div>
    </div>
  </div>
</section>
${pickSection}

<section class="section-tight center" data-light="loveStyle" data-coverage="0.4" data-intensity="0.8" aria-labelledby="lang-h">
  <div class="wrap">
    <p class="label rv" id="lang-h">${esc(H.langs)}</p>
    <p class="lang-line rv" aria-hidden="true">${[...LANG_LINES].sort((a) => (a[0] === S.lang ? -1 : 0)).map(([l, t], i) => `<span lang="${l}"${i ? ' class="off"' : ''}>${esc(t)}</span>`).join('')}</p>
    <ul class="lang-list rv">${LANG_LINES.map(([l, , n]) => `<li lang="${l}"><a href="${LANGS[l].prefix}">${n}</a></li>`).join('')}</ul>
  </div>
</section>

<section class="section" data-light="profile" data-coverage="0.3" data-intensity="0.72" aria-labelledby="promise-h">
  <div class="wrap">
    <h2 class="statement rv center" id="promise-h">${esc(H.promise.h[0])}<span class="dim">${esc(H.promise.h[1])}</span></h2>
    <div class="promise">${H.promise.items.map(([h, b], i) => `<div class="stack rv" style="--d:${i * 0.08}s"><h3>${esc(h)}</h3><p class="body">${esc(b)}${i === 0 ? ` <a class="text-link" style="min-height:0" href="${P('/privacy/')}">${esc(H.promise.privacy)}</a>` : ''}</p></div>`).join('')}</div>
  </div>
</section>

<section class="section-tight" aria-labelledby="faq-h">
  <div class="wrap read" style="max-width:calc(900px + 2 * var(--gutter))">
    <h2 class="statement rv" id="faq-h">${esc(H.faqH)}</h2>
    <div class="faq">${H.faqs.map((f) => `<details><summary>${esc(f.q)}</summary><div class="answer"><p>${esc(f.a)}</p></div></details>`).join('')}</div>
  </div>
</section>

<section class="closing" data-light="full" data-coverage="1" data-intensity="1" data-wake aria-labelledby="close-h">
  <div class="wrap">
    <h2 class="display rv rv-blur" id="close-h">${esc(H.close.h[0])}<span class="dim">${esc(H.close.h[1])}</span></h2>
    <div class="cta-row rv">${pill('closing')}</div>
    <div class="qr rv"><img src="/assets/qr-app-store.svg" width="84" height="84" alt="${attr(H.close.qrAlt)}"><p><strong>${esc(H.close.qrStrong)}</strong>${esc(H.close.qrText)}</p></div>
  </div>
</section>`;

  const home = en ? '/' : S.prefix;
  const jsonld = [
    { '@context': 'https://schema.org', '@type': 'Organization', '@id': `${SITE}/#org`, name: 'LoveType', url: `${SITE}/`, logo: url('/assets/icon-512.png'), email: 'privacy@love-type.app', sameAs: [APP_STORE] },
    { '@context': 'https://schema.org', '@type': 'WebSite', '@id': `${SITE}/#website`, name: 'LoveType', url: `${SITE}/`, inLanguage: ['en', 'es', 'pt-BR', 'ja', 'zh-Hant', 'id'], publisher: { '@id': `${SITE}/#org` } },
    {
      '@context': 'https://schema.org', '@type': 'MobileApplication', '@id': `${SITE}/#app`,
      name: 'LoveType: Relationship Test', alternateName: 'LoveType', operatingSystem: 'iOS', applicationCategory: 'LifestyleApplication',
      url: url(home), downloadUrl: APP_STORE, installUrl: APP_STORE, image: url('/assets/icon-512.png'),
      screenshot: ['result-attachment', 'compare-result', 'playbook', 'love-manual'].map((s) => url(`/assets/screens/${dir ? dir + '/' : ''}${s}-720.webp`)),
      description: H.appDescription, inLanguage: ['en', 'es', 'pt-BR', 'ja', 'zh-Hant', 'id'],
      offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD', category: 'free' }, publisher: { '@id': `${SITE}/#org` },
    },
    faqJson(H.faqs),
  ];
  write(home, page({
    S, path: home, alternateKey: 'home', title: H.title, description: H.description, og: en ? 'home' : `home-${S.lang.toLowerCase()}`, family: 'profile', jsonld, main,
    preload: [`<link rel="preload" href="/assets/screens/${dir ? dir + '/' : ''}question-attachment-720.webp" as="image" media="(min-width: 861px)">`],
  }));
}
