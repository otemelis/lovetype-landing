// Editorial content for the style and LoveType pages (English).
// App result text (labels, taglines, descriptions, strengths, blind spots) comes from
// data/app-<lang>.json; everything here is web-only: definitions written to be quoted
// by search and answer engines, plus FAQs. Third person, non-clinical, no statistics.

export const DIMENSIONS = {
  attachment: {
    key: 'attachment',
    path: 'attachment-styles',
    family: 'attachment',
    name: 'Attachment style',
    plural: 'Attachment styles',
    test: 'Attachment Style test',
    questions: 24,
    minutes: 4,
    order: ['Secure', 'Anxious', 'Avoidant', 'FearfulAvoidant'],
    slug: { Secure: 'secure', Anxious: 'anxious', Avoidant: 'avoidant', FearfulAvoidant: 'fearful-avoidant' },
    short: { Secure: 'Secure', Anxious: 'Anxious', Avoidant: 'Avoidant', FearfulAvoidant: 'Fearful-avoidant' },
    question: 'Why you pull close.',
    hubTitle: 'The 4 attachment styles: secure, anxious, avoidant and fearful-avoidant',
    hubMetaTitle: 'The 4 Attachment Styles Explained: Secure, Anxious, Avoidant',
    hubDescription: 'What the four adult attachment styles are, how each one shows up in a relationship, and how they pair with each other. Take the free attachment style test in LoveType.',
    hubAnswer:
      'Attachment style describes how a person seeks closeness, trust and safety with a partner. Adult attachment research usually describes four styles: secure (comfortable with closeness and with independence), anxious (craves closeness and fears losing it), avoidant (values independence and keeps some distance) and fearful-avoidant (wants closeness but also fears it). A style is a pattern, not a fixed label: it can shift with experience and with a steady relationship.',
    hubFaqs: [
      { q: 'What are the four attachment styles?', a: 'Secure, anxious (sometimes called anxious-preoccupied), avoidant (dismissive-avoidant) and fearful-avoidant (also called disorganised). They describe how comfortable someone is with closeness and how much they worry about losing it.' },
      { q: 'Can your attachment style change?', a: 'Yes. Attachment patterns are shaped by experience, so they can move over time. A consistent relationship, self-awareness and, where needed, therapy are the usual routes toward feeling more secure.' },
      { q: 'How do I find out my attachment style?', a: 'A short self-report questionnaire is the usual starting point. The Attachment Style test in LoveType has 24 statements, takes about four minutes and shows your primary style plus how strongly you lean toward the others.' },
    ],
  },
  love: {
    key: 'love',
    path: 'love-styles',
    family: 'loveStyle',
    name: 'Love style',
    plural: 'Love styles',
    test: 'Love Style test',
    questions: 18,
    minutes: 3,
    order: ['Words', 'Time', 'Touch', 'Acts', 'Symbols', 'Experiences'],
    slug: { Words: 'words-of-affirmation', Time: 'quality-time', Touch: 'physical-touch', Acts: 'acts-of-service', Symbols: 'thoughtful-gifts', Experiences: 'shared-experiences' },
    short: { Words: 'Words of affirmation', Time: 'Quality time', Touch: 'Physical touch', Acts: 'Acts of service', Symbols: 'Thoughtful gifts', Experiences: 'Shared experiences' },
    question: 'How you feel loved.',
    hubTitle: 'Love styles: the six ways people give and feel love',
    hubMetaTitle: 'Love Languages & Love Styles: All 6 Explained | LoveType',
    hubDescription: 'Words of affirmation, quality time, touch, acts of service, gifts and shared experiences: what each love style means and how they pair.',
    hubAnswer:
      'A love style (often called a love language) is the way a person most naturally gives affection and most clearly recognises it. LoveType uses six: words of affirmation, quality time, physical touch, acts of service, thoughtful gifts and shared experiences. Most people use all six to some degree; the primary one is simply where love registers fastest. Partners with different love styles can love each other fully and still miss each other’s signals.',
    hubFaqs: [
      { q: 'Is a love style the same as a love language?', a: 'They describe the same idea: how people express and recognise love. LoveType says “love style” and measures six of them, the five most people know plus shared experiences, because many people feel closest through doing new things together.' },
      { q: 'Can partners with different love languages be happy together?', a: 'Yes. A mismatch doesn’t mean less love, only that each partner has to learn to read and speak the other’s style. Knowing both styles turns “you never show it” into “you show it differently.”' },
      { q: 'How do I find my love style?', a: 'The Love Style test in LoveType has 18 statements and takes about three minutes. It shows your primary love style and the full mix across all six.' },
    ],
  },
  conflict: {
    key: 'conflict',
    path: 'conflict-styles',
    family: 'conflict',
    name: 'Conflict style',
    plural: 'Conflict styles',
    test: 'Conflict Style test',
    questions: 24,
    minutes: 4,
    order: ['Pursuer', 'Withdrawer', 'Fixer', 'Peacekeeper', 'Defender', 'Processor'],
    slug: { Pursuer: 'pursuer', Withdrawer: 'withdrawer', Fixer: 'fixer', Peacekeeper: 'peacekeeper', Defender: 'defender', Processor: 'processor' },
    short: { Pursuer: 'Pursuer', Withdrawer: 'Withdrawer', Fixer: 'Fixer', Peacekeeper: 'Peacekeeper', Defender: 'Defender', Processor: 'Processor' },
    question: 'How you handle tension.',
    hubTitle: 'Conflict styles in relationships: the six patterns',
    hubMetaTitle: 'Conflict Styles in Relationships: Pursuer, Withdrawer & More',
    hubDescription: 'Pursuer, withdrawer, fixer, peacekeeper, defender, processor: what each conflict style does under tension and how the pairings play out.',
    hubAnswer:
      'A conflict style is what a person tends to do when a disagreement with a partner gets difficult. LoveType describes six: the pursuer (needs to resolve it now), the withdrawer (needs space first), the fixer (goes straight to solutions), the peacekeeper (smooths things over), the defender (explains their side first) and the processor (needs time to think). None is wrong; trouble usually comes from how two styles collide, such as the well-known pursue–withdraw loop.',
    hubFaqs: [
      { q: 'What is the pursuer–withdrawer pattern?', a: 'It is the loop where one partner pushes to talk during conflict and the other pulls away for space, and each move makes the other stronger. It eases when the withdrawer names a time to come back and the pursuer can let the pause happen.' },
      { q: 'Is one conflict style healthier than the others?', a: 'No. Each style protects something real: the connection, the relationship, fairness or clarity. What matters is whether both partners can repair after a fight.' },
      { q: 'How do I find my conflict style?', a: 'The Conflict Style test in LoveType has 24 statements and takes about four minutes. It shows your primary style and how you lean toward the others.' },
    ],
  },
};

// Per-style web copy. `answer` is the quotable definition; `signs` are observable
// behaviours; `faqs` answer real search questions.
export const STYLES = {
  attachment: {
    Secure: {
      seoTitle: 'Secure Attachment Style: Meaning, Signs and Relationships',
      answer: 'A secure attachment style means feeling comfortable with closeness and with independence at the same time. Securely attached people trust that a partner will be there, don’t panic when there is distance, and can talk about problems without treating them as a threat to the relationship.',
      signs: ['Says what they need without testing or hinting', 'Can be apart without feeling the relationship is at risk', 'Stays present in a hard conversation instead of escalating or shutting down', 'Repairs quickly after a fight'],
      faqs: [
        { q: 'What does secure attachment look like in a relationship?', a: 'Steady contact without constant reassurance, honest conversations about needs, and conflict that ends in repair rather than distance. A secure partner can give space and closeness without either feeling like a loss.' },
        { q: 'Can you become securely attached?', a: 'Yes. People often move toward security through consistent relationships, self-reflection and, where needed, therapy. This is sometimes called “earned security.”' },
      ],
    },
    Anxious: {
      seoTitle: 'Anxious Attachment Style: Meaning, Signs and How It Shows Up',
      answer: 'An anxious attachment style means wanting a lot of closeness and worrying about losing it. Anxiously attached people are highly attuned to a partner’s mood, read small changes as signs of distance, and feel a strong urge to reconnect and get reassurance when something feels off.',
      signs: ['Notices small shifts in tone or reply speed', 'Feels an urgent need to talk things through right away', 'Seeks reassurance that the relationship is okay', 'Gives a great deal of warmth and attention'],
      faqs: [
        { q: 'What triggers anxious attachment?', a: 'Uncertainty: slow replies, sudden quiet, plans that change without explanation, or a partner who seems distracted. The common thread is not knowing where they stand.' },
        { q: 'How do you calm anxious attachment?', a: 'Naming the need directly (“I just need to hear we’re okay”) works better than testing or chasing. A partner who is consistent, and who says when they need space and when they’ll be back, also lowers the alarm over time.' },
      ],
    },
    Avoidant: {
      seoTitle: 'Avoidant Attachment Style: Meaning, Signs and Relationships',
      answer: 'An avoidant attachment style means valuing independence and keeping some emotional distance, especially when closeness intensifies. Avoidant people often care deeply but show it quietly, handle problems alone, and need room to reset when a relationship starts to feel demanding.',
      signs: ['Prefers to deal with problems alone first', 'Pulls back when a partner wants more closeness', 'Shows care through actions more than words', 'Feels pressure when emotions run high'],
      faqs: [
        { q: 'Do avoidant people fall in love?', a: 'Yes. Avoidant attachment is about how closeness feels, not about whether love is there. Avoidant partners often love deeply but need intimacy to feel optional rather than demanded.' },
        { q: 'How do you communicate with an avoidant partner?', a: 'Keep the pressure low and be direct: say what you need once, clearly, and give it room. Asking “do you need space, or is something wrong?” usually gets a more honest answer than pursuing.' },
      ],
    },
    FearfulAvoidant: {
      seoTitle: 'Fearful-Avoidant Attachment Style: Meaning and Signs',
      answer: 'A fearful-avoidant attachment style (also called disorganised) means wanting deep closeness and fearing it at the same time. Fearful-avoidant people often move toward a partner, then pull away when vulnerability starts to feel unsafe, which can make relationships feel like push and pull.',
      signs: ['Wants intimacy but feels exposed when it arrives', 'Swings between reaching out and retreating', 'Looks for proof that a partner will stay', 'Protects themselves before they can be hurt'],
      faqs: [
        { q: 'What is the difference between avoidant and fearful-avoidant?', a: 'An avoidant person mostly prefers distance and feels fine with it. A fearful-avoidant person wants closeness but fears it, so they move between seeking connection and pulling away.' },
        { q: 'Can a fearful-avoidant person have a healthy relationship?', a: 'Yes. A steady, patient relationship gives repeated evidence that closeness can be safe, and naming the push-pull out loud takes much of its power away.' },
      ],
    },
  },
  love: {
    Words: {
      seoTitle: 'Words of Affirmation Love Language: Meaning and Examples',
      answer: 'Words of affirmation is the love style of people who feel most loved through what is said: compliments, appreciation, encouragement and hearing “I love you” out loud. For them, specific words make love real, and silence where words should be can feel like distance.',
      signs: ['Remembers kind things people said years ago', 'Feels hurt by harsh words more than most', 'Expresses love by saying it', 'Notices when appreciation goes unspoken'],
      faqs: [
        { q: 'How do you show love to someone with words of affirmation?', a: 'Be specific and say it unprompted: what you noticed, what you admire, what they did that mattered. A short message in the middle of the day often lands better than a big speech.' },
        { q: 'What hurts someone whose love language is words?', a: 'Criticism, sarcasm and long silences. Withheld appreciation can feel like withheld love.' },
      ],
    },
    Time: {
      seoTitle: 'Quality Time Love Language: Meaning and Examples',
      answer: 'Quality time is the love style of people who feel most loved through undivided attention. What matters is not how many hours, but whether a partner is fully present: phone down, listening, choosing to be there.',
      signs: ['Values long talks and unhurried evenings', 'Feels hurt by distracted attention', 'Remembers moments more than gifts', 'Plans time together on purpose'],
      faqs: [
        { q: 'How do you show love to a quality time person?', a: 'Protect time that is only for them and be fully there in it. Twenty attentive minutes count for more than an evening spent half on a screen.' },
        { q: 'Is quality time the same as spending a lot of time together?', a: 'No. Quantity helps less than presence. Feeling chosen and listened to is the point.' },
      ],
    },
    Touch: {
      seoTitle: 'Physical Touch Love Language: Meaning and Examples',
      answer: 'Physical touch is the love style of people who feel most loved through closeness: holding hands, a long hug, a hand on the back, sitting close. Affection through touch is how they know, without words, that they are wanted and safe.',
      signs: ['Reaches for a partner’s hand without thinking', 'Feels disconnected after days without affection', 'Calms down through a hug more than a talk', 'Shows care through closeness'],
      faqs: [
        { q: 'Is physical touch only about intimacy?', a: 'No. Everyday, non-sexual touch matters most: hugs, sitting close, a hand on the shoulder. It is a steady signal of connection.' },
        { q: 'How do you love someone with a physical touch love language?', a: 'Make small touches part of the day: a greeting hug, holding hands on a walk, sitting close on the sofa. Consistency matters more than big moments.' },
      ],
    },
    Acts: {
      seoTitle: 'Acts of Service Love Language: Meaning and Examples',
      answer: 'Acts of service is the love style of people who feel most loved when a partner does something helpful for them: handling a task, easing their load, following through. For them, love is proven by what people do, not only by what they say.',
      signs: ['Notices who follows through', 'Shows love by fixing or handling things', 'Feels let down by broken promises', 'Values reliability over grand gestures'],
      faqs: [
        { q: 'What are examples of acts of service?', a: 'Making coffee before they wake, taking a chore off their list, sorting out the thing they have been dreading, or simply doing what you said you would do.' },
        { q: 'What hurts someone whose love language is acts of service?', a: 'Promises that aren’t kept and help that comes with complaints. Unreliability can feel like not being cared for.' },
      ],
    },
    Symbols: {
      seoTitle: 'Thoughtful Gifts Love Language: Meaning and Examples',
      answer: 'Thoughtful gifts (often called receiving gifts) is the love style of people who feel loved through small, considered gestures that say “I was thinking of you.” The cost is not the point; the attention behind the object is.',
      signs: ['Keeps notes, tickets and small keepsakes', 'Remembers the details people mention', 'Gives gifts that show they listened', 'Feels hurt when special days are forgotten'],
      faqs: [
        { q: 'Is the gift love language materialistic?', a: 'No. People with this love style are moved by thoughtfulness, not price. A small thing that shows you listened means more than an expensive one that doesn’t.' },
        { q: 'How do you show love to a gift-giving person?', a: 'Notice what they mention and bring it back later: the snack they liked, the book they talked about, a photo from a day you shared.' },
      ],
    },
    Experiences: {
      seoTitle: 'Shared Experiences Love Style: Meaning and Examples',
      answer: 'Shared experiences is the love style of people who feel closest while doing something together: a trip, a concert, a new restaurant, a project. For them, love lives in memories made side by side, and routine without anything new can feel like drifting apart.',
      signs: ['Plans adventures and new things to try', 'Bonds through doing rather than talking', 'Remembers relationships by their moments', 'Feels restless when life gets repetitive'],
      faqs: [
        { q: 'Is shared experiences one of the five love languages?', a: 'It isn’t one of the original five. LoveType adds it as a sixth love style because many people feel most connected through doing new things together.' },
        { q: 'How do you love someone who values shared experiences?', a: 'Make plans together and protect them: small adventures count, like a new walk or cooking something neither of you has tried.' },
      ],
    },
  },
  conflict: {
    Pursuer: {
      seoTitle: 'Pursuer Conflict Style: Meaning and the Pursue–Withdraw Loop',
      answer: 'A pursuer is someone who needs to address a conflict right away. Unresolved tension feels unsafe to them, so they push to talk it through now, and a partner going quiet can feel like love being withdrawn.',
      signs: ['Wants to resolve a fight before sleeping', 'Follows a partner who walks away', 'Feels silence as rejection', 'Raises issues directly'],
      faqs: [
        { q: 'How can a pursuer stop chasing during conflict?', a: 'Say what you need once, clearly, then let the pause happen. Agreeing on a time to come back makes waiting much easier.' },
        { q: 'Is being a pursuer the same as anxious attachment?', a: 'They often appear together, but they measure different things. Attachment is about closeness in general; conflict style is about what you do during a disagreement.' },
      ],
    },
    Withdrawer: {
      seoTitle: 'Withdrawer Conflict Style: Meaning and How to Handle It',
      answer: 'A withdrawer is someone who steps back when conflict rises, not to avoid it but to avoid saying something they’ll regret. They usually come back calmer and clearer, if they are given space and the pause has a clear end.',
      signs: ['Goes quiet when voices rise', 'Needs time alone before talking', 'Feels flooded by intense emotion', 'Returns to the issue once calmer'],
      faqs: [
        { q: 'Is withdrawing during conflict the same as stonewalling?', a: 'Not necessarily. Stonewalling shuts the conversation down; healthy withdrawing is a pause with a promise to return. Saying “I need an hour, then let’s talk” makes the difference.' },
        { q: 'How do you talk to a partner who withdraws?', a: 'Lower the pressure, agree on a time to come back to it, and avoid following them while they’re still flooded.' },
      ],
    },
    Fixer: {
      seoTitle: 'Fixer Conflict Style: Meaning and Strengths',
      answer: 'A fixer handles conflict by going straight to solutions: identify the problem, propose a plan, move on. Fixing is how their care shows up, though a partner who first needs to feel heard can experience it as being rushed.',
      signs: ['Offers solutions in the middle of feelings', 'Gets impatient with going round in circles', 'Shows care by solving', 'Wants a clear outcome from a fight'],
      faqs: [
        { q: 'Why does my partner get upset when I try to fix things?', a: 'Because they may need to feel understood before they can think about solutions. Asking “do you want help or do you want me to listen?” resolves most of it.' },
        { q: 'What is the strength of a fixer in a relationship?', a: 'Problems don’t linger. A fixer turns conflict into change, which keeps small issues from becoming big ones.' },
      ],
    },
    Peacekeeper: {
      seoTitle: 'Peacekeeper Conflict Style: Meaning and Hidden Costs',
      answer: 'A peacekeeper works hard to keep things calm: agreeing, smoothing over, putting their own feelings aside. It keeps conflict small in the moment, but what goes unsaid tends to build up over time.',
      signs: ['Says “it’s fine” when it isn’t quite', 'Avoids raising small irritations', 'Feels uneasy when others are upset', 'Prioritises harmony over being right'],
      faqs: [
        { q: 'Is avoiding conflict bad for a relationship?', a: 'Avoiding every disagreement lets resentment build. Raising small things early, kindly, usually protects the peace better than staying silent.' },
        { q: 'How can a peacekeeper speak up?', a: 'Start small and early: name one minor thing while it’s still minor. It gets easier with practice and keeps feelings from piling up.' },
      ],
    },
    Defender: {
      seoTitle: 'Defender Conflict Style: Meaning and How to Work With It',
      answer: 'A defender responds to criticism by explaining their side first. When they feel misunderstood or unfairly blamed, they need to be heard before they can hear feedback, which a partner can read as not listening.',
      signs: ['Explains intentions before acknowledging impact', 'Feels strongly about fairness', 'Reacts sharply to blame', 'Softens once understood'],
      faqs: [
        { q: 'How do you argue with a defensive partner?', a: 'Lead with what you appreciate and describe the situation rather than their character. Starting with “I felt” rather than “you always” leaves less to defend.' },
        { q: 'How can a defender listen better in conflict?', a: 'Acknowledge the impact first (“I can see that hurt”), then explain. Both can be true, and the order changes how it lands.' },
      ],
    },
    Processor: {
      seoTitle: 'Processor Conflict Style: Meaning and Strengths',
      answer: 'A processor needs time to think before responding to conflict, so that what they say is considered rather than reactive. Their best insights often arrive hours after the argument, which can look like disengagement to a partner who wants to talk now.',
      signs: ['Says “let me think about it”', 'Comes back later with a clear view', 'Dislikes being pushed for an instant answer', 'Rarely says things they regret'],
      faqs: [
        { q: 'What is the difference between a processor and a withdrawer?', a: 'A withdrawer steps away to cool down from intense emotion; a processor steps away to think. Both come back, for different reasons.' },
        { q: 'How do you resolve conflict with a processor?', a: 'Raise the issue, agree on when to return to it, and let them think. The conversation that follows is usually calmer and more useful.' },
      ],
    },
  },
};

// LoveType archetype slugs and short web copy. Label/tagline/description from the app.
export const ARCHETYPES = {
  order: ['SteadyBuilder', 'LoyalReassurer', 'IndependentRomantic', 'GuardedHeart', 'WarmNurturer', 'TenderPresence', 'ThoughtfulPartner', 'AdventureBond', 'DeepProcessor', 'PassionateAdvocate'],
  slug: {
    SteadyBuilder: 'quiet-builder', LoyalReassurer: 'loyal-reassurer', IndependentRomantic: 'independent-romantic', GuardedHeart: 'guarded-heart', WarmNurturer: 'warm-nurturer',
    TenderPresence: 'tender-presence', ThoughtfulPartner: 'thoughtful-partner', AdventureBond: 'joyful-explorer', DeepProcessor: 'deep-processor', PassionateAdvocate: 'passionate-advocate',
  },
  // Accent family that leads each archetype's light.
  family: {
    SteadyBuilder: 'profile', LoyalReassurer: 'attachment', IndependentRomantic: 'conflict', GuardedHeart: 'attachment', WarmNurturer: 'profile',
    TenderPresence: 'attachment', ThoughtfulPartner: 'loveStyle', AdventureBond: 'loveStyle', DeepProcessor: 'conflict', PassionateAdvocate: 'attachment',
  },
};

export const LOVETYPES_HUB = {
  title: 'The 10 LoveTypes',
  metaTitle: 'The 10 LoveTypes: Relationship Archetypes From 3 Tests | LoveType',
  description: 'Your attachment style, love style and conflict style combine into one of ten LoveTypes, from The Quiet Builder to The Passionate Advocate. Meet all ten.',
  answer: 'A LoveType is a relationship archetype built from three results: how you attach, how you give and feel love, and how you handle conflict. LoveType weighs all three and maps them to one of ten patterns, so the result describes how the pieces work together rather than each in isolation.',
};
