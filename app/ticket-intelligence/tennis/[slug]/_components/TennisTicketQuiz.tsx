"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import type { QuizAnswers, Q1Priority, Q2Stage, Q3Viewing, Q4Session, Q5Seating, Q6Budget, Q7Flexibility, TicketOption } from "../_lib/types";
import { scoreTennisOptions, tournamentWindowFor } from "../_lib/scoreTennisOptions";
import TeaserResult from "./TeaserResult";
import TennisTicketIntelligenceSidebar from "./TennisTicketIntelligenceSidebar";
import { resolveCockpitBackLink } from "@/lib/cockpitBackLink";

// Approved final Q1-Q7 wording — Stage 2 Authorization, 20 Oct 2026. Do not
// paraphrase, shorten, or reorder these without a separately-approved
// questionnaire change. Single-page layout (all 7 questions stacked, one
// "See my match" CTA) matches the existing F1 TicketQuiz.tsx pattern.
//
// Restructured 20 Oct 2026 for the commercial wiring — this component
// previously rendered the full, un-blurred result directly on reveal (no
// purchase gate existed during the free pilot). It now matches F1's
// TicketQuiz.tsx exactly: reveal renders TeaserResult (blurred, paywalled),
// and the real result only ever renders server-side on the new /result
// route once access is verified.
const Q1_OPTIONS: { value: Q1Priority; label: string }[] = [
  { value: "lots_of_tennis", label: "Watching as much tennis as possible" },
  { value: "big_stadium", label: "Experiencing the big-stadium atmosphere" },
  { value: "close_up_courts", label: "Enjoying close-up tennis on smaller courts" },
  { value: "balance", label: "A balanced mix of tennis and atmosphere" },
];
const Q2_OPTIONS: { value: Q2Stage; label: string }[] = [
  { value: "early", label: "Early-round action with lots of matches" },
  { value: "middle", label: "Competitive middle-round tennis, including Round 4 and quarterfinals" },
  { value: "later", label: "High-stakes semifinals and finals" },
];
const Q3_OPTIONS: { value: Q3Viewing; label: string }[] = [
  { value: "reserved", label: "From a guaranteed reserved seat" },
  { value: "exploring", label: "Moving between different courts" },
  { value: "mix", label: "A mix of reserved seating and exploring" },
  { value: "no_preference", label: "No strong preference" },
];
const Q4_OPTIONS: { value: Q4Session; label: string }[] = [
  { value: "day", label: "Daytime sessions" },
  { value: "night", label: "Evening or night sessions" },
  { value: "either", label: "Either works for me" },
];
const Q5_OPTIONS: { value: Q5Seating; label: string }[] = [
  { value: "close_to_action", label: "Being close to the court is my priority" },
  { value: "clear_balanced_view", label: "Having a clear, balanced view of the court matters most" },
  { value: "no_preference", label: "I don't have a strong preference about my seat location or viewing angle" },
  { value: "flexible", label: "I prefer the flexibility to explore different courts" },
];
const Q6_OPTIONS: { value: Q6Budget; label: string }[] = [
  { value: "value_focused", label: "Value-focused — keep costs reasonable" },
  { value: "balanced", label: "Balanced — willing to spend more for the right experience" },
  { value: "premium", label: "Premium — happy to pay for a standout experience" },
];
const Q7_OPTIONS: { value: Q7Flexibility; label: string }[] = [
  { value: "fixed", label: "My dates are already fixed" },
  { value: "adjustable", label: "I can adjust by a day or two" },
  { value: "flexible_tournament", label: "I'm flexible across the tournament" },
];

interface Props {
  slug: string;
  eventName: string;
  options: TicketOption[];
  eventId: string;
  sport: string;
  isBuilt: boolean;
  showBudgetLink: boolean;
  userEmail: string | null;
  alreadyPurchased: boolean;
}

type PartialAnswers = Partial<QuizAnswers>;
const ANSWER_KEYS: (keyof QuizAnswers)[] = ["q1", "q2", "q3", "q4", "q5", "q6", "q7"];

function readAnswersFromParams(params: URLSearchParams): PartialAnswers {
  const out: PartialAnswers = { fromDate: null, toDate: null };
  for (const key of ANSWER_KEYS) {
    const v = params.get(key);
    if (v) (out as Record<string, string>)[key] = v;
  }
  const fromDate = params.get("fromDate");
  const toDate = params.get("toDate");
  if (fromDate) out.fromDate = fromDate;
  if (toDate) out.toDate = toDate;
  return out;
}

export default function TennisTicketQuiz({
  slug,
  eventName,
  options,
  eventId,
  sport,
  isBuilt,
  showBudgetLink,
  userEmail,
  alreadyPurchased,
}: Props) {
  // Date-picker min/max — derived from this event's own options (same
  // per-event resolution scoreTennisOptions.ts's Q7 clamp uses), not a
  // hardcoded constant. For Australian Open (no eligibleFrom/eligibleTo on
  // any option) this resolves to the same 2027-01-17..31 window as before;
  // for French Open it resolves to that event's real May 23 - June 6
  // window automatically.
  const { start: tournamentMin, end: tournamentMax } = tournamentWindowFor(options);
  const searchParams = useSearchParams();
  // Answers restored from the URL on mount — required because signing in
  // mid-flow (the unlock step, for a fan who reached the paywall without
  // an account) is a full navigation to /sign-in and back, which would
  // otherwise lose this component's in-memory state entirely. Same pattern
  // as F1's TicketQuiz.tsx.
  const [answers, setAnswers] = useState<PartialAnswers>(() => readAnswersFromParams(searchParams));
  const [revealed, setRevealed] = useState(() => searchParams.get("revealed") === "1");
  const retakeValue = useRef(searchParams.get("retake"));
  // Contextual back-link — shown when this page was reached either from
  // this event's own guide (?from=<slug>) or from a sport Cockpit
  // (?from=cockpit / ?from=tennis-cockpit). Read once on mount so it
  // survives the URL-sync effect rewriting the query string below. Fixed
  // 21 Oct 2026 — this previously only ever matched the slug case, so a
  // visitor who arrived via ?from=tennis-cockpit saw no back-link at all.
  const fromParam = useRef(searchParams.get("from"));
  const cockpitBackLink = resolveCockpitBackLink(fromParam.current);
  const backLink =
    cockpitBackLink ??
    (fromParam.current === slug ? { href: `/event-pack/${slug}`, label: `← Back to ${eventName} guide` } : null);

  const set = <K extends keyof QuizAnswers>(key: K, value: QuizAnswers[K]) => {
    setAnswers((prev) => ({ ...prev, [key]: value }));
  };

  useEffect(() => {
    const params = new URLSearchParams();
    for (const key of ANSWER_KEYS) {
      const v = answers[key];
      if (v) params.set(key, v);
    }
    if (answers.fromDate) params.set("fromDate", answers.fromDate);
    if (answers.toDate) params.set("toDate", answers.toDate);
    if (revealed) params.set("revealed", "1");
    if (retakeValue.current) params.set("retake", retakeValue.current);
    if (fromParam.current) params.set("from", fromParam.current);
    const qs = params.toString();
    const url = qs ? `/ticket-intelligence/tennis/${slug}?${qs}` : `/ticket-intelligence/tennis/${slug}`;
    window.history.replaceState(null, "", url);
  }, [answers, revealed, slug]);

  const answeredCount = ANSWER_KEYS.filter((k) => answers[k] !== undefined).length;
  // Q7's date fields are a required sub-answer of Q7 itself (except when
  // flexible_tournament, where they're optional — Stage 2 Authorization
  // §2), not a separate 8th question, so they don't add to answeredCount
  // but DO gate completeness below.
  const datesSatisfied =
    answers.q7 === "flexible_tournament" || (!!answers.fromDate && !!answers.toDate);
  const complete = answeredCount === ANSWER_KEYS.length && datesSatisfied;

  if (revealed && complete) {
    const result = scoreTennisOptions(options, answers as QuizAnswers);
    const answerParams = new URLSearchParams({
      q1: answers.q1!,
      q2: answers.q2!,
      q3: answers.q3!,
      q4: answers.q4!,
      q5: answers.q5!,
      q6: answers.q6!,
      q7: answers.q7!,
    });
    if (answers.fromDate) answerParams.set("fromDate", answers.fromDate);
    if (answers.toDate) answerParams.set("toDate", answers.toDate);
    if (fromParam.current) answerParams.set("from", fromParam.current);
    const successUrl =
      typeof window !== "undefined"
        ? `${window.location.origin}/ticket-intelligence/tennis/${slug}/result?${answerParams.toString()}`
        : "";

    return (
      <TeaserResult
        eventName={eventName}
        eventId={eventId}
        eventSlug={slug}
        eventSport={sport}
        eventIsBuilt={isBuilt}
        showBudgetLink={showBudgetLink}
        result={result}
        successUrl={successUrl}
        signedInEmail={userEmail}
        answers={answers as QuizAnswers}
        onEditAnswers={() => {
          setRevealed(false);
          window.scrollTo({ top: 0, behavior: "instant" });
        }}
        alreadyPurchased={alreadyPurchased}
        backLink={backLink}
      />
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-6 sm:px-8 py-16">
      <div className="flex items-center justify-between mb-4">
        <p className="text-sm font-black tracking-widest uppercase text-[#AAFF00]">Ticket Intelligence</p>
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
          <h1 className="text-3xl sm:text-4xl font-black text-white mb-3">Which {eventName} ticket fits you?</h1>
          <p className="text-[#A3A3A3] text-base mb-4">
            7 quick questions. We&apos;ll match your answers against every real arena, stage, and seating option at
            this Grand Slam — no fluff, just the ticket that fits.
          </p>
          <p className="text-xs text-[#6A6A6A] mb-12">{answeredCount} of 7 answered</p>

          <QuestionBlock
            eyebrow="Experience priority"
            question="What matters most to you at a Grand Slam?"
            options={Q1_OPTIONS}
            value={answers.q1}
            onSelect={(v) => set("q1", v)}
          />
          <QuestionBlock
            eyebrow="Tournament stage"
            question="What kind of matches would you most enjoy?"
            options={Q2_OPTIONS}
            value={answers.q2}
            onSelect={(v) => set("q2", v)}
          />
          <QuestionBlock
            eyebrow="Viewing flexibility"
            question="How do you prefer to watch tennis?"
            options={Q3_OPTIONS}
            value={answers.q3}
            onSelect={(v) => set("q3", v)}
          />
          <QuestionBlock
            eyebrow="Session preference"
            question="What time of day works best for you?"
            options={Q4_OPTIONS}
            value={answers.q4}
            onSelect={(v) => set("q4", v)}
          />
          <QuestionBlock
            eyebrow="Seating priority"
            question="How important is your seating experience?"
            options={Q5_OPTIONS}
            value={answers.q5}
            onSelect={(v) => set("q5", v)}
          />
          <QuestionBlock
            eyebrow="Budget sensitivity"
            question="How would you describe your ticket budget?"
            options={Q6_OPTIONS}
            value={answers.q6}
            onSelect={(v) => set("q6", v)}
          />
          <QuestionBlock
            eyebrow="Date flexibility"
            question="How flexible are your tournament dates?"
            options={Q7_OPTIONS}
            value={answers.q7}
            onSelect={(v) => set("q7", v)}
          />

          <div className="mb-10">
            <p className="text-xs font-semibold tracking-widest uppercase text-[#AAFF00] mb-3">
              Which dates are you planning to attend?
              {answers.q7 === "flexible_tournament" && (
                <span className="text-[#6A6A6A] normal-case font-normal"> (optional)</span>
              )}
            </p>
            <div className="flex gap-3">
              <label className="flex-1">
                <span className="block text-xs text-[#A3A3A3] mb-1">From</span>
                <input
                  type="date"
                  min={tournamentMin}
                  max={tournamentMax}
                  value={answers.fromDate ?? ""}
                  onChange={(e) => set("fromDate", e.target.value || null)}
                  className="w-full px-3 py-2 rounded-sm bg-[#141414] border border-[#2A2A2A] text-white text-sm"
                />
              </label>
              <label className="flex-1">
                <span className="block text-xs text-[#A3A3A3] mb-1">To</span>
                <input
                  type="date"
                  min={tournamentMin}
                  max={tournamentMax}
                  value={answers.toDate ?? ""}
                  onChange={(e) => set("toDate", e.target.value || null)}
                  className="w-full px-3 py-2 rounded-sm bg-[#141414] border border-[#2A2A2A] text-white text-sm"
                />
              </label>
            </div>
          </div>

          <button
            type="button"
            disabled={!complete}
            onClick={() => {
              setRevealed(true);
              window.scrollTo({ top: 0, behavior: "instant" });
            }}
            className={
              complete
                ? "w-full mt-4 px-6 py-4 rounded-sm bg-[#AAFF00] text-black text-sm font-black hover:bg-[#BBFF33] transition-colors"
                : "w-full mt-4 px-6 py-4 rounded-sm bg-[#141414] border border-[#2A2A2A] text-[#6A6A6A] text-sm font-black cursor-not-allowed"
            }
          >
            {complete ? "See my match" : "Answer all 7 questions"}
          </button>
        </div>
        <TennisTicketIntelligenceSidebar
          eventSlug={slug}
          eventId={eventId}
          sport={sport}
          isBuilt={isBuilt}
          userEmail={userEmail}
          showBudgetLink={showBudgetLink}
        />
      </div>
    </div>
  );
}

function QuestionBlock<V extends string>({
  eyebrow,
  question,
  options,
  value,
  onSelect,
}: {
  eyebrow: string;
  question: string;
  options: { value: V; label: string }[];
  value: V | undefined;
  onSelect: (v: V) => void;
}) {
  return (
    <div className="mb-10">
      <p className="text-xs font-semibold tracking-widest uppercase text-[#AAFF00] mb-3">{eyebrow}</p>
      <p className="text-sm text-white font-bold mb-3">{question}</p>
      <div className="flex flex-col gap-2">
        {options.map((opt) => {
          const selected = value === opt.value;
          return (
            <button
              key={opt.value}
              type="button"
              onClick={() => onSelect(opt.value)}
              className={
                selected
                  ? "text-left px-4 py-3 rounded-sm text-sm font-semibold bg-[#AAFF00] text-black transition-colors"
                  : "text-left px-4 py-3 rounded-sm text-sm font-semibold bg-[#141414] border border-[#2A2A2A] text-[#A3A3A3] hover:border-[#AAFF00] hover:text-white transition-colors"
              }
            >
              {opt.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}
