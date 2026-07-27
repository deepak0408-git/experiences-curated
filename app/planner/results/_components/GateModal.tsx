"use client";

import { useState } from "react";

export type GateTrigger =
  | { kind: "saved"; summaryLine: string }
  | { kind: "notified"; eventName: string };

function getModalCopy(trigger: GateTrigger): { title: string; body: string; cta: string; doneBody: string } {
  switch (trigger.kind) {
    case "saved":
      return {
        title: "Save your shortlist",
        body: `We'll email you this exact list — ${trigger.summaryLine} — so you don't lose it.`,
        cta: "Save my shortlist →",
        doneBody: "Check your inbox — it's on its way.",
      };
    case "notified":
      return {
        title: "Get notified",
        body: `We'll email you the moment the ${trigger.eventName} guide is live.`,
        cta: "Notify me →",
        // No email sends immediately here — the guide isn't live yet, so
        // there's nothing "on its way" right now. This confirms the request
        // was saved and sets the real expectation (an email once the pack
        // activates), rather than implying an inbox check will find
        // something today. Fixed 26 Jul 2026 after a live report that no
        // email arrived — the DB write was correct, only this copy was wrong.
        doneBody: `Got it — we'll email you the moment the ${trigger.eventName} guide is live.`,
      };
  }
}

export default function GateModal({
  trigger,
  onClose,
  onSubmit,
  userEmail,
  defaultEmail,
}: {
  trigger: GateTrigger;
  onClose: () => void;
  onSubmit: (email: string) => Promise<void>;
  userEmail: string | null;
  defaultEmail?: string | null;
}) {
  const [email, setEmail] = useState(userEmail ?? defaultEmail ?? "");
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const copy = getModalCopy(trigger);
  const isValidEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const handleSubmit = async () => {
    if (!isValidEmail || submitting) return;
    setSubmitting(true);
    await onSubmit(email);
    setSubmitting(false);
    setSubmitted(true);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm px-6">
      <div className="w-full max-w-sm rounded-sm bg-[#141414] border border-[#2A2A2A] p-6 relative">
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 text-[#6A6A6A] hover:text-white transition-colors"
          aria-label="Close"
        >
          ✕
        </button>

        {submitted ? (
          <>
            <p className="text-sm font-black tracking-widest uppercase text-[#AAFF00] mb-3">
              Trip Planner
            </p>
            <h2 className="text-lg font-black text-white mb-2 pr-6">Done</h2>
            <p className="text-sm text-[#A3A3A3]">{copy.doneBody}</p>
          </>
        ) : (
          <>
            <p className="text-sm font-black tracking-widest uppercase text-[#AAFF00] mb-3">
              Trip Planner
            </p>
            <h2 className="text-lg font-black text-white mb-3 pr-6">{copy.title}</h2>
            <p className="text-sm text-[#A3A3A3] mb-5">{copy.body}</p>

            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="your@email.com"
              readOnly={!!userEmail}
              className={
                userEmail
                  ? "w-full px-4 py-2.5 rounded-sm text-sm bg-[#0A0A0A] border border-[#2A2A2A] text-[#A3A3A3] cursor-not-allowed mb-4"
                  : "w-full px-4 py-2.5 rounded-sm text-sm bg-[#0A0A0A] border border-[#2A2A2A] text-white placeholder:text-[#6A6A6A] focus:outline-none focus:border-[#AAFF00] mb-4"
              }
            />

            <button
              type="button"
              onClick={handleSubmit}
              disabled={!isValidEmail || submitting}
              className="w-full px-4 py-2.5 rounded-sm text-sm font-black bg-[#AAFF00] text-black hover:bg-[#BBFF33] transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
            >
              {submitting ? "Saving…" : copy.cta}
            </button>
          </>
        )}
      </div>
    </div>
  );
}
