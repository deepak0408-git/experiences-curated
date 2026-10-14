import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import HomepageNav from "@/app/_components/HomepageNav";
import { getAuthUser } from "@/lib/supabase/server";
import { scoreGrandSlam } from "../_lib/scoreGrandSlam";
import { rankCandidates, isFourWayTie } from "../_lib/rankCandidates";
import {
  composeExplanation, composeJointWinnerExplanation, composeTiedAlternativesExplanation,
  getAffordabilitySafeguard, createQ7ClaimRegistry, createClaimedDimensionsRegistry, isStillCloseContender,
} from "../_lib/matchReasons";
import { FOUR_WAY_TIE_INTRO, FOUR_WAY_TIE_EXPERIENCE } from "../_lib/wordingLibrary";
import { getAllGrandSlamCandidates, getGrandSlamDisplayInfo } from "../_lib/getGrandSlamData";
import type { TripIntelligenceTennisAnswers } from "../_lib/types";
import type { CandidateScore, TieGroup } from "../_lib/types";
import ResultCard from "./_components/ResultCard";
import ActionSideBar from "./_components/ActionSideBar";

export const metadata: Metadata = {
  title: "Your Grand Slam Match",
  description: "Your personalised Tennis Grand Slam recommendation, based on your Trip Intelligence answers.",
};

const ANSWER_KEYS: (keyof TripIntelligenceTennisAnswers)[] = [
  "q1_travel_motivation", "q2_tournament_identity", "q3_tennis_experience",
  "q4_atmosphere", "q5_beyond_tennis", "q6_convenience", "q7_affordability",
];

function parseAnswers(searchParams: Record<string, string | string[] | undefined>): TripIntelligenceTennisAnswers | null {
  const answers: Partial<TripIntelligenceTennisAnswers> = {};
  for (const key of ANSWER_KEYS) {
    const v = searchParams[key];
    if (typeof v !== "string") return null;
    (answers as Record<string, string>)[key] = v;
  }
  return answers as TripIntelligenceTennisAnswers;
}

// Revision 2 (results/explanation correction) — decides which below-leader
// tie groups earn a card, per the plan's corrected alternative-selection
// rule:
//  - The runner-up GROUP (rank-2, whatever its size) is always shown when
//    one exists — no materiality gate, and never split by the cap below.
//    The plan's Example 3 (2-way leader tie + 2-way tied-3rd) relies on
//    this: the tied-3rd pair is this function's "runner-up group" and
//    both members must appear even though that pushes the page to 4
//    cards — a below-leader tie group is never partially shown.
//  - A further group (rank-3+, only reachable when the runner-up group
//    was itself rank-2 and singular) is shown only if its shared score
//    still clears isStillCloseContender() against the hero.
//  - The 3-card cap applies only to a true sole winner (1 leader) choosing
//    a SECOND alternative group beyond the always-shown runner-up — it
//    never truncates the runner-up group itself, and does not apply when
//    the leading group is itself a tie (co-leader cards are not "capped"
//    alternatives, they're the leaders).
function selectAlternativeGroups(leadingGroup: TieGroup, belowGroups: TieGroup[], heroScore: number): TieGroup[] {
  const selected: TieGroup[] = [];
  if (belowGroups.length === 0) return selected;

  // Runner-up group: always shown whole, never gated or split.
  const runnerUpGroup = belowGroups[0];
  selected.push(runnerUpGroup);

  // A second alternative group is only considered for a true sole winner
  // (cap exists to stop a sole winner's page from always showing every
  // remaining name) — and only if it fits within 3 total cards and is
  // still a genuinely close contender relative to the hero.
  const isSoleWinner = leadingGroup.candidates.length === 1;
  if (!isSoleWinner) return selected;

  const cardCountSoFar = leadingGroup.candidates.length + runnerUpGroup.candidates.length;
  const nextGroup = belowGroups[1];
  if (!nextGroup) return selected;

  const groupScore = nextGroup.candidates[0].finalScore;
  if (!isStillCloseContender(heroScore, groupScore)) return selected;
  if (cardCountSoFar + nextGroup.candidates.length > 3) return selected;

  selected.push(nextGroup);
  return selected;
}

export default async function TripIntelligenceTennisResultsPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const resolvedParams = await searchParams;
  const answers = parseAnswers(resolvedParams);
  if (!answers) {
    notFound();
  }

  const { user } = await getAuthUser();
  const candidates = await getAllGrandSlamCandidates();
  const { weights, scores } = scoreGrandSlam(answers, candidates);
  const tieGroups = rankCandidates(scores);

  const allIds = scores.map((s) => s.sportingEventId);
  const displayInfoMap = await getGrandSlamDisplayInfo(allIds);

  const leadingGroup = tieGroups[0];
  const fourWayTie = isFourWayTie(tieGroups);
  const hero = leadingGroup.candidates[0];
  const isCoLeaderTie = leadingGroup.candidates.length > 1;

  const alternativeGroups = fourWayTie ? [] : selectAlternativeGroups(leadingGroup, tieGroups.slice(1), hero.finalScore);
  const allRemaining: CandidateScore[] = tieGroups.slice(1).flatMap((g) => g.candidates);
  // Fix 2 — the authoritative set of candidates actually rendered as
  // alternative cards, so the Q7 safeguard (which still scans the FULL
  // allRemaining field for its candidate-selection logic, unchanged) can
  // distinguish "this name is already one of your recommendation cards"
  // from "this name isn't shown, flag it as a separate consideration."
  const displayedAlternativeSlugs = new Set(alternativeGroups.flatMap((g) => g.candidates.map((c) => c.sourceSlug)));

  // Single shared Q7-claim registry + single affordability safeguard call
  // per page render (Problem 3's structured-tracking fix) — every card
  // below reads from the SAME composeExplanation result for a given pair
  // rather than recomputing it, and the safeguard's claim is recorded
  // before any card's own tradeOff is built so dedup is consistent.
  const q7Registry = createQ7ClaimRegistry();
  const affordabilitySafeguard = isCoLeaderTie || fourWayTie
    ? null
    : getAffordabilitySafeguard(answers, hero, allRemaining, q7Registry, displayedAlternativeSlugs);

  const heading = fourWayTie
    ? "All four Grand Slams match you equally"
    : isCoLeaderTie
      ? `${leadingGroup.candidates.map((c) => c.grandSlamName).join(" & ")} are tied as your best fit`
      : `${hero.grandSlamName} is your best fit`;

  return (
    <main className="min-h-screen bg-[#0A0A0A]">
      <HomepageNav email={user?.email ?? null} />
      <div className="max-w-5xl mx-auto px-6 sm:px-8 py-16">
        <p className="text-sm font-black tracking-widest uppercase text-[#AAFF00] mb-4">Your match</p>

        <h1 className="text-3xl sm:text-4xl font-black text-white mb-3">{heading}</h1>
        <Link
          href="/trip-intelligence/tennis"
          className="text-xs font-semibold text-[#6A6A6A] hover:text-[#AAFF00] underline transition-colors"
        >
          ← Edit my answers
        </Link>

        {fourWayTie ? (
          <div className="mt-8">
            <div className="grid lg:grid-cols-[1fr_300px] gap-6 lg:gap-14 items-start">
              <div className="max-w-2xl flex flex-col gap-5">
                <p className="text-[#A3A3A3] text-base">{FOUR_WAY_TIE_INTRO}</p>
                {leadingGroup.candidates.map((candidate) => {
                  const copy = FOUR_WAY_TIE_EXPERIENCE[candidate.sourceSlug];
                  const display = displayInfoMap.get(candidate.sportingEventId);
                  return (
                    <ResultCard
                      key={candidate.sourceSlug}
                      headline="Best match"
                      grandSlamName={candidate.grandSlamName}
                      heroImageUrl={display?.heroImageUrl ?? null}
                      venueName={display?.venueName ?? null}
                      startDate={display?.startDate ?? null}
                      endDate={display?.endDate ?? null}
                      primaryReason={null}
                      secondaryReason={null}
                      explanation={copy.description}
                      isHero
                      isCoLeader
                      tiedExplanationLabel="What makes it special"
                      eventSlug={display?.slug ?? null}
                      eventId={candidate.sportingEventId}
                      sport="tennis"
                      isEventGuideBuilt={display?.isEventGuideBuilt ?? false}
                      userEmail={user?.email ?? null}
                    />
                  );
                })}
              </div>

              <div>
                <ActionSideBar
                  eventSlug={displayInfoMap.get(hero.sportingEventId)?.slug ?? ""}
                  eventId={hero.sportingEventId}
                  isBuilt={displayInfoMap.get(hero.sportingEventId)?.isEventGuideBuilt ?? false}
                  userEmail={user?.email ?? null}
                  showEventGuide={false}
                />
              </div>
            </div>
          </div>
        ) : (
          <div className="mt-8">
            <div className="grid lg:grid-cols-[1fr_300px] lg:grid-rows-[auto_auto_auto] gap-6 lg:gap-14 items-start">
              <div className="lg:col-start-1 lg:row-start-1 max-w-2xl flex flex-col gap-5">
                {/* Co-leader tier: one shared joint-winner explanation computed
                    once for the whole tied group (refinement 2/3 — genuine
                    shared strengths at >=80, or neutral offsetting differences
                    when the co-leaders aren't identical on every question),
                    shown identically on each co-leader's card. Never claims
                    an advantage on a tied score (spec §7.4). */}
                {(() => {
                  const jointWinnerExplanation = isCoLeaderTie
                    ? composeJointWinnerExplanation(answers, weights, leadingGroup.candidates)
                    : null;
                  return leadingGroup.candidates.map((candidate, i) => {
                    const candidateDisplay = displayInfoMap.get(candidate.sportingEventId);
                    // primaryReason/secondaryReason describe why the hero
                    // wins — grounded against its nearest real alternative
                    // (the runner-up), not against a null placeholder.
                    const explanation = isCoLeaderTie
                      ? null
                      : composeExplanation(answers, weights, candidate, allRemaining[0] ?? null);

                    return (
                      <ResultCard
                        key={candidate.sourceSlug}
                        headline={isCoLeaderTie ? `Co-leading match ${i + 1}` : "Best match"}
                        grandSlamName={candidate.grandSlamName}
                        heroImageUrl={candidateDisplay?.heroImageUrl ?? null}
                        venueName={candidateDisplay?.venueName ?? null}
                        startDate={candidateDisplay?.startDate ?? null}
                        endDate={candidateDisplay?.endDate ?? null}
                        primaryReason={explanation?.primaryReason ?? null}
                        secondaryReason={explanation?.secondaryReason ?? null}
                        explanation={jointWinnerExplanation}
                        isHero
                        isCoLeader={isCoLeaderTie}
                        eventSlug={isCoLeaderTie ? (candidateDisplay?.slug ?? null) : undefined}
                        eventId={isCoLeaderTie ? candidate.sportingEventId : undefined}
                        sport={isCoLeaderTie ? "tennis" : undefined}
                        isEventGuideBuilt={isCoLeaderTie ? (candidateDisplay?.isEventGuideBuilt ?? false) : undefined}
                        userEmail={isCoLeaderTie ? (user?.email ?? null) : undefined}
                      />
                    );
                  });
                })()}

                {affordabilitySafeguard && (
                  <p className="text-sm text-amber-400 text-left">
                    {affordabilitySafeguard}
                  </p>
                )}
              </div>

              <div className="lg:col-start-2 lg:row-start-1 lg:row-span-2">
                <ActionSideBar
                  eventSlug={displayInfoMap.get(hero.sportingEventId)?.slug ?? ""}
                  eventId={hero.sportingEventId}
                  isBuilt={displayInfoMap.get(hero.sportingEventId)?.isEventGuideBuilt ?? false}
                  userEmail={user?.email ?? null}
                  showEventGuide={!isCoLeaderTie}
                />
              </div>

              {alternativeGroups.length > 0 && (() => {
                // Fix 1 — one shared registry for the whole alternatives
                // render pass, so the dimension an earlier-displayed card
                // claims as its comparative strength is unavailable to a
                // later card in the same loop (display order = claim
                // order). Created once per page render, not per card.
                const claimedDimensions = createClaimedDimensionsRegistry();
                return (
                <div className="lg:col-start-1 lg:row-start-2 max-w-2xl flex flex-col gap-5">
                  {alternativeGroups.map((group, groupIndex) => {
                    // Below-leader tie group (e.g. two Slams tied for 3rd):
                    // one combined explanation naming both together, never
                    // framed as an independent single runner-up.
                    const tiedExplanation = group.candidates.length > 1
                      ? composeTiedAlternativesExplanation(group.candidates)
                      : null;
                    return group.candidates.map((alt) => {
                      const altDisplay = displayInfoMap.get(alt.sportingEventId);
                      const explanation = tiedExplanation
                        ?? composeExplanation(answers, weights, hero, alt, q7Registry, claimedDimensions).explanation;
                      return (
                        <ResultCard
                          key={alt.sourceSlug}
                          headline={groupIndex === 0 ? "Runner-up" : "Also worth comparing"}
                          grandSlamName={alt.grandSlamName}
                          heroImageUrl={altDisplay?.heroImageUrl ?? null}
                          venueName={altDisplay?.venueName ?? null}
                          startDate={altDisplay?.startDate ?? null}
                          endDate={altDisplay?.endDate ?? null}
                          primaryReason={null}
                          secondaryReason={null}
                          explanation={explanation}
                          isHero={false}
                          eventSlug={altDisplay?.slug ?? null}
                          eventId={alt.sportingEventId}
                          sport="tennis"
                          isEventGuideBuilt={altDisplay?.isEventGuideBuilt ?? false}
                          userEmail={user?.email ?? null}
                        />
                      );
                    });
                  })}
                </div>
                );
              })()}

              <div className="lg:col-start-1 lg:row-start-3 max-w-2xl flex flex-col gap-4">
                <div className="rounded-sm border border-[#2A2A2A] bg-[#141414] px-5 py-4">
                  <p className="text-xs text-[#A3A3A3]">
                    <span className="font-black text-white">How these were chosen:</span>{" "}
                    We balance your answers to identify your strongest overall match and worthwhile alternatives.
                    Your top recommendation reflects your best overall fit. An alternative may be included
                    specifically because it matches an experience you prioritised, even when that involves
                    trade-offs in cost, comfort or convenience. Review each recommendation&apos;s reasons and
                    trade-offs before deciding.
                  </p>
                </div>

                {(() => {
                  const explanation = composeExplanation(answers, weights, hero, null);
                  const notes = [explanation.travelGuidance, explanation.convenienceGuidance, explanation.affordabilityGuidance].filter(
                    (n): n is string => n !== null,
                  );
                  return notes.length > 0 ? (
                    <div className="rounded-sm border border-[#2A2A2A] bg-[#141414] px-5 py-4">
                      <p className="text-xs font-black tracking-widest uppercase text-[#AAFF00] mb-2">Planning your trip</p>
                      <ul className="space-y-1.5">
                        {notes.map((note, i) => (
                          <li key={i} className="text-xs text-[#A3A3A3]">{note}</li>
                        ))}
                      </ul>
                    </div>
                  ) : null;
                })()}
              </div>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
