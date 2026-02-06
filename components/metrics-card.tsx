"use client";

import { Gauge, ShieldCheck, Timer } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import type { MetricsSummary } from "@/lib/types";

export function MetricsCard({ metrics }: { metrics?: MetricsSummary | null }) {
  if (!metrics) return null;

  return (
    <div className="pilot-card flex flex-col gap-3 p-4">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.2em] text-white/60">Mission Metrics</p>
          <h3 className="text-lg font-semibold">Impact Snapshot</h3>
        </div>
        <Badge variant="outline">Live</Badge>
      </div>
      <div className="grid gap-2">
        <div className="flex items-center justify-between rounded-2xl border border-white/10 bg-white/5 p-3">
          <div className="flex items-center gap-2 text-sm">
            <Timer className="h-4 w-4 text-pilot-neon" />
            Average minutes saved today
          </div>
          <span className="text-lg font-semibold text-pilot-neon">
            {metrics.averageMinutesSaved}m
          </span>
        </div>
        <div className="flex items-center justify-between rounded-2xl border border-white/10 bg-white/5 p-3">
          <div className="flex items-center gap-2 text-sm">
            <Gauge className="h-4 w-4 text-pilot-sun" />
            Check-ins processed
          </div>
          <span className="text-lg font-semibold text-pilot-sun">
            {metrics.checkinsProcessed}
          </span>
        </div>
        <div className="flex items-center justify-between rounded-2xl border border-white/10 bg-white/5 p-3">
          <div className="flex items-center gap-2 text-sm">
            <ShieldCheck className="h-4 w-4 text-pilot-ocean" />
            Prediction confidence avg
          </div>
          <span className="text-lg font-semibold text-pilot-ocean">
            {metrics.predictionConfidenceAvg}%
          </span>
        </div>
      </div>
    </div>
  );
}
