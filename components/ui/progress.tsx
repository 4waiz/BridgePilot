import * as React from "react";

import { cn } from "@/lib/utils";

const Progress = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & { value?: number }
>(({ className, value = 0, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("relative h-3 w-full overflow-hidden rounded-full bg-white/10", className)}
    {...props}
  >
    <div
      className="h-full rounded-full bg-gradient-to-r from-pilot-neon via-pilot-ocean to-pilot-lavender transition-all"
      style={{ width: `${Math.min(100, Math.max(0, value))}%` }}
    />
  </div>
));
Progress.displayName = "Progress";

export { Progress };
