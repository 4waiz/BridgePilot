import { clamp, distanceKm } from "@/lib/utils";
import type {
  Checkin,
  ForecastPoint,
  Recommendation,
  Venue,
  VenueCategory,
  VenuePrediction
} from "@/lib/types";

const BASE_WAIT: Record<VenueCategory, number> = {
  government: 38,
  tourism: 28,
  food: 18,
  retail: 22
};

function recentCheckins(checkins: Checkin[], nowTs: number, minutes = 60) {
  const cutoff = nowTs - minutes * 60 * 1000;
  return checkins.filter((checkin) => checkin.timestamp >= cutoff);
}

function checkinEffect(checkins: Checkin[], nowTs: number) {
  const recent = recentCheckins(checkins, nowTs);
  return recent.reduce((total, checkin) => {
    const ageMinutes = (nowTs - checkin.timestamp) / (60 * 1000);
    const weight = Math.exp(-ageMinutes / 20);
    return total + weight * (checkin.queuePeopleEstimate / 6);
  }, 0);
}

function patternMultiplier(venue: Venue, hour: number) {
  return venue.typicalPattern[hour] ?? 1;
}

export function computeWaitMinutes(
  venue: Venue,
  nowTs: number,
  offsetMinutes = 0
) {
  const ts = nowTs + offsetMinutes * 60 * 1000;
  const hour = new Date(ts).getHours();
  const pattern = patternMultiplier(venue, hour);
  const footfall = venue.currentSignal;
  const base = BASE_WAIT[venue.category];
  const checkins = checkinEffect(venue.checkins, ts);
  const wait = base + pattern * venue.basePopularity * 40 + footfall * 25 + checkins;
  return clamp(Math.round(wait), 0, 120);
}

export function computeConfidence(venue: Venue, nowTs: number) {
  const recent = recentCheckins(venue.checkins, nowTs);
  const count = recent.length;
  const avg =
    count > 0
      ? recent.reduce((sum, c) => sum + c.queuePeopleEstimate, 0) / count
      : 0;
  const variance =
    count > 1
      ? recent.reduce((sum, c) => sum + Math.pow(c.queuePeopleEstimate - avg, 2), 0) /
        count
      : 0;
  const hour = new Date(nowTs).getHours();
  const pattern = patternMultiplier(venue, hour);
  const stability = 1 - Math.min(1, Math.abs(venue.currentSignal - pattern) / 1.2);
  const confidence =
    35 + Math.min(45, count * 9) - Math.min(25, variance * 0.7) + stability * 20;
  return clamp(Math.round(confidence), 20, 96);
}

export function computePrediction(venue: Venue, nowTs: number): VenuePrediction {
  const waitNow = computeWaitMinutes(venue, nowTs, 0);
  const waitIn30 = computeWaitMinutes(venue, nowTs, 30);
  const waitIn60 = computeWaitMinutes(venue, nowTs, 60);
  const waitIn120 = computeWaitMinutes(venue, nowTs, 120);
  const confidence = computeConfidence(venue, nowTs);
  const explanation =
    "Based on check-ins, time-of-day patterns, and simulated footfall telemetry.";
  return {
    waitNow,
    waitIn30,
    waitIn60,
    waitIn120,
    confidence,
    explanation
  };
}

export function computeForecast(venue: Venue, nowTs: number): ForecastPoint[] {
  const points: ForecastPoint[] = [];
  for (let minutes = 0; minutes <= 180; minutes += 30) {
    points.push({
      minutesFromNow: minutes,
      wait: computeWaitMinutes(venue, nowTs, minutes),
      confidence: computeConfidence(venue, nowTs)
    });
  }
  return points;
}

export function summarizeCrowd(wait: number) {
  if (wait < 25) return "low";
  if (wait < 55) return "medium";
  return "high";
}

export function pickAlternatives(
  venues: Venue[],
  selected: Venue,
  nowTs: number
) {
  return venues
    .filter((venue) => venue.id !== selected.id)
    .map((venue) => {
      const waitNow = computeWaitMinutes(venue, nowTs, 0);
      return {
        id: venue.id,
        name: venue.name,
        area: venue.area,
        category: venue.category,
        distanceKm: Number(distanceKm(selected, venue).toFixed(1)),
        waitNow
      };
    })
    .sort((a, b) => a.waitNow - b.waitNow)
    .slice(0, 3);
}

export function computeRecommendation({
  venue,
  nowTs,
  alternatives,
  directedTraffic,
  fairnessMode,
  timeOffsetMinutes
}: {
  venue: Venue;
  nowTs: number;
  alternatives: ReturnType<typeof pickAlternatives>;
  directedTraffic: Record<string, number>;
  fairnessMode: boolean;
  timeOffsetMinutes: number;
}): Recommendation {
  const waitNow = computeWaitMinutes(venue, nowTs, timeOffsetMinutes);
  const waitIn60 = computeWaitMinutes(venue, nowTs, timeOffsetMinutes + 60);
  const waitIn120 = computeWaitMinutes(venue, nowTs, timeOffsetMinutes + 120);
  const times = [
    { label: "Now", wait: waitNow },
    { label: "In 1h", wait: waitIn60 },
    { label: "In 2h", wait: waitIn120 }
  ];
  const bestTime = times.reduce((best, current) =>
    current.wait < best.wait ? current : best
  );

  const scoredAlternatives = alternatives.map((alt) => {
    const penalty = fairnessMode ? (directedTraffic[alt.id] ?? 0) * 1.6 : 0;
    return {
      ...alt,
      penalty,
      score: alt.waitNow + penalty
    };
  });

  const bestAlt = [...scoredAlternatives].sort((a, b) => a.score - b.score)[0];
  const rawBestAlt = [...alternatives].sort((a, b) => a.waitNow - b.waitNow)[0];

  if (bestAlt && bestAlt.waitNow + 8 < waitNow) {
    const fairnessImpact = fairnessMode
      ? Math.round(
          clamp(((bestAlt.penalty || 0) / Math.max(10, bestAlt.waitNow)) * 100, 6, 28)
        )
      : undefined;
    return {
      action: "GO ELSEWHERE",
      rationale: [
        `${bestAlt.name} is about ${waitNow - bestAlt.waitNow} min faster right now.`,
        `Your mission flow stays smooth with ${bestAlt.waitNow} min queues.`,
        fairnessMode && rawBestAlt && rawBestAlt.id !== bestAlt.id
          ? "Fairness mode redirected traffic to keep things balanced."
          : "Alternate routes keep the crowd happy."
      ].filter(Boolean) as string[],
      bestTimeLabel: "Now",
      fairnessImpact,
      alternativeId: bestAlt.id
    };
  }

  if (waitNow <= bestTime.wait - 6) {
    return {
      action: "GO NOW",
      rationale: [
        "Current wave is calmer than later peaks.",
        "Footfall telemetry looks stable.",
        "Recent scout check-ins are chill."
      ],
      bestTimeLabel: "Now"
    };
  }

  return {
    action: "WAIT",
    rationale: [
      `Queues soften around ${bestTime.label}.`,
      "Let the surge disperse before you glide in.",
      "Confidence is higher with a short delay."
    ],
    bestTimeLabel: bestTime.label
  };
}
