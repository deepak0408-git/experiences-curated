"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import type {
  Seat,
  QuizAnswers,
  Q1TrackAction,
  Q2SeatStyle,
  Q3Weather,
  Q4Group,
  Q5OffTrack,
  Q7Budget,
} from "../_lib/types";
import { scoreSeats } from "../_lib/scoreSeats";
import TeaserResult from "./TeaserResult";
import TicketIntelligenceSidebar from "./TicketIntelligenceSidebar";

const Q1_OPTIONS: { value: Q1TrackAction; label: string }[] = [
  { value: "overtaking", label: "Overtaking and braking battles" },
  { value: "start_grid", label: "The start, grid, and podium" },
  { value: "high_speed_or_technical", label: "Flat-out speed or technical cornering" },
  { value: "atmosphere", label: "Just being there — atmosphere over any one view" },
];

const Q2_OPTIONS: { value: Q2SeatStyle; label: string }[] = [
  { value: "fixed", label: "Fixed seat, guaranteed view" },
  { value: "flexible", label: "Flexible — I'll move around" },
];

const Q3_OPTIONS: { value: Q3Weather; label: string }[] = [
  { value: "essential", label: "Essential — must be covered" },
  { value: "preferred", label: "Preferred, but I'll sit uncovered for a better view" },
  { value: "dont_care", label: "Don't care either way" },
];

const Q4_OPTIONS: { value: Q4Group; label: string }[] = [
  { value: "solo_friends", label: "Solo or with friends" },
  { value: "family", label: "Family with young children" },
  { value: "accessibility", label: "Accessibility / mobility needs" },
];

const Q5_OPTIONS: { value: Q5OffTrack; label: string }[] = [
  { value: "fan_zones", label: "Fan zones, food trucks, merch" },
  { value: "lounge", label: "A comfortable lounge, food and drink included" },
  { value: "concerts", label: "Post-race concerts and nightlife" },
];

const Q7_OPTIONS: { value: Q7Budget; label: string }[] = [
  { value: "maximize", label: "Maximize the ticket — best view or hospitality possible" },
  { value: "balanced", label: "Balanced — good seat, budget left for the trip" },
  { value: "economy", label: "Economy — lowest price into the venue" },
];

interface Props {
  slug: string;
  eventId: string;
  eventName: string;
  eventSport: string;
  eventIsBuilt: boolean;
  showBudgetLink: boolean;
  seats: Seat[];
  signedInEmail: string | null;
  alreadyPurchased: boolean;
  fallbackExperienceSlug: string | null;
}

type PartialAnswers = Partial<QuizAnswers>;

const ANSWER_KEYS: (keyof QuizAnswers)[] = ["q1", "q2", "q3", "q4", "q5", "q7"];

function readAnswersFromParams(params: URLSearchParams): PartialAnswers {
  const out: PartialAnswers = {};
  for (const key of ANSWER_KEYS) {
    const v = params.get(key);
    if (v) (out as Record<string, string>)[key] = v;
  }
  return out;
}

// Resolves the sidebar's "from" context into a real href + label. "from" is
// one of: "picker" (main /ticket-intelligence page), "experience:<slug>"
// (an experience page), "spoke:<id>" (a spoke page, with ?fromLabel=<text>
// for its display name), or absent (default: the event hub page).
function resolveBackLink(
  params: URLSearchParams,
  slug: string,
  eventName: string
): { href: string; label: string } {
  const from = params.get("from");
  if (from === "picker") {
    return { href: "/ticket-intelligence", label: "← Back to all events" };
  }
  if (from?.startsWith("experience:")) {
    const experienceSlug = from.slice("experience:".length);
    if (experienceSlug) {
      return { href: `/experience/${experienceSlug}`, label: "← Back to this experience" };
    }
  }
  if (from?.startsWith("spoke:")) {
    const spokeId = from.slice("spoke:".length);
    const fromLabel = params.get("fromLabel");
    if (spokeId) {
      return {
        href: `/event-pack/${slug}/${spokeId}`,
        label: fromLabel ? `← Back to ${fromLabel}` : `← Back to ${eventName} guide`,
      };
    }
  }
  return { href: `/event-pack/${slug}`, label: `← Back to ${eventName} guide` };
}

export default function TicketQuiz({
  slug,
  eventId,
  eventName,
  eventSport,
  eventIsBuilt,
  showBudgetLink,
  seats,
  signedInEmail,
  alreadyPurchased,
  fallbackExperienceSlug,
}: Props) {
  const searchParams = useSearchParams();
  // Answers are restored from the URL on mount — required because signing
  // in mid-flow (the unlock step, for a fan who reached the paywall
  // without an account) is a full navigation to /sign-in and back, which
  // would otherwise lose this component's in-memory state entirely.
  const [answers, setAnswers] = useState<PartialAnswers>(() => readAnswersFromParams(searchParams));
  const [revealed, setRevealed] = useState(() => searchParams.get("revealed") === "1");
  // The retake value (a Date.now() timestamp, see RetakeLink.tsx — its
  // presence is what matters, not any specific value) is preserved for the
  // rest of this component's life once present, since the URL-sync effect
  // below rewrites the URL on every answer, and without this it would
  // silently drop retake= the moment Q1 is answered, breaking the escape
  // hatch on any subsequent reload/navigation.
  const retakeValue = useRef(searchParams.get("retake"));
  // Back-link needs to be context-aware — this page is reached from the
  // event hub (default, no param), the main /ticket-intelligence picker
  // (?from=picker), a specific experience (?from=experience:<slug>), or a
  // specific spoke (?from=spoke:<id>, with ?fromLabel=<text> for its
  // display name). Read once on mount, same pattern as retakeValue above,
  // so it survives the URL-sync effect rewriting the query string below.
  const backLink = useRef(resolveBackLink(searchParams, slug, eventName));

  useEffect(() => {
    const params = new URLSearchParams();
    for (const key of ANSWER_KEYS) {
      const v = answers[key];
      if (v) params.set(key, v);
    }
    if (revealed) params.set("revealed", "1");
    if (retakeValue.current) params.set("retake", retakeValue.current);
    const qs = params.toString();
    const url = qs ? `/ticket-intelligence/${slug}?${qs}` : `/ticket-intelligence/${slug}`;
    window.history.replaceState(null, "", url);
  }, [answers, revealed, slug]);

  const steps: { key: keyof QuizAnswers; label: string }[] = [
    { key: "q1", label: "What matters most in what you see?" },
    { key: "q2", label: "Fixed seat or flexible?" },
    { key: "q3", label: "Weather protection?" },
    { key: "q4", label: "Who's coming with you?" },
    { key: "q5", label: "What matters off the track?" },
    { key: "q7", label: "How do you want to spend your budget?" },
  ];

  const answeredCount = steps.filter((s) => answers[s.key] !== undefined).length;
  const complete = answeredCount === steps.length;

  const set = <K extends keyof QuizAnswers>(key: K, value: QuizAnswers[K]) => {
    setAnswers((prev) => ({ ...prev, [key]: value }));
  };

  if (revealed && complete) {
    const result = scoreSeats(seats, answers as QuizAnswers);
    // Answers travel through Dodo's return_url query string — no server
    // state, since the result is a one-time reveal with no persistence
    // (25 Sep 2026 decision). The result page re-runs the same pure
    // scoreSeats() function with these same answers after verifying
    // payment against the purchases table.
    const answerParams = new URLSearchParams({
      q1: answers.q1!,
      q2: answers.q2!,
      q3: answers.q3!,
      q4: answers.q4!,
      q5: answers.q5!,
      q7: answers.q7!,
    });
    const successUrl =
      typeof window !== "undefined"
        ? `${window.location.origin}/ticket-intelligence/${slug}/result?${answerParams.toString()}`
        : "";
    return (
      <TeaserResult
        eventName={eventName}
        eventId={eventId}
        eventSlug={slug}
        eventSport={eventSport}
        eventIsBuilt={eventIsBuilt}
        showBudgetLink={showBudgetLink}
        result={result}
        successUrl={successUrl}
        signedInEmail={signedInEmail}
        answers={answers as QuizAnswers}
        onEditAnswers={() => {
          setRevealed(false);
          window.scrollTo({ top: 0, behavior: "instant" });
        }}
        alreadyPurchased={alreadyPurchased}
        fallbackExperienceSlug={fallbackExperienceSlug}
      />
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-6 sm:px-8 py-16">
      {/* Eyebrow + back-link sit above the grid (not inside the main
          column) so the sidebar's top edge lines up with the h1 title row,
          not one row below it. Moved here 27 Sep 2026 after the founder
          flagged the same misalignment on the result page. */}
      <div className="flex items-center justify-between mb-4">
        <p className="text-sm font-black tracking-widest uppercase text-[#AAFF00]">
          Ticket Intelligence
        </p>
        <Link
          href={backLink.current.href}
          className="text-xs font-semibold text-[#6A6A6A] hover:text-[#AAFF00] underline transition-colors"
        >
          {backLink.current.label}
        </Link>
      </div>
      {/* Same grid pattern as SpokeShell.tsx / the result page — sidebar
          added here 27 Sep 2026 so "This Event" actions are available from
          the quiz entry point too, not just after purchase. */}
      <div className="grid lg:grid-cols-[1fr_300px] gap-14 items-start">
        <div className="max-w-2xl">
          <h1 className="text-3xl sm:text-4xl font-black text-white mb-3">
            Which is the best grandstand seat at {eventName.replace(/\s*\d{4}$/, "").trim()}?
          </h1>
          <p className="text-[#A3A3A3] text-base mb-4">
            {steps.length}{" "}
            quick questions. We&apos;ll match your answers against every real grandstand, lawn zone, and
            hospitality suite at this circuit — no fluff, just the seat that fits.
          </p>
          <p className="text-xs text-[#6A6A6A] mb-12">
            {answeredCount} of {steps.length} answered
          </p>

          <QuestionBlock
            eyebrow="Track action"
            question="What matters most in what you see?"
            options={Q1_OPTIONS}
            value={answers.q1}
            onSelect={(v) => set("q1", v)}
          />
          <QuestionBlock
            eyebrow="Seat style"
            question="Fixed seat or flexible?"
            options={Q2_OPTIONS}
            value={answers.q2}
            onSelect={(v) => set("q2", v)}
          />
          <QuestionBlock
            eyebrow="Weather"
            question="How important is weather protection?"
            options={Q3_OPTIONS}
            value={answers.q3}
            onSelect={(v) => set("q3", v)}
          />
          <QuestionBlock
            eyebrow="Group"
            question="Who's coming with you?"
            options={Q4_OPTIONS}
            value={answers.q4}
            onSelect={(v) => set("q4", v)}
          />
          <QuestionBlock
            eyebrow="Off-track"
            question="What matters when you're not watching the cars?"
            options={Q5_OPTIONS}
            value={answers.q5}
            onSelect={(v) => set("q5", v)}
          />
          <QuestionBlock
            eyebrow="Budget"
            question="How do you want to spend your budget?"
            options={Q7_OPTIONS}
            value={answers.q7}
            onSelect={(v) => set("q7", v)}
          />

          <button
            type="button"
            disabled={!complete}
            onClick={() => {
              setRevealed(true);
              // The teaser (and later, RetakeLink's fresh attempt) swaps
              // content in place client-side — without this, the fan lands
              // mid-page at whatever scroll position they were at while
              // answering Q7 (often the bottom of a long page), landing
              // somewhere in the middle of the teaser/result instead of its
              // top. Bug found live 25 Sep 2026.
              window.scrollTo({ top: 0, behavior: "instant" });
            }}
            className={
              complete
                ? "w-full mt-4 px-6 py-4 rounded-sm bg-[#AAFF00] text-black text-sm font-black hover:bg-[#BBFF33] transition-colors"
                : "w-full mt-4 px-6 py-4 rounded-sm bg-[#141414] border border-[#2A2A2A] text-[#6A6A6A] text-sm font-black cursor-not-allowed"
            }
          >
            {complete ? "See my match" : `Answer all ${steps.length} questions`}
          </button>
        </div>
        <TicketIntelligenceSidebar
          eventSlug={slug}
          eventId={eventId}
          sport={eventSport}
          isBuilt={eventIsBuilt}
          userEmail={signedInEmail}
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
