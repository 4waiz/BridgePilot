"use client";

import { motion } from "framer-motion";
import { MapPinned } from "lucide-react";

import { cn } from "@/lib/utils";
import type { VenueSummary } from "@/lib/types";

export function ToyMap({
  venues,
  selectedId,
  recommendedId,
  onSelect
}: {
  venues: VenueSummary[];
  selectedId?: string | null;
  recommendedId?: string | null;
  onSelect: (id: string) => void;
}) {
  if (venues.length === 0) return null;

  const lats = venues.map((v) => v.lat);
  const lngs = venues.map((v) => v.lng);
  const minLat = Math.min(...lats);
  const maxLat = Math.max(...lats);
  const minLng = Math.min(...lngs);
  const maxLng = Math.max(...lngs);

  const position = (venue: VenueSummary) => {
    const x = ((venue.lng - minLng) / (maxLng - minLng)) * 100;
    const y = 100 - ((venue.lat - minLat) / (maxLat - minLat)) * 100;
    return { x, y };
  };

  const recommended = recommendedId
    ? venues.find((venue) => venue.id === recommendedId)
    : undefined;
  const recommendedPos = recommended ? position(recommended) : null;

  return (
    <div className="pilot-card relative h-56 overflow-hidden p-4">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(11,181,255,0.25),transparent_55%),radial-gradient(circle_at_80%_70%,rgba(255,61,143,0.2),transparent_45%)]" />
      <div className="relative h-full rounded-2xl border border-white/10 bg-white/5">
        <div className="absolute left-3 top-3 flex items-center gap-2 rounded-full bg-black/40 px-3 py-1 text-xs font-semibold text-white/80">
          <MapPinned className="h-4 w-4 text-pilot-neon" />
          Yas Radar Map
        </div>

        {recommendedPos ? (
          <svg className="absolute inset-0" viewBox="0 0 100 100" preserveAspectRatio="none">
            <defs>
              <marker id="arrow" markerWidth="6" markerHeight="6" refX="4" refY="3" orient="auto">
                <polygon points="0 0, 6 3, 0 6" fill="#23f0c7" />
              </marker>
            </defs>
            <line
              x1="10"
              y1="90"
              x2={recommendedPos.x}
              y2={recommendedPos.y}
              stroke="#23f0c7"
              strokeWidth="1.2"
              strokeDasharray="4 3"
              markerEnd="url(#arrow)"
            />
          </svg>
        ) : null}

        {venues.map((venue) => {
          const { x, y } = position(venue);
          const isSelected = venue.id === selectedId;
          const isHot = venue.waitNow > 60;
          return (
            <button
              key={venue.id}
              onClick={() => onSelect(venue.id)}
              className={cn(
                "group absolute -translate-x-1/2 -translate-y-1/2",
                isSelected && "z-20"
              )}
              style={{ left: `${x}%`, top: `${y}%` }}
            >
              <span
                className={cn(
                  "relative flex h-3 w-3 items-center justify-center rounded-full",
                  isSelected
                    ? "bg-pilot-neon shadow-glow"
                    : "bg-white/70"
                )}
              />
              {isHot ? (
                <span className="absolute inset-0 -translate-x-1/2 -translate-y-1/2 animate-pulseRing rounded-full border border-pilot-magenta" />
              ) : null}
              <motion.span
                className="absolute left-4 top-1/2 hidden -translate-y-1/2 whitespace-nowrap rounded-full bg-black/70 px-2 py-1 text-[10px] text-white/80 group-hover:block"
                initial={{ opacity: 0, x: -4 }}
                whileHover={{ opacity: 1, x: 0 }}
              >
                {venue.name}
              </motion.span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
