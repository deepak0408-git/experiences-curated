"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createNewBoard } from "../actions";

interface Props {
  onClose: () => void;
}

export default function NewBoardModal({ onClose }: Props) {
  const [title, setTitle] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!title.trim()) return;
    setLoading(true);
    setError(null);
    const result = await createNewBoard(title);
    setLoading(false);
    if (result.error) {
      setError(result.error === "upgrade_required"
        ? "Free accounts are limited to one board. Upgrade to Pro for unlimited boards."
        : result.error);
      return;
    }
    router.refresh();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="relative w-full max-w-sm bg-white rounded-2xl shadow-xl p-7 z-10">
        <h2 className="text-base font-bold text-neutral-900 mb-5">New board</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Board name"
            maxLength={120}
            autoFocus
            className="w-full px-4 py-2.5 rounded-xl border border-neutral-200 text-sm text-neutral-900 placeholder-neutral-400 focus:outline-none focus:border-neutral-400 transition-colors"
          />
          {error && (
            <div className="rounded-xl bg-neutral-50 border border-neutral-200 p-4">
              <p className="text-xs text-neutral-600 leading-5">{error}</p>
              {error.includes("Pro") && (
                <Link href="/pro" className="mt-2 inline-block text-xs font-semibold text-neutral-900 underline underline-offset-2 hover:text-neutral-600 transition-colors">
                  See Pro plans →
                </Link>
              )}
            </div>
          )}
          <div className="flex gap-2 pt-1">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2.5 rounded-xl border border-neutral-200 text-sm font-medium text-neutral-600 hover:border-neutral-400 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading || !title.trim()}
              className="flex-1 px-4 py-2.5 rounded-xl bg-neutral-900 text-white text-sm font-semibold hover:bg-neutral-700 transition-colors disabled:opacity-50"
            >
              {loading ? "Creating…" : "Create"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
