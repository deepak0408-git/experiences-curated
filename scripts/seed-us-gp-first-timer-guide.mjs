import { config } from "dotenv";
config({ path: ".env.local" });

import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { eq } from "drizzle-orm";
import { experiences, sportingEvents, sportingEventExperiences } from "../schema/database.ts";

const client = postgres(process.env.DATABASE_URL, { ssl: "require", prepare: false });
const db = drizzle(client);

const DESTINATION_ID = "6c920919-1d28-420a-a711-2a58fc8ba9e1"; // Austin
const EVENT_SLUG = "united-states-grand-prix";
const slug = "us-gp-first-timer-guide-" + Date.now().toString(36);

const [existingEvent] = await db
  .select({ id: sportingEvents.id })
  .from(sportingEvents)
  .where(eq(sportingEvents.slug, EVENT_SLUG));

if (!existingEvent) {
  throw new Error(`Sporting event not found for slug ${EVENT_SLUG}`);
}
const eventId = existingEvent.id;

const bodyContent = `If this is your first Formula 1 weekend anywhere, or your first time at COTA specifically, a few things are worth knowing before you land in Austin. First: the 2026 US Grand Prix is a standard weekend, not a sprint weekend — Austin ran the sprint format for three straight seasons but loses it for 2026, so what you'll see is the traditional structure. Friday brings two practice sessions (FP1 and FP2), Saturday brings a third practice session (FP3) followed by qualifying — three knockout stages, Q1 through Q3, that set Sunday's starting grid — and Sunday is race day itself, roughly 305km of racing, the only session where points are actually on the line.

That structure matters for how you plan your weekend. Friday is genuinely the quietest, cheapest-feeling day — smaller crowds, more relaxed pacing, a good day to explore the fan zones and figure out the circuit layout before it gets busy. Saturday's qualifying session is more intense than a lot of first-timers expect; grid position genuinely shapes Sunday's race, so it's worth watching properly rather than treating it as a warm-up. Sunday is the big one — arrive early, expect the fullest crowds, and budget real time for both entry and exit given the traffic reality of a track built for 100,000+ people all trying to move at once.

A few practical things nobody tells you until you're there: COTA is a cashless venue, so bring a card (Visa, Discover, Mastercard all work) rather than assuming cash gets you anything. There are free water refill stations scattered around the circuit — bring a reusable bottle rather than buying water repeatedly. You will walk a genuinely long way over the course of a full day moving between grandstands, fan zones, and food areas, so comfortable shoes matter more here than at most sporting events. The official COTA app is worth downloading before you arrive — it's the best way to find food and beverage stalls without wandering blind, and it's also where your digital tickets live for most grandstand tiers.

The atmosphere itself is one of the things people who've been consistently point to: Austin's crowd brings genuine party energy across the whole grid, not just for the favorites, which is a different feeling from some of F1's more reserved European rounds.`;

const whyItsSpecial = `A first F1 weekend is disorienting in a specific way — you know roughly what a race is, but not what the surrounding two days are for, or why qualifying matters as much as it does, or why the crowd treats Friday so differently from Sunday. Understanding the actual shape of the weekend before you arrive changes it from three confusing days into three deliberately different experiences, each worth showing up for on its own terms. Austin specifically rewards this kind of preparation because it's simultaneously one of the most beginner-friendly F1 weekends on the calendar — big, loud, unpretentious, genuinely fun even if you don't know every driver — and one where the practical logistics (traffic, distances, a cashless circuit) can catch an unprepared first-timer off guard. Knowing both halves in advance is what actually makes the difference between a great first race weekend and a frustrating one.`;

const insiderTips = [
  "COTA is entirely cashless — bring a card rather than cash for food, drink, and merchandise, and don't assume you'll find a way to pay with cash anywhere on-site.",
  "Download the official COTA app before you arrive — beyond holding most grandstand digital tickets, it's the fastest way to find food and beverage stalls across a circuit large enough that wandering to find something specific wastes real time.",
];

const whatToAvoid = `Don't show up expecting a sprint weekend — Austin ran sprint races for three consecutive seasons but returns to the standard format for 2026, so there's no Saturday sprint race; Saturday is practice and qualifying only, with the race itself entirely on Sunday. Don't treat Friday as skippable just because there's no race that day — it's genuinely the best day to explore the circuit, fan zones, and food areas at a relaxed pace before Saturday and Sunday's crowds make the same exploring much harder.`;

const practicalInfo = {
  hours: "Friday-Saturday practice/qualifying (23-24 October), Sunday race day (25 October) — full session times published closer to the event",
  website: "https://www.austin.gp/en/time-schedule-17",
  reservationsRequired: false,
};

try {
  const [result] = await db
    .insert(experiences)
    .values({
      title: "First-Timer's Guide — Austin GP Weekend, Explained",
      subtitle: "No sprint race this year, a cashless circuit, and a schedule that rewards knowing the format before you arrive",
      slug,
      experienceType: "activity",
      status: "in_review",
      destinationId: DESTINATION_ID,
      sportingEventId: eventId,
      neighborhood: "Circuit of the Americas",
      address: "9201 Circuit of the Americas Blvd, Austin, TX 78617",
      heroImageUrl: null,
      bodyContent,
      whyItsSpecial,
      insiderTips,
      whatToAvoid,
      practicalInfo,
      editorialNote:
        "Sources: forbes.com + news.gp (confirmed Austin loses sprint format for 2026 after 3 consecutive sprint seasons — genuinely important non-obvious fact for a first-timer), mercedesamgf1.com beginner's guide to race weekend format (FP1/FP2 Friday, FP3+qualifying Saturday, race Sunday, Q1-Q3 knockout structure), localgirltravels.com first-timer's guide (cashless venue, free water refill stations, COTA app utility, walking distance/comfortable shoes advice). No Concierge trigger — orientation content, correctly public and free. No affiliate opportunity. Google Places rating reused from Circuit of the Americas' own venue listing. Verified 5 Sep 2026.",
      googleMapsRating: "4.6",
      googleMapsReviewCount: 17782,
      googleMapsUrl: "https://maps.google.com/?cid=10009294002508390637&g_mp=Cidnb29nbGUubWFwcy5wbGFjZXMudjEuUGxhY2VzLlNlYXJjaFRleHQQAhgEIAA",
      sport: ["formula_one"],
      moodTags: ["beginner-friendly", "orientation"],
      interestCategories: ["sport"],
      pace: "slow",
      physicalIntensity: 1,
      budgetTier: "free",
      budgetCurrency: "USD",
      bestSeasons: ["oct"],
      advanceBookingRequired: false,
      availability: "event_only",
      curationTier: "editorial",
      lastVerifiedDate: "2026-09-05",
    })
    .returning({ id: experiences.id, slug: experiences.slug, title: experiences.title, status: experiences.status });

  await db
    .insert(sportingEventExperiences)
    .values({ experienceId: result.id, sportingEventId: eventId })
    .onConflictDoNothing();

  console.log("\n✓ Experience created successfully");
  console.log("  Title: ", result.title);
  console.log("  ID:    ", result.id);
  console.log("  Slug:  ", result.slug);
} catch (e) {
  console.error("Error:", e.message);
  if (e.cause) console.error("Cause:", e.cause.message ?? e.cause);
} finally {
  await client.end();
}
