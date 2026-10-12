import { NextRequest, NextResponse } from "next/server";
import { getAllGrandPrixCandidates } from "@/app/trip-intelligence/formula-1/_lib/getGrandPrixData";
import { scoreGrandPrix } from "@/app/trip-intelligence/formula-1/_lib/scoreGrandPrix";
import type { TripIntelligenceAnswers } from "@/app/trip-intelligence/formula-1/_lib/types";

// Read-only JSON wrapper around the exact engine results/page.tsx already
// calls (getAllGrandPrixCandidates() + scoreGrandPrix()) — added 10 Oct 2026
// solely to let the 5,000-profile live QA harness exercise the real,
// deployed matching engine over HTTP/JSON, since results/page.tsx only
// returns rendered HTML. Zero scoring/weighting/ratings logic lives here;
// this performs no DB writes, sends no emails, and starts no sessions. Not
// intended for production traffic from the Trip Intelligence quiz UI
// itself (that still flows through results/page.tsx) — this exists for
// testing/QA tooling only.
const ANSWER_KEYS: (keyof TripIntelligenceAnswers)[] = [
  "q1_trip_purpose", "q2_gp_identity", "q4_off_track",
  "q5_spectator", "q6_convenience", "q7_weather", "q8_affordability",
];

function parseAnswers(params: URLSearchParams): TripIntelligenceAnswers | null {
  const answers: Partial<TripIntelligenceAnswers> = {};
  for (const key of ANSWER_KEYS) {
    const v = params.get(key);
    if (typeof v !== "string") return null;
    (answers as Record<string, string>)[key] = v;
  }
  return answers as TripIntelligenceAnswers;
}

async function handle(answers: TripIntelligenceAnswers | null) {
  if (!answers) {
    return NextResponse.json(
      { error: `Missing or invalid answers — all of ${ANSWER_KEYS.join(", ")} are required as strings.` },
      { status: 400 },
    );
  }

  const candidates = await getAllGrandPrixCandidates();
  const matchResponse = scoreGrandPrix(answers, candidates);

  return NextResponse.json({
    answers,
    hero: matchResponse.hero,
    alternatives: matchResponse.alternatives,
    results: matchResponse.results,
    shortlistSize: matchResponse.shortlistSize,
    usedMinimumThreeException: matchResponse.usedMinimumThreeException,
    engineVersion: matchResponse.engineVersion,
  });
}

export async function GET(request: NextRequest) {
  const answers = parseAnswers(request.nextUrl.searchParams);
  return handle(answers);
}

export async function POST(request: NextRequest) {
  const body = await request.json().catch(() => null);
  if (!body || typeof body !== "object") {
    return NextResponse.json({ error: "Request body must be a JSON object with Q1-Q8 answer keys." }, { status: 400 });
  }
  const params = new URLSearchParams();
  for (const key of ANSWER_KEYS) {
    const v = (body as Record<string, unknown>)[key];
    if (typeof v === "string") params.set(key, v);
  }
  const answers = parseAnswers(params);
  return handle(answers);
}
