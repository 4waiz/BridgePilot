export type VenueCategory = "government" | "tourism" | "food" | "retail";

export const MOODS = [
  "\u{1F60C}",
  "\u{1F62C}",
  "\u{1F621}",
  "\u{1F929}"
] as const;

export type Mood = (typeof MOODS)[number];

export interface Checkin {
  id: string;
  venueId: string;
  timestamp: number;
  queuePeopleEstimate: number;
  mood: Mood;
  note: string;
  user: string;
  photoUrl?: string;
}

export interface Venue {
  id: string;
  name: string;
  category: VenueCategory;
  area: string;
  lat: number;
  lng: number;
  basePopularity: number;
  typicalPattern: number[];
  currentSignal: number;
  checkins: Checkin[];
}

export interface ForecastPoint {
  minutesFromNow: number;
  wait: number;
  confidence: number;
}

export interface VenuePrediction {
  waitNow: number;
  waitIn30: number;
  waitIn60: number;
  waitIn120: number;
  confidence: number;
  explanation: string;
}

export interface Recommendation {
  action: "GO NOW" | "WAIT" | "GO ELSEWHERE";
  rationale: string[];
  bestTimeLabel: string;
  fairnessImpact?: number;
  alternativeId?: string;
}

export interface VenueSummary {
  id: string;
  name: string;
  category: VenueCategory;
  area: string;
  lat: number;
  lng: number;
  currentSignal: number;
  directedTraffic: number;
  waitNow: number;
  confidence: number;
  crowd: "low" | "medium" | "high";
}

export interface FeedEntry {
  id: string;
  venueId: string;
  venueName: string;
  user: string;
  mood: Mood;
  note: string;
  queuePeopleEstimate: number;
  timestamp: number;
}

export interface LeaderboardEntry {
  handle: string;
  count: number;
}

export interface MetricsSummary {
  averageMinutesSaved: number;
  checkinsProcessed: number;
  predictionConfidenceAvg: number;
}

export interface CityPulse {
  level: "green" | "yellow" | "red";
  label: string;
}

export interface VenueDetailResponse {
  timestamp: number;
  venue: Venue;
  prediction: VenuePrediction;
  forecast: ForecastPoint[];
  alternatives: Array<{
    id: string;
    name: string;
    area: string;
    category: VenueCategory;
    distanceKm: number;
    waitNow: number;
    directedTraffic: number;
  }>;
  recommendation: Recommendation;
  checkins: Checkin[];
}

export interface SimStore {
  venues: Venue[];
  directedTraffic: Record<string, number>;
  surges: Record<string, number>;
  checkinsProcessed: number;
  lastTick: number;
  timer?: NodeJS.Timeout;
}
