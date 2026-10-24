-- love-type.app analytics (Supabase project dsjgbxkerucutrjltgws, table events, app_id 'lovetype-web').
-- Cookieless: each page view has its own random id, so "visitors" can't be counted, only views and taps.
-- Run in the Supabase SQL editor. Production only (localhost traffic is environment = 'dev').

-- 1. Daily page views and App Store taps, last 30 days
select date_trunc('day', received_at) as day,
       count(*) filter (where event_name = 'page_view') as views,
       count(*) filter (where event_name = 'app_store_tap') as store_taps,
       round(100.0 * count(*) filter (where event_name = 'app_store_tap')
             / nullif(count(*) filter (where event_name = 'page_view'), 0), 1) as tap_rate_pct
from events
where app_id = 'lovetype-web' and environment = 'prod' and received_at > now() - interval '30 days'
group by 1 order by 1 desc;

-- 2. Pages that convert: views, taps and tap rate per page (≥20 views)
with v as (select properties->>'path' as path, count(*) as views from events
           where app_id = 'lovetype-web' and environment = 'prod' and event_name = 'page_view'
             and received_at > now() - interval '30 days' group by 1),
     t as (select properties->>'path' as path, count(*) as taps from events
           where app_id = 'lovetype-web' and environment = 'prod' and event_name = 'app_store_tap'
             and received_at > now() - interval '30 days' group by 1)
select v.path, v.views, coalesce(t.taps, 0) as taps, round(100.0 * coalesce(t.taps, 0) / v.views, 1) as tap_rate_pct
from v left join t using (path) where v.views >= 20 order by v.views desc;

-- 3. Where visitors come from
select properties->>'referrer' as referrer, count(*) as views
from events where app_id = 'lovetype-web' and environment = 'prod' and event_name = 'page_view'
  and received_at > now() - interval '30 days'
group by 1 order by 2 desc limit 25;

-- 4. Which button gets tapped (hero, header, closing, type pages…)
select properties->>'cta' as cta, count(*) as taps
from events where app_id = 'lovetype-web' and environment = 'prod' and event_name = 'app_store_tap'
  and received_at > now() - interval '30 days'
group by 1 order by 2 desc;

-- 5. Languages, countries (from browser language) and devices
select properties->>'lang' as page_lang, country, properties->>'width' as device, count(*) as views
from events where app_id = 'lovetype-web' and environment = 'prod' and event_name = 'page_view'
  and received_at > now() - interval '30 days'
group by 1, 2, 3 order by 4 desc limit 40;

-- 6. Engagement: compare-code lookups, pair picks, copied starter lines
select event_name, count(*) from events
where app_id = 'lovetype-web' and environment = 'prod'
  and event_name in ('compare_code_decoded', 'pair_picked', 'starter_line_copied', 'language_switched')
  and received_at > now() - interval '30 days'
group by 1 order by 2 desc;
