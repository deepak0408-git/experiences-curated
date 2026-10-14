// Tennis Grand Slam Trip Intelligence — approved wording library, locked
// per spec §8, §9, §10.1, §10.4. Stored as structured, version-controlled
// content (this file) rather than scattered string literals, per spec
// §10.4's template-governance requirement. matchReasons.ts assembles
// sentences from these fragments but never invents new ones.

import type { Q1Answer, Q2Answer, Q3Answer, Q4Answer, Q5Answer, Q6Answer, Q7Answer } from "./types";

export const WORDING_VERSION = "tennis-wording-v2";

// --- Revision 3 (explanation refinement) — reusable connector phrases ----
// Small, tournament-name-free connector phrases used by matchReasons.ts's
// single-explanation composer templates. These are structural connectors,
// not new per-question "fit"/"advantage" content — every substantive claim
// still comes from the existing Q2-Q7_WORDING fragments above, recombined.

export const PROXIMITY_CONNECTOR: Record<"virtually_tied" | "close", string> = {
  virtually_tied: "is almost equally matched overall",
  close: "is a close match",
};

export const JOINT_WINNER_INTRO = "are equally strong matches for your preferences";
export const JOINT_WINNER_SHARED_PREFIX = "Both align with your interest in";
export const JOINT_WINNER_NO_ADVANTAGE_CLOSE = "with no scoring advantage separating them on your selected priorities";
export const JOINT_WINNER_NEUTRAL_FALLBACK =
  "are equally strong overall matches, with no scoring advantage separating them on your selected priorities.";

export const TIED_ALTERNATIVES_TEMPLATE =
  "are also very closely matched to your preferences, sitting just behind your leading recommendations. Both remain worth considering for their distinctive Grand Slam experiences.";

// Two Final Explanation Refinements — Fix 2: Q7 safeguard wording when the
// strongest affordability alternative is NOT among the displayed
// recommendation cards (vs. the original wording, reused unchanged when it
// is displayed). {alt} and {hero} are the real grandSlamName values,
// substituted at render time — never hardcoded.
export const AFFORDABILITY_UNDISPLAYED_PREFIX = "Also worth considering for affordability:";
export const AFFORDABILITY_UNDISPLAYED_CLOSE =
  "Although it isn't among your closest overall matches, it may be worth exploring if trip costs are a deciding factor.";

// --- Spec §8 — approved four-way tie experience ---------------------------

export const FOUR_WAY_TIE_INTRO =
  "All four Grand Slams are equally strong overall matches for your preferences. Each offers a different combination of tournament heritage and lively grounds atmosphere, so your final choice may come down to which experience appeals to you most.";

export const FOUR_WAY_TIE_EXPERIENCE: Record<"ao" | "rg" | "wim" | "uso", { name: string; description: string }> = {
  ao: { name: "Australian Open", description: "A vibrant, contemporary Grand Slam experience with a lively atmosphere across Melbourne Park." },
  rg: { name: "French Open", description: "The distinctive character of Parisian clay-court tennis, steeped in Grand Slam heritage." },
  wim: { name: "Wimbledon", description: "Timeless tennis traditions, iconic grass courts and a more restrained match-watching atmosphere." },
  uso: { name: "US Open", description: "High-energy crowds, electric night-session atmosphere and a modern New York sporting spectacle." },
};

// --- Spec §9.1 — Q2 Tournament Identity ------------------------------------

export const Q2_WORDING: Record<Exclude<Q2Answer, "open">, { fit: string; advantage: string; alternative: string }> = {
  heritage: {
    fit: "the traditions and iconic heritage of Grand Slam tennis",
    advantage: "offers a stronger match for your preference for tennis heritage and tradition",
    alternative: "is also worth considering for its traditional Grand Slam character",
  },
  modern: {
    fit: "a contemporary Grand Slam experience with a strong emphasis on entertainment and event presentation",
    advantage: "better matches your preference for a modern, entertainment-forward tennis experience",
    alternative: "also offers a contemporary Grand Slam experience worth considering",
  },
  both: {
    fit: "a blend of Grand Slam heritage and contemporary event presentation",
    advantage: "offers a stronger overall balance of heritage and modern spectacle for your preferences",
    alternative: "offers a different combination of traditional character and contemporary presentation",
  },
};

// --- Spec §9.2 — Q3 Tennis Experience ---------------------------------------

export const Q3_WORDING: Record<Q3Answer, { fit: string; advantage: string; alternative: string; tied?: string; tradeOff?: string }> = {
  showcourts: {
    fit: "watching marquee matches on the tournament's main show courts",
    advantage: "better matches your preference for marquee show-court tennis",
    alternative: "also offers a compelling show-court experience",
    tied: "Both tournaments offer an equally strong match for your interest in show-court tennis.",
  },
  outside_courts: {
    fit: "discovering players on outside courts and catching practice sessions",
    advantage: "better matches your interest in exploring outside courts and watching players practice",
    tradeOff: "offers a different balance of outside-court discovery and practice opportunities",
    alternative: "also offers opportunities to discover tennis beyond the main show courts",
  },
  balanced: {
    fit: "combining marquee show-court tennis with exploring the wider grounds",
    advantage: "offers a stronger overall match for your preferred mix of show-court tennis and grounds exploration",
    tradeOff: "offers a different balance of show-court tennis and opportunities beyond the main courts",
    alternative: "is also well suited to a mix of marquee matches and discovering tennis around the grounds",
  },
};

// --- Spec §9.3 — Q4 Atmosphere ----------------------------------------------

export const Q4_WORDING: Record<Q4Answer, { fit: string; advantage: string; tradeOff: string; alternative: string }> = {
  high_energy: {
    fit: "an energetic match atmosphere with passionate crowd reactions",
    advantage: "more closely matches your preference for high-energy crowds and intense match atmospheres",
    tradeOff: "offers a different match-watching atmosphere, with less emphasis on the intensity you prefer",
    alternative: "also offers passionate tennis crowds, although with a different overall atmosphere",
  },
  lively_grounds: {
    fit: "a lively atmosphere around the grounds, with social spaces and activity beyond the matches",
    advantage: "better matches your preference for lively grounds and a social Grand Slam experience",
    tradeOff: "offers a different grounds atmosphere, with a more restrained overall feel",
    alternative: "also offers opportunities to enjoy the tournament atmosphere beyond the courts",
  },
  calm: {
    fit: "a more restrained, focused atmosphere for watching tennis",
    advantage: "more closely matches your preference for a calmer, more focused match-watching environment",
    tradeOff: "offers a more energetic match atmosphere than you indicated you prefer",
    alternative: "offers a different balance of crowd energy and focused match-watching",
  },
  balanced: {
    fit: "a balance of lively tennis moments and a more relaxed overall atmosphere",
    advantage: "better matches your preference for a mix of energetic and quieter Grand Slam moments",
    tradeOff: "offers a different balance between crowd energy and quieter moments",
    alternative: "also offers a mix of tennis excitement and opportunities to enjoy the grounds",
  },
};

// --- Spec §9.4 — Q5 Beyond Tennis --------------------------------------------

export const Q5_WORDING: Record<Exclude<Q5Answer, "tennis_first">, { fit: string; advantage: string; tradeOff: string; alternative: string; personalization: string }> = {
  city: {
    fit: "exploring the host city's sights, culture and neighborhoods alongside the tennis",
    advantage: "offers a stronger match for your interest in exploring the host city beyond the tournament",
    tradeOff: "offers a different balance of city exploration opportunities alongside the tennis",
    alternative: "also offers plenty of opportunities to discover the host city beyond the courts",
    personalization: "Make time to explore the city's neighborhoods, cultural highlights and local experiences around your tennis sessions.",
  },
  regional: {
    fit: "combining Grand Slam tennis with nearby destinations and day trips",
    advantage: "better matches your interest in discovering destinations beyond the host city",
    tradeOff: "offers a different range of regional exploration opportunities",
    alternative: "also provides opportunities to explore beyond the host city",
    personalization: "Consider setting aside an extra day or two to discover destinations beyond the tournament's host city.",
  },
  both: {
    fit: "combining Grand Slam tennis with both city discovery and regional experiences",
    advantage: "offers a stronger overall match for your preferred mix of city exploration and nearby destinations",
    tradeOff: "offers a different balance of city and regional exploration opportunities",
    alternative: "also offers a combination of city experiences and opportunities to explore the surrounding region",
    personalization: "Build time into your trip for both the host city's highlights and at least one experience beyond the city.",
  },
};

export const Q5_TENNIS_FIRST_PERSONALIZATION =
  "Since tennis is your main priority, you may prefer to keep sightseeing optional and build your schedule around the matches.";

// --- Spec §9.5 — Q6 Convenience & Comfort -----------------------------------

export const Q6_WORDING: Record<Exclude<Q6Answer, "flexible">, { fit: string; advantage: string; tradeOff: string; alternative: string }> = {
  reasonable: {
    fit: "a reasonably convenient tournament experience without making comfort the main priority",
    advantage: "offers a slightly stronger match for the level of convenience you're looking for",
    tradeOff: "offers a different balance of accessibility and on-site facilities",
    alternative: "also provides a suitable level of convenience for your visit",
  },
  easy_access: {
    fit: "a tournament experience that places importance on accessibility and on-site facilities",
    advantage: "offers a stronger overall match for your preference for accessible transport connections and practical on-site facilities",
    tradeOff: "offers a different balance of venue accessibility and facilities",
    alternative: "also offers convenient access and facilities worth considering",
  },
  top_priority: {
    fit: "a Grand Slam experience aligned with your emphasis on accessibility, facilities and overall convenience",
    advantage: "offers a stronger match for your priorities around accessibility and on-site comfort",
    tradeOff: "may involve a different balance of access and on-site comfort than your leading match",
    alternative: "remains an option worth considering, although its overall convenience match is lower",
  },
};

export const Q6_FLEXIBLE_PERSONALIZATION =
  "You're comfortable with a more flexible tournament visit, so convenience doesn't need to drive your Grand Slam choice.";

// --- Spec §9.6 — Q7 Affordability -------------------------------------------

export const Q7_WORDING: Record<Exclude<Q7Answer, "not_a_concern">, { fit: string; advantage: string; alternative: string; tradeOff: string; personalization: string }> = {
  top_priority: {
    fit: "a Grand Slam trip with a stronger overall affordability profile",
    advantage: "offers a stronger affordability match for your trip-planning priorities",
    alternative: "is worth considering for its stronger affordability match",
    tradeOff: "has a stronger affordability profile that's worth comparing",
    personalization: "Since affordability is a top priority, compare ticket options, accommodation and destination expenses before deciding.",
  },
  sensible_budget: {
    fit: "a reasonable balance between the Grand Slam experience and overall trip affordability",
    advantage: "offers a stronger affordability match while keeping your preference for a sensible budget in view",
    tradeOff: "may require more budget flexibility than your next-best option",
    alternative: "offers an alternative worth comparing if overall trip costs are an important consideration",
    personalization: "Consider the combined cost of attending the tournament, accommodation and your time in the destination.",
  },
  some_flexibility: {
    fit: "a Grand Slam experience that fits your willingness to prioritize the experience over the lowest possible cost",
    advantage: "has a modest affordability advantage, although experience fit remains more important to your choice",
    tradeOff: "has a weaker affordability match, which may be acceptable given your willingness to spend more for the right experience",
    alternative: "may offer a more favorable affordability profile if you decide to place greater emphasis on costs",
    personalization: "You have some flexibility to prioritize the tennis experience, but it's still worth comparing the overall trip costs.",
  },
};

export const Q7_NOT_A_CONCERN_PERSONALIZATION =
  "Your recommendation prioritizes the tennis experience rather than affordability. You can still compare costs when planning your trip.";

// --- Spec §9.7 — Q1 Travel Motivation ----------------------------------------

export const Q1_WORDING: Record<Q1Answer, { travelIntent: string; personalization: string; itineraryGuidance: string; nextStep: string }> = {
  all_about_tennis: {
    travelIntent: "a trip built primarily around the Grand Slam experience",
    personalization: "Since tennis is the main focus of your trip, prioritize the tournament experience and how you'd like to spend your time at the venue.",
    itineraryGuidance: "Build your schedule around your preferred match sessions, with sightseeing kept optional.",
    nextStep: "Explore the tournament's session options, grounds layout and practical visitor information.",
  },
  city: {
    travelIntent: "a Grand Slam trip that combines tennis with discovering the host city",
    personalization: "Your trip is about more than the matches, so make time to experience the host city's neighborhoods, culture and attractions.",
    itineraryGuidance: "Balance tournament sessions with time to explore the city, rather than filling every day with tennis.",
    nextStep: "Explore city experiences that fit around your preferred tournament sessions.",
  },
  nearby: {
    travelIntent: "a Grand Slam trip with opportunities to explore beyond the host city",
    personalization: "Alongside the tennis, consider making time to discover nearby destinations and regional experiences.",
    itineraryGuidance: "Allow room in your schedule for a day trip or short excursion without compromising your preferred tennis sessions.",
    nextStep: "Explore suitable day trips and regional experiences from the host city.",
  },
  bigger_holiday: {
    travelIntent: "a wider holiday that includes a Grand Slam experience",
    personalization: "Treat the Grand Slam as one highlight of your holiday, with the rest of the itinerary shaped around your broader travel interests.",
    itineraryGuidance: "Plan the tournament dates first, then build the surrounding holiday around your available time and preferred destinations.",
    nextStep: "Explore how the Grand Slam can fit into a longer, multi-destination itinerary.",
  },
};

// --- Spec §10.1 — Q1/Q5 combined travel-guidance matrix ---------------------
// Explicit lookup table (not string concatenation) per spec's "do not
// blindly concatenate two travel-personalization fragments" instruction.
// Each case names its required coherent sentence directly.

type Q5GuidanceGroup = "city_like" | "regional_like" | "tennis_first";

function q5GuidanceGroup(answer: Q5Answer): Q5GuidanceGroup {
  if (answer === "tennis_first") return "tennis_first";
  if (answer === "regional") return "regional_like";
  return "city_like"; // "city" and "both" both read as city-exploration-forward for Q1/Q5 combination purposes
}

export function getCombinedTravelGuidance(q1: Q1Answer, q5: Q5Answer): string {
  const q5Group = q5GuidanceGroup(q5);

  if (q1 === "all_about_tennis" && q5Group === "tennis_first") {
    return Q1_WORDING.all_about_tennis.personalization;
  }
  if (q1 === "city" && q5Group === "city_like") {
    return Q5_WORDING.city?.personalization ?? Q1_WORDING.city.personalization;
  }
  if (q1 === "nearby" && q5Group === "regional_like") {
    return Q5_WORDING.regional.personalization;
  }
  if (q1 === "bigger_holiday" && (q5Group === "city_like" || q5Group === "regional_like")) {
    // Q1 determines trip structure, Q5 determines experiences — lead with
    // Q1's broader-holiday framing, then name the specific Q5 interest.
    const q5Fragment = q5 === "regional" ? Q5_WORDING.regional.fit : (Q5_WORDING[q5 as "city" | "both"]?.fit ?? Q5_WORDING.city.fit);
    return `${Q1_WORDING.bigger_holiday.personalization} Within that, you've shown interest in ${q5Fragment}.`;
  }
  if (q1 === "all_about_tennis" && q5Group !== "tennis_first") {
    // Tennis-first Q1 stays primary; exploration optional per spec §10.1.
    return `${Q1_WORDING.all_about_tennis.personalization} If time allows, you've also shown some interest in exploring beyond the tournament.`;
  }
  if (q1 !== "all_about_tennis" && q5Group === "tennis_first") {
    // Preserve the broader Q1 travel intent without forcing sightseeing.
    return `${Q1_WORDING[q1].personalization} That said, you've indicated tennis itself is your main focus, so sightseeing can stay optional.`;
  }

  // Remaining combinations (e.g. q1="city" + q5="regional") — Q1's own
  // personalization already stands coherently on its own without needing
  // a second fragment bolted on.
  return Q1_WORDING[q1].personalization;
}
