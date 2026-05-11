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
    <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6">
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-base font-bold text-neutral-900">Log a visit</h2>
          <button onClick={onClose} className="text-neutral-400 hover:text-neutral-700 transition-colors text-lg leading-none">×</button>
        </div>

        {/* Experience search */}
        {!selected ? (
          <div className="mb-4">
            <label className="text-xs font-semibold tracking-widest uppercase text-neutral-400 mb-2 block">Experience</label>
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search experiences…"
              className="w-full px-3 py-2.5 rounded-lg border border-neutral-200 text-sm text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:border-neutral-400 transition-colors"
              autoFocus
            />
            {searching && <p className="text-xs text-neutral-400 mt-2">Searching…</p>}
            {results.length > 0 && (
              <div className="mt-1 border border-neutral-200 rounded-xl overflow-hidden">
                {results.map((r) => (
                  <button
                    key={r.id}
                    onClick={() => { setSelected({ id: r.id, title: r.title }); setQuery(""); setResults([]); }}
                    className="w-full text-left px-3 py-2.5 text-sm text-neutral-700 hover:bg-neutral-50 transition-colors border-b border-neutral-100 last:border-0"
                  >
                    {r.title}
                  </button>
                ))}
              </div>
            )}
          </div>
        ) : (
          <div className="mb-4 flex items-center justify-between rounded-lg bg-neutral-50 border border-neutral-200 px-3 py-2.5">
            <span className="text-sm font-medium text-neutral-900">{selected.title}</span>
            <button onClick={() => setSelected(null)} className="text-xs text-neutral-400 hover:text-neutral-700 transition-colors ml-3">Change</button>
          </div>
        )}

        {/* Date */}
        <div className="mb-4">
          <label className="text-xs font-semibold tracking-widest uppercase text-neutral-400 mb-2 block">Date visited</label>
          <input
            type="date"
            value={visitedAt}
            onChange={(e) => setVisitedAt(e.target.value)}
            max={new Date().toISOString().split("T")[0]}
            className="w-full px-3 py-2.5 rounded-lg border border-neutral-200 text-sm text-neutral-900 focus:outline-none focus:border-neutral-400 transition-colors"
          />
        </div>

        {/* Rating */}
        <div className="mb-4">
          <label className="text-xs font-semibold tracking-widest uppercase text-neutral-400 mb-2 block">Rating</label>
          <div className="flex items-center gap-1.5">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                onClick={() => setRating(star)}
                className={`text-2xl transition-colors ${star <= rating ? "text-amber-400" : "text-neutral-200 hover:text-amber-300"}`}
              >
                ★
              </button>
            ))}
            {rating > 0 && <span className="text-xs text-neutral-400 ml-1">{rating}/5</span>}
          </div>
        </div>

        {/* Mood tags */}
        <div className="mb-6">
          <label className="text-xs font-semibold tracking-widest uppercase text-neutral-400 mb-2 block">Mood tags <span className="font-normal normal-case tracking-normal">(pick up to 3)</span></label>
          <div className="flex flex-wrap gap-1.5">
            {MOOD_TAGS.map((tag) => (
              <button
                key={tag}
                onClick={() => toggleMood(tag)}
                className={`px-2.5 py-1 rounded-full text-xs font-medium transition-colors ${
                  moodTags.includes(tag)
                    ? "bg-neutral-900 text-white"
                    : "bg-neutral-100 text-neutral-500 hover:bg-neutral-200"
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
          className="w-full px-4 py-3 rounded-lg bg-neutral-900 text-white text-sm font-semibold hover:bg-neutral-700 disabled:opacity-40 transition-colors"
        >
          {isPending ? "Saving…" : "Save visit"}
        </button>
      </div>
    </div>
  );
}
