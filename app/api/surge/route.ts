import { NextResponse } from "next/server";

import { getStore, triggerSurge } from "@/lib/sim";

export async function POST(request: Request) {
  const body = await request.json().catch(() => ({}));
  const count = Number(body.count ?? 1);
  const store = getStore();
  const impacted = triggerSurge(store, count);
  return NextResponse.json({ impacted });
}
