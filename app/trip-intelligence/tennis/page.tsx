import type { Metadata } from "next";
import { Suspense } from "react";
import HomepageNav from "@/app/_components/HomepageNav";
import { getAuthUser } from "@/lib/supabase/server";
import TripIntelligenceQuiz from "./_components/TripIntelligenceQuiz";

export const metadata: Metadata = {
  title: "Which Grand Slam is best suited for you?",
  description:
    "Answer 7 questions and get matched to the Tennis Grand Slam that fits the experience you want — free, no signup.",
};

export default async function TripIntelligenceTennisQuizPage() {
  const { user } = await getAuthUser();

  return (
    <main className="min-h-screen bg-[#0A0A0A]">
      <HomepageNav email={user?.email ?? null} />
      <Suspense>
        <TripIntelligenceQuiz />
      </Suspense>
    </main>
  );
}
