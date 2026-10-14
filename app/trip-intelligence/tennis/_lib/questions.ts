// Tennis Grand Slam Trip Intelligence — approved 7-question questionnaire,
// locked per Tennis Grand Slam Trip Intelligence Development Implementation
// Specification v1.0 §3. Do not reword without a new approved spec.

import type {
  Q1Answer, Q2Answer, Q3Answer, Q4Answer, Q5Answer, Q6Answer, Q7Answer,
} from "./types";

interface QuestionOption<V extends string> {
  value: V;
  label: string;
}

export const Q1_OPTIONS: QuestionOption<Q1Answer>[] = [
  { value: "all_about_tennis", label: "It's all about the tennis" },
  { value: "city", label: "Tennis plus exploring the host city" },
  { value: "nearby", label: "Tennis plus nearby destinations and day trips" },
  { value: "bigger_holiday", label: "Tennis as part of a bigger holiday" },
];

export const Q2_OPTIONS: QuestionOption<Q2Answer>[] = [
  { value: "heritage", label: "Timeless traditions, heritage and iconic tennis rituals" },
  { value: "modern", label: "Modern spectacle, entertainment and a contemporary sporting experience" },
  { value: "both", label: "A combination of tradition and modern energy" },
  { value: "open", label: "No strong preference — I'm open to different experiences" },
];

export const Q3_OPTIONS: QuestionOption<Q3Answer>[] = [
  { value: "showcourts", label: "Watching marquee matches on iconic show courts" },
  { value: "outside_courts", label: "Exploring outside courts, discovering players and catching practice sessions" },
  { value: "balanced", label: "A balanced mix of show courts and exploring the grounds" },
];

export const Q4_OPTIONS: QuestionOption<Q4Answer>[] = [
  { value: "high_energy", label: "High-energy crowds and passionate reactions during matches" },
  { value: "lively_grounds", label: "Lively social spaces and activity around the grounds" },
  { value: "calm", label: "A calmer, more focused environment for watching tennis" },
  { value: "balanced", label: "A mix of energy and quieter moments" },
];

export const Q5_OPTIONS: QuestionOption<Q5Answer>[] = [
  { value: "city", label: "Exploring the host city's sights, culture and neighborhoods" },
  { value: "regional", label: "Discovering nearby destinations and taking day trips" },
  { value: "both", label: "A combination of city exploration and regional experiences" },
  { value: "tennis_first", label: "Not much — tennis is my main focus" },
];

export const Q6_OPTIONS: QuestionOption<Q6Answer>[] = [
  { value: "flexible", label: "I'm flexible and comfortable with crowds and walking" },
  { value: "reasonable", label: "Reasonable convenience is enough" },
  { value: "easy_access", label: "Easy access and good facilities are important" },
  { value: "top_priority", label: "Comfort and convenience are top priorities" },
];

export const Q7_OPTIONS: QuestionOption<Q7Answer>[] = [
  { value: "top_priority", label: "Very important — affordability is a top priority" },
  { value: "sensible_budget", label: "Important — I want a sensible overall budget" },
  { value: "some_flexibility", label: "Somewhat important — I'll spend more for the right experience" },
  { value: "not_a_concern", label: "Not a major concern — the experience comes first" },
];

export const QUESTIONS = [
  { key: "q1_travel_motivation" as const, eyebrow: "Travel motivation", question: "What kind of tennis trip are you planning?", options: Q1_OPTIONS },
  { key: "q2_tournament_identity" as const, eyebrow: "Tournament identity", question: "What kind of Grand Slam experience appeals to you most?", options: Q2_OPTIONS },
  { key: "q3_tennis_experience" as const, eyebrow: "Tennis experience", question: "How would you most enjoy spending your time at the Grand Slam?", options: Q3_OPTIONS },
  { key: "q4_atmosphere" as const, eyebrow: "Atmosphere", question: "What kind of atmosphere do you enjoy while watching tennis?", options: Q4_OPTIONS },
  { key: "q5_beyond_tennis" as const, eyebrow: "Beyond tennis", question: "What would you most enjoy beyond the tennis?", options: Q5_OPTIONS },
  { key: "q6_convenience" as const, eyebrow: "Convenience & comfort", question: "How important is convenience and comfort during your visit?", options: Q6_OPTIONS },
  { key: "q7_affordability" as const, eyebrow: "Affordability", question: "How important is keeping the overall trip affordable?", options: Q7_OPTIONS },
];
