import type { QuizAnswers, ScoreResult } from "../../_lib/types";
import { selectHeroExplanation, selectAlternativeExplanation } from "../../_lib/selectExplanation";
import { heroRationale, alternativeRationale } from "../../_lib/recommendationRationale";
import { selectFrenchOpenExplanations } from "../../_lib/frenchOpenExplanation";
import ResultCard from "../../_components/ResultCard";
import ArenaMapsSection from "../../_components/ArenaMapsSection";
import RetakeLink from "./RetakeLink";

// French Open 2027 uses its own event-scoped, approved-lookup explanation
// source (frenchOpenExplanation.ts) instead of Australian Open's
// construction-based recommendationRationale.ts — see frenchOpenExplanation.ts's
// own header comment for why. Slug-keyed rather than a generic "every new
// tennis event gets this" branch, since the approved lookup catalogue is
// specific to French Open's own approved editorial content — a future
// Wimbledon/US Open onboarding would need its own equivalent catalogue and
// its own slug entry here, never silently reusing French Open's.
const FRENCH_OPEN_EXPLANATION_SLUGS = new Set(["french-open"]);

// Tennis equivalent of app/ticket-intelligence/[slug]/result/_components/FullResult.tsx
// — the real, unblurred result, shown only after access is verified. Built
// from the content that previously lived inline in TennisTicketQuiz.tsx's
// revealed branch, moved here once the paywall/result split was added (20
// Oct 2026) so the un-blurred content only ever renders where access has
// actually been server-verified (this route), never client-side before
// payment.
export default function FullResult({
  eventName,
  eventSlug,
  result,
  answers,
}: {
  eventName: string;
  eventSlug: string;
  result: ScoreResult;
  answers: QuizAnswers;
}) {
  const isFrenchOpen = FRENCH_OPEN_EXPLANATION_SLUGS.has(eventSlug);

  // selectHeroExplanation/selectAlternativeExplanation (the catalogue-based
  // S01-S14 selector) are still computed here for Australian Open — kept
  // for regression compatibility and auditability, per founder direction
  // 20 Oct 2026 — but their .text is no longer what's shown in the UI. AO's
  // displayed rationale comes from recommendationRationale.ts instead,
  // completely unchanged by this branch. French Open has no equivalent
  // audit-only catalogue call here — selectExplanation.ts's
  // reconstructedLanguageCatalogue.json is Australian Open's own catalogue
  // (option IDs 001-043) and has no French Open entries; calling it with
  // French Open's IDs 1-87 would either collide with AO's or throw, so it
  // is deliberately never called for French Open.
  let heroExplanation, alt1Explanation, alt2Explanation;
  if (isFrenchOpen) {
    const fo = selectFrenchOpenExplanations(answers, result.hero, result.alternative1, result.alternative2);
    heroExplanation = fo.hero;
    alt1Explanation = fo.alternative1;
    alt2Explanation = fo.alternative2;
  } else {
    selectHeroExplanation(result.hero);
    if (result.alternative1) selectAlternativeExplanation(result.alternative1, result.hero);
    if (result.alternative2) selectAlternativeExplanation(result.alternative2, result.hero);

    heroExplanation = heroRationale(answers, result.hero);
    alt1Explanation = result.alternative1 ? alternativeRationale(result.hero, result.alternative1) : null;
    alt2Explanation = result.alternative2 ? alternativeRationale(result.hero, result.alternative2) : null;
  }

  return (
    <div>
      <h1 className="text-3xl sm:text-4xl font-black text-white mb-3">Your {eventName} match</h1>
      {/* RetakeLink generates a fresh ?retake=<timestamp> value on every
          click — the explicit escape hatch past the quiz page's
          "already purchased → skip straight to result" redirect.
          Re-answering here never asks to pay again. */}
      <RetakeLink eventSlug={eventSlug} />

      <div className="flex flex-col gap-6">
        <ResultCard
          label="BEST MATCH"
          eventName={eventName}
          scored={result.hero}
          explanation={heroExplanation}
          comparisonHeading="Why this suits you"
        />
        {result.alternative1 && alt1Explanation && (
          <ResultCard
            label="ALTERNATIVE"
            eventName={eventName}
            scored={result.alternative1}
            explanation={alt1Explanation}
            comparisonHeading="Why consider this instead?"
          />
        )}
        {result.alternative2 && alt2Explanation && (
          <ResultCard
            label="ALTERNATIVE"
            eventName={eventName}
            scored={result.alternative2}
            explanation={alt2Explanation}
            comparisonHeading="Why consider this instead?"
          />
        )}
      </div>

      {/* "How these were chosen" note — same box pattern as Trip
          Intelligence's results page, founder-specified copy, 20 Oct
          2026. */}
      <div className="rounded-sm border border-[#2A2A2A] bg-[#141414] px-5 py-4 mt-6">
        <p className="text-xs text-[#A3A3A3]">
          <span className="font-black text-white">How these were chosen:</span>{" "}
          We balance your answers to identify your strongest overall match and worthwhile alternatives. Your
          top recommendation reflects your best overall fit. An alternative may be included specifically
          because it matches an experience you prioritised, even when that involves trade-offs in cost,
          comfort or convenience. If you provided your travel dates, your recommendations are aligned with
          the event&apos;s tennis schedule during those dates. For an unconstrained view of options if your
          travel itinerary allows, consider leaving the dates open. Review each recommendation&apos;s
          reasons and trade-offs before deciding.
        </p>
      </div>

      {/* Arena Maps — static reference section, placed immediately after
          the second alternative's complete card block, per spec 20 Oct
          2026. Not a ticket option; independent of recommendation
          scoring/ranking. */}
      <ArenaMapsSection eventSlug={eventSlug} />

      {/* "Where to actually buy your ticket" — same section pattern as
          F1's Ticket Intelligence result page, tennis-specific copy (no
          P1 Travel-style secondary reseller named for this pilot —
          official Ticketmaster channel only). Founder direction, 20 Oct
          2026.
          Made tournament-aware 22 Oct 2026 — previously hardcoded to
          Australian Open/Ticketmaster AU for every tournament. Australian
          Open's destination/copy is preserved exactly.
          French Open's destination (tickets.rolandgarros.com) supplied
          directly by the founder 23 Oct 2026 — the FFT's own official
          ticketing site, not a third-party reseller like AO's Ticketmaster
          channel, so the copy below is worded accordingly ("the official
          Roland-Garros ticketing platform, run by the French Tennis
          Federation" rather than AO's "authorised ticketing partner"
          framing) rather than reusing AO's reseller-specific wording
          verbatim. */}
      <div className="rounded-sm border border-[#2A2A2A] bg-[#141414] p-5 mt-10">
        <p className="text-xs font-black tracking-widest uppercase text-[#AAFF00] mb-2">
          Where to actually buy your ticket
        </p>
        {isFrenchOpen ? (
          <>
            <p className="text-sm text-[#A3A3A3] leading-6 mb-4">
              Buy directly from the official Roland-Garros ticketing platform, run by the French Tennis
              Federation. Every genuine ticket is sold or resold through this one channel — anything offered
              elsewhere, including on resale marketplaces and social media, carries no guarantee it will actually
              get you through the gate.
            </p>
            <div className="flex flex-wrap gap-4">
              <a
                href="https://tickets.rolandgarros.com/en/"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center px-4 py-2 rounded-sm bg-[#AAFF00] text-black text-xs font-black hover:bg-[#BBFF33] transition-colors"
              >
                Official Roland-Garros tickets →
              </a>
            </div>
          </>
        ) : (
          <>
            <p className="text-sm text-[#A3A3A3] leading-6 mb-4">
              Buy directly from Ticketmaster, the Australian Open&apos;s official and only authorised ticketing
              partner. Every genuine ticket is sold or resold through this one channel — anything offered
              elsewhere, including on resale marketplaces and social media, carries no guarantee it will actually
              get you through the gate.
            </p>
            <div className="flex flex-wrap gap-4">
              <a
                href="https://www.ticketmaster.com.au/ausopen"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center px-4 py-2 rounded-sm bg-[#AAFF00] text-black text-xs font-black hover:bg-[#BBFF33] transition-colors"
              >
                Official Australian Open tickets →
              </a>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
