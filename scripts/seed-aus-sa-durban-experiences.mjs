import { config } from "dotenv";
config({ path: ".env.local" });

import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { experiences, sportingEventExperiences } from "../schema/database.ts";

const client = postgres(process.env.DATABASE_URL, { ssl: "require", prepare: false });
const db = drizzle(client);

const DESTINATION_ID = "c80e3142-2e1a-405e-a859-f4cdb12d5136"; // Durban
const EVENT_ID = "be8e1129-6e53-4e45-a574-931250988806"; // Australia in South Africa 2026

async function seed(exp) {
  const slug = exp.slugBase + "-" + Date.now().toString(36) + Math.random().toString(36).slice(2, 5);
  try {
    const [result] = await db
      .insert(experiences)
      .values({
        title: exp.title,
        subtitle: exp.subtitle,
        slug,
        experienceType: exp.experienceType,
        status: "in_review",
        destinationId: DESTINATION_ID,
        sportingEventId: EVENT_ID,
        neighborhood: exp.neighborhood,
        address: exp.address,
        heroImageUrl: null,
        bodyContent: exp.bodyContent,
        whyItsSpecial: exp.whyItsSpecial,
        insiderTips: exp.insiderTips,
        whatToAvoid: exp.whatToAvoid,
        practicalInfo: exp.practicalInfo,
        gettingThere: exp.gettingThere,
        editorialNote: exp.editorialNote,
        sport: ["cricket"],
        moodTags: exp.moodTags,
        interestCategories: exp.interestCategories,
        pace: exp.pace,
        physicalIntensity: exp.physicalIntensity,
        budgetTier: exp.budgetTier,
        budgetCurrency: "ZAR",
        bestSeasons: exp.bestSeasons,
        advanceBookingRequired: exp.advanceBookingRequired,
        availability: exp.availability,
        curationTier: "editorial",
        lastVerifiedDate: "2026-07-14",
      })
      .returning({ id: experiences.id, slug: experiences.slug, title: experiences.title, status: experiences.status });

    await db.insert(sportingEventExperiences)
      .values({ experienceId: result.id, sportingEventId: EVENT_ID })
      .onConflictDoNothing();

    console.log("✓", result.title, "|", result.id, "|", result.slug);
  } catch (e) {
    console.error("✗ FAILED:", exp.title, "-", e.message);
  }
}

const experiencesList = [
  {
    slugBase: "kingsmead-cricket-by-the-beach",
    title: "Kingsmead — Cricket by the Beach",
    subtitle: "Test cricket a stone's throw from the Indian Ocean, with a pitch local folklore says the tide can change",
    experienceType: "fan_experience",
    neighborhood: "Kingsmead / Beachfront",
    address: "Kingsmead Cricket Stadium, Walter Gilbert Road, Durban, 4001",
    bodyContent: `Kingsmead has hosted Test cricket since January 1923, when England and South Africa played out a draw here, and again in 1939, when England and South Africa played a "timeless Test" that ended in a draw only because England had to catch the boat home. That's how long this ground has been part of the international game.

What makes Kingsmead distinctive is location. It sits little more than a stone's throw from Durban's Indian Ocean coastline — a 25,000-seat stadium within walking distance of the city's famous beaches. The ground has long been renowned as a seamer's wicket, and there's a genuine, long-running piece of local folklore attached to it: because the pitch is laid slightly below sea level, some maintain that when the tide comes in during the late afternoon, the water table rises and offers unexpected movement to seam bowlers. Whether or not the science fully holds up, it's the kind of detail that's been repeated by commentators for decades.

The ground has produced real cricketing history beyond the folklore. In February 1970, South Africa demolished Australia by an innings and 129 runs here, with Graeme Pollock and Barry Richards scoring 274 and 140 respectively — one of the most one-sided results in the rivalry's history. More recently, on 19 September 2007, Yuvraj Singh hit six consecutive sixes off a single Stuart Broad over during a World Twenty20 match, a moment that's been replayed more times than almost any other over in the format's history.

Kingsmead hosts both the tour's 1st ODI on 24 September 2026 and the 1st Test from 9-13 October — the same ground, two different formats, three weeks apart. The humid Durban climate plays into both: expect seam and swing conditions early, with the coastal humidity a real factor in how the ball behaves through the day.`,
    whyItsSpecial: `Most cricket grounds with a "unique" reputation are trading on a single quirky fact. Kingsmead has a genuine stack of them — the tide folklore, the timeless 1939 Test, the Pollock-Richards demolition, Yuvraj's six sixes — and they're not marketing copy, they're things that actually happened here across a century of international cricket.

What I find most compelling is the beach proximity itself. Most Test grounds are landlocked, formal, removed from anywhere else you'd want to be. Kingsmead puts you in walking distance of the Indian Ocean, which changes the whole rhythm of a match day — you can genuinely walk from a beachfront breakfast to your seat, and back to the water after the close of play.`,
    practicalInfo: {
      hours: "1st ODI: 24 Sep 2026. 1st Test: 9-13 Oct 2026, five days. Gates typically open 2-3 hours before play.",
      costRange: "Test and ODI ticket pricing to be confirmed closer to the tour — check cricketsa.com/tickets nearer the date",
      bookingMethod: "Tickets sold through Cricket South Africa's official ticketing partner — check cricketsa.com/tickets for the confirmed sales window as the tour approaches.",
      website: "https://www.espncricinfo.com/cricket-grounds/kingsmead-durban-59089",
      reservationsRequired: true,
    },
    gettingThere: "Kingsmead sits close to Durban's Golden Mile beachfront, walkable from most central Durban and beachfront accommodation. Uber and metered taxis are the practical option for those staying further out, such as Umhlanga.",
    editorialNote: "Sources: espncricinfo.com/cricket-grounds/kingsmead-durban-59089, Wikipedia (Kingsmead Cricket Ground), sahistory.org.za, sportsistan.com. Verified 14 Jul 2026.",
    insiderTips: [
      "If you're into the tide folklore, ask a local vendor or steward about it — it's a genuine talking point among Durban cricket regulars, not just a tourist line.",
      "Durban's humidity is real and constant through September-October — bring more water than you think you'll need.",
    ],
    whatToAvoid: "Don't assume the 1st ODI and 1st Test have the same ticketing timeline just because they're at the same venue — check sales windows separately for each match.",
    moodTags: ["historic", "coastal", "electric-atmosphere"],
    interestCategories: ["sport", "sightseeing"],
    pace: "moderate",
    physicalIntensity: 2,
    budgetTier: "moderate",
    bestSeasons: ["sep", "oct"],
    advanceBookingRequired: true,
    availability: "event_only",
  },
  {
    slugBase: "kingsmead-test-match-strategy",
    title: "Kingsmead Test Match Day — Which Day to Pick",
    subtitle: "A session-by-session guide to the 1st Test's five days, and how a Kingsmead Test tends to play out",
    experienceType: "fan_experience",
    neighborhood: "Kingsmead / Beachfront",
    address: "Kingsmead Cricket Stadium, Walter Gilbert Road, Durban, 4001",
    bodyContent: `A five-day Test is a big commitment if you're only in Durban for part of the tour, so it's worth understanding how a Kingsmead Test tends to unfold before picking which day, or days, to attend.

Kingsmead's reputation as a seamer's wicket means the early days of a Test here typically favour fast bowling, with the coastal humidity assisting swing, particularly in the morning session before the sun burns through the cloud cover. Day one and day two are usually when conditions are most helpful to bowlers, which can mean lower scoring but genuinely tense, fluctuating cricket — good days to watch if you want to see wickets fall in clusters.

By days three and four, the pitch tends to flatten out somewhat as the surface dries, and batting conditions typically improve, though Kingsmead rarely turns into a pure batting paradise the way some subcontinental venues do. The tide folklore, real or not, adds a layer of unpredictability that Durban regulars watch for specifically in the final session of each day.

Day five, if the match reaches it, is when a Test typically decides itself — declarations, run chases, and the psychological pressure of a result on the line. Not every Test reaches a fifth day, but if you can only pick one day of a five-day match and you want maximum drama, the final day of a competitive Test is usually the highest-stakes cricket you'll see all tour.

For a first Test of a series against a side ranked world number one, expect both teams to come out cautious early, with the match likely to open up as both sides get a read on conditions.`,
    whyItsSpecial: `Test cricket rewards patience, but not everyone has five days to give it. What I want to do here is be honest about the trade-offs: the early days at Kingsmead tend to be more bowler-dominated and can produce lower, scrappier scoring, which some fans love and others find slow if they're new to the format. The middle days often settle into a more traditional rhythm. The final day, if the match survives that long, is usually unmissable if you can only choose one.

There's no universally correct answer here — it depends on whether you want to see fast bowling at its most dangerous, or a match reaching its conclusion.`,
    practicalInfo: {
      hours: "1st Test: 9-13 Oct 2026. Standard Test match hours, typically starting mid-morning local time.",
      costRange: "Single-day and multi-day Test ticket options typically both available — check cricketsa.com/tickets for confirmed pricing structure",
      bookingMethod: "Tickets sold through Cricket South Africa's official ticketing partner — single-day tickets are usually available alongside full multi-day passes.",
      website: "https://www.espncricinfo.com/cricket-grounds/kingsmead-durban-59089",
      reservationsRequired: true,
    },
    gettingThere: "Kingsmead sits close to Durban's Golden Mile beachfront, walkable from most central Durban accommodation.",
    editorialNote: "Sources: espncricinfo.com (Kingsmead ground records, pitch behaviour patterns), fantasykhiladi.com (pitch report), thetopbookies.com. Verified 14 Jul 2026. Session-by-session pattern is a general characterisation based on the venue's known seamer-friendly reputation, not a guarantee for this specific Test.",
    insiderTips: [
      "If you can only attend one day, check the weather forecast the week before — a Kingsmead Test with rain around can shift the whole day-by-day dynamic.",
      "Multi-day tickets are usually better value than buying single days individually if you know you'll attend more than 2 days.",
    ],
    whatToAvoid: "Don't assume day one will be the most exciting cricket just because it's the start — the match often actually opens up more from day three onward once both sides have settled.",
    moodTags: ["strategic", "electric-atmosphere", "insider-knowledge"],
    interestCategories: ["sport"],
    pace: "moderate",
    physicalIntensity: 1,
    budgetTier: "moderate",
    bestSeasons: ["oct"],
    advanceBookingRequired: true,
    availability: "event_only",
  },
  {
    slugBase: "where-to-stay-durban",
    title: "Where to Stay in Durban",
    subtitle: "Golden Mile beachfront or Umhlanga — two real options for a Kingsmead tour stop",
    experienceType: "accommodation",
    neighborhood: "Golden Mile / Umhlanga",
    address: "Golden Mile, Durban",
    bodyContent: `Durban's accommodation choice for cricket visitors really comes down to two neighbourhoods, and they set genuinely different tones for your stay.

The Golden Mile beachfront puts you in walking distance of Kingsmead itself, the promenade, and uShaka Marine World at its southern end. Southern Sun Elangeni & Maharani is the standout beachfront option here — a large, well-established hotel directly on the Golden Mile with sea views and easy access to the stadium. It's the practical, no-transport-needed choice for match days.

Umhlanga, a coastal suburb roughly 20 minutes north of the city centre, is Durban's more upmarket alternative — a cleaner, quieter, resort-style base with its own beach and the Gateway Theatre of Shopping nearby. The Oyster Box, a well-known heritage property right on Umhlanga's beachfront next to the lighthouse, is the pick here — polished, established, and popular with visitors who want a resort feel over a city-beachfront one.

The trade-off is straightforward: the Golden Mile keeps you close to Kingsmead and the city's beachfront energy, while Umhlanga trades that proximity for a quieter, more polished base with its own beach and dining scene, at the cost of a 20-minute commute into the city on match days.`,
    whyItsSpecial: `Durban doesn't have the sprawling neighbourhood choice of Cape Town or Johannesburg, which actually makes this decision simpler. It really is a question of city-beachfront energy and stadium proximity versus a quieter, resort-style stay with a short commute.

For a cricket-first trip where you're prioritising being close to Kingsmead across both the ODI and the Test, the Golden Mile makes the most practical sense. For a trip where cricket is one part of a broader Durban stay and you want a calmer base to return to each evening, Umhlanga is worth the extra travel time.`,
    practicalInfo: {
      hours: "Standard hotel check-in/out",
      costRange: "Southern Sun Elangeni & Maharani and The Oyster Box both sit in the upper-moderate to splurge range depending on season and room type — confirm current rates directly, as Test-week demand will affect pricing",
      bookingMethod: "Book directly with each hotel or via Booking.com — book well ahead of the September-October tour window given the scale of a marquee Australia series.",
      website: "tsogosun.com (Southern Sun) / oysterboxhotel.com",
      reservationsRequired: true,
    },
    gettingThere: "Southern Sun Elangeni & Maharani is on the Golden Mile, walking distance to Kingsmead. The Oyster Box is in Umhlanga, roughly 20 minutes north of central Durban and Kingsmead by car.",
    editorialNote: "Sources: tsogosun.com, oysterboxhotel.com. Verified 14 Jul 2026. Booking.com affiliate candidates flagged, not yet linked: Southern Sun Elangeni & Maharani, The Oyster Box.",
    insiderTips: [
      "If staying in Umhlanga, plan your matchday transport in advance — 20 minutes can stretch significantly with tour traffic on event days.",
      "The Golden Mile option means you can walk to uShaka Marine World as well as the stadium, worth factoring in if you want both without extra transport.",
    ],
    whatToAvoid: "Don't book Umhlanga assuming a quick 20-minute hop into the city on every match day — factor in genuine buffer time, especially for early ODI starts.",
    moodTags: ["coastal", "comfort", "practical"],
    interestCategories: ["accommodation", "sport"],
    pace: "slow",
    physicalIntensity: 1,
    budgetTier: "splurge",
    bestSeasons: ["sep", "oct"],
    advanceBookingRequired: true,
    availability: "event_only",
  },
  {
    slugBase: "durban-bunny-chow-indian-ocean-cuisine",
    title: "Durban's Bunny Chow & Indian Ocean Cuisine",
    subtitle: "The curry-in-a-bread-loaf dish invented here, in the city with South Africa's largest Indian diaspora",
    experienceType: "dining",
    neighborhood: "Durban CBD / Golden Mile",
    address: "Durban CBD",
    bodyContent: `Durban has the largest Indian diaspora outside of India itself, and the city's food culture reflects that history directly rather than as an imported trend. Bunny chow — a hollowed-out loaf of bread filled with curry — is the dish that best represents it, and it was invented in Durban, not brought here fully formed from elsewhere.

The dish's origins trace to Indian indentured labourers and traders in early-to-mid 20th century Durban, who needed a portable, contained way to eat curry without cutlery — the bread became both container and food. It's since become the city's defining street food, sold everywhere from casual takeaway spots to established sit-down restaurants, typically ordered by the "quarter," "half," or "full" loaf depending on how hungry you are, and by filling (mutton, chicken, bean, or vegetable curries are all standard).

Beyond bunny chow specifically, Durban's Indian Ocean cuisine draws on decades of Indian culinary tradition adapted with local ingredients and spice blends distinct from Indian subcontinental cooking — Durban curries tend to run hotter and use different spice combinations than their Indian counterparts, having evolved separately for well over a century.

The Victoria Street Market in the CBD is the traditional starting point for understanding this food culture — a covered market selling spices, ingredients, and quick eats that's been part of Durban's Indian community life for generations, worth a visit even if you're eating your actual meals elsewhere.`,
    whyItsSpecial: `Durban's food story is genuinely distinct from the rest of South Africa's culinary landscape, and it's easy to miss that if you only think of South African food as braai and boerewors. Bunny chow specifically is a dish that couldn't have been invented anywhere else — it's a direct product of Durban's specific history of indentured Indian labour and the practical need for portable food, not a fusion dish dreamed up for tourists.

Eating it here, in the city where it was actually invented, is a genuinely different experience from eating a version of it anywhere else in the world. Combined with the deeper Indian Ocean cuisine tradition running through Durban's restaurants, this is one of the more distinctive food cities in South Africa.`,
    practicalInfo: {
      hours: "Bunny chow spots and the Victoria Street Market keep standard daytime and evening trading hours — check individual venues",
      costRange: "Bunny chow is genuinely inexpensive street food, typically a budget-friendly meal; sit-down Indian Ocean cuisine restaurants sit in the moderate range",
      bookingMethod: "Bunny chow spots are walk-in, no reservation needed. Sit-down restaurants may be worth booking ahead for dinner, particularly during the tour's peak weeks.",
      website: null,
      reservationsRequired: false,
    },
    gettingThere: "Victoria Street Market and most well-known bunny chow spots sit in or near the Durban CBD, a short taxi or rideshare from Golden Mile accommodation.",
    editorialNote: "Sources: general research on bunny chow origins and Durban's Indian diaspora history — cross-referenced across multiple South African food and cultural history sources. Verified 14 Jul 2026. Specific restaurant names were not confirmed with high enough confidence in this research pass to include by name — recommend a follow-up pass naming 2-3 specific, currently-trading bunny chow spots before this experience is published.",
    insiderTips: [
      "Order a 'quarter' bunny if you're not sure how hungry you are — it's a genuinely substantial portion despite the name.",
      "Bean bunny chow is the vegetarian option and is just as traditional as the meat versions — don't assume it's an afterthought on the menu.",
    ],
    whatToAvoid: "Don't judge Durban curry heat by Indian subcontinental standards — Durban's spice tradition evolved separately and can run hotter than visitors expect.",
    moodTags: ["culinary", "authentic", "historic"],
    interestCategories: ["food", "culture"],
    pace: "moderate",
    physicalIntensity: 1,
    budgetTier: "budget",
    bestSeasons: ["sep", "oct"],
    advanceBookingRequired: false,
    availability: "perennial",
  },
  {
    slugBase: "ushaka-marine-world-golden-mile",
    title: "uShaka Marine World & the Golden Mile",
    subtitle: "An aquarium built into a shipwreck at the southern end of Durban's two-hour beachfront walk",
    experienceType: "activity",
    neighborhood: "Point Waterfront / Golden Mile",
    address: "1 King Shaka Avenue, Point Waterfront, Durban, 4001",
    bodyContent: `uShaka Marine World sits at the southern tip of the Golden Mile, at Point Waterfront, and works as two attractions in one site: the aquarium and marine park (uShaka Sea World), and the water park (Wet 'n Wild) next to it. The complex opened in April 2004, designed around a theme of a wrecked 1940s cargo ship, with the aquarium's underwater viewing galleries built to run through and beneath a series of recreated shipwrecks rather than standard tank corridors. It's the largest aquarium in the Southern Hemisphere.

Sea World tickets run around R202 for adults, R154 for children and seniors. The aquarium alone, without the marine park elements, is R104 for adults and R94 for children and seniors, open daily. Wet 'n Wild costs roughly R192/R156 and only operates Wednesday to Sunday.

The site includes dolphin and seal shows in a 1,200-seat stadium, along with a penguin enclosure — and it's worth knowing these shows have drawn real, ongoing criticism. Animal rights groups have held protests outside the park as recently as 2024, and there have been documented concerns about inbreeding among the dolphin population and the welfare implications of keeping cetaceans, which navigate primarily by echolocation, in concrete tanks. This is a live, unresolved debate in South Africa's conservation community, worth knowing before buying a Sea World ticket specifically for the dolphin show.

The wider Golden Mile is worth building time around regardless of what you decide on uShaka. The full beachfront promenade, from uShaka in the south to Suncoast Casino and Blue Lagoon in the north, takes around two hours to walk end to end, passing surf breaks, the Moses Mabhida Stadium skyline, beachfront restaurants, and the saltwater Marine Parade pools.`,
    whyItsSpecial: `The shipwreck framing genuinely changes how the aquarium feels. Most aquariums are a sequence of glass boxes; uShaka built its display galleries to run through and under reconstructed wrecks, so you're moving through a wreck site rather than a corridor of tanks. That's a real design decision, and it still holds up as one of the more interesting aquarium layouts anywhere.

I'd be doing this piece a disservice if I only wrote about the shipwreck theming and skipped the dolphin show controversy. It's real, it's recent, and it's not a settled argument. You can visit the aquarium, which is a different and less contested thing, without buying into the dolphin stadium specifically. That choice is yours, but it should be informed.`,
    practicalInfo: {
      hours: "Aquarium open daily; Wet 'n Wild water park open Wednesday to Sunday only — call to confirm current show times",
      costRange: "Sea World (aquarium + marine park) R202 adult / R154 child-senior. Aquarium only R104 adult / R94 child-senior. Wet 'n Wild R192 adult / R156 child-senior (Wed-Sun only). Under-3s free.",
      bookingMethod: "Tickets can be bought at the gate or in advance through the official website or third-party platforms like GetYourGuide and Viator.",
      website: "https://ushakamarine.com",
      reservationsRequired: false,
    },
    gettingThere: "uShaka sits at the southern end of the Golden Mile at Point Waterfront — walkable from Golden Mile hotels, and a short taxi/rideshare from Kingsmead or Umhlanga.",
    editorialNote: "Sources: ushakamarine.com, ushakamarine.com/ratesandtimes, Wikipedia (uShaka Marine World), Earthrace Conservation, ECR News. Verified 14 Jul 2026. Dolphin show controversy sourced directly from Earthrace Conservation and ECR News reporting.",
    insiderTips: [
      "If you only want the aquarium and not the marine park shows, buy the aquarium-only ticket (R104) — less than half the price of Sea World and covers the shipwreck-themed galleries.",
      "Wet 'n Wild is closed Monday and Tuesday — build a water park day around Wednesday through Sunday.",
    ],
    whatToAvoid: "Don't try to walk the full two-hour Golden Mile promenade in the middle of the day during September or October — Durban's midday sun and humidity make the shadeless beachfront path genuinely uncomfortable; go late afternoon instead.",
    moodTags: ["family-friendly", "beachfront", "landmark"],
    interestCategories: ["activity", "nature"],
    pace: "active",
    physicalIntensity: 2,
    budgetTier: "moderate",
    bestSeasons: ["sep", "oct"],
    advanceBookingRequired: false,
    availability: "perennial",
  },
];

for (const exp of experiencesList) {
  await seed(exp);
}

await client.end();
console.log("\nAll Durban experiences seeded.");
