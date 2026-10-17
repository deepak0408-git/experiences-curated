"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { appendFromParams } from "../../_lib/resolveBackLink";

// Client component so the retake value can be generated fresh ON CLICK
// (Date.now()), not baked into a static href at render time — a plain
// <Link href="?retake=1"> produces the SAME URL on every click, which
// Next.js treats as a no-op navigation (nothing changes, nothing
// remounts). The quiz page keys its TicketQuiz instance on this value
// specifically so every distinct retake click forces a real remount,
// even multiple retakes in a row. Bug found live 25 Sep 2026: clicking
// "Retake the quiz" a second time (already on ?retake=1) did nothing,
// since the link's href never changed between clicks.
export default function RetakeLink({ eventSlug }: { eventSlug: string }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  return (
    <button
      type="button"
      onClick={() => {
        // Preserve ?from=cockpit (etc.) into the fresh retake navigation —
        // same bug class as TicketQuiz's URL-sync effect (see its comment):
        // without this, retaking from the result page silently dropped the
        // fan's original entry-point context.
        const params = new URLSearchParams({ retake: String(Date.now()) });
        appendFromParams(searchParams, params);
        router.push(`/ticket-intelligence/${eventSlug}?${params.toString()}`);
        // Explicit reset alongside router.push's own scroll-restoration —
        // belt and suspenders after the same "landed mid-page" class of
        // bug on the quiz reveal button (TicketQuiz.tsx).
        window.scrollTo({ top: 0, behavior: "instant" });
      }}
      className="inline-block text-xs font-semibold text-[#6A6A6A] hover:text-[#AAFF00] underline mb-8 transition-colors"
    >
      ← Retake the quiz
    </button>
  );
}
