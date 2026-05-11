"use client";

import { useState, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import SchedulePicker from "./SchedulePicker";
import CalendarTimeline from "./CalendarTimeline";
import ExportCalendar from "./ExportCalendar";
import NotesEditor from "./NotesEditor";
import RemoveSavedItem from "./RemoveSavedItem";
import ClearBoardButton from "./ClearBoardButton";
import ShareButton from "./ShareButton";
import NewBoardModal from "./NewBoardModal";
import SignOutButton from "@/app/_components/SignOutButton";
import { renameBoard, deleteBoard } from "../actions";
import MoveToBoard from "./MoveToBoard";

export interface PlannerItem {
  savedItemId: string;
  experienceId: string;
  title: string;
  subtitle: string | null;
  slug: string;
  heroImageUrl: string | null;
  experienceType: string;
  budgetTier: string | null;
  neighborhood: string | null;
  destinationName: string;
  notes: string | null;
  bookingLinks: Array<{ platform: string; url: string }> | null;
  scheduledAt: string | null;
  durationMinutes: number | null;
}

const TYPE_LABELS: Record<string, string> = {
  activity: "Activity", dining: "Dining", accommodation: "Stay",
  cultural_site: "Cultural Site", natural_wonder: "Natural Wonder",
  neighborhood: "Neighbourhood", day_trip: "Day Trip", multi_day: "Multi-day",
  sports_venue: "Sports Venue", fan_experience: "Fan Experience",
  transit: "Transit", event: "Event",
};

const BUDGET_LABELS: Record<string, string> = {
  free: "Free", budget: "Budget", moderate: "Mid-range",
  splurge: "Splurge", luxury: "Luxury",
};

interface Props {
  initialItems: PlannerItem[];
  userId: string;
  userEmail: string;
  isPro: boolean;
  boards: { id: string; title: string }[];
  activeBoardId: string;
  dbUserId: string;
}

export default function TripBoardPlanner({ initialItems, userId, userEmail, isPro, boards, activeBoardId }: Props) {
  const [items, setItems] = useState<PlannerItem[]>(initialItems);
  const [showNewBoard, setShowNewBoard] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [boardTitle, setBoardTitle] = useState(boards.find((b) => b.id === activeBoardId)?.title ?? "My Trip Board");
  const [editingTitle, setEditingTitle] = useState(false);
  const [draftTitle, setDraftTitle] = useState(boardTitle);
  const titleInputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  const handleScheduleSave = (savedItemId: string, scheduledAt: string, durationMinutes: number) => {
    setItems((prev) =>
      prev.map((i) => i.savedItemId === savedItemId ? { ...i, scheduledAt, durationMinutes } : i)
    );
  };

  const handleScheduleRemove = (savedItemId: string) => {
    setItems((prev) =>
      prev.map((i) => i.savedItemId === savedItemId ? { ...i, scheduledAt: null, durationMinutes: null } : i)
    );
    fetch("/api/trip-board/schedule", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ savedItemId }),
    });
  };

  const handleRemoveItem = (savedItemId: string) => {
    setItems((prev) => prev.filter((i) => i.savedItemId !== savedItemId));
  };

  const handleRenameStart = () => {
    setDraftTitle(boardTitle);
    setEditingTitle(true);
    setTimeout(() => titleInputRef.current?.select(), 0);
  };

  const handleRenameCommit = async () => {
    const trimmed = draftTitle.trim();
    if (!trimmed || trimmed === boardTitle) {
      setEditingTitle(false);
      return;
    }
    setBoardTitle(trimmed);
    setEditingTitle(false);
    await renameBoard(activeBoardId, trimmed);
  };

  const scheduledCount = items.filter((i) => i.scheduledAt).length;
  const showSwitcher = isPro && boards.length > 1;
  const sortedItems = [...items].sort((a, b) => {
    if (a.scheduledAt && !b.scheduledAt) return -1;
    if (!a.scheduledAt && b.scheduledAt) return 1;
    if (a.scheduledAt && b.scheduledAt) return a.scheduledAt.localeCompare(b.scheduledAt);
    return 0;
  });

  return (
    <div className="min-h-screen bg-white">
      {/* Nav */}
      <nav className="border-b border-neutral-100">
        <div className="max-w-5xl mx-auto px-6 sm:px-8 py-4 flex items-center justify-between">
          <Link href="/" className="text-sm font-semibold tracking-widest uppercase text-neutral-400 hover:text-neutral-600 transition-colors">
            Experiences | Curated
          </Link>
          <div className="flex items-center gap-6">
            <Link href="/search" className="text-sm text-neutral-500 hover:text-neutral-900 transition-colors">Browse experiences</Link>
            <Link href="/my-travels" className="text-sm text-neutral-500 hover:text-neutral-900 transition-colors">My Travels</Link>
            <Link href="/profile" className="text-sm text-neutral-500 hover:text-neutral-900 transition-colors">My Profile</Link>
            <span className="text-neutral-200">|</span>
            <p className="text-xs text-neutral-400">{userEmail}</p>
            <SignOutButton />
          </div>
        </div>
      </nav>

      <div className="max-w-5xl mx-auto px-6 sm:px-8 py-8">
        {/* Header */}
        <div className="flex items-start justify-between mb-6 pb-6 border-b border-neutral-100">
          {/* Left — title + board name */}
          <div>
            <p className="text-sm font-semibold tracking-widest uppercase text-neutral-400 mb-0.5">Trip Board</p>
            <p className="text-xs text-neutral-400 mb-4">Build your itinerary</p>

            {editingTitle ? (
              <input
                ref={titleInputRef}
                value={draftTitle}
                onChange={(e) => setDraftTitle(e.target.value)}
                onBlur={handleRenameCommit}
                onKeyDown={(e) => {
                  if (e.key === "Enter") handleRenameCommit();
                  if (e.key === "Escape") setEditingTitle(false);
                }}
                className="text-2xl font-bold text-neutral-900 bg-transparent border-b border-neutral-400 outline-none w-64"
                autoFocus
              />
            ) : (
              <div className="flex items-center gap-3 group">
                <h1 className="text-2xl font-bold text-neutral-900">{boardTitle}</h1>
                <button
                  onClick={handleRenameStart}
                  className="text-xs text-neutral-300 hover:text-neutral-500 transition-colors opacity-0 group-hover:opacity-100"
                >
                  Rename
                </button>
                {boards.length > 1 && (
                  confirmDelete ? (
                    <span className="flex items-center gap-1.5">
                      <button
                        onClick={async () => {
                          await deleteBoard(activeBoardId);
                          router.push("/trip-board");
                        }}
                        className="text-xs text-red-500 hover:text-red-700 transition-colors"
                      >
                        Confirm delete
                      </button>
                      <button
                        onClick={() => setConfirmDelete(false)}
                        className="text-xs text-neutral-400 hover:text-neutral-600 transition-colors"
                      >
                        Cancel
                      </button>
                    </span>
                  ) : (
                    <button
                      onClick={() => setConfirmDelete(true)}
                      className="text-xs text-neutral-300 hover:text-red-400 transition-colors opacity-0 group-hover:opacity-100"
                    >
                      Delete
                    </button>
                  )
                )}
              </div>
            )}

            <p className="mt-1.5 text-sm text-neutral-500">
              {items.length} saved · {scheduledCount} scheduled
            </p>
          </div>

          {/* Right — actions */}
          <div className="flex flex-col items-end gap-3">
            <div className="flex items-center gap-2">
              <ExportCalendar items={items} />
              <ClearBoardButton boardId={activeBoardId} onCleared={() => setItems([])} />
              <ShareButton userId={userId} boardId={activeBoardId} />
            </div>
          </div>
        </div>

        {/* Board switcher — Pro with 2+ boards only */}
        {(showSwitcher || isPro) && (
          <div className="flex items-center gap-2 mb-8 pt-2">
            {showSwitcher && boards.map((board) => (
              <button
                key={board.id}
                onClick={() => router.push(`/trip-board?board=${board.id}`)}
                className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
                  board.id === activeBoardId
                    ? "bg-neutral-900 text-white"
                    : "bg-neutral-100 text-neutral-500 hover:bg-neutral-200"
                }`}
              >
                {board.id === activeBoardId ? boardTitle : board.title}
              </button>
            ))}
            {isPro && (
              <button
                onClick={() => setShowNewBoard(true)}
                className="px-3 py-1.5 rounded-full text-xs font-medium bg-neutral-100 text-neutral-500 hover:bg-neutral-200 transition-colors"
              >
                + New board
              </button>
            )}
          </div>
        )}

        {/* Two-panel layout */}
        <div className="flex gap-8 items-start">
          {/* Left — experience cards */}
          <div className="w-[60%] flex-shrink-0 space-y-3">
            {items.length === 0 && (
              <div className="py-12 text-center">
                <p className="text-sm font-semibold text-neutral-900 mb-1">Your {boardTitle} board is empty</p>
                <p className="text-xs text-neutral-400 mb-8">Save experiences as you browse to build your itinerary.</p>
                <div className="mt-2 pt-8 border-t border-neutral-100 text-left">
                  <p className="text-xs font-semibold tracking-widest uppercase text-neutral-400 mb-4 text-center">Upcoming event packs</p>
                  <div className="grid grid-cols-2 gap-4">
                    <Link href="/event-pack/wimbledon-2026" className="group rounded-xl border border-neutral-200 overflow-hidden hover:border-neutral-400 transition-colors">
                      <div className="h-32 overflow-hidden bg-neutral-100">
                        <img src={`${process.env.NEXT_PUBLIC_R2_PUBLIC_URL}/sporting-events/hero/wimbledon-2026.jpg`} alt="Wimbledon 2026" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                      </div>
                      <div className="p-4">
                        <p className="text-[10px] font-semibold tracking-widest uppercase text-neutral-400 mb-1">Tennis · London</p>
                        <p className="text-sm font-bold text-neutral-900 group-hover:text-neutral-600 transition-colors mb-1">Wimbledon 2026</p>
                        <p className="text-xs text-neutral-400">30 Jun – 13 Jul 2026</p>
                      </div>
                    </Link>
                    <Link href="/event-pack/us-open-2026" className="group rounded-xl border border-neutral-200 overflow-hidden hover:border-neutral-400 transition-colors">
                      <div className="h-32 overflow-hidden bg-neutral-100">
                        <img src={`${process.env.NEXT_PUBLIC_R2_PUBLIC_URL}/sporting-events/hero/us-open-2026.jpg`} alt="US Open 2026" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                      </div>
                      <div className="p-4">
                        <p className="text-[10px] font-semibold tracking-widest uppercase text-neutral-400 mb-1">Tennis · New York</p>
                        <p className="text-sm font-bold text-neutral-900 group-hover:text-neutral-600 transition-colors mb-1">US Open 2026</p>
                        <p className="text-xs text-neutral-400">25 Aug – 7 Sep 2026</p>
                      </div>
                    </Link>
                  </div>
                </div>
              </div>
            )}
            {sortedItems.map((item) => {
              const firstBookingLink = item.bookingLinks?.[0];
              return (
                <div key={item.savedItemId} className="rounded-xl border border-neutral-200 overflow-visible">
                  <div className="flex">
                    <Link href={`/experience/${item.slug}`} className="block flex-shrink-0">
                      <div className="w-24 h-24 overflow-hidden bg-neutral-100">
                        {item.heroImageUrl ? (
                          <img
                            src={item.heroImageUrl}
                            alt={item.title}
                            className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                          />
                        ) : (
                          <div className="w-full h-full bg-neutral-200" />
                        )}
                      </div>
                    </Link>

                    <div className="flex-1 min-w-0 px-3 py-2.5">
                      <div className="flex items-start justify-between gap-2 mb-1">
                        <div className="min-w-0">
                          <span className="text-[10px] font-semibold tracking-widest uppercase text-neutral-400">
                            {TYPE_LABELS[item.experienceType] ?? item.experienceType}
                            {item.budgetTier ? ` · ${BUDGET_LABELS[item.budgetTier]}` : ""}
                          </span>
                          <Link href={`/experience/${item.slug}`}>
                            <h3 className="text-sm font-semibold text-neutral-900 leading-snug line-clamp-1 hover:text-neutral-600 transition-colors mt-0.5">
                              {item.title}
                            </h3>
                          </Link>
                          <p className="text-xs text-neutral-400 mt-0.5">
                            {item.destinationName}{item.neighborhood ? ` · ${item.neighborhood}` : ""}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-3 mt-1.5 flex-wrap">
                        <SchedulePicker
                          savedItemId={item.savedItemId}
                          experienceType={item.experienceType}
                          scheduledAt={item.scheduledAt}
                          durationMinutes={item.durationMinutes}
                          onSave={handleScheduleSave}
                          onRemove={handleScheduleRemove}
                        />
                        {isPro && boards.length > 1 && (
                          <MoveToBoard
                            savedItemId={item.savedItemId}
                            boards={boards}
                            activeBoardId={activeBoardId}
                            onMove={handleRemoveItem}
                          />
                        )}
                        {item.scheduledAt && (
                          <button
                            onClick={() => handleScheduleRemove(item.savedItemId)}
                            className="px-2.5 py-1 rounded-full text-xs font-medium bg-neutral-100 text-neutral-400 hover:bg-red-50 hover:text-red-500 transition-colors"
                          >
                            − Unschedule
                          </button>
                        )}
                        <RemoveSavedItem savedItemId={item.savedItemId} experienceSlug={item.slug} onRemove={handleRemoveItem} />
                        {firstBookingLink && (
                          <a
                            href={firstBookingLink.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="ml-auto text-xs font-medium text-neutral-900 underline underline-offset-2 hover:text-neutral-500 transition-colors"
                          >
                            Book →
                          </a>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="border-t border-neutral-100 px-3 py-2 rounded-b-xl overflow-hidden">
                    <NotesEditor savedItemId={item.savedItemId} initialNotes={item.notes} />
                  </div>
                </div>
              );
            })}
          </div>

          {/* Right — sticky calendar timeline */}
          <div className="hidden lg:block flex-1 min-w-0">
            <div className="sticky top-6 max-h-[calc(100vh-6rem)] overflow-y-auto">
              <p className="text-xs font-semibold uppercase tracking-widest text-neutral-400 mb-4">
                Itinerary
              </p>
              <CalendarTimeline items={items} />
            </div>
          </div>
        </div>
      </div>

      {showNewBoard && <NewBoardModal onClose={() => setShowNewBoard(false)} />}
    </div>
  );
}
