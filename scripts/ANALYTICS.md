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
| `anonymous_id` = `session_id` | Random UUID **per page load** (see "Journeys" below) |
| `country` | From the browser language (`en-US` → `US`), not geolocation. Often empty |
| `os_version` | Coarse device family: `ios`, `android` or `desktop` |
| `client_event_time` | Browser time of the event |
| `properties.lang` | Page language: `en`, `es`, `pt-BR`, `ja`, `zh-Hant`, `id` |

## Events

| Event | When | Properties |
|---|---|---|
| `page_view` | Every page load | `path`, `referrer` (`direct`, `internal` or the referring host), `width` (`phone`/`tablet`/`desktop`), any `utm_*` and `ref` query parameters |
| `app_store_tap` | Any App Store link or button clicked | `cta` (`hero`, `header`, `closing`, `footer`, `compare-page`, `type-<slug>`, …), `path` |
| `compare_code_decoded` | A valid partner code is decoded on `/compare/` or a shared `/compare/<code>` link (once per page) | `source` (`link` or `typed`), `with_own_code` (bool). The code itself is never sent |
| `pair_picked` | Both styles chosen in the compatibility picker | `dimension`, `pair` (e.g. `Anxious+Avoidant`) |
| `starter_line_copied` | Playbook starter line copied on the homepage | `path` |
| `language_switched` | Footer language switcher used | `from`, `to` |

Ready-made SQL: `scripts/site/analytics.sql` (daily views and tap rate, converting pages, referrers, CTAs, languages, engagement).

## Journeys: not possible by design

There is **no identifier that links one page view to the next**. Every page load creates a new random `anonymous_id`, and nothing is stored on the device (no cookies, no localStorage, no sessionStorage). This keeps the site free of consent banners, and the privacy policy says so.

What this means for dashboards:

- You can count page views, App Store taps and tap rate **per page, per CTA, per referrer, per language**.
- You cannot follow a visitor from landing page → other pages → App Store tap, count unique visitors, or count returning visitors.
- A `page_view` and the `app_store_tap` on that **same page** share an `anonymous_id`, so "this landing page view ended in a tap" is measurable.
- The website can't be joined to app installs or app events: Apple doesn't pass anything from the website to the app. Website → install is only visible in aggregate (App Store Connect web referrer / campaign data, if campaign links are added later).

If journeys within a visit are needed, the option is a session ID in `sessionStorage` (dropped when the tab closes). That's device storage, so the privacy page would need updating, and in the EU it's a grey area without consent.
