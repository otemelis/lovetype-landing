// Cookieless site analytics into the shared Supabase events pipeline (app_id lovetype-web).
// One random visit id in sessionStorage links the pages of a single visit; the browser drops it
// when the tab closes, and it is renewed after 30 minutes of inactivity. Nothing persists across
// visits, and no cookies or localStorage are used. The key is public by design and only allows
// inserting the events in this app's catalog. localhost traffic is tagged environment=dev.
const URL_ = 'https://dsjgbxkerucutrjltgws.supabase.co/functions/v1/track';
const KEY = 'web_b7fad0de2e064c989864890f4d4c3d1697ba86391c6c4c89afa0fb426589d8d7';
const uuid = () => (crypto.randomUUID ? crypto.randomUUID() : '10000000-1000-4000-8000-100000000000'.replace(/[018]/g, (c) => (c ^ (crypto.getRandomValues(new Uint8Array(1))[0] & (15 >> (c / 4)))).toString(16)));
const VISIT_KEY = 'lt_visit';
const IDLE_MS = 30 * 60 * 1000;
let id = uuid();
let pageIndex = 1;
try {
  const v = JSON.parse(sessionStorage.getItem(VISIT_KEY) || 'null');
  if (v && v.id && Date.now() - v.at < IDLE_MS) { id = v.id; pageIndex = v.n + 1; }
  sessionStorage.setItem(VISIT_KEY, JSON.stringify({ id, n: pageIndex, at: Date.now() }));
} catch {
  // Storage blocked: fall back to one id per page load.
}
const dev = /^(localhost|127\.|\[::1\])/.test(location.hostname);
const region = (navigator.language || '').split('-')[1] || null;
const queue = [];
let timer = 0;

function flush() {
  clearTimeout(timer);
  if (!queue.length) return;
  const events = queue.splice(0, 50);
  try {
    fetch(URL_, { method: 'POST', keepalive: true, headers: { 'content-type': 'application/json', 'x-api-key': KEY }, body: JSON.stringify({ app_id: 'lovetype-web', events }) }).catch(() => {});
  } catch {}
}

export function track(name, props = {}) {
  queue.push({
    event_name: name, anonymous_id: id, session_id: id, environment: dev ? 'dev' : 'prod', platform: 'web',
    app_version: 'site-1.2', os_version: /iPhone|iPad/.test(navigator.userAgent) ? 'ios' : /Android/.test(navigator.userAgent) ? 'android' : 'desktop',
    country: region && region.length === 2 ? region : null, client_event_time: new Date().toISOString(),
    properties: { lang: document.documentElement.lang, ...props },
  });
  clearTimeout(timer);
  timer = setTimeout(flush, 1500);
}

const utm = Object.fromEntries([...new URLSearchParams(location.search)].filter(([k]) => /^utm_|^ref$/.test(k)));
let refHost = '';
try { refHost = document.referrer ? new URL(document.referrer).hostname : ''; } catch {}
track('page_view', { page_index: pageIndex, path: location.pathname, referrer: refHost === location.hostname ? 'internal' : refHost || 'direct', ...utm, width: innerWidth < 600 ? 'phone' : innerWidth < 1100 ? 'tablet' : 'desktop' });

document.addEventListener('click', (e) => {
  const a = e.target.closest?.('a[href*="apps.apple.com"]');
  if (a) { track('app_store_tap', { cta: a.dataset.cta || 'link', path: location.pathname }); flush(); }
});
addEventListener('pagehide', flush);
document.addEventListener('visibilitychange', () => document.visibilityState === 'hidden' && flush());
