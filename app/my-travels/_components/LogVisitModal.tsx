"use client";

import { useState, useTransition, useRef, useEffect } from "react";
import { logVisit, searchExperiences } from "../actions";

const MOOD_TAGS = [
  "loved it", "worth it", "overhyped", "would return",
  "not for me", "hidden gem", "perfect timing",
];

interface LogEntry {
  id: string;
  experienceId: string;
  visitedAt: string;
  rating: number;
  moodTags: string[];
  title: string;
  slug: string;
  heroImageUrl: string | null;
  experienceType: string;
}

interface Props {
  onClose: () => void;
  onSaved: (entry: LogEntry) => void;
}

export default function LogVisitModal({ onClose, onSaved }: Props) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<{ id: string; title: string; experienceType: string; slug: string }[]>([]);
  const [selected, setSelected] = useState<{ id: string; title: string } | null>(null);
  const [visitedAt, setVisitedAt] = useState("");
  const [rating, setRating] = useState(0);
  const [moodTags, setMoodTags] = useState<string[]>([]);
  const [searching, setSearching] = useState(false);
  const [isPending, startTransition] = useTransition();
  const searchTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (!query.trim()) { setResults([]); return; }
    if (searchTimeout.current) clearTimeout(searchTimeout.current);
    searchTimeout.current = setTimeout(async () => {
      setSearching(true);
      const res = await searchExperiences(query);
      setResults(res);
      setSearching(false);
    }, 300);
  }, [query]);

  const toggleMood = (tag: string) => {
    setMoodTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : prev.length < 3 ? [...prev, tag] : prev
    );
  };

  const handleSubmit = () => {
    if (!selected || !visitedAt || rating === 0) return;
    startTransition(async () => {
      const result = await logVisit({ experienceId: selected.id, visitedAt, rating, moodTags });
      if (result.success && result.entry) {
        onSaved(result.entry);
      }
      onClose();
    });
  };

  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
      <div className="bg-[#141414] border border-[#2A2A2A] rounded-sm shadow-xl w-full max-w-md p-6">
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-base font-black text-white">Log a visit</h2>
          <button onClick={onClose} className="text-[#6A6A6A] hover:text-white transition-colors text-lg leading-none">×</button>
        </div>

        {/* Experience search */}
        {!selected ? (
          <div className="mb-4">
            <label className="text-xs font-semibold tracking-widest uppercase text-[#6A6A6A] mb-2 block">Experience</label>
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search experiences…"
              className="w-full px-3 py-2.5 rounded-sm border border-[#2A2A2A] bg-[#1A1A1A] text-sm text-white placeholder:text-[#6A6A6A] focus:outline-none focus:border-[#AAFF00] transition-colors"
              autoFocus
            />
            {searching && <p className="text-xs text-[#6A6A6A] mt-2">Searching…</p>}
            {results.length > 0 && (
              <div className="mt-1 border border-[#2A2A2A] rounded-sm overflow-hidden">
                {results.map((r) => (
                  <button
                    key={r.id}
                    onClick={() => { setSelected({ id: r.id, title: r.title }); setQuery(""); setResults([]); }}
                    className="w-full text-left px-3 py-2.5 text-sm text-[#A3A3A3] hover:text-white hover:bg-[#1A1A1A] transition-colors border-b border-[#2A2A2A] last:border-0"
                  >
                    {r.title}
                  </button>
                ))}
              </div>
            )}
          </div>
        ) : (
          <div className="mb-4 flex items-center justify-between rounded-sm bg-[#1A1A1A] border border-[#2A2A2A] px-3 py-2.5">
            <span className="text-sm font-medium text-white">{selected.title}</span>
            <button onClick={() => setSelected(null)} className="text-xs text-[#6A6A6A] hover:text-white transition-colors ml-3">Change</button>
          </div>
        )}

        {/* Date */}
        <div className="mb-4">
          <label className="text-xs font-semibold tracking-widest uppercase text-[#6A6A6A] mb-2 block">Date visited</label>
          <input
            type="date"
            value={visitedAt}
            onChange={(e) => setVisitedAt(e.target.value)}
            max={new Date().toISOString().split("T")[0]}
            className="w-full px-3 py-2.5 rounded-sm border border-[#2A2A2A] bg-[#1A1A1A] text-sm text-white focus:outline-none focus:border-[#AAFF00] transition-colors [color-scheme:dark]"
          />
        </div>

        {/* Rating */}
        <div className="mb-4">
          <label className="text-xs font-semibold tracking-widest uppercase text-[#6A6A6A] mb-2 block">Rating</label>
          <div className="flex items-center gap-1.5">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                onClick={() => setRating(star)}
                className={`text-2xl transition-colors ${star <= rating ? "text-[#AAFF00]" : "text-[#2A2A2A] hover:text-[#AAFF00]/50"}`}
              >
                ★
              </button>
            ))}
            {rating > 0 && <span className="text-xs text-[#6A6A6A] ml-1">{rating}/5</span>}
          </div>
        </div>

        {/* Mood tags */}
        <div className="mb-6">
          <label className="text-xs font-semibold tracking-widest uppercase text-[#6A6A6A] mb-2 block">Mood tags <span className="font-normal normal-case tracking-normal">(pick up to 3)</span></label>
          <div className="flex flex-wrap gap-1.5">
            {MOOD_TAGS.map((tag) => (
              <button
                key={tag}
                onClick={() => toggleMood(tag)}
                className={`px-2.5 py-1 rounded-sm text-xs font-medium transition-colors ${
                  moodTags.includes(tag)
                    ? "bg-[#AAFF00] text-black"
                    : "bg-[#1A1A1A] border border-[#2A2A2A] text-[#A3A3A3] hover:border-[#AAFF00] hover:text-white"
                }`}
              >
                {tag}
              </button>
            ))}
          </div>
        </div>

        <button
          onClick={handleSubmit}
          disabled={!selected || !visitedAt || rating === 0 || isPending}
          className="w-full px-4 py-3 rounded-sm bg-[#AAFF00] text-black text-sm font-black hover:bg-[#BBFF33] disabled:opacity-40 transition-colors"
        >
          {isPending ? "Saving…" : "Save visit"}
        </button>
      </div>
    </div>
  );
}
