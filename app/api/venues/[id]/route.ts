import { NextResponse } from "next/server";

import { getStore } from "@/lib/sim";
import {
  computeForecast,
  computePrediction,
  computeRecommendation,
  pickAlternatives
} from "@/lib/predict";

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  const store = getStore();
  const venue = store.venues.find((v) => v.id === params.id);

  if (!venue) {
    return NextResponse.json({ error: "Venue not found" }, { status: 404 });
  }

  const now = Date.now();
  const url = new URL(request.url);
  const timeOffsetRaw = Number(url.searchParams.get("timeOffset") ?? 0);
  const timeOffset = Number.isFinite(timeOffsetRaw)
    ? Math.min(120, Math.max(0, timeOffsetRaw))
    : 0;
  const fairnessMode = url.searchParams.get("fairness") === "1";

  const effectiveNow = now + timeOffset * 60 * 1000;
  const prediction = computePrediction(venue, effectiveNow);
  const forecast = computeForecast(venue, effectiveNow);
  const alternatives = pickAlternatives(store.venues, venue, effectiveNow).map((alt) => ({
    ...alt,
    directedTraffic: Number((store.directedTraffic[alt.id] ?? 0).toFixed(1))
  }));

  const recommendation = computeRecommendation({
    venue,
    nowTs: effectiveNow,
    alternatives,
    directedTraffic: store.directedTraffic,
    fairnessMode,
    timeOffsetMinutes: 0
  });

  return NextResponse.json({
    timestamp: now,
    venue,
    prediction,
    forecast,
    alternatives,
    recommendation,
    checkins: venue.checkins.slice(0, 6)
  });
}
