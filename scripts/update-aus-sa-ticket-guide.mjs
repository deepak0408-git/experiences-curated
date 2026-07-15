import { config } from "dotenv";
config({ path: ".env.local" });

import { readFileSync } from "fs";
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { eq } from "drizzle-orm";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { experiences } from "../schema/database.ts";

const r2 = new S3Client({
  region: "auto",
  endpoint: `https://${process.env.CLOUDFLARE_R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
  credentials: {
    accessKeyId: process.env.CLOUDFLARE_R2_ACCESS_KEY_ID,
    secretAccessKey: process.env.CLOUDFLARE_R2_SECRET_ACCESS_KEY,
  },
});

const client = postgres(process.env.DATABASE_URL, { ssl: "require", prepare: false });
const db = drizzle(client);

const EXPERIENCE_ID = "14e825dd-2e9f-46c8-ae5c-8266f3db00fe";

const bodyContent = `The Australia tour of South Africa 2026-27 runs from 24 September to 31 October, three ODIs followed by three Tests, spread across five cities. For a fan planning a trip rather than a single match, the geography matters as much as the cricket.

The ODI leg opens at Kingsmead in Durban on 24 September, moves to the DP World Wanderers Stadium in Johannesburg for the second match on 27 September, then to JB Marks Oval in Potchefstroom for the third on 30 September. The Test series that follows is the tour's centrepiece: the first Test returns to Kingsmead from 9-13 October, the second moves to Dafabet St George's Park in Gqeberha from 18-22 October, and the third and final Test closes the tour at Newlands in Cape Town from 27-31 October. This is Australia's first Test tour of South Africa since the 2018 ball-tampering scandal, against the reigning World Test Championship holders, with real WTC points on the line.

Tickets are sold through Cricket South Africa's official partner, TicketPro (tickets.cricket.co.za), with the 2026-27 international season's sales window opening well ahead of the tour. Newlands pricing for comparable recent Tests has run R420-R500 per day for general grounds access, with a five-day package around R990 — a useful benchmark, though Kingsmead and Wanderers pricing for this specific series hadn't been separately confirmed at the time of writing. Check TicketPro directly for the exact numbers as they're published.

For a fan covering all three of our featured cities — Durban, Johannesburg, Cape Town — the realistic itinerary is: Durban for the 1st ODI and 1st Test (same ground, three weeks apart, so either stay the whole window or make two separate Durban trips), Johannesburg for the 2nd ODI, then Cape Town for the 3rd Test at the very end of the tour. Gqeberha and Potchefstroom are real stops on the tour but sit outside this pack's three-city focus.

Because the full tour spans five weeks, it's genuinely built for combining with a broader South Africa trip rather than treating cricket as the entire itinerary. A realistic city-by-city version looks like this: start in Durban for the 1st ODI (24 Sep), use the three-week gap before the 1st Test to head inland — Johannesburg for the 2nd ODI (27 Sep), then a 2-day Kruger National Park safari from Johannesburg (the most efficient way to add a genuine Big 5 experience to this trip), before returning to Durban for the 1st Test (9-13 Oct). From there, Cape Town for the 3rd Test (27-31 Oct) leaves a real window beforehand for the Cape Peninsula, the Winelands, or Robben Island. Fans following the full tour to Gqeberha for the 2nd Test have Addo Elephant Park, one of South Africa's major national parks and a genuine Big 5 destination, close by as an alternative or addition to Kruger. None of this needs to be booked as a single package — it's simply worth knowing the tour's own rhythm leaves real gaps for exactly this kind of travel.

Newlands' recent history of selling out before general sale even opens is the clearest signal on this tour: the tickets that will move fastest are the Cape Town Test, both because it's the series finale and because Newlands specifically has a track record of selling out early.`;

const whatToAvoid = "Don't try to build an itinerary that chases every match across all five cities — the tour's real geography (Durban twice, three weeks apart, then Johannesburg, Gqeberha, and Cape Town in sequence) makes a full-tour trip a genuine month-plus commitment with a lot of backtracking. Most travelling fans get a better trip picking one leg (ODIs or Tests) and one or two cities, then using the time that frees up for the kind of South Africa travel — Kruger, the Cape Peninsula, the Winelands — that a cricket-only itinerary has no room for.";

try {
  const imageKey = "experiences/hero/aus-sa-ticket-guide.jpg";
  const heroImageUrl = `${process.env.NEXT_PUBLIC_R2_PUBLIC_URL}/${imageKey}`;
  await r2.send(new PutObjectCommand({
    Bucket: process.env.CLOUDFLARE_R2_BUCKET_NAME,
    Key: imageKey,
    Body: readFileSync("Images/SA vs Aus.jpg"),
    ContentType: "image/jpeg",
  }));
  console.log("✓ Uploaded to R2:", heroImageUrl);

  const [result] = await db.update(experiences).set({
    heroImageUrl,
    heroImageAlt: "South Africa vs Australia cricket",
    heroImageCredit: "Wikimedia Commons",
    bodyContent,
    whatToAvoid,
    editorialNote: "Sources: ESPNcricinfo (Australia tour of South Africa 2026-27 fixtures), ICC.com (WTC series schedule), cricket.co.za (CSA ticket sales announcements), quicket.co.za, clubcricket.co.za, tripadvisor.com/getaway.co.za (Gqeberha attractions, Addo Elephant Park). Verified 14-15 Jul 2026. Kingsmead/Wanderers-specific pricing not yet confirmed at time of writing — Newlands pricing used as an explicit benchmark only, not presented as this series' actual price.",
  }).where(eq(experiences.id, EXPERIENCE_ID)).returning({ id: experiences.id, title: experiences.title });

  console.log("✓ Updated:", result.title, "|", result.id);
} catch (e) {
  console.error("✗ FAILED:", e.message);
  if (e.cause) console.error("CAUSE:", e.cause);
} finally {
  await client.end();
}
