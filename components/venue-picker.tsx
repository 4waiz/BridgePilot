"use client";

import { motion } from "framer-motion";
import { MapPin, Search, Timer } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { fuzzyMatch, formatWait } from "@/lib/utils";
import { missionBoostScore } from "@/lib/mission";
import type { VenueCategory, VenueSummary } from "@/lib/types";

const timeOptions = [
  { label: "Now", value: 0 },
  { label: "In 30m", value: 30 },
  { label: "In 1h", value: 60 },
  { label: "In 2h", value: 120 }
];

export function VenuePicker({
  venues,
  selectedId,
  onSelect,
  search,
  onSearch,
  mission,
  onMissionChange,
  timeOffset,
  onTimeOffsetChange,
  missionCategory,
  missionLabel,
  missionKeywords
}: {
  venues: VenueSummary[];
  selectedId?: string | null;
  onSelect: (id: string) => void;
  search: string;
  onSearch: (value: string) => void;
  mission: string;
  onMissionChange: (value: string) => void;
  timeOffset: number;
  onTimeOffsetChange: (value: number) => void;
  missionCategory?: VenueCategory | null;
  missionLabel?: string | null;
  missionKeywords?: string[] | null;
}) {
  const filtered = venues
    .map((venue) => ({
      venue,
      score:
        fuzzyMatch(search, `${venue.name} ${venue.area}`) +
        missionBoostScore(missionCategory, venue.category)
    }))
    .filter(({ score }) => score > 0)
    .sort((a, b) => b.score - a.score)
    .map(({ venue }) => venue);

  return (
    <div className="pilot-card flex h-full flex-col gap-4 p-5">
      <div>
        <p className="text-sm uppercase tracking-[0.2em] text-white/60">Mission Control</p>
        <h2 className="mt-1 text-lg font-semibold">Pick Your Venue</h2>
      </div>

      <div className="relative">
        <Search className="pointer-events-none absolute left-3 top-3 h-4 w-4 text-white/50" />
        <Input
          value={search}
          onChange={(event) => onSearch(event.target.value)}
          placeholder="Search Yas Mall, Ferrari World..."
          className="pl-9"
        />
      </div>

      <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
        <p className="text-xs font-semibold uppercase tracking-wide text-white/70">
          My Mission
        </p>
        <Input
          value={mission}
          onChange={(event) => onMissionChange(event.target.value)}
          placeholder="I need: renew docs / coffee / attraction / dinner"
          className="mt-2"
        />
        {missionLabel ? (
          <div className="mt-2 text-xs text-white/60">
            Detected: <span className="text-pilot-neon">{missionLabel}</span>
            {missionKeywords && missionKeywords.length > 0
              ? ` (matched: ${missionKeywords.slice(0, 2).join(", ")})`
              : ""}
          </div>
        ) : null}
      </div>

      <div>
        <div className="mb-2 flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-white/70">
          <Timer className="h-4 w-4 text-pilot-neon" />
          Time Travel
        </div>
        <Tabs value={`${timeOffset}`} onValueChange={(value) => onTimeOffsetChange(Number(value))}>
          <TabsList className="w-full justify-between">
            {timeOptions.map((option) => (
              <TabsTrigger key={option.value} value={`${option.value}`} className="flex-1">
                {option.label}
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>
      </div>

      <div className="flex-1 space-y-2 overflow-y-auto pr-1 scrollbar-hidden">
        {filtered.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-white/20 bg-white/5 p-4 text-center text-sm text-white/60">
            No matching venues. Try \"Yas\" or \"Corniche\".
          </div>
        ) : null}
        {filtered.map((venue, index) => {
          const active = venue.id === selectedId;
          return (
            <motion.button
              key={venue.id}
              onClick={() => onSelect(venue.id)}
              className={`flex w-full items-center justify-between rounded-2xl border px-3 py-3 text-left transition ${
                active
                  ? "border-pilot-neon bg-white/15"
                  : "border-white/10 bg-white/5 hover:border-white/30"
              }`}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.02 }}
            >
              <div>
                <p className="text-sm font-semibold">{venue.name}</p>
                <div className="mt-1 flex items-center gap-2 text-xs text-white/60">
                  <MapPin className="h-3 w-3" />
                  <span>{venue.area}</span>
                  <Badge variant="outline">{venue.category}</Badge>
                  {missionCategory && missionCategory === venue.category ? (
                    <Badge variant="glow">Mission Match</Badge>
                  ) : null}
                </div>
              </div>
              <div className="text-right">
                <p className="text-lg font-semibold text-pilot-neon">
                  {formatWait(venue.waitNow)}
                </p>
                <p className="text-xs text-white/60">{venue.crowd} crowd</p>
              </div>
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}
