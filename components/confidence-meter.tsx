"use client";

import { Info } from "lucide-react";

import { Progress } from "@/components/ui/progress";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger
} from "@/components/ui/tooltip";

export function ConfidenceMeter({ value, note }: { value: number; note: string }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
      <div className="mb-2 flex items-center justify-between text-xs font-semibold uppercase tracking-wide text-white/70">
        <span>Confidence Meter</span>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger className="text-white/60">
              <Info className="h-4 w-4" />
            </TooltipTrigger>
            <TooltipContent>{note}</TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
      <Progress value={value} />
      <p className="mt-2 text-sm font-semibold text-pilot-neon">{value}% locked</p>
    </div>
  );
}
