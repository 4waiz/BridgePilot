import { NextResponse } from "next/server";

import { getStore } from "@/lib/sim";
import {
  computePrediction,
  computeWaitMinutes,
  summarizeCrowd
} from "@/lib/predict";
import { clamp } from "@/lib/utils";

export async function GET() {
  const store = getStore();
  const now = Date.now();

  const venues = store.venues.map((venue) => {
    const prediction = computePrediction(venue, now);
    return {
      id: venue.id,
      name: venue.name,
      category: venue.category,
      area: venue.area,
      lat: venue.lat,
      lng: venue.lng,
      currentSignal: Number(venue.currentSignal.toFixed(2)),
      directedTraffic: Number((store.directedTraffic[venue.id] ?? 0).toFixed(1)),
      waitNow: prediction.waitNow,
      confidence: prediction.confidence,
      crowd: summarizeCrowd(prediction.waitNow)
    };
  });

  const feed = store.venues
    .flatMap((venue) =>
      venue.checkins.map((checkin) => ({
        ...checkin,
        venueName: venue.name
      }))
    )
    .sort((a, b) => b.timestamp - a.timestamp)
    .slice(0, 8)
    .map((checkin) => ({
      id: checkin.id,
      venueId: checkin.venueId,
      venueName: checkin.venueName,
      user: checkin.user,
      mood: checkin.mood,
      note: checkin.note,
      queuePeopleEstimate: checkin.queuePeopleEstimate,
      timestamp: checkin.timestamp
    }));

  const handleCounts: Record<string, number> = {};
  store.venues.forEach((venue) => {
    venue.checkins.forEach((checkin) => {
      handleCounts[checkin.user] = (handleCounts[checkin.user] ?? 0) + 1;
    });
  });

  const leaderboard = Object.entries(handleCounts)
    .map(([handle, count]) => ({ handle, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 4);

  const avgWait =
    venues.reduce((sum, venue) => sum + venue.waitNow, 0) / venues.length;
  const avgConfidence =
    venues.reduce((sum, venue) => sum + venue.confidence, 0) / venues.length;

  const minutesSaved =
    store.venues.reduce((sum, venue) => {
      const waitNow = computeWaitMinutes(venue, now, 0);
      const waitLater = Math.min(
        computeWaitMinutes(venue, now, 60),
        computeWaitMinutes(venue, now, 120)
      );
      return sum + Math.max(0, waitNow - waitLater);
    }, 0) / store.venues.length;

  const cityPulse =
    avgWait < 30 ? "green" : avgWait < 55 ? "yellow" : "red";

  return NextResponse.json({
    timestamp: now,
    venues,
    feed,
    leaderboard,
    metrics: {
      averageMinutesSaved: Math.round(clamp(minutesSaved, 4, 35)),
      checkinsProcessed: store.checkinsProcessed,
      predictionConfidenceAvg: Math.round(avgConfidence)
    },
    cityPulse: {
      level: cityPulse,
      label:
        cityPulse === "green"
          ? "Cruising"
          : cityPulse === "yellow"
          ? "Busy"
          : "Spicy"
    }
  });
}
