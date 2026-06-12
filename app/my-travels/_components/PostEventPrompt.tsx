"use client";

import { useState, useTransition } from "react";
import { logVisit } from "../actions";

const MOOD_TAGS = [
  "loved it", "worth it", "overhyped", "would return",
  "not for me", "hidden gem", "perfect timing",
];

const TYPE_LABELS: Record<string, string> = {
  activity: "Activity", dining: "Dining", accommodation: "Stay",
  cultural_site: "Cultural Site", natural_wonder: "Natural Wonder",
  neighborhood: "Neighbourhood", day_trip: "Day Trip", multi_day: "Multi-day",
  sports_venue: "Sports Venue", fan_experience: "Fan Experience",
  transit: "Transit", event: "Event",
};

interface PromptExperience {
  id: string;
  title: string;
  heroImageUrl: string | null;
  experienceType: string;
  slug: string;
}

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
  eventName: string;
  eventId: string;
  eventEndDate: string;
  experiences: PromptExperience[];
  onLogged: (entry: LogEntry) => void;
}

interface InlineState {
  rating: number;
  moodTags: string[];
  saving: boolean;
  done: boolean;
}

export default function PostEventPrompt({ eventName, eventEndDate, experiences, onLogged }: Props) {
  const [dismissed, setDismissed] = useState(false);
  const [inline, setInline] = useState<Record<string, InlineState>>({});
  const [, startTransition] = useTransition();

  if (dismissed) return null;

  const setRating = (experienceId: string, rating: number) => {
    setInline((prev) => ({
      ...prev,
      [experienceId]: { rating, moodTags: prev[experienceId]?.moodTags ?? [], saving: false, done: false },
    }));
  };

  const toggleMood = (experienceId: string, tag: string) => {
    setInline((prev) => {
      const cur = prev[experienceId] ?? { rating: 0, moodTags: [], saving: false, done: false };
      const tags = cur.moodTags.includes(tag)
        ? cur.moodTags.filter((t) => t !== tag)
        : cur.moodTags.length < 3 ? [...cur.moodTags, tag] : cur.moodTags;
      return { ...prev, [experienceId]: { ...cur, moodTags: tags } };
    });
  };

  const handleSave = (exp: PromptExperience) => {
    const state = inline[exp.id];
    if (!state || state.rating === 0) return;
    setInline((prev) => ({ ...prev, [exp.id]: { ...state, saving: true } }));
    startTransition(async () => {
      const result = await logVisit({ experienceId: exp.id, visitedAt: eventEndDate, rating: state.rating, moodTags: state.moodTags });
      if (result.success && result.entry) {
        onLogged(result.entry);
        setInline((prev) => ({ ...prev, [exp.id]: { ...state, saving: false, done: true } }));
      }
    });
  };

  const pending = experiences.filter((e) => !inline[e.id]?.done);
  const doneCount = experiences.length - pending.length + Object.values(inline).filter((s) => s.done).length;

  return (
    <div className="mb-8 rounded-2xl border border-neutral-200 bg-neutral-50 overflow-hidden">
      <div className="px-5 py-4 flex items-start justify-between border-b border-neutral-200">
        <div>
          <p className="text-[10px] font-semibold tracking-widest uppercase text-neutral-400 mb-0.5">How was it?</p>
          <h2 className="text-sm font-bold text-neutral-900">Rate your {eventName} experiences</h2>
          {doneCount > 0 && (
            <p className="text-xs text-neutral-400 mt-0.5">{doneCount} of {experiences.length} rated</p>
          )}
        </div>
        <button
          onClick={() => setDismissed(true)}
          className="text-neutral-300 hover:text-neutral-600 transition-colors text-lg leading-none mt-0.5"
        >
          ×
        </button>
      </div>

      <div className="divide-y divide-neutral-200">
        {experiences.map((exp) => {
          const state = inline[exp.id] ?? { rating: 0, moodTags: [], saving: false, done: false };
          if (state.done) {
            return (
              <div key={exp.id} className="px-5 py-3 flex items-center gap-3 opacity-50">
                <div className="flex items-center gap-0.5">
                  {[1,2,3,4,5].map((s) => (
                    <span key={s} className={`text-sm ${s <= state.rating ? "text-amber-400" : "text-neutral-200"}`}>★</span>
                  ))}
                </div>
                <span className="text-xs text-neutral-500 line-clamp-1">{exp.title}</span>
                <span className="text-xs text-neutral-400 ml-auto flex-shrink-0">Saved ✓</span>
              </div>
            );
          }

          return (
            <div key={exp.id} className="px-5 py-3.5">
              <div className="flex items-center gap-3">
                {exp.heroImageUrl && (
                  <div className="w-10 h-10 rounded-lg overflow-hidden flex-shrink-0 bg-neutral-200">
                    <img src={exp.heroImageUrl} alt={exp.title} className="w-full h-full object-cover" />
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <p className="text-[10px] font-semibold tracking-widest uppercase text-neutral-400">
                    {TYPE_LABELS[exp.experienceType] ?? exp.experienceType}
                  </p>
                  <p className="text-xs font-semibold text-neutral-900 line-clamp-1">{exp.title}</p>
                </div>
                <div className="flex items-center gap-0.5 flex-shrink-0">
                  {[1,2,3,4,5].map((s) => (
                    <button
                      key={s}
                      onClick={() => setRating(exp.id, s)}
                      className={`text-xl transition-colors ${s <= state.rating ? "text-amber-400" : "text-neutral-200 hover:text-amber-300"}`}
                    >
                      ★
                    </button>
                  ))}
                </div>
              </div>

              {state.rating > 0 && (
                <div className="mt-3 pl-0">
                  <p className="text-[10px] font-semibold tracking-widest uppercase text-neutral-400 mb-1.5">
                    Mood tags <span className="font-normal normal-case tracking-normal">(optional, up to 3)</span>
                  </p>
                  <div className="flex flex-wrap gap-1.5 mb-3">
                    {MOOD_TAGS.map((tag) => (
                      <button
                        key={tag}
                        onClick={() => toggleMood(exp.id, tag)}
                        className={`px-2.5 py-1 rounded-full text-xs font-medium transition-colors ${
                          state.moodTags.includes(tag)
                            ? "bg-neutral-900 text-white"
                            : "bg-neutral-200 text-neutral-500 hover:bg-neutral-300"
                        }`}
                      >
                        {tag}
                      </button>
                    ))}
                  </div>
                  <button
                    onClick={() => handleSave(exp)}
                    disabled={state.saving}
                    className="px-4 py-1.5 rounded-full bg-neutral-900 text-white text-xs font-semibold hover:bg-neutral-700 disabled:opacity-40 transition-colors"
                  >
                    {state.saving ? "Saving…" : "Save"}
                  </button>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
