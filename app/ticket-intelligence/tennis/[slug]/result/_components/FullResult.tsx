import type { QuizAnswers, ScoreResult } from "../../_lib/types";
import { selectHeroExplanation, selectAlternativeExplanation } from "../../_lib/selectExplanation";
import { heroRationale, alternativeRationale } from "../../_lib/recommendationRationale";
import { selectFrenchOpenExplanations } from "../../_lib/frenchOpenExplanation";
import { selectWimbledonExplanations } from "../../_lib/wimbledonExplanation";
import { selectUsOpenExplanations } from "../../_lib/usOpenExplanation";
import { ticketIntelligenceHeadlineEventName } from "../../_lib/presentationMappings";
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
//
// Wimbledon 2027 added 25 Oct 2026 — its own equivalent frozen-lookup
// catalogue (wimbledonExplanation.ts / wimbledonExplanationCatalogue.json),
// a separate slug entry per this file's own prior-art comment above.
// Never routed through recommendationRationale.ts (AO's construction
// engine), which throws on any arena code outside RLA/MCA/JCA/GP.
const FRENCH_OPEN_EXPLANATION_SLUGS = new Set(["french-open"]);
const WIMBLEDON_EXPLANATION_SLUGS = new Set(["wimbledon"]);
// US Open 2027 added 28 Oct 2026 — own equivalent hybrid selector
// (usOpenExplanation.ts): a 16-profile/48-passage exact-reference
// catalogue, same lookup-first pattern as French Open/Wimbledon, plus a
// ported generative fallback for every other profile (unlike French
// Open/Wimbledon, which have no generative fallback at all and throw
// outside their catalogue). Own slug entry, never reusing another
// tournament's catalogue, same reasoning as the two comments above.
const US_OPEN_EXPLANATION_SLUGS = new Set(["us-open"]);

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
  const isWimbledon = WIMBLEDON_EXPLANATION_SLUGS.has(eventSlug);
  const isUsOpen = US_OPEN_EXPLANATION_SLUGS.has(eventSlug);

  // selectHeroExplanation/selectAlternativeExplanation (the catalogue-based
  // S01-S14 selector) are still computed here for Australian Open — kept
  // for regression compatibility and auditability, per founder direction
  // 20 Oct 2026 — but their .text is no longer what's shown in the UI. AO's
  // displayed rationale comes from recommendationRationale.ts instead,
  // completely unchanged by this branch. French Open and Wimbledon have no
  // equivalent audit-only catalogue call here — selectExplanation.ts's
  // reconstructedLanguageCatalogue.json is Australian Open's own catalogue
  // (option IDs 001-043) and has no French Open/Wimbledon entries; calling
  // it with their option IDs would either collide with AO's or throw, so
  // it is deliberately never called for either.
  let heroExplanation, alt1Explanation, alt2Explanation;
  if (isFrenchOpen) {
    const fo = selectFrenchOpenExplanations(answers, result.hero, result.alternative1, result.alternative2);
    heroExplanation = fo.hero;
    alt1Explanation = fo.alternative1;
    alt2Explanation = fo.alternative2;
  } else if (isWimbledon) {
    const wim = selectWimbledonExplanations(answers, result.hero, result.alternative1, result.alternative2);
    heroExplanation = wim.hero;
    alt1Explanation = wim.alternative1;
    alt2Explanation = wim.alternative2;
  } else if (isUsOpen) {
    const uso = selectUsOpenExplanations(answers, result.hero, result.alternative1, result.alternative2);
    heroExplanation = uso.hero;
    alt1Explanation = uso.alternative1;
    alt2Explanation = uso.alternative2;
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
      <h1 className="text-3xl sm:text-4xl font-black text-white mb-3">
        Your {ticketIntelligenceHeadlineEventName(eventSlug, eventName)} match
      </h1>
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
          F1's Ticket Intelligence result page. Founder direction, 20 Oct
          2026. Refactored 25 Oct 2026 (Wimbledon onboarding) from a bare
          isFrenchOpen ? : ternary with Australian Open hardcoded as the
          "else" branch — that shape silently sent every non-French-Open
          tournament to AO's Ticketmaster link, which would have included
          Wimbledon. Now an explicit slug-keyed config per the approved
          Wimbledon implementation contract's instruction: "unsupported
          tournaments must not inherit another tournament's links." AO and
          French Open's destinations/copy below are preserved byte-
          identical to the prior ternary's two branches. Wimbledon's two
          links (Experiences | Curated's own guidance page + the official
          Wimbledon ticket info page) supplied directly by the founder, 25
          Oct 2026 — distinct phrasing from AO/French Open since neither
          link is a single "official and only" ticketing partner/platform
          claim; this copy only points to information sources and never
          implies Experiences | Curated sells tickets directly, per the
          approved contract. */}
      <div className="rounded-sm border border-[#2A2A2A] bg-[#141414] p-5 mt-10">
        <p className="text-xs font-black tracking-widest uppercase text-[#AAFF00] mb-2">
          Where to actually buy your ticket
        </p>
        {(() => {
          const config = TICKET_LINKS_BY_SLUG[eventSlug];
          if (!config) return null;
          return (
            <>
              <p className="text-sm text-[#A3A3A3] leading-6 mb-4">{config.copy}</p>
              <div className="flex flex-wrap gap-4">
                {config.links.map((link) => (
                  <a
                    key={link.href}
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center px-4 py-2 rounded-sm bg-[#AAFF00] text-black text-xs font-black hover:bg-[#BBFF33] transition-colors"
                  >
                    {link.label} →
                  </a>
                ))}
              </div>
            </>
          );
        })()}
      </div>
    </div>
  );
}

// Slug-keyed ticket-purchasing destinations — see the comment above this
// block's call site for why this replaced a bare isFrenchOpen ternary.
// An eventSlug with no entry here renders nothing (the IIFE above returns
// null) rather than inheriting another tournament's links.
const TICKET_LINKS_BY_SLUG: Record<string, { copy: string; links: { href: string; label: string }[] }> = {
  "australian-open": {
    copy:
      "Buy directly from Ticketmaster, the Australian Open's official and only authorised ticketing partner. Every genuine ticket is sold or resold through this one channel — anything offered elsewhere, including on resale marketplaces and social media, carries no guarantee it will actually get you through the gate.",
    links: [{ href: "https://www.ticketmaster.com.au/ausopen", label: "Official Australian Open tickets" }],
  },
  "french-open": {
    copy:
      "Buy directly from the official Roland-Garros ticketing platform, run by the French Tennis Federation. Every genuine ticket is sold or resold through this one channel — anything offered elsewhere, including on resale marketplaces and social media, carries no guarantee it will actually get you through the gate.",
    links: [{ href: "https://tickets.rolandgarros.com/en/", label: "Official Roland-Garros tickets" }],
  },
  wimbledon: {
    copy:
      "For our tactical, step-by-step guidance on how to actually get Wimbledon tickets, see our guide below. For the official word on ballots, resale, and Ground Pass queueing straight from the All England Lawn Tennis Club, check Wimbledon's own ticket information page.",
    links: [
      { href: "https://www.experiences-curated.com/event-pack/wimbledon/tickets", label: "Our Wimbledon ticket guidance" },
      { href: "https://www.wimbledon.com/en_GB/tickets", label: "Official Wimbledon ticket information" },
    ],
  },
  // US Open 2027 added 28 Oct 2026, founder-supplied official URL during
  // visual UAT — same single-official-channel copy register as AO/French
  // Open (the USTA is the sole official ticketing source, same "anything
  // offered elsewhere carries no guarantee" caution), not the Wimbledon
  // dual-link pattern (no separate Experiences | Curated US Open ticket
  // guide page exists yet).
  "us-open": {
    copy:
      "Buy directly from the official US Open ticketing platform, run by the USTA. Every genuine ticket is sold or resold through this one channel — anything offered elsewhere, including on resale marketplaces and social media, carries no guarantee it will actually get you through the gate.",
    links: [{ href: "https://www.usopen.org/en_US/tickets/index.html", label: "Official US Open tickets" }],
  },
};
