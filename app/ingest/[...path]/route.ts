import { NextRequest, NextResponse } from "next/server";

const POSTHOG_HOST = process.env.NEXT_PUBLIC_POSTHOG_HOST;

async function proxy(request: NextRequest, path: string[]): Promise<NextResponse> {
  if (!POSTHOG_HOST) {
    return new NextResponse("PostHog host not configured", { status: 500 });
  }
  const searchParams = request.nextUrl.searchParams.toString();
  const pathString = path.join("/");
  const url = `${POSTHOG_HOST}/${pathString}${searchParams ? `?${searchParams}` : ""}`;

  const options: RequestInit = {
    method: request.method,
    headers: { "Content-Type": "application/json" },
  };

  if (request.method === "POST") {
    options.body = await request.text();
  }

  const response = await fetch(url, options);

  return new NextResponse(response.body, {
    status: response.status,
    headers: response.headers,
  });
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ path: string[] }> }
) {
  const { path } = await params;
  return proxy(request, path);
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ path: string[] }> }
) {
  const { path } = await params;
  return proxy(request, path);
}
