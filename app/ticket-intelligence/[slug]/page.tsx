import type { Metadata } from "next";
import { Suspense } from "react";
import { notFound, redirect } from "next/navigation";
import HomepageNav from "@/app/_components/HomepageNav";
import { getAuthUser } from "@/lib/supabase/server";
import { db } from "@/lib/db";
import { purchases } from "@/schema/database";
import { and, eq } from "drizzle-orm";
import { getSeatingData } from "./_lib/getSeatingData";
import TicketQuiz from "./_components/TicketQuiz";

// Ticket Intelligence — standalone $10 quiz+scoring decision tool ("sell the
// ticket decision, not the trip guide"). Pilot event: Brazilian GP /
// Interlagos. See project_seven_revenue_models_review memory for strategic
// origin. Deliberately a separate surface from the event pack's Tickets
// spoke and from Price Radar (the free cost-index sibling product) — this
// is a paid, scored recommendation, not a static guide or a raw data table.

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const data = await getSeatingData(slug).catch(() => null);
  if (!data?.event) return { title: "Ticket Intelligence" };
  const title = `Which ticket should you buy for the ${data.event.name}?`;
  const description = `Answer 6 questions, get matched to the real grandstand, lawn zone, or hospitality suite that fits you — US$10.`;
  return {
    title,
    description,
    openGraph: {
      title,
      description,
      images: data.event.heroImageUrl ? [{ url: data.event.heroImageUrl }] : [],
    },
  };
}

export default async function TicketIntelligencePage({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ retake?: string }>;
}) {
  const { slug } = await params;
  const { retake } = await searchParams;
  // retake is a Date.now() value (see RetakeLink.tsx) — its presence at
  // all is what matters, not any specific value. A fresh value on every
  // click is what forces TicketQuiz to actually remount below (key=retake).
  const isRetake = !!retake;
  const { user } = await getAuthUser();

  const data = await getSeatingData(slug);
  if (!data?.event) notFound();
  if (data.seats.length === 0) notFound();

  // Fetched once, used two ways below: (1) a signed-in buyer landing here
  // normally (no ?retake=1) skips straight to their existing result rather
  // than seeing the quiz/paywall again; (2) even on an explicit retake,
  // TicketQuiz/TeaserResult need to know a purchase already exists so
  // reaching a NEW teaser after re-answering never asks to pay a second
  // time — bug found live 25 Sep 2026: the retake escape hatch let a buyer
  // re-answer, but the teaser they landed on had no awareness of the
  // existing purchase and showed the paywall again regardless.
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
    alreadyPurchased = !!existing;
  }

  // ?retake=<timestamp> (linked from the result page's "Retake the quiz",
  // see RetakeLink.tsx) is the explicit escape hatch past this redirect —
  // same pattern as /pro/onboarding?retake=true, but with a fresh value
  // per click (not a fixed "1") so every retake is a genuinely distinct
  // navigation — see the key comment on TicketQuiz below for why that
  // matters.
  if (alreadyPurchased && !isRetake) {
    redirect(`/ticket-intelligence/${slug}/result`);
  }

  return (
    <main className="min-h-screen bg-[#0A0A0A]">
      <HomepageNav email={user?.email ?? null} />
      <Suspense>
        {/* key forces a real remount whenever this is reached via a fresh
            "retake" navigation vs. a normal first visit — React can
            otherwise reuse the existing client component instance across
            server re-renders of this same route (same tree position), so
            without this a retake landed back on TicketQuiz but its
            useState(() => ...) initializers (which only run once, at true
            mount) never re-read the fresh empty-answers URL. Bug found
            live 25 Sep 2026: clicking "← Retake the quiz" repeatedly did
            nothing — stuck showing whatever was already in memory. Keying
            only on `retake` (not the full querystring) means answering
            questions within one attempt never triggers a remount and
            loses progress. */}
        <TicketQuiz
          key={retake ?? "initial"}
          slug={slug}
          eventId={data.event.id}
          eventName={data.event.name}
          seats={data.seats}
          signedInEmail={user?.email ?? null}
          alreadyPurchased={alreadyPurchased}
          fallbackExperienceSlug={data.event.fallbackTicketExperienceSlug}
        />
      </Suspense>
    </main>
  );
}
