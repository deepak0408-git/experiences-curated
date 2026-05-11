"use client";

import { useState } from "react";
import { QUIZ_QUESTIONS, ARCHETYPE_DETAILS, getVisibleQuestions, type Archetype } from "@/lib/quiz";

interface Props {
  onComplete: (archetype: Archetype) => void;
}

export default function QuizFlow({ onComplete }: Props) {
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [currentIndex, setCurrentIndex] = useState(0);
  const [submitting, setSubmitting] = useState(false);

  const visibleQuestions = getVisibleQuestions(answers);
  const currentQuestion = visibleQuestions[currentIndex];
  const totalQuestions = visibleQuestions.length;
  const progress = ((currentIndex) / totalQuestions) * 100;
  const selectedAnswer = answers[currentQuestion.id];
  const isLast = currentIndex === totalQuestions - 1;

  const handleSelect = (optionId: string) => {
    setAnswers((prev) => ({ ...prev, [currentQuestion.id]: optionId }));
  };

  const handleNext = async () => {
    if (!selectedAnswer) return;
    if (!isLast) {
      setCurrentIndex((i) => i + 1);
      return;
    }
    setSubmitting(true);
    const res = await fetch("/api/pro/onboarding", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ answers }),
    });
    const { archetype } = await res.json();
    setSubmitting(false);
    onComplete(archetype as Archetype);
  };

  const handleBack = () => {
    if (currentIndex > 0) setCurrentIndex((i) => i - 1);
  };

  return (
    <div className="max-w-xl mx-auto">
      {/* Progress bar */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs text-neutral-400">{currentIndex + 1} of {totalQuestions}</span>
          <span className="text-xs text-neutral-400">{Math.round(progress)}% complete</span>
        </div>
        <div className="h-1 bg-neutral-100 rounded-full overflow-hidden">
          <div
            className="h-full bg-neutral-900 rounded-full transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Question */}
      <h2 className="text-lg font-semibold text-neutral-900 leading-snug mb-6">
        {currentQuestion.question}
      </h2>

      {/* Options */}
      <div className="space-y-3 mb-8">
        {currentQuestion.options.map((option) => (
          <button
            key={option.id}
            onClick={() => handleSelect(option.id)}
            className={`w-full text-left px-4 py-3.5 rounded-xl border text-sm transition-colors ${
              selectedAnswer === option.id
                ? "border-neutral-900 bg-neutral-900 text-white"
                : "border-neutral-200 bg-white text-neutral-700 hover:border-neutral-400"
            }`}
          >
            {option.label}
          </button>
        ))}
      </div>

      {/* Navigation */}
      <div className="flex items-center gap-3">
        {currentIndex > 0 && (
          <button
            onClick={handleBack}
            className="px-4 py-2.5 rounded-full border border-neutral-200 text-sm text-neutral-500 hover:border-neutral-400 transition-colors"
          >
            Back
          </button>
        )}
        <button
          onClick={handleNext}
          disabled={!selectedAnswer || submitting}
          className="flex-1 px-6 py-2.5 rounded-full bg-neutral-900 text-white text-sm font-semibold hover:bg-neutral-700 transition-colors disabled:opacity-40"
        >
          {submitting ? "Saving…" : isLast ? "See my result" : "Next"}
        </button>
      </div>
    </div>
  );
}
