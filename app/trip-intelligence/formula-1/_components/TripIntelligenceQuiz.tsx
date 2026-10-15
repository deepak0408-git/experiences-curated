"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import type { TripIntelligenceAnswers } from "../_lib/types";
import { QUESTIONS } from "../_lib/questions";
import QuestionBlock from "./QuestionBlock";

type PartialAnswers = Partial<TripIntelligenceAnswers>;

const ANSWER_KEYS = QUESTIONS.map((q) => q.key);

function readAnswersFromParams(params: URLSearchParams): PartialAnswers {
  const out: PartialAnswers = {};
  for (const key of ANSWER_KEYS) {
    const v = params.get(key);
    if (v) (out as Record<string, string>)[key] = v;
  }
  return out;
}

export default function TripIntelligenceQuiz() {
  const router = useRouter();
  const searchParams = useSearchParams();
  // Answers restored from the URL on mount — same reasoning as Ticket
  // Intelligence's TicketQuiz.tsx: survives any mid-flow navigation without
  // needing server-side session state, since Trip Intelligence is fully
  // free/ungated (no sign-in interruption to survive, but the pattern is
  // still the right one for back-button/bookmark/share support).
  const [answers, setAnswers] = useState<PartialAnswers>(() => readAnswersFromParams(searchParams));
  // Captured once at mount, not re-read on every render — `from` doesn't
  // change while this component is alive, and putting the live
  // useSearchParams() object in the effect below's dependency array caused
  // a "final argument changed size between renders" crash under Fast
  // Refresh. A ref avoids that without needing a second effect.
  const fromCockpitRef = useRef(searchParams.get("from") === "cockpit");

  useEffect(() => {
    const params = new URLSearchParams();
    for (const key of ANSWER_KEYS) {
      const v = answers[key];
      if (v) params.set(key, v);
    }
    // Preserves ?from=cockpit through this URL rewrite — this effect runs
    // on mount (before any question is answered) and previously rebuilt the
    // URL from only the answer keys, silently dropping `from` the instant
    // the page loaded. Caught live 15 Oct 2026: the back-link never
    // rendered because the param was gone before the component could read
    // it from the current URL.
    if (fromCockpitRef.current) params.set("from", "cockpit");
    const qs = params.toString();
    const url = qs ? `/trip-intelligence/formula-1?${qs}` : "/trip-intelligence/formula-1";
    window.history.replaceState(null, "", url);
  }, [answers]);

  const answeredCount = QUESTIONS.filter((q) => answers[q.key] !== undefined).length;
  const complete = answeredCount === QUESTIONS.length;

  const set = <K extends keyof TripIntelligenceAnswers>(key: K, value: TripIntelligenceAnswers[K]) => {
    setAnswers((prev) => ({ ...prev, [key]: value }));
  };

  const resetAnswers = () => setAnswers({});

  return (
    <div className="max-w-3xl mx-auto px-6 sm:px-8 py-16">
      <div className="flex items-center justify-between gap-2 mb-4">
        <p className="text-sm font-black tracking-widest uppercase text-[#AAFF00]">Trip Intelligence</p>
        {fromCockpitRef.current && (
          <Link
            href="/formula-1"
            className="flex-shrink-0 text-xs text-[#AAFF00] hover:text-[#BBFF33] font-semibold underline underline-offset-2 transition-colors"
          >
            ← Back to F1 Cockpit
          </Link>
        )}
      </div>

      <h1 className="text-3xl sm:text-4xl font-black text-white mb-3">
        Which Grand Prix best matches the experience you want?
      </h1>
      <p className="text-[#A3A3A3] text-base mb-4">
        7 quick questions. We&apos;ll match your answers and show you which Grand Prix fits you the best —
        grounded with real trade-offs.
      </p>
      <div className="flex items-center justify-between mb-12">
        <p className="text-xs font-semibold leading-none text-[#6A6A6A]">{answeredCount} of {QUESTIONS.length} answered</p>
        {answeredCount > 0 && (
          <button
            type="button"
            onClick={resetAnswers}
            className="text-xs font-semibold leading-none text-[#6A6A6A] hover:text-[#AAFF00] underline transition-colors"
          >
            Reset my answers
          </button>
        )}
      </div>

      {QUESTIONS.map((q) => (
        <QuestionBlock
          key={q.key}
          eyebrow={q.eyebrow}
          question={q.question}
          options={q.options}
          value={answers[q.key]}
          onSelect={(v) => set(q.key, v)}
        />
      ))}

      <button
        type="button"
        disabled={!complete}
        onClick={() => {
          const params = new URLSearchParams();
          for (const key of ANSWER_KEYS) {
            params.set(key, answers[key]!);
          }
          // Preserves ?from=cockpit through to the results page — otherwise
          // the Cockpit's "Back to F1 Cockpit" context was lost the moment a
          // visitor submitted the quiz, even though it survived up to here.
          if (fromCockpitRef.current) params.set("from", "cockpit");
          router.push(`/trip-intelligence/formula-1/results?${params.toString()}`);
        }}
        className={
          complete
            ? "w-full mt-4 px-6 py-4 rounded-sm bg-[#AAFF00] text-black text-sm font-black hover:bg-[#BBFF33] transition-colors"
            : "w-full mt-4 px-6 py-4 rounded-sm bg-[#141414] border border-[#2A2A2A] text-[#6A6A6A] text-sm font-black cursor-not-allowed"
        }
      >
        {complete ? "See my match" : `Answer all ${QUESTIONS.length} questions`}
      </button>
    </div>
  );
}
