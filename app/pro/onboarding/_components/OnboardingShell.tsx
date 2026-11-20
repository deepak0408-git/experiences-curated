"use client";

import { useState } from "react";
import QuizFlow from "./QuizFlow";
import ArchetypeReveal from "./ArchetypeReveal";
import type { Archetype } from "@/lib/quiz";

export default function OnboardingShell() {
  const [archetype, setArchetype] = useState<Archetype | null>(null);

  return (
    <div className="min-h-screen bg-[#0A0A0A] flex flex-col">
      <div className="max-w-5xl mx-auto px-6 sm:px-8 py-5 w-full">
        <span className="text-sm font-black tracking-widest uppercase text-[#6A6A6A]">
          Experiences | Curated
        </span>
      </div>

      <div className="flex-1 flex items-center justify-center px-6 py-12">
        <div className="w-full">
          {!archetype ? (
            <>
              <div className="max-w-xl mx-auto text-center mb-10">
                <p className="text-xs font-black tracking-widest uppercase text-[#AAFF00] mb-3">
                  Quick setup
                </p>
                <h1 className="text-2xl font-black text-white mb-2">
                  Tell us how you travel
                </h1>
                <p className="text-sm text-[#A3A3A3]">
                  12 questions. Takes about 2 minutes. Shapes everything we recommend.
                </p>
              </div>
              <QuizFlow onComplete={setArchetype} />
            </>
          ) : (
            <ArchetypeReveal archetype={archetype} />
          )}
        </div>
      </div>
    </div>
  );
}
