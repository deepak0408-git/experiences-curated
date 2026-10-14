import { config } from "dotenv";
config({ path: ".env.local" });

import postgres from "postgres";

const sql = postgres(process.env.DATABASE_URL, { ssl: "require" });

const ID = "e69ecc8e-6065-4abe-b56f-498f177b3edc";

const bodyFixes = [
  [
    "Silver 3 is the grandstand on the inside of that corner, now covered for 2026 — it was open previously, which in Ardennes weather was a gamble.",
    "Silver 3 is the grandstand on the inside of that corner, now covered — it was open previously, which in Ardennes weather was a gamble.",
  ],
  [
    "Gold 3 — Eau Rouge (sold out for 2026, 3-day weekend)\n\nGold 3 is directly at the Eau Rouge complex — mid-corner, looking up toward Raidillon. It is the most discussed grandstand at Spa and it sold out for the full weekend before most buyers checked availability. Single-day tickets (Saturday or Sunday only) may still exist but sell quickly. If you have not yet bought for the 2026 race, do not hold out for Gold 3. It is gone or close to it.",
    "Gold 3 — Eau Rouge (historically the first grandstand to sell out, 3-day weekend)\n\nGold 3 is directly at the Eau Rouge complex — mid-corner, looking up toward Raidillon. It is the most discussed grandstand at Spa and, in most years, sells out for the full weekend before casual buyers have checked availability. Single-day tickets (Saturday or Sunday only) sometimes survive a little longer but sell quickly too. If Gold 3 is what you want, buy the moment tickets release rather than waiting.",
  ],
  [
    "Gold 8 sits at La Source, the first corner after the start. It has the best view of first-lap drama — the grid acceleration down the pit straight, the braking into Turn 1, the pile-ups that happen at La Source on race Sunday more than anywhere else on the calendar. Gold 8 is covered, has backed seats, and carries a big screen. It also sells out approximately one year in advance. 2026 availability was limited from the first week of sales; Gold 7, the adjacent grandstand, tends to have inventory slightly longer.",
    "Gold 8 sits at La Source, the first corner after the start. It has the best view of first-lap drama — the grid acceleration down the pit straight, the braking into Turn 1, the pile-ups that happen at La Source on race Sunday more than anywhere else on the calendar. Gold 8 is covered, has backed seats, and carries a big screen. It also sells out approximately one year in advance, typically within the first week or two of sales opening; Gold 7, the adjacent grandstand, tends to have inventory slightly longer.",
  ],
  [
    "Tickets for the following year typically go on sale in July, shortly after the current year's race. The 2026 race is 17–19 July, so 2027 tickets will likely appear in July 2026 and the best seats will sell within weeks. For 2026 now: Bronze and most Silver stands still have inventory. Gold 3 weekend is sold out. Gold 8 availability is extremely limited. Gold 1 and Gold 2 may still have single-day options. Do not wait.",
    "Tickets for the following year typically go on sale in July, shortly after the current year's race — so tickets for a given July race year usually appear roughly 12 months ahead, and the best seats (Gold 3, Gold 8) sell within weeks of release. Bronze and most Silver stands tend to hold inventory considerably longer. Check spagrandprix.com and tickets.formula1.com directly for real-time availability rather than assuming a specific stand is open or sold out — don't wait if a specific grandstand is the goal.",
  ],
];

const whyFixes = [
  [
    "Gold 3 and Gold 8 represent the two things Spa does best: Eau Rouge, which is unique in motor racing, and La Source, which produces more first-lap incidents than anywhere else on the calendar. Both sell out early and for good reason. For anyone not yet booked for 2026, that window has likely closed. The practical choice is between Silver 3 Pouhon — a genuinely good mid-range seat — and Gold 1 if the podium view matters.",
    "Gold 3 and Gold 8 represent the two things Spa does best: Eau Rouge, which is unique in motor racing, and La Source, which produces more first-lap incidents than anywhere else on the calendar. Both sell out early and for good reason — if either is sold out by the time you're buying, the practical choice is between Silver 3 Pouhon — a genuinely good mid-range seat — and Gold 1 if the podium view matters.",
  ],
  [
    "The 2026 race runs 17–19 July. The Belgian Ardennes in July can produce 25°C sunshine and a cold driving downpour within the same afternoon.",
    "The Belgian Ardennes in July can produce 25°C sunshine and a cold driving downpour within the same afternoon.",
  ],
];

const practicalInfoFixes = {
  hours: [
    ["Race weekend 17–19 July 2026. Gates open from 06:00 each day.", "Gates open from 06:00 each day of race weekend."],
  ],
  costRange: [
    [
      "Bronze (3-day) from €305. Silver 3 from €565. Gold from €699. Gold 3 weekend sold out; Gold 8 extremely limited.",
      "Bronze (3-day) from €305. Silver 3 from €565. Gold from €699 — figures are a recent-year baseline; confirm current pricing and availability at tickets.formula1.com.",
    ],
  ],
  bookingMethod: [
    [
      "For 2026: Gold 3 3-day weekend is sold out; Gold 8 3-day is extremely limited. Gold 1 and Silver 3 still have availability but Saturday/Sunday single-day tickets sell faster than full weekend passes. The free pit walk is typically included with 3-day tickets and runs Thursday or Friday — confirm at checkout as it is not always shown by default. For 2027, set a calendar reminder for July 2026 immediately after the 2026 race — Gold 8 sells out within the first two weeks of sales opening, Gold 3 typically within the first month.",
      "Gold 3 and Gold 8 are historically the first to sell through — often within the first few weeks of sales opening — while Gold 1 and Silver 3 tend to have availability for longer. Saturday/Sunday single-day tickets generally sell faster than full weekend passes. The free pit walk is typically included with 3-day tickets and runs Thursday or Friday — confirm at checkout as it is not always shown by default. Set a calendar reminder for the week after each year's race, since that's when the following year's tickets typically go on sale.",
    ],
  ],
};

for (const [oldStr, newStr] of bodyFixes) {
  await sql`UPDATE experiences SET body_content = replace(body_content, ${oldStr}, ${newStr}) WHERE id = ${ID}`;
}
for (const [oldStr, newStr] of whyFixes) {
  await sql`UPDATE experiences SET why_its_special = replace(why_its_special, ${oldStr}, ${newStr}) WHERE id = ${ID}`;
}
for (const [col, pairs] of Object.entries(practicalInfoFixes)) {
  for (const [oldStr, newStr] of pairs) {
    await sql`
      UPDATE experiences
      SET practical_info = jsonb_set(practical_info, ${"{" + col + "}"}, to_jsonb(replace(practical_info->>${col}, ${oldStr}, ${newStr})))
      WHERE id = ${ID}
    `;
  }
}

const check = await sql`SELECT body_content, why_its_special, practical_info FROM experiences WHERE id = ${ID}`;
const row = check[0];
const fields = [row.body_content, row.why_its_special, ...Object.values(row.practical_info || {})];
const remaining = fields.filter((f) => typeof f === "string" && /2026/.test(f));
console.log(remaining.length ? "STILL STALE: " + JSON.stringify(remaining) : "clean — no 2026 references remain");

await sql.end();
