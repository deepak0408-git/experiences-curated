import Link from "next/link";
import { redirect } from "next/navigation";
import HomepageNav from "@/app/_components/HomepageNav";
import { getAuthUser } from "@/lib/supabase/server";
import { db } from "@/lib/db";
import { purchases, sportingEvents } from "@/schema/database";
import { and, eq } from "drizzle-orm";
import { getSeatingData } from "../_lib/getSeatingData";
import { hasActiveSeasonPass } from "../../_lib/seasonPassAccess";
import { scoreSeats } from "../_lib/scoreSeats";
import type { QuizAnswers } from "../_lib/types";
import FullResult from "./_components/FullResult";
import RetakeLink from "./_components/RetakeLink";
import TicketIntelligenceSidebar from "../_components/TicketIntelligenceSidebar";

// Ticket Intelligence result page — verifies a real purchases row (product
// type "ticket_intelligence") for the signed-in user + this event before
// showing the full reveal.
//
// Answers come from TWO possible sources, in priority order:
// 1. The URL query string (fresh from the quiz → checkout round trip) —
//    used when present, since it reflects what the fan is looking at right
//    now.
// 2. purchases.ticketIntelligenceAnswers, stored by the webhook at
//    purchase time — the recovery path for a buyer who closes the tab and
//    returns later via their confirmation email (which links here with NO
//    query string). Without this fallback, a one-time-reveal result with
//    no persistence would be permanently lost the moment the tab closes.

const REQUIRED_ANSWER_KEYS: (keyof QuizAnswers)[] = ["q1", "q2", "q3", "q4", "q5", "q7"];

function answersFromQuery(query: Record<string, string | undefined>): QuizAnswers | null {
  if (REQUIRED_ANSWER_KEYS.some((k) => !query[k])) return null;
  return {
    q1: query.q1 as QuizAnswers["q1"],
    q2: query.q2 as QuizAnswers["q2"],
    q3: query.q3 as QuizAnswers["q3"],
    q4: query.q4 as QuizAnswers["q4"],
    q5: query.q5 as QuizAnswers["q5"],
    q7: query.q7 as QuizAnswers["q7"],
  };
}

function answersFromStored(stored: unknown): QuizAnswers | null {
  if (!stored || typeof stored !== "object") return null;
  const obj = stored as Record<string, unknown>;
  if (REQUIRED_ANSWER_KEYS.some((k) => typeof obj[k] !== "string")) return null;
  return obj as unknown as QuizAnswers;
}

export default async function TicketIntelligenceResultPage({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>;
  searchParams: Promise<Record<string, string | undefined>>;
}) {
  const { slug } = await params;
  const query = await searchParams;
  const { user } = await getAuthUser();

  if (!user?.email) {
    const qs = new URLSearchParams(query as Record<string, string>).toString();
    const next = qs ? `/ticket-intelligence/${slug}/result?${qs}` : `/ticket-intelligence/${slug}/result`;
    redirect(`/sign-in?next=${encodeURIComponent(next)}`);
  }

  const [event] = await db
    .select({ id: sportingEvents.id, editionYear: sportingEvents.editionYear })
    .from(sportingEvents)
    .where(eq(sportingEvents.slug, slug))
    .limit(1);
  if (!event) redirect(`/ticket-intelligence/${slug}`);

  const [purchase] = await db
    .select({ id: purchases.id, storedAnswers: purchases.ticketIntelligenceAnswers })
    .from(purchases)
    .where(
      and(
        eq(purchases.email, user.email),
        eq(purchases.sportingEventId, event.id),
        eq(purchases.productType, "ticket_intelligence")
      )
    )
    .limit(1);

  // Season Pass (28 Sep 2026) — grants the same access as `purchase` above
  // but carries no stored answers of its own (retake-per-event is fine
  // since a pass holder isn't paying per event — founder direction, 28 Sep
  // 2026), so it only ever satisfies the query-string answers path below,
  // never the answersFromStored recovery path.
  const hasAccess = !!purchase || (await hasActiveSeasonPass(user.email, event.editionYear));

  const data = await getSeatingData(slug);
  if (!data?.event) redirect(`/ticket-intelligence/${slug}`);

  const answers = answersFromQuery(query) ?? (purchase ? answersFromStored(purchase.storedAnswers) : null);

  return (
    <main className="min-h-screen bg-[#0A0A0A]">
      <HomepageNav email={user.email} />
      {hasAccess && answers ? (
        <div className="max-w-5xl mx-auto px-6 sm:px-8 py-16">
          {/* Eyebrow sits above the grid (not inside FullResult) so the
              sidebar's top edge lines up with the h1 title row, not one row
              below it. Moved here 27 Sep 2026 after the founder flagged the
              sidebar was starting a row too low. */}
          <p className="text-sm font-black tracking-widest uppercase text-[#AAFF00] mb-4">
            Your match
          </p>
          {/* Same grid pattern as SpokeShell.tsx — sidebar reuses the
              4-action model (RetakeLink, budget, calendar, get the guide)
              instead of the single bottom-of-page "Planning to travel?"
              link the page had before. Founder direction, 27 Sep 2026. */}
          <div className="grid lg:grid-cols-[1fr_300px] gap-14 items-start">
            <div className="max-w-2xl">
              <FullResult
                eventName={data.event.name}
                eventSlug={slug}
                result={scoreSeats(data.seats, answers)}
                fallbackExperienceSlug={data.event.fallbackTicketExperienceSlug}
              />
            </div>
            <TicketIntelligenceSidebar eventSlug={slug} />
          </div>
        </div>
      ) : (
        <div className="max-w-2xl mx-auto px-6 sm:px-8 py-16">
        {hasAccess ? (
          <div className="text-center">
            <p className="text-sm font-black tracking-widest uppercase text-[#AAFF00] mb-4">
              Match answers not found
            </p>
            <h1 className="text-2xl font-black text-white mb-4">
              We found your access, but couldn&apos;t recover your quiz answers.
            </h1>
            <p className="text-sm text-[#A3A3A3] mb-8">
              {/* Season Pass holders always land here on first visit (no
                  stored answers of their own — retake-per-event is fine,
                  they're not paying per event). Wording stays generic
                  enough to cover both that case and a pre-answers-tracking
                  per-event purchase. */}
              Answer the quiz again — your match will unlock automatically since you already have access.
            </p>
            {/* Must go through RetakeLink (sets ?retake=<Date.now()>), not a
                plain Link to the bare quiz URL — page.tsx's alreadyPurchased
                redirect sends any request with no retake param straight back
                to /result, which produced an infinite bounce loop here. Bug
                found live 27 Sep 2026. */}
            <div className="flex justify-center">
              <RetakeLink eventSlug={slug} />
            </div>
          </div>
        ) : (
          <div className="text-center">
            <p className="text-sm font-black tracking-widest uppercase text-[#AAFF00] mb-4">
              Purchase not found
            </p>
            <h1 className="text-2xl font-black text-white mb-4">
              We couldn&apos;t verify a Ticket Intelligence purchase for {user.email} on this event.
            </h1>
            <p className="text-sm text-[#A3A3A3] mb-8">
              If you just paid, this can take a few seconds to confirm — refresh this page. Otherwise, head
              back and unlock your match.
            </p>
            <Link
              href={`/ticket-intelligence/${slug}`}
              className="inline-flex items-center justify-center px-6 py-3 rounded-sm bg-[#AAFF00] text-black text-sm font-black hover:bg-[#BBFF33] transition-colors"
            >
              Back to Ticket Intelligence
            </Link>
          </div>
        )}
        </div>
      )}
    </main>
  );
}
