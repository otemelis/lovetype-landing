// Audits the built site: internal links resolve, one h1, title/description lengths and
// uniqueness, canonical = own URL, JSON-LD parses, images have alt, OG image exists.
//   node scripts/site/check.mjs

import fs from 'fs';
import path from 'path';
import { ROOT, SITE } from './lib.mjs';

const pages = [];
const walk = (dir) => {
  for (const f of fs.readdirSync(dir)) {
    if (['.git', 'scripts', 'node_modules', '_lab', 'assets'].includes(f)) continue;
    const p = path.join(dir, f);
    if (fs.statSync(p).isDirectory()) walk(p);
    else if (f === 'index.html') pages.push(p);
  }
};
walk(ROOT);

const problems = [];
const titles = new Map();
const descs = new Map();
const exists = (href) => {
  const clean = href.split('#')[0].split('?')[0];
  if (!clean) return true;
  const fp = path.join(ROOT, clean);
  return fs.existsSync(clean.endsWith('/') ? path.join(fp, 'index.html') : fp);
};

for (const file of pages) {
  const html = fs.readFileSync(file, 'utf8');
  const rel = '/' + path.relative(ROOT, path.dirname(file)).replace(/\\/g, '/');
  const route = rel === '/' ? '/' : rel + '/';
  const say = (m) => problems.push(`${route}: ${m}`);
  const title = (html.match(/<title>([^<]*)<\/title>/) || [])[1] || '';
  const desc = (html.match(/<meta name="description" content="([^"]*)"/) || [])[1] || '';
  if (!title) say('no title');
  if (title.length > 72) say(`title ${title.length} chars`);
  if (desc.length < 70 || desc.length > 175) say(`description ${desc.length} chars`);
  titles.set(title, [...(titles.get(title) || []), route]);
  descs.set(desc, [...(descs.get(desc) || []), route]);
  const canon = (html.match(/<link rel="canonical" href="([^"]*)"/) || [])[1];
  if (canon !== SITE + route) say(`canonical ${canon}`);
  const h1 = (html.match(/<h1[\s>]/g) || []).length;
  if (h1 !== 1) say(`${h1} h1`);
  for (const m of html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)) {
    try { JSON.parse(m[1]); } catch { say('bad JSON-LD'); }
  }
  for (const m of html.matchAll(/<img [^>]*>/g)) if (!/alt="/.test(m[0])) say('img without alt');
  const og = (html.match(/property="og:image" content="([^"]*)"/) || [])[1];
  if (og && !fs.existsSync(path.join(ROOT, og.replace(SITE, '')))) say(`missing og image ${og}`);
  for (const m of html.matchAll(/(?:href|src)="(\/[^"]*)"/g)) if (!exists(m[1])) say(`broken link ${m[1]}`);
  for (const m of html.matchAll(/href="\/[^"#?]*[^/"#?]"/g)) {
    const h = m[0].slice(6, -1);
    if (!/\.[a-z0-9]+$/i.test(h)) say(`link without trailing slash ${h}`);
  }
}
for (const [t, r] of titles) if (r.length > 1) problems.push(`duplicate title "${t}": ${r.join(', ')}`);
for (const [d, r] of descs) if (r.length > 1) problems.push(`duplicate description: ${r.join(', ')}`);

console.log(`${pages.length} pages checked`);
if (problems.length) { console.log(problems.join('\n')); process.exitCode = 1; } else console.log('no problems');
