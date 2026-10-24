import { page, write, esc, attr, appPill, phone, heart, heartSvg, faqJson, ARROW, APP_STORE, SITE, url, UPDATED } from '../lib.mjs';
import { TYPES, ARCH, DIMENSIONS, ARCHETYPES, PAIRS, app } from '../model.mjs';

export const HOME_FAQS = [
  { q: 'What is LoveType?', a: 'LoveType is an iPhone app with three short relationship tests: Attachment Style, Love Style and Conflict Style. Together they take about eleven minutes and combine into one LoveType, a profile of how you bond, how you give and feel love, and what you do when things get tense.' },
  { q: 'Is LoveType free?', a: 'Yes. All three tests and your basic results are free, with no account. A single one-time purchase unlocks the full guide: every deep dive, your Love Manual, communication scripts and the complete dating-profile playbook. There is no subscription.' },
  { q: 'How does the partner comparison work?', a: 'Once you have finished all three tests, LoveType gives you a four-character code. Share it with a partner; when they enter it in their app, you both see where you click, where you tend to grind and one thing each of you can try. There is no compatibility score, and comparing is free.' },
  { q: 'What is the dating-profile playbook?', a: 'It turns your LoveType into guidance for writing a dating profile that sounds like you: the through-line to lead with, what to mention, starter lines and ideas for common prompts. Part of it is free; the rest comes with the full guide.' },
  { q: 'What is a Love Manual?', a: 'Four short lines, written from your three results, that tell someone how to love you: when you feel loved, when you feel unsafe, what happens to you under pressure and the best way to repair. It is made to be shared with someone you trust.' },
  { q: 'Is an attachment style test the same as a love language quiz?', a: 'No. Attachment style is about how you seek closeness and safety; love style (often called love language) is about how you give and recognise affection. LoveType measures both, plus your conflict style, because the three explain each other.' },
  { q: 'Do my answers leave my phone?', a: 'No. Your answers and results are stored on your iPhone. LoveType sends anonymous usage events to improve the app, including which result type you received, but never your answers, your name or your email.' },
  { q: 'Which languages is LoveType available in?', a: 'English, Spanish, Brazilian Portuguese, Japanese, Traditional Chinese and Indonesian. You can switch language in Settings.' },
  { q: 'Is LoveType therapy?', a: 'No. LoveType is a self-reflection tool, not a diagnosis or a substitute for professional help. If you are going through something difficult, please talk to a qualified professional.' },
];

const LANG_LINES = [
  ['en', 'How do you love?', 'English'],
  ['es', '¿Cómo amas?', 'Español'],
  ['pt-BR', 'Como você ama?', 'Português'],
  ['ja', 'あなたは、どう愛する？', '日本語'],
  ['zh-Hant', '你是怎麼愛的？', '繁體中文'],
  ['id', 'Bagaimana kamu mencintai?', 'Bahasa Indonesia'],
];

const STEPS = [
  { dim: 'attachment', n: 1, shot: 'result-attachment', alt: 'LoveType attachment result: The Steady Partner', title: 'Your attachment style.', dim2: 'Why you pull close.', body: 'How you seek closeness, trust and safety, and what you do when they feel uncertain. Secure, anxious, avoidant or fearful-avoidant, with how strongly you lean toward each.' },
  { dim: 'love', n: 2, shot: 'result-love', alt: 'LoveType love style result: The Physical Anchor', title: 'Your love style.', dim2: 'How you feel loved.', body: 'The way love registers for you fastest: words, quality time, touch, acts of service, thoughtful gifts or shared experiences. Your full mix, not just one label.' },
  { dim: 'conflict', n: 3, shot: 'result-conflict', alt: 'LoveType conflict style result: The Fixer', title: 'Your conflict style.', dim2: 'How you handle tension.', body: 'What you do when a disagreement gets hard: pursue, withdraw, fix, keep the peace, defend or process. Knowing it is the first step to repairing faster.' },
];

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

export function buildHome() {
  const chips = (dim) => DIMENSIONS[dim].order.map((k) => { const t = TYPES[dim][k]; return `<a class="chip" href="${t.path}"><i></i>${esc(t.short)}</a>`; }).join('');
  const steps = STEPS.map((s) => {
    const D = DIMENSIONS[s.dim];
    return `<article class="step stack" data-step="${s.n}" data-light="${D.family}" data-family="${D.family}" data-coverage="${(0.16 + s.n * 0.27).toFixed(2)}" data-intensity="${(0.66 + s.n * 0.1).toFixed(2)}">
          <p class="label">Test ${s.n} of 3<span class="sep">·</span>${D.questions} questions<span class="sep">·</span>${D.minutes} min</p>
          <h3 class="statement">${s.title}<span class="dim">${s.dim2}</span></h3>
          <p class="lead">${s.body}</p>
          <div class="chips">${chips(s.dim)}</div>
          <p><a class="text-link" href="/${D.path}/">All ${D.plural.toLowerCase()} ${ARROW}</a></p>
          ${phone(s.shot, s.alt, { cls: 'phone-inline' })}
        </article>`;
  }).join('\n');

  const cloud = ARCHETYPES.order.map((k, i) => {
    const a = ARCH[k];
    return `<a class="rv" style="--d:${(i * 0.05).toFixed(2)}s" href="${a.path}"><span class="serif">${esc(a.label)}</span><span class="small">${esc(a.tagline)}</span></a>`;
  }).join('');

  const pb = ARCH.SteadyBuilder.playbook;

  const main = `
<section class="hero" data-light="profile" data-coverage="0.26" data-intensity="0.82" data-width="1">
  <div class="wrap hero-grid">
    <div class="hero-copy stack">
      <p class="label rv">Relationship test for iPhone</p>
      <h1 class="display rv rv-blur" style="--d:.08s">How do you love?<span class="dim">Three tests. One&nbsp;LoveType.</span></h1>
      <p class="lead rv" style="--d:.16s">Find your attachment style, love style and conflict style in about eleven minutes, then see how the three fit together: how you bond, how you feel loved, and what you do when it gets hard.</p>
      <div class="cta-row rv" style="--d:.24s">${appPill('Get LoveType free', 'hero')}<a class="text-link" href="#tests">How it works ${ARROW}</a></div>
      <p class="meta-line rv" style="--d:.3s"><span>Free to start</span><span>No account</span><span>Answers stay on your iPhone</span></p>
    </div>
    <div class="hero-stage">
      ${heart(0.08)}
      <ol class="progress-dots" aria-label="Your progress through the three tests">
        <li style="--c:var(--rose-l)">Attachment</li><li style="--c:var(--violet-l)">Love</li><li style="--c:var(--blue-l)">Conflict</li>
      </ol>
    </div>
  </div>
</section>

<section class="story" id="tests" aria-labelledby="tests-h">
  <div class="wrap story-grid">
    <div class="story-steps">
      <header class="step stack" data-step="0" data-light="profile" data-coverage="0.2" data-intensity="0.7">
        <p class="label">How it works</p>
        <h2 class="statement" id="tests-h">Three short tests.<span class="dim">Each one lights the heart.</span></h2>
        <p class="lead">Answer with your first instinct; there are no right answers. As you finish each test, the heart lights a little more. After the third, your LoveType comes into focus.</p>
        ${phone('question-attachment', 'A LoveType question: I feel comfortable letting people in when I start to care about them.', { cls: 'phone-inline' })}
      </header>
      ${steps}
    </div>
    <div class="story-stage" aria-hidden="true">
      <div class="phone" style="--glow:rgb(192 112 144 / .55)"><div class="screen">
        <img data-shot="0" src="/assets/screens/question-attachment-720.webp" width="720" height="1565" alt="" loading="lazy">
        <img data-shot="1" class="off" src="/assets/screens/result-attachment-720.webp" width="720" height="1565" alt="" loading="lazy">
        <img data-shot="2" class="off" src="/assets/screens/result-love-720.webp" width="720" height="1565" alt="" loading="lazy">
        <img data-shot="3" class="off" src="/assets/screens/result-conflict-720.webp" width="720" height="1565" alt="" loading="lazy">
      </div></div>
    </div>
  </div>
</section>

<section class="section reveal-sec" id="lovetype" data-light="full" data-coverage="1" data-intensity="0.95" data-width="1.05" data-wake data-heart-on aria-labelledby="lt-h">
  <div class="wrap">
    ${heart(0.2)}
    <p class="label rv">Your result</p>
    <h2 class="statement rv" id="lt-h" style="margin-top:14px">Three tests.<span class="dim">One LoveType.</span></h2>
    <p class="lead rv" style="margin:22px auto 0">Your three results are weighed together into one of ten LoveTypes, so you see how the pieces interact, not just three separate labels.</p>
    <div class="types-cloud">${cloud}</div>
    <p class="rv" style="margin-top:34px"><a class="text-link" href="/lovetypes/">Meet all ten LoveTypes ${ARROW}</a></p>
  </div>
</section>

<section class="section" id="new" aria-labelledby="new-h">
  <div class="wrap">
    <header class="center stack" style="--gap:16px;margin-bottom:clamp(70px,9vw,130px)">
      <p class="label rv">New in LoveType 1.2</p>
      <h2 class="statement rv" id="new-h">Made for two.<span class="dim">And for what comes next.</span></h2>
    </header>

    <div class="feature" data-light="conflict" data-family="conflict" data-coverage="0.55" data-intensity="0.85">
      <div class="feature-copy stack">
        <p class="label rv">Free<span class="sep">·</span>No score</p>
        <h3 class="statement rv">Compare with a partner.<span class="dim">See where you click.</span></h3>
        <p class="lead rv">Share a four-character code. Your partner enters it in their app and you both see, dimension by dimension, where you click, where you tend to grind and one thing each of you can try.</p>
        <ul class="bullets rv"><li>No compatibility percentage, ever</li><li>No account and nothing uploaded: the code holds only your three result types</li><li>Works across all six languages</li></ul>
        <p class="rv"><a class="text-link" href="/compare/">Got a code? Look it up ${ARROW}</a></p>
      </div>
      <div class="feature-media rv">
        ${phone('compare-result', 'LoveType partner comparison: You × The Loyal Reassurer, where you click and where you grind', { glow: 'rgb(112 128 192 / .6)' })}
        <div class="float float-code" aria-hidden="true"><span class="label">Your code</span><div class="code" data-scramble>10E7</div><div class="twin-hearts"><svg viewBox="2 3 20 18.4"><path fill="#DDA0B8" d="${'M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z'}"/></svg><svg viewBox="2 3 20 18.4"><path fill="#98A4DC" d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/></svg></div></div>
      </div>
    </div>

    <div class="feature flip" data-light="loveStyle" data-family="loveStyle" data-coverage="0.55" data-intensity="0.85">
      <div class="feature-copy stack">
        <p class="label rv">For dating</p>
        <h3 class="statement rv">Dating-profile playbook.<span class="dim">Know what to say.</span></h3>
        <p class="lead rv">Your LoveType, turned into a profile that sounds like you: the through-line to lead with, what to mention, starter lines and ideas for the prompts everyone gets stuck on.</p>
        <figure class="starter rv"><span class="label">A starter line for The Quiet Builder</span><blockquote>“${esc(pb.example)}”</blockquote><button class="copy-btn" type="button" data-copy="${attr(pb.example)}">⧉ <span>Copy</span></button></figure>
        <p class="rv"><a class="text-link" href="/dating-profile-playbook/">See the playbook for each LoveType ${ARROW}</a></p>
      </div>
      <div class="feature-media rv">
        ${phone('playbook', 'LoveType dating-profile playbook for The Quiet Builder', { glow: 'rgb(160 128 192 / .6)' })}
      </div>
    </div>

    <div class="feature" data-light="attachment" data-family="attachment" data-coverage="0.55" data-intensity="0.85">
      <div class="feature-copy stack">
        <p class="label rv">The full guide</p>
        <h3 class="statement rv">Your Love Manual.<span class="dim">How to love you.</span></h3>
        <p class="lead rv">Four lines, written from your three results, that tell someone how to love you: when you feel loved, when you feel unsafe, what you do under pressure and how to repair. Ready to share.</p>
        <ul class="bullets rv"><li>Every deep dive across your three results</li><li>Communication scripts for hard moments</li><li>One purchase, yours forever. No subscription.</li></ul>
      </div>
      <div class="feature-media rv">
        ${phone('love-manual', 'LoveType Love Manual: I feel loved when…', { glow: 'rgb(192 112 144 / .6)' })}
      </div>
    </div>
  </div>
</section>

<section class="section" id="compatibility" data-light="profile" data-coverage="0.35" data-intensity="0.75" aria-labelledby="pick-h">
  <div class="wrap read" style="max-width:calc(900px + 2 * var(--gutter))">
    <header class="stack" style="--gap:18px">
      <p class="label rv">Compatibility</p>
      <h2 class="statement rv" id="pick-h">Where do you two click?<span class="dim">Pick your styles.</span></h2>
      <p class="lead rv">Fifty-two pairings, each with where it flows, where it rubs and what helps. Not a verdict: a pattern you can work with.</p>
    </header>
    ${pickerBlock()}
    <p class="rv" style="margin-top:22px"><a class="text-link" href="/compatibility/">All 52 pairings ${ARROW}</a></p>
  </div>
</section>

<section class="section-tight center" data-light="loveStyle" data-coverage="0.4" data-intensity="0.8" aria-labelledby="lang-h">
  <div class="wrap">
    <p class="label rv" id="lang-h">Now in six languages</p>
    <p class="lang-line rv" aria-hidden="true">${LANG_LINES.map(([l, t], i) => `<span lang="${l}"${i ? ' class="off"' : ''}>${esc(t)}</span>`).join('')}</p>
    <ul class="lang-list rv">${LANG_LINES.map(([l, , n]) => `<li lang="${l}">${n}</li>`).join('')}</ul>
  </div>
</section>

<section class="section" data-light="profile" data-coverage="0.3" data-intensity="0.72" aria-labelledby="promise-h">
  <div class="wrap">
    <h2 class="statement rv center" id="promise-h">Quietly yours.<span class="dim">From the first answer.</span></h2>
    <div class="promise">
      <div class="stack rv"><h3>Your answers stay on your iPhone.</h3><p class="body">No account, no sign-up. Results live on your device; we only see anonymous usage, never what you answered. <a class="text-link" style="min-height:0" href="/privacy/">Privacy</a></p></div>
      <div class="stack rv" style="--d:.08s"><h3>Free to start. Pay once, if you want more.</h3><p class="body">All three tests and your results are free. The full guide is a single purchase: no subscription, no renewal.</p></div>
      <div class="stack rv" style="--d:.16s"><h3>Reflection, not a verdict.</h3><p class="body">Grounded in attachment research and everyday relationship psychology. It describes patterns; it doesn’t diagnose or score people.</p></div>
    </div>
  </div>
</section>

<section class="section-tight" aria-labelledby="faq-h">
  <div class="wrap read" style="max-width:calc(900px + 2 * var(--gutter))">
    <h2 class="statement rv" id="faq-h">Before you start</h2>
    <div class="faq">${HOME_FAQS.map((f) => `<details><summary>${esc(f.q)}</summary><div class="answer"><p>${esc(f.a)}</p></div></details>`).join('')}</div>
  </div>
</section>

<section class="closing" data-light="full" data-coverage="1" data-intensity="1" data-wake aria-labelledby="close-h">
  <div class="wrap">
    <h2 class="display rv rv-blur" id="close-h">Find your LoveType.<span class="dim">About eleven minutes.</span></h2>
    <div class="cta-row rv">${appPill('Get LoveType free', 'closing')}</div>
    <div class="qr rv"><img src="/assets/qr-app-store.svg" width="84" height="84" alt="QR code linking to LoveType on the App Store"><p><strong>On your computer?</strong>Scan with your iPhone camera to open the App Store.</p></div>
  </div>
</section>`;

  const jsonld = [
    { '@context': 'https://schema.org', '@type': 'Organization', '@id': `${SITE}/#org`, name: 'LoveType', url: `${SITE}/`, logo: url('/assets/icon-512.png'), email: 'privacy@love-type.app', sameAs: [APP_STORE] },
    { '@context': 'https://schema.org', '@type': 'WebSite', '@id': `${SITE}/#website`, name: 'LoveType', url: `${SITE}/`, inLanguage: 'en', publisher: { '@id': `${SITE}/#org` } },
    {
      '@context': 'https://schema.org',
      '@type': 'MobileApplication',
      '@id': `${SITE}/#app`,
      name: 'LoveType: Relationship Test',
      alternateName: 'LoveType',
      operatingSystem: 'iOS',
      applicationCategory: 'LifestyleApplication',
      url: `${SITE}/`,
      downloadUrl: APP_STORE,
      installUrl: APP_STORE,
      image: url('/assets/icon-512.png'),
      screenshot: ['result-attachment', 'compare-result', 'playbook', 'love-manual'].map((s) => url(`/assets/screens/${s}-720.webp`)),
      description: 'Three short relationship tests (attachment style, love style and conflict style) that combine into one LoveType, with partner comparison, a dating-profile playbook and a Love Manual.',
      featureList: ['Attachment style test', 'Love style (love language) test', 'Conflict style test', 'Ten combined LoveType archetypes', 'Partner comparison with a share code', 'Dating-profile playbook', 'Love Manual'],
      inLanguage: ['en', 'es', 'pt-BR', 'ja', 'zh-Hant', 'id'],
      offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD', category: 'free' },
      publisher: { '@id': `${SITE}/#org` },
    },
    faqJson(HOME_FAQS),
  ];

  write('', page({
    path: '/',
    title: 'LoveType — Attachment Style, Love Language & Conflict Style Test',
    description: 'Three short tests reveal your attachment style, love style and conflict style, then combine them into one LoveType. Compare with a partner. Free on iPhone.',
    og: 'home',
    family: 'profile',
    jsonld,
    main,
    preload: ['<link rel="preload" href="/assets/screens/question-attachment-720.webp" as="image" media="(min-width: 861px)">'],
  }));
}
