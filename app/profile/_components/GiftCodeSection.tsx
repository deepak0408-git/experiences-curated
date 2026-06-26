"use client";

import { useState } from "react";

type GiftCode = {
  id: string;
  code: string;
  claimedByEmail: string | null;
  expiresAt: string;
};

export default function GiftCodeSection() {
  const [gift, setGift] = useState<GiftCode | null>(null);
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function generate() {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/gift-codes/generate", { method: "POST" });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Failed to generate code.");
      setGift(data.code);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Something went wrong.");
    } finally {
      setLoading(false);
    }
  }

  async function copy() {
    if (!gift) return;
    await navigator.clipboard.writeText(gift.code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  const expDate = gift ? new Date(gift.expiresAt).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" }) : "";

  return (
    <div>
      <div className="flex items-center justify-between mb-1">
        <p className="text-xs font-semibold tracking-widest uppercase text-[#AAFF00]">Gift a pack</p>
      </div>
      <p className="text-sm text-[#A3A3A3] mb-4 leading-relaxed">
        As a Pro member you get one free gift code per year — your recipient can use it to claim any live event pack, on us.
      </p>

      {!gift ? (
        <button
          onClick={generate}
          disabled={loading}
          className="px-5 py-2.5 rounded-sm bg-[#AAFF00] text-black text-sm font-black hover:bg-[#BBFF33] transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
        >
          {loading ? "Generating…" : "Generate gift code"}
        </button>
      ) : gift.claimedByEmail ? (
        <div className="bg-[#1A1A1A] border border-[#2A2A2A] rounded-sm px-4 py-3">
          <p className="text-xs text-[#6A6A6A] mb-1">Your gift code</p>
          <p className="text-base font-mono font-black text-[#6A6A6A] line-through">{gift.code}</p>
          <p className="text-xs text-[#6A6A6A] mt-1">Redeemed — your gift has been claimed.</p>
        </div>
      ) : (
        <div className="bg-[#1A1A1A] border border-[#2A2A2A] rounded-sm px-4 py-3">
          <p className="text-xs text-[#6A6A6A] mb-2">Your gift code — valid until {expDate}</p>
          <div className="flex items-center gap-3">
            <p className="text-xl font-mono font-black text-white tracking-widest">{gift.code}</p>
            <button
              onClick={copy}
              className="text-xs font-semibold text-[#AAFF00] hover:text-[#BBFF33] transition-colors"
            >
              {copied ? "Copied!" : "Copy"}
            </button>
          </div>
          <p className="text-xs text-[#6A6A6A] mt-2">
            Share this code with anyone — they&apos;ll enter it at{" "}
            <span className="text-[#A3A3A3]">experiences-curated.com/gift</span> to claim any live event pack.
          </p>
        </div>
      )}

      {error && <p className="text-xs text-red-400 mt-2">{error}</p>}
    </div>
  );
}
