"use client";

import { motion } from "framer-motion";
import { Flag, Navigation, Sparkles } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { formatWait } from "@/lib/utils";
import type { Recommendation, VenueCategory } from "@/lib/types";

export interface AlternativeOption {
  id: string;
  name: string;
  area: string;
  category: VenueCategory;
  distanceKm: number;
  waitNow: number;
  directedTraffic: number;
}

export function RecommendationPanel({
  recommendation,
  alternatives,
  onNavigate,
  onAddCheckin,
  onFindAlternative,
  fairnessMode
}: {
  recommendation: Recommendation;
  alternatives: AlternativeOption[];
  onNavigate: () => void;
  onAddCheckin: () => void;
  onFindAlternative: () => void;
  fairnessMode: boolean;
}) {
  const actionColor =
    recommendation.action === "GO NOW"
      ? "text-pilot-neon"
      : recommendation.action === "WAIT"
      ? "text-pilot-sun"
      : "text-pilot-magenta";

  const alt = alternatives.find((item) => item.id === recommendation.alternativeId);

  return (
    <div className="pilot-card flex h-full flex-col gap-4 p-5">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.2em] text-white/60">AI Captain</p>
          <h3 className="text-lg font-semibold">Recommendation</h3>
        </div>
        <Badge variant="outline">Live</Badge>
      </div>

      <motion.div
        className="rounded-2xl border border-white/10 bg-white/5 p-4 text-center"
        animate={{ y: [0, -4, 0] }}
        transition={{ duration: 3, repeat: Infinity }}
      >
        <p className={`text-2xl font-semibold ${actionColor}`}>{recommendation.action}</p>
        <p className="mt-1 text-xs uppercase tracking-wide text-white/60">
          Best window: {recommendation.bestTimeLabel}
        </p>
      </motion.div>

      <ul className="space-y-2 text-sm text-white/80">
        {recommendation.rationale.map((item) => (
          <li key={item} className="flex items-start gap-2">
            <span className="mt-1 h-2 w-2 rounded-full bg-pilot-neon" />
            {item}
          </li>
        ))}
      </ul>

      {fairnessMode && recommendation.fairnessImpact ? (
        <div className="rounded-2xl border border-pilot-neon/40 bg-pilot-neon/10 p-3 text-xs text-white/80">
          Fairness mode diverted {recommendation.fairnessImpact}% traffic to keep queues even.
        </div>
      ) : null}

      {alt ? (
        <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
          <div className="mb-2 flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-white/70">
            <Sparkles className="h-4 w-4 text-pilot-magenta" />
            Nearby Alternative
          </div>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-semibold">{alt.name}</p>
              <p className="text-xs text-white/60">
                {alt.area} - {alt.distanceKm} km - {alt.category}
              </p>
            </div>
            <p className="text-lg font-semibold text-pilot-neon">
              {formatWait(alt.waitNow)}
            </p>
          </div>
        </div>
      ) : null}

      <div className="mt-auto grid gap-2">
        <Button onClick={onNavigate} className="w-full">
          <Navigation className="h-4 w-4" />
          Navigate
        </Button>
        <Button variant="outline" onClick={onAddCheckin} className="w-full">
          <Flag className="h-4 w-4" />
          Add Check-in
        </Button>
        <Button variant="funky" onClick={onFindAlternative} className="w-full">
          Find Alternative
        </Button>
      </div>
    </div>
  );
}
