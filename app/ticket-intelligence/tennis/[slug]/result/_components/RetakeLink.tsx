"use client";

import { useRouter, useSearchParams } from "next/navigation";

// Tennis equivalent of app/ticket-intelligence/[slug]/result/_components/RetakeLink.tsx.
// Client component so the retake value is generated fresh ON CLICK
// (Date.now()), not baked into a static href — a plain <Link href="?retake=1">
// produces the SAME URL on every click, which Next.js treats as a no-op
// navigation. The quiz page keys its TennisTicketQuiz instance on this
// value specifically so every distinct retake click forces a real remount.
export default function RetakeLink({ eventSlug }: { eventSlug: string }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  return (
    <button
      type="button"
      onClick={() => {
        const params = new URLSearchParams({ retake: String(Date.now()) });
        const from = searchParams.get("from");
        if (from) params.set("from", from);
        router.push(`/ticket-intelligence/tennis/${eventSlug}?${params.toString()}`);
        window.scrollTo({ top: 0, behavior: "instant" });
      }}
      className="inline-block text-xs font-semibold text-[#6A6A6A] hover:text-[#AAFF00] underline mb-8 transition-colors"
    >
      ← Retake the quiz
    </button>
  );
}
