"use client";

import { motion } from "framer-motion";
import { Activity, Compass, Star } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ConfidenceMeter } from "@/components/confidence-meter";
import { ForecastChart } from "@/components/forecast-chart";
import { formatWait } from "@/lib/utils";
import type { ForecastPoint, Venue, VenueCategory, VenuePrediction } from "@/lib/types";

const timeCardLabels = [
  { label: "Now", key: "waitNow" },
  { label: "In 1h", key: "waitIn60" },
  { label: "In 2h", key: "waitIn120" }
] as const;

export function VenueDetails({
  venue,
  prediction,
  forecast,
  timeOffset,
  missionCategory
}: {
  venue: Venue;
  prediction: VenuePrediction;
  forecast: ForecastPoint[];
  timeOffset: number;
  missionCategory?: VenueCategory | null;
}) {
  const waitDisplay = prediction.waitNow;

  const timeLabel =
    timeOffset === 0
      ? "Now"
      : timeOffset === 30
      ? "In 30m"
      : timeOffset === 60
      ? "In 1h"
      : "In 2h";

  return (
    <Card className="h-full">
      <CardHeader className="flex flex-row items-start justify-between gap-4">
        <div>
          <CardTitle className="text-xl">{venue.name}</CardTitle>
          <div className="mt-2 flex flex-wrap items-center gap-2 text-xs text-white/70">
            <Badge variant="outline">{venue.category}</Badge>
            <span className="flex items-center gap-1">
              <Compass className="h-3 w-3" />
              {venue.area}
            </span>
            {missionCategory ? (
              <Badge variant="glow">
                Mission {missionCategory === venue.category ? "Fit: High" : "Fit: Low"}
              </Badge>
            ) : null}
          </div>
        </div>
        <motion.div
          className="rounded-2xl border border-pilot-neon/60 bg-pilot-neon/15 px-4 py-2 text-right"
          animate={{ scale: [1, 1.03, 1] }}
          transition={{ duration: 2.2, repeat: Infinity }}
        >
          <p className="text-xs uppercase tracking-wide text-white/70">{timeLabel}</p>
          <p className="text-3xl font-semibold text-pilot-neon">
            {formatWait(waitDisplay)}
          </p>
          <p className="text-xs text-white/70">predicted wait</p>
        </motion.div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid gap-3 md:grid-cols-3">
          {timeCardLabels.map((item) => (
            <div
              key={item.label}
              className="rounded-2xl border border-white/10 bg-white/5 p-3"
            >
              <p className="text-xs uppercase tracking-wide text-white/60">{item.label}</p>
              <p className="mt-2 text-xl font-semibold text-pilot-neon">
                {formatWait(prediction[item.key])}
              </p>
            </div>
          ))}
        </div>

        <div className="grid gap-4 lg:grid-cols-[1.2fr_1fr]">
          <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
            <div className="mb-2 flex items-center justify-between text-xs font-semibold uppercase tracking-wide text-white/70">
              <span className="flex items-center gap-2">
                <Activity className="h-4 w-4 text-pilot-ocean" />
                Wait Forecast (3h)
              </span>
              <Badge variant="outline">Live</Badge>
            </div>
            <ForecastChart forecast={forecast} />
          </div>
          <div className="flex flex-col gap-3">
            <ConfidenceMeter
              value={prediction.confidence}
              note="Higher confidence comes from steady footfall and recent check-ins."
            />
            <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
              <div className="mb-2 flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-white/70">
                <Star className="h-4 w-4 text-pilot-sun" />
                Captain Explanation
              </div>
              <p className="text-sm text-white/80">{prediction.explanation}</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
