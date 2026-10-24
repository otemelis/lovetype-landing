import fs from 'fs';
import path from 'path';
import { page, write, esc, attr, appPill, phone, heart, crumbs, crumbJson, faqJson, faqBlock, closingCard, ARROW, url, UPDATED, UPDATED_HUMAN, ROOT, SITE, APP_STORE, LANGS, localPath } from '../lib.mjs';
import { TYPES, ARCH, DIMENSIONS, ARCHETYPES, PAIRS, POINTS, cap, appData } from '../model.mjs';
import { pickerBlock } from './home.mjs';
import { LOCALIZED as LOCALIZED_KEYS } from '../lib.mjs';
import { OG } from './styles.mjs';

const HERE = path.dirname(new URL(import.meta.url).pathname);
const content = (f) => fs.readFileSync(path.join(HERE, '../content', f), 'utf8');
const ogName = (p) => p.replace(/^\/|\/$/g, '').replace(/\//g, '-');
const DIM_FAMILY = { attachment: 'attachment', love: 'loveStyle', conflict: 'conflict' };
const DIM_HUB = { attachment: '/attachment-styles/', love: '/love-styles/', conflict: '/conflict-styles/' };

const articleLd = (headline, description, p, published = '2026-08-27') => ({
  '@context': 'https://schema.org', '@type': 'Article', headline, description, inLanguage: 'en',
  datePublished: published, dateModified: UPDATED,
  author: { '@type': 'Organization', name: 'LoveType', url: url('/') }, publisher: { '@id': 'https://love-type.app/#org' }, mainEntityOfPage: url(p),
  image: url(`/assets/og/${ogName(p)}.jpg`),
});

// ── Compatibility ────────────────────────────────────────────────────────────
export function buildCompatibility() {
  const hub = '/compatibility/';
  const hubItems = [['Home', '/'], ['Compatibility', hub]];
  const group = (dim, title, sub) => {
    const list = PAIRS.filter((p) => p.dim === dim);
    return `<section class="section-tight" data-light="${DIM_FAMILY[dim]}" data-family="${DIM_FAMILY[dim]}" data-coverage="0.5" data-intensity="0.82" aria-labelledby="g-${dim}">
      <h2 class="statement-s rv" id="g-${dim}">${title}</h2><p class="body rv" style="margin-top:8px">${sub}</p>
      <div class="chips rv" style="margin-top:22px">${list.map((p) => `<a class="chip" href="${p.path}"><i></i>${esc(p.title)}</a>`).join('')}</div>
    </section>`;
  };
  const hubDesc = 'How attachment styles, love styles and conflict styles pair: 52 combinations, each with where it connects, where the friction shows up and what helps. Patterns, not verdicts.';
  const hubMain = `
<section class="page-hero" data-light="profile" data-coverage="0.5" data-intensity="0.85">
  <div class="wrap">
    ${crumbs(hubItems)}
    <p class="label">52 pairings<span class="sep">·</span>no scores</p>
    <h1 class="display rv rv-blur">Compatibility.<span class="dim">Where you click, where you grind.</span></h1>
    <p class="lead rv">${hubDesc}</p>
  </div>
</section>
<section class="section-tight" data-light="profile" data-coverage="0.4" data-intensity="0.8">
  <div class="wrap" style="max-width:calc(900px + 2 * var(--gutter))">
    ${pickerBlock()}
  </div>
</section>
<div class="wrap">
  ${group('attachment', 'Attachment pairings', 'How two people seek closeness and safety, and what happens when those needs meet.')}
  ${group('love', 'Love style pairings', 'How two people give and recognise affection, and where signals get missed.')}
  ${group('conflict', 'Conflict style pairings', 'What two people do when a disagreement gets hard, and how to get back to each other.')}
  ${closingCard('See it for the two of you.', 'Finish the three tests, share your four-character code, and LoveType compares you dimension by dimension. Free, no score.', 'compat-hub-close')}
  <div style="height:80px"></div>
</div>`;
  OG.push({ name: 'compatibility', eyebrow: '52 PAIRINGS · NO SCORES', title: 'Compatibility', sub: 'Where you click, where you grind.', family: 'profile' });
  write(hub, page({
    path: hub, title: 'Relationship Compatibility: Attachment, Love & Conflict | LoveType', description: hubDesc, og: 'compatibility', family: 'profile',
    jsonld: [articleLd('Relationship compatibility by attachment, love and conflict style', hubDesc, hub), crumbJson(hubItems), {
      '@context': 'https://schema.org', '@type': 'ItemList', numberOfItems: PAIRS.length, itemListElement: PAIRS.map((p, i) => ({ '@type': 'ListItem', position: i + 1, name: p.title, url: url(p.path) })),
    }],
    main: hubMain,
  }));

  for (const p of PAIRS) {
    const D = p.D;
    const L = D.label;
    const fam = DIM_FAMILY[p.dim];
    const items = [['Home', '/'], ['Compatibility', hub], [p.title, p.path]];
    const tl = TYPES[p.dim][p.left];
    const tr = TYPES[p.dim][p.right];
    const metaDesc = p.sameType
      ? `Where two ${L[p.left]} partners connect, where the friction shows up, and one thing that helps.`
      : `How ${L[p.left]} and ${L[p.right]} ${D.noun}s work together: where they connect, where friction shows up, and what each partner can try.`;
    const tips = p.sameType
      ? `<div class="answer-box"><span class="label">For both partners</span>${esc(p.tips)}</div>`
      : `<div class="answer-box"><span class="label">If you are the ${esc(L[p.left])} partner</span>${esc(p.tips[p.left])}</div><div class="answer-box"><span class="label">If you are the ${esc(L[p.right])} partner</span>${esc(p.tips[p.right])}</div>`;
    const styles = p.sameType
      ? `<p><strong><a href="${tl.path}">${esc(cap(L[p.left]))}</a>:</strong> ${esc(D.blurb[p.left])} In this pairing both people bring that same set of strengths, and the same blind spots.</p>`
      : `<p><strong><a href="${tl.path}">${esc(cap(L[p.left]))}</a>:</strong> ${esc(D.blurb[p.left])}</p><p><strong><a href="${tr.path}">${esc(cap(L[p.right]))}</a>:</strong> ${esc(D.blurb[p.right])}</p>`;
    const related = PAIRS.filter((x) => x.dim === p.dim && x.slug !== p.slug && (x.left === p.left || x.right === p.left || x.left === p.right || x.right === p.right)).slice(0, 6);
    const main = `
<section class="page-hero" data-light="${fam}" data-family="${fam}" data-coverage="0.55" data-intensity="0.88">
  <div class="wrap">
    ${crumbs(items)}
    <p class="label">${esc(D.eyebrow)}</p>
    <h1 class="display rv rv-blur" style="font-size:clamp(42px,6.4vw,92px)">${esc(p.h1)}.</h1>
    <p class="lead rv">${esc(p.lede)}</p>
  </div>
</section>
<section class="section-tight" data-light="${fam}" data-family="${fam}" data-coverage="0.5" data-intensity="0.82">
  <div class="wrap split">
    <article class="prose">
      <p>${esc(D.describes)}</p>
      <h2>${p.sameType ? `The ${esc(L[p.left])} style` : 'The two styles'}</h2>
      ${styles}
      <h2>Where you connect</h2>
      <p>${esc(p.connect)}</p>
      <h2>Where the friction shows up</h2>
      <p>${esc(p.friction)}</p>
      <h2>What each of you can try</h2>
      ${tips}
      <div class="worth"><span class="label">A pattern, not a verdict</span>Styles describe tendencies, not destinies. Plenty of couples with this pairing do well; knowing the pattern is what makes it workable.</div>
      ${faqBlock(p.faqs)}
      <h2>Related pairings</h2>
      <div class="chips">${related.map((x) => `<a class="chip" href="${x.path}"><i></i>${esc(x.title)}</a>`).join('')}<a class="chip" href="${hub}"><i></i>All pairings</a></div>
    </article>
    <aside class="aside rv">
      ${p.slug === 'secure-and-anxious' ? phone('compare-result', 'LoveType partner comparison for a secure and an anxious partner', { glow: 'var(--accent)' }) : phone('compare-code', 'The LoveType compare screen with a share code', { glow: 'var(--accent)' })}
      <p class="small">In the app, compare all three dimensions with your partner. Free, no score.</p>
      ${appPill('Compare in LoveType', `pair-aside-${p.slug}`)}
    </aside>
  </div>
  <div class="wrap">${closingCard('Compare the real two of you.', 'Both take the three tests, share a four-character code, and see your attachment, love and conflict styles side by side.', `pair-close-${p.slug}`)}</div>
</section>`;
    OG.push({ name: ogName(p.path), eyebrow: D.eyebrow.toUpperCase(), title: p.title, sub: 'Where you click, where you grind.', family: fam });
    write(p.path, page({
      path: p.path, title: p.metaTitle, description: metaDesc, og: ogName(p.path), family: fam, ogType: 'article',
      jsonld: [articleLd(p.metaTitle, metaDesc, p.path), faqJson(p.faqs), crumbJson(items)],
      main,
    }));
  }
}

// ── Compare ──────────────────────────────────────────────────────────────────
function compareData(S) {
  const A = appData(S.lang);
  const en = S.lang === 'en';
  const types = {};
  for (const dim of ['attachment', 'love', 'conflict']) {
    types[dim] = {};
    for (const k of DIMENSIONS[dim].order) {
      const t = TYPES[dim][k];
      types[dim][k] = { label: esc(A[dim][k].label), short: esc(S.short[dim][k]), url: t.path, family: t.family, dim: esc(S.dimName[dim]) };
    }
  }
  const pairs = { attachment: {}, love: {}, conflict: {} };
  for (const p of PAIRS) pairs[p.dim][p.key] = { title: esc(p.title), url: p.path };
  const archetypes = Object.fromEntries(ARCHETYPES.order.map((k) => [k, { label: esc(A.combined[k].label), tagline: esc(A.combined[k].tagline), url: ARCH[k].path }]));
  return JSON.stringify({ order: ARCHETYPES.order, points: POINTS, types, pairs, archetypes, dimNames: S.dimName, ui: S.compare.ui, en }).replace(/</g, '\\u003c');
}

function compareMain(S, { fromLink = false } = {}) {
  const C = S.compare;
  const dir = S.lang === 'en' ? '' : S.lang.toLowerCase();
  return `
<section class="page-hero" data-light="conflict" data-family="conflict" data-coverage="0.6" data-intensity="0.9">
  <div class="wrap split" style="align-items:center">
    <div>
      ${fromLink ? '' : crumbs([['LoveType', S.prefix], [C.crumb, localPath(S.lang, 'compare')]])}
      <p class="label">${fromLink ? esc(C.linkLabel) : `${esc(C.label[0])}<span class="sep">·</span>${esc(C.label[1])}`}</p>
      <h1 class="display rv rv-blur" style="font-size:clamp(44px,6.6vw,96px)">${esc(fromLink ? C.linkH[0] : C.h[0])}<span class="dim">${esc(fromLink ? C.linkH[1] : C.h[1])}</span></h1>
      <div data-compare>
        <label class="label" for="their-code" style="display:block;margin-top:34px;color:var(--ink-3)">${esc(C.theirs)}</label>
        <div class="code-field"><input id="their-code" inputmode="text" autocomplete="off" autocapitalize="characters" spellcheck="false" maxlength="6" placeholder="${attr(C.theirsPh)}" aria-describedby="code-help"></div>
        <label class="label" for="my-code" style="display:block;margin-top:18px;color:var(--ink-3)">${esc(C.mine)}</label>
        <div class="code-field"><input id="my-code" inputmode="text" autocomplete="off" autocapitalize="characters" spellcheck="false" maxlength="6" placeholder="${attr(C.minePh)}"></div>
        <p class="code-msg" id="code-help" aria-live="polite"></p>
        <div class="result-card" aria-live="polite"></div>
        <script type="application/json" id="compare-data">${compareData(S)}</script>
      </div>
      <div class="cta-row" style="margin-top:30px">${appPill(S.chrome.getFree, fromLink ? 'compare-link' : 'compare-page')}</div>
      <p class="small" style="margin-top:14px">${esc(C.privacy)}</p>
    </div>
    <aside class="aside">${phone('compare-code', C.alt, { glow: 'rgb(112 128 192 / .6)', lazy: false, dir })}</aside>
  </div>
</section>`;
}

export function buildCompare(S) {
  const C = S.compare;
  const p = localPath(S.lang, 'compare');
  const en = S.lang === 'en';
  const main = compareMain(S) + `
<section class="section-tight" data-light="conflict" data-coverage="0.5" data-intensity="0.8">
  <div class="wrap" style="max-width:calc(900px + 2 * var(--gutter))">
    <h2 class="statement rv">${esc(C.howH[0])}<span class="dim">${esc(C.howH[1])}</span></h2>
    <div class="prose" style="margin-top:30px"><ol class="num">${C.steps.map(([a, b]) => `<li><strong>${esc(a)}</strong> ${esc(b)}</li>`).join('')}</ol></div>
    ${faqBlock(C.faqs, C.faqH)}
  </div>
</section>`;
  const og = en ? 'compare' : `compare-${S.lang.toLowerCase()}`;
  OG.push({ name: og, eyebrow: `${C.label[0]} · ${C.label[1]}`.toUpperCase(), title: C.h[0].replace(/\.$/, ''), sub: C.h[1], family: 'conflict', lang: S.lang, foot: S.chrome.footer.tagline });
  write(p, page({ S, path: p, alternateKey: 'compare', title: C.title, description: C.description, og, family: 'conflict', jsonld: [faqJson(C.faqs), crumbJson([['LoveType', S.prefix], [C.crumb, p]])], main }));

  if (!en) return;
  // 404: a shared /compare/<code> link without the app installed lands here.
  const notFound = page({
    S, path: '/404.html', title: 'LoveType', description: 'Someone shared their LoveType with you.', og: 'compare', family: 'conflict', noindex: true,
    main: `<div data-404-compare hidden>${compareMain(S, { fromLink: true })}</div>
<section class="page-hero" data-404-generic data-light="profile" data-coverage="0.3" data-intensity="0.8"><div class="wrap"><p class="label">404</p><h1 class="display">This page isn’t here.<span class="dim">But you are.</span></h1><div class="cta-row" style="margin-top:36px"><a class="pill" href="/">Go to the homepage</a><a class="text-link" href="/compatibility/">Compatibility ${ARROW}</a></div></div></section>
<script>if(/^\\/compare\\/[0-9a-z-]{4,6}\\/?$/i.test(location.pathname)){document.querySelector('[data-404-compare]').hidden=false;document.querySelector('[data-404-generic]').remove();document.title='Someone shared their LoveType';}else{document.querySelector('[data-404-compare]').remove();}</script>`,
  });
  fs.writeFileSync(path.join(ROOT, '404.html'), notFound);
}

// ── Dating-profile playbook ──────────────────────────────────────────────────
export function buildPlaybook() {
  const p = '/dating-profile-playbook/';
  const items = [['Home', '/'], ['Dating-profile playbook', p]];
  const desc = 'How to write a dating profile that sounds like you, by LoveType: the through-line to lead with, what to mention and a starter line for each of the ten relationship archetypes.';
  const faqs = [
    { q: 'How do I write a dating profile that sounds like me?', a: 'Lead with one through-line, the quality people actually experience with you, and prove it with a specific detail instead of an adjective. Your LoveType gives you that through-line; the playbook turns it into lines you can use.' },
    { q: 'What should I avoid in a dating profile?', a: 'Lists of adjectives, logistics with no warmth, and lines anyone could have written. Each LoveType has its own typical trap; the full playbook in the app names yours.' },
    { q: 'Does the playbook write the profile for me?', a: 'No. It gives you guidance, starter lines and ideas for common prompts, so the profile stays in your voice.' },
  ];
  const cards = ARCHETYPES.order.map((k) => {
    const a = ARCH[k];
    const pb = a.playbook;
    return `<article class="card rv" data-family="${a.family}" style="gap:14px">
      <span class="label">${esc(a.label)}</span>
      <p class="serif" style="font-size:24px;line-height:1.22;color:var(--ink)">${esc(pb.leadWith)}</p>
      <p><strong style="color:var(--ink-2)">Starter line:</strong> “${esc(pb.example)}”</p>
      <p><a class="text-link" href="${a.path}" style="min-height:32px">About ${esc(a.label)} ${ARROW}</a></p>
    </article>`;
  }).join('');
  const main = `
<section class="page-hero" data-light="loveStyle" data-family="loveStyle" data-coverage="0.55" data-intensity="0.88">
  <div class="wrap split" style="align-items:center">
    <div>
      ${crumbs(items)}
      <p class="label">New in LoveType 1.2</p>
      <h1 class="display rv rv-blur" style="font-size:clamp(44px,6.6vw,96px)">Dating-profile playbook.<span class="dim">Know what to say.</span></h1>
      <p class="lead rv">${desc}</p>
      <div class="cta-row rv" style="margin-top:32px">${appPill('Get my playbook', 'playbook-hero')}</div>
    </div>
    <aside class="aside">${phone('playbook', 'The LoveType dating-profile playbook for The Quiet Builder', { glow: 'rgb(160 128 192 / .6)', lazy: false })}</aside>
  </div>
</section>
<section class="section-tight" data-light="loveStyle" data-family="loveStyle" data-coverage="0.5" data-intensity="0.82">
  <div class="wrap">
    <div class="answer-box rv" style="max-width:820px"><span class="label">How it works</span>Your three results point to one LoveType. The playbook turns it into a profile: one through-line to lead with, three things worth mentioning with starter lines, answers for four common prompts, and the one trap to avoid. The through-line and the first idea are free.</div>
    <h2 class="statement-s rv" style="margin:70px 0 24px">The through-line for each LoveType</h2>
    <div class="cards" style="grid-template-columns:repeat(auto-fill,minmax(min(100%,340px),1fr))">${cards}</div>
    <div class="read" style="padding:0;max-width:820px">${faqBlock(faqs)}</div>
    ${closingCard('Write it in your own voice.', 'Take the three tests, then open your playbook: through-line, starter lines and prompt ideas for your LoveType.', 'playbook-close')}
    <div style="height:80px"></div>
  </div>
</section>`;
  OG.push({ name: 'dating-profile-playbook', eyebrow: 'FOR DATING', title: 'Dating-profile playbook', sub: 'Know what to say.', family: 'loveStyle' });
  write(p, page({ path: p, title: 'How to Write a Dating Profile That Sounds Like You | LoveType', description: desc, og: 'dating-profile-playbook', family: 'loveStyle', jsonld: [articleLd('How to write a dating profile that sounds like you', desc, p, UPDATED), faqJson(faqs), crumbJson(items)], main }));
}

// ── Journal ──────────────────────────────────────────────────────────────────
const POSTS = [
  {
    slug: 'attachment-style-vs-personality-type',
    title: 'Attachment Style vs Personality Type: What’s the Difference?',
    short: 'Attachment style vs personality type',
    description: 'Attachment style and personality type describe different patterns. Learn what each one means, how they interact and which test fits your question.',
    published: '2026-07-15',
    human: 'July 2026',
  },
];

export function buildJournal() {
  const hub = '/journal/';
  const items = [['Home', '/'], ['Journal', hub]];
  const desc = 'Plain-language writing on attachment, love styles and conflict, from the makers of LoveType.';
  const main = `
<section class="page-hero" data-light="profile" data-coverage="0.4" data-intensity="0.8">
  <div class="wrap read" style="max-width:calc(900px + 2 * var(--gutter))">
    ${crumbs(items)}
    <p class="label">Journal</p>
    <h1 class="display rv rv-blur">Journal.<span class="dim">On how people love.</span></h1>
    <p class="lead rv">${desc}</p>
    <div class="posts">${POSTS.map((po) => `<a class="post rv" href="/journal/${po.slug}/"><span class="label">${po.human}</span><h2 class="statement-s">${esc(po.title)}</h2><p class="body">${esc(po.description)}</p></a>`).join('')}</div>
  </div>
</section>`;
  OG.push({ name: 'journal', eyebrow: 'JOURNAL', title: 'Journal', sub: 'On how people love.', family: 'profile' });
  write(hub, page({ path: hub, title: 'Journal | LoveType', description: desc, og: 'journal', family: 'profile', jsonld: [crumbJson(items)], main }));

  for (const po of POSTS) {
    const p = `/journal/${po.slug}/`;
    const its = [...items, [po.short, p]];
    const faqs = JSON.parse(content(`journal/${po.slug}.faq.json`));
    const main = `
<section class="page-hero" data-light="attachment" data-family="attachment" data-coverage="0.4" data-intensity="0.8">
  <div class="wrap read">
    ${crumbs(its)}
    <p class="label">Journal<span class="sep">·</span>Updated ${po.human}</p>
    <h1 class="statement rv rv-blur" style="margin-top:18px;font-size:clamp(38px,5vw,66px)">${esc(po.title)}</h1>
  </div>
</section>
<section class="section-tight" style="padding-top:0" data-light="attachment" data-coverage="0.35" data-intensity="0.75">
  <div class="wrap read">
    <article class="prose">${content(`journal/${po.slug}.html`)}</article>
    ${closingCard('Discover your attachment, love and conflict styles.', 'Three short tests, about eleven minutes, free in LoveType.', `journal-${po.slug}`)}
    <div style="height:80px"></div>
  </div>
</section>`;
    OG.push({ name: ogName(p), eyebrow: 'JOURNAL', title: po.short, sub: '', family: 'attachment' });
    write(p, page({ path: p, title: po.title, description: po.description, og: ogName(p), family: 'attachment', ogType: 'article', jsonld: [articleLd(po.title, po.description, p, po.published), faqJson(faqs), crumbJson(its)], main }));
  }
}

// ── Legal ────────────────────────────────────────────────────────────────────
export function buildLegal(S) {
  const G = S.legal;
  const suffix = S.lang === 'en' ? '' : `.${S.lang}`;
  for (const key of ['privacy', 'terms']) {
    const d = G[key];
    const p = localPath(S.lang, key);
    const items = [['LoveType', S.prefix], [d.title, p]];
    const body = content(`legal/${key}${suffix}.html`).replace(/<h2 class="serif">/g, '<h2>');
    const main = `
<section class="page-hero" data-light="profile" data-coverage="0.3" data-intensity="0.72">
  <div class="wrap read">
    ${crumbs(items)}
    <p class="label">${esc(G.label)}<span class="sep">·</span>${esc(G.effective)} ${esc(d.effective)}</p>
    <h1 class="statement" style="margin-top:18px">${esc(d.title)}</h1>
    ${G.note ? `<p class="small" style="margin-top:16px">${esc(G.note)} <a class="text-link" style="min-height:0" href="/${key}/" hreflang="en">English</a></p>` : ''}
  </div>
</section>
<section class="section-tight" style="padding-top:0"><div class="wrap read"><article class="prose">${body}</article><div style="height:80px"></div></div></section>`;
    write(p, page({ S, path: p, alternateKey: key, title: `${d.title} | LoveType`, description: d.desc, family: 'profile', jsonld: [crumbJson(items)], main }));
  }
}

// ── Sitemap, robots, llms.txt, manifest ──────────────────────────────────────
export function buildMeta(paths, langs = ['en']) {
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">
${paths.map((p) => {
  const key = Object.keys(LOCALIZED_KEYS).find((k) => langs.some((l) => localPath(l, k) === p));
  const alt = key && langs.length > 1 ? langs.map((l) => `\n    <xhtml:link rel="alternate" hreflang="${LANGS[l].hreflang}" href="${url(localPath(l, key))}"/>`).join('') + `\n    <xhtml:link rel="alternate" hreflang="x-default" href="${url(localPath('en', key))}"/>` : '';
  return `  <url><loc>${url(p)}</loc><lastmod>${UPDATED}</lastmod>${alt}${alt ? '\n  ' : ''}</url>`;
}).join('\n')}
</urlset>
`;
  fs.writeFileSync(path.join(ROOT, 'sitemap.xml'), xml);
  fs.writeFileSync(path.join(ROOT, 'robots.txt'), `User-agent: *\nAllow: /\nDisallow: /scripts/\n\nSitemap: ${SITE}/sitemap.xml\n`);
  fs.writeFileSync(path.join(ROOT, 'site.webmanifest'), JSON.stringify({
    name: 'LoveType', short_name: 'LoveType', start_url: '/', display: 'browser', background_color: '#0E0910', theme_color: '#0E0910',
    icons: [{ src: '/assets/icon-192.png', sizes: '192x192', type: 'image/png' }, { src: '/assets/icon-512.png', sizes: '512x512', type: 'image/png' }],
  }, null, 1) + '\n');

  const line = (t, p, d) => `- [${t}](${url(p)})${d ? `: ${d}` : ''}`;
  const llms = `# LoveType

> LoveType is an iPhone app (free to start, no account) with three short relationship tests: Attachment Style (24 questions, about 4 minutes), Love Style (18 questions, about 3 minutes) and Conflict Style (24 questions, about 4 minutes). The three results combine into one of ten LoveTypes. Version 1.2 adds partner comparison with a four-character share code (free, no compatibility score), a dating-profile playbook and a Love Manual. Available in English, Spanish, Brazilian Portuguese, Japanese, Traditional Chinese and Indonesian. A one-time purchase unlocks the full guide; there is no subscription. Answers stay on the device. LoveType is for self-reflection, not diagnosis or therapy.

App Store: ${APP_STORE}

## Styles
${['attachment', 'love', 'conflict'].map((dim) => [line(DIMENSIONS[dim].plural, `/${DIMENSIONS[dim].path}/`, DIMENSIONS[dim].hubAnswer.split('. ')[0] + '.'), ...DIMENSIONS[dim].order.map((k) => line(`${TYPES[dim][k].short} (${TYPES[dim][k].label})`, TYPES[dim][k].path))].join('\n')).join('\n')}

## LoveTypes
${line('The 10 LoveTypes', '/lovetypes/')}
${ARCHETYPES.order.map((k) => line(ARCH[k].label, ARCH[k].path, ARCH[k].tagline)).join('\n')}

## Together
${line('Compatibility (52 pairings)', '/compatibility/', 'where two styles connect, where friction shows up, what helps')}
${line('Compare with a partner', '/compare/')}
${line('Dating-profile playbook', '/dating-profile-playbook/')}

## Optional
${line('Journal', '/journal/')}
${line('Privacy Policy', '/privacy/')}
${line('Terms of Use', '/terms/')}
`;
  fs.writeFileSync(path.join(ROOT, 'llms.txt'), llms);
}
