import { config } from "dotenv";
config({ path: ".env.local" });
import postgres from "postgres";
import { drizzle } from "drizzle-orm/postgres-js";
import { eq } from "drizzle-orm";
import { experiences } from "../schema/database.ts";

// rollover-event-into-next-year skill §3 — Las Vegas GP content-staleness
// refresh after the 2026->2027 edition rollover. Race dates (18-20 Nov
// 2027) are FIA/F1.com confirmed. Las Vegas is confirmed NOT a 2027 Sprint
// venue (organizers have explicitly ruled out Sprint format) — same
// classic Thu-practice/Fri-qualifying/Sat-race structure as 2026, no
// format-change rewrite needed. F1 Experiences/ticketing's 2027 pages are
// at waitlist/TBD as of this writing, same pattern as every other 2027
// rollover so far.
const client = postgres(process.env.DATABASE_URL, { ssl: "require", prepare: false });
const db = drizzle(client);

const PRICE_PENDING_NOTE = "2027 pricing/availability had not been released as of this writing — check f1lasvegasgp.com and tickets.formula1.com directly before booking.";
const SESSION_NOTE = "Exact 2027 session times not yet published — 2026 ran Practice 1 Thu 4:30-5:30pm PT, Practice 2 Thu 8:00-9:00pm PT, Practice 3 Fri 4:30-5:30pm PT, Qualifying Fri 8:00-9:00pm PT, Race Sat 8:00pm PT, all times Pacific. Confirm via f1lasvegasgp.com once published.";

async function updateExperience(id, label, patch) {
  const [row] = await db.update(experiences).set({ ...patch, lastVerifiedDate: new Date().toISOString().split("T")[0], updatedAt: new Date() }).where(eq(experiences.id, id)).returning({ id: experiences.id, slug: experiences.slug });
  console.log(`✓ ${label}:`, row);
}

// 1. Main Grandstand
await updateExperience("ff43697f-0b26-4e54-adab-e77ecc1b4346", "Main Grandstand", {
  practicalInfo: {
    hours: SESSION_NOTE,
    website: "https://www.f1lasvegasgp.com/tickets/grandstands/main-grandstand/, https://tickets.formula1.com/en/f1-59007-las-vegas/23378-main-grandstand-start-finish-line",
    costRange: `2026 pricing was US$1,499-2,076 for the 3-day (Thu-Sat) pass — a reference point only. ${PRICE_PENDING_NOTE}`,
    howToBook: "Book via f1lasvegasgp.com or tickets.formula1.com under East Harmon Zone grandstands once 2027 sales open. In 2026, a deposit period secured priority access, followed by an Amex-cardmember presale, then public sale — Main Grandstand has historically been the first stand to sell out given its start/finish and pit-lane view, so treat any deposit/presale window as the real move, not a formality, once 2027 dates are announced.",
    bookingMethod: "Book directly via f1lasvegasgp.com or tickets.formula1.com under East Harmon Zone grandstands, once 2027 sales open. This has consistently been the first stand to sell out given the start/finish and pit-lane view.",
    reservationsRequired: true,
  },
});

// 2. Paddock Club
await updateExperience("fbf4cc53-e27f-438a-aaf4-cc8fbfcb7897", "Paddock Club", {
  practicalInfo: {
    hours: `${SESSION_NOTE} Paddock Club access runs throughout each race day, opening ahead of the first session.`,
    website: "https://www.f1lasvegasgp.com/tickets/hospitality/paddock-club-suites/, https://ticketing.formula1.com/hospitality-tickets/en/las-vegas/hospitality-f1-las-vegas-strip-circuit-waitlist",
    costRange: `2026 pricing started from US$5,489 for the 3-day pass, spanning Turn 3 Club, SkyBox, Paddock Club (F1 Experiences Suite), House 44, and Legend tiers up to US$21,268 — reference points only. ${PRICE_PENDING_NOTE}`,
    howToBook: "Call F1 Experiences directly at +1 888 326 5430 or email hospitality@f1experiences.com once 2027 sales open to confirm which specific tier has availability — hospitality packages here have historically sold out ahead of race weekend, and F1 Experiences is F1's own official hospitality partner. House 44's Lewis Hamilton branding is priced and marketed as a distinct, higher tier, not an add-on you can upgrade into later.",
    bookingMethod: "Book via f1lasvegasgp.com's Paddock Club Suites page or F1 Experiences' official site, once 2027 sales open.",
    reservationsRequired: true,
  },
});

// 3. Turn 3 Grandstand
await updateExperience("1f2f1569-a072-423b-8569-d4a4253cd9d9", "Turn 3 Grandstand", {
  practicalInfo: {
    hours: SESSION_NOTE,
    website: "https://www.f1lasvegasgp.com/tickets/grandstands/turn-3-grandstand/, https://tickets.formula1.com/en/f1-59007-las-vegas/26449-turn-3",
    costRange: `2026 pricing was US$1,047-1,499 for the 3-day (Thu-Sat) pass — a reference point only. ${PRICE_PENDING_NOTE}`,
    bookingMethod: "Book via f1lasvegasgp.com or tickets.formula1.com under Koval Zone grandstands, once 2027 sales open. Mid-tier pricing has historically sold reliably through the season but isn't typically the first stand to sell out.",
    reservationsRequired: true,
  },
  bodyContent: `Turn 3 Grandstand sits in the Koval Zone, and its real selling point isn't Turns 3 and 4 themselves — cars go through that section largely single-file, with limited overtaking. What you're actually booking a seat for is the run that follows: the Koval Straight, a genuine DRS zone between Turns 4 and 5, where the DRS detection point sits just after Turn 2 and activates 20 metres past Turn 4. From this stand you watch cars build speed down that straight and then brake hard into Turn 5G, a second-gear 65mph right-hander that's a real passing opportunity most race weekends.

The grandstand connects directly into the Heineken Silver Stage, where F1 runs live entertainment and driver interviews throughout the weekend — something the Main Grandstand doesn't offer in the same way. In recent editions, the East Harmon, West Harmon, and Koval zones have all connected to each other, so a Turn 3 ticket also gets you movement across a wider stretch of fan activations than a single isolated grandstand ticket would — confirm this zone-connectivity still holds for 2027.

Pricing has historically sat in the genuine mid-tier, below the Main Grandstand's range but with real racing content rather than just proximity to the pits. It's the stand for someone who wants to watch actual overtaking attempts rather than pay a premium purely for the start/finish ceremony.

There's a genuine premium tier here too: the Turn 3 Club sits above the general grandstand, with hospitality-style dining and a better vantage over the same braking zone, for anyone who wants the Koval action with table service attached.`,
});

// 4. Practice & Qualifying tickets
await updateExperience("2c75de3a-ab35-4ddd-9e27-cd779405e373", "Practice & Qualifying tickets", {
  practicalInfo: {
    hours: `${SESSION_NOTE} Qualifying in 2026 ran Q1/Q2/Q3, 60 minutes total.`,
    website: "https://www.f1lasvegasgp.com/tickets/",
    costRange: `2026 pricing was: Thursday practice single-day from US$50; Friday qualifying single-day from US$99; Saturday race single-day from US$393 — reference points only. ${PRICE_PENDING_NOTE}`,
    bookingMethod: "Book via f1lasvegasgp.com or tickets.formula1.com once 2027 sales open — single-day tickets for each session sold separately from 3-day passes.",
    reservationsRequired: true,
  },
  bodyContent: `Race day gets all the attention, and the price tag has historically reflected it — in 2026, Saturday's Grand Prix single-day ticket started at US$393, roughly 8 times Thursday practice's US$50 starting price and about 4 times Friday qualifying's US$99. That price gap is the headline, but it's not the only reason to think seriously about a Thursday or Friday ticket — the on-track and off-track program on those two days is genuinely different, not just cheaper.

Thursday brings two one-hour free practice sessions, FP1 and FP2, where teams are working through setup changes rather than pushing for outright pace — real, unfiltered access to how a Formula 1 weekend actually functions. In recent editions, Thursday has also been the only day F1 Academy holds its own qualifying session, a genuine chance to watch the sport's all-female development series decide its own grid the same night as F1 practice — confirm F1 Academy's 2027 schedule once announced. Friday has typically added F1 Academy's own race ahead of Friday's headline event: qualifying itself, run at night under the same lights and atmosphere as Saturday's race, deciding the actual starting order for race day.

The T-Mobile Zone at Sphere has run real headline entertainment on both these nights in recent editions, not scaled-down filler — the 2027 line-up hadn't been announced as of this writing; check f1lasvegasgp.com and identity.vegas closer to race week. One real limitation worth knowing before you buy: a Grand Prix ticket only grants access to the specific zone your grandstand or GA ticket covers — you can't roam between zones during the weekend, so this only applies if a T-Mobile Zone ticket is actually what you're buying, not a general perk of any Thursday or Friday ticket.

A promoter-run pit lane walk has historically been included with certain Thursday ticket types, giving fans genuine up-close access to the cars and team garages as they prepare — exact 2027 ticket-tier eligibility isn't confirmed as of this writing, so check your specific ticket's inclusions when you buy rather than assuming it's automatic. F1 drivers, F1 Academy drivers, and team personnel also make Q&A and autograph-session appearances in designated fan zones across the weekend in recent editions — F2/F3/F1 Academy drivers in particular tend to be far more accessible for these than the main F1 grid, and Thursday and Friday's lighter crowds make actually reaching a fan-zone appearance meaningfully easier than fighting Saturday's peak foot traffic.

There's a practical crowd-management angle too. The Strip's official F1 merchandise stores get genuinely packed on Saturday, and buying team gear on Thursday or Friday morning instead means not hauling shopping bags through race-night crowds later. Bleachers and viewing areas also fill up more on qualifying and race days specifically — leave your spot for refreshments on those days and there's a real chance someone else claims it, a risk that's meaningfully lower on the calmer Thursday practice day.

None of this replaces actually being there for the race if that's the goal — but a Thursday or Friday single-day ticket gives you real, distinct content (F1 Academy's own qualifying and race, genuine practice access, real headline entertainment at Sphere, a possible pit lane walk, more accessible driver appearances) at a fraction of race day's cost, not just a cheaper version of the same thing.`,
});

// 5. Flamingo Zone GA
await updateExperience("4f6eeec9-f3eb-44da-8166-74443be81316", "Flamingo Zone GA", {
  practicalInfo: {
    hours: SESSION_NOTE,
    website: "https://www.f1lasvegasgp.com/tickets/general-admission/flamingo-ga/",
    costRange: `2026 pricing was US$807 for the 3-day (Thu-Sat) General Admission pass — a reference point only. ${PRICE_PENDING_NOTE}`,
    howToBook: "This tier has historically sold out well ahead of race week — it was the fastest-selling tier in 2026, with 3-day GA selling out before grandstand tiers did. If you're planning for 2027, the real move is booking the moment the on-sale window opens (deposit period, then Amex presale, then public sale) rather than waiting to compare against grandstand pricing first. T-Mobile Zone at Sphere GA is the honest fallback if Flamingo is unavailable — check tickets.formula1.com or f1lasvegasgp.com directly for current live availability once 2027 sales open.",
    bookingMethod: "Book via f1lasvegasgp.com or tickets.formula1.com under General Admission: Flamingo, once 2027 sales open. This has historically been the highest-demand budget option.",
    reservationsRequired: true,
  },
});

// 6. Bellagio & Caesars dining — generalize the "2026 La Liste" claim
await updateExperience("73769d80-7f26-45d7-848a-500c18581c4d", "Bellagio & Caesars dining", {
  bodyContent: `Race night in Las Vegas doesn't start when the lights go out — it starts hours earlier, and two restaurants a few minutes' walk from the circuit make the wait itself part of the occasion.

Le Cirque, inside Bellagio overlooking the fountains, is the Vegas outpost of the legendary New York original, and it's earned its own reputation rather than coasting on the name. It has regularly ranked among La Liste's top restaurants in the world, carries a perennial AAA Five Diamond Award, and holds a Forbes Travel Guide Five Star rating. The room itself is genuinely part of the draw — striped silk ceiling, views over the fountains that will be running the same water show later that night the cars are racing past. This is French haute cuisine done at a level that justifies booking it specifically for a night you want to remember, not just a convenient meal before walking to a grandstand. [See live rating and reviews on Google Maps](https://maps.google.com/?cid=10743306609308335518)

Restaurant Guy Savoy, at Caesars Palace, sits at an even higher tier on paper: a Michelin two-star restaurant that has regularly scored in the top tier of La Liste's rankings, with the Forbes Five Star Award, TripExpert's Expert's Choice Award, Wine Spectator's Grand Award, and AAA Five Diamond recognition every year since 2008. Chef Guy Savoy built the Vegas menu to genuinely mirror his acclaimed Paris original, not a simplified American version of it. It's a serious tasting-menu commitment, best planned for a night when you're not racing a clock to reach a grandstand afterward. [See live rating and reviews on Google Maps](https://maps.google.com/?cid=5181793167977568363)

Both sit inside walking distance of the East Harmon and Koval zone entrances, making either a genuine "dinner, then walk to the race" plan rather than requiring a separate trip.`,
});

// 7. T-Mobile Zone at Sphere — concert line-up pending
await updateExperience("00fdb184-c5dd-44ea-bb1d-2fe32c4ba833", "T-Mobile Zone at Sphere", {
  practicalInfo: {
    hours: `${SESSION_NOTE} T-Mobile Stage performances typically run each night of the weekend, after that day's on-track session ends.`,
    website: "https://www.f1lasvegasgp.com/tickets/general-admission/t-mobile-general-admission/, https://www.identity.vegas/",
    costRange: `2026 pricing was US$1,047-1,499 for the 3-day (Thu-Sat) pass — a reference point only. ${PRICE_PENDING_NOTE}`,
    bookingMethod: "Book via f1lasvegasgp.com or tickets.formula1.com under General Admission: T-Mobile Zone, once 2027 sales open. Demand has historically tracked the concert lineup closely — book as soon as headliners are confirmed rather than waiting.",
    reservationsRequired: true,
  },
  bodyContent: `T-Mobile Zone is the general admission ticket built for people who want race weekend to feel like a festival, not just a motorsport event. It sits beneath the Sphere's Exosphere, looking onto one of the circuit's most technical stretches — T-Mobile Turn 5 and the chicane running through Turns 7 to 9, a genuine braking-and-cornering complex where overtaking attempts actually happen, not just a scenic backdrop.

The 2027 concert line-up hadn't been announced as of this writing — check f1lasvegasgp.com and identity.vegas closer to race week. In 2026, the T-Mobile Stage ran three nights of live performances headlined by Two Friends, Disclosure, and Sean Paul, with a Saturday-night F1 Afterparty at the Sphere itself featuring the Backstreet Boys — useful as a sense of scale and calibre, not a preview of 2027's actual acts.

A 3-day general admission ticket has historically come with more built in than most standing-room tickets elsewhere on the circuit: food and beverage menus from Wolfgang Puck's team, and for 3-day holders specifically, free water, soft drinks, and food included rather than purchase-only. It's still standing room — there's no assigned seat, and like every general admission zone here, your ticket locks you into T-Mobile Zone for that day rather than letting you roam the wider circuit.

This is the zone to choose over Flamingo if the concert lineup and the festival atmosphere matter as much to your race weekend as the racing itself. The corner action is real and technical, but the Sphere's presence overhead, lit up through the evening sessions, is what makes this specific zone feel different from any other general admission option on the Strip.`,
});

// 8. Getting Around (date-only fix)
await updateExperience("48e12a48-7659-442d-a561-b47e9b9d2aa9", "Getting Around", {
  practicalInfo: {
    hours: "Soft closures typically from 3pm, full closures from 5pm, Thursday through Saturday of race weekend (18-20 Nov 2027), lifting into the early hours each following morning — confirm exact 2027 closure times via the official F1 Las Vegas app closer to race week.",
    website: "https://www.f1lasvegasgp.com/a-z-guide/, https://www.formula1.com/en/latest/article/how-to-get-to-and-from-the-las-vegas-grand-prix.cC4fJHHhvB6sFzwGqPtBr",
    costRange: "Las Vegas Monorail single ride from roughly US$6; rideshare fares surge significantly around session start/end times",
    howToBook: "",
    bookingMethod: "No booking needed for walking or the monorail. For rideshare, use the Virgin Hotels Las Vegas or Hughes Center designated pickup points only — curbside pickup elsewhere on the Strip is not available during closures.",
    reservationsRequired: false,
  },
});

// 9. West Harmon Grandstand
await updateExperience("e8657ae2-43b5-401d-a937-1c05f2fed395", "West Harmon Grandstand", {
  practicalInfo: {
    hours: SESSION_NOTE,
    website: "https://www.f1lasvegasgp.com/tickets/grandstands/west-harmon-grandstands/",
    costRange: `2026 pricing was from US$102 single-day; Lewis Hamilton Grandstand Package (3-day, includes exclusive merchandise item) from US$1,012 — reference points only. ${PRICE_PENDING_NOTE}`,
    bookingMethod: "Book via f1lasvegasgp.com or tickets.formula1.com under West Harmon Grandstands, once 2027 sales open. This has historically been the entry-level grandstand tier with more late availability than East Harmon or Koval Zone stands, but don't wait past the final few weeks before race weekend.",
    reservationsRequired: true,
  },
  bodyContent: `West Harmon Grandstand, officially sold as the Lewis Hamilton Grandstand Package, is the cheapest genuine assigned-seat grandstand on the circuit, and it earns that price with a real view rather than a compromise one. It sits at the very end of the lap, on the run into Turn 17 and along the pit lane entrance, which means you're watching cars at their highest top speed of the whole circuit, slipstreaming off each other before braking hard for the final corner. It's a single-grandstand zone, which sounds like a downside until you realize what it actually means on the ground: food, drink, and restroom lines here are consistently shorter than in the multi-stand East Harmon or Koval zones, because there's only one stand's worth of people to serve.

The trade-off is honest, not hidden: this is a top-speed and pit-entrance stand, not a braking-zone or overtaking stand. Several past race-goers have noted the sightlines to actual corners and passing moves are more limited here than at stands built around a specific braking zone. If watching a wheel-to-wheel battle into a corner is the priority, this isn't that seat. If watching an F1 car at genuine top speed, engine screaming, is what you came for, lower rows also give you a clean look at cars peeling into the pits, which most other grandstands don't offer at all.

West Harmon sits on the inside of the circuit, closer on foot to the Bellagio, Paris, and Planet Hollywood than almost any other grandstand — genuinely useful if your hotel is on that stretch of the Strip and you want the shortest possible walk to your seat on race night.

In recent editions, the West Harmon Zone has connected on foot to both the East Harmon and Koval zones, so a West Harmon ticket also opens up the Heineken Silver Stage's live entertainment and driver interviews without needing a separate pass — confirm this zone-connectivity still holds for 2027.`,
});

console.log("\nDone — 9 experiences refreshed for the 2027 edition.");
await client.end();
