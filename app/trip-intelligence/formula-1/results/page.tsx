import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import HomepageNav from "@/app/_components/HomepageNav";
import { getAuthUser } from "@/lib/supabase/server";
import { scoreGrandPrix } from "../_lib/scoreGrandPrix";
import { getMatchReasons, getTradeOff, getGapFromHero, getComparativeEdges } from "../_lib/matchReasons";
import { getAllGrandPrixCandidates, getGrandPrixDisplayInfo, getFanInsights } from "../_lib/getGrandPrixData";
import type { TripIntelligenceAnswers } from "../_lib/types";
import ResultCard from "./_components/ResultCard";
import ActionSideBar from "./_components/ActionSideBar";

export const metadata: Metadata = {
  title: "Your Grand Prix Match",
  description: "Your personalised Formula 1 Grand Prix recommendation, based on your Trip Intelligence answers.",
};

const ANSWER_KEYS: (keyof TripIntelligenceAnswers)[] = [
  "q1_trip_purpose", "q2_gp_identity", "q4_off_track",
  "q5_spectator", "q6_convenience", "q7_weather", "q8_affordability",
];

function parseAnswers(searchParams: Record<string, string | string[] | undefined>): TripIntelligenceAnswers | null {
  const answers: Partial<TripIntelligenceAnswers> = {};
  for (const key of ANSWER_KEYS) {
    const v = searchParams[key];
    if (typeof v !== "string") return null;
    (answers as Record<string, string>)[key] = v;
  }
  return answers as TripIntelligenceAnswers;
}

export default async function TripIntelligenceResultsPage({
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
  const candidates = await getAllGrandPrixCandidates();
  const matchResponse = scoreGrandPrix(answers, candidates);

  const topIds = [matchResponse.hero, ...matchResponse.alternatives].map((r) => r.sportingEventId);
  const [displayInfoMap, insightsMap] = await Promise.all([
    getGrandPrixDisplayInfo(topIds),
    getFanInsights(topIds),
  ]);

  const candidatesBySlug = new Map(candidates.map((c) => [c.sourceSlug, c]));
  const heroCandidate = candidatesBySlug.get(matchResponse.hero.sourceSlug)!;
  const heroDisplay = displayInfoMap.get(matchResponse.hero.sportingEventId);
  const alternativeCandidates = matchResponse.alternatives.map((alt) => candidatesBySlug.get(alt.sourceSlug)!);

  const fromParam = resolvedParams.from;
  const from = typeof fromParam === "string" ? fromParam : undefined;

  return (
    <main className="min-h-screen bg-[#0A0A0A]">
      <HomepageNav email={user?.email ?? null} hideSecondaryLink hideMyTravels />
      <div className="max-w-5xl mx-auto px-6 sm:px-8 py-16">
        <div className="flex items-center justify-between gap-2 mb-4">
          <p className="text-sm font-black tracking-widest uppercase text-[#AAFF00]">Your match</p>
          {from === "cockpit" && (
            <Link
              href="/formula-1"
              className="flex-shrink-0 text-xs text-[#AAFF00] hover:text-[#BBFF33] font-semibold underline underline-offset-2 transition-colors"
            >
              ← Back to F1 Cockpit
            </Link>
          )}
        </div>

        <h1 className="text-3xl sm:text-4xl font-black text-white mb-3">
          {matchResponse.hero.grandPrixName} is your best fit
        </h1>
        <Link
          href="/trip-intelligence/formula-1"
          className="text-xs font-semibold text-[#6A6A6A] hover:text-[#AAFF00] underline transition-colors"
        >
          ← Edit my answers
        </Link>

        <div className="mt-8">
          {/* Mobile (single column, no explicit grid placement needed):
              hero -> sidebar -> alternatives, by DOM order. lg:: explicit
              placement — hero col 1 row 1, sidebar col 2 spanning both
              rows, alternatives col 1 row 2. Founder request, 10 Oct
              2026. */}
          <div className="grid lg:grid-cols-[1fr_300px] lg:grid-rows-[auto_auto_auto] gap-6 lg:gap-14 items-start">
            <div className="lg:col-start-1 lg:row-start-1 max-w-2xl">
              <ResultCard
                headline="Best match"
                grandPrixName={matchResponse.hero.grandPrixName}
                heroImageUrl={heroDisplay?.heroImageUrl ?? null}
                venueName={heroDisplay?.venueName ?? null}
                startDate={heroDisplay?.startDate ?? null}
                endDate={heroDisplay?.endDate ?? null}
                matchReasons={getMatchReasons(answers, heroCandidate)}
                gapFromHero={null}
                comparativeEdges={getComparativeEdges(heroCandidate, alternativeCandidates)}
                tradeOff={getTradeOff(answers, heroCandidate)}
                insights={insightsMap.get(matchResponse.hero.sportingEventId) ?? null}
                isHero
              />
            </div>

            <div className="lg:col-start-2 lg:row-start-1 lg:row-span-2">
              <ActionSideBar
                eventSlug={heroDisplay?.slug ?? ""}
                eventId={matchResponse.hero.sportingEventId}
                sport={heroDisplay?.sport ?? "formula_one"}
                isBuilt={heroDisplay?.isEventGuideBuilt ?? false}
                userEmail={user?.email ?? null}
                ticketIntelligenceSlug={heroDisplay?.hasTicketIntelligence ? heroDisplay.slug : null}
              />
            </div>

            <div className="lg:col-start-1 lg:row-start-2 max-w-2xl flex flex-col gap-5">
              {matchResponse.alternatives.map((alt, i) => {
                const altCandidate = candidatesBySlug.get(alt.sourceSlug)!;
                const altDisplay = displayInfoMap.get(alt.sportingEventId);
                return (
                  <ResultCard
                    key={alt.sourceSlug}
                    headline={i === 0 ? "Runner-up" : "3rd option"}
                    grandPrixName={alt.grandPrixName}
                    heroImageUrl={altDisplay?.heroImageUrl ?? null}
                    venueName={altDisplay?.venueName ?? null}
                    startDate={altDisplay?.startDate ?? null}
                    endDate={altDisplay?.endDate ?? null}
                    matchReasons={getMatchReasons(answers, altCandidate)}
                    gapFromHero={getGapFromHero(altCandidate, heroCandidate, alt.finalScore, matchResponse.hero.finalScore)}
                    comparativeEdges={[]}
                    tradeOff={getTradeOff(answers, altCandidate)}
                    insights={null}
                    isHero={false}
                    eventSlug={altDisplay?.slug ?? null}
                    eventId={alt.sportingEventId}
                    sport={altDisplay?.sport}
                    isEventGuideBuilt={altDisplay?.isEventGuideBuilt ?? false}
                    userEmail={user?.email ?? null}
                    ticketIntelligenceSlug={altDisplay?.hasTicketIntelligence ? altDisplay.slug : null}
                  />
                );
              })}
            </div>

            <div className="lg:col-start-1 lg:row-start-3 max-w-2xl">
              <div className="rounded-sm border border-[#2A2A2A] bg-[#141414] px-5 py-4">
                <p className="text-xs text-[#A3A3A3]">
                  <span className="font-black text-white">How these three were chosen:</span>{" "}
                  We balance your answers to identify your strongest overall match and two worthwhile alternatives.
                  Your top recommendation reflects your best overall fit. An alternative may be included
                  specifically because it matches an experience you prioritised, even when that involves
                  trade-offs in cost, comfort or convenience. Review each recommendation&apos;s reasons and
                  trade-offs before deciding.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
