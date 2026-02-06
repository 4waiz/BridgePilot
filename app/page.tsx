"use client";

import { useCallback, useEffect, useState } from "react";

import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";

import { AlternativesCard } from "@/components/alternatives-card";
import { CheckinModal } from "@/components/checkin-modal";
import { DemoScript } from "@/components/demo-script";
import { LiveFeed } from "@/components/live-feed";
import { MetricsCard } from "@/components/metrics-card";
import { RecommendationPanel } from "@/components/recommendation-panel";
import { ToastStack, type ToastItem } from "@/components/toast-stack";
import { TopBar } from "@/components/top-bar";
import { ToyMap } from "@/components/toy-map";
import { VenueDetails } from "@/components/venue-details";
import { VenuePicker } from "@/components/venue-picker";
import { parseMission } from "@/lib/mission";
import type {
  CityPulse,
  FeedEntry,
  LeaderboardEntry,
  MetricsSummary,
  VenueDetailResponse,
  VenueSummary
} from "@/lib/types";

const refreshMs = 10000;

export default function HomePage() {
  const [venues, setVenues] = useState<VenueSummary[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [detail, setDetail] = useState<VenueDetailResponse | null>(null);
  const [feed, setFeed] = useState<FeedEntry[]>([]);
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [metrics, setMetrics] = useState<MetricsSummary | null>(null);
  const [cityPulse, setCityPulse] = useState<CityPulse | null>(null);
  const [search, setSearch] = useState("");
  const [mission, setMission] = useState("");
  const [fairnessMode, setFairnessMode] = useState(true);
  const [timeOffset, setTimeOffset] = useState(0);
  const [demoScriptOpen, setDemoScriptOpen] = useState(false);
  const [checkinOpen, setCheckinOpen] = useState(false);
  const [toasts, setToasts] = useState<ToastItem[]>([]);
  const [captainMode, setCaptainMode] = useState(false);
  const [missionLock, setMissionLock] = useState(false);

  const pushToast = useCallback((message: string, variant?: ToastItem["variant"]) => {
    const id = `${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;
    setToasts((prev) => [...prev, { id, message, variant }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((toast) => toast.id !== id));
    }, 3500);
  }, []);

  const fetchSummary = useCallback(async () => {
    const res = await fetch("/api/venues");
    const data = await res.json();
    setVenues(data.venues ?? []);
    setFeed(data.feed ?? []);
    setLeaderboard(data.leaderboard ?? []);
    setMetrics(data.metrics ?? null);
    setCityPulse(data.cityPulse ?? null);
    if (!selectedId && data.venues?.length) {
      setSelectedId(data.venues[0].id);
    }
  }, [selectedId]);

  const fetchDetail = useCallback(async () => {
    if (!selectedId) return;
    const res = await fetch(
      `/api/venues/${selectedId}?timeOffset=${timeOffset}&fairness=${fairnessMode ? 1 : 0}`
    );
    const data = await res.json();
    setDetail(data);
  }, [selectedId, timeOffset, fairnessMode]);

  useEffect(() => {
    fetchSummary();
    const interval = setInterval(fetchSummary, refreshMs);
    return () => clearInterval(interval);
  }, [fetchSummary]);

  useEffect(() => {
    fetchDetail();
    if (!selectedId) return;
    const interval = setInterval(fetchDetail, refreshMs);
    return () => clearInterval(interval);
  }, [fetchDetail, selectedId]);

  useEffect(() => {
    if (!captainMode) return;
    if (!detail?.recommendation) return;
    if (typeof window === "undefined") return;
    if (!("speechSynthesis" in window)) return;

    const text = `Captain says ${detail.recommendation.action}. ${detail.recommendation.rationale[0]}`;
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 0.95;
    utterance.pitch = 1.05;

    const voices = window.speechSynthesis.getVoices();
    const preferred =
      voices.find((voice) => voice.lang.startsWith("en") && voice.name.includes("Male")) ||
      voices.find((voice) => voice.lang.startsWith("en")) ||
      voices[0];
    if (preferred) utterance.voice = preferred;

    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(utterance);
  }, [captainMode, detail?.recommendation, detail?.timestamp]);

  useEffect(() => {
    if (captainMode) return;
    if (typeof window === "undefined") return;
    if ("speechSynthesis" in window) {
      window.speechSynthesis.cancel();
    }
  }, [captainMode]);

  const missionIntent = parseMission(mission);

  const handleMissionChange = (value: string) => {
    setMission(value);
    setMissionLock(false);
  };

  useEffect(() => {
    if (!missionIntent || missionLock) return;
    if (!venues.length) return;
    const match = venues.find((venue) => venue.category === missionIntent.category);
    if (match && match.id !== selectedId) {
      setSelectedId(match.id);
      setMissionLock(true);
      pushToast(`\u{1F9ED} Mission locked: ${missionIntent.label} venues boosted.`);
    }
  }, [missionIntent, venues, selectedId, missionLock, pushToast]);

  const handleSimulateSurge = async () => {
    const res = await fetch("/api/surge", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ count: 1 })
    });
    const data = await res.json();
    const impacted = data.impacted?.[0] ?? "Yas Mall";
    pushToast(`\u{1F6A8} Crowd surge near ${impacted}!`, "alert");
    fetchSummary();
    fetchDetail();
  };

  const handleNavigate = () => {
    pushToast("\u{1F6F0} Autopilot route locked. Smooth skies ahead!");
  };

  const handleFindAlternative = () => {
    const alternativeId = detail?.recommendation?.alternativeId;
    if (alternativeId) {
      setSelectedId(alternativeId);
      pushToast("\u{1F9ED} Switched to a breezier option.");
    } else {
      pushToast("\u{1F31F} Already the best spot, captain.");
    }
  };

  const handleCheckinComplete = () => {
    pushToast("\u{2728} Check-in logged. Crowds updated!");
    fetchSummary();
    fetchDetail();
  };

  return (
    <div className="min-h-screen px-6 py-6">
      <ToastStack toasts={toasts} onDismiss={(id) => setToasts((prev) => prev.filter((t) => t.id !== id))} />
      <DemoScript open={demoScriptOpen} onOpenChange={setDemoScriptOpen} />
      <CheckinModal
        open={checkinOpen}
        onOpenChange={setCheckinOpen}
        venue={detail?.venue ?? null}
        onSubmitted={handleCheckinComplete}
      />

      <div className="mx-auto flex w-full max-w-7xl flex-col gap-6">
        <TopBar
          fairnessMode={fairnessMode}
          onToggleFairness={setFairnessMode}
          onSimulateSurge={handleSimulateSurge}
          onOpenDemoScript={() => setDemoScriptOpen(true)}
          captainMode={captainMode}
          onToggleCaptain={setCaptainMode}
        />

        <div className="grid gap-6 xl:grid-cols-[300px_1fr_320px]">
          <div className="flex flex-col gap-4">
            <VenuePicker
              venues={venues}
              selectedId={selectedId}
              onSelect={(id) => {
                setSelectedId(id);
                setMissionLock(true);
              }}
              search={search}
              onSearch={setSearch}
              mission={mission}
              onMissionChange={handleMissionChange}
              timeOffset={timeOffset}
              onTimeOffsetChange={setTimeOffset}
              missionCategory={missionIntent?.category ?? null}
              missionLabel={missionIntent?.label ?? null}
              missionKeywords={missionIntent?.keywords ?? null}
            />
            <ToyMap
              venues={venues}
              selectedId={selectedId}
              recommendedId={detail?.recommendation?.alternativeId ?? null}
              onSelect={(id) => {
                setSelectedId(id);
                setMissionLock(true);
              }}
            />
          </div>

          <div className="flex flex-col gap-4">
            {detail?.venue ? (
              <VenueDetails
                venue={detail.venue}
                prediction={detail.prediction}
                forecast={detail.forecast}
                timeOffset={timeOffset}
                missionCategory={missionIntent?.category ?? null}
              />
            ) : (
              <div className="pilot-card flex h-full items-center justify-center p-6 text-white/70">
                Loading venue data...
              </div>
            )}
            <MetricsCard metrics={metrics} />
          </div>

          <div className="flex flex-col gap-4">
            {detail?.recommendation ? (
              <RecommendationPanel
                recommendation={detail.recommendation}
                alternatives={detail.alternatives}
                fairnessMode={fairnessMode}
                onNavigate={handleNavigate}
                onAddCheckin={() => setCheckinOpen(true)}
                onFindAlternative={handleFindAlternative}
              />
            ) : (
              <div className="pilot-card flex h-full items-center justify-center p-6 text-white/70">
                Awaiting captain signals...
              </div>
            )}

            {detail?.alternatives ? (
              <AlternativesCard alternatives={detail.alternatives} />
            ) : null}

            <motion.div
              className="pilot-card flex items-center gap-3 p-4"
              animate={{ opacity: [0.7, 1, 0.7] }}
              transition={{ duration: 3, repeat: Infinity }}
            >
              <Sparkles className="h-5 w-5 text-pilot-magenta" />
              <div>
                <p className="text-sm font-semibold">Live Update Engine</p>
                <p className="text-xs text-white/60">Syncing every 10 seconds</p>
              </div>
            </motion.div>
          </div>
        </div>

        <LiveFeed feed={feed} leaderboard={leaderboard} cityPulse={cityPulse} />
      </div>
    </div>
  );
}
