// Pairing-page dimension copy (moved from the retired scripts/gen-compat.mjs).
export const DIM = {
  attachment: {
    eyebrow: 'Attachment pairing',
    noun: 'attachment', Noun: 'Attachment',
    describes: 'Attachment style describes how a person seeks safety and closeness in a relationship. It is not a personality type and not a verdict on a couple.',
    label: { Secure: 'Secure', Anxious: 'Anxious', Avoidant: 'Avoidant', FearfulAvoidant: 'Fearful-Avoidant' },
    slug: { Secure: 'secure', Anxious: 'anxious', Avoidant: 'avoidant', FearfulAvoidant: 'fearful-avoidant' },
    blurb: {
      Secure: 'Brings calm and consistency, is comfortable with closeness without losing themselves, and can stay present through a hard conversation.',
      Anxious: 'Loves with their whole self and reads every shift in tone. Fully present when secure; under stress, feels an urgent pull to close any gap and confirm the connection is intact.',
      Avoidant: 'Values independence and has learned to handle things alone. Cares deeply but shows it quietly, and needs room when closeness intensifies.',
      FearfulAvoidant: 'Wants deep connection and fears it at the same time. Moves toward closeness, then pulls back when vulnerability starts to feel dangerous.',
    },
  },
  love: {
    eyebrow: 'Love style pairing',
    noun: 'love style', Noun: 'Love style',
    describes: 'Love style describes how a person gives and recognises affection. It is not a ranking of couples, and every combination can work.',
    label: { Words: 'words of affirmation', Time: 'quality time', Touch: 'physical touch', Acts: 'acts of service', Symbols: 'thoughtful gifts', Experiences: 'shared experiences' },
    slug: { Words: 'words-of-affirmation', Time: 'quality-time', Touch: 'physical-touch', Acts: 'acts-of-service', Symbols: 'thoughtful-gifts', Experiences: 'shared-experiences' },
    blurb: {
      Words: 'Gives and receives love through language — saying it, out loud and specifically. Silence where words should be can feel like absence.',
      Time: 'Feels loved through undivided, unhurried attention. Not how much time, but whether someone is truly there when they are.',
      Touch: 'Connects through physical closeness — a hand on the back, a long hug, sitting close. Affection is not optional; it is how they know they are wanted.',
      Acts: 'Shows love by doing — handling the hard thing, taking something off the other person’s plate, being reliably there in practical ways.',
      Symbols: 'Notices and remembers the small things, and is moved by thoughtful gestures — not for their cost, but for the attention behind them.',
      Experiences: 'Feels closest during shared moments — a trip, a concert, something neither would have done alone. Love lives in things worth remembering.',
    },
  },
  conflict: {
    eyebrow: 'Conflict style pairing',
    noun: 'conflict style', Noun: 'Conflict style',
    describes: 'Conflict style describes what a person does when a disagreement gets difficult. It is a tendency, not a fault, and no combination is doomed.',
    label: { Pursuer: 'pursuer', Withdrawer: 'withdrawer', Fixer: 'fixer', Peacekeeper: 'peacekeeper', Defender: 'defender', Processor: 'processor' },
    slug: { Pursuer: 'pursuer', Withdrawer: 'withdrawer', Fixer: 'fixer', Peacekeeper: 'peacekeeper', Defender: 'defender', Processor: 'processor' },
    blurb: {
      Pursuer: 'Needs to address a problem now. Letting tension sit unresolved hurts more than the conflict itself, and a partner going quiet can feel like withdrawn love.',
      Withdrawer: 'Needs to step back when conflict rises — not to avoid it, but to keep from saying something they’ll regret. Returns calmer and clearer once given space.',
      Fixer: 'Wants to identify the issue, propose a solution and get to the other side. Sitting in the feeling without working toward a fix is hard; fixing is how their care shows up.',
      Peacekeeper: 'Works hard to keep the peace — absorbing what they feel, agreeing when they don’t quite, smoothing things over. What goes unspoken tends to accumulate.',
      Defender: 'When they feel criticised or unfairly blamed, defends their case first. Can hear feedback — but not until they’ve had the chance to explain themselves.',
      Processor: 'Needs time before responding to conflict, so what they say is considered rather than reactive. The deepest insights arrive later than the argument.',
    },
  },
};
