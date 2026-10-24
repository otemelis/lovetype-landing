# love-type.app — analytics tracking

For whoever connects the data to dashboards. Website only; the iOS app has its own `app_id = 'lovetype'`.

## Where the data is

- Supabase project `dsjgbxkerucutrjltgws`, table `public.events` (shared with every app).
- Rows from the website: `app_id = 'lovetype-web'`, `platform = 'web'`, `app_version = 'site-1.2'`.
- Use only `environment = 'prod'`. `dev` rows come from localhost testing.
- Sent by `assets/js/analytics.js` to the `track` Edge Function with the site's own API key (hash in `app_api_keys`). Event names must exist in `event_catalog` for `lovetype-web`; anything else is rejected.

## Columns as the website fills them

| Column | Value |
|---|---|
| `anonymous_id` = `session_id` | Random **visit ID** (see "Journeys" below) |
| `country` | From the browser language (`en-US` → `US`), not geolocation. Often empty |
| `os_version` | Coarse device family: `ios`, `android` or `desktop` |
| `client_event_time` | Browser time of the event |
| `properties.lang` | Page language: `en`, `es`, `pt-BR`, `ja`, `zh-Hant`, `id` |

## Events

| Event | When | Properties |
|---|---|---|
| `page_view` | Every page load | `page_index` (1 = landing page of the visit), `path`, `referrer` (`direct`, `internal` or the referring host), `width` (`phone`/`tablet`/`desktop`), any `utm_*` and `ref` query parameters |
| `app_store_tap` | Any App Store link or button clicked | `cta` (`hero`, `header`, `closing`, `footer`, `compare-page`, `type-<slug>`, …), `path` |
| `compare_code_decoded` | A valid partner code is decoded on `/compare/` or a shared `/compare/<code>` link (once per page) | `source` (`link` or `typed`), `with_own_code` (bool). The code itself is never sent |
| `pair_picked` | Both styles chosen in the compatibility picker | `dimension`, `pair` (e.g. `Anxious+Avoidant`) |
| `starter_line_copied` | Playbook starter line copied on the homepage | `path` |
| `language_switched` | Footer language switcher used | `from`, `to` |

Ready-made SQL: `scripts/site/analytics.sql` (daily views and tap rate, converting pages, referrers, CTAs, languages, engagement).

## Journeys (within one visit)

`session_id` (= `anonymous_id`) is a random visit ID kept in the browser's `sessionStorage`:

- Same ID for every page and event in one tab while the visitor keeps browsing.
- New ID when the tab closes, or after 30 minutes without a page load.
- If storage is blocked, the ID falls back to one per page load.
- Nothing persists across visits: no cookies, no localStorage. Unique or returning visitors can't be counted.

To rebuild a journey: group by `session_id`, order by `client_event_time` (or `properties->>'page_index'` for page views). The first `page_view` (`page_index = 1`) is the landing page; its `referrer` and `utm_*` describe where the visit came from.

### Website → install (time matching)

Apple passes nothing from the website to the app, so there is no shared ID. While traffic is low, installs can be matched by time instead:

- Website side: `app_store_tap` with `os_version = 'ios'` (the tap happened on an iPhone), its timestamp, `country` (from browser language), `lang`, `path`, `cta`, `session_id`.
- App side (`app_id = 'lovetype'`): `onboarding_started` fires once per new install, with its timestamp, `country` (device region) and `properties.language`. The app has no `app_first_open` event; `onboarding_started` is the first-launch signal.
- A tap followed by an install 1–20 minutes later, from the same country, is a probable match. Query 9 in `scripts/site/analytics.sql` lists every install with its candidate taps from the hour before and a `candidates` count.
- Limits: it's a guess, not attribution. People can install hours later or open the app the next day; taps from a computer (the QR code) show as `desktop`; once there are many taps per hour, candidates overlap and matches become meaningless. Treat it as an early-days signal.

Journey and funnel queries: sections 7–8 of `scripts/site/analytics.sql`.
