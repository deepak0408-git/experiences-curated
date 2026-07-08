export const dynamic = "force-dynamic";

import { getFeedbackSummary } from "./actions";
import FeedbackView from "./_components/FeedbackView";

export const metadata = { title: "Feedback — Curator" };

export default async function FeedbackPage() {
  const { summary, comments } = await getFeedbackSummary();

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-black text-[#AAFF00]">Feedback</h1>
        <p className="mt-1 text-sm text-[#6A6A6A]">
          Pack star ratings and comments. Filter by event below.
        </p>
      </div>

      <FeedbackView summary={summary} comments={comments} />
    </div>
  );
}
