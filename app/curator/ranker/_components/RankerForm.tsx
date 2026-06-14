"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { saveRanks } from "../actions";
import type { RankerExperience } from "../actions";

const TYPE_LABELS: Record<string, string> = {
  fan_experience: "Fan Experience",
  accommodation: "Stay",
  dining: "Dining",
  transit: "Getting There",
  sports_venue: "Sports Venue",
  neighborhood: "Neighbourhood",
  day_trip: "Day Trip",
  activity: "Activity",
  cultural_site: "Cultural Site",
  multi_day: "Multi-day",
  natural_wonder: "Nature",
  event: "Event",
};

const TYPE_COLORS: Record<string, string> = {
  fan_experience: "bg-purple-100 text-purple-700",
  accommodation: "bg-blue-100 text-blue-700",
  dining: "bg-orange-100 text-orange-700",
  transit: "bg-neutral-100 text-neutral-600",
  sports_venue: "bg-green-100 text-green-700",
  neighborhood: "bg-teal-100 text-teal-700",
  day_trip: "bg-teal-100 text-teal-700",
  activity: "bg-yellow-100 text-yellow-700",
  cultural_site: "bg-pink-100 text-pink-700",
  multi_day: "bg-indigo-100 text-indigo-700",
  natural_wonder: "bg-emerald-100 text-emerald-700",
  event: "bg-red-100 text-red-700",
};

export default function RankerForm({
  eventId,
  experiences,
}: {
  eventId: string;
  experiences: RankerExperience[];
}) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [ranks, setRanks] = useState<Record<string, string>>(() => {
    const init: Record<string, string> = {};
    for (const e of experiences) {
      init[e.id] = e.packRank !== null && e.packRank !== undefined ? String(e.packRank) : "";
    }
    return init;
  });
  const [error, setError] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);

  const ranked = experiences
    .filter((e) => ranks[e.id] !== "")
    .sort((a, b) => parseInt(ranks[a.id]) - parseInt(ranks[b.id]));
  const unranked = experiences.filter((e) => ranks[e.id] === "");

  function handleChange(id: string, value: string) {
    setError(null);
    setSaved(false);
    setRanks((prev) => ({ ...prev, [id]: value }));
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSaved(false);

    startTransition(async () => {
      const result = await saveRanks(
        eventId,
        experiences.map((exp) => ({ experienceId: exp.id, rank: ranks[exp.id] ?? "" }))
      );
      if ("error" in result) {
        setError(result.error);
      } else {
        setSaved(true);
        router.refresh();
      }
    });
  }

  const RankRow = ({ exp }: { exp: RankerExperience }) => (
    <div className="flex items-center gap-4 py-3 border-b border-neutral-100 last:border-0">
      <input
        type="number"
        min={1}
        max={99}
        value={ranks[exp.id] ?? ""}
        onChange={(e) => handleChange(exp.id, e.target.value)}
        placeholder="—"
        className="w-16 text-center rounded-md border border-neutral-200 px-2 py-1.5 text-sm font-semibold text-neutral-900 focus:outline-none focus:ring-2 focus:ring-neutral-900 focus:border-transparent"
      />
      <span
        className={`hidden sm:inline-block text-xs font-medium px-2 py-0.5 rounded-full ${TYPE_COLORS[exp.experienceType] ?? "bg-neutral-100 text-neutral-600"}`}
      >
        {TYPE_LABELS[exp.experienceType] ?? exp.experienceType}
      </span>
      <span className="text-sm text-neutral-900 flex-1">{exp.title}</span>
    </div>
  );

  return (
    <form onSubmit={handleSubmit}>
      {ranked.length > 0 && (
        <div className="mb-8">
          <p className="text-xs font-semibold tracking-widest uppercase text-neutral-400 mb-3">
            Ranked — {ranked.length}
          </p>
          <div className="rounded-xl border border-neutral-200 bg-white px-5">
            {ranked.map((exp) => (
              <RankRow key={exp.id} exp={exp} />
            ))}
          </div>
        </div>
      )}

      {unranked.length > 0 && (
        <div className="mb-8">
          <p className="text-xs font-semibold tracking-widest uppercase text-neutral-400 mb-3">
            Unranked — {unranked.length}
          </p>
          <div className="rounded-xl border border-dashed border-neutral-300 bg-white px-5">
            {unranked.map((exp) => (
              <RankRow key={exp.id} exp={exp} />
            ))}
          </div>
        </div>
      )}

      {error && (
        <div className="mb-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      {saved && (
        <div className="mb-4 rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700">
          Ranks saved.
        </div>
      )}

      <button
        type="submit"
        disabled={isPending}
        className="px-6 py-2.5 rounded-lg bg-neutral-900 text-sm font-medium text-white hover:bg-neutral-700 transition-colors disabled:opacity-50"
      >
        {isPending ? "Saving…" : "Save ranks"}
      </button>
    </form>
  );
}
