import Link from "next/link";
import { ArrowLeft, Sparkles } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-pilot-gradient px-6 py-10 text-white">
      <div className="mx-auto flex w-full max-w-4xl flex-col gap-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-white/60">BridgePilot</p>
            <h1 className="font-display text-3xl">About the Adaptive City</h1>
          </div>
          <Button variant="outline" asChild>
            <Link href="/">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Demo
            </Link>
          </Button>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-pilot-neon" />
              Story
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6 text-sm text-white/80">
            <div>
              <h2 className="text-base font-semibold text-white">Adaptive City</h2>
              <ul className="mt-2 list-disc space-y-2 pl-5 text-white/70">
                <li>Predicts queue pressure from local check-ins and time-of-day patterns.</li>
                <li>Balances guest flow across Yas Island experiences for smoother days.</li>
                <li>Turns crowd management into a playful, human-friendly mission.</li>
              </ul>
            </div>
            <div>
              <h2 className="text-base font-semibold text-white">Fairness</h2>
              <ul className="mt-2 list-disc space-y-2 pl-5 text-white/70">
                <li>Traffic is spread across nearby venues instead of funneling everyone to one.</li>
                <li>Fairness mode clearly shows its influence on recommendations.</li>
                <li>Community check-ins make the guidance transparent and friendly.</li>
              </ul>
            </div>
            <div>
              <h2 className="text-base font-semibold text-white">Privacy</h2>
              <ul className="mt-2 list-disc space-y-2 pl-5 text-white/70">
                <li>No personal IDs required. We only collect anonymous queue signals.</li>
                <li>Photos are optional and can be scrubbed or mocked in demo mode.</li>
                <li>Predictions happen locally for fast, safe insights.</li>
              </ul>
            </div>
            <div>
              <h2 className="text-base font-semibold text-white">Future Roadmap</h2>
              <ul className="mt-2 list-disc space-y-2 pl-5 text-white/70">
                <li>Integrate event schedules (F1, concerts) for smarter surge detection.</li>
                <li>Real-time SMS nudges for families and accessibility lanes.</li>
                <li>Expand to multi-city tourist hubs across the UAE.</li>
              </ul>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
