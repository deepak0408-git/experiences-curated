import { db } from "@/lib/db";
import { sportingEvents } from "@/schema/database";
import { eq } from "drizzle-orm";
import { getTradeoffOptions } from "../_lib/getTradeoffOptions";

// Temporary debug page — exercises the real getTradeoffOptions() function
// against real DB data, for manual verification during the Tradeoff Engine
// build. Not linked from anywhere in the site nav. Remove once the real
// Tradeoff Engine UI (step 3) ships and this is no longer needed.
export default async function DebugTradeoffPage({
  searchParams,
}: {
  searchParams: Promise<{ event?: string; tripLengthDays?: string }>;
}) {
  const { event: slug, tripLengthDays } = await searchParams;

  if (!slug) {
    const events = await db
      .select({ slug: sportingEvents.slug, name: sportingEvents.name })
      .from(sportingEvents);
    return (
      <main className="min-h-screen bg-[#0A0A0A] text-white p-8 font-mono text-sm">
        <p className="text-[#AAFF00] mb-4">DEBUG: Tradeoff Options</p>
        <p className="mb-4">No ?event= param given. Pick a slug below:</p>
        <ul className="space-y-1">
          {events.map((e) => (
            <li key={e.slug}>
              <a
                className="text-[#AAFF00] underline"
                href={`/planner/debug-tradeoff?event=${e.slug}&tripLengthDays=4`}
              >
                {e.slug}
              </a>{" "}
              — {e.name}
            </li>
          ))}
        </ul>
      </main>
    );
  }

  const [event] = await db
    .select({ id: sportingEvents.id, name: sportingEvents.name })
    .from(sportingEvents)
    .where(eq(sportingEvents.slug, slug));

  if (!event) {
    return (
      <main className="min-h-screen bg-[#0A0A0A] text-white p-8 font-mono text-sm">
        No event found for slug "{slug}"
      </main>
    );
  }

  const days = Number(tripLengthDays ?? 4);
  const options = await getTradeoffOptions(event.id, days);

  return (
    <main className="min-h-screen bg-[#0A0A0A] text-white p-8 font-mono text-sm">
      <p className="text-[#AAFF00] mb-2">DEBUG: Tradeoff Options</p>
      <p className="mb-6 text-[#6A6A6A]">
        {event.name} (slug: {slug}) · tripLengthDays: {days}
      </p>
      <pre className="whitespace-pre-wrap bg-[#141414] p-4 rounded-sm border border-[#2A2A2A]">
        {JSON.stringify(options, null, 2)}
      </pre>
      <p className="mt-6 text-xs text-[#6A6A6A]">
        Try other trip lengths: <a className="underline text-[#AAFF00]" href={`?event=${slug}&tripLengthDays=1`}>1 day</a>{" "}
        · <a className="underline text-[#AAFF00]" href={`?event=${slug}&tripLengthDays=7`}>7 days</a>{" "}
        · <a className="underline text-[#AAFF00]" href="/planner/debug-tradeoff">back to event list</a>
      </p>
    </main>
  );
}
