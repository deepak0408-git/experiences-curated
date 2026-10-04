import { config } from "dotenv";
config({ path: ".env.local" });
import postgres from "postgres";

const sql = postgres(process.env.DATABASE_URL, { prepare: false });

const copy = {
  "london-gb": `London doesn't really have an off-season for sport. Wimbledon takes over Centre Court every summer, and it's still the tournament every player wants to win most, fortnight in, fortnight out, for over a century. A few miles south, the Oval and Lord's host Test cricket at its most historic: India's tourists come through, and the Ashes isn't far behind. The city makes the time between matches easy too. Walk from Centre Court to the West End for dinner. Turn a cricket rest day into an actual day out instead of a dead afternoon in a hotel room. Maybe you've already got a ticket. Maybe you just like that there's always something on. Either way, London has centuries of history sitting on nearly every street you'll walk down to get there.`,
  "melbourne-au": `Melbourne's cricket season gets going in December, when the MCG fills up for touring sides like New Zealand and the Boxing Day Test becomes the center of the city for a week. January hands things over to the Australian Open at Melbourne Park, one of the loudest Grand Slams on the calendar. By April, Albert Park swaps tennis crowds for Formula 1 engines at the Australian Grand Prix. Winter belongs to something else entirely: footy. AFL is a genuine religion here, even if it's not part of what we cover. Between fixtures, the city doesn't leave you stuck: laneway cafes, beaches twenty minutes from the CBD, Yarra Valley wineries an hour out. Not many cities stack this many major events into five months. Fewer still make the gaps between them feel like part of the trip.`,
  "shanghai": `Shanghai runs two very different sporting events. There's the hushed concentration of snooker's Shanghai Masters in a packed arena, and then Formula 1 roars back into town at the Shanghai International Circuit for the Chinese Grand Prix. Both pull serious crowds into a city that doesn't really do anything by halves. The Bund lights up at night. The Maglev gets you in from the airport faster than you'd think possible. And somehow the old French Concession still feels calm despite sitting inside one of the biggest cities on Earth. If you're coming for either event, get here a day or two early. Jet lag recovery and sightseeing end up being the same thing.`,
  "abu-dhabi": `Abu Dhabi closes out the Formula 1 season under lights, on a circuit wrapped around Yas Marina, often with the championship still undecided going into the final laps. Yas Island's theme parks and beach clubs sit minutes from the paddock, and the Sheikh Zayed Grand Mosque and the Corniche show you a different side of the capital entirely. Dubai is close enough to fold into the same trip: a 90-minute drive up the E11, with its own growing sports calendar of golf and cricket at the Dubai International Stadium. Abu Dhabi isn't just a race-weekend city, but it's hard to overstate how much the Grand Prix matters here. The whole capital turns out for it, and once you're there, it's easy to see why.`,
};

for (const [slug, text] of Object.entries(copy)) {
  await sql`UPDATE destinations SET editorial_overview = ${text}, updated_at = now() WHERE slug = ${slug}`;
  console.log(`Updated ${slug} (${text.split(/\s+/).length} words)`);
}

await sql.end();
