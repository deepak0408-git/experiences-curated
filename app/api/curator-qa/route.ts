import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { hasProSubscription } from "@/lib/pro";

const resend = new Resend(process.env.RESEND_API_KEY);
const NOTIFY_TO = "experiencescurated@gmail.com";

export async function POST(request: NextRequest) {
  const cookieStore = await cookies();
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { cookies: { getAll: () => cookieStore.getAll() } }
  );

  const { data: { user } } = await supabase.auth.getUser();
  if (!user?.email) {
    return NextResponse.json({ error: "Unauthenticated" }, { status: 401 });
  }

  const isPro = await hasProSubscription(user.email);
  if (!isPro) {
    return NextResponse.json({ error: "Pro required" }, { status: 403 });
  }

  const body = await request.json();
  const { question, eventName } = body;

  if (!question || typeof question !== "string" || question.trim().length < 5) {
    return NextResponse.json({ error: "Question too short" }, { status: 400 });
  }

  if (question.trim().length > 1000) {
    return NextResponse.json({ error: "Question too long" }, { status: 400 });
  }

  await resend.emails.send({
    from: "Experiences | Curated <hello@experiences-curated.com>",
    to: NOTIFY_TO,
    replyTo: user.email,
    subject: `Curator Q&A: ${eventName ?? "General"}`,
    html: `
      <div style="font-family:sans-serif;max-width:480px;margin:0 auto;padding:40px 24px;color:#171717">
        <p style="font-size:11px;font-weight:600;letter-spacing:0.1em;text-transform:uppercase;color:#a3a3a3;margin-bottom:24px">Ask the Curator</p>
        <p style="font-size:14px;color:#525252;line-height:1.6;margin-bottom:8px"><strong>From:</strong> ${user.email}</p>
        <p style="font-size:14px;color:#525252;line-height:1.6;margin-bottom:8px"><strong>Pack:</strong> ${eventName ?? "—"}</p>
        <hr style="border:none;border-top:1px solid #e5e5e5;margin:16px 0">
        <p style="font-size:15px;color:#171717;line-height:1.7;">${question.trim().replace(/\n/g, "<br>")}</p>
        <hr style="border:none;border-top:1px solid #e5e5e5;margin:16px 0">
        <p style="font-size:12px;color:#a3a3a3;">Reply directly to this email — your reply goes to ${user.email}</p>
      </div>
    `,
  });

  return NextResponse.json({ ok: true });
}
