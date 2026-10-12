// Trip Intelligence — approved 7-question questionnaire, revised 11 Oct
// 2026 (Q3 Atmosphere removed; Q4 "more_f1"/"day_trips" options renamed —
// see implementation revision spec). Do not reword further without a new
// approved spec.

import type {
  Q1Answer, Q2Answer, Q4Answer, Q5Answer, Q6Answer, Q7Answer, Q8Answer,
} from "./types";

interface QuestionOption<V extends string> {
  value: V;
  label: string;
  description: string;
}

export const Q1_OPTIONS: QuestionOption<Q1Answer>[] = [
  { value: "racing_first", label: "The racing comes first", description: "Legendary circuits, thrilling corners, on-track action and the pure F1 experience." },
  { value: "balanced", label: "The best of both worlds", description: "Great racing, an exciting atmosphere and time to explore the destination." },
  { value: "sports_holiday", label: "The complete sports holiday", description: "F1 is the highlight, but the city, food, culture and experiences beyond the circuit matter just as much." },
];

export const Q2_OPTIONS: QuestionOption<Q2Answer>[] = [
  { value: "legendary", label: "Legendary F1 circuits", description: "Historic tracks, iconic corners and motorsport heritage." },
  { value: "racing_circuit", label: "Thrilling racing circuits", description: "Fast corners, overtaking opportunities and pure racing action." },
  { value: "street_spectacle", label: "Spectacular street races", description: "City skylines, night racing and a vibrant urban setting." },
  { value: "glamour_iconic", label: "Glamour & Iconic Experiences", description: "Famous settings, exclusive experiences and a touch of luxury." },
  { value: "open", label: "I'm open to anything", description: "The overall Grand Prix experience matters more than the circuit type." },
];

export const Q4_OPTIONS: QuestionOption<Q4Answer>[] = [
  { value: "city", label: "Exploring the city", description: "Landmarks, neighbourhoods and local culture." },
  { value: "food_nightlife", label: "Food & nightlife", description: "Restaurants, bars and evening experiences." },
  { value: "day_trips", label: "Trips & Adventures", description: "Scenic escapes, day trips and experiences beyond the host city." },
  { value: "more_f1", label: "F1 Fan Culture & Atmosphere", description: "Passionate crowds, fan zones, festival entertainment and the full race-weekend buzz" },
];

export const Q5_OPTIONS: QuestionOption<Q5Answer>[] = [
  { value: "views", label: "Great trackside views", description: "Clear sightlines and a good view of the action." },
  { value: "viewpoints", label: "Exploring different viewpoints", description: "Moving around to experience different corners and areas." },
  { value: "facilities", label: "Good spectator facilities", description: "Convenient food, restrooms and places to take a break." },
  { value: "open", label: "No strong preference", description: "I'm happy with different ways of experiencing the race." },
];

export const Q6_OPTIONS: QuestionOption<Q6Answer>[] = [
  { value: "very", label: "Very important", description: "I prefer easy transport and minimal planning." },
  { value: "quite", label: "Quite important", description: "Some planning is fine, but convenience matters." },
  { value: "flexible", label: "I'm flexible", description: "I don't mind extra travel or a few complications." },
  { value: "adventure", label: "The adventure is part of it", description: "I'll happily go the extra mile for a great Grand Prix." },
];

export const Q7_OPTIONS: QuestionOption<Q7Answer>[] = [
  { value: "comfortable", label: "Mild and comfortable", description: "I'd prefer pleasant conditions for long days outdoors." },
  { value: "any_weather", label: "Weather doesn't really matter", description: "I'm happy to experience the Grand Prix in any conditions." },
];

export const Q8_OPTIONS: QuestionOption<Q8Answer>[] = [
  { value: "major", label: "A major priority", description: "I'd strongly prefer a more affordable Grand Prix." },
  { value: "quite", label: "Quite important", description: "Cost matters, but so does the experience." },
  { value: "flexible", label: "I'm flexible", description: "I'll spend more for the right Grand Prix." },
  { value: "not_deciding", label: "Not a deciding factor", description: "The experience matters much more than cost." },
];

export const QUESTIONS = [
  { key: "q1_trip_purpose" as const, eyebrow: "Travel motivation", question: "What matters most to you when travelling for Formula One?", options: Q1_OPTIONS },
  { key: "q2_gp_identity" as const, eyebrow: "Grand Prix identity", question: "What kind of Grand Prix experience appeals to you most?", options: Q2_OPTIONS },
  { key: "q4_off_track" as const, eyebrow: "Beyond the circuit", question: "When you're not at the circuit, what would you most enjoy?", options: Q4_OPTIONS },
  { key: "q5_spectator" as const, eyebrow: "Spectator priorities", question: "What matters most to you when watching the racing at the circuit?", options: Q5_OPTIONS },
  { key: "q6_convenience" as const, eyebrow: "Logistics", question: "How important is an easy, hassle-free Grand Prix weekend?", options: Q6_OPTIONS },
  { key: "q7_weather" as const, eyebrow: "Weather", question: "How important is comfortable weather during your Grand Prix weekend?", options: Q7_OPTIONS },
  { key: "q8_affordability" as const, eyebrow: "Affordability", question: "How much does cost influence your choice of Grand Prix?", options: Q8_OPTIONS },
];
