// Builds love-type.app. Run from the repo root:
//   node scripts/site/build.mjs
// Output is committed (GitHub Pages serves the repo as is). See scripts/README.md.

import fs from 'fs';
import path from 'path';
import { ROOT } from './lib.mjs';
import { TYPES, ARCH, PAIRS, DIMENSIONS, ARCHETYPES } from './model.mjs';
import { buildHome } from './pages/home.mjs';
import { buildHubs, buildTypes, buildArchetypes, OG } from './pages/styles.mjs';
import { buildCompatibility, buildCompare, buildPlaybook, buildJournal, buildLegal, buildMeta } from './pages/more.mjs';

buildHome();
buildHubs();
buildTypes();
buildArchetypes();
buildCompatibility();
buildCompare();
buildPlaybook();
buildJournal();
buildLegal();

const paths = [
  '/',
  ...['attachment', 'love', 'conflict'].flatMap((d) => [`/${DIMENSIONS[d].path}/`, ...DIMENSIONS[d].order.map((k) => TYPES[d][k].path)]),
  '/lovetypes/', ...ARCHETYPES.order.map((k) => ARCH[k].path),
  '/compatibility/', ...PAIRS.map((p) => p.path),
  '/compare/', '/dating-profile-playbook/',
  '/journal/', '/journal/attachment-style-vs-personality-type/',
  '/privacy/', '/terms/',
];
buildMeta(paths);

OG.unshift({ name: 'home', eyebrow: 'RELATIONSHIP TEST', title: 'How do you love?', sub: 'Three tests. One LoveType.', family: 'full' });
fs.writeFileSync(path.join(ROOT, 'scripts/site/og-manifest.json'), JSON.stringify(OG, null, 1) + '\n');

// Retired: remove any generated folder that is no longer in the build.
const missing = paths.filter((p) => !fs.existsSync(path.join(ROOT, p, 'index.html')));
if (missing.length) throw new Error('missing output: ' + missing.join(', '));
console.log(`built ${paths.length} pages + 404, ${OG.length} share images to render`);
