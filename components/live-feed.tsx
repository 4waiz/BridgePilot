"use client";

import { Crown, Radio, Signal } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import type { CityPulse, FeedEntry, LeaderboardEntry } from "@/lib/types";

export function LiveFeed({
  feed,
  leaderboard,
  cityPulse
}: {
  feed: FeedEntry[];
  leaderboard: LeaderboardEntry[];
  cityPulse?: CityPulse | null;
}) {
  const pulseColor =
    cityPulse?.level === "green"
      ? "bg-emerald-400"
      : cityPulse?.level === "yellow"
      ? "bg-amber-400"
      : "bg-rose-500";

  return (
    <div className="pilot-card flex flex-col gap-4 p-5">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.2em] text-white/60">Live Feed</p>
          <h3 className="text-lg font-semibold">Scout Check-ins</h3>
        </div>
        <Badge variant="outline">
          <Radio className="mr-1 h-3 w-3" />
          Live
        </Badge>
      </div>

      <div className="grid gap-3 lg:grid-cols-[1.6fr_1fr]">
        <div className="space-y-2">
          {feed.map((entry) => (
            <div
              key={entry.id}
              className="flex items-center justify-between rounded-2xl border border-white/10 bg-white/5 p-3"
            >
              <div>
                <p className="text-sm font-semibold">{entry.venueName}</p>
                <p className="text-xs text-white/60">
                  {entry.user} - {entry.note}
                </p>
              </div>
              <div className="text-right">
                <p className="text-lg">{entry.mood}</p>
                <p className="text-xs text-white/60">{entry.queuePeopleEstimate} ppl</p>
              </div>
            </div>
          ))}
        </div>

        <div className="flex flex-col gap-3">
          <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
            <div className="mb-2 flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-white/70">
              <Crown className="h-4 w-4 text-pilot-sun" />
              Most Helpful Scouts
            </div>
            <div className="space-y-2 text-sm">
              {leaderboard.map((entry) => (
                <div key={entry.handle} className="flex items-center justify-between">
                  <span>{entry.handle}</span>
                  <span className="text-white/60">{entry.count} reports</span>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
            <div className="mb-2 flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-white/70">
              <Signal className="h-4 w-4 text-pilot-neon" />
              City Pulse
            </div>
            <div className="flex items-center gap-3">
              <span className={`h-3 w-3 rounded-full ${pulseColor} animate-bounce`} />
              <span className="text-sm font-semibold">{cityPulse?.label ?? ""}</span>
              <span className="text-xs text-white/60">Yas + Corniche</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
