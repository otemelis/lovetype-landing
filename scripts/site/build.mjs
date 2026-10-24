// Builds love-type.app. Run from the repo root:
//   node scripts/site/build.mjs
// Output is committed (GitHub Pages serves the repo as is). See scripts/README.md.

import fs from 'fs';
import path from 'path';
import { ROOT, LANGS, localPath, LOCALIZED, setDefaultStrings } from './lib.mjs';
import { TYPES, ARCH, PAIRS, DIMENSIONS, ARCHETYPES } from './model.mjs';
import { buildHome } from './pages/home.mjs';
import { buildHubs, buildTypes, buildArchetypes, OG } from './pages/styles.mjs';
import { buildCompatibility, buildCompare, buildPlaybook, buildJournal, buildLegal, buildMeta } from './pages/more.mjs';

const STRINGS = {};
for (const lang of Object.keys(LANGS)) {
  const f = path.join(ROOT, 'scripts/site/content/i18n', `${lang}.mjs`);
  if (fs.existsSync(f)) STRINGS[lang] = (await import(f)).default;
}
setDefaultStrings(STRINGS.en);
const langs = Object.keys(STRINGS);
for (const l of langs) {
  buildHome(STRINGS[l]);
  buildCompare(STRINGS[l]);
  buildLegal(STRINGS[l]);
}
buildHubs();
buildTypes();
buildArchetypes();
buildCompatibility();
buildPlaybook();
buildJournal();

const paths = [
  '/',
  ...['attachment', 'love', 'conflict'].flatMap((d) => [`/${DIMENSIONS[d].path}/`, ...DIMENSIONS[d].order.map((k) => TYPES[d][k].path)]),
  '/lovetypes/', ...ARCHETYPES.order.map((k) => ARCH[k].path),
  '/compatibility/', ...PAIRS.map((p) => p.path),
  '/compare/', '/dating-profile-playbook/',
  '/journal/', '/journal/attachment-style-vs-personality-type/',
  '/privacy/', '/terms/',
];
const localized = langs.filter((l) => l !== 'en').flatMap((l) => Object.keys(LOCALIZED).map((k) => localPath(l, k)));
buildMeta([...paths, ...localized], langs);

for (const l of langs) {
  const H = STRINGS[l].home;
  OG.unshift({ name: l === 'en' ? 'home' : `home-${l.toLowerCase()}`, eyebrow: H.label.toUpperCase(), title: H.h1[0], sub: H.h1[1], family: 'full', lang: l, foot: STRINGS[l].chrome.footer.tagline });
}
fs.writeFileSync(path.join(ROOT, 'scripts/site/og-manifest.json'), JSON.stringify(OG, null, 1) + '\n');

// Retired: remove any generated folder that is no longer in the build.
const missing = paths.filter((p) => !fs.existsSync(path.join(ROOT, p, 'index.html')));
if (missing.length) throw new Error('missing output: ' + missing.join(', '));
console.log(`built ${paths.length} English pages + ${localized.length} localized + 404, ${OG.length} share images to render`);
