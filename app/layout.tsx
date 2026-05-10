import type { Metadata } from "next";
import { Providers } from "@/components/providers";
import "./globals.css";

export const metadata: Metadata = {
  title: "Traveloop — Plan Your Perfect Multi-City Trip",
  description:
    "Plan, budget, and share your dream multi-city itineraries. All-in-one travel workspace with live budget tracking, weather updates, and beautiful timeline views.",
  keywords: ["travel planner", "trip planning", "itinerary", "budget tracker", "multi-city travel"],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="min-h-screen bg-background">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
