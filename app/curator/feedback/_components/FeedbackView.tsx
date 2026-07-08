"use client";

import { useState, useMemo } from "react";

type SummaryRow = {
  eventId: string;
  eventName: string;
  eventSlug: string;
  responses: number;
  avgRating: number;
  commentsCount: number;
};

type CommentRow = {
  id: string;
  email: string;
  rating: number;
  comment: string | null;
  displayConsent: boolean;
  createdAt: Date;
  eventName: string;
  eventSlug: string;
};

function formatDate(d: Date) {
  return new Date(d).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });
}

export default function FeedbackView({
  summary,
  comments,
}: {
  summary: SummaryRow[];
  comments: CommentRow[];
}) {
  const [selectedSlug, setSelectedSlug] = useState<string>("all");

  const filteredSummary = useMemo(
    () => (selectedSlug === "all" ? summary : summary.filter((r) => r.eventSlug === selectedSlug)),
    [summary, selectedSlug]
  );

  const filteredComments = useMemo(
    () => (selectedSlug === "all" ? comments : comments.filter((c) => c.eventSlug === selectedSlug)),
    [comments, selectedSlug]
  );

  return (
    <div>
      {/* Event filter */}
      <div className="mb-6 flex items-center gap-3">
        <label htmlFor="event-filter" className="text-xs font-semibold tracking-widest uppercase text-[#AAFF00]">
          Event
        </label>
        <select
          id="event-filter"
          value={selectedSlug}
          onChange={(e) => setSelectedSlug(e.target.value)}
          className="rounded-sm border border-[#2A2A2A] bg-[#141414] text-white text-sm px-3 py-2 focus:outline-none focus:border-[#AAFF00]"
        >
          <option value="all">All events</option>
          {summary.map((row) => (
            <option key={row.eventSlug} value={row.eventSlug}>
              {row.eventName}
            </option>
          ))}
        </select>
      </div>

      {/* Summary table */}
      <div className="mb-10">
        <p className="text-xs font-semibold tracking-widest uppercase text-[#AAFF00] mb-3">
          Summary by event
        </p>
        {filteredSummary.length === 0 ? (
          <p className="text-sm text-[#6A6A6A]">No feedback received yet.</p>
        ) : (
          <>
            {/* Desktop table */}
            <div className="hidden sm:block rounded-sm border border-[#2A2A2A] overflow-hidden">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-[#2A2A2A] bg-[#141414]">
                    <th className="text-left px-4 py-3 text-xs font-semibold tracking-widest uppercase text-[#AAFF00]">Event</th>
                    <th className="text-center px-4 py-3 text-xs font-semibold tracking-widest uppercase text-[#AAFF00] w-32">Responses</th>
                    <th className="text-center px-4 py-3 text-xs font-semibold tracking-widest uppercase text-[#AAFF00] w-32">Avg rating</th>
                    <th className="text-center px-4 py-3 text-xs font-semibold tracking-widest uppercase text-[#AAFF00] w-32">Comments</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredSummary.map((row, i) => (
                    <tr
                      key={row.eventId}
                      className={`border-b border-[#2A2A2A] last:border-0 ${i % 2 === 0 ? "bg-[#0A0A0A]" : "bg-[#141414]"}`}
                    >
                      <td className="px-4 py-3 font-medium text-white">{row.eventName}</td>
                      <td className="px-4 py-3 text-center text-[#6A6A6A]">{row.responses}</td>
                      <td className="px-4 py-3 text-center text-[#AAFF00] font-black">{row.avgRating ?? "—"}</td>
                      <td className="px-4 py-3 text-center text-[#6A6A6A]">{row.commentsCount}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile stacked cards */}
            <div className="flex flex-col gap-2.5 sm:hidden">
              {filteredSummary.map((row) => (
                <div key={row.eventId} className="rounded-sm border border-[#2A2A2A] bg-[#141414] p-3">
                  <p className="font-medium text-white text-sm mb-2">{row.eventName}</p>
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-[#6A6A6A]">{row.responses} responses</span>
                    <span className="text-[#AAFF00] font-black">{row.avgRating ?? "—"} avg</span>
                    <span className="text-[#6A6A6A]">{row.commentsCount} comments</span>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>

      {/* Comments list */}
      <div>
        <p className="text-xs font-semibold tracking-widest uppercase text-[#AAFF00] mb-3">
          Comments
        </p>
        {filteredComments.length === 0 ? (
          <p className="text-sm text-[#6A6A6A]">No comments left yet.</p>
        ) : (
          <div className="flex flex-col gap-3">
            {filteredComments.map((c) => (
              <div key={c.id} className="rounded-sm border border-[#2A2A2A] bg-[#141414] p-4">
                <div className="flex items-center justify-between mb-2 flex-wrap gap-2">
                  <div className="flex items-center gap-2">
                    <span className="text-[#AAFF00] font-black text-sm">{"★".repeat(c.rating)}</span>
                    <span className="text-[#6A6A6A] text-xs">{c.eventName}</span>
                  </div>
                  <span className="text-xs text-[#6A6A6A]">{formatDate(c.createdAt)}</span>
                </div>
                <p className="text-sm text-white/90 leading-relaxed mb-2">{c.comment}</p>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-[#6A6A6A]">{c.email}</span>
                  {c.displayConsent && (
                    <span className="inline-block px-2 py-0.5 rounded-sm bg-[#AAFF00]/10 text-[#AAFF00] border border-[#AAFF00]/30 text-[10px] font-semibold">
                      Consented to display
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
