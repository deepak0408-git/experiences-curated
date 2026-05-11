import { notFound } from "next/navigation";
import { getExperienceForEdit } from "@/lib/queries/experiences";
import { getDestinations } from "../actions";
import { ExperienceForm } from "../_components/ExperienceForm";

export const metadata = { title: "Edit Experience" };

export default async function EditExperiencePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const [experience, destinations] = await Promise.all([
    getExperienceForEdit(id),
    getDestinations(),
  ]);

  if (experience.status === "published" || experience.status === "archived") {
    notFound();
  }

  return (
    <div>
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-1">
          <a
            href="/curator/review"
            className="text-sm text-neutral-400 hover:text-neutral-900 transition-colors"
          >
            ← Review queue
          </a>
        </div>
        <h1 className="text-2xl font-bold text-neutral-900">Edit Experience</h1>
        <p className="mt-1 text-sm text-neutral-500">
          Address the reviewer&apos;s feedback, then head back to the review queue to re-submit.
        </p>
      </div>

      <ExperienceForm
        destinations={destinations}
        initialData={experience}
        experienceId={id}
      />
    </div>
  );
}
