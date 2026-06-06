import { NextRequest, NextResponse } from "next/server";
import { createClient as createAdminClient } from "@supabase/supabase-js";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: NextRequest) {
  const { email, next } = await request.json();

  if (!email || typeof email !== "string") {
    return NextResponse.json({ error: "Email required" }, { status: 400 });
  }

  const redirectTo = `${process.env.NEXT_PUBLIC_SITE_URL}/auth/confirm?next=${encodeURIComponent(next ?? "/")}`;

  const admin = createAdminClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  const { data, error } = await admin.auth.admin.generateLink({
    type: "magiclink",
    email,
    options: { redirectTo },
  });

  if (error || !data?.properties?.action_link) {
    console.error("generateLink error:", error?.message);
    return NextResponse.json({ error: "Failed to generate link" }, { status: 500 });
  }

  const { error: sendError } = await resend.emails.send({
    from: "Experiences | Curated <hello@experiences-curated.com>",
    to: email,
    subject: "Your sign-in link",
    html: `
      <div style="font-family:sans-serif;max-width:480px;margin:0 auto;padding:40px 24px;color:#171717">
        <p style="font-size:11px;font-weight:600;letter-spacing:0.1em;text-transform:uppercase;color:#a3a3a3;margin-bottom:32px">Experiences | Curated</p>
        <h1 style="font-size:22px;font-weight:700;margin-bottom:12px">Your sign-in link</h1>
        <p style="font-size:14px;color:#525252;line-height:1.6;margin-bottom:32px">
          Click the button below to sign in. This link expires in 1 hour and can only be used once.
        </p>
        <a href="${data.properties.action_link}"
           style="display:inline-block;background:#171717;color:#fff;text-decoration:none;padding:14px 28px;border-radius:10px;font-size:14px;font-weight:600">
          Sign in
        </a>
        <p style="font-size:12px;color:#a3a3a3;margin-top:32px;line-height:1.6">
          If you didn't request this, you can safely ignore it.<br>
          This link was sent to ${email}.
        </p>
      </div>
    `,
  });

  if (sendError) {
    console.error("Resend error:", sendError);
    return NextResponse.json({ error: "Failed to send email" }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
