// One data model for every page: the app's free result text + web copy + pairings.

import fs from 'fs';
import path from 'path';
import { DIMENSIONS, STYLES, ARCHETYPES } from './content/types.mjs';
import { PAGES as PAIR_PAGES } from './content/compat-content.mjs';
import { DIM as PAIR_DIM } from './content/compat-dims.mjs';

const HERE = path.dirname(new URL(import.meta.url).pathname);
export const app = JSON.parse(fs.readFileSync(path.join(HERE, 'data/app-en.json'), 'utf8'));
const appCache = { en: app };
/** The app's own (free) result text in one language. */
export const appData = (lang) => (appCache[lang] ??= JSON.parse(fs.readFileSync(path.join(HERE, `data/app-${lang}.json`), 'utf8')));

// Combined-archetype points, mirrored from the app (src/logic/profileSynthesis.ts).
export const POINTS = {
  attachment: {
    Secure: { SteadyBuilder: 3, WarmNurturer: 2, ThoughtfulPartner: 2, AdventureBond: 1 },
    Anxious: { LoyalReassurer: 3, TenderPresence: 2, PassionateAdvocate: 2, DeepProcessor: 1 },
    Avoidant: { IndependentRomantic: 3, ThoughtfulPartner: 2, DeepProcessor: 2, SteadyBuilder: 1 },
    FearfulAvoidant: { GuardedHeart: 3, PassionateAdvocate: 2, DeepProcessor: 2, LoyalReassurer: 1 },
  },
  love: {
    Words: { LoyalReassurer: 2, GuardedHeart: 1, PassionateAdvocate: 2 },
    Time: { SteadyBuilder: 2, TenderPresence: 1, WarmNurturer: 1, AdventureBond: 1 },
    Touch: { TenderPresence: 3, PassionateAdvocate: 2 },
    Acts: { WarmNurturer: 3, SteadyBuilder: 2, IndependentRomantic: 1 },
    Symbols: { ThoughtfulPartner: 3, GuardedHeart: 2 },
    Experiences: { AdventureBond: 3, IndependentRomantic: 2 },
  },
  conflict: {
    Pursuer: { LoyalReassurer: 2, PassionateAdvocate: 2, TenderPresence: 1 },
    Withdrawer: { IndependentRomantic: 2, DeepProcessor: 1, GuardedHeart: 1 },
    Fixer: { WarmNurturer: 2, SteadyBuilder: 1 },
    Peacekeeper: { SteadyBuilder: 1, WarmNurturer: 1, ThoughtfulPartner: 1 },
    Defender: { GuardedHeart: 2, PassionateAdvocate: 1 },
    Processor: { DeepProcessor: 3, ThoughtfulPartner: 2, IndependentRomantic: 1 },
  },
};

export function archetypeOf(a, l, c) {
  const scores = Object.fromEntries(ARCHETYPES.order.map((k) => [k, 0]));
  for (const [dim, key] of [['attachment', a], ['love', l], ['conflict', c]]) for (const [k, p] of Object.entries(POINTS[dim][key])) scores[k] += p;
  return Object.entries(scores).sort((x, y) => y[1] - x[1])[0][0];
}

const strengths = (t) => [t.strength1, t.strength2, t.strength3, t.strength4].filter(Boolean);

// ── Styles (16) ──────────────────────────────────────────────────────────────
export const TYPES = {};
for (const dim of ['attachment', 'love', 'conflict']) {
  const D = DIMENSIONS[dim];
  TYPES[dim] = {};
  for (const key of D.order) {
    const a = app[dim][key];
    TYPES[dim][key] = {
      key, dim, D,
      family: D.family,
      slug: D.slug[key],
      path: `/${D.path}/${D.slug[key]}/`,
      short: D.short[key],
      label: a.label,
      tagline: a.tagline,
      description: a.description,
      strengths: strengths(a),
      blindSpot: a.blindSpot,
      ...STYLES[dim][key],
    };
  }
}

// ── LoveTypes (10) ───────────────────────────────────────────────────────────
export const ARCH = {};
for (const key of ARCHETYPES.order) {
  const a = app.combined[key];
  ARCH[key] = {
    key,
    slug: ARCHETYPES.slug[key],
    path: `/lovetypes/${ARCHETYPES.slug[key]}/`,
    family: ARCHETYPES.family[key],
    label: a.label,
    tagline: a.tagline,
    description: a.description,
    strengths: strengths(a),
    blindSpot: a.blindSpot,
    playbook: app.playbook[key],
    counts: { attachment: {}, love: {}, conflict: {} },
    total: 0,
  };
}
// Which results lead to each LoveType: count all 144 combinations.
for (const a of DIMENSIONS.attachment.order) for (const l of DIMENSIONS.love.order) for (const c of DIMENSIONS.conflict.order) {
  const k = archetypeOf(a, l, c);
  const A = ARCH[k];
  A.total++;
  A.counts.attachment[a] = (A.counts.attachment[a] || 0) + 1;
  A.counts.love[l] = (A.counts.love[l] || 0) + 1;
  A.counts.conflict[c] = (A.counts.conflict[c] || 0) + 1;
}
export const topOf = (counts, n = 2) => Object.entries(counts).sort((x, y) => y[1] - x[1]).slice(0, n).map(([k]) => k);

// ── Pairings (52) ────────────────────────────────────────────────────────────
const SMALL = new Set(['of', 'and', 'the', 'a', 'an', 'for', 'to', 'in', 'with', 'on']);
export const cap = (s) => s.split(/(\s|-)/).map((w, i) => (w === ' ' || w === '-' ? w : i > 0 && SMALL.has(w.toLowerCase()) ? w.toLowerCase() : w.charAt(0).toUpperCase() + w.slice(1))).join('');

export const PAIRS = PAIR_PAGES.map((p) => {
  const L = PAIR_DIM[p.dim].label;
  const title = p.sameType ? `Two ${cap(L[p.left])} Partners` : `${cap(L[p.left])} and ${cap(L[p.right])}`;
  const h1 = p.dim === 'attachment' && !p.sameType ? `${title} Attachment` : title;
  const metaTitle = p.dim === 'attachment'
    ? (p.sameType ? `${title}: Attachment Compatibility` : `${title} Attachment: How the Pairing Works`)
    : `${title}: ${p.dim === 'love' ? 'Love Style' : 'Conflict Style'} Compatibility`;
  return { ...p, D: PAIR_DIM[p.dim], title, h1, metaTitle, path: `/compatibility/${p.slug}/`, key: [p.left, p.right].sort().join('+') };
});
export const pairsFor = (dim, key) => PAIRS.filter((p) => p.dim === dim && (p.left === key || p.right === key));
export { DIMENSIONS, ARCHETYPES, PAIR_DIM };
