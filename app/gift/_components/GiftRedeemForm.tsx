"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

type Event = {
  id: string;
  name: string;
  slug: string;
  heroImageUrl: string | null;
  startDate: string;
};

export default function GiftRedeemForm({
  events,
  isSignedIn,
  ownedEventIds,
}: {
  events: Event[];
  isSignedIn: boolean;
  ownedEventIds: string[];
}) {
  const router = useRouter();
  const [code, setCode] = useState("");
  const [selectedEventId, setSelectedEventId] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "error" | "success">("idle");
  const [errorMsg, setErrorMsg] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!code.trim() || !selectedEventId || status === "loading") return;

    setStatus("loading");
    setErrorMsg("");

    try {
      const res = await fetch("/api/gift-codes/redeem", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code: code.trim(), sportingEventId: selectedEventId }),
      });
      const data = await res.json();

      if (res.status === 409) {
        // Already owns pack — send them there
        router.push(`/event-pack/${data.slug}`);
        return;
      }

      if (!res.ok) {
        setErrorMsg(data.error ?? "Something went wrong. Try again.");
        setStatus("error");
        return;
      }

      setStatus("success");
      setTimeout(() => router.push(`/event-pack/${data.slug}`), 1800);
    } catch {
      setErrorMsg("Something went wrong. Try again.");
      setStatus("error");
    }
  }

  if (!isSignedIn) {
    return (
      <div className="bg-[#141414] border border-[#2A2A2A] rounded-sm p-6">
        <p className="text-sm text-[#A3A3A3] mb-4">Sign in first — your gift will be linked to your account.</p>
        <Link
          href={`/sign-in?next=/gift`}
          className="inline-flex px-5 py-2.5 rounded-sm bg-[#AAFF00] text-black text-sm font-black hover:bg-[#BBFF33] transition-colors"
        >
          Sign in to redeem
        </Link>
      </div>
    );
  }

  if (status === "success") {
    return (
      <div className="bg-[#141414] border border-[#AAFF00]/30 rounded-sm p-6">
        <p className="text-[#AAFF00] font-black text-lg mb-1">Gift redeemed.</p>
        <p className="text-sm text-[#A3A3A3]">Taking you to your pack now…</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Code input */}
      <div>
        <label className="block text-xs font-semibold tracking-widest uppercase text-[#6A6A6A] mb-2">
          Gift code
        </label>
        <input
          type="text"
          value={code}
          onChange={e => setCode(e.target.value.toUpperCase())}
          placeholder="XXXX-XXXX"
          maxLength={9}
          className="w-full bg-[#1A1A1A] border border-[#2A2A2A] rounded-sm px-4 py-3 text-base font-mono font-black text-white placeholder-[#3A3A3A] tracking-widest focus:outline-none focus:border-[#AAFF00] transition-colors uppercase"
        />
      </div>

      {/* Event selector */}
      <div>
        <label className="block text-xs font-semibold tracking-widest uppercase text-[#6A6A6A] mb-2">
          Choose your event pack
        </label>
        <div className="space-y-2">
          {events.map((event) => {
            const owned = ownedEventIds.includes(event.id);
            const selected = selectedEventId === event.id;
            return (
              <button
                key={event.id}
                type="button"
                onClick={() => !owned && setSelectedEventId(event.id)}
                disabled={owned}
                className={`w-full text-left flex items-center gap-4 rounded-sm border px-4 py-3 transition-colors ${
                  owned
                    ? "border-[#2A2A2A] bg-[#141414] opacity-40 cursor-not-allowed"
                    : selected
                    ? "border-[#AAFF00] bg-[#141414]"
                    : "border-[#2A2A2A] bg-[#141414] hover:border-[#3A3A3A]"
                }`}
              >
                {selected
                  ? <span className="w-3 h-3 rounded-full bg-[#AAFF00] flex-shrink-0" />
                  : <span className="w-3 h-3 rounded-full border border-[#3A3A3A] flex-shrink-0" />
                }
                <div>
                  <p className="text-sm font-black text-white">{event.name}</p>
                  <p className="text-xs text-[#6A6A6A] mt-0.5">
                    {owned
                      ? "Already in your library"
                      : new Date(event.startDate).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" })
                    }
                  </p>
                </div>
              </button>
            );
          })}
          {events.length === 0 && (
            <p className="text-sm text-[#6A6A6A]">No upcoming events available right now.</p>
          )}
        </div>
      </div>

      {errorMsg && (
        <p className="text-sm text-red-400">{errorMsg}</p>
      )}

      <button
        type="submit"
        disabled={!code.trim() || !selectedEventId || status === "loading"}
        className="w-full py-3 rounded-sm bg-[#AAFF00] text-black text-sm font-black hover:bg-[#BBFF33] transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
      >
        {status === "loading" ? "Redeeming…" : "Redeem gift"}
      </button>
    </form>
  );
}
