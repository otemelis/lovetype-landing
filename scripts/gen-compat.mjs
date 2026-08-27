import fs from 'fs';
import path from 'path';

const OUT = '/Users/otastemelis/claude/lovetype-landing';
const APP_STORE = 'https://apps.apple.com/us/app/lovetype-relationship-test/id6786477464';
const DATE = '2026-08-27';
const DATE_HUMAN = 'August 2026';

const STYLE_BLURB = {
  Secure: 'Brings calm and consistency, is comfortable with closeness without losing themselves, and can stay present through a hard conversation.',
  Anxious: 'Loves with their whole self and reads every shift in tone. Fully present when secure; under stress, feels an urgent pull to close any gap and confirm the connection is intact.',
  Avoidant: 'Values independence and has learned to handle things alone. Cares deeply but shows it quietly, and needs room when closeness intensifies.',
  FearfulAvoidant: 'Wants deep connection and fears it at the same time. Moves toward closeness, then pulls back when vulnerability starts to feel dangerous.',
};
const STYLE_LABEL = { Secure: 'Secure', Anxious: 'Anxious', Avoidant: 'Avoidant', FearfulAvoidant: 'Fearful-Avoidant' };
const STYLE_SLUG = { Secure: 'secure', Anxious: 'anxious', Avoidant: 'avoidant', FearfulAvoidant: 'fearful-avoidant' };

function esc(s) {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}
function escAttr(s) {
  return esc(s).replace(/"/g, '&quot;');
}

const CSS = fs.readFileSync(
  '/Users/otastemelis/claude/lovetype-landing/compatibility/secure-and-anxious/index.html',
  'utf8',
).match(/<style>[\s\S]*?<\/style>/)[0];

const NAV = `<nav class="site-nav">
  <a href="/" class="nav-brand" aria-label="LoveType home">
    <svg class="nav-mark" viewBox="0 0 26 26" fill="none" aria-hidden="true">
      <circle cx="13" cy="13" r="11.5" stroke="#C07090" stroke-width="1.1" opacity="0.85"/>
      <circle cx="13" cy="13" r="7.6" stroke="#A080C0" stroke-width="1.1" opacity="0.85"/>
      <circle cx="13" cy="13" r="4" stroke="#7080C0" stroke-width="1.1" opacity="0.85"/>
      <circle cx="13" cy="13" r="1.8" fill="#C9A96E"/>
    </svg>
    <span class="serif nav-logo">LoveType</span>
  </a>
  <div class="nav-links">
    <div class="nav-links nav-links-full">
      <a href="/#dimensions">Tests</a>
      <a href="/#how-it-works">How it works</a>
      <a href="/#faq">FAQ</a>
    </div>
    <a href="${APP_STORE}" target="_blank" rel="noopener" class="nav-btn" aria-label="Download LoveType on the App Store">
      <svg width="13" height="13" viewBox="0 0 384 512" fill="currentColor" aria-hidden="true"><path d="M318.7 268.7c-.2-36.7 16.4-64.4 50-84.8-18.8-26.9-47.2-41.7-84.7-44.6-35.5-2.8-74.3 20.7-88.5 20.7-15 0-49.4-19.7-76.4-19.7C63.3 141.2 4 184.8 4 273.5q0 39.3 14.4 81.2c12.8 36.7 59 126.7 107.2 125.2 25.2-.6 43-17.9 75.8-17.9 31.8 0 48.3 17.9 76.4 17.9 48.6-.7 90.4-82.5 102.6-119.3-65.2-30.7-61.7-90-61.7-91.9zm-56.6-164.2c27.3-32.4 24.8-61.9 24-72.5-24.1 1.4-52 16.4-67.9 34.9-17.5 19.8-27.8 44.3-25.6 71.9 26.1 2 49.9-11.4 69.5-34.3z"/></svg>
      App Store
    </a>
  </div>
</nav>`;

const FOOTER = `<footer>
  <div class="wrap">
    <div class="foot-top">
      <div>
        <a href="/" class="foot-brand" aria-label="LoveType home">
          <svg width="22" height="22" viewBox="0 0 26 26" fill="none" aria-hidden="true">
            <circle cx="13" cy="13" r="11.5" stroke="#C07090" stroke-width="1.1" opacity="0.85"/>
            <circle cx="13" cy="13" r="7.6" stroke="#A080C0" stroke-width="1.1" opacity="0.85"/>
            <circle cx="13" cy="13" r="4" stroke="#7080C0" stroke-width="1.1" opacity="0.85"/>
            <circle cx="13" cy="13" r="1.8" fill="#C9A96E"/>
          </svg>
          <span class="serif foot-logo">LoveType</span>
        </a>
        <p class="foot-tag">A relationship self-reflection app.</p>
      </div>
      <nav class="foot-links" aria-label="Footer">
        <a href="/#dimensions">Tests</a>
        <a href="/#how-it-works">How it works</a>
        <a href="/compatibility">Compatibility</a>
        <a href="/privacy">Privacy</a>
        <a href="/terms">Terms</a>
        <a href="mailto:privacy@love-type.app">Contact</a>
      </nav>
    </div>
    <div class="foot-bottom">
      <span>© 2026 LoveType. All rights reserved.</span>
      <span>Not a substitute for professional or medical advice.</span>
    </div>
  </div>
</footer>`;

const APPLE_SVG = '<svg width="16" height="16" viewBox="0 0 384 512" fill="currentColor" aria-hidden="true"><path d="M318.7 268.7c-.2-36.7 16.4-64.4 50-84.8-18.8-26.9-47.2-41.7-84.7-44.6-35.5-2.8-74.3 20.7-88.5 20.7-15 0-49.4-19.7-76.4-19.7C63.3 141.2 4 184.8 4 273.5q0 39.3 14.4 81.2c12.8 36.7 59 126.7 107.2 125.2 25.2-.6 43-17.9 75.8-17.9 31.8 0 48.3 17.9 76.4 17.9 48.6-.7 90.4-82.5 102.6-119.3-65.2-30.7-61.7-90-61.7-91.9zm-56.6-164.2c27.3-32.4 24.8-61.9 24-72.5-24.1 1.4-52 16.4-67.9 34.9-17.5 19.8-27.8 44.3-25.6 71.9 26.1 2 49.9-11.4 69.5-34.3z"/></svg>';

// left/right = style keys, in display order. sameType => tips is a single string.
const PAGES = [
  {
    slug: 'secure-and-anxious', left: 'Secure', right: 'Anxious',
    lede: 'A secure and an anxious partner is one of the more workable attachment pairings — but "workable" is not the same as "automatic."',
    connect: "The secure partner's steadiness is exactly what the anxious partner is scanning for. When the secure partner stays calm and consistent, the anxious partner settles — and over time checks in less. The anxious partner's need for closeness rarely drains someone secure the way it might drain a more avoidant partner; the expressiveness other pairings find “a lot” reads, to a secure partner, as someone who simply loves openly.",
    friction: "Under stress, the anxious partner moves toward their partner fast — more messages, more “are we okay?”, a push to talk it out now. The secure partner can read that as pressure and pull back for room to think, and that pause is the one move that spikes an anxious partner's alarm. The gap widens exactly when the anxious partner needs it to close. Neither person is wrong about what they feel; they are reaching for opposite things.",
    tips: {
      Secure: "When you want space in the middle of a conflict, say so with a return time — “I need twenty minutes, then I'm back.” The silence is what hurts an anxious partner, not the pause itself.",
      Anxious: "Name the need before chasing it — “I don't need you to fix this, I need to hear we're okay.” That turns pursuit into a request your partner can actually say yes to.",
    },
    faqs: [
      { q: 'Can a secure and anxious relationship work?', a: "It is one of the more stable attachment pairings. A secure partner's consistency tends to lower an anxious partner's baseline worry over time, and an anxious partner's expressiveness is rarely draining to someone secure. It still takes effort: the secure partner has to keep communicating clearly rather than assuming things are fine, and the anxious partner has to practise sitting with uncertainty instead of seeking immediate reassurance." },
      { q: 'Does an anxious person become more secure with a secure partner?', a: "Often, gradually. Attachment patterns respond to lived experience, and a partner who stays calm, follows through, and does not withdraw under pressure gives the anxious nervous system repeated evidence that closeness is reliable. This is not guaranteed and it is not the secure partner's job to fix anyone — but consistency over time is the main ingredient, and a secure partner supplies it more naturally." },
      { q: 'Is secure–anxious a better match than secure–avoidant?', a: 'There is no ranking. The friction is just different. A secure–anxious pair tends to struggle around reassurance and the pace of contact; a secure–avoidant pair tends to struggle around emotional availability and how much closeness is enough. Both are workable with a secure partner in the mix.' },
    ],
  },
  {
    slug: 'anxious-and-avoidant', left: 'Anxious', right: 'Avoidant',
    lede: "Anxious and avoidant is the pairing most people have heard about — often called the “anxious-avoidant trap.” It is real, it is common, and it is not automatically doomed.",
    connect: "Their instincts are opposite, which means each partner holds something the other is missing. The avoidant partner can show the anxious one that space is not abandonment; the anxious partner can show the avoidant one that closeness is not a trap. When both are willing to stretch, each becomes a little more secure.",
    friction: "Under stress the anxious partner moves toward their partner and the avoidant partner moves away. The more one reaches, the more the other retreats, and the loop tightens. The anxious partner reads distance as rejection; the avoidant partner reads pursuit as pressure. Both readings are accurate to the person having them.",
    tips: {
      Anxious: "When you feel your partner pull back, resist the urge to chase. Say what you need once, clearly, then give it room. The chase is what confirms their fear that closeness costs them their freedom.",
      Avoidant: "When you need space, say so with a timeframe instead of going quiet — “I need an hour, I'm not leaving.” The open-ended silence is what an anxious partner fills in, usually with the worst version.",
    },
    faqs: [
      { q: 'Can an anxious-avoidant relationship work?', a: 'Yes, though it takes more deliberate effort than most pairings. The core work is interrupting the pursue-withdraw loop: the anxious partner practises asking for reassurance directly instead of testing, and the avoidant partner practises signposting their need for space instead of vanishing. Many couples do this successfully; some find the constant management is not worth it. Both outcomes are legitimate.' },
      { q: 'Why do anxious and avoidant people attract each other?', a: "Each style's strategy is familiar. The anxious partner is used to chasing connection; the avoidant partner is used to being chased and to defending their space. The dynamic feels recognisable to both, even when it is painful. Recognising the pattern is the first step to not being run by it." },
      { q: 'Who should change first in an anxious-avoidant relationship?', a: "Neither. Both moves have to happen roughly together, because each one makes the other easier. The avoidant partner's clear “I need an hour, I'm coming back” makes it safer for the anxious partner to let go; the anxious partner's willingness to let go makes space feel less like a threat to the avoidant partner." },
    ],
  },
  {
    slug: 'secure-and-avoidant', left: 'Secure', right: 'Avoidant',
    lede: 'A secure partner is usually the easiest match for an avoidant one — steady enough not to trigger the need for distance, and direct enough to close the gaps an avoidant partner leaves.',
    connect: "The secure partner's steadiness gives the avoidant partner room without making them feel managed. There is no panic when the avoidant partner goes quiet, no scorekeeping, no demand to perform closeness. To someone avoidant, that combination is rare and worth a great deal.",
    friction: "The avoidant partner can be so undemanding that the secure partner genuinely cannot tell whether they are deeply invested or just comfortable. Secure does not mean mind-reader — if the avoidant partner never reaches first, the secure partner may slowly stop reaching too, and the relationship cools without either person deciding it should.",
    tips: {
      Avoidant: "Initiate something small and unprompted now and then — a plan, a text, a question about their day. It tells your partner the closeness is chosen, not just tolerated.",
      Secure: "When your partner retreats, it is rarely about you — but you do not have to guess. A direct “are we okay, or do you just need space?” gets a real answer.",
    },
    faqs: [
      { q: 'Is a secure-avoidant relationship stable?', a: 'Usually more stable than an anxious-avoidant one, because the secure partner does not escalate when the avoidant partner needs distance. The main risk is not conflict but under-investment: the relationship can drift toward two parallel lives if neither person actively reaches for the other.' },
      { q: 'How do you get an avoidant partner to open up?', a: 'Not by pushing. Avoidant partners open up when closeness feels optional rather than demanded. Consistency, low pressure, and not interpreting their space as rejection tend to work over time; ultimatums and pursuit tend to close the door further.' },
    ],
  },
  {
    slug: 'secure-and-fearful-avoidant', left: 'Secure', right: 'FearfulAvoidant',
    lede: 'For a fearful-avoidant partner, a secure one is often the relationship that slowly changes what they expect from love — if they can tolerate how calm it feels.',
    connect: "The secure partner's consistency is the thing that lets a fearful-avoidant partner's guard down over time. They do not flinch at being tested, they do not disappear when the fearful-avoidant partner pulls back, and they do not make basic reassurance something to be earned. Repeated over months, that rewrites expectations built from earlier hurt.",
    friction: "The fearful-avoidant partner may keep waiting for proof — again and again — long after it has been given. And when they pull away or push, the secure partner's calm can read as indifference, when it is actually steadiness held on purpose.",
    tips: {
      FearfulAvoidant: "Let proof accumulate instead of resetting the count every time you get scared. Notice when your partner shows up, and say it out loud — it trains you to trust the pattern.",
      Secure: "Don't take the testing personally, but don't go silent under it either. Naming it gently — “it feels like you're waiting for me to leave” — usually lands better than just absorbing it.",
    },
    faqs: [
      { q: 'Can a fearful-avoidant person have a secure relationship?', a: 'Yes. Fearful-avoidant attachment is among the most responsive to a stable partner and a stable relationship, precisely because the pattern was shaped by instability. It is not fast and it is not linear, but consistency over time is the main ingredient and a secure partner supplies it.' },
      { q: 'Why does a fearful-avoidant partner push away someone who treats them well?', a: 'Being treated well can be the trigger. Closeness that feels safe is unfamiliar, and unfamiliar can register as dangerous. The push-away is the old protection firing, not a verdict on the partner. Naming it out loud, rather than acting on it, is how it loses power.' },
    ],
  },
  {
    slug: 'anxious-and-fearful-avoidant', left: 'Anxious', right: 'FearfulAvoidant',
    lede: 'Two of the more reactive styles in one relationship — high feeling, high honesty, and two nervous systems that can set each other off.',
    connect: "Both partners feel things deeply and neither pretends otherwise. There is real emotional honesty here, and when both feel safe the relationship reaches a depth that steadier couples rarely touch.",
    friction: "The anxious partner wants more closeness; the fearful-avoidant partner wants it too but panics when it arrives, pulling back right as the anxious partner leans in. That whiplash reads as rejection to the anxious partner and sets off their own alarm. Two people on high alert, each triggering the other.",
    tips: {
      Anxious: "When your partner retreats after a close moment, don't take it as the verdict on the relationship. It is their pattern, not your failure. Stay steady and let them come back.",
      FearfulAvoidant: "When you feel the urge to bolt after getting close, name it instead of acting on it — “that felt like a lot, I need a minute.” It stops your partner spiralling while you settle.",
    },
    faqs: [
      { q: 'Can an anxious and fearful-avoidant couple work?', a: 'It can, but it usually needs both people doing regulation work — often with outside support — because neither style naturally provides the calm the other needs. The relationship tends to be intense in both directions: very close when safe, very reactive when not.' },
      { q: 'Why do anxious and fearful-avoidant partners trigger each other?', a: "The anxious partner's pursuit is exactly what makes a fearful-avoidant partner feel trapped; the fearful-avoidant partner's withdrawal is exactly what makes an anxious partner feel abandoned. Each person's fear produces the behaviour that confirms the other's fear." },
    ],
  },
  {
    slug: 'avoidant-and-fearful-avoidant', left: 'Avoidant', right: 'FearfulAvoidant',
    lede: 'Two partners who both value distance — an easy rhythm when things are calm, and a hard one to break when they are not.',
    connect: "Both value their independence and neither demands constant contact. When things are calm there is a genuinely easy, low-pressure rhythm here — space is a shared language and nobody has to explain their need for it.",
    friction: "When conflict hits, both withdraw — but the fearful-avoidant partner withdraws while also wanting to be chased, and the avoidant partner genuinely wants to be left alone. So the fearful-avoidant partner feels abandoned and the avoidant partner feels pursued, and the gap hardens with nobody moving to close it.",
    tips: {
      Avoidant: "Your partner's pulling away isn't the same as yours — part of them wants you to reach back. A short “I'm here, take your time” costs little and stops them spiralling.",
      FearfulAvoidant: "Your partner isn't withholding to punish you — space really is how they reset. Ask for a specific reconnection time instead of reading their silence as the end.",
    },
    faqs: [
      { q: 'Do two avoidant-leaning partners last?', a: 'They can be very stable in low-stress periods and struggle badly under strain, because neither partner is wired to initiate repair. The relationships that last tend to build in a scheduled check-in — a standing time to raise what would otherwise go unsaid.' },
      { q: 'How do avoidant and fearful-avoidant partners repair after a fight?', a: 'Deliberately, because it will not happen on its own. Naming who is responsible for reopening the conversation, and by when, is usually the only reliable mechanism.' },
    ],
  },
  {
    slug: 'avoidant-and-avoidant', left: 'Avoidant', right: 'Avoidant', sameType: true,
    lede: 'Two independent partners who never crowd each other — and can quietly drift apart without either one noticing in time.',
    connect: "Neither partner crowds the other, and neither takes a quiet evening personally. Both bring a whole independent life to the relationship and respect the other's need for room without requiring an explanation.",
    friction: "Both are so practised at not needing that the relationship can quietly starve. When something is wrong, each partner retreats into their own corner and waits it out — and “waiting it out” can stretch until the distance becomes the default.",
    tips: "Schedule the check-in you would both rather avoid. A standing “how are we actually doing?” once a week forces the conversation neither of you will start alone.",
    faqs: [
      { q: 'Can two avoidant partners have a healthy relationship?', a: 'Yes, and it can be unusually low-conflict. The work is not managing drama — it is making sure real issues get named before they calcify. A regular, low-stakes check-in does most of that job.' },
      { q: 'What kills an avoidant-avoidant relationship?', a: 'Rarely a blow-up. Usually slow, mutual under-investment: two people who are each waiting for the other to bring something up, until there is nothing left to bring up.' },
    ],
  },
  {
    slug: 'anxious-and-anxious', left: 'Anxious', right: 'Anxious', sameType: true,
    lede: 'Two partners who are both fully invested — and can amplify each other’s worst fears in a single unanswered text.',
    connect: "Both take the relationship seriously and neither lets things drift. When they are in sync the closeness is total — they check in, they show up, neither plays it cool. Few couples are this openly invested in each other.",
    friction: "When one partner gets scared, the other catches it. A single unanswered message can spiral into two people each convinced the other is pulling away, when neither is. Reassurance runs out faster than either can top it up.",
    tips: "Agree on a signal for “I'm anxious right now, not upset with you.” Naming the spiral out loud is what stops both of you feeding it.",
    faqs: [
      { q: 'Can two anxious partners have a stable relationship?', a: "Yes, especially once both can distinguish “I am anxious” from “something is actually wrong.” The strength of the pairing is mutual investment; the risk is co-escalation. A shared language for naming anxiety in the moment defuses most of it." },
      { q: 'Why do two anxious partners spiral?', a: "Each person's bid for reassurance can read to the other as a sign that something is wrong, which raises the other's anxiety, which produces another bid. The loop is fast. Interrupting it early — before either person is fully activated — is far easier than stopping it mid-spin." },
    ],
  },
  {
    slug: 'secure-and-secure', left: 'Secure', right: 'Secure', sameType: true,
    lede: 'The pairing that makes relationships look easy — because most of the hard wiring is already handled. Its one real risk is drift.',
    connect: "Both partners say what they mean, neither weaponises distance, and repair after a fight is usually quick. A lot of what other couples have to build deliberately is already in place here.",
    friction: "The risk is not drama, it is drift. Two low-maintenance people can get so comfortable that they stop actively tending the relationship and let it run on autopilot until it has quietly gone flat.",
    tips: "Keep doing the things you did early on — the planned date, the real question, the undivided evening. Security is a foundation, not a substitute for effort.",
    faqs: [
      { q: 'Is a secure-secure relationship the best match?', a: "It is the lowest-friction one, but “best” depends on the people. Secure attachment removes a category of problems; it does not supply chemistry, shared goals, or effort. Two secure partners still have to choose the relationship actively." },
      { q: 'Can a secure-secure relationship get boring?', a: 'It can go flat if both partners coast. The fix is the same as it was at the start: keep making time, keep asking real questions, keep planning things. Security makes that easier, not unnecessary.' },
    ],
  },
  {
    slug: 'fearful-avoidant-and-fearful-avoidant', left: 'FearfulAvoidant', right: 'FearfulAvoidant', sameType: true,
    lede: 'Two partners who understand the push-pull from the inside — and can both hit the exit at the same moment.',
    connect: "Both understand the push-pull from the inside. Neither needs the other to explain why closeness can feel dangerous — each has lived it. When both are regulated, the empathy runs deep.",
    friction: "They can trigger each other's exits simultaneously. One partner gets scared and pulls back, which scares the other into pulling back too, and suddenly both are gone with no one left to steady the relationship.",
    tips: "Name your patterns to each other while things are calm, not mid-spiral. If you both know “this is the part where we both run,” one of you can catch it and say so.",
    faqs: [
      { q: 'Can two fearful-avoidant partners make it work?', a: 'It is possible but demanding, because neither partner reliably provides the stability the other needs. The couples who manage it usually have a shared vocabulary for their patterns and often individual support alongside the relationship.' },
      { q: 'What happens when two fearful-avoidant people fight?', a: 'Both tend to withdraw at once, and because each also half-wants to be pursued, both can end up feeling abandoned. Pre-agreeing who reopens the conversation, and when, is the practical fix.' },
    ],
  },
];

// crumb / link label
function pairTitle(p) {
  return p.sameType ? `Two ${STYLE_LABEL[p.left]} Partners` : `${STYLE_LABEL[p.left]} and ${STYLE_LABEL[p.right]}`;
}
// <title> and <h1>
function pageTitle(p) {
  return p.sameType
    ? `Two ${STYLE_LABEL[p.left]} Partners: How ${STYLE_LABEL[p.left]}–${STYLE_LABEL[p.left]} Attachment Works`
    : `${STYLE_LABEL[p.left]} and ${STYLE_LABEL[p.right]} Attachment: How the Pairing Works`;
}
function h1(p) {
  return p.sameType ? `Two ${STYLE_LABEL[p.left]} Partners` : `${STYLE_LABEL[p.left]} and ${STYLE_LABEL[p.right]} Attachment`;
}
function art(styleKey) { return (styleKey === 'Anxious' || styleKey === 'Avoidant') ? 'an' : 'a'; }

function relatedLinks(current) {
  const others = PAGES.filter((p) => p.slug !== current).slice(0, 4);
  return others.map((p) => `<li><a href="/compatibility/${p.slug}">${esc(pairTitle(p))}</a></li>`).join('\n            ')
    + '\n            <li><a href="/compatibility">All pairings</a></li>';
}

function pageHtml(p) {
  const title = pageTitle(p);
  const url = `https://love-type.app/compatibility/${p.slug}`;
  const metaDesc = `Where the ${STYLE_LABEL[p.left].toLowerCase()} and ${STYLE_LABEL[p.right].toLowerCase()} attachment styles connect, where friction shows up, and what each partner can do about it.`;
  const faqJson = {
    '@context': 'https://schema.org', '@type': 'FAQPage',
    mainEntity: p.faqs.map((f) => ({ '@type': 'Question', name: f.q, acceptedAnswer: { '@type': 'Answer', text: f.a } })),
  };
  const articleJson = {
    '@context': 'https://schema.org', '@type': 'Article', headline: title, description: metaDesc,
    about: `${STYLE_LABEL[p.left].toLowerCase()} ${STYLE_LABEL[p.right].toLowerCase()} attachment compatibility`,
    inLanguage: 'en', datePublished: DATE, dateModified: DATE,
    author: { '@type': 'Organization', name: 'LoveType', url: 'https://love-type.app' },
    publisher: { '@type': 'Organization', name: 'LoveType', url: 'https://love-type.app' },
    mainEntityOfPage: url,
  };
  const breadcrumbJson = {
    '@context': 'https://schema.org', '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://love-type.app/' },
      { '@type': 'ListItem', position: 2, name: 'Compatibility', item: 'https://love-type.app/compatibility' },
      { '@type': 'ListItem', position: 3, name: pairTitle(p), item: url },
    ],
  };

  const tipsBlock = p.sameType
    ? `<div class="lens">
          <span class="lens-label">For both partners</span>
          <p>${esc(p.tips)}</p>
        </div>`
    : `<div class="lens">
          <span class="lens-label">If you are the ${STYLE_LABEL[p.left].toLowerCase()} partner</span>
          <p>${esc(p.tips[p.left])}</p>
        </div>
        <div class="lens">
          <span class="lens-label">If you are the ${STYLE_LABEL[p.right].toLowerCase()} partner</span>
          <p>${esc(p.tips[p.right])}</p>
        </div>`;

  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>${esc(title)}</title>
<meta name="description" content="${escAttr(metaDesc)}">
<link rel="canonical" href="${url}">
<meta name="robots" content="index, follow">
<meta name="theme-color" content="#0E0910">

<meta property="og:type" content="article">
<meta property="og:url" content="${url}">
<meta property="og:title" content="${escAttr(title)}">
<meta property="og:description" content="${escAttr(metaDesc)}">
<meta property="og:image" content="https://love-type.app/assets/og-image.png">
<meta property="og:image:width" content="1200">
<meta property="og:image:height" content="630">
<meta property="og:site_name" content="LoveType">

<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="${escAttr(title)}">
<meta name="twitter:description" content="${escAttr(metaDesc)}">
<meta name="twitter:image" content="https://love-type.app/assets/og-image.png">

<link rel="icon" type="image/svg+xml" href="/assets/favicon.svg">
<link rel="icon" type="image/png" sizes="32x32" href="/assets/favicon-32.png">
<link rel="apple-touch-icon" href="/assets/apple-touch-icon.png">

<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@0;1&family=Inter:ital,wght@0,400;0,500;0,600;0,700;1,400&display=swap" rel="stylesheet">

<script type="application/ld+json">
${JSON.stringify(articleJson, null, 2)}
</script>
<script type="application/ld+json">
${JSON.stringify(faqJson, null, 2)}
</script>
<script type="application/ld+json">
${JSON.stringify(breadcrumbJson, null, 2)}
</script>

${CSS}
</head>
<body>

${NAV}

<main class="article-main">
  <div class="article-wrap">

    <nav class="breadcrumb" aria-label="Breadcrumb">
      <a href="/">Home</a>
      <span aria-hidden="true">/</span>
      <a href="/compatibility">Compatibility</a>
      <span aria-hidden="true">/</span>
      <span aria-current="page">${esc(pairTitle(p))}</span>
    </nav>

    <a href="/compatibility" class="back-link">&larr; All attachment pairings</a>

    <article>
      <span class="article-eyebrow">Attachment pairing</span>
      <h1 class="serif article-title">${esc(h1(p))}</h1>
      <p class="article-updated">Updated ${DATE_HUMAN}</p>

      <div class="prose">
        <p class="article-lede">${esc(p.lede)}</p>

        <p>Attachment style describes how a person seeks safety and closeness in a relationship. It is not a personality type and not a verdict on a couple. What follows is the pattern that tends to show up when ${p.sameType ? 'two ' + STYLE_LABEL[p.left].toLowerCase() + ' partners are together' : art(p.left) + ' ' + STYLE_LABEL[p.left].toLowerCase() + ' and ' + art(p.right) + ' ' + STYLE_LABEL[p.right].toLowerCase() + ' style meet'} — where the two fit easily, where they predictably rub, and one concrete thing each partner can do about it.</p>

        <h2 class="serif">${p.sameType ? 'The ' + STYLE_LABEL[p.left].toLowerCase() + ' style' : 'The two styles'}</h2>
        ${p.sameType
          ? `<div class="pair-grid" style="grid-template-columns:1fr;">
          <div class="pair-card">
            <h3>Both partners</h3>
            <p>${esc(STYLE_BLURB[p.left])} In this pairing, both people bring that same set of strengths — and the same blind spots, which is where the friction below comes from.</p>
          </div>
        </div>`
          : `<div class="pair-grid">
          <div class="pair-card">
            <h3>The ${STYLE_LABEL[p.left].toLowerCase()} partner</h3>
            <p>${esc(STYLE_BLURB[p.left])}</p>
          </div>
          <div class="pair-card">
            <h3>The ${STYLE_LABEL[p.right].toLowerCase()} partner</h3>
            <p>${esc(STYLE_BLURB[p.right])}</p>
          </div>
        </div>`}

        <h2 class="serif">Where the two connect</h2>
        <p>${esc(p.connect)}</p>

        <h2 class="serif">Where the friction shows up</h2>
        <p>${esc(p.friction)}</p>

        <h2 class="serif">What each partner can try</h2>
        ${tipsBlock}

        <h2 class="serif">A pattern, not a verdict</h2>
        <p>Two people are always more than their attachment styles. This pairing is not a score, and a difficult stretch does not mean the relationship is mismatched. Used well, a label helps each person recognise their own reaction earlier and choose a different response — it is not a reason to explain away a partner's behaviour or to stay somewhere that does not feel safe.</p>

        <h2 class="serif">Common questions</h2>
        ${p.faqs.map((f) => `<h3>${esc(f.q)}</h3>\n        <p>${esc(f.a)}</p>`).join('\n        ')}

        <div class="article-cta">
          <h2 class="serif">See this for your own relationship</h2>
          <p>Take LoveType's three short tests, then compare results with your partner. The app reads both of your attachment, love and conflict styles and shows where you click and where you grind — for your specific pair.</p>
          <a href="${APP_STORE}" target="_blank" rel="noopener" class="btn-gold" style="text-decoration:none;">
            ${APPLE_SVG}
            Get LoveType
          </a>
        </div>

        <div class="related">
          <h2 class="serif">Other attachment pairings</h2>
          <ul>
            ${relatedLinks(p.slug)}
          </ul>
        </div>

        <p style="margin-top:36px;font-size:14.5px;">Related reading: <a href="/journal/attachment-style-vs-personality-type" class="inline-link">Attachment style vs personality type</a>.</p>
      </div>
    </article>

  </div>
</main>

${FOOTER}

</body>
</html>
`;
}

// ── write pages ──────────────────────────────────────────────────────────────
for (const p of PAGES) {
  const dir = path.join(OUT, 'compatibility', p.slug);
  fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(path.join(dir, 'index.html'), pageHtml(p));
}
console.log('wrote', PAGES.length, 'pairing pages');

// ── hub ──────────────────────────────────────────────────────────────────────
const hubStyle = fs.readFileSync(path.join(OUT, 'compatibility', 'index.html'), 'utf8').match(/<style>[\s\S]*?<\/style>/)[0];
const hubList = PAGES.map((p) =>
  `        <a href="/compatibility/${p.slug}">${esc(pairTitle(p))} <span class="arrow">&rarr;</span></a>`
).join('\n');
const hubJsonCollection = {
  '@context': 'https://schema.org', '@type': 'CollectionPage',
  name: 'Relationship Compatibility by Attachment, Love & Conflict Style',
  description: 'How the attachment, love and conflict styles pair up — where each combination connects, where it grinds, and what each partner can try.',
  inLanguage: 'en', url: 'https://love-type.app/compatibility',
  isPartOf: { '@type': 'WebSite', name: 'LoveType', url: 'https://love-type.app' },
};
const hubJsonCrumb = {
  '@context': 'https://schema.org', '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://love-type.app/' },
    { '@type': 'ListItem', position: 2, name: 'Compatibility', item: 'https://love-type.app/compatibility' },
  ],
};
const hubHtml = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Relationship Compatibility by Attachment, Love &amp; Conflict Style | LoveType</title>
<meta name="description" content="How the attachment, love and conflict styles pair up — where each combination connects, where it grinds, and what each partner can try. A pattern, not a score.">
<link rel="canonical" href="https://love-type.app/compatibility">
<meta name="robots" content="index, follow">
<meta name="theme-color" content="#0E0910">

<meta property="og:type" content="website">
<meta property="og:url" content="https://love-type.app/compatibility">
<meta property="og:title" content="Relationship Compatibility by Attachment, Love &amp; Conflict Style">
<meta property="og:description" content="How the attachment, love and conflict styles pair up — where each combination connects, where it grinds, and what each partner can try.">
<meta property="og:image" content="https://love-type.app/assets/og-image.png">
<meta property="og:image:width" content="1200">
<meta property="og:image:height" content="630">
<meta property="og:site_name" content="LoveType">

<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="Relationship Compatibility by Attachment, Love &amp; Conflict Style">
<meta name="twitter:description" content="How the attachment, love and conflict styles pair up — where each combination connects and where it grinds.">
<meta name="twitter:image" content="https://love-type.app/assets/og-image.png">

<link rel="icon" type="image/svg+xml" href="/assets/favicon.svg">
<link rel="icon" type="image/png" sizes="32x32" href="/assets/favicon-32.png">
<link rel="apple-touch-icon" href="/assets/apple-touch-icon.png">

<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@0;1&family=Inter:ital,wght@0,400;0,500;0,600;0,700;1,400&display=swap" rel="stylesheet">

<script type="application/ld+json">
${JSON.stringify(hubJsonCollection, null, 2)}
</script>
<script type="application/ld+json">
${JSON.stringify(hubJsonCrumb, null, 2)}
</script>

${hubStyle}
</head>
<body>

${NAV}

<main>
  <div class="hub-wrap">
    <nav class="breadcrumb" aria-label="Breadcrumb">
      <a href="/">Home</a>
      <span aria-hidden="true">/</span>
      <span aria-current="page">Compatibility</span>
    </nav>

    <span class="hub-eyebrow">Compatibility</span>
    <h1 class="serif hub-title">How the styles pair up</h1>
    <p class="hub-lede">Every combination of attachment, love and conflict style has a shape: somewhere the two people fit without trying, and somewhere they predictably grind.</p>
    <p class="hub-note">These are patterns, not scores. There is no percentage and no ranking here — a "hard" pairing is not a doomed one, and an "easy" pairing still takes effort. Each page covers where a combination connects, where the friction shows up, and one concrete thing each partner can try.</p>

    <section class="dim attachment">
      <h2 class="serif">Attachment style</h2>
      <p class="dim-sub">How each person seeks safety and closeness.</p>
      <div class="pair-list">
${hubList}
      </div>
    </section>

    <section class="dim love">
      <h2 class="serif">Love style</h2>
      <p class="dim-sub">How each person gives and recognises affection. <span class="soon">Pairings coming soon</span></p>
    </section>

    <section class="dim conflict">
      <h2 class="serif">Conflict style</h2>
      <p class="dim-sub">How each person moves when things get hard. <span class="soon">Pairings coming soon</span></p>
    </section>

    <div class="article-cta">
      <h2 class="serif">Compare your actual results</h2>
      <p>Take LoveType's three short tests, then compare with your partner. The app reads both of your styles and shows this for your specific pair — all three dimensions at once.</p>
      <a href="${APP_STORE}" target="_blank" rel="noopener" class="btn-gold" style="text-decoration:none;">
        ${APPLE_SVG}
        Get LoveType
      </a>
    </div>
  </div>
</main>

${FOOTER}

</body>
</html>
`;
fs.writeFileSync(path.join(OUT, 'compatibility', 'index.html'), hubHtml);
console.log('hub rewritten, list entries:', PAGES.length);

// ── sitemap ──────────────────────────────────────────────────────────────────
const sitemapUrls = [
  { loc: 'https://love-type.app/', changefreq: 'monthly', priority: '1.0' },
  { loc: 'https://love-type.app/compatibility', changefreq: 'monthly', priority: '0.8' },
  ...PAGES.map((p) => ({ loc: `https://love-type.app/compatibility/${p.slug}`, changefreq: 'monthly', priority: '0.7' })),
  { loc: 'https://love-type.app/journal/attachment-style-vs-personality-type', changefreq: 'monthly', priority: '0.8' },
  { loc: 'https://love-type.app/privacy', changefreq: 'yearly', priority: '0.3' },
  { loc: 'https://love-type.app/terms', changefreq: 'yearly', priority: '0.3' },
];
const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${sitemapUrls.map((u) => `  <url>\n    <loc>${u.loc}</loc>\n    <changefreq>${u.changefreq}</changefreq>\n    <priority>${u.priority}</priority>\n  </url>`).join('\n')}
</urlset>
`;
fs.writeFileSync(path.join(OUT, 'sitemap.xml'), sitemap);
console.log('sitemap: ', sitemapUrls.length, 'urls');
