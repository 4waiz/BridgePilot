"use client";

import {
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip as ChartTooltip,
  XAxis,
  YAxis
} from "recharts";

import type { ForecastPoint } from "@/lib/types";

export function ForecastChart({ forecast }: { forecast: ForecastPoint[] }) {
  const data = forecast.map((point) => ({
    time: point.minutesFromNow === 0 ? "Now" : `${point.minutesFromNow}m`,
    wait: point.wait
  }));

  return (
    <div className="h-40 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data} margin={{ left: 0, right: 12, top: 10, bottom: 0 }}>
          <XAxis dataKey="time" stroke="#9ca3af" fontSize={10} tickLine={false} />
          <YAxis
            stroke="#9ca3af"
            fontSize={10}
            tickLine={false}
            axisLine={false}
            width={24}
          />
          <ChartTooltip
            contentStyle={{
              background: "#141a31",
              border: "1px solid rgba(255,255,255,0.2)",
              borderRadius: "12px",
              color: "white",
              fontSize: "12px"
            }}
          />
          <Line
            type="monotone"
            dataKey="wait"
            stroke="#23f0c7"
            strokeWidth={3}
            dot={{ r: 3, fill: "#ffb703" }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
