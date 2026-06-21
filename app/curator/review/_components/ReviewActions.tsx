"use client";

import { useState, useTransition } from "react";
import {
  publishExperience,
  archiveExperience,
  unpublishExperience,
  returnToDraft,
  submitForReview,
} from "../actions";

export function ReviewActions({
  id,
  status,
  slug,
}: {
  id: string;
  status: string;
  slug: string;
}) {
  const [isPending, startTransition] = useTransition();
  const [returning, setReturning] = useState(false);
  const [notes, setNotes] = useState("");

  const btn =
    "px-3 py-1.5 rounded-sm text-xs font-medium transition-colors disabled:opacity-40";

  function handleReturn() {
    startTransition(async () => {
      await returnToDraft(id, notes);
      setReturning(false);
      setNotes("");
    });
  }

  return (
    <div className="flex flex-col items-start sm:items-end gap-2">
      <div className="flex items-center gap-2">
        <a
          href={`/experience/${slug}`}
          target="_blank"
          className={`${btn} border border-[#2A2A2A] text-[#6A6A6A] hover:border-[#AAFF00] hover:text-[#AAFF00]`}
        >
          Preview ↗
        </a>

        {status === "draft" && (
          <a
            href={`/curator/submit/${id}`}
            className={`${btn} border border-[#2A2A2A] text-[#6A6A6A] hover:border-[#AAFF00] hover:text-[#AAFF00]`}
          >
            Edit
          </a>
        )}

        {status === "draft" && (
          <button
            disabled={isPending}
            onClick={() => startTransition(() => submitForReview(id))}
            className={`${btn} border border-blue-400/30 text-blue-400 hover:border-blue-400 hover:text-blue-300`}
          >
            Submit for Review
          </button>
        )}

        {(status === "draft" || status === "in_review") && (
          <button
            disabled={isPending}
            onClick={() => startTransition(() => publishExperience(id))}
            className={`${btn} border border-[#AAFF00]/30 text-[#AAFF00] hover:border-[#AAFF00] hover:bg-[#AAFF00] hover:text-black`}
          >
            Publish
          </button>
        )}

        {status === "in_review" && !returning && (
          <button
            disabled={isPending}
            onClick={() => setReturning(true)}
            className={`${btn} border border-amber-400/30 text-amber-400 hover:border-amber-400`}
          >
            Return
          </button>
        )}

        {status === "published" && (
          <>
            <button
              disabled={isPending}
              onClick={() => startTransition(() => unpublishExperience(id))}
              className={`${btn} border border-[#2A2A2A] text-[#6A6A6A] hover:border-[#AAFF00] hover:text-[#AAFF00]`}
            >
              Unpublish
            </button>
            <button
              disabled={isPending}
              onClick={() => startTransition(() => archiveExperience(id))}
              className={`${btn} border border-red-400/30 text-red-400 hover:border-red-400`}
            >
              Archive
            </button>
          </>
        )}

        {(status === "draft" || status === "in_review") && (
          <button
            disabled={isPending}
            onClick={() => startTransition(() => archiveExperience(id))}
            className={`${btn} border border-red-400/30 text-red-400 hover:border-red-400`}
          >
            Reject
          </button>
        )}
      </div>

      {/* Inline return-with-feedback form */}
      {returning && (
        <div className="w-80 bg-[#141414] border border-amber-400/30 rounded-sm p-4 space-y-3">
          <p className="text-xs font-semibold text-amber-400">
            Return to curator — what needs fixing?
          </p>
          <textarea
            autoFocus
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="e.g. The 'why it's special' section needs more personal detail. The getting there instructions are incomplete — which platform at Flinders Street?"
            rows={4}
            className="w-full text-xs rounded-sm border border-[#2A2A2A] bg-[#1A1A1A] px-3 py-2 text-[#A3A3A3] placeholder:text-[#6A6A6A] focus:outline-none focus:border-amber-400 resize-none"
          />
          <div className="flex gap-2 justify-end">
            <button
              type="button"
              onClick={() => { setReturning(false); setNotes(""); }}
              className={`${btn} border border-[#2A2A2A] text-[#6A6A6A] hover:border-[#AAFF00] hover:text-[#AAFF00]`}
            >
              Cancel
            </button>
            <button
              type="button"
              disabled={isPending || !notes.trim()}
              onClick={handleReturn}
              className={`${btn} bg-amber-400 text-black hover:bg-amber-300 disabled:opacity-40`}
            >
              {isPending ? "Sending…" : "Send Return"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
