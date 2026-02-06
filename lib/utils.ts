import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

export function formatWait(minutes: number) {
  if (minutes <= 0) return "0 min";
  if (minutes < 60) return `${minutes} min`;
  const hours = Math.floor(minutes / 60);
  const rem = minutes % 60;
  return rem > 0 ? `${hours}h ${rem}m` : `${hours}h`;
}

export function fuzzyMatch(input: string, target: string) {
  const query = input.toLowerCase().trim();
  const text = target.toLowerCase();
  if (!query) return 1;
  let score = 0;
  let ti = 0;
  for (const ch of query) {
    const idx = text.indexOf(ch, ti);
    if (idx === -1) return 0;
    score += 1 + (idx === ti ? 1 : 0);
    ti = idx + 1;
  }
  return score / (text.length + query.length);
}

export function distanceKm(a: { lat: number; lng: number }, b: { lat: number; lng: number }) {
  const toRad = (v: number) => (v * Math.PI) / 180;
  const R = 6371;
  const dLat = toRad(b.lat - a.lat);
  const dLng = toRad(b.lng - a.lng);
  const lat1 = toRad(a.lat);
  const lat2 = toRad(b.lat);
  const s =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLng / 2) * Math.sin(dLng / 2);
  return 2 * R * Math.atan2(Math.sqrt(s), Math.sqrt(1 - s));
}

export function formatTimeLabel(offsetMinutes: number) {
  if (offsetMinutes === 0) return "Now";
  if (offsetMinutes < 60) return `In ${offsetMinutes}m`;
  const hours = offsetMinutes / 60;
  return `In ${hours}h`;
}
