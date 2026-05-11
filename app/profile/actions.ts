"use server";

import { redirect } from "next/navigation";

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
