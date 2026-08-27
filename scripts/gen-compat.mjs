import fs from 'fs';
import path from 'path';

// ── Generates /compatibility (hub + 52 pairing pages) and rewrites sitemap.xml.
// Source content is the PAGES_* arrays below (adapted to third person from the
// LoveType app's compare.pairs data). Run from repo root: node scripts/gen-compat.mjs
// Output HTML is committed.

const OUT = path.resolve(path.dirname(new URL(import.meta.url).pathname), '..');
const APP_STORE = 'https://apps.apple.com/us/app/lovetype-relationship-test/id6786477464';
const DATE = '2026-08-27';
const DATE_HUMAN = 'August 2026';

const esc = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
const escAttr = (s) => esc(s).replace(/"/g, '&quot;');
const art = (w) => (/^[aeiou]/i.test(w) ? 'an' : 'a');

// ── Dimension config ─────────────────────────────────────────────────────────
const DIM = {
  attachment: {
    eyebrow: 'Attachment pairing',
    noun: 'attachment', Noun: 'Attachment',
    describes: 'Attachment style describes how a person seeks safety and closeness in a relationship. It is not a personality type and not a verdict on a couple.',
    label: { Secure: 'Secure', Anxious: 'Anxious', Avoidant: 'Avoidant', FearfulAvoidant: 'Fearful-Avoidant' },
    slug: { Secure: 'secure', Anxious: 'anxious', Avoidant: 'avoidant', FearfulAvoidant: 'fearful-avoidant' },
    blurb: {
      Secure: 'Brings calm and consistency, is comfortable with closeness without losing themselves, and can stay present through a hard conversation.',
      Anxious: 'Loves with their whole self and reads every shift in tone. Fully present when secure; under stress, feels an urgent pull to close any gap and confirm the connection is intact.',
      Avoidant: 'Values independence and has learned to handle things alone. Cares deeply but shows it quietly, and needs room when closeness intensifies.',
      FearfulAvoidant: 'Wants deep connection and fears it at the same time. Moves toward closeness, then pulls back when vulnerability starts to feel dangerous.',
    },
  },
  love: {
    eyebrow: 'Love style pairing',
    noun: 'love style', Noun: 'Love style',
    describes: 'Love style describes how a person gives and recognises affection. It is not a ranking of couples, and every combination can work.',
    label: { Words: 'words of affirmation', Time: 'quality time', Touch: 'physical touch', Acts: 'acts of service', Symbols: 'thoughtful gifts', Experiences: 'shared experiences' },
    slug: { Words: 'words-of-affirmation', Time: 'quality-time', Touch: 'physical-touch', Acts: 'acts-of-service', Symbols: 'thoughtful-gifts', Experiences: 'shared-experiences' },
    blurb: {
      Words: 'Gives and receives love through language — saying it, out loud and specifically. Silence where words should be can feel like absence.',
      Time: 'Feels loved through undivided, unhurried attention. Not how much time, but whether someone is truly there when they are.',
      Touch: 'Connects through physical closeness — a hand on the back, a long hug, sitting close. Affection is not optional; it is how they know they are wanted.',
      Acts: 'Shows love by doing — handling the hard thing, taking something off the other person’s plate, being reliably there in practical ways.',
      Symbols: 'Notices and remembers the small things, and is moved by thoughtful gestures — not for their cost, but for the attention behind them.',
      Experiences: 'Feels closest during shared moments — a trip, a concert, something neither would have done alone. Love lives in things worth remembering.',
    },
  },
  conflict: {
    eyebrow: 'Conflict style pairing',
    noun: 'conflict style', Noun: 'Conflict style',
    describes: 'Conflict style describes what a person does when a disagreement gets difficult. It is a tendency, not a fault, and no combination is doomed.',
    label: { Pursuer: 'pursuer', Withdrawer: 'withdrawer', Fixer: 'fixer', Peacekeeper: 'peacekeeper', Defender: 'defender', Processor: 'processor' },
    slug: { Pursuer: 'pursuer', Withdrawer: 'withdrawer', Fixer: 'fixer', Peacekeeper: 'peacekeeper', Defender: 'defender', Processor: 'processor' },
    blurb: {
      Pursuer: 'Needs to address a problem now. Letting tension sit unresolved hurts more than the conflict itself, and a partner going quiet can feel like withdrawn love.',
      Withdrawer: 'Needs to step back when conflict rises — not to avoid it, but to keep from saying something they’ll regret. Returns calmer and clearer once given space.',
      Fixer: 'Wants to identify the issue, propose a solution and get to the other side. Sitting in the feeling without working toward a fix is hard; fixing is how their care shows up.',
      Peacekeeper: 'Works hard to keep the peace — absorbing what they feel, agreeing when they don’t quite, smoothing things over. What goes unspoken tends to accumulate.',
      Defender: 'When they feel criticised or unfairly blamed, defends their case first. Can hear feedback — but not until they’ve had the chance to explain themselves.',
      Processor: 'Needs time before responding to conflict, so what they say is considered rather than reactive. The deepest insights arrive later than the argument.',
    },
  },
};

// ── SVGs / shared blocks ─────────────────────────────────────────────────────
const APPLE_SVG_13 = '<svg width="13" height="13" viewBox="0 0 384 512" fill="currentColor" aria-hidden="true"><path d="M318.7 268.7c-.2-36.7 16.4-64.4 50-84.8-18.8-26.9-47.2-41.7-84.7-44.6-35.5-2.8-74.3 20.7-88.5 20.7-15 0-49.4-19.7-76.4-19.7C63.3 141.2 4 184.8 4 273.5q0 39.3 14.4 81.2c12.8 36.7 59 126.7 107.2 125.2 25.2-.6 43-17.9 75.8-17.9 31.8 0 48.3 17.9 76.4 17.9 48.6-.7 90.4-82.5 102.6-119.3-65.2-30.7-61.7-90-61.7-91.9zm-56.6-164.2c27.3-32.4 24.8-61.9 24-72.5-24.1 1.4-52 16.4-67.9 34.9-17.5 19.8-27.8 44.3-25.6 71.9 26.1 2 49.9-11.4 69.5-34.3z"/></svg>';
const APPLE_SVG_16 = APPLE_SVG_13.replace('width="13" height="13"', 'width="16" height="16"');
const MARK = `<svg class="nav-mark" viewBox="0 0 26 26" fill="none" aria-hidden="true">
      <circle cx="13" cy="13" r="11.5" stroke="#C07090" stroke-width="1.1" opacity="0.85"/>
      <circle cx="13" cy="13" r="7.6" stroke="#A080C0" stroke-width="1.1" opacity="0.85"/>
      <circle cx="13" cy="13" r="4" stroke="#7080C0" stroke-width="1.1" opacity="0.85"/>
      <circle cx="13" cy="13" r="1.8" fill="#C9A96E"/>
    </svg>`;
const MARK_FOOT = MARK.replace('class="nav-mark"', 'width="22" height="22"');

const NAV = `<nav class="site-nav">
  <a href="/" class="nav-brand" aria-label="LoveType home">
    ${MARK}
    <span class="serif nav-logo">LoveType</span>
  </a>
  <div class="nav-links">
    <div class="nav-links nav-links-full">
      <a href="/#dimensions">Tests</a>
      <a href="/#how-it-works">How it works</a>
      <a href="/compatibility">Compatibility</a>
      <a href="/#faq">FAQ</a>
    </div>
    <a href="${APP_STORE}" target="_blank" rel="noopener" class="nav-btn" aria-label="Download LoveType on the App Store">
      ${APPLE_SVG_13}
      App Store
    </a>
  </div>
</nav>`;

const FOOTER = `<footer>
  <div class="wrap">
    <div class="foot-top">
      <div>
        <a href="/" class="foot-brand" aria-label="LoveType home">
          ${MARK_FOOT}
          <span class="serif foot-logo">LoveType</span>
        </a>
        <p class="foot-tag">A relationship self-reflection app.</p>
      </div>
      <nav class="foot-links" aria-label="Footer">
        <a href="/#dimensions">Tests</a>
        <a href="/#how-it-works">How it works</a>
        <a href="/compatibility">Compatibility</a>
        <a href="/privacy">Privacy</a>
        <a href="/terms">Terms</a>
        <a href="mailto:privacy@love-type.app">Contact</a>
      </nav>
    </div>
    <div class="foot-bottom">
      <span>© 2026 LoveType. All rights reserved.</span>
      <span>Not a substitute for professional or medical advice.</span>
    </div>
  </div>
</footer>`;

const PAGE_CSS = `<style>
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  :root {
    --bg:#0E0910; --bg2:#160E1E; --bg3:#1F1529; --text:#F5EEF2; --text2:#A08898; --text3:#6B5060;
    --rose:#C07090; --rose-lt:#DDA0B8; --violet:#A080C0; --blue-vlt:#7080C0;
    --champagne:#C9A96E; --champagne-lt:#E0C080; --blush:#E8C8D8; --plum:#8B5E80;
    --surf:rgba(255,240,250,0.055); --surf-el:rgba(255,240,250,0.085);
    --bord:rgba(255,220,240,0.09); --bord-s:rgba(255,220,240,0.16);
  }
  html { scroll-behavior: smooth; }
  body { background: var(--bg); color: var(--text); font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif; line-height: 1.6; overflow-x: hidden; -webkit-font-smoothing: antialiased; }
  .serif { font-family: 'DM Serif Display', Georgia, serif; }
  a { color: inherit; }
  img, svg { display: block; max-width: 100%; }
  .wrap { max-width: 1180px; margin: 0 auto; padding: 0 32px; }
  .site-nav { position: fixed; top: 0; left: 0; right: 0; z-index: 100; display: flex; align-items: center; justify-content: space-between; padding: 18px 32px; background: linear-gradient(to bottom, rgba(14,9,16,0.92) 55%, transparent); backdrop-filter: blur(14px); -webkit-backdrop-filter: blur(14px); }
  .nav-brand { display: flex; align-items: center; gap: 9px; text-decoration: none; }
  .nav-mark { width: 26px; height: 26px; flex-shrink: 0; }
  .nav-logo { font-size: 20px; letter-spacing: -0.2px; color: var(--blush); }
  .nav-links { display: flex; align-items: center; gap: 28px; }
  .nav-links a:not(.nav-btn) { font-size: 14px; color: var(--text2); text-decoration: none; transition: color .2s; }
  .nav-links a:not(.nav-btn):hover { color: var(--text); }
  .nav-btn { display: inline-flex; align-items: center; gap: 7px; padding: 9px 20px; border-radius: 100px; background: var(--champagne); color: #0E0910; font-size: 13px; font-weight: 600; letter-spacing: 0.2px; text-decoration: none; transition: background .2s, transform .15s; }
  .nav-btn:hover { background: var(--champagne-lt); transform: translateY(-1px); }
  main.article-main { padding: 128px 0 80px; }
  .article-wrap { max-width: 720px; margin: 0 auto; padding: 0 24px; }
  .breadcrumb { font-size: 13px; color: var(--text3); margin-bottom: 22px; display: flex; flex-wrap: wrap; gap: 6px; align-items: center; }
  .breadcrumb a { color: var(--text3); text-decoration: none; transition: color .2s; }
  .breadcrumb a:hover { color: var(--text2); }
  .breadcrumb span[aria-current] { color: var(--text2); }
  .back-link { display: inline-flex; align-items: center; gap: 6px; font-size: 13.5px; color: var(--text2); text-decoration: none; margin-bottom: 28px; transition: color .2s; }
  .back-link:hover { color: var(--text); }
  .article-eyebrow { font-size: 12px; font-weight: 600; letter-spacing: 2.2px; text-transform: uppercase; color: var(--champagne); margin-bottom: 18px; display: block; }
  .article-title { font-size: clamp(30px, 5vw, 46px); line-height: 1.13; letter-spacing: -0.7px; color: var(--text); margin-bottom: 18px; }
  .article-updated { font-size: 13.5px; color: var(--text3); margin-bottom: 44px; padding-bottom: 28px; border-bottom: 1px solid var(--bord); }
  .article-lede { font-size: 18px; color: var(--text2); line-height: 1.7; margin-bottom: 8px; }
  .prose { font-size: 16.5px; line-height: 1.75; color: var(--text); }
  .prose > * + * { margin-top: 22px; }
  .prose h2 { font-family: 'DM Serif Display', Georgia, serif; font-size: clamp(23px, 3vw, 29px); letter-spacing: -0.4px; line-height: 1.22; color: var(--text); margin-top: 54px; margin-bottom: 4px; }
  .prose h2:first-of-type { margin-top: 44px; }
  .prose h3 { font-size: 18px; font-weight: 600; letter-spacing: -0.1px; color: var(--rose-lt); margin-top: 32px; margin-bottom: 2px; }
  .prose p { color: var(--text2); }
  .prose p strong, .prose p b { color: var(--text); font-weight: 600; }
  .prose a.inline-link { color: var(--champagne-lt); text-decoration: underline; text-underline-offset: 3px; font-weight: 500; transition: color .2s; }
  .prose a.inline-link:hover { color: var(--champagne); }
  .pair-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 14px; margin-top: 24px; }
  .pair-card { border: 1px solid var(--bord); border-radius: 14px; background: var(--surf); padding: 18px; }
  .pair-card h3 { margin: 0 0 6px; color: var(--rose-lt); font-size: 16px; }
  .pair-card p { margin: 0; font-size: 14.5px; line-height: 1.6; color: var(--text2); }
  .lens { border: 1px solid var(--bord); border-radius: 14px; background: var(--surf); padding: 18px 20px; margin-top: 18px; }
  .lens .lens-label { font-size: 12px; font-weight: 600; letter-spacing: 1.4px; text-transform: uppercase; color: var(--champagne); display: block; margin-bottom: 6px; }
  .lens p { margin: 0; color: var(--text2); }
  .article-cta { margin-top: 56px; padding: 32px 28px; border-radius: 20px; border: 1px solid var(--bord); background: var(--surf); text-align: center; }
  .article-cta h2 { margin-top: 0 !important; margin-bottom: 10px !important; }
  .article-cta p { color: var(--text2); margin-bottom: 22px; }
  .btn-gold { display: inline-flex; align-items: center; gap: 9px; padding: 15px 26px; border-radius: 14px; background: linear-gradient(135deg, var(--champagne-lt), var(--champagne)); color: #14100A; font-size: 15px; font-weight: 700; letter-spacing: 0.2px; text-decoration: none; box-shadow: 0 10px 30px -8px rgba(201,169,110,0.45); transition: transform .18s ease, box-shadow .18s ease; }
  .btn-gold:hover { transform: translateY(-2px); box-shadow: 0 14px 36px -8px rgba(201,169,110,0.55); }
  .related { margin-top: 52px; padding-top: 28px; border-top: 1px solid var(--bord); }
  .related h2 { font-family: 'DM Serif Display', Georgia, serif; font-size: 22px; margin-bottom: 14px; }
  .related ul { list-style: none; padding: 0; display: flex; flex-wrap: wrap; gap: 10px; }
  .related a { font-size: 14px; color: var(--text2); text-decoration: none; border: 1px solid var(--bord); border-radius: 100px; padding: 8px 16px; transition: color .2s, border-color .2s; }
  .related a:hover { color: var(--text); border-color: var(--bord-s); }
  footer { border-top: 1px solid var(--bord); padding: 56px 0 40px; }
  .foot-top { display: flex; justify-content: space-between; align-items: flex-start; flex-wrap: wrap; gap: 32px; margin-bottom: 40px; }
  .foot-brand { display: flex; align-items: center; gap: 10px; text-decoration: none; }
  .foot-logo { font-size: 19px; color: var(--blush); }
  .foot-tag { font-size: 13.5px; color: var(--text3); margin-top: 8px; }
  .foot-links { display: flex; gap: 28px; flex-wrap: wrap; }
  .foot-links a { font-size: 14px; color: var(--text2); text-decoration: none; }
  .foot-links a:hover { color: var(--text); }
  .foot-bottom { display: flex; justify-content: space-between; flex-wrap: wrap; gap: 12px; font-size: 12.5px; color: var(--text3); border-top: 1px solid var(--bord); padding-top: 24px; }
  @media (max-width: 900px) { .nav-links-full { display: none; } }
  @media (max-width: 560px) {
    main.article-main { padding-top: 108px; }
    .article-wrap { padding: 0 20px; }
    .article-cta { padding: 26px 20px; }
    .pair-grid { grid-template-columns: 1fr; }
  }
</style>`;

// ── page content ─────────────────────────────────────────────────────────────
// Each: { dim, left, right, slug, sameType?, lede, connect, friction, tips (obj or string), faqs:[{q,a}] }
import { PAGES } from './compat-content.mjs';

const bySlug = (dim, slug) => `/compatibility/${slug}`;
const SMALL = new Set(['of', 'and', 'the', 'a', 'an', 'for', 'to', 'in', 'with', 'on']);
const cap = (s) => s.split(/(\s|-)/).map((w, i) => {
  if (w === ' ' || w === '-') return w;
  return (i > 0 && SMALL.has(w.toLowerCase())) ? w.toLowerCase() : w.charAt(0).toUpperCase() + w.slice(1);
}).join('');
function titleOf(p) {
  const L = DIM[p.dim].label;
  return p.sameType ? `Two ${cap(L[p.left])} Partners` : `${cap(L[p.left])} and ${cap(L[p.right])}`;
}
function h1Of(p) {
  const L = DIM[p.dim].label;
  if (p.dim === 'attachment') return p.sameType ? `Two ${cap(L[p.left])} Partners` : `${cap(L[p.left])} and ${cap(L[p.right])} Attachment`;
  return p.sameType ? `Two ${cap(L[p.left])} Partners` : `${cap(L[p.left])} and ${cap(L[p.right])}`;
}
function pageTitleOf(p) {
  const d = DIM[p.dim]; const t = titleOf(p);
  if (p.dim === 'attachment') return p.sameType ? `${t}: How ${DIM.attachment.label[p.left]}–${DIM.attachment.label[p.left]} Attachment Works` : `${t} Attachment: How the Pairing Works`;
  if (p.dim === 'love') return `${t}: Love Style Compatibility`;
  return `${t}: Conflict Style Compatibility`;
}

function relatedLinks(p, allInDim) {
  const others = allInDim.filter((x) => x.slug !== p.slug).slice(0, 4);
  return others.map((x) => `<li><a href="${bySlug(x.dim, x.slug)}">${esc(titleOf(x))}</a></li>`).join('\n            ')
    + `\n            <li><a href="/compatibility">All pairings</a></li>`;
}

function pageHtml(p, allInDim) {
  const d = DIM[p.dim];
  const L = d.label;
  const url = `https://love-type.app${bySlug(p.dim, p.slug)}`;
  const title = pageTitleOf(p);
  const metaDesc = p.sameType
    ? `Where two ${L[p.left]} partners connect, where the friction shows up, and one thing that helps.`
    : `Where the ${L[p.left]} and ${L[p.right]} ${d.noun}s connect, where friction shows up, and what each partner can try.`;

  const articleJson = { '@context': 'https://schema.org', '@type': 'Article', headline: title, description: metaDesc, about: `${L[p.left]} ${L[p.right]} ${d.noun} compatibility`, inLanguage: 'en', datePublished: DATE, dateModified: DATE, author: { '@type': 'Organization', name: 'LoveType', url: 'https://love-type.app' }, publisher: { '@type': 'Organization', name: 'LoveType', url: 'https://love-type.app' }, mainEntityOfPage: url };
  const faqJson = { '@context': 'https://schema.org', '@type': 'FAQPage', mainEntity: p.faqs.map((f) => ({ '@type': 'Question', name: f.q, acceptedAnswer: { '@type': 'Answer', text: f.a } })) };
  const crumbJson = { '@context': 'https://schema.org', '@type': 'BreadcrumbList', itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://love-type.app/' },
    { '@type': 'ListItem', position: 2, name: 'Compatibility', item: 'https://love-type.app/compatibility' },
    { '@type': 'ListItem', position: 3, name: titleOf(p), item: url },
  ] };

  const tipsBlock = p.sameType
    ? `<div class="lens"><span class="lens-label">For both partners</span><p>${esc(p.tips)}</p></div>`
    : `<div class="lens"><span class="lens-label">If you are the ${L[p.left]} partner</span><p>${esc(p.tips[p.left])}</p></div>
        <div class="lens"><span class="lens-label">If you are the ${L[p.right]} partner</span><p>${esc(p.tips[p.right])}</p></div>`;

  let introMeet;
  if (p.dim === 'attachment') {
    introMeet = p.sameType
      ? `two ${L[p.left].toLowerCase()} partners are together`
      : `${art(L[p.left])} ${L[p.left].toLowerCase()} and ${art(L[p.right])} ${L[p.right].toLowerCase()} style meet`;
  } else if (p.dim === 'love') {
    introMeet = p.sameType
      ? `both partners lead with ${L[p.left]}`
      : `one partner leads with ${L[p.left]} and the other with ${L[p.right]}`;
  } else {
    introMeet = p.sameType
      ? `both partners are ${L[p.left]}s in conflict`
      : `${art(L[p.left])} ${L[p.left]} and ${art(L[p.right])} ${L[p.right]} are in the same relationship`;
  }

  const stylesBlock = p.sameType
    ? `<div class="pair-grid" style="grid-template-columns:1fr;">
          <div class="pair-card"><h3>Both partners</h3><p>${esc(d.blurb[p.left])} In this pairing, both people bring that same set of strengths — and the same blind spots, which is where the friction below comes from.</p></div>
        </div>`
    : `<div class="pair-grid">
          <div class="pair-card"><h3>The ${L[p.left]} partner</h3><p>${esc(d.blurb[p.left])}</p></div>
          <div class="pair-card"><h3>The ${L[p.right]} partner</h3><p>${esc(d.blurb[p.right])}</p></div>
        </div>`;

  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>${esc(title)}</title>
<meta name="description" content="${escAttr(metaDesc)}">
<link rel="canonical" href="${url}">
<meta name="robots" content="index, follow">
<meta name="theme-color" content="#0E0910">
<meta property="og:type" content="article">
<meta property="og:url" content="${url}">
<meta property="og:title" content="${escAttr(title)}">
<meta property="og:description" content="${escAttr(metaDesc)}">
<meta property="og:image" content="https://love-type.app/assets/og-image.png">
<meta property="og:image:width" content="1200">
<meta property="og:image:height" content="630">
<meta property="og:site_name" content="LoveType">
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="${escAttr(title)}">
<meta name="twitter:description" content="${escAttr(metaDesc)}">
<meta name="twitter:image" content="https://love-type.app/assets/og-image.png">
<link rel="icon" type="image/svg+xml" href="/assets/favicon.svg">
<link rel="icon" type="image/png" sizes="32x32" href="/assets/favicon-32.png">
<link rel="apple-touch-icon" href="/assets/apple-touch-icon.png">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@0;1&family=Inter:ital,wght@0,400;0,500;0,600;0,700;1,400&display=swap" rel="stylesheet">
<script type="application/ld+json">
${JSON.stringify(articleJson, null, 2)}
</script>
<script type="application/ld+json">
${JSON.stringify(faqJson, null, 2)}
</script>
<script type="application/ld+json">
${JSON.stringify(crumbJson, null, 2)}
</script>
${PAGE_CSS}
</head>
<body>
${NAV}
<main class="article-main">
  <div class="article-wrap">
    <nav class="breadcrumb" aria-label="Breadcrumb">
      <a href="/">Home</a>
      <span aria-hidden="true">/</span>
      <a href="/compatibility">Compatibility</a>
      <span aria-hidden="true">/</span>
      <span aria-current="page">${esc(titleOf(p))}</span>
    </nav>
    <a href="/compatibility" class="back-link">&larr; All pairings</a>
    <article>
      <span class="article-eyebrow">${d.eyebrow}</span>
      <h1 class="serif article-title">${esc(h1Of(p))}</h1>
      <p class="article-updated">Updated ${DATE_HUMAN}</p>
      <div class="prose">
        <p class="article-lede">${esc(p.lede)}</p>
        <p>${d.describes} What follows is the pattern that tends to show up when ${introMeet} — where the two fit easily, where they predictably rub, and one concrete thing each partner can do about it.</p>

        <h2 class="serif">${p.sameType ? 'The ' + L[p.left] + ' style' : 'The two styles'}</h2>
        ${stylesBlock}

        <h2 class="serif">Where the two connect</h2>
        <p>${esc(p.connect)}</p>

        <h2 class="serif">Where the friction shows up</h2>
        <p>${esc(p.friction)}</p>

        <h2 class="serif">What each partner can try</h2>
        ${tipsBlock}

        <h2 class="serif">A pattern, not a verdict</h2>
        <p>Two people are always more than their ${d.noun}s. This pairing is not a score, and a difficult stretch does not mean the relationship is mismatched. Used well, a label helps each person recognise their own reaction earlier and choose a different response — it is not a reason to explain away a partner’s behaviour or to stay somewhere that does not feel safe.</p>

        <h2 class="serif">Common questions</h2>
        ${p.faqs.map((f) => `<h3>${esc(f.q)}</h3>\n        <p>${esc(f.a)}</p>`).join('\n        ')}

        <div class="article-cta">
          <h2 class="serif">See this for your own relationship</h2>
          <p>Take LoveType’s three short tests, then compare results with your partner. The app reads both of your attachment, love and conflict styles and shows where you click and where you grind — for your specific pair.</p>
          <a href="${APP_STORE}" target="_blank" rel="noopener" class="btn-gold" style="text-decoration:none;">${APPLE_SVG_16} Get LoveType</a>
        </div>

        <div class="related">
          <h2 class="serif">Other ${d.noun} pairings</h2>
          <ul>
            ${relatedLinks(p, allInDim)}
          </ul>
        </div>

        <p style="margin-top:36px;font-size:14.5px;">Related reading: <a href="/journal/attachment-style-vs-personality-type" class="inline-link">attachment style vs personality type</a>.</p>
      </div>
    </article>
  </div>
</main>
${FOOTER}
</body>
</html>
`;
}

// ── hub ──────────────────────────────────────────────────────────────────────
function hubSection(dim, klass, heading, sub) {
  const pages = PAGES.filter((p) => p.dim === dim);
  const items = pages.map((p) => `        <a href="${bySlug(p.dim, p.slug)}">${esc(titleOf(p))} <span class="arrow">&rarr;</span></a>`).join('\n');
  return `    <section class="dim ${klass}">
      <h2 class="serif">${heading}</h2>
      <p class="dim-sub">${sub}</p>
      <div class="pair-list">
${items}
      </div>
    </section>`;
}

function hubHtml() {
  const HUB_CSS = PAGE_CSS
    .replace('main.article-main { padding: 128px 0 80px; }', 'main { padding: 128px 0 80px; }')
    .replace('.article-wrap { max-width: 720px; margin: 0 auto; padding: 0 24px; }', '.hub-wrap { max-width: 820px; margin: 0 auto; padding: 0 24px; }')
    + `<style>
  .hub-eyebrow { font-size: 12px; font-weight: 600; letter-spacing: 2.2px; text-transform: uppercase; color: var(--champagne); margin-bottom: 18px; display: block; }
  h1.hub-title { font-size: clamp(32px, 5vw, 46px); line-height: 1.14; letter-spacing: -0.8px; color: var(--text); margin-bottom: 18px; }
  .hub-lede { font-size: 18px; color: var(--text2); line-height: 1.7; margin-bottom: 14px; }
  .hub-note { font-size: 15px; color: var(--text2); line-height: 1.7; padding-bottom: 34px; border-bottom: 1px solid var(--bord); margin-bottom: 8px; }
  .dim { margin-top: 48px; }
  .dim h2 { font-family: 'DM Serif Display', Georgia, serif; font-size: 26px; letter-spacing: -0.3px; margin-bottom: 4px; }
  .dim .dim-sub { font-size: 14.5px; color: var(--text3); margin-bottom: 18px; }
  .dim.attachment h2 { color: var(--rose-lt); }
  .dim.love h2 { color: var(--violet); }
  .dim.conflict h2 { color: var(--blue-vlt); }
  .pair-list { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; }
  .pair-list a { display: flex; align-items: center; justify-content: space-between; border: 1px solid var(--bord); border-radius: 12px; background: var(--surf); padding: 14px 16px; font-size: 14.5px; color: var(--text); text-decoration: none; transition: border-color .2s, background .2s; }
  .pair-list a:hover { border-color: var(--bord-s); background: var(--surf-el); }
  .pair-list a .arrow { color: var(--champagne); font-size: 13px; }
  @media (max-width: 560px) { .pair-list { grid-template-columns: 1fr; } }
</style>`;
  const collJson = { '@context': 'https://schema.org', '@type': 'CollectionPage', name: 'Relationship Compatibility by Attachment, Love & Conflict Style', description: 'How the attachment, love and conflict styles pair up — where each combination connects, where it grinds, and what each partner can try.', inLanguage: 'en', url: 'https://love-type.app/compatibility', isPartOf: { '@type': 'WebSite', name: 'LoveType', url: 'https://love-type.app' } };
  const crumbJson = { '@context': 'https://schema.org', '@type': 'BreadcrumbList', itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://love-type.app/' },
    { '@type': 'ListItem', position: 2, name: 'Compatibility', item: 'https://love-type.app/compatibility' },
  ] };
  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Relationship Compatibility by Attachment, Love &amp; Conflict Style | LoveType</title>
<meta name="description" content="How the attachment, love and conflict styles pair up — where each combination connects, where it grinds, and what each partner can try. A pattern, not a score.">
<link rel="canonical" href="https://love-type.app/compatibility">
<meta name="robots" content="index, follow">
<meta name="theme-color" content="#0E0910">
<meta property="og:type" content="website">
<meta property="og:url" content="https://love-type.app/compatibility">
<meta property="og:title" content="Relationship Compatibility by Attachment, Love &amp; Conflict Style">
<meta property="og:description" content="How the attachment, love and conflict styles pair up — where each combination connects, where it grinds, and what each partner can try.">
<meta property="og:image" content="https://love-type.app/assets/og-image.png">
<meta property="og:image:width" content="1200">
<meta property="og:image:height" content="630">
<meta property="og:site_name" content="LoveType">
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="Relationship Compatibility by Attachment, Love &amp; Conflict Style">
<meta name="twitter:description" content="How the attachment, love and conflict styles pair up — where each combination connects and where it grinds.">
<meta name="twitter:image" content="https://love-type.app/assets/og-image.png">
<link rel="icon" type="image/svg+xml" href="/assets/favicon.svg">
<link rel="icon" type="image/png" sizes="32x32" href="/assets/favicon-32.png">
<link rel="apple-touch-icon" href="/assets/apple-touch-icon.png">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@0;1&family=Inter:ital,wght@0,400;0,500;0,600;0,700;1,400&display=swap" rel="stylesheet">
<script type="application/ld+json">
${JSON.stringify(collJson, null, 2)}
</script>
<script type="application/ld+json">
${JSON.stringify(crumbJson, null, 2)}
</script>
${HUB_CSS}
</head>
<body>
${NAV}
<main>
  <div class="hub-wrap">
    <nav class="breadcrumb" aria-label="Breadcrumb">
      <a href="/">Home</a>
      <span aria-hidden="true">/</span>
      <span aria-current="page">Compatibility</span>
    </nav>
    <span class="hub-eyebrow">Compatibility</span>
    <h1 class="serif hub-title">How the styles pair up</h1>
    <p class="hub-lede">Every combination of attachment, love and conflict style has a shape: somewhere the two people fit without trying, and somewhere they predictably grind.</p>
    <p class="hub-note">These are patterns, not scores. There is no percentage and no ranking here — a "hard" pairing is not a doomed one, and an "easy" pairing still takes effort. Each page covers where a combination connects, where the friction shows up, and one concrete thing each partner can try.</p>

${hubSection('attachment', 'attachment', 'Attachment style', 'How each person seeks safety and closeness.')}

${hubSection('love', 'love', 'Love style', 'How each person gives and recognises affection.')}

${hubSection('conflict', 'conflict', 'Conflict style', 'How each person moves when things get hard.')}

    <div class="article-cta">
      <h2 class="serif">Compare your actual results</h2>
      <p>Take LoveType’s three short tests, then compare with your partner. The app reads both of your styles and shows this for your specific pair — all three dimensions at once.</p>
      <a href="${APP_STORE}" target="_blank" rel="noopener" class="btn-gold" style="text-decoration:none;">${APPLE_SVG_16} Get LoveType</a>
    </div>
  </div>
</main>
${FOOTER}
</body>
</html>
`;
}

// ── write ────────────────────────────────────────────────────────────────────
const byDim = { attachment: PAGES.filter(p=>p.dim==='attachment'), love: PAGES.filter(p=>p.dim==='love'), conflict: PAGES.filter(p=>p.dim==='conflict') };
for (const p of PAGES) {
  const dir = path.join(OUT, 'compatibility', p.slug);
  fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(path.join(dir, 'index.html'), pageHtml(p, byDim[p.dim]));
}
fs.writeFileSync(path.join(OUT, 'compatibility', 'index.html'), hubHtml());
console.log(`wrote ${PAGES.length} pairing pages + hub`);

const sitemapUrls = [
  { loc: 'https://love-type.app/', cf: 'monthly', pr: '1.0' },
  { loc: 'https://love-type.app/compatibility', cf: 'weekly', pr: '0.8' },
  ...PAGES.map((p) => ({ loc: `https://love-type.app${bySlug(p.dim, p.slug)}`, cf: 'monthly', pr: '0.7' })),
  { loc: 'https://love-type.app/journal/attachment-style-vs-personality-type', cf: 'monthly', pr: '0.8' },
  { loc: 'https://love-type.app/privacy', cf: 'yearly', pr: '0.3' },
  { loc: 'https://love-type.app/terms', cf: 'yearly', pr: '0.3' },
];
fs.writeFileSync(path.join(OUT, 'sitemap.xml'), `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${sitemapUrls.map((u) => `  <url>\n    <loc>${u.loc}</loc>\n    <changefreq>${u.cf}</changefreq>\n    <priority>${u.pr}</priority>\n  </url>`).join('\n')}
</urlset>
`);
console.log(`sitemap: ${sitemapUrls.length} urls`);
