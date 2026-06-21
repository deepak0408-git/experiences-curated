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
  fan_experience: "bg-[#1A1A1A] text-[#AAFF00]",
  accommodation: "bg-[#1A1A1A] text-[#AAFF00]",
  dining: "bg-[#1A1A1A] text-[#AAFF00]",
  transit: "bg-[#1A1A1A] text-[#AAFF00]",
  sports_venue: "bg-[#1A1A1A] text-[#AAFF00]",
  neighborhood: "bg-[#1A1A1A] text-[#AAFF00]",
  day_trip: "bg-[#1A1A1A] text-[#AAFF00]",
  activity: "bg-[#1A1A1A] text-[#AAFF00]",
  cultural_site: "bg-[#1A1A1A] text-[#AAFF00]",
  multi_day: "bg-[#1A1A1A] text-[#AAFF00]",
  natural_wonder: "bg-[#1A1A1A] text-[#AAFF00]",
  event: "bg-[#1A1A1A] text-[#AAFF00]",
};

function RankRow({
  exp,
  value,
  onChange,
  onBlur,
}: {
  exp: RankerExperience;
  value: string;
  onChange: (id: string, value: string) => void;
  onBlur: (id: string) => void;
}) {
  return (
    <div className="flex items-center gap-4 py-3 border-b border-[#2A2A2A] last:border-0">
      <input
        type="number"
        min={1}
        max={99}
        value={value}
        onChange={(e) => onChange(exp.id, e.target.value)}
        onBlur={() => onBlur(exp.id)}
        placeholder="—"
        className="w-16 text-center rounded-sm border border-[#2A2A2A] bg-[#1A1A1A] px-2 py-1.5 text-sm font-semibold text-white focus:outline-none focus:ring-1 focus:ring-[#AAFF00] focus:border-[#AAFF00]"
      />
      <span
        className={`hidden sm:inline-block text-xs font-medium px-2 py-0.5 rounded-sm ${TYPE_COLORS[exp.experienceType] ?? "bg-[#1A1A1A] text-[#AAFF00]"}`}
      >
        {TYPE_LABELS[exp.experienceType] ?? exp.experienceType}
      </span>
      <span className="text-sm text-[#A3A3A3] flex-1">{exp.title}</span>
    </div>
  );
}

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
  const [committedRanks, setCommittedRanks] = useState(ranks);
  const [error, setError] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);

  const ranked = experiences
    .filter((e) => committedRanks[e.id] !== "")
    .sort((a, b) => parseInt(committedRanks[a.id]) - parseInt(committedRanks[b.id]));
  const unranked = experiences.filter((e) => committedRanks[e.id] === "");

  function handleChange(id: string, value: string) {
    setError(null);
    setSaved(false);
    setRanks((prev) => ({ ...prev, [id]: value }));
  }

  function handleBlur(id: string) {
    setCommittedRanks((prev) => ({ ...prev, [id]: ranks[id] }));
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

  return (
    <form onSubmit={handleSubmit}>
      {ranked.length > 0 && (
        <div className="mb-8">
          <p className="text-xs font-semibold tracking-widest uppercase text-[#AAFF00] mb-3">
            Ranked — {ranked.length}
          </p>
          <div className="rounded-sm border border-[#2A2A2A] bg-[#141414] px-5">
            {ranked.map((exp) => (
              <RankRow
                key={exp.id}
                exp={exp}
                value={ranks[exp.id] ?? ""}
                onChange={handleChange}
                onBlur={handleBlur}
              />
            ))}
          </div>
        </div>
      )}

      {unranked.length > 0 && (
        <div className="mb-8">
          <p className="text-xs font-semibold tracking-widest uppercase text-[#AAFF00] mb-3">
            Unranked — {unranked.length}
          </p>
          <div className="rounded-sm border border-dashed border-[#2A2A2A] bg-[#141414] px-5">
            {unranked.map((exp) => (
              <RankRow
                key={exp.id}
                exp={exp}
                value={ranks[exp.id] ?? ""}
                onChange={handleChange}
                onBlur={handleBlur}
              />
            ))}
          </div>
        </div>
      )}

      {error && (
        <div className="mb-4 rounded-sm border border-red-900 bg-red-950 px-4 py-3 text-sm text-red-400">
          {error}
        </div>
      )}

      {saved && (
        <div className="mb-4 rounded-sm border border-[#2A2A2A] bg-[#141414] px-4 py-3 text-sm text-[#AAFF00]">
          Ranks saved.
        </div>
      )}

      <button
        type="submit"
        disabled={isPending}
        className="px-6 py-2.5 rounded-sm bg-[#AAFF00] text-sm font-black text-black hover:bg-[#BBFF33] transition-colors disabled:opacity-50"
      >
        {isPending ? "Saving…" : "Save ranks"}
      </button>
    </form>
  );
}
