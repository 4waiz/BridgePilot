import "./globals.css";

import type { Metadata } from "next";
import { Bungee, Space_Grotesk } from "next/font/google";

const display = Bungee({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-display"
});

const body = Space_Grotesk({
  weight: ["400", "500", "600", "700"],
  subsets: ["latin"],
  variable: "--font-body"
});

export const metadata: Metadata = {
  title: "BridgePilot - City Wait-Time Agent",
  description: "QueuePilot predicts wait times around Yas Island."
};

export default function RootLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${display.variable} ${body.variable}`}>
      <body className="bg-pilot-gradient text-white">{children}</body>
    </html>
  );
}
