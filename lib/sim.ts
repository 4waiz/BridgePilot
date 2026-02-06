import { clamp } from "@/lib/utils";
import { MOODS } from "@/lib/types";
import type { Checkin, Mood, SimStore, Venue, VenueCategory } from "@/lib/types";

const HANDLE_POOL = [
  "@falconDev",
  "@karakCoder",
  "@desertStack",
  "@yasHacker",
  "@oasisOps",
  "@neonMarina",
  "@datePalm",
  "@skylineSynth",
  "@speedwaySam"
];

const NOTES = [
  "Tour bus just landed",
  "Someone spilled karak",
  "F1 vibes",
  "Family day chaos",
  "VIP lane moving fast",
  "Sunset crowd incoming",
  "Rainy breeze calmed things",
  "School trip alert",
  "Street performers pulled a crowd",
  "Parking lot finally cleared"
];

const CATEGORY_PEAKS: Record<VenueCategory, number[]> = {
  government: [9, 13],
  tourism: [11, 17],
  food: [12, 20],
  retail: [14, 18]
};

const TICK_MS = 10000;

function gaussian(hour: number, peak: number, width: number) {
  return Math.exp(-Math.pow(hour - peak, 2) / (2 * width * width));
}

function makePattern(peaks: number[]) {
  return Array.from({ length: 24 }, (_, hour) => {
    const base = 0.55;
    const wave = peaks.reduce((sum, peak) => sum + gaussian(hour, peak, 3.5), 0);
    return clamp(base + wave * 0.6, 0.4, 1.45);
  });
}

function makeVenue(data: {
  id: string;
  name: string;
  category: VenueCategory;
  area: string;
  lat: number;
  lng: number;
  basePopularity: number;
}) {
  return {
    ...data,
    typicalPattern: makePattern(CATEGORY_PEAKS[data.category]),
    currentSignal: clamp(0.6 + Math.random() * 0.5, 0.4, 1.2),
    checkins: [] as Checkin[]
  } satisfies Venue;
}

function randomItem<T>(items: T[]) {
  return items[Math.floor(Math.random() * items.length)];
}

function randomId(prefix: string) {
  return `${prefix}-${Math.random().toString(36).slice(2, 9)}`;
}

export function generateInitialData(): Venue[] {
  return [
    makeVenue({
      id: "yas-marina-circuit",
      name: "Yas Marina Circuit",
      category: "tourism",
      area: "Yas Island",
      lat: 24.4672,
      lng: 54.6031,
      basePopularity: 0.92
    }),
    makeVenue({
      id: "ferrari-world",
      name: "Ferrari World",
      category: "tourism",
      area: "Yas Island",
      lat: 24.4842,
      lng: 54.6082,
      basePopularity: 0.95
    }),
    makeVenue({
      id: "yas-waterworld",
      name: "Yas Waterworld",
      category: "tourism",
      area: "Yas Island",
      lat: 24.4873,
      lng: 54.5964,
      basePopularity: 0.88
    }),
    makeVenue({
      id: "yas-mall",
      name: "Yas Mall",
      category: "retail",
      area: "Yas Island",
      lat: 24.4875,
      lng: 54.6045,
      basePopularity: 0.9
    }),
    makeVenue({
      id: "etihad-arena",
      name: "Etihad Arena",
      category: "tourism",
      area: "Yas Island",
      lat: 24.4698,
      lng: 54.6028,
      basePopularity: 0.8
    }),
    makeVenue({
      id: "yas-bay-food-hall",
      name: "Yas Bay Food Hall",
      category: "food",
      area: "Yas Bay",
      lat: 24.4628,
      lng: 54.6047,
      basePopularity: 0.78
    }),
    makeVenue({
      id: "abu-dhabi-corniche",
      name: "Abu Dhabi Corniche",
      category: "tourism",
      area: "Corniche",
      lat: 24.4745,
      lng: 54.3416,
      basePopularity: 0.72
    }),
    makeVenue({
      id: "abu-dhabi-municipality",
      name: "Abu Dhabi Municipality",
      category: "government",
      area: "Downtown",
      lat: 24.4757,
      lng: 54.3686,
      basePopularity: 0.68
    }),
    makeVenue({
      id: "galleria-mall",
      name: "The Galleria Al Maryah",
      category: "retail",
      area: "Al Maryah",
      lat: 24.4981,
      lng: 54.3921,
      basePopularity: 0.86
    }),
    makeVenue({
      id: "emirates-palace-cafe",
      name: "Emirates Palace Cafe",
      category: "food",
      area: "West Corniche",
      lat: 24.4612,
      lng: 54.3176,
      basePopularity: 0.73
    })
  ];
}

function seedCheckins(venues: Venue[]) {
  const now = Date.now();
  for (let i = 0; i < 24; i += 1) {
    const venue = randomItem(venues);
    const timestamp = now - Math.floor(Math.random() * 120) * 60 * 1000;
    venue.checkins.push({
      id: randomId("checkin"),
      venueId: venue.id,
      timestamp,
      queuePeopleEstimate: Math.floor(5 + Math.random() * 55),
      mood: randomItem(MOODS as Mood[]),
      note: randomItem(NOTES),
      user: randomItem(HANDLE_POOL),
      photoUrl: "/mock-photo.svg"
    });
  }
}

function ensureUniqueHandles(venues: Venue[]) {
  venues.forEach((venue, index) => {
    if (venue.checkins.length === 0) {
      venue.checkins.push({
        id: randomId("checkin"),
        venueId: venue.id,
        timestamp: Date.now() - index * 7 * 60 * 1000,
        queuePeopleEstimate: 10 + index * 3,
        mood: MOODS[0],
        note: randomItem(NOTES),
        user: HANDLE_POOL[index % HANDLE_POOL.length],
        photoUrl: "/mock-photo.svg"
      });
    }
  });
}

export function simulateTick(store: SimStore) {
  const now = Date.now();
  const hour = new Date(now).getHours();
  store.venues.forEach((venue) => {
    const target =
      (venue.typicalPattern[hour] ?? 1) * (0.7 + venue.basePopularity * 0.6);
    const surgeBoost = store.surges[venue.id] ? 0.45 : 0;
    const jitter = (Math.random() - 0.5) * 0.12;
    venue.currentSignal = clamp(
      venue.currentSignal + (target - venue.currentSignal) * 0.35 + jitter + surgeBoost,
      0.2,
      1.6
    );

    if (store.surges[venue.id]) {
      store.surges[venue.id] -= 1;
      if (store.surges[venue.id] <= 0) {
        delete store.surges[venue.id];
      }
    }

    venue.checkins = venue.checkins.filter(
      (checkin) => now - checkin.timestamp < 4 * 60 * 60 * 1000
    );
  });

  Object.keys(store.directedTraffic).forEach((key) => {
    store.directedTraffic[key] *= 0.86;
    if (store.directedTraffic[key] < 0.2) {
      delete store.directedTraffic[key];
    }
  });

  if (Math.random() < 0.3) {
    const randomVenue = randomItem(store.venues);
    store.directedTraffic[randomVenue.id] =
      (store.directedTraffic[randomVenue.id] ?? 0) + 3 + Math.random() * 4;
  }

  store.lastTick = now;
}

export function addCheckin(
  store: SimStore,
  venueId: string,
  payload: Omit<Checkin, "id" | "timestamp" | "venueId">
) {
  const venue = store.venues.find((v) => v.id === venueId);
  if (!venue) return null;
  const checkin: Checkin = {
    id: randomId("checkin"),
    venueId,
    timestamp: Date.now(),
    ...payload
  };
  venue.checkins.unshift(checkin);
  store.checkinsProcessed += 1;
  return checkin;
}

export function triggerSurge(store: SimStore, count = 1) {
  const impacted: string[] = [];
  for (let i = 0; i < count; i += 1) {
    const venue = randomItem(store.venues);
    store.surges[venue.id] = 3;
    impacted.push(venue.name);
  }
  return impacted;
}

export function getStore(): SimStore {
  const globalRef = globalThis as typeof globalThis & {
    __bridgePilotStore?: SimStore;
  };

  if (!globalRef.__bridgePilotStore) {
    const venues = generateInitialData();
    seedCheckins(venues);
    ensureUniqueHandles(venues);
    globalRef.__bridgePilotStore = {
      venues,
      directedTraffic: {},
      surges: {},
      checkinsProcessed: venues.reduce((sum, v) => sum + v.checkins.length, 0),
      lastTick: Date.now()
    };
  }

  const store = globalRef.__bridgePilotStore;
  if (!store.timer) {
    store.timer = setInterval(() => simulateTick(store), TICK_MS);
  }
  return store;
}

export function pickRandomHandle() {
  return randomItem(HANDLE_POOL);
}
