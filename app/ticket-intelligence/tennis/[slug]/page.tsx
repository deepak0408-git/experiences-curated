import type { Metadata } from "next";
import { Suspense } from "react";
import { notFound, redirect } from "next/navigation";
import HomepageNav from "@/app/_components/HomepageNav";
import { getAuthUser } from "@/lib/supabase/server";
import { db } from "@/lib/db";
import { purchases } from "@/schema/database";
import { and, eq } from "drizzle-orm";
import { hasFullPlannerCostData } from "../../[slug]/_lib/getSeatingData";
import { hasActiveSeasonPass, hasActiveAnnualProForEvent } from "../../_lib/seasonPassAccess";
import { getTennisOptionsData } from "./_lib/getTennisOptionsData";
import TennisTicketQuiz from "./_components/TennisTicketQuiz";

// Tennis Ticket Intelligence — self-contained from F1 Ticket Intelligence
// (app/ticket-intelligence/[slug]). Pilot: Australian Open 2027. Public
// availability is gated by the edition-activation + editorial-ratification
// flags on tennis_ticket_intelligence_edition_status, checked fail-closed
// below.
//
// Commercial wiring added 20 Oct 2026 — same purchase/Season Pass/Annual
// Pro gate as F1's page.tsx, now that Stage 2 Authorization's "no commerce
// functionality" scope has been superseded by the founder's explicit
// instruction to build it.

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const data = await getTennisOptionsData(slug).catch(() => null);
  if (!data?.event) return { title: "Ticket Intelligence" };
  return {
    title: `Which ${data.event.name} Ticket Fits You?`,
    description: "Answer 7 quick questions, get matched to the arena, stage, and seating that fits your Grand Slam experience — US$10.",
  };
}

export default async function TennisTicketIntelligencePage({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ from?: string; retake?: string }>;
}) {
  const { slug } = await params;
  const { retake } = await searchParams;
  // retake is a Date.now() value (see RetakeLink.tsx) — its presence at all
  // is what matters, not any specific value. A fresh value on every click
  // is what forces TennisTicketQuiz to actually remount below (key=retake).
  const isRetake = !!retake;
  const { user } = await getAuthUser();

  const data = await getTennisOptionsData(slug);
  if (!data?.event) notFound();
  if (data.options.length === 0) notFound();

  // Same isBuilt formula as F1's Ticket Intelligence result page / the
  // Season Planner's ShortlistResults.tsx.
  const isBuilt = (data.event.packStatus === "live" || data.event.packStatus === "built_hidden") && !data.event.isHidden;
  const showBudgetLink = await hasFullPlannerCostData(data.event.id, data.event.destinationId, data.event.editionYear);

  // Fail-closed: edition mismatch, not-yet-activated, or not-yet-ratified
  // all show the same safe "not available yet" state — never stale or
  // unapproved content, even if the underlying data is fully seeded.
  if (!data.isPubliclyAvailable) {
    return (
      <main className="min-h-screen bg-[#0A0A0A]">
        <HomepageNav email={user?.email ?? null} />
        <div className="max-w-2xl mx-auto px-6 sm:px-8 py-24 text-center">
          <p className="text-sm font-black tracking-widest uppercase text-[#AAFF00] mb-4">
            Ticket Intelligence
          </p>
          <h1 className="text-2xl font-black text-white mb-4">Not available yet</h1>
          <p className="text-sm text-[#A3A3A3]">
            This tool isn&apos;t published for {data.event.name} yet — check back soon.
          </p>
        </div>
      </main>
    );
  }

  // Fetched once, used two ways below: (1) a signed-in buyer landing here
  // normally (no ?retake=1) skips straight to their existing result rather
  // than seeing the quiz/paywall again; (2) even on an explicit retake,
  // TennisTicketQuiz/TeaserResult need to know a purchase already exists
  // so a new teaser after re-answering never asks to pay a second time.
  // Same pattern as F1's page.tsx.
  let hasPerEventPurchase = false;
  let alreadyPurchased = false;
  if (user?.email) {
    const [existing] = await db
      .select({ id: purchases.id })
      .from(purchases)
      .where(
        and(
          eq(purchases.email, user.email),
          eq(purchases.sportingEventId, data.event.id),
          eq(purchases.productType, "ticket_intelligence")
        )
      )
      .limit(1);
    hasPerEventPurchase = !!existing;
    alreadyPurchased =
      hasPerEventPurchase ||
      (await hasActiveSeasonPass(user.email, data.event.editionYear, "tennis")) ||
      (await hasActiveAnnualProForEvent(user.email, data.event.startDate));
  }

  // ?retake=<timestamp> (linked from the result page's "Retake the quiz")
  // is the explicit escape hatch past this redirect. Redirect straight to
  // /result ONLY for a real per-event purchases row — that's the one case
  // with actual stored answers to recover. A season-pass-only holder has
  // never answered this event's quiz, so sending them to /result blind
  // would land on the "match answers not found" recovery screen on every
  // first visit. They stay on the quiz page instead (alreadyPurchased is
  // still true, so no paywall shows once they answer).
  if (hasPerEventPurchase && !isRetake) {
    redirect(`/ticket-intelligence/tennis/${slug}/result`);
  }

  return (
    <main className="min-h-screen bg-[#0A0A0A]">
      <HomepageNav email={user?.email ?? null} hideSecondaryLink hideMyTravels />
      <Suspense>
        {/* key forces a real remount whenever this is reached via a fresh
            "retake" navigation vs. a normal first visit — same reasoning
            as F1's page.tsx. */}
        <TennisTicketQuiz
          key={retake ?? "initial"}
          slug={slug}
          eventName={data.event.name}
          options={data.options}
          eventId={data.event.id}
          sport={data.event.sport}
          isBuilt={isBuilt}
          showBudgetLink={showBudgetLink}
          userEmail={user?.email ?? null}
          alreadyPurchased={alreadyPurchased}
        />
      </Suspense>
    </main>
  );
}
