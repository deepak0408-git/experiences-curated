// Fix: japanese-gp-sumo-near-nagoya — 3 issues flagged by founder 24 Sep 2026:
//
// 1. Insider tip 2 was a restatement of tip 1's July/April distinction
//    ("if a future trip lands in July, go to the real Basho instead") —
//    not genuinely new content. Replaced with a real cultural/tradition
//    tip: the pre-match Shinto ritual sequence (chikara-mizu, chiri-chozu,
//    shio-maki salt throwing, shiko stomping) that's happening even inside
//    Sumo Studio Osaka's teaching format, since the former rikishi
//    demonstrates the ritual as part of the session — genuinely new
//    information, not a restatement.
//    Sources (24 Sep 2026): en.wikipedia.org/wiki/Shinto_origins_of_sumo,
//    jasumo.com sumo rituals guide, sumosumosumo.com sumo ceremony guide.
//
// 2. whatToAvoid was one paragraph but both sentences made the same point
//    twice (don't expect Basho in April / don't expect tournament
//    atmosphere at the studio — both just restate the July/April,
//    tournament/studio distinction already covered in insider tip 1 and
//    the body). Replaced sentence 2 with a genuinely different, verified
//    warning: the "audience challenge" dohyo-participation moment is
//    described by the operator's own site as "a rare chance" — not
//    guaranteed for every guest — which the body's current framing
//    ("you get to step onto a real dohyo yourself") oversells.
//    Source: sumowrestlingshow.jp homepage, fetched 24 Sep 2026.
//
// 3. Address was a placeholder ("Sumo Studio Osaka, Osaka, Japan") —
//    replaced with the real full address, English-translated, confirmed
//    against both the operator's own access page (sumowrestlingshow.jp/
//    access/) and the Google Places API result for the same place ID
//    (ChIJCzfpxo_dAGARa0mWR3-n1IU) — same venue both places.

import { config } from "dotenv";
config({ path: ".env.local" });
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { eq } from "drizzle-orm";
import { experiences } from "../schema/database.ts";

const client = postgres(process.env.DATABASE_URL, { ssl: "require", prepare: false });
const db = drizzle(client);

const insiderTips = [
  "Don't confuse Sumo Studio Osaka's interactive program with a Basho tournament experience — they're genuinely different things, and going in with the right expectation (a hands-on masterclass, not a spectator tournament) makes for a better visit.",
  "The former rikishi leading the session demonstrates the real pre-match ritual, not just technique — chikara-mizu (a ceremonial mouth-rinse with 'strength water'), chiri-chozu (the arm-spread squat showing empty hands, proof no weapons are hidden), shio-maki (throwing salt to purify the dohyo), and shiko (the deep, one-legged stomp believed to drive evil spirits from the ring). All four trace back to sumo's Shinto origins — it's worth asking your instructor to walk through the meaning of each step rather than treating it as pre-match theatre.",
];

const whatToAvoid = "Don't plan around watching the Nagoya Basho for an April race weekend trip — it's a July-only tournament, and there's no version of it running during Grand Prix week. Don't assume you're guaranteed a turn on the dohyo yourself — the operator's own site describes the audience challenge as \"a rare chance,\" not a promise extended to every guest, so go in prepared to possibly spend the session watching rather than participating.";

const address = "1F Hanazonocho AI Building, 1-5-1 Asahi, Nishinari-ku, Osaka 557-0032, Japan";

try {
  const [result] = await db
    .update(experiences)
    .set({
      insiderTips,
      whatToAvoid,
      address,
      lastVerifiedDate: "2026-09-24",
      editorialNote:
        "Source: sumowrestlingshow.jp (founder-provided reference, verified 21 Sep 2026) — confirms Nagoya Basho is July-only (wrong season for this event) and Sumo Studio Osaka as the real, honest, year-round alternative. Address confirmed 24 Sep 2026 against sumowrestlingshow.jp/access/ and Google Places API (same place ID). Insider tip 2 (Shinto ritual detail) and whatToAvoid item 2 (audience challenge not guaranteed) sourced 24 Sep 2026: en.wikipedia.org/wiki/Shinto_origins_of_sumo, jasumo.com, sumosumosumo.com, and sumowrestlingshow.jp homepage (\"a rare chance\" framing).",
    })
    .where(eq(experiences.slug, "japanese-gp-sumo-near-nagoya"))
    .returning({ id: experiences.id, slug: experiences.slug, title: experiences.title, status: experiences.status });

  if (!result) {
    console.error("✗ No row found for slug: japanese-gp-sumo-near-nagoya");
  } else {
    console.log(`✓ ${result.slug} | ${result.status} — address, insider tip 2, and whatToAvoid updated`);
  }
} catch (e) {
  console.error("Error:", e.message);
  if (e.cause) console.error("Cause:", e.cause.message ?? e.cause);
} finally {
  await client.end();
}
