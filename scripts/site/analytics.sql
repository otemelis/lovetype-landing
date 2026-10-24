-- love-type.app analytics (Supabase project dsjgbxkerucutrjltgws, table events, app_id 'lovetype-web').
-- Cookieless. session_id = one visit (sessionStorage, ends with the tab or 30 min idle); no cross-visit ids.
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

-- 7. Visits: landing page → did the visit reach an App Store tap?
with v as (
  select session_id,
         min(client_event_time) as started,
         (array_agg(properties->>'path' order by client_event_time) filter (where event_name = 'page_view'))[1] as landing,
         (array_agg(properties->>'referrer' order by client_event_time) filter (where event_name = 'page_view'))[1] as referrer,
         count(*) filter (where event_name = 'page_view') as pages,
         bool_or(event_name = 'app_store_tap') as tapped
  from events
  where app_id = 'lovetype-web' and environment = 'prod' and received_at > now() - interval '30 days'
  group by 1)
select landing, count(*) as visits, round(avg(pages), 1) as avg_pages,
       count(*) filter (where tapped) as visits_with_tap,
       round(100.0 * count(*) filter (where tapped) / count(*), 1) as visit_tap_rate_pct
from v group by 1 having count(*) >= 10 order by visits desc;

-- 8. Page paths of single visits (most common sequences, up to 4 pages)
with p as (
  select session_id, string_agg(properties->>'path', ' → ' order by client_event_time) as path_seq
  from (select * from events
        where app_id = 'lovetype-web' and environment = 'prod' and event_name = 'page_view'
          and (properties->>'page_index')::int <= 4 and received_at > now() - interval '30 days') e
  group by 1)
select path_seq, count(*) as visits from p group by 1 order by 2 desc limit 30;
