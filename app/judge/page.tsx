import Link from "next/link";
import { ArrowLeft, BadgeCheck, ChartBar, Globe2, Play } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function JudgePage() {
  return (
    <div className="min-h-screen bg-pilot-gradient px-6 py-10 text-white">
      <div className="mx-auto flex w-full max-w-5xl flex-col gap-6">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-white/60">Judge View</p>
            <h1 className="font-display text-3xl">BridgePilot Summary</h1>
          </div>
          <Button variant="outline" asChild>
            <Link href="/">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Demo
            </Link>
          </Button>
        </div>

        <div className="grid gap-4 lg:grid-cols-3">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Globe2 className="h-5 w-5 text-pilot-neon" />
                Problem
              </CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-white/80">
              Yas Island experiences face unpredictable queues. Visitors lose time, and
              venues suffer uneven crowding.
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BadgeCheck className="h-5 w-5 text-pilot-sun" />
                Solution
              </CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-white/80">
              BridgePilot predicts wait times with live check-ins, then nudges people to the
              best time or a fairer alternative.
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ChartBar className="h-5 w-5 text-pilot-magenta" />
                Demo Metrics
              </CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-white/80">
              Average minutes saved, check-ins processed, and confidence scores update every
              10 seconds.
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Live Demo Links</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-wrap gap-3">
            <Button asChild>
              <Link href="/">
                <Play className="mr-2 h-4 w-4" />
                Open Dashboard
              </Link>
            </Button>
            <Button variant="outline" asChild>
              <Link href="/about">Read the Story</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
