import type { VenueCategory } from "@/lib/types";

type MissionResult = {
  category: VenueCategory;
  label: string;
  keywords: string[];
};

const KEYWORDS: Record<VenueCategory, string[]> = {
  government: [
    "renew",
    "docs",
    "document",
    "visa",
    "license",
    "municipality",
    "government",
    "id",
    "passport",
    "permit",
    "immigration"
  ],
  tourism: [
    "attraction",
    "theme",
    "park",
    "ferrari",
    "waterworld",
    "circuit",
    "arena",
    "tour",
    "sightseeing",
    "corniche"
  ],
  food: [
    "coffee",
    "karak",
    "dinner",
    "lunch",
    "restaurant",
    "cafe",
    "snack",
    "food",
    "eat"
  ],
  retail: [
    "shop",
    "mall",
    "retail",
    "buy",
    "shopping",
    "souvenir",
    "fashion",
    "store",
    "phone",
    "electronics",
    "device",
    "sim"
  ]
};

const LABELS: Record<VenueCategory, string> = {
  government: "Government Services",
  tourism: "Tourism + Attractions",
  food: "Food + Cafes",
  retail: "Shopping + Retail"
};

export function parseMission(input: string): MissionResult | null {
  const text = input.toLowerCase();
  if (!text.trim()) return null;

  const matches = (Object.keys(KEYWORDS) as VenueCategory[])
    .map((category) => {
      const keywords = KEYWORDS[category].filter((keyword) => text.includes(keyword));
      return { category, keywords, score: keywords.length };
    })
    .filter((entry) => entry.score > 0)
    .sort((a, b) => b.score - a.score);

  if (matches.length === 0) return null;

  const best = matches[0];
  return {
    category: best.category,
    label: LABELS[best.category],
    keywords: best.keywords
  };
}

export function missionBoostScore(
  missionCategory: VenueCategory | null | undefined,
  venueCategory: VenueCategory
) {
  if (!missionCategory) return 0;
  return missionCategory === venueCategory ? 0.6 : 0;
}
