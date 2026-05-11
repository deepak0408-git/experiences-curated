"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import LogVisitModal from "./LogVisitModal";
import { deleteLog } from "../actions";
import SignOutButton from "@/app/_components/SignOutButton";

const TYPE_LABELS: Record<string, string> = {
  activity: "Activity", dining: "Dining", accommodation: "Stay",
  cultural_site: "Cultural Site", natural_wonder: "Natural Wonder",
  neighborhood: "Neighbourhood", day_trip: "Day Trip", multi_day: "Multi-day",
  sports_venue: "Sports Venue", fan_experience: "Fan Experience",
  transit: "Transit", event: "Event",
};

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

export default function TravelsClient({ logs, userEmail }: { logs: LogEntry[]; userEmail: string }) {
  const [showModal, setShowModal] = useState(false);
  const [items, setItems] = useState(logs);
  const router = useRouter();

  const handleSaved = (entry: LogEntry) => {
    setItems((prev) => {
      const without = prev.filter((l) => l.experienceId !== entry.experienceId);
      return [entry, ...without];
    });
    router.refresh();
  };

  const handleDelete = async (experienceId: string) => {
    setItems((prev) => prev.filter((l) => l.experienceId !== experienceId));
    await deleteLog(experienceId);
  };

  return (
    <div className="min-h-screen bg-white">
      <nav className="border-b border-neutral-100">
        <div className="max-w-5xl mx-auto px-6 sm:px-8 py-4 flex items-center justify-between">
          <Link href="/" className="text-sm font-semibold tracking-widest uppercase text-neutral-400 hover:text-neutral-600 transition-colors">
            Experiences | Curated
          </Link>
          <div className="flex items-center gap-6">
            <Link href="/search" className="text-sm text-neutral-500 hover:text-neutral-900 transition-colors">Browse experiences</Link>
            <Link href="/trip-board" className="text-sm text-neutral-500 hover:text-neutral-900 transition-colors">Trip Board</Link>
            <Link href="/profile" className="text-sm text-neutral-500 hover:text-neutral-900 transition-colors">My Profile</Link>
            <span className="text-neutral-200">|</span>
            <p className="text-xs text-neutral-400">{userEmail}</p>
            <SignOutButton />
          </div>
        </div>
      </nav>

      <div className="max-w-5xl mx-auto px-6 sm:px-8 py-10">
        <div className="flex items-start justify-between mb-8">
          <div>
            <p className="text-sm font-semibold tracking-widest uppercase text-neutral-400 mb-3">My Travels</p>
            <h1 className="text-2xl font-bold text-neutral-900">
              {items.length} experience{items.length !== 1 ? "s" : ""} visited
            </h1>
          </div>
          <button
            onClick={() => setShowModal(true)}
            className="px-4 py-2 rounded-full bg-neutral-900 text-white text-xs font-semibold hover:bg-neutral-700 transition-colors"
          >
            + Log a visit
          </button>
        </div>

        {items.length === 0 ? (
          <div className="text-center py-24">
            <p className="text-sm font-semibold text-neutral-900 mb-2">No visits logged yet</p>
            <p className="text-xs text-neutral-400 mb-6">Start building your travel history.</p>
            <button
              onClick={() => setShowModal(true)}
              className="px-5 py-2.5 rounded-full bg-neutral-900 text-white text-sm font-semibold hover:bg-neutral-700 transition-colors"
            >
              Log your first visit
            </button>
          </div>
        ) : (
          <div className="space-y-3">
            {items.map((log) => (
              <div key={log.id} className="rounded-xl border border-neutral-200 overflow-hidden flex">
                <Link href={`/experience/${log.slug}`} className="block flex-shrink-0">
                  <div className="w-24 h-24 overflow-hidden bg-neutral-100">
                    {log.heroImageUrl ? (
                      <img src={log.heroImageUrl} alt={log.title} className="w-full h-full object-cover hover:scale-105 transition-transform duration-300" />
                    ) : (
                      <div className="w-full h-full bg-neutral-200" />
                    )}
                  </div>
                </Link>
                <div className="flex-1 min-w-0 px-4 py-3 flex items-start justify-between gap-4">
                  <div className="min-w-0">
                    <span className="text-[10px] font-semibold tracking-widest uppercase text-neutral-400">
                      {TYPE_LABELS[log.experienceType] ?? log.experienceType}
                    </span>
                    <Link href={`/experience/${log.slug}`}>
                      <h3 className="text-sm font-semibold text-neutral-900 hover:text-neutral-600 transition-colors mt-0.5 line-clamp-1">{log.title}</h3>
                    </Link>
                    <p className="text-xs text-neutral-400 mt-0.5">
                      {new Date(log.visitedAt + "T12:00:00").toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" })}
                    </p>
                    {log.moodTags.length > 0 && (
                      <div className="flex flex-wrap gap-1 mt-1.5">
                        {log.moodTags.map((tag) => (
                          <span key={tag} className="px-2 py-0.5 rounded-full bg-neutral-100 text-neutral-500 text-[10px] font-medium">{tag}</span>
                        ))}
                      </div>
                    )}
                  </div>
                  <div className="flex items-center gap-3 flex-shrink-0">
                    <div className="flex items-center gap-0.5">
                      {[1,2,3,4,5].map((s) => (
                        <span key={s} className={`text-sm ${s <= log.rating ? "text-amber-400" : "text-neutral-200"}`}>★</span>
                      ))}
                    </div>
                    <button
                      onClick={() => handleDelete(log.experienceId)}
                      className="text-xs text-neutral-300 hover:text-red-400 transition-colors"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {showModal && <LogVisitModal onClose={() => setShowModal(false)} onSaved={handleSaved} />}
    </div>
  );
}
