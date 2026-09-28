// Corrects factual inaccuracies in the published "Getting to Sepang — the Airport Circuit"
// experience (slug: getting-to-sepang-circuit-klia). Original copy overstated proximity
// ("1-minute walk" from KLIA Terminal 2) and predated confirmed 2026 pre-trip brief facts.
//
// Fixes applied:
// - Real distance/time: ~15.5km / ~18 min drive from KLIA T2, ~2 hours touchdown-to-gates
//   (was: "1-minute walk", "under 20 minutes")
// - Added confirmed Sepang Race Train Pass (RM200 / 6 trips, 2-4 Oct only)
// - Replaced speculative RM12 race-day shuttle with confirmed free Rapid KL shuttle
//   (95 buses, 3 named pickups, every 10-15 min, 7am-midnight, all 3 days)
// - Added "no motorcycle parking at circuit this year" (previously listed RM10 bike parking)
// - Reworked insiderTips + whatToAvoid to reflect the above without restating the body
//
// Run: node --experimental-strip-types scripts/update-sepang-transit-experience-2026-09-28.mjs

import { config } from "dotenv";
config({ path: ".env.local" });
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { eq } from "drizzle-orm";
import { experiences } from "../schema/database.ts";

const client = postgres(process.env.DATABASE_URL, { ssl: "require", prepare: false });
const db = drizzle(client);

const SLUG = "getting-to-sepang-circuit-klia";

const subtitle =
  "About 2 hours door-to-gates from KLIA — still one of the fastest airport-to-circuit trips on the F1 calendar.";

const bodyContent = `Few circuits on the Formula 1 calendar sit as close to their airport as Sepang does. The circuit is about 15.5km from KLIA Terminal 2 — roughly an 18-minute drive, or a similar time on the direct KLIA Ekspres-plus-shuttle combination — which is dramatically shorter than the airport transfers at Monza, Spa, or almost anywhere else on the calendar. It's a short, straightforward hop, not a walk: budget approximately 2 hours touchdown to gates once you allow for immigration, baggage, and the final leg from the airport.

For anyone already based in Kuala Lumpur, the KLIA Ekspres is the way to do this properly. It runs non-stop between KL Sentral and KLIA, no intermediate stops, every 20 minutes from 05:00 to midnight, and covers the distance in 33 minutes flat — 30 minutes to Terminal 1, another 3 to Terminal 2. A one-way ticket costs RM55. If you're making more than a couple of runs, the Sepang Race Train Pass is the better deal: RM200 for 6 trips, valid 2–4 October only — about RM130 cheaper than six singles. It's single-passenger, non-transferable, non-refundable, and unused trips simply expire.

On race day, Rapid KL is running 95 free shuttle buses to the circuit across all three days, every 10 to 15 minutes from 7am to midnight — no ticket or booking needed. Pickups are at KLIA Terminal 2's Level 1 bus hub, the Mitsui KLIA bus hub, and De-Village on Persiaran Millenia 2 in Bandar Baru Enstek.

Driving is the other real option, and Sepang has built for it — designated parking bays numbered 1 through 17, first-come first-served, with a flat per-race-week entry fee that's run around RM20 for cars at recent events (not a daily charge, historically levied once for the whole race week). There is no motorcycle parking at the circuit this year — riders should park at one of the three shuttle pickup points above and take the free shuttle in. Whichever bay you land in, follow the marshals rather than looking for street parking — vehicles left in unauthorised spots have been towed and ticketed at past events.

Whichever way you arrive, the story here isn't complicated logistics — it's the opposite. Sepang is one of the few Grand Prix venues in the world where the airport and the circuit are close enough that a single train ticket or a short shuttle ride is genuinely all it takes. Fly into KLIA Terminal 2 if you can choose it — it's where the KLIA Ekspres and the race shuttle hub both depart from. Terminal 1 is a separate building several minutes away by the inter-terminal shuttle, so if you land at T1, budget that extra transfer before you can pick up the train or the race-day bus to the circuit.`;

const whyItsSpecial = `Every other circuit on the calendar makes you solve a genuine logistics puzzle to get from the airport to the track — a train, then a transfer, then a taxi, then a longer transfer still. Sepang doesn't. The circuit sits close enough to KLIA, and close enough to a free, high-frequency race-day shuttle, that the usual travel-day stress simply doesn't apply the same way — even with immigration and baggage folded in, you're looking at roughly 2 hours touchdown to gates, not half a day.

I think it's worth naming as a real reason to consider this trip rather than just a footnote. A fan flying in from outside Malaysia can clear immigration, collect bags, and be at the circuit well inside a single afternoon — no city-centre hotel required, no multi-leg transfer to plan around. For a first Malaysian GP, that's one entire category of trip-planning stress you don't have to think about, and the free 2026 shuttle network makes it even easier than in past years.`;

const practicalInfo = {
  hours:
    "KLIA Ekspres runs every 20 minutes, 05:00–00:00 daily. Confirmed free Rapid KL race-day shuttle: every 10–15 min, 7am–midnight, all 3 race days (2–4 October).",
  website: "https://www.kliaekspres.com, https://tickets.formula1.com/en/f1-83069-bahrain-in-malaysia",
  costRange:
    "KLIA Ekspres one-way: RM55. Sepang Race Train Pass: RM200 for 6 trips (2–4 Oct only). Race-day shuttle: free. Parking (historical pattern, not yet reconfirmed for 2026): approx. RM20/car, per race week — no motorcycle parking at the circuit this year.",
  bookingMethod:
    "KLIA Ekspres tickets are bought at the station or via the app; the Race Train Pass is bought at kliaekspres.com, in the app, or at station kiosks/counters from 2 October. The Rapid KL race-day shuttle needs no ticket or booking — just show up at one of the three pickup points.",
};

const gettingThere = `From KL Sentral, take the KLIA Ekspres non-stop to KLIA (33 minutes, RM55 one-way, every 20 minutes 05:00-midnight, or the RM200 6-trip Race Train Pass if you're making several runs) — it serves Terminal 1 first, then Terminal 2, 3 minutes further. From KLIA Terminal 2, the confirmed free Rapid KL race-day shuttle runs every 10-15 minutes, 7am-midnight, from the Terminal 2 Level 1 bus hub (also from the Mitsui KLIA bus hub and De-Village, Bandar Baru Enstek) — no ticket needed. Total door-to-gates time is approximately 2 hours once you allow for immigration and baggage. If flying in, choose Terminal 2 over Terminal 1 if your routing allows — T1 is a separate building several minutes away by inter-terminal shuttle.`;

const insiderTips = [
  "Fly into KLIA Terminal 2, not Terminal 1, if you can choose — it's where both the KLIA Ekspres and the free race-day shuttle depart from, saving you an extra inter-terminal transfer.",
  "If you're riding a motorcycle, there's no bike parking at the circuit this year — park at one of the three shuttle pickup points (KLIA T2, Mitsui KLIA, or De-Village) and take the free shuttle the rest of the way.",
];

const whatToAvoid = `Don't try to buy the Sepang Race Train Pass on the day you need it and expect it to always make sense — it's only sold from 2 October and only covers the train, not the free circuit shuttle, so if you're arriving before then or only making one or two KLIA Ekspres trips, six single RM55 tickets works out cheaper. Don't assume KL's city roads are clear that weekend, either — the Standard Chartered KL Marathon overlaps race weekend, with early-morning road closures around Dataran Merdeka (10K/5K Saturday 3 October, full/half marathon Sunday 4 October). They should clear well before race time, but allow extra time for any airport transfer through the city centre on those mornings.`;

const editorialNote = `Corrected 28 Sep 2026: original text overstated proximity ("1-minute walk" from KLIA T2) — Google Maps driving directions confirm ~15.5km / ~18 min by car; the previously cited "rome2rio/moovitapp confirmation" was wrong. Updated with confirmed 2026 pre-trip brief facts: Sepang Race Train Pass (RM200/6 trips, kliaekspres.com), Rapid KL free 95-bus shuttle (10-15 min frequency, 7am-midnight, 3 named pickups), and no motorcycle parking at circuit this year. Superseded the old speculative RM12 shuttle/RM10 motorbike-parking figures, which were an unconfirmed historical pattern, not 2026 fact.`;

const [updated] = await db
  .update(experiences)
  .set({
    subtitle,
    bodyContent,
    whyItsSpecial,
    practicalInfo,
    gettingThere,
    insiderTips,
    whatToAvoid,
    editorialNote,
    lastVerifiedDate: "2026-09-28",
    updatedAt: new Date(),
  })
  .where(eq(experiences.slug, SLUG))
  .returning({ id: experiences.id, slug: experiences.slug, status: experiences.status });

console.log("Updated:", JSON.stringify(updated, null, 2));

await client.end();
