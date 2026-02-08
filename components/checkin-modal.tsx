"use client";

import { useState } from "react";
import confetti from "canvas-confetti";
import { Camera, Flag } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Textarea } from "@/components/ui/textarea";
import { MOODS } from "@/lib/types";
import type { Mood, Venue } from "@/lib/types";

const moodLabels: Record<string, string> = {
  [MOODS[0]]: "Chill",
  [MOODS[1]]: "Tense",
  [MOODS[2]]: "Spicy",
  [MOODS[3]]: "Hyped"
};

export function CheckinModal({
  open,
  onOpenChange,
  venue,
  onSubmitted
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  venue: Venue | null;
  onSubmitted: () => void;
}) {
  const [queue, setQueue] = useState(15);
  const [mood, setMood] = useState<Mood>(MOODS[0]);
  const [note, setNote] = useState("");
  const [photo, setPhoto] = useState(true);
  const [loading, setLoading] = useState(false);

  const submit = async () => {
    if (!venue) return;
    setLoading(true);
    await fetch("/api/checkin", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        venueId: venue.id,
        queuePeopleEstimate: queue,
        mood,
        note,
        photoUrl: photo ? "/mock-photo.svg" : undefined
      })
    });
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.8 },
      colors: ["#23f0c7", "#ffb703", "#ff3d8f"]
    });
    setLoading(false);
    onOpenChange(false);
    setNote("");
    onSubmitted();
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Flag className="h-5 w-5 text-pilot-neon" />
            Add Check-in
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div>
            <Label>Queue length (people)</Label>
            <div className="mt-2 flex items-center gap-3">
              <Slider
                min={0}
                max={60}
                step={1}
                value={[queue]}
                onValueChange={(value) => setQueue(value[0] ?? 0)}
              />
              <span className="w-10 text-right text-sm font-semibold text-pilot-neon">
                {queue}
              </span>
            </div>
          </div>

          <div>
            <Label>Mood</Label>
            <div className="mt-2 grid grid-cols-4 gap-2">
              {MOODS.map((item) => (
                <button
                  key={item}
                  type="button"
                  onClick={() => setMood(item)}
                  className={`rounded-2xl border px-3 py-2 text-center transition ${
                    mood === item
                      ? "border-pilot-neon bg-pilot-neon/20"
                      : "border-white/10 bg-white/5 hover:border-white/30"
                  }`}
                >
                  <div className="text-lg">{item}</div>
                  <div className="text-[10px] uppercase text-white/60">{moodLabels[item]}</div>
                </button>
              ))}
            </div>
          </div>

          <div>
            <Label>Note</Label>
            <Textarea
              value={note}
              onChange={(event) => setNote(event.target.value)}
              placeholder="Tour bus just landed..."
              className="mt-2"
            />
          </div>

          <div className="rounded-2xl border border-white/10 bg-white/5 p-3">
            <div className="flex items-center justify-between">
              <Label className="flex items-center gap-2">
                <Camera className="h-4 w-4 text-pilot-sun" />
                Attach photo
              </Label>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setPhoto((prev) => !prev)}
              >
                {photo ? "Remove" : "Add"}
              </Button>
            </div>
            {photo ? (
              <div className="mt-3 flex items-center gap-3">
                <img
                  src="/mock-photo.svg"
                  alt="Mock"
                  className="h-16 w-24 rounded-xl border border-white/20 object-cover"
                />
                <Input value="yas-mood.jpg" readOnly className="text-xs" />
              </div>
            ) : null}
          </div>

          <Button onClick={submit} disabled={loading} className="w-full">
            {loading ? "Logging..." : "Submit Check-in"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
