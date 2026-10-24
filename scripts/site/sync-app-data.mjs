// Copies the FREE result content from the LoveType app into data/app-<lang>.json.
// Premium sections (when safe / insecure, partner needs, scripts, Love Manual entries
// 3-4, playbook prompts, avoid lines) are deliberately left out: this repo is public.
//
//   node scripts/site/sync-app-data.mjs [path-to-app-repo]   (default ../lovetype)

import fs from 'fs';
import path from 'path';

const HERE = path.dirname(new URL(import.meta.url).pathname);
const APP = path.resolve(process.argv[2] || path.join(HERE, '../../../lovetype'));
const LANGS = ['en', 'es', 'pt-BR', 'id', 'ja', 'zh-Hant'];
const FREE_TYPE_FIELDS = ['label', 'tagline', 'description', 'strength1', 'strength2', 'strength3', 'strength4', 'blindSpot'];

const pick = (obj, keys) => Object.fromEntries(keys.filter((k) => obj[k] != null).map((k) => [k, obj[k]]));
const mapTypes = (group) => Object.fromEntries(Object.entries(group).map(([k, v]) => [k, pick(v, FREE_TYPE_FIELDS)]));

fs.mkdirSync(path.join(HERE, 'data'), { recursive: true });
for (const lang of LANGS) {
  const file = path.join(APP, 'src/i18n/locales', `${lang}.json`);
  if (!fs.existsSync(file)) { console.warn('missing', file); continue; }
  const src = JSON.parse(fs.readFileSync(file, 'utf8'));
  const r = src.results;
  const bio = src.bio?.archetype ?? {};
  const out = {
    attachment: mapTypes(r.attachmentType),
    love: mapTypes(r.loveStyleType),
    conflict: mapTypes(r.conflictType),
    combined: mapTypes(r.combined),
    // Free in the app: the through-line and the first "worth putting in" item.
    playbook: Object.fromEntries(Object.entries(bio).map(([k, v]) => [k, { leadWith: v.leadWith, point: v.mention?.['1']?.point, example: v.mention?.['1']?.example }])),
  };
  fs.writeFileSync(path.join(HERE, 'data', `app-${lang}.json`), JSON.stringify(out, null, 1) + '\n');
  console.log('wrote', lang);
}
