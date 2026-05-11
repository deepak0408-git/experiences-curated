import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { db } from "@/lib/db";
import { userProfiles } from "@/schema/database";
import { eq } from "drizzle-orm";
import { scoreQuiz } from "@/lib/quiz";

export async function POST(request: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user?.email) {
    return NextResponse.json({ error: "Unauthorised" }, { status: 401 });
  }

  const { answers } = await request.json() as { answers: Record<string, string> };
  if (!answers || typeof answers !== "object") {
    return NextResponse.json({ error: "Invalid answers" }, { status: 400 });
  }

  const archetype = scoreQuiz(answers);

  await db
    .insert(userProfiles)
    .values({
      email: user.email,
      archetype,
      quizAnswers: answers,
      quizCompletedAt: new Date(),
    })
    .onConflictDoUpdate({
      target: userProfiles.email,
      set: {
        archetype,
        quizAnswers: answers,
        quizCompletedAt: new Date(),
        updatedAt: new Date(),
      },
    });

  return NextResponse.json({ archetype });
}
