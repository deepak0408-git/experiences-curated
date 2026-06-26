"use client";

import { useState } from "react";

export default function AskCuratorForm({ eventName }: { eventName: string }) {
  const [question, setQuestion] = useState("");
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!question.trim() || status === "sending") return;
    setStatus("sending");

    try {
      const res = await fetch("/api/curator-qa", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question, eventName }),
      });
      if (!res.ok) throw new Error();
      setStatus("sent");
      setQuestion("");
    } catch {
      setStatus("error");
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <textarea
        value={question}
        onChange={e => setQuestion(e.target.value)}
        placeholder="Ask anything about this pack — venues, logistics, what's worth it, what to skip..."
        rows={4}
        maxLength={1000}
        disabled={status === "sending" || status === "sent"}
        className="w-full bg-[#1A1A1A] border border-[#2A2A2A] rounded-sm px-4 py-3 text-sm text-white placeholder-[#6A6A6A] resize-none focus:outline-none focus:border-[#AAFF00] transition-colors disabled:opacity-50"
      />
      <div className="flex items-center justify-between gap-4">
        <p className="text-xs text-[#6A6A6A]">
          {status === "sent"
            ? "Question sent — expect a reply within 48 hours."
            : status === "error"
            ? "Something went wrong. Try again or email hello@experiences-curated.com."
            : "Replies come directly to your inbox within 48 hrs."}
        </p>
        {status !== "sent" && (
          <button
            type="submit"
            disabled={!question.trim() || status === "sending"}
            className="flex-shrink-0 px-5 py-2.5 rounded-sm bg-[#AAFF00] text-black text-sm font-black hover:bg-[#BBFF33] transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
          >
            {status === "sending" ? "Sending…" : "Send question"}
          </button>
        )}
      </div>
    </form>
  );
}
