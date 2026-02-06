import * as React from "react";

import { cn } from "@/lib/utils";

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "outline" | "glow";
}

export function Badge({ className, variant = "default", ...props }: BadgeProps) {
  return (
    <div
      className={cn(
        "inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-wide",
        variant === "default" && "bg-white/15 text-white",
        variant === "outline" && "border border-white/30 text-white/80",
        variant === "glow" && "bg-pilot-neon text-pilot-night shadow-glow",
        className
      )}
      {...props}
    />
  );
}
