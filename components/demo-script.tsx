"use client";

import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";

export function DemoScript({
  open,
  onOpenChange
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-xl">
        <DialogHeader>
          <DialogTitle>90-Second Demo Script</DialogTitle>
          <DialogDescription>
            A crisp walkthrough for judges. Hit each beat in order.
          </DialogDescription>
        </DialogHeader>
        <ol className="space-y-3 text-sm text-white/80">
          <li>
            <strong>1. Hook:</strong> "Queues on Yas Island can spike fast. BridgePilot keeps
            guests moving with live wait predictions."
          </li>
          <li>
            <strong>2. Pick a venue:</strong> Search Yas Mall or Ferrari World and show the
            predicted wait now vs later.
          </li>
          <li>
            <strong>3. Captain rec:</strong> Highlight GO NOW / WAIT. Mention fairness mode
            balancing crowds.
          </li>
          <li>
            <strong>4. Add check-in:</strong> Submit a mood + queue length and show confetti +
            updated wait.
          </li>
          <li>
            <strong>5. Simulate surge:</strong> Trigger a crowd spike and watch the map pulse.
          </li>
          <li>
            <strong>6. Close:</strong> "BridgePilot saves minutes, spreads visitors, and keeps
            Yas Island joyful."
          </li>
        </ol>
      </DialogContent>
    </Dialog>
  );
}
