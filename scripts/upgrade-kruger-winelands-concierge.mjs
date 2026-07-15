import { config } from "dotenv";
config({ path: ".env.local" });
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { eq } from "drizzle-orm";
import { experiences } from "../schema/database.ts";

const client = postgres(process.env.DATABASE_URL, { ssl: "require", prepare: false });
const db = drizzle(client);

const krugerHowToBook = "If you want to go beyond the standard 3-day Kruger package, look at a Sabi Sands lodge instead — it's private, unfenced land bordering Kruger with the same Big Five, but far higher game density and off-road tracking that public Kruger doesn't allow. The catch is lead time: mid-tier Sabi Sands lodges need booking 6-12 months out for the May-September dry season, and the top names — Singita, Londolozi, MalaMala — genuinely book 12-18 months ahead for the same window, sometimes further out for December/Easter. If your tour dates fall in peak dry season, start this conversation now, not closer to September. A private safari operator can also arrange a Sabi Sands add-on directly onto your Johannesburg leg, saving you a separate booking process.";

const winelandsHowToBook = "For a Cape Winelands day that goes beyond the standard tasting-room circuit, two estates are worth booking ahead specifically. Haute Cabrière in Franschhoek runs a cellar tour with sabrage (sabering the sparkling wine bottle open) led by the cellar master himself — request this by name when booking, since it's not always the default tour offered. Delaire Graff in Stellenbosch pairs wine tasting with access to the estate's private art collection, a genuinely different experience from a standard tasting room, and their better slots for a small-group or private tasting fill first — book at least a few weeks ahead during September-October rather than assuming a walk-in slot. Both are a step up from the generic multi-estate day tours and worth the extra planning if wine is a real priority on this leg, not just a scenic stop.";

async function upgrade(titleFilter, howToBook) {
  const [existing] = await db.select({ id: experiences.id, title: experiences.title, practicalInfo: experiences.practicalInfo })
    .from(experiences)
    .where(eq(experiences.title, titleFilter));

  if (!existing) {
    console.log("✗ Not found:", titleFilter);
    return;
  }

  const [result] = await db.update(experiences)
    .set({
      practicalInfo: {
        ...existing.practicalInfo,
        howToBook,
      },
    })
    .where(eq(experiences.id, existing.id))
    .returning({ id: experiences.id, title: experiences.title });

  console.log("✓ Upgraded to Concierge:", result.title, "|", result.id);
}

await upgrade("Kruger National Park — 3-Day Big 5 Safari from Johannesburg", krugerHowToBook);
await upgrade("Cape Winelands — Stellenbosch & Franschhoek", winelandsHowToBook);

await client.end();
