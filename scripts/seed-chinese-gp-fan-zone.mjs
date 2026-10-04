// Fan Zone — Chinese GP 2027. Sources: formula1shanghai.com/en/fan-zones-55
// (official circuit site — Fan Zone location at Fountain Plaza behind
// Grandstand A, simulators, Pit Stop Challenge, merch shops, food vendors,
// driver appearances, Chequered Flag Music Carnival as standing features),
// Wikipedia 2024/2025 Chinese GP articles + fanamp.com secondary summary
// (2024 Checkered Flag Carnival Bund riverside walkway detail, attendance
// figures), ticketing.formula1.com/china (official — capacity, large
// screens). Body describes the established recurring Fan Zone format per
// F1's own site; 2027-specific lineup/driver names/schedule not yet
// published, flagged accordingly rather than promised.
import { config } from "dotenv";
config({ path: ".env.local" });
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { experiences, sportingEventExperiences } from "../schema/database.ts";

const client = postgres(process.env.DATABASE_URL, { ssl: "require", prepare: false });
const db = drizzle(client);

const DESTINATION_ID = "998a8774-05ac-4482-ba7a-4ca2a556b963";
const EVENT_ID = "020c6a95-1b15-4a63-8a55-853656b1fe8d";
const slug = "chinese-gp-fan-zone-" + Date.now().toString(36);

const bodyContent = `The main Fan Zone sits at Fountain Plaza, just behind Grandstand A, and functions as the circuit's off-track hub for anyone stepping away from their seat between sessions. It's a genuinely built-out space, not a side tent: expect the latest-generation racing simulators, interactive Pit Stop Challenge games where you can try your hand at a timed tyre change, official team merchandise shops covering the full grid, and a spread of local and international food vendors rather than just circuit catering.

Driver appearances are a standing feature of the zone, not a rumour — F1's own Shanghai circuit site lists them directly alongside the rest of the Fan Zone's facilities. Exact names and times aren't published this far out, but the format itself (scheduled meet-and-greet or Q&A slots through the weekend) is part of what the Fan Zone is built to deliver, not something that may or may not happen.

Music and live entertainment run alongside the racing through the Chequered Flag Music Carnival, which in its most recent editions has featured a lineup of close to 40 acts across multiple stages — big enough that some fans treat race weekend partly as a festival. 2024 also saw an eight-day Checkered Flag Carnival extend off-circuit entirely, with a 600-metre F1-themed walkway along the Bund riverside at the North Bund International Passenger Center — evidence that Shanghai's race-weekend programming regularly spills beyond the circuit gates into the city itself.

None of this requires a separate ticket — Fan Zone access has historically been included with grandstand and general admission tickets at this circuit, and every grandstand is fitted with large screens, so stepping away to the Fan Zone for a simulator run or a merch stop doesn't mean missing what's happening on track. The exact 2027 lineup, driver appearance schedule, and Music Carnival acts aren't published yet — check formula1.com and this pack's pre-trip brief as race week approaches for the confirmed detail.`;

const whyItsSpecial = `The Fan Zone is the part of a Chinese Grand Prix weekend that turns a ticket into an actual festival experience rather than three sessions of watching a track. Simulators and a Pit Stop Challenge give you something to do with your hands between sessions; driver appearances are a real, standing part of the programming rather than a maybe; and the Chequered Flag Music Carnival, which has run close to 40 acts across multiple stages in recent years, is substantial enough that some fans build real time into their schedule around it rather than treating it as a filler. What makes this genuinely special for Shanghai specifically is how far the programming has reached beyond the circuit itself — the 2024 carnival extended a themed walkway along the Bund riverside, folding the city into the race weekend rather than keeping everything behind the gates. The exact shape of 2027's version isn't public yet, but the pattern behind it — simulators, merch, food, driver access, a real music lineup, and a city-wide footprint — is well established rather than a one-off.`;

const practicalInfo = {
  hours: "TBC — 2027 Fan Zone hours not yet published",
  costRange: "Included with grandstand and general admission tickets at this circuit in recent years — confirm inclusion once 2027 ticket details are fully published",
  bookingMethod: "No separate ticket needed historically — Fan Zone access comes with your circuit ticket. Check formula1shanghai.com and this pack's pre-trip brief closer to race week for the confirmed 2027 driver appearance and Music Carnival schedule.",
  website: "https://www.formula1shanghai.com/en/fan-zones-55, https://www.formula1.com/en/racing/2027/china",
};

const gettingThere = "Fountain Plaza, just behind Grandstand A — accessible from inside the circuit grounds once you're through any entrance; no separate gate or ticket needed.";

const insiderTips = [
  "Head to Fountain Plaza, just behind Grandstand A, for the main Fan Zone — that's where the simulators, Pit Stop Challenge, and most merchandise shops cluster, so it's worth a dedicated stop rather than hoping to stumble onto it while walking the grounds.",
  "If the Music Carnival follows its recent pattern, treat it as a real second reason to be there, not a soundtrack to walk past — past lineups have run close to 40 acts, enough that checking set times once they're published is worth doing alongside your session schedule.",
];

const whatToAvoid = "Don't skip the Fan Zone assuming it's a minor add-on — Fountain Plaza is a real, built-out part of the weekend with simulators, merch, food, and a substantial music lineup, and skipping it on assumption means missing driver appearances that are a standing part of the programming. Don't treat the Music Carnival as background noise — with a lineup that's run close to 40 acts across multiple stages in recent years, showing up without checking the schedule means missing sets you'd actually have planned around if you'd known they were on.";

try {
  const [result] = await db
    .insert(experiences)
    .values({
      title: "Fan Zone & Off-Track Activities — What to Expect",
      subtitle: "Simulators, merch, driver appearances and a 40-act music carnival at Fountain Plaza, behind Grandstand A.",
      slug,
      experienceType: "fan_experience",
      status: "in_review",
      destinationId: DESTINATION_ID,
      sportingEventId: EVENT_ID,
      neighborhood: "Anting, Jiading District",
      address: "Shanghai International Circuit, No. 2000 Yining Road, Anting Town, Jiading District, Shanghai, China",
      heroImageUrl: null,
      bodyContent,
      whyItsSpecial,
      insiderTips,
      whatToAvoid,
      practicalInfo,
      gettingThere,
      editorialNote: "Sourced from formula1shanghai.com/en/fan-zones-55 (official circuit site — Fan Zone location, simulators, Pit Stop Challenge, merch, food, driver appearances, Chequered Flag Music Carnival as standing features), Wikipedia 2024/2025 Chinese GP articles (attendance figures, 2024 Checkered Flag Carnival Bund riverside walkway detail via fanamp.com secondary summary), ticketing.formula1.com/china (official — capacity, large screens). 2027-specific Fan Zone lineup/driver names/schedule not yet published — body describes the established recurring format per F1's own site rather than promising specific 2027 programming. FLAG: revisit once F1 publishes 2027 Fan Zone and Music Carnival detail, likely closer to race week.",
      sport: ["formula_one"],
      moodTags: ["social", "family-friendly"],
      interestCategories: ["sport"],
      pace: "moderate",
      physicalIntensity: 2,
      budgetTier: "free",
      budgetCurrency: "USD",
      bestSeasons: ["apr"],
      advanceBookingRequired: false,
      availability: "event_only",
      curationTier: "editorial",
      lastVerifiedDate: new Date().toISOString().slice(0, 10),
    })
    .returning({ id: experiences.id, slug: experiences.slug, title: experiences.title, status: experiences.status });

  await db.insert(sportingEventExperiences)
    .values({ experienceId: result.id, sportingEventId: EVENT_ID })
    .onConflictDoNothing();

  console.log("✓", result.title, "→", result.id, `(${result.slug})`, result.status);
} catch (e) {
  console.error("Error:", e.message);
  if (e.cause) console.error("Cause:", e.cause.message ?? e.cause);
} finally {
  await client.end();
}
