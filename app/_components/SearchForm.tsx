"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export default function SearchForm({ overlay = false }: { overlay?: boolean }) {
  const router = useRouter();
  const [q, setQ] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    router.push(`/search?q=${encodeURIComponent(q)}`);
  };

  return (
    <form onSubmit={handleSubmit} className="hidden sm:flex items-center gap-2">
      <div className="relative">
        <svg className={`absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 pointer-events-none ${overlay ? "text-white/60" : "text-neutral-400"}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z" />
        </svg>
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          type="text"
          placeholder="Search experiences…"
          className={`pl-8 pr-4 py-1.5 rounded-full border text-sm focus:outline-none transition-colors w-44 ${
            overlay
              ? "border-white/30 bg-white/10 text-white placeholder:text-white/50 focus:border-white/60 focus:bg-white/20"
              : "border-neutral-200 bg-white text-neutral-900 placeholder:text-neutral-400 focus:border-neutral-400"
          }`}
        />
      </div>
    </form>
  );
}
