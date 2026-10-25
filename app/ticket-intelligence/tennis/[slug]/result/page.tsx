import Link from "next/link";
import { redirect } from "next/navigation";
import HomepageNav from "@/app/_components/HomepageNav";
import { getAuthUser } from "@/lib/supabase/server";
import { db } from "@/lib/db";
import { purchases } from "@/schema/database";
import { and, eq } from "drizzle-orm";
import { getTennisOptionsData } from "../_lib/getTennisOptionsData";
import { hasFullPlannerCostData } from "../../../[slug]/_lib/getSeatingData";
import { hasActiveSeasonPass, hasActiveAnnualProForEvent } from "../../../_lib/seasonPassAccess";
import { scoreTennisOptions, assertTennisEventSlug } from "../_lib/scoreTennisOptions";
import type { QuizAnswers } from "../_lib/types";
import FullResult from "./_components/FullResult";
import RetakeLink from "./_components/RetakeLink";
import TennisTicketIntelligenceSidebar from "../_components/TennisTicketIntelligenceSidebar";
import { resolveCockpitBackLink } from "@/lib/cockpitBackLink";

// Tennis equivalent of app/ticket-intelligence/[slug]/result/page.tsx —
// verifies a real purchases row (product type "ticket_intelligence") OR an
// active Tennis Season Pass OR Annual Pro for the signed-in user before
// showing the full, un-blurred reveal. Added 20 Oct 2026 alongside the
// commercial wiring; this route did not exist during the free pilot phase
// (TennisTicketQuiz.tsx previously rendered the full result inline, with
// no purchase gate at all).
//
// Answers come from TWO possible sources, in priority order, same pattern
// as F1's result page:
// 1. The URL query string (fresh from the quiz → checkout round trip).
// 2. purchases.ticketIntelligenceAnswers, stored by the webhook at
//    purchase time — the recovery path for a buyer who closes the tab and
//    returns later via their confirmation email (no query string).

const REQUIRED_ANSWER_KEYS: (keyof QuizAnswers)[] = ["q1", "q2", "q3", "q4", "q5", "q6", "q7"];

function answersFromQuery(query: Record<string, string | undefined>): QuizAnswers | null {
  if (REQUIRED_ANSWER_KEYS.some((k) => !query[k])) return null;
  return {
    q1: query.q1 as QuizAnswers["q1"],
    q2: query.q2 as QuizAnswers["q2"],
    q3: query.q3 as QuizAnswers["q3"],
    q4: query.q4 as QuizAnswers["q4"],
    q5: query.q5 as QuizAnswers["q5"],
    q6: query.q6 as QuizAnswers["q6"],
    q7: query.q7 as QuizAnswers["q7"],
    fromDate: query.fromDate ?? null,
    toDate: query.toDate ?? null,
  };
}

function answersFromStored(stored: unknown): QuizAnswers | null {
  if (!stored || typeof stored !== "object") return null;
  const obj = stored as Record<string, unknown>;
  if (REQUIRED_ANSWER_KEYS.some((k) => typeof obj[k] !== "string")) return null;
  return obj as unknown as QuizAnswers;
}

export default async function TennisTicketIntelligenceResultPage({
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
    const next = qs
      ? `/ticket-intelligence/tennis/${slug}/result?${qs}`
      : `/ticket-intelligence/tennis/${slug}/result`;
    redirect(`/sign-in?next=${encodeURIComponent(next)}`);
  }

  const data = await getTennisOptionsData(slug);
  if (!data?.event) redirect(`/ticket-intelligence/tennis/${slug}`);
  if (!data.isPubliclyAvailable) redirect(`/ticket-intelligence/tennis/${slug}`);

  const { event } = data;

  const isBuilt = (event.packStatus === "live" || event.packStatus === "built_hidden") && !event.isHidden;
  const showBudgetLink = await hasFullPlannerCostData(event.id, event.destinationId, event.editionYear);

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

  // Season Pass — grants the same access as `purchase` above but carries
  // no stored answers of its own, so it only ever satisfies the
  // query-string answers path below, never the answersFromStored recovery
  // path. Annual Pro — same treatment.
  const hasAccess =
    !!purchase ||
    (await hasActiveSeasonPass(user.email, event.editionYear, "tennis")) ||
    (await hasActiveAnnualProForEvent(user.email, event.startDate));

  const answers = answersFromQuery(query) ?? (purchase ? answersFromStored(purchase.storedAnswers) : null);
  // ?from=cockpit / ?from=tennis-cockpit survives the checkout round trip
  // via TennisTicketQuiz.tsx's successUrl — this page just didn't read it
  // until now, so a purchase begun from the Tennis Cockpit landed on
  // /result with no way back. Fixed 21 Oct 2026.
  const cockpitBackLink = resolveCockpitBackLink(query.from);

  return (
    <main className="min-h-screen bg-[#0A0A0A]">
      <HomepageNav email={user.email} />
      {hasAccess && answers ? (
        <div className="max-w-5xl mx-auto px-6 sm:px-8 py-16">
          <div className="flex items-center justify-between mb-4">
            <p className="text-sm font-black tracking-widest uppercase text-[#AAFF00]">Your match</p>
            {cockpitBackLink && (
              <Link
                href={cockpitBackLink.href}
                className="flex-shrink-0 text-xs text-[#AAFF00] hover:text-[#BBFF33] font-semibold underline underline-offset-2 transition-colors"
              >
                {cockpitBackLink.label}
              </Link>
            )}
          </div>
          <div className="grid lg:grid-cols-[1fr_300px] gap-14 items-start">
            <div className="max-w-2xl">
              <FullResult
                eventName={event.name}
                eventSlug={slug}
                result={scoreTennisOptions(data.options, answers, assertTennisEventSlug(slug))}
                answers={answers}
              />
            </div>
            <TennisTicketIntelligenceSidebar
              eventSlug={slug}
              eventId={event.id}
              sport={event.sport}
              isBuilt={isBuilt}
              userEmail={user.email}
              showBudgetLink={showBudgetLink}
            />
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
                Answer the quiz again — your match will unlock automatically since you already have access.
              </p>
              {/* Must go through RetakeLink (sets ?retake=<Date.now()>), not a
                  plain Link to the bare quiz URL — page.tsx's alreadyPurchased
                  redirect sends any request with no retake param straight back
                  to /result, which would produce an infinite bounce loop here. */}
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
                href={`/ticket-intelligence/tennis/${slug}`}
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
