import { config } from "dotenv";
config({ path: ".env.local" });
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { experiences, sportingEventExperiences } from "../schema/database.ts";

const client = postgres(process.env.DATABASE_URL, { ssl: "require", prepare: false });
const db = drizzle(client);

const DESTINATION_ID = "883ac422-5318-460f-819a-6ae784ac4b8c";
const EVENT_ID = "538fdb6f-0e39-49a6-ba77-32dec65d640a";
const slug = "mexico-city-gp-arrival-queue-" + Date.now().toString(36);

const bodyContent = `Security here runs closer to an airport checkpoint than a typical sporting-event bag check, and the rules are specific enough that it's worth reading before you pack for the day rather than discovering them at the gate.

Bags are officially limited to roughly 10 x 15 x 30 cm and should ideally be transparent — plastic, vinyl, or PVC. In practice, enforcement of the exact size limit is inconsistent between gates and staff, but don't take that as license to bring a full backpack; a small, see-through bag is the safe choice regardless of how strictly any one gate happens to be checking that day. Every bag is subject to a search at the entrance, and how thorough that search is varies by staff member and gate — budget extra time rather than assuming a quick wave-through.

Chairs and seat cushions are on the prohibited list, even though plenty of fans still try to bring them in for the concrete grandstand seating at Foro Sol and elsewhere — if security catches one, it's confiscated on the spot. Umbrellas are allowed only if they're small and don't have a pointed tip; if there's real rain risk, a poncho or raincoat is the better call anyway, since an open umbrella at a packed grandstand blocks the view of everyone behind you. Camera equipment is generally fine — professional lenses are allowed up to 300mm, with a two-lens maximum, which covers the vast majority of enthusiast photography setups without issue.

The genuinely important warning: a confiscated prohibited item isn't returned at the end of the day, and repeat or serious violations can result in being denied entry entirely, not just having the one item taken. This isn't security theater — treat the list as real rules to plan around, not friendly suggestions.

Given the security line unpredictability and the fact that popular grandstands (Foro Sol especially) fill on genuine merit rather than assigned arrival windows, building in real buffer time before your session matters more here than at a lot of other circuits. Arriving right as gates open, rather than assuming you can stroll in 20 minutes before lights-out, is the safer default for any day you actually care about your seat or sightline.`;

const whyItsSpecial = `Plenty of circuits have a bag policy nobody reads until they're standing at the gate holding something they now have to throw away. Mexico City's list is specific enough — the exact bag dimensions, the lens-count limit, the umbrella-tip rule — that reading it in advance genuinely changes your race day, not just avoids a minor inconvenience. Knowing what to leave at the hotel means you walk through security once, calmly, instead of standing in a line working out what to do with a confiscated cushion while a session you paid for is already underway.`;

const insiderTips = [
  "A small, see-through bag is the safest choice regardless of the exact size limit — enforcement varies enough by gate and staff that it's not worth testing the boundary, and a confiscated bag or its contents aren't given back at the end of the day.",
  "If rain looks likely, bring a poncho rather than relying on the umbrella allowance — even a small, non-pointed umbrella opened in a packed grandstand blocks the view of everyone sitting behind you, and you'll feel that social pressure fast in seats this tightly packed.",
];

const whatToAvoid = `Don't trust generic "what to bring to Foro Sol" advice that recommends a seat cushion for the concrete stands — that's genuinely good comfort advice everywhere else on the F1 calendar, but here it's on the same prohibited list as chairs, and it gets confiscated just the same. Check this circuit's specific rules rather than assuming standard grandstand-comfort advice applies. And don't plan to bring a cooler for a full day of food and drinks — it's explicitly banned alongside the more obvious prohibited items, so budget for buying food and drink inside the venue rather than packing your own for the day.`;

const practicalInfo = {
  hours: "Gates typically open 2-3 hours ahead of each day's first scheduled session — arrive early on any day with a grandstand you care about, since popular stands fill on genuine merit rather than assigned time slots",
  costRange: "Free — this is a security/logistics guide, not a paid experience",
  bookingMethod: "No booking required — these are the standard entry rules for every ticket holder, checked at every gate.",
  website: "https://www.mexico.gp/en/rules-for-visitors-19, https://www.mexico.gp/en/entering-the-circuit-19",
};

const gettingThere = null;

try {
  const [result] = await db
    .insert(experiences)
    .values({
      title: "Arrival & Queue Guide — Gates, Security, What to Bring",
      subtitle: "Airport-style screening, a strict bag policy, and a real prohibited items list",
      slug,
      experienceType: "transit",
      status: "in_review",
      destinationId: DESTINATION_ID,
      sportingEventId: EVENT_ID,
      neighborhood: "Granjas México, Iztacalco",
      address: null,
      heroImageUrl: null,
      bodyContent,
      whyItsSpecial,
      insiderTips,
      whatToAvoid,
      practicalInfo,
      gettingThere,
      editorialNote: "Bag policy dimensions, security screening detail, prohibited items list (chairs/cushions, umbrella rule, 300mm/2-lens camera limit) sourced from oversteer48.com's dedicated 'Entrance Gates & Bag Policy' guide, cross-checked against mexico.gp's own 'Rules for Visitors' page, Sep 2026. What to Avoid rebuilt 6 Sep 2026 after both original avoids were found to restate bodyContent verbatim — replaced with 2 genuinely new avoids sourced directly from mexico.gp/en/rules-for-visitors-19: the seat-cushion contradiction (widely recommended online for Foro Sol's concrete seating, but actually banned here) and the cooler ban (not otherwise mentioned in this experience).",
      sport: ["formula_one"],
      moodTags: ["practical", "first-timer-friendly"],
      interestCategories: ["sport"],
      pace: "moderate",
      physicalIntensity: 2,
      budgetTier: "free",
      budgetCurrency: "USD",
      bestSeasons: ["oct", "nov"],
      advanceBookingRequired: false,
      availability: "event_only",
      curationTier: "editorial",
      lastVerifiedDate: "2026-09-06",
    })
    .returning({ id: experiences.id, slug: experiences.slug, title: experiences.title, status: experiences.status });

  await db.insert(sportingEventExperiences)
    .values({ experienceId: result.id, sportingEventId: EVENT_ID })
    .onConflictDoNothing();

  console.log("Experience #8 seeded:", result.title, "|", result.id, "|", result.slug);
} catch (e) {
  console.error("Error:", e.message);
  if (e.cause) console.error("Cause:", e.cause.message ?? e.cause);
} finally {
  await client.end();
}
