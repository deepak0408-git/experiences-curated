import { config } from "dotenv";
config({ path: ".env.local" });
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { experiences, sportingEventExperiences } from "../schema/database.ts";

const client = postgres(process.env.DATABASE_URL, { ssl: "require", prepare: false });
const db = drizzle(client);

const DESTINATION_ID = "0b0d8f9a-911d-4cc7-8049-50e4685958ca"; // Milan
const EVENT_ID = "b93770c0-3d96-4e81-b3d0-c1e3a788fd8e"; // Italian Grand Prix
const slug = "monza-inside-the-venue-" + Date.now().toString(36);

const bodyContent = `Monza was built in 110 days. Ground broke in the spring of 1922, inside the grounds of a royal park north of the town, and the circuit opened on 3 September that same year — a week before it hosted its first Italian Grand Prix. It's the third purpose-built race circuit ever constructed, after Brooklands and Indianapolis, and it's the only one of the three still running a modern F1 calendar round on close to its original site.

The original layout was two tracks stitched together: a 5.5km road circuit and a 4.5km high-banked oval, run either separately or combined into a full 10km lap. The banking is still there, decaying quietly in the trees off the modern circuit — abandoned since the 1960s, too dangerous by any current standard, but walkable if you know where to look. What F1 actually races today is the shorter, flatter 5.793km configuration, 53 laps, and cars run at full throttle for roughly 80% of every one of them. This is the lowest-downforce, highest-speed layout left on the calendar, and it's not close.

The corners have names that mean something if you know the history and are just words if you don't. Variante Ascari — the chicane roughly two-thirds around the lap — is named for Alberto Ascari, the two-time World Champion killed testing a sports car at this exact circuit in 1955. The Parabolica, the long final corner that feeds the start/finish straight, is officially Curva Alboreto now, renamed for Michele Alboreto, another Italian driver who died racing. Monza doesn't memorialise casually. The two Lesmo curves are named for a nearby village; the fast kink after the pits is the Variante del Rettifilo, where cars go from roughly 350km/h to 70km/h in one of the hardest braking zones anywhere in F1.

That braking zone is also the best pure viewing spot on the circuit if you want to actually see overtaking rather than just hear speed. Two DRS zones exist here — one between the second Lesmo and the Ascari chicane, one on the run from the Parabolica back to the Rettifilo — and both consistently produce real racing, not just processional following, because Monza's long straights give a trailing car enough time in the slipstream to actually complete a move.

Juan Pablo Montoya set the fastest lap speed in F1 history here in 2004 practice, 260.6km/h average. Rubens Barrichello's 1:21.046 race lap record from the same year has stood since — nobody has gone faster around a full lap at Monza in over two decades, even with two decades of faster cars, which tells you something about how little margin this layout leaves for a mistake at the limit.`;

const whyItsSpecial = `Most historic circuits get treated like museums — preserved, slowed down, wrapped in chicanes until the danger that made them famous is engineered out. Monza did some of that too. But it kept the thing that actually matters: this is still, by a real margin, the fastest circuit F1 visits all year, on essentially the same ground it raced on in 1922.

The abandoned banking sitting in the trees just off the modern track is the clearest evidence of what this place used to demand of drivers and cars, and the corner names — Ascari, Alboreto — are a reminder that speed at this scale has never been free. Most fans walk past both without registering either. Once you know what you're looking at, Monza stops being a fast track with a long history and becomes a fast track that has never really apologised for the cost of being one.`;

const insiderTips = [
  "The Variante del Rettifilo, right after the start/finish straight, is the single best spot on the whole circuit to actually watch a real overtake — cars arrive from roughly 350km/h and brake to 70km/h, which is enough of a speed differential to produce genuine passing, not just a follow.",
  "The abandoned high-banked oval from the original 1922 circuit still exists in the trees off the modern track and is walkable outside race sessions — most first-time visitors don't know it's there, and it's a genuinely different way to understand what Monza used to be before it was tamed.",
];

const whatToAvoid = `Don't try to reach the abandoned banking during race sessions — it sits inside the active circuit grounds and is only safely walkable when track activity has stopped for the day, not something to detour to between practice and qualifying. And don't skip the Rettifilo braking zone in favor of a "faster-looking" part of the lap if overtaking is what you actually want to see — the long straights elsewhere produce speed, but the real racing happens in this one braking zone more reliably than anywhere else on the circuit.`;

const practicalInfo = {
  hours: "Circuit grounds accessible during race weekend gate hours; the historic banking is viewable outside track sessions",
  bookingMethod: "No booking required — this covers the circuit itself, not a specific ticketed area.",
  website: "https://www.formula1.com/en/information/italy-autodromo-nazionale-monza.FiJN1jnQlRLeHqOxIt13m",
};

const gettingThere = "Take S8, S9 or S11 train from Milano Porta Garibaldi (20 mins) to Biassono-Lesmo Parco, then the Black Line shuttle bus or a 20-minute walk through Parco di Monza to the circuit gates. Allow 90 minutes from Milan city centre to your seat on race day.";

try {
  const [result] = await db
    .insert(experiences)
    .values({
      title: "Monza — Inside the Venue",
      subtitle: "Built in 110 days in 1922, still F1's fastest circuit — corners named for drivers who died racing them",
      slug,
      experienceType: "sports_venue",
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
      editorialNote: "Circuit history (1922 construction, 110 days, third purpose-built circuit, original 10km layout, abandoned banking), corner naming history (Ascari, Curva Alboreto), DRS zones, and speed/lap records (Montoya 260.6km/h 2004, Barrichello 1:21.046 race lap record) sourced from Formula1.com's own official circuit page and Formula1.com's 'How every corner at Monza got its name' article, both cross-checked, 18 Sep 2026.",
      sport: ["formula_one"],
      moodTags: ["electric", "authentic"],
      interestCategories: ["sport", "culture"],
      pace: "moderate",
      physicalIntensity: 1,
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
