export type Archetype = "pilgrim" | "first_pilgrim" | "connoisseur" | "immersionist";

export interface QuizOption {
  id: string;
  label: string;
  scores: Partial<Record<Archetype, number>>;
}

export interface QuizQuestion {
  id: string;
  question: string;
  options: QuizOption[];
  // If set, this question is only shown when the answer to another question matches
  showIf?: { questionId: string; answerId: string };
  // If set, shown instead of this question when condition is NOT met
  alternateFor?: string;
}

export const QUIZ_QUESTIONS: QuizQuestion[] = [
  {
    id: "q1",
    question: "How many times have you attended this type of event before?",
    options: [
      { id: "q1a", label: "Never — this is my first time", scores: { first_pilgrim: 3 } },
      { id: "q1b", label: "Once or twice", scores: { first_pilgrim: 1, pilgrim: 1 } },
      { id: "q1c", label: "Three or more times", scores: { pilgrim: 2 } },
      { id: "q1d", label: "I go every year", scores: { pilgrim: 3 } },
    ],
  },
  {
    id: "q2",
    question: "What matters most to you about the trip?",
    options: [
      { id: "q2a", label: "Being inside the atmosphere — the crowd, the noise, the occasion", scores: { pilgrim: 2 } },
      { id: "q2b", label: "Understanding the event and doing it properly for the first time", scores: { first_pilgrim: 3 } },
      { id: "q2c", label: "Access to things most people don't know about", scores: { connoisseur: 3 } },
      { id: "q2d", label: "Experiencing the city and culture around the sport", scores: { immersionist: 3 } },
    ],
  },
  {
    id: "q3",
    question: "How do you usually plan a trip?",
    options: [
      { id: "q3a", label: "I start planning months out and go deep", scores: { pilgrim: 2, connoisseur: 1 } },
      { id: "q3b", label: "I do a lot of research but get overwhelmed by conflicting advice", scores: { first_pilgrim: 3 } },
      { id: "q3c", label: "I find one trusted source and follow it", scores: { first_pilgrim: 2 } },
      { id: "q3d", label: "I plan loosely and figure it out when I arrive", scores: { immersionist: 2 } },
    ],
  },
  {
    id: "q4",
    question: "Where do you usually eat when travelling?",
    options: [
      { id: "q4a", label: "Wherever the locals eat — I'll go off the tourist trail", scores: { immersionist: 3 } },
      { id: "q4b", label: "I research and book the best places in advance", scores: { connoisseur: 2, pilgrim: 1 } },
      { id: "q4c", label: "I have a few trusted spots I return to each visit", scores: { pilgrim: 2 } },
      { id: "q4d", label: "Wherever is convenient around the event", scores: { first_pilgrim: 2 } },
    ],
  },
  {
    id: "q5",
    question: "How do you think about budget on a sports trip?",
    options: [
      { id: "q5a", label: "I spend on what matters and don't think twice", scores: { connoisseur: 3 } },
      { id: "q5b", label: "I balance — splurge on a few things, save on others", scores: { pilgrim: 2 } },
      { id: "q5c", label: "I'm careful — the ticket cost is already significant", scores: { first_pilgrim: 2 } },
      { id: "q5d", label: "I prioritise experiences over comfort", scores: { immersionist: 2 } },
    ],
  },
  {
    id: "q6",
    question: "Who do you usually travel with?",
    options: [
      { id: "q6a", label: "Solo", scores: { immersionist: 2, connoisseur: 1 } },
      { id: "q6b", label: "Partner or close friend", scores: { pilgrim: 1, connoisseur: 1 } },
      { id: "q6c", label: "A group of friends — we go together every year", scores: { pilgrim: 3 } },
      { id: "q6d", label: "Family", scores: { first_pilgrim: 2 } },
    ],
  },
  {
    id: "q7",
    question: "What's your biggest frustration when planning a sports trip?",
    options: [
      { id: "q7a", label: "Finding experiences that go beyond the match ticket", scores: { connoisseur: 2, immersionist: 1 } },
      { id: "q7b", label: "Too much generic advice that doesn't apply to my situation", scores: { first_pilgrim: 3 } },
      { id: "q7c", label: "Booking things that sell out before I get to them", scores: { pilgrim: 2 } },
      { id: "q7d", label: "Not knowing which parts of the city are actually worth time", scores: { immersionist: 2 } },
    ],
  },
  {
    // Shown only to non-first-timers (q1 answer is NOT q1a)
    id: "q8",
    question: "When you've been to this event before, what did you wish you'd known?",
    showIf: { questionId: "q1", answerId: "q1a" },
    alternateFor: "q8_alt",
    options: [
      { id: "q8a", label: "Where to eat and drink around the venue", scores: { immersionist: 2 } },
      { id: "q8b", label: "How to get better access or tickets", scores: { connoisseur: 2 } },
      { id: "q8c", label: "The unwritten rules and rituals that regulars know", scores: { pilgrim: 3 } },
      { id: "q8d", label: "How to spend the time between sessions", scores: { immersionist: 1, pilgrim: 1 } },
    ],
  },
  {
    // Shown only to first-timers (q1 answer IS q1a)
    id: "q8_alt",
    question: "What's your top priority for this first trip?",
    showIf: { questionId: "q1", answerId: "q1a" },
    options: [
      { id: "q8_alt_a", label: "Getting the full experience — not missing anything important", scores: { first_pilgrim: 3 } },
      { id: "q8_alt_b", label: "Finding the things most guides don't mention", scores: { connoisseur: 2 } },
      { id: "q8_alt_c", label: "Understanding the sport's culture and history", scores: { immersionist: 2 } },
      { id: "q8_alt_d", label: "Making it a great trip for everyone in my group", scores: { first_pilgrim: 2 } },
    ],
  },
  {
    id: "q9",
    question: "How do you feel about the neighbourhood around a sporting venue?",
    options: [
      { id: "q9a", label: "It's usually irrelevant — I'm there for the sport", scores: { pilgrim: 2 } },
      { id: "q9b", label: "It's part of the experience — I always explore it", scores: { immersionist: 3 } },
      { id: "q9c", label: "I want to know the one or two places worth visiting nearby", scores: { first_pilgrim: 2 } },
      { id: "q9d", label: "I research it in depth — some of my best meals have been near venues", scores: { connoisseur: 2, immersionist: 1 } },
    ],
  },
  {
    id: "q10",
    question: "What does a perfect match day look like?",
    options: [
      { id: "q10a", label: "Early arrival, full day at the venue, late dinner nearby", scores: { pilgrim: 2 } },
      { id: "q10b", label: "Well-planned from start to finish with no surprises", scores: { first_pilgrim: 2 } },
      { id: "q10c", label: "Private or exclusive access somewhere in the day", scores: { connoisseur: 3 } },
      { id: "q10d", label: "Morning in the city, afternoon at the match, evening exploring", scores: { immersionist: 3 } },
    ],
  },
  {
    id: "q11",
    question: "How important is staying near the venue?",
    options: [
      { id: "q11a", label: "Essential — I want to walk there and be fully immersed", scores: { pilgrim: 3 } },
      { id: "q11b", label: "Preferred but not critical", scores: { first_pilgrim: 2 } },
      { id: "q11c", label: "Less important than staying somewhere excellent", scores: { connoisseur: 2 } },
      { id: "q11d", label: "I'd rather be somewhere interesting in the city", scores: { immersionist: 3 } },
    ],
  },
  {
    id: "q12",
    question: "What would make you come back to this platform after the trip?",
    options: [
      { id: "q12a", label: "Knowing it helped me have a better trip than I'd have planned alone", scores: { first_pilgrim: 2 } },
      { id: "q12b", label: "Finding something I couldn't have discovered any other way", scores: { connoisseur: 2, immersionist: 1 } },
      { id: "q12c", label: "A place to plan next year's version of the same trip", scores: { pilgrim: 3 } },
      { id: "q12d", label: "Recommendations that understood what kind of traveller I am", scores: { immersionist: 2 } },
    ],
  },
];

export const ARCHETYPE_DETAILS: Record<Archetype, { label: string; tagline: string; description: string }> = {
  pilgrim: {
    label: "The Pilgrim",
    tagline: "You've been before. You'll go again. Each trip goes one layer deeper.",
    description: "Wimbledon, the Ashes, the Masters — you don't need to discover these events, you need to deepen them. You know the rhythm of the fortnight, the restaurants worth returning to, the rituals that make it yours. We'll skip the basics and show you what's changed, what you missed last time, and what the regulars know that the guides don't.",
  },
  first_pilgrim: {
    label: "The First Pilgrim",
    tagline: "You've planned for this trip. We'll make sure it delivers.",
    description: "Going to a major sporting event for the first time is one of the better things you can do. It's also easy to get wrong — too many guides, conflicting advice, and no way to know what actually matters. We've been there multiple times so you don't have to figure it out from scratch. Clear priorities, no filler.",
  },
  connoisseur: {
    label: "The Connoisseur",
    tagline: "Access is the constraint. Not budget.",
    description: "You're not looking for a list of good restaurants — you want the table that isn't on the website. The hospitality that isn't in the brochure. The experience that requires knowing the right person or the right question to ask. We've done the groundwork. The concierge picks and booking guidance are built specifically for how you travel.",
  },
  immersionist: {
    label: "The Immersionist",
    tagline: "The sport is why you're going. The city is why you'll remember it.",
    description: "You could watch the match on television. You go because being there changes something — and because the neighbourhood, the food, the people in the stands tell you more about a place than any museum. The sport is the anchor. Everything around it is the trip.",
  },
};

export function scoreQuiz(answers: Record<string, string>): Archetype {
  const scores: Record<Archetype, number> = {
    pilgrim: 0,
    first_pilgrim: 0,
    connoisseur: 0,
    immersionist: 0,
  };

  for (const question of QUIZ_QUESTIONS) {
    const answerId = answers[question.id];
    if (!answerId) continue;
    const option = question.options.find((o) => o.id === answerId);
    if (!option) continue;
    for (const [archetype, points] of Object.entries(option.scores)) {
      scores[archetype as Archetype] += points ?? 0;
    }
  }

  // Tiebreak: Q2 is the most direct signal
  const q2Answer = answers["q2"];
  const tiebreakMap: Record<string, Archetype> = {
    q2a: "pilgrim", q2b: "first_pilgrim", q2c: "connoisseur", q2d: "immersionist",
  };

  const maxScore = Math.max(...Object.values(scores));
  const tied = (Object.entries(scores) as [Archetype, number][]).filter(([, s]) => s === maxScore);

  if (tied.length === 1) return tied[0][0];
  if (q2Answer && tiebreakMap[q2Answer]) return tiebreakMap[q2Answer];
  return tied[0][0];
}

// Returns the ordered list of questions to show based on answers so far
export function getVisibleQuestions(answers: Record<string, string>): QuizQuestion[] {
  const isFirstTimer = answers["q1"] === "q1a";
  return QUIZ_QUESTIONS.filter((q) => {
    if (q.id === "q8") return !isFirstTimer;
    if (q.id === "q8_alt") return isFirstTimer;
    return true;
  });
}
