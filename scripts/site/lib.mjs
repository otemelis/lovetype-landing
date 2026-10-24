// Shared page shell for every generated page: head (SEO, social, schema), glass, header,
// footer. Pages pass their own <main> content.

import fs from 'fs';
import path from 'path';

export const SITE = 'https://love-type.app';
// Region-neutral App Store link: iOS opens the visitor's own storefront.
export const APP_STORE = 'https://apps.apple.com/app/id6786477464';
export const APP_ID = '6786477464';
export const UPDATED = '2026-10-24';
export const UPDATED_HUMAN = 'October 2026';
export const ROOT = path.resolve(path.dirname(new URL(import.meta.url).pathname), '../..');
export const ASSET_V = '20261024e';

// Localized pages. Only home, compare and legal exist in every language; everything else is English.
export const LANGS = {
  en: { prefix: '/', hreflang: 'en', og: 'en_US', name: 'English' },
  es: { prefix: '/es/', hreflang: 'es', og: 'es_ES', name: 'Español' },
  'pt-BR': { prefix: '/pt-br/', hreflang: 'pt-BR', og: 'pt_BR', name: 'Português' },
  ja: { prefix: '/ja/', hreflang: 'ja', og: 'ja_JP', name: '日本語' },
  'zh-Hant': { prefix: '/zh-hant/', hreflang: 'zh-Hant', og: 'zh_TW', name: '繁體中文' },
  id: { prefix: '/id/', hreflang: 'id', og: 'id_ID', name: 'Bahasa Indonesia' },
};
export const LOCALIZED = { home: '', compare: 'compare/', privacy: 'privacy/', terms: 'terms/' };
export const localPath = (lang, key) => LANGS[lang].prefix + LOCALIZED[key];
let EN = null;
export const setDefaultStrings = (s) => { EN = s; };

export const esc = (s = '') => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
export const attr = (s = '') => esc(s).replace(/"/g, '&quot;');
export const url = (p) => SITE + p;

export const HEART_PATH = 'M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z';
export const heartSvg = (cls = '') => `<svg class="${cls}" viewBox="2 3 20 18.4" aria-hidden="true"><path fill="currentColor" d="${HEART_PATH}"/></svg>`;
export const APPLE = '<svg viewBox="0 0 384 512" aria-hidden="true"><path fill="currentColor" d="M318.7 268.7c-.2-36.7 16.4-64.4 50-84.8-18.8-26.9-47.2-41.7-84.7-44.6-35.5-2.8-74.3 20.7-88.5 20.7-15 0-49.4-19.7-76.4-19.7C63.3 141.2 4 184.8 4 273.5q0 39.3 14.4 81.2c12.8 36.7 59 126.7 107.2 125.2 25.2-.6 43-17.9 75.8-17.9 31.8 0 48.3 17.9 76.4 17.9 48.6-.7 90.4-82.5 102.6-119.3-65.2-30.7-61.7-90-61.7-91.9zm-56.6-164.2c27.3-32.4 24.8-61.9 24-72.5-24.1 1.4-52 16.4-67.9 34.9-17.5 19.8-27.8 44.3-25.6 71.9 26.1 2 49.9-11.4 69.5-34.3z"/></svg>';
export const LOCK = '<svg class="lock" viewBox="0 0 24 24" aria-hidden="true"><path fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" d="M7 10V7.5a5 5 0 0 1 10 0V10M5.5 10h13v10h-13z"/></svg>';
export const ARROW = '<span class="arr" aria-hidden="true">→</span>';

/** The one white pill. `where` tags the click for later analytics. */
export const appPill = (label = EN?.chrome.getFree || 'Get LoveType free', where = 'page', extra = '') =>
  `<a class="pill" href="${APP_STORE}" data-glint data-cta="${where}" ${extra}><span class="glint" aria-hidden="true"><span class="glint-glow"><i></i></span><i class="glint-ring"></i></span>${APPLE}${esc(label)}</a>`;

export const phone = (shot, alt, { w = 720, cls = '', glow = '', lazy = true, dir = '' } = {}) => {
  const b = `/assets/screens/${dir ? dir + '/' : ''}${shot}`;
  return `<div class="phone ${cls}"${glow ? ` style="--glow:${glow}"` : ''}><div class="screen"><img src="${b}-${w}.webp" srcset="${b}-420.webp 420w, ${b}-720.webp 720w" sizes="(max-width: 860px) 64vw, 330px" width="720" height="1565" alt="${attr(alt)}"${lazy ? ' loading="lazy" decoding="async"' : ' fetchpriority="high"'}></div></div>`;
};

export const heart = (reveal = 0.08, cls = '') =>
  `<div class="heart ${cls}" data-reveal="${reveal}" aria-hidden="true"><canvas></canvas>${heartSvg('heart-fallback')}</div>`;

export const crumbs = (items) =>
  `<nav class="crumbs" aria-label="Breadcrumb">${items.map(([name, href], i) => (i < items.length - 1 ? `<a href="${href}">${esc(name)}</a><span aria-hidden="true">/</span>` : `<span aria-current="page">${esc(name)}</span>`)).join('')}</nav>`;

export const crumbJson = (items) => ({
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: items.map(([name, href], i) => ({ '@type': 'ListItem', position: i + 1, name, item: url(href) })),
});

export const faqJson = (faqs) => ({
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: faqs.map((f) => ({ '@type': 'Question', name: f.q, acceptedAnswer: { '@type': 'Answer', text: f.a } })),
});

export const faqBlock = (faqs, heading = 'Questions') => `
  <section class="section-tight" aria-labelledby="faq-h">
    <h2 class="statement-s" id="faq-h">${esc(heading)}</h2>
    <div class="faq">${faqs.map((f) => `<details><summary>${esc(f.q)}</summary><div class="answer"><p>${esc(f.a)}</p></div></details>`).join('')}</div>
  </section>`;

export const closingCard = (title, body, where) => `
  <aside class="closing-card rv">
    <div><h2 class="statement-s">${esc(title)}</h2><p class="body">${esc(body)}</p></div>
    <div>${appPill('Get LoveType free', where)}</div>
  </aside>`;

function header(current, S) {
  const C = S.chrome;
  const en = S.lang === 'en';
  const P = (k) => (en ? `/${k}` : `${S.prefix}${k}`);
  const nav = [
    [C.nav.tests, `${S.prefix}#tests`, false],
    [C.nav.lovetypes, '/lovetypes/', !en],
    [C.nav.compatibility, '/compatibility/', !en],
    [C.nav.compare, P('compare/'), false],
    [C.nav.journal, '/journal/', !en],
  ];
  return `<header class="site-header">
  <div class="bar">
    <a class="brand" href="${S.prefix}" aria-label="${attr(C.home)}">${heartSvg('brand-heart')}<span class="wordmark">LoveType</span></a>
    <nav class="site-nav" id="site-nav" aria-label="Main">${nav.map(([n, h, x]) => `<a href="${h}"${x ? ' hreflang="en"' : ''}${current && !h.includes('#') && h !== '/' && current.startsWith(h) ? ' aria-current="page"' : ''}>${esc(n)}</a>`).join('')}</nav>
    <div class="header-cta">
      <a class="pill pill-s" href="${APP_STORE}" data-cta="header">${APPLE}${esc(C.getApp)}</a>
      <button class="menu-btn" type="button" aria-label="${attr(C.menu)}" aria-expanded="false" aria-controls="site-nav"><span></span></button>
    </div>
  </div>
</header>`;
}

function footer(S, alternateKey) {
  const F = S.chrome.footer;
  const en = S.lang === 'en';
  const x = en ? '' : ' hreflang="en"';
  const P = (k) => (en ? `/${k}` : `${S.prefix}${k}`);
  const col = (title, links) => `<div class="foot-col"><h2>${esc(title)}</h2><ul>${links.map(([n, h, ext]) => `<li><a href="${h}"${ext ? x : ''}>${esc(n)}</a></li>`).join('')}</ul></div>`;
  const langLinks = Object.entries(LANGS).map(([l, L]) => {
    const href = alternateKey ? localPath(l, alternateKey) : L.prefix;
    return `<li><a href="${href}" hreflang="${L.hreflang}" lang="${L.hreflang}" data-lang-switch="${l}"${l === S.lang ? ' aria-current="true"' : ''}>${esc(L.name)}</a></li>`;
  }).join('');
  return `<footer class="site-footer">
  <div class="wrap">
    <div class="foot-grid">
      <div class="foot-brand stack">
        <a class="app" href="${APP_STORE}" data-cta="footer"><img src="/assets/app-icon-128.webp" width="52" height="52" alt="${attr(F.iconAlt)}" loading="lazy"><span><span class="wordmark">LoveType</span><br><span class="small">${esc(F.tagline)}</span></span></a>
        <p class="small">${esc(F.blurb)}</p>
      </div>
      ${col(F.tests, [[F.attachment, '/attachment-styles/', 1], [F.love, '/love-styles/', 1], [F.conflict, '/conflict-styles/', 1], [F.lovetypes, '/lovetypes/', 1]])}
      ${col(F.together, [[F.compare, P('compare/')], [F.compatibility, '/compatibility/', 1], [F.playbook, '/dating-profile-playbook/', 1]])}
      ${col(F.read, [[F.journal, '/journal/', 1], [F.article, '/journal/attachment-style-vs-personality-type/', 1], [F.innertype, 'https://innertype.app/']])}
      ${col(F.brand, [[F.download, APP_STORE], [F.privacy, P('privacy/')], [F.terms, P('terms/')], [F.contact, 'mailto:privacy@love-type.app']])}
    </div>
    <nav class="foot-langs" aria-label="${attr(F.language)}"><ul>${langLinks}</ul></nav>
    <div class="foot-bottom"><span>© 2026 LoveType</span><span>${esc(F.disclaimer)}</span></div>
  </div>
</footer>`;
}

/**
 * Full HTML document.
 * opts: { S, path, alternateKey, title, description, og, ogType, family, jsonld: [], main, noindex, preload: [] }
 * alternateKey (home|compare|privacy|terms) marks a page that exists in every language: hreflang
 * alternates are emitted and the footer switcher links to the same page in each language.
 */
export function page(opts) {
  const { path: p, alternateKey = null, title, description, og = 'home', ogType = 'website', family = 'profile', jsonld = [], main, noindex = false, preload = [] } = opts;
  const S = opts.S || EN;
  const L = LANGS[S.lang];
  const canonical = url(p);
  const ogImage = url(`/assets/og/${og}.jpg`);
  const alternates = alternateKey && !noindex
    ? Object.entries(LANGS).map(([, A], i) => `<link rel="alternate" hreflang="${A.hreflang}" href="${url(localPath(Object.keys(LANGS)[i], alternateKey))}">`).join('\n') + `\n<link rel="alternate" hreflang="x-default" href="${url(localPath('en', alternateKey))}">`
    : '';
  return `<!doctype html>
<html lang="${L.hreflang}" data-family="${family}">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<title>${esc(title)}</title>
<meta name="description" content="${attr(description)}">
${noindex ? '<meta name="robots" content="noindex, follow">' : `<link rel="canonical" href="${canonical}">\n<meta name="robots" content="index, follow, max-image-preview:large">`}
${alternates}
<meta name="theme-color" content="#0E0910">
<meta name="color-scheme" content="dark">
<meta name="apple-itunes-app" content="app-id=${APP_ID}">
<meta property="og:type" content="${ogType}">
<meta property="og:site_name" content="LoveType">
<meta property="og:url" content="${canonical}">
<meta property="og:title" content="${attr(title)}">
<meta property="og:description" content="${attr(description)}">
<meta property="og:image" content="${ogImage}">
<meta property="og:image:width" content="1200">
<meta property="og:image:height" content="630">
<meta property="og:locale" content="${L.og}">
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="${attr(title)}">
<meta name="twitter:description" content="${attr(description)}">
<meta name="twitter:image" content="${ogImage}">
<link rel="icon" href="/assets/favicon.svg" type="image/svg+xml">
<link rel="icon" href="/assets/favicon-32.png" sizes="32x32" type="image/png">
<link rel="apple-touch-icon" href="/assets/apple-touch-icon.png">
<link rel="manifest" href="/site.webmanifest">
<link rel="preload" href="/assets/fonts/dm-serif-display.woff2" as="font" type="font/woff2" crossorigin>
${preload.join('\n')}
<link rel="stylesheet" href="/assets/site.css?v=${ASSET_V}">
<script type="module" src="/assets/js/site.js?v=${ASSET_V}"></script>
${jsonld.map((j) => `<script type="application/ld+json">${JSON.stringify(j)}</script>`).join('\n')}
</head>
<body>
<a class="skip" href="#main">${esc(S.chrome.skip)}</a>
<canvas class="viewport-light" aria-hidden="true"></canvas>
<div class="glass-frame" aria-hidden="true"></div>
<div class="page">
${header(p, S)}
<main id="main">
${main}
</main>
${footer(S, alternateKey)}
</div>
</body>
</html>
`;
}

export function write(p, html) {
  const dir = path.join(ROOT, p);
  fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(path.join(dir, 'index.html'), html);
}
