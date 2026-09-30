// Fix: "Nagoya in a Day — the City Before or After the Race"
// (japanese-gp-nagoya-day-trip) named Kinshachi Yokocho as "Nagoya's own
// dishes" / "the city's signature food" without ever naming a single dish.
// Founder flagged this 24 Sep 2026.
//
// Adds the actual Nagoya meshi dishes (hitsumabushi, miso katsu, miso
// nikomi udon, tebasaki, ankake spaghetti) and the long-established named
// restaurants serving them at the food street, to bodyContent, insider
// tip 1, and practicalInfo.costRange.
//
// Sources (verified 24 Sep 2026):
// - gltjp.com Kinshachi Yokocho directory listing (zones, named restaurants:
//   Yabaton, Yamamotoya Sohonke, Nagoya Bicho, Ankake Taro)
// - aichinow.pref.aichi.jp official Kinshachi Yokocho Gourmet Town listing
//   (zone layout, dish list)
// - byfood.com "What to Eat in Nagoya", snowmonkeyresorts.com Nagoya food
//   guide (Nagoya meshi five pillars: miso katsu, tebasaki, hitsumabushi,
//   kishimen, miso nikomi udon)
//
// Note: sources disagree on whether the Muneharu Zone sits at the main
// gate or the east gate, so copy says "the gates" rather than naming one.
// Hitsumabushi pricing kept as a relative band, not a hard figure — no
// current confirmed price found (see feedback_no_confirmed_pricing_without_verification.md).

import { config } from "dotenv";
config({ path: ".env.local" });
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { eq } from "drizzle-orm";
import { experiences } from "../schema/database.ts";

const client = postgres(process.env.DATABASE_URL, { ssl: "require", prepare: false });
const db = drizzle(client);

const slug = "japanese-gp-nagoya-day-trip";

const bodyContent = `Most Suzuka visitors already pass through Nagoya without ever really seeing it — it's the base for the race, not the destination. That's worth correcting with one full day, either before the circuit takes over your schedule or after the race, while you're still in the region anyway.

Nagoya Castle is the obvious anchor, and it earns the visit. The main keep is a postwar reconstruction, but the Honmaru Palace within the castle grounds is the real draw — a genuinely faithful reconstruction of the original Edo-period structure, with gold-leaf paintings and interior detail rebuilt to match historical records rather than a generic castle-museum treatment. Budget a couple of hours here if the palace interior interests you, less if you're mainly there for the grounds and the photo.

From the castle, Kinshachi Yokocho sits right at the gates — a food street built specifically around Nagoya meshi, the city's own regional cooking, rather than a generic tourist food court. That means the dishes Nagoya is actually known for: hitsumabushi, grilled eel served over rice in a wooden tub and eaten three different ways through the meal; miso katsu, a pork cutlet under a dark hatcho miso sauce; miso nikomi udon, thick noodles simmered in the same miso until they're almost chewy; tebasaki, the twice-fried peppered chicken wings; and ankake spaghetti, a local oddity of thick peppery gravy over pasta that exists essentially nowhere else. Several of the stalls are outposts of the long-established Nagoya names — Yabaton for miso katsu, Yamamotoya Sohonke for miso nikomi udon, Nagoya Bicho for hitsumabushi — so you're not trading quality for the convenience of having them in one place. It's the easiest single stop for eating your way through the city's signature dishes, and a natural lunch straight off a castle visit.

Osu is the other essential stop, and it's a genuinely different kind of neighbourhood from the castle grounds — a dense, slightly chaotic shopping street mixing electronics, vintage clothing, temples, and street food, closer to Tokyo's Akihabara in energy than anything else in Nagoya. Osu Kannon, the Buddhist temple the area is named for, sits right in the middle of it, worth a stop even if temples aren't usually your priority — the contrast between the temple grounds and the shopping street around it is part of what makes Osu interesting.

If you have time beyond the castle and Osu, Sakae is Nagoya's modern commercial core — a place to end the day with dinner and a look at the city's contemporary side after a day spent mostly in its historical and food-focused areas.

One realistic day covers the castle, Kinshachi Yokocho, and Osu comfortably, with Sakae as an evening add-on if you're not racing back for an early Suzuka start the next morning.`;

const insiderTips = [
  "Visit Kinshachi Yokocho right after Nagoya Castle, not as a separate outing — it sits at the castle gates, and going straight from the grounds to lunch there is the natural order. If you only eat one thing, make it hitsumabushi: the point is the three-stage ritual — plain first, then with the wasabi and spring onion condiments, then with dashi poured over as a rice soup — and a stall that serves it properly will explain the order on the tray.",
  "If you only have half a day rather than a full one, prioritize Osu over the castle interior — Osu Kannon plus the surrounding shopping street gives a more immediately distinctive sense of Nagoya than the castle's reconstructed keep does.",
];

const practicalInfo = {
  hours: "Nagoya Castle: typically 9am-4:30pm (Honmaru Palace closes earlier); Osu Kannon and the surrounding street: open throughout the day",
  costRange: "Nagoya Castle entry: budget-friendly, under ¥1,000; Osu and Kinshachi Yokocho: free to enter, food priced per stall — hitsumabushi is the expensive one (typically a few thousand yen), miso katsu, kishimen and tebasaki considerably less",
  bookingMethod: "No advance booking required for the castle, Kinshachi Yokocho, or Osu — all walk-in.",
  website: "https://www.nagoyajo.city.nagoya.jp/en/",
};

try {
  const [result] = await db
    .update(experiences)
    .set({
      bodyContent,
      insiderTips,
      practicalInfo,
      lastVerifiedDate: "2026-09-24",
      editorialNote:
        "Sources: agoda.com '10 Must-Do Things in Nagoya', travel2next.com Nagoya itinerary, japanesefestival.net 3-Day Nagoya Itinerary (gathered 21 Sep 2026). Kinshachi Yokocho dish/restaurant detail added 24 Sep 2026: gltjp.com and aichinow.pref.aichi.jp (official) Kinshachi Yokocho listings, byfood.com and snowmonkeyresorts.com Nagoya meshi guides.",
    })
    .where(eq(experiences.slug, slug))
    .returning({ id: experiences.id, slug: experiences.slug, title: experiences.title, status: experiences.status });

  if (!result) {
    console.error("No row found for slug:", slug);
  } else {
    console.log("✓ Updated:", result.title, "|", result.id, "|", result.slug, "|", result.status);
  }
} catch (e) {
  console.error("Error:", e.message);
  if (e.cause) console.error("Cause:", e.cause.message ?? e.cause);
} finally {
  await client.end();
}
