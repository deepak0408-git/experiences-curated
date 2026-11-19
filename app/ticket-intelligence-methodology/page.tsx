import type { Metadata } from "next";
import Link from "next/link";
import YouTubeEmbed from "@/app/_components/YouTubeEmbed";

// Issue 6 fix, 19 Nov 2026 — same template as app/planning-methodology/
// page.tsx (standalone page, section-by-section honest breakdown, scope
// caveat, feedback email). Ticket Intelligence had zero methodology
// explanation anywhere before this — confirmed by a full search of
// app/ticket-intelligence/** for "methodology"/"how it works" during the
// Issue 6 investigation. Covers both F1 and tennis on one shared page per
// founder direction (skip splitting into two pages) — the "how your
// answers become a match" section below describes both models honestly
// without disclosing either's exact scoring weights/matrices.
export const metadata: Metadata = {
  title: "How Ticket Intelligence Works — Experiences | Curated",
};

export default function TicketIntelligenceMethodologyPage() {
  return (
    <div className="min-h-screen bg-[#0A0A0A]">
      <nav className="border-b border-[#2A2A2A] bg-[#0A0A0A]">
        <div className="max-w-3xl mx-auto px-6 py-4">
          <Link
            href="/"
            className="text-xs sm:text-sm font-black tracking-widest uppercase text-[#6A6A6A] hover:text-[#AAFF00] transition-colors"
          >
            Experiences | Curated
          </Link>
        </div>
      </nav>

      <div className="max-w-2xl mx-auto px-6 sm:px-8 py-16 space-y-10">
        <div>
          <p className="text-sm font-black tracking-widest uppercase text-[#AAFF00] mb-4">Ticket Intelligence</p>
          <h1 className="text-3xl sm:text-4xl font-black text-white mb-3">How Ticket Intelligence works</h1>
          <p className="text-[#A3A3A3] text-base">
            Here&apos;s what Ticket Intelligence actually does: how we research seating, and how your answers turn
            into a match.
          </p>
        </div>

        <YouTubeEmbed videoId="ROsERYXtY2g" title="How Ticket Intelligence works" />

        <section className="space-y-3">
          <p className="text-sm font-black tracking-widest uppercase text-[#AAFF00]">How we research seating</p>
          <p className="text-base text-[#A3A3A3] leading-7">
            Every seat, zone, and hospitality option in Ticket Intelligence is researched directly from real
            sources — official venue ticketing pages, verified resale platforms, and public seating charts — never
            estimated or guessed. Each option is recorded with its own sourcing note and a confidence level, so a
            seat we&apos;re less certain about (for example, a price found only via a secondary aggregator) is
            never presented with the same certainty as one confirmed directly from the venue.
          </p>
        </section>

        <section className="space-y-3">
          <p className="text-sm font-black tracking-widest uppercase text-[#AAFF00]">
            How your answers become a match
          </p>
          <p className="text-base text-[#A3A3A3] leading-7">
            You answer 6 questions (Formula 1) or 7 (tennis) about what matters most to you — the action you want
            to see, how you feel about weather, whether you&apos;re travelling with family, your budget priority,
            and more. Ticket Intelligence scores every real seat or ticket option at that event against your
            answers and surfaces the one that fits best, along with a runner-up and a third option so you can
            compare trade-offs.
          </p>
          <p className="text-base text-[#A3A3A3] leading-7">
            The exact scoring differs by sport — Formula 1 weighs each answer against a seat&apos;s real sightline,
            weather cover, and reserved/unreserved status; tennis weighs your answers against each arena,
            tournament stage, and session using a model calibrated separately for that sport. In both cases, the
            match is generated from your specific answers every time — never a generic &ldquo;popular pick.&rdquo;
          </p>
        </section>

        <section className="space-y-3">
          <p className="text-sm font-black tracking-widest uppercase text-[#AAFF00]">What &ldquo;relative cost&rdquo; means</p>
          <p className="text-base text-[#A3A3A3] leading-7">
            The star rating next to each match shows how a seat or ticket compares in price to other options at the
            same event — more stars means pricier relative to that event&apos;s own range, not a literal dollar
            figure. We do this because real prices change and vary by seller; the relative comparison stays
            accurate even when specific prices move.
          </p>
        </section>

        <section className="space-y-3">
          <p className="text-sm font-black tracking-widest uppercase text-[#AAFF00]">A note on scope</p>
          <p className="text-base text-[#A3A3A3] leading-7">
            Ticket Intelligence currently covers a growing set of Formula 1 Grands Prix and Grand Slam tournaments.
            If an event isn&apos;t available yet, its seating or ticket data hasn&apos;t been fully researched —
            rather than show you an estimate, we leave it out until it&apos;s ready.
          </p>
          <p className="text-base text-[#A3A3A3] leading-7">
            We don&apos;t research live ticket availability — a match reflects a real seat or ticket option that
            genuinely exists at that event, not a confirmation that it&apos;s currently on sale or unsold.
            Popular options can and do sell out, sometimes well ahead of the event. Always check the official
            ticketing source for current availability before you commit to travel plans.
          </p>
        </section>

        <section className="space-y-3 pt-4 border-t border-[#2A2A2A]">
          <p className="text-sm font-black tracking-widest uppercase text-[#AAFF00]">What we are, and aren&apos;t</p>
          <p className="text-base text-[#A3A3A3] leading-7">
            Experiences | Curated is an independent research and planning service. We don&apos;t sell tickets,
            process ticket payments, or confirm live pricing or availability — and we&apos;re not affiliated with
            Formula 1, the ATP, the WTA, any Grand Slam tournament, or their official ticketing partners.
          </p>
        </section>

        <section className="pt-4 border-t border-[#2A2A2A]">
          <p className="text-sm text-[#6A6A6A]">
            Have a question about a specific option, or spotted something that looks off? Write to us at{" "}
            <a href="mailto:hello@experiences-curated.com" className="text-[#AAFF00] hover:underline">
              hello@experiences-curated.com
            </a>{" "}
            and we will work to get back at the earliest.
          </p>
        </section>
      </div>
    </div>
  );
}
