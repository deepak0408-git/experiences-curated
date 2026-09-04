// One-off fix: 3 experiences' practical_info.website/.bookingMethod
// pointed to abudhabi.gp, which explicitly self-identifies as "not the
// official Abu Dhabi Grand Prix website... an independent fan guide and
// reseller." Founder caught this live 4 Sep 2026 after it was used
// throughout TicketsSpoke/CostSpoke/ArrivalSpoke/WeatherSpoke/
// FirstTimerGuideSpoke as if official. Real official ticketing is
// tickets.formula1.com/en/f1-3312-abu-dhabi.
import { config } from "dotenv";
config({ path: ".env.local" });
import postgres from "postgres";
const sql = postgres(process.env.DIRECT_URL);

const targets = [
  { id: "c4d479d3-87eb-4853-b6e9-737a32014ba3", title: "Abu Dhabi Hill" },
  { id: "5b07dbc2-c364-4784-905f-411229f34b5f", title: "West Grandstand" },
  { id: "e03380d5-0bf5-49b2-8156-5885624e280d", title: "Main Grandstand" },
];

for (const t of targets) {
  const [r] = await sql`SELECT practical_info FROM experiences WHERE id = ${t.id}`;
  const updated = {
    ...r.practical_info,
    website: "https://tickets.formula1.com/en/f1-3312-abu-dhabi",
    bookingMethod: r.practical_info.bookingMethod
      .replace(/Book via abudhabi\.gp or Formula1\.com official ticket portal/, "Book via Formula1.com's official ticket portal")
      .replace(/Book directly via abudhabi\.gp or Formula1\.com's official ticket portal/, "Book directly via Formula1.com's official ticket portal"),
  };
  await sql`UPDATE experiences SET practical_info = ${sql.json(updated)} WHERE id = ${t.id}`;
  console.log("Fixed:", t.title, "\n ", JSON.stringify(updated));
}
await sql.end();
