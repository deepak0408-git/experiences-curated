import { config } from "dotenv";
config({ path: ".env.local" });
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { experiences, sportingEventExperiences } from "../schema/database.ts";

const client = postgres(process.env.DATABASE_URL, { ssl: "require", prepare: false });
const db = drizzle(client);

const DESTINATION_ID = "0b0d8f9a-911d-4cc7-8049-50e4685958ca"; // Milan
const EVENT_ID = "b93770c0-3d96-4e81-b3d0-c1e3a788fd8e"; // Italian Grand Prix
const slug = "italian-gp-first-timer-guide-" + Date.now().toString(36);

const bodyContent = `Most F1 races feel like a sporting event with a crowd attached. Monza feels like the crowd is the event, and the racing happens inside it. This is Ferrari's home race, and the Tifosi — the name for Ferrari's fans, not a generic word for "fans" in general — treat the weekend as closer to a religious holiday than a ticketed sports fixture. If you've been to other Grands Prix, recalibrate: the noise, the flag-waving, the sheer density of red in every grandstand is not typical F1 crowd energy. It's specific to this one.

The single most disorienting thing for a first-timer is what happens after the chequered flag. At most circuits, the crowd files out. At Monza, tens of thousands of fans flood directly onto the start/finish straight the moment the race ends, standing on the actual tarmac to watch the podium ceremony live rather than on a screen. It's called the track invasion, it's sanctioned by the circuit, not a security failure, and if you don't know it's coming you'll either miss it entirely trying to leave early or get swept into it by accident. Decide in advance whether you want to be part of it — if you do, stay in your seat until the chequered flag and follow the marshals' directions down onto the track rather than trying to beat the exit crowd.

For seating, a grandstand ticket is the easier first-race choice over general admission — GA at Monza means moving between viewing spots across a genuinely large park-forest site, which is a lot to navigate on your first visit without also knowing the ground. Grandstands along the start/finish straight (1 and 26 particularly) put you in the thickest part of the Tifosi atmosphere, which is arguably the actual point of a first Monza trip.

Download what you need before you leave your accommodation. The official F1 app covers live timing and results; the circuit's own Monza 100 app helps with wayfinding once you're inside the grounds, which matter more here than at a purpose-built stadium circuit — Monza sits inside a genuine royal park, and grandstands, food areas, and gates are spread across real distance. Mobile networks slow down badly once tens of thousands of phones are competing for signal inside the park, so treat anything you'll need mid-session as something to download in advance, not look up on the day.

Bring ear protection. Cars at Monza's front straight are louder at close range than most first-timers expect, loud enough to be genuinely uncomfortable without something in your ears — foam plugs are cheap and widely sold at the circuit if you forget. Sun protection matters too: early September can still run hot, and general admission areas in particular offer little natural shade across a full day outdoors.`;

const whyItsSpecial = `A first Grand Prix teaches you what F1 sounds and feels like. A first Monza teaches you something narrower and stranger: what it's like to be inside a crowd that has decided, collectively and for decades, that this specific result at this specific track matters more than almost anything else in the sport. Ferrari's win record at its own home race is not actually that dominant on paper. It doesn't matter. The emotional stakes in the grandstands have very little to do with championship mathematics.

That's what the track invasion is really about. It isn't crowd control breaking down — it's the circuit formally making room for something that would happen with or without permission. Once you've stood on that straight with everyone else who just watched the same race, you understand why Monza gets called sacred ground by people who would otherwise never use that word about a car park with a track painted on it.`;

const insiderTips = [
  "Download the F1 app and Monza 100 before you leave your hotel, not once you're inside the park — mobile signal degrades noticeably once tens of thousands of phones are competing for the same towers on race day.",
  "If you want to join the post-race track invasion, stay seated until the chequered flag and follow marshal directions down onto the straight rather than heading for the exits early — trying to leave right before the flag means fighting the crowd moving the opposite way onto the track.",
];

const whatToAvoid = `Don't assume "Tifosi" means "fans" generally — it specifically means Ferrari's fanbase, and using it loosely in conversation at the circuit will mark you as a first-timer faster than anything else. And don't plan your exit strategy around beating the crowd out after the race — the post-race track invasion means the straight itself fills with pedestrians for a while, and trying to rush an early exit against that tide is slower and more frustrating than just staying to watch the podium from the tarmac like everyone else.`;

const practicalInfo = {
  hours: "Race weekend runs Friday to Sunday; gates open 07:00 each day (3-5 Sep 2027, subject to confirmation)",
  costRange: "No separate cost — covers general first-visit orientation, not a bookable product",
  bookingMethod: "No booking required — this is orientation for your race weekend, not a ticketed item.",
  website: "https://www.formula1.com/en/latest/article/engines-espresso-and-tifosi-passion-the-ultimate-fan-guide-to-monza.1rkB3TtIgupczEs1naB0C8",
};

const gettingThere = "See the Getting to the Circuit experience elsewhere in this pack for the route from Milan — this covers what to expect once you're planning your first weekend, not the journey itself.";

try {
  const [result] = await db
    .insert(experiences)
    .values({
      title: "First-Timer's Guide to the Italian GP",
      subtitle: "Why the Tifosi make this unlike any other race weekend, and what happens the second the chequered flag drops",
      slug,
      experienceType: "cultural_site",
      status: "in_review",
      destinationId: DESTINATION_ID,
      sportingEventId: EVENT_ID,
      neighborhood: "Monza",
      address: "Autodromo Nazionale Monza, Parco di Monza, 20900 Monza MB, Italy",
      heroImageUrl: null,
      bodyContent,
      whyItsSpecial,
      insiderTips,
      whatToAvoid,
      practicalInfo,
      gettingThere,
      editorialNote: "Tifosi culture, track invasion tradition, seating advice, and recommended apps (F1 app, Monza 100) sourced from Formula1.com's official Monza fan guide and f1italy.com's useful-apps page, both cross-checked, 18 Sep 2026.",
      sport: ["formula_one"],
      moodTags: ["electric", "social", "authentic"],
      interestCategories: ["sport", "culture"],
      pace: "active",
      physicalIntensity: 2,
      budgetTier: "free",
      budgetCurrency: "USD",
      bestSeasons: ["sep"],
      advanceBookingRequired: false,
      availability: "event_only",
      curationTier: "editorial",
      lastVerifiedDate: "2026-09-18",
    })
    .returning({ id: experiences.id, slug: experiences.slug, title: experiences.title, status: experiences.status });

  await db.insert(sportingEventExperiences)
    .values({ experienceId: result.id, sportingEventId: EVENT_ID })
    .onConflictDoNothing();

  console.log("Experience seeded:", result.title, "|", result.id, "|", result.slug);
} catch (e) {
  console.error("Error:", e.message);
  if (e.cause) console.error("Cause:", e.cause.message ?? e.cause);
} finally {
  await client.end();
}
