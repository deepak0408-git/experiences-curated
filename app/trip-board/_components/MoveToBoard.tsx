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
        className="px-2.5 py-1 rounded-sm text-xs font-medium bg-[#1A1A1A] text-[#6A6A6A] hover:bg-[#2A2A2A] hover:text-white transition-colors disabled:opacity-50"
      >
        {loading ? "Moving…" : "Move to"}
      </button>
      {open && (
        <div className="absolute top-full left-0 mt-1 bg-[#141414] border border-[#2A2A2A] rounded-sm shadow-xl py-1 z-20 min-w-[140px]">
          {otherBoards.map((board) => (
            <button
              key={board.id}
              onClick={() => handleMove(board.id)}
              className="w-full text-left px-3 py-2 text-xs text-[#A3A3A3] hover:text-white hover:bg-[#1A1A1A] transition-colors"
            >
              {board.title}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
