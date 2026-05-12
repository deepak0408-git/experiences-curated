"use client";

import { useState, useTransition } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { FormSection, Field, CharCount } from "./FormSection";
import { TagSelector } from "./TagSelector";
import { saveDraft, updateDraft, submitForReview, type ExperienceFormData } from "../actions";
import { ImageUploader } from "./ImageUploader";
import type { ExperienceForEdit } from "@/lib/queries/experiences";

const EXPERIENCE_TYPES = [
  { value: "activity", label: "Activity" },
  { value: "dining", label: "Dining" },
  { value: "accommodation", label: "Accommodation" },
  { value: "cultural_site", label: "Cultural Site" },
  { value: "natural_wonder", label: "Natural Wonder" },
  { value: "neighborhood", label: "Neighborhood" },
  { value: "day_trip", label: "Day Trip" },
  { value: "multi_day", label: "Multi-day" },
  { value: "sports_venue", label: "Sports Venue" },
  { value: "fan_experience", label: "Fan Experience" },
  { value: "transit", label: "Transit" },
  { value: "event", label: "Event" },
];

const MOOD_TAGS = [
  { value: "adventurous", label: "Adventurous" },
  { value: "peaceful", label: "Peaceful" },
  { value: "romantic", label: "Romantic" },
  { value: "social", label: "Social" },
  { value: "contemplative", label: "Contemplative" },
  { value: "indulgent", label: "Indulgent" },
  { value: "rugged", label: "Rugged" },
  { value: "cultural", label: "Cultural" },
  { value: "electric", label: "Electric" },
  { value: "off-beaten-path", label: "Off the beaten path" },
];

const INTEREST_CATEGORIES = [
  { value: "food", label: "Food & Drink" },
  { value: "art", label: "Art & Design" },
  { value: "nature", label: "Nature" },
  { value: "architecture", label: "Architecture" },
  { value: "history", label: "History" },
  { value: "adventure", label: "Adventure" },
  { value: "wellness", label: "Wellness" },
  { value: "nightlife", label: "Nightlife" },
  { value: "culture", label: "Local Culture" },
  { value: "sports", label: "Sports" },
];

const SEASONS = [
  { value: "jan", label: "Jan" }, { value: "feb", label: "Feb" },
  { value: "mar", label: "Mar" }, { value: "apr", label: "Apr" },
  { value: "may", label: "May" }, { value: "jun", label: "Jun" },
  { value: "jul", label: "Jul" }, { value: "aug", label: "Aug" },
  { value: "sep", label: "Sep" }, { value: "oct", label: "Oct" },
  { value: "nov", label: "Nov" }, { value: "dec", label: "Dec" },
];

const inputClass =
  "w-full rounded-lg border border-neutral-300 px-3 py-2 text-sm text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-neutral-900 focus:border-transparent";

const textareaClass =
  "w-full rounded-lg border border-neutral-300 px-3 py-2 text-sm text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-neutral-900 focus:border-transparent resize-none";

type Destination = { id: string; name: string; countryCode: string };

function toFormDefaults(exp: ExperienceForEdit): Partial<ExperienceFormData> {
  const p = exp.practicalInfo as Record<string, any> | null;
  return {
    title: exp.title ?? "",
    subtitle: exp.subtitle ?? "",
    experienceType: exp.experienceType ?? "",
    destinationId: exp.destinationId ?? "",
    neighborhood: exp.neighborhood ?? "",
    address: exp.address ?? "",
    bodyContent: exp.bodyContent ?? "",
    whyItsSpecial: exp.whyItsSpecial ?? "",
    insiderTips: exp.insiderTips?.length ? [...exp.insiderTips, "", "", ""].slice(0, 5) : ["", "", ""],
    whatToAvoid: exp.whatToAvoid ?? "",
    editorialNote: exp.editorialNote ?? "",
    hours: p?.hours ?? "",
    costRange: p?.costRange ?? "",
    bookingMethod: p?.bookingMethod ?? "",
    howToBook: (p as any)?.howToBook ?? "",
    reservationsRequired: p?.reservationsRequired ?? false,
    website: p?.website ?? "",
    gettingThere: exp.gettingThere ?? "",
    moodTags: exp.moodTags ?? [],
    interestCategories: exp.interestCategories ?? [],
    pace: exp.pace ?? "",
    physicalIntensity: exp.physicalIntensity ?? 0,
    budgetTier: exp.budgetTier ?? "",
    budgetCurrency: exp.budgetCurrency ?? "",
    budgetMinCost: exp.budgetMinCost ?? "",
    budgetMaxCost: exp.budgetMaxCost ?? "",
    bestSeasons: exp.bestSeasons ?? [],
    advanceBookingRequired: exp.advanceBookingRequired ?? false,
    advanceBookingDays: exp.advanceBookingDays ? String(exp.advanceBookingDays) : "",
    sportingEventId: exp.sportingEventId ?? "",
    availability: exp.availability ?? "perennial",
    heroImageUrl: exp.heroImageUrl ?? "",
    heroImageAlt: exp.heroImageAlt ?? "",
    heroImageCredit: exp.heroImageCredit ?? "",
  };
}

export function ExperienceForm({
  destinations,
  initialData,
  experienceId,
}: {
  destinations: Destination[];
  initialData?: ExperienceForEdit;
  experienceId?: string;
}) {
  const isEditing = !!experienceId;
  const [isPending, startTransition] = useTransition();
  const [status, setStatus] = useState<"idle" | "saved" | "submitted">("idle");
  const [savedId, setSavedId] = useState<string | null>(experienceId ?? null);

  const {
    register,
    watch,
    setValue,
    getValues,
    formState: { errors },
  } = useForm<ExperienceFormData>({
    defaultValues: initialData
      ? toFormDefaults(initialData)
      : {
          insiderTips: ["", "", ""],
          moodTags: [],
          interestCategories: [],
          bestSeasons: [],
          availability: "perennial",
          reservationsRequired: false,
          advanceBookingRequired: false,
          physicalIntensity: 0,
        },
  });

  const watchedTitle = watch("title") ?? "";
  const watchedBody = watch("bodyContent") ?? "";
  const watchedWhy = watch("whyItsSpecial") ?? "";
  const watchedType = watch("experienceType") ?? "";
  const isSportsType = true;

  function handleSaveDraft() {
    startTransition(async () => {
      const data = getValues();
      if (isEditing && experienceId) {
        const result = await updateDraft(experienceId, data);
        if (result.success) setStatus("saved");
      } else {
        const result = await saveDraft(data);
        if (result.success) {
          setSavedId(result.id);
          setStatus("saved");
        }
      }
    });
  }

  function handleSubmitForReview() {
    if (!savedId) return;
    startTransition(async () => {
      await submitForReview(savedId);
      setStatus("submitted");
    });
  }

  return (
    <div className="space-y-6">
      {/* ── 1. Basics ── */}
      <FormSection
        title="1 — The Basics"
        description="The title should be specific enough that a traveller knows exactly what this is. Avoid generic names."
      >
        <Field label="Title" required hint="60 characters max — punchy and specific. Not 'Visit the Colosseum', but 'The Colosseum at 8am: arriving before the crowds'.">
          <div className="flex items-center gap-2">
            <input
              {...register("title", { required: true, maxLength: 60 })}
              placeholder="e.g. The Wimbledon Queue: arriving at 4am for Centre Court day tickets"
              className={inputClass}
              maxLength={60}
            />
            <CharCount current={watchedTitle.length} max={60} />
          </div>
        </Field>

        <Field label="Subtitle" hint="120 characters — one-line hook that expands on the title.">
          <input
            {...register("subtitle", { maxLength: 120 })}
            placeholder="e.g. The only guide you need to the world's most famous tennis queue"
            className={inputClass}
            maxLength={120}
          />
        </Field>

        <Field label="Experience Type" required>
          <select {...register("experienceType", { required: true })} className={inputClass}>
            <option value="">Select type…</option>
            {EXPERIENCE_TYPES.map((t) => (
              <option key={t.value} value={t.value}>{t.label}</option>
            ))}
          </select>
        </Field>

        <div className="grid grid-cols-2 gap-4">
          <Field label="Destination" required hint="Select the city or region this experience belongs to.">
            <select {...register("destinationId", { required: true })} className={inputClass}>
              <option value="">Select destination…</option>
              {destinations.map((d) => (
                <option key={d.id} value={d.id}>
                  {d.name} ({d.countryCode.toUpperCase()})
                </option>
              ))}
            </select>
          </Field>
          <Field label="Neighborhood / Area" hint="More specific location within the destination.">
            <input
              {...register("neighborhood")}
              placeholder="e.g. Church Road, Wimbledon"
              className={inputClass}
            />
          </Field>
        </div>

        <Field label="Address" hint="Street address or closest landmark. Travellers need to know exactly where to go.">
          <input
            {...register("address")}
            placeholder="e.g. The All England Lawn Tennis Club, Church Road, London SW19 5AG"
            className={inputClass}
          />
        </Field>
      </FormSection>

      {/* ── 2. Editorial ── */}
      <FormSection
        title="2 — Editorial"
        description="This is the heart of the experience. Write from your own time there. Be specific — the detail that makes someone say 'I wouldn't have known that'."
      >
        <Field
          label="The Experience"
          required
          hint="500–1500 words. Tell the story. What do you do, see, hear, taste? What makes the sequence of the experience remarkable?"
        >
          <div>
            <textarea
              {...register("bodyContent", { required: true, minLength: 100 })}
              rows={14}
              placeholder="Describe the experience in full. Be as specific as possible — timing, the specific route you take, what to order, who to speak to, what surprised you. A reader should be able to close their eyes and picture exactly what this experience is like."
              className={textareaClass}
            />
            <div className="flex justify-between mt-1">
              <span className="text-xs text-neutral-400">Target: 500–1500 words</span>
              <CharCount current={watchedBody.split(/\s+/).filter(Boolean).length} max={1500} min={500} />
            </div>
          </div>
        </Field>

        <Field
          label="Why It's Special"
          required
          hint="200–300 words. Your editorial justification — the specific reason you're recommending this above everything else in this destination. This is your byline."
        >
          <div>
            <textarea
              {...register("whyItsSpecial", { required: true, minLength: 50 })}
              rows={6}
              placeholder="Write in first person. What would you tell a well-travelled friend over dinner about why this specific experience is worth their time? What is the thing that sets it apart from the hundred other options in this city?"
              className={textareaClass}
            />
            <div className="flex justify-between mt-1">
              <span className="text-xs text-neutral-400">Target: 200–300 words</span>
              <CharCount current={watchedWhy.split(/\s+/).filter(Boolean).length} max={300} min={200} />
            </div>
          </div>
        </Field>

        <Field label="Insider Tips" hint="Up to 5 things only regulars know — specific timing, hidden details, who to ask for, what to avoid ordering.">
          {[0, 1, 2, 3, 4].map((i) => (
            <input
              key={i}
              {...register(`insiderTips.${i}` as any)}
              placeholder={
                i === 0
                  ? "e.g. Arrive by 4:30am to be in the first 200 — you'll get a Centre Court day ticket"
                  : i === 1
                  ? "e.g. Bring a camping chair, a flask, and cash for the queue café"
                  : i === 2
                  ? "e.g. The queue stewards at Gate 3 are the friendliest — go there for advice"
                  : "Another tip…"
              }
              className={`${inputClass} mb-2`}
            />
          ))}
        </Field>

        <Field label="What to Avoid" hint="Honest guidance — the things that trip people up, the tourist traps nearby, the common mistakes.">
          <textarea
            {...register("whatToAvoid")}
            rows={3}
            placeholder="e.g. Don't queue for Court 1 if you want the atmosphere — Centre Court is worth the extra wait. Avoid the official merchandise shop on match days, the queues are 45 minutes."
            className={textareaClass}
          />
        </Field>

        <Field label="Your Editorial Note" hint="A short personal note that appears with your byline — the 'why I chose to write about this' sentence.">
          <input
            {...register("editorialNote")}
            placeholder="e.g. I've queued for Wimbledon four times. This is the guide I wish I'd had the first time."
            className={inputClass}
          />
        </Field>
      </FormSection>

      {/* ── 3. Practical Info ── */}
      <FormSection
        title="3 — Practical Info"
        description="The logistics. Be specific enough that someone could show up tomorrow and navigate this without any extra research."
      >
        <div className="grid grid-cols-2 gap-4">
          <Field label="Opening Hours / Timing" hint="When to go, when it opens, best time of day.">
            <input
              {...register("hours")}
              placeholder="e.g. Queue forms from midnight; gates open 9:30am"
              className={inputClass}
            />
          </Field>
          <Field label="Cost Range" hint="Approximate cost per person in local currency.">
            <input
              {...register("costRange")}
              placeholder="e.g. Day tickets £25–£50; queue is free"
              className={inputClass}
            />
          </Field>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <Field label="How to Book / Access" hint="Exactly how someone gets access to this experience.">
            <input
              {...register("bookingMethod")}
              placeholder="e.g. Join the queue in person — no booking required for day tickets"
              className={inputClass}
            />
          </Field>
          <Field label="Website">
            <input
              {...register("website")}
              placeholder="https://www.wimbledon.com/en_GB/tickets/"
              className={inputClass}
              type="url"
            />
          </Field>
        </div>

        <Field label="How to Book — Pro (concierge detail)" hint="Booking contacts, lead times, and insider tips. Visible to Pro subscribers only inside the event pack.">
          <textarea
            {...register("howToBook")}
            rows={3}
            placeholder="e.g. Book direct at edgbastonparkhotel.com. For the 14 July ODI, book at least 6–8 weeks ahead. Free cancellation up to 48 hours on direct bookings."
            className={textareaClass}
          />
        </Field>

        <div className="flex items-center gap-3">
          <input
            type="checkbox"
            id="reservations"
            {...register("reservationsRequired")}
            className="w-4 h-4 rounded border-neutral-300"
          />
          <label htmlFor="reservations" className="text-sm text-neutral-700">
            Reservations / advance booking required
          </label>
        </div>

        <Field label="Getting There" hint="Specific transport instructions. Which exit, which platform, walk time from nearest landmark.">
          <textarea
            {...register("gettingThere")}
            rows={3}
            placeholder="e.g. Take the District line to Southfields (Zone 3). Exit the station and follow the crowd — it's a 20-minute walk along Wimbledon Park Road. The queue forms on the pavement outside Gate 3."
            className={textareaClass}
          />
        </Field>
      </FormSection>

      {/* ── 4. Discovery Tags ── */}
      <FormSection
        title="4 — Discovery & Tags"
        description="How travellers will find this experience. Be honest — tag what it actually is, not what sounds impressive."
      >
        <Field label="Mood" hint="Pick up to 4 moods that best describe the feeling of this experience.">
          <TagSelector
            options={MOOD_TAGS}
            selected={watch("moodTags") ?? []}
            onChange={(v) => setValue("moodTags", v)}
            max={4}
          />
        </Field>

        <Field label="Interest Categories" hint="Which traveller interests does this serve? Pick all that apply.">
          <TagSelector
            options={INTEREST_CATEGORIES}
            selected={watch("interestCategories") ?? []}
            onChange={(v) => setValue("interestCategories", v)}
          />
        </Field>

        <div className="grid grid-cols-3 gap-4">
          <Field label="Pace">
            <select {...register("pace")} className={inputClass}>
              <option value="">Select…</option>
              <option value="slow">Slow — immersive</option>
              <option value="moderate">Moderate</option>
              <option value="active">Active</option>
              <option value="intense">Intense</option>
            </select>
          </Field>
          <Field label="Physical Intensity" hint="1 = armchair, 5 = full exertion">
            <select {...register("physicalIntensity", { valueAsNumber: true })} className={inputClass}>
              <option value={0}>Select…</option>
              {[1, 2, 3, 4, 5].map((n) => (
                <option key={n} value={n}>{n}</option>
              ))}
            </select>
          </Field>
          <Field label="Budget Tier">
            <select {...register("budgetTier")} className={inputClass}>
              <option value="">Select…</option>
              <option value="free">Free</option>
              <option value="budget">Budget</option>
              <option value="moderate">Moderate</option>
              <option value="splurge">Splurge</option>
              <option value="luxury">Luxury</option>
            </select>
          </Field>
        </div>

        <div className="grid grid-cols-3 gap-4">
          <Field label="Currency">
            <input {...register("budgetCurrency")} placeholder="GBP" maxLength={3} className={inputClass} />
          </Field>
          <Field label="Min Cost">
            <input {...register("budgetMinCost")} placeholder="0" type="number" className={inputClass} />
          </Field>
          <Field label="Max Cost">
            <input {...register("budgetMaxCost")} placeholder="50" type="number" className={inputClass} />
          </Field>
        </div>

        <Field label="Best Months" hint="When is this experience at its best?">
          <TagSelector
            options={SEASONS}
            selected={watch("bestSeasons") ?? []}
            onChange={(v) => setValue("bestSeasons", v)}
          />
        </Field>

        <div className="flex items-center gap-3">
          <input
            type="checkbox"
            id="advanceBooking"
            {...register("advanceBookingRequired")}
            className="w-4 h-4 rounded border-neutral-300"
          />
          <label htmlFor="advanceBooking" className="text-sm text-neutral-700">
            Must be booked in advance
          </label>
          {watch("advanceBookingRequired") && (
            <input
              {...register("advanceBookingDays")}
              type="number"
              placeholder="days ahead"
              className="w-28 rounded-lg border border-neutral-300 px-3 py-1.5 text-sm"
            />
          )}
        </div>
      </FormSection>

      {/* ── 5. Sports (conditional) ── */}
      {isSportsType && (
        <FormSection
          title="5 — Sports Event Link"
          description="Link this experience to a specific sporting event so it surfaces in the right calendar context."
        >
          <Field label="Availability">
            <select {...register("availability")} className={inputClass}>
              <option value="perennial">Perennial — available any time of year</option>
              <option value="event_adjacent">Event Adjacent — best during the event window, available year-round</option>
              <option value="event_only">Event Only — only relevant during the specific event</option>
            </select>
          </Field>
          <Field label="Sporting Event ID" hint="Paste the UUID of the sporting event from the database if linking to a specific edition.">
            <input
              {...register("sportingEventId")}
              placeholder="e.g. 550e8400-e29b-41d4-a716-446655440000"
              className={inputClass}
            />
          </Field>
        </FormSection>
      )}

      {/* ── 6. Hero Image ── */}
      <FormSection
        title={isSportsType ? "6 — Hero Image" : "5 — Hero Image"}
        description="Use a high-quality editorial image. No stock photography. Landscape orientation, minimum 1600px wide."
      >
        <Field label="Upload Image">
          <ImageUploader
            value={watch("heroImageUrl") ?? ""}
            onChange={(url) => setValue("heroImageUrl", url)}
          />
        </Field>
        <div className="grid grid-cols-2 gap-4">
          <Field label="Alt Text" hint="Describe the image for accessibility.">
            <input {...register("heroImageAlt")} placeholder="The Wimbledon queue at dawn" className={inputClass} />
          </Field>
          <Field label="Photographer Credit">
            <input {...register("heroImageCredit")} placeholder="© Jane Smith" className={inputClass} />
          </Field>
        </div>
      </FormSection>

      {/* ── Actions ── */}
      <div className="bg-white rounded-xl border border-neutral-200 p-6">
        {status !== "idle" && (
          <p className="text-sm text-neutral-500 mb-4 text-center">
            {status === "saved" && (isEditing ? "✓ Changes saved" : "✓ Draft saved")}
            {status === "submitted" && "✓ Submitted for editorial review"}
          </p>
        )}
        <div className="flex items-center justify-between">
          {isEditing ? (
            <a
              href="/curator/review"
              className="px-5 py-2.5 rounded-lg border border-neutral-300 text-sm font-medium text-neutral-700 hover:bg-neutral-50 transition-colors"
            >
              ← Back to Review Queue
            </a>
          ) : (
            <div />
          )}
          <div className="flex gap-3">
            <button
              type="button"
              onClick={handleSaveDraft}
              disabled={isPending}
              className="px-5 py-2.5 rounded-lg border border-neutral-300 text-sm font-medium text-neutral-700 hover:bg-neutral-50 disabled:opacity-50 transition-colors"
            >
              {isPending ? "Saving…" : isEditing ? "Save Changes" : "Save Draft"}
            </button>
            {!isEditing && (
              <button
                type="button"
                onClick={handleSubmitForReview}
                disabled={isPending || !savedId}
                className="px-5 py-2.5 rounded-lg bg-neutral-900 text-sm font-medium text-white hover:bg-neutral-700 disabled:opacity-50 transition-colors"
              >
                Submit for Review
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
