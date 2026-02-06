"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Rocket, Radar, Zap, Mic } from "lucide-react";

export function TopBar({
  fairnessMode,
  onToggleFairness,
  onSimulateSurge,
  onOpenDemoScript,
  captainMode,
  onToggleCaptain
}: {
  fairnessMode: boolean;
  onToggleFairness: (value: boolean) => void;
  onSimulateSurge: () => void;
  onOpenDemoScript: () => void;
  captainMode: boolean;
  onToggleCaptain: (value: boolean) => void;
}) {
  return (
    <div className="flex flex-col gap-4 rounded-2xl border border-white/10 bg-white/5 p-4 shadow-card backdrop-blur lg:flex-row lg:items-center lg:justify-between">
      <div className="flex items-center gap-3">
        <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-pilot-neon via-pilot-ocean to-pilot-lavender text-pilot-night shadow-glow">
          <Rocket className="h-6 w-6" />
        </div>
        <div>
          <p className="font-display text-xl">BridgePilot</p>
          <p className="text-xs text-white/70">City Wait-Time Agent - Yas Island</p>
        </div>
        <Badge className="ml-2" variant="glow">
          Demo Mode
        </Badge>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <div className="flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-2">
          <Radar className="h-4 w-4 text-pilot-neon" />
          <span className="text-xs font-semibold uppercase tracking-wide">Fairness Mode</span>
          <Switch
            checked={fairnessMode}
            onCheckedChange={onToggleFairness}
            aria-label="Toggle fairness mode"
          />
        </div>

        <div className="flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-2">
          <Mic className="h-4 w-4 text-pilot-sun" />
          <span className="text-xs font-semibold uppercase tracking-wide">Captain Voice</span>
          <Switch
            checked={captainMode}
            onCheckedChange={onToggleCaptain}
            aria-label="Toggle captain voice"
          />
        </div>

        <Button variant="danger" onClick={onSimulateSurge}>
          <Zap className="h-4 w-4" />
          Simulate Crowd Surge
        </Button>
        <Button variant="outline" onClick={onOpenDemoScript}>
          Demo Script
        </Button>
      </div>
    </div>
  );
}
