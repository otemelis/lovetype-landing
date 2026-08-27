# scripts/

Build-time generators for pages that would be tedious to hand-maintain.
The site itself has no build step — these are run manually, and their
**output HTML is committed**.

- `gen-compat.mjs` — generates `/compatibility/` (hub + pairing pages) and
  rewrites `sitemap.xml`. Run from the repo root: `node scripts/gen-compat.mjs`.
  Source content lives in the `PAGES` array in the script. Attachment pairings
  are done; love + conflict pairings are the next batch.
