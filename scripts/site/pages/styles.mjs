import { page, write, esc, appPill, phone, heart, crumbs, crumbJson, faqJson, faqBlock, closingCard, LOCK, ARROW, url, UPDATED } from '../lib.mjs';
import { TYPES, ARCH, DIMENSIONS, ARCHETYPES, PAIRS, POINTS, pairsFor, topOf } from '../model.mjs';
import { LOVETYPES_HUB } from '../content/types.mjs';

// A result screen only where it shows this exact result; otherwise a neutral screen from the same test.
const MATCH = { Secure: 'result-attachment', Touch: 'result-love', Fixer: 'result-conflict' };
const NEUTRAL = { attachment: ['intro-attachment', 'The Attachment Style test intro in LoveType'], love: ['home', 'LoveType home: your three dimensions'], conflict: ['question-conflict', 'A LoveType conflict style question'] };
const shotFor = (dim, key) => (MATCH[key] ? [MATCH[key], 'A LoveType result screen for this style'] : NEUTRAL[dim]);
const LOCKED = {
  attachment: ['When you feel safe', 'When you feel insecure', 'What you need from a partner'],
  love: ['How to love you best', 'I feel loved when…'],
  conflict: ['When tension rises', 'How you repair', 'The best way to repair with me'],
};
const DIM_NOUN = { attachment: 'attachment style', love: 'love style', conflict: 'conflict style' };

const article = (headline, description, p) => ({
  '@context': 'https://schema.org',
  '@type': 'Article',
  headline,
  description,
  inLanguage: 'en',
  datePublished: '2026-08-27',
  dateModified: UPDATED,
  author: { '@type': 'Organization', name: 'LoveType', url: url('/') },
  publisher: { '@id': 'https://love-type.app/#org' },
  mainEntityOfPage: url(p),
  image: url(`/assets/og/${p.replace(/^\/|\/$/g, '').replace(/\//g, '-') || 'home'}.jpg`),
});

const ogName = (p) => p.replace(/^\/|\/$/g, '').replace(/\//g, '-');

export const OG = []; // filled for the OG image renderer

function matrix(dim) {
  const D = DIMENSIONS[dim];
  const find = (a, b) => PAIRS.find((p) => p.dim === dim && p.key === [a, b].sort().join('+'));
  return `<div class="matrix-wrap"><table class="matrix">
    <caption class="visually-hidden">${esc(D.name)} pairings</caption>
    <thead><tr><th scope="col"><span class="visually-hidden">Style</span></th>${D.order.map((k) => `<th scope="col">${esc(D.short[k])}</th>`).join('')}</tr></thead>
    <tbody>${D.order.map((a) => `<tr><th scope="row">${esc(D.short[a])}</th>${D.order.map((b) => {
      const p = find(a, b);
      return `<td>${p ? `<a class="${a === b ? 'self' : ''}" href="${p.path}" aria-label="${esc(p.title)}">${a === b ? 'Same' : '×'}</a>` : ''}</td>`;
    }).join('')}</tr>`).join('')}</tbody>
  </table></div>`;
}

function typeCard(t) {
  return `<a class="card rv" href="${t.path}"><span class="label">${esc(t.short)}</span><span class="serif">${esc(t.label)}</span><p>${esc(t.tagline)}</p><span class="go" aria-hidden="true">→</span></a>`;
}

export function buildHubs() {
  for (const dim of ['attachment', 'love', 'conflict']) {
    const D = DIMENSIONS[dim];
    const p = `/${D.path}/`;
    const items = [['Home', '/'], [D.plural, p]];
    const main = `
<section class="page-hero" data-light="${D.family}" data-coverage="0.45" data-intensity="0.85">
  <div class="wrap">
    ${crumbs(items)}
    <p class="label">${esc(D.test)}<span class="sep">·</span>${D.questions} questions<span class="sep">·</span>about ${D.minutes} minutes</p>
    <h1 class="display rv rv-blur">${esc(D.plural)}.<span class="dim">${esc(D.question)}</span></h1>
    <p class="lead rv">${esc(D.hubDescription)}</p>
    <div class="cta-row rv">${appPill(`Take the ${D.name.toLowerCase()} test`, `hub-${dim}`)}</div>
  </div>
</section>
<section class="section-tight" data-light="${D.family}" data-coverage="0.5" data-intensity="0.8">
  <div class="wrap">
    <div class="answer-box rv" style="max-width:820px"><span class="label">In short</span>${esc(D.hubAnswer)}</div>
    <h2 class="statement-s rv" style="margin:70px 0 24px">${D.order.length} ${D.plural.toLowerCase()}</h2>
    <div class="cards">${D.order.map((k) => typeCard(TYPES[dim][k])).join('')}</div>
    <h2 class="statement-s rv" style="margin:90px 0 6px">How they pair</h2>
    <p class="body rv">Every combination has its own page: where it flows, where it rubs, and what each partner can try.</p>
    ${matrix(dim)}
    <div class="read" style="padding:0;max-width:820px">${faqBlock(D.hubFaqs, `${D.plural}: questions`)}</div>
    ${closingCard(`Find your ${D.name.toLowerCase()}.`, `${D.questions} statements, about ${D.minutes} minutes, free in LoveType. Then add the other two tests for your full LoveType.`, `hub-${dim}-close`)}
  </div>
</section>`;
    OG.push({ name: ogName(p), eyebrow: D.test.toUpperCase(), title: D.plural, sub: D.question, family: D.family });
    write(p, page({
      path: p, title: D.hubMetaTitle, description: D.hubDescription, og: ogName(p), family: D.family,
      jsonld: [article(D.hubTitle, D.hubDescription, p), faqJson(D.hubFaqs), crumbJson(items)],
      main,
    }));
  }
}

export function buildTypes() {
  for (const dim of ['attachment', 'love', 'conflict']) {
    const D = DIMENSIONS[dim];
    for (const key of D.order) {
      const t = TYPES[dim][key];
      const items = [['Home', '/'], [D.plural, `/${D.path}/`], [t.short, t.path]];
      const pairs = pairsFor(dim, key);
      const archetypes = Object.entries(POINTS[dim][key]).filter(([, v]) => v >= 2).map(([k]) => ARCH[k]);
      const others = D.order.filter((k) => k !== key).map((k) => TYPES[dim][k]);
      const nameNoun = dim === 'attachment' ? `${t.short} attachment` : dim === 'love' ? t.short : `The ${t.short.toLowerCase()}`;
      const desc = `What ${dim === 'conflict' ? t.label.replace('The ', 'the ') + ' conflict style' : dim === 'love' ? 'the ' + t.short.toLowerCase() + ' love style' : t.short.toLowerCase() + ' attachment'} means: signs, strengths, blind spots and how it pairs. Free ${D.name.toLowerCase()} test in LoveType.`;
      const main = `
<section class="page-hero" data-light="${t.family}" data-coverage="0.5" data-intensity="0.88">
  <div class="wrap">
    ${crumbs(items)}
    <p class="label">${esc(D.name)}<span class="sep">·</span>${esc(t.label)}</p>
    <h1 class="display rv rv-blur">${esc(dim === 'attachment' ? `${t.short} attachment` : dim === 'love' ? t.short : t.label)}.<span class="dim">${esc(t.tagline)}</span></h1>
    <div class="cta-row rv" style="margin-top:36px">${appPill(`Take the ${D.name.toLowerCase()} test`, `type-${t.slug}`)}</div>
  </div>
</section>
<section class="section-tight" data-light="${t.family}" data-coverage="0.45" data-intensity="0.8">
  <div class="wrap split">
    <article class="prose">
      <div class="answer-box"><span class="label">In short</span>${esc(t.answer)}</div>
      <h2>Signs of ${esc(dim === 'attachment' ? `${t.short.toLowerCase()} attachment` : dim === 'love' ? `a ${t.short.toLowerCase()} love style` : `a ${t.short.toLowerCase()} in conflict`)}</h2>
      <ul class="dash">${t.signs.map((s) => `<li>${esc(s)}</li>`).join('')}</ul>
      <h2>How LoveType describes it</h2>
      <p>If this is your result, LoveType calls you <strong>${esc(t.label)}</strong>.</p>
      <p class="quote">${esc(t.description)}</p>
      <h3>Strengths</h3>
      <ul class="dash">${t.strengths.map((s) => `<li>${esc(s)}</li>`).join('')}</ul>
      <div class="worth"><span class="label">Worth knowing</span>${esc(t.blindSpot)}</div>
      <h2>In the full guide</h2>
      <p>The result screen goes further for this style. These sections are part of the one-time LoveType Guide:</p>
      <ul class="locked">${LOCKED[dim].map((s) => `<li><strong>${esc(s)}</strong><span class="lines" aria-hidden="true"><i></i><i></i></span>${LOCK}</li>`).join('')}<li><strong>Your Love Manual and communication scripts</strong><span class="lines" aria-hidden="true"><i></i><i></i></span>${LOCK}</li></ul>
      <h2>How it pairs</h2>
      <p>${esc(D.name)} is most useful next to someone else’s. Each pairing below covers where it flows, where it rubs and what each partner can try.</p>
      <div class="chips">${pairs.map((p) => `<a class="chip" href="${p.path}"><i></i>${esc(p.title)}</a>`).join('')}</div>
      ${archetypes.length ? `<h2>Where it leads</h2><p>Combined with your other two results, ${esc(nameNoun.toLowerCase())} often points to these LoveTypes:</p><div class="chips">${archetypes.map((a) => `<a class="chip" href="${a.path}"><i></i>${esc(a.label)}</a>`).join('')}</div>` : ''}
      <h2>Other ${esc(D.plural.toLowerCase())}</h2>
      <div class="chips">${others.map((o) => `<a class="chip" href="${o.path}"><i></i>${esc(o.short)}</a>`).join('')}</div>
      ${faqBlock(t.faqs)}
    </article>
    <aside class="aside rv">
      ${phone(...shotFor(dim, key), { glow: 'var(--accent)' })}
      <p class="small">The ${esc(D.test)}: ${D.questions} statements, about ${D.minutes} minutes. Free.</p>
      ${appPill('Take the test', `type-aside-${t.slug}`)}
    </aside>
  </div>
  <div class="wrap">${closingCard('Your style is one third of the picture.', 'Take all three tests to see your attachment, love and conflict styles together as one LoveType. About eleven minutes, free.', `type-close-${t.slug}`)}</div>
</section>`;
      OG.push({ name: ogName(t.path), eyebrow: D.name.toUpperCase(), title: dim === 'attachment' ? `${t.short} attachment` : dim === 'love' ? t.short : t.label, sub: dim === 'conflict' ? t.tagline : t.label, family: t.family });
      write(t.path, page({
        path: t.path, title: `${t.seoTitle} | LoveType`, description: desc, og: ogName(t.path), family: t.family, ogType: 'article',
        jsonld: [article(t.seoTitle, desc, t.path), faqJson(t.faqs), crumbJson(items)],
        main,
      }));
    }
  }
}

export function buildArchetypes() {
  const hubPath = '/lovetypes/';
  const hubItems = [['Home', '/'], ['LoveTypes', hubPath]];
  const hubMain = `
<section class="page-hero" data-light="full" data-coverage="0.8" data-intensity="0.9">
  <div class="wrap">
    ${crumbs(hubItems)}
    <p class="label">Three tests<span class="sep">·</span>one result</p>
    <h1 class="display rv rv-blur">The ten LoveTypes.<span class="dim">Which one are you?</span></h1>
    <p class="lead rv">${esc(LOVETYPES_HUB.description)}</p>
    <div class="cta-row rv">${appPill('Find my LoveType', 'lovetypes-hub')}</div>
  </div>
</section>
<section class="section-tight" data-light="full" data-coverage="0.7" data-intensity="0.85">
  <div class="wrap">
    <div class="answer-box rv" style="max-width:820px"><span class="label">In short</span>${esc(LOVETYPES_HUB.answer)}</div>
    <div class="cards" style="margin-top:56px">${ARCHETYPES.order.map((k) => { const a = ARCH[k]; return `<a class="card rv" href="${a.path}" data-family="${a.family}"><span class="label">LoveType</span><span class="serif">${esc(a.label)}</span><p>${esc(a.tagline)}</p><span class="go" aria-hidden="true">→</span></a>`; }).join('')}</div>
    ${closingCard('Ten patterns. One is yours.', 'Your LoveType appears once you have finished all three tests. About eleven minutes, free.', 'lovetypes-close')}
  </div>
</section>`;
  OG.push({ name: 'lovetypes', eyebrow: 'THREE TESTS · ONE RESULT', title: 'The ten LoveTypes', sub: 'Which one are you?', family: 'full' });
  write(hubPath, page({
    path: hubPath, title: LOVETYPES_HUB.metaTitle, description: LOVETYPES_HUB.description, og: 'lovetypes', family: 'full',
    jsonld: [article(LOVETYPES_HUB.title, LOVETYPES_HUB.description, hubPath), crumbJson(hubItems), {
      '@context': 'https://schema.org', '@type': 'ItemList', itemListElement: ARCHETYPES.order.map((k, i) => ({ '@type': 'ListItem', position: i + 1, name: ARCH[k].label, url: url(ARCH[k].path) })),
    }],
    main: hubMain,
  }));

  for (const k of ARCHETYPES.order) {
    const a = ARCH[k];
    const items = [['Home', '/'], ['LoveTypes', hubPath], [a.label, a.path]];
    const tops = {
      attachment: topOf(a.counts.attachment, 1).map((x) => TYPES.attachment[x]),
      love: topOf(a.counts.love, 2).map((x) => TYPES.love[x]),
      conflict: topOf(a.counts.conflict, 2).map((x) => TYPES.conflict[x]),
    };
    const linkList = (arr) => arr.map((t) => `<a href="${t.path}">${esc(t.short.toLowerCase())}</a>`).join(' or ');
    const faqs = [
      { q: `What is ${a.label} LoveType?`, a: `${a.label} is one of LoveType’s ten relationship archetypes: “${a.tagline}” It comes from combining three results: attachment style, love style and conflict style.` },
      { q: `Which results lead to ${a.label}?`, a: `Most often ${tops.attachment.map((t) => t.short.toLowerCase()).join(' or ')} attachment, a love style of ${tops.love.map((t) => t.short.toLowerCase()).join(' or ')}, and a ${tops.conflict.map((t) => t.short.toLowerCase()).join(' or ')} conflict style. Other combinations can land here too, because all three results are weighed together.` },
    ];
    const desc = `${a.label}, one of ten LoveTypes: what it is like in a relationship, its strengths, its blind spot and dating-profile tips.`;
    const others = ARCHETYPES.order.filter((x) => x !== k).map((x) => ARCH[x]);
    const main = `
<section class="page-hero" data-light="${a.family}" data-family="${a.family}" data-coverage="0.75" data-intensity="0.9">
  <div class="wrap">
    ${crumbs(items)}
    <p class="label">LoveType<span class="sep">·</span>1 of 10</p>
    <h1 class="display rv rv-blur">${esc(a.label)}.<span class="dim">${esc(a.tagline)}</span></h1>
    <div class="cta-row rv" style="margin-top:36px">${appPill('Is this my LoveType?', `arch-${a.slug}`)}</div>
  </div>
</section>
<section class="section-tight" data-light="${a.family}" data-family="${a.family}" data-coverage="0.6" data-intensity="0.82">
  <div class="wrap split">
    <article class="prose">
      <p class="quote">${esc(a.description)}</p>
      <h2>Most often built from</h2>
      <p><strong>Attachment:</strong> ${linkList(tops.attachment)}. <strong>Love style:</strong> ${linkList(tops.love)}. <strong>Conflict style:</strong> ${linkList(tops.conflict)}.</p>
      <p>LoveType weighs all three of your results together, so other combinations can arrive here as well.</p>
      <h2>Strengths</h2>
      <ul class="dash">${a.strengths.map((s) => `<li>${esc(s)}</li>`).join('')}</ul>
      <div class="worth"><span class="label">Worth knowing</span>${esc(a.blindSpot)}</div>
      ${a.playbook?.leadWith ? `<h2>On a dating profile</h2>
      <p>From the dating-profile playbook for ${esc(a.label)}. The through-line to lead with:</p>
      <p class="quote">${esc(a.playbook.leadWith)}</p>
      <p><strong>Worth putting in:</strong> ${esc(a.playbook.point)}</p>
      <p>Starter line: <em>“${esc(a.playbook.example)}”</em></p>
      <p><a href="/dating-profile-playbook/">The playbook for every LoveType</a></p>` : ''}
      <h2>In the full guide</h2>
      <ul class="locked">${['What you need from a partner', 'Hard moments, with a communication script', 'What you might overdo', 'Growth', 'Your Love Manual'].map((s) => `<li><strong>${esc(s)}</strong><span class="lines" aria-hidden="true"><i></i><i></i></span>${LOCK}</li>`).join('')}</ul>
      <h2>The other LoveTypes</h2>
      <div class="chips">${others.map((o) => `<a class="chip" href="${o.path}"><i></i>${esc(o.label)}</a>`).join('')}</div>
      ${faqBlock(faqs)}
    </article>
    <aside class="aside rv">
      ${k === 'SteadyBuilder' ? phone('profile', 'The LoveType profile screen for The Quiet Builder', { glow: 'var(--accent)' }) : phone('love-manual', 'The Love Manual in LoveType, written from your three results', { glow: 'var(--accent)' })}
      <p class="small">Your LoveType appears after all three tests. About eleven minutes, free.</p>
      ${appPill('Find mine', `arch-aside-${a.slug}`)}
    </aside>
  </div>
</section>`;
    OG.push({ name: ogName(a.path), eyebrow: 'LOVETYPE', title: a.label, sub: a.tagline, family: a.family });
    write(a.path, page({
      path: a.path, title: `${a.label}: LoveType Relationship Archetype | LoveType`, description: desc, og: ogName(a.path), family: a.family, ogType: 'article',
      jsonld: [article(`${a.label}: LoveType relationship archetype`, desc, a.path), faqJson(faqs), crumbJson(items)],
      main,
    }));
  }
}
