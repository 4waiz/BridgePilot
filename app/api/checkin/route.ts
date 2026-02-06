import { NextResponse } from "next/server";

import { computePrediction } from "@/lib/predict";
import { addCheckin, getStore, pickRandomHandle } from "@/lib/sim";
import { MOODS } from "@/lib/types";

export async function POST(request: Request) {
  const body = await request.json();
  const venueId = body.venueId as string | undefined;

  if (!venueId) {
    return NextResponse.json({ error: "venueId is required" }, { status: 400 });
  }

  const store = getStore();
  const checkin = addCheckin(store, venueId, {
    queuePeopleEstimate: Number(body.queuePeopleEstimate ?? 0),
    mood: body.mood ?? MOODS[0],
    note: body.note ?? "",
    user: body.user ?? pickRandomHandle(),
    photoUrl: body.photoUrl ?? "/mock-photo.svg"
  });

  if (!checkin) {
    return NextResponse.json({ error: "Venue not found" }, { status: 404 });
  }

  const venue = store.venues.find((v) => v.id === venueId);
  const prediction = venue ? computePrediction(venue, Date.now()) : null;

  return NextResponse.json({ checkin, prediction });
}
