"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import type { QuizAnswers, ScoreResult } from "../_lib/types";
import { seatingPresentation, sessionExplanation, wimbledonDaySessionExplanation } from "../_lib/presentationMappings";
import DodoCheckout from "@/app/event-pack/[slug]/_components/DodoCheckout";
import LocalCurrencyHint from "@/app/event-pack/[slug]/_components/LocalCurrencyHint";
import TennisTicketIntelligenceSidebar from "./TennisTicketIntelligenceSidebar";
import TennisSeasonPassCheckout from "./TennisSeasonPassCheckout";
import FullResult from "../result/_components/FullResult";
import { updateTicketIntelligenceAnswers } from "../actions";

// Commercial wiring — 20 Oct 2026. Mirrors F1's TeaserResult.tsx structure
// exactly (blurred partial reveal, sign-in-gated unlock, Season Pass
// upsell), with tennis-specific product IDs and teaser copy approved
// separately with the founder (teaser wording nailed down before this was
// built, not improvised here).
//
// Real Dodo products, confirmed 20 Oct 2026. NO TEST_MODE product exists
// yet for either — founder direction: live IDs only for now. Local
// test-mode checkout testing for tennis will NOT work until test products
// are created and swapped in here (same gap flagged in the webhook).
const LIVE_PRODUCT_ID = "pdt_0Nq89y91QscnR5CYcV64o";
const TICKET_INTELLIGENCE_PRODUCT_ID = LIVE_PRODUCT_ID;

export default function TeaserResult({
  eventName,
  eventId,
  eventSlug,
  eventSport,
  eventIsBuilt,
  showBudgetLink,
  result,
  successUrl,
  signedInEmail,
  answers,
  onEditAnswers,
  alreadyPurchased,
  backLink,
}: {
  eventName: string;
  eventId: string;
  eventSlug: string;
  eventSport: string;
  eventIsBuilt: boolean;
  showBudgetLink: boolean;
  result: ScoreResult;
  successUrl: string;
  signedInEmail: string | null;
  answers: QuizAnswers;
  onEditAnswers: () => void;
  alreadyPurchased: boolean;
  backLink: { href: string; label: string } | null;
}) {
  const { hero } = result;
  const seating = seatingPresentation(hero.option);
  // P1 fix, 25 Oct 2026: same arenaCode==="GP" fix as ResultCard.tsx — see
  // that file's comment. sessionCode===null alone doesn't mean Ground
  // Pass; Wimbledon's 22 reserved-court options are also null there.
  const session = hero.option.arenaCode === "GP" ? null : sessionExplanation(hero.option.sessionCode) ?? wimbledonDaySessionExplanation();

  // A buyer who already paid (e.g. via "Retake the quiz") never sees the
  // paywall for a second teaser — fresh answers just render the same real,
  // unblurred result immediately. Same pattern as F1's TeaserResult.tsx.
  //
  // Also persists these fresh answers to purchases.ticketIntelligenceAnswers
  // (fire-once via the ref guard) so the email-recovery path — the
  // confirmation email links to /result with no query string, falling back
  // to stored answers — always shows the LATEST retake.
  const persistedRef = useRef(false);
  useEffect(() => {
    if (alreadyPurchased && !persistedRef.current) {
      persistedRef.current = true;
      updateTicketIntelligenceAnswers(eventId, answers).catch((err) =>
        console.error("[tennis ticket-intelligence] failed to persist retake answers:", err)
      );
    }
  }, [alreadyPurchased, eventId, answers]);

  if (alreadyPurchased) {
    return (
      <div className="max-w-5xl mx-auto px-6 sm:px-8 py-16">
        <div className="flex items-center justify-between mb-4">
          <p className="text-sm font-black tracking-widest uppercase text-[#AAFF00]">Your Match</p>
          {backLink && (
            <Link
              href={backLink.href}
              className="text-xs text-[#AAFF00] hover:text-[#BBFF33] font-semibold underline underline-offset-2 transition-colors"
            >
              {backLink.label}
            </Link>
          )}
        </div>
        <div className="grid lg:grid-cols-[1fr_300px] gap-14 items-start">
          <div className="max-w-2xl">
            <FullResult eventName={eventName} eventSlug={eventSlug} result={result} answers={answers} />
          </div>
          <TennisTicketIntelligenceSidebar
            eventSlug={eventSlug}
            eventId={eventId}
            sport={eventSport}
            isBuilt={eventIsBuilt}
            userEmail={signedInEmail}
            showBudgetLink={showBudgetLink}
          />
        </div>
      </div>
    );
  }

  // Sign-in is required only at this last step — the quiz itself stays
  // fully anonymous, same as F1. TennisTicketQuiz keeps the current URL
  // (answers + revealed=1) in sync via history.replaceState, so
  // /sign-in?next=<that URL> round-trips back to this exact teaser after
  // the magic link.
  const searchParams = useSearchParams();
  const nextUrl = `/ticket-intelligence/tennis/${eventSlug}?${searchParams.toString()}`;

  return (
    <div className="max-w-2xl mx-auto px-6 sm:px-8 py-16">
      <div className="flex items-center justify-between mb-4">
        <p className="text-sm font-black tracking-widest uppercase text-[#AAFF00]">Your match is ready</p>
        {backLink && (
          <Link
            href={backLink.href}
            className="text-xs text-[#AAFF00] hover:text-[#BBFF33] font-semibold underline underline-offset-2 transition-colors"
          >
            {backLink.label}
          </Link>
        )}
      </div>
      <h1 className="text-3xl sm:text-4xl font-black text-white mb-3">
        Based on your answers, your best fit at {eventName} is...
      </h1>
      <button
        type="button"
        onClick={onEditAnswers}
        className="text-xs font-semibold text-[#6A6A6A] hover:text-[#AAFF00] underline mb-6 transition-colors"
      >
        ← Edit my answers
      </button>

      <div className="rounded-sm border border-[#2A2A2A] bg-[#141414] p-8 mb-8 relative overflow-hidden">
        <p className="text-xs font-semibold tracking-widest uppercase text-[#AAFF00] mb-2">Your seating</p>
        <p className="text-2xl font-black text-white mb-1">{seating.value}</p>
        {/* Ground Pass has no session — no second line at all for it, per
            founder direction 20 Oct 2026 (never show "Flexible timing" or
            any other placeholder time-of-day copy for Ground Pass). */}
        {session && (
          <p className="text-sm text-[#A3A3A3] mb-6">A {session.value.toLowerCase()} at this Grand Slam.</p>
        )}

        {/* Blurred teaser of the specific arena + "why" — real value stays
            behind the paywall. Mirrors F1's blur pattern exactly. */}
        <div className={session ? "mt-4 pt-4 border-t border-[#2A2A2A]" : "mt-0"}>
          <p className="text-xs font-semibold tracking-widest uppercase text-[#6A6A6A] mb-2">
            The exact arena, when to go, and why it fits you — and how to buy it
          </p>
          <div className="select-none pointer-events-none">
            <p className="text-lg font-black text-white/20 blur-sm">███████ ███████</p>
            <p className="text-sm text-[#A3A3A3]/30 blur-sm mt-1">
              ███████ rounds, ███████ — the reason this fits what you told us about ███.
            </p>
          </div>
        </div>
      </div>

      {signedInEmail ? (
        <>
          <p className="text-2xl font-black text-white mb-4">
            US$10
            <LocalCurrencyHint baseAmount={10} baseCurrency="USD" />
          </p>
          <DodoCheckout
            productId={TICKET_INTELLIGENCE_PRODUCT_ID}
            sportingEventId={eventId}
            eventSlug={eventSlug}
            eventName={eventName}
            priceTier="standard"
            successUrl={successUrl}
            productType="ticket_intelligence"
            label="Unlock your full match"
            buttonClassName="w-full inline-flex items-center justify-center px-6 py-4 rounded-sm bg-[#AAFF00] text-black text-sm font-black hover:bg-[#BBFF33] transition-colors disabled:opacity-60"
            ticketIntelligenceAnswers={JSON.stringify(answers)}
          />
          <p className="text-xs text-[#6A6A6A] mt-3 text-center">
            One-time purchase, sent to {signedInEmail}. See the exact arena, when to go, and how to buy your ticket.
          </p>

          <div className="mt-4 pt-4 border-t border-[#2A2A2A] flex items-center justify-between gap-3">
            <p className="text-sm text-[#A3A3A3]">
              Or get this + full 2026/27 Ticket Intelligence with{" "}
              <span className="text-white font-bold">Tennis Season Pass — US$15</span>
            </p>
            <TennisSeasonPassCheckout
              label="Get Season Pass"
              buttonClassName="flex-shrink-0 inline-flex items-center px-4 py-2 rounded-sm border border-[#AAFF00]/50 text-[#AAFF00] text-xs font-black hover:bg-[#AAFF00]/10 transition-colors disabled:opacity-60"
            />
          </div>
        </>
      ) : (
        <>
          <p className="text-2xl font-black text-white mb-4">
            US$10
            <LocalCurrencyHint baseAmount={10} baseCurrency="USD" />
          </p>
          <Link
            href={`/sign-in?next=${encodeURIComponent(nextUrl)}`}
            className="w-full inline-flex items-center justify-center px-6 py-4 rounded-sm bg-[#AAFF00] text-black text-sm font-black hover:bg-[#BBFF33] transition-colors"
          >
            Sign in to unlock
          </Link>
          <p className="text-xs text-[#6A6A6A] mt-3 text-center">
            We&apos;ll email you a magic link, then take you straight back here to complete your purchase.
          </p>

          <div className="mt-4 pt-4 border-t border-[#2A2A2A] flex items-center justify-between gap-3">
            <p className="text-sm text-[#A3A3A3]">
              Or get this + full 2026/27 Ticket Intelligence with{" "}
              <span className="text-white font-bold">Tennis Season Pass — US$15</span>
            </p>
            <Link
              href={`/sign-in?next=${encodeURIComponent(nextUrl)}`}
              className="flex-shrink-0 inline-flex items-center px-4 py-2 rounded-sm border border-[#AAFF00]/50 text-[#AAFF00] text-xs font-black hover:bg-[#AAFF00]/10 transition-colors"
            >
              Get Season Pass
            </Link>
          </div>
        </>
      )}
    </div>
  );
}
