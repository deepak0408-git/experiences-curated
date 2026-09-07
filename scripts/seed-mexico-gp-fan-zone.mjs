import { config } from "dotenv";
config({ path: ".env.local" });
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { experiences, sportingEventExperiences } from "../schema/database.ts";

const client = postgres(process.env.DATABASE_URL, { ssl: "require", prepare: false });
const db = drizzle(client);

const DESTINATION_ID = "883ac422-5318-460f-819a-6ae784ac4b8c";
const EVENT_ID = "538fdb6f-0e39-49a6-ba77-32dec65d640a";
const slug = "mexico-city-gp-fan-zone-" + Date.now().toString(36);

const bodyContent = `Every grandstand ticket and general admission pass at Mexico City includes access to the Fan Zone, and it's worth building real time into your schedule for it rather than treating it as something to pass through on the way to your seat. Each zone around the circuit runs its own version, so what you find depends partly on which gate you're entering through — but the constants across the site are driver and team principal appearances at scheduled times (posted on-site signage tells you where and when), F1 simulators, a Pit Stop Challenge where fans can attempt a mock tire change against the clock, and team merchandise booths for every constructor on the grid.

Mexico City's fan zone leans harder into local culture than most other stops on the calendar, and this is one of the real differentiators of the whole weekend. Expect mariachi bands and folk dancers performing through the day, and because race weekend 2026 falls directly on top of Día de Muertos (see the dedicated experience elsewhere in this pack), displays and imagery tied to the holiday show up throughout the fan areas — skull face paint, marigold styling, altar-inspired art installations. It reads less like a corporate activation and more like the city's own biggest celebration bleeding into the race weekend, because that's genuinely what's happening.

Food inside the fan zone spans the full range Mexico City is known for — quick street-food-style stalls alongside more considered options, plus bars serving throughout the day. There's no confirmed 2026 concert lineup as of this pack's research, and this race genuinely doesn't run a trackside concert series the way Miami or Las Vegas do. What does happen reliably: driver appearances on a stage in the Green Zone behind the main grandstands (Grada 1 and 2) on Friday and Saturday, and a DJ set on the podium in the Foro Sol area after Sunday's race — that specific DJ set requires a Foro Sol-zone ticket to access, not just any fan zone entry. Exact performer names for both aren't typically announced until a few days before race weekend, so check the official schedule as it approaches rather than expecting a lineup this far out.`;

const whyItsSpecial = `Most F1 fan zones are a fairly interchangeable mix of simulators and merchandise tents, built to a template that barely changes from circuit to circuit. Mexico City's doesn't feel that way, because the cultural programming underneath it — mariachi, folk dance, Día de Muertos styling arriving naturally rather than being bolted on — comes from the city itself, not from a race promoter's entertainment budget. You end up with something closer to a genuine Mexican festival that happens to have F1 simulators inside it, which is a different experience than the standard fan-zone formula most other Grands Prix run.`;

const insiderTips = [
  "Driver and team principal appearance times are posted on physical on-site signage rather than always being pre-published online — check the boards at the fan zone entrance as soon as you arrive rather than relying only on the official app.",
  "If you're at the race specifically during the Día de Muertos weekend, the fan zone's cultural programming (mariachi, dancers, holiday-themed displays) tends to run heaviest in the afternoon before sessions — worth timing your visit around a gap in the track schedule rather than squeezing it in on the way to a grandstand.",
];

const whatToAvoid = `Don't expect a confirmed headline concert the way some other Grands Prix (Miami, Las Vegas, Singapore) now advertise — Mexico City's entertainment format leans on continuous programming and cultural activations rather than a single scheduled main-stage act, and treating it as a concert-first weekend will set the wrong expectation. And don't assume every fan zone around the circuit offers the same activities — each gate area runs its own smaller version, so if a specific activation (a particular simulator setup, a specific team's appearance slot) matters to you, confirm which zone it's actually in before you commit to a viewing spot for the day.`;

const practicalInfo = {
  hours: "Fan zones typically open alongside circuit gates each day of the race weekend and run through the day's sessions",
  costRange: "Free with any race ticket (grandstand, general admission, or hospitality) — no separate fan zone ticket required",
  bookingMethod: "No booking needed — fan zone access is included with any valid race-weekend ticket. Check mexico.gp or the official F1 app closer to race week for the confirmed 2026 schedule of driver appearances and activations.",
  website: "https://www.mexicogp.mx/mapa-del-circuito",
};

const gettingThere = "Fan zones are positioned at multiple points around the circuit near the main entry gates — follow the same route as your grandstand or GA entrance, since each zone sits close to its corresponding gate.";

try {
  const [result] = await db
    .insert(experiences)
    .values({
      title: "The Fan Zone & Race Week Culture",
      subtitle: "Mariachi, simulators, and Día de Muertos styling — not your typical F1 fan zone",
      slug,
      experienceType: "fan_experience",
      status: "in_review",
      destinationId: DESTINATION_ID,
      sportingEventId: EVENT_ID,
      neighborhood: "Granjas México, Iztacalco",
      address: "Autódromo Hermanos Rodríguez, Av. Río Churubusco S/N, Granjas México, Iztacalco, 08400 Ciudad de México",
      heroImageUrl: null,
      bodyContent,
      whyItsSpecial,
      insiderTips,
      whatToAvoid,
      practicalInfo,
      gettingThere,
      editorialNote: "Fan zone activities and cultural programming sourced from Formula1.com's official 'what's on' fan-zone articles (2025 edition, used as the recent-season baseline) and mexico.gp's fan-zones page, Sep 2026. No confirmed 2026 concert lineup found at time of writing — stated honestly in body copy rather than invented, per skill's sourcing rules on unpublished facts.",
      sport: ["formula_one"],
      moodTags: ["family-friendly", "cultural", "free-inclusion"],
      interestCategories: ["sport", "culture"],
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

  console.log("Experience #5 seeded:", result.title, "|", result.id, "|", result.slug);
} catch (e) {
  console.error("Error:", e.message);
  if (e.cause) console.error("Cause:", e.cause.message ?? e.cause);
} finally {
  await client.end();
}
