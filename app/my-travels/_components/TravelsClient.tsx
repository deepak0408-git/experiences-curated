"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import LogVisitModal from "./LogVisitModal";
import PostEventPrompt from "./PostEventPrompt";
import { deleteLog } from "../actions";

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

interface PromptEvent {
  eventName: string;
  eventId: string;
  eventEndDate: string;
  experiences: { id: string; title: string; heroImageUrl: string | null; experienceType: string; slug: string }[];
}

export default function TravelsClient({ logs, userEmail, promptEvent }: { logs: LogEntry[]; userEmail: string; promptEvent?: PromptEvent | null }) {
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

  const handlePromptLogged = (entry: LogEntry) => {
    setItems((prev) => {
      const without = prev.filter((l) => l.experienceId !== entry.experienceId);
      return [entry, ...without];
    });
  };

  const handleDelete = async (experienceId: string) => {
    setItems((prev) => prev.filter((l) => l.experienceId !== experienceId));
    await deleteLog(experienceId);
  };

  return (
    <div className="min-h-screen bg-[#0A0A0A]">
      <nav className="border-b border-[#2A2A2A] bg-[#0A0A0A]">
        <div className="max-w-5xl mx-auto px-6 sm:px-8 py-4 flex items-center justify-between">
          <Link href="/" className="text-xs sm:text-sm font-black tracking-widest uppercase text-[#6A6A6A] hover:text-[#AAFF00] transition-colors whitespace-nowrap">
            Experiences | Curated
          </Link>
          <div className="flex items-center gap-6">
            <Link href="/search" className="hidden sm:block text-sm text-[#6A6A6A] hover:text-[#AAFF00] transition-colors">Browse experiences</Link>
            <Link href="/trip-board" className="text-sm text-[#6A6A6A] hover:text-[#AAFF00] transition-colors whitespace-nowrap">Trip Board</Link>
            <span className="hidden sm:inline text-[#2A2A2A]">|</span>
            <Link
              href="/profile"
              className="flex items-center justify-center w-7 h-7 rounded-sm bg-[#2A2A2A] text-white text-xs font-black uppercase flex-shrink-0 hover:bg-[#AAFF00] hover:text-black transition-colors"
              aria-label="Profile"
              title={userEmail}
            >
              {userEmail[0]}
            </Link>
          </div>
        </div>
      </nav>

      <div className="max-w-5xl mx-auto px-6 sm:px-8 py-10">
        <div className="flex items-start justify-between mb-8">
          <div>
            <p className="text-sm font-semibold tracking-widest uppercase text-[#AAFF00] mb-3">My Travels</p>
            <h1 className="text-2xl font-black text-white">
              {items.length} experience{items.length !== 1 ? "s" : ""} visited
            </h1>
          </div>
          <button
            onClick={() => setShowModal(true)}
            className="px-4 py-2 rounded-sm bg-[#AAFF00] text-black text-xs font-black hover:bg-[#BBFF33] transition-colors"
          >
            + Log a visit
          </button>
        </div>

        {promptEvent && (
          <PostEventPrompt
            eventName={promptEvent.eventName}
            eventId={promptEvent.eventId}
            eventEndDate={promptEvent.eventEndDate}
            experiences={promptEvent.experiences}
            onLogged={handlePromptLogged}
          />
        )}

        {items.length === 0 ? (
          <div className="text-center py-24">
            <p className="text-sm font-black text-white mb-2">No visits logged yet</p>
            <p className="text-xs text-[#6A6A6A] mb-6">Start building your travel history.</p>
            <button
              onClick={() => setShowModal(true)}
              className="px-5 py-2.5 rounded-sm bg-[#AAFF00] text-black text-sm font-black hover:bg-[#BBFF33] transition-colors"
            >
              Log your first visit
            </button>
          </div>
        ) : (
          <div className="space-y-3">
            {items.map((log) => (
              <div key={log.id} className="rounded-sm border border-[#2A2A2A] bg-[#141414] overflow-hidden flex">
                <Link href={`/experience/${log.slug}`} className="block flex-shrink-0">
                  <div className="relative w-20 h-20 sm:w-24 sm:h-24 overflow-hidden bg-[#1A1A1A]">
                    {log.heroImageUrl ? (
                      <Image src={log.heroImageUrl} alt={log.title} fill className="object-cover hover:scale-105 transition-transform duration-300" sizes="96px" />
                    ) : (
                      <div className="w-full h-full bg-[#2A2A2A]" />
                    )}
                  </div>
                </Link>
                <div className="flex-1 min-w-0 px-3 py-2.5">
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0">
                      <span className="text-[10px] font-semibold tracking-widest uppercase text-[#6A6A6A]">
                        {TYPE_LABELS[log.experienceType] ?? log.experienceType}
                      </span>
                      <Link href={`/experience/${log.slug}`}>
                        <h3 className="text-sm font-black text-white hover:text-[#AAFF00] transition-colors mt-0.5 line-clamp-1">{log.title}</h3>
                      </Link>
                      <p className="text-xs text-[#6A6A6A] mt-0.5">
                        {new Date(log.visitedAt + "T12:00:00").toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" })}
                      </p>
                    </div>
                    <button
                      onClick={() => handleDelete(log.experienceId)}
                      className="flex-shrink-0 text-[#3A3A3A] hover:text-red-400 transition-colors mt-0.5"
                      aria-label="Remove"
                    >
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 16 16"><path d="M4 4l8 8M12 4l-8 8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg>
                    </button>
                  </div>
                  <div className="flex items-center gap-2 mt-1.5 flex-wrap">
                    <div className="flex items-center gap-0.5">
                      {[1,2,3,4,5].map((s) => (
                        <span key={s} className={`text-sm ${s <= log.rating ? "text-[#AAFF00]" : "text-[#2A2A2A]"}`}>★</span>
                      ))}
                    </div>
                    {log.moodTags.map((tag) => (
                      <span key={tag} className="px-2 py-0.5 rounded-sm border border-[#2A2A2A] text-[#6A6A6A] text-[10px] font-medium">{tag}</span>
                    ))}
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
