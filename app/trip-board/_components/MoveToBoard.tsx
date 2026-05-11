"use client";

import { useState, useRef, useEffect } from "react";
import { moveItemToBoard } from "../actions";

interface Props {
  savedItemId: string;
  boards: { id: string; title: string }[];
  activeBoardId: string;
  onMove: (savedItemId: string) => void;
}

export default function MoveToBoard({ savedItemId, boards, activeBoardId, onMove }: Props) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const otherBoards = boards.filter((b) => b.id !== activeBoardId);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    if (open) document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [open]);

  const handleMove = async (targetBoardId: string) => {
    setLoading(true);
    setOpen(false);
    await moveItemToBoard(savedItemId, targetBoardId);
    setLoading(false);
    onMove(savedItemId);
  };

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen((o) => !o)}
        disabled={loading}
        className="px-2.5 py-1 rounded-full text-xs font-medium bg-neutral-100 text-neutral-500 hover:bg-neutral-200 transition-colors disabled:opacity-50"
      >
        {loading ? "Moving…" : "Move to"}
      </button>
      {open && (
        <div className="absolute top-full left-0 mt-1 bg-white border border-neutral-200 rounded-xl shadow-lg py-1 z-20 min-w-[140px]">
          {otherBoards.map((board) => (
            <button
              key={board.id}
              onClick={() => handleMove(board.id)}
              className="w-full text-left px-3 py-2 text-xs text-neutral-700 hover:bg-neutral-50 transition-colors"
            >
              {board.title}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
