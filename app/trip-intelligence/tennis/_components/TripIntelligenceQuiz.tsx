"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import type { TripIntelligenceTennisAnswers } from "../_lib/types";
import { QUESTIONS } from "../_lib/questions";
import QuestionBlock from "./QuestionBlock";

type PartialAnswers = Partial<TripIntelligenceTennisAnswers>;

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
  // Same URL-query-param state pattern as F1's TripIntelligenceQuiz.tsx —
  // survives back-button/bookmark/share without needing server session state.
  const [answers, setAnswers] = useState<PartialAnswers>(() => readAnswersFromParams(searchParams));

  useEffect(() => {
    const params = new URLSearchParams();
    for (const key of ANSWER_KEYS) {
      const v = answers[key];
      if (v) params.set(key, v);
    }
    const qs = params.toString();
    const url = qs ? `/trip-intelligence/tennis?${qs}` : "/trip-intelligence/tennis";
    window.history.replaceState(null, "", url);
  }, [answers]);

  const answeredCount = QUESTIONS.filter((q) => answers[q.key] !== undefined).length;
  const complete = answeredCount === QUESTIONS.length;

  const set = <K extends keyof TripIntelligenceTennisAnswers>(key: K, value: TripIntelligenceTennisAnswers[K]) => {
    setAnswers((prev) => ({ ...prev, [key]: value }));
  };

  const resetAnswers = () => setAnswers({});

  return (
    <div className="max-w-3xl mx-auto px-6 sm:px-8 py-16">
      <p className="text-sm font-black tracking-widest uppercase text-[#AAFF00] mb-4">Trip Intelligence</p>

      <h1 className="text-3xl sm:text-4xl font-black text-white mb-3">
        Which Grand Slam best matches the experience you want?
      </h1>
      <p className="text-[#A3A3A3] text-base mb-4">
        7 quick questions. We&apos;ll match your answers and show you which Grand Slam fits you the best —
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
          router.push(`/trip-intelligence/tennis/results?${params.toString()}`);
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
