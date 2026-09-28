"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import type { QuizAnswers, ScoreResult } from "../_lib/types";
import DodoCheckout from "@/app/event-pack/[slug]/_components/DodoCheckout";
import FullResult from "../result/_components/FullResult";
import TicketIntelligenceSidebar from "./TicketIntelligenceSidebar";
import SeasonPassCheckout from "../../_components/SeasonPassCheckout";
import LocalCurrencyHint from "@/app/event-pack/[slug]/_components/LocalCurrencyHint";
import { updateTicketIntelligenceAnswers } from "../actions";

// Real Dodo product for Ticket Intelligence — confirmed by founder 25 Sep
// 2026, repriced US$7 → US$10 same day (same product ID, repriced in the
// Dodo dashboard — not a new product). Not tied to a specific price tier
// concept (unlike the pack's early_bird/standard split), so priceTier is
// passed as "standard" purely to satisfy DodoCheckout's existing prop shape.
//
// TEST MODE product ID swapped in 25 Sep 2026 for local checkout-flow
// testing (matches .env.local's NEXT_PUBLIC_DODO_MODE=test_mode switch) —
// this is a DIFFERENT product ID than the live one above, since Dodo test
// and live products are entirely separate catalogs. Must be swapped back
// to the live ID before any real/live testing or deploy.
const LIVE_PRODUCT_ID = "pdt_0NoNj4aVOxg3nOWxDEswa";
const TEST_PRODUCT_ID = "pdt_0NoNoIdiSNtJbUluYBEYS";
const TICKET_INTELLIGENCE_PRODUCT_ID =
  process.env.NEXT_PUBLIC_DODO_MODE === "test_mode" ? TEST_PRODUCT_ID : LIVE_PRODUCT_ID;

const TIER_LABEL: Record<string, string> = {
  tier1: "budget-friendly",
  tier2: "mid-range",
  tier3: "premium",
  tier4: "top-tier hospitality",
};

const SEAT_TYPE_LABEL: Record<string, string> = {
  grandstand: "a grandstand",
  festival_lawn: "a festival / lawn zone",
  hospitality: "a hospitality suite",
};

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
  fallbackExperienceSlug,
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
  fallbackExperienceSlug: string | null;
}) {
  const { top } = result;
  const seatTypeLabel = SEAT_TYPE_LABEL[top.seat.seatType] ?? top.seat.seatType;
  const tierLabel = top.seat.tier ? TIER_LABEL[top.seat.tier] : null;

  // A buyer who already paid (e.g. via "Retake the quiz") never sees the
  // paywall for a second teaser — fresh answers just render the same full,
  // unblurred result immediately. Bug found live 25 Sep 2026: without this,
  // re-answering after a retake asked for a second $10 payment despite an
  // existing purchases row for this event.
  //
  // Also persists these fresh answers to purchases.ticketIntelligenceAnswers
  // (fire-once via the ref guard) so the email-recovery path — the
  // confirmation email links to /result with no query string, falling back
  // to stored answers — always shows the LATEST retake, not the answers
  // from whenever the original purchase happened.
  const persistedRef = useRef(false);
  useEffect(() => {
    if (alreadyPurchased && !persistedRef.current) {
      persistedRef.current = true;
      updateTicketIntelligenceAnswers(eventId, answers).catch((err) =>
        console.error("[ticket-intelligence] failed to persist retake answers:", err)
      );
    }
  }, [alreadyPurchased, eventId, answers]);

  if (alreadyPurchased) {
    // Same grid pattern as result/page.tsx and the quiz question view —
    // this teaser reveal (reached via "Retake the quiz" for an already-paid
    // fan) is a third place FullResult renders, and was missed when the
    // sidebar was added to the other two. Bug found live 27 Sep 2026.
    return (
      <div className="max-w-5xl mx-auto px-6 sm:px-8 py-16">
        <p className="text-sm font-black tracking-widest uppercase text-[#AAFF00] mb-4">
          Your match
        </p>
        <div className="grid lg:grid-cols-[1fr_300px] gap-14 items-start">
          <div className="max-w-2xl">
            <FullResult
              eventName={eventName}
              eventSlug={eventSlug}
              result={result}
              fallbackExperienceSlug={fallbackExperienceSlug}
            />
          </div>
          <TicketIntelligenceSidebar
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

  // Sign-in is required only at this last step (per 25 Sep 2026 decision —
  // the quiz itself stays fully anonymous). The Dodo purchase is verified
  // server-side against getAuthUser() on the result page, same pattern as
  // every other purchase flow — so an email is needed before checkout can
  // open. TicketQuiz keeps the current URL (answers + revealed=1) in sync
  // via history.replaceState, so /sign-in?next=<that URL> round-trips back
  // to this exact teaser after the magic link.
  const searchParams = useSearchParams();
  const nextUrl = `/ticket-intelligence/${eventSlug}?${searchParams.toString()}`;

  return (
    <div className="max-w-2xl mx-auto px-6 sm:px-8 py-16">
      <p className="text-sm font-black tracking-widest uppercase text-[#AAFF00] mb-4">
        Your match is ready
      </p>
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
        <p className="text-xs font-semibold tracking-widest uppercase text-[#AAFF00] mb-2">
          Seat type
        </p>
        <p className="text-2xl font-black text-white mb-1">{seatTypeLabel}</p>
        {tierLabel && (
          <p className="text-sm text-[#A3A3A3] mb-6">A {tierLabel} option at this circuit.</p>
        )}

        {/* Blurred teaser of the specific seat name + "why" — real value
            stays behind the paywall. Per founder decision 25 Sep 2026:
            partial teaser, not a pure blind paywall. */}
        <div className="mt-4 pt-4 border-t border-[#2A2A2A]">
          <p className="text-xs font-semibold tracking-widest uppercase text-[#6A6A6A] mb-2">
            The exact stand, why it fits you, and how to buy it
          </p>
          <div className="select-none pointer-events-none">
            <p className="text-lg font-black text-white/20 blur-sm">Grandstand ███</p>
            <p className="text-sm text-[#A3A3A3]/30 blur-sm mt-1">
              Sees ███████ and ███████ — the reason this fits what you told us about ███.
            </p>
          </div>
        </div>
      </div>

      {signedInEmail ? (
        <>
          {/* Price + local currency hint on its own row, full-width
              centered CTA below — same stacked shape as the Season Pass
              box on /ticket-intelligence, applied here too. Founder
              direction 28 Sep 2026 (swapped from the earlier price-left/
              CTA-right row layout). */}
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
            One-time purchase, sent to {signedInEmail}. See the exact seat, why it fits, and how to buy your ticket.
          </p>

          {/* Season Pass upsell (28 Sep 2026) — secondary CTA under the
              primary unlock button, same primary/secondary pattern as
              SpokeShell.tsx's mini-pack → full-pack nudge ("Buy Ticket
              Guide" + "Or get every guide in the Event Pack — Get the
              Guide"), not a same-weight second green button. */}
          <div className="mt-4 pt-4 border-t border-[#2A2A2A] flex items-center justify-between gap-3">
            <p className="text-sm text-[#A3A3A3]">
              Or get this + full 2026/27 Ticket Intelligence with{" "}
              <span className="text-white font-bold">F1 Season Access — US$25</span>
            </p>
            <SeasonPassCheckout
              label="Get Season Access"
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

          {/* Season Pass upsell, signed-out version (28 Sep 2026) — same
              secondary row as the signed-in branch, but its button routes
              to sign-in first (same nextUrl as the primary button above),
              rather than opening Season Pass checkout anonymously — no
              purchase path on this product currently skips sign-in, so
              this one doesn't either. Without this row at all, a signed-out
              fan facing US$10 per event saw no cheaper alternative and had
              no reason not to bounce — founder-flagged conversion risk,
              28 Sep 2026. */}
          <div className="mt-4 pt-4 border-t border-[#2A2A2A] flex items-center justify-between gap-3">
            <p className="text-sm text-[#A3A3A3]">
              Or get this + full 2026/27 Ticket Intelligence with{" "}
              <span className="text-white font-bold">F1 Season Access — US$25</span>
            </p>
            <Link
              href={`/sign-in?next=${encodeURIComponent(nextUrl)}`}
              className="flex-shrink-0 inline-flex items-center px-4 py-2 rounded-sm border border-[#AAFF00]/50 text-[#AAFF00] text-xs font-black hover:bg-[#AAFF00]/10 transition-colors"
            >
              Get Season Access
            </Link>
          </div>
        </>
      )}
    </div>
  );
}
