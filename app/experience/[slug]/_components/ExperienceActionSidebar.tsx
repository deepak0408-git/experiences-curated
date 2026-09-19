"use client";

import { useState } from "react";
import Link from "next/link";
import { subscribeToNewsletter } from "@/app/newsletter/actions";

// Same 4-action model as blog's ArticleActionSidebar (see that file for the
// locked design rationale — all real next actions shown at once, no forced
// sequencing). This is the experience-page variant: every experience has an
// eventPackSlug/eventPackName (defaults to Wimbledon per getExperienceData
// in page.tsx), so "This Experience" always renders — no fallback/standalone
// state needed here the way the blog sidebar needs one for event-agnostic
// articles.
//
// !hasLivePack notify state reuses the exact same pattern as the Calendar
// page's NotifyMeButton — subscribeToNewsletter(email, source), not a new
// per-event interest table. newsletter_subscribers has no per-event
// granularity, same reasoning as NotifyMeButton's own comment. userEmail
// pre-fills the input for a signed-in visitor, same fix as NotifyMeButton
// (19 Sep 2026).

export default function ExperienceActionSidebar({
  eventPackSlug,
  eventPackName,
  hasLivePack,
  userEmail,
}: {
  eventPackSlug: string;
  eventPackName: string;
  hasLivePack: boolean;
  userEmail: string | null;
}) {
  return (
    <div className="rounded-sm border border-[#2A2A2A] bg-[#141414] p-5">
      <p className="text-xs font-black tracking-widest uppercase text-white mb-3.5">
        This Experience
      </p>

      <Link
        href="/calendar"
        className="flex items-center gap-2.5 py-3 border-b border-[#2A2A2A] hover:opacity-80 transition-opacity"
      >
        <span className="text-base flex-shrink-0 w-5 text-center">📅</span>
        <span className="flex-1">
          <span className="block text-sm font-bold text-[#A3A3A3]">See it on the calendar</span>
          <span className="block text-xs text-[#6A6A6A] mt-0.5">Dates, venue, full fixture</span>
        </span>
      </Link>

      <Link
        href="/planner"
        className="flex items-center gap-2.5 py-3 border-b border-[#2A2A2A] hover:opacity-80 transition-opacity"
      >
        <span className="text-base flex-shrink-0 w-5 text-center">💰</span>
        <span className="flex-1">
          <span className="block text-sm font-bold text-[#A3A3A3]">Budget your trip</span>
          <span className="block text-xs text-[#6A6A6A] mt-0.5">Real flight, hotel and ticket costs</span>
        </span>
      </Link>

      <Link
        href="/custom-itinerary"
        className="flex items-center gap-2.5 py-3 border-b border-[#2A2A2A] hover:opacity-80 transition-opacity"
      >
        <span className="text-base flex-shrink-0 w-5 text-center">🧭</span>
        <span className="flex-1">
          <span className="block text-sm font-bold text-[#A3A3A3]">Build a custom itinerary</span>
          <span className="block text-xs text-[#6A6A6A] mt-0.5">Tell us your trip, we&apos;ll shape it</span>
        </span>
      </Link>

      {hasLivePack ? (
        <Link
          href={`/event-pack/${eventPackSlug}`}
          className="flex items-center gap-2.5 py-4 px-5 -mx-5 -mb-5 mt-0 rounded-b-sm bg-[#AAFF00] hover:bg-[#BBFF33] transition-colors"
        >
          <span className="text-base flex-shrink-0 w-5 text-center">🎟</span>
          <span className="flex-1">
            <span className="block text-sm font-black text-black">Get the full guide</span>
            <span className="block text-xs text-black/65 mt-0.5">Seating, arrival timing, where to stay</span>
          </span>
        </Link>
      ) : (
        <NotifyMeRow eventPackName={eventPackName} userEmail={userEmail} />
      )}
    </div>
  );
}

function NotifyMeRow({ eventPackName, userEmail }: { eventPackName: string; userEmail: string | null }) {
  const [open, setOpen] = useState(false);
  const [email, setEmail] = useState(userEmail ?? "");
  const [status, setStatus] = useState<"idle" | "loading" | "done" | "error">("idle");

  if (status === "done") {
    return (
      <div className="flex items-center gap-2.5 py-3">
        <span className="text-base flex-shrink-0 w-5 text-center">✓</span>
        <span className="text-sm font-bold text-[#AAFF00]">You&apos;re on the list</span>
      </div>
    );
  }

  if (!open) {
    return (
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="w-full flex items-center gap-2.5 py-3 text-left hover:opacity-80 transition-opacity"
      >
        <span className="text-base flex-shrink-0 w-5 text-center">🔔</span>
        <span className="flex-1">
          <span className="block text-sm font-bold text-[#6A6A6A]">Guide coming — get notified</span>
          <span className="block text-xs text-[#6A6A6A] mt-0.5">We&apos;ll email you when it&apos;s live</span>
        </span>
      </button>
    );
  }

  return (
    <form
      onSubmit={async (e) => {
        e.preventDefault();
        setStatus("loading");
        const result = await subscribeToNewsletter(email, "experience_page");
        setStatus(result.ok ? "done" : "error");
      }}
      className="py-3"
    >
      <p className="text-xs text-[#6A6A6A] mb-2">We&apos;ll email you when the {eventPackName} guide is live.</p>
      <div className="flex items-center gap-2">
        <input
          type="email"
          required
          autoFocus
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@example.com"
          aria-label={`Get notified when the ${eventPackName} guide is live`}
          className="w-0 flex-1 min-w-0 rounded-sm bg-[#1A1A1A] border border-[#2A2A2A] px-2.5 py-1.5 text-xs text-white placeholder:text-[#6A6A6A] focus:outline-none focus:border-[#AAFF00] transition-colors"
        />
        <button
          type="submit"
          disabled={status === "loading"}
          className="flex-shrink-0 rounded-sm bg-[#AAFF00] text-black text-xs font-black px-3 py-1.5 hover:bg-[#BBFF33] transition-colors disabled:opacity-60"
        >
          {status === "loading" ? "..." : "Notify me"}
        </button>
      </div>
      {status === "error" && (
        <p className="text-xs text-red-400 mt-1.5">Something went wrong — try again.</p>
      )}
    </form>
  );
}
