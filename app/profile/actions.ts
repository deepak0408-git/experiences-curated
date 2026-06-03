"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { createClient as createAdminClient } from "@supabase/supabase-js";

export async function openPaddlePortal(paddleCustomerId: string) {
  const isSandbox = process.env.NEXT_PUBLIC_PADDLE_ENVIRONMENT === "sandbox";
  const baseUrl = isSandbox
    ? "https://sandbox-api.paddle.com"
    : "https://api.paddle.com";

  const res = await fetch(`${baseUrl}/customers/${paddleCustomerId}/portal-sessions`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.PADDLE_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({}),
  });

  if (!res.ok) {
    throw new Error("Failed to create Paddle portal session");
  }

  const json = await res.json();
  const portalUrl = json.data?.urls?.general?.overview;
  if (!portalUrl) throw new Error("No portal URL returned");

  redirect(portalUrl);
}

export async function deleteAccount() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/");

  // Delete auth user via admin client (service role required)
  const admin = createAdminClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );
  const { error } = await admin.auth.admin.deleteUser(user.id);
  if (error) throw new Error("Failed to delete account");

  // Sign out and redirect to homepage
  await supabase.auth.signOut();
  redirect("/");
}
