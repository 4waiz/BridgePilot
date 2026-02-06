"use client";

import { Wind } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { formatWait } from "@/lib/utils";
import type { VenueCategory } from "@/lib/types";

export interface AlternativeOption {
  id: string;
  name: string;
  area: string;
  category: VenueCategory;
  distanceKm: number;
  waitNow: number;
  directedTraffic: number;
}

export function AlternativesCard({
  alternatives
}: {
  alternatives: AlternativeOption[];
}) {
  return (
    <div className="pilot-card flex flex-col gap-3 p-4">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.2em] text-white/60">Alternatives</p>
          <h3 className="text-lg font-semibold">Nearby Shorter Waits</h3>
        </div>
        <Badge variant="outline">
          <Wind className="mr-1 h-3 w-3" />
          Breeze
        </Badge>
      </div>
      <div className="space-y-2">
        {alternatives.map((alt) => (
          <div
            key={alt.id}
            className="flex items-center justify-between rounded-2xl border border-white/10 bg-white/5 p-3"
          >
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
        ))}
      </div>
    </div>
  );
}
